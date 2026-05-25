import type { HomeInput } from '~/types/home';
import { getInTouchFallback } from '~/data/getInTouch';

/** Mock / fallback — sincronizar com `npm run content:sync-home`. */
export const homeFallback: HomeInput = {
  mapsAbout: {
    published: true,
    photo: {
      src: '/images/projects/valebrook-final-chart.jpg',
      alt: {
        en: 'Fantasy kingdom map detail by {name}',
        pt: 'Detalhe de mapa de reino de fantasia por {name}',
      },
    },
    eyebrow: {
      en: 'Map making',
      pt: 'Criação de mapas',
    },
    heading: {
      en: 'Illustrative maps for real & imagined worlds',
      pt: 'Mapas ilustrados para mundos reais e imaginários',
    },
    text: {
      en: [
        'Layane specializes in hand-crafted cartography — from fantasy realms and RPG worlds to travel posters, city atlases and visitor guides.',
        'Each map balances clarity and storytelling: coastlines, towns, paths and small hidden details that invite viewers to linger and explore.',
        'Whether for publishing, tourism, editorial campaigns or personal worlds, every piece is drawn with organic textures and a timeless, inviting feel.',
      ].join('\n\n'),
      pt: [
        'Layane é especializada em cartografia ilustrada — de reinos de fantasia e mundos de RPG a pôsteres de viagem, atlas urbanos e guias turísticos.',
        'Cada mapa equilibra clareza e narrativa: costas, vilas, trilhas e pequenos detalhes escondidos que convidam o olhar a explorar.',
        'Seja para editoras, turismo, campanhas editoriais ou universos pessoais, cada peça é desenhada com texturas orgânicas e um clima atemporal e acolhedor.',
      ].join('\n\n'),
    },
    cta: {
      en: 'Discuss a map project',
      pt: 'Falar sobre um mapa',
    },
  },
  servicesHeader: {
    published: true,
    eyebrow: {
      en: 'What I offer',
      pt: 'O que ofereço',
    },
    heading: {
      en: 'Illustration services',
      pt: 'Serviços de ilustração',
    },
    cta: {
      en: 'Start a project',
      pt: 'Iniciar um projeto',
    },
  },
  aboutTeaser: {
    published: true,
    eyebrow: {
      en: 'About',
      pt: 'Sobre',
    },
    heading: { ...getInTouchFallback.title },
    text: { ...getInTouchFallback.about },
    aboutEmail: { ...getInTouchFallback.aboutEmail },
    cta: {
      en: 'Send a message',
      pt: 'Enviar mensagem',
    },
  },
};
