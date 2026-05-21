/**
 * Gera mock da galeria a partir de /ARQUIVOS:
 * copia imagens → public/images/projects/{slug}.jpg
 * e reescreve data/projects.ts
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arquivosDir = path.join(root, 'ARQUIVOS');
const outDir = path.join(root, 'public/images/projects');

const MOCK_ENTRIES = [
  { slug: 'elderfen-coast-chart', title: 'Elderfen', subtitle: 'Coast Chart', category: 'fantasy-maps', layout: 'wide' },
  { slug: 'bruma-archipelago', title: 'Bruma', subtitle: 'Archipelago Map', category: 'fantasy-maps', layout: 'tall' },
  { slug: 'cinder-reach-atlas', title: 'Cinder Reach', subtitle: 'Regional Atlas', category: 'fantasy-maps', layout: 'normal' },
  { slug: 'hollow-crown-realms', title: 'Hollow Crown', subtitle: 'Realm Map', category: 'fantasy-maps', layout: 'wide' },
  { slug: 'mistral-bay-chart', title: 'Mistral Bay', subtitle: 'Harbor Chart', category: 'fantasy-maps', layout: 'normal' },
  { slug: 'thornwall-expedition', title: 'Thornwall', subtitle: 'Expedition Map', category: 'fantasy-maps', layout: 'tall' },
  { slug: 'amber-quay-travel', title: 'Amber Quay', subtitle: 'Travel Poster', category: 'travel', layout: 'wide' },
  { slug: 'cedar-lane-atlas', title: 'Cedar Lane', subtitle: 'City Atlas', category: 'travel', layout: 'tall' },
  { slug: 'loom-harbor-guide', title: 'Loom Harbor', subtitle: 'Visitor Guide', category: 'travel', layout: 'normal' },
  { slug: 'north-veldt-route', title: 'North Veldt', subtitle: 'Route Map', category: 'travel', layout: 'wide' },
  { slug: 'silkthorn-valley', title: 'Silkthorn', subtitle: 'Valley Map', category: 'travel', layout: 'normal' },
  { slug: 'plover-market-travel', title: 'Plover Market', subtitle: 'Street Map', category: 'travel', layout: 'tall' },
  { slug: 'quartz-bloom-cover', title: 'Quartz Bloom', subtitle: 'Book Cover', category: 'book-covers', layout: 'tall' },
  { slug: 'night-heron-folio', title: 'Night Heron', subtitle: 'Book Cover', category: 'book-covers', layout: 'normal' },
  { slug: 'willow-ink-chronicle', title: 'Willow Ink', subtitle: 'Cover Study', category: 'book-covers', layout: 'tall' },
  { slug: 'driftwood-tales', title: 'Driftwood Tales', subtitle: 'Cover Art', category: 'book-covers', layout: 'wide' },
  { slug: 'lantern-row-print', title: 'Lantern Row', subtitle: 'Editorial Print', category: 'editorial', layout: 'wide' },
  { slug: 'herb-garden-studies', title: 'Herb Garden', subtitle: 'Editorial Spread', category: 'editorial', layout: 'normal' },
  { slug: 'copper-spine-poster', title: 'Copper Spine', subtitle: 'Poster', category: 'editorial', layout: 'tall' },
  { slug: 'glasshour-review', title: 'Glasshour', subtitle: 'Magazine Art', category: 'editorial', layout: 'wide' },
  { slug: 'meadow-stitch-pattern', title: 'Meadow Stitch', subtitle: 'Pattern', category: 'patterns', layout: 'normal' },
  { slug: 'river-clay-motif', title: 'River Clay', subtitle: 'Repeat Pattern', category: 'patterns', layout: 'normal' },
  { slug: 'sunfall-tile-set', title: 'Sunfall', subtitle: 'Tile Pattern', category: 'patterns', layout: 'wide' },
  { slug: 'fernwave-textile', title: 'Fernwave', subtitle: 'Textile Pattern', category: 'patterns', layout: 'tall' },
  { slug: 'clover-market-badge', title: 'Clover Market', subtitle: 'Brand Sticker', category: 'commercial', layout: 'normal' },
  { slug: 'hazel-roost-label', title: 'Hazel Roost', subtitle: 'Product Label', category: 'commercial', layout: 'normal' },
  { slug: 'pinecrest-campaign', title: 'Pinecrest', subtitle: 'Campaign Art', category: 'commercial', layout: 'wide' },
  { slug: 'rust-creek-packaging', title: 'Rust Creek', subtitle: 'Packaging', category: 'commercial', layout: 'tall' },
  { slug: 'glimmerford-chart', title: 'Glimmerford', subtitle: 'River Chart', category: 'fantasy-maps', layout: 'normal' },
  { slug: 'ashford-mirelands', title: 'Ashford Mire', subtitle: 'Wetland Map', category: 'fantasy-maps', layout: 'tall' },
  { slug: 'starling-cape-map', title: 'Starling Cape', subtitle: 'Peninsula Map', category: 'fantasy-maps', layout: 'wide' },
  { slug: 'ivory-steppe-atlas', title: 'Ivory Steppe', subtitle: 'Steppe Atlas', category: 'fantasy-maps', layout: 'normal' },
  { slug: 'wrenhaven-travel', title: 'Wrenhaven', subtitle: 'Travel Print', category: 'travel', layout: 'wide' },
  { slug: 'briar-coast-postcard', title: 'Briar Coast', subtitle: 'Postcard Set', category: 'travel', layout: 'normal' },
  { slug: 'orchard-line-guide', title: 'Orchard Line', subtitle: 'Trail Guide', category: 'travel', layout: 'tall' },
  { slug: 'moonlake-itinerary', title: 'Moonlake', subtitle: 'Itinerary Map', category: 'travel', layout: 'normal' },
  { slug: 'sparrow-north-cover', title: 'Sparrow North', subtitle: 'Novel Cover', category: 'book-covers', layout: 'tall' },
  { slug: 'inkwell-society', title: 'Inkwell Society', subtitle: 'Cover Concept', category: 'book-covers', layout: 'normal' },
  { slug: 'foxglove-almanac', title: 'Foxglove', subtitle: 'Almanac Cover', category: 'book-covers', layout: 'wide' },
  { slug: 'tidepool-letters', title: 'Tidepool Letters', subtitle: 'Cover Art', category: 'book-covers', layout: 'tall' },
  { slug: 'ember-field-editorial', title: 'Ember Field', subtitle: 'Feature Art', category: 'editorial', layout: 'wide' },
  { slug: 'quiet-harbor-spread', title: 'Quiet Harbor', subtitle: 'Spread', category: 'editorial', layout: 'normal' },
  { slug: 'silver-birch-poster', title: 'Silver Birch', subtitle: 'Event Poster', category: 'editorial', layout: 'tall' },
  { slug: 'dawn-courier-cover', title: 'Dawn Courier', subtitle: 'Magazine Cover', category: 'editorial', layout: 'normal' },
  { slug: 'pebble-moss-repeat', title: 'Pebble Moss', subtitle: 'Surface Pattern', category: 'patterns', layout: 'normal' },
  { slug: 'cloudberry-weave', title: 'Cloudberry', subtitle: 'Weave Pattern', category: 'patterns', layout: 'wide' },
  { slug: 'thistle-down-motif', title: 'Thistle Down', subtitle: 'Motif Study', category: 'patterns', layout: 'tall' },
  { slug: 'harbor-linen-print', title: 'Harbor Linen', subtitle: 'Print Pattern', category: 'patterns', layout: 'normal' },
  { slug: 'oatmill-sticker-set', title: 'Oatmill', subtitle: 'Sticker Set', category: 'commercial', layout: 'normal' },
  { slug: 'birchlane-brand-mark', title: 'Birchlane', subtitle: 'Brand Mark', category: 'commercial', layout: 'normal' },
  { slug: 'stonecrop-bottle-wrap', title: 'Stonecrop', subtitle: 'Bottle Wrap', category: 'commercial', layout: 'tall' },
  { slug: 'lumen-tea-packaging', title: 'Lumen Tea', subtitle: 'Packaging Art', category: 'commercial', layout: 'wide' },
  { slug: 'valebrook-final-chart', title: 'Valebrook', subtitle: 'Kingdom Chart', category: 'fantasy-maps', layout: 'wide' },
  { slug: 'rookspire-borderlands', title: 'Rookspire', subtitle: 'Borderlands', category: 'fantasy-maps', layout: 'tall' },
  { slug: 'halcyon-reach-draft', title: 'Halcyon Reach', subtitle: 'Draft Map', category: 'fantasy-maps', layout: 'normal' },
];

const PALETTE = [
  ['#c97b52', '#5f6b4f'],
  ['#5f7c7a', '#4a372c'],
  ['#7b7058', '#b86a3d'],
  ['#c89b6d', '#c97b52'],
  ['#5f6b4f', '#c89b6d'],
  ['#b86a3d', '#5f6b4f'],
  ['#4a372c', '#7b7058'],
  ['#5f7c7a', '#5f6b4f'],
];

function listSourceImages() {
  return fs
    .readdirSync(arquivosDir)
    .filter((f) => /\.(jpe?g|png)$/i.test(f) && !/\.psd$/i.test(f))
    .sort((a, b) => a.localeCompare(b, 'en'));
}

function convertToJpg(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  execSync(
    `sips -s format jpeg -s formatOptions 82 --resampleHeightWidthMax 1920 ${JSON.stringify(src)} --out ${JSON.stringify(dest)}`,
    { stdio: 'pipe' },
  );
}

function pickViews(index) {
  const values = [48, 71, 94, 127, 182, 234, 308, 412, 521, 608];
  return values[index % values.length];
}

function buildProjectsTs(items) {
  const rows = items.map((p, i) => {
    const [thumbFrom, thumbTo] = PALETTE[i % PALETTE.length];
    const year = 2022 + (i % 4);
    const featured = i < 4 || i % 7 === 0;
    return `  {
    slug: '${p.slug}',
    title: '${p.title.replace(/'/g, "\\'")}',
    subtitle: '${p.subtitle.replace(/'/g, "\\'")}',
    category: '${p.category}',
    year: ${year},
    views: ${pickViews(i)},
    tools: ['Procreate'],
    behanceUrl: 'https://www.behance.net/layanemds',
    featured: ${featured},
    image: projectImage('${p.slug}'),
    thumbFrom: '${thumbFrom}',
    thumbTo: '${thumbTo}',
    layout: '${p.layout}',
  }`;
  });

  return `import type { ProjectCategory } from './site';

export type GalleryLayout = 'tall' | 'wide' | 'normal';

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  year: number;
  /** Visualizações no Behance (mock) */
  views: number;
  tools: string[];
  behanceUrl: string;
  featured: boolean;
  /** Capa em public/images/projects/ (mock a partir de ARQUIVOS) */
  image?: string;
  thumbFrom: string;
  thumbTo: string;
  layout: GalleryLayout;
}

const projectImage = (slug: string) => \`/images/projects/\${slug}.jpg\`;

/** Mock inicial — gerado por scripts/seed-mock-from-arquivos.mjs */
export const projects: Project[] = [
${rows.join(',\n')},
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
`;
}

function main() {
  const sources = listSourceImages();
  const count = Math.min(sources.length, MOCK_ENTRIES.length);

  if (sources.length > MOCK_ENTRIES.length) {
    console.warn(
      `Aviso: ${sources.length} imagens, ${MOCK_ENTRIES.length} entradas mock — usando as primeiras ${count}.`,
    );
  }

  if (sources.length < MOCK_ENTRIES.length) {
    console.warn(
      `Aviso: só ${sources.length} imagens — projetos mock reduzidos.`,
    );
  }

  const used = MOCK_ENTRIES.slice(0, count);
  const projects = [];

  for (let i = 0; i < count; i++) {
    const entry = used[i];
    const src = path.join(arquivosDir, sources[i]);
    const dest = path.join(outDir, `${entry.slug}.jpg`);
    console.log(`→ ${entry.slug}.jpg ← ${sources[i]}`);
    convertToJpg(src, dest);
    projects.push(entry);
  }

  // Remove old behance mock jpgs not in new set
  const keep = new Set(projects.map((p) => `${p.slug}.jpg`));
  for (const f of fs.readdirSync(outDir)) {
    if (f === 'README.md') continue;
    if (!keep.has(f)) {
      fs.unlinkSync(path.join(outDir, f));
      console.log(`✕ removido ${f}`);
    }
  }

  fs.writeFileSync(path.join(root, 'data/projects.ts'), buildProjectsTs(projects));
  console.log(`\n✓ ${count} projetos mock em data/projects.ts`);
}

main();
