/**
 * Exporta data/social.ts → content/social/*.yml
 *
 *   npm run content:sync-social
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stringify } from 'yaml';
import { socialLinksFallback } from '../data/social';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'content/social');
mkdirSync(outDir, { recursive: true });

let count = 0;

for (let i = 0; i < socialLinksFallback.length; i++) {
  const link = socialLinksFallback[i]!;
  const data = {
    published: true,
    order: (i + 1) * 10,
    href: link.href,
    icon: link.icon,
  };

  writeFileSync(join(outDir, `${link.id}.yml`), stringify(data), 'utf8');
  count += 1;
}

console.log(`Wrote ${count} social files to content/social/`);
