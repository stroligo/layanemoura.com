import { reviewsByLocale, type ClientReview } from '~/data/reviews';
import { site } from '~/data/site';

export type { ClientReview };

const ABOUT_KEYS = ['p1', 'p2', 'p3', 'p4'] as const;

export function useSiteContent() {
  const { t, locale } = useI18n();

  const description = computed(() => t('site.description'));
  const photoAlt = computed(() => t('site.photoAlt', { name: site.name }));

  const about = computed(() =>
    ABOUT_KEYS.map((key) => t(`site.about.${key}`)),
  );

  const reviews = computed((): ClientReview[] => {
    const code = locale.value === 'pt' ? 'pt' : 'en';
    return reviewsByLocale[code];
  });

  return {
    description,
    about,
    photoAlt,
    reviews,
  };
}
