---
name: nuxt-i18n-bilingual
description: >-
  Implements bilingual Nuxt sites with @nuxtjs/i18n and CMS content. Covers
  prefix_except_default routing, UI strings in locale JSON vs editable copy in
  YAML { en, pt }, content.config.ts localeLine helpers, composable locale
  resolution, and routes excluded from prefixing. Use when adding i18n,
  bilingual content, locale routing, or translating CMS fields in Nuxt Content.
---

# Nuxt i18n — Bilingual Content

Separate **two layers**:

| Layer | Where | Who edits |
|-------|-------|-----------|
| UI chrome | `i18n/locales/{en,pt}.json` | Developers |
| Page/body copy | YAML in `content/` with `{ en, pt }` | CMS (Studio) or dev |

## Recommended routing

```ts
// nuxt.config.ts
i18n: {
  locales: [
    { code: 'en', language: 'en', file: 'en.json' },
    { code: 'pt', language: 'pt-BR', file: 'pt.json' },
  ],
  langDir: 'locales',
  defaultLocale: 'en',
  strategy: 'prefix_except_default', // EN at /, PT at /pt/...
  baseUrl: process.env.NUXT_PUBLIC_SITE_URL,
  pages: {
    _studio: false,           // admin routes — no locale prefix
    'studio-setup': false,
  },
},
```

Result:
- EN: `/`, `/about`, `/contact`
- PT: `/pt`, `/pt/about`, `/pt/contact`

## content.config.ts — bilingual fields

Reusable helpers:

```ts
import { property } from '@nuxt/content';
import { z } from 'zod';

const localizedText = (label: string, hint: string) =>
  property(z.string().default('')).editor({
    input: 'textarea',
    label,
    description: hint,
  });

const localeLine = (labelEn: string, labelPt: string) =>
  z.object({
    en: localizedText(labelEn, 'English text.'),
    pt: localizedText(labelPt, 'Portuguese text.'),
  });

// Usage in schema:
const pageSchema = z.object({
  title: localeLine('Title (EN)', 'Título (PT)'),
  description: localeLine('Description (EN)', 'Descrição (PT)'),
  cta: localeLine('Button (EN)', 'Botão (PT)'),
});
```

Studio shows separate fields per language — editors never touch JSON locale files.

### Mixed content

- **Localized:** titles, descriptions, quotes, button labels → `{ en, pt }`
- **Shared:** slugs, URLs, tags, sort order, `published`, image paths
- **UI-only labels:** navigation, filter chips, error messages → `i18n/locales/*.json`

Optional: map free-text tag slugs to display labels in locale JSON:

```json
// en.json
{ "tags": { "travel": "Travel", "editorial": "Editorial" } }
```

Fallback to raw slug if key missing.

## Composable pattern

Resolve active locale code once, pick the right string:

```ts
type LocalizedString = { en?: string; pt?: string };

function pickLocale(value: LocalizedString | undefined, locale: string): string {
  const code = locale.startsWith('pt') ? 'pt' : 'en';
  return value?.[code]?.trim() || value?.en?.trim() || '';
}

export function usePageContent() {
  const { locale } = useI18n();

  const { data } = useAsyncData('page-content', async () => {
    const row = await queryCollection('pages').first();
    const code = locale.value.startsWith('pt') ? 'pt' : 'en';
    return {
      title: pickLocale(row?.title, code),
      description: pickLocale(row?.description, code),
    };
  });

  return { data };
}
```

Normalize in `types/` so components receive plain strings, not `{ en, pt }` objects.

## UI strings

```vue
<script setup>
const { t, localePath } = useI18n();
</script>

<template>
  <NuxtLink :to="localePath('/contact')">{{ t('nav.contact') }}</NuxtLink>
</template>
```

Always use `localePath()` for internal links — never hardcode `/pt/...`.

## Locale-aware meta (SEO)

Integrate with `@nuxtjs/i18n` head helpers:

```ts
const i18nHead = useLocaleHead({ seo: true });
// merge i18nHead.link (hreflang) and i18nHead.meta into useHead
```

For full SEO setup, use the **nuxt-seo** skill.

## Browser language detection

```ts
detectBrowserLanguage: {
  useCookie: true,
  cookieKey: 'site_locale',
  redirectOn: 'root',
  cookieSecure: process.env.NODE_ENV === 'production',
},
```

Only redirect from `/` — avoid redirect loops on deep links.

## Adding a new locale later

1. Add `{ code, file }` to `nuxt.config.ts` locales
2. Create `locales/{code}.json`
3. Extend every `{ en, pt }` in schemas → `{ en, pt, es }` (or new structure)
4. Update `pickLocale` / normalize functions
5. Update sitemap hreflang entries

Plan locale codes upfront — `{ en, pt }` is the default pattern here.

## Pitfalls

| Symptom | Fix |
|---------|-----|
| `/pt/_studio` or broken admin | `i18n.pages._studio: false` |
| PT page links to EN | Use `localePath()` everywhere |
| Missing translation shows key | Add fallback: `value?.en ?? ''` |
| hreflang mismatch | `useLocaleHead({ seo: true })` + sitemap alternates |
| Studio shows wrong labels | Separate `label` per language field in schema |
| Hardcoded meta per page | Defaults in locale JSON; page overrides in composable |

## Checklist for new bilingual page

```
- [ ] Route exists for both locales (file-based or dynamic)
- [ ] UI strings in en.json + pt.json
- [ ] CMS copy in YAML with localeLine fields (if editable)
- [ ] Composable returns resolved strings for active locale
- [ ] Links use localePath()
- [ ] SEO: title/description per locale (nuxt-seo skill)
```
