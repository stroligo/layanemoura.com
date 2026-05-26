/**
 * Cria public/images/projects/{slug}/ para cada YAML em content/projects/.
 *
 *   npm run projects:ensure-dirs
 */
import {
  ensureAllProjectImageDirs,
  pruneOrphanProjectImageDirs,
} from '../server/utils/ensureProjectImageDir';

const slugs = ensureAllProjectImageDirs();
const removed = pruneOrphanProjectImageDirs();

if (slugs.length) {
  console.log(`Pastas de imagens OK (${slugs.length}): ${slugs.join(', ')}`);
} else {
  console.log('Nenhum projeto em content/projects/.');
}

if (removed.length) {
  console.log(`Pastas órfãs removidas: ${removed.join(', ')}`);
}
