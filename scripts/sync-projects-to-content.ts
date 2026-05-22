/**
 * Exporta data/projects.ts → content/projects/*.yml (Nuxt Content / Studio)
 *
 *   npm run content:sync
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stringify } from 'yaml';
import { projects } from '../data/projects';
import { normalizeProject, projectImagePath } from '../types/project';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'content/projects');
mkdirSync(outDir, { recursive: true });

let count = 0;

for (const raw of projects) {
  const normalized = normalizeProject(raw);
  const { slug, images, ...fields } = normalized;
  const data: Record<string, unknown> = { ...fields };

  const defaultCover = projectImagePath(slug);
  const extra = images.filter((src) => src !== defaultCover);

  if (images.length) {
    data.images = images.map((src) => ({ src }));
  }

  writeFileSync(join(outDir, `${slug}.yml`), stringify(data), 'utf8');
  count += 1;
}

console.log(`Wrote ${count} project files to content/projects/`);
