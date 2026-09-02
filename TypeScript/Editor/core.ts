import { applyCommand } from "./commands";
import { createDefaultToolRegistry, createEmptyDocument, cloneDocument, normalizeDocument, ToolRegistry } from "./document";
import { EventBus, editorError } from "./events";
import { History } from "./history";
import { normalizeSelection, sameSelection } from "./selection";
import { sanitizeDocument, validateDocument } from "./validation";
import type {
  EditorCommand,
  EditorConfig,
  EditorDocument,
  EditorEventListener,
  EditorSelection,
  PublishContext,
  PublishRequest,
  SaveContext,
  SaveRequest,
  SaveState,
  Unsubscribe,
} from "./types";

const mutableCommands = new Set(["insert-block", "delete-block", "move-block", "update-block", "split-block", "merge-block", "set-document-meta"]);

export class HeadlessEditorController {
  #registry: ToolRegistry;
  #events = new EventBus();
  #history: History;
  #document: EditorDocument;
  #selection: EditorSelection | null = null;
  #readOnly: boolean;
  #saveState: SaveState = { dirty: false, saving: false };

  constructor(config: EditorConfig = {}) {
    this.#registry = createDefaultToolRegistry(config.tools ?? []);
    this.#history = new History(config.historyLimit);
    this.#readOnly = Boolean(config.readOnly);
    this.#document = normalizeDocument(config.document ?? createEmptyDocument(), this.#registry);
  }

  getDocument(): EditorDocument {
    return cloneDocument(this.#document);
  }

  setDocument(document: EditorDocument): void {
    this.#document = normalizeDocument(document, this.#registry);
    this.#selection = normalizeSelection(this.#document, this.#selection);
    this.#saveState = { dirty: false, saving: false };
    this.#events.emit({ type: "document:changed", document: this.getDocument() });
  }

  dispatch(command: EditorCommand) {
    if (!command || typeof command.type !== "string") return this.#error("command.invalid", "Command must be an object with a string type.");
    if (!this.canDispatch(command)) return this.#error("command.readOnly", `Command '${command.type}' is not allowed in read-only mode.`);
    if (command.type === "set-selection") return this.#setSelection((command.payload as { selection?: EditorSelection | null })?.selection ?? null);
    if (command.type === "save") return this.#requestSave((command.payload as { context?: SaveContext })?.context);
    if (command.type === "request-publish") return this.#requestPublish((command.payload as { context?: PublishContext })?.context);
    const before = { document: this.getDocument(), selection: this.getSelection() };
    const result = applyCommand(this.#document, command);
    if (!result.changed || result.errors.length > 0) return { document: this.getDocument(), selection: this.getSelection(), changed: false, errors: result.errors };
    this.#document = sanitizeDocument(normalizeDocument(result.document, this.#registry));
    this.#selection = normalizeSelection(this.#document, this.#selection);
    this.#saveState = { ...this.#saveState, dirty: true };
    this.#history.push({ before, after: { document: this.getDocument(), selection: this.getSelection() }, commands: [command] });
    this.#events.emit({ type: "document:changed", document: this.getDocument() });
    this.#events.emit({ type: "selection:changed", selection: this.getSelection() });
    this.#events.emit({ type: "history:changed", canUndo: this.#history.canUndo, canRedo: this.#history.canRedo });
    return { document: this.getDocument(), selection: this.getSelection(), changed: true };
  }

  dispatchBatch(commands: EditorCommand[]) {
    if (!Array.isArray(commands)) return this.#error("command.batch.invalid", "Batch payload must be an array.");
    const before = { document: this.getDocument(), selection: this.getSelection() };
    let changed = false;
    for (const command of commands) {
      const result = this.dispatch(command);
      if (result.errors?.length) {
        this.#document = before.document;
        this.#selection = before.selection;
        return { document: this.getDocument(), selection: this.getSelection(), changed: false, errors: result.errors };
      }
      changed = changed || result.changed;
    }
    if (changed) this.#history.push({ before, after: { document: this.getDocument(), selection: this.getSelection() }, commands });
    return { document: this.getDocument(), selection: this.getSelection(), changed };
  }

  canDispatch(command: EditorCommand): boolean {
    return !(this.#readOnly && mutableCommands.has(command?.type));
  }

  getSelection(): EditorSelection | null {
    return this.#selection ? JSON.parse(JSON.stringify(this.#selection)) : null;
  }

  setSelection(selection: EditorSelection | null): void {
    this.#setSelection(selection);
  }

  undo() {
    const snapshot = this.#history.undo({ document: this.getDocument(), selection: this.getSelection() });
    if (!snapshot) return { document: this.getDocument(), selection: this.getSelection(), changed: false };
    this.#document = snapshot.before.document;
    this.#selection = snapshot.before.selection;
    this.#events.emit({ type: "document:changed", document: this.getDocument() });
    return { document: this.getDocument(), selection: this.getSelection(), changed: true };
  }

  redo() {
    const snapshot = this.#history.redo({ document: this.getDocument(), selection: this.getSelection() });
    if (!snapshot) return { document: this.getDocument(), selection: this.getSelection(), changed: false };
    this.#document = snapshot.after.document;
    this.#selection = snapshot.after.selection;
    this.#events.emit({ type: "document:changed", document: this.getDocument() });
    return { document: this.getDocument(), selection: this.getSelection(), changed: true };
  }

  save(context: SaveContext = { reason: "manual" }): SaveRequest {
    const request = { document: this.getDocument(), context, state: { ...this.#saveState, lastRequestedAt: new Date().toISOString() } };
    this.#events.emit({ type: "save:requested", request });
    return request;
  }

  requestPublish(context: PublishContext = { reason: "manual" }): PublishRequest {
    const request = { document: this.getDocument(), context, validation: validateDocument(this.#document, this.#registry) };
    this.#events.emit({ type: "publish:requested", request });
    return request;
  }

  subscribe(listener: EditorEventListener): Unsubscribe {
    return this.#events.subscribe(listener);
  }

  destroy(): void {
    this.#events.clear();
  }

  #setSelection(selection: EditorSelection | null) {
    const normalized = normalizeSelection(this.#document, selection);
    if (selection !== null && normalized === null) return this.#error("selection.invalid", "Selection must reference valid document positions.");
    if (sameSelection(this.#selection, normalized)) return { document: this.getDocument(), selection: this.getSelection(), changed: false };
    this.#selection = normalized;
    this.#events.emit({ type: "selection:changed", selection: this.getSelection() });
    return { document: this.getDocument(), selection: this.getSelection(), changed: true };
  }

  #requestSave(context?: SaveContext) {
    this.save(context);
    return { document: this.getDocument(), selection: this.getSelection(), changed: false };
  }

  #requestPublish(context?: PublishContext) {
    this.requestPublish(context);
    return { document: this.getDocument(), selection: this.getSelection(), changed: false };
  }

  #error(code: string, message: string) {
    const error = editorError(code, message);
    this.#events.emit({ type: "error", error });
    return { document: this.getDocument(), selection: this.getSelection(), changed: false, errors: [error] };
  }
}

export function createEditor(config: EditorConfig = {}): HeadlessEditorController {
  return new HeadlessEditorController(config);
}
