# Task: Gameplay Refinements - Area Capture and Ghost Piece

## Requirements
- **Area Capture**: Implement a "Closed Loop" capture logic where any empty area fully enclosed by a player's tiles and/or the board boundary is automatically claimed by that player.
- **Ghost Piece**: Add a visual preview of the rectangle being placed. It should follow the mouse cursor and indicate validity (color-coded).
- **Placement Highlighting**: Clearly mark all valid starting coordinates for the current dice roll.
- **CI/CD Fix**: Resolve the Tailwind/Iconify build issue in GitHub Actions.

## Constraints
- Must not break existing PWA offline capabilities.
- Logic should reside in the Service Worker (Engine) as much as possible, with minimal client-side glue for UI responsiveness.
- Follow SAGT governance standards.
