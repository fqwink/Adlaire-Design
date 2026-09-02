export type CssDeclarationValue = string | number;

export interface CssDeclaration {
  readonly property: string;
  readonly value: CssDeclarationValue;
}

export interface CssRule {
  readonly selector: string;
  readonly declarations: readonly CssDeclaration[];
  readonly media?: string;
}

export interface CssRuleFile {
  readonly path: string;
  readonly rules: readonly CssRule[];
}

export const RULE_FILES: readonly CssRuleFile[] = [
  { path: "UI/adlaire.css", rules: [] },
  { path: "UI/base.css", rules: [] },
  { path: "UI/grid.css", rules: [] },
  { path: "UI/layout.css", rules: [] },
  { path: "UI/components.css", rules: [] },
  { path: "UI/site.css", rules: [] },
  { path: "UI/forms.css", rules: [] },
  { path: "UI/content.css", rules: [] },
  { path: "UI/utilities.css", rules: [] },
  { path: "UI/compat-agws.css", rules: [] },
  { path: "EditorUI/wysiwyg.css", rules: [] },
] as const;

export function rulesForPath(path: string): readonly CssRule[] {
  return RULE_FILES.find((file) => file.path === path)?.rules ?? [];
}
