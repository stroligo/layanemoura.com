import type { H3Event } from 'h3';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

const buckets = new Map<string, { count: number; windowStart: number }>();

export function assertContactRateLimit(clientKey: string) {
  const now = Date.now();
  const bucket = buckets.get(clientKey) ?? { count: 0, windowStart: now };

  if (now - bucket.windowStart > WINDOW_MS) {
    bucket.count = 0;
    bucket.windowStart = now;
  }

  bucket.count += 1;
  buckets.set(clientKey, bucket);

  if (bucket.count > MAX_REQUESTS) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many contact requests',
    });
  }
}

export function getContactClientKey(event: H3Event) {
  const forwarded = getRequestHeader(event, 'x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  return (
    event.node?.req?.socket?.remoteAddress?.replace(/^::ffff:/, '') || 'unknown'
  );
}
