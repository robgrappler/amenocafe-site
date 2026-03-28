# Ameno Cafe Site

Single-site static landing page for Ameno Cafe, plus two internal authoring routes for onboarding and live copy editing.

## Routes

- `/` - current production landing page in `index.html`
- `/client-intake/` - onboarding form for business details, copy requests, and assets
- `/copy-editor/` - copy editor with autosave, export JSON, reset, and screenshot references per section

## Local Preview

```bash
python3 -m http.server 8080
open http://localhost:8080/
open http://localhost:8080/client-intake/
open http://localhost:8080/copy-editor/
```

## Editor Workflow

1. Fill in `/client-intake/` to capture business details, tone of voice, section-level copy requests, and notes.
2. The intake draft autosaves locally in the browser.
3. Open `/copy-editor/` to preload the current site copy, optionally apply the intake draft, and edit section by section with a screenshot reference next to each editable block.
4. Export JSON from either page when you want a portable handoff artifact.

## Project Structure

- `index.html` - production landing page
- `client-intake/index.html` - entrypoint for the intake workflow
- `copy-editor/index.html` - entrypoint for the live copy editor
- `src/data/siteContent.js` - default editable site copy and structured content schema
- `src/data/clientIntake.js` - intake data schema and defaults
- `src/lib/editorState.js` - shared merge, reset, export, and intake-to-editor mapping helpers
- `src/components/editor/*` - intake/editor UI components
- `src/components/site/*` - shared route styles for the intake/editor experience
- `assets/editor-sections/*` - screenshot references used by the copy editor
- `tests/editor-state.test.mjs` - dependency-free Node tests for shared state helpers

## Tests

```bash
node --test tests/editor-state.test.mjs
```
