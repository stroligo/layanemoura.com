---
name: nuxt-cms-sanitization
description: >-
  Sanitizes user-editable CMS content in Nuxt: safe Markdown to HTML, v-html
  guards, URL validation in content.config.ts Zod schemas, stripControlChars,
  and mailto/http href normalization. Use when rendering Studio YAML in the UI,
  adding rich text fields, project links, or preventing XSS from CMS content.
---

# Nuxt CMS Sanitization

Editors can put anything in YAML. **Never** render CMS strings raw. Sanitize at render time and validate at schema time.

## Two layers

| Layer | Where | Blocks |
|-------|-------|--------|
| **Schema** | `content.config.ts` Zod | Invalid URLs in YAML at parse time |
| **Render** | Utils before `v-html` | XSS in descriptions, injected scripts |

Form fields use the same utils — see **nuxt-contact-form**.

## stripControlChars (base)

```ts
export function stripControlChars(value: string): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, '').trim();
}
```

Use on every user string before display, email, or storage.

## URL validation in schema

```ts
import { z } from 'zod';

const DANGEROUS_PROTOCOL = /^(javascript|data|vbscript|file|blob):/i;

export function isSafeHttpUrl(url: string): boolean {
  const trimmed = stripControlChars(url);
  if (!trimmed || DANGEROUS_PROTOCOL.test(trimmed)) return false;

  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return /^\/[\w\-./%]*$/.test(trimmed) || trimmed === '/';
  }

  try {
    return new URL(trimmed).protocol === 'http:' || new URL(trimmed).protocol === 'https:';
  } catch { return false; }
}

export function isSafeMailtoHref(href: string): boolean {
  const trimmed = stripControlChars(href);
  if (!trimmed.toLowerCase().startsWith('mailto:')) return false;
  const address = trimmed.slice(7).split('?')[0]?.split('#')[0] ?? '';
  return isSafeEmailAddress(address);
}

const safeHrefSchema = z.string().min(1).refine(
  (v) => (v.startsWith('mailto:') && isSafeMailtoHref(v)) || isSafeHttpUrl(v),
  'Use https://…, a site path (/images/…), or mailto:user@domain',
);

// In project schema:
links: z.array(z.object({
  label: localeLine('Label (EN)', 'Label (PT)'),
  url: safeHrefSchema,
})).optional(),
```

At render time, normalize again:

```ts
export function normalizeSafeHref(href: string): string | null {
  const trimmed = stripControlChars(href);
  if (!trimmed) return null;
  if (trimmed.toLowerCase().startsWith('mailto:')) {
    return isSafeMailtoHref(trimmed) ? trimmed : null;
  }
  return isSafeHttpUrl(trimmed) ? trimmed : null;
}
```

Only render links where `normalizeSafeHref` returns non-null.

## Safe Markdown → HTML

CMS fields allow limited Markdown (`**bold**`, `*italic*`, paragraphs). Do **not** use a full Markdown parser that allows HTML passthrough.

```ts
const DANGEROUS_PATTERN = /<script|javascript:|data:text\/html|on\w+\s*=/i;

export function isDangerousRichText(text: string): boolean {
  return DANGEROUS_PATTERN.test(text);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineMarkdown(text: string): string {
  let html = escapeHtml(text);
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em>$1</em>');
  return html;
}

export function cmsMarkdownToHtml(markdown: string): string {
  const trimmed = stripControlChars(markdown);
  if (!trimmed) return '';

  // Fail safe: escape entirely if suspicious
  if (isDangerousRichText(trimmed)) {
    return `<p>${escapeHtml(trimmed)}</p>`;
  }

  return trimmed
    .split(/\n\s*\n/)
    .map((block) => `<p>${inlineMarkdown(block.trim())}</p>`)
    .join('');
}
```

## Usage in components

```vue
<script setup>
const html = computed(() => cmsMarkdownToHtml(project.description));
</script>

<template>
  <!-- Only v-html sanitized output — never raw CMS string -->
  <div class="prose" v-html="html" />
</template>
```

Studio schema hint for editors:

```ts
const markdownHint = 'Markdown: **bold**, *italic*. New paragraph = blank line.';
```

## What NOT to allow

| Input | Risk | Policy |
|-------|------|--------|
| Raw HTML in CMS | XSS | Escape always; limited Markdown only |
| `javascript:` URLs | XSS | Block in schema + normalizeSafeHref |
| `data:` URLs | XSS | Block |
| Event handlers `onclick=` | XSS | isDangerousRichText catches |
| Full Markdown spec | HTML injection | Subset only: bold, italic, paragraphs |

## Email safety

Contact form emails: plain text only, `stripControlChars` on all fields. Never interpolate raw CMS HTML into email templates.

## mailto: builder

```ts
export function buildSafeMailtoUrl(
  email: string,
  params: { subject?: string; body?: string },
): string | null {
  if (!isSafeEmailAddress(email)) return null;
  const search = new URLSearchParams();
  if (params.subject) search.set('subject', sanitizeMailtoField(params.subject, 200));
  if (params.body) search.set('body', sanitizeMailtoField(params.body, 2000));
  const q = search.toString();
  return q ? `mailto:${email}?${q}` : `mailto:${email}`;
}
```

## Pitfalls

| Symptom | Fix |
|---------|-----|
| XSS in modal description | Use cmsMarkdownToHtml, not raw v-html |
| Link opens javascript: | safeHrefSchema + normalizeSafeHref |
| Markdown shows literal HTML | escapeHtml before inline transforms |
| Studio allows any URL | Add Zod refine on url fields |
| Bold not working | Check regex order (escape first, then ** ) |

## Checklist

```
- [ ] stripControlChars on all CMS text paths
- [ ] safeHrefSchema in content.config.ts for link fields
- [ ] normalizeSafeHref before rendering <a href>
- [ ] cmsMarkdownToHtml before v-html
- [ ] isDangerousRichText fail-safe (escape all)
- [ ] Studio field descriptions explain allowed Markdown
- [ ] No full HTML/Markdown parser with raw HTML passthrough
```

## Related skills

- **nuxt-studio** — schema and property().editor()
- **nuxt-contact-form** — form field sanitization
- **nuxt-portfolio-gallery** — modal description rendering
