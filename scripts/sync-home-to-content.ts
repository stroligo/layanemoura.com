/**
 * Exporta data/home.ts → content/home.yml
 *
 *   npm run content:sync-home
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stringify } from 'yaml';
import { homeFallback } from '../data/home';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'content');
mkdirSync(outDir, { recursive: true });

writeFileSync(join(outDir, 'home.yml'), stringify(homeFallback), 'utf8');

console.log('Wrote content/home.yml');
