import type { CssTarget } from "./manifest.ts";
import { rulesForPath, type CssDeclaration, type CssRule } from "./rules.ts";
import { tokensForPath, type CssToken } from "./tokens.ts";

export interface GeneratedCssFile {
  readonly path: string;
  readonly css: string;
  readonly migrated: boolean;
}

function renderDeclaration(declaration: CssDeclaration): string {
  return `  ${declaration.property}: ${declaration.value};`;
}

function renderRule(rule: CssRule): string {
  const declarations = rule.declarations.map(renderDeclaration).join("\n");
  const body = `${rule.selector} {\n${declarations}\n}`;
  if (!rule.media) return body;
  return `${rule.media} {\n${body.split("\n").map((line) => `  ${line}`).join("\n")}\n}`;
}

function renderToken(token: CssToken): string {
  return `  ${token.name}: ${token.value};`;
}

function renderTokens(tokens: readonly CssToken[]): string {
  if (tokens.length === 0) return "";
  return `:root {\n${tokens.map(renderToken).join("\n")}\n}`;
}

function renderBody(target: CssTarget): string {
  if (target.kind === "token") return renderTokens(tokensForPath(target.path));
  return rulesForPath(target.path).map(renderRule).join("\n\n");
}

export function renderCssFile(target: CssTarget): GeneratedCssFile {
  const body = renderBody(target);
  const css = body ? `${target.firstLine}\n${body}\n` : `${target.firstLine}\n`;
  return {
    path: target.path,
    css,
    migrated: target.migrated,
  };
}
