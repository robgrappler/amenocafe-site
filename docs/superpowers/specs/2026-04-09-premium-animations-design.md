# Premium Animations — index.html
**Date:** 2026-04-09  
**Status:** Approved  

## Summary

Add two layered ambient animations to the coming-soon landing page (`index.html`) to elevate the premium feel without adding visual noise or slowing load time. No new dependencies. All CSS/JS stays inline in the single file.

---

## Animation 1 — Ghostly Rotating Mandala

### What
A large circular ornament element placed behind the logo in the hero section, rotating once per minute. Opacity is ~10% — visible only as a subtle watermark presence, not a foreground element.

### Asset
`assets/hero-mandala.png` (2152×1952, RGBA transparent PNG). Use the existing `.webp` variant for performance (`assets/hero-mandala.webp`).

### Implementation
- Add a `<div class="mandala-bg">` inside `.hero`, before the logo `<picture>` element
- `position: absolute`, centered with `top: 50%; left: 50%; transform: translate(-50%, -50%)`
- Width: `min(520px, 90vw)` — large enough to frame the logo, small enough on mobile
- `opacity: 0.09`
- `mix-blend-mode: multiply` — blends softly with the warm plaster background
- `animation: mandala-spin 60s linear infinite`
- `pointer-events: none` — never intercepts clicks
- `will-change: transform` for GPU compositing

```css
@keyframes mandala-spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
```

### Reduced motion
Inside the existing `@media (prefers-reduced-motion: reduce)` block: `animation: none` and keep it visible as a static decorative element (opacity stays, just no rotation).

---

## Animation 2 — Coffee Cup Photo with Rising Wisps

### What
A cropped photo of the branded Ameno Café iced latte pour (`assets/gallery-1.webp`) placed at the bottom center of the hero section. Above the cup, 3 semi-transparent CSS wisps animate upward, representing the aroma/essence of the coffee (artistic, not literal steam — the drink is iced).

### Asset
`assets/gallery-1.webp` (900×1605 portrait). Display only the top ~200px of the image (the cup rim and pour action) using `object-fit: cover; object-position: top center`.

### Layout
- New `<div class="cup-reveal">` at the end of `.hero`, after `.socials`
- `position: relative` within the normal flow — pushes content down slightly, so hero gets a bit more bottom padding
- The cup image is `position: relative`, width `min(180px, 46vw)`, height `200px` on desktop / `160px` on mobile
- Rounded top corners only: `border-radius: 14px 14px 0 0`
- Bottom bleeds off: `overflow: hidden` on the container, no bottom border-radius
- A `::after` pseudo-element on `.cup-reveal` adds a soft vignette fading the left/right/bottom edges into the background color

### Steam wisps
- 3 `<span class="wisp">` elements inside a `<div class="wisps">` positioned above the cup (`bottom: 100%` of the cup, centered)
- Each wisp: `width: 3–5px`, `background: linear-gradient(to top, rgba(255,248,235,0.55), transparent)`, `border-radius: 4px`, `filter: blur(2px)`
- `animation: wisp-rise 3.8s ease-in-out infinite` with delays: `0s`, `0.9s`, `1.8s`
- Wisps drift slightly sideways as they rise (using `translateX` in keyframes) for organic feel

```css
@keyframes wisp-rise {
  0%   { transform: translateY(0) translateX(0) scaleX(1); opacity: 0; }
  12%  { opacity: 0.7; }
  80%  { opacity: 0.2; }
  100% { transform: translateY(-52px) translateX(4px) scaleX(1.8); opacity: 0; }
}
```

### Reduced motion
Wisps: `animation: none`, wisps hidden (`opacity: 0`). Cup photo stays visible — it's a static image element, not an animation.

---

## What Does Not Change

- `ambient-drift` animation on `body::before` — stays as-is
- All load-reveal transitions (`.is-booting` / `.is-ready` pattern)
- Card hover effects
- Social circle hover effects
- WhatsApp form behavior

---

## Files Changed

| File | Change |
|------|--------|
| `index.html` | Add mandala element + CSS, add cup-reveal section + CSS + steam keyframes |

No new files created. No new assets added (both already exist in `assets/`).

---

## Responsive Behavior

| Breakpoint | Mandala | Cup |
|---|---|---|
| Desktop (>900px) | 520px wide, 9% opacity | 180px wide, 200px tall |
| Tablet (520–900px) | 380px wide | 150px wide, 170px tall |
| Mobile (<520px) | 280px wide | 120px wide, 140px tall |

---

## Performance Notes

- Mandala and wisps use only `transform` and `opacity` — both are compositor-only properties, no layout repaints
- `will-change: transform` on the mandala pre-promotes it to its own GPU layer
- `gallery-1.webp` is already optimized (900px wide source, displayed at ≤180px — heavily downsampled by the browser)
- Total new bytes added to index.html: ~2KB of CSS/HTML
