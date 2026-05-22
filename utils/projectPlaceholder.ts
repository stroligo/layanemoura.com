/** Paleta da identidade — gradiente de fallback por card (sem YAML). */
const THUMB_PALETTE: [string, string][] = [
  ['#c97b52', '#5f6b4f'],
  ['#5f7c7a', '#4a372c'],
  ['#7b7058', '#b86a3d'],
  ['#c89b6d', '#c97b52'],
  ['#5f6b4f', '#c89b6d'],
  ['#b86a3d', '#5f6b4f'],
  ['#4a372c', '#7b7058'],
  ['#5f7c7a', '#5f6b4f'],
];

function hashSlug(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function projectThumbColors(slug: string): { from: string; to: string } {
  const [from, to] = THUMB_PALETTE[hashSlug(slug) % THUMB_PALETTE.length];
  return { from, to };
}

export function projectPlaceholderStyle(
  slug: string,
  variant: 'card' | 'modal' = 'card',
): Record<string, string> {
  const { from, to } = projectThumbColors(slug);
  const fromMix = variant === 'modal' ? 70 : 75;
  const toMix = variant === 'modal' ? 55 : 60;

  return {
    background: `linear-gradient(165deg, color-mix(in srgb, ${from} ${fromMix}%, #faf8f4) 0%, color-mix(in srgb, ${to} ${toMix}%, #5a3e2b) 100%)`,
  };
}
