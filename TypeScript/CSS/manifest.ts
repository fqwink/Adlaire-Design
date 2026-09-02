export type CssTargetKind = "token" | "ui" | "editor-ui";

export interface CssTarget {
  readonly path: string;
  readonly kind: CssTargetKind;
  readonly firstLine: string;
  readonly sourceModules: readonly string[];
  readonly migrated: boolean;
}

export const CSS_TARGETS: readonly CssTarget[] = [
  { path: "Tokens/colors.css", kind: "token", firstLine: "/* Adlaire-Design color tokens */", sourceModules: ["tokens.ts"], migrated: false },
  { path: "Tokens/typography.css", kind: "token", firstLine: "/* Adlaire-Design typography tokens */", sourceModules: ["tokens.ts"], migrated: false },
  { path: "Tokens/spacing.css", kind: "token", firstLine: "/* Adlaire-Design spacing tokens */", sourceModules: ["tokens.ts"], migrated: false },
  { path: "Tokens/motion.css", kind: "token", firstLine: "/* Adlaire-Design motion tokens */", sourceModules: ["tokens.ts"], migrated: false },
  { path: "Tokens/layer.css", kind: "token", firstLine: "/* Adlaire-Design layer tokens */", sourceModules: ["tokens.ts"], migrated: false },
  { path: "Tokens/breakpoints.css", kind: "token", firstLine: "/* Adlaire-Design breakpoint tokens */", sourceModules: ["tokens.ts"], migrated: false },
  { path: "Tokens/surface.css", kind: "token", firstLine: "/* Adlaire-Design surface tokens */", sourceModules: ["tokens.ts"], migrated: false },
  { path: "Tokens/status.css", kind: "token", firstLine: "/* Adlaire-Design status tokens */", sourceModules: ["tokens.ts"], migrated: false },
  { path: "Tokens/effects.css", kind: "token", firstLine: "/* Adlaire-Design effect tokens */", sourceModules: ["tokens.ts"], migrated: false },
  { path: "UI/adlaire.css", kind: "ui", firstLine: "/* Adlaire-Design color utilities */", sourceModules: ["rules.ts"], migrated: false },
  { path: "UI/base.css", kind: "ui", firstLine: "/* Adlaire-Design base styles */", sourceModules: ["rules.ts"], migrated: false },
  { path: "UI/grid.css", kind: "ui", firstLine: "/* Adlaire-Design grid utilities */", sourceModules: ["rules.ts"], migrated: false },
  { path: "UI/layout.css", kind: "ui", firstLine: "/* Adlaire-Design public layout */", sourceModules: ["rules.ts"], migrated: false },
  { path: "UI/components.css", kind: "ui", firstLine: "/* Adlaire-Design public components */", sourceModules: ["rules.ts"], migrated: false },
  { path: "UI/site.css", kind: "ui", firstLine: "/* Adlaire-Design site chrome */", sourceModules: ["rules.ts"], migrated: false },
  { path: "UI/forms.css", kind: "ui", firstLine: "/* Adlaire-Design form components */", sourceModules: ["rules.ts"], migrated: false },
  { path: "UI/content.css", kind: "ui", firstLine: "/* Adlaire-Design content components */", sourceModules: ["rules.ts"], migrated: false },
  { path: "UI/utilities.css", kind: "ui", firstLine: "/* Adlaire-Design utility classes */", sourceModules: ["rules.ts"], migrated: false },
  { path: "UI/compat-agws.css", kind: "ui", firstLine: "/* Adlaire-Design specification layer */", sourceModules: ["rules.ts"], migrated: false },
  { path: "EditorUI/wysiwyg.css", kind: "editor-ui", firstLine: "/* Adlaire-Design WYSIWYG editor */", sourceModules: ["rules.ts"], migrated: false },
] as const;

export const FORBIDDEN_CSS_COMPILER_PATHS: readonly string[] = [
  "TypeScript/CSS/components/",
  "TypeScript/CSS/tokens/",
  "TypeScript/CSS/themes/",
  "TypeScript/CSS/plugins/",
  "TypeScript/CSS/adapters/",
] as const;

export const CSS_COMPILER_REQUIRED_FILES: readonly string[] = [
  "TypeScript/CSS/tokens.ts",
  "TypeScript/CSS/rules.ts",
  "TypeScript/CSS/targets.ts",
  "TypeScript/CSS/emit.ts",
  "TypeScript/CSS/manifest.ts",
  "TypeScript/CSS/index.ts",
] as const;
