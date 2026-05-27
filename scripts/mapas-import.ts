/**
 * Fase 2 — MAPAS/ → public/images/projects/{slug}/01.webp …
 *
 *   npm run mapas:import
 */
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { loadManifest } from './mapas-utils';

const root = fileURLToPath(new URL('..', import.meta.url));
const projectsRoot = join(root, 'public', 'images', 'projects');

const WEBP_QUALITY = 92;
const MAX_SOURCE_SIDE = 6000;

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
  let copied = 0;

  if (existsSync(projectsRoot)) {
    for (const entry of manifest.projects) {
      const dir = join(projectsRoot, entry.slug);
      if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
    }
  }

  mkdirSync(projectsRoot, { recursive: true });

  for (const project of manifest.projects) {
    const dir = join(projectsRoot, project.slug);
    mkdirSync(dir, { recursive: true });

    for (const file of project.files) {
      const pad = String(file.imageIndex).padStart(2, '0');
      const dest = join(dir, `${pad}.webp`);
      const source = join(root, file.sourcePath);

      if (!existsSync(source)) {
        console.error(`Ficheiro em falta: ${file.sourcePath}`);
        process.exit(1);
      }

      await importOne(source, dest);
      copied += 1;
      console.log(`  ${project.slug}/${pad}.webp ← ${file.sourcePath}`);
    }
  }

  console.log(`\nImportadas ${copied} imagens em ${manifest.projectCount} projetos.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
