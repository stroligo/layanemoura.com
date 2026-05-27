export type GalleryLayout = 'tall' | 'wide' | 'normal';

export type ProjectMeta = {
  tags: string[];
  layout: GalleryLayout;
  description: { en: string; pt: string };
};

function haystack(slug: string, title: string, subtitle: string) {
  return `${slug} ${title} ${subtitle}`.toLowerCase();
}

export function inferTags(slug: string, title: string, subtitle: string): string[] {
  const h = haystack(slug, title, subtitle);
  const tags = new Set<string>();

  if (h.includes('treasure-hunt') || h.includes('treasure hunt')) {
    tags.add('treasure-hunt');
    tags.add('travel-maps');
  }

  if (
    /fantasy|realm|kingdom|archipelago|enchanted|helenica|crowns|aetheria|aveloria|aquamorpha|regnum|simbionte|desmenia|greystar|hollow|illiard|meronte|secret valley|elemental|atomic scaling|kushet|aardon|tree house|gray university|gold hill mining|north pole|porth ysgo|tresco|vietlinh|landlock|laos|barrel roll|indochina|de soto|downfall|eleanor palace|helenica|crooked crowns/i.test(
      h,
    ) ||
    /map of|continental|proposal|plantation|festival|mining district|realm/i.test(h)
  ) {
    tags.add('fantasy-maps');
  }

  if (
    /travel|tour|city|park|neighborhood|alps|wales|toscana|doha|matera|pasadena|tours|yellowstone|sticker|poster|guide|route|itinerary|camp|fair|university|fordham|pantheon|patara|turkey|antalya|beach|central|america|south america|newlands|day camp|price renaissance|atomic|scaling|our first year|helena|jason|new york jones|walk in the park|pedro|england|turkey|netherfield|hoddesdon|welwyn|carlton|arnott|tredegar|lithgow|region|swiss|greystar|coloured|colored/i.test(
      h,
    )
  ) {
    tags.add('travel-maps');
  }

  if (/historical|1539|1543|indochina war|de soto|downfall|second indochina/i.test(h)) {
    tags.add('historical');
  }

  if (/festival|landlock|secret valley|elemental|renaissance fair|price renaissance/i.test(h)) {
    tags.add('festival');
  }

  if (/poster|sticker|proposal/i.test(h)) {
    tags.add('poster');
  }

  if (/university|fordham|pantheon|gray university/i.test(h)) {
    tags.add('editorial');
  }

  if (
    /\bb-?w\b|greyscale|grayscale|sepia|black.and.white/i.test(h) ||
    subtitle.toLowerCase().includes('b&w') ||
    subtitle.toLowerCase() === 'b/w'
  ) {
    tags.add('black-and-white');
  }

  if (/coloured|colored|colour|color/i.test(h) && !tags.has('black-and-white')) {
    tags.add('colour');
  }

  if (/personal|helena|jason|our first year/i.test(h)) {
    tags.add('personal');
  }

  if (/mining|gold hill/i.test(h)) {
    tags.add('regional');
  }

  if (tags.size === 0) tags.add('fantasy-maps');

  return [...tags].sort();
}

function subtitlePhrase(subtitle: string, locale: 'en' | 'pt') {
  const s = subtitle.trim();
  if (!s) return '';
  if (locale === 'en') return ` — ${s}`;
  return ` — ${s}`;
}

export function buildDescription(
  title: string,
  subtitle: string,
  tags: string[],
): { en: string; pt: string } {
  const subEn = subtitlePhrase(subtitle, 'en');
  const subPt = subtitlePhrase(subtitle, 'pt');

  if (tags.includes('treasure-hunt')) {
    return {
      en: `Illustrated treasure-hunt map for ${title}${subEn}. Clear paths, landmarks and playful details guide explorers through the route — designed for outdoor discovery and print-friendly readability.`,
      pt: `Mapa ilustrado de caça ao tesouro para ${title}${subPt}. Trilhos, pontos de referência e detalhes lúdicos orientam a exploração ao ar livre, com legibilidade pensada para impressão.`,
    };
  }

  if (tags.includes('historical')) {
    return {
      en: `Hand-drawn historical map for ${title}${subEn}. Geography, routes and period atmosphere are woven into a single readable composition for editorial or educational use.`,
      pt: `Mapa histórico desenhado à mão para ${title}${subPt}. Geografia, rotas e atmosfera de época reunidas numa composição clara para uso editorial ou educativo.`,
    };
  }

  if (tags.includes('travel-maps') && !tags.includes('fantasy-maps')) {
    return {
      en: `Travel-inspired illustrated map of ${title}${subEn}. Streets, landmarks and regional character are drawn with warmth and clarity — ideal for guides, posters and visitor materials.`,
      pt: `Mapa ilustrado de viagem de ${title}${subPt}. Ruas, marcos e identidade local desenhados com clareza e acolhimento — ideal para guias, pôsteres e materiais turísticos.`,
    };
  }

  if (tags.includes('festival')) {
    return {
      en: `Event map for ${title}${subEn}. Zones, paths and focal points are organized for wayfinding while keeping an organic, hand-crafted illustration style.`,
      pt: `Mapa de evento para ${title}${subPt}. Zonas, percursos e pontos de interesse organizados para orientação, mantendo um traço ilustrado e artesanal.`,
    };
  }

  if (tags.includes('personal')) {
    return {
      en: `Personal illustrated map celebrating ${title}${subEn}. Custom geography and intimate details tell a story meant to be kept, shared and revisited.`,
      pt: `Mapa ilustrado pessoal celebrando ${title}${subPt}. Geografia à medida e detalhes íntimos contam uma história para guardar e partilhar.`,
    };
  }

  if (tags.includes('poster')) {
    return {
      en: `Poster-style illustrated map for ${title}${subEn}. Strong composition and decorative cartography balance information with a bold visual presence.`,
      pt: `Mapa ilustrado em estilo pôster para ${title}${subPt}. Composição marcante e cartografia decorativa equilibram informação e impacto visual.`,
    };
  }

  if (tags.includes('black-and-white')) {
    return {
      en: `Black-and-white illustrated map of ${title}${subEn}. Ink-like textures and tonal contrast highlight coastlines, settlements and terrain without relying on colour.`,
      pt: `Mapa ilustrado a preto e branco de ${title}${subPt}. Texturas de tinta e contraste tonal destacam costas, povoações e relevo sem depender da cor.`,
    };
  }

  return {
    en: `Hand-drawn fantasy map for ${title}${subEn}. Invented coastlines, regions and hidden details invite viewers to explore an imaginary world with editorial polish.`,
    pt: `Mapa de fantasia desenhado à mão para ${title}${subPt}. Costas inventadas, regiões e detalhes escondidos convidam a explorar um mundo imaginário com acabamento editorial.`,
  };
}

export function inferLayout(width: number, height: number): GalleryLayout {
  if (!width || !height) return 'normal';
  const ratio = width / height;
  if (ratio >= 1.35) return 'wide';
  if (ratio <= 0.85) return 'tall';
  return 'normal';
}
