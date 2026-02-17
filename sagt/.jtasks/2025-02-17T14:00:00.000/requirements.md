# Requirements: Territories (Fidelity)

## 1. Functional Requirements

### [FR-MECHANICS-GRID]
**The** board shall be a 15x40 grid of cells.

### [FR-MECHANICS-DICE]
**The** game shall provide two 6-sided dice that determine the height and width of the rectangle to be placed.

### [FR-MECHANICS-START]
**Player 1** shall start by placing their first rectangle in the top-left corner (0,0). **Player 2** shall start in the bottom-right corner (14,39).

### [FR-MECHANICS-ADJACENCY]
**Subsequent** rectangles MUST be placed adjacent (sharing at least one side) to an existing territory owned by the same player.

### [FR-MECHANICS-OVERLAP]
**Rectangles** shall not overlap existing occupied cells or exceed board boundaries.

## 2. Technical Requirements

### [TR-ENGINE-VANILLA]
**The** game engine shall be implemented in Vanilla JS using a pure state reducer, without external SPA frameworks.

### [TR-UI-WDBASIC]
**The** frontend shall follow `WDBASIC.md` and use Tailwind v4 for styling.

## 3. UI/UX Requirements

### [UR-VISUAL-PALETTE]
**The** UI shall use the original colors: Player 1 (#375E97), Player 2 (#FB6542).

### [UR-FEEDBACK-PREVIEW]
**The** UI shall provide a visual preview of the rectangle being placed, indicating valid (green/player-color) and invalid (red) areas.
