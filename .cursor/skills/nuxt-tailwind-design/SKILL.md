---
name: nuxt-tailwind-design
description: >-
  Sets up Tailwind CSS 4 in Nuxt with @tailwindcss/vite, design tokens via @theme,
  layered CSS (base/components/utilities), semantic color utilities, focus-visible
  accessibility, and when to use utilities vs component classes. Use when adding
  Tailwind to Nuxt, creating design tokens, styling CMS sites, or building a UI kit page.
---

# Nuxt + Tailwind 4 — Design System

Tailwind 4 in Nuxt uses the Vite plugin and CSS-first config (`@theme`), not `tailwind.config.js`.

## Setup

```bash
npm i -D tailwindcss @tailwindcss/vite
```

```ts
// nuxt.config.ts
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  css: ['~/src/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

```css
/* src/css/main.css */
@import './tokens.css';
@import 'tailwindcss';
```

No `postcss.config` required with `@tailwindcss/vite`.

## Design tokens (`@theme`)

Define semantic tokens once — utilities like `bg-paper`, `text-cocoa`, `shadow-elevation-2` are generated automatically:

```css
/* src/css/tokens.css */
@theme {
  /* Colors — semantic names, not raw hex in components */
  --color-paper: #faf8f4;
  --color-surface: #f2e8da;
  --color-border: #ddd6c7;
  --color-accent: #c45a2a;
  --color-text: #5a3e2b;
  --color-text-muted: #7a6558;
  --color-error: #c44a3a;

  /* Typography */
  --font-heading: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-logo: 'Delius', cursive;

  /* Layout & motion */
  --radius-ui: 6px;
  --shadow-elevation-1: 0 2px 8px rgb(0 0 0 / 0.06);
  --ease-organic: cubic-bezier(0.4, 0, 0.2, 1);

  /* Shared with JS (gallery masonry, etc.) */
  --gallery-max-h-normal: 22rem;
  --gallery-max-h-wide: 28rem;
}
```

**Rule:** components use `bg-paper`, `text-accent` — not `#c45a2a` in Vue templates.

Copy token **values** per project; keep the **pattern** across sites.

## CSS layers

```css
@layer base {
  html { font-size: 18px; }
  body { @apply bg-paper text-text antialiased; font-family: var(--font-body); }
  h1, h2, h3 { font-family: var(--font-heading); }

  /* Accessibility: keyboard focus only */
  :focus { outline: none; }
  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
  }
}

@layer components {
  .btn-primary {
    @apply inline-flex items-center rounded-[var(--radius-ui)] bg-accent px-5 py-2.5
           text-on-accent transition-colors;
  }
  .prose-site { /* long-form CMS text */ }
}

@layer utilities {
  .sr-only { /* screen reader only */ }
  .text-balance { text-wrap: balance; }
}
```

## When to use what

| Approach | Use for |
|----------|---------|
| **Utilities in Vue** | Layout, spacing, one-off responsive tweaks (`flex`, `gap-4`, `md:px-10`) |
| **`@layer components`** | Repeated patterns (buttons, cards, modal, gallery item, nav bar) |
| **`@theme` tokens** | Colors, fonts, shadows, radii — single source of truth |
| **CSS variables in JS** | Values computed in composables (gallery row heights) |

Avoid `@apply` in dozens of tiny classes — group related styles in named component classes.

## Nested component CSS

Tailwind 4 supports nesting in `@layer components`:

```css
@layer components {
  .top-bar {
    @apply fixed top-0 z-50 w-full border-b bg-paper/95 backdrop-blur-sm;
    height: var(--height-nav);
    transition: height 0.4s var(--ease-organic);

    .site-logo {
      @apply flex items-center justify-center;
    }

    &.top-bar--compact {
      height: var(--height-nav-compact);
    }
  }
}
```

## Vue templates

```vue
<template>
  <section class="border-b border-border bg-surface/40">
    <div class="container-fluid wrap">
      <h1 class="font-heading text-3xl text-text">Title</h1>
      <button type="button" class="btn-primary">Contact</button>
    </div>
  </section>
</template>
```

Prefer semantic tokens: `border-border`, `bg-surface`, not `border-[#ddd6c7]`.

## Fonts (non-blocking)

Load Google Fonts without blocking first paint:

```ts
// plugins/fonts-async.client.ts
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = GOOGLE_FONTS_URL;
link.media = 'print';
link.onload = () => { link.media = 'all'; };
document.head.appendChild(link);
```

Fallback stack in `@theme` until fonts load. Preconnect in `nuxt.config` `app.head.link`.

## UI Kit reference page (optional)

Internal page `/uikit` (noindex) documents tokens for designers and devs:

- Color swatches with token names
- Typography scale
- Button/form variants
- Screenshot reference image in `public/design/`

```ts
routeRules: { '/uikit': { index: false } },
```

## CMS-editable content styling

Modal/page prose from YAML — style container, not inline CMS HTML:

```css
@layer components {
  .prose-site p { @apply mb-4 leading-relaxed; }
  .prose-site strong { @apply font-semibold text-text; }
}
```

Sanitize CMS HTML before `v-html` — **nuxt-cms-sanitization** skill.

## Accessibility utilities

Include in `@layer utilities`:

- `.sr-only` — visually hidden, screen reader visible (honeypot fields)
- `.skip-link` — skip to main content on focus

Pair with `:focus-visible` in `@layer base` — **nuxt-accessible-dialog** for modals.

## Pitfalls

| Symptom | Fix |
|---------|-----|
| Token utility not generated | Define in `@theme`, restart dev |
| Styles not applying | Check `@import 'tailwindcss'` order (tokens first) |
| Huge main.css | Move repeated patterns to component classes |
| Hex in Vue templates | Use semantic tokens from `@theme` |
| Motion sickness | `prefers-reduced-motion` in base + composables |
| Tailwind 3 config habits | Tailwind 4 = CSS `@theme`, not `tailwind.config.js` |

## New project checklist

```
- [ ] tailwindcss + @tailwindcss/vite installed
- [ ] vite.plugins includes tailwindcss()
- [ ] src/css/tokens.css with @theme
- [ ] src/css/main.css: tokens → tailwindcss → layers
- [ ] focus-visible in @layer base
- [ ] prefers-reduced-motion in base
- [ ] Semantic color/font names (not brand-specific in skill — per project)
- [ ] Optional /uikit page with index: false
- [ ] Fonts async plugin if using Google Fonts
```

## Related skills

- **nuxt-accessible-dialog** — focus trap, reduced motion in JS
- **nuxt-cms-sanitization** — prose content in modals
- **nuxt-portfolio-gallery** — gallery CSS vars shared with JS
- **nuxt-launch-checklist** — fonts async, visual smoke test
