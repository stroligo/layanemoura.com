/**
 * Opcional: gera XML local para inspeção.
 * Em produção o sitemap é servido dinamicamente em `/sitemap.xml` (server route).
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildSitemapXml } from '../data/sitemap';
import { resolveSiteUrl } from '../utils/seo';

const siteUrl = resolveSiteUrl(process.env.NUXT_PUBLIC_SITE_URL?.trim());
const output = resolve(process.cwd(), 'sitemap.preview.xml');

writeFileSync(output, buildSitemapXml(siteUrl), 'utf8');
console.log(`✓ Sitemap (preview): ${output}`);
console.log(`  Produção: ${siteUrl}/sitemap.xml`);
