export type ErrorPageKey = 'notFound' | 'server' | 'generic';

export function errorPageKey(statusCode?: number): ErrorPageKey {
  if (statusCode === 404) return 'notFound';
  if (statusCode && statusCode >= 500) return 'server';
  return 'generic';
}
