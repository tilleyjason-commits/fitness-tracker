#!/usr/bin/env bash
# Scripted smoke test for the fitness-tracker app.
set -uo pipefail

PASS=0
FAIL=0

ok()  { echo "  OK $1"; PASS=$((PASS+1)); }
nope(){ echo "  FAIL $1"; FAIL=$((FAIL+1)); }

echo "=== Smoke Test ==="

# Step 1: build
npm run build 2>&1 | tail -2

# Step 2: dist structure
if [ -f dist/index.html ]; then ok "dist/index.html exists"; else nope "dist/index.html missing"; fi

JS=$(ls dist/assets/index-*.js 2>/dev/null | head -1)
if [ -n "$JS" ]; then ok "JS bundle: $(basename "$JS")"; else nope "JS bundle missing"; fi

CSS=$(ls dist/assets/index-*.css 2>/dev/null | head -1)
if [ -n "$CSS" ]; then ok "CSS bundle: $(basename "$CSS")"; else nope "CSS bundle missing"; fi

# Step 3: bundle content
if grep -q 'Chest Press Machine' "$JS" 2>/dev/null; then ok "Contains Chest Press Machine"; else nope "Missing Chest Press Machine"; fi
if grep -q 'Treadmill' "$JS" 2>/dev/null; then ok "Contains Treadmill"; else nope "Missing Treadmill"; fi
if grep -q 'Workout' "$JS" 2>/dev/null; then ok "Contains Workout"; else nope "Missing Workout"; fi
if grep -q 'Cardio' "$JS" 2>/dev/null; then ok "Contains Cardio"; else nope "Missing Cardio"; fi

echo ""
echo "=== Results: $PASS pass, $FAIL fail ==="
exit $FAIL
