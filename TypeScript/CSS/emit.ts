import type { CssTarget } from "./manifest.ts";
import { ruleCssForPath } from "./rules.ts";
import { tokenCssForPath } from "./tokens.ts";

export interface GeneratedCssFile {
  readonly path: string;
  readonly css: string;
  readonly migrated: boolean;
}

export function renderCssFile(target: CssTarget): GeneratedCssFile {
  const css = target.kind === "token" ? tokenCssForPath(target.path) : ruleCssForPath(target.path);
  if (css === undefined) {
    throw new Error(`Missing CSS source for ${target.path}`);
  }
  if (!css.startsWith(`${target.firstLine}\n`) && css !== `${target.firstLine}\n`) {
    throw new Error(`CSS source for ${target.path} must preserve first line: ${target.firstLine}`);
  }
  return {
    path: target.path,
    css,
    migrated: target.migrated,
  };
}
