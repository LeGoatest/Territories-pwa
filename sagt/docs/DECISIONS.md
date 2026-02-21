# Project Name | Architectural Decisions

## [2025-02-21] TERR-PWA-AUTH-001: Service Worker Authority Reclassification
- **Status**: Accepted
- **Context**: Service Worker based state management (SSE) introduced lifecycle instability and state loss on SW restart, complicating the static GitHub Pages deployment.
- **Decision**: Service Worker authority is reduced to cache-only behavior. Game state is reclassified as client-authoritative. Engine and AI logic moved to `/docs/assets/js/engine.js`.
- **Consequences**: Removal of SW state authority and SSE streaming. Improved stability and simplified update model. Engine is now side-effect free and testable in page context.
