/**
 * Converte behanceUrl → links[] em content/projects/*.yml
 *
 *   npx tsx scripts/migrate-project-links.ts
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse, stringify } from 'yaml';
import { defaultBehanceLinkLabels } from '../types/project';

const root = join(import.meta.dirname, '..');
const dir = join(root, 'content/projects');

let updated = 0;

for (const file of readdirSync(dir).filter((f) => f.endsWith('.yml'))) {
  const path = join(dir, file);
  const doc = parse(readFileSync(path, 'utf8')) as Record<string, unknown>;

  if (Array.isArray(doc.links) && doc.links.length) {
    if (doc.behanceUrl) {
      delete doc.behanceUrl;
      writeFileSync(path, stringify(doc), 'utf8');
      updated += 1;
    }
    continue;
  }

  const url =
    typeof doc.behanceUrl === 'string' ? doc.behanceUrl.trim() : '';
  if (!url) continue;

  doc.links = [{ label: defaultBehanceLinkLabels, url }];
  delete doc.behanceUrl;
  writeFileSync(path, stringify(doc), 'utf8');
  updated += 1;
}

console.log(`Updated ${updated} project file(s) in content/projects/`);
