/**
 * Fallback legado (1 projeto de referência).
 * Conteúdo oficial: `content/projects/*.yml` (Nuxt Studio).
 */
import type { ProjectInput } from '~/types/project';

export type { GalleryLayout, Project, ProjectInput } from '~/types/project';

const projectImage = (slug: string) => `/images/projects/${slug}/01.jpg`;

export const projects: ProjectInput[] = [
  {
    slug: 'hollow-crown-realms',
    title: 'Hollow Crown',
    subtitle: 'Realm Map',
    category: 'maps',
    tags: ['fantasy-maps'],
    year: 2025,
    published: true,
    highlight: true,
    image: projectImage('hollow-crown-realms'),
    layout: 'wide',
    links: [
      {
        label: { en: 'View on Behance', pt: 'Ver no Behance' },
        url: 'https://www.behance.net/layanemds',
      },
    ],
    description: {
      en: 'A hand-drawn fantasy realm map for a publishing project — coastlines, kingdoms and hidden details across the full composition.',
      pt: 'Mapa de reino de fantasia desenhado à mão para um projeto editorial — costas, reinos e detalhes escondidos em toda a composição.',
    },
  },
];
