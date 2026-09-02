import type {
  CodeData,
  EditorBlock,
  EditorDocument,
  EditorTool,
  HeadingData,
  InlineContent,
  InlineMark,
  ListData,
  ParagraphData,
  PasteEvent,
  UnsupportedData,
} from "./types";

export function createEmptyDocument(id = "document", schemaVersion = "1.0.0"): EditorDocument {
  return { id, schemaVersion, blocks: [] };
}

export function cloneDocument(document: EditorDocument): EditorDocument {
  return cloneJson(document);
}

export function cloneJson<T>(value: T): T {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
}

export function createBlock(type: string, data: Record<string, unknown> = {}, id = createId(type)): EditorBlock {
  return { id, type, data };
}

export function createId(prefix = "block"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export class ToolRegistry {
  #tools = new Map<string, EditorTool>();

  constructor(tools: EditorTool[] = []) {
    for (const tool of tools) this.register(tool);
  }

  register(tool: EditorTool): void {
    if (!tool || typeof tool.type !== "string" || typeof tool.kind !== "string") {
      throw new Error("Editor tool must define type and kind.");
    }
    this.#tools.set(tool.type, tool);
  }

  get(type: string): EditorTool | undefined {
    return this.#tools.get(type);
  }

  has(type: string): boolean {
    return this.#tools.has(type);
  }

  list(): EditorTool[] {
    return [...this.#tools.values()];
  }

  values(): EditorTool[] {
    return this.list();
  }
}

export class BlockRegistry extends ToolRegistry {
  override register(tool: EditorTool): void {
    if (tool.kind !== "block") {
      throw new Error(`Tool '${tool.type}' is not a block tool.`);
    }
    super.register(tool);
  }
}

export function createDefaultToolRegistry(tools: EditorTool[] = []): ToolRegistry {
  return new ToolRegistry([...defaultBlockTools(), ...createDefaultInlineTools(), ...tools]);
}

export function createDefaultBlockRegistry(tools: EditorTool[] = []): BlockRegistry {
  return new BlockRegistry([...defaultBlockTools(), ...tools.filter((tool) => tool.kind === "block")]);
}

export function createDefaultInlineTools(): EditorTool[] {
  return [
    { type: "bold", kind: "inline", normalize: (data) => ({ ...asRecord(data) }), validate: () => true, sanitize: {} },
    { type: "italic", kind: "inline", normalize: (data) => ({ ...asRecord(data) }), validate: () => true, sanitize: {} },
    { type: "link", kind: "inline", normalize: (data) => ({ ...asRecord(data) }), validate: (data) => typeof asRecord(data).href === "string", sanitize: {} },
    { type: "code", kind: "inline", normalize: (data) => ({ ...asRecord(data) }), validate: () => true, sanitize: {} },
    { type: "strike", kind: "inline", normalize: (data) => ({ ...asRecord(data) }), validate: () => true, sanitize: {} },
  ];
}

export async function handlePaste(event: PasteEvent, registry: ToolRegistry): Promise<EditorBlock[]> {
  const blocks: EditorBlock[] = [];
  for (const tool of registry.list()) {
    if (tool.kind !== "block" || !tool.onPaste) continue;
    const data = await tool.onPaste(event);
    blocks.push({ id: createId(`paste-${tool.type}`), type: tool.type, data: asRecord(data) });
  }
  if (blocks.length > 0) return blocks;
  return [createBlock("paragraph", { text: [{ type: "text", text: String(event.data ?? "") }] })];
}

export function normalizeDocument(document: EditorDocument, registry: ToolRegistry): EditorDocument {
  return {
    id: typeof document?.id === "string" && document.id.length > 0 ? document.id : "document",
    schemaVersion: typeof document?.schemaVersion === "string" && document.schemaVersion.length > 0 ? document.schemaVersion : "1.0.0",
    blocks: Array.isArray(document?.blocks) ? document.blocks.map((block) => normalizeBlock(block, registry)) : [],
    ...(document?.meta === undefined ? {} : { meta: cloneJson(asRecord(document.meta)) }),
  };
}

export function normalizeBlock(block: EditorBlock, registry: ToolRegistry): EditorBlock {
  const rawType = typeof block?.type === "string" && block.type.length > 0 ? block.type : "unsupported";
  const type = registry.has(rawType) ? rawType : "unsupported";
  const rawData = asRecord(cloneJson(block?.data ?? {}));
  const tool = registry.get(type);
  const data = asRecord(type === "unsupported" && rawType !== "unsupported"
    ? ({ originalType: rawType, originalData: rawData } satisfies UnsupportedData)
    : tool?.normalize?.(rawData) ?? rawData);
  const normalized: EditorBlock = {
    id: typeof block?.id === "string" && block.id.length > 0 ? block.id : createStableFallbackId(rawType, rawData),
    type,
    data,
    ...(block?.meta === undefined ? {} : { meta: cloneJson(block.meta) }),
  };
  if (Array.isArray(block?.children) && block.children.length > 0) {
    normalized.children = block.children.map((child) => normalizeBlock(child, registry));
  }
  return normalized;
}

export function flattenBlocks(document: EditorDocument): EditorBlock[] {
  const result: EditorBlock[] = [];
  const visit = (blocks: EditorBlock[]) => {
    for (const block of blocks) {
      result.push(block);
      if (block.children) visit(block.children);
    }
  };
  visit(Array.isArray(document?.blocks) ? document.blocks : []);
  return result;
}

export interface BlockLocation {
  block: EditorBlock;
  index: number;
  siblings: EditorBlock[];
  parent: EditorBlock | null;
}

export function findBlockLocation(blocks: EditorBlock[], blockId: string, parent: EditorBlock | null = null): BlockLocation | null {
  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    if (block.id === blockId) return { block, index, siblings: blocks, parent };
    if (block.children) {
      const child = findBlockLocation(block.children, blockId, block);
      if (child) return child;
    }
  }
  return null;
}

export function findBlock(document: EditorDocument, blockId: string): EditorBlock | null {
  return flattenBlocks(document).find((block) => block.id === blockId) ?? null;
}

export function hasBlockId(document: EditorDocument, blockId: string): boolean {
  return Boolean(findBlock(document, blockId));
}

export function collectBlockIds(blocks: EditorBlock[]): Set<string> {
  const ids = new Set<string>();
  const visit = (items: EditorBlock[]) => {
    for (const block of items) {
      ids.add(block.id);
      if (block.children) visit(block.children);
    }
  };
  visit(blocks);
  return ids;
}

export function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

export function normalizeInlineContent(value: unknown): InlineContent[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item): InlineContent[] => {
    if (!isRecord(item)) return [];
    if (item.type === "hard-break") return [{ type: "hard-break" }];
    if (item.type !== "text") return [];
    const marks = normalizeMarks(item.marks);
    return [{ type: "text", text: typeof item.text === "string" ? item.text : "", ...(marks ? { marks } : {}) }];
  });
}

export function sanitizeInlineContent(value: unknown): InlineContent[] {
  return mergeAdjacentText(normalizeInlineContent(value).map((item) => {
    if (item.type === "hard-break") return item;
    const marks = item.marks?.filter((mark) => mark.type !== "link" || isSafeHref(mark.href));
    return marks && marks.length > 0 ? { ...item, marks } : { type: "text", text: item.text };
  }));
}

export function validateInlineContent(value: unknown): boolean {
  if (!Array.isArray(value)) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    if (item.type === "hard-break") return true;
    if (item.type !== "text" || typeof item.text !== "string") return false;
    return item.marks === undefined || (Array.isArray(item.marks) && item.marks.every(isInlineMark));
  });
}

function defaultBlockTools(): EditorTool[] {
  return [
    {
      type: "paragraph",
      kind: "block",
      create: (): ParagraphData => ({ text: [] }),
      normalize: (data): ParagraphData => ({ text: sanitizeInlineContent(asRecord(data).text) }),
      validate: (data) => validateInlineContent(asRecord(data).text),
      merge: (left, right): ParagraphData => ({ text: [...sanitizeInlineContent(asRecord(left).text), ...sanitizeInlineContent(asRecord(right).text)] }),
      sanitize: {},
    },
    {
      type: "heading",
      kind: "block",
      create: (): HeadingData => ({ level: 2, text: [] }),
      normalize: (data): HeadingData => ({ level: normalizeLevel(asRecord(data).level), text: sanitizeInlineContent(asRecord(data).text) }),
      validate: (data) => isLevel(asRecord(data).level) && validateInlineContent(asRecord(data).text),
      merge: (left, right): HeadingData => ({ level: normalizeLevel(asRecord(left).level), text: [...sanitizeInlineContent(asRecord(left).text), ...sanitizeInlineContent(asRecord(right).text)] }),
      sanitize: {},
    },
    {
      type: "list",
      kind: "block",
      create: (): ListData => ({ style: "unordered", items: [] }),
      normalize: (data): ListData => ({ style: normalizeListStyle(asRecord(data).style), items: normalizeListItems(asRecord(data).items) }),
      validate: (data) => isListStyle(asRecord(data).style) && Array.isArray(asRecord(data).items),
      merge: (left, right): ListData => ({ style: normalizeListStyle(asRecord(left).style), items: [...normalizeListItems(asRecord(left).items), ...normalizeListItems(asRecord(right).items)] }),
      sanitize: {},
    },
    {
      type: "code",
      kind: "block",
      create: (): CodeData => ({ code: "" }),
      normalize: (data): CodeData => ({ code: typeof asRecord(data).code === "string" ? asRecord(data).code as string : "", ...(typeof asRecord(data).language === "string" ? { language: asRecord(data).language as string } : {}) }),
      validate: (data) => typeof asRecord(data).code === "string" && (asRecord(data).language === undefined || typeof asRecord(data).language === "string"),
      merge: (left, right): CodeData => ({ code: `${String(asRecord(left).code ?? "")}\n${String(asRecord(right).code ?? "")}`, ...(typeof asRecord(left).language === "string" ? { language: asRecord(left).language as string } : {}) }),
      sanitize: {},
    },
    { type: "quote", kind: "block", create: () => ({ text: [] }), normalize: (data) => ({ text: sanitizeInlineContent(asRecord(data).text) }), validate: () => true, merge: (left, right) => ({ text: [...sanitizeInlineContent(asRecord(left).text), ...sanitizeInlineContent(asRecord(right).text)] }), sanitize: {} },
    { type: "image", kind: "block", create: () => ({ src: "", alt: "" }), normalize: (data) => ({ src: String(asRecord(data).src ?? ""), alt: String(asRecord(data).alt ?? "") }), validate: (data) => typeof asRecord(data).src === "string", sanitize: {} },
    { type: "file", kind: "block", create: () => ({ href: "", label: "" }), normalize: (data) => ({ href: String(asRecord(data).href ?? ""), label: String(asRecord(data).label ?? "") }), validate: (data) => typeof asRecord(data).href === "string", sanitize: {} },
    { type: "divider", kind: "block", create: () => ({}), normalize: () => ({}), validate: () => true, sanitize: {} },
    { type: "callout", kind: "block", create: () => ({ tone: "info", text: [] }), normalize: (data) => ({ tone: String(asRecord(data).tone ?? "info"), text: sanitizeInlineContent(asRecord(data).text) }), validate: () => true, allowsChildren: true, sanitize: {} },
    { type: "component", kind: "block", create: () => ({}), normalize: (data) => ({ ...asRecord(data) }), validate: () => true, allowsChildren: true, sanitize: {} },
    {
      type: "unsupported",
      kind: "block",
      create: (): UnsupportedData => ({ originalType: "unknown", originalData: {} }),
      normalize: (data): UnsupportedData => ({ originalType: typeof asRecord(data).originalType === "string" ? asRecord(data).originalType as string : "unknown", originalData: asRecord(asRecord(data).originalData) }),
      validate: (data) => typeof asRecord(data).originalType === "string",
      sanitize: {},
    },
  ];
}

function normalizeMarks(value: unknown): InlineMark[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const marks = value.flatMap((item): InlineMark[] => {
    if (!isInlineMark(item)) return [];
    if (item.type === "link") return [{ type: "link", href: item.href, ...(item.title === undefined ? {} : { title: item.title }) }];
    return [{ type: item.type }];
  });
  return marks.length > 0 ? marks : undefined;
}

function isInlineMark(value: unknown): value is InlineMark {
  if (!isRecord(value) || typeof value.type !== "string") return false;
  if (value.type === "bold" || value.type === "italic" || value.type === "code" || value.type === "strike") return true;
  return value.type === "link" && typeof value.href === "string" && (value.title === undefined || typeof value.title === "string");
}

function isSafeHref(href: string): boolean {
  return href.startsWith("#") || href.startsWith("/") || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:");
}

function mergeAdjacentText(content: InlineContent[]): InlineContent[] {
  const merged: InlineContent[] = [];
  for (const item of content) {
    const previous = merged[merged.length - 1];
    if (previous?.type === "text" && item.type === "text" && JSON.stringify(previous.marks ?? []) === JSON.stringify(item.marks ?? [])) {
      previous.text += item.text;
    } else {
      merged.push(item);
    }
  }
  return merged;
}

function normalizeLevel(value: unknown): HeadingData["level"] {
  return isLevel(value) ? value : 2;
}

function isLevel(value: unknown): value is HeadingData["level"] {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5 || value === 6;
}

function normalizeListStyle(value: unknown): ListData["style"] {
  return isListStyle(value) ? value : "unordered";
}

function isListStyle(value: unknown): value is ListData["style"] {
  return value === "unordered" || value === "ordered" || value === "checklist";
}

function normalizeListItems(value: unknown): ListData["items"] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item): ListData["items"] => {
    if (!isRecord(item)) return [];
    return [{ content: sanitizeInlineContent(item.content), ...(typeof item.checked === "boolean" ? { checked: item.checked } : {}) }];
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function createStableFallbackId(type: string, data: Record<string, unknown>): string {
  const encoded = JSON.stringify({ type, data });
  let hash = 0;
  for (let index = 0; index < encoded.length; index += 1) {
    hash = ((hash << 5) - hash + encoded.charCodeAt(index)) | 0;
  }
  return `block-${Math.abs(hash)}`;
}
