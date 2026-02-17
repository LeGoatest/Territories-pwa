# Gap Report: GitHub Pages PWA Implementation

## 1. Objective
Transform the `territories` repository into a functional Progressive Web App (PWA) hosted on GitHub Pages, following the SAGT governance and `WDBASIC.md` principles.

## 2. Current State
- **Governance**: SAGT v2.0 is installed in `./sagt/`.
- **Application Code**: None (empty repository except for `README.md` and governance).
- **Tooling**: No build scripts or dependency management in place.
- **Hosting**: GitHub Pages not yet configured.

## 3. Desired State
- **Core Stack**:
  - Tailwind CLI v4 (CSS)
  - Iconify (Icons)
  - HTMX (Interactivity)
  - Vanilla JS (PWA & Glue)
- **PWA Features**:
  - Manifest (`manifest.json`)
  - Service Worker (offline support)
  - Icons (multi-size)
- **Deployment**: Automatic build and deploy to GitHub Pages.
- **Compliance**: Adheres strictly to `sagt/docs/WDBASIC.md`.

## 4. Identified Gaps

### G1: Project Structure
- **Status**: Missing.
- **Requirement**: Establish `src/` and `dist/` (or similar) folders as per `WDBASIC.md`.

### G2: Build System
- **Status**: Missing.
- **Requirement**: Need a `Makefile` or shell script to handle Tailwind v4 compilation and asset bundling.

### G3: PWA Assets
- **Status**: Missing.
- **Requirement**: Manifest, service worker, and app icons.

### G4: Core Logic
- **Status**: Missing.
- **Requirement**: Main `index.html` with HTMX and Tailwind integration.

## 5. Risk Assessment
- **Tailwind v4**: Newest version, ensuring CLI compatibility.
- **Offline Support**: Basic caching strategy needed for PWA compliance.
- **HTMX**: Ensuring it fits the "Sovereign" model without excessive backend dependencies (since it's a static PWA).
