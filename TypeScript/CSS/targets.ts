import { CSS_TARGETS, type CssTarget, type CssTargetKind } from "./manifest.ts";

export const CSS_LOAD_ORDER: readonly string[] = CSS_TARGETS.map((target) => target.path);

export const TOKEN_CSS_LOAD_ORDER: readonly string[] = CSS_TARGETS
  .filter((target) => target.kind === "token")
  .map((target) => target.path);

export const UI_CSS_LOAD_ORDER: readonly string[] = CSS_TARGETS
  .filter((target) => target.kind === "ui")
  .map((target) => target.path);

export const EDITOR_UI_CSS_LOAD_ORDER: readonly string[] = CSS_TARGETS
  .filter((target) => target.kind === "editor-ui")
  .map((target) => target.path);

export function targetsByKind(kind: CssTargetKind): readonly CssTarget[] {
  return CSS_TARGETS.filter((target) => target.kind === kind);
}

export function targetForPath(path: string): CssTarget | undefined {
  return CSS_TARGETS.find((target) => target.path === path);
}
