#!/usr/bin/env bash
# =============================================================================
# validate-dist.sh
# Validates that the Vite build output is suitable for
# AWS S3 static hosting behind CloudFront.
#
# Run after `npm run build`:
#   bash scripts/validate-dist.sh apps/web/dist
#
# AGENT NOTE: This script is also run as a CI step. A non-zero exit code
# will fail the CI job and block the PR from merging.
# =============================================================================
set -euo pipefail

DIST_DIR="${1:-apps/web/dist}"
ERRORS=0

echo "🔍 Validating build artifact at ./$DIST_DIR ..."
echo ""

# 1. Ensure dist/ directory exists
if [ ! -d "$DIST_DIR" ]; then
  echo "❌ FAIL: $DIST_DIR does not exist. Run 'npm run build' first."
  exit 1
fi

# 2. Ensure dist/index.html exists (SPA entry point)
if [ ! -f "$DIST_DIR/index.html" ]; then
  echo "❌ FAIL: $DIST_DIR/index.html not found. CloudFront requires this as the SPA entry."
  ERRORS=$((ERRORS + 1))
else
  echo "✅ PASS: $DIST_DIR/index.html found."
fi

# 3. Ensure dist/assets/ exists and is non-empty
if [ ! -d "$DIST_DIR/assets" ] || [ -z "$(ls -A "$DIST_DIR/assets")" ]; then
  echo "❌ FAIL: $DIST_DIR/assets/ is missing or empty. Vite should produce hashed JS/CSS here."
  ERRORS=$((ERRORS + 1))
else
  echo "✅ PASS: $DIST_DIR/assets/ exists with content."
fi

# 4. Reject any server-side JS files (no .server.js, no server/ directory)
SERVER_FILES=$(find "$DIST_DIR" -name "*.server.js" 2>/dev/null || true)
if [ -n "$SERVER_FILES" ]; then
  echo "❌ FAIL: Server-side JS files found in dist/. These cannot be hosted on S3:"
  echo "$SERVER_FILES"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ PASS: No .server.js files found."
fi

# 5. Reject node_modules in the build output (common misconfiguration)
if [ -d "$DIST_DIR/node_modules" ]; then
  echo "❌ FAIL: node_modules/ found inside dist/. This is a misconfiguration — do not upload node_modules to S3."
  ERRORS=$((ERRORS + 1))
else
  echo "✅ PASS: No node_modules in dist/."
fi

# 6. Check index.html references at least one JS asset (sanity check for empty builds)
JS_REF_COUNT=$(grep -c '\.js"' "$DIST_DIR/index.html" 2>/dev/null || echo "0")
if [ "$JS_REF_COUNT" -eq 0 ]; then
  echo "❌ FAIL: $DIST_DIR/index.html references no JS assets. The build may be empty or broken."
  ERRORS=$((ERRORS + 1))
else
  echo "✅ PASS: dist/index.html references $JS_REF_COUNT JS asset(s)."
fi

# 7. Ensure local root-relative asset references in dist/index.html actually exist.
MISSING_LOCAL_ASSETS=""
while IFS= read -r asset; do
  CLEAN_ASSET=${asset%%\?*}
  CLEAN_ASSET=${CLEAN_ASSET%%#*}
  CLEAN_ASSET=${CLEAN_ASSET#/}

  if [ -n "$CLEAN_ASSET" ] && [ ! -f "$DIST_DIR/$CLEAN_ASSET" ]; then
    MISSING_LOCAL_ASSETS="${MISSING_LOCAL_ASSETS}\n$CLEAN_ASSET"
  fi
done < <(grep -oE '(src|href)="/[^"#?]+' "$DIST_DIR/index.html" | cut -d'"' -f2 | sort -u)

if [ -n "$MISSING_LOCAL_ASSETS" ]; then
  echo "❌ FAIL: dist/index.html references missing local asset(s):"
  printf '%b\n' "$MISSING_LOCAL_ASSETS"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ PASS: All local asset references in dist/index.html resolve."
fi

echo ""

# Final result
if [ "$ERRORS" -gt 0 ]; then
  echo "💥 Validation FAILED with $ERRORS error(s). Do NOT deploy this artifact."
  echo "   Fix the issues above and re-run 'npm run build && bash scripts/validate-dist.sh $DIST_DIR'."
  exit 1
else
  echo "🚀 Validation PASSED. $DIST_DIR is ready for S3/CloudFront deployment."
  exit 0
fi
