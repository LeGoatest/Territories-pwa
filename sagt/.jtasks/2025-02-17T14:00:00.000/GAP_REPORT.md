# Gap Report: Territories Game (Mechanical Fidelity)

## 1. Objective
Re-implement the Territories game with 100% mechanical fidelity to the original `lehaSVV2009/territories` while adhering to SAGT/WDBASIC constraints (Vanilla JS, No React).

## 2. Current State
- **Implementation**: Prototype version with 10x10 board and incorrect placement rules.
- **UI**: Basic layout, does not match original color scheme or scoreboard feel.
- **Engine**: Simple reducer, missing corner starts and strict adjacency checks.

## 3. Desired State
- **Board**: 15x40 grid.
- **Mechanics**:
  - Dice rolls determine rectangle height/width.
  - Player 1 starts at top-left.
  - Player 2 starts at bottom-right.
  - Placement must be adjacent to existing territory of the same player.
- **UI**: Visual match to original (Player 1: #375E97, Player 2: #FB6542).
- **Architecture**: NSAD-aligned, deterministic vanilla JS engine.

## 4. Identified Gaps

### G1: Logic Parity
- **Status**: Incorrect placement rules.
- **Requirement**: Implement `canDropRectangle` as per original `gameUtils.js`.

### G2: Scaling
- **Status**: 10x10 board.
- **Requirement**: Support 15x40 board with performant rendering.

### G3: Visuals
- **Status**: Placeholder styles.
- **Requirement**: Match the original's typography, colors, and layout structure (Scoreboard on left, board center, controls right).

## 5. Risk Assessment
- **Grid Performance**: 600 cells might be slow if DOM updates are inefficient.
- **Adjacency Math**: Precise implementation required to avoid illegal placements.
