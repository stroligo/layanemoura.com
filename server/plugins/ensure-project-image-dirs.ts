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
  const root = process.cwd();
  syncProjectImageDirs(root);

  if (!import.meta.dev) return;

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
