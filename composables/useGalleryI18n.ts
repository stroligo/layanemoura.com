import type {
  GalleryGroup,
  ProjectCategory,
  SortDirection,
  SortField,
} from '~/data/site';
import {
  categoriesByGroup,
  galleryGroupIds,
  sortFieldDefaults,
} from '~/data/site';

export function useGalleryI18n() {
  const { t } = useI18n();

  const galleryGroupFilters = computed(() =>
    galleryGroupIds.map((id) => ({
      id,
      label: t(`gallery.groups.${id}`),
    })),
  );

  const sortDirectionLabel = (field: SortField, direction: SortDirection) =>
    t(`gallery.sortDirection.${field}.${direction}`);

  const sortChoices = computed(() => {
    const directionOrder: Record<SortField, SortDirection[]> = {
      date: ['desc', 'asc'],
      tag: ['asc', 'desc'],
      views: ['desc', 'asc'],
      title: ['asc', 'desc'],
    };

    return sortFieldDefaults.flatMap(({ field }) =>
      directionOrder[field].map((direction) => ({
        id: `${field}:${direction}` as const,
        field,
        direction,
        label: t('gallery.sortOption', {
          field: t(`gallery.sort.${field}`),
          direction: sortDirectionLabel(field, direction),
        }),
      })),
    );
  });

  const categoryLabel = (category: ProjectCategory) =>
    t(`categories.${category}`);

  const categoryChipsForGroup = (group: GalleryGroup) =>
    categoriesByGroup[group].map((id) => ({
      id,
      label: categoryLabel(id),
    }));

  return {
    galleryGroupFilters,
    categoryChipsForGroup,
    sortChoices,
    categoryLabel,
    sortDirectionLabel,
  };
}
