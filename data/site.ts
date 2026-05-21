export const site = {
  name: 'Layane Moura',
  email: 'hi@layanemoura.com.br',
  photo: '/images/about.JPG',
  social: [
    {
      label: 'Behance',
      href: 'https://www.behance.net/layanemds',
      icon: 'behance',
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/layanemoura.png/',
      icon: 'instagram',
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/layanemds/',
      icon: 'linkedin',
    },
  ],
} as const;

export type ProjectCategory =
  | 'fantasy-maps'
  | 'travel'
  | 'book-covers'
  | 'editorial'
  | 'patterns'
  | 'commercial';

/** Grupos da galeria (toolbar): Maps vs More */
export type GalleryGroup = 'maps' | 'more';

export const galleryGroupIds: GalleryGroup[] = ['maps', 'more'];

export const categoriesByGroup: Record<GalleryGroup, ProjectCategory[]> = {
  maps: ['fantasy-maps', 'travel'],
  more: ['book-covers', 'editorial', 'patterns', 'commercial'],
};

export function galleryGroupForCategory(
  category: ProjectCategory,
): GalleryGroup {
  return categoriesByGroup.maps.includes(category) ? 'maps' : 'more';
}

export type SortField = 'date' | 'tag' | 'views' | 'title';
export type SortDirection = 'asc' | 'desc';

export const sortFieldDefaults: {
  field: SortField;
  defaultDirection: SortDirection;
}[] = [
  { field: 'date', defaultDirection: 'desc' },
  { field: 'tag', defaultDirection: 'asc' },
  { field: 'views', defaultDirection: 'desc' },
  { field: 'title', defaultDirection: 'asc' },
];
