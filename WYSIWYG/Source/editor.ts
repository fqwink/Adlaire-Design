export type AdlaireWysiwygBlockType =
  | "heading"
  | "paragraph"
  | "list"
  | "code"
  | "quote"
  | "image"
  | "divider"
  | "checklist"
  | "callout"
  | "label"
  | "progress";

export interface AdlaireWysiwygBlock {
  id: string;
  type: AdlaireWysiwygBlockType;
  content: string;
  meta?: Record<string, string | number | boolean>;
}

export interface AdlaireWysiwygDocument {
  version: 1;
  blocks: AdlaireWysiwygBlock[];
}

export interface AdlaireWysiwygSnapshot {
  blocks: AdlaireWysiwygBlock[];
}

const EMPTY_DOCUMENT: AdlaireWysiwygDocument = {
  version: 1,
  blocks: [],
};

export class AdlaireWysiwygEditor {
  private document: AdlaireWysiwygDocument;
  private undoStack: AdlaireWysiwygSnapshot[];
  private redoStack: AdlaireWysiwygSnapshot[];

  constructor(initialDocument: AdlaireWysiwygDocument = EMPTY_DOCUMENT) {
    this.document = normalizeDocument(initialDocument);
    this.undoStack = [];
    this.redoStack = [];
  }

  getDocument(): AdlaireWysiwygDocument {
    return cloneDocument(this.document);
  }

  setDocument(nextDocument: AdlaireWysiwygDocument): void {
    this.pushUndo();
    this.document = normalizeDocument(nextDocument);
    this.redoStack = [];
  }

  addBlock(block: Omit<AdlaireWysiwygBlock, "id"> & { id?: string }, index?: number): AdlaireWysiwygBlock {
    this.pushUndo();

    const nextBlock: AdlaireWysiwygBlock = {
      id: block.id ?? createBlockId(),
      type: block.type,
      content: block.content,
      meta: block.meta ? { ...block.meta } : undefined,
    };

    const insertIndex = clampIndex(index ?? this.document.blocks.length, this.document.blocks.length);
    this.document.blocks.splice(insertIndex, 0, nextBlock);
    this.redoStack = [];

    return { ...nextBlock, meta: nextBlock.meta ? { ...nextBlock.meta } : undefined };
  }

  updateBlock(id: string, patch: Partial<Omit<AdlaireWysiwygBlock, "id">>): AdlaireWysiwygBlock | null {
    const index = this.findBlockIndex(id);
    if (index < 0) {
      return null;
    }

    this.pushUndo();

    const current = this.document.blocks[index];
    const updated: AdlaireWysiwygBlock = {
      ...current,
      ...patch,
      id: current.id,
      meta: patch.meta ? { ...patch.meta } : current.meta ? { ...current.meta } : undefined,
    };

    this.document.blocks[index] = updated;
    this.redoStack = [];

    return { ...updated, meta: updated.meta ? { ...updated.meta } : undefined };
  }

  removeBlock(id: string): AdlaireWysiwygBlock | null {
    const index = this.findBlockIndex(id);
    if (index < 0) {
      return null;
    }

    this.pushUndo();
    const [removed] = this.document.blocks.splice(index, 1);
    this.redoStack = [];

    return { ...removed, meta: removed.meta ? { ...removed.meta } : undefined };
  }

  moveBlock(id: string, nextIndex: number): boolean {
    const currentIndex = this.findBlockIndex(id);
    if (currentIndex < 0) {
      return false;
    }

    const boundedIndex = clampIndex(nextIndex, this.document.blocks.length - 1);
    if (currentIndex === boundedIndex) {
      return true;
    }

    this.pushUndo();
    const [block] = this.document.blocks.splice(currentIndex, 1);
    this.document.blocks.splice(boundedIndex, 0, block);
    this.redoStack = [];

    return true;
  }

  undo(): boolean {
    const previous = this.undoStack.pop();
    if (!previous) {
      return false;
    }

    this.redoStack.push(this.createSnapshot());
    this.document.blocks = cloneBlocks(previous.blocks);
    return true;
  }

  redo(): boolean {
    const next = this.redoStack.pop();
    if (!next) {
      return false;
    }

    this.undoStack.push(this.createSnapshot());
    this.document.blocks = cloneBlocks(next.blocks);
    return true;
  }

  toJSON(): string {
    return JSON.stringify(this.document, null, 2);
  }

  renderPreview(): string {
    return this.document.blocks.map(renderBlock).join("");
  }

  private findBlockIndex(id: string): number {
    return this.document.blocks.findIndex((block) => block.id === id);
  }

  private pushUndo(): void {
    this.undoStack.push(this.createSnapshot());
  }

  private createSnapshot(): AdlaireWysiwygSnapshot {
    return {
      blocks: cloneBlocks(this.document.blocks),
    };
  }
}

export function parseAdlaireWysiwygDocument(json: string): AdlaireWysiwygDocument {
  const parsed = JSON.parse(json) as AdlaireWysiwygDocument;
  return normalizeDocument(parsed);
}

function normalizeDocument(document: AdlaireWysiwygDocument): AdlaireWysiwygDocument {
  return {
    version: 1,
    blocks: cloneBlocks(Array.isArray(document.blocks) ? document.blocks : []),
  };
}

function cloneDocument(document: AdlaireWysiwygDocument): AdlaireWysiwygDocument {
  return {
    version: 1,
    blocks: cloneBlocks(document.blocks),
  };
}

function cloneBlocks(blocks: AdlaireWysiwygBlock[]): AdlaireWysiwygBlock[] {
  return blocks.map((block) => ({
    id: block.id,
    type: block.type,
    content: block.content,
    meta: block.meta ? { ...block.meta } : undefined,
  }));
}

function clampIndex(index: number, maxIndex: number): number {
  if (index < 0) {
    return 0;
  }

  if (index > maxIndex) {
    return maxIndex;
  }

  return index;
}

function createBlockId(): string {
  return `block-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function renderBlock(block: AdlaireWysiwygBlock): string {
  const content = escapeHtml(block.content);

  switch (block.type) {
    case "heading":
      return `<h2>${content}</h2>`;
    case "paragraph":
      return `<p>${content}</p>`;
    case "list":
      return renderList(block.content);
    case "code":
      return `<pre><code>${content}</code></pre>`;
    case "quote":
      return `<blockquote>${content}</blockquote>`;
    case "image":
      return renderImage(block);
    case "divider":
      return "<hr>";
    case "checklist":
      return renderChecklist(block.content);
    case "callout":
      return `<aside class="adlaire-note adlaire-note-info">${content}</aside>`;
    case "label":
      return `<span class="adlaire-badge adlaire-badge-primary">${content}</span>`;
    case "progress":
      return renderProgress(block);
  }
}

function renderList(content: string): string {
  const items = content
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  return `<ul>${items}</ul>`;
}

function renderChecklist(content: string): string {
  const items = content
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => `<li><input type="checkbox" disabled> ${escapeHtml(item)}</li>`)
    .join("");

  return `<ul class="adlaire-check-list">${items}</ul>`;
}

function renderImage(block: AdlaireWysiwygBlock): string {
  const src = escapeAttribute(block.content);
  const alt = escapeAttribute(String(block.meta?.alt ?? ""));
  return `<figure><img src="${src}" alt="${alt}"></figure>`;
}

function renderProgress(block: AdlaireWysiwygBlock): string {
  const value = Number(block.meta?.value ?? block.content);
  const normalizedValue = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  return `<progress value="${normalizedValue}" max="100">${normalizedValue}%</progress>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replace(/`/g, "&#96;");
}
