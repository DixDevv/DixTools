import {
  getAllMatrixTools,
  MATRIX_CATEGORIES,
  SITE_CONFIG,
} from '../lib/tools-matrix-generator';
import { getFreshnessSignals } from '../lib/seo-freshness-engine';

/**
 * ============================================================================
 * Dix Tools — God-Tier Dynamic XML Sitemap Generator (`app/sitemap.js`)
 * Assigns Priority 1.0 to Homepage & Master Tools (`isMasterTool: true`),
 * Priority 0.9 to Category Pillars, and Priority 0.8 to SEO Sub-routes,
 * with real-time daily `lastModified` timestamps.
 * ============================================================================
 */
export default function sitemap() {
  const baseUrl = SITE_CONFIG.domain || 'https://dixtools.com';
  const { dateModified } = getFreshnessSignals();
  const allTools = getAllMatrixTools();

  const rootRoutes = [
    {
      url: baseUrl,
      lastModified: dateModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  const categoryRoutes = MATRIX_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/${cat.slug}`,
    lastModified: dateModified,
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  const toolRoutes = allTools.map((tool) => ({
    url: `${baseUrl}/${tool.category}/${tool.slug}`,
    lastModified: dateModified,
    changeFrequency: tool.isMasterTool ? 'daily' : 'weekly',
    priority: tool.isMasterTool ? 1.0 : 0.8,
  }));

  return [...rootRoutes, ...categoryRoutes, ...toolRoutes];
}
