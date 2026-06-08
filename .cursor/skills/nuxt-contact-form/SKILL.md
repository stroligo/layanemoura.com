---
name: nuxt-contact-form
description: >-
  Implements secure SSR contact forms in Nuxt: Nitro API route with Zod validation,
  honeypot anti-spam, rate limiting, SMTP via nodemailer, optional webhook
  notifications, useContactForm composable, and security headers. Use when adding
  contact pages, form submission APIs, email delivery, or hardening public POST
  endpoints.
---

# Nuxt Contact Form

Server-side email with client composable. Secrets stay in `runtimeConfig` (never `NUXT_PUBLIC_`).

## Architecture

```
pages/contact.vue       ← form UI + useContactForm()
composables/useContactForm.ts
server/api/contact.post.ts
server/utils/sendContactEmail.ts
server/utils/contactRateLimit.ts
utils/security.ts       ← stripControlChars, isSafeEmailAddress
```

## Environment variables

```env
CONTACT_TO_EMAIL=hello@example.com
CONTACT_FROM_EMAIL=noreply@example.com
CONTACT_FROM_NAME=Website Contact
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=...
SMTP_PASS=...

# Optional notification
WHATSAPP_NOTIFY_ENABLED=false
WHATSAPP_NOTIFY_WEBHOOK=https://...
```

Map in `nuxt.config.ts` → `runtimeConfig` (server-only keys).

## API route

`server/api/contact.post.ts`:

```ts
import { z } from 'zod';

const contactBodySchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(254),
  message: z.string().min(1).max(5000),
  website: z.string().max(0).optional().default(''), // honeypot
  locale: z.enum(['en', 'pt']).optional(),
});

export default defineEventHandler(async (event) => {
  assertContactRateLimit(getContactClientKey(event));

  if (!isContactEmailConfigured()) {
    throw createError({ statusCode: 503, statusMessage: 'Contact email is not configured' });
  }

  const parsed = contactBodySchema.safeParse(await readBody(event));
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid contact form data' });
  }

  // Honeypot — bots fill hidden field
  if (parsed.data.website) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid contact form data' });
  }

  const name = stripControlChars(parsed.data.name);
  const email = stripControlChars(parsed.data.email);
  const message = stripControlChars(parsed.data.message);

  if (!name || !message || !isSafeEmailAddress(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid contact form data' });
  }

  await sendContactEmail({ name, email, message, locale: parsed.data.locale });
  return { ok: true as const };
});
```

## Rate limiting

In-memory bucket per IP (upgrade to Redis for multi-instance):

```ts
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

export function assertContactRateLimit(clientKey: string) {
  // increment bucket; throw 429 if over MAX_REQUESTS
}

export function getContactClientKey(event: H3Event) {
  const forwarded = getRequestHeader(event, 'x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || event.node?.req?.socket?.remoteAddress || 'unknown';
}
```

Map HTTP status in composable: `429` → rate limit message, `503` → not configured.

## Client composable

```ts
export function useContactForm(options: { contactEmail: MaybeRefOrGetter<string> }) {
  const form = reactive({ name: '', email: '', message: '', website: '' });
  // website = honeypot — hidden with CSS, not autocomplete

  async function onSubmit() {
    await $fetch('/api/contact', {
      method: 'POST',
      body: { ...form, locale: localeCode, website: form.website },
    });
  }
}
```

Honeypot field in template:

```html
<input
  v-model="form.website"
  type="text"
  name="website"
  tabindex="-1"
  autocomplete="off"
  aria-hidden="true"
  class="sr-only"
/>
```

## Security utilities

```ts
export function stripControlChars(value: string): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, '').trim();
}

export function isSafeEmailAddress(email: string): boolean {
  // strict pattern; reject newlines, encoded tricks
}
```

Validate URLs in CMS schema too (`safeHrefSchema` in `content.config.ts`).

## Security headers

`server/middleware/security-headers.ts` on all responses:

```ts
export default defineEventHandler((event) => {
  setHeader(event, 'X-Content-Type-Options', 'nosniff');
  setHeader(event, 'X-Frame-Options', 'SAMEORIGIN');
  setHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin');
  // relax CSP for /_studio in dev if needed
});
```

Optional: `server/routes/.well-known/security.txt.ts`

## i18n

Form labels/errors in `i18n/locales/*.json`. Pass active locale to API for email template language.

Editable contact page copy in YAML — use **nuxt-i18n-bilingual** skill.

## Optional: WhatsApp notification

Fire-and-forget alert after email succeeds. Failures are logged only — email is the primary channel.

```env
WHATSAPP_NOTIFY_ENABLED=true
WHATSAPP_NOTIFY_PHONE=5511999999999
CALLMEBOT_API_KEY=...              # CallMeBot free API
# OR
WHATSAPP_NOTIFY_WEBHOOK=https://...  # Make, n8n, Zapier
```

```ts
// server/utils/sendWhatsAppNotification.ts
export async function sendWhatsAppNotification(payload: ContactEmailPayload) {
  if (!isWhatsAppNotifyConfigured()) return;

  const text = buildContactWhatsAppText(payload); // plain text, locale-aware

  try {
    if (config.callmebotApiKey) {
      await $fetch('https://api.callmebot.com/whatsapp.php', {
        params: { phone: `+${phone}`, text, apikey: config.callmebotApiKey },
      });
    } else if (config.whatsappNotifyWebhook) {
      await $fetch(webhook, { method: 'POST', body: { text, ...payload } });
    }
  } catch (error) {
    console.error('[contact] WhatsApp notification failed', error);
  }
}
```

Call **after** `sendContactEmail` in the API handler. Never expose API keys to client.

## Test script

```bash
npm run contact:test-smtp   # tsx scripts/test-contact-smtp.ts
```

Verifies SMTP config without hitting the public form.

## Pitfalls

| Symptom | Fix |
|---------|-----|
| 503 on submit | SMTP env vars missing on server |
| Spam flood | Honeypot + rate limit; consider Turnstile later |
| Email in spam | Set SPF/DKIM on domain; use valid From address |
| Secret in client bundle | Never `NUXT_PUBLIC_` for SMTP_PASS |
| XSS in email body | stripControlChars; plain text email only |

## Checklist

```
- [ ] runtimeConfig for SMTP (server-only)
- [ ] contact.post.ts with Zod + honeypot + rate limit
- [ ] useContactForm composable with error mapping
- [ ] i18n strings for labels and feedback
- [ ] contact:test-smtp script
- [ ] security headers middleware
- [ ] .env.example documented
```

## Related skills

- **nuxt-i18n-bilingual** — form copy and error messages
- **nuxt-seo** — ContactPage JSON-LD on contact route
- **nuxt-cms-sanitization** — shared stripControlChars and URL validation utils
