---
name: nuxt-content-dev
description: >-
  Dev workflow for Nuxt Content + Studio: read YAML from disk in dev, YAML
  fingerprint for useAsyncData, HMR plugins, content cache layers (.data/, payload,
  SWR), content:reset and dev:clean. Use when Studio edits don't appear in the
  gallery, stale content after YAML changes, or debugging Nuxt Content cache.
---

# Nuxt Content — Dev Workflow & Cache

Studio writes YAML to disk. In dev, **multiple cache layers** can show stale data. Production uses `queryCollection` normally.

## Problem

| Symptom | User thinks | Actual cause |
|---------|-------------|--------------|
| Edited `published` in Studio, grid unchanged | Studio broken | Stale `.data/` index or `useAsyncData` payload |
| Deleted project still visible | Delete failed | Content cache or browser image cache |
| Production home old after deploy | Build failed | Long `swr` on CMS-edited routes |

## Architecture: dev vs production

| Mode | How collections load |
|------|------------------------|
| **Dev** | Read YAML directly from disk (bypass SQLite index) |
| **Production** | `queryCollection('projects').all()` via Nuxt Content |

```ts
async function loadFromContent(): Promise<Project[]> {
  if (import.meta.dev) {
    return loadFromDiskYaml(); // import.meta.glob on content/projects/*.yml
  }
  const items = await queryCollection('projects').all();
  return items.map(normalize);
}
```

## Read YAML from disk (dev)

```ts
// utils/loadFromDiskYaml.ts
import { parse } from 'yaml';

export function loadFromDiskYaml(): Project[] {
  const modules = import.meta.glob('../content/projects/*.{yml,yaml}', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;

  const list: Project[] = [];
  for (const [path, raw] of Object.entries(modules)) {
    const slug = slugFromPath(path);
    list.push(normalize({ slug, ...parse(raw) }));
  }
  return list.sort((a, b) => a.title.localeCompare(b.title));
}
```

Benefits: always matches what Studio saved; no stale SQLite in `.data/`.

## YAML fingerprint + watch

When YAML content changes, invalidate `useAsyncData`:

```ts
// utils/yamlFingerprint.ts
export function yamlFingerprint(): string {
  const modules = import.meta.glob('../content/projects/*.{yml,yaml}', {
    query: '?raw', import: 'default', eager: true,
  }) as Record<string, string>;

  return Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, raw]) => `${path}\n${raw}`)
    .join('\n---\n');
}

// composables/useProjectCollection.ts
const yamlStamp = computed(() => import.meta.dev ? yamlFingerprint() : '');

useAsyncData('content-projects', loadFn, {
  watch: import.meta.dev ? [yamlStamp] : undefined,
});
```

Any edit to any YAML file changes the fingerprint → refetch.

## HMR plugin (Studio saves)

Clear and refresh Nuxt data on Vite HMR:

```ts
// plugins/content-cache-dev.client.ts
export default defineNuxtPlugin(() => {
  if (!import.meta.dev || !import.meta.hot) return;

  import.meta.hot.on('vite:beforeUpdate', () => {
    clearNuxtData('content-projects');
  });

  import.meta.hot.on('vite:afterUpdate', () => {
    void refreshNuxtData('content-projects');
  });
});
```

Match the `useAsyncData` key (`content-projects`) to your composable.

## Cache layers reference

| Layer | Location | Symptom when stale | Fix |
|-------|----------|-------------------|-----|
| Content index | `.data/` | Deleted YAML still listed | `npm run content:reset` |
| Nuxt payload | `useAsyncData` cache | Old list after Studio save | Fingerprint watch + HMR plugin |
| Browser | Hard refresh needed | Old `published` state | Cmd+Shift+R / incognito |
| Image cache | Long `cache-control` on `/images/**` | Old thumbnails | Hard refresh; expected in prod |
| Route SWR | `routeRules` | Home outdated ~1h post-deploy | `swr: false` on CMS pages |

## npm scripts

```json
{
  "content:reset": "rm -rf .data .nuxt/cache/content && nuxt prepare",
  "dev:clean": "npm run content:reset && nuxt dev"
}
```

Use `dev:clean` when things feel "stuck" after bulk YAML changes.

## Production: disable long SWR on CMS pages

Studio-edited pages must not cache HTML for hours:

```ts
// nuxt.config.ts routeRules
routeRules: {
  '/': { swr: false },
  '/pt': { swr: false },
  // OK for mostly-static pages:
  '/about': { swr: 600 },
},
```

After deploy, home reflects new content immediately.

## Legacy fallback (migration)

During TS → YAML migration, fall back if Content empty:

```ts
try {
  const fromContent = await loadFromContent();
  if (fromContent.length) return fromContent;
} catch (e) {
  if (import.meta.dev) console.warn('[content] fallback to legacy', e);
}
return loadFromLegacy(); // data/projects.ts
```

Remove fallback once all content is in YAML.

## Troubleshooting flow

```
Studio edit not visible?
  1. Hard refresh (Cmd+Shift+R)
  2. Switch page tab and back to home
  3. npm run content:reset && npm run dev
  4. npm run dev:clean
  5. Check YAML file actually saved on disk
  6. Verify composable uses disk read in dev
```

## Pitfalls

| Symptom | Fix |
|---------|-----|
| Ghost projects | `content:reset`; confirm YAML deleted from Git |
| Studio save, no HMR | Add fingerprint watch + HMR plugin |
| Dev matches, prod doesn't | Prod uses queryCollection — rebuild after YAML commit |
| Images old, text new | Browser image cache — not a content issue |
| Prod home stale 1h | Remove `swr` from CMS-edited routes |

## Checklist

```
- [ ] loadFromDiskYaml in dev
- [ ] yamlFingerprint + watch on useAsyncData key
- [ ] HMR plugin clears/refreshes same key
- [ ] content:reset and dev:clean scripts
- [ ] swr: false on Studio-edited routes
- [ ] content/README.md documents cache layers for team
```

## Related skills

- **nuxt-studio** — CMS setup and schema
- **nuxt-portfolio-gallery** — consumes project collection
- **nuxt-launch-checklist** — verify prod after deploy
