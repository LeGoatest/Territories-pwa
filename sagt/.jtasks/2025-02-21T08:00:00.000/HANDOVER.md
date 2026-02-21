# Handover - Gameplay Refinements

## Changes
- **Area Capture**: Implemented `applyAreaCapture` in `Engine` class using flood-fill. It captures any empty region enclosed by a player's tiles and board edges.
- **Ghost Piece**: Added a CSS/JS-based ghost piece that follows the mouse cursor over the board.
- **Placement Highlighting**: Valid coordinates are marked in the SW-rendered board and used by the client-side JS to show a "valid" vs "invalid" ghost piece.
- **CI/CD Fix**: Updated `.github/workflows/deploy.yml` to use `npm ci` and added `@iconify/json` to `package.json` to resolve registry/missing icon issues.

## Verification
- Standalone engine test passed for capture logic.
- Playwright screenshot confirmed ghost piece rendering and positioning.
- Local build `make build` successful.
