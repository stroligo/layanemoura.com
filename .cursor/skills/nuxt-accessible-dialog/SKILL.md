---
name: nuxt-accessible-dialog
description: >-
  Implements accessible modals and carousels in Nuxt/Vue: focus trap, scroll lock
  coordination, Escape to close, arrow-key carousels, prefers-reduced-motion,
  and dialog lock to prevent conflicting keyboard handlers. Use when building
  modals, overlays, lightboxes, or keyboard-navigable carousels.
---

# Nuxt Accessible Dialog

Composable primitives for modals, lightboxes, and carousels that don't fight each other.

## Components

| Composable | Role |
|------------|------|
| `useDialogLock` | Global flag — modal open blocks carousel shortcuts |
| `useFocusTrap` | Tab cycle inside modal; Escape handler |
| `useCarouselKeyboard` | ←/→ when focus inside carousel root |
| `usePrefersReducedMotion` | Disable autoplay / animations |

## Dialog lock (coordination)

```ts
const dialogOpen = ref(false);

export function useDialogLock() {
  function setDialogOpen(open: boolean) {
    dialogOpen.value = open;
  }
  return { dialogOpen: readonly(dialogOpen), setDialogOpen };
}
```

Usage in modal:

```ts
const { setDialogOpen } = useDialogLock();

watch(isOpen, (open) => {
  setDialogOpen(open);
  document.body.style.overflow = open ? 'hidden' : '';
});
```

Carousels check `dialogOpen` before handling arrow keys.

## Focus trap

```ts
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(containerRef, { active, onEscape }) {
  let previouslyFocused: HTMLElement | null = null;

  function trapKeydown(event: KeyboardEvent) {
    if (!active.value || !containerRef.value) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      onEscape?.();
      return;
    }

    if (event.key !== 'Tab') return;
    // wrap Tab from last → first and Shift+Tab from first → last
  }

  watch(active, async (isActive) => {
    if (!import.meta.client) return;
    if (isActive) {
      previouslyFocused = document.activeElement as HTMLElement;
      document.addEventListener('keydown', trapKeydown);
      await nextTick();
      focusFirstFocusable(containerRef.value);
    } else {
      document.removeEventListener('keydown', trapKeydown);
      previouslyFocused?.focus?.();
    }
  });
}
```

Wire in modal:

```ts
useFocusTrap(modalRoot, {
  active: isOpen,
  onEscape: close,
});
```

## Carousel keyboard

Only when focus is **inside** carousel and no dialog is open:

```ts
export function useCarouselKeyboard(rootRef, { onPrev, onNext }) {
  const { dialogOpen } = useDialogLock();

  function onKeydown(event: KeyboardEvent) {
    if (dialogOpen.value) return;
    if (!rootRef.value?.contains(document.activeElement)) return;

    if (event.key === 'ArrowLeft') { event.preventDefault(); onPrev(); }
    if (event.key === 'ArrowRight') { event.preventDefault(); onNext(); }
  }

  onMounted(() => document.addEventListener('keydown', onKeydown));
  onUnmounted(() => document.removeEventListener('keydown', onKeydown));
}
```

Attach to carousel root in component; call in `ProjectDetailCarousel`, `ReviewsCarousel`, etc.

## Prefers reduced motion

```ts
export function usePrefersReducedMotion() {
  const prefersReducedMotion = ref(false);

  onMounted(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.value = mq.matches;
    mq.addEventListener('change', (e) => { prefersReducedMotion.value = e.matches; });
  });

  return { prefersReducedMotion };
}
```

Use to disable carousel autoplay, scroll animations, and smooth scroll-to-feedback.

## Modal markup checklist

```html
<div
  ref="modalRoot"
  role="dialog"
  aria-modal="true"
  :aria-labelledby="titleId"
  :aria-describedby="descriptionId"
>
  <button type="button" aria-label="Close" @click="close">×</button>
  <!-- focusable content -->
</div>
```

- Backdrop click → close (optional; keep explicit close button always)
- Return focus to trigger element on close (focus trap handles via `previouslyFocused`)

## Lightbox vs modal

If lightbox is nested inside modal:
- Lightbox open → still one dialog lock (don't double-lock scroll)
- Escape: close innermost first (lightbox), then modal
- Carousel autoplay: pause while lightbox open; resume on lightbox close only

## Pitfalls

| Symptom | Fix |
|---------|-----|
| Arrow keys scroll page behind modal | `useDialogLock` + body overflow hidden |
| Tab escapes modal | Focus trap on active modal |
| Carousel fires with modal open | Check `dialogOpen.value` |
| Focus lost on close | Restore `previouslyFocused` |
| Autoplay ignores a11y | `usePrefersReducedMotion` |
| Multiple modals | Single dialog lock or ref-count |

## Integration example

```vue
<script setup>
const modalRoot = ref<HTMLElement>();
const isOpen = computed(() => !!selectedProject.value);
const { setDialogOpen } = useDialogLock();

watch(isOpen, (open) => {
  setDialogOpen(open);
  document.body.style.overflow = open ? 'hidden' : '';
});

useFocusTrap(modalRoot, {
  active: isOpen,
  onEscape: () => selectedProject.value = null,
});
</script>
```

## Checklist

```
- [ ] useDialogLock shared across modals and carousels
- [ ] useFocusTrap with Escape + Tab wrap
- [ ] role="dialog" aria-modal aria-labelledby
- [ ] Body scroll lock when open
- [ ] useCarouselKeyboard respects dialogOpen
- [ ] usePrefersReducedMotion for autoplay/animations
- [ ] Close restores focus
```

## Related skills

- **nuxt-portfolio-gallery** — modal + carousel usage
- **nuxt-i18n-bilingual** — aria-label translations
