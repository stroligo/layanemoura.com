import type {
  GalleryGroup,
  ProjectTag,
  SortDirection,
  SortField,
} from '~/data/site';
import {
  galleryGroupIds,
  sortFieldDefaults,
  tagsUsedInGroup,
} from '~/data/site';
import type { Project } from '~/types/project';

export function useGalleryI18n() {
  const { t, te } = useI18n();

  const galleryGroupFilters = computed(() =>
    galleryGroupIds.map((id) => ({
      id,
      label: t(`gallery.groups.${id}`),
    })),
  );

  const groupLabel = (group: GalleryGroup) => t(`gallery.groups.${group}`);

  const sortDirectionLabel = (field: SortField, direction: SortDirection) =>
    t(`gallery.sortDirection.${field}.${direction}`);

  const sortChoices = computed(() => {
    const directionOrder: Record<SortField, SortDirection[]> = {
      tag: ['asc', 'desc'],
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

  const tagLabel = (tag: ProjectTag) => {
    const key = `tags.${tag}`;
    if (te(key)) return t(key);
    return tag
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  /** Chips só para tags que existem em pelo menos um projeto da secção. */
  const tagChipsForGroup = (group: GalleryGroup, projects: Project[]) => {
    const used = tagsUsedInGroup(projects, group);
    return used.map((id) => ({
      id,
      label: tagLabel(id),
    }));
  };

  return {
    galleryGroupFilters,
    tagChipsForGroup,
    sortChoices,
    groupLabel,
    tagLabel,
    sortDirectionLabel,
  };
}
