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
