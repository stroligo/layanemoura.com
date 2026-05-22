/** Remove caracteres de controlo e normaliza espaços (anti header-injection / XSS em texto). */
export function stripControlChars(value: string): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, '').trim();
}

const DANGEROUS_URL_PROTOCOL =
  /^(javascript|data|vbscript|file|blob):/i;

const DANGEROUS_MARKDOWN_PATTERN =
  /<script|javascript:|data:text\/html|on\w+\s*=/i;

/** Bloqueia markdown/HTML perigoso antes de renderizar no modal. */
export function isDangerousRichText(text: string): boolean {
  return DANGEROUS_MARKDOWN_PATTERN.test(text);
}

/** Valida endereço de email simples (formulário / content). */
export function isSafeEmailAddress(email: string): boolean {
  const clean = stripControlChars(email);
  return /^[^\s<>"']+@[^\s<>"']+\.[^\s<>"']+$/.test(clean);
}

/** `mailto:user@domain` sem query maliciosa. */
export function isSafeMailtoHref(href: string): boolean {
  const trimmed = stripControlChars(href);
  if (!trimmed.toLowerCase().startsWith('mailto:')) return false;
  const address = trimmed.slice(7).split('?')[0]?.split('#')[0] ?? '';
  return isSafeEmailAddress(address);
}

/** URLs http(s) absolutas ou caminhos relativos do site. */
export function isSafeHttpUrl(url: string): boolean {
  const trimmed = stripControlChars(url);
  if (!trimmed || DANGEROUS_URL_PROTOCOL.test(trimmed)) return false;

  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return /^\/[\w\-./%]*$/.test(trimmed) || trimmed === '/';
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Hrefs permitidos em links do site (projetos, redes sociais).
 * Retorna null se inválido.
 */
export function normalizeSafeHref(href: string): string | null {
  const trimmed = stripControlChars(href);
  if (!trimmed) return null;
  if (trimmed.toLowerCase().startsWith('mailto:')) {
    return isSafeMailtoHref(trimmed) ? trimmed : null;
  }
  return isSafeHttpUrl(trimmed) ? trimmed : null;
}

/** Campos de assunto/corpo do mailto (evita quebras de linha na query). */
export function sanitizeMailtoField(value: string, maxLength = 500): string {
  return stripControlChars(value)
    .replace(/[\r\n]+/g, ' ')
    .slice(0, maxLength);
}

/** Monta URL mailto com parâmetros codificados. */
export function buildSafeMailtoUrl(
  email: string,
  params: { subject?: string; body?: string },
): string | null {
  if (!isSafeEmailAddress(email)) return null;

  const search = new URLSearchParams();
  if (params.subject) {
    search.set('subject', sanitizeMailtoField(params.subject, 200));
  }
  if (params.body) {
    search.set('body', sanitizeMailtoField(params.body, 2000));
  }

  const query = search.toString();
  return `mailto:${email}${query ? `?${query}` : ''}`;
}
