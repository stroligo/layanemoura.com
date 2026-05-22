export type { ClientReview } from '~/types/review';

export function useSiteContent() {
  const { t } = useI18n();

  const description = computed(() => t('site.description'));

  const { reviews } = useReviewCollection();

  return {
    description,
    reviews,
  };
}
