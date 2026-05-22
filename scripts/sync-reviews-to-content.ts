/**
 * Exporta data/reviews.ts → content/reviews/*.yml (Nuxt Content / Studio)
 *
 *   npm run content:sync-reviews
 */
import { mkdirSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stringify } from 'yaml';
import { reviewsByLocale } from '../data/reviews';
import { reviewSlugFromName } from '../types/review';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'content/reviews');
mkdirSync(outDir, { recursive: true });

for (const file of readdirSync(outDir)) {
  if (/^review-\d+\.ya?ml$/i.test(file)) {
    unlinkSync(join(outDir, file));
  }
}

const en = reviewsByLocale.en;
const ptById = new Map(reviewsByLocale.pt.map((r) => [r.id, r]));

let count = 0;

for (let i = 0; i < en.length; i++) {
  const item = en[i]!;
  const pt = ptById.get(item.id);
  if (!pt) {
    console.warn(`Skipping ${item.id}: no PT entry`);
    continue;
  }

  const data: Record<string, unknown> = {
    published: true,
    order: (i + 1) * 10,
    quote: { en: item.text, pt: pt.text },
    clientName: item.clientName,
    clientRole: { en: item.clientRole, pt: pt.clientRole },
  };

  if (item.clientCompany) data.clientCompany = item.clientCompany;
  if (item.projectType && pt.projectType) {
    data.projectType = { en: item.projectType, pt: pt.projectType };
  }

  const slug = reviewSlugFromName(item.clientName);
  writeFileSync(join(outDir, `${slug}.yml`), stringify(data), 'utf8');
  count += 1;
}

console.log(`Wrote ${count} review files to content/reviews/`);
