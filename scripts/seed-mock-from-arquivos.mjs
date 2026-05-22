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

const MAPS_TAGS = new Set(['fantasy-maps', 'travel']);

function groupForTag(tag) {
  return MAPS_TAGS.has(tag) ? 'maps' : 'more';
}

const MOCK_ENTRIES = [
  { slug: 'elderfen-coast-chart', title: 'Elderfen', subtitle: 'Coast Chart', tag: 'fantasy-maps', layout: 'wide' },
  { slug: 'bruma-archipelago', title: 'Bruma', subtitle: 'Archipelago Map', tag: 'fantasy-maps', layout: 'tall' },
  { slug: 'cinder-reach-atlas', title: 'Cinder Reach', subtitle: 'Regional Atlas', tag: 'fantasy-maps', layout: 'normal' },
  { slug: 'hollow-crown-realms', title: 'Hollow Crown', subtitle: 'Realm Map', tag: 'fantasy-maps', layout: 'wide' },
  { slug: 'mistral-bay-chart', title: 'Mistral Bay', subtitle: 'Harbor Chart', tag: 'fantasy-maps', layout: 'normal' },
  { slug: 'thornwall-expedition', title: 'Thornwall', subtitle: 'Expedition Map', tag: 'fantasy-maps', layout: 'tall' },
  { slug: 'amber-quay-travel', title: 'Amber Quay', subtitle: 'Travel Poster', tag: 'travel', layout: 'wide' },
  { slug: 'cedar-lane-atlas', title: 'Cedar Lane', subtitle: 'City Atlas', tag: 'travel', layout: 'tall' },
  { slug: 'loom-harbor-guide', title: 'Loom Harbor', subtitle: 'Visitor Guide', tag: 'travel', layout: 'normal' },
  { slug: 'north-veldt-route', title: 'North Veldt', subtitle: 'Route Map', tag: 'travel', layout: 'wide' },
  { slug: 'silkthorn-valley', title: 'Silkthorn', subtitle: 'Valley Map', tag: 'travel', layout: 'normal' },
  { slug: 'plover-market-travel', title: 'Plover Market', subtitle: 'Street Map', tag: 'travel', layout: 'tall' },
  { slug: 'quartz-bloom-cover', title: 'Quartz Bloom', subtitle: 'Book Cover', tag: 'book-covers', layout: 'tall' },
  { slug: 'night-heron-folio', title: 'Night Heron', subtitle: 'Book Cover', tag: 'book-covers', layout: 'normal' },
  { slug: 'willow-ink-chronicle', title: 'Willow Ink', subtitle: 'Cover Study', tag: 'book-covers', layout: 'tall' },
  { slug: 'driftwood-tales', title: 'Driftwood Tales', subtitle: 'Cover Art', tag: 'book-covers', layout: 'wide' },
  { slug: 'lantern-row-print', title: 'Lantern Row', subtitle: 'Editorial Print', tag: 'editorial', layout: 'wide' },
  { slug: 'herb-garden-studies', title: 'Herb Garden', subtitle: 'Editorial Spread', tag: 'editorial', layout: 'normal' },
  { slug: 'copper-spine-poster', title: 'Copper Spine', subtitle: 'Poster', tag: 'editorial', layout: 'tall' },
  { slug: 'glasshour-review', title: 'Glasshour', subtitle: 'Magazine Art', tag: 'editorial', layout: 'wide' },
  { slug: 'meadow-stitch-pattern', title: 'Meadow Stitch', subtitle: 'Pattern', tag: 'patterns', layout: 'normal' },
  { slug: 'river-clay-motif', title: 'River Clay', subtitle: 'Repeat Pattern', tag: 'patterns', layout: 'normal' },
  { slug: 'sunfall-tile-set', title: 'Sunfall', subtitle: 'Tile Pattern', tag: 'patterns', layout: 'wide' },
  { slug: 'fernwave-textile', title: 'Fernwave', subtitle: 'Textile Pattern', tag: 'patterns', layout: 'tall' },
  { slug: 'clover-market-badge', title: 'Clover Market', subtitle: 'Brand Sticker', tag: 'commercial', layout: 'normal' },
  { slug: 'hazel-roost-label', title: 'Hazel Roost', subtitle: 'Product Label', tag: 'commercial', layout: 'normal' },
  { slug: 'pinecrest-campaign', title: 'Pinecrest', subtitle: 'Campaign Art', tag: 'commercial', layout: 'wide' },
  { slug: 'rust-creek-packaging', title: 'Rust Creek', subtitle: 'Packaging', tag: 'commercial', layout: 'tall' },
  { slug: 'glimmerford-chart', title: 'Glimmerford', subtitle: 'River Chart', tag: 'fantasy-maps', layout: 'normal' },
  { slug: 'ashford-mirelands', title: 'Ashford Mire', subtitle: 'Wetland Map', tag: 'fantasy-maps', layout: 'tall' },
  { slug: 'starling-cape-map', title: 'Starling Cape', subtitle: 'Peninsula Map', tag: 'fantasy-maps', layout: 'wide' },
  { slug: 'ivory-steppe-atlas', title: 'Ivory Steppe', subtitle: 'Steppe Atlas', tag: 'fantasy-maps', layout: 'normal' },
  { slug: 'wrenhaven-travel', title: 'Wrenhaven', subtitle: 'Travel Print', tag: 'travel', layout: 'wide' },
  { slug: 'briar-coast-postcard', title: 'Briar Coast', subtitle: 'Postcard Set', tag: 'travel', layout: 'normal' },
  { slug: 'orchard-line-guide', title: 'Orchard Line', subtitle: 'Trail Guide', tag: 'travel', layout: 'tall' },
  { slug: 'moonlake-itinerary', title: 'Moonlake', subtitle: 'Itinerary Map', tag: 'travel', layout: 'normal' },
  { slug: 'sparrow-north-cover', title: 'Sparrow North', subtitle: 'Novel Cover', tag: 'book-covers', layout: 'tall' },
  { slug: 'inkwell-society', title: 'Inkwell Society', subtitle: 'Cover Concept', tag: 'book-covers', layout: 'normal' },
  { slug: 'foxglove-almanac', title: 'Foxglove', subtitle: 'Almanac Cover', tag: 'book-covers', layout: 'wide' },
  { slug: 'tidepool-letters', title: 'Tidepool Letters', subtitle: 'Cover Art', tag: 'book-covers', layout: 'tall' },
  { slug: 'ember-field-editorial', title: 'Ember Field', subtitle: 'Feature Art', tag: 'editorial', layout: 'wide' },
  { slug: 'quiet-harbor-spread', title: 'Quiet Harbor', subtitle: 'Spread', tag: 'editorial', layout: 'normal' },
  { slug: 'silver-birch-poster', title: 'Silver Birch', subtitle: 'Event Poster', tag: 'editorial', layout: 'tall' },
  { slug: 'dawn-courier-cover', title: 'Dawn Courier', subtitle: 'Magazine Cover', tag: 'editorial', layout: 'normal' },
  { slug: 'pebble-moss-repeat', title: 'Pebble Moss', subtitle: 'Surface Pattern', tag: 'patterns', layout: 'normal' },
  { slug: 'cloudberry-weave', title: 'Cloudberry', subtitle: 'Weave Pattern', tag: 'patterns', layout: 'wide' },
  { slug: 'thistle-down-motif', title: 'Thistle Down', subtitle: 'Motif Study', tag: 'patterns', layout: 'tall' },
  { slug: 'harbor-linen-print', title: 'Harbor Linen', subtitle: 'Print Pattern', tag: 'patterns', layout: 'normal' },
  { slug: 'oatmill-sticker-set', title: 'Oatmill', subtitle: 'Sticker Set', tag: 'commercial', layout: 'normal' },
  { slug: 'birchlane-brand-mark', title: 'Birchlane', subtitle: 'Brand Mark', tag: 'commercial', layout: 'normal' },
  { slug: 'stonecrop-bottle-wrap', title: 'Stonecrop', subtitle: 'Bottle Wrap', tag: 'commercial', layout: 'tall' },
  { slug: 'lumen-tea-packaging', title: 'Lumen Tea', subtitle: 'Packaging Art', tag: 'commercial', layout: 'wide' },
  { slug: 'valebrook-final-chart', title: 'Valebrook', subtitle: 'Kingdom Chart', tag: 'fantasy-maps', layout: 'wide' },
  { slug: 'rookspire-borderlands', title: 'Rookspire', subtitle: 'Borderlands', tag: 'fantasy-maps', layout: 'tall' },
  { slug: 'halcyon-reach-draft', title: 'Halcyon Reach', subtitle: 'Draft Map', tag: 'fantasy-maps', layout: 'normal' },
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

function buildProjectsTs(items) {
  const rows = items.map((p, i) => {
    const year = 2022 + (i % 4);
    const isHighlight = i < 4 || i % 7 === 0;
    const group = groupForTag(p.tag);
    return `  {
    slug: '${p.slug}',
    published: true,
    highlight: ${isHighlight},
    title: '${p.title.replace(/'/g, "\\'")}',
    subtitle: '${p.subtitle.replace(/'/g, "\\'")}',
    category: '${group}',
    tags: ['${p.tag}'],
    year: ${year},
    behanceUrl: 'https://www.behance.net/layanemds',
    image: projectImage('${p.slug}'),
    layout: '${p.layout}',
  }`;
  });

  return `import type { ProjectInput } from '~/types/project';

export type { GalleryLayout, Project, ProjectInput } from '~/types/project';

const projectImage = (slug: string) => \`/images/projects/\${slug}.jpg\`;

/** Mock inicial — gerado por scripts/seed-mock-from-arquivos.mjs */
export const projects: ProjectInput[] = [
${rows.join(',\n')},
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getHighlightProjects(): Project[] {
  return projects.filter((p) => p.published && p.highlight);
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
