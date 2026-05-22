/**
 * Preenche description.en / description.pt nos YAML a partir de i18n/locales/*.json
 * (quando existir projects.{slug}.description).
 *
 *   node scripts/migrate-descriptions-to-content.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, stringify } from 'yaml';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const projectsDir = path.join(root, 'content/projects');
const en = JSON.parse(
  fs.readFileSync(path.join(root, 'i18n/locales/en.json'), 'utf8'),
);
const pt = JSON.parse(
  fs.readFileSync(path.join(root, 'i18n/locales/pt.json'), 'utf8'),
);

let updated = 0;

for (const file of fs.readdirSync(projectsDir).filter((f) => f.endsWith('.yml'))) {
  const slug = file.replace(/\.ya?ml$/i, '');
  const filePath = path.join(projectsDir, file);
  const data = parse(fs.readFileSync(filePath, 'utf8'));

  const enText = en.projects?.[slug]?.description ?? '';
  const ptText = pt.projects?.[slug]?.description ?? '';
  const current = data.description ?? { en: '', pt: '' };

  const next = {
    en: current.en?.trim() || enText,
    pt: current.pt?.trim() || ptText,
  };

  if (!next.en && !next.pt) {
    data.description = { en: '', pt: '' };
  } else {
    data.description = next;
  }

  fs.writeFileSync(filePath, stringify(data), 'utf8');
  if (next.en || next.pt) updated += 1;
}

console.log(`Updated ${fs.readdirSync(projectsDir).length} files (${updated} with i18n copy).`);
