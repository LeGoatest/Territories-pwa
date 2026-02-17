# Design: Territories PWA

## 1. System Architecture
The application follows the **WDbasic** philosophy, utilizing a static-site approach compatible with GitHub Pages.

### 1.1 Core Components
- **Shell**: `index.html` serves as the primary entry point and UI container.
- **Interactivity**: HTMX handles dynamic content loading by fetching HTML fragments from the `./fragments/` directory.
- **Styling**: Tailwind v4 utility classes defined directly in HTML.
- **PWA Layer**:
  - `manifest.json`: Defines app metadata and installability.
  - `sw.js`: Service worker handling basic asset caching and offline fallback.

## 2. Directory Mapping
```text
/
├── dist/               # Build output (Target for Deployment)
│   ├── index.html
│   ├── manifest.json
│   ├── sw.js
│   ├── assets/         # Icons and static images
│   ├── css/            # Compiled Tailwind output
│   └── fragments/      # Static HTML fragments for HTMX
├── src/                # Source assets
│   ├── index.html
│   ├── input.css       # Tailwind source
│   ├── js/             # JS modules
│   └── fragments/      # Source fragments
├── Makefile            # Build orchestration
└── tailwind.config.js  # (If needed for v4 CLI)
```

## 3. Technology Integration

### 3.1 Tailwind CLI v4
Used as a standalone binary or via Node to compile utility classes.
Command: `tailwindcss -i ./src/input.css -o ./dist/css/output.css`

### 3.2 HTMX
Fetched from CDN or vendored. Handles component swaps:
`<div hx-get="fragments/features.html" hx-trigger="load"></div>`

### 3.3 Iconify
Integration via Iconify SVG Framework (minimal JS) for consistent iconography.

## 4. Compliance Check
- [x] **SEO-First**: Static HTML ensures indexability.
- [x] **HTMX-First**: Interactivity driven by HTMX.
- [x] **Minimal JS**: JS limited to Service Worker registration and essential UI logic.
- [x] **Sovereign Boundaries**: Clear separation between `src/` and `dist/`.
