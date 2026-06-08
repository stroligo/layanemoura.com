---
name: nuxt-studio
description: >-
  Configures nuxt-studio with @nuxt/content data collections for browser-based
  CMS editing and GitHub commits. Covers conditional module loading, OAuth env
  vars, content.config.ts schemas with property().editor(), media uploads,
  dev vs production workflows, and diagnostics. Use when adding nuxt-studio,
  Studio field editors, YAML data collections, or Git-backed content editing.
---

# Nuxt Studio

Browser CMS on top of `@nuxt/content`. Editors change YAML in `content/`; Studio commits to Git.

## Architecture

```
content/**/*.yml     ← source of truth (Studio edits + Git commits)
public/              ← media paths referenced in YAML (media picker uploads here)
content.config.ts    ← Zod schema + Studio field editors
composables/         ← read collections in pages/components
```

Prefer `type: 'data'` collections (YAML), not Markdown pages, for structured CMS content.

## Setup checklist

```
- [ ] Install @nuxt/content, nuxt-studio, zod
- [ ] Conditional nuxt-studio module in nuxt.config
- [ ] Studio + runtimeConfig (OAuth, repo, public flags)
- [ ] content.config.ts with property().editor()
- [ ] Composables to query collections
- [ ] studio-setup fallback page + /api/studio-status
- [ ] Dev middleware: redirect /_studio → home (use floating button)
- [ ] .env.example documenting required vars
```

## Dependencies

```bash
npm i @nuxt/content nuxt-studio zod
```

## Conditional module (required)

Include `nuxt-studio` only when **dev** OR repo env vars exist at **build time**:

```ts
const studioRepositoryConfigured = Boolean(
  process.env.STUDIO_REPOSITORY_OWNER && process.env.STUDIO_REPOSITORY_REPO,
);
const studioModuleEnabled =
  process.env.NODE_ENV === 'development' || studioRepositoryConfigured;

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    ...(studioModuleEnabled ? ['nuxt-studio'] : []),
  ],
  ...(studioModuleEnabled
    ? {
        studio: {
          route: '/_studio',
          dev: process.env.NODE_ENV === 'development',
          git: { commit: { messagePrefix: 'content:' } },
          repository: studioRepositoryConfigured
            ? {
                provider: 'github',
                owner: process.env.STUDIO_REPOSITORY_OWNER!,
                repo: process.env.STUDIO_REPOSITORY_REPO!,
                branch: process.env.STUDIO_REPOSITORY_BRANCH || 'main',
              }
            : undefined,
        },
      }
    : {}),
  runtimeConfig: {
    studioGithubClientId: process.env.STUDIO_GITHUB_CLIENT_ID || '',
    studioGithubClientSecret: process.env.STUDIO_GITHUB_CLIENT_SECRET || '',
    public: {
      studioDev: process.env.NODE_ENV === 'development',
      studioInBuild: studioModuleEnabled && studioRepositoryConfigured,
    },
  },
});
```

Without repo env at build → module excluded → `/_studio` unavailable.

## Environment variables

Set **before** production `npm run build`:

| Variable | Role |
|----------|------|
| `STUDIO_REPOSITORY_OWNER` | GitHub user or org |
| `STUDIO_REPOSITORY_REPO` | Repository name |
| `STUDIO_REPOSITORY_BRANCH` | e.g. `main` |
| `STUDIO_GITHUB_CLIENT_ID` | OAuth App client ID |
| `STUDIO_GITHUB_CLIENT_SECRET` | Server only — never `NUXT_PUBLIC_` |

**GitHub OAuth callback (exact):** `https://your-domain.com/__nuxt_studio/auth/github`

Do not use `/_studio/auth/...`.

## content.config.ts — Studio editors

Import `property` from `@nuxt/content`. Wrap every CMS-editable field:

```ts
import { defineCollection, defineContentConfig, property } from '@nuxt/content';
import { z } from 'zod';

const itemSchema = z.object({
  published: property(z.boolean().default(true)).editor({
    label: 'Published',
    description: 'When off, hidden from the public site.',
  }),
  title: property(z.string().min(1)).editor({
    label: 'Title',
  }),
  body: property(z.string().default('')).editor({
    input: 'textarea',
    label: 'Body',
    description: 'Supports Markdown.',
  }),
  cover: property(z.string().min(1)).editor({
    input: 'media',
    label: 'Cover image',
    description: 'Uploads to public/. Reference as /images/... in YAML.',
  }),
  order: property(z.number().int().min(1)).editor({
    input: 'number',
    label: 'Sort order',
  }),
});

export default defineContentConfig({
  collections: {
    items: defineCollection({
      type: 'data',
      source: 'items/*.yml',
      schema: itemSchema,
    }),
  },
});
```

### Editor input types

| `input` | Use for |
|---------|---------|
| (default) | Short text |
| `textarea` | Long text, Markdown |
| `media` | File upload → `public/` |
| `number` | Sort order, numeric flags |

Always add `label` and `description` — they appear in the Studio UI.

### Slug = filename

`content/items/my-entry.yml` → slug `my-entry`. Derive related paths from slug (e.g. `public/images/items/my-entry/`).

### Optional: auto-create media folders (dev only)

If uploads need a folder per entry, watch `content/` in a Nitro plugin:

```ts
export default defineNitroPlugin(() => {
  if (!import.meta.dev) return; // never sync/prune in production
  // on YAML create → mkdir public/images/{collection}/{slug}/
  // on YAML delete → remove orphan folder
});
```

Production folders must come from Git, not runtime sync.

## Dev vs production

| Mode | How to edit |
|------|-------------|
| **Dev** | `npm run dev` → floating Studio button on site |
| **Production** | `https://domain.com/_studio` → GitHub login → commits |

In dev, redirect `/_studio` to home — OAuth is not configured locally:

```ts
// middleware/studio-dev-redirect.global.ts
export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/_studio')) return;
  if (useRuntimeConfig().public.studioDev) {
    return navigateTo('/', { replace: true });
  }
});
```

## Diagnostics

**`/api/studio-status`** — JSON endpoint (no secrets):

```ts
export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  return {
    studioInBuild: config.public.studioInBuild,
    githubOAuthConfigured: Boolean(
      config.studioGithubClientId && config.studioGithubClientSecret,
    ),
    oauthCallbackHint: `${config.public.siteUrl}/__nuxt_studio/auth/github`,
  };
});
```

**`pages/studio-setup.vue`** — shown when Studio is not in the build; link to status endpoint.

## Reading content in the app

```ts
const items = await queryCollection('items').all();
// or useAsyncData + watch locale/collection for SSR
```

Patterns:
- One composable per collection
- Normalize raw YAML in `types/` before UI consumption
- Filter `published !== false` in composable, not in every component

For dev cache, disk YAML reads, HMR, and stale gallery fixes → **nuxt-content-dev** skill.

## Production caching (routeRules)

CMS-edited pages must not use long SWR — users expect Studio changes after deploy:

```ts
routeRules: {
  '/': { swr: false },
  '/pt': { swr: false },
  // Static-ish pages OK with short cache:
  '/about': { swr: 600 },
},
```

Long SWR on home = content up to 1 hour old after deploy.

## i18n interaction

If the site is bilingual, exclude Studio route from locale prefix:

```ts
i18n: { pages: { _studio: false } },
```

For bilingual YAML fields (`{ en, pt }`), use the **nuxt-i18n-bilingual** skill.

## Pitfalls

| Symptom | Fix |
|---------|-----|
| `/_studio` 404 in production | Rebuild with `STUDIO_REPOSITORY_*` set |
| OAuth fails | Callback must be `/__nuxt_studio/auth/github` |
| Stale content after edit | See **nuxt-content-dev** (fingerprint, HMR, content:reset) |
| Prod home old after deploy | `routeRules` → `swr: false` on CMS pages |
| Deleted YAML still appears | Clear `.data/` Content index |
| Media sync breaks prod images | Dev-only plugins; never prune `public/` at runtime in prod |
| Secret exposed | Never prefix OAuth secret with `NUXT_PUBLIC_` |

## Extending an existing Studio site

1. Match existing `property().editor()` style in `content.config.ts`
2. Add collection → composable → types → page wiring
3. Document new fields with Studio `label` + `description`
4. Commit `content/**/*.yml` and uploaded media under `public/`

## Related skills

- **nuxt-content-dev** — dev workflow and cache troubleshooting
- **nuxt-cms-sanitization** — safe rendering of editable text and links
- **nuxt-i18n-bilingual** — bilingual YAML fields
