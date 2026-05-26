import { existsSync, watch } from 'node:fs';
import { basename, join } from 'node:path';
import {
  ensureAllProjectImageDirs,
  ensureProjectImageDir,
  pruneOrphanProjectImageDirs,
  projectSlugFromYamlFilename,
  removeProjectImageDir,
} from '../utils/ensureProjectImageDir';

function syncProjectImageDirs(root: string) {
  ensureAllProjectImageDirs(root);
  pruneOrphanProjectImageDirs(root);
}

export default defineNitroPlugin(() => {
  // Em produção o arranque costuma ser `node .output/server/index.mjs` (cwd = .output).
  // sync + prune apagaria `public/images/projects/` dentro de `.output/public` → 500 nas capas.
  // Pastas de projeto: `npm run images:optimize` no build; em dev, sync abaixo.
  if (!import.meta.dev) return;

  const root = process.cwd();
  syncProjectImageDirs(root);

  const projectsDir = join(root, 'content/projects');

  try {
    watch(projectsDir, (_event, filename) => {
      if (!filename || !/\.ya?ml$/i.test(filename)) return;

      const name = basename(filename);
      const slug = projectSlugFromYamlFilename(name);
      const yamlPath = join(projectsDir, name);

      if (existsSync(yamlPath)) {
        ensureProjectImageDir(slug, root);
        return;
      }

      removeProjectImageDir(slug, root);
      pruneOrphanProjectImageDirs(root);
    });
  } catch {
    // content/projects pode ainda não existir
  }
});
