/**
 * Reconverte só entradas cujo ficheiro em MAPAS/ é PNG (fundo branco no JPEG).
 *
 *   npm run mapas:reimport-png
 *   npm run mapas:reimport-png -- --optimize   # também regenera thumb/lg
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import sharp from 'sharp';
import { loadManifest } from './mapas-utils';

const root = fileURLToPath(new URL('..', import.meta.url));
const projectsRoot = join(root, 'public', 'images', 'projects');
const WEBP_QUALITY = 92;
const MAX_SOURCE_SIDE = 6000;
const runOptimize = process.argv.includes('--optimize');

async function importOne(source: string, dest: string) {
  let pipeline = sharp(source).rotate();
  const meta = await pipeline.metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;

  if (w > MAX_SOURCE_SIDE || h > MAX_SOURCE_SIDE) {
    pipeline = pipeline.resize(MAX_SOURCE_SIDE, MAX_SOURCE_SIDE, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  await pipeline.webp({ quality: WEBP_QUALITY, effort: 6 }).toFile(dest);
}

async function main() {
  const manifest = loadManifest();
  const pngFiles = manifest.files.filter((f) => /\.png$/i.test(f.sourcePath));
  let count = 0;

  for (const file of pngFiles) {
    const source = join(root, file.sourcePath);
    const dest = join(
      projectsRoot,
      file.slug,
      `${String(file.imageIndex).padStart(2, '0')}.webp`,
    );

    if (!existsSync(source)) {
      console.warn(`Ignorado (em falta): ${file.sourcePath}`);
      continue;
    }

    await importOne(source, dest);
    count += 1;
    console.log(`  ${file.slug}/${String(file.imageIndex).padStart(2, '0')}.webp`);
  }

  console.log(`\nReimportados ${count} WebP a partir de PNG.`);

  if (runOptimize && count > 0) {
    console.log('A regenerar variantes (force)…');
    execSync('npm run images:optimize -- --force', {
      cwd: root,
      stdio: 'inherit',
    });
  } else if (count > 0) {
    console.log('Corre: npm run images:optimize -- --force');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
