import { asRecord, flattenBlocks, type ToolRegistry } from "./document";
import { editorError } from "./events";
import type { EditorBlock, EditorDocument, EditorValidationResult } from "./types";

export function sanitizeDocument(document: EditorDocument): EditorDocument {
  return {
    ...document,
    blocks: document.blocks.map(sanitizeBlock),
  };
}

export function sanitizeBlock(block: EditorBlock): EditorBlock {
  const data = JSON.parse(JSON.stringify(block.data ?? {}));
  sanitizeValue(data);
  return {
    ...block,
    data,
    ...(block.children ? { children: block.children.map(sanitizeBlock) } : {}),
  };
}

export function validateDocument(document: EditorDocument, registry?: ToolRegistry): EditorValidationResult {
  const errors = [];
  const warnings = [];
  if (!document || typeof document !== "object") {
    return { valid: false, errors: [editorError("document.invalid", "Document must be an object.")], warnings: [] };
  }
  if (!Array.isArray(document.blocks)) {
    return { valid: false, errors: [editorError("document.blocks.invalid", "Document blocks must be an array.")], warnings: [] };
  }
  const ids = new Set<string>();
  for (const block of flattenBlocks(document)) {
    if (ids.has(block.id)) errors.push(editorError("block.id.duplicate", `Duplicate block id '${block.id}'.`, block.id));
    ids.add(block.id);
    const result = validateBlock(block, registry);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }
  return { valid: errors.length === 0, errors, warnings };
}

export async function validateDocumentAsync(document: EditorDocument, registry?: ToolRegistry): Promise<EditorValidationResult> {
  const base = validateDocument(document, registry);
  const errors = [...base.errors];
  for (const block of Array.isArray(document?.blocks) ? flattenBlocks(document) : []) {
    const tool = registry?.get(block.type);
    if (tool?.validate && await tool.validate(block.data) === false) {
      errors.push(editorError("block.data.invalid", `Block '${block.id}' failed async validation.`, block.id));
    }
  }
  return { valid: errors.length === 0, errors, warnings: base.warnings };
}

export function validateBlock(block: EditorBlock, registry?: ToolRegistry): EditorValidationResult {
  const errors = [];
  const warnings = [];
  if (!block?.id) errors.push(editorError("block.id.required", "Block id is required."));
  if (!block?.type) errors.push(editorError("block.type.required", "Block type is required.", block?.id));
  if (block?.type === "unsupported") warnings.push(editorError("block.unsupported", "Unsupported block is preserved.", block.id));
  const tool = registry?.get(block.type);
  if (tool?.validate) {
    const valid = tool.validate(asRecord(block.data));
    if (typeof valid === "boolean" && !valid) errors.push(editorError("block.data.invalid", "Block data is invalid.", block.id));
  }
  return { valid: errors.length === 0, errors, warnings };
}

function sanitizeValue(value: unknown): void {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const item of value) sanitizeValue(item);
    return;
  }
  const record = value as Record<string, unknown>;
  if (Array.isArray(record.marks)) {
    const marks = record.marks.filter((mark) => {
      if (!mark || typeof mark !== "object") return false;
      const candidate = mark as Record<string, unknown>;
      return !(candidate.type === "link" && typeof candidate.href === "string" && !/^(https?:|mailto:|\/|#)/i.test(candidate.href));
    });
    if (marks.length > 0) {
      record.marks = marks;
    } else {
      delete record.marks;
    }
  }
  if (record.type === "link" && typeof record.href === "string" && !/^(https?:|mailto:|\/|#)/i.test(record.href)) {
    delete record.href;
  }
  for (const key of Object.keys(record)) sanitizeValue(record[key]);
}
