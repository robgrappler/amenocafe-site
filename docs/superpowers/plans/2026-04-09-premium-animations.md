# Premium Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a ghostly rotating mandala behind the hero logo and an Ameno Café branded coffee cup photo with animated rising wisps at the bottom of the hero section.

**Architecture:** All changes are CSS + HTML additions inside `index.html` — the single self-contained marketing page. No new assets needed (both `assets/hero-mandala.webp` and `assets/gallery-1.webp` already exist). Two independent visual layers: the mandala runs as a full-time CSS animation behind all hero content; the cup scene is a normal-flow element anchored at the bottom of the hero with absolutely-positioned wisp elements above it.

**Tech Stack:** Vanilla CSS keyframe animations, `transform`/`opacity` only (compositor-only, no layout repaints), `prefers-reduced-motion` media query already present in the file.

---

## File Map

| File | Change |
|------|--------|
| `index.html` | Add `position: relative` to `.hero`; add `.mandala-bg` element + CSS; add `.cup-scene` element + CSS; update `prefers-reduced-motion` block |

No new files. No new assets.

---

## Task 1 — Rotating Mandala

**Files:**
- Modify: `index.html` — `.hero` rule, new `.mandala-bg` CSS block, new `@keyframes mandala-spin`, `@media (prefers-reduced-motion: reduce)` block

### Step 1 — Add `position: relative` to `.hero`

The `.hero` rule currently has no `position`. The mandala needs `.hero` as its containing block.

Find this rule in `<style>` (around line 194):
```css
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 56px 24px 64px;
  text-align: center;
}
```

Change it to:
```css
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 56px 24px 64px;
  text-align: center;
  position: relative;
}
```

- [ ] Make this edit

### Step 2 — Add mandala CSS

Add this block immediately after the `.hero` rule (before the `.logo-img` rule):

```css
/* ── MANDALA ─────────────────────────────────────── */
.mandala-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(520px, 90vw);
  aspect-ratio: 1;
  opacity: 0.09;
  mix-blend-mode: multiply;
  pointer-events: none;
  will-change: transform;
  animation: mandala-spin 60s linear infinite;
}

@keyframes mandala-spin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to   { transform: translate(-50%, -50%) rotate(360deg); }
}
```

- [ ] Add this CSS block

### Step 3 — Add mandala HTML element

Find the `<!-- HERO -->` section (around line 483). The first child inside `.hero` is currently the `<picture>` logo. Insert the mandala `<div>` as the first child, before it:

```html
<!-- HERO -->
<section class="hero">

  <div class="mandala-bg" aria-hidden="true">
    <img src="assets/hero-mandala.webp" alt="" width="520" height="520" style="width:100%;height:100%;object-fit:contain;" />
  </div>

  <picture>
    <img src="assets/amenologo-nobg1.webp" ...
```

- [ ] Add the mandala div as first child of `.hero`

### Step 4 — Update `prefers-reduced-motion` block

Find the existing `@media (prefers-reduced-motion: reduce)` block. Add `.mandala-bg` to the list of animated elements that get `animation: none`:

After the last rule in that block (`body::before { animation: none; }`), add:

```css
.mandala-bg { animation: none; }
```

- [ ] Add this line to the reduced-motion block

### Step 5 — Local verify mandala

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

Expected: a faint circular ornament very slowly rotating behind the logo. Should be barely perceptible — like a watermark. If it's too prominent, reduce opacity to `0.06`.

- [ ] Confirm mandala is visible, subtle, not distracting

### Step 6 — Commit

```bash
git add index.html
git commit -m "feat: add ghostly rotating mandala to hero section"
```

- [ ] Commit

---

## Task 2 — Coffee Cup Photo + Rising Wisps

**Files:**
- Modify: `index.html` — new `.cup-scene`, `.cup-frame`, `.cup-photo`, `.wisps`, `.wisp` CSS rules; new `@keyframes wisp-rise`; responsive rules; `prefers-reduced-motion` block; HTML after `.socials`

### Step 1 — Add cup scene CSS

Add the following CSS block after the `.social-circle` rules and before the `/* ── SERVICES ── */` comment:

```css
/* ── CUP SCENE ───────────────────────────────────── */
.cup-scene {
  position: relative;
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cup-frame {
  width: min(180px, 46vw);
  height: 200px;
  border-radius: 14px 14px 0 0;
  overflow: hidden;
  position: relative;
}

/* vignette — blends cup edges into the plaster background */
.cup-frame::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to right,
      rgba(176, 127, 70, 0.55) 0%,
      transparent 28%,
      transparent 72%,
      rgba(176, 127, 70, 0.55) 100%
    ),
    linear-gradient(to bottom,
      transparent 50%,
      rgba(110, 68, 24, 0.88) 100%
    );
  pointer-events: none;
}

.cup-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.wisps {
  display: flex;
  gap: 9px;
  align-items: flex-end;
  height: 54px;
}

.wisp {
  display: block;
  border-radius: 4px;
  background: linear-gradient(to top, rgba(255, 248, 235, 0.6), transparent);
  filter: blur(2.5px);
  animation: wisp-rise 3.8s ease-in-out infinite;
}
.wisp:nth-child(1) { width: 3px; height: 32px; animation-delay: 0s; }
.wisp:nth-child(2) { width: 5px; height: 40px; animation-delay: 0.9s; }
.wisp:nth-child(3) { width: 3px; height: 28px; animation-delay: 1.8s; }

@keyframes wisp-rise {
  0%   { transform: translateY(0)     translateX(0)   scaleX(1);   opacity: 0; }
  12%  {                                                             opacity: 0.75; }
  80%  {                                                             opacity: 0.2; }
  100% { transform: translateY(-52px) translateX(4px) scaleX(1.8); opacity: 0; }
}
```

- [ ] Add this CSS block

### Step 2 — Add responsive adjustments for cup

Find the existing `@media (max-width: 900px)` rule. Add to it:

```css
@media (max-width: 900px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
  .cup-frame { width: min(150px, 46vw); height: 170px; }
}
```

Find the existing `@media (max-width: 520px)` rule. Add to it:

```css
@media (max-width: 520px) {
  .cards { grid-template-columns: 1fr; }
  .services { padding-bottom: 56px; }
  .notify-form {
    grid-template-columns: 1fr;
    border-radius: 12px;
  }
  .notify-form button { padding: 14px; }
  .cup-frame { width: min(120px, 44vw); height: 140px; }
}
```

- [ ] Add cup-frame responsive sizes to both breakpoints

### Step 3 — Add cup scene HTML

Find the `.socials` div (around line 514). After its closing `</div>`, insert:

```html
      </div>

      <div class="cup-scene reveal" aria-hidden="true" style="--reveal-delay: 1100ms;">
        <div class="wisps">
          <span class="wisp"></span>
          <span class="wisp"></span>
          <span class="wisp"></span>
        </div>
        <div class="cup-frame">
          <img src="assets/gallery-1.webp" alt="" class="cup-photo" loading="lazy" />
        </div>
      </div>

    </section>
```

Note: the `reveal` class and `--reveal-delay: 1100ms` give it a staggered fade-in after the socials (which are at `920ms`). The element needs to be added to the booting/ready state selectors in the next step.

- [ ] Add cup-scene HTML after `.socials`

### Step 4 — Add cup-scene to booting/ready state selectors

Find the `body.is-booting` rule block (around line 81). It lists several selectors. Add `.cup-scene` to both the `body.is-booting` and `body.is-ready` selector lists:

Before:
```css
body.is-booting .reveal,
body.is-booting .logo-img,
...
body.is-booting .services-footer {
  opacity: 0;
  transform: translateY(28px) scale(0.98);
}
```

After (add `.cup-scene` to is-booting):
```css
body.is-booting .reveal,
body.is-booting .logo-img,
body.is-booting .tagline,
body.is-booting .notify-form,
body.is-booting .socials,
body.is-booting .section-title,
body.is-booting .section-sub,
body.is-booting .card,
body.is-booting .services-footer {
  opacity: 0;
  transform: translateY(28px) scale(0.98);
}
```

Actually — since `.cup-scene` already has the `reveal` class, it is already covered by `body.is-booting .reveal` and `body.is-ready .reveal`. No changes needed to those selectors.

- [ ] Confirm `.reveal` class is on `.cup-scene` (check Step 3 HTML — it is)
- [ ] No selector changes needed

### Step 5 — Update `prefers-reduced-motion` block

Add to the existing `@media (prefers-reduced-motion: reduce)` block (after the `.mandala-bg` line you added in Task 1):

```css
.mandala-bg { animation: none; }
.wisp { animation: none; opacity: 0; }
```

- [ ] Add `.wisp` rule to reduced-motion block

### Step 6 — Local verify cup scene

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

Expected:
- Espresso pour photo visible at bottom of hero, cropped to show cup rim and pour action, edges softly fading into background
- 3 wisp elements gently rising above the cup, staggered, semi-transparent
- On mobile (resize browser to <520px): cup shrinks proportionally, stays centered

If the vignette color looks off against the plaster background, adjust the `rgba(176, 127, 70, 0.55)` values in `.cup-frame::after` to better match the background texture tone at the bottom of the hero.

- [ ] Confirm cup photo renders correctly
- [ ] Confirm wisps animate smoothly
- [ ] Confirm mobile sizing looks right

### Step 7 — Commit

```bash
git add index.html
git commit -m "feat: add branded coffee cup with wisp animations to hero"
```

- [ ] Commit

---

## Task 3 — Final Check + Deploy

### Step 1 — Check `prefers-reduced-motion`

Open browser DevTools → Rendering → check "Emulate CSS media feature prefers-reduced-motion: reduce".

Expected:
- Mandala visible but static (no rotation)
- Cup photo visible (static image, always shown)
- Wisps invisible (`opacity: 0`, `animation: none`)
- `ambient-drift` on body::before also stops (already handled)
- All load-reveal transitions also stop (already handled)

- [ ] Confirm reduced-motion behavior is correct

### Step 2 — Run existing tests

```bash
node --test tests/*.test.mjs
```

Expected: all pass. The animation changes are CSS/HTML only and don't affect the editor state, asset references (we're not adding new required assets), or copy strings.

- [ ] Tests pass

### Step 3 — Commit and push

```bash
git push origin main
```

Netlify will deploy automatically on push to `main`.

- [ ] Push to main
- [ ] Verify on https://amenocafe.com — both animations visible in production
