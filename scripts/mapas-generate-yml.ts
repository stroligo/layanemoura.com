/**
 * Fase 4 — content/projects/{slug}.yml a partir do manifesto + imagens importadas
 *
 *   npm run mapas:generate-yml
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stringify } from 'yaml';
import sharp from 'sharp';
import { buildDescription, inferLayout, inferTags } from './mapas-metadata';
import { loadManifest, projectImageSrc } from './mapas-utils';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = join(root, 'content', 'projects');
const projectsRoot = join(root, 'public', 'images', 'projects');

async function coverLayout(slug: string): Promise<'wide' | 'tall' | 'normal'> {
  const cover = join(projectsRoot, slug, '01.jpg');
  if (!existsSync(cover)) return 'normal';
  const meta = await sharp(cover).metadata();
  return inferLayout(meta.width ?? 0, meta.height ?? 0);
}

async function main() {
  const manifest = loadManifest();
  mkdirSync(outDir, { recursive: true });

  let count = 0;

  for (const project of manifest.projects) {
    const tags = inferTags(project.slug, project.title, project.subtitle);
    const description = buildDescription(project.title, project.subtitle, tags);
    const layout = await coverLayout(project.slug);

    const images = project.files.map((f) => ({
      src: projectImageSrc(project.slug, f.imageIndex),
    }));

    const data: Record<string, unknown> = {
      title: project.title,
      category: 'maps',
      tags,
      published: true,
      highlight: false,
      layout,
      images,
      description,
    };

    if (project.subtitle.trim()) {
      data.subtitle = project.subtitle.trim();
    }

    writeFileSync(join(outDir, `${project.slug}.yml`), stringify(data), 'utf8');
    count += 1;
  }

  console.log(`Gerados ${count} ficheiros em content/projects/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
