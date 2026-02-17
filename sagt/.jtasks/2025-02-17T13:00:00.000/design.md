# Design: Territories Game

## 1. NSAD Analysis (MANDATORY)

STAGES:
- UI: DOM representation and HTMX fragments.
- Game Engine: JavaScript state model and Reducer.
- Storage: JSON-serialized localStorage.
- SW: Service Worker cache.

UNITS:
- UI render unit: Single `requestAnimationFrame` call or HTMX swap.
- Game tick unit: Atomic `dispatch(action)` resulting in a new state.
- Storage snapshot unit: Full `gameState` object.
- SW cache unit: Static file assets.

ALIGNMENT STATUS:
- **NSAD_ALIGNED**:
  - UI render unit is a direct projection of the Game state.
  - Turn completion (operational grain) maps exactly to the Storage snapshot unit (persistence grain).
  - Data structures are flat arrays/objects that map cleanly to JSON without complex transformation.

## 2. State Model
```javascript
const gameState = {
  board: [], // Array of { id, owner, troops }
  players: [], // Array of { id, color, name }
  currentPlayerIndex: 0,
  phase: 'reinforce',
  round: 1,
  status: 'active',
  log: []
};
```

## 3. Deployment Logic
- Target: `/docs/`
- Base Path: `/territories/`
- All URLs in `index.html`, `manifest.webmanifest`, and `sw.js` must be relative.

## 4. UI Shell
- **Header**: Title, Round, Reset.
- **Main**:
  - Left: Player list with stats.
  - Center: 10x10 Grid (CSS Grid).
  - Right: Phase control buttons (HTMX/JS).
- **Footer**: Scrolling event log.

## 5. Build Workflow
`Makefile` will:
1. Compile Tailwind v4.
2. Sync `src/` to `docs/`.
3. Handle base path adjustments if necessary.
