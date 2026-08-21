#!/bin/sh
set -eu

TOOL_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ADLAIRE_DESIGN_ROOT=$(CDPATH= cd -- "$TOOL_DIR/../.." && pwd)
AGWS_ROOT=$(CDPATH= cd -- "$ADLAIRE_DESIGN_ROOT/../Adlaire-Group-Web-Site-AGWS" 2>/dev/null && pwd || true)
TMP_DIR="${TMPDIR:-/tmp}/adlaire-design-check.$$"

mkdir -p "$TMP_DIR"
trap 'rm -rf "$TMP_DIR"' EXIT HUP INT TERM

for path in \
  AGENTS.md \
  .gitignore \
  README.md \
  LICENSE \
  Docs/Document_Index \
  Docs/Master_Spec \
  Docs/AGWS_Design_Analysis \
  Docs/WYSIWYG_Editor_Specification \
  Docs/Change_History \
  Tokens/colors.css \
  Tokens/surface.css \
  Tokens/status.css \
  Tokens/effects.css \
  UI/adlaire.css \
  UI/base.css \
  UI/grid.css \
  UI/layout.css \
  UI/components.css \
  UI/site.css \
  UI/forms.css \
  UI/content.css \
  UI/wysiwyg.css \
  UI/utilities.css \
  UI/compat-agws.css \
  UI \
  Tokens \
  Brand; do
  if [ ! -e "$ADLAIRE_DESIGN_ROOT/$path" ]; then
    echo "missing Adlaire-Design required path: $ADLAIRE_DESIGN_ROOT/$path" >&2
    exit 1
  fi
done

for path in UI Tokens Brand; do
  if [ ! -d "$ADLAIRE_DESIGN_ROOT/$path" ]; then
    echo "Adlaire-Design required path must be a directory: $ADLAIRE_DESIGN_ROOT/$path" >&2
    exit 1
  fi
done

find "$ADLAIRE_DESIGN_ROOT" -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name '.gitignore' \
  ! -name 'AGENTS.md' \
  ! -name 'Brand' \
  ! -name 'Docs' \
  ! -name 'LICENSE' \
  ! -name 'README.md' \
  ! -name 'Tokens' \
  ! -name 'Tools' \
  ! -name 'UI' \
  -print >"$TMP_DIR/unexpected-top-level"

if [ -s "$TMP_DIR/unexpected-top-level" ]; then
  echo "Adlaire-Design top-level entries must stay within the approved repository structure:" >&2
  cat "$TMP_DIR/unexpected-top-level" >&2
  exit 1
fi

find "$ADLAIRE_DESIGN_ROOT/Docs" -type f \
  ! -name 'Master_Spec' \
  ! -name 'AGWS_Design_Analysis' \
  ! -name 'WYSIWYG_Editor_Specification' \
  ! -name 'Document_Index' \
  ! -name 'Change_History' \
  -print >"$TMP_DIR/unexpected-docs-files"

if [ -s "$TMP_DIR/unexpected-docs-files" ]; then
  echo "Docs/ must contain only approved source documents:" >&2
  cat "$TMP_DIR/unexpected-docs-files" >&2
  exit 1
fi

find "$ADLAIRE_DESIGN_ROOT/Tokens" "$ADLAIRE_DESIGN_ROOT/UI" -type f \
  ! -name '.gitkeep' \
  ! -name '*.css' \
  -print >"$TMP_DIR/unexpected-css-area-files"

if [ -s "$TMP_DIR/unexpected-css-area-files" ]; then
  echo "Tokens/ and UI/ must contain only CSS source files or .gitkeep:" >&2
  cat "$TMP_DIR/unexpected-css-area-files" >&2
  exit 1
fi

find "$ADLAIRE_DESIGN_ROOT/Tools" -type f \
  ! -path "$ADLAIRE_DESIGN_ROOT/Tools/check/check-adlaire-design.sh" \
  -print >"$TMP_DIR/unexpected-tools-files"

if [ -s "$TMP_DIR/unexpected-tools-files" ]; then
  echo "Tools/ must contain only approved Adlaire-Design check tools:" >&2
  cat "$TMP_DIR/unexpected-tools-files" >&2
  exit 1
fi

if [ ! -x "$ADLAIRE_DESIGN_ROOT/Tools/check/check-adlaire-design.sh" ]; then
  echo "Tools/check/check-adlaire-design.sh must be executable." >&2
  exit 1
fi

find "$ADLAIRE_DESIGN_ROOT/Brand" -type f ! -name '.gitkeep' -print >"$TMP_DIR/unexpected-brand-files"

if [ -s "$TMP_DIR/unexpected-brand-files" ]; then
  echo "Brand/ must not contain brand assets until their asset specification is approved:" >&2
  cat "$TMP_DIR/unexpected-brand-files" >&2
  exit 1
fi

if [ -e "$ADLAIRE_DESIGN_ROOT/Documents" ]; then
  echo "Adlaire-Design must use Docs/, not Documents/." >&2
  exit 1
fi

if find "$ADLAIRE_DESIGN_ROOT" \( -name 'package.json' -o -name 'package-lock.json' -o -name 'node_modules' \) -print | grep . >/dev/null 2>&1; then
  echo "Adlaire-Design must not use Node.js/npm project files." >&2
  exit 1
fi

if find "$ADLAIRE_DESIGN_ROOT" -path "$ADLAIRE_DESIGN_ROOT/.git" -prune -o \( -type d \( -name 'Dist' -o -name 'dist' -o -name 'Build' -o -name 'build' \) \) -print | grep . >/dev/null 2>&1; then
  echo "Adlaire-Design must not create Dist/dist/Build/build directories while build, minify, and bundle are out of scope." >&2
  exit 1
fi

if find "$ADLAIRE_DESIGN_ROOT" -path "$ADLAIRE_DESIGN_ROOT/.git" -prune -o \( -name '*.scss' -o -name '*.sass' -o -name '*.less' -o -name '*.styl' \) -print | grep . >/dev/null 2>&1; then
  echo "Adlaire-Design must not use CSS preprocessor source files while direct CSS maintenance is the policy." >&2
  exit 1
fi

if find "$ADLAIRE_DESIGN_ROOT" -path "$ADLAIRE_DESIGN_ROOT/.git" -prune -o \( -name '*.min.css' -o -name '*.bundle.css' \) -print | grep . >/dev/null 2>&1; then
  echo "Adlaire-Design must not use generated minified or bundled CSS files." >&2
  exit 1
fi

if find "$ADLAIRE_DESIGN_ROOT" -path "$ADLAIRE_DESIGN_ROOT/.git" -prune -o \( -name 'postcss.config.*' -o -name 'vite.config.*' -o -name 'webpack.config.*' -o -name 'rollup.config.*' -o -name 'tailwind.config.*' \) -print | grep . >/dev/null 2>&1; then
  echo "Adlaire-Design must not use CSS or frontend build tool configuration files." >&2
  exit 1
fi

if ! grep -F '# Adlaire-Design' "$ADLAIRE_DESIGN_ROOT/README.md" >/dev/null 2>&1; then
  echo "Adlaire-Design README must identify the repository." >&2
  exit 1
fi

if ! grep -F 'Sass/SCSS/Less/Stylus/PostCSS等のCSSプリプロセッサを追加しないこと。' "$ADLAIRE_DESIGN_ROOT/AGENTS.md" >/dev/null 2>&1; then
  echo "Adlaire-Design AGENTS.md must prohibit CSS preprocessors." >&2
  exit 1
fi

if ! grep -F 'ビルド、minify、bundleは現状検討しないこと。' "$ADLAIRE_DESIGN_ROOT/AGENTS.md" >/dev/null 2>&1; then
  echo "Adlaire-Design AGENTS.md must document that build, minify, and bundle are not under current consideration." >&2
  exit 1
fi

if ! grep -F 'Docs/Change_History' "$ADLAIRE_DESIGN_ROOT/README.md" >/dev/null 2>&1; then
  echo "Adlaire-Design README must reference Docs/Change_History." >&2
  exit 1
fi

if ! grep -F '今後の拡充は、公開面CSS機能、再現性検査、ドキュメント整備、ブランド資産の整理を優先する。' "$ADLAIRE_DESIGN_ROOT/README.md" >/dev/null 2>&1; then
  echo "Adlaire-Design README must document the expansion priority policy." >&2
  exit 1
fi

if ! grep -F 'ビルド、minify、bundle、Sass/SCSS等のCSSプリプロセッサは現状検討しない。' "$ADLAIRE_DESIGN_ROOT/README.md" >/dev/null 2>&1; then
  echo "Adlaire-Design README must document that build, minify, bundle, and CSS preprocessors are not under current consideration." >&2
  exit 1
fi

if ! grep -F '## 11.11 今後の拡充優先順位' "$ADLAIRE_DESIGN_ROOT/Docs/Master_Spec" >/dev/null 2>&1; then
  echo "Docs/Master_Spec must define future expansion priorities." >&2
  exit 1
fi

if ! grep -F '### 11.11.1 拡充仕様策定の共通条件' "$ADLAIRE_DESIGN_ROOT/Docs/Master_Spec" >/dev/null 2>&1; then
  echo "Docs/Master_Spec must define expansion planning conditions." >&2
  exit 1
fi

if ! grep -F '上記の拡充においても、Sass、SCSS、Less、Stylus、PostCSS、Lightning CSS、独自プリプロセッサ、CSS bundle生成、minify版生成、`Dist/` 作成は現状検討しない。' "$ADLAIRE_DESIGN_ROOT/Docs/Master_Spec" >/dev/null 2>&1; then
  echo "Docs/Master_Spec must keep build, minify, bundle, and preprocessor work out of current consideration." >&2
  exit 1
fi

MASTER_SPEC_VERSION=$(sed -n 's/^\*\*Version:\*\* \(rev\.[0-9][0-9]*\)$/\1/p' "$ADLAIRE_DESIGN_ROOT/Docs/Master_Spec")
CHANGE_HISTORY_VERSION=$(sed -n 's/^## \(rev\.[0-9][0-9]*\)$/\1/p' "$ADLAIRE_DESIGN_ROOT/Docs/Change_History" | sed -n '1p')

if [ -z "$MASTER_SPEC_VERSION" ]; then
  echo "Docs/Master_Spec must include a Version line in the form: **Version:** rev.N" >&2
  exit 1
fi

if [ "$MASTER_SPEC_VERSION" != "$CHANGE_HISTORY_VERSION" ]; then
  echo "Docs/Master_Spec Version must match the latest Docs/Change_History rev: $MASTER_SPEC_VERSION != $CHANGE_HISTORY_VERSION" >&2
  exit 1
fi

if [ "$(sed -n '1p' "$ADLAIRE_DESIGN_ROOT/LICENSE")" != 'Adlaire-Design Source Viewing and Learning License' ]; then
  echo "LICENSE must identify Adlaire-Design, not a superseded repository family." >&2
  exit 1
fi

for indexed_path in \
  AGENTS.md \
  .gitignore \
  README.md \
  LICENSE \
  Docs/Master_Spec \
  Docs/AGWS_Design_Analysis \
  Docs/WYSIWYG_Editor_Specification \
  Docs/Change_History \
  Brand/ \
  Tokens/colors.css \
  Tokens/surface.css \
  Tokens/status.css \
  Tokens/effects.css \
  UI/adlaire.css \
  UI/base.css \
  UI/grid.css \
  UI/layout.css \
  UI/components.css \
  UI/site.css \
  UI/forms.css \
  UI/content.css \
  UI/wysiwyg.css \
  UI/utilities.css \
  UI/compat-agws.css \
  Tools/check/check-adlaire-design.sh; do
  if ! grep -F -- "$indexed_path" "$ADLAIRE_DESIGN_ROOT/Docs/Document_Index" >/dev/null 2>&1; then
    echo "Adlaire-Design Document_Index must reference $indexed_path." >&2
    exit 1
  fi
done

OLD_REPOSITORY_NAME='Adlaire-''Eco''system-Design'

if grep -R -n "$OLD_REPOSITORY_NAME" "$ADLAIRE_DESIGN_ROOT/AGENTS.md" "$ADLAIRE_DESIGN_ROOT/README.md" "$ADLAIRE_DESIGN_ROOT/Docs/Master_Spec" "$ADLAIRE_DESIGN_ROOT/Docs/AGWS_Design_Analysis" "$ADLAIRE_DESIGN_ROOT/Docs/WYSIWYG_Editor_Specification" "$ADLAIRE_DESIGN_ROOT/Docs/Document_Index" >/tmp/adlaire-design-old-name-matches 2>/dev/null; then
  echo "current Adlaire-Design documents must not use the old repository name:" >&2
  cat /tmp/adlaire-design-old-name-matches >&2
  exit 1
fi

if grep -R -n '@import' "$ADLAIRE_DESIGN_ROOT/Tokens/colors.css" "$ADLAIRE_DESIGN_ROOT/Tokens/surface.css" "$ADLAIRE_DESIGN_ROOT/Tokens/status.css" "$ADLAIRE_DESIGN_ROOT/Tokens/effects.css" "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" "$ADLAIRE_DESIGN_ROOT/UI/base.css" "$ADLAIRE_DESIGN_ROOT/UI/grid.css" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" "$ADLAIRE_DESIGN_ROOT/UI/components.css" "$ADLAIRE_DESIGN_ROOT/UI/site.css" "$ADLAIRE_DESIGN_ROOT/UI/forms.css" "$ADLAIRE_DESIGN_ROOT/UI/content.css" "$ADLAIRE_DESIGN_ROOT/UI/wysiwyg.css" "$ADLAIRE_DESIGN_ROOT/UI/utilities.css" "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css" >/tmp/adlaire-design-css-import-matches 2>/dev/null; then
  echo "Adlaire-Design CSS files must not use @import:" >&2
  cat /tmp/adlaire-design-css-import-matches >&2
  exit 1
fi

if grep -R -n '@charset' "$ADLAIRE_DESIGN_ROOT/Tokens/colors.css" "$ADLAIRE_DESIGN_ROOT/Tokens/surface.css" "$ADLAIRE_DESIGN_ROOT/Tokens/status.css" "$ADLAIRE_DESIGN_ROOT/Tokens/effects.css" "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" "$ADLAIRE_DESIGN_ROOT/UI/base.css" "$ADLAIRE_DESIGN_ROOT/UI/grid.css" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" "$ADLAIRE_DESIGN_ROOT/UI/components.css" "$ADLAIRE_DESIGN_ROOT/UI/site.css" "$ADLAIRE_DESIGN_ROOT/UI/forms.css" "$ADLAIRE_DESIGN_ROOT/UI/content.css" "$ADLAIRE_DESIGN_ROOT/UI/wysiwyg.css" "$ADLAIRE_DESIGN_ROOT/UI/utilities.css" "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css" >/tmp/adlaire-design-css-charset-matches 2>/dev/null; then
  echo "Adlaire-Design CSS files must not use @charset:" >&2
  cat /tmp/adlaire-design-css-charset-matches >&2
  exit 1
fi

if grep -R -n '!important' "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" "$ADLAIRE_DESIGN_ROOT/UI/base.css" "$ADLAIRE_DESIGN_ROOT/UI/grid.css" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" "$ADLAIRE_DESIGN_ROOT/UI/components.css" "$ADLAIRE_DESIGN_ROOT/UI/site.css" "$ADLAIRE_DESIGN_ROOT/UI/forms.css" "$ADLAIRE_DESIGN_ROOT/UI/content.css" "$ADLAIRE_DESIGN_ROOT/UI/wysiwyg.css" "$ADLAIRE_DESIGN_ROOT/UI/utilities.css" "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css" >/tmp/adlaire-design-css-important-matches 2>/dev/null; then
  echo "UI CSS files must not use !important:" >&2
  cat /tmp/adlaire-design-css-important-matches >&2
  exit 1
fi

if [ "$(sed -n '1p' "$ADLAIRE_DESIGN_ROOT/Tokens/colors.css")" != '/* Adlaire-Design color tokens */' ]; then
  echo "Tokens/colors.css must start with the required comment." >&2
  exit 1
fi

if [ "$(sed -n '1p' "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css")" != '/* Adlaire-Design color utilities */' ]; then
  echo "UI/adlaire.css must start with the required comment." >&2
  exit 1
fi

if [ "$(sed -n '1p' "$ADLAIRE_DESIGN_ROOT/Tokens/surface.css")" != '/* Adlaire-Design surface tokens */' ]; then
  echo "Tokens/surface.css must start with the required comment." >&2
  exit 1
fi

if [ "$(sed -n '1p' "$ADLAIRE_DESIGN_ROOT/UI/layout.css")" != '/* Adlaire-Design public layout */' ]; then
  echo "UI/layout.css must start with the required comment." >&2
  exit 1
fi

if [ "$(sed -n '1p' "$ADLAIRE_DESIGN_ROOT/UI/components.css")" != '/* Adlaire-Design public components */' ]; then
  echo "UI/components.css must start with the required comment." >&2
  exit 1
fi

if [ "$(sed -n '1p' "$ADLAIRE_DESIGN_ROOT/Tokens/status.css")" != '/* Adlaire-Design status tokens */' ]; then
  echo "Tokens/status.css must start with the required comment." >&2
  exit 1
fi

if [ "$(sed -n '1p' "$ADLAIRE_DESIGN_ROOT/Tokens/effects.css")" != '/* Adlaire-Design effect tokens */' ]; then
  echo "Tokens/effects.css must start with the required comment." >&2
  exit 1
fi

if [ "$(sed -n '1p' "$ADLAIRE_DESIGN_ROOT/UI/base.css")" != '/* Adlaire-Design base styles */' ]; then
  echo "UI/base.css must start with the required comment." >&2
  exit 1
fi

if [ "$(sed -n '1p' "$ADLAIRE_DESIGN_ROOT/UI/grid.css")" != '/* Adlaire-Design grid utilities */' ]; then
  echo "UI/grid.css must start with the required comment." >&2
  exit 1
fi

if [ "$(sed -n '1p' "$ADLAIRE_DESIGN_ROOT/UI/site.css")" != '/* Adlaire-Design site chrome */' ]; then
  echo "UI/site.css must start with the required comment." >&2
  exit 1
fi

if [ "$(sed -n '1p' "$ADLAIRE_DESIGN_ROOT/UI/forms.css")" != '/* Adlaire-Design form components */' ]; then
  echo "UI/forms.css must start with the required comment." >&2
  exit 1
fi

if [ "$(sed -n '1p' "$ADLAIRE_DESIGN_ROOT/UI/content.css")" != '/* Adlaire-Design content components */' ]; then
  echo "UI/content.css must start with the required comment." >&2
  exit 1
fi

if [ "$(sed -n '1p' "$ADLAIRE_DESIGN_ROOT/UI/utilities.css")" != '/* Adlaire-Design utility classes */' ]; then
  echo "UI/utilities.css must start with the required comment." >&2
  exit 1
fi

if [ "$(sed -n '1p' "$ADLAIRE_DESIGN_ROOT/UI/wysiwyg.css")" != '/* Adlaire-Design WYSIWYG editor */' ]; then
  echo "UI/wysiwyg.css must start with the required comment." >&2
  exit 1
fi

if [ "$(sed -n '1p' "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css")" != '/* Adlaire-Design AGWS compatibility */' ]; then
  echo "UI/compat-agws.css must start with the required comment." >&2
  exit 1
fi

if [ "$(grep -c '^:root {' "$ADLAIRE_DESIGN_ROOT/Tokens/colors.css")" -ne 1 ]; then
  echo "Tokens/colors.css must contain exactly one :root block." >&2
  exit 1
fi

if [ "$(grep -c '^:root {' "$ADLAIRE_DESIGN_ROOT/Tokens/surface.css")" -ne 1 ]; then
  echo "Tokens/surface.css must contain exactly one :root block." >&2
  exit 1
fi

if [ "$(grep -c '^:root {' "$ADLAIRE_DESIGN_ROOT/Tokens/status.css")" -ne 1 ]; then
  echo "Tokens/status.css must contain exactly one :root block." >&2
  exit 1
fi

if [ "$(grep -c '^:root {' "$ADLAIRE_DESIGN_ROOT/Tokens/effects.css")" -ne 1 ]; then
  echo "Tokens/effects.css must contain exactly one :root block." >&2
  exit 1
fi

for token in \
  '--adlaire-color-primary: #00a968;' \
  '--adlaire-color-secondary: #3498db;' \
  '--adlaire-color-accent: #40aaef;' \
  '--adlaire-color-surface: #ecf0f1;' \
  '--adlaire-color-border: #eceef1;' \
  '--adlaire-color-support: #58be89;'; do
  if ! grep -F -- "$token" "$ADLAIRE_DESIGN_ROOT/Tokens/colors.css" >/dev/null 2>&1; then
    echo "Tokens/colors.css missing required token: $token" >&2
    exit 1
  fi
done

for token in \
  '--adlaire-status-secondary: #6c757d;' \
  '--adlaire-status-danger: #dc3545;' \
  '--adlaire-alert-info-bg: #d1ecf1;' \
  '--adlaire-alert-success-bg: #d4edda;' \
  '--adlaire-alert-warning-bg: #fff3cd;' \
  '--adlaire-alert-danger-bg: #f8d7da;'; do
  if ! grep -F -- "$token" "$ADLAIRE_DESIGN_ROOT/Tokens/status.css" >/dev/null 2>&1; then
    echo "Tokens/status.css missing required token: $token" >&2
    exit 1
  fi
done

for token in \
  '--adlaire-radius-sm: 4px;' \
  '--adlaire-radius-lg: 8px;' \
  '--adlaire-shadow-card: 0 2px 8px rgba(0, 0, 0, 0.1);' \
  '--adlaire-shadow-title: 2px 2px 4px rgba(0, 0, 0, 0.3);' \
  '--adlaire-shadow-focus-color: rgba(0, 102, 204, 0.1);' \
  '--adlaire-shadow-focus-ring: 0 0 0 3px rgba(0, 102, 204, 0.1);' \
  '--adlaire-shadow-marker-ring: 0 0 0 2px var(--adlaire-surface-accent);' \
  '--adlaire-shadow-tab-active: 0 -2px 4px rgba(0, 102, 204, 0.1);' \
  '--adlaire-shadow-blue: 0 2px 8px rgba(0, 102, 204, 0.3);' \
  '--adlaire-shadow-blue-nav-hover: 0 4px 8px rgba(0, 102, 204, 0.3);' \
  '--adlaire-shadow-blue-sticky: 0 4px 12px rgba(0, 102, 204, 0.15);' \
  '--adlaire-transition-base: 0.3s ease;' \
  '--adlaire-transition-button: 0.2s ease-in-out;' \
  '--adlaire-animation-fade-in: fadeIn 0.3s ease-in;' \
  '--adlaire-z-timeline-marker: 1;' \
  '--adlaire-z-sticky: 100;' \
  '--adlaire-z-page-top: 1000;'; do
  if ! grep -F -- "$token" "$ADLAIRE_DESIGN_ROOT/Tokens/effects.css" >/dev/null 2>&1; then
    echo "Tokens/effects.css missing required token: $token" >&2
    exit 1
  fi
done

for token in \
  '--adlaire-surface-accent: #0066cc;' \
  '--adlaire-surface-accent-mid: #0055aa;' \
  '--adlaire-surface-accent-strong: #004499;' \
  '--adlaire-surface-page: #f5f5f5;' \
  '--adlaire-surface-card: #ffffff;' \
  '--adlaire-surface-soft: #f0f7ff;' \
  '--adlaire-surface-soft-strong: #e8f2ff;' \
  '--adlaire-surface-border: #e0e0e0;' \
  '--adlaire-surface-text: #333333;' \
  '--adlaire-surface-text-muted: #555555;' \
  '--adlaire-surface-text-subtle: #666666;' \
  '--adlaire-surface-notice: #ff9800;' \
  '--adlaire-surface-notice-soft: #fff3cd;' \
  '--adlaire-surface-notice-text: #856404;'; do
  if ! grep -F -- "$token" "$ADLAIRE_DESIGN_ROOT/Tokens/surface.css" >/dev/null 2>&1; then
    echo "Tokens/surface.css missing required token: $token" >&2
    exit 1
  fi
done

for class in \
  '.adlaire-bg-primary' \
  '.adlaire-bg-secondary' \
  '.adlaire-bg-accent' \
  '.adlaire-bg-surface' \
  '.adlaire-bg-border' \
  '.adlaire-bg-support' \
  '.adlaire-text-primary' \
  '.adlaire-text-secondary' \
  '.adlaire-text-accent' \
  '.adlaire-text-surface' \
  '.adlaire-text-border' \
  '.adlaire-text-support' \
  '.adlaire-border-primary' \
  '.adlaire-border-secondary' \
  '.adlaire-border-accent' \
  '.adlaire-border-surface' \
  '.adlaire-border-border' \
  '.adlaire-border-support'; do
  if ! grep -F -- "$class" "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" >/dev/null 2>&1; then
    echo "UI/adlaire.css missing required class: $class" >&2
    exit 1
  fi
done

for class in \
  '.adlaire-page' \
  '.site-header' \
  '.site-title' \
  '.site-tagline' \
  '.site-nav' \
  '.nav-button' \
  '.site-footer' \
  '.back-to-top'; do
  if ! grep -F -- "$class" "$ADLAIRE_DESIGN_ROOT/UI/site.css" >/dev/null 2>&1; then
    echo "UI/site.css missing required class: $class" >&2
    exit 1
  fi
done

for class in \
  '.contact-form' \
  '.form-group' \
  '.form-label' \
  '.form-control' \
  '.btn' \
  '.btn-primary' \
  '.btn-submit'; do
  if ! grep -F -- "$class" "$ADLAIRE_DESIGN_ROOT/UI/forms.css" >/dev/null 2>&1; then
    echo "UI/forms.css missing required class: $class" >&2
    exit 1
  fi
done

for class in \
  '.renewal-notice' \
  '.news-item' \
  '.timeline' \
  '.tab-container' \
  '.sidebar-section' \
  '.contact-info' \
  '.breadcrumb' \
  '.legal-toc' \
  '.alert' \
  '.adlaire-table-scroll' \
  '.adlaire-content-table' \
  '.adlaire-meta-list' \
  '.adlaire-meta-row' \
  '.adlaire-meta-label' \
  '.adlaire-meta-value' \
  '.adlaire-badge' \
  '.adlaire-badge-primary' \
  '.adlaire-badge-secondary' \
  '.adlaire-badge-success' \
  '.adlaire-badge-warning' \
  '.adlaire-badge-danger' \
  '.adlaire-note' \
  '.adlaire-note-info' \
  '.adlaire-note-success' \
  '.adlaire-note-warning' \
  '.adlaire-note-danger'; do
  if ! grep -F -- "$class" "$ADLAIRE_DESIGN_ROOT/UI/content.css" >/dev/null 2>&1; then
    echo "UI/content.css missing required class: $class" >&2
    exit 1
  fi
done

for class in \
  '.mt-0' \
  '.mb-5' \
  '.text-primary' \
  '.bg-dark' \
  '.d-flex' \
  '.justify-content-between' \
  '.align-items-center'; do
  if ! grep -F -- "$class" "$ADLAIRE_DESIGN_ROOT/UI/utilities.css" >/dev/null 2>&1; then
    echo "UI/utilities.css missing required class: $class" >&2
    exit 1
  fi
done

for selector in \
  '#top' \
  '#contactForm' \
  '.container' \
  '[aria-label]' \
  '[target="_blank"]'; do
  if ! grep -F -- "$selector" "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css" >/dev/null 2>&1; then
    echo "UI/compat-agws.css missing required selector: $selector" >&2
    exit 1
  fi
done

for class in \
  '.adlaire-container' \
  '.adlaire-public-layout' \
  '.adlaire-public-main' \
  '.adlaire-public-sidebar'; do
  if ! grep -F -- "$class" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" >/dev/null 2>&1; then
    echo "UI/layout.css missing required class: $class" >&2
    exit 1
  fi
done

for class in \
  '.adlaire-card' \
  '.adlaire-card-header' \
  '.adlaire-card-body' \
  '.adlaire-section-title' \
  '.adlaire-breadcrumb' \
  '.adlaire-sidebar-list' \
  '.adlaire-notice' \
  '.adlaire-notice-warning' \
  '.adlaire-tabs' \
  '.adlaire-tab-list' \
  '.adlaire-tab-panel' \
  '.adlaire-timeline' \
  '.adlaire-timeline-item' \
  '.adlaire-page-top' \
  '.adlaire-panel' \
  '.adlaire-panel-header' \
  '.adlaire-panel-body' \
  '.adlaire-panel-footer' \
  '.adlaire-well' \
  '.adlaire-button-group' \
  '.adlaire-action-row' \
  '.adlaire-action-row-start' \
  '.adlaire-action-row-between' \
  '.adlaire-divider' \
  '.adlaire-empty-state' \
  '.adlaire-empty-state-title' \
  '.adlaire-empty-state-text' \
  '.adlaire-feature-list' \
  '.adlaire-feature-item' \
  '.adlaire-check-list' \
  '.adlaire-check-item' \
  '.adlaire-definition-list' \
  '.adlaire-definition-row' \
  '.adlaire-definition-term' \
  '.adlaire-definition-description' \
  '.adlaire-key-value' \
  '.adlaire-key-value-row' \
  '.adlaire-key-value-key' \
  '.adlaire-key-value-value' \
  '.adlaire-link-list' \
  '.adlaire-link-list-item' \
  '.adlaire-link-list-link' \
  '.adlaire-related-links' \
  '.adlaire-media' \
  '.adlaire-media-figure' \
  '.adlaire-media-body' \
  '.adlaire-media-title' \
  '.adlaire-cta' \
  '.adlaire-cta-title' \
  '.adlaire-cta-text' \
  '.adlaire-cta-actions' \
  '.adlaire-caption' \
  '.adlaire-helper-text'; do
  if ! grep -F -- "$class" "$ADLAIRE_DESIGN_ROOT/UI/components.css" >/dev/null 2>&1; then
    echo "UI/components.css missing required class: $class" >&2
    exit 1
  fi
done

for class in \
  '.adlaire-wysiwyg' \
  '.adlaire-wysiwyg-header' \
  '.adlaire-wysiwyg-title' \
  '.adlaire-wysiwyg-status' \
  '.adlaire-wysiwyg-toolbar' \
  '.adlaire-wysiwyg-toolbar-group' \
  '.adlaire-wysiwyg-tool' \
  '.adlaire-wysiwyg-canvas' \
  '.adlaire-wysiwyg-block' \
  '.adlaire-wysiwyg-block-selected' \
  '.adlaire-wysiwyg-block-handle' \
  '.adlaire-wysiwyg-block-content' \
  '.adlaire-wysiwyg-placeholder' \
  '.adlaire-wysiwyg-inline-toolbar' \
  '.adlaire-wysiwyg-slash-menu' \
  '.adlaire-wysiwyg-slash-item' \
  '.adlaire-wysiwyg-preview' \
  '.adlaire-wysiwyg-json-panel' \
  '.adlaire-wysiwyg-footer'; do
  if ! grep -F -- "$class" "$ADLAIRE_DESIGN_ROOT/UI/wysiwyg.css" >/dev/null 2>&1; then
    echo "UI/wysiwyg.css missing required class: $class" >&2
    exit 1
  fi
done

if ! grep -F 'max-width: 1200px;' "$ADLAIRE_DESIGN_ROOT/UI/layout.css" >/dev/null 2>&1; then
  echo "UI/layout.css must define a 1200px container." >&2
  exit 1
fi

if ! grep -F '300px' "$ADLAIRE_DESIGN_ROOT/UI/layout.css" >/dev/null 2>&1; then
  echo "UI/layout.css must define the 300px sidebar basis." >&2
  exit 1
fi

if ! grep -F '@media (max-width: 1024px)' "$ADLAIRE_DESIGN_ROOT/UI/layout.css" >/dev/null 2>&1; then
  echo "UI/layout.css must define the 1024px breakpoint." >&2
  exit 1
fi

if ! grep -F '@media (max-width: 768px)' "$ADLAIRE_DESIGN_ROOT/UI/layout.css" >/dev/null 2>&1; then
  echo "UI/layout.css must define the 768px breakpoint." >&2
  exit 1
fi

if ! grep -F '@media (max-width: 480px)' "$ADLAIRE_DESIGN_ROOT/UI/layout.css" >/dev/null 2>&1; then
  echo "UI/layout.css must define the 480px breakpoint." >&2
  exit 1
fi

if grep -R -n -E '#[0-9a-fA-F]{3,8}' "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" "$ADLAIRE_DESIGN_ROOT/UI/base.css" "$ADLAIRE_DESIGN_ROOT/UI/grid.css" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" "$ADLAIRE_DESIGN_ROOT/UI/components.css" "$ADLAIRE_DESIGN_ROOT/UI/site.css" "$ADLAIRE_DESIGN_ROOT/UI/forms.css" "$ADLAIRE_DESIGN_ROOT/UI/content.css" "$ADLAIRE_DESIGN_ROOT/UI/wysiwyg.css" "$ADLAIRE_DESIGN_ROOT/UI/utilities.css" "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css" >/tmp/adlaire-design-ui-hex-matches 2>/dev/null; then
  echo "UI CSS files must not contain direct HEX colors:" >&2
  cat /tmp/adlaire-design-ui-hex-matches >&2
  exit 1
fi

if grep -R -n -E 'rgba?\(' "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" "$ADLAIRE_DESIGN_ROOT/UI/base.css" "$ADLAIRE_DESIGN_ROOT/UI/grid.css" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" "$ADLAIRE_DESIGN_ROOT/UI/components.css" "$ADLAIRE_DESIGN_ROOT/UI/site.css" "$ADLAIRE_DESIGN_ROOT/UI/forms.css" "$ADLAIRE_DESIGN_ROOT/UI/content.css" "$ADLAIRE_DESIGN_ROOT/UI/wysiwyg.css" "$ADLAIRE_DESIGN_ROOT/UI/utilities.css" "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css" >/tmp/adlaire-design-ui-rgba-matches 2>/dev/null; then
  echo "UI CSS files must not contain direct RGB/RGBA colors:" >&2
  cat /tmp/adlaire-design-ui-rgba-matches >&2
  exit 1
fi

if grep -R -n 'letter-spacing: -' "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" "$ADLAIRE_DESIGN_ROOT/UI/base.css" "$ADLAIRE_DESIGN_ROOT/UI/grid.css" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" "$ADLAIRE_DESIGN_ROOT/UI/components.css" "$ADLAIRE_DESIGN_ROOT/UI/site.css" "$ADLAIRE_DESIGN_ROOT/UI/forms.css" "$ADLAIRE_DESIGN_ROOT/UI/content.css" "$ADLAIRE_DESIGN_ROOT/UI/wysiwyg.css" "$ADLAIRE_DESIGN_ROOT/UI/utilities.css" "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css" >/tmp/adlaire-design-ui-negative-letter-spacing-matches 2>/dev/null; then
  echo "UI CSS files must not contain negative letter-spacing:" >&2
  cat /tmp/adlaire-design-ui-negative-letter-spacing-matches >&2
  exit 1
fi

if grep -R -n 'transition: all' "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" "$ADLAIRE_DESIGN_ROOT/UI/base.css" "$ADLAIRE_DESIGN_ROOT/UI/grid.css" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" "$ADLAIRE_DESIGN_ROOT/UI/components.css" "$ADLAIRE_DESIGN_ROOT/UI/site.css" "$ADLAIRE_DESIGN_ROOT/UI/forms.css" "$ADLAIRE_DESIGN_ROOT/UI/content.css" "$ADLAIRE_DESIGN_ROOT/UI/wysiwyg.css" "$ADLAIRE_DESIGN_ROOT/UI/utilities.css" "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css" >/tmp/adlaire-design-ui-transition-all-matches 2>/dev/null; then
  echo "UI CSS files must not use transition: all:" >&2
  cat /tmp/adlaire-design-ui-transition-all-matches >&2
  exit 1
fi

if grep -R -n -E 'border-radius: [1-9]' "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" "$ADLAIRE_DESIGN_ROOT/UI/base.css" "$ADLAIRE_DESIGN_ROOT/UI/grid.css" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" "$ADLAIRE_DESIGN_ROOT/UI/components.css" "$ADLAIRE_DESIGN_ROOT/UI/site.css" "$ADLAIRE_DESIGN_ROOT/UI/forms.css" "$ADLAIRE_DESIGN_ROOT/UI/content.css" "$ADLAIRE_DESIGN_ROOT/UI/wysiwyg.css" "$ADLAIRE_DESIGN_ROOT/UI/utilities.css" "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css" >/tmp/adlaire-design-ui-radius-matches 2>/dev/null; then
  echo "UI CSS files must not contain direct nonzero border-radius values:" >&2
  cat /tmp/adlaire-design-ui-radius-matches >&2
  exit 1
fi

if grep -R -n -E 'box-shadow: [-0-9]' "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" "$ADLAIRE_DESIGN_ROOT/UI/base.css" "$ADLAIRE_DESIGN_ROOT/UI/grid.css" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" "$ADLAIRE_DESIGN_ROOT/UI/components.css" "$ADLAIRE_DESIGN_ROOT/UI/site.css" "$ADLAIRE_DESIGN_ROOT/UI/forms.css" "$ADLAIRE_DESIGN_ROOT/UI/content.css" "$ADLAIRE_DESIGN_ROOT/UI/wysiwyg.css" "$ADLAIRE_DESIGN_ROOT/UI/utilities.css" "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css" >/tmp/adlaire-design-ui-box-shadow-matches 2>/dev/null; then
  echo "UI CSS files must not contain direct box-shadow values:" >&2
  cat /tmp/adlaire-design-ui-box-shadow-matches >&2
  exit 1
fi

if grep -R -n -E 'z-index: [0-9]' "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" "$ADLAIRE_DESIGN_ROOT/UI/base.css" "$ADLAIRE_DESIGN_ROOT/UI/grid.css" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" "$ADLAIRE_DESIGN_ROOT/UI/components.css" "$ADLAIRE_DESIGN_ROOT/UI/site.css" "$ADLAIRE_DESIGN_ROOT/UI/forms.css" "$ADLAIRE_DESIGN_ROOT/UI/content.css" "$ADLAIRE_DESIGN_ROOT/UI/wysiwyg.css" "$ADLAIRE_DESIGN_ROOT/UI/utilities.css" "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css" >/tmp/adlaire-design-ui-z-index-matches 2>/dev/null; then
  echo "UI CSS files must not contain direct z-index values:" >&2
  cat /tmp/adlaire-design-ui-z-index-matches >&2
  exit 1
fi

grep -R -h -E -o 'var\(--adlaire-[^)]+\)' "$ADLAIRE_DESIGN_ROOT/UI" "$ADLAIRE_DESIGN_ROOT/Tokens" 2>/dev/null \
  | sed 's/^var(//' \
  | sed 's/)$//' \
  | sort -u >"$TMP_DIR/css-var-refs"

grep -R -h -E -o -- '--adlaire-[a-z0-9-]+:' "$ADLAIRE_DESIGN_ROOT/UI" "$ADLAIRE_DESIGN_ROOT/Tokens" 2>/dev/null \
  | sed 's/:$//' \
  | sort -u >"$TMP_DIR/css-var-defs"

if comm -23 "$TMP_DIR/css-var-refs" "$TMP_DIR/css-var-defs" >"$TMP_DIR/css-var-missing" && [ -s "$TMP_DIR/css-var-missing" ]; then
  echo "Adlaire-Design CSS must not reference undefined CSS variables:" >&2
  cat "$TMP_DIR/css-var-missing" >&2
  exit 1
fi

if [ -n "$AGWS_ROOT" ] && [ -d "$AGWS_ROOT" ]; then
  grep -h -E -o 'class="[^"]+"' "$AGWS_ROOT"/*.html 2>/dev/null \
    | sed 's/class="//' \
    | sed 's/"$//' \
    | tr ' ' '\n' \
    | sort -u >"$TMP_DIR/agws-html-classes"

  grep -R -h -E -o '\.[A-Za-z0-9_-]+' "$ADLAIRE_DESIGN_ROOT/UI" "$ADLAIRE_DESIGN_ROOT/Docs/Master_Spec" 2>/dev/null \
    | sed 's/^\.//' \
    | sort -u >"$TMP_DIR/adlaire-class-coverage"

  if comm -23 "$TMP_DIR/agws-html-classes" "$TMP_DIR/adlaire-class-coverage" >"$TMP_DIR/agws-html-classes-missing" && [ -s "$TMP_DIR/agws-html-classes-missing" ]; then
    echo "AGWS HTML classes must be covered by Adlaire-Design UI or Master_Spec:" >&2
    cat "$TMP_DIR/agws-html-classes-missing" >&2
    exit 1
  fi

  grep -h -E -o 'id="[^"]+"' "$AGWS_ROOT"/*.html 2>/dev/null \
    | sed 's/id="//' \
    | sed 's/"$//' \
    | sort -u >"$TMP_DIR/agws-html-ids"

  grep -R -h -E -o '#[A-Za-z_][A-Za-z0-9_-]*' "$ADLAIRE_DESIGN_ROOT/UI" "$ADLAIRE_DESIGN_ROOT/Docs/Master_Spec" 2>/dev/null \
    | sed 's/^#//' \
    | sort -u >"$TMP_DIR/adlaire-id-coverage"

  if comm -23 "$TMP_DIR/agws-html-ids" "$TMP_DIR/adlaire-id-coverage" >"$TMP_DIR/agws-html-ids-missing" && [ -s "$TMP_DIR/agws-html-ids-missing" ]; then
    echo "AGWS HTML ids must be covered by Adlaire-Design UI or Master_Spec:" >&2
    cat "$TMP_DIR/agws-html-ids-missing" >&2
    exit 1
  fi

  grep -R -h -E -o '\.[A-Za-z0-9_-]+' "$AGWS_ROOT/style.css" "$AGWS_ROOT/architect.css" 2>/dev/null \
    | sed 's/^\.//' \
    | sort -u >"$TMP_DIR/agws-css-classes"

  if comm -23 "$TMP_DIR/agws-css-classes" "$TMP_DIR/adlaire-class-coverage" >"$TMP_DIR/agws-css-classes-missing" && [ -s "$TMP_DIR/agws-css-classes-missing" ]; then
    echo "AGWS CSS class selectors must be covered by Adlaire-Design UI or Master_Spec:" >&2
    cat "$TMP_DIR/agws-css-classes-missing" >&2
    exit 1
  fi

  grep -R -h -E -o '#[A-Za-z_][A-Za-z0-9_-]*' "$AGWS_ROOT/style.css" "$AGWS_ROOT/architect.css" "$AGWS_ROOT"/*.html 2>/dev/null \
    | sed 's/^#//' \
    | sort -u >"$TMP_DIR/agws-css-ids"

  if comm -23 "$TMP_DIR/agws-css-ids" "$TMP_DIR/adlaire-id-coverage" >"$TMP_DIR/agws-css-ids-missing" && [ -s "$TMP_DIR/agws-css-ids-missing" ]; then
    echo "AGWS CSS and anchor ids must be covered by Adlaire-Design UI or Master_Spec:" >&2
    cat "$TMP_DIR/agws-css-ids-missing" >&2
    exit 1
  fi

  grep -R -h -E -o '@media \([^)]*\)' "$AGWS_ROOT/style.css" "$AGWS_ROOT/architect.css" 2>/dev/null \
    | sort -u >"$TMP_DIR/agws-media"

  grep -R -h -E -o '@media \([^)]*\)' "$ADLAIRE_DESIGN_ROOT/UI" "$ADLAIRE_DESIGN_ROOT/Docs/Master_Spec" 2>/dev/null \
    | sort -u >"$TMP_DIR/adlaire-media-coverage"

  if comm -23 "$TMP_DIR/agws-media" "$TMP_DIR/adlaire-media-coverage" >"$TMP_DIR/agws-media-missing" && [ -s "$TMP_DIR/agws-media-missing" ]; then
    echo "AGWS media queries must be covered by Adlaire-Design UI or Master_Spec:" >&2
    cat "$TMP_DIR/agws-media-missing" >&2
    exit 1
  fi

  grep -R -h -E -o 'rgba?\([^)]*\)|#[0-9a-fA-F]{3,8}' "$AGWS_ROOT/style.css" "$AGWS_ROOT/architect.css" 2>/dev/null \
    | sort -u >"$TMP_DIR/agws-colors"

  grep -R -h -E -o 'rgba?\([^)]*\)|#[0-9a-fA-F]{3,8}' "$ADLAIRE_DESIGN_ROOT/Tokens" "$ADLAIRE_DESIGN_ROOT/Docs/Master_Spec" 2>/dev/null \
    | sort -u >"$TMP_DIR/adlaire-color-coverage"

  if comm -23 "$TMP_DIR/agws-colors" "$TMP_DIR/adlaire-color-coverage" >"$TMP_DIR/agws-colors-missing" && [ -s "$TMP_DIR/agws-colors-missing" ]; then
    echo "AGWS CSS colors and rgba values must be covered by Adlaire-Design tokens or Master_Spec:" >&2
    cat "$TMP_DIR/agws-colors-missing" >&2
    exit 1
  fi
fi

echo "adlaire-design-check-ok"
