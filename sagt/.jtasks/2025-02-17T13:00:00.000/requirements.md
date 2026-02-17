# Requirements: Territories Game

## 1. Functional Requirements

### [FR-GAME-BOARD]
**The** system shall provide a deterministic grid board (10x10) where each cell is a territory.

### [FR-GAME-PHASES]
**The** system shall enforce turn phases: Reinforce -> Attack -> Fortify -> End Turn.

### [FR-GAME-DETERMINISM]
**All** state transitions shall be processed via a pure reducer function to ensure determinism.

### [FR-PWA-GHP]
**The** application shall function correctly when served from the `/territories/` base path on GitHub Pages.

## 2. Technical Requirements

### [TR-NSAD-ALIGNMENT]
**The** design shall align the UI render unit, Game tick unit, and Storage snapshot unit to minimize boundary cost.

### [TR-STYLING-TAILWIND]
**The** UI shall be styled exclusively with Tailwind CLI v4 and Iconify icons.

### [TR-PERSISTENCE]
**The** system shall save the full `gameState` to `localStorage` upon every turn completion.

## 3. UI/UX Requirements

### [UR-SHELL-LAYOUT]
**The** UI shall feature a header (game info), a left sidebar (player list), a center board, and a right sidebar (phase controls).

### [UR-HTMX-NAV]
**HTMX** shall handle navigation between "Game", "Rules", and "Settings" screens.
