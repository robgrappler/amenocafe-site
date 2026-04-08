# Landing Page Enhancement — Design Spec
**Date:** 2026-04-08
**File:** `index.html`
**Scope:** Enhance the existing "Próximamente" coming-soon page (Option 2 — hero refinement + footer expansion). The full marketing site build is out of scope.

---

## Goals

- Surface a WhatsApp lead-gen entry point above the fold
- Add Instagram social link alongside the existing "Próximamente" badge
- Expand the footer with both location schedules
- Add a persistent WhatsApp FAB visible at all scroll positions
- Remove the "Próximamente" chip from the header nav so the header is logo-only

---

## Changes

### 1. Header — logo only

**Current:** Header has logo (`<picture>` with avif/webp/png sources) on the left and a "Próximamente" chip on the right.

**Change:** Remove the right-side chip entirely. The header becomes logo-only. The "Próximamente" badge moves down into the hero's badge row (see Change 2).

---

### 2. Hero — WhatsApp CTA + Instagram badge

**Current hero has:**
- Eyebrow: "Minatitlán, Veracruz"
- `<h1>`: "Estamos preparando algo *especial*."
- Single "Próximamente" badge (dark pill with pulsing dot)

**Add:**
- A WhatsApp CTA button directly below the `<h1>`, before the badge row:
  ```
  [WhatsApp icon] Cotizar evento
  ```
  Style: dark pill (`bg-cafe text-hueso`), same family as existing buttons. Opens WhatsApp with pre-filled message.

- Move the "Próximamente" badge into a flex row (`badge-row`) alongside a new Instagram link badge:
  ```
  [pulsing dot] Próximamente    [Instagram icon] @_amenocafe
  ```
  Instagram badge: outline style (border, transparent background), links to `https://www.instagram.com/_amenocafe/`.

**WhatsApp URL:**
```
https://wa.me/5215578688247?text=Hola%20Ameno%20Caf%C3%A9%2C%20me%20gustar%C3%ADa%20cotizar%20un%20evento.
```
The number `5215578688247` comes from `src/data/siteContent.js` → `brand.whatsappNumber`. Keep it in sync — define it as a JS const at the top of the inline script block.

---

### 3. Footer — expanded locations

**Current footer:**
```
Ameno Café · Minatitlán y Coatzacoalcos, Veracruz    |    Una nueva etapa está en camino.
```

**Replace with a two-column location schedule:**

| | |
|---|---|
| **Minatitlán** | Restaurante Katz · Av. 18 de Octubre 93, Santa Clara · Mar, Mié y Jue — 4:00 a 9:00 pm |
| **Coatzacoalcos** | Pop-ups en sedes rotativas · Vie, Sab y Dom — Síguenos en redes |

Right side: `© 2026 Ameno Café`

Layout: `flex flex-wrap gap-x-8 gap-y-4 items-start justify-between` with location block on the left and copyright on the right.

---

### 4. WhatsApp FAB

A fixed green floating action button at `bottom-6 right-6`, visible at all times.

- Background: `#25d366` (WhatsApp green)
- Icon: WhatsApp SVG (same as in hero CTA)
- Same `href` as the hero WhatsApp CTA
- Show/hide behavior: **always visible** (no scroll threshold — the current FAB code hides/shows past 300px; simplify to always-on since the page is short)
- `aria-label="Cotizar por WhatsApp"`

---

## What Does NOT Change

- Hero headline, eyebrow, artwork, animations, background photo, grain overlay, floating blobs
- Tailwind `@theme` tokens
- Inline `<style>` block
- JS scroll-reveal and intersection observer logic

---

## Implementation Notes

- All copy stays in Spanish (MX) with proper accent marks
- WhatsApp number should be a single `const whatsappNumber` referenced by both the hero CTA and the FAB — don't duplicate the string
- The Instagram URL `https://www.instagram.com/_amenocafe/` is already in `src/data/siteContent.js` for reference but should be hardcoded in `index.html` since this file has no imports
- No new dependencies, no build step changes
