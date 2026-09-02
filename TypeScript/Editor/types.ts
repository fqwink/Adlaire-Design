export type InlineMark =
  | { type: "bold" }
  | { type: "italic" }
  | { type: "code" }
  | { type: "strike" }
  | { type: "link"; href: string; title?: string };

export type InlineContent =
  | { type: "text"; text: string; marks?: InlineMark[] }
  | { type: "hard-break" };

export interface SourceRange {
  start: number;
  end: number;
}

export interface EditorBlockMeta {
  locked?: boolean;
  validationState?: "valid" | "invalid" | "warning";
  sourceRange?: SourceRange;
  createdAt?: string;
  updatedAt?: string;
}

export interface EditorBlock {
  id: string;
  type: string;
  data: Record<string, unknown>;
  children?: EditorBlock[];
  meta?: EditorBlockMeta;
}

export interface EditorDocument {
  id: string;
  schemaVersion: string;
  blocks: EditorBlock[];
  meta?: Record<string, unknown>;
}

export interface ParagraphData {
  text: InlineContent[];
}

export interface HeadingData {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: InlineContent[];
}

export interface ListData {
  style: "unordered" | "ordered" | "checklist";
  items: Array<{ content: InlineContent[]; checked?: boolean }>;
}

export interface CodeData {
  code: string;
  language?: string;
}

export interface UnsupportedData {
  originalType: string;
  originalData: Record<string, unknown>;
}

export interface EditorPosition {
  blockId: string;
  path?: Array<string | number>;
  offset?: number;
}

export interface EditorSelection {
  anchor: EditorPosition;
  focus: EditorPosition;
  mode: "caret" | "range" | "block";
}

export interface EditorError {
  code: string;
  message: string;
  blockId?: string;
  path?: Array<string | number>;
}

export interface EditorValidationResult {
  valid: boolean;
  errors: EditorError[];
  warnings: EditorError[];
}

export interface SaveContext {
  reason: "manual" | "autosave" | "before-publish";
  baseVersion?: string;
}

export interface PublishContext {
  reason: "manual" | "after-save";
}

export interface SaveState {
  dirty: boolean;
  saving: boolean;
  lastRequestedAt?: string;
  error?: string;
}

export interface SaveRequest {
  document: EditorDocument;
  context: SaveContext;
  state: SaveState;
}

export interface PublishRequest {
  document: EditorDocument;
  context: PublishContext;
  validation: EditorValidationResult;
}

export interface EditorCommand<TPayload = unknown> {
  type: string;
  payload: TPayload;
}

export interface EditorCommandResult {
  document: EditorDocument;
  selection?: EditorSelection | null;
  changed: boolean;
  errors?: EditorError[];
  request?: SaveRequest | PublishRequest;
}

export interface ToolContext {
  api: EditorApi;
  readOnly: boolean;
  config?: Record<string, unknown>;
}

export interface EditorApi {
  getDocument(): EditorDocument;
  getSelection(): EditorSelection | null;
  dispatch(command: EditorCommand): EditorCommandResult;
}

export interface PasteEvent {
  type: "html" | "text" | "file" | "url";
  data: unknown;
}

export type SanitizerRules = Record<string, unknown>;

export interface ToolMetadata {
  type: string;
  kind: "block" | "inline";
  title?: string;
  category?: string;
  shortcut?: string;
}

export interface EditorTool<TData = unknown> {
  type: string;
  kind: "block" | "inline";
  create?: (context?: ToolContext) => TData;
  normalize?: (data: TData) => TData;
  validate?: (data: TData) => boolean | Promise<boolean>;
  sanitize?: SanitizerRules;
  merge?: (left: TData, right: TData) => TData;
  convert?: (data: TData, targetType: string) => Record<string, unknown>;
  onPaste?: (event: PasteEvent) => TData | Promise<TData>;
  allowsChildren?: boolean;
}

export type InsertBlockPayload = {
  block: EditorBlock;
  index?: number;
  parentBlockId?: string;
  select?: boolean;
};

export type DeleteBlockPayload = {
  blockId: string;
};

export type MoveBlockPayload = {
  blockId: string;
  toIndex: number;
  fromParentBlockId?: string;
  toParentBlockId?: string;
};

export type UpdateBlockPayload = {
  blockId: string;
  data?: Record<string, unknown>;
  meta?: EditorBlockMeta;
};

export type SplitBlockPayload = {
  blockId: string;
  position?: EditorPosition;
};

export type MergeBlockPayload = {
  sourceBlockId: string;
  targetBlockId: string;
};

export type SetSelectionPayload = {
  selection: EditorSelection | null;
};

export type SetDocumentMetaPayload = {
  meta: Record<string, unknown>;
  merge?: boolean;
};

export type EditorEvent =
  | { type: "document:changed"; document: EditorDocument }
  | { type: "selection:changed"; selection: EditorSelection | null }
  | { type: "history:changed"; canUndo: boolean; canRedo: boolean }
  | { type: "validation:changed"; validation: EditorValidationResult }
  | { type: "save:requested"; request: SaveRequest }
  | { type: "publish:requested"; request: PublishRequest }
  | { type: "error"; error: EditorError };

export type EditorEventListener = (event: EditorEvent) => void;
export type Unsubscribe = () => void;

export interface EditorController {
  getDocument(): EditorDocument;
  setDocument(document: EditorDocument): void;
  dispatch(command: EditorCommand): EditorCommandResult;
  dispatchBatch(commands: EditorCommand[]): EditorCommandResult;
  canDispatch(command: EditorCommand): boolean;
  getSelection(): EditorSelection | null;
  setSelection(selection: EditorSelection | null): void;
  undo(): EditorCommandResult;
  redo(): EditorCommandResult;
  save(context?: SaveContext): SaveRequest;
  requestPublish(context?: PublishContext): PublishRequest;
  subscribe(listener: EditorEventListener): Unsubscribe;
  destroy(): void;
}

export interface EditorConfig {
  document?: EditorDocument;
  tools?: EditorTool[];
  defaultBlock?: string;
  readOnly?: boolean;
  historyLimit?: number;
  sanitizer?: SanitizerRules;
}
