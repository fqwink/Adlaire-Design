import { asRecord, flattenBlocks, normalizeBlock, type ToolRegistry } from "./document";
import { editorError } from "./events";
import type { EditorBlock, EditorDocument, EditorSelection, EditorValidationResult } from "./types";

export function sanitizeDocument(document: EditorDocument, registry?: ToolRegistry): EditorDocument {
  return {
    ...document,
    blocks: document.blocks.map((block) => sanitizeBlock(block, registry)),
  };
}

export function sanitizeBlock(block: EditorBlock, registry?: ToolRegistry): EditorBlock {
  const normalized = registry ? normalizeBlock(block, registry) : block;
  const data = JSON.parse(JSON.stringify(normalized.data ?? {}));
  sanitizeValue(data);
  return {
    ...normalized,
    data,
    ...(normalized.children ? { children: normalized.children.map((child) => sanitizeBlock(child, registry)) } : {}),
  };
}

export function validateDocument(document: EditorDocument, registry?: ToolRegistry, selection?: EditorSelection | null): EditorValidationResult {
  const errors = [];
  const warnings = [];
  if (!document || typeof document !== "object") {
    return { valid: false, errors: [editorError("document.invalid", "Document must be an object.")], warnings: [] };
  }
  if (!Array.isArray(document.blocks)) {
    return { valid: false, errors: [editorError("document.blocks.invalid", "Document blocks must be an array.")], warnings: [] };
  }
  if (typeof document.id !== "string" || document.id.length === 0) errors.push(editorError("document.id.required", "Document id is required."));
  if (typeof document.schemaVersion !== "string" || document.schemaVersion.length === 0) errors.push(editorError("document.schemaVersion.required", "Document schemaVersion is required."));
  const ids = new Set<string>();
  for (const block of flattenBlocks(document)) {
    if (ids.has(block.id)) errors.push(editorError("block.id.duplicate", `Duplicate block id '${block.id}'.`, block.id));
    ids.add(block.id);
    const result = validateBlock(block, registry);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }
  if (selection) {
    if (!ids.has(selection.anchor.blockId)) errors.push(editorError("selection.anchor.invalid", "Selection anchor references a missing block.", selection.anchor.blockId));
    if (!ids.has(selection.focus.blockId)) errors.push(editorError("selection.focus.invalid", "Selection focus references a missing block.", selection.focus.blockId));
  }
  return { valid: errors.length === 0, errors, warnings };
}

export async function validateDocumentAsync(document: EditorDocument, registry?: ToolRegistry, selection?: EditorSelection | null): Promise<EditorValidationResult> {
  const base = validateDocument(document, registry, selection);
  const errors = [...base.errors];
  const warnings = [...base.warnings];
  for (const block of Array.isArray(document?.blocks) ? flattenBlocks(document) : []) {
    const tool = registry?.get(block.type);
    if (tool?.validate && await tool.validate(block.data) === false) {
      errors.push(editorError("block.data.invalid", `Block '${block.id}' failed async validation.`, block.id));
    }
  }
  return { valid: errors.length === 0, errors, warnings };
}

export function validateBlock(block: EditorBlock, registry?: ToolRegistry): EditorValidationResult {
  const errors = [];
  const warnings = [];
  if (!block || typeof block !== "object") {
    return { valid: false, errors: [editorError("block.invalid", "Block must be an object.")], warnings: [] };
  }
  if (!block.id) errors.push(editorError("block.id.required", "Block id is required."));
  if (!block.type) errors.push(editorError("block.type.required", "Block type is required.", block.id));
  if (block.type === "unsupported") warnings.push(editorError("block.unsupported", "Unsupported block is preserved.", block.id));
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
      return !(candidate.type === "link" && typeof candidate.href === "string" && !isSafeHref(candidate.href));
    });
    if (marks.length > 0) {
      record.marks = marks;
    } else {
      delete record.marks;
    }
  }
  if (record.type === "link" && typeof record.href === "string" && !isSafeHref(record.href)) {
    delete record.href;
  }
  for (const key of Object.keys(record)) sanitizeValue(record[key]);
}

function isSafeHref(href: string): boolean {
  return /^(https?:|mailto:|tel:|\/|#)/i.test(href);
}
