#!/bin/sh
set -eu

TOOL_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ADLAIRE_DESIGN_ROOT=$(CDPATH= cd -- "$TOOL_DIR/../.." && pwd)

for path in \
  AGENTS.md \
  README.md \
  LICENSE \
  Docs/Document_Index \
  Docs/Brand_Color_Spec \
  Docs/AGWS_Design_Analysis \
  Docs/Change_History \
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

if ! grep -F 'Docs/Brand_Color_Spec' "$ADLAIRE_DESIGN_ROOT/Docs/Document_Index" >/dev/null 2>&1; then
  echo "Adlaire-Design Document_Index must reference Docs/Brand_Color_Spec." >&2
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

if grep -R -n 'Adlaire-Ecosystem-Design' "$ADLAIRE_DESIGN_ROOT/AGENTS.md" "$ADLAIRE_DESIGN_ROOT/README.md" "$ADLAIRE_DESIGN_ROOT/Docs/Brand_Color_Spec" "$ADLAIRE_DESIGN_ROOT/Docs/AGWS_Design_Analysis" "$ADLAIRE_DESIGN_ROOT/Docs/Document_Index" >/tmp/adlaire-design-old-name-matches 2>/dev/null; then
  echo "current Adlaire-Design documents must not use the old repository name:" >&2
  cat /tmp/adlaire-design-old-name-matches >&2
  exit 1
fi

echo "adlaire-design-check-ok"
