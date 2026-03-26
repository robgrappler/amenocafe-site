# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

Single-file static HTML website for **Ameno Café**, a specialty coffee pop-up service in Minatitlán/Coatzacoalcos, Veracruz, México. No framework, no build step.

## Development

**Preview locally:**

```bash
open index.html
# or serve with any static server:
python3 -m http.server 8080
```

**Deploy:** Netlify is configured (`.netlify/netlify.toml`) with the repo root as publish directory. Push to `main` or drag-and-drop the folder in Netlify UI.

## Architecture

Everything lives in **`index.html`** — a single self-contained file:

- **Styles**: Tailwind CSS v4 browser edition loaded via CDN (`@tailwindcss/browser@4`). Classes are compiled at runtime — no build step, no `tailwind.config.js`. Custom theme tokens are declared inside `<style type="text/tailwindcss">` using `@theme {}`.
- **Brand tokens** (defined in the `@theme` block):
  - `hueso` (#faf9f6) — off-white background
  - `cafe` (#2c1b18) — dark brown primary
  - `oro` (#d4a373) — gold accent
  - `font-serif` → Playfair Display, `font-sans` → Montserrat
- **JS**: Vanilla only. Three behaviors: scroll-reveal via `IntersectionObserver` (`.reveal` / `.reveal.active`), FAB show/hide on scroll past 300px, WhatsApp quote form builder.
- **Assets**: `assets/logo.png` — the brand logo (transparent background).

## Key Details

- **WhatsApp number** at line 295: `const whatsappNumber = "521234567890"` — this is a placeholder. The real number needs to be substituted here and in the FAB `href` at line 42.
- The quote form (`#cotizar`) does not POST anywhere — it constructs a `wa.me` URL and opens WhatsApp with a pre-filled message.
- Gallery images are Unsplash placeholders; replace with real brand photography when available.
- The `.bento-item` utility class is defined in the `@theme` block using `@apply`.

## Content Language

All copy is in **Spanish (Mexico)**. Keep new UI text in Spanish.
