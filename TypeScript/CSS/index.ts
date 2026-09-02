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
  readTextFile?: (path: string) => Promise<string>;
  writeTextFile?: (path: string, data: string) => Promise<void>;
  exit?: (code?: number) => never;
};

declare const Deno: DenoLike | undefined;

function printLine(line: string): void {
  globalThis.console.log(line);
}

async function writeGeneratedCss(files: readonly GeneratedCssFile[]): Promise<void> {
  if (typeof Deno === "undefined" || !Deno.writeTextFile) {
    throw new Error("generate-css requires Deno.writeTextFile.");
  }
  for (const file of files) {
    await Deno.writeTextFile(file.path, file.css);
  }
}

async function checkGeneratedCss(files: readonly GeneratedCssFile[]): Promise<number> {
  if (typeof Deno === "undefined" || !Deno.readTextFile) {
    throw new Error("check-generated-css requires Deno.readTextFile.");
  }
  let failures = 0;
  for (const file of files) {
    const current = await Deno.readTextFile(file.path);
    if (current !== file.css) {
      printLine(`generated CSS mismatch: ${file.path}`);
      failures += 1;
    }
  }
  return failures;
}

async function main(args: readonly string[]): Promise<void> {
  const command = args[0] ?? "--list";
  const files = generateCssFiles();

  if (command === "--list") {
    getCssCompilerManifest().targets.forEach(printLine);
    return;
  }

  if (command === "generate-css") {
    await writeGeneratedCss(files);
    files.forEach((file) => printLine(`generated ${file.path}`));
    return;
  }

  if (command === "check-generated-css") {
    const failures = await checkGeneratedCss(files);
    if (failures > 0) {
      Deno?.exit?.(1);
      return;
    }
    printLine("check-generated-css-ok");
    return;
  }

  printLine("usage: deno run --allow-read --allow-write TypeScript/CSS/index.ts [--list|generate-css|check-generated-css]");
  Deno?.exit?.(1);
}

if (typeof Deno !== "undefined") {
  await main(Deno.args ?? []);
}
