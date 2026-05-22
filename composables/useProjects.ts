import type { GalleryGroup, ProjectTag, SortDirection, SortField } from '~/data/site';
import type { Project } from '~/types/project';

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
  tagLabel: (tag: ProjectTag) => string,
): number {
  let result = 0;

  switch (field) {
    case 'date':
      result = a.year - b.year;
      break;
    case 'tag': {
      const labelA = a.tags.map(tagLabel).join(', ');
      const labelB = b.tags.map(tagLabel).join(', ');
      result = labelA.localeCompare(labelB);
      break;
    }
    case 'title':
      result = a.title.localeCompare(b.title);
      break;
  }

  return direction === 'asc' ? result : -result;
}

export function useProjects() {
  const { tagLabel, tagChipsForGroup } = useGalleryI18n();
  const { t } = useI18n();
  const { projects } = useProjectCollection();

  const activeGroup = ref<GalleryGroup>('maps');
  const highlightTag = ref<ProjectTag | null>(null);
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
        tagLabel,
      ),
    );
  }

  const publishedProjects = computed(() =>
    projects.value.filter((p) => p.published),
  );

  /** Ordenação + tag ativa + destaque (highlight) no topo da secção. */
  function orderGroupProjects(
    list: Project[],
    groupId: GalleryGroup,
  ): Project[] {
    const sorted = sortList(list);
    const activeTag = highlightTag.value;

    let ordered = sorted;
    if (activeTag && groupId === activeGroup.value) {
      const active = sorted.filter((p) => p.tags.includes(activeTag));
      const rest = sorted.filter((p) => !p.tags.includes(activeTag));
      ordered = [...active, ...rest];
    }

    const pinned = ordered.filter((p) => p.highlight);
    const rest = ordered.filter((p) => !p.highlight);
    return [...pinned, ...rest];
  }

  const galleryGroups = computed((): GalleryGroupBlock[] => {
    const groupId = activeGroup.value;
    const groupProjects = orderGroupProjects(
      publishedProjects.value.filter((p) => p.category === groupId),
      groupId,
    );

    if (!groupProjects.length) return [];

    return [
      {
        id: groupId,
        label: t(`gallery.groups.${groupId}`),
        projects: groupProjects,
      },
    ];
  });

  const tagChips = computed(() =>
    tagChipsForGroup(activeGroup.value, publishedProjects.value),
  );

  function setActiveGroup(group: GalleryGroup) {
    if (activeGroup.value === group) return;
    activeGroup.value = group;
    highlightTag.value = null;
  }

  function setHighlightTag(tag: ProjectTag | null) {
    if (tag === null) {
      highlightTag.value = null;
      return;
    }
    highlightTag.value = highlightTag.value === tag ? null : tag;
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

  /** Projetos visíveis na galeria ativa, na ordem exibida (para prev/next no modal). */
  const modalProjects = computed(() =>
    galleryGroups.value.flatMap((group) => group.projects),
  );

  const selectedProjectIndex = computed(() => {
    const current = selectedProject.value;
    if (!current) return -1;
    return modalProjects.value.findIndex((p) => p.slug === current.slug);
  });

  const canNavigateProjects = computed(() => modalProjects.value.length > 1);

  function goToAdjacentProject(delta: 1 | -1) {
    const list = modalProjects.value;
    const index = selectedProjectIndex.value;
    if (index < 0 || list.length < 2) return;
    const nextIndex = (index + delta + list.length) % list.length;
    selectedProject.value = list[nextIndex] ?? null;
  }

  function goToPrevProject() {
    goToAdjacentProject(-1);
  }

  function goToNextProject() {
    goToAdjacentProject(1);
  }

  return {
    projects,
    galleryGroups,
    activeGroup,
    highlightTag,
    tagChips,
    sortField,
    sortDirection,
    selectedProject,
    setActiveGroup,
    setHighlightTag,
    setSort,
    openProject,
    closeProject,
    canNavigateProjects,
    goToPrevProject,
    goToNextProject,
  };
}
