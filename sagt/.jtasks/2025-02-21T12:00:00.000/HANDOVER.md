# Handover - Architectural Stabilization & AI Level 2

## Changes

### 1. Architectural Shift (Client-Authoritative)
- **Engine Relocation**: All game logic, state management, and AI moved from the Service Worker to the client-side context (`docs/assets/js/engine.js`).
- **Decommissioned SSE**: Removed server-sent events and the Service Worker's "virtual backend" behavior to eliminate lifecycle and state-loss issues.
- **Service Worker Hardening**: Refactored `docs/sw.js` to a cache-only role. Added proper versioned cache cleanup, `self.skipWaiting()`, and `clients.claim()`.
- **Vanilla JS UI**: Board rendering and game-loop interactions refactored to Vanilla JS for high performance and synchronous validation.

### 2. AI Enhancements
- **AI Level 2**: Implemented a heuristic evaluation model using weighted components:
    - Area: 1.0
    - Capture Potential: 1.6
    - Frontier Expansion: 0.7
    - Opponent Mobility: 1.2
    - Edge Contact: 0.2
- **Determinism**: Ensured all AI moves are deterministic given a seed, with specific tie-breakers (Capture > Area > Lowest X > Lowest Y).

### 3. UI/UX Improvements
- **Start Screen**: Added difficulty selection (Level 1, Level 2, PVP).
- **HUD Features**: Integrated Seed display, Copy Seed, New Random Game, and Restart Same Seed controls.
- **Ghost Piece**: Responsive, color-coded placement preview for mouse and touch inputs.
- **Touch Support**: Implemented "Anchor then Confirm" pattern for mobile reliability.

### 4. Governance (SAGT)
- **Game Invariants**: Formalized game rules in `docs/GAME_INVARIANTS.md`.
- **Canon Amendment**: Recorded the SW reclassification as `TERR-PWA-AUTH-001` in `sagt/docs/DECISIONS.md`.
- **Root Links**: Integrated governance entry points into the project root and architecture docs.

### 5. Build & CI/CD
- **Tailwind CLI v4**: Stabilized the build process.
- **Dependency Optimization**: Removed unused libraries (`htmx`, `sse.js`) and ensured reliable CI/CD installation via `npm ci`.

## Verification
- **Unit Tests**: `tests/engine.test.js` verified Engine logic, Area Capture, and AI determinism.
- **Visual Verification**: Playwright screenshots confirmed UI rendering, start screen flow, and ghost piece accuracy.
