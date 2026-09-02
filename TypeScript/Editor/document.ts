import type { EditorBlock, EditorDocument, EditorTool, PasteEvent } from "./types";

export function createEmptyDocument(id = "document", schemaVersion = "1.0.0"): EditorDocument {
  return { id, schemaVersion, blocks: [] };
}

export function cloneDocument(document: EditorDocument): EditorDocument {
  return JSON.parse(JSON.stringify(document));
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
    this.#tools.set(tool.type, tool);
  }

  get(type: string): EditorTool | undefined {
    return this.#tools.get(type);
  }

  has(type: string): boolean {
    return this.#tools.has(type);
  }

  values(): EditorTool[] {
    return [...this.#tools.values()];
  }
}

export function createDefaultToolRegistry(tools: EditorTool[] = []): ToolRegistry {
  return new ToolRegistry([...defaultBlockTools(), ...defaultInlineTools(), ...tools]);
}

export function createDefaultBlockRegistry(tools: EditorTool[] = []): ToolRegistry {
  return new ToolRegistry([...defaultBlockTools(), ...tools.filter((tool) => tool.kind === "block")]);
}

export function createDefaultInlineTools(): EditorTool[] {
  return defaultInlineTools();
}

export async function handlePaste(event: PasteEvent, registry: ToolRegistry): Promise<EditorBlock[]> {
  for (const tool of registry.values()) {
    if (tool.kind !== "block" || !tool.onPaste) continue;
    const data = await tool.onPaste(event);
    return [{ id: createId(tool.type), type: tool.type, data: asRecord(data) }];
  }
  return [{ id: createId("paragraph"), type: "paragraph", data: { text: [{ type: "text", text: String(event.data ?? "") }] } }];
}

export function normalizeDocument(document: EditorDocument, registry: ToolRegistry): EditorDocument {
  return {
    id: String(document?.id ?? "document"),
    schemaVersion: String(document?.schemaVersion ?? "1.0.0"),
    blocks: Array.isArray(document?.blocks) ? document.blocks.map((block) => normalizeBlock(block, registry)) : [],
    ...(document?.meta ? { meta: asRecord(document.meta) } : {}),
  };
}

export function normalizeBlock(block: EditorBlock, registry: ToolRegistry): EditorBlock {
  const input = {
    id: String(block?.id ?? createId("block")),
    type: String(block?.type ?? "unsupported"),
    data: asRecord(block?.data),
    ...(Array.isArray(block?.children) ? { children: block.children.map((child) => normalizeBlock(child, registry)) } : {}),
    ...(block?.meta ? { meta: block.meta } : {}),
  };
  const tool = registry.get(input.type);
  if (!tool && input.type !== "unsupported") {
    return { id: input.id, type: "unsupported", data: { originalType: input.type, originalData: input.data } };
  }
  return tool?.normalize ? { ...input, data: asRecord(tool.normalize(input.data)) } : input;
}

export function flattenBlocks(document: EditorDocument): EditorBlock[] {
  const result: EditorBlock[] = [];
  const visit = (blocks: EditorBlock[]) => {
    for (const block of blocks) {
      result.push(block);
      if (block.children) visit(block.children);
    }
  };
  visit(document.blocks);
  return result;
}

export function findBlock(document: EditorDocument, blockId: string): EditorBlock | null {
  return flattenBlocks(document).find((block) => block.id === blockId) ?? null;
}

export function hasBlockId(document: EditorDocument, blockId: string): boolean {
  return Boolean(findBlock(document, blockId));
}

export function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function defaultBlockTools(): EditorTool[] {
  return [
    { type: "paragraph", kind: "block", normalize: (data) => ({ text: Array.isArray(asRecord(data).text) ? asRecord(data).text : [] }), validate: () => true },
    { type: "heading", kind: "block", normalize: (data) => ({ level: asRecord(data).level ?? 2, text: Array.isArray(asRecord(data).text) ? asRecord(data).text : [] }), validate: () => true },
    { type: "list", kind: "block", validate: () => true },
    { type: "quote", kind: "block", validate: () => true },
    { type: "code", kind: "block", validate: () => true },
    { type: "image", kind: "block", validate: () => true },
    { type: "file", kind: "block", validate: () => true },
    { type: "divider", kind: "block", validate: () => true },
    { type: "callout", kind: "block", validate: () => true },
    { type: "unsupported", kind: "block", validate: () => true },
  ];
}

function defaultInlineTools(): EditorTool[] {
  return ["bold", "italic", "link", "code", "strike"].map((type) => ({ type, kind: "inline" as const, validate: () => true }));
}
