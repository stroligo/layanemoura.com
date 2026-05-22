import type { SocialCollectionItem } from '@nuxt/content';
import { socialLinksFallback } from '~/data/social';
import type { SocialLink } from '~/types/social';
import {
  normalizeSocialLink,
  socialSlugFromPath,
  type SocialLinkInput,
} from '~/types/social';

function toSocialInput(item: SocialCollectionItem): SocialLinkInput {
  return {
    slug: socialSlugFromPath(item.stem ?? item.id ?? ''),
    published: item.published ?? true,
    order: item.order ?? 0,
    href: item.href ?? '',
    icon: item.icon ?? '',
  };
}

function sortSocial(a: SocialLinkInput, b: SocialLinkInput) {
  return (a.order ?? 0) - (b.order ?? 0);
}

async function loadFromContent(): Promise<SocialLink[]> {
  const items = await queryCollection('social').all();
  if (!items.length) return [];

  return items
    .map((item) => toSocialInput(item))
    .filter((row) => row.published !== false)
    .sort(sortSocial)
    .map((row) => normalizeSocialLink(row))
    .filter((link): link is SocialLink => link !== null);
}

export function useSocialLinks() {
  const { data, pending, refresh, error } = useAsyncData(
    'content-social',
    async () => {
      try {
        const fromContent = await loadFromContent();
        if (fromContent.length) return fromContent;
      } catch (e) {
        if (import.meta.dev) {
          console.warn(
            '[social] Nuxt Content falhou, a usar data/social.ts',
            e,
          );
        }
      }
      return socialLinksFallback;
    },
    { default: () => socialLinksFallback },
  );

  const socialLinks = computed(() => data.value ?? socialLinksFallback);

  return { socialLinks, pending, refresh, error };
}
