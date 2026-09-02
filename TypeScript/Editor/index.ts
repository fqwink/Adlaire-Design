import { applyCommand } from "./commands.ts";
import {
  BlockRegistry,
  createBlock,
  createDefaultBlockRegistry,
  createDefaultInlineTools,
  createDefaultToolRegistry,
  createEmptyDocument,
  handlePaste,
  normalizeBlock,
  ToolRegistry,
} from "./document.ts";
import { EventBus } from "./events.ts";
import { History } from "./history.ts";
import { getFirstBlockPosition, getLastBlockPosition, getNextBlockPosition, getPreviousBlockPosition } from "./selection.ts";
import { sanitizeDocument, validateBlock, validateDocument, validateDocumentAsync } from "./validation.ts";
import { createEditor, HeadlessEditorController } from "./core.ts";

export * from "./types.ts";
export * from "./document.ts";
export * from "./selection.ts";
export * from "./history.ts";
export * from "./events.ts";
export * from "./validation.ts";
export * from "./commands.ts";
export * from "./core.ts";

export const AdlaireEditor = {
  HeadlessEditorController,
  ToolRegistry,
  BlockRegistry,
  EventBus,
  History,
  applyCommand,
  createBlock,
  createDefaultBlockRegistry,
  createDefaultInlineTools,
  createDefaultToolRegistry,
  createEditor,
  createEmptyDocument,
  getFirstBlockPosition,
  getLastBlockPosition,
  getNextBlockPosition,
  getPreviousBlockPosition,
  handlePaste,
  normalizeBlock,
  sanitizeDocument,
  validateBlock,
  validateDocument,
  validateDocumentAsync,
};

type BrowserGlobal = typeof globalThis & {
  window?: { AdlaireEditor?: typeof AdlaireEditor };
};

const browserGlobal = globalThis as BrowserGlobal;

if (browserGlobal.window) {
  browserGlobal.window.AdlaireEditor = AdlaireEditor;
}
