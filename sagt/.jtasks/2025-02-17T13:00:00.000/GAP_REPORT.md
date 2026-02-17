# Gap Report: Territories Strategy Game

## 1. Objective
Build a deterministic, PWA-compatible, turn-based territory control game hosted on GitHub Pages via the `/docs/` directory.

## 2. Current State
- **Governance**: SAGT v2.0 installed.
- **PWA Bootstrap**: Basic PWA files exist in `src/` and `dist/`.
- **Game Engine**: Missing.
- **UI Shell**: Minimal placeholder in `src/index.html`.
- **Deployment**: `Makefile` targets `dist/`, but must target `docs/`.

## 3. Desired State
- **Game**: Fully functional turn-based strategy game (Reinforce -> Attack -> Fortify).
- **Architecture**: Deterministic state model, NSAD-aligned.
- **Deployment**: Hosted at `https://lehasvv2009.github.io/territories/` from `/docs/`.
- **Tech Stack**: Tailwind v4, Iconify, HTMX, Vanilla JS.

## 4. Identified Gaps

### G1: Deployment Target
- **Status**: Currently `dist/`.
- **Requirement**: Must be `docs/`.
- **Action**: Update `Makefile` and relative paths.

### G2: Game Logic
- **Status**: Missing.
- **Requirement**: Deterministic reducer, phase management, grid board.

### G3: UI Components
- **Status**: Missing.
- **Requirement**: Phase controls, player info, board rendering, event log.

### G4: PWA Refinement
- **Status**: Basic.
- **Requirement**: Correct `start_url` and `scope` for GHP base path `/territories/`.

## 5. Risk Assessment
- **Base Path**: All assets must use relative paths to work under `/territories/`.
- **Persistence**: Ensuring full state snapshots to `localStorage` without corruption.
