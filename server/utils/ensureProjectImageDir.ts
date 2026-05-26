import {
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

export function projectSlugFromYamlFilename(filename: string) {
  return filename.replace(/\.ya?ml$/i, '').trim();
}

/** Garante `public/images/projects/{slug}/` (para upload no Studio). */
export function ensureProjectImageDir(slug: string, root = process.cwd()) {
  const clean = slug.replace(/[^a-z0-9-]/gi, '').toLowerCase();
  if (!clean) return null;

  const dir = join(root, 'public/images/projects', clean);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const gitkeep = join(dir, '.gitkeep');
  if (!existsSync(gitkeep)) {
    writeFileSync(gitkeep, '', 'utf8');
  }

  return dir;
}

/** Cria pastas para todos os YAML em `content/projects/`. */
export function ensureAllProjectImageDirs(root = process.cwd()) {
  const projectsDir = join(root, 'content/projects');
  if (!existsSync(projectsDir)) return [];

  const created: string[] = [];

  for (const file of readdirSync(projectsDir)) {
    if (!/\.ya?ml$/i.test(file)) continue;
    const slug = projectSlugFromYamlFilename(file);
    const dir = ensureProjectImageDir(slug, root);
    if (dir) created.push(slug);
  }

  return created;
}

export function projectImageDirPath(slug: string, root = process.cwd()) {
  const clean = slug.replace(/[^a-z0-9-]/gi, '').toLowerCase();
  if (!clean) return null;
  return join(root, 'public/images/projects', clean);
}

/** Remove `public/images/projects/{slug}/` (ao apagar o YAML no Studio). */
export function removeProjectImageDir(slug: string, root = process.cwd()) {
  const dir = projectImageDirPath(slug, root);
  if (!dir || !existsSync(dir)) return false;
  rmSync(dir, { recursive: true, force: true });
  return true;
}

/** Pastas em projects/ sem YAML correspondente (projeto apagado ou slug renomeado). */
export function pruneOrphanProjectImageDirs(root = process.cwd()) {
  const projectsDir = join(root, 'content/projects');
  const imagesDir = join(root, 'public/images/projects');
  if (!existsSync(imagesDir)) return [];

  const yamlSlugs = new Set<string>();
  if (existsSync(projectsDir)) {
    for (const file of readdirSync(projectsDir)) {
      if (/\.ya?ml$/i.test(file)) {
        yamlSlugs.add(projectSlugFromYamlFilename(file));
      }
    }
  }

  const removed: string[] = [];
  for (const entry of readdirSync(imagesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (!yamlSlugs.has(entry.name)) {
      rmSync(join(imagesDir, entry.name), { recursive: true, force: true });
      removed.push(entry.name);
    }
  }

  return removed;
}
