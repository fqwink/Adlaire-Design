import type { EditorEvent, EditorEventListener, Unsubscribe } from "./types.ts";

export class EventBus {
  #listeners = new Set<EditorEventListener>();

  subscribe(listener: EditorEventListener): Unsubscribe {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  emit(event: EditorEvent): void {
    for (const listener of [...this.#listeners]) listener(event);
  }

  clear(): void {
    this.#listeners.clear();
  }
}

export function editorError(code: string, message: string, blockId?: string, path?: Array<string | number>): { code: string; message: string; blockId?: string; path?: Array<string | number> } {
  return { code, message, ...(blockId ? { blockId } : {}), ...(path ? { path } : {}) };
}
