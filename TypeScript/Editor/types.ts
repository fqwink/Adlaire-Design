export type InlineMark =
  | { type: "bold" }
  | { type: "italic" }
  | { type: "code" }
  | { type: "strike" }
  | { type: "link"; href: string; title?: string };

export type InlineContent =
  | { type: "text"; text: string; marks?: InlineMark[] }
  | { type: "hard-break" };

export interface EditorBlockMeta {
  locked?: boolean;
  validationState?: "valid" | "invalid" | "warning";
  sourceRange?: { start: number; end: number };
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

export interface EditorTool<TData = unknown> {
  type: string;
  kind: "block" | "inline";
  create?: () => TData;
  normalize?: (data: TData) => TData;
  validate?: (data: TData) => boolean | Promise<boolean>;
  merge?: (left: TData, right: TData) => TData;
  onPaste?: (event: PasteEvent) => TData | Promise<TData>;
  allowsChildren?: boolean;
}

export interface PasteEvent {
  type: "html" | "text" | "file" | "url";
  data: unknown;
}

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

export interface EditorConfig {
  document?: EditorDocument;
  tools?: EditorTool[];
  defaultBlock?: string;
  readOnly?: boolean;
  historyLimit?: number;
}
