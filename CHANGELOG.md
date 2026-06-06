# Changelog

All notable changes to the fitness tracker app.

## [Unreleased]

### Added
- AGENTS.md — project guide with conventions and workflow
- Component tests — @testing-library/react + jsdom setup with 7 component tests
- vitest.config.ts — separate config with jsdom environment
- scripts/smoke.sh — scripted smoke test (`npm run smoke`)
- Pre-commit hook — auto-runs test/lint/build before each commit
- CHANGELOG.md — this file

## 2026-06-03 — v0.2.0

### Added
- Weekly workout routines — save/load routines per weekday, add/replace today's workout
- Local user accounts — create account, sign in, per-user storage keys
- Unified exercise selector — Cardio tab in same UI as strength muscle groups
- Cardio mileage tracking — distanceMiles field on cardio exercises

### Changed
- Cardio exercises now selectable from unified Add Exercise panel

## 2026-06-01 — v0.1.0

### Added
- Anytime Fitness cardio equipment (12 types: treadmill, elliptical, bikes, rower, etc.)
- Cardio workout logging — select equipment, set duration, add to workout, log to history
- Cardio in workout history — equipment name, duration, category, total minutes

## 2026-05-27 — v0.0.2

### Added
- Neon-themed set session logging with reps, weight, RIR per set
- Workout history — past workouts saved with set details
- Weight tracking per exercise

## 2026-05-26 — v0.0.1

### Added
- Initial fitness tracker app (React + Vite + TypeScript)
- 104 Anytime Fitness machine exercises organized by muscle group
- Workout state via localStorage
- Exercise selector with muscle group tabs
- Workout tracker with set bubbles and completion toggling
- PWA support and GitHub Pages deployment
