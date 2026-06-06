# Fitness Tracker — Project Guide

## Stack
- **Framework:** React 19 + TypeScript 6
- **Build:** Vite 8
- **Testing:** Vitest 4 (unit tests for logic, @testing-library/react for component tests)
- **Styling:** CSS (no Tailwind)
- **Deploy:** GitHub Pages (`/fitness-tracker-app/` base path)
- **State:** localStorage via custom `useLocalStorage` hook

## Key Conventions

### Commits
- Use conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`
- Keep commits focused — one feature or fix per commit
- Always push after user confirms

### Testing
- **TDD** — write failing tests before implementation
- **Logic tests** in `vitest` (business logic: workoutLog, auth, routines, userStorage)
- **Component tests** with `@testing-library/react` + `jsdom` (UI: ExerciseSelector, WorkoutTracker, WorkoutHistory)
- Run `npm test && npm run lint && npm run build` before marking done

### Architecture
- `src/types.ts` — all shared interfaces/types
- `src/workoutLog.ts` — workout CRUD logic (pure functions, no React)
- `src/data/` — static exercise/equipment data + selector logic
- `src/components/` — React components (presentational with callbacks)
- `src/hooks/` — custom hooks
- `src/auth.ts` / `src/userStorage.ts` — authentication and per-user storage

### State Flow
- `WorkoutState` = `{ exercises, cardioExercises, date }`
- `WorkoutHistoryEntry` extends `WorkoutState` with snapshot totals
- Cardio is separate from strength (`cardioExercises` array), tracks duration + miles
- `normalizeWorkout()` provides backward compat for old localStorage entries

### Workflow
1. Branch → edits → TDD → implement → npm test/lint/build → smoke → user confirms → merge to main → push
2. Pre-commit hook enforces test/lint/build gate
3. Scripted smoke test available via `npm run smoke`
4. Private phone review before commit is available via `npm run phone-preview`; it builds the app, prints the PC's Tailscale URL, and serves Vite preview over the private Tailscale network for cellular phone testing without public tunnels

## Directory Layout
```
fitness-tracker/
├── src/
│   ├── components/     # React components
│   ├── data/           # Static data + selectors
│   ├── hooks/          # Custom hooks
│   ├── types.ts        # All type definitions
│   ├── workoutLog.ts   # Workout pure functions
│   ├── auth.ts         # Authentication
│   ├── userStorage.ts  # Per-user storage keys
│   ├── routines.ts     # Weekly routines logic
│   └── App.tsx         # Root app component
├── AGENTS.md           # This file
├── CHANGELOG.md        # Release history
└── scripts/            # Smoke test and automation scripts
```
