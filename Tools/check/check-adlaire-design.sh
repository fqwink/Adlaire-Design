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
  UI/adlaire.css \
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

if grep -R -n '@import' "$ADLAIRE_DESIGN_ROOT/Tokens/colors.css" "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" >/tmp/adlaire-design-css-import-matches 2>/dev/null; then
  echo "Adlaire-Design CSS files must not use @import:" >&2
  cat /tmp/adlaire-design-css-import-matches >&2
  exit 1
fi

if grep -R -n '@charset' "$ADLAIRE_DESIGN_ROOT/Tokens/colors.css" "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" >/tmp/adlaire-design-css-charset-matches 2>/dev/null; then
  echo "Adlaire-Design CSS files must not use @charset:" >&2
  cat /tmp/adlaire-design-css-charset-matches >&2
  exit 1
fi

if grep -n '!important' "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" >/tmp/adlaire-design-css-important-matches 2>/dev/null; then
  echo "UI/adlaire.css must not use !important:" >&2
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

if [ "$(grep -c '^:root {' "$ADLAIRE_DESIGN_ROOT/Tokens/colors.css")" -ne 1 ]; then
  echo "Tokens/colors.css must contain exactly one :root block." >&2
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

if grep -E '#[0-9a-fA-F]{3,8}' "$ADLAIRE_DESIGN_ROOT/UI/adlaire.css" >/tmp/adlaire-design-ui-hex-matches 2>/dev/null; then
  echo "UI/adlaire.css must not contain direct HEX colors:" >&2
  cat /tmp/adlaire-design-ui-hex-matches >&2
  exit 1
fi

echo "adlaire-design-check-ok"
