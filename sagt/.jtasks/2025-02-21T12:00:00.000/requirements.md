# Task: Architectural Stabilization + AI Level 2 + Governance Formalization

## Requirements
- Transition to Client-Authoritative Game Architecture.
- Relocate Engine + AI logic to `/docs/assets/js/engine.js`.
- Decommission SSE and Service Worker authority.
- Implement AI Level 2 heuristic with specified weights and tie-breakers.
- Stabilize DOM contract with data attributes.
- Harden Service Worker for cache-only behavior.
- Document Game Invariants and Canon Amendments.
- Support mouse and touch (ghost piece, anchor/confirm).
- Seed and Replay UI in HUD.

## Constraints
- No regressions in gameplay or UI.
- No new frameworks.
- Must remain GitHub Pages deployable.
- Maintain Tailwind v4 compatibility.
- Follow SAGT governance.
