# Design: Unified Asset and Build Fix

## Architecture Reference
- Following SAGT governance.
- Using PWA architecture with Service Worker as "server".
- Using Tailwind CSS v4 CLI for builds.

## Components
1. **Build Tooling**: Makefile for orchestration.
2. **CSS Pipeline**: Tailwind v4 with `@iconify/tailwind4` plugin.
3. **Asset Organization**:
   - `docs/assets/css/input.css` (Source)
   - `docs/assets/css/output.css` (Build Artifact)
   - `docs/assets/js/` (Libraries)
   - `docs/assets/images/` (Icons)

## Implementation Details
- Ensure `package.json` has correct devDependencies: `tailwindcss`, `@tailwindcss/cli`, `@iconify/tailwind4`, `@iconify-json/mdi`.
- Use absolute-ish relative paths in `input.css` if needed, or ensure CLI is run from root.
