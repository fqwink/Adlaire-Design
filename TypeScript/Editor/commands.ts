import {
  asRecord,
  cloneDocument,
  cloneJson,
  collectBlockIds,
  findBlock,
  findBlockLocation,
  normalizeBlock,
  type ToolRegistry,
} from "./document";
import { editorError } from "./events";
import type {
  DeleteBlockPayload,
  EditorBlock,
  EditorCommand,
  EditorDocument,
  EditorError,
  InsertBlockPayload,
  MergeBlockPayload,
  MoveBlockPayload,
  SetDocumentMetaPayload,
  SplitBlockPayload,
  UpdateBlockPayload,
} from "./types";

export interface CommandResult {
  document: EditorDocument;
  changed: boolean;
  errors: EditorError[];
}

export function applyCommand(document: EditorDocument, command: EditorCommand, registry?: ToolRegistry): CommandResult {
  if (!command || typeof command.type !== "string") return failed(document, editorError("command.invalid", "Command must be valid."));
  switch (command.type) {
    case "insert-block": return insertBlock(document, command.payload as InsertBlockPayload, registry);
    case "delete-block": return deleteBlock(document, command.payload as DeleteBlockPayload);
    case "update-block": return updateBlock(document, command.payload as UpdateBlockPayload, registry);
    case "move-block": return moveBlock(document, command.payload as MoveBlockPayload, registry);
    case "split-block": return splitBlock(document, command.payload as SplitBlockPayload, registry);
    case "merge-block": return mergeBlock(document, command.payload as MergeBlockPayload, registry);
    case "set-document-meta": return setDocumentMeta(document, command.payload as SetDocumentMetaPayload);
    default: return failed(document, editorError("command.unknown", `Unknown command '${command.type}'.`));
  }
}

export function insertBlock(document: EditorDocument, payload: InsertBlockPayload, registry?: ToolRegistry): CommandResult {
  if (!payload?.block?.id || !payload.block.type) return failed(document, editorError("command.payload.invalid", "insert-block requires a block."));
  const block = registry ? normalizeBlock(payload.block, registry) : cloneJson(payload.block);
  if (collectBlockIds(document.blocks).has(block.id)) return failed(document, editorError("block.id.duplicate", `Block id '${block.id}' already exists.`, block.id));
  if (payload.parentBlockId) {
    const parent = findBlock(document, payload.parentBlockId);
    if (!parent) return failed(document, editorError("block.parent.notFound", "Parent block was not found.", payload.parentBlockId));
    const parentTool = registry?.get(parent.type);
    if (parentTool && !parentTool.allowsChildren) return failed(document, editorError("block.children.notAllowed", `Block type '${parent.type}' does not allow nested blocks.`, parent.id));
    return changed({ ...document, blocks: updateBlockById(document.blocks, parent.id, (target) => ({ ...target, children: insertAt(target.children ?? [], block, payload.index) })) });
  }
  return changed({ ...document, blocks: insertAt(document.blocks, block, payload.index) });
}

export function deleteBlock(document: EditorDocument, payload: DeleteBlockPayload): CommandResult {
  if (typeof payload?.blockId !== "string") return failed(document, editorError("command.payload.invalid", "delete-block requires blockId."));
  const removed = removeBlockById(document.blocks, payload.blockId);
  if (!removed.block) return failed(document, editorError("block.notFound", `Block '${payload.blockId}' was not found.`, payload.blockId));
  return changed({ ...document, blocks: removed.blocks });
}

export function updateBlock(document: EditorDocument, payload: UpdateBlockPayload, registry?: ToolRegistry): CommandResult {
  if (typeof payload?.blockId !== "string") return failed(document, editorError("command.payload.invalid", "update-block requires blockId."));
  const target = findBlock(document, payload.blockId);
  if (!target) return failed(document, editorError("block.notFound", `Block '${payload.blockId}' was not found.`, payload.blockId));
  if (target.type === "unsupported" && payload.data !== undefined) return failed(document, editorError("block.unsupported.readOnly", "Unsupported block data is read-only.", payload.blockId));
  return changed({
    ...document,
    blocks: updateBlockById(document.blocks, payload.blockId, (block) => {
      const next = {
        ...block,
        data: payload.data === undefined ? block.data : asRecord(payload.data),
        ...(payload.meta === undefined ? {} : { meta: { ...block.meta, ...payload.meta } }),
      };
      return registry ? normalizeBlock(next, registry) : next;
    }),
  });
}

export function moveBlock(document: EditorDocument, payload: MoveBlockPayload, registry?: ToolRegistry): CommandResult {
  if (typeof payload?.blockId !== "string" || typeof payload.toIndex !== "number") return failed(document, editorError("command.payload.invalid", "move-block requires blockId and toIndex.", payload?.blockId));
  const source = findBlockLocation(document.blocks, payload.blockId);
  if (!source) return failed(document, editorError("block.notFound", `Block '${payload.blockId}' was not found.`, payload.blockId));
  if (payload.fromParentBlockId !== undefined && source.parent?.id !== payload.fromParentBlockId) return failed(document, editorError("block.parent.mismatch", "Source block parent does not match fromParentBlockId.", payload.blockId));
  const removed = removeBlockById(document.blocks, payload.blockId);
  if (!removed.block) return failed(document, editorError("block.notFound", `Block '${payload.blockId}' was not found.`, payload.blockId));
  if (payload.toParentBlockId) {
    const parent = findBlock({ ...document, blocks: removed.blocks }, payload.toParentBlockId);
    if (!parent) return failed(document, editorError("block.parent.notFound", "Target parent block was not found.", payload.toParentBlockId));
    const parentTool = registry?.get(parent.type);
    if (parentTool && !parentTool.allowsChildren) return failed(document, editorError("block.children.notAllowed", `Block type '${parent.type}' does not allow nested blocks.`, parent.id));
    return changed({ ...document, blocks: updateBlockById(removed.blocks, parent.id, (target) => ({ ...target, children: insertAt(target.children ?? [], removed.block as EditorBlock, payload.toIndex) })) });
  }
  return changed({ ...document, blocks: insertAt(removed.blocks, removed.block, payload.toIndex) });
}

export function splitBlock(document: EditorDocument, payload: SplitBlockPayload, registry?: ToolRegistry): CommandResult {
  if (typeof payload?.blockId !== "string") return failed(document, editorError("command.payload.invalid", "split-block requires blockId.", payload?.blockId));
  const location = findBlockLocation(document.blocks, payload.blockId);
  if (!location) return failed(document, editorError("block.notFound", `Block '${payload.blockId}' was not found.`, payload.blockId));
  if (location.block.type === "unsupported") return failed(document, editorError("block.unsupported.split", "Unsupported block cannot be split.", payload.blockId));
  const newId = `${location.block.id}-split`;
  if (collectBlockIds(document.blocks).has(newId)) return failed(document, editorError("block.id.duplicate", `Block id '${newId}' already exists.`, newId));
  const [left, right] = splitBlockData(location.block, payload);
  const nextSiblings = [
    ...location.siblings.slice(0, location.index),
    registry ? normalizeBlock(left, registry) : left,
    registry ? normalizeBlock(right, registry) : right,
    ...location.siblings.slice(location.index + 1),
  ];
  if (!location.parent) return changed({ ...document, blocks: nextSiblings });
  return changed({ ...document, blocks: updateBlockById(document.blocks, location.parent.id, (parent) => ({ ...parent, children: nextSiblings })) });
}

export function mergeBlock(document: EditorDocument, payload: MergeBlockPayload, registry?: ToolRegistry): CommandResult {
  if (typeof payload?.sourceBlockId !== "string" || typeof payload.targetBlockId !== "string") return failed(document, editorError("command.payload.invalid", "merge-block requires sourceBlockId and targetBlockId."));
  if (payload.sourceBlockId === payload.targetBlockId) return failed(document, editorError("block.merge.sameBlock", "Cannot merge a block into itself.", payload.sourceBlockId));
  const source = findBlock(document, payload.sourceBlockId);
  const target = findBlock(document, payload.targetBlockId);
  if (!source || !target) return failed(document, editorError("block.notFound", "Merge source or target was not found."));
  if (source.type === "unsupported" || target.type === "unsupported") return failed(document, editorError("block.unsupported.merge", "Unsupported block cannot be merged."));
  if (source.type !== target.type) return failed(document, editorError("block.merge.typeMismatch", "Only blocks of the same type can be merged."));
  const tool = registry?.get(target.type);
  const mergedData = tool?.merge ? asRecord(tool.merge(target.data, source.data)) : { ...target.data, ...source.data };
  const withoutSource = removeBlockById(document.blocks, source.id).blocks;
  return changed({ ...document, blocks: updateBlockById(withoutSource, target.id, (block) => registry ? normalizeBlock({ ...block, data: mergedData }, registry) : { ...block, data: mergedData }) });
}

export function setDocumentMeta(document: EditorDocument, payload: SetDocumentMetaPayload): CommandResult {
  if (!asRecord(payload).meta) return failed(document, editorError("command.payload.invalid", "set-document-meta requires meta."));
  const meta = asRecord(payload.meta);
  return changed({ ...document, meta: payload.merge === false ? cloneJson(meta) : { ...document.meta, ...meta } });
}

function splitBlockData(block: EditorBlock, payload: SplitBlockPayload): [EditorBlock, EditorBlock] {
  const position = payload.position;
  const data = asRecord(block.data);
  if (block.type === "code" && position?.path?.[0] === "code" && typeof data.code === "string") {
    const offset = clampOffset(position.offset, data.code.length);
    return [
      { ...block, data: { ...data, code: data.code.slice(0, offset) } },
      { ...block, id: `${block.id}-split`, data: { ...data, code: data.code.slice(offset) } },
    ];
  }
  return [{ ...block, data: cloneJson(block.data) }, { ...block, id: `${block.id}-split`, data: cloneJson(block.data) }];
}

function insertAt(blocks: EditorBlock[], block: EditorBlock, index = blocks.length): EditorBlock[] {
  const next = blocks.map((item) => cloneJson(item));
  next.splice(Math.max(0, Math.min(index, next.length)), 0, cloneJson(block));
  return next;
}

function removeBlockById(blocks: EditorBlock[], blockId: string): { blocks: EditorBlock[]; block: EditorBlock | null } {
  let removed: EditorBlock | null = null;
  const next = blocks.flatMap((block): EditorBlock[] => {
    if (block.id === blockId) {
      removed = cloneJson(block);
      return [];
    }
    if (!block.children) return [cloneJson(block)];
    const childResult = removeBlockById(block.children, blockId);
    if (childResult.block) removed = childResult.block;
    return [{ ...cloneJson(block), children: childResult.blocks }];
  });
  return { blocks: next, block: removed };
}

function updateBlockById(blocks: EditorBlock[], blockId: string, updater: (block: EditorBlock) => EditorBlock): EditorBlock[] {
  return blocks.map((block) => {
    if (block.id === blockId) return updater(cloneJson(block));
    if (block.children) return { ...cloneJson(block), children: updateBlockById(block.children, blockId, updater) };
    return cloneJson(block);
  });
}

function changed(document: EditorDocument): CommandResult {
  return { document: cloneDocument(document), changed: true, errors: [] };
}

function failed(document: EditorDocument, error: EditorError): CommandResult {
  return { document, changed: false, errors: [error] };
}

function clampOffset(value: unknown, length: number): number {
  return typeof value === "number" && Number.isInteger(value) ? Math.max(0, Math.min(value, length)) : length;
}
