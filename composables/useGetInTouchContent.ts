import type { PagesCollectionItem } from '@nuxt/content';
import { getInTouchFallback } from '~/data/getInTouch';
import { site } from '~/data/site';
import type { GetInTouchInput, GetInTouchPage } from '~/types/getInTouch';
import { normalizeGetInTouch } from '~/types/getInTouch';

const GET_IN_TOUCH_STEM = 'pages/get-in-touch';

function toGetInTouchInput(item: PagesCollectionItem): GetInTouchInput {
  const row = item as PagesCollectionItem & GetInTouchInput;
  return {
    photo: {
      src: row.photo?.src ?? getInTouchFallback.photo.src,
      alt: {
        en: row.photo?.alt?.en ?? getInTouchFallback.photo.alt.en,
        pt: row.photo?.alt?.pt ?? getInTouchFallback.photo.alt.pt,
      },
    },
    email: row.email ?? getInTouchFallback.email,
    eyebrow: row.eyebrow ?? getInTouchFallback.eyebrow,
    title: row.title ?? getInTouchFallback.title,
    about: row.about ?? getInTouchFallback.about,
    aboutEmail: row.aboutEmail ?? getInTouchFallback.aboutEmail,
    heading: row.heading ?? getInTouchFallback.heading,
    basedIn: row.basedIn ?? getInTouchFallback.basedIn,
    languages: row.languages ?? getInTouchFallback.languages,
    availability: row.availability ?? getInTouchFallback.availability,
  };
}

async function loadFromContent(locale: string): Promise<GetInTouchPage | null> {
  const item = await queryCollection('pages')
    .where('stem', '=', GET_IN_TOUCH_STEM)
    .first();
  if (!item) return null;
  return normalizeGetInTouch(toGetInTouchInput(item), locale, site.name);
}

function loadFromLegacy(locale: string): GetInTouchPage {
  return normalizeGetInTouch(getInTouchFallback, locale, site.name);
}

export function useGetInTouchContent() {
  const { locale } = useI18n();

  const { data, pending, refresh, error } = useAsyncData(
    'content-get-in-touch',
    async () => {
      const code = locale.value.startsWith('pt') ? 'pt' : 'en';
      try {
        const fromContent = await loadFromContent(code);
        if (fromContent) return fromContent;
      } catch (e) {
        if (import.meta.dev) {
          console.warn(
            '[get-in-touch] Nuxt Content falhou, a usar data/getInTouch.ts',
            e,
          );
        }
      }
      return loadFromLegacy(code);
    },
    {
      default: () => loadFromLegacy('en'),
      watch: [locale],
    },
  );

  const content = computed(() => data.value ?? loadFromLegacy('en'));

  return { content, pending, refresh, error };
}
