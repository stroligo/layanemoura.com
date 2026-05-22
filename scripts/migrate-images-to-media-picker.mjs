/**
 * images: ["/path.jpg"] → images: [{ src: "/path.jpg" }]
 *
 *   node scripts/migrate-images-to-media-picker.mjs
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

let count = 0;

for (const file of fs.readdirSync(projectsDir).filter((f) => f.endsWith('.yml'))) {
  const filePath = path.join(projectsDir, file);
  const data = parse(fs.readFileSync(filePath, 'utf8'));

  if (!Array.isArray(data.images) || !data.images.length) continue;

  const needsMigrate = data.images.some(
    (item) => typeof item === 'string' || !item?.src,
  );
  if (!needsMigrate) continue;

  data.images = data.images.map((item) =>
    typeof item === 'string' ? { src: item } : { src: item.src },
  );

  fs.writeFileSync(filePath, stringify(data), 'utf8');
  count += 1;
}

console.log(`Migrated images to media-picker format in ${count} files.`);
