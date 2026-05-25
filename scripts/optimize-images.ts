/**
 * Gera variantes WebP + JPEG para imagens em public/images.
 *
 *   npm run images:optimize
 *   npm run images:optimize -- --dry-run
 *   npm run images:optimize -- --force
 *
 * Corre automaticamente em `npm run build` (só ficheiros novos ou alterados).
 *
 * Por ficheiro fonte (ex. hollow-crown-realms.jpg):
 *   *.thumb.* — grelha (~800px, alta qualidade, retina)
 *   *.lg.*    — fallback legado (~2400px máx., alta qualidade)
 *
 * Modal e lightbox usam o JPG original (máxima qualidade).
 * Originais não são apagados.
 */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { generateOgShareImage } from './generate-og-share';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const imagesRoot = join(root, 'public', 'images');

/** Grelha: ~2× para ecrãs retina (célula ~280–480px). */
const THUMB_MAX = 800;
/** Só reduz se o original for enorme; modal usa o ficheiro fonte. */
const LG_MAX = 2400;

const RASTER = /\.(jpe?g|png)$/i;
const SKIP = /\.(thumb|lg)\.(jpe?g|webp|avif)$/i;

type VariantKey = 'thumb' | 'lg';

const VARIANTS: Record<
  VariantKey,
  { max: number; webpQ: number; jpegQ: number; softMaxKb?: number }
> = {
  thumb: { max: THUMB_MAX, webpQ: 88, jpegQ: 90, softMaxKb: 180 },
  lg: { max: LG_MAX, webpQ: 90, jpegQ: 92, softMaxKb: 650 },
};

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const force = args.includes('--force');

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...walk(full));
      continue;
    }
    if (!RASTER.test(name) || SKIP.test(name)) continue;
    out.push(full);
  }
  return out;
}

function outPath(source: string, variant: VariantKey, format: 'webp' | 'jpeg') {
  const base = source.replace(/\.(jpe?g|png)$/i, '');
  const ext = format === 'webp' ? 'webp' : 'jpg';
  return `${base}.${variant}.${ext}`;
}

/** Só reprocessa se o original for mais recente que todas as variantes. */
function needsProcessing(source: string): boolean {
  const sourceMtime = statSync(source).mtimeMs;
  for (const key of Object.keys(VARIANTS) as VariantKey[]) {
    for (const format of ['webp', 'jpeg'] as const) {
      const dest = outPath(source, key, format);
      if (!existsSync(dest)) return true;
      if (statSync(dest).mtimeMs < sourceMtime) return true;
    }
  }
  return false;
}

async function encodeHighQuality(
  pipeline: sharp.Sharp,
  dest: string,
  format: 'webp' | 'jpeg',
  quality: number,
): Promise<number> {
  const clone = pipeline.clone();
  if (format === 'webp') {
    await clone
      .webp({ quality, effort: 6, smartSubsample: true })
      .toFile(dest);
  } else {
    await clone
      .jpeg({ quality, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toFile(dest);
  }
  return statSync(dest).size;
}

async function processOne(source: string) {
  const rel = relative(imagesRoot, source);
  const meta = await sharp(source).metadata();
  const results: string[] = [];

  for (const [key, cfg] of Object.entries(VARIANTS) as [VariantKey, (typeof VARIANTS)[VariantKey]][]) {
    const resized = sharp(source)
      .rotate()
      .resize(cfg.max, cfg.max, { fit: 'inside', withoutEnlargement: true });

    for (const format of ['webp', 'jpeg'] as const) {
      const dest = outPath(source, key, format);
      const startQ = format === 'webp' ? cfg.webpQ : cfg.jpegQ;

      if (dryRun) {
        results.push(`  would write ${relative(root, dest)} (${key}, ${format})`);
        continue;
      }

      const quality = startQ;
      const bytes = await encodeHighQuality(resized, dest, format, quality);
      const kb = (bytes / 1024).toFixed(1);
      const overBudget =
        cfg.softMaxKb && bytes > cfg.softMaxKb * 1024 ? ' (acima do alvo)' : '';
      const mark =
        cfg.softMaxKb && bytes > cfg.softMaxKb * 1024 ? '⚠' : '✓';
      results.push(
        `  ${mark} ${relative(root, dest)} — ${kb} KB (q${quality}, ${meta.width}×${meta.height} → max ${cfg.max}px)${overBudget}`,
      );
    }
  }

  return { rel, results };
}

async function main() {
  if (!dryRun) {
    await generateOgShareImage();
  }

  if (!existsSync(imagesRoot)) {
    console.error('Missing public/images');
    process.exit(1);
  }

  const sources = walk(imagesRoot).sort();
  if (!sources.length) {
    console.log('No images found.');
    return;
  }

  console.log(
    dryRun
      ? `[dry-run] ${sources.length} source image(s)\n`
      : `Optimizing ${sources.length} source image(s)…\n`,
  );

  let processed = 0;
  let skipped = 0;
  let totalOut = 0;

  for (const source of sources) {
    const rel = relative(imagesRoot, source);

    if (!dryRun && !force && !needsProcessing(source)) {
      skipped += 1;
      continue;
    }

    const { results } = await processOne(source);
    processed += 1;
    console.log(rel);
    for (const line of results) console.log(line);
    totalOut += results.length;
    console.log('');
  }

  if (!dryRun) {
    const parts = [`${processed} processada(s)`];
    if (skipped) parts.push(`${skipped} já atualizada(s)`);
    console.log(`Imagens: ${parts.join(', ')} (${totalOut} ficheiros gerados).`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
