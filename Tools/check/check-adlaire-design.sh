#!/bin/sh
set -eu

TOOL_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ADLAIRE_DESIGN_ROOT=$(CDPATH= cd -- "$TOOL_DIR/../.." && pwd)
TMP_DIR="${TMPDIR:-/tmp}/adlaire-design-check.$$"
RUN_RELEASE_CHECK=0

case "${1:-}" in
  "")
    ;;
  "--release-check")
    RUN_RELEASE_CHECK=1
    ;;
  *)
    echo "usage: sh Tools/check/check-adlaire-design.sh [--release-check]" >&2
    exit 1
    ;;
esac

mkdir -p "$TMP_DIR"
trap 'rm -rf "$TMP_DIR"' EXIT HUP INT TERM

check_catalog_classes() {
  catalog_label=$1
  catalog_path=$2
  ignore_pattern=$3
  shift 3

  catalog_classes="$TMP_DIR/$catalog_label-catalog-classes"
  catalog_classes_filtered="$TMP_DIR/$catalog_label-catalog-classes-filtered"
  css_classes="$TMP_DIR/$catalog_label-css-classes"
  css_source="$TMP_DIR/$catalog_label-css-source"

  grep -E -o '\.adlaire-[a-z0-9]+(-[a-z0-9]+)*' "$catalog_path" | sort -u >"$catalog_classes" || true

  if [ -n "$ignore_pattern" ]; then
    grep -E -v "$ignore_pattern" "$catalog_classes" >"$catalog_classes_filtered" || true
    mv "$catalog_classes_filtered" "$catalog_classes"
  fi

  cat "$@" >"$css_source"
  grep -E -o '\.adlaire-[a-z0-9]+(-[a-z0-9]+)*' "$css_source" | sort -u >"$css_classes" || true

  while IFS= read -r class_name; do
    if [ -n "$class_name" ] && ! grep -F -x -- "$class_name" "$css_classes" >/dev/null 2>&1; then
      echo "$catalog_path references a class missing from the expected CSS target set ($catalog_label): $class_name" >&2
      exit 1
    fi
  done <"$catalog_classes"
}

for path in \
  AGENTS.md \
  .gitignore \
  README.md \
  LICENSE \
  Docs/Document_Index \
  Docs/Master_Spec \
  Docs/Editor_Master_Spec \
  Docs/Generic_Component_Catalog \
  Docs/Admin_UI_Catalog \
  Docs/WYSIWYG_Editor_UI_Catalog \
  Docs/Icon_Set_Catalog \
  Docs/Brand_Asset_Catalog \
  Docs/Pending_Tasks \
  Brand/README.md \
  Icons \
  Samples/README.md \
  Samples/design \
  Tokens/colors.css \
  Tokens/typography.css \
  Tokens/spacing.css \
  Tokens/motion.css \
  Tokens/layer.css \
  Tokens/breakpoints.css \
  Tokens/surface.css \
  Tokens/status.css \
  Tokens/effects.css \
  UI/adlaire.css \
  UI/base.css \
  UI/grid.css \
  UI/layout.css \
  UI/components.css \
  UI/components.js \
  UI/site.css \
  UI/forms.css \
  UI/forms.js \
  UI/content.css \
  UI/content.js \
  EditorUI/editor.js \
  EditorUI/wysiwyg.css \
  EditorUI/wysiwyg.js \
  TypeScript/UI/components.ts \
  TypeScript/UI/content.ts \
  TypeScript/UI/forms.ts \
  TypeScript/EditorUI/wysiwyg.ts \
  TypeScript/Editor/core.ts \
  TypeScript/Editor/document.ts \
  TypeScript/Editor/commands.ts \
  TypeScript/Editor/selection.ts \
  TypeScript/Editor/history.ts \
  TypeScript/Editor/validation.ts \
  TypeScript/Editor/events.ts \
  TypeScript/Editor/types.ts \
  TypeScript/Editor/index.ts \
  UI/utilities.css \
  UI/compat-agws.css \
  EditorUI \
  Icons \
  Samples \
  UI \
  Tokens \
  Brand; do
  if [ ! -e "$ADLAIRE_DESIGN_ROOT/$path" ]; then
    echo "missing Adlaire-Design required path: $ADLAIRE_DESIGN_ROOT/$path" >&2
    exit 1
  fi
done

for path in UI EditorUI Tokens Brand Icons Samples Samples/design TypeScript TypeScript/UI TypeScript/EditorUI TypeScript/Editor; do
  if [ ! -d "$ADLAIRE_DESIGN_ROOT/$path" ]; then
    echo "Adlaire-Design required path must be a directory: $ADLAIRE_DESIGN_ROOT/$path" >&2
    exit 1
  fi
done

find "$ADLAIRE_DESIGN_ROOT/TypeScript" -type f \
  ! -name '*.ts' \
  -print >"$TMP_DIR/unexpected-typescript-files"

if [ -s "$TMP_DIR/unexpected-typescript-files" ]; then
  echo "TypeScript/ must contain only TypeScript source files:" >&2
  cat "$TMP_DIR/unexpected-typescript-files" >&2
  exit 1
fi

find "$ADLAIRE_DESIGN_ROOT/TypeScript/Editor" -mindepth 1 -type d \
  -print >"$TMP_DIR/unexpected-editor-typescript-directories"

if [ -s "$TMP_DIR/unexpected-editor-typescript-directories" ]; then
  echo "TypeScript/Editor/ must stay as responsibility-based files without nested directories:" >&2
  cat "$TMP_DIR/unexpected-editor-typescript-directories" >&2
  exit 1
fi

find "$ADLAIRE_DESIGN_ROOT" -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name '.gitignore' \
  ! -name '.DS_Store' \
  ! -name 'AGENTS.md' \
  ! -name 'Brand' \
  ! -name 'Docs' \
  ! -name 'EditorUI' \
  ! -name 'Icons' \
  ! -name 'LICENSE' \
  ! -name 'README.md' \
  ! -name 'Samples' \
  ! -name 'Tokens' \
  ! -name 'Tools' \
  ! -name 'TypeScript' \
  ! -name 'UI' \
  -print >"$TMP_DIR/unexpected-top-level"

if [ -s "$TMP_DIR/unexpected-top-level" ]; then
  echo "Adlaire-Design top-level entries must stay within the approved repository structure:" >&2
  cat "$TMP_DIR/unexpected-top-level" >&2
  exit 1
fi

find "$ADLAIRE_DESIGN_ROOT/Docs" -type f \
  ! -name 'Master_Spec' \
  ! -name 'Editor_Master_Spec' \
  ! -name 'Generic_Component_Catalog' \
  ! -name 'Admin_UI_Catalog' \
  ! -name 'WYSIWYG_Editor_UI_Catalog' \
  ! -name 'Icon_Set_Catalog' \
  ! -name 'Brand_Asset_Catalog' \
  ! -name 'Pending_Tasks' \
  ! -name 'Document_Index' \
  -print >"$TMP_DIR/unexpected-docs-files"

if [ -s "$TMP_DIR/unexpected-docs-files" ]; then
  echo "Docs/ must contain only approved source documents:" >&2
  cat "$TMP_DIR/unexpected-docs-files" >&2
  exit 1
fi

find "$ADLAIRE_DESIGN_ROOT/Tokens" -type f \
  ! -name '.gitkeep' \
  ! -name '*.css' \
  -print >"$TMP_DIR/unexpected-token-files"

if [ -s "$TMP_DIR/unexpected-token-files" ]; then
  echo "Tokens/ must contain only CSS source files or .gitkeep:" >&2
  cat "$TMP_DIR/unexpected-token-files" >&2
  exit 1
fi

find "$ADLAIRE_DESIGN_ROOT/UI" "$ADLAIRE_DESIGN_ROOT/EditorUI" -type f \
  ! -name '.gitkeep' \
  ! -name '*.css' \
  ! -name '*.js' \
  -print >"$TMP_DIR/unexpected-ui-files"

if [ -s "$TMP_DIR/unexpected-ui-files" ]; then
  echo "UI/ and EditorUI/ must contain only CSS/JS source files or .gitkeep:" >&2
  cat "$TMP_DIR/unexpected-ui-files" >&2
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

if [ -e "$ADLAIRE_DESIGN_ROOT/WYSIWYG" ]; then
  echo "Adlaire-Design must not contain WYSIWYG/." >&2
  exit 1
fi

if [ ! -x "$ADLAIRE_DESIGN_ROOT/Tools/check/check-adlaire-design.sh" ]; then
  echo "Tools/check/check-adlaire-design.sh must be executable." >&2
  exit 1
fi

find "$ADLAIRE_DESIGN_ROOT/Brand" -type f ! -name '.gitkeep' ! -name 'README.md' -print >"$TMP_DIR/brand-files"
grep -E -v '/(adlaire-logo-[a-z0-9]([a-z0-9-]*[a-z0-9])?\.svg|adlaire-image-[a-z0-9]([a-z0-9-]*[a-z0-9])?\.(png|webp)|adlaire-icon-[a-z0-9]([a-z0-9-]*[a-z0-9])?\.svg|adlaire-ogp-[a-z0-9]([a-z0-9-]*[a-z0-9])?\.(png|webp)|adlaire-brand-[a-z0-9]([a-z0-9-]*[a-z0-9])?\.(svg|png|webp))$' "$TMP_DIR/brand-files" >"$TMP_DIR/unexpected-brand-files" || true

if [ -s "$TMP_DIR/unexpected-brand-files" ]; then
  echo "Brand/ contains unapproved brand asset names or formats:" >&2
  cat "$TMP_DIR/unexpected-brand-files" >&2
  exit 1
fi

while IFS= read -r brand_file; do
  brand_name=$(basename "$brand_file")
  if ! grep -F -- "\`$brand_name\`" "$ADLAIRE_DESIGN_ROOT/Docs/Brand_Asset_Catalog" >/dev/null 2>&1; then
    echo "Brand/ file is missing from Docs/Brand_Asset_Catalog: $brand_name" >&2
    exit 1
  fi
done <"$TMP_DIR/brand-files"

awk -F '|' '
  /^\| AD-BRAND-/ {
    filename = $3
    status = $8
    gsub(/^[ \t`]+|[ \t`]+$/, "", filename)
    gsub(/^[ \t]+|[ \t]+$/, "", status)
    if (status == "実装済み") {
      print filename
    }
  }
' "$ADLAIRE_DESIGN_ROOT/Docs/Brand_Asset_Catalog" >"$TMP_DIR/implemented-brand-assets"

while IFS= read -r brand_name; do
  if [ ! -f "$ADLAIRE_DESIGN_ROOT/Brand/$brand_name" ]; then
    echo "Docs/Brand_Asset_Catalog marks a brand asset as implemented but Brand/ is missing it: $brand_name" >&2
    exit 1
  fi
done <"$TMP_DIR/implemented-brand-assets"

find "$ADLAIRE_DESIGN_ROOT/Icons" -type f ! -name '.gitkeep' ! -name 'README.md' -print >"$TMP_DIR/icon-files"
find "$ADLAIRE_DESIGN_ROOT/Icons" -type f ! -name '.gitkeep' ! -name 'README.md' ! -name '*.svg' -print >"$TMP_DIR/unexpected-icon-format-files"

if [ -s "$TMP_DIR/unexpected-icon-format-files" ]; then
  echo "Icons/ must contain only SVG files, README.md, or .gitkeep:" >&2
  cat "$TMP_DIR/unexpected-icon-format-files" >&2
  exit 1
fi
grep -E -v '/adlaire-icon-(navigation|action|status|content|editor|media|form)-[a-z0-9]([a-z0-9-]*[a-z0-9])?\.svg$' "$TMP_DIR/icon-files" >"$TMP_DIR/unexpected-icon-files" || true

if [ -s "$TMP_DIR/unexpected-icon-files" ]; then
  echo "Icons/ contains unapproved official icon names or formats:" >&2
  cat "$TMP_DIR/unexpected-icon-files" >&2
  exit 1
fi

while IFS= read -r icon_file; do
  icon_name=$(basename "$icon_file")
  if ! grep -F -- "\`$icon_name\`" "$ADLAIRE_DESIGN_ROOT/Docs/Icon_Set_Catalog" >/dev/null 2>&1; then
    echo "Icons/ file is missing from Docs/Icon_Set_Catalog: $icon_name" >&2
    exit 1
  fi
done <"$TMP_DIR/icon-files"

awk -F '|' '
  /^\| AD-ICON-/ {
    filename = $3
    status = $9
    gsub(/^[ \t`]+|[ \t`]+$/, "", filename)
    gsub(/^[ \t]+|[ \t]+$/, "", status)
    if (status == "実装済み") {
      print filename
    }
  }
' "$ADLAIRE_DESIGN_ROOT/Docs/Icon_Set_Catalog" >"$TMP_DIR/implemented-icons"

while IFS= read -r icon_name; do
  if [ ! -f "$ADLAIRE_DESIGN_ROOT/Icons/$icon_name" ]; then
    echo "Docs/Icon_Set_Catalog marks an icon as implemented but Icons/ is missing it: $icon_name" >&2
    exit 1
  fi
done <"$TMP_DIR/implemented-icons"

find "$ADLAIRE_DESIGN_ROOT/Samples" -maxdepth 1 -type f \
  ! -name '.gitkeep' \
  ! -name 'README.md' \
  ! -name '*.png' \
  ! -name '*.webp' \
  -print >"$TMP_DIR/unexpected-sample-root-files"

if [ -s "$TMP_DIR/unexpected-sample-root-files" ]; then
  echo "Samples/ must contain only README.md, PNG/WebP screenshots, or .gitkeep at the root:" >&2
  cat "$TMP_DIR/unexpected-sample-root-files" >&2
  exit 1
fi

find "$ADLAIRE_DESIGN_ROOT/Samples" -mindepth 1 -maxdepth 1 -type d \
  ! -name 'design' \
  -print >"$TMP_DIR/unexpected-sample-directories"

if [ -s "$TMP_DIR/unexpected-sample-directories" ]; then
  echo "Samples/ must contain only Samples/design/ as a subdirectory:" >&2
  cat "$TMP_DIR/unexpected-sample-directories" >&2
  exit 1
fi

find "$ADLAIRE_DESIGN_ROOT/Samples/design" -type f \
  ! -name '.gitkeep' \
  ! -name '*.html' \
  ! -name '*.css' \
  ! -name '*.js' \
  ! -name '*.svg' \
  ! -name '*.png' \
  ! -name '*.webp' \
  -print >"$TMP_DIR/unexpected-sample-design-files"

if [ -s "$TMP_DIR/unexpected-sample-design-files" ]; then
  echo "Samples/design/ must contain only HTML/CSS/JS/SVG/PNG/WebP files or .gitkeep:" >&2
  cat "$TMP_DIR/unexpected-sample-design-files" >&2
  exit 1
fi

if [ -e "$ADLAIRE_DESIGN_ROOT/Documents" ]; then
  echo "Adlaire-Design must use Docs/, not Documents/." >&2
  exit 1
fi

if find "$ADLAIRE_DESIGN_ROOT" \
  \( -name 'package.json' -o -name 'package-lock.json' -o -name 'node_modules' \) -print | grep . >/dev/null 2>&1; then
  echo "Adlaire-Design must not use npm or Node.js dependency project files." >&2
  exit 1
fi

if grep -R -E '(^|[^a-zA-Z0-9_])(npm:|node:)' "$ADLAIRE_DESIGN_ROOT/TypeScript" >/dev/null 2>&1; then
  echo "TypeScript/ must not use npm: or node: imports." >&2
  exit 1
fi

if grep -R -E 'from ["'\''](react|vue|svelte|solid-js|preact|lit|@angular/)' "$ADLAIRE_DESIGN_ROOT/TypeScript" >/dev/null 2>&1; then
  echo "TypeScript/ must not import external frontend frameworks." >&2
  exit 1
fi

if find "$ADLAIRE_DESIGN_ROOT" \
  -path "$ADLAIRE_DESIGN_ROOT/.git" -prune -o \
  \( -type d \( -name 'Dist' -o -name 'dist' -o -name 'Build' -o -name 'build' \) \) -print | grep . >/dev/null 2>&1; then
  echo "Adlaire-Design must not create Dist/dist/Build/build directories while build, minify, and bundle are out of scope." >&2
  exit 1
fi

if find "$ADLAIRE_DESIGN_ROOT" -path "$ADLAIRE_DESIGN_ROOT/.git" -prune -o \( -name '*.scss' -o -name '*.sass' -o -name '*.less' -o -name '*.styl' \) -print | grep . >/dev/null 2>&1; then
  echo "Adlaire-Design-System must not use CSS preprocessor source files." >&2
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

if ! grep -F '# Adlaire Design System' "$ADLAIRE_DESIGN_ROOT/README.md" >/dev/null 2>&1; then
  echo "Adlaire-Design README must identify the repository." >&2
  exit 1
fi

if ! grep -F 'Sass/SCSS/Less/Stylus/PostCSS等のCSSプリプロセッサを追加しないこと。' "$ADLAIRE_DESIGN_ROOT/AGENTS.md" >/dev/null 2>&1; then
  echo "Adlaire-Design AGENTS.md must prohibit CSS preprocessors." >&2
  exit 1
fi

if ! grep -F 'CSS/JavaScript生成はDeno TypeScriptで行い、CSS minify、CSS bundle、`Dist/`、`dist/`、`Build/`、`build/`、`*.min.css`、`*.bundle.css`、npm/webpack系フロントエンドビルド設定ファイルを追加しないこと。' "$ADLAIRE_DESIGN_ROOT/AGENTS.md" >/dev/null 2>&1; then
  echo "Adlaire-Design AGENTS.md must document the Deno TypeScript generation policy." >&2
  exit 1
fi

if ! grep -F 'Adlaire-Design-Systemは、デザインシステムを中核に、Deno TypeScript正本からCSS/JavaScript生成物を生成・検査・管理するフロントエンド基盤システムとして扱うこと。' "$ADLAIRE_DESIGN_ROOT/AGENTS.md" >/dev/null 2>&1; then
  echo "Adlaire-Design AGENTS.md must define CSS and WYSIWYG Editor UI as managed scope." >&2
  exit 1
fi

if ! grep -F 'WYSIWYG Editor UIはAdlaire-Design-Systemの仕様対象として管理すること。' "$ADLAIRE_DESIGN_ROOT/AGENTS.md" >/dev/null 2>&1; then
  echo "Adlaire-Design AGENTS.md must document WYSIWYG Editor UI scope." >&2
  exit 1
fi

for agents_operation_term in \
  '作業開始時に `AGENTS.md` を読むと同時に、マージ状況、リモート、ローカル整合性を確認すること。' \
  '整合性確認では、`git status --short --branch`、`git remote -v`、必要に応じた `git fetch backup`、`HEAD` と `backup/main` の一致または差分を確認すること。' \
  'PR作成後のmainへのマージはユーザーが行う。ユーザーが明示的にマージを指示しない限り、作業者はPR作成までに留めること。'; do
  if ! grep -F -- "$agents_operation_term" "$ADLAIRE_DESIGN_ROOT/AGENTS.md" >/dev/null 2>&1; then
    echo "Adlaire-Design AGENTS.md missing required operation term: $agents_operation_term" >&2
    exit 1
  fi
done

if ! grep -F 'Adlaire-Design-Systemは、Adlaire Groupのデザインシステムを中核に、Deno TypeScript正本からCSS/JavaScript生成物を生成・検査・管理するフロントエンド基盤システムである。' "$ADLAIRE_DESIGN_ROOT/README.md" >/dev/null 2>&1; then
  echo "Adlaire-Design README must define CSS and WYSIWYG Editor UI as managed scope." >&2
  exit 1
fi

if ! grep -F '今後の拡充は、Deno TypeScriptによるCSS/JavaScript生成基盤、公開面CSS機能、WYSIWYG Editor UI、Editor本体、生成物整合、再現性検査、ドキュメント整備、ブランド資産の整理を優先する。' "$ADLAIRE_DESIGN_ROOT/README.md" >/dev/null 2>&1; then
  echo "Adlaire-Design README must document the expansion priority policy." >&2
  exit 1
fi

if ! grep -F 'Editor本体とWYSIWYG Editor UIの詳細正本は `Docs/Editor_Master_Spec` とする。' "$ADLAIRE_DESIGN_ROOT/README.md" >/dev/null 2>&1; then
  echo "Adlaire-Design README must identify the editor master spec." >&2
  exit 1
fi

if ! grep -F 'TypeScriptはDenoランタイム環境を前提とし、標準採用ライブラリはDeno標準ライブラリ(`jsr:@std/*`)に限定する。' "$ADLAIRE_DESIGN_ROOT/README.md" >/dev/null 2>&1; then
  echo "Adlaire-Design README must document the Deno TypeScript policy." >&2
  exit 1
fi

if ! grep -F 'npm互換パッケージ、npm依存、Node.js依存、外部フレームワークは例外なく禁止する。' "$ADLAIRE_DESIGN_ROOT/README.md" >/dev/null 2>&1; then
  echo "Adlaire-Design README must prohibit npm, Node.js, and external frameworks." >&2
  exit 1
fi

for readme_responsibility_term in \
  'CSS仕様、CSS生成物、TypeScript正本、JavaScript生成物、トークン、一般CSS汎用部品カタログ、Editor UIカタログ、Editor本体、未タスク管理、検査、利用先プロダクト採用の責務境界は `Docs/Master_Spec` に整理する。' \
  '一般的なCSS汎用部品は `Docs/Generic_Component_Catalog`、エディタUIに関する部品は `Docs/WYSIWYG_Editor_UI_Catalog` で分離管理する。' \
  '未策定または未完了タスクは `Docs/Pending_Tasks` に未完了分だけを集約する。'; do
  if ! grep -F -- "$readme_responsibility_term" "$ADLAIRE_DESIGN_ROOT/README.md" >/dev/null 2>&1; then
    echo "Adlaire-Design README missing responsibility boundary term: $readme_responsibility_term" >&2
    exit 1
  fi
done

if ! grep -F 'CSS minify、CSS bundle、Sass/SCSS等のCSSプリプロセッサは採用しない。' "$ADLAIRE_DESIGN_ROOT/README.md" >/dev/null 2>&1; then
  echo "Adlaire-Design README must document that minify, bundle, and CSS preprocessors are not adopted." >&2
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

if ! grep -F '上記の拡充においても、Sass、SCSS、Less、Stylus、PostCSS、Lightning CSS、独自プリプロセッサ、CSS bundle生成、minify版生成、`Dist/` 作成は採用しない。' "$ADLAIRE_DESIGN_ROOT/Docs/Master_Spec" >/dev/null 2>&1; then
  echo "Docs/Master_Spec must keep build, minify, bundle, and preprocessor work out of current consideration." >&2
  exit 1
fi

if ! grep -F 'WYSIWYG Editor UIはAdlaire-Design採用確定とする。' "$ADLAIRE_DESIGN_ROOT/Docs/Master_Spec" >/dev/null 2>&1; then
  echo "Docs/Master_Spec must document the WYSIWYG UI adoption policy." >&2
  exit 1
fi

if ! grep -F 'WYSIWYG Editor UI仕様、Editor本体、実装境界の全体方針は本書で定め、詳細正本は `Docs/Editor_Master_Spec` とする。' "$ADLAIRE_DESIGN_ROOT/Docs/Master_Spec" >/dev/null 2>&1; then
  echo "Docs/Master_Spec must document the editor master spec boundary." >&2
  exit 1
fi

for css_master_term in \
  '## 1.1 Adlaire-Design-Systemの概念と定義' \
  'Adlaire-Design-Systemは、Adlaire Groupのデザインシステムを中核に、Deno TypeScript正本からCSS/JavaScript生成物を生成・検査・管理するフロントエンド基盤システムである。' \
  'Adlaire-Design-Systemにおけるデザインシステムとは、Adlaire GroupのUI表現を一貫させるための正本体系である。' \
  'Adlaire-Design-Systemにおけるフロントエンド基盤とは、デザイントークン、CSS契約、UI部品、UI JavaScript、アクセシビリティ表示、状態表示、WYSIWYG Editor UI、Editor本体、生成・検査を接続し、利用側が一貫したフロントエンドを構築できるようにする基盤である。' \
  'デザインシステムは、単なるCSS集、テーマ集、部品一覧、ブランドガイドではない。' \
  'デザインシステムは、デザイントークン、CSS契約、UI部品、状態表現、ブランド資産、公式アイコン、WYSIWYG Editor UI、Editor本体、Deno TypeScript正本、CSS/JavaScript生成物、検査条件を同じルールで接続し、利用側が一貫した画面を構築できるようにする。' \
  'Adlaire-Design-Systemは、UI表現、デザイントークン、CSS契約、汎用部品、公式アイコン、ブランド資産、WYSIWYG Editor UI、Editor本体、TypeScript正本、CSS生成物、JavaScript生成物を正本化する。' \
  'Editor本体とWYSIWYG Editor UIの詳細正本は `Docs/Editor_Master_Spec` とする。' \
  'TypeScriptはDenoランタイム環境を前提とし、CSS/JavaScript生成の正本ソースとして管理する。標準採用ライブラリはDeno標準ライブラリ(`jsr:@std/*`)に限定する。parserなどが必要な場合は、明示的な例外採用ライブラリとして管理する。npm互換パッケージ、npm依存、Node.js依存、外部フレームワークは例外なく禁止する。' \
  'Markdown / GFM parserの例外採用ライブラリは `jsr:@deno/gfm@0.12.0` とする。' \
  'MDX parserの例外採用ライブラリは `jsr:@temelj/mdx@0.14.0` とする。' \
  'アクセシビリティ方針は WCAG 2.2 A を参照し、状態や意味を色だけで伝えない。' \
  'Adlaire-Design-Systemのアクセシビリティ方針は WCAG 2.2 A を参照する。' \
  'エラー、警告、成功、情報、フォーカス、選択、入力エラーなどの状態は、色だけで意味を伝えない。' \
  'ブログ・ドキュメント、GitプロバイダーUI、社内ポータル、静的サイトなどの画面種別は、Adlaire-Designの共通部品とルールを適用する代表例として扱う。' \
  'Adlaire-Design-Systemでは、画面種別ごとの専用テーマや専用設計体系は策定しない。' \
  'Adlaire-Design-Systemは、フロントエンド基盤システムとして、UI表現、部品、トークン、資産、CSS契約、Editor本体、TypeScript正本、CSS/JavaScript生成物、検査条件を管理する。' \
  '汎用UI部品とは、公開面、管理面、本文表示、フォーム、ナビゲーション、状態表示で再利用するUI部品である。' \
  'WYSIWYG Editor UI部品とは、WYSIWYG Editorの表示層を構成する専用UI部品である。' \
  'Editor本体とは、Adlaire-Designに統合される安全な構造化コンテンツ編集基盤である。' \
  'Adlaire-Design-SystemのTypeScriptとは、CSS生成、UI JavaScript、Editor UI JavaScript、Editor本体を実装する正本ソースである。' \
  'Adlaire Frontend Compilerとは、Deno TypeScript正本からCSS/JavaScript生成物を生成し、生成物と仕様の整合を検査するAdlaire-Design-System内の生成基盤である。' \
  'Adlaire-Design-SystemのCSSとは、TypeScript正本から生成されるブラウザ表示用CSS生成物である。段階移行中は既存CSSを維持し、移行済み領域から生成物として扱う。' \
  'Adlaire-Design-SystemのJavaScriptとは、TypeScriptから生成するブラウザ実行用の生成物である。' \
  'CSSとJavaScriptは同一ファイルに混在させない。' \
  '公式アイコンセットとは、`Icons/` で管理する汎用UI用SVGアイコンである。' \
  '### 11.11.5 ブランド資産整理の策定仕様' \
  'ブランド資産の補助正本は `Docs/Brand_Asset_Catalog` とする。' \
  '許可するファイル形式は、資産種別ごとに上表へ明記したSVG、PNG、WebPに限定する。JPG、JPEG、GIF、PDF、AI、PSD、EPSは対応しない。' \
  '`<name>` は小文字英数字とハイフンで構成し、先頭と末尾にハイフンを置かない。' \
  'ブランド資産の検査は `Tools/check/check-adlaire-design.sh` で行う。' \
  '### 11.11.6 公式アイコンセット策定仕様' \
  'Adlaire-Design公式アイコンセットは、Adlaire-Designの汎用UI資産として策定する。' \
  '公式アイコンセットの管理先は `Icons/` とし、`Brand/` には含めない。' \
  '公式アイコンセットの正本形式はSVGのみとする。' \
  '公式アイコンの命名規則は `adlaire-icon-<category>-<name>.svg` とする。' \
  '公式アイコンカテゴリは、`navigation`、`action`、`status`、`content`、`editor`、`media`、`form` に固定する。' \
  '公式アイコンセットの補助正本は `Docs/Icon_Set_Catalog` とする。' \
  '公式アイコンSVGの初期セットと拡張セットの実体制作は完了済みとし、SVG実体は `Icons/` で管理する。' \
  '### 11.11.4.1 サンプルデザインとスクリーンショット' \
  'サンプルデザインおよびスクリーンショットは、Adlaire-Designの理解補助と利用イメージの共有を目的として制作できる。' \
  'サンプルデザインおよびスクリーンショットは仕様正本ではない。' \
  'Samples全体の説明は `Samples/README.md` に記録する。' \
  'サンプルデザインは `Samples/design/` に配置する。PNG/WebPスクリーンショットは `Samples/` 直下に配置する。' \
  '### 11.2.1 責務別整理' \
  'Adlaire-Design-Systemの責務は、CSS仕様、CSS生成物、TypeScript正本、JavaScript生成物、トークン、ブランド資産、公式アイコンセット、汎用部品カタログ、Editor UIカタログ、Editor本体、未タスク管理、検査に分けて管理する。' \
  '| 公式アイコンセットカタログ | Adlaire-Design | `Docs/Icon_Set_Catalog` | 公式アイコンの分類、用途、表示サイズ、代替テキスト方針、実装状態 | ブランド資産、アイコン検索や挿入などの利用側処理 |' \
  '| ブランド資産カタログ | Adlaire-Design | `Docs/Brand_Asset_Catalog` | ブランド資産のID、ファイル名、種別、用途、形式、代替テキストまたは説明方針、実装状態 | 汎用UI用の公式アイコンセット |' \
  '| 公式アイコンセット | Adlaire-Design | `Icons/` | 汎用UIで使う公式アイコンSVG | ロゴ、ブランド画像、OGP、PNG/WebP/JPG/JPEG、生成アイコンCSS |' \
  '| CSS生成物 | Adlaire-Design-System | `UI/`、`EditorUI/` | 公開面CSS、汎用部品、本文部品、フォーム、ユーティリティ、WYSIWYG Editor UIスキン、Adlaire-Design仕様CSS層 | CSS minify、bundle、外部CSSフレームワーク、手編集を正本とするCSS |' \
  '| TypeScript正本 | Adlaire-Design-System | `TypeScript/` | CSS生成、UI JavaScript、Editor UI JavaScript、Editor本体の実装正本 | 生成物CSS、生成物JavaScript、外部プロジェクト固有処理 |' \
  '| JavaScript生成物 | Adlaire-Design-System | `UI/*.js`、`EditorUI/wysiwyg.js`、`EditorUI/editor.js` | TypeScriptから生成するブラウザ実行用JavaScript | 手編集の正本JavaScript、CSS定義の内包 |' \
  '| Editor本体 | Adlaire-Design | `TypeScript/Editor/`、`EditorUI/editor.js` | 安全な構造化コンテンツ編集基盤、EditorDocument、ブロック編集、選択範囲、履歴、検証、サニタイズ、保存要求、公開要求、Editorイベント | 保存先への書き込み、Git反映、認証認可、静的サイト生成、プロダクト固有画面処理 |' \
  '| 未タスク管理 | Adlaire-Design | `Docs/Pending_Tasks` | 未策定または未完了タスク | 完了済みタスク |' \
  '未策定または未完了のまま残っているタスクは `Docs/Pending_Tasks` に集約する。' \
  '| Docs | `Docs/Pending_Tasks` | 未策定または未完了タスクの管理 |' \
  '| 未タスク管理 | `Docs/Pending_Tasks`、`Docs/Master_Spec`、`Docs/Document_Index`、`Tools/check/check-adlaire-design.sh` |' \
  '責務別の管理範囲は以下に固定する。' \
  'ファイル責務は以下に整理する。' \
  '責務別の変更単位は以下に固定する。' \
  '責務境界に迷う場合は、一般公開面で再利用するCSS部品を `Docs/Generic_Component_Catalog`、管理画面専用UI部品を `Docs/Admin_UI_Catalog`、エディタUIに関する部品を `Docs/WYSIWYG_Editor_UI_Catalog`、Editor本体を `TypeScript/Editor/` と `EditorUI/editor.js`、汎用UIで使う公式アイコンを `Docs/Icon_Set_Catalog` と `Icons/`、採用・移行を利用先プロダクト側として扱う。' \
  '### 11.2.2 CSSマスター仕様' \
  'Adlaire-Design-SystemのCSSマスター仕様は、本節を正本とする。' \
  'CSSマスター仕様で固定する対象は以下とする。' \
  'CSS層構造は以下に固定する。' \
  'CSS/JavaScript読み込み順は用途別に以下へ固定する。' \
  'CSSファイルの責務境界は以下とする。' \
  'カタログ責務境界は以下に固定する。' \
  'CSS命名規則は以下に固定する。' \
  'CSS値の管理規則は以下に固定する。' \
  'CSS禁止事項は以下に固定する。' \
  'CSS変更管理は以下に固定する。' \
  'CSSマスター仕様の検査条件は以下とする。' \
  'CSS仕様は `Docs/Master_Spec` を正本とする' \
  '一般的なCSS汎用部品は `Docs/Generic_Component_Catalog`、管理画面専用UI部品は `Docs/Admin_UI_Catalog`、WYSIWYG Editor UI専用品は `Docs/WYSIWYG_Editor_UI_Catalog`、公式アイコンセットは `Docs/Icon_Set_Catalog` で一覧管理する' \
  'CSS/JavaScript生成の正本は `TypeScript/` 配下のTypeScriptとする' \
  'CSS生成物は `Tokens/*.css`、`UI/*.css`、`EditorUI/wysiwyg.css`、JavaScript生成物は `UI/*.js`、`EditorUI/wysiwyg.js`、`EditorUI/editor.js` とする' \
  '`Docs/WYSIWYG_Editor_UI_Catalog` は、Adlaire-DesignにおけるエディタUIに関するカタログとして扱う。' \
  'Editor UI専用品は `Docs/Generic_Component_Catalog` に含めない。' \
  '`.adlaire-wysiwyg-` 接頭辞のクラスは `Docs/WYSIWYG_Editor_UI_Catalog` で管理する。' \
  '#### 11.2.3.1 Adlaire Frontend Compiler CSS生成詳細' \
  'Adlaire Frontend CompilerのCSS生成は、Deno TypeScriptで記述した正本データから、既存配置のCSS生成物を再現する工程として扱う。' \
  'CSS生成のTypeScript正本は `TypeScript/CSS/` に置く。`TypeScript/CSS/` はCSS生成専用であり、UI JavaScript、Editor UI JavaScript、Editor本体の実装を含めない。' \
  'CSS生成先は `Tokens/*.css`、`UI/*.css`、`EditorUI/wysiwyg.css` に固定する。生成先を `Dist/`、`Build/`、`Styles/`、`EditorStyles/`、トップレベル `CSS/` へ変更しない。' \
  'CSS生成では、CSS文字列をJavaScript生成物へ埋め込まない。CSSはCSSファイル、JavaScriptはJavaScriptファイルとして生成し、同一ファイルに混在させない。' \
  'CSS生成の入力は、TypeScript内の型付き定義、定数、配列、生成関数に限定する。JSON、YAML、TOML、Sass、SCSS、Less、Stylus、PostCSS設定をCSS生成の正本として追加しない。' \
  'TypeScript正本作成以降は実装工程として扱い、別途実装承認を必要とする。' \
  'Specification layer' \
  'WYSIWYG Editor UI | `EditorUI/wysiwyg.css`、`EditorUI/wysiwyg.js`' \
  '### 11.2.3 TypeScript正本とCSS/JavaScript生成物' \
  '### 11.2.4 Editor本体とWYSIWYG Editor UIの統合仕様' \
  '`TypeScript/Editor/` は責務ベースの少数ファイルに集約し、機能ごとの細分化フォルダを作らない。' \
  '| `TypeScript/Editor/core.ts` | Editor起動、状態保持、command dispatch、Editor全体の接続口 |' \
  '| `TypeScript/Editor/document.ts` | EditorDocument、EditorBlock、block tree、normalize、migration |' \
  '| `TypeScript/Editor/commands.ts` | insert、update、delete、move、split、merge、batch command |' \
  '| `TypeScript/Editor/selection.ts` | logical selection、caret、anchor/focus、selection normalize |' \
  '| `TypeScript/Editor/history.ts` | undo、redo、history entry、batch history |' \
  '| `TypeScript/Editor/validation.ts` | document validation、block validation、sanitize、unsupported block保持 |' \
  '| `TypeScript/Editor/events.ts` | document changed、selection changed、validation changed、save requested等のイベント |' \
  '| `TypeScript/Editor/types.ts` | 共通型、Block種別、Inline種別、Command型、Event型 |' \
  '| `TypeScript/Editor/index.ts` | 公開APIの入口、`EditorUI/editor.js` 生成入口 |' \
  '`TypeScript/Editor/blocks/`、`TypeScript/Editor/inline/`、`TypeScript/Editor/tools/`、`TypeScript/Editor/plugins/`、`TypeScript/Editor/utils/` は作成しない。' \
  'UI側CSSではCSS変数を参照し、HEX値、RGB/RGBA値を直接記述しない' \
  'CSSプリプロセッサを追加しない。' \
  'Deno TypeScript以外のCSS生成処理を追加しない。' \
  'CSS minify、CSS bundleを追加しない。' \
  'CSS実装を伴わない仕様整理'; do
  if ! grep -F -- "$css_master_term" "$ADLAIRE_DESIGN_ROOT/Docs/Master_Spec" >/dev/null 2>&1; then
    echo "Docs/Master_Spec missing required CSS master spec term: $css_master_term" >&2
    exit 1
  fi
done

for generic_catalog_boundary_term in \
  '本ファイルは、Adlaire-Designで扱う汎用部品の分類、実装先、実装状態、非対象を管理する補助正本である。' \
  '本ファイルは一般的なCSS汎用部品のカタログであり、WYSIWYG Editor UI専用品は含めない。' \
  'WYSIWYG Editor UI専用品は `Docs/WYSIWYG_Editor_UI_Catalog` で分離管理する。' \
  '本カタログは一般的なCSS汎用部品、本文固有CSS部品、フォーム部品、ユーティリティを扱う。' \
  '本カタログは部品一覧と実装状態を管理し、未完了タスクの管理は `Docs/Pending_Tasks` に集約する。' \
  '画面種別はデザインシステムの分類軸ではなく、共通部品の利用例として扱う。画面種別ごとの専用テーマや専用設計体系は作らない。' \
  '本章の代表例は、共通UIパターン整理の確定仕様として扱う。' \
  '| 代表的な画面種別 | 必要な汎用部品 |' \
  'WYSIWYG Editor UI専用品、`.adlaire-wysiwyg-` 接頭辞のクラス、Editor UI状態表示は本カタログに含めない。' \
  '汎用部品は WCAG 2.2 A を参照し、状態や意味を色だけで伝えない。' \
  'エラー、警告、成功、情報、フォーカス、選択、入力エラーは、ラベル、文言、境界、アイコン領域、形状などを併用する。' \
  'WYSIWYG Editor UI専用品の実装先である `EditorUI/wysiwyg.css` と `EditorUI/wysiwyg.js` は、本カタログの実装先に含めない。'; do
  if ! grep -F -- "$generic_catalog_boundary_term" "$ADLAIRE_DESIGN_ROOT/Docs/Generic_Component_Catalog" >/dev/null 2>&1; then
    echo "Docs/Generic_Component_Catalog missing required generic/editor catalog boundary term: $generic_catalog_boundary_term" >&2
    exit 1
  fi
done

if grep -F '.adlaire-wysiwyg-' "$ADLAIRE_DESIGN_ROOT/Docs/Generic_Component_Catalog" \
  | grep -v '`.adlaire-wysiwyg-` 接頭辞のクラス' >/dev/null 2>&1; then
  echo "Docs/Generic_Component_Catalog must not list concrete WYSIWYG Editor UI classes." >&2
  exit 1
fi

for wysiwyg_spec_term in \
  '### 11.11.2.3 WYSIWYG Editor UIマスター仕様' \
  '本節は、Adlaire-DesignにおけるWYSIWYG Editor UIのマスター仕様である。' \
  'WYSIWYG Editor UIマスター仕様' \
  'WYSIWYG Editor UI仕様、Editor本体、実装境界の詳細正本は `Docs/Editor_Master_Spec` とする。`Docs/WYSIWYG_Editor_UI_Catalog` は、エディタUI部品の分類、優先度、実装状態を管理する。' \
  'Editor UI完全固定対象は以下とする。' \
  'Editor UI階層は以下に固定する。' \
  'Editor UI表示モードは以下に固定する。' \
  '状態入力の受け方は以下に固定する。' \
  'WYSIWYG Editor UIは、Editor.jsおよびNotionに代表されるブロックベース編集UIを参照し、1ブロックを1編集単位として扱う表示層を提供する。' \
  'ブロックベースアーキテクチャのUI方針は以下とする。' \
  'ブロック表示契約は以下とする。' \
  'モバイルファーストUI方針は以下とする。' \
  'レスポンシブ境界は以下とする。' \
  'WYSIWYG Editor UIの機能優先度は以下とする。' \
  '追加のUI機能は以下とする。' \
  'アクセシビリティUI方針は以下とする。' \
  'WCAG 2.2 Aを参照し、状態表示は色だけに依存しない' \
  'ツールバー選択、ブロック選択、補助表示は色以外の手掛かりを併用する' \
  'プレビュー/JSON表示UIは以下とする。' \
  'Editor UI完全固定後の変更管理は以下とする。' \
  'Master_Spec、カタログ、CSS、検査シェルのいずれかだけを単独で変更しない。' \
  'Adlaire-Designで固定する対象は以下とする。' \
  '採用確定対象は以下とする。' \
  'WYSIWYG Editor UIは、表示層、UI部品、状態表示、CSS/JavaScript読み込み順、Editor UI JavaScript、Editor本体との接続点を仕様対象とする。' \
  'WYSIWYG Editor UIでAdlaire-Designを採用する際の読み込み順は以下に固定する。' \
  '`EditorUI/wysiwyg.css` は、以下のクラスを定義する。' \
  '`EditorUI/wysiwyg.js` は以下の規則に従う。' \
  'CSS内では `Editor UI common structure`、`Priority A: core block editor UI`、`Editor UI state classes`、`Priority B: editing support UI`、`Priority C: advanced support UI` の実装境界を持つ。' \
  '優先A/B/Cの部品は `Docs/WYSIWYG_Editor_UI_Catalog` の分類をCSS実装順と実装確認単位にする。' \
  'Adlaire-Designが定義するUI classは、HTMLまたは表示層に適用できる形式とする。' \
  '上記のブロック種別は、Editor UI上の表示想定として扱う。' \
  'Adlaire-Designが定義するUI classは、特定のEditor実装形式に依存しない。'; do
  if ! grep -F -- "$wysiwyg_spec_term" "$ADLAIRE_DESIGN_ROOT/Docs/Master_Spec" >/dev/null 2>&1; then
    echo "Docs/Master_Spec missing required fixed WYSIWYG UI spec term: $wysiwyg_spec_term" >&2
    exit 1
  fi
done

for master_wysiwyg_term in \
  'WYSIWYG Editor UIはAdlaire-Design採用確定とする。' \
  'WYSIWYG Editor UI仕様、Editor本体、実装境界の全体方針は本書で定め、詳細正本は `Docs/Editor_Master_Spec` とする。'; do
  if ! grep -F -- "$master_wysiwyg_term" "$ADLAIRE_DESIGN_ROOT/Docs/Master_Spec" >/dev/null 2>&1; then
    echo "Docs/Master_Spec missing required fixed WYSIWYG spec term: $master_wysiwyg_term" >&2
    exit 1
  fi
done

if grep -F 'Docs/WYSIWYG_Editor_Specification' "$ADLAIRE_DESIGN_ROOT/Docs/Document_Index" >/dev/null 2>&1; then
  echo "Docs/Document_Index must not reference removed Docs/WYSIWYG_Editor_Specification." >&2
  exit 1
fi

for wysiwyg_catalog_term in \
  '# Adlaire-Design WYSIWYG Editor UIカタログ' \
  'WYSIWYG Editor専用UI部品の一覧を管理する補助正本' \
  '本ファイルは、Adlaire-DesignにおけるエディタUIに関するカタログである。' \
  '本カタログはエディタUIに関するカタログとして扱う。' \
  'WYSIWYG Editor UI仕様は `Docs/Editor_Master_Spec` で固定し、UI部品一覧は本カタログで管理する。' \
  '## 1.1 完全固定対象' \
  'Editor.jsおよびNotionに代表されるブロックベース編集UI' \
  'UI階層' \
  '表示モード' \
  '状態入力' \
  'レスポンシブ境界' \
  '## 1.2 UI階層' \
  '## 1.3 表示モード' \
  '## 1.4 状態入力' \
  '## 1.5 レスポンシブ境界' \
  '## 1.6 アクセシビリティUI' \
  '## 1.7 Preview / JSON表示UI' \
  '## 1.8 変更管理' \
  'keyboard focusの視認性を確保する' \
  'WCAG 2.2 Aを参照し、状態表示は色だけに依存しない' \
  'ツールバー選択、ブロック選択、補助表示は色以外の手掛かりを併用する' \
  'data属性名を固定しない' \
  'Preview | `.adlaire-wysiwyg-preview`' \
  'JSON panel | `.adlaire-wysiwyg-json-panel`' \
  'WYSIWYG Editor UIカタログは、Editor UI部品の状態、優先度、実装先を管理する完成カタログとして扱う。' \
  '`EditorUI/wysiwyg.css` は、本カタログの優先A/B/C分類を実装確認単位として扱う。' \
  '変更管理' \
  '## 2. 共通構造クラス' \
  '## 3. 優先A' \
  '## 4. 優先B' \
  '## 5. 優先C' \
  '## 6. 状態クラス' \
  'Canvas' \
  'Block' \
  'Preview' \
  'JSON panel' \
  '.adlaire-wysiwyg-canvas' \
  '.adlaire-wysiwyg-block-content' \
  '.adlaire-wysiwyg-block-label' \
  '.adlaire-wysiwyg-block-progress' \
  '.adlaire-wysiwyg-preview' \
  '.adlaire-wysiwyg-json-panel' \
  'Mobile bottom sheet' \
  'Transform menu' \
  'Publish check' \
  'Assist suggestion'; do
  if ! grep -F -- "$wysiwyg_catalog_term" "$ADLAIRE_DESIGN_ROOT/Docs/WYSIWYG_Editor_UI_Catalog" >/dev/null 2>&1; then
    echo "Docs/WYSIWYG_Editor_UI_Catalog missing required catalog term: $wysiwyg_catalog_term" >&2
    exit 1
  fi
done

if ! sed -n 's/^\*\*Version:\*\* \(rev\.[0-9][0-9]*\)$/\1/p' "$ADLAIRE_DESIGN_ROOT/Docs/Master_Spec" | grep . >/dev/null 2>&1; then
  echo "Docs/Master_Spec must include a Version line in the form: **Version:** rev.N" >&2
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
  Docs/Editor_Master_Spec \
  Docs/Generic_Component_Catalog \
  Docs/WYSIWYG_Editor_UI_Catalog \
  Docs/Icon_Set_Catalog \
  Docs/Brand_Asset_Catalog \
  Docs/Pending_Tasks \
  Brand/ \
  Brand/README.md \
  Icons/ \
  Samples/README.md \
  Samples/design/ \
  Tokens/colors.css \
  Tokens/surface.css \
  Tokens/status.css \
  Tokens/effects.css \
  UI/adlaire.css \
  UI/base.css \
  UI/grid.css \
  UI/layout.css \
  UI/components.css \
  UI/components.js \
  UI/site.css \
  UI/forms.css \
  UI/forms.js \
  UI/content.css \
  UI/content.js \
  EditorUI/wysiwyg.css \
  EditorUI/wysiwyg.js \
  EditorUI/editor.js \
  TypeScript/ \
  TypeScript/UI/components.ts \
  TypeScript/UI/content.ts \
  TypeScript/UI/forms.ts \
  TypeScript/EditorUI/wysiwyg.ts \
  UI/utilities.css \
  UI/compat-agws.css \
  Tools/check/check-adlaire-design.sh; do
  if ! grep -F -- "$indexed_path" "$ADLAIRE_DESIGN_ROOT/Docs/Document_Index" >/dev/null 2>&1; then
    echo "Adlaire-Design Document_Index must reference $indexed_path." >&2
    exit 1
  fi
done

for document_index_responsibility_term in \
  '`Docs/Master_Spec`(仕様・設計の正本、Adlaire Frontend Compiler、CSS生成方針、Editor UI、Editor本体、TypeScript正本、CSS/JavaScript生成物、公式アイコンセット、Samples、カタログ責務索引)' \
  '`Docs/Editor_Master_Spec`(Editor本体とWYSIWYG Editor UIの専用マスター仕様)' \
  '`Docs/Generic_Component_Catalog`(一般的なCSS汎用部品の分類、優先度、実装先、実装状態の一覧)' \
  '`Docs/Admin_UI_Catalog`(管理画面専用UI部品の分類、優先度、実装先、実装状態の一覧)' \
  '`Docs/WYSIWYG_Editor_UI_Catalog`(エディタUIに関する部品の分類、優先度、実装先、実装状態の一覧)' \
  '`Docs/Icon_Set_Catalog`(Adlaire-Design公式アイコンセットの分類、用途、実装状態の一覧)' \
  '`Docs/Brand_Asset_Catalog`(ブランド資産のID、ファイル名、種別、用途、形式、代替テキストまたは説明方針、実装状態の一覧)' \
  '`Docs/Pending_Tasks`(未策定または未完了タスクだけを集約する管理ファイル)' \
  '`Brand/README.md`(ブランド資産の配置ルール、許可形式、命名規則、公式アイコンセットとの境界)' \
  '`TypeScript/`(CSS生成、UI JavaScript、Editor UI JavaScript、Editor本体のTypeScript正本。Editor本体は責務ベースの少数ファイルで集約)' \
  '`TypeScript/CSS/`(Adlaire Frontend CompilerのCSS生成TypeScript正本)'; do
  if ! grep -F -- "$document_index_responsibility_term" "$ADLAIRE_DESIGN_ROOT/Docs/Document_Index" >/dev/null 2>&1; then
    echo "Docs/Document_Index missing responsibility description: $document_index_responsibility_term" >&2
    exit 1
  fi
done

for brand_readme_term in \
  '# Adlaire-Design Brand Assets' \
  '`Brand/` は、Adlaire-Designで管理するブランド資産の配置領域である。' \
  'JPG、JPEG、GIF、PDF、AI、PSD、EPSは対応しない。' \
  '`Brand/` は、CSS、デザイントークン、汎用UI部品、WYSIWYG Editor UI部品、公式アイコンセットの置き場ではない。' \
  '汎用UIで使う公式アイコンセットは `Icons/` と `Docs/Icon_Set_Catalog` で管理する。' \
  'ブランド資産を追加する場合は、`Docs/Brand_Asset_Catalog` にID、ファイル名、種別、用途、形式、代替テキストまたは説明方針、実装状態を記録する。'; do
  if ! grep -F -- "$brand_readme_term" "$ADLAIRE_DESIGN_ROOT/Brand/README.md" >/dev/null 2>&1; then
    echo "Brand/README.md missing required brand asset operation term: $brand_readme_term" >&2
    exit 1
  fi
done

for brand_asset_catalog_term in \
  '# Adlaire-Design ブランド資産カタログ' \
  '本カタログは、`Brand/` 配下で管理するブランド資産の補助正本である。' \
  'ブランド資産IDは `AD-BRAND-001` から連番で付与する。' \
  '| ID | ファイル名 | 種別 | 用途 | 形式 | 代替テキスト/説明方針 | 状態 |' \
  '現時点では、実ブランド資産は未配置であり、`Brand/.gitkeep` のみを空ディレクトリ維持用に許可する。' \
  'JPG、JPEG、GIF、PDF、AI、PSD、EPSは対応しない。'; do
  if ! grep -F -- "$brand_asset_catalog_term" "$ADLAIRE_DESIGN_ROOT/Docs/Brand_Asset_Catalog" >/dev/null 2>&1; then
    echo "Docs/Brand_Asset_Catalog missing required brand asset catalog term: $brand_asset_catalog_term" >&2
    exit 1
  fi
done

for editor_master_term in \
  '# Adlaire-Design-System Editor Master Spec' \
  '本書は、Adlaire-Design-Systemに統合するEditor本体とWYSIWYG Editor UIの専用マスター仕様である。' \
  '`Docs/Master_Spec` はAdlaire-Design-System全体正本とし、Editor本体とエディタUIの詳細正本は本書とする。' \
  'TypeScriptはDenoランタイム環境を前提とし、CSS/JavaScript生成の正本ソースとして管理する。npm互換パッケージ、npm依存、Node.js依存、外部フレームワークは例外なく禁止する。' \
  'Adlaire-Design-Systemのエディタは、安全な構造化コンテンツ編集基盤として管理する。' \
  '| Editor本体TypeScript正本 | `TypeScript/Editor/` | 文書構造、編集操作、検証、履歴、イベントの正本 |' \
  '| Editor本体JavaScript生成物 | `EditorUI/editor.js` | ブラウザ実行用の生成物 |' \
  '| WYSIWYG Editor UI CSS生成物 | `EditorUI/wysiwyg.css` | エディタ表示層のCSS生成物 |' \
  '| WYSIWYG Editor UI部品カタログ | `Docs/WYSIWYG_Editor_UI_Catalog` | エディタUI部品の分類、優先度、実装状態 |' \
  '標準採用ライブラリはDeno標準ライブラリ(`jsr:@std/*`)に限定する。' \
  'Markdown / GFM parserは `jsr:@deno/gfm@0.12.0`、MDX parserは `jsr:@temelj/mdx@0.14.0` を明示的な例外採用ライブラリとして管理する。' \
  'Editor本体は保存先への書き込み、Git反映、認証認可、静的サイト生成、CMS固有処理を実行しない。これらは要求イベントとして外部へ渡す。' \
  '標準commandは `insert-block`、`delete-block`、`update-block`、`move-block`、`split-block`、`merge-block`、`set-document-meta`、`set-selection`、`save`、`request-publish` とする。' \
  '`TypeScript/` に `npm:` import、`node:` import、npm依存、Node.js依存が存在しないこと。' \
  '`EditorUI/editor.js` は `window.AdlaireEditor`、`HeadlessEditorController`、`ToolRegistry`、`createEditor`、`applyCommand`、`handlePaste`、`validateDocument`、`sanitizeDocument` を公開すること。'; do
  if ! grep -F -- "$editor_master_term" "$ADLAIRE_DESIGN_ROOT/Docs/Editor_Master_Spec" >/dev/null 2>&1; then
    echo "Docs/Editor_Master_Spec missing required term: $editor_master_term" >&2
    exit 1
  fi
done

for pending_task_term in \
  '# Adlaire-Design 未タスク' \
  '本ファイルには未完了タスクだけを記載する。' \
  'タスクを完了した場合は、該当行を削除する。' \
  '完了済みタスクの保管場所として使わない。' \
  '未実装リストには、仕様確定済みで実装だけが未完了の項目だけを記載する。' \
  '仕様未確定、要否未決定、策定中の項目は未実装リストに含めない。' \
  '## 3. 未実装リスト' \
  '本章は、仕様確定済みで、実装だけが未完了の項目を管理する。' \
  'AD-TASK-037' \
  'CSS生成TypeScript正本の実装。`TypeScript/CSS/` にToken CSS、UI CSS、Editor UI CSSを生成する正本を作成する。' \
  'AD-TASK-038' \
  'Token CSS生成への移行。`Tokens/*.css` をTypeScript正本から再現できる生成物へ移行する。' \
  'AD-TASK-039' \
  'UI CSS生成への移行。`UI/*.css` をTypeScript正本から再現できる生成物へ移行する。' \
  'AD-TASK-040' \
  'Editor UI CSS生成への移行。`EditorUI/wysiwyg.css` をTypeScript正本から再現できる生成物へ移行する。' \
  'AD-TASK-041' \
  'CSS生成物整合検査の実装。生成物がTypeScript正本から再現可能であることを検査する。' \
  '現時点で該当なし'; do
  if ! grep -F -- "$pending_task_term" "$ADLAIRE_DESIGN_ROOT/Docs/Pending_Tasks" >/dev/null 2>&1; then
    echo "Docs/Pending_Tasks missing required pending task management term: $pending_task_term" >&2
    exit 1
  fi
done

check_catalog_classes generic "$ADLAIRE_DESIGN_ROOT/Docs/Generic_Component_Catalog" '^\.adlaire-wysiwyg$' \
  "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" \
  "$ADLAIRE_DESIGN_ROOT/UI/base.css" \
  "$ADLAIRE_DESIGN_ROOT/UI/grid.css" \
  "$ADLAIRE_DESIGN_ROOT/UI/layout.css" \
  "$ADLAIRE_DESIGN_ROOT/UI/components.css" \
  "$ADLAIRE_DESIGN_ROOT/UI/site.css" \
  "$ADLAIRE_DESIGN_ROOT/UI/forms.css" \
  "$ADLAIRE_DESIGN_ROOT/UI/content.css" \
  "$ADLAIRE_DESIGN_ROOT/UI/utilities.css" \
  "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css"

check_catalog_classes admin "$ADLAIRE_DESIGN_ROOT/Docs/Admin_UI_Catalog" '' \
  "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" \
  "$ADLAIRE_DESIGN_ROOT/UI/base.css" \
  "$ADLAIRE_DESIGN_ROOT/UI/grid.css" \
  "$ADLAIRE_DESIGN_ROOT/UI/layout.css" \
  "$ADLAIRE_DESIGN_ROOT/UI/components.css" \
  "$ADLAIRE_DESIGN_ROOT/UI/site.css" \
  "$ADLAIRE_DESIGN_ROOT/UI/forms.css" \
  "$ADLAIRE_DESIGN_ROOT/UI/content.css" \
  "$ADLAIRE_DESIGN_ROOT/UI/utilities.css" \
  "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css"

check_catalog_classes wysiwyg "$ADLAIRE_DESIGN_ROOT/Docs/WYSIWYG_Editor_UI_Catalog" '' \
  "$ADLAIRE_DESIGN_ROOT/EditorUI/wysiwyg.css"

for semantic_token in \
  '--adlaire-semantic-danger-color' \
  '--adlaire-semantic-success-color' \
  '--adlaire-semantic-warning-color' \
  '--adlaire-semantic-info-color' \
  '--adlaire-semantic-focus-ring' \
  '--adlaire-semantic-selected-bg' \
  '--adlaire-semantic-muted-text'; do
  if ! grep -F -- "$semantic_token" "$ADLAIRE_DESIGN_ROOT/Tokens/status.css" >/dev/null 2>&1; then
    echo "Tokens/status.css missing required semantic token alias: $semantic_token" >&2
    exit 1
  fi
done

for semantic_usage in \
  '--adlaire-semantic-danger-color' \
  '--adlaire-semantic-focus-ring' \
  '--adlaire-semantic-selected-border'; do
  if ! grep -R -F -- "$semantic_usage" "$ADLAIRE_DESIGN_ROOT/UI" "$ADLAIRE_DESIGN_ROOT/EditorUI" >/dev/null 2>&1; then
    echo "UI or EditorUI CSS missing semantic token usage: $semantic_usage" >&2
    exit 1
  fi
done

for sample_term in \
  '汎用UI、Admin UI、公式アイコン、WYSIWYG Editor UI、Git Provider UI' \
  'Samples/sample-current.png'; do
  if ! grep -F -- "$sample_term" "$ADLAIRE_DESIGN_ROOT/Samples/README.md" "$ADLAIRE_DESIGN_ROOT/Samples/design/index.html" >/dev/null 2>&1; then
    echo "Samples documentation or design missing required sample term: $sample_term" >&2
    exit 1
  fi
done

OLD_REPOSITORY_NAME='Adlaire-''Eco''system-Design'

if grep -R -n "$OLD_REPOSITORY_NAME" "$ADLAIRE_DESIGN_ROOT/AGENTS.md" "$ADLAIRE_DESIGN_ROOT/README.md" "$ADLAIRE_DESIGN_ROOT/Docs/Master_Spec" "$ADLAIRE_DESIGN_ROOT/Docs/Generic_Component_Catalog" "$ADLAIRE_DESIGN_ROOT/Docs/WYSIWYG_Editor_UI_Catalog" "$ADLAIRE_DESIGN_ROOT/Docs/Icon_Set_Catalog" "$ADLAIRE_DESIGN_ROOT/Docs/Brand_Asset_Catalog" "$ADLAIRE_DESIGN_ROOT/Docs/Pending_Tasks" "$ADLAIRE_DESIGN_ROOT/Docs/Document_Index" >/tmp/adlaire-design-old-name-matches 2>/dev/null; then
  echo "current Adlaire-Design documents must not use the old repository name:" >&2
  cat /tmp/adlaire-design-old-name-matches >&2
  exit 1
fi

REMOVED_EDITOR_PROJECT_NAME='Au''teur'

if grep -R -n "$REMOVED_EDITOR_PROJECT_NAME" "$ADLAIRE_DESIGN_ROOT/AGENTS.md" "$ADLAIRE_DESIGN_ROOT/README.md" "$ADLAIRE_DESIGN_ROOT/Docs" "$ADLAIRE_DESIGN_ROOT/Tools/check/check-adlaire-design.sh" >/tmp/adlaire-design-editor-project-name-matches 2>/dev/null; then
  echo "current Adlaire-Design documents must not use removed editor project references:" >&2
  cat /tmp/adlaire-design-editor-project-name-matches >&2
  exit 1
fi

for catalog_term in \
  '# Adlaire-Design 汎用部品カタログ' \
  '補助正本' \
  '## 3. 優先A' \
  '## 4. 優先B' \
  '## 5. 優先C' \
  '## 6. JavaScriptあり実装済み部品' \
  '## 6.2 原則対象外' \
  'ツールバー' \
  '縦積み' \
  '横並び' \
  'チップ' \
  'ステータスラベル' \
  'ステータス点' \
  'サーフェスグリッド' \
  'サーフェス項目' \
  'エラーページ' \
  '多言語化UI' \
  '.adlaire-language-switcher'; do
  if ! grep -F -- "$catalog_term" "$ADLAIRE_DESIGN_ROOT/Docs/Generic_Component_Catalog" >/dev/null 2>&1; then
    echo "Docs/Generic_Component_Catalog missing required catalog term: $catalog_term" >&2
    exit 1
  fi
done

if grep -R -n -E '保留|ページネーション\(保留\)|絞り込みチップ\(保留\)|JavaScriptによる表示制御|CSSだけで成立|JavaScriptなしで成立|対象外として実装しない' "$ADLAIRE_DESIGN_ROOT/Docs/Generic_Component_Catalog" "$ADLAIRE_DESIGN_ROOT/Docs/Master_Spec" >/tmp/adlaire-design-unimplemented-doc-matches 2>/dev/null; then
  echo "current Master_Spec and Generic_Component_Catalog must not contain unresolved implementation terms:" >&2
  cat /tmp/adlaire-design-unimplemented-doc-matches >&2
  exit 1
fi

if grep -R -n '@import' "$ADLAIRE_DESIGN_ROOT/Tokens/colors.css" "$ADLAIRE_DESIGN_ROOT/Tokens/surface.css" "$ADLAIRE_DESIGN_ROOT/Tokens/status.css" "$ADLAIRE_DESIGN_ROOT/Tokens/effects.css" "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" "$ADLAIRE_DESIGN_ROOT/UI/base.css" "$ADLAIRE_DESIGN_ROOT/UI/grid.css" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" "$ADLAIRE_DESIGN_ROOT/UI/components.css" "$ADLAIRE_DESIGN_ROOT/UI/site.css" "$ADLAIRE_DESIGN_ROOT/UI/forms.css" "$ADLAIRE_DESIGN_ROOT/UI/content.css" "$ADLAIRE_DESIGN_ROOT/EditorUI/wysiwyg.css" "$ADLAIRE_DESIGN_ROOT/UI/utilities.css" "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css" >/tmp/adlaire-design-css-import-matches 2>/dev/null; then
  echo "Adlaire-Design CSS files must not use @import:" >&2
  cat /tmp/adlaire-design-css-import-matches >&2
  exit 1
fi

if grep -R -n '@charset' "$ADLAIRE_DESIGN_ROOT/Tokens/colors.css" "$ADLAIRE_DESIGN_ROOT/Tokens/surface.css" "$ADLAIRE_DESIGN_ROOT/Tokens/status.css" "$ADLAIRE_DESIGN_ROOT/Tokens/effects.css" "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" "$ADLAIRE_DESIGN_ROOT/UI/base.css" "$ADLAIRE_DESIGN_ROOT/UI/grid.css" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" "$ADLAIRE_DESIGN_ROOT/UI/components.css" "$ADLAIRE_DESIGN_ROOT/UI/site.css" "$ADLAIRE_DESIGN_ROOT/UI/forms.css" "$ADLAIRE_DESIGN_ROOT/UI/content.css" "$ADLAIRE_DESIGN_ROOT/EditorUI/wysiwyg.css" "$ADLAIRE_DESIGN_ROOT/UI/utilities.css" "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css" >/tmp/adlaire-design-css-charset-matches 2>/dev/null; then
  echo "Adlaire-Design CSS files must not use @charset:" >&2
  cat /tmp/adlaire-design-css-charset-matches >&2
  exit 1
fi

if grep -R -n '!important' "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" "$ADLAIRE_DESIGN_ROOT/UI/base.css" "$ADLAIRE_DESIGN_ROOT/UI/grid.css" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" "$ADLAIRE_DESIGN_ROOT/UI/components.css" "$ADLAIRE_DESIGN_ROOT/UI/site.css" "$ADLAIRE_DESIGN_ROOT/UI/forms.css" "$ADLAIRE_DESIGN_ROOT/UI/content.css" "$ADLAIRE_DESIGN_ROOT/EditorUI/wysiwyg.css" "$ADLAIRE_DESIGN_ROOT/UI/utilities.css" "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css" >/tmp/adlaire-design-css-important-matches 2>/dev/null; then
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

if [ "$(sed -n '1p' "$ADLAIRE_DESIGN_ROOT/EditorUI/wysiwyg.css")" != '/* Adlaire-Design WYSIWYG editor */' ]; then
  echo "EditorUI/wysiwyg.css must start with the required comment." >&2
  exit 1
fi

if [ "$(sed -n '1p' "$ADLAIRE_DESIGN_ROOT/UI/components.js")" != '/* Adlaire-Design component interactions */' ]; then
  echo "UI/components.js must start with the required comment." >&2
  exit 1
fi

if [ "$(sed -n '1p' "$ADLAIRE_DESIGN_ROOT/UI/content.js")" != '/* Adlaire-Design content interactions */' ]; then
  echo "UI/content.js must start with the required comment." >&2
  exit 1
fi

if [ "$(sed -n '1p' "$ADLAIRE_DESIGN_ROOT/UI/forms.js")" != '/* Adlaire-Design form interactions */' ]; then
  echo "UI/forms.js must start with the required comment." >&2
  exit 1
fi

if [ "$(sed -n '1p' "$ADLAIRE_DESIGN_ROOT/EditorUI/wysiwyg.js")" != '/* Adlaire-Design WYSIWYG editor interactions */' ]; then
  echo "EditorUI/wysiwyg.js must start with the required comment." >&2
  exit 1
fi

if [ "$(sed -n '1p' "$ADLAIRE_DESIGN_ROOT/EditorUI/editor.js")" != '/* Adlaire-Design editor core */' ]; then
  echo "EditorUI/editor.js must start with the required comment." >&2
  exit 1
fi

for editor_term in \
  'window.AdlaireEditor' \
  'HeadlessEditorController' \
  'ToolRegistry' \
  'EventBus' \
  'History' \
  'applyCommand' \
  'createEditor' \
  'createEmptyDocument' \
  'createBlock' \
  'createDefaultBlockRegistry' \
  'createDefaultInlineTools' \
  'createDefaultToolRegistry' \
  'getFirstBlockPosition' \
  'getLastBlockPosition' \
  'getNextBlockPosition' \
  'getPreviousBlockPosition' \
  'handlePaste' \
  'normalizeBlock' \
  'validateBlock' \
  'validateDocumentAsync' \
  'sanitizeDocument' \
  'validateDocument'; do
  if ! grep -F -- "$editor_term" "$ADLAIRE_DESIGN_ROOT/EditorUI/editor.js" >/dev/null 2>&1; then
    echo "EditorUI/editor.js missing required editor API term: $editor_term" >&2
    exit 1
  fi
done

if [ "$(sed -n '1p' "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css")" != '/* Adlaire-Design specification layer */' ]; then
  echo "UI/compat-agws.css must start with the required comment." >&2
  exit 1
fi

for term in \
  'data-adlaire-dismiss' \
  'data-adlaire-carousel-action' \
  'data-adlaire-carousel-index' \
  '[data-adlaire-toggle][href]' \
  'containFocus' \
  'is-current' \
  'Escape' \
  'adlaire-overlay-open'; do
  if ! grep -F -- "$term" "$ADLAIRE_DESIGN_ROOT/UI/components.js" >/dev/null 2>&1; then
    echo "UI/components.js missing required interaction term: $term" >&2
    exit 1
  fi
done

for term in \
  'data-adlaire-sort' \
  'Date.parse' \
  'if (!leftHasValue || Number.isNaN(leftNumber))' \
  'if (!leftHasValue || Number.isNaN(leftDate))' \
  'return 1;' \
  'aria-sort'; do
  if ! grep -F -- "$term" "$ADLAIRE_DESIGN_ROOT/UI/content.js" >/dev/null 2>&1; then
    echo "UI/content.js missing required interaction term: $term" >&2
    exit 1
  fi
done

for term in \
  'data-adlaire-filter-count' \
  'data-adlaire-filter-empty' \
  'split(/\s+/)' \
  'groups.indexOf(filter)' \
  'visibleCount'; do
  if ! grep -F -- "$term" "$ADLAIRE_DESIGN_ROOT/UI/forms.js" >/dev/null 2>&1; then
    echo "UI/forms.js missing required interaction term: $term" >&2
    exit 1
  fi
done

if grep -F -- 'slide.hidden' "$ADLAIRE_DESIGN_ROOT/UI/components.js" >/dev/null 2>&1; then
  echo "UI/components.js must not collapse carousel slides with hidden during movement." >&2
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
  '--adlaire-color-agws-blue-primary: #0066cc;' \
  '--adlaire-color-agws-blue-secondary: #0055aa;' \
  '--adlaire-color-agws-blue-accent: #004499;' \
  '--adlaire-color-agws-green-primary: #00a968;' \
  '--adlaire-color-agws-green-secondary: #58be89;' \
  '--adlaire-color-agws-green-accent: #40aaef;' \
  '--adlaire-color-primary: var(--adlaire-color-agws-blue-primary);' \
  '--adlaire-color-secondary: var(--adlaire-color-agws-blue-secondary);' \
  '--adlaire-color-accent: var(--adlaire-color-agws-blue-accent);' \
  '--adlaire-color-surface: #f5f5f5;' \
  '--adlaire-color-border: #e0e0e0;' \
  '--adlaire-color-support: var(--adlaire-color-agws-green-primary);'; do
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
  '.adlaire-content-container' \
  '.adlaire-grid-row' \
  '.adlaire-grid-col' \
  '.container' \
  '.row' \
  '.col'; do
  if ! grep -F -- "$class" "$ADLAIRE_DESIGN_ROOT/UI/grid.css" >/dev/null 2>&1; then
    echo "UI/grid.css missing required class: $class" >&2
    exit 1
  fi
done

for class in \
  '.adlaire-page' \
  '.adlaire-site-header' \
  '.adlaire-site-title' \
  '.adlaire-site-tagline' \
  '.adlaire-site-nav' \
  '.adlaire-nav-button' \
  '.adlaire-site-footer' \
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
  '.adlaire-form-group' \
  '.adlaire-form-label' \
  '.adlaire-form-control' \
  '.adlaire-form-check' \
  '.adlaire-button' \
  '.adlaire-button-primary' \
  '.adlaire-button-secondary' \
  '.adlaire-button-outline' \
  '.adlaire-button-disabled' \
  '.adlaire-button-submit' \
  '.adlaire-filter' \
  '.adlaire-filter-row' \
  '.adlaire-filter-input' \
  '.adlaire-filter-count' \
  '.adlaire-filter-item' \
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

for selector in \
  '.adlaire-form-label.required::after' \
  'textarea.adlaire-form-control' \
  'select.adlaire-form-control' \
  '.adlaire-form-control:focus' \
  '.adlaire-button:hover' \
  '.adlaire-button-primary:hover' \
  '.adlaire-button-secondary:hover' \
  '.adlaire-button-outline:hover' \
  '.adlaire-button-submit:hover' \
  '.adlaire-button-submit:disabled'; do
  if ! grep -F -- "$selector" "$ADLAIRE_DESIGN_ROOT/UI/forms.css" >/dev/null 2>&1; then
    echo "UI/forms.css missing required selector: $selector" >&2
    exit 1
  fi
done

for declaration in \
  'scroll-margin-top: 20px;' \
  'padding-right: 20px;' \
  'padding-left: 20px;' \
  'font: inherit;'; do
  if ! grep -F -- "$declaration" "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css" >/dev/null 2>&1; then
    echo "UI/compat-agws.css missing required Adlaire-Design specification declaration: $declaration" >&2
    exit 1
  fi
done

for class in \
  '.adlaire-renewal-notice' \
  '.renewal-notice' \
  '.adlaire-news-item' \
  '.adlaire-news-badge' \
  '.news-item' \
  '.timeline' \
  '.adlaire-tab-input' \
  '.adlaire-tab-label' \
  '.adlaire-tab-content' \
  '.tab-container' \
  '.sidebar-section' \
  '.adlaire-sidebar-links' \
  '.contact-info' \
  '.breadcrumb' \
  '.adlaire-legal-toc' \
  '.adlaire-legal-toc-link' \
  '.legal-toc' \
  '.alert' \
  '.adlaire-table-scroll' \
  '.adlaire-content-table' \
  '.adlaire-content-link' \
  '.adlaire-alert' \
  '.adlaire-alert-info' \
  '.adlaire-alert-success' \
  '.adlaire-alert-warning' \
  '.adlaire-alert-danger' \
  '.adlaire-info-row' \
  '.adlaire-info-label' \
  '.adlaire-info-value' \
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
  '.adlaire-contact-info' \
  '.adlaire-contact-item' \
  '.adlaire-note' \
  '.adlaire-note-info' \
  '.adlaire-note-success' \
  '.adlaire-note-warning' \
  '.adlaire-note-danger' \
  '.adlaire-faq-list' \
  '.adlaire-faq-item' \
  '.adlaire-faq-question' \
  '.adlaire-faq-answer' \
  '.adlaire-comparison-block' \
  '.adlaire-pros-cons-list' \
  '.adlaire-pros-cons-item' \
  '.adlaire-status-timeline' \
  '.adlaire-status-timeline-item' \
  '.adlaire-comparison-grid' \
  '.adlaire-comparison-grid-item' \
  '.adlaire-sortable-table' \
  '.adlaire-sort-button' \
  '.adlaire-filter-results' \
  '.adlaire-filter-empty'; do
  if ! grep -F -- "$class" "$ADLAIRE_DESIGN_ROOT/UI/content.css" >/dev/null 2>&1; then
    echo "UI/content.css missing required class: $class" >&2
    exit 1
  fi
done

for selector in \
  '.adlaire-content-link:hover' \
  '.adlaire-news-item:hover' \
  '.adlaire-tab-label:hover' \
  '.adlaire-sidebar-links li::before' \
  '.adlaire-sidebar-links a' \
  '.adlaire-sidebar-links a:hover' \
  '.adlaire-contact-item h3' \
  '.adlaire-contact-item p' \
  '.adlaire-contact-item a' \
  '.adlaire-contact-item a:hover' \
  '.adlaire-legal-toc-link:hover'; do
  if ! grep -F -- "$selector" "$ADLAIRE_DESIGN_ROOT/UI/content.css" >/dev/null 2>&1; then
    echo "UI/content.css missing required selector: $selector" >&2
    exit 1
  fi
done

for class in \
  '.mt-0' \
  '.mb-5' \
  '.adlaire-muted-text' \
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
  '#company' \
  '#terms' \
  '#privacy' \
  '#disclaimer' \
  '#copyright' \
  '#contactForm' \
  '#name' \
  '#email' \
  '#subject' \
  '#inquiry_type' \
  '#message' \
  '.container' \
  '[aria-label]' \
  '[target="_blank"]' \
  '[rel="stylesheet"]' \
  '[name="viewport"]' \
  '[name="news-tab"]' \
  '[type="radio"]' \
  '[type="checkbox"]' \
  '[type="submit"]' \
  '[type="text"]' \
  '[type="email"]' \
  '[rows]' \
  '[value]' \
  '[for]'; do
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
  '.adlaire-toolbar' \
  '.adlaire-toolbar-section' \
  '.adlaire-action-row' \
  '.adlaire-action-row-start' \
  '.adlaire-action-row-between' \
  '.adlaire-divider' \
  '.adlaire-stack' \
  '.adlaire-stack-sm' \
  '.adlaire-stack-lg' \
  '.adlaire-inline' \
  '.adlaire-empty-state' \
  '.adlaire-empty-state-title' \
  '.adlaire-empty-state-text' \
  '.adlaire-feature-list' \
  '.adlaire-feature-item' \
  '.adlaire-check-list' \
  '.adlaire-check-item' \
  '.adlaire-chip-list' \
  '.adlaire-chip' \
  '.adlaire-chip-primary' \
  '.adlaire-chip-muted' \
  '.adlaire-status-pill' \
  '.adlaire-status-dot' \
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
  '.adlaire-surface-grid' \
  '.adlaire-surface-item' \
  '.adlaire-media' \
  '.adlaire-media-figure' \
  '.adlaire-media-body' \
  '.adlaire-media-title' \
  '.adlaire-cta' \
  '.adlaire-cta-title' \
  '.adlaire-cta-text' \
  '.adlaire-cta-actions' \
  '.adlaire-caption' \
  '.adlaire-helper-text' \
  '.adlaire-page-heading' \
  '.adlaire-page-heading-title' \
  '.adlaire-page-heading-text' \
  '.adlaire-heading-group' \
  '.adlaire-heading-eyebrow' \
  '.adlaire-section-lead' \
  '.adlaire-announcement-bar' \
  '.adlaire-update-notice' \
  '.adlaire-maintenance-notice' \
  '.adlaire-maintenance-screen' \
  '.adlaire-maintenance-screen-inner' \
  '.adlaire-maintenance-screen-title' \
  '.adlaire-maintenance-screen-text' \
  '.adlaire-error-page' \
  '.adlaire-error-page-400' \
  '.adlaire-error-page-401' \
  '.adlaire-error-page-403' \
  '.adlaire-error-page-404' \
  '.adlaire-error-page-500' \
  '.adlaire-error-page-510' \
  '.adlaire-error-page-server' \
  '.adlaire-error-page-inner' \
  '.adlaire-error-page-code' \
  '.adlaire-error-page-title' \
  '.adlaire-error-page-text' \
  '.adlaire-error-page-actions' \
  '.adlaire-step-list' \
  '.adlaire-step-item' \
  '.adlaire-process-list' \
  '.adlaire-process-item' \
  '.adlaire-numbered-flow' \
  '.adlaire-numbered-flow-item' \
  '.adlaire-highlight-box' \
  '.adlaire-summary-box' \
  '.adlaire-stat-block' \
  '.adlaire-stat-value' \
  '.adlaire-stat-label' \
  '.adlaire-anchor-nav' \
  '.adlaire-anchor-nav-link' \
  '.adlaire-subnav' \
  '.adlaire-subnav-link' \
  '.adlaire-sibling-nav' \
  '.adlaire-sibling-nav-link' \
  '.adlaire-card-grid' \
  '.adlaire-card-media' \
  '.adlaire-card-media-figure' \
  '.adlaire-card-actions' \
  '.adlaire-simple-list' \
  '.adlaire-simple-list-item' \
  '.adlaire-bordered-list' \
  '.adlaire-bordered-list-item' \
  '.adlaire-compact-list' \
  '.adlaire-compact-list-item' \
  '.adlaire-contact-panel' \
  '.adlaire-inquiry-cta' \
  '.adlaire-external-link-row' \
  '.adlaire-progress' \
  '.adlaire-progress-bar' \
  '.adlaire-step-indicator' \
  '.adlaire-step-indicator-item' \
  '.adlaire-step-indicator-item-current' \
  '.adlaire-tag-list' \
  '.adlaire-tooltip-note' \
  '.adlaire-popover-note' \
  '.adlaire-hero-panel' \
  '.adlaire-visual-banner' \
  '.adlaire-image-frame' \
  '.adlaire-logo-list' \
  '.adlaire-logo-list-item' \
  '.adlaire-partner-list' \
  '.adlaire-partner-list-item' \
  '.adlaire-icon-tile-list' \
  '.adlaire-icon-tile' \
  '.adlaire-split-block' \
  '.adlaire-stacked-feature' \
  '.adlaire-pagination' \
  '.adlaire-page-link' \
  '.adlaire-page-link-current' \
  '.adlaire-page-link-disabled' \
  '.adlaire-filter-chip-list' \
  '.adlaire-filter-chip' \
  '.adlaire-modal' \
  '.adlaire-modal-dialog' \
  '.adlaire-modal-header' \
  '.adlaire-modal-title' \
  '.adlaire-modal-body' \
  '.adlaire-modal-footer' \
  '.adlaire-modal-close' \
  '.adlaire-drawer' \
  '.adlaire-drawer-left' \
  '.adlaire-drawer-panel' \
  '.adlaire-drawer-header' \
  '.adlaire-drawer-title' \
  '.adlaire-drawer-body' \
  '.adlaire-drawer-footer' \
  '.adlaire-drawer-close' \
  '.adlaire-dropdown' \
  '.adlaire-dropdown-trigger' \
  '.adlaire-dropdown-menu' \
  '.adlaire-dropdown-item' \
  '.adlaire-carousel' \
  '.adlaire-carousel-viewport' \
  '.adlaire-carousel-track' \
  '.adlaire-carousel-slide' \
  '.adlaire-carousel-controls' \
  '.adlaire-carousel-control' \
  '.adlaire-carousel-indicators' \
  '.adlaire-carousel-indicator' \
  '.adlaire-tooltip' \
  '.adlaire-tooltip-trigger' \
  '.adlaire-tooltip-content'; do
  if ! grep -F -- "$class" "$ADLAIRE_DESIGN_ROOT/UI/components.css" >/dev/null 2>&1; then
    echo "UI/components.css missing required class: $class" >&2
    exit 1
  fi
done

if ! grep -F -- 'pointer-events: none;' "$ADLAIRE_DESIGN_ROOT/UI/components.css" >/dev/null 2>&1; then
  echo "UI/components.css missing disabled interaction guard: pointer-events: none;" >&2
  exit 1
fi

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
  '.adlaire-wysiwyg-footer' \
  '.adlaire-wysiwyg-block-heading' \
  '.adlaire-wysiwyg-block-paragraph' \
  '.adlaire-wysiwyg-block-list' \
  '.adlaire-wysiwyg-block-checklist' \
  '.adlaire-wysiwyg-block-quote' \
  '.adlaire-wysiwyg-block-code' \
  '.adlaire-wysiwyg-block-image' \
  '.adlaire-wysiwyg-block-divider' \
  '.adlaire-wysiwyg-block-callout' \
  '.adlaire-wysiwyg-block-label' \
  '.adlaire-wysiwyg-block-progress' \
  '.adlaire-wysiwyg-block-hover' \
  '.adlaire-wysiwyg-block-focused' \
  '.adlaire-wysiwyg-block-dragging' \
  '.adlaire-wysiwyg-block-drop-before' \
  '.adlaire-wysiwyg-block-drop-after' \
  '.adlaire-wysiwyg-block-empty' \
  '.adlaire-wysiwyg-block-readonly' \
  '.adlaire-wysiwyg-block-error' \
  '.adlaire-wysiwyg-block-collapsed' \
  '.adlaire-wysiwyg-block-toolbar' \
  '.adlaire-wysiwyg-block-inserter' \
  '.adlaire-wysiwyg-block-menu' \
  '.adlaire-wysiwyg-mobile-bar' \
  '.adlaire-wysiwyg-mobile-action' \
  '.adlaire-wysiwyg-mobile-sheet' \
  '.adlaire-wysiwyg-mobile-sheet-header' \
  '.adlaire-wysiwyg-mobile-sheet-body' \
  '.adlaire-wysiwyg-mobile-sheet-item' \
  '.adlaire-wysiwyg-outline' \
  '.adlaire-wysiwyg-outline-item' \
  '.adlaire-wysiwyg-current-block-indicator' \
  '.adlaire-wysiwyg-quick-insert' \
  '.adlaire-wysiwyg-recent-blocks' \
  '.adlaire-wysiwyg-suggested-blocks' \
  '.adlaire-wysiwyg-transform-menu' \
  '.adlaire-wysiwyg-style-menu' \
  '.adlaire-wysiwyg-width-narrow' \
  '.adlaire-wysiwyg-width-wide' \
  '.adlaire-wysiwyg-width-full' \
  '.adlaire-wysiwyg-block-group' \
  '.adlaire-wysiwyg-comment-marker' \
  '.adlaire-wysiwyg-comment-panel' \
  '.adlaire-wysiwyg-suggestion' \
  '.adlaire-wysiwyg-history-panel' \
  '.adlaire-wysiwyg-sync-status' \
  '.adlaire-wysiwyg-publish-check' \
  '.adlaire-wysiwyg-assist-menu' \
  '.adlaire-wysiwyg-assist-suggestion'; do
  if ! grep -F -- "$class" "$ADLAIRE_DESIGN_ROOT/EditorUI/wysiwyg.css" >/dev/null 2>&1; then
    echo "EditorUI/wysiwyg.css missing required class: $class" >&2
    exit 1
  fi
done

for wysiwyg_css_term in \
  '/* Editor UI common structure */' \
  '/* Priority A: core block editor UI */' \
  '/* Editor UI state classes */' \
  '/* Priority B: editing support UI */' \
  '/* Priority C: advanced support UI */' \
  '.adlaire-wysiwyg-tool:focus-visible' \
  '.adlaire-wysiwyg-block[aria-selected="true"]' \
  '.adlaire-wysiwyg-slash-item[aria-current="true"]' \
  '.adlaire-wysiwyg-mobile-action[aria-pressed="true"]' \
  '.adlaire-wysiwyg-mobile-sheet-item[aria-selected="true"]' \
  '.adlaire-wysiwyg-comment-panel[aria-busy="true"]' \
  '.adlaire-wysiwyg-sync-status[aria-live]' \
  '.adlaire-wysiwyg-comment-marker[aria-current="true"]' \
  '.adlaire-wysiwyg-assist-suggestion[aria-selected="true"]'; do
  if ! grep -F -- "$wysiwyg_css_term" "$ADLAIRE_DESIGN_ROOT/EditorUI/wysiwyg.css" >/dev/null 2>&1; then
    echo "EditorUI/wysiwyg.css missing required Editor UI priority implementation term: $wysiwyg_css_term" >&2
    exit 1
  fi
done

wysiwyg_line_number() {
  grep -nF -- "$1" "$ADLAIRE_DESIGN_ROOT/EditorUI/wysiwyg.css" | sed -n '1s/:.*//p'
}

WYSIWYG_PRIORITY_A_LINE=$(wysiwyg_line_number '/* Priority A: core block editor UI */')
WYSIWYG_PRIORITY_B_LINE=$(wysiwyg_line_number '/* Priority B: editing support UI */')
WYSIWYG_PRIORITY_C_LINE=$(wysiwyg_line_number '/* Priority C: advanced support UI */')
WYSIWYG_BLOCK_INSERTER_LINE=$(wysiwyg_line_number '.adlaire-wysiwyg-block-inserter {')
WYSIWYG_MOBILE_BAR_LINE=$(wysiwyg_line_number '.adlaire-wysiwyg-mobile-bar {')
WYSIWYG_BLOCK_TOOLBAR_LINE=$(wysiwyg_line_number '.adlaire-wysiwyg-block-toolbar,')
WYSIWYG_QUICK_INSERT_LINE=$(wysiwyg_line_number '.adlaire-wysiwyg-quick-insert {')
WYSIWYG_ASSIST_MENU_LINE=$(wysiwyg_line_number '.adlaire-wysiwyg-assist-menu {')

for line_value in \
  "$WYSIWYG_PRIORITY_A_LINE" \
  "$WYSIWYG_PRIORITY_B_LINE" \
  "$WYSIWYG_PRIORITY_C_LINE" \
  "$WYSIWYG_BLOCK_INSERTER_LINE" \
  "$WYSIWYG_MOBILE_BAR_LINE" \
  "$WYSIWYG_BLOCK_TOOLBAR_LINE" \
  "$WYSIWYG_QUICK_INSERT_LINE" \
  "$WYSIWYG_ASSIST_MENU_LINE"; do
  if [ -z "$line_value" ]; then
    echo "EditorUI/wysiwyg.css missing required line for Editor UI priority boundary order check." >&2
    exit 1
  fi
done

if [ "$WYSIWYG_PRIORITY_A_LINE" -ge "$WYSIWYG_BLOCK_INSERTER_LINE" ] \
  || [ "$WYSIWYG_BLOCK_INSERTER_LINE" -ge "$WYSIWYG_PRIORITY_B_LINE" ] \
  || [ "$WYSIWYG_PRIORITY_A_LINE" -ge "$WYSIWYG_MOBILE_BAR_LINE" ] \
  || [ "$WYSIWYG_MOBILE_BAR_LINE" -ge "$WYSIWYG_PRIORITY_B_LINE" ]; then
  echo "EditorUI/wysiwyg.css Priority A classes must appear between the Priority A and Priority B boundaries." >&2
  exit 1
fi

if [ "$WYSIWYG_PRIORITY_B_LINE" -ge "$WYSIWYG_BLOCK_TOOLBAR_LINE" ] \
  || [ "$WYSIWYG_BLOCK_TOOLBAR_LINE" -ge "$WYSIWYG_PRIORITY_C_LINE" ] \
  || [ "$WYSIWYG_PRIORITY_B_LINE" -ge "$WYSIWYG_QUICK_INSERT_LINE" ] \
  || [ "$WYSIWYG_QUICK_INSERT_LINE" -ge "$WYSIWYG_PRIORITY_C_LINE" ]; then
  echo "EditorUI/wysiwyg.css Priority B classes must appear between the Priority B and Priority C boundaries." >&2
  exit 1
fi

if [ "$WYSIWYG_PRIORITY_C_LINE" -ge "$WYSIWYG_ASSIST_MENU_LINE" ]; then
  echo "EditorUI/wysiwyg.css Priority C classes must appear after the Priority C boundary." >&2
  exit 1
fi

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

if grep -R -n -E '#[0-9a-fA-F]{3,8}' "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" "$ADLAIRE_DESIGN_ROOT/UI/base.css" "$ADLAIRE_DESIGN_ROOT/UI/grid.css" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" "$ADLAIRE_DESIGN_ROOT/UI/components.css" "$ADLAIRE_DESIGN_ROOT/UI/site.css" "$ADLAIRE_DESIGN_ROOT/UI/forms.css" "$ADLAIRE_DESIGN_ROOT/UI/content.css" "$ADLAIRE_DESIGN_ROOT/EditorUI/wysiwyg.css" "$ADLAIRE_DESIGN_ROOT/UI/utilities.css" "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css" >/tmp/adlaire-design-ui-hex-matches 2>/dev/null; then
  echo "UI CSS files must not contain direct HEX colors:" >&2
  cat /tmp/adlaire-design-ui-hex-matches >&2
  exit 1
fi

if grep -R -n -E 'rgba?\(' "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" "$ADLAIRE_DESIGN_ROOT/UI/base.css" "$ADLAIRE_DESIGN_ROOT/UI/grid.css" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" "$ADLAIRE_DESIGN_ROOT/UI/components.css" "$ADLAIRE_DESIGN_ROOT/UI/site.css" "$ADLAIRE_DESIGN_ROOT/UI/forms.css" "$ADLAIRE_DESIGN_ROOT/UI/content.css" "$ADLAIRE_DESIGN_ROOT/EditorUI/wysiwyg.css" "$ADLAIRE_DESIGN_ROOT/UI/utilities.css" "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css" >/tmp/adlaire-design-ui-rgba-matches 2>/dev/null; then
  echo "UI CSS files must not contain direct RGB/RGBA colors:" >&2
  cat /tmp/adlaire-design-ui-rgba-matches >&2
  exit 1
fi

if grep -R -n 'letter-spacing: -' "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" "$ADLAIRE_DESIGN_ROOT/UI/base.css" "$ADLAIRE_DESIGN_ROOT/UI/grid.css" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" "$ADLAIRE_DESIGN_ROOT/UI/components.css" "$ADLAIRE_DESIGN_ROOT/UI/site.css" "$ADLAIRE_DESIGN_ROOT/UI/forms.css" "$ADLAIRE_DESIGN_ROOT/UI/content.css" "$ADLAIRE_DESIGN_ROOT/EditorUI/wysiwyg.css" "$ADLAIRE_DESIGN_ROOT/UI/utilities.css" "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css" >/tmp/adlaire-design-ui-negative-letter-spacing-matches 2>/dev/null; then
  echo "UI CSS files must not contain negative letter-spacing:" >&2
  cat /tmp/adlaire-design-ui-negative-letter-spacing-matches >&2
  exit 1
fi

if grep -R -n 'transition: all' "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" "$ADLAIRE_DESIGN_ROOT/UI/base.css" "$ADLAIRE_DESIGN_ROOT/UI/grid.css" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" "$ADLAIRE_DESIGN_ROOT/UI/components.css" "$ADLAIRE_DESIGN_ROOT/UI/site.css" "$ADLAIRE_DESIGN_ROOT/UI/forms.css" "$ADLAIRE_DESIGN_ROOT/UI/content.css" "$ADLAIRE_DESIGN_ROOT/EditorUI/wysiwyg.css" "$ADLAIRE_DESIGN_ROOT/UI/utilities.css" "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css" >/tmp/adlaire-design-ui-transition-all-matches 2>/dev/null; then
  echo "UI CSS files must not use transition: all:" >&2
  cat /tmp/adlaire-design-ui-transition-all-matches >&2
  exit 1
fi

if grep -R -n -E 'border-radius: [1-9]' "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" "$ADLAIRE_DESIGN_ROOT/UI/base.css" "$ADLAIRE_DESIGN_ROOT/UI/grid.css" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" "$ADLAIRE_DESIGN_ROOT/UI/components.css" "$ADLAIRE_DESIGN_ROOT/UI/site.css" "$ADLAIRE_DESIGN_ROOT/UI/forms.css" "$ADLAIRE_DESIGN_ROOT/UI/content.css" "$ADLAIRE_DESIGN_ROOT/EditorUI/wysiwyg.css" "$ADLAIRE_DESIGN_ROOT/UI/utilities.css" "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css" >/tmp/adlaire-design-ui-radius-matches 2>/dev/null; then
  echo "UI CSS files must not contain direct nonzero border-radius values:" >&2
  cat /tmp/adlaire-design-ui-radius-matches >&2
  exit 1
fi

if grep -R -n -E 'box-shadow: [-0-9]' "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" "$ADLAIRE_DESIGN_ROOT/UI/base.css" "$ADLAIRE_DESIGN_ROOT/UI/grid.css" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" "$ADLAIRE_DESIGN_ROOT/UI/components.css" "$ADLAIRE_DESIGN_ROOT/UI/site.css" "$ADLAIRE_DESIGN_ROOT/UI/forms.css" "$ADLAIRE_DESIGN_ROOT/UI/content.css" "$ADLAIRE_DESIGN_ROOT/EditorUI/wysiwyg.css" "$ADLAIRE_DESIGN_ROOT/UI/utilities.css" "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css" >/tmp/adlaire-design-ui-box-shadow-matches 2>/dev/null; then
  echo "UI CSS files must not contain direct box-shadow values:" >&2
  cat /tmp/adlaire-design-ui-box-shadow-matches >&2
  exit 1
fi

if grep -R -n -E 'z-index: [0-9]' "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" "$ADLAIRE_DESIGN_ROOT/UI/base.css" "$ADLAIRE_DESIGN_ROOT/UI/grid.css" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" "$ADLAIRE_DESIGN_ROOT/UI/components.css" "$ADLAIRE_DESIGN_ROOT/UI/site.css" "$ADLAIRE_DESIGN_ROOT/UI/forms.css" "$ADLAIRE_DESIGN_ROOT/UI/content.css" "$ADLAIRE_DESIGN_ROOT/EditorUI/wysiwyg.css" "$ADLAIRE_DESIGN_ROOT/UI/utilities.css" "$ADLAIRE_DESIGN_ROOT/UI/compat-agws.css" >/tmp/adlaire-design-ui-z-index-matches 2>/dev/null; then
  echo "UI CSS files must not contain direct z-index values:" >&2
  cat /tmp/adlaire-design-ui-z-index-matches >&2
  exit 1
fi

grep -R -h -E -o 'var\(--adlaire-[^)]+\)' "$ADLAIRE_DESIGN_ROOT/UI" "$ADLAIRE_DESIGN_ROOT/EditorUI" "$ADLAIRE_DESIGN_ROOT/Tokens" 2>/dev/null \
  | sed 's/^var(//' \
  | sed 's/)$//' \
  | sort -u >"$TMP_DIR/css-var-refs"

grep -R -h -E -o -- '--adlaire-[a-z0-9-]+:' "$ADLAIRE_DESIGN_ROOT/UI" "$ADLAIRE_DESIGN_ROOT/EditorUI" "$ADLAIRE_DESIGN_ROOT/Tokens" 2>/dev/null \
  | sed 's/:$//' \
  | sort -u >"$TMP_DIR/css-var-defs"

if comm -23 "$TMP_DIR/css-var-refs" "$TMP_DIR/css-var-defs" >"$TMP_DIR/css-var-missing" && [ -s "$TMP_DIR/css-var-missing" ]; then
  echo "Adlaire-Design CSS must not reference undefined CSS variables:" >&2
  cat "$TMP_DIR/css-var-missing" >&2
  exit 1
fi

if [ "$RUN_RELEASE_CHECK" -eq 1 ]; then
  git -C "$ADLAIRE_DESIGN_ROOT" diff --check

  git -C "$ADLAIRE_DESIGN_ROOT" status --short --branch >"$TMP_DIR/git-status"
  if grep -E '^(M|A|D|R|C|U|\?\?)' "$TMP_DIR/git-status" >/dev/null 2>&1; then
    echo "release check requires a clean git worktree:" >&2
    cat "$TMP_DIR/git-status" >&2
    exit 1
  fi

  if git -C "$ADLAIRE_DESIGN_ROOT" rev-parse --verify backup/main >/dev/null 2>&1; then
    if ! git -C "$ADLAIRE_DESIGN_ROOT" merge-base --is-ancestor backup/main HEAD; then
      echo "release check requires HEAD to include backup/main." >&2
      exit 1
    fi
  fi

  echo "adlaire-design-release-check-ok"
  exit 0
fi


echo "adlaire-design-check-ok"
