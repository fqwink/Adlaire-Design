export type TokenCategory =
  | "color"
  | "typography"
  | "spacing"
  | "motion"
  | "layer"
  | "breakpoint"
  | "surface"
  | "status"
  | "effects";

export interface CssToken {
  readonly name: `--adlaire-${string}`;
  readonly value: string;
  readonly category: TokenCategory;
  readonly description: string;
}

export interface TokenFile {
  readonly path: string;
  readonly category: TokenCategory;
  readonly tokens: readonly CssToken[];
}

export const TOKEN_FILES: readonly TokenFile[] = [
  { path: "Tokens/colors.css", category: "color", tokens: [] },
  { path: "Tokens/typography.css", category: "typography", tokens: [] },
  { path: "Tokens/spacing.css", category: "spacing", tokens: [] },
  { path: "Tokens/motion.css", category: "motion", tokens: [] },
  { path: "Tokens/layer.css", category: "layer", tokens: [] },
  { path: "Tokens/breakpoints.css", category: "breakpoint", tokens: [] },
  { path: "Tokens/surface.css", category: "surface", tokens: [] },
  { path: "Tokens/status.css", category: "status", tokens: [] },
  { path: "Tokens/effects.css", category: "effects", tokens: [] },
] as const;

export function tokensForPath(path: string): readonly CssToken[] {
  return TOKEN_FILES.find((file) => file.path === path)?.tokens ?? [];
}
