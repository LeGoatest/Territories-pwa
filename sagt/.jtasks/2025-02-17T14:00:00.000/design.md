# Design: Territories (Fidelity)

## 1. NSAD Analysis

STAGES:
- UI (DOM/Tailwind)
- Game Engine (JS Reducer)
- Storage (localStorage)
- SW (Caching)

UNITS:
- UI render unit: Full board refresh (600 cells).
- Game tick unit: Atomic `dispatch` (Move/Roll).
- Storage snapshot unit: Complete `gameState` object.

ALIGNMENT:
- **NSAD_ALIGNED**: The natural unit of the engine (gameState) packs natively into the persistence grain (JSON in Storage). The UI render unit is a projection of the state.

## 2. Component Architecture

### 2.1 State Reducer
Handles:
- `ROLL_DICE`: Generates `[h, w]`.
- `SWAP_AXIS`: Toggles `[h, w]` to `[w, h]`.
- `PLACE`: Validates and updates board.
- `SKIP`: Ends turn.

### 2.2 Placement Logic
```javascript
function canPlace(board, player, r, c, h, w) {
  // 1. In bounds?
  // 2. No overlap?
  // 3. First turn? (Check corners)
  // 4. Adjacent? (Check neighbors for same player color)
}
```

## 3. UI Implementation
- **Layout**: Grid 40 columns.
- **Preview**: Rendered on `mouseenter` of grid cells.
- **HTMX**: Used for "Rules" and "Settings" overlays to keep the main shell lightweight.
