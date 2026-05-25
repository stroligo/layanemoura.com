import type { HomeCollectionItem } from '@nuxt/content';
import { homeFallback } from '~/data/home';
import { site } from '~/data/site';
import type { HomeInput, HomeLocales, HomePage } from '~/types/home';
import { mergeHomeLocales, normalizeHome, pickHomeLocales } from '~/types/home';

export interface HomeContentState {
  page: HomePage;
  mapsAboutPublished: boolean;
  servicesHeaderPublished: boolean;
  aboutTeaserPublished: boolean;
}

type HomeRow = HomeCollectionItem &
  HomeInput & {
    mapsAbout?: HomeInput['mapsAbout'] & {
      title?: HomeLocales;
      content?: HomeLocales;
      body?: HomeLocales;
      copy?: HomeLocales;
    };
    servicesHeader?: HomeInput['servicesHeader'] & { title?: HomeLocales };
    aboutTeaser?: HomeInput['aboutTeaser'] & {
      title?: HomeLocales;
      content?: HomeLocales;
      body?: HomeLocales;
      copy?: HomeLocales;
    };
  };

function toHomeInput(item: HomeCollectionItem): HomeInput {
  const row = item as HomeRow;
  const maps = row.mapsAbout;
  const services = row.servicesHeader;
  const about = row.aboutTeaser;

  return {
    mapsAbout: {
      published: maps?.published ?? homeFallback.mapsAbout.published,
      photo: {
        src: maps?.photo?.src ?? homeFallback.mapsAbout.photo.src,
        alt: mergeHomeLocales(maps?.photo?.alt, homeFallback.mapsAbout.photo.alt),
      },
      eyebrow: mergeHomeLocales(maps?.eyebrow, homeFallback.mapsAbout.eyebrow),
      heading: pickHomeLocales(
        { heading: maps?.heading, title: maps?.title },
        homeFallback.mapsAbout.heading,
      ),
      text: pickHomeLocales(
        {
          text: maps?.text,
          content: maps?.content,
          body: maps?.body,
          copy: maps?.copy,
        },
        homeFallback.mapsAbout.text,
      ),
      cta: mergeHomeLocales(maps?.cta, homeFallback.mapsAbout.cta),
    },
    servicesHeader: {
      published: services?.published ?? homeFallback.servicesHeader.published,
      eyebrow: mergeHomeLocales(services?.eyebrow, homeFallback.servicesHeader.eyebrow),
      heading: pickHomeLocales(
        { heading: services?.heading, title: services?.title },
        homeFallback.servicesHeader.heading,
      ),
      cta: mergeHomeLocales(services?.cta, homeFallback.servicesHeader.cta),
    },
    aboutTeaser: {
      published: about?.published ?? homeFallback.aboutTeaser.published,
      eyebrow: mergeHomeLocales(about?.eyebrow, homeFallback.aboutTeaser.eyebrow),
      heading: pickHomeLocales(
        { heading: about?.heading, title: about?.title },
        homeFallback.aboutTeaser.heading,
      ),
      text: pickHomeLocales(
        {
          text: about?.text,
          content: about?.content,
          body: about?.body,
          copy: about?.copy,
        },
        homeFallback.aboutTeaser.text,
      ),
      aboutEmail: mergeHomeLocales(about?.aboutEmail, homeFallback.aboutTeaser.aboutEmail),
      cta: mergeHomeLocales(about?.cta, homeFallback.aboutTeaser.cta),
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
