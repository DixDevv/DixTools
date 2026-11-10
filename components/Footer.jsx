'use client';

import React from 'react';
import { FileCode2 } from 'lucide-react';
import { MATRIX_CATEGORIES, SITE_CONFIG } from '../lib/tools-matrix-generator';
import { DixToolsBrandLogo } from './Header';

/**
 * ============================================================================
 * Dix Tools Footer (`components/Footer.jsx`)
 * Includes:
 * - Secret 5-Rapid-Tap Trigger on Dix Tools Brand Logo for Stealth Admin Panel
 * - Category & Programmatic SEO Sitemap Links
 * - Official Copyright Notice: "جميع الحقوق محفوظة © Dix Tools"
 * ============================================================================
 */
export default function Footer({
  stats,
  siteDescription,
  onSelectCategory,
  onOpenSitemapModal,
  onSecretLogoTap,
}) {
  const totalTools = stats?.totalCount || 5284;
  const byCategoryMap = stats?.byCategory || {};
  const totalSitemapUrls = totalTools + MATRIX_CATEGORIES.length + 1;

  return (
    <footer className="no-print border-t border-neutral-800 bg-[#070707] py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Dix Tools Brand Identity + Secret 5-Tap Trigger */}
          <div className="space-y-3">
            <div
              data-testid="footer-stealth-logo-trigger"
              onClick={onSecretLogoTap}
              className="inline-block select-none"
            >
              <DixToolsBrandLogo size="md" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {siteDescription || SITE_CONFIG.description}
            </p>
          </div>

          {/* Columns 2 & 3: Featured Pillar Categories */}
          {MATRIX_CATEGORIES.slice(0, 2).map((cat) => (
            <div key={cat.slug} className="space-y-2.5">
              <h4 className="text-sm font-bold text-white">
                {cat.name} ({(byCategoryMap[cat.slug] || 0).toLocaleString('en-US')} أداة شاملة)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">{cat.description}</p>
              <button
                type="button"
                onClick={() => onSelectCategory && onSelectCategory(cat.slug)}
                className="text-xs font-bold text-[#D4AF37] hover:underline cursor-pointer"
              >
                استعراض جميع أدوات القسم ←
              </button>
            </div>
          ))}

          {/* Column 4: Specialized Categories & XML Sitemap Preview */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-bold text-white">الأقسام المتخصصة وخريطة الموقع</h4>
            <div className="flex flex-wrap gap-1.5">
              {MATRIX_CATEGORIES.slice(2).map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => onSelectCategory && onSelectCategory(cat.slug)}
                  className="text-xs text-slate-300 hover:text-[#D4AF37] cursor-pointer"
                >
                  {cat.shortName} ·
                </button>
              ))}
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onOpenSitemapModal && onOpenSitemapModal()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141414] border border-neutral-800 text-xs font-bold text-[#F3E5AB] hover:border-[#D4AF37] transition-colors cursor-pointer"
              >
                <FileCode2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>معاينة خريطة الموقع ({totalSitemapUrls.toLocaleString('en-US')} رابط XML)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <span className="font-bold text-[#F3E5AB]" data-testid="footer-copyright-text">
            جميع الحقوق محفوظة © Dix Tools
          </span>
          <span>
            منصة ديكس تولز للخدمات والأدوات الذكية · إجمالي الصفحات النشطة:{' '}
            <strong className="font-num text-[#D4AF37]">
              {totalTools.toLocaleString('en-US')}
            </strong>{' '}
            أداة تفاعلية
          </span>
        </div>
      </div>
    </footer>
  );
}
