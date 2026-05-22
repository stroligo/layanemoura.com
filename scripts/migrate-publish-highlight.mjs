/**
 * featured → highlight, garante published em todos os YAML.
 *   node scripts/migrate-publish-highlight.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, stringify } from 'yaml';

const projectsDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'content/projects',
);

for (const file of fs.readdirSync(projectsDir).filter((f) => f.endsWith('.yml'))) {
  const filePath = path.join(projectsDir, file);
  const data = parse(fs.readFileSync(filePath, 'utf8'));

  const published = data.published ?? true;
  const highlight = data.highlight ?? data.featured ?? false;
  delete data.featured;
  delete data.published;
  delete data.highlight;

  const ordered = {
    published,
    highlight,
    ...data,
  };

  fs.writeFileSync(filePath, stringify(ordered), 'utf8');
}

console.log('Migrated publish/highlight fields in content/projects/*.yml');
