/**
 * Importa mapas novos de `NOVOS MAPAS/` → categoria Maps.
 *
 *   npm run mapas:import-novos
 *   npm run mapas:import-novos:dry
 */
import { runNovosImport } from './novos-import-shared';

const dryRun = process.argv.includes('--dry-run');

runNovosImport({
  sourceFolder: 'NOVOS MAPAS',
  category: 'maps',
  dryRun,
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
