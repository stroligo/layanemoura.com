/**
 * Pipeline de imagens de projeto (build + `npm run images:optimize`).
 *
 * Por imagem `NN.jpg` / `NN.png` / `NN.webp`:
 *   1. Converte JPG/PNG → `NN.webp` (master, preserva transparência)
 *   2. Gera `NN.thumb.webp` (~800px) — grelha + miniaturas do modal
 *   3. Gera `NN.display.webp` (~2000px) — imagem grande do slider
 *
 * Lightbox usa só o master `NN.webp`.
 */
import { existsSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { generateOgShareImage } from './generate-og-share';

const root = fileURLToPath(new URL('..', import.meta.url));
const imagesRoot = join(root, 'public', 'images', 'projects');

const THUMB_MAX = 800;
const DISPLAY_MAX = 2000;
const MASTER_QUALITY = 92;
const THUMB_QUALITY = 88;
const DISPLAY_QUALITY = 90;

const STEM_FILE = /^(\d+)\.(jpe?g|png|webp)$/i;
const VARIANT_FILE = /\.(thumb|display|lg)\.webp$/i;
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const force = args.includes('--force');

type VariantKey = 'thumb' | 'display';

const VARIANTS: Record<VariantKey, { max: number; quality: number }> = {
  thumb: { max: THUMB_MAX, quality: THUMB_QUALITY },
  display: { max: DISPLAY_MAX, quality: DISPLAY_QUALITY },
};

function projectDirs(): string[] {
  if (!existsSync(imagesRoot)) return [];
  return readdirSync(imagesRoot)
    .map((name) => join(imagesRoot, name))
    .filter((path) => statSync(path).isDirectory());
}

function listStems(dir: string): string[] {
  const stems = new Set<string>();
  for (const name of readdirSync(dir)) {
    if (VARIANT_FILE.test(name)) continue;
    const match = name.match(STEM_FILE);
    if (match?.[1]) stems.add(match[1]);
  }
  return [...stems].sort((a, b) => Number(a) - Number(b));
}

function uploadPath(dir: string, stem: string): string | null {
  for (const ext of ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG']) {
    const path = join(dir, `${stem}.${ext}`);
    if (existsSync(path)) return path;
  }
  return null;
}

function masterPath(dir: string, stem: string) {
  return join(dir, `${stem}.webp`);
}

function variantPath(dir: string, stem: string, key: VariantKey) {
  return join(dir, `${stem}.${key}.webp`);
}

function removeLegacyVariants(dir: string) {
  for (const name of readdirSync(dir)) {
    if (!VARIANT_FILE.test(name)) continue;
    const full = join(dir, name);
    if (!dryRun) unlinkSync(full);
    console.log(`  removed ${relative(root, full)}`);
  }
}

async function ensureMasterWebp(dir: string, stem: string): Promise<string> {
  const dest = masterPath(dir, stem);
  const upload = uploadPath(dir, stem);

  if (upload) {
    if (!dryRun) {
      let pipeline = sharp(upload).rotate();
      const meta = await pipeline.metadata();
      const w = meta.width ?? 0;
      const h = meta.height ?? 0;
      if (w > MAX_SOURCE_SIDE || h > MAX_SOURCE_SIDE) {
        pipeline = pipeline.resize(MAX_SOURCE_SIDE, MAX_SOURCE_SIDE, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }
      await pipeline.webp({ quality: MASTER_QUALITY, effort: 6 }).toFile(dest);
      unlinkSync(upload);
    }
    console.log(
      `  ${dryRun ? 'would convert' : 'converted'} ${relative(root, upload)} → ${relative(root, dest)}`,
    );
    return dest;
  }

  if (existsSync(dest)) return dest;

  throw new Error(`Sem master para ${relative(imagesRoot, dir)}/${stem}`);
}

const MAX_SOURCE_SIDE = 6000;

async function writeVariant(
  master: string,
  dest: string,
  key: VariantKey,
): Promise<string> {
  const cfg = VARIANTS[key];
  const meta = await sharp(master).metadata();

  const pipeline = sharp(master).rotate().resize(cfg.max, cfg.max, {
    fit: 'inside',
    withoutEnlargement: true,
  });

  if (dryRun) {
    return `  would write ${relative(root, dest)} (${key}, max ${cfg.max}px)`;
  }

  await pipeline
    .webp({ quality: cfg.quality, effort: 6, smartSubsample: true })
    .toFile(dest);

  const kb = (statSync(dest).size / 1024).toFixed(1);
  return `  ✓ ${relative(root, dest)} — ${kb} KB (${key}, q${cfg.quality}, ${meta.width}×${meta.height})`;
}

function needsVariants(master: string, dir: string, stem: string): boolean {
  if (force) return true;
  const masterMtime = statSync(master).mtimeMs;
  for (const key of Object.keys(VARIANTS) as VariantKey[]) {
    const dest = variantPath(dir, stem, key);
    if (!existsSync(dest)) return true;
    if (statSync(dest).mtimeMs < masterMtime) return true;
  }
  return false;
}

async function processStem(dir: string, stem: string) {
  const results: string[] = [];

  const master = await ensureMasterWebp(dir, stem);
  if (!dryRun && !needsVariants(master, dir, stem)) {
    return { skipped: true, lines: [] };
  }

  const meta = await sharp(master).metadata();
  results.push(
    `  master ${relative(root, master)} (${meta.width}×${meta.height})`,
  );

  for (const key of Object.keys(VARIANTS) as VariantKey[]) {
    const dest = variantPath(dir, stem, key);
    results.push(await writeVariant(master, dest, key));
  }

  return { skipped: false, lines: results };
}

async function main() {
  if (!dryRun) {
    await generateOgShareImage();
  }

  if (!existsSync(imagesRoot)) {
    console.error('Missing public/images/projects');
    process.exit(1);
  }

  const dirs = projectDirs();
  let processed = 0;
  let skipped = 0;
  let stemsTotal = 0;

  console.log(
    dryRun
      ? `[dry-run] ${dirs.length} projeto(s)\n`
      : `Otimizando imagens em ${dirs.length} projeto(s)…\n`,
  );

  for (const dir of dirs) {
    const stems = listStems(dir);
    if (!stems.length) continue;

    console.log(relative(imagesRoot, dir));
    removeLegacyVariants(dir);

    for (const stem of stems) {
      stemsTotal += 1;
      try {
        const { skipped: skip, lines } = await processStem(dir, stem);
        if (skip) {
          skipped += 1;
          console.log(`  ${stem}.webp — variantes OK`);
        } else {
          processed += 1;
          console.log(`  ${stem}`);
          for (const line of lines) console.log(line);
        }
      } catch (err) {
        console.error(`  ${stem}: ${(err as Error).message}`);
      }
    }
    console.log('');
  }

  if (!dryRun) {
    console.log(
      `Imagens: ${processed} processada(s), ${skipped} só master/variantes atuais (${stemsTotal} ficheiros).`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
