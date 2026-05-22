import type { ReviewsCollectionItem } from '@nuxt/content';
import { reviewsByLocale } from '~/data/reviews';
import type { ClientReview } from '~/types/review';
import {
  normalizeReview,
  reviewSlugFromPath,
  type ReviewInput,
} from '~/types/review';

function toReviewInput(item: ReviewsCollectionItem): ReviewInput {
  const row = item as ReviewsCollectionItem & {
    quote?: { en?: string; pt?: string };
    clientRole?: { en?: string; pt?: string };
    projectType?: { en?: string; pt?: string };
    clientCompany?: string;
    order?: number;
  };

  return {
    slug: reviewSlugFromPath(item.stem ?? item.id ?? ''),
    published: item.published ?? true,
    order: row.order ?? 0,
    quote: {
      en: row.quote?.en ?? '',
      pt: row.quote?.pt ?? '',
    },
    clientName: item.clientName ?? '',
    clientRole: {
      en: row.clientRole?.en ?? '',
      pt: row.clientRole?.pt ?? '',
    },
    ...(row.clientCompany ? { clientCompany: row.clientCompany } : {}),
    ...(row.projectType
      ? {
          projectType: {
            en: row.projectType.en ?? '',
            pt: row.projectType.pt ?? '',
          },
        }
      : {}),
  };
}

function sortReviews(a: ReviewInput, b: ReviewInput) {
  return (a.order ?? 0) - (b.order ?? 0);
}

async function loadFromContent(locale: string): Promise<ClientReview[]> {
  const items = await queryCollection('reviews').all();
  if (!items.length) return [];

  return items
    .map((item) => toReviewInput(item))
    .filter((r) => r.published !== false)
    .sort(sortReviews)
    .map((input) => normalizeReview(input, locale));
}

function loadFromLegacy(locale: 'en' | 'pt'): ClientReview[] {
  return reviewsByLocale[locale];
}

export function useReviewCollection() {
  const { locale } = useI18n();

  const { data, pending, refresh, error } = useAsyncData(
    'content-reviews',
    async () => {
      const code = locale.value.startsWith('pt') ? 'pt' : 'en';
      try {
        const fromContent = await loadFromContent(code);
        if (fromContent.length) return fromContent;
      } catch (e) {
        if (import.meta.dev) {
          console.warn(
            '[reviews] Nuxt Content falhou, a usar data/reviews.ts',
            e,
          );
        }
      }
      return loadFromLegacy(code);
    },
    { default: () => [] as ClientReview[], watch: [locale] },
  );

  const reviews = computed(() => data.value ?? []);

  return {
    reviews,
    pending,
    refresh,
    error,
  };
}
