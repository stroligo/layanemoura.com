import type { ServiceInput } from '~/types/service';

/** Mock / fallback — sincronizar com `npm run content:sync-services`. */
export const servicesFallback: ServiceInput[] = [
  {
    slug: 'fantasy-maps',
    published: true,
    order: 10,
    icon: 'fantasyMaps',
    title: {
      en: 'Fantasy maps',
      pt: 'Mapas de fantasia',
    },
    description: {
      en: 'Hand-drawn realms for books, games and RPG worlds — with hidden details and a sense of adventure.',
      pt: 'Reinos desenhados à mão para livros, jogos e mundos de RPG — com detalhes escondidos e clima de aventura.',
    },
  },
  {
    slug: 'travel-maps',
    published: true,
    order: 20,
    icon: 'travelMaps',
    title: {
      en: 'Travel illustration',
      pt: 'Ilustração de viagem',
    },
    description: {
      en: 'City guides, tourist maps and travel posters that feel inviting, clear and full of local character.',
      pt: 'Guias urbanos, mapas turísticos e pôsteres de viagem acolhedores, claros e cheios de identidade local.',
    },
  },
  {
    slug: 'book-covers',
    published: true,
    order: 30,
    icon: 'bookCovers',
    title: {
      en: 'Book covers',
      pt: 'Capas de livros',
    },
    description: {
      en: "Cover art that balances warmth and mystery — for fiction, children's books and illustrated editions.",
      pt: 'Arte de capa que equilibra calor e mistério — para ficção, livros infantis e edições ilustradas.',
    },
  },
  {
    slug: 'editorial',
    published: true,
    order: 40,
    icon: 'editorial',
    title: {
      en: 'Editorial illustration',
      pt: 'Ilustração editorial',
    },
    description: {
      en: 'Spot illustrations, spreads and visual storytelling for magazines, articles and publishing.',
      pt: 'Ilustrações pontuais, spreads e narrativa visual para revistas, artigos e editoras.',
    },
  },
  {
    slug: 'commercial',
    published: true,
    order: 50,
    icon: 'commercial',
    title: {
      en: 'Commercial illustration',
      pt: 'Ilustração comercial',
    },
    description: {
      en: 'Campaign visuals, packaging and brand artwork with a handcrafted, timeless quality.',
      pt: 'Visuais de campanha, embalagens e arte para marcas com qualidade artesanal e atemporal.',
    },
  },
  {
    slug: 'commissions',
    published: true,
    order: 60,
    icon: 'commissions',
    title: {
      en: 'Custom commissions',
      pt: 'Comissionados personalizados',
    },
    description: {
      en: 'Personal worlds, gifts and one-of-a-kind pieces — from concept sketches to finished artwork.',
      pt: 'Mundos pessoais, presentes e peças únicas — do esboço inicial à obra finalizada.',
    },
  },
];
