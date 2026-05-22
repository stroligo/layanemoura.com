import { site } from '~/data/site';
import { seoConfig } from '~/data/seo';

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const siteUrl = (config.public.siteUrl as string) || seoConfig.defaultSiteUrl;
  const contact = site.email;

  const body = `Contact: mailto:${contact}
Preferred-Languages: en, pt
Canonical: ${siteUrl}/.well-known/security.txt
Policy: ${siteUrl}/

# Report security issues responsibly via email.
# Please allow reasonable time to investigate before public disclosure.
`;

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8');
  setHeader(event, 'Cache-Control', 'public, max-age=86400');
  return body;
});
