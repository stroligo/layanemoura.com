/**
 * category (tag antiga) → category: maps|more + tags: [...]
 * Remove tools.
 *
 *   node scripts/migrate-category-tags.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, stringify } from 'yaml';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const projectsDir = path.join(root, 'content/projects');
const dataFile = path.join(root, 'data/projects.ts');

const MAPS_TAGS = new Set(['fantasy-maps', 'travel']);
const MORE_TAGS = new Set([
  'book-covers',
  'editorial',
  'patterns',
  'commercial',
]);

function migrateEntry(data) {
  const { tools: _tools, category: rawCategory, tags: rawTags, ...rest } = data;

  if (rawCategory === 'maps' || rawCategory === 'more') {
    const allowed =
      rawCategory === 'maps' ? MAPS_TAGS : MORE_TAGS;
    const tags = (rawTags ?? []).filter((t) => allowed.has(t));
    return { ...rest, category: rawCategory, tags };
  }

  const legacyTag = rawCategory;
  if (MAPS_TAGS.has(legacyTag)) {
    return {
      ...rest,
      category: 'maps',
      tags: rawTags?.length ? rawTags : [legacyTag],
    };
  }
  if (MORE_TAGS.has(legacyTag)) {
    return {
      ...rest,
      category: 'more',
      tags: rawTags?.length ? rawTags : [legacyTag],
    };
  }

  return { ...rest, category: 'maps', tags: ['fantasy-maps'] };
}

let yamlCount = 0;
for (const file of fs.readdirSync(projectsDir).filter((f) => f.endsWith('.yml'))) {
  const filePath = path.join(projectsDir, file);
  const data = parse(fs.readFileSync(filePath, 'utf8'));
  fs.writeFileSync(filePath, stringify(migrateEntry(data)), 'utf8');
  yamlCount += 1;
}

let ts = fs.readFileSync(dataFile, 'utf8');
ts = ts.replace(/\n\s*tools:\s*\[[^\]]*\],?\n/g, '\n');
ts = ts.replace(
  /category: '(fantasy-maps|travel)'/g,
  "category: 'maps',\n    tags: ['$1']",
);
ts = ts.replace(
  /category: '(book-covers|editorial|patterns|commercial)'/g,
  "category: 'more',\n    tags: ['$1']",
);

fs.writeFileSync(dataFile, ts, 'utf8');
console.log(`Migrated ${yamlCount} YAML files and data/projects.ts`);
