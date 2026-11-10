'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Calculator,
  Coins,
  Image as ImageIcon,
  FileSignature,
  ArrowUpLeft,
  Flame,
  X,
  CheckCircle2,
  Star,
  History,
  Trash2,
} from 'lucide-react';
import AISmartFinder from '../components/AISmartFinder';
import ToolDynamicBanner from '../components/ToolDynamicBanner';
import AdSlot from '../components/AdSlot';
import { getMasterTools, getMatrixStats } from '../lib/tools-matrix-generator';
import { useSiteConfig, DEFAULT_STEALTH_CONFIG } from '../context/SiteConfigContext';
import { useUserToolsMemory } from '../hooks/useUserToolsMemory';

export default function HomePage({
  selectedCategory = 'all',
  onSelectCategory: _onSelectCategory,
  onSelectTool,
}) {
  let siteConfigCtx = null;
  try {
    siteConfigCtx = useSiteConfig();
  } catch (_err) {
    siteConfigCtx = null;
  }

  const {
    favoriteSlugs,
    recentCalculations,
    isFavoriteTool,
    toggleFavoriteTool,
    clearCalculationHistory,
  } = useUserToolsMemory();

  const masterTools = useMemo(() => {
    if (siteConfigCtx?.visibleMasterTools) {
      return siteConfigCtx.visibleMasterTools;
    }
    return getMasterTools().filter((t) => t.isMasterTool && !t.isSubVariant);
  }, [siteConfigCtx?.visibleMasterTools]);

  const favoriteToolsList = useMemo(() => {
    return favoriteSlugs
      .map((slug) => masterTools.find((t) => t.slug === slug))
      .filter(Boolean);
  }, [favoriteSlugs, masterTools]);

  const stats = useMemo(() => getMatrixStats(), []);
  const pinnedSlugs =
    siteConfigCtx?.config?.toolsConfig?.pinnedTrendingSlugs ||
    DEFAULT_STEALTH_CONFIG.toolsConfig.pinnedTrendingSlugs;

  const fourMainPillars = useMemo(() => {
    return [
      {
        id: 'pillar-finance',
        title: 'المال والبنوك والذهب والتجارة',
        subtitle:
          'محول العملات الشامل، حاسبة الذهب، الزكاة، المواريث، القروض، الشهادات، وتسعير التجارة',
        count: masterTools.filter((t) => t.pillarId === 'pillar-finance').length,
        icon: Coins,
      },
      {
        id: 'pillar-daily',
        title: 'السيارات والخدمات اليومية والقياسات',
        subtitle:
          'بنزين المشوار، صيانة السيارة، الكهرباء والمياه، المساحات الزراعية، العمر، BMI، والتشطيب',
        count: masterTools.filter((t) => t.pillarId === 'pillar-daily').length,
        icon: Calculator,
      },
      {
        id: 'pillar-media',
        title: 'استوديو الصور والـ PDF والـ QR والتفقيط',
        subtitle:
          'ضغط وتحويل الصور، دمج PDF، صناعة QR والباركود، تفقيط الشيكات بالحروف، وأدوات الكود',
        count: masterTools.filter((t) => t.pillarId === 'pillar-media').length,
        icon: ImageIcon,
      },
      {
        id: 'pillar-documents',
        title: 'مولدات العقود الرسمية والفواتير والـ CV',
        subtitle:
          'عقود بيع سيارات وموتوسيكلات، إيجار شقق، فواتير ضريبية، سيرة ذاتية ATS، ومفردات مرتب A4',
        count: masterTools.filter((t) => t.pillarId === 'pillar-documents').length,
        icon: FileSignature,
      },
    ];
  }, [masterTools]);

  const [activePillarId, setActivePillarId] = useState('all');
  const [explorerSearch, setExplorerSearch] = useState('');
  const [trendingFilter, setTrendingFilter] = useState('all');

  const resolvedTrendingTools = useMemo(() => {
    return pinnedSlugs
      .map((slug) => masterTools.find((t) => t.slug === slug))
      .filter(Boolean)
      .filter((t) => {
        if (trendingFilter === 'all') return true;
        if (trendingFilter === 'top-today') return (t.trendingBadge || '').includes('الأكثر طلباً');
        return t.trendingTag === trendingFilter;
      });
  }, [pinnedSlugs, masterTools, trendingFilter]);

  const filteredMasterTools = useMemo(() => {
    const q = explorerSearch.trim().toLowerCase();
    const activePillar = fourMainPillars.find((p) => p.id === activePillarId);
    return masterTools.filter((tool) => {
      if (selectedCategory !== 'all' && activePillarId === 'all') {
        if (tool.category !== selectedCategory) return false;
      } else if (activePillar) {
        if (tool.pillarId !== activePillar.id) return false;
      }
      if (!q) return true;
      return (
        tool.title.toLowerCase().includes(q) ||
        tool.shortTitle.toLowerCase().includes(q) ||
        tool.subtitle.toLowerCase().includes(q) ||
        tool.summary.toLowerCase().includes(q)
      );
    });
  }, [masterTools, activePillarId, selectedCategory, explorerSearch, fourMainPillars]);

  const handleOpenTool = (category, slug, overrideParams, queryString = '') => {
    if (onSelectTool) {
      onSelectTool(category, slug, overrideParams, queryString);
    } else if (typeof window !== 'undefined') {
      window.location.hash = `/${category}/${slug}${queryString || ''}`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
      {/* Strategic Ad Placement #1: `header_banner` directly under Header */}
      <AdSlot
        placement="header_banner"
        slotId="1010192830"
        category={selectedCategory !== 'all' ? selectedCategory : ''}
        label="إعلان أعلى الصفحة تحت الهيدر (header_banner)"
      />

      {/* FIRST: AI TOOL CONCIERGE HERO */}
      <AISmartFinder
        masterToolsCount={masterTools.length}
        totalSeoRoutesCount={stats.totalCount}
        onOpenToolWithParams={(cat, slug, overrideParams, queryString) =>
          handleOpenTool(cat, slug, overrideParams, queryString)
        }
      />

      {/* USER MEMORY HUB: "أدواتي المفضلة السريعة" (⭐) & LAST 5 CALCULATIONS */}
      {(favoriteToolsList.length > 0 || recentCalculations.length > 0) && (
        <section
          aria-label="أدواتي المفضلة السريعة وسجل العمليات الذكي"
          data-testid="user-tools-memory-section"
          className="rounded-3xl border border-[#D4AF37]/50 bg-gradient-to-br from-[#161205] via-[#121212] to-[#0A0A0A] p-5 sm:p-6 space-y-6 shadow-2xl"
        >
          {/* Sub-section A: Favorite Tools ("أدواتي المفضلة السريعة") */}
          {favoriteToolsList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
                  <h2 className="text-base sm:text-lg font-extrabold text-white">
                    ⭐ أدواتي المفضلة السريعة ({favoriteToolsList.length})
                  </h2>
                </div>
                <span className="text-[11px] text-slate-400">
                  محفوظة تلقائياً في متصفحك للوصول السريع
                </span>
              </div>

              <div
                data-testid="favorite-tools-grid"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
              >
                {favoriteToolsList.map((tool) => (
                  <div
                    key={tool.slug}
                    className="rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-3.5 flex items-center justify-between gap-2 hover:border-[#D4AF37] transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => handleOpenTool(tool.category, tool.slug)}
                      className="text-right flex-1 min-w-0 cursor-pointer"
                    >
                      <span className="text-[10px] font-bold text-[#D4AF37] block">
                        {tool.categoryName}
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-white truncate block">
                        {tool.shortTitle}
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label={`إزالة ${tool.shortTitle} من المفضلة`}
                      onClick={() => toggleFavoriteTool(tool.slug)}
                      className="p-1.5 rounded-lg bg-[#141414] text-[#D4AF37] hover:text-red-400 cursor-pointer shrink-0"
                    >
                      <Star className="w-4 h-4 fill-[#D4AF37]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-section B: Last 5 Calculations History */}
          {recentCalculations.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="text-sm sm:text-base font-extrabold text-[#F3E5AB]">
                    سجل آخر {recentCalculations.length} عمليات حسابية قمت بها
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={clearCalculationHistory}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>مسح السجل</span>
                </button>
              </div>

              <div
                data-testid="recent-calculations-list"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
              >
                {recentCalculations.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      handleOpenTool(item.category, item.slug, null, item.queryString || '')
                    }
                    className="text-right rounded-2xl border border-neutral-800 bg-[#0A0A0A] hover:border-[#D4AF37] p-3.5 transition-all flex flex-col justify-between gap-1.5 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="font-bold text-slate-300 group-hover:text-white truncate">
                        {item.toolTitle}
                      </span>
                      <span className="font-num text-[10px] text-slate-500 shrink-0">
                        {item.timestamp}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 truncate">{item.inputsSummary}</div>
                    <div className="flex items-center justify-between pt-1 border-t border-neutral-900">
                      <span className="font-num text-xs sm:text-sm font-extrabold text-[#D4AF37]">
                        {item.resultSummary}
                      </span>
                      <ArrowUpLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#D4AF37]" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* SECOND: 4 LUXURY GLASSMORPHISM CATEGORIES GRID */}
      <section aria-label="شبكة الأقسام الرئيسية" className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              الأقسام الرئيسية للمنصة ({masterTools.length} أداة رئيسية شاملة و{' '}
              {stats.seoSubRoutesCount.toLocaleString('en-US')} مسار فرعي ذكي)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              كل أداة مصممة كمركز شامل (Master Hub) يضم بداخله جميع القوائم المنسدلة بدون أي بطاقات مكررة
            </p>
          </div>
          {activePillarId !== 'all' && (
            <button
              type="button"
              onClick={() => setActivePillarId('all')}
              className="text-xs font-bold text-[#D4AF37] hover:underline cursor-pointer"
            >
              عرض جميع الأدوات الشاملة ({masterTools.length})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {fourMainPillars.map((pillar) => {
            const IconComp = pillar.icon;
            const isSelected = activePillarId === pillar.id;
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => {
                  setActivePillarId(isSelected ? 'all' : pillar.id);
                  const el = document.getElementById('master-tools-directory');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`text-right rounded-2xl p-5 transition-all cursor-pointer flex flex-col justify-between space-y-4 border backdrop-blur-md ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#1F1908] to-[#111111] border-[#D4AF37] shadow-xl'
                    : 'bg-[#141414]/90 border-neutral-800 hover:border-[#D4AF37]/60 hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between gap-3 w-full">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37]/25 to-[#0A0A0A] border border-[#D4AF37]/50 flex items-center justify-center text-[#F3E5AB] shadow-inner">
                    <IconComp className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <span className="font-num text-xs font-extrabold text-[#F3E5AB] bg-[#0A0A0A] border border-[#D4AF37]/30 px-2.5 py-1 rounded-lg">
                    {pillar.count} أداة شاملة
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-extrabold text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {pillar.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between w-full text-xs font-bold text-[#D4AF37]">
                  <span>تصفح أدوات القسم الشاملة</span>
                  <ArrowUpLeft className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* THIRD: MOST NEEDED & TRENDING MASTER TOOLS (includes `in_feed_tools_grid` native ad card) */}
      <section aria-label="الأدوات الأكثر احتياجاً واستخداماً" className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                الأدوات الرئيسية الأكثر احتياجاً واستخداماً اليوم
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              أضف أي أداة إلى مفضلتك السريعة بالضغط على النجمة ⭐ للوصول إليها فوراً في زياراتك القادمة
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: `الكل (${resolvedTrendingTools.length})` },
              { id: 'top-today', label: 'الأكثر استخداماً اليوم' },
              { id: 'merchants', label: 'أدوات التجار والشركات' },
              { id: 'cars-motos', label: 'أدوات السيارات والموتوسيكلات' },
              { id: 'banks-gold', label: 'أدوات البنوك والذهب والمواريث' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTrendingFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  trendingFilter === tab.id
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-[#141414] text-slate-300 border border-neutral-800 hover:border-[#D4AF37]/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {resolvedTrendingTools.map((tool, idx) => {
            const fav = isFavoriteTool(tool.slug);
            return (
              <React.Fragment key={tool.slug}>
                <article className="group rounded-2xl border border-neutral-800 bg-[#141414] hover:border-[#D4AF37]/70 p-4 flex flex-col justify-between transition-all hover:-translate-y-0.5 shadow-lg space-y-3">
                  <div className="space-y-3">
                    <div className="relative">
                      <div
                        onClick={() => handleOpenTool(tool.category, tool.slug)}
                        className="cursor-pointer"
                      >
                        <ToolDynamicBanner tool={tool} compact />
                      </div>
                      <button
                        type="button"
                        data-testid={`fav-star-${tool.slug}`}
                        aria-label={
                          fav
                            ? `إزالة ${tool.shortTitle} من المفضلة`
                            : `إضافة ${tool.shortTitle} إلى أدواتي المفضلة السريعة`
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteTool(tool.slug);
                        }}
                        className={`absolute top-2.5 left-2.5 z-10 p-1.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                          fav
                            ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-md'
                            : 'bg-black/75 border-neutral-700 text-slate-200 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${fav ? 'fill-black text-black' : ''}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#D4AF37]">
                        {tool.trendingBadge || 'الأكثر طلباً 🔥'}
                      </span>
                      <span className="text-slate-400">{tool.categoryName}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-[#F3E5AB] transition-colors line-clamp-1">
                      <button
                        type="button"
                        onClick={() => handleOpenTool(tool.category, tool.slug)}
                        className="text-right cursor-pointer focus:outline-none"
                      >
                        {tool.shortTitle}
                      </button>
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-1">{tool.subtitle}</p>
                  </div>

                  <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">{tool.badge}</span>
                    <button
                      type="button"
                      onClick={() => handleOpenTool(tool.category, tool.slug)}
                      className="inline-flex items-center gap-1 text-xs font-extrabold text-[#D4AF37] group-hover:text-[#F3E5AB] cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>فتح الأداة الشاملة</span>
                      <ArrowUpLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>

                {/* Strategic Placement #8: `in_feed_tools_grid` native card injected after 3rd tool */}
                {idx === 2 && (
                  <AdSlot
                    placement="in_feed_tools_grid"
                    slotId="7070798897"
                    label="إعلان مدمج وسط شبكة الأدوات الأكثر احتياجاً"
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* FOURTH: COMPLETE DIRECTORY OF DISTINCT MASTER HUB TOOLS */}
      <section
        id="master-tools-directory"
        aria-label="دليل الأدوات الشاملة الكامل"
        className="space-y-6 pt-4 border-t border-neutral-800"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>معمارية موحدة (Master Hub Tools) — صفر تكرار للبطاقات</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-white">
              الدليل الكامل للأدوات الشاملة ({filteredMasterTools.length} أداة رئيسية مختلفة الوظيفة)
            </h2>
            <p className="text-xs text-slate-400">
              كل بطاقة أدناه تمثل أداة مستقلة تماماً (بينما تعمل {stats.seoSubRoutesCount.toLocaleString('en-US')} صفحة فرعية في الخلفية فقط لمحركات البحث)
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#D4AF37] absolute right-3.5 top-3 pointer-events-none" />
            <input
              type="search"
              aria-label="ابحث في الأدوات الشاملة"
              value={explorerSearch}
              onChange={(e) => setExplorerSearch(e.target.value)}
              placeholder="ابحث في الأدوات (تفقيط، ميراث، ذهب، عملات...)"
              className="w-full rounded-xl bg-[#141414] border border-neutral-800 focus:border-[#D4AF37] pr-10 pl-8 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none"
            />
            {explorerSearch && (
              <button
                type="button"
                onClick={() => setExplorerSearch('')}
                className="absolute left-2.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div
          data-testid="master-tools-directory-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredMasterTools.map((tool, index) => {
            const fav = isFavoriteTool(tool.slug);
            return (
              <div
                key={tool.slug}
                className="p-4 rounded-2xl border border-neutral-800 bg-[#141414] hover:border-[#D4AF37]/60 transition-all flex items-start justify-between gap-3 group"
              >
                <button
                  type="button"
                  onClick={() => handleOpenTool(tool.category, tool.slug)}
                  className="text-right space-y-1.5 min-w-0 flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-[11px] font-semibold">
                    <span className="font-num px-2 py-0.5 rounded bg-[#0A0A0A] border border-[#D4AF37]/30 text-[#F3E5AB]">
                      #{index + 1}
                    </span>
                    <span className="text-[#D4AF37]">{tool.categoryName}</span>
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-white group-hover:text-[#F3E5AB] truncate">
                    {tool.shortTitle}
                  </div>
                  <div className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {tool.subtitle}
                  </div>
                </button>

                <div className="flex flex-col items-center gap-2 shrink-0">
                  <button
                    type="button"
                    aria-label={fav ? `إزالة ${tool.shortTitle} من المفضلة` : `إضافة ${tool.shortTitle} للمفضلة`}
                    onClick={() => toggleFavoriteTool(tool.slug)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      fav
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                        : 'bg-[#0A0A0A] border-neutral-800 text-slate-500 hover:text-[#D4AF37]'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${fav ? 'fill-[#D4AF37]' : ''}`} />
                  </button>
                  <ArrowUpLeft className="w-4 h-4 text-slate-500 group-hover:text-[#D4AF37]" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
