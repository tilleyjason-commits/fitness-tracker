# Fitness Tracker

A mobile-friendly React + TypeScript workout tracker focused on machine exercises.

## Features

- Select common machine exercises by muscle group
- Choose target sets and reps
- Track completed sets during the workout
- Rest timer with 30s, 1m, 1.5m, 2m, and 3m presets
- Current workout persists in localStorage for the day
- Responsive phone-friendly layout

## Getting Started

```bash
npm install
npm run dev
```

## Verification

```bash
npm test
npm run lint
npm run build
npm run smoke
```

## Private Phone Preview Before Commit

Use this when you want to manually test uncommitted local changes on your phone over cellular without pushing to `main` and without a public tunnel.

Prerequisites:

1. Install Tailscale on this PC and your phone.
2. Sign in to the same Tailscale account on both devices.

Run from the project folder:

```bash
npm run phone-preview
```

The script will:

1. Build the app.
2. Detect this PC's Tailscale IPv4 address.
3. Start Vite preview on `0.0.0.0:4173`.
4. Print a private phone URL like:

```text
http://100.x.y.z:4173/fitness-tracker-app/
```

On your phone:

1. Make sure Tailscale is connected.
2. Turn off Wi-Fi to test over cell connection.
3. Open the printed URL.
4. Press `Ctrl+C` in the terminal when finished.

If Windows Firewall asks, allow Node/Vite on private networks.

## Mobile Install

The app is configured as a Progressive Web App for GitHub Pages.

1. Open the GitHub Pages URL on your phone.
2. On iPhone Safari: Share → Add to Home Screen.
3. On Android Chrome: Menu → Install app or Add to Home screen.

After the first load, the app shell is cached for offline use.
