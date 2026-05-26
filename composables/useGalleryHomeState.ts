import type { GalleryGroup, ProjectTag } from '~/data/site';
import type { Project } from '~/types/project';

/** Estado da grelha na home (partilhado: toolbar, modal, logo). */
export function useGalleryHomeState() {
  const activeGroup = useState<GalleryGroup>('gallery-active-group', () => 'maps');
  const highlightTag = useState<ProjectTag | null>(
    'gallery-highlight-tag',
    () => null,
  );
  const selectedProject = useState<Project | null>(
    'gallery-selected-project',
    () => null,
  );

  function resetGalleryHome() {
    activeGroup.value = 'maps';
    highlightTag.value = null;
    selectedProject.value = null;
    if (import.meta.client) {
      document.body.style.overflow = '';
    }
  }

  return {
    activeGroup,
    highlightTag,
    selectedProject,
    resetGalleryHome,
  };
}
