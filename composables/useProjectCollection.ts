import type { ProjectsCollectionItem } from '@nuxt/content';
import { projects as legacyProjects } from '~/data/projects';
import type { Project } from '~/types/project';
import { normalizeProject, projectSlugFromPath } from '~/types/project';
import { loadProjectsFromDiskYaml } from '~/utils/loadProjectsFromDiskYaml';
import { projectsYamlFingerprint } from '~/utils/projectsYamlFingerprint';

function slugFromItem(item: ProjectsCollectionItem): string {
  const raw = item.stem ?? item.id ?? '';
  return projectSlugFromPath(raw);
}

function toProject(item: ProjectsCollectionItem): Project {
  const slug = slugFromItem(item);
  const row = item as ProjectsCollectionItem & {
    images?: string[];
    image?: string;
    tags?: Project['tags'];
    links?: Project['links'];
    behanceUrl?: string;
  };
  return normalizeProject({
    slug,
    title: item.title,
    subtitle: item.subtitle,
    category: item.category,
    tags: row.tags,
    year: item.year,
    links: row.links,
    behanceUrl: row.behanceUrl,
    published: item.published ?? true,
    highlight: item.highlight ?? false,
    images: row.images,
    image: row.image,
    description: item.description,
    layout: item.layout ?? 'normal',
  });
}

function sortProjects(list: Project[]) {
  return [...list].sort(
    (a, b) => b.year - a.year || a.title.localeCompare(b.title),
  );
}

async function loadFromContent(): Promise<Project[]> {
  if (import.meta.dev) {
    return loadProjectsFromDiskYaml();
  }

  const items = await queryCollection('projects').all();
  if (!items.length) return [];
  return sortProjects(items.map(toProject));
}

function loadFromLegacy(): Project[] {
  return sortProjects(
    legacyProjects.map((p) => normalizeProject({ ...p, slug: p.slug })),
  );
}

export function useProjectCollection() {
  const yamlStamp = computed(() =>
    import.meta.dev ? projectsYamlFingerprint() : '',
  );

  const { data, pending, refresh, error } = useAsyncData(
    'content-projects',
    async () => {
      try {
        const fromContent = await loadFromContent();
        if (fromContent.length) return fromContent;
      } catch (e) {
        if (import.meta.dev) {
          console.warn('[gallery] Nuxt Content falhou, a usar data/projects.ts', e);
        }
      }
      return loadFromLegacy();
    },
    {
      default: () => [] as Project[],
      /** Sem payload antigo no browser (lista de projetos muda no Studio). */
      getCachedData: () => undefined,
      watch: import.meta.dev ? [yamlStamp] : undefined,
    },
  );

  const projects = computed(() => data.value ?? []);

  function getProjectBySlug(slug: string) {
    return projects.value.find((p) => p.slug === slug);
  }

  const highlightProjects = computed(() =>
    projects.value.filter((p) => p.published && p.highlight),
  );

  return {
    projects,
    highlightProjects,
    getProjectBySlug,
    pending,
    refresh,
    error,
  };
}
