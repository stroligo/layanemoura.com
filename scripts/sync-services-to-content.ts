/**
 * Exporta data/services.ts → content/services/*.yml
 *
 *   npm run content:sync-services
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stringify } from 'yaml';
import { servicesFallback } from '../data/services';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'content/services');
mkdirSync(outDir, { recursive: true });

for (const service of servicesFallback) {
  const data = {
    published: service.published ?? true,
    order: service.order ?? 0,
    icon: service.icon,
    title: service.title,
    description: service.description,
  };

  writeFileSync(join(outDir, `${service.slug}.yml`), stringify(data), 'utf8');
}

console.log(`Wrote ${servicesFallback.length} service files to content/services/`);
