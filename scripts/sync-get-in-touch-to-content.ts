/**
 * Exporta data/getInTouch.ts → content/pages/get-in-touch.yml
 *
 *   npm run content:sync-contact
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stringify } from 'yaml';
import { getInTouchFallback } from '../data/getInTouch';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'content/pages');
mkdirSync(outDir, { recursive: true });

writeFileSync(
  join(outDir, 'get-in-touch.yml'),
  stringify(getInTouchFallback),
  'utf8',
);

console.log('Wrote content/pages/get-in-touch.yml');
