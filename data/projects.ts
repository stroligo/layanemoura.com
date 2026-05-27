/**
 * Fallback legado quando não há YAML em content/projects/.
 * Conteúdo oficial: `content/projects/*.yml` (Nuxt Studio).
 */
import type { ProjectInput } from '~/types/project';

export type { GalleryLayout, Project, ProjectInput } from '~/types/project';

export const projects: ProjectInput[] = [];
