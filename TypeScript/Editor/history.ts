import { cloneDocument } from "./document.ts";
import type { EditorCommand, EditorDocument, EditorSelection } from "./types.ts";

export interface HistorySnapshot {
  before: { document: EditorDocument; selection: EditorSelection | null };
  after: { document: EditorDocument; selection: EditorSelection | null };
  commands: EditorCommand[];
}

export class History {
  #undos: HistorySnapshot[] = [];
  #redos: HistorySnapshot[] = [];
  #limit: number;

  constructor(limit = 100) {
    this.#limit = Math.max(1, limit);
  }

  get canUndo(): boolean {
    return this.#undos.length > 0;
  }

  get canRedo(): boolean {
    return this.#redos.length > 0;
  }

  push(snapshot: HistorySnapshot): void {
    this.#undos.push(cloneSnapshot(snapshot));
    this.#redos = [];
    if (this.#undos.length > this.#limit) this.#undos.shift();
  }

  undo(current: { document: EditorDocument; selection: EditorSelection | null }): HistorySnapshot | null {
    const snapshot = this.#undos.pop();
    if (!snapshot) return null;
    this.#redos.push({ before: cloneState(snapshot.before), after: cloneState(current), commands: snapshot.commands });
    return cloneSnapshot(snapshot);
  }

  redo(current: { document: EditorDocument; selection: EditorSelection | null }): HistorySnapshot | null {
    const snapshot = this.#redos.pop();
    if (!snapshot) return null;
    this.#undos.push({ before: cloneState(current), after: cloneState(snapshot.after), commands: snapshot.commands });
    return cloneSnapshot(snapshot);
  }
}

function cloneSnapshot(snapshot: HistorySnapshot): HistorySnapshot {
  return { before: cloneState(snapshot.before), after: cloneState(snapshot.after), commands: [...snapshot.commands] };
}

function cloneState(state: { document: EditorDocument; selection: EditorSelection | null }) {
  return { document: cloneDocument(state.document), selection: state.selection ? JSON.parse(JSON.stringify(state.selection)) : null };
}
