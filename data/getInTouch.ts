import type { GetInTouchInput } from '~/types/getInTouch';

/** Mock / fallback — sincronizar com `npm run content:sync-contact`. */
export const getInTouchFallback: GetInTouchInput = {
  photo: {
    src: '/images/about.JPG',
    alt: {
      en: '{name} — illustrator',
      pt: '{name} — ilustradora',
    },
  },
  email: 'hi@layanemoura.com.br',
  eyebrow: {
    en: 'Get in touch',
    pt: 'Contato',
  },
  title: {
    en: "Let's create something together.",
    pt: 'Vamos criar algo juntos.',
  },
  about: {
    en: [
      "Hi, I'm a curious illustrator, born in Brazil, but living around the world in a campervan for over a year now! I work with both digital and traditional media, like watercolor, most of the time mixing everything together.",
      "I'm passionate about new places, people and cultures, which definitely reflects in my work! And this goes for 'real worlds' as well as those that exist only in our imagination. So, I produce a lot of things in the universe of fantasy and ludic as well.",
      "My work allows applications in the most diverse types of media, mainly children's book covers, magazines, product design and advertising pieces.",
      "Why don't we keep in contact? :)",
    ].join('\n\n'),
    pt: [
      'Olá! Eu sou uma curiosa ilustradora, nascida no Brasil, mas vivendo pelo mundo em uma campervan há mais de 1 ano! Trabalho tanto com o digital, como também com mídias tradicionais, como a aquarela, mas na maior parte do tempo misturando tudo em uma coisa só.',
      'Sou apaixonada por novos lugares, pessoas e culturas, o que sem dúvida se reflete no meu trabalho! E isso vale tanto para \'mundos reais\', quanto para os que existem apenas na nossa imaginação. Sendo assim, também produzo bastante coisas no universo da fantasia e do lúdico.',
      'Meu trabalho permite aplicações nos mais diversos tipos de media, principalmente capas de livros infantis e YA, revistas, design de produto, peças publicitárias e estamparia.',
      'Por que não nos mantemos em contato? :)',
    ].join('\n\n'),
  },
  aboutEmail: {
    en: 'Send me a message to {email}!',
    pt: 'Fale comigo pelo {email}!',
  },
  heading: {
    en: 'Contact',
    pt: 'Contato',
  },
  basedIn: {
    label: { en: 'Based in', pt: 'Base' },
    value: { en: 'Europe (nomad)', pt: 'Europa (nômade)' },
  },
  languages: {
    label: { en: 'Languages', pt: 'Idiomas' },
    value: { en: 'PT · EN · FR (basic)', pt: 'PT · EN · FR (básico)' },
  },
  availability: {
    label: { en: 'Availability', pt: 'Disponibilidade' },
    value: {
      en: 'Freelance & remote full-time',
      pt: 'Freela e remoto em tempo integral',
    },
  },
};
