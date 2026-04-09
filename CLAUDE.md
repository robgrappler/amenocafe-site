# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for **Ameno Café**, a specialty coffee pop-up service in Minatitlán/Coatzacoalcos, Veracruz, México. No framework, no build step.

The repo contains two distinct surfaces:
1. **Public marketing site** — `index.html` (single self-contained file)
2. **Internal authoring routes** — `/client-intake/` and `/copy-editor/` (React apps, not public-facing)

## Development

**Preview locally** (required for the authoring routes, which use absolute asset paths):
```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Opening `index.html` directly works for the marketing page only.

**Run tests:**
```bash
node --test tests/editor-state.test.mjs
node --test tests/copy-editor-assets.test.mjs
node --test tests/editor-copy-text.test.mjs
# or all at once:
node --test tests/*.test.mjs
```

Tests use Node's built-in `node:test` runner — no test framework to install.

**Deploy:** Netlify is configured (`.netlify/netlify.toml`) with the repo root as publish directory. Push to `main` or drag-and-drop the folder in Netlify UI.

## Architecture

### Public marketing site — `index.html`

Fully self-contained: Tailwind CSS v4 browser edition via CDN, vanilla JS, no imports.

- **Styles**: `<style type="text/tailwindcss">` with `@theme {}` for brand tokens. Classes are compiled at runtime — no `tailwind.config.js`.
- **Brand tokens** (in `@theme`): `hueso` (#faf9f6), `cafe` (#2c1b18), `dorado` (#d4a373), `dorado-light`, `crema` — plus `font-serif` (Playfair Display) and `font-sans` (Montserrat).
- **JS behaviors**: scroll-reveal via `IntersectionObserver`, FAB show/hide past 300px scroll, WhatsApp quote form that constructs a `wa.me` URL.
- **WhatsApp number**: defined as `const whatsappNumber` in the inline script. Also appears in the FAB `href`. Both must stay in sync.
- Gallery images under `assets/gallery-*.webp` — real brand photography.

### Authoring routes — `src/`

React apps served as native ES modules (no bundler). React and htm are loaded from `esm.sh` CDN at runtime.

```
src/
  lib/
    browserReact.js      # Re-exports React 18, createRoot, htm — single import point for all components
    editorState.js       # Merge, autosave, intake→content mapping, export, and Netlify draft helpers
  data/
    siteContent.js       # DEFAULT_SITE_CONTENT — the canonical copy schema (what gets edited)
    clientIntake.js      # DEFAULT_CLIENT_INTAKE — onboarding form schema
  components/
    editor/
      ClientIntakeApp.js # Client onboarding form (autosaves to localStorage, exports JSON, POSTs to Netlify)
      CopyEditorApp.js   # Live copy editor with section screenshots and desktop/mobile preview toggle
      SectionCard.js     # Shared section wrapper component
      formControls.js    # TextInput, TextArea, ActionButton, TogglePill primitives
    site/
      ameno-routes.css   # Shared CSS for both authoring routes (brand vars, layout, field styles)
```

**Route entry points**: `client-intake/index.html` and `copy-editor/index.html` — each mounts its app into `<div id="app">` and includes a hidden Netlify form for draft submission.

**Data flow** (copy editor):
1. `DEFAULT_CLIENT_INTAKE` → `createClientIntakeState()` + localStorage → `ClientIntakeApp`
2. Intake draft → `mapIntakeToContent()` → merged with `DEFAULT_SITE_CONTENT` → `createCopyEditorState()`
3. `CopyEditorApp` writes to localStorage (`ameno-copy-editor-v1`) on every change, can export JSON or POST to Netlify (`ameno-client-drafts` form, `NETLIFY_DRAFT_FORM_NAME`).

**localStorage keys**: `ameno-client-intake-v1` and `ameno-copy-editor-v1` (defined as `STORAGE_KEYS` in `editorState.js`).

### Tests

- `tests/editor-state.test.mjs` — unit tests for `src/lib/editorState.js` merge/export logic
- `tests/copy-editor-assets.test.mjs` — asserts that all screenshot reference images exist under `assets/editor-sections/`
- `tests/editor-copy-text.test.mjs` — locks accented Spanish UI copy strings in both editor components

## Key Details

- **`mergeWithDefaults` vs `mergeKnownFields`** (in `editorState.js`): `mergeWithDefaults` copies extra keys from overrides; `mergeKnownFields` only keeps keys present in the defaults schema. The latter is used for intake state to strip legacy fields.
- **No `preferredCopy` in intake**: this field was removed from `DEFAULT_CLIENT_INTAKE`; any saved drafts containing it are silently dropped by `mergeKnownFields`.
- **Screenshot references** (`assets/editor-sections/*.png`): the copy editor displays static desktop/mobile screenshots alongside each section's fields. These must exist or the assets test fails.
- **`src/lib/browserReact.js`** is the only place that imports from `esm.sh`. All components import React from this module, not directly from the CDN.

## Content Language

All copy is in **Spanish (Mexico)**. Keep new UI text in Spanish, including accented characters. The `editor-copy-text` test will fail if accent marks are stripped from key UI strings.
