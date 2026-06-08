---
name: nuxt-image-pipeline
description: >-
  Implements Sharp-based image pipelines for Nuxt sites: master/thumb/display WebP
  variants, build-time optimization, imageVariants.ts URL helpers, dev-only folder
  sync, incremental rebuilds, and OG image generation. Use when adding image
  optimization, gallery variants, media upload processing, or fixing slow deploy
  builds caused by image reprocessing.
---

# Nuxt Image Pipeline

Three-tier images: YAML references the **master**; UI resolves thumb/display at runtime.

## File structure per entry

```
public/images/{collection}/{slug}/
  01.webp              ← master (lightbox / full zoom)
  01.thumb.webp        ← ~800px (grid + slider thumbs)
  01.display.webp      ← ~2000px (modal main image)
```

YAML / CMS always stores the master path:

```yaml
images:
  - src: /images/projects/my-entry/01.webp
```

## Runtime URL helpers

`utils/imageVariants.ts`:

```ts
export function imageThumbUrl(src: string): string {
  // /images/.../01.webp → /images/.../01.thumb.webp
}

export function imageDisplayUrl(src: string): string {
  // /images/.../01.webp → /images/.../01.display.webp
}

export function projectMasterSrc(src: string): string {
  return src.trim(); // lightbox only
}
```

Skip variant logic for external URLs or already-generated paths (`*.thumb.webp`).

## Build script (`scripts/optimize-images.ts`)

Wire into build:

```json
"build": "npm run images:optimize && nuxt build",
"images:optimize": "tsx scripts/optimize-images.ts",
"images:optimize:dry": "tsx scripts/optimize-images.ts --dry-run"
```

### Pipeline steps per stem (`01`, `02`, …)

1. **Convert upload** — `01.jpg|png|gif` → `01.webp` (master), delete raster original
2. **Generate variants** — `01.thumb.webp`, `01.display.webp` from master
3. **Skip unchanged** — if variants exist and master mtime ≤ variant mtime → skip
4. **Remove legacy only** — delete `*.lg.webp`, never wipe thumb/display on every run

### CLI flags

| Flag | Effect |
|------|--------|
| `--dry-run` | Log actions without writing |
| `--force` | Regenerate all variants |
| `--only=slug-a,slug-b` | Process specific folders only |

### Sharp settings (starting point)

```ts
const THUMB_MAX = 800;
const DISPLAY_MAX = 2000;
const MASTER_QUALITY = 92;
const THUMB_QUALITY = 88;
const DISPLAY_QUALITY = 90;
const MAX_SOURCE_SIDE = 6000; // downscale huge uploads before master
```

Always call `.rotate()` to respect EXIF orientation. GIF → first frame as WebP.

### needsVariants check (critical for fast deploys)

```ts
function needsVariants(master: string, dir: string, stem: string): boolean {
  const masterMtime = statSync(master).mtimeMs;
  for (const key of ['thumb', 'display'] as const) {
    const dest = join(dir, `${stem}.${key}.webp`);
    if (!existsSync(dest)) return true;
    if (statSync(dest).mtimeMs < masterMtime) return true;
  }
  return false;
}
```

**Never** delete all thumb/display before this check — causes minutes-long rebuilds.

## UI usage

| Context | Variant |
|---------|---------|
| Grid cover | `imageThumbUrl` |
| Modal slider main | `imageDisplayUrl` |
| Modal slider thumbs | `imageThumbUrl` |
| Lightbox / zoom | master via `projectMasterSrc` |

## Dev-only folder sync

When CMS uploads need a folder per slug, sync in dev only:

```ts
// server/plugins/ensure-project-image-dirs.ts
export default defineNitroPlugin(() => {
  if (!import.meta.dev) return;
  // watch content/{collection}/*.yml
  // create → mkdir public/images/{collection}/{slug}/
  // delete YAML → remove orphan folder
});
```

Production folders come from Git + build script — **never** prune `public/` at runtime in prod (`.output/public` would lose images → 500 errors).

## Studio / CMS uploads

Editors can upload `01.jpg`, `01.png`, `01.gif`, or `01.webp`. Next build converts and generates variants.

In dev after upload: `npm run images:optimize`

Commit masters **and** variants to Git for fast deploys.

## OG share image

Generate a static OG fallback during optimize (e.g. `public/images/og-share.jpg`) — used when pages don't set a custom image.

## Performance

```ts
// data/performance.ts
export const GALLERY_HEAD_PRELOAD_COUNT = 6;   // <link rel="preload"> on home
export const GALLERY_PRIORITY_COVER_COUNT = 8; // eager vs lazy in grid
export const STATIC_CACHE_MAX_AGE = 60 * 60 * 24 * 365; // routeRules for /images/**
```

Preload thumb URLs, not masters. Lazy-load covers beyond priority count.

## Pitfalls

| Symptom | Fix |
|---------|-----|
| Deploy build takes minutes | Stop deleting variants each run; use `needsVariants` |
| Images 500 in production | Dev-only sync plugin; images must be in Git |
| Broken grid after filter reorder | Don't reset image visibility on priority change — only on URL change |
| YAML points to `.jpg` after build | YAML should reference `.webp` master path |
| Huge repo size | Commit WebP variants (smaller than JPG); skip raw uploads after convert |

## Checklist

```
- [ ] utils/imageVariants.ts with thumb/display/master helpers
- [ ] scripts/optimize-images.ts with incremental skip
- [ ] build runs images:optimize before nuxt build
- [ ] Dev plugin for folder sync (import.meta.dev guard)
- [ ] CMS schema references master path in media picker description
- [ ] Commit .webp masters + variants
```

## Related skills

- **nuxt-studio** — media picker uploads
- **nuxt-content-bulk-import** — mass import before optimize
- **nuxt-portfolio-gallery** — where variants are consumed
