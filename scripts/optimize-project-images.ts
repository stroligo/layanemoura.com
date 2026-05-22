/**
 * Reduz capas em public/images/projects (máx. 1200px, JPEG otimizado).
 * Mantém caminhos .jpg/.png usados no content — o site serve WebP via @nuxt/image/IPX.
 */
import { readdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const ROOT = join(process.cwd(), 'public/images/projects');
const MAX_WIDTH = 1200;
const JPEG_QUALITY = 82;
const WEBP_QUALITY = 82;

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (IMAGE_EXT.has(extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

async function optimize(file: string) {
  const ext = extname(file).toLowerCase();
  const before = (await readFile(file)).length;
  const input = sharp(file, { failOn: 'none' }).rotate();
  const meta = await input.metadata();

  let pipeline = input.resize({
    width: MAX_WIDTH,
    withoutEnlargement: true,
    fit: 'inside',
  });

  let buffer: Buffer;
  let outExt = ext;

  if (ext === '.png' && meta.hasAlpha) {
    buffer = await pipeline
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer();
  } else if (ext === '.png') {
    buffer = await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
    outExt = '.jpg';
  } else if (ext === '.webp') {
    buffer = await pipeline.webp({ quality: WEBP_QUALITY }).toBuffer();
  } else {
    buffer = await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
    outExt = '.jpg';
  }

  const target =
    outExt !== ext ? file.replace(/\.[^.]+$/, outExt) : file;
  const tmp = `${target}.opt.tmp`;

  await writeFile(tmp, buffer);
  await unlink(file);
  await rename(tmp, target);

  const after = buffer.length;
  const pct = before > 0 ? Math.round((1 - after / before) * 100) : 0;
  const renamed = target !== file ? ` → ${outExt}` : '';
  console.log(
    `${target.replace(process.cwd() + '/', '')}: ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB (−${pct}%)${renamed}`,
  );

  return {
    before,
    after,
    renamedFrom: target !== file ? file : null,
    renamedTo: target !== file ? target : null,
  };
}

async function main() {
  const files = await walk(ROOT);
  if (!files.length) {
    console.log('Nenhuma imagem em public/images/projects');
    return;
  }

  let totalBefore = 0;
  let totalAfter = 0;
  const renames: { from: string; to: string }[] = [];

  console.log(`A otimizar ${files.length} ficheiros (máx. ${MAX_WIDTH}px)…\n`);

  for (const file of files.sort()) {
    const result = await optimize(file);
    totalBefore += result.before;
    totalAfter += result.after;
    if (result.renamedFrom && result.renamedTo) {
      renames.push({
        from: result.renamedFrom.replace(process.cwd() + '/', ''),
        to: result.renamedTo.replace(process.cwd() + '/', ''),
      });
    }
  }

  console.log(
    `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)} MB → ${(totalAfter / 1024 / 1024).toFixed(1)} MB`,
  );

  if (renames.length) {
    console.log(
      '\n⚠ PNG sem transparência convertidos para .jpg — atualize src nos YAML se necessário:',
    );
    for (const r of renames) console.log(`  ${r.from} → ${r.to}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
