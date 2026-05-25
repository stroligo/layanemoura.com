/**
 * Gera /public/images/og-share.jpg (1200×630) — logo centrada para Open Graph / WhatsApp / etc.
 * Chamado por `npm run images:optimize` e no build.
 */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const logoPath = join(root, 'assets/images/logo.png');
const outPath = join(root, 'public/images/og-share.jpg');

const OG_W = 1200;
const OG_H = 630;
const BG = '#F7F4EF';
const LOGO_MAX_W = 920;

export async function generateOgShareImage() {
  if (!existsSync(logoPath)) {
    console.warn('[og-share] Logo não encontrado:', logoPath);
    return;
  }

  const logoBuf = await sharp(logoPath)
    .resize({ width: LOGO_MAX_W, withoutEnlargement: true })
    .png()
    .toBuffer();

  const meta = await sharp(logoBuf).metadata();
  const w = meta.width ?? LOGO_MAX_W;
  const h = meta.height ?? 200;
  const left = Math.max(0, Math.round((OG_W - w) / 2));
  const top = Math.max(0, Math.round((OG_H - h) / 2));

  await sharp({
    create: { width: OG_W, height: OG_H, channels: 3, background: BG },
  })
    .composite([{ input: logoBuf, left, top }])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(outPath);

  console.log(`✓ OG share: ${outPath} (${OG_W}×${OG_H})`);
}

const isDirectRun =
  process.argv[1]?.endsWith('generate-og-share.ts')
  || process.argv[1]?.endsWith('generate-og-share.mts');

if (isDirectRun) {
  generateOgShareImage().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
