import { cloneDocument, findBlock, hasBlockId } from "./document";
import { editorError } from "./events";
import type { EditorBlock, EditorCommand, EditorDocument, EditorError } from "./types";

export interface CommandResult {
  document: EditorDocument;
  changed: boolean;
  errors: EditorError[];
}

export function applyCommand(document: EditorDocument, command: EditorCommand): CommandResult {
  if (!command || typeof command.type !== "string") return failed(document, editorError("command.invalid", "Command must be valid."));
  switch (command.type) {
    case "insert-block": return insertBlock(document, command.payload as Record<string, unknown>);
    case "delete-block": return deleteBlock(document, command.payload as Record<string, unknown>);
    case "update-block": return updateBlock(document, command.payload as Record<string, unknown>);
    case "move-block": return moveBlock(document, command.payload as Record<string, unknown>);
    case "split-block": return splitBlock(document, command.payload as Record<string, unknown>);
    case "merge-block": return mergeBlock(document, command.payload as Record<string, unknown>);
    case "set-document-meta": return setDocumentMeta(document, command.payload as Record<string, unknown>);
    default: return failed(document, editorError("command.unknown", `Unknown command '${command.type}'.`));
  }
}

export function insertBlock(document: EditorDocument, payload: Record<string, unknown>): CommandResult {
  const block = payload?.block as EditorBlock | undefined;
  if (!block?.id || !block.type) return failed(document, editorError("command.payload.invalid", "insert-block requires a block."));
  if (hasBlockId(document, block.id)) return failed(document, editorError("block.id.duplicate", `Block id '${block.id}' already exists.`, block.id));
  const next = cloneDocument(document);
  const index = typeof payload.index === "number" ? payload.index : next.blocks.length;
  next.blocks.splice(Math.max(0, Math.min(index, next.blocks.length)), 0, block);
  return changed(next);
}

export function deleteBlock(document: EditorDocument, payload: Record<string, unknown>): CommandResult {
  const blockId = String(payload?.blockId ?? "");
  const next = cloneDocument(document);
  const index = next.blocks.findIndex((block) => block.id === blockId);
  if (index < 0) return failed(document, editorError("block.notFound", `Block '${blockId}' was not found.`, blockId));
  next.blocks.splice(index, 1);
  return changed(next);
}

export function updateBlock(document: EditorDocument, payload: Record<string, unknown>): CommandResult {
  const blockId = String(payload?.blockId ?? "");
  const target = findBlock(document, blockId);
  if (!target) return failed(document, editorError("block.notFound", `Block '${blockId}' was not found.`, blockId));
  if (target.type === "unsupported") return failed(document, editorError("block.unsupported.readOnly", "Unsupported block data is read-only.", blockId));
  const next = cloneDocument(document);
  const block = findBlock(next, blockId);
  if (!block) return failed(document, editorError("block.notFound", `Block '${blockId}' was not found.`, blockId));
  block.data = { ...block.data, ...((payload.data as Record<string, unknown>) ?? {}) };
  if (payload.meta) block.meta = { ...block.meta, ...(payload.meta as Record<string, unknown>) };
  return changed(next);
}

export function moveBlock(document: EditorDocument, payload: Record<string, unknown>): CommandResult {
  const blockId = String(payload?.blockId ?? "");
  const next = cloneDocument(document);
  const index = next.blocks.findIndex((block) => block.id === blockId);
  const toIndex = Number(payload?.toIndex);
  if (index < 0 || Number.isNaN(toIndex)) return failed(document, editorError("command.payload.invalid", "move-block requires blockId and toIndex.", blockId));
  const [block] = next.blocks.splice(index, 1);
  next.blocks.splice(Math.max(0, Math.min(toIndex, next.blocks.length)), 0, block);
  return changed(next);
}

export function splitBlock(document: EditorDocument, payload: Record<string, unknown>): CommandResult {
  const blockId = String(payload?.blockId ?? "");
  const target = findBlock(document, blockId);
  if (!target) return failed(document, editorError("block.notFound", `Block '${blockId}' was not found.`, blockId));
  const newId = `${blockId}-split`;
  if (hasBlockId(document, newId)) return failed(document, editorError("block.id.duplicate", `Block id '${newId}' already exists.`, newId));
  const next = cloneDocument(document);
  const index = next.blocks.findIndex((block) => block.id === blockId);
  if (index < 0) return failed(document, editorError("block.notFound", `Block '${blockId}' was not found.`, blockId));
  next.blocks.splice(index + 1, 0, { ...next.blocks[index], id: newId, data: cloneData(next.blocks[index].data) });
  return changed(next);
}

export function mergeBlock(document: EditorDocument, payload: Record<string, unknown>): CommandResult {
  const sourceBlockId = String(payload?.sourceBlockId ?? "");
  const targetBlockId = String(payload?.targetBlockId ?? "");
  if (sourceBlockId === targetBlockId) return failed(document, editorError("block.merge.sameBlock", "Cannot merge a block into itself.", sourceBlockId));
  const source = findBlock(document, sourceBlockId);
  const target = findBlock(document, targetBlockId);
  if (!source || !target) return failed(document, editorError("block.notFound", "Merge source or target was not found."));
  const next = cloneDocument(document);
  const nextTarget = findBlock(next, targetBlockId);
  if (nextTarget) nextTarget.data = { ...nextTarget.data, ...source.data };
  const index = next.blocks.findIndex((block) => block.id === sourceBlockId);
  if (index >= 0) next.blocks.splice(index, 1);
  return changed(next);
}

export function setDocumentMeta(document: EditorDocument, payload: Record<string, unknown>): CommandResult {
  const next = cloneDocument(document);
  const meta = (payload.meta as Record<string, unknown>) ?? {};
  next.meta = payload.merge === false ? meta : { ...next.meta, ...meta };
  return changed(next);
}

function changed(document: EditorDocument): CommandResult {
  return { document, changed: true, errors: [] };
}

function failed(document: EditorDocument, error: EditorError): CommandResult {
  return { document, changed: false, errors: [error] };
}

function cloneData(data: Record<string, unknown>): Record<string, unknown> {
  return JSON.parse(JSON.stringify(data ?? {}));
}
