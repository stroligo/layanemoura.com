import type { ClientReview } from '~/types/review';

export type { ClientReview };

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
    {
      id: 'daniela-ribeiro',
      text: "The fantasy map she created for my son's book is the heart of the story. Every corner hides a detail he discovers again and again — it's magical without being childish.",
      clientName: 'Daniela Ribeiro',
      clientRole: 'Author',
      projectType: "Children's book map",
    },
    {
      id: 'james-whitmore',
      text: 'Working with Layane felt like collaborating with someone who truly listens. The cover illustration balances warmth and mystery exactly the way we imagined.',
      clientName: 'James Whitmore',
      clientRole: 'Art Director',
      clientCompany: 'Northlight Editions',
      projectType: 'Book cover',
    },
    {
      id: 'elena-costa',
      text: 'Her vintage travel posters gave our campaign a handcrafted, timeless quality. The line work and colour palette stood out immediately in a sea of stock imagery.',
      clientName: 'Elena Costa',
      clientRole: 'Brand Strategist',
      clientCompany: 'Wander Studio',
      projectType: 'Editorial & posters',
    },
    {
      id: 'marco-bellini',
      text: 'We needed a tourist map that felt inviting, not clinical. Layane delivered something our visitors treasure — clear, beautiful, and unmistakably Tuscan.',
      clientName: 'Marco Bellini',
      clientRole: 'Tourism Coordinator',
      clientCompany: 'Regione Toscana — Partner project',
      projectType: 'Travel map',
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
    {
      id: 'daniela-ribeiro',
      text: 'O mapa de fantasia que ela criou para o livro do meu filho é o coração da história. Cada canto esconde um detalhe que ele redescobre — mágico sem ser infantil.',
      clientName: 'Daniela Ribeiro',
      clientRole: 'Autora',
      projectType: 'Mapa para livro infantil',
    },
    {
      id: 'james-whitmore',
      text: 'Trabalhar com a Layane foi colaborar com alguém que realmente escuta. A capa equilibra calor e mistério exatamente como imaginávamos.',
      clientName: 'James Whitmore',
      clientRole: 'Diretor de arte',
      clientCompany: 'Northlight Editions',
      projectType: 'Capa de livro',
    },
    {
      id: 'elena-costa',
      text: 'Seus pôsteres vintage deram à campanha uma qualidade artesanal e atemporal. O traço e a paleta se destacaram num mar de imagens de banco.',
      clientName: 'Elena Costa',
      clientRole: 'Estrategista de marca',
      clientCompany: 'Wander Studio',
      projectType: 'Editorial e pôsteres',
    },
    {
      id: 'marco-bellini',
      text: 'Precisávamos de um mapa turístico acolhedor, não clínico. A Layane entregou algo que nossos visitantes guardam — claro, belo e inconfundivelmente toscano.',
      clientName: 'Marco Bellini',
      clientRole: 'Coordenador de turismo',
      clientCompany: 'Regione Toscana — Projeto parceiro',
      projectType: 'Mapa de viagem',
    },
  ],
};
