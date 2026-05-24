import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildSitemapXml } from '../data/sitemap';
import { seoConfig } from '../data/seo';

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL?.trim() || seoConfig.defaultSiteUrl;
const output = resolve(process.cwd(), 'public/sitemap.xml');

writeFileSync(output, buildSitemapXml(siteUrl), 'utf8');
console.log(`✓ Sitemap gerado: ${output}`);
console.log(`  URL base: ${siteUrl.replace(/\/+$/, '')}/sitemap.xml`);
