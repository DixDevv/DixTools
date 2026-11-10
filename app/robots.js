import { SITE_CONFIG } from '../lib/tools-matrix-generator';

/**
 * ============================================================================
 * Dix Tools — Search Engine Crawler Directives (`app/robots.js`)
 * Grants full indexing access to all Master Tools, SEO Sub-routes, and Embeds
 * while shielding the Stealth Admin Route from search crawlers.
 * ============================================================================
 */
export default function robots() {
  const baseUrl = SITE_CONFIG.domain || 'https://dixtools.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/stealth-command-x99', '/api/private/'],
      },
      {
        userAgent: ['Googlebot', 'Bingbot', 'Applebot'],
        allow: ['/'],
        disallow: ['/stealth-command-x99'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
