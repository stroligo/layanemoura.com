import { normalizeSafeHref } from '~/utils/security';

export const socialIconIds = [
  'behance',
  'instagram',
  'threads',
  'linkedin',
  'twitter',
  'facebook',
  'whatsapp',
  'email',
] as const;

export type SocialIcon = (typeof socialIconIds)[number];

/** Nome exibido / aria-label — derivado do ícone (rede social). */
export const socialDisplayNames: Record<SocialIcon, string> = {
  behance: 'Behance',
  instagram: 'Instagram',
  threads: 'Threads',
  linkedin: 'LinkedIn',
  twitter: 'X',
  facebook: 'Facebook',
  whatsapp: 'WhatsApp',
  email: 'Email',
};

export function socialLabelFromIcon(icon: SocialIcon): string {
  return socialDisplayNames[icon];
}

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: SocialIcon;
}

export interface SocialLinkInput {
  slug: string;
  published?: boolean;
  order?: number;
  href: string;
  icon: string;
}

export function socialSlugFromPath(path: string) {
  return path
    .replace(/^social\/+/i, '')
    .replace(/\.ya?ml$/i, '')
    .split('/')
    .filter(Boolean)
    .pop() ?? path;
}

export function normalizeSocialLink(input: SocialLinkInput): SocialLink | null {
  const icon = input.icon.trim().toLowerCase();
  if (!socialIconIds.includes(icon as SocialIcon)) return null;

  const safeHref = normalizeSafeHref(input.href);
  if (!safeHref) return null;

  const iconId = icon as SocialIcon;

  return {
    id: socialSlugFromPath(input.slug),
    label: socialLabelFromIcon(iconId),
    href: safeHref,
    icon: iconId,
  };
}

export function socialIconComponentName(icon: SocialIcon): string {
  const map: Record<SocialIcon, string> = {
    behance: 'IconsSocialBehanceIcon',
    instagram: 'SvgoInstagram',
    threads: 'IconsSocialThreadsIcon',
    linkedin: 'SvgoLinkedin',
    twitter: 'SvgoTwitter',
    facebook: 'SvgoFacebook',
    whatsapp: 'SvgoWhatsapp',
    email: 'SvgoEmail',
  };
  return map[icon];
}
