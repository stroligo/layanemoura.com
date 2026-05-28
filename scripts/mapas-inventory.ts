/**
 * Fase 0 — inventário de MAPAS/ → scripts/mapas-manifest.json
 *
 *   npm run mapas:inventory
 *
 * Regras:
 * - Nome com ` - ` → título | subtítulo (primeira ocorrência)
 * - Número final ` 3` → imageIndex (1-based)
 * - slug = slugify(título) + (subtítulo ? '-' + slugify(subtítulo) : '')
 */
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseMapasFilename, projectSlugFromParts } from './mapas-utils';

const root = fileURLToPath(new URL('..', import.meta.url));
const mapasDir = join(root, 'MAPAS');
const outPath = join(root, 'scripts', 'mapas-manifest.json');

type ManifestFile = {
  slug: string;
  title: string;
  subtitle: string;
  imageIndex: number;
  sourcePath: string;
};

type ManifestProject = {
  slug: string;
  title: string;
  subtitle: string;
  imageCount: number;
  files: ManifestFile[];
};

function main() {
  const entries = readdirSync(mapasDir)
    .filter((name) => {
      const full = join(mapasDir, name);
      return statSync(full).isFile();
    })
    .sort((a, b) => a.localeCompare(b, 'en'));

  const skipped: { filename: string; reason: string }[] = [];
  const files: ManifestFile[] = [];

  for (const filename of entries) {
    const parsed = parseMapasFilename(filename);
    if (!parsed) {
      skipped.push({
        filename,
        reason: /\.psd$/i.test(filename) ? 'psd' : 'unsupported',
      });
      continue;
    }

    const slug = projectSlugFromParts(parsed.title, parsed.subtitle);
    files.push({
      slug,
      title: parsed.title,
      subtitle: parsed.subtitle,
      imageIndex: parsed.imageIndex,
      sourcePath: `MAPAS/${filename}`,
    });
  }

  const bySlug = new Map<string, ManifestProject>();

  for (const file of files) {
    let project = bySlug.get(file.slug);
    if (!project) {
      project = {
        slug: file.slug,
        title: file.title,
        subtitle: file.subtitle,
        imageCount: 0,
        files: [],
      };
      bySlug.set(file.slug, project);
    }
    project.files.push(file);
    project.imageCount += 1;
  }

  const projects = [...bySlug.values()]
    .map((p) => ({
      ...p,
      files: [...p.files].sort((a, b) => a.imageIndex - b.imageIndex),
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const warnings: string[] = [];
  for (const project of projects) {
    const indices = project.files.map((f) => f.imageIndex);
    const expected = Array.from({ length: project.imageCount }, (_, i) => i + 1);
    const missing = expected.filter((n) => !indices.includes(n));
    const dupes = indices.filter((n, i) => indices.indexOf(n) !== i);
    if (missing.length) {
      warnings.push(
        `${project.slug}: índices em falta [${missing.join(', ')}] (tem: ${indices.join(', ')})`,
      );
    }
    if (dupes.length) {
      warnings.push(`${project.slug}: índices duplicados`);
    }
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    sourceDir: 'MAPAS',
    fileCount: files.length,
    projectCount: projects.length,
    skipped,
    warnings,
    files,
    projects,
  };

  writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  console.log(`Manifesto: ${outPath}`);
  console.log(`  ${files.length} ficheiros → ${projects.length} projetos`);
  if (skipped.length) {
    console.log(`  Ignorados: ${skipped.map((s) => s.filename).join(', ')}`);
  }
  if (warnings.length) {
    console.warn('Avisos:');
    for (const w of warnings) console.warn(`  - ${w}`);
  }
}

main();
