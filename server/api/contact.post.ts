import { z } from 'zod';
import { assertContactRateLimit, getContactClientKey } from '../utils/contactRateLimit';
import { isContactEmailConfigured, sendContactEmail } from '../utils/sendContactEmail';
import { sendWhatsAppNotification } from '../utils/sendWhatsAppNotification';
import { isSafeEmailAddress, stripControlChars } from '../../utils/security';

const contactBodySchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(254),
  message: z.string().min(1).max(5000),
  website: z.string().max(0).optional().default(''),
  locale: z.enum(['en', 'pt']).optional(),
});

export default defineEventHandler(async (event) => {
  assertContactRateLimit(getContactClientKey(event));

  if (!isContactEmailConfigured()) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Contact email is not configured',
    });
  }

  const raw = await readBody(event);
  const parsed = contactBodySchema.safeParse(raw);

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid contact form data',
    });
  }

  if (parsed.data.website) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid contact form data',
    });
  }

  const name = stripControlChars(parsed.data.name);
  const email = stripControlChars(parsed.data.email);
  const message = stripControlChars(parsed.data.message);

  if (!name || !message || !isSafeEmailAddress(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid contact form data',
    });
  }

  try {
    const payload = {
      name,
      email,
      message,
      locale: parsed.data.locale,
    };

    await sendContactEmail(payload);
    await sendWhatsAppNotification(payload);
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    console.error('[contact] Failed to send email', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send contact email',
    });
  }

  return { ok: true as const };
});
