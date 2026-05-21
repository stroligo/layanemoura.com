import type { Project } from '~/data/projects';
import { projects } from '~/data/projects';
import {
  categoriesByGroup,
  type GalleryGroup,
  type ProjectCategory,
  type SortDirection,
  type SortField,
} from '~/data/site';

export interface GalleryGroupBlock {
  id: GalleryGroup;
  label: string;
  projects: Project[];
}

function compareProjects(
  a: Project,
  b: Project,
  field: SortField,
  direction: SortDirection,
  tagLabel: (category: ProjectCategory) => string,
): number {
  let result = 0;

  switch (field) {
    case 'date':
      result = a.year - b.year;
      break;
    case 'views':
      result = a.views - b.views;
      break;
    case 'tag': {
      const tagCmp = tagLabel(a.category).localeCompare(
        tagLabel(b.category),
      );
      result = tagCmp !== 0 ? tagCmp : a.title.localeCompare(b.title);
      break;
    }
    case 'title':
      result = a.title.localeCompare(b.title);
      break;
  }

  return direction === 'asc' ? result : -result;
}

export function useProjects() {
  const { categoryLabel } = useGalleryI18n();
  const { t } = useI18n();

  const activeGroup = ref<GalleryGroup>('maps');
  const highlightCategory = ref<ProjectCategory | null>(null);
  const sortField = ref<SortField>('date');
  const sortDirection = ref<SortDirection>('desc');
  const selectedProject = ref<Project | null>(null);

  function sortList(list: Project[]): Project[] {
    return [...list].sort((a, b) =>
      compareProjects(
        a,
        b,
        sortField.value,
        sortDirection.value,
        categoryLabel,
      ),
    );
  }

  /** Destaque: categoria ativa primeiro no bloco selecionado (Maps/More). */
  function orderGroupProjects(
    list: Project[],
    groupId: GalleryGroup,
  ): Project[] {
    const sorted = sortList(list);
    const highlight = highlightCategory.value;

    if (!highlight || groupId !== activeGroup.value) {
      return sorted;
    }

    const active = sorted.filter((p) => p.category === highlight);
    const rest = sorted.filter((p) => p.category !== highlight);
    return [...active, ...rest];
  }

  const galleryGroups = computed((): GalleryGroupBlock[] => {
    const order: GalleryGroup[] =
      activeGroup.value === 'maps' ? ['maps', 'more'] : ['more', 'maps'];

    return order
      .map((groupId) => {
        const groupCategories = categoriesByGroup[groupId];
        const groupProjects = orderGroupProjects(
          projects.filter((p) => groupCategories.includes(p.category)),
          groupId,
        );

        if (!groupProjects.length) return null;

        return {
          id: groupId,
          label: t(`gallery.groups.${groupId}`),
          projects: groupProjects,
        };
      })
      .filter((block): block is GalleryGroupBlock => !!block);
  });

  function setActiveGroup(group: GalleryGroup) {
    if (activeGroup.value === group) return;
    activeGroup.value = group;
    highlightCategory.value = null;
  }

  function setHighlightCategory(category: ProjectCategory | null) {
    if (category === null) {
      highlightCategory.value = null;
      return;
    }
    highlightCategory.value =
      highlightCategory.value === category ? null : category;
  }

  function setSort(field: SortField, direction: SortDirection) {
    if (sortField.value === field && sortDirection.value === direction) return;
    sortField.value = field;
    sortDirection.value = direction;
  }

  function openProject(project: Project) {
    selectedProject.value = project;
    if (import.meta.client) {
      document.body.style.overflow = 'hidden';
    }
  }

  function closeProject() {
    selectedProject.value = null;
    if (import.meta.client) {
      document.body.style.overflow = '';
    }
  }

  return {
    projects,
    galleryGroups,
    activeGroup,
    highlightCategory,
    sortField,
    sortDirection,
    selectedProject,
    setActiveGroup,
    setHighlightCategory,
    setSort,
    openProject,
    closeProject,
  };
}
