#!/usr/bin/env bash
set -euo pipefail

PORT="${PHONE_PREVIEW_PORT:-4173}"
BASE_PATH="/fitness-tracker-app/"

TAILSCALE_BIN=""

if command -v tailscale >/dev/null 2>&1; then
  TAILSCALE_BIN="tailscale"
elif [[ -x "/c/Program Files/Tailscale/tailscale.exe" ]]; then
  TAILSCALE_BIN="/c/Program Files/Tailscale/tailscale.exe"
elif [[ -x "/c/Program Files (x86)/Tailscale/tailscale.exe" ]]; then
  TAILSCALE_BIN="/c/Program Files (x86)/Tailscale/tailscale.exe"
fi

if [[ -z "${TAILSCALE_BIN}" ]]; then
  cat <<'EOF'
Tailscale was not found.

Install/sign in to Tailscale on this PC and your phone, then run:
  npm run phone-preview

Windows download:
  https://tailscale.com/download/windows

Phone apps:
  iPhone:  App Store → Tailscale
  Android: Play Store → Tailscale
EOF
  exit 1
fi

TAILSCALE_IP="$(${TAILSCALE_BIN} ip -4 2>/dev/null | head -n 1 || true)"

if [[ -z "${TAILSCALE_IP}" ]]; then
  cat <<'EOF'
No Tailscale IPv4 address was found.

Make sure Tailscale is running and signed in on this PC, then try again:
  tailscale status
  npm run phone-preview
EOF
  exit 1
fi

cat <<EOF
Building production preview...
EOF

npm run build

cat <<EOF

Private phone preview is ready to start.

1. Make sure your phone is signed in to the same Tailscale account.
2. Turn off Wi-Fi on your phone to test over cell connection.
3. Open this URL on your phone:

   http://${TAILSCALE_IP}:${PORT}${BASE_PATH}

Press Ctrl+C here when you are done testing.

Starting Vite preview on all interfaces...
EOF

npm run preview -- --host 0.0.0.0 --port "${PORT}"
