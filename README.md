# Territories PWA

A strategy game of dice-based rectangle expansion, built with Tailwind CSS v4, HTMX, and Vanilla JS.

## Architecture

This project follows a **Client-Authoritative Game Architecture**.

- **State Management**: The game state and engine logic reside entirely in the client (browser page context).
- **Engine**: A pure, side-effect free logic module located at `docs/assets/js/engine.js`.
- **UI**: Vanilla JS DOM manipulation for performance-critical board interactions and ghost piece previews. HTMX for non-board UI components.
- **Service Worker**: Cache-only, providing offline capability and asset precaching. No game logic is held in the Service Worker.
- **Deployment**: Optimized for static hosting on GitHub Pages.

## Governance

This repository is governed by the **Sovereign Agent Governance Template (SAGT)**.

- **Canonical Index**: [SAGT_INDEX.md](SAGT_INDEX.md)
- **Game Invariants**: [docs/GAME_INVARIANTS.md](docs/GAME_INVARIANTS.md) - Formal rules and constraints.
- **Architectural Decisions**: [sagt/docs/DECISIONS.md](sagt/docs/DECISIONS.md)

## Development

### Requirements
- Node.js
- Tailwind CSS CLI v4

### Build
To build the Tailwind CSS output:
```bash
make build
```

### Watch (Development)
```bash
npx @tailwindcss/cli -i docs/assets/css/input.css -o docs/assets/css/output.css --watch
```
