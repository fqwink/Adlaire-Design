import { CSS_TARGETS, CSS_COMPILER_REQUIRED_FILES, FORBIDDEN_CSS_COMPILER_PATHS } from "./manifest.ts";
import { renderCssFile, type GeneratedCssFile } from "./emit.ts";

export * from "./manifest.ts";
export * from "./tokens.ts";
export * from "./rules.ts";
export * from "./targets.ts";
export * from "./emit.ts";

export interface CssCompilerManifest {
  readonly commandName: "generate-css";
  readonly checkName: "check-generated-css";
  readonly requiredFiles: readonly string[];
  readonly forbiddenPaths: readonly string[];
  readonly targets: readonly string[];
}

export function generateCssFiles(): readonly GeneratedCssFile[] {
  return CSS_TARGETS.map(renderCssFile);
}

export function getCssCompilerManifest(): CssCompilerManifest {
  return {
    commandName: "generate-css",
    checkName: "check-generated-css",
    requiredFiles: CSS_COMPILER_REQUIRED_FILES,
    forbiddenPaths: FORBIDDEN_CSS_COMPILER_PATHS,
    targets: CSS_TARGETS.map((target) => target.path),
  };
}

type DenoLike = {
  readonly args?: readonly string[];
};

declare const Deno: DenoLike | undefined;

function printLine(line: string): void {
  globalThis.console.log(line);
}

if (typeof Deno !== "undefined" && Deno.args?.includes("--list")) {
  getCssCompilerManifest().targets.forEach(printLine);
}
