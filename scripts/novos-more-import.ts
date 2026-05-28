/**
 * Importa trabalhos novos de `NOVOS MORE/` → categoria More.
 *
 *   npm run more:import-novos
 *   npm run more:import-novos:dry
 */
import { runNovosImport } from './novos-import-shared';

const dryRun = process.argv.includes('--dry-run');

runNovosImport({
  sourceFolder: 'NOVOS MORE',
  category: 'more',
  dryRun,
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
