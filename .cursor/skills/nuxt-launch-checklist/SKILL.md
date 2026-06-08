---
name: nuxt-launch-checklist
description: >-
  Pre- and post-deploy verification checklist for Nuxt SSR sites: env vars, favicon,
  analytics (GA4/gtag), SEO smoke tests, Studio CMS, contact form, redirects, SSL,
  cache headers, and Search Console. Use before go-live, after deploy, or when
  auditing a production site for missing launch items.
---

# Nuxt Launch Checklist

Cross-cutting verification before and after production deploy. Implementation details live in other skills — this skill is **verify, not build**.

## How to use

Copy the checklist, run each section in order. Block launch on **P0** failures.

| Priority | Meaning |
|----------|---------|
| **P0** | Must pass before go-live |
| **P1** | Fix within 48h of launch |
| **P2** | Nice to have / ongoing |

---

## 1. Build & environment (P0)

```
- [ ] NUXT_PUBLIC_SITE_URL=https://your-domain.com (no localhost, no trailing slash issues)
- [ ] Production build: npm ci && npm run build && npm run start
- [ ] Site is SSR (not static export unless intentionally chosen)
- [ ] .env secrets set on host BEFORE build (Studio repo vars if using CMS)
- [ ] .env not committed to Git
```

**Verify:**

```bash
curl -sI https://your-domain.com/ | head -5   # 200, not 502
curl -s https://your-domain.com/ | grep -i '<title>'  # title in SSR HTML
```

**Skill:** nuxt-studio (env before build)

---

## 2. Domain, SSL & redirects (P0)

```
- [ ] HTTPS works (valid certificate)
- [ ] www → apex OR apex → www (pick one, 301 the other)
- [ ] Legacy URLs return 301, not 200 with empty page
- [ ] Legacy URLs tested for ALL locales (/pt/old-path too)
- [ ] No mixed content (http assets on https page)
```

**Verify:**

```bash
curl -sI https://www.your-domain.com/ | grep -i location
curl -sI https://your-domain.com/old-path | grep -E 'HTTP|location'
```

**Skill:** nuxt-seo (legacy redirects)

---

## 3. Favicon & app icons (P0)

```
- [ ] favicon.png exists in public/
- [ ] favicon-32.png (32×32) exists
- [ ] apple-touch-icon.png (180×180) exists
- [ ] nuxt.config app.head.link includes rel="icon" entries
- [ ] Legacy paths redirect if needed (/favicon.ico → actual path)
- [ ] Tab icon visible in browser after hard refresh (Ctrl+Shift+R)
- [ ] iOS home screen icon tested (apple-touch-icon)
```

**Verify:**

```bash
curl -sI https://your-domain.com/design/favicon.png | head -3   # 200
curl -s https://your-domain.com/ | grep -E 'rel="icon"|apple-touch-icon'
```

Open site in incognito — confirm tab icon, not generic globe.

---

## 4. Analytics (P1)

```
- [ ] NUXT_PUBLIC_GTAG_ID=G-XXXXXXXX set (empty string = disabled)
- [ ] ID matches /^G-[A-Z0-9]+$/ pattern
- [ ] gtag.js loaded in production SSR HTML (view source, not only DevTools Network)
- [ ] CSP / security headers allow googletagmanager.com + google-analytics.com
- [ ] Real-time report shows visit after browsing production site
- [ ] gtag NOT firing on admin routes if undesired (/_studio)
```

**Verify:**

```bash
curl -s https://your-domain.com/ | grep -E 'googletagmanager|gtag'
```

In GA4 → Reports → Realtime → open site in another tab → active user appears.

**Pattern:** inject gtag in `nuxt.config` `app.head.script` for SSR (Google verification needs `<head>` tag, not client-only plugin).

Optional dev testing: `NUXT_PUBLIC_GTAG_DEV=true`

---

## 5. SEO (P0)

```
- [ ] /robots.txt returns 200, references sitemap URL
- [ ] /sitemap.xml returns 200, lists all public pages
- [ ] Sitemap includes hreflang alternates for each locale
- [ ] View source: <title>, meta description, og:title, og:image on home
- [ ] Canonical URL uses production domain (not localhost)
- [ ] hreflang links present for bilingual sites (/ and /pt/...)
- [ ] JSON-LD validates (Google Rich Results Test) — no invalid Review schemas
- [ ] Admin routes noindex (/_studio, /studio-setup, /uikit)
- [ ] Default OG image loads (1200×630 recommended)
```

**Verify:**

```bash
curl -s https://your-domain.com/robots.txt
curl -s https://your-domain.com/sitemap.xml | head -40
curl -s https://your-domain.com/ | grep -E 'canonical|hreflang|og:image'
```

**Skill:** nuxt-seo

---

## 6. Internationalization (P0 if bilingual)

```
- [ ] Default locale loads at /
- [ ] Secondary locale loads at /{code}/ (e.g. /pt/)
- [ ] Language switcher uses localePath() — no broken links
- [ ] Each locale has correct <html lang="...">
- [ ] Meta title/description differ per locale (not untranslated keys)
- [ ] /_studio NOT prefixed with locale (/pt/_studio must not exist)
```

**Verify:** manually browse `/` and `/pt/` (or equivalent); check `<html lang>` in view source.

**Skill:** nuxt-i18n-bilingual

---

## 7. Nuxt Studio / CMS (P0 if using Studio)

```
- [ ] STUDIO_REPOSITORY_OWNER + STUDIO_REPOSITORY_REPO set before build
- [ ] STUDIO_GITHUB_CLIENT_ID + STUDIO_GITHUB_CLIENT_SECRET on server
- [ ] GitHub OAuth callback: https://domain.com/__nuxt_studio/auth/github
- [ ] /api/studio-status → "studioInBuild": true
- [ ] /_studio opens GitHub login (not 404, not setup page)
- [ ] Test edit → commit appears in repo
- [ ] Editor GitHub account has write access to repo
```

**Verify:**

```bash
curl -s https://your-domain.com/api/studio-status | jq .
```

**Skill:** nuxt-studio

---

## 8. Contact form (P1 if present)

```
- [ ] SMTP env vars set (HOST, USER, PASS, TO, FROM)
- [ ] npm run contact:test-smtp passes on server
- [ ] Form submits → 200 → email received
- [ ] Honeypot field hidden (website)
- [ ] Rate limit returns 429 after repeated submits
- [ ] Error messages show in both locales
- [ ] 503 when SMTP not configured (not silent failure)
```

**Verify:** submit test message from production; check inbox and spam folder.

**Skill:** nuxt-contact-form

---

## 9. Images & performance (P1)

```
- [ ] Gallery/grid images load (no 500 on /images/...)
- [ ] npm run build includes images:optimize (variants committed or generated)
- [ ] routeRules cache headers on /images/**, /_nuxt/**, /fonts/**
- [ ] Home loads without console errors
- [ ] Lighthouse mobile score acceptable (performance + accessibility)
- [ ] nitro.compressPublicAssets enabled
- [ ] Google Fonts load async (non-blocking first paint) if using external fonts
- [ ] Semantic design tokens used (no raw hex in templates) — see **nuxt-tailwind-design**
```

**Verify:**

```bash
curl -sI https://your-domain.com/images/projects/some-slug/01.thumb.webp | grep -i cache-control
```

**Skill:** nuxt-image-pipeline, nuxt-portfolio-gallery

---

## 10. Security (P1)

```
- [ ] Security headers present (X-Content-Type-Options, Referrer-Policy, etc.)
- [ ] /.well-known/security.txt accessible (optional)
- [ ] /api/* not exposing secrets in responses
- [ ] /_studio has X-Robots-Tag: noindex
- [ ] CSP allows analytics domains if using strict CSP
```

**Verify:**

```bash
curl -sI https://your-domain.com/ | grep -iE 'x-content-type|referrer|x-frame'
```

**Skill:** nuxt-contact-form (security headers section)

---

## 11. Accessibility smoke test (P1)

```
- [ ] Modal opens: focus trapped, Escape closes
- [ ] Tab navigation works inside modal
- [ ] Carousel arrows work; disabled when modal open
- [ ] prefers-reduced-motion respected (no autoplay carousel)
- [ ] Form fields have labels; errors announced
```

**Skill:** nuxt-accessible-dialog

---

## 12. Post-launch — Search Console (P1, within 48h)

```
- [ ] Property added in Google Search Console (domain or URL prefix)
- [ ] Sitemap submitted: https://domain.com/sitemap.xml
- [ ] No critical coverage errors
- [ ] Fix invalid structured data if flagged
- [ ] Request indexing for home + main pages (EN + localized)
- [ ] Monitor 404 spikes after redirect migration
```

---

## 13. Post-launch — client handoff (P1)

```
- [ ] Client can log into /_studio with GitHub
- [ ] Client guide documented (what to edit, what not to touch)
- [ ] Staging/import folders explained (if bulk import used)
- [ ] Support contact for deploy issues
```

---

## Quick audit script (optional)

Run after deploy — adapt domain:

```bash
DOMAIN=https://your-domain.com

echo "=== Status ==="
curl -sI "$DOMAIN/" | head -1
curl -sI "$DOMAIN/robots.txt" | head -1
curl -sI "$DOMAIN/sitemap.xml" | head -1

echo "=== Head checks ==="
HTML=$(curl -s "$DOMAIN/")
echo "$HTML" | grep -q '<title>' && echo "✓ title" || echo "✗ title missing"
echo "$HTML" | grep -q 'rel="icon"' && echo "✓ favicon link" || echo "✗ favicon link"
echo "$HTML" | grep -q 'googletagmanager' && echo "✓ gtag" || echo "✗ gtag (or disabled)"
echo "$HTML" | grep -q 'og:image' && echo "✓ og:image" || echo "✗ og:image"

echo "=== Studio ==="
curl -s "$DOMAIN/api/studio-status" 2>/dev/null | head -c 200
echo
```

---

## Skill map

| Checklist section | Implementation skill |
|-------------------|---------------------|
| Build & env | nuxt-studio |
| Redirects, sitemap, meta | nuxt-seo |
| Locales | nuxt-i18n-bilingual |
| Studio CMS | nuxt-studio |
| Dev cache / stale content | nuxt-content-dev |
| CMS XSS / safe links | nuxt-cms-sanitization |
| Contact form | nuxt-contact-form |
| Images & gallery | nuxt-image-pipeline, nuxt-portfolio-gallery |
| Modals & a11y | nuxt-accessible-dialog |
| Bulk content | nuxt-content-bulk-import |
| Design tokens & Tailwind 4 | nuxt-tailwind-design |

---

## Common launch failures

| Symptom | Likely cause |
|---------|--------------|
| Tab shows generic icon | favicon path wrong or not in head |
| GA4 empty | gtag client-only; need SSR in nuxt.config head |
| Canonical = localhost | NUXT_PUBLIC_SITE_URL wrong at build time |
| /_studio 404 | Studio env missing before build |
| Images 500 | Variants missing; dev sync ran in prod |
| /pt/old-url indexed | Redirect map missing localized paths |
| Form 503 | SMTP env not on server |
