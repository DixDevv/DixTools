'use client';

import React, { useState, useMemo } from 'react';
import { Columns2, X, Search, ExternalLink, Sparkles } from 'lucide-react';
import { getMasterTools } from '../lib/tools-matrix-generator';
import MasterEngines from './engines/MasterEngines';

const QUICK_SPLIT_SLUGS = [
  'comprehensive-gold-calculator',
  'comprehensive-currency-converter',
  'gold-vs-bank-comparator',
  'dropshipping-affiliate-pricing-engine',
  'egypt-finishing-cost-calculator',
  'trip-fuel-cost-calculator',
];

export default function SplitScreenWorkspace({
  primaryTool,
  allMasterTools = [],
  onCloseSplitView,
  onNavigateFullTool,
}) {
  const catalog = useMemo(() => {
    const base =
      Array.isArray(allMasterTools) && allMasterTools.length > 0
        ? allMasterTools
        : getMasterTools();
    return base.filter((t) => t.slug !== primaryTool?.slug);
  }, [allMasterTools, primaryTool?.slug]);

  const [selectedSecondarySlug, setSelectedSecondarySlug] = useState(() => {
    const defaultPick =
      catalog.find((t) => t.slug === 'comprehensive-currency-converter') ||
      catalog.find((t) => t.slug === 'comprehensive-gold-calculator') ||
      catalog[0];
    return defaultPick?.slug || '';
  });
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter(
      (t) =>
        (t.title || '').toLowerCase().includes(q) ||
        (t.shortTitle || '').toLowerCase().includes(q) ||
        (t.slug || '').toLowerCase().includes(q)
    );
  }, [catalog, searchQuery]);

  const secondaryTool = useMemo(
    () =>
      catalog.find((t) => t.slug === selectedSecondarySlug) ||
      filteredTools[0] ||
      catalog[0],
    [catalog, filteredTools, selectedSecondarySlug]
  );

  const quickTools = useMemo(
    () =>
      QUICK_SPLIT_SLUGS.map((slug) => catalog.find((t) => t.slug === slug)).filter(
        Boolean
      ),
    [catalog]
  );

  if (!secondaryTool) return null;

  return (
    <aside
      data-testid="split-screen-secondary-workspace"
      aria-label="مساحة العمل المزدوجة - الأداة الثانية"
      className="no-print rounded-2xl border-2 border-[#D4AF37]/70 bg-[#141414] p-5 sm:p-6 shadow-2xl space-y-5"
    >
      {/* Top Bar: Selector & Close */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
            <Columns2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-black text-[#D4AF37] flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              وضع الشاشة المزدوجة (Split Screen Mode)
            </span>
            <h2 className="text-sm sm:text-base font-black text-white">
              {secondaryTool.shortTitle || secondaryTool.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateFullTool && (
            <button
              type="button"
              onClick={() =>
                onNavigateFullTool(secondaryTool.category, secondaryTool.slug)
              }
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-xs font-bold text-[#F3E5AB] hover:border-[#D4AF37] cursor-pointer"
            >
              <span>فتح في صفحة كاملة</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            data-testid="close-split-screen-btn"
            onClick={onCloseSplitView}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-black hover:bg-red-900/70 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>إغلاق الشاشة المزدوجة</span>
          </button>
        </div>
      </div>

      {/* Tool Picker Controls */}
      <div className="rounded-xl border border-neutral-800 bg-[#0A0A0A] p-3.5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن أداة ثانية لفتحها بجانب الأداة الحالية..."
              className="w-full rounded-xl bg-[#141414] border border-neutral-800 pr-9 pl-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <select
            data-testid="split-screen-tool-select"
            value={secondaryTool.slug}
            onChange={(e) => setSelectedSecondarySlug(e.target.value)}
            className="w-full rounded-xl bg-[#141414] border border-[#D4AF37]/50 px-3 py-2 text-xs font-bold text-[#F3E5AB] focus:outline-none"
          >
            {filteredTools.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.shortTitle || item.title} ({item.categoryName})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 ml-1">اختيار سريع:</span>
          {quickTools.map((qt) => {
            const active = qt.slug === secondaryTool.slug;
            return (
              <button
                key={qt.slug}
                type="button"
                onClick={() => setSelectedSecondarySlug(qt.slug)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#D4AF37] text-black font-black'
                    : 'bg-[#141414] text-slate-300 border border-neutral-800 hover:border-[#D4AF37]/50'
                }`}
              >
                {qt.shortTitle || qt.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Interactive Secondary Engine */}
      <div className="pt-1">
        <MasterEngines tool={secondaryTool} />
      </div>
    </aside>
  );
}
