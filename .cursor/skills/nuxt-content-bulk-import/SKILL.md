---
name: nuxt-content-bulk-import
description: >-
  Bulk-imports content into Nuxt Content from staging folders: filename parsing to
  slugs, YAML generation, image conversion, shared import scripts, dry-run mode,
  and migration from TS mocks to YAML. Use when onboarding many items at once,
  importing from folders of images, or migrating legacy data/*.ts to content/.
---

# Nuxt Content Bulk Import

For mass onboarding **outside** the CMS. Studio handles day-to-day edits; scripts handle hundreds of files at once.

## Workflow

```
staging-folder/          ← drop source files here
    ↓  npm run content:import-{type}
content/{collection}/    ← generated YAML
public/images/...        ← converted masters
    ↓  npm run images:optimize
commit YAML + webp variants
    ↓  delete staging originals (optional)
```

## Staging folder convention

One folder per import type at project root (gitignored or cleaned after success):

```
IMPORT MAPS/     → category: maps
IMPORT MORE/     → category: more
```

Keep folder names documented in `package.json` scripts and README.

## Filename → metadata parser

Reusable pattern in `scripts/import-utils.ts`:

```ts
/** "Title - Subtitle 2.jpg" → title, subtitle, imageIndex */
export function parseImportFilename(filename: string): {
  title: string;
  subtitle: string;
  imageIndex: number;
} | null {
  if (!/\.(jpe?g|png|gif)$/i.test(filename)) return null;

  const stem = filename.replace(/\.(jpe?g|png|gif)$/i, '');
  const numMatch = stem.match(/\s+(\d+)$/);
  const imageIndex = numMatch ? Number.parseInt(numMatch[1], 10) : 1;
  const base = numMatch ? stem.slice(0, numMatch.index).trim() : stem.trim();

  const dash = base.indexOf(' - ');
  if (dash >= 0) {
    return {
      title: base.slice(0, dash).trim(),
      subtitle: base.slice(dash + 3).trim(),
      imageIndex,
    };
  }
  return { title: base, subtitle: '', imageIndex };
}
```

## Slug generation

```ts
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function slugFromParts(title: string, subtitle: string): string {
  const a = slugify(title);
  const b = subtitle ? slugify(subtitle) : '';
  return b ? `${a}-${b}` : a;
}
```

Group files by slug before writing YAML.

## Shared import module

One `scripts/import-shared.ts` used by category-specific entry points:

```ts
export type ImportOptions = {
  sourceFolder: string;   // folder name at project root
  category: string;       // maps | more | blog | ...
  dryRun?: boolean;
};

// 1. scanSourceFiles(sourceDir)
// 2. groupBySlug(files)
// 3. convertMaster(sharp) → public/images/{collection}/{slug}/NN.webp
// 4. writeOrUpdateYaml(content/{collection}/{slug}.yml)
// 5. run images:optimize (or defer to build)
// 6. delete staging originals on success
```

Category scripts are thin wrappers:

```ts
// scripts/import-maps.ts
import { runImport } from './import-shared';
runImport({ sourceFolder: 'IMPORT MAPS', category: 'maps' });
```

## YAML generation

Merge with existing YAML if slug already exists (append images, don't overwrite description):

```ts
import { parse as parseYaml, stringify } from 'yaml';

const doc = existsSync(yamlPath)
  ? parseYaml(readFileSync(yamlPath, 'utf8'))
  : { published: true, title, subtitle, category, tags: [], images: [] };

doc.images.push({ src: `/images/projects/${slug}/${pad}.webp` });
writeFileSync(yamlPath, stringify(doc));
```

Infer defaults where possible: `tags`, `layout`, `description` placeholders — editable later in Studio.

## Image conversion on import

Convert during import (not just at build):

```ts
async function importMaster(source: string, dest: string) {
  let pipeline = sharp(source).rotate();
  const meta = await pipeline.metadata();
  if ((meta.width ?? 0) > 6000 || (meta.height ?? 0) > 6000) {
    pipeline = pipeline.resize(6000, 6000, { fit: 'inside', withoutEnlargement: true });
  }
  await pipeline.webp({ quality: 92, effort: 6 }).toFile(dest);
}
```

Then run full variant pipeline: `npm run images:optimize -- --only=slug`

## npm scripts

```json
{
  "content:import-maps": "tsx scripts/import-maps.ts",
  "content:import-maps:dry": "tsx scripts/import-maps.ts --dry-run",
  "content:import-more": "tsx scripts/import-more.ts",
  "images:optimize": "tsx scripts/optimize-images.ts"
}
```

Always support `--dry-run` — log slugs, file counts, skipped files without writing.

## Migration: TS mocks → YAML

One-time sync scripts (`scripts/sync-*-to-content.ts`):

```
data/projects.ts  →  content/projects/*.yml
data/reviews.ts   →  content/reviews/*.yml
```

Pattern:
1. Read legacy TS export
2. Map to schema shape
3. Write YAML with `yaml` package
4. Verify in dev; delete legacy after cutover

Utility: `npm run content:reset` clears `.data/` Content cache after bulk writes.

## Inventory step (optional)

For large legacy folders, generate manifest first:

```bash
npm run content:inventory   # writes scripts/import-manifest.json
npm run content:import      # reads manifest
```

Manifest tracks skipped files with reasons (bad filename, duplicate slug, etc.).

## Pitfalls

| Symptom | Fix |
|---------|-----|
| Duplicate slugs | Group by slug before write; warn on collision |
| Wrong image order | Sort by `imageIndex` from filename suffix |
| Studio doesn't see new items | `content:reset` or restart dev |
| Partial import | Use dry-run first; don't delete staging until success |
| YAML schema errors | Validate against `content.config.ts` Zod before commit |

## Checklist

```
- [ ] parseImportFilename + slugify utilities
- [ ] import-shared.ts with dry-run
- [ ] Category entry scripts + npm scripts
- [ ] Sharp master conversion + images:optimize after
- [ ] Document staging folder naming
- [ ] .gitignore staging folder (optional)
- [ ] content:reset documented for cache issues
```

## Related skills

- **nuxt-studio** — day-to-day editing after import
- **nuxt-image-pipeline** — thumb/display variant generation
- **nuxt-i18n-bilingual** — `{ en, pt }` fields in generated YAML
