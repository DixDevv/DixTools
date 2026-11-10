'use client';

import React from 'react';
import {
  getAllMatrixTools,
  getMasterTools,
  getToolBySlug,
  SITE_CONFIG,
} from '../../../lib/tools-matrix-generator';
import { buildFreshToolSeoMeta } from '../../../lib/seo-freshness-engine';
import ToolLayout from '../../../components/ToolLayout';
import MasterEngines from '../../../components/engines/MasterEngines';
import { useSiteConfig } from '../../../context/SiteConfigContext';
import { Wrench, ArrowRight } from 'lucide-react';

/**
 * Generates static tool routes for `/tools/[slug]` across all Master Hub Tools & SEO sub-routes
 */
export async function generateStaticParams() {
  const allTools = getAllMatrixTools();
  return allTools.map((tool) => ({
    slug: tool.slug,
  }));
}

/**
 * Dynamic Programmatic SEO Metadata Generator for `/tools/[slug]`
 */
export async function generateMetadata({ params }) {
  const resolved = await Promise.resolve(params);
  const slug = resolved?.slug;
  const masterMatch = getMasterTools().find((t) => t.slug === slug);
  const tool = masterMatch || getToolBySlug(undefined, slug);

  if (!tool) {
    return {
      title: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
    };
  }

  const canonicalUrl = `${SITE_CONFIG.domain}/${tool.category}/${tool.slug}`;
  const { freshTitle, freshDescription } = buildFreshToolSeoMeta(tool);

  return {
    title: freshTitle,
    description: freshDescription,
    keywords: tool.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: tool.metaTitle || freshTitle,
      description: tool.metaDescription || freshDescription,
      url: canonicalUrl,
      siteName: SITE_CONFIG.shortName,
      locale: 'ar_EG',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.metaTitle || freshTitle,
      description: tool.metaDescription || freshDescription,
    },
  };
}

export default function UnifiedToolRoutePage({
  params,
  overrideParams,
  onSelectTool,
  onGoHome,
  onSelectCategory,
}) {
  let siteConfigCtx = null;
  try {
    siteConfigCtx = useSiteConfig();
  } catch (_err) {
    siteConfigCtx = null;
  }

  const targetSlug = params?.slug;
  const customOrOverridden = siteConfigCtx?.effectiveMasterTools?.find(
    (t) => t.slug === targetSlug
  );
  const baseTool =
    customOrOverridden ||
    getMasterTools().find((t) => t.slug === targetSlug) ||
    getToolBySlug(params?.category, targetSlug);

  const isUnderMaintenance =
    siteConfigCtx?.config?.uiCustomizer?.globalMaintenanceMode ||
    (siteConfigCtx?.config?.uiCustomizer?.maintenanceToolSlugs || []).includes(targetSlug);

  if (isUnderMaintenance) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="rounded-3xl border-2 border-[#D4AF37] bg-[#141414] p-8 sm:p-12 space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mx-auto">
            <Wrench className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            هذه الأداة قيد التحديث اللحظي حالياً
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
            {siteConfigCtx?.config?.uiCustomizer?.maintenanceMessage ||
              'نقوم حالياً بتحديث معادلات وأسعار هذه الأداة لضمان دقة 100%.. يرجى المحاولة بعد قليل.'}
          </p>
          <button
            type="button"
            onClick={onGoHome}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4AF37] text-black text-xs sm:text-sm font-black cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى جميع أدوات Dix Tools</span>
          </button>
        </div>
      </div>
    );
  }

  const effectiveTool = overrideParams
    ? {
        ...baseTool,
        defaultParams: {
          ...(baseTool?.defaultParams || {}),
          ...overrideParams,
        },
      }
    : baseTool;

  return (
    <ToolLayout
      tool={effectiveTool}
      onSelectTool={onSelectTool}
      onGoHome={onGoHome}
      onSelectCategory={onSelectCategory}
    >
      <MasterEngines tool={effectiveTool} />
    </ToolLayout>
  );
}
