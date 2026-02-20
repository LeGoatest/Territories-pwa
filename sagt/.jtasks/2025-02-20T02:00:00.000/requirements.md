# Requirements: Fix Build and Deployment

## R1 — Deterministic Build
WHEN `make build` is executed
THE SYSTEM SHALL compile Tailwind CSS v4 and output to `docs/assets/css/output.css`.

## R2 — PWA Asset Integrity
THE SYSTEM SHALL serve all dependencies (HTMX, SSE, Iconify) from local `docs/assets/js/` paths.

## R3 — Icon Rendering
THE SYSTEM SHALL render Material Design Icons using the Iconify Tailwind v4 plugin.

## R4 — Successful CI/CD
WHEN code is pushed to `main`
THE SYSTEM SHALL automatically build and deploy to GitHub Pages environment `github-pages`.
