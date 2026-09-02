import { findBlock, flattenBlocks } from "./document";
import type { EditorDocument, EditorPosition, EditorSelection } from "./types";

export function isValidPosition(document: EditorDocument, position: EditorPosition): boolean {
  if (!position || !findBlock(document, position.blockId)) return false;
  if (!position.path || position.path.length === 0) return true;
  let value: unknown = findBlock(document, position.blockId)?.data;
  for (const part of position.path) {
    if (value === null || value === undefined) return false;
    value = (value as Record<string | number, unknown>)[part];
  }
  return typeof position.offset !== "number" || typeof value === "string";
}

export function isValidSelection(document: EditorDocument, selection: EditorSelection | null): boolean {
  return selection === null || (isValidPosition(document, selection.anchor) && isValidPosition(document, selection.focus));
}

export function normalizeSelection(document: EditorDocument, selection: EditorSelection | null): EditorSelection | null {
  if (!selection || !isValidSelection(document, selection)) return null;
  return {
    mode: selection.mode,
    anchor: normalizePosition(selection.anchor),
    focus: normalizePosition(selection.focus),
  };
}

export function getFirstBlockPosition(document: EditorDocument): EditorPosition | null {
  const block = flattenBlocks(document)[0];
  return block ? { blockId: block.id } : null;
}

export function getLastBlockPosition(document: EditorDocument): EditorPosition | null {
  const blocks = flattenBlocks(document);
  const block = blocks[blocks.length - 1];
  return block ? { blockId: block.id } : null;
}

export function getNextBlockPosition(document: EditorDocument, blockId: string): EditorPosition | null {
  const blocks = flattenBlocks(document);
  const index = blocks.findIndex((block) => block.id === blockId);
  return index >= 0 && blocks[index + 1] ? { blockId: blocks[index + 1].id } : null;
}

export function getPreviousBlockPosition(document: EditorDocument, blockId: string): EditorPosition | null {
  const blocks = flattenBlocks(document);
  const index = blocks.findIndex((block) => block.id === blockId);
  return index > 0 ? { blockId: blocks[index - 1].id } : null;
}

export function sameSelection(left: EditorSelection | null, right: EditorSelection | null): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function normalizePosition(position: EditorPosition): EditorPosition {
  return {
    blockId: position.blockId,
    ...(position.path ? { path: [...position.path] } : {}),
    ...(typeof position.offset === "number" ? { offset: position.offset } : {}),
  };
}
