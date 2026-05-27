/**
 * Converte masters `NN.jpg` → `NN.webp`, atualiza YAML e remove variantes JPEG legadas.
 *
 *   npm run projects:migrate-webp
 */
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const projectsRoot = join(root, 'public', 'images', 'projects');
const contentDir = join(root, 'content', 'projects');
const MASTER_JPG = /^\d+\.jpe?g$/i;
const LEGACY_VARIANT = /\.(thumb|lg)\.(jpe?g|webp)$/i;

async function convertMaster(jpgPath: string) {
  const webpPath = jpgPath.replace(/\.jpe?g$/i, '.webp');
  await sharp(jpgPath)
    .rotate()
    .webp({ quality: 92, effort: 6 })
    .toFile(webpPath);
  unlinkSync(jpgPath);
  return webpPath;
}

async function main() {
  let converted = 0;

  for (const slug of readdirSync(projectsRoot)) {
    const dir = join(projectsRoot, slug);
    if (!existsSync(dir) || !statSync(dir).isDirectory()) continue;

    for (const name of readdirSync(dir)) {
      if (LEGACY_VARIANT.test(name)) {
        unlinkSync(join(dir, name));
        console.log(`  removed ${slug}/${name}`);
      }
    }

    for (const name of readdirSync(dir)) {
      if (!MASTER_JPG.test(name)) continue;
      const full = join(dir, name);
      await convertMaster(full);
      converted += 1;
      console.log(`  ${slug}/${name} → ${name.replace(/\.jpe?g$/i, '.webp')}`);
    }
  }

  let ymlUpdated = 0;
  if (existsSync(contentDir)) {
    for (const file of readdirSync(contentDir)) {
      if (!/\.ya?ml$/i.test(file)) continue;
      const path = join(contentDir, file);
      const raw = readFileSync(path, 'utf8');
      if (!/\/images\/projects\/[^"\n]+\.jpe?g/i.test(raw)) continue;
      const next = raw.replace(
        /(\/images\/projects\/[^"\n]+?)\.jpe?g/gi,
        '$1.webp',
      );
      writeFileSync(path, next, 'utf8');
      ymlUpdated += 1;
    }
  }

  console.log(`\n${converted} master(s) → WebP, ${ymlUpdated} YAML atualizado(s).`);
  console.log('Corre: npm run images:optimize -- --force');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
