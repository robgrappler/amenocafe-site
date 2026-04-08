# Landing Page Enhancement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance `index.html` with a WhatsApp lead-gen CTA in the hero, Instagram badge, expanded location footer, and a persistent WhatsApp FAB.

**Architecture:** All changes are confined to `index.html`. New CSS goes into the existing `<style type="text/tailwindcss">` block. HTML changes touch the header (lines 115–129), hero text column (lines 133–146), and footer (lines 163–168). A new `<script>` block before `</body>` defines `const whatsappNumber` and sets `href` on all `.wa-link` elements via `querySelectorAll`.

**Tech Stack:** HTML, Tailwind CSS v4 (browser CDN, `@tailwindcss/browser@4`), vanilla JS (no framework, no build step)

**Local preview:** `python3 -m http.server 8080` → `http://localhost:8080`

---

### Task 1: Add CSS — dot pulse animation + FAB styles

**Files:**
- Modify: `index.html:86-93` (`.dot` rule inside `<style type="text/tailwindcss">`)

This task adds the pulsing animation to the existing `.dot` class and a new `.fab-wa` class for the WhatsApp FAB button. No new files.

- [ ] **Step 1: Add `dot-pulse` keyframe and animation to `.dot`**

Inside the `<style type="text/tailwindcss">` block, replace the `.dot` rule (currently lines 86–92):

```css
    @keyframes dot-pulse {
      0%, 100% { box-shadow: 0 0 0 6px rgba(212, 163, 115, 0.15); }
      50%       { box-shadow: 0 0 0 10px rgba(212, 163, 115, 0.05); }
    }

    .dot {
      width: 0.55rem;
      height: 0.55rem;
      border-radius: 999px;
      background: #D4A373;
      box-shadow: 0 0 0 6px rgba(212, 163, 115, 0.15);
      animation: dot-pulse 2.4s ease-in-out infinite;
    }
```

- [ ] **Step 2: Add `.fab-wa` class after the `.dot` rule**

```css
    .fab-wa {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 50;
      width: 3.25rem;
      height: 3.25rem;
      border-radius: 999px;
      background: #25D366;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(37, 211, 102, 0.38);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .fab-wa:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 28px rgba(37, 211, 102, 0.48);
    }
```

- [ ] **Step 3: Preview and verify**

Open `http://localhost:8080`. The gold pulsing dot in the hero badge should now breathe in/out. No other visual change yet.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "style: add dot pulse animation and fab-wa CSS class"
```

---

### Task 2: Header — logo only (remove "Próximamente" chip)

**Files:**
- Modify: `index.html:115-129`

The header currently has a logo `<a>` on the left and a `.chip` "Próximamente" pill on the right. Remove the chip entirely — the header becomes logo-only. The "Próximamente" badge will appear in the hero's badge row (Task 4).

- [ ] **Step 1: Replace the header block**

Replace lines 115–129 with:

```html
    <header class="max-w-7xl mx-auto px-6 pt-6 sm:pt-8">
      <a href="#">
        <picture>
          <source srcset="assets/logo.avif" type="image/avif">
          <source srcset="assets/logo.webp" type="image/webp">
          <img src="assets/logo.png" alt="Ameno Café" class="h-9 sm:h-10 w-auto">
        </picture>
      </a>
    </header>
```

- [ ] **Step 2: Preview and verify**

Open `http://localhost:8080`. The header shows only the logo — no pill/chip on the right.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: header logo-only, remove Próximamente chip"
```

---

### Task 3: Hero — add WhatsApp CTA button below `<h1>`

**Files:**
- Modify: `index.html:137-145`

Insert a WhatsApp CTA `<a>` directly after `</h1>` and before the existing "Próximamente" badge. The button gets `fade-up delay-2`. The existing badge will be updated in Task 4 to shift to `delay-3`.

- [ ] **Step 1: Add the WhatsApp button after `</h1>`**

The current hero text column ends with the `<h1>` at line 137–141 followed immediately by the badge at line 142. Insert the following between `</h1>` and the badge `<div>`:

```html
          <a href="#" class="wa-link fade-up delay-2 inline-flex items-center gap-2 self-start rounded-full bg-cafe text-hueso px-5 py-3 text-sm font-semibold shadow-lg shadow-cafe/10 mb-5 no-underline" aria-label="Cotizar por WhatsApp">
            <svg class="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.557 4.12 1.527 5.845L.057 23.5l5.797-1.448A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.838 0-3.563-.5-5.055-1.37l-.361-.214-3.44.859.874-3.353-.235-.374A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            Cotizar evento
          </a>
```

- [ ] **Step 2: Update the existing badge's animation delay from `delay-2` to `delay-3`**

The existing badge on the next line currently reads:
```html
          <div class="fade-up delay-2 inline-flex items-center gap-3 rounded-full bg-cafe text-hueso px-5 py-3 text-sm font-medium shadow-lg shadow-cafe/10">
```

Change `delay-2` → `delay-3` so it staggers after the new button.

- [ ] **Step 3: Preview and verify**

Open `http://localhost:8080`. The hero now shows: eyebrow → headline → WhatsApp dark pill button → "Próximamente" dark pill below it. The button has `href="#"` (placeholder until Task 6).

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add WhatsApp CTA button to hero"
```

---

### Task 4: Hero — convert badge to badge-row with Instagram link

**Files:**
- Modify: `index.html` (the existing "Próximamente" badge in the hero text column)

Replace the existing dark `bg-cafe` "Próximamente" badge with a lighter `.chip`-style badge in a flex row alongside a new Instagram badge. The dark CTA role is now fulfilled by the WhatsApp button from Task 3.

- [ ] **Step 1: Replace the Próximamente badge with a badge-row**

The current badge (updated to `delay-3` in Task 3) looks like:
```html
          <div class="fade-up delay-3 inline-flex items-center gap-3 rounded-full bg-cafe text-hueso px-5 py-3 text-sm font-medium shadow-lg shadow-cafe/10">
            <span class="h-2.5 w-2.5 rounded-full bg-dorado"></span>
            Próximamente
          </div>
```

Replace it entirely with:

```html
          <div class="fade-up delay-3 flex items-center flex-wrap gap-3">
            <div class="chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium tracking-[0.18em] uppercase text-cafe/80">
              <span class="dot"></span>
              Próximamente
            </div>
            <a href="https://www.instagram.com/_amenocafe/" target="_blank" rel="noopener noreferrer" class="chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium text-cafe/70 no-underline">
              <svg class="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              @_amenocafe
            </a>
          </div>
```

- [ ] **Step 2: Preview and verify**

Open `http://localhost:8080`. The hero now shows:
- WhatsApp dark pill CTA ("Cotizar evento")
- Below it: lighter "Próximamente" chip (with pulsing dot) + Instagram chip side by side

Both chips use the existing `.chip` hover style (subtle lift + gold border on hover).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: badge row with Próximamente chip + Instagram link in hero"
```

---

### Task 5: Footer — expand with location schedules

**Files:**
- Modify: `index.html:163-168`

Replace the one-line footer with a two-column location schedule. Location data comes from `src/data/siteContent.js` → `footer.locations` — copy it verbatim.

- [ ] **Step 1: Replace the footer block**

Replace lines 163–168:

```html
    <footer class="max-w-7xl mx-auto px-6 pb-8 pt-6 border-t border-cafe/10">
      <div class="flex flex-wrap items-start justify-between gap-x-8 gap-y-4 text-sm">
        <div class="flex flex-wrap gap-x-8 gap-y-4 text-cafe/60">
          <div>
            <p class="font-semibold text-cafe mb-1">Minatitlán</p>
            <p>Restaurante Katz · Av. 18 de Octubre 93, Santa Clara</p>
            <p>Mar, Mié y Jue — 4:00 a 9:00 pm</p>
          </div>
          <div>
            <p class="font-semibold text-cafe mb-1">Coatzacoalcos</p>
            <p>Pop-ups en sedes rotativas</p>
            <p>Vie, Sab y Dom — Síguenos en redes</p>
          </div>
        </div>
        <p class="text-cafe/40">© 2026 Ameno Café</p>
      </div>
    </footer>
```

- [ ] **Step 2: Preview and verify**

Open `http://localhost:8080`. The footer shows two location blocks on the left (Minatitlán / Coatzacoalcos with schedules) and "© 2026 Ameno Café" on the right. On narrow screens they stack vertically.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: expand footer with location schedules for both cities"
```

---

### Task 6: WhatsApp FAB + wire up `whatsappNumber` const

**Files:**
- Modify: `index.html:170` (just before `</body>`)

Add a persistent green WhatsApp FAB and a `<script>` block that defines `const whatsappNumber` and sets `href` on every `.wa-link` element (the hero CTA from Task 3 and the FAB added here).

- [ ] **Step 1: Add FAB and script before `</body>`**

Insert the following immediately before `</body>`:

```html
  <a href="#" class="wa-link fab-wa" aria-label="Cotizar por WhatsApp">
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.557 4.12 1.527 5.845L.057 23.5l5.797-1.448A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.838 0-3.563-.5-5.055-1.37l-.361-.214-3.44.859.874-3.353-.235-.374A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
    </svg>
  </a>

  <script>
    var whatsappNumber = '5215578688247';
    var waMsg = encodeURIComponent('Hola Ameno Café, me gustaría cotizar un evento.');
    var waUrl = 'https://wa.me/' + whatsappNumber + '?text=' + waMsg;
    document.querySelectorAll('.wa-link').forEach(function(el) {
      el.setAttribute('href', waUrl);
    });
  </script>
```

Note: `var` is used instead of `const`/`let` for broadest browser compatibility without a transpiler.

- [ ] **Step 2: Preview and verify**

Open `http://localhost:8080`:
- Green FAB appears in the bottom-right corner at all scroll positions
- Click the hero WhatsApp button → WhatsApp opens with pre-filled "Hola Ameno Café, me gustaría cotizar un evento."
- Click the FAB → same pre-filled message
- Hover over FAB → lifts slightly

- [ ] **Step 3: Run existing tests to confirm nothing is broken**

```bash
node --test tests/editor-state.test.mjs tests/editor-copy-text.test.mjs
```

Expected: all tests pass (these test `src/` JS files, not `index.html`, so they should be unaffected).

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add WhatsApp FAB and wire up whatsappNumber const"
```
