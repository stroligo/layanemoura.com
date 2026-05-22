import type { SocialLink } from '~/types/social';
import { socialLabelFromIcon } from '~/types/social';

/** Mock / fallback — sincronizar com `npm run content:sync-social`. */
export const socialLinksFallback: SocialLink[] = [
  {
    id: 'email',
    label: socialLabelFromIcon('email'),
    href: 'mailto:hi@layanemoura.com.br',
    icon: 'email',
  },
  {
    id: 'behance',
    label: socialLabelFromIcon('behance'),
    href: 'https://www.behance.net/layanemds',
    icon: 'behance',
  },
  {
    id: 'instagram',
    label: socialLabelFromIcon('instagram'),
    href: 'https://www.instagram.com/layanemoura.png/',
    icon: 'instagram',
  },
  {
    id: 'threads',
    label: socialLabelFromIcon('threads'),
    href: 'https://www.threads.com/@layanemoura.png',
    icon: 'threads',
  },
  {
    id: 'whatsapp',
    label: socialLabelFromIcon('whatsapp'),
    href: 'https://wa.me/5563992429380',
    icon: 'whatsapp',
  },
  {
    id: 'linkedin',
    label: socialLabelFromIcon('linkedin'),
    href: 'https://www.linkedin.com/in/layanemds/',
    icon: 'linkedin',
  },
];
