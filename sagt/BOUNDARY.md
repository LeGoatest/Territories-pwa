# Governance Boundary

This document defines the separation between **Governance (The Law)** and **Product (The Execution)** in this repository.

## 1. Governance Realm (`./sagt/`)
- **Authority**: Contains all laws, policies, and operating instructions.
- **Ownership**: Canonical law for Jules and all subsequent agents.
- **Modification**: Subject to the formal process in `./docs/MUTATION_PROCESS.md`.

## 2. Product Realm (`./`)
- **Authority**: Subordinate to Governance.
- **Scope**: Contains the `territories` application code, assets, and project-specific documentation (e.g., the root `README.md`).
- **Upcoming Work**: The GitHub Pages PWA build (Tailwind CLI v4 + Iconify + HTMX + JS) resides here.

## 3. Interaction Rules
- Product code MUST NOT contradict Governance.
- Governance documents SHOULD NOT contain product-specific implementation details unless they are defined as System Invariants in `./docs/INVARIANT_MODEL.md`.
- Agents MUST respect this boundary to prevent architectural drift.
