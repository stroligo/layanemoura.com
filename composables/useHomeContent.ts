import type { HomeCollectionItem } from '@nuxt/content';
import { homeFallback } from '~/data/home';
import { site } from '~/data/site';
import type { HomeInput, HomePage } from '~/types/home';
import { normalizeHome } from '~/types/home';

export interface HomeContentState {
  page: HomePage;
  mapsAboutPublished: boolean;
  servicesHeaderPublished: boolean;
  aboutTeaserPublished: boolean;
}

function toHomeInput(item: HomeCollectionItem): HomeInput {
  const row = item as HomeCollectionItem & HomeInput & {
    mapsAbout?: HomeInput['mapsAbout'] & {
      body?: HomeInput['mapsAbout']['content'];
      copy?: HomeInput['mapsAbout']['content'];
    };
  };
  return {
    mapsAbout: {
      published: row.mapsAbout?.published ?? homeFallback.mapsAbout.published,
      photo: {
        src: row.mapsAbout?.photo?.src ?? homeFallback.mapsAbout.photo.src,
        alt: {
          en: row.mapsAbout?.photo?.alt?.en ?? homeFallback.mapsAbout.photo.alt.en,
          pt: row.mapsAbout?.photo?.alt?.pt ?? homeFallback.mapsAbout.photo.alt.pt,
        },
      },
      eyebrow: row.mapsAbout?.eyebrow ?? homeFallback.mapsAbout.eyebrow,
      title: row.mapsAbout?.title ?? homeFallback.mapsAbout.title,
      content:
        row.mapsAbout?.content
        ?? row.mapsAbout?.copy
        ?? row.mapsAbout?.body
        ?? homeFallback.mapsAbout.content,
      cta: row.mapsAbout?.cta ?? homeFallback.mapsAbout.cta,
    },
    servicesHeader: {
      published: row.servicesHeader?.published ?? homeFallback.servicesHeader.published,
      eyebrow: row.servicesHeader?.eyebrow ?? homeFallback.servicesHeader.eyebrow,
      title: row.servicesHeader?.title ?? homeFallback.servicesHeader.title,
      cta: row.servicesHeader?.cta ?? homeFallback.servicesHeader.cta,
    },
    aboutTeaser: {
      published: row.aboutTeaser?.published ?? homeFallback.aboutTeaser.published,
      eyebrow: row.aboutTeaser?.eyebrow ?? homeFallback.aboutTeaser.eyebrow,
      title: row.aboutTeaser?.title ?? homeFallback.aboutTeaser.title,
      content: row.aboutTeaser?.content ?? homeFallback.aboutTeaser.content,
      aboutEmail: row.aboutTeaser?.aboutEmail ?? homeFallback.aboutTeaser.aboutEmail,
      cta: row.aboutTeaser?.cta ?? homeFallback.aboutTeaser.cta,
    },
  };
}

function toHomeContentState(input: HomeInput, locale: string): HomeContentState {
  return {
    page: normalizeHome(input, locale, site.name),
    mapsAboutPublished: input.mapsAbout.published !== false,
    servicesHeaderPublished: input.servicesHeader.published !== false,
    aboutTeaserPublished: input.aboutTeaser.published !== false,
  };
}

async function loadFromContent(locale: string): Promise<HomeContentState | null> {
  const item = await queryCollection('home').first();
  if (!item) return null;
  return toHomeContentState(toHomeInput(item), locale);
}

function loadFromLegacy(locale: string): HomeContentState {
  return toHomeContentState(homeFallback, locale);
}

export function useHomeContent() {
  const { locale } = useI18n();

  const { data, pending, refresh, error } = useAsyncData(
    'content-home',
    async () => {
      const code = locale.value.startsWith('pt') ? 'pt' : 'en';
      try {
        const fromContent = await loadFromContent(code);
        if (fromContent) return fromContent;
      } catch (e) {
        if (import.meta.dev) {
          console.warn('[home] Nuxt Content falhou, a usar data/home.ts', e);
        }
      }
      return loadFromLegacy(code);
    },
    {
      default: () => loadFromLegacy('en'),
      watch: [locale],
    },
  );

  const state = computed(() => data.value ?? loadFromLegacy('en'));

  return {
    content: computed(() => state.value.page),
    mapsAboutPublished: computed(() => state.value.mapsAboutPublished),
    servicesHeaderPublished: computed(() => state.value.servicesHeaderPublished),
    aboutTeaserPublished: computed(() => state.value.aboutTeaserPublished),
    pending,
    refresh,
    error,
  };
}
