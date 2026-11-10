'use client';

import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import {
  getAllMatrixTools,
  getToolBySlug,
  SITE_CONFIG,
} from '../../../lib/tools-matrix-generator';
import MasterEngines from '../../../components/engines/MasterEngines';

/**
 * Generates static params for all embeddable tool routes (`/embed/[slug]`)
 */
export async function generateStaticParams() {
  const allTools = getAllMatrixTools();
  return allTools.map((tool) => ({
    slug: tool.slug,
  }));
}

/**
 * Standalone Chromeless Embed Route (`app/embed/[slug]/page.jsx`)
 * Renders the interactive tool without the site Header or Footer, framed with
 * a clickable golden "Dix Tools" badge linking back to the canonical tool page.
 */
export default function EmbedToolPage({ params, onOpenFullTool }) {
  const slug = params?.slug || 'comprehensive-gold-calculator';
  const tool =
    getToolBySlug(null, slug) ||
    getAllMatrixTools().find((t) => t.slug === slug) ||
    getAllMatrixTools()[0];

  const domain = SITE_CONFIG.domain || 'https://dixtools.com';
  const canonicalUrl = `${domain}/${tool.category}/${tool.slug}`;

  return (
    <div
      dir="rtl"
      data-testid="standalone-embed-page"
      className="min-h-screen bg-[#0A0A0A] text-slate-100 p-3 sm:p-5 flex flex-col justify-between"
    >
      <div className="max-w-4xl w-full mx-auto rounded-3xl border-2 border-[#D4AF37]/70 bg-[#141414] overflow-hidden shadow-2xl">
        {/* Compact Embed Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#1A1506] via-[#141414] to-[#0A0A0A] border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-[#D4AF37]">
              {tool.categoryName} · نسخة التضمين التفاعلية المجانية
            </span>
            <h1 className="text-base sm:text-lg font-extrabold text-white">
              {tool.shortTitle || tool.title}
            </h1>
          </div>

          <a
            href={canonicalUrl}
            target="_blank"
            rel="dofollow"
            onClick={(e) => {
              if (onOpenFullTool) {
                e.preventDefault();
                onOpenFullTool(tool.category, tool.slug);
              }
            }}
            data-testid="embed-dix-tools-badge"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#e5c247] text-black text-xs font-extrabold transition-all shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>مُشغّل بواسطة Dix Tools</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Interactive Tool Engine Workspace (No Header / No Footer) */}
        <div className="p-4 sm:p-6">
          <MasterEngines tool={tool} />
        </div>

        {/* Mandatory Dofollow Attribution Footer Bar */}
        <div className="px-4 sm:px-6 py-3 bg-[#0A0A0A] border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <p className="text-slate-300">
            أداة مقدمة مجاناً من{' '}
            <a
              href={canonicalUrl}
              target="_blank"
              rel="dofollow"
              onClick={(e) => {
                if (onOpenFullTool) {
                  e.preventDefault();
                  onOpenFullTool(tool.category, tool.slug);
                }
              }}
              className="text-[#D4AF37] font-extrabold underline hover:text-[#F3E5AB]"
            >
              Dix Tools — منصة ديكس تولز للخدمات والأدوات الذكية
            </a>
          </p>
          <span className="font-num text-[11px] text-slate-400">100% Client-Side Embed</span>
        </div>
      </div>
    </div>
  );
}
