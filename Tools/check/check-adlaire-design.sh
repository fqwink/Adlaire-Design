#!/bin/sh
set -eu

TOOL_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ADLAIRE_DESIGN_ROOT=$(CDPATH= cd -- "$TOOL_DIR/../.." && pwd)

for path in \
  AGENTS.md \
  README.md \
  LICENSE \
  Docs/Document_Index \
  Docs/Master_Spec \
  Docs/AGWS_Design_Analysis \
  Docs/Change_History \
  Tokens/colors.css \
  Tokens/surface.css \
  UI/adlaire.css \
  UI/layout.css \
  UI/components.css \
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

if [ -e "$ADLAIRE_DESIGN_ROOT/Documents" ]; then
  echo "Adlaire-Design must use Docs/, not Documents/." >&2
  exit 1
fi

if find "$ADLAIRE_DESIGN_ROOT" \( -name 'package.json' -o -name 'package-lock.json' -o -name 'node_modules' \) -print | grep . >/dev/null 2>&1; then
  echo "Adlaire-Design must not use Node.js/npm project files." >&2
  exit 1
fi

if ! grep -F '# Adlaire-Design' "$ADLAIRE_DESIGN_ROOT/README.md" >/dev/null 2>&1; then
  echo "Adlaire-Design README must identify the repository." >&2
  exit 1
fi

if ! grep -F 'Docs/Master_Spec' "$ADLAIRE_DESIGN_ROOT/Docs/Document_Index" >/dev/null 2>&1; then
  echo "Adlaire-Design Document_Index must reference Docs/Master_Spec." >&2
  exit 1
fi

if ! grep -F 'Docs/AGWS_Design_Analysis' "$ADLAIRE_DESIGN_ROOT/Docs/Document_Index" >/dev/null 2>&1; then
  echo "Adlaire-Design Document_Index must reference Docs/AGWS_Design_Analysis." >&2
  exit 1
fi

if ! grep -F 'Docs/Change_History' "$ADLAIRE_DESIGN_ROOT/Docs/Document_Index" >/dev/null 2>&1; then
  echo "Adlaire-Design Document_Index must reference Docs/Change_History." >&2
  exit 1
fi

OLD_REPOSITORY_NAME='Adlaire-''Eco''system-Design'

if grep -R -n "$OLD_REPOSITORY_NAME" "$ADLAIRE_DESIGN_ROOT/AGENTS.md" "$ADLAIRE_DESIGN_ROOT/README.md" "$ADLAIRE_DESIGN_ROOT/Docs/Master_Spec" "$ADLAIRE_DESIGN_ROOT/Docs/AGWS_Design_Analysis" "$ADLAIRE_DESIGN_ROOT/Docs/Document_Index" >/tmp/adlaire-design-old-name-matches 2>/dev/null; then
  echo "current Adlaire-Design documents must not use the old repository name:" >&2
  cat /tmp/adlaire-design-old-name-matches >&2
  exit 1
fi

if grep -R -n '@import' "$ADLAIRE_DESIGN_ROOT/Tokens/colors.css" "$ADLAIRE_DESIGN_ROOT/Tokens/surface.css" "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" "$ADLAIRE_DESIGN_ROOT/UI/components.css" >/tmp/adlaire-design-css-import-matches 2>/dev/null; then
  echo "Adlaire-Design CSS files must not use @import:" >&2
  cat /tmp/adlaire-design-css-import-matches >&2
  exit 1
fi

if grep -R -n '@charset' "$ADLAIRE_DESIGN_ROOT/Tokens/colors.css" "$ADLAIRE_DESIGN_ROOT/Tokens/surface.css" "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" "$ADLAIRE_DESIGN_ROOT/UI/components.css" >/tmp/adlaire-design-css-charset-matches 2>/dev/null; then
  echo "Adlaire-Design CSS files must not use @charset:" >&2
  cat /tmp/adlaire-design-css-charset-matches >&2
  exit 1
fi

if grep -R -n '!important' "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" "$ADLAIRE_DESIGN_ROOT/UI/components.css" >/tmp/adlaire-design-css-important-matches 2>/dev/null; then
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

if [ "$(grep -c '^:root {' "$ADLAIRE_DESIGN_ROOT/Tokens/colors.css")" -ne 1 ]; then
  echo "Tokens/colors.css must contain exactly one :root block." >&2
  exit 1
fi

if [ "$(grep -c '^:root {' "$ADLAIRE_DESIGN_ROOT/Tokens/surface.css")" -ne 1 ]; then
  echo "Tokens/surface.css must contain exactly one :root block." >&2
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
  '.adlaire-page-top'; do
  if ! grep -F -- "$class" "$ADLAIRE_DESIGN_ROOT/UI/components.css" >/dev/null 2>&1; then
    echo "UI/components.css missing required class: $class" >&2
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

if grep -R -n -E '#[0-9a-fA-F]{3,8}' "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" "$ADLAIRE_DESIGN_ROOT/UI/layout.css" "$ADLAIRE_DESIGN_ROOT/UI/components.css" >/tmp/adlaire-design-ui-hex-matches 2>/dev/null; then
  echo "UI CSS files must not contain direct HEX colors:" >&2
  cat /tmp/adlaire-design-ui-hex-matches >&2
  exit 1
fi

echo "adlaire-design-check-ok"
