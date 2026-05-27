import { parse } from 'yaml';
import type { Project } from '~/types/project';
import { normalizeProject, projectSlugFromPath } from '~/types/project';
import type { ProjectInput } from '~/types/project';

/** Em dev: lê só `content/projects/*.yml` (o que o Studio grava), sem índice SQLite antigo. */
export function loadProjectsFromDiskYaml(): Project[] {
  const modules = import.meta.glob('../content/projects/*.{yml,yaml}', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;

  const list: Project[] = [];

  for (const [path, raw] of Object.entries(modules)) {
    const slug = projectSlugFromPath(path);
    if (!slug) continue;

    const data = parse(raw) as Omit<ProjectInput, 'slug'>;
    list.push(normalizeProject({ slug, ...data }));
  }

  return list.sort((a, b) => a.title.localeCompare(b.title));
}
