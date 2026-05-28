import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

export type ManifestFile = {
  slug: string;
  title: string;
  subtitle: string;
  imageIndex: number;
  sourcePath: string;
};

export type ManifestProject = {
  slug: string;
  title: string;
  subtitle: string;
  imageCount: number;
  files: ManifestFile[];
};

export type MapasManifest = {
  generatedAt: string;
  sourceDir: string;
  fileCount: number;
  projectCount: number;
  skipped: { filename: string; reason: string }[];
  warnings: string[];
  files: ManifestFile[];
  projects: ManifestProject[];
};

/** JPG, PNG e GIF aceites em MAPAS/, NOVOS MAPAS/ e NOVOS MORE/. */
export const MAPAS_RASTER = /\.(jpe?g|png|gif)$/i;
const MAPAS_SKIP = /\.psd$/i;

/** Nome de ficheiro em MAPAS/ ou NOVOS MAPAS/ → título, subtítulo, índice da imagem. */
export function parseMapasFilename(filename: string): {
  title: string;
  subtitle: string;
  imageIndex: number;
} | null {
  if (MAPAS_SKIP.test(filename)) return null;
  if (!MAPAS_RASTER.test(filename)) return null;

  const stem = filename.replace(/\.(jpe?g|png|gif)$/i, '');
  const numMatch = stem.match(/\s+(\d+)$/);
  const imageIndex = numMatch ? Number.parseInt(numMatch[1], 10) : 1;
  const base = numMatch ? stem.slice(0, numMatch.index).trim() : stem.trim();

  const dash = base.indexOf(' - ');
  if (dash >= 0) {
    return {
      title: base.slice(0, dash).trim(),
      subtitle: base.slice(dash + 3).trim(),
      imageIndex,
    };
  }

  return { title: base, subtitle: '', imageIndex };
}

export function slugify(text: string): string {
  const prepared = text
    .replace(/\bB\s*&\s*W\b/gi, 'BW')
    .replace(/\bB\/W\b/gi, 'BW');

  return prepared
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

export function projectSlugFromParts(title: string, subtitle: string): string {
  const a = slugify(title);
  const b = subtitle ? slugify(subtitle) : '';
  return b ? `${a}-${b}` : a;
}

export function loadManifest(path = join(root, 'scripts', 'mapas-manifest.json')): MapasManifest {
  return JSON.parse(readFileSync(path, 'utf8')) as MapasManifest;
}

export function projectImageSrc(slug: string, index: number) {
  const pad = String(index).padStart(2, '0');
  return `/images/projects/${slug}/${pad}.webp`;
}
