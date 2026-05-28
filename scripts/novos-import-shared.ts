/**
 * Importação partilhada: pasta NOVOS MAPAS/ ou NOVOS MORE/ → projeto no site.
 */
import { execSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml, stringify } from 'yaml';
import sharp from 'sharp';
import type { GalleryGroup } from '../data/site';
import { buildDescription, inferLayout, inferTags } from './mapas-metadata';
import { parseMapasFilename, projectImageSrc, projectSlugFromParts } from './mapas-utils';

const root = fileURLToPath(new URL('..', import.meta.url));
const projectsRoot = join(root, 'public', 'images', 'projects');
const contentDir = join(root, 'content', 'projects');

const WEBP_QUALITY = 92;
const MAX_SOURCE_SIDE = 6000;

export type NovosImportOptions = {
  sourceFolder: string;
  category: GalleryGroup;
  dryRun?: boolean;
};

type SourceFile = {
  filename: string;
  fullPath: string;
  title: string;
  subtitle: string;
  imageIndex: number;
  slug: string;
};

type ImportProject = {
  slug: string;
  title: string;
  subtitle: string;
  files: SourceFile[];
};

async function importMaster(source: string, dest: string) {
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

function scanSourceFiles(sourceDir: string, sourceFolder: string): SourceFile[] {
  if (!existsSync(sourceDir)) {
    console.error(`Pasta em falta: ${sourceDir}`);
    console.error(`Crie "${sourceFolder}" e coloque lá os ficheiros JPG, PNG ou GIF.`);
    process.exit(1);
  }

  const entries = readdirSync(sourceDir)
    .map((name) => join(sourceDir, name))
    .filter((path) => statSync(path).isFile())
    .sort((a, b) => a.localeCompare(b, 'en'));

  const files: SourceFile[] = [];
  const skipped: string[] = [];

  for (const fullPath of entries) {
    const filename = basename(fullPath);
    const parsed = parseMapasFilename(filename);
    if (!parsed) {
      skipped.push(filename);
      continue;
    }

    const slug = projectSlugFromParts(parsed.title, parsed.subtitle);
    files.push({
      filename,
      fullPath,
      title: parsed.title,
      subtitle: parsed.subtitle,
      imageIndex: parsed.imageIndex,
      slug,
    });
  }

  if (skipped.length) {
    console.log(`Ignorados (${skipped.length}): ${skipped.join(', ')}`);
  }

  if (!files.length) {
    console.log(`Nenhum JPG/PNG/GIF em ${sourceFolder}/.`);
    process.exit(0);
  }

  return files;
}

function groupProjects(files: SourceFile[]): ImportProject[] {
  const bySlug = new Map<string, ImportProject>();

  for (const file of files) {
    let project = bySlug.get(file.slug);
    if (!project) {
      project = {
        slug: file.slug,
        title: file.title,
        subtitle: file.subtitle,
        files: [],
      };
      bySlug.set(file.slug, project);
    }
    project.files.push(file);
  }

  return [...bySlug.values()].map((p) => ({
    ...p,
    files: [...p.files].sort((a, b) => a.imageIndex - b.imageIndex),
  }));
}

async function coverLayout(slug: string): Promise<'wide' | 'tall' | 'normal'> {
  const cover = join(projectsRoot, slug, '01.webp');
  if (!existsSync(cover)) return 'normal';
  const meta = await sharp(cover).metadata();
  return inferLayout(meta.width ?? 0, meta.height ?? 0);
}

export async function runNovosImport(options: NovosImportOptions) {
  const { sourceFolder, category, dryRun = false } = options;
  const sourceDir = join(root, sourceFolder);
  const categoryLabel = category === 'maps' ? 'Maps' : 'More';

  const sourceFiles = scanSourceFiles(sourceDir, sourceFolder);
  const projects = groupProjects(sourceFiles);

  console.log(
    dryRun
      ? `[dry-run] ${sourceFolder} → categoria ${categoryLabel}\n`
      : `${sourceFolder} → categoria ${categoryLabel}\n`,
  );
  console.log(
    dryRun
      ? `[dry-run] ${sourceFiles.length} ficheiro(s) → ${projects.length} projeto(s)\n`
      : `${sourceFiles.length} ficheiro(s) → ${projects.length} projeto(s)\n`,
  );

  async function writeProjectYml(project: ImportProject) {
    const ymlPath = join(contentDir, `${project.slug}.yml`);
    const images = project.files.map((f) => ({
      src: projectImageSrc(project.slug, f.imageIndex),
    }));
    const layout = dryRun ? 'normal' : await coverLayout(project.slug);

    let data: Record<string, unknown>;

    if (existsSync(ymlPath)) {
      data = parseYaml(readFileSync(ymlPath, 'utf8')) as Record<string, unknown>;
      const existingImages = Array.isArray(data.images) ? [...data.images] : [];
      const bySrc = new Map(
        existingImages
          .filter((img): img is { src: string } =>
            Boolean(img && typeof img === 'object' && 'src' in img),
          )
          .map((img) => [img.src, img]),
      );
      for (const img of images) {
        bySrc.set(img.src, img);
      }
      data.images = [...bySrc.values()].sort((a, b) =>
        String(a.src).localeCompare(String(b.src)),
      );
      if (!dryRun) {
        data.layout = layout;
        data.category = category;
      }
      console.log(`  YAML atualizado: ${basename(ymlPath)}`);
    } else {
      const tags = inferTags(project.slug, project.title, project.subtitle);
      data = {
        title: project.title,
        category,
        tags,
        published: true,
        layout,
        images,
        description: buildDescription(project.title, project.subtitle, tags),
      };
      if (project.subtitle.trim()) {
        data.subtitle = project.subtitle.trim();
      }
      console.log(`  YAML criado: ${basename(ymlPath)}`);
    }

    if (!dryRun) {
      mkdirSync(contentDir, { recursive: true });
      writeFileSync(ymlPath, stringify(data), 'utf8');
    }
  }

  for (const project of projects) {
    console.log(`▸ ${project.slug} (${project.files.length} imagem(ns))`);
    const dir = join(projectsRoot, project.slug);

    if (!dryRun) {
      mkdirSync(dir, { recursive: true });
    }

    for (const file of project.files) {
      const pad = String(file.imageIndex).padStart(2, '0');
      const dest = join(dir, `${pad}.webp`);

      if (dryRun) {
        console.log(`  would import ${file.filename} → ${project.slug}/${pad}.webp`);
        continue;
      }

      await importMaster(file.fullPath, dest);
      console.log(`  ${pad}.webp ← ${file.filename}`);
    }

    await writeProjectYml(project);
  }

  const slugs = projects.map((p) => p.slug).join(',');

  if (!dryRun) {
    console.log('\nVariantes thumb + display…');
    execSync(`tsx scripts/optimize-images.ts --only=${slugs}`, {
      cwd: root,
      stdio: 'inherit',
    });

    console.log(`\nA remover originais em ${sourceFolder}/…`);
    for (const file of sourceFiles) {
      unlinkSync(file.fullPath);
      console.log(`  apagado ${file.filename}`);
    }
  } else {
    console.log(`\n[dry-run] Correria: tsx scripts/optimize-images.ts --only=${slugs}`);
    console.log(`[dry-run] Apagaria os ficheiros em ${sourceFolder}/ após sucesso.`);
  }

  console.log(dryRun ? '\nDry-run concluído.' : '\nImportação concluída.');
}
