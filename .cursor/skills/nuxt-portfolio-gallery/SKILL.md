---
name: nuxt-portfolio-gallery
description: >-
  Builds portfolio gallery UIs in Nuxt: home grid with sections and tag filters,
  numeric highlight pinning, modal detail view with carousel and lightbox, no
  per-item routes, composable state, image preload strategy, and filter reorder
  fixes. Use when implementing portfolio grids, project modals, gallery filters,
  or highlight/featured ordering.
---

# Nuxt Portfolio Gallery

Single-page gallery: **no route per project**. Modal reads YAML by slug.

## Architecture

```
pages/index.vue
components/Gallery*.vue, ProjectModal.vue, ProjectDetailCarousel.vue
composables/useProjectCollection.ts   ← load + normalize
composables/useProjects.ts            ← filter, sort, highlight
composables/useGalleryHomeState.ts    ← shared UI state
types/project.ts                      ← normalizeProject()
```

Content from `content/projects/{slug}.yml` via **nuxt-studio** skill.

## Data model (normalized)

```ts
interface Project {
  slug: string;
  title: string;
  subtitle: string;
  category: string;           // section: maps | more | ...
  tags: string[];
  published: boolean;
  highlight: number | null;   // 1, 2, 3… = pinned order; null = alphabetical
  images: string[];           // [0] = grid cover; master paths
  description: { en: string; pt: string };
  layout: 'tall' | 'wide' | 'normal';
  links: { label: { en; pt }; url: string }[];
}
```

Resolve description per locale in `types/project.ts` — components get plain strings.

## Shared gallery state

```ts
export function useGalleryHomeState() {
  const activeGroup = useState<string>('gallery-active-group', () => 'maps');
  const highlightTag = useState<string | null>('gallery-highlight-tag', () => null);
  const selectedProject = useState<Project | null>('gallery-selected-project', () => null);

  function resetGalleryHome() {
    activeGroup.value = 'maps';
    highlightTag.value = null;
    selectedProject.value = null;
    if (import.meta.client) document.body.style.overflow = '';
  }

  return { activeGroup, highlightTag, selectedProject, resetGalleryHome };
}
```

Share between toolbar, grid, modal, and logo/home link.

## Ordering logic

```ts
function orderGroupProjects(list: Project[], groupId: string): Project[] {
  let ordered = sortByTitle(list);

  // Tag filter: matching tags first (within section)
  if (highlightTag.value && groupId === activeGroup.value) {
    const active = ordered.filter(p => p.tags.includes(highlightTag.value!));
    const rest = ordered.filter(p => !p.tags.includes(highlightTag.value!));
    ordered = [...active, ...rest];
  }

  // Pin highlight: 1, 2, 3… at top
  const pinned = ordered.filter(p => p.highlight != null)
    .sort((a, b) => a.highlight! - b.highlight!);
  const unpinned = ordered.filter(p => p.highlight == null);
  return [...pinned, ...unpinned];
}
```

Schema: numeric `highlight` in YAML (not boolean) for explicit order.

## Grid layout

CSS grid with span classes from `layout`:

| layout | Grid behavior |
|--------|---------------|
| `tall` | More vertical span |
| `wide` | More horizontal span |
| `normal` | Default cell |

Dim non-matching items on tag filter (contrast/brightness, not opacity+blur — keeps layout stable).

## Image variants in UI

Use **nuxt-image-pipeline** helpers:

- Grid cover → `imageThumbUrl(images[0])`
- Modal slider → `imageDisplayUrl`
- Slider thumbs → `imageThumbUrl`
- Lightbox zoom → master `images[n]`

## Cover fade-in (filter reorder fix)

```ts
export function useGalleryCoverImage(src, options?: { eager?: boolean }) {
  const isVisible = ref(false);

  watch(() => toValue(src), (url) => {
    if (!url) { isVisible.value = false; return; }
    // Only hide on URL change — NOT on priority/eager reorder
    if (import.meta.server || toValue(options?.eager)) {
      isVisible.value = true;
      return;
    }
    isVisible.value = false;
  }, { immediate: true });

  watch(() => Boolean(toValue(options?.eager)), (eager) => {
    if (eager) isVisible.value = true;
  });

  function reveal() { isVisible.value = true; }

  return { isVisible, reveal }; // @load on <img> calls reveal()
}
```

When filter reorders DOM, `priority` changes but URL doesn't — image must stay visible if already loaded (`img.complete`).

## Modal structure

```
ProjectModal
├── header (title, subtitle, close)
├── ProjectDetailCarousel (display variant + thumbs)
├── description (Markdown rendered)
└── action links (locale-aware labels)
```

Open modal → `setDialogOpen(true)` + body scroll lock. See **nuxt-accessible-dialog**.

Carousel: keyboard ←/→, respects `prefers-reduced-motion` for autoplay.

## Lightbox zoom & pan

Full-resolution **master** image with pinch/wheel zoom and drag when zoomed:

```ts
// composables/useImageZoomPan.ts
export function useImageZoomPan() {
  const scale = ref(1);           // 1–5
  const translateX = ref(0);
  const translateY = ref(0);
  const canPan = computed(() => scale.value > 1);

  function resetView() { scale.value = 1; translateX.value = 0; translateY.value = 0; }
  function zoomIn()  { scale.value = Math.min(5, scale.value + 0.4); }
  function zoomOut() { /* clamp to 1, reset pan at 1 */ }
  function applyWheelZoom(deltaY: number) { /* wheel on lightbox */ }

  // Pointer events for drag-pan when canPan
  return { transformStyle, resetView, zoomIn, zoomOut, applyWheelZoom, onPointerDown, ... };
}
```

```vue
<img
  :src="projectMasterSrc(activeImage)"
  :style="transformStyle"
  @wheel.prevent="applyWheelZoom($event.deltaY)"
  @pointerdown="onPointerDown"
  @pointermove="onPointerMove"
  @pointerup="onPointerUp"
/>
```

Rules:
- Open lightbox → `resetView()` (fixed image, no drift from previous project)
- Pause carousel autoplay while lightbox open; resume only on close
- Do **not** watch carousel `activeIndex` to auto-close lightbox
- Reset zoom when switching images or closing

Render modal description with **nuxt-cms-sanitization** (`cmsMarkdownToHtml`), not raw YAML.

## Preload strategy

```ts
// First N covers: eager + <link rel="preload"> in head
export const GALLERY_HEAD_PRELOAD_COUNT = 6;
export const GALLERY_PRIORITY_COVER_COUNT = 8;

// usePreloadProjectImages — client-side Image() queue with concurrency limit
```

Preload **thumb** URLs only. Lazy-load rest.

## No per-project pages

All detail in modal. Benefits:
- Simpler routing and sitemap
- Faster navigation
- Single content source

Deep links optional: `?project=slug` query param to open modal on load.

## Pitfalls

| Symptom | Fix |
|---------|-----|
| Covers vanish on tag filter | useGalleryCoverImage: don't reset on priority change |
| Lightbox closes on autoplay | Don't watch carousel index to close lightbox |
| Slow home load | Preload thumbs only; lazy grid below fold |
| Wrong section | Filter `published` + `category` in composable |
| Modal height jumps | Content-based height; max image ~68dvh |

## Checklist

```
- [ ] useProjectCollection + normalizeProject
- [ ] useProjects with group/tag/highlight ordering
- [ ] useGalleryHomeState shared state
- [ ] Grid with layout spans + dimmed filter state
- [ ] Modal + carousel + lightbox
- [ ] imageThumbUrl / imageDisplayUrl in components
- [ ] useGalleryCoverImage with reorder-safe visibility
- [ ] Preload first N thumb covers
```

## Related skills

- **nuxt-studio** — project YAML schema
- **nuxt-image-pipeline** — variants
- **nuxt-i18n-bilingual** — descriptions and link labels
- **nuxt-accessible-dialog** — focus trap, scroll lock, keyboard
- **nuxt-cms-sanitization** — safe Markdown in modal
- **nuxt-content-dev** — stale gallery after Studio edits
