import { applyCommand } from "./commands.ts";
import { cloneDocument, createDefaultBlockRegistry, createEmptyDocument, normalizeDocument, ToolRegistry } from "./document.ts";
import { EventBus, editorError } from "./events.ts";
import { History } from "./history.ts";
import { normalizeSelection, sameSelection } from "./selection.ts";
import { sanitizeDocument, validateDocument } from "./validation.ts";
import type {
  EditorCommand,
  EditorCommandResult,
  EditorConfig,
  EditorController,
  EditorDocument,
  EditorError,
  EditorEventListener,
  EditorSelection,
  PublishContext,
  PublishRequest,
  SaveContext,
  SaveRequest,
  SaveState,
  SetSelectionPayload,
  Unsubscribe,
} from "./types.ts";

const mutableCommands = new Set(["insert-block", "delete-block", "move-block", "update-block", "split-block", "merge-block", "set-document-meta"]);
const knownCommands = new Set([...mutableCommands, "set-selection", "save", "request-publish"]);

export class HeadlessEditorController implements EditorController {
  #registry: ToolRegistry;
  #events = new EventBus();
  #history: History;
  #document: EditorDocument;
  #selection: EditorSelection | null = null;
  #readOnly: boolean;
  #saveState: SaveState = { dirty: false, saving: false };

  constructor(config: EditorConfig = {}) {
    const defaultBlock = config.defaultBlock ?? "paragraph";
    this.#registry = createDefaultBlockRegistry(config.tools ?? []);
    if (!this.#registry.has(defaultBlock)) {
      throw new Error(`Default block '${defaultBlock}' is not registered.`);
    }
    this.#history = new History(config.historyLimit);
    this.#readOnly = Boolean(config.readOnly);
    this.#document = normalizeDocument(config.document ?? createEmptyDocument(), this.#registry);
    this.#emitValidation();
  }

  getDocument(): EditorDocument {
    return cloneDocument(this.#document);
  }

  setDocument(document: EditorDocument): void {
    this.#document = sanitizeDocument(normalizeDocument(document, this.#registry), this.#registry);
    this.#selection = normalizeSelection(this.#document, this.#selection);
    this.#saveState = { dirty: false, saving: false };
    this.#events.emit({ type: "document:changed", document: this.getDocument() });
    this.#events.emit({ type: "selection:changed", selection: this.getSelection() });
    this.#emitValidation();
  }

  dispatch(command: EditorCommand): EditorCommandResult {
    if (!isEditorCommand(command)) return this.#error("command.invalid", "Command must be an object with a string type.");
    if (!knownCommands.has(command.type)) return this.#error("command.unknown", `Command '${command.type}' is not registered.`);
    if (!this.canDispatch(command)) return this.#error("command.readOnly", `Command '${command.type}' is not allowed in read-only mode.`);
    if (command.type === "set-selection") return this.#setSelection((command.payload as SetSelectionPayload)?.selection ?? null, true);
    if (command.type === "save") return this.#requestSave((command.payload as { context?: SaveContext })?.context);
    if (command.type === "request-publish") return this.#requestPublish((command.payload as { context?: PublishContext })?.context);
    return this.#applyDocumentCommand(command, true);
  }

  dispatchBatch(commands: EditorCommand[]): EditorCommandResult {
    if (!Array.isArray(commands)) return this.#error("command.batch.invalid", "Batch payload must be an array of commands.");
    if (commands.length === 0) return { document: this.getDocument(), selection: this.getSelection(), changed: false };
    for (const command of commands) {
      if (!isEditorCommand(command)) return this.#error("command.invalid", "Command must be an object with a string type.");
      if (!knownCommands.has(command.type)) return this.#error("command.unknown", `Command '${command.type}' is not registered.`);
      if (command.type === "save" || command.type === "request-publish") return this.#error("command.batch.unsupported", "Save and publish commands cannot be batched.");
      if (!this.canDispatch(command)) return this.#error("command.readOnly", `Command '${command.type}' is not allowed in read-only mode.`);
    }

    const before = { document: this.getDocument(), selection: this.getSelection() };
    let nextDocument = this.#document;
    let nextSelection = this.#selection;
    let hasDocumentChange = false;
    let hasSelectionChange = false;
    const errors: EditorError[] = [];

    for (const command of commands) {
      if (command.type === "set-selection") {
        const normalized = normalizeSelection(nextDocument, (command.payload as SetSelectionPayload)?.selection ?? null);
        if ((command.payload as SetSelectionPayload)?.selection !== null && normalized === null) {
          errors.push(editorError("selection.invalid", "Selection must reference valid document positions."));
          break;
        }
        hasSelectionChange = hasSelectionChange || !sameSelection(nextSelection, normalized);
        nextSelection = normalized;
        continue;
      }
      const result = applyCommand(nextDocument, command, this.#registry);
      if (result.errors.length > 0) {
        errors.push(...result.errors);
        break;
      }
      if (result.changed) hasDocumentChange = true;
      nextDocument = sanitizeDocument(normalizeDocument(result.document, this.#registry), this.#registry);
      nextSelection = normalizeSelection(nextDocument, nextSelection);
    }

    if (errors.length > 0) {
      for (const error of errors) this.#emitError(error);
      return { document: this.getDocument(), selection: this.getSelection(), changed: false, errors };
    }
    if (!hasDocumentChange && !hasSelectionChange) return { document: this.getDocument(), selection: this.getSelection(), changed: false };

    this.#document = nextDocument;
    this.#selection = nextSelection;
    if (hasDocumentChange) this.#saveState = { ...this.#saveState, dirty: true };
    this.#history.push({ before, after: { document: this.getDocument(), selection: this.getSelection() }, commands });
    this.#emitChanged(hasDocumentChange);
    return { document: this.getDocument(), selection: this.getSelection(), changed: true };
  }

  canDispatch(command: EditorCommand): boolean {
    return isEditorCommand(command) && knownCommands.has(command.type) && !(this.#readOnly && mutableCommands.has(command.type));
  }

  getSelection(): EditorSelection | null {
    return this.#selection ? JSON.parse(JSON.stringify(this.#selection)) : null;
  }

  setSelection(selection: EditorSelection | null): void {
    this.#setSelection(selection, false);
  }

  undo(): EditorCommandResult {
    const snapshot = this.#history.undo({ document: this.getDocument(), selection: this.getSelection() });
    if (!snapshot) return { document: this.getDocument(), selection: this.getSelection(), changed: false };
    this.#document = snapshot.before.document;
    this.#selection = snapshot.before.selection;
    this.#saveState = { ...this.#saveState, dirty: true };
    this.#emitChanged(true);
    return { document: this.getDocument(), selection: this.getSelection(), changed: true };
  }

  redo(): EditorCommandResult {
    const snapshot = this.#history.redo({ document: this.getDocument(), selection: this.getSelection() });
    if (!snapshot) return { document: this.getDocument(), selection: this.getSelection(), changed: false };
    this.#document = snapshot.after.document;
    this.#selection = snapshot.after.selection;
    this.#saveState = { ...this.#saveState, dirty: true };
    this.#emitChanged(true);
    return { document: this.getDocument(), selection: this.getSelection(), changed: true };
  }

  save(context: SaveContext = { reason: "manual" }): SaveRequest {
    const document = sanitizeDocument(this.#document, this.#registry);
    const request = {
      document,
      context,
      state: { ...this.#saveState, saving: true, lastRequestedAt: new Date().toISOString() },
    };
    this.#saveState = request.state;
    this.#events.emit({ type: "save:requested", request });
    return request;
  }

  requestPublish(context: PublishContext = { reason: "manual" }): PublishRequest {
    const document = sanitizeDocument(this.#document, this.#registry);
    const request = { document, context, validation: validateDocument(document, this.#registry) };
    this.#events.emit({ type: "publish:requested", request });
    return request;
  }

  subscribe(listener: EditorEventListener): Unsubscribe {
    return this.#events.subscribe(listener);
  }

  destroy(): void {
    this.#events.clear();
  }

  #applyDocumentCommand(command: EditorCommand, pushHistory: boolean): EditorCommandResult {
    const before = { document: this.getDocument(), selection: this.getSelection() };
    const result = applyCommand(this.#document, command, this.#registry);
    if (!result.changed || result.errors.length > 0) {
      for (const error of result.errors) this.#emitError(error);
      return { document: this.getDocument(), selection: this.getSelection(), changed: false, errors: result.errors };
    }
    this.#document = sanitizeDocument(normalizeDocument(result.document, this.#registry), this.#registry);
    this.#selection = normalizeSelection(this.#document, this.#selection);
    this.#saveState = { ...this.#saveState, dirty: true };
    if (pushHistory) this.#history.push({ before, after: { document: this.getDocument(), selection: this.getSelection() }, commands: [command] });
    this.#emitChanged(true);
    return { document: this.getDocument(), selection: this.getSelection(), changed: true };
  }

  #setSelection(selection: EditorSelection | null, pushHistory: boolean): EditorCommandResult {
    const normalized = normalizeSelection(this.#document, selection);
    if (selection !== null && normalized === null) return this.#error("selection.invalid", "Selection must reference valid document positions.");
    if (sameSelection(this.#selection, normalized)) return { document: this.getDocument(), selection: this.getSelection(), changed: false };
    const before = { document: this.getDocument(), selection: this.getSelection() };
    this.#selection = normalized;
    if (pushHistory) this.#history.push({ before, after: { document: this.getDocument(), selection: this.getSelection() }, commands: [{ type: "set-selection", payload: { selection } }] });
    this.#emitChanged(false);
    return { document: this.getDocument(), selection: this.getSelection(), changed: true };
  }

  #requestSave(context?: SaveContext): EditorCommandResult {
    return { document: this.getDocument(), selection: this.getSelection(), changed: false, request: this.save(context) };
  }

  #requestPublish(context?: PublishContext): EditorCommandResult {
    return { document: this.getDocument(), selection: this.getSelection(), changed: false, request: this.requestPublish(context) };
  }

  #emitChanged(documentChanged: boolean): void {
    if (documentChanged) this.#events.emit({ type: "document:changed", document: this.getDocument() });
    this.#events.emit({ type: "selection:changed", selection: this.getSelection() });
    this.#events.emit({ type: "history:changed", canUndo: this.#history.canUndo, canRedo: this.#history.canRedo });
    this.#emitValidation();
  }

  #emitValidation(): void {
    const validation = validateDocument(this.#document, this.#registry);
    this.#events.emit({ type: "validation:changed", validation });
    for (const error of validation.errors) this.#emitError(error);
  }

  #emitError(error: EditorError): void {
    this.#events.emit({ type: "error", error });
  }

  #error(code: string, message: string): EditorCommandResult {
    const failure = editorError(code, message);
    this.#emitError(failure);
    return { document: this.getDocument(), selection: this.getSelection(), changed: false, errors: [failure] };
  }
}

export function createEditor(config: EditorConfig = {}): EditorController {
  return new HeadlessEditorController(config);
}

function isEditorCommand(value: unknown): value is EditorCommand {
  return typeof value === "object" && value !== null && !Array.isArray(value) && typeof (value as EditorCommand).type === "string" && "payload" in value;
}
