# Game Invariants: Territories

This document formalizes the rules and invariants of the Territories strategy game. These are enforced by the canonical Engine and MUST be maintained by any UI or alternative implementations.

## 1. Board Geometry
- **Dimensions**: 40x15 grid.
- **Coordinates**: (0,0) is top-left, (39,14) is bottom-right.
- **Players**:
    - Player 1 (ALICE): Starts at (0,0).
    - Player 2 (BOB/AI): Starts at (39,14).

## 2. Placement Rules
- **Shape**: Placements must be rectangles defined by dice dimensions (e.g., 6x5 or 5x6).
- **Adjacency**:
    - Every new placement MUST be adjacent to at least one cell already owned by the current player.
    - Adjacency is defined as 4-direction (North, South, East, West).
    - **Diagonal adjacency does NOT count**.
- **Overlap**: A new rectangle cannot overlap any existing tiles (own or opponent's).
- **Boundary**: All cells of a placement must be within the 40x15 board limits.

## 3. Gameplay Loop
- **Turn Sequence**: Alice -> Bob (AI) -> Alice ...
- **Action**: A player must either **Place** a rectangle or **Pass**.
- **Dice**: Each turn, two dice (1-6) are rolled to determine the rectangle's dimensions.
- **Rotation**: A player may swap the width and height of the rectangle determined by the dice.
- **Game End**:
    - The game ends if the board is full.
    - The game ends if there are **two consecutive passes** (Pass Streak >= 2).
- **Winning**: The player with the most occupied cells wins.

## 4. Area Capture (Closed Loop)
- After a valid placement, the engine checks for captured areas.
- **Definition**: Any connected group of empty cells entirely enclosed by a player's tiles and/or the board boundaries is automatically claimed by that player.
- Capture logic MUST be deterministic.

## 5. UI Contract (DOM Data Attributes)
The board root element SHALL expose the following state for client-side logic:
- `data-current-player`: "P1" or "P2"
- `data-game-over`: "true" or "false"
- `data-dice-w`: Current active rectangle width
- `data-dice-h`: Current active rectangle height
