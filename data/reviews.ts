import type { ClientReview } from '~/types/review';

export type { ClientReview };

/** Fallback legado (1 depoimento de referência). Conteúdo oficial: `content/reviews/*.yml`. */
export const reviewsByLocale: Record<'en' | 'pt', ClientReview[]> = {
  en: [
    {
      id: 'sarah-mitchell',
      text: 'Layane captured the spirit of our destination with a map that feels both informative and full of soul. Our travellers still share it on social media months later.',
      clientName: 'Sarah Mitchell',
      clientRole: 'Creative Director',
      clientCompany: 'Horizon Travel Co.',
      projectType: 'Travel illustration',
    },
  ],
  pt: [
    {
      id: 'sarah-mitchell',
      text: 'A Layane capturou o espírito do nosso destino com um mapa informativo e cheio de alma. Nossos viajantes ainda compartilham nas redes meses depois.',
      clientName: 'Sarah Mitchell',
      clientRole: 'Diretora criativa',
      clientCompany: 'Horizon Travel Co.',
      projectType: 'Ilustração de viagem',
    },
  ],
};
