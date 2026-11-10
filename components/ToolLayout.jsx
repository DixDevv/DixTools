'use client';

import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  Home,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  ArrowUpLeft,
  Layers,
  Share2,
  Check,
  Tag,
  Star,
} from 'lucide-react';
import AdSlot from './AdSlot';
import ToolDynamicBanner from './ToolDynamicBanner';
import SEOJsonLdGraph from './SEOJsonLdGraph';
import SEOSnippetTables, { generatePreCalculatedRows } from './SEOSnippetTables';
import EmbedToolModal from './EmbedToolModal';
import ShareResultCard from './ShareResultCard';
import SmartOfferBanner from './SmartOfferBanner';
import MarketSentimentPoll from './MarketSentimentPoll';
import { useUserToolsMemory } from '../hooks/useUserToolsMemory';
import {
  buildFreshToolSeoMeta,
  getDeterministicRating,
} from '../lib/seo-freshness-engine';
import {
  getRelatedMatrixTools,
  getQuickSubRoutesForMaster,
  SITE_CONFIG,
} from '../lib/tools-matrix-generator';
import { useSiteConfig } from '../context/SiteConfigContext';

export default function ToolLayout({
  tool,
  allTools = [],
  onSelectTool,
  onGoHome,
  onSelectCategory,
  children,
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const { isFavoriteTool, toggleFavoriteTool } = useUserToolsMemory();

  let siteConfigCtx = null;
  try {
    siteConfigCtx = useSiteConfig();
  } catch (_err) {
    siteConfigCtx = null;
  }

  const liveRates = siteConfigCtx?.config?.liveRates || null;
  const pdfWatermarkEnabled =
    siteConfigCtx?.config?.viralFeatures?.pdfWatermarkEnabled !== false;

  // Merge any Admin overrides or Live Rates from SiteConfigContext into the active tool
  const effectiveTool = React.useMemo(() => {
    if (!tool) return null;
    if (!siteConfigCtx?.effectiveMasterTools) return tool;
    const foundOverride = siteConfigCtx.effectiveMasterTools.find(
      (m) => m.slug === tool.slug
    );
    if (foundOverride) {
      return {
        ...tool,
        ...foundOverride,
        defaultParams: {
          ...(foundOverride.defaultParams || {}),
          ...(tool.defaultParams || {}),
        },
      };
    }
    return tool;
  }, [tool, siteConfigCtx?.effectiveMasterTools]);

  const freshSeo = React.useMemo(
    () => buildFreshToolSeoMeta(effectiveTool, liveRates),
    [effectiveTool, liveRates]
  );

  const rating = React.useMemo(
    () => getDeterministicRating(effectiveTool?.slug),
    [effectiveTool?.slug]
  );

  const preCalculatedRows = React.useMemo(
    () => generatePreCalculatedRows(effectiveTool, liveRates),
    [effectiveTool, liveRates]
  );

  useEffect(() => {
    if (effectiveTool && typeof document !== 'undefined') {
      document.title = freshSeo.freshTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && freshSeo.freshDescription) {
        metaDesc.setAttribute('content', freshSeo.freshDescription);
      }
    }
  }, [effectiveTool, freshSeo]);

  if (!effectiveTool) return null;

  const isFav = isFavoriteTool(effectiveTool.slug);
  const firstSampleRow = preCalculatedRows?.[0] || null;
  const defaultShareInputs = firstSampleRow
    ? firstSampleRow.col1
    : effectiveTool.subtitle || 'المدخلات القياسية المعتمدة';
  const defaultShareResult = firstSampleRow
    ? firstSampleRow.col2
    : `${effectiveTool.shortTitle || effectiveTool.title}`;
  const defaultShareSubtitle = firstSampleRow
    ? `شامل المصنعية والرسوم التقديرية: ${firstSampleRow.col3}`
    : `محدّث بتاريخ ${freshSeo.freshness.arabicFullDate}`;

  const relatedTools =
    allTools.length > 0
      ? allTools
          .filter((item) => item.isMasterTool && item.slug !== effectiveTool.slug)
          .slice(0, 6)
      : getRelatedMatrixTools(effectiveTool, 6);

  const seoSubRoutesEnabled =
    siteConfigCtx?.config?.toolsConfig?.seoSubRoutesEnabled !== false;
  const quickSeoSubRoutes = seoSubRoutesEnabled
    ? getQuickSubRoutesForMaster(effectiveTool)
    : [];

  const handleShareUrl = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      const shareUrl = `${window.location.origin}/#/${effectiveTool.category}/${effectiveTool.slug}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <article
      dir="rtl"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7"
    >
      {/* 6-Layer Interconnected JSON-LD @graph Engine */}
      <SEOJsonLdGraph
        tool={effectiveTool}
        liveRates={liveRates}
        preCalculatedRows={preCalculatedRows}
      />

      {/* Strategic Ad Placement #1: `header_banner` */}
      <AdSlot
        placement="header_banner"
        slotId="1010192830"
        category={effectiveTool.category}
        label="إعلان أعلى الصفحة تحت الهيدر"
      />

      {/* Breadcrumbs Navigation Bar */}
      <nav
        aria-label="مسار التنقل"
        className="no-print min-h-[36px] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 border-b border-neutral-800 pb-3"
      >
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <button
              type="button"
              onClick={() => onGoHome && onGoHome()}
              className="inline-flex items-center gap-1 text-slate-300 hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>الرئيسية</span>
            </button>
          </li>
          <li aria-hidden="true">
            <ChevronLeft className="w-3.5 h-3.5 text-neutral-600" />
          </li>
          <li>
            <button
              type="button"
              onClick={() => onSelectCategory && onSelectCategory(effectiveTool.category)}
              className="hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              {effectiveTool.categoryName}
            </button>
          </li>
          <li aria-hidden="true">
            <ChevronLeft className="w-3.5 h-3.5 text-neutral-600" />
          </li>
          <li className="text-[#F3E5AB] font-semibold">
            {effectiveTool.shortTitle || effectiveTool.title}
          </li>
        </ol>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <button
            type="button"
            data-testid="tool-layout-favorite-btn"
            onClick={() => toggleFavoriteTool(effectiveTool.slug)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              isFav
                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F3E5AB] font-extrabold'
                : 'bg-[#141414] border-neutral-800 text-slate-300 hover:border-[#D4AF37]'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
            <span>{isFav ? '⭐ في أدواتي المفضلة' : '⭐ أضف للمفضلة السريعة'}</span>
          </button>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={handleShareUrl}
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-[#D4AF37] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">تم نسخ الرابط</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>نسخ رابط الأداة</span>
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Tool Header & Featured SVG Banner */}
      <header className="no-print space-y-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#D4AF37] font-semibold">
            <span>{effectiveTool.categoryName}</span>
            <span className="text-neutral-600">·</span>
            <span>{effectiveTool.subtitle}</span>
            <span className="text-neutral-600">·</span>
            <span className="font-num text-[#F3E5AB]">
              ★ {rating.ratingValue}/5 ({rating.ratingCount.toLocaleString('en-US')} تقييم)
            </span>
            <span className="text-neutral-600">·</span>
            <span className="text-emerald-400">
              محدّث: {freshSeo.freshness.arabicFullDate}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
            {effectiveTool.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-4xl leading-relaxed">
            {effectiveTool.summary}
          </p>
        </div>

        <div className="w-full min-h-[140px] sm:min-h-[220px]">
          <ToolDynamicBanner tool={effectiveTool} />
        </div>
      </header>

      {/* Strategic Ad Placement #3: `above_tool_workspace` */}
      <div className="no-print w-full">
        <AdSlot
          slotId="1010192831"
          placement="above_tool_workspace"
          category={effectiveTool.category}
          label="إعلان فوق صندوق الأداة مباشرة (above_tool_workspace)"
        />
      </div>

      {/* Main 2-Column Workspace + Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div id="tools-workspace" className="lg:col-span-8 space-y-8">
          <section
            aria-label={effectiveTool.title}
            className="rounded-2xl border border-neutral-800 bg-[#141414] p-5 sm:p-7 shadow-2xl min-h-[380px] space-y-6"
          >
            {children}

            {/* Viral Result Receipt Card Generator ("📤 مشاركة النتيجة كصورة / واتساب") */}
            <ShareResultCard
              tool={effectiveTool}
              inputsSummary={defaultShareInputs}
              resultPrimary={defaultShareResult}
              resultSubtitle={defaultShareSubtitle}
            />

            {/* Smart Offer & Affiliate Banner (Controlled via Stealth Admin Panel `DixDev`) */}
            <SmartOfferBanner
              category={effectiveTool.category}
              toolTitle={effectiveTool.shortTitle || effectiveTool.title}
            />

            {/* Printable PDF Watermark (Controlled from Stealth Admin Panel `DixDev`) */}
            {pdfWatermarkEnabled && (
              <div
                data-testid="pdf-watermark-footer"
                className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-slate-400 print:text-slate-700 print:border-slate-300"
              >
                <span className="font-bold text-[#D4AF37] print:text-black">
                  ★ تم الحساب والتوثيق عبر منصة Dix Tools (dixtools.com)
                </span>
                <span className="font-num">{freshSeo.freshness.arabicFullDate}</span>
              </div>
            )}

            {/* Strategic Ad Placement #4: `before_action_button` (High-CTR Action Proximity Slot) */}
            <AdSlot
              slotId="2020293841"
              placement="before_action_button"
              category={effectiveTool.category}
              label="إعلان بجوار منطقة الفعل والنتيجة (before_action_button)"
            />
          </section>

          {/* Automatic Backlink Magnet: Embed Tool Button & Modal */}
          <EmbedToolModal tool={effectiveTool} />

          {/* Interactive Market Sentiment Poll (Feature 7) for Gold, USD & Currency/Finance tools */}
          {siteConfigCtx?.config?.viralFeatures?.marketSentimentPollEnabled !== false &&
            ['gold', 'currencies', 'finance'].includes(effectiveTool.category) && (
              <MarketSentimentPoll tool={effectiveTool} />
            )}

          {/* Featured Snippet Tables (Position #0), TL;DR Direct Answer & LSI Keywords */}
          <SEOSnippetTables tool={effectiveTool} liveRates={liveRates} />

          {/* Step-by-Step Guide & Key Features */}
          <section
            aria-label="خطوات الاستخدام والمميزات"
            className="no-print rounded-2xl border border-neutral-800 bg-[#141414] p-6 sm:p-8 space-y-6"
          >
            <div className="space-y-1.5 border-b border-neutral-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                <span>
                  خطوات الاستخدام وطريقة الحساب في {effectiveTool.shortTitle || effectiveTool.title}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                دليل عملي للحصول على أدق النتائج الفورية مباشرة من متصفحك
              </p>
            </div>

            <ol className="space-y-3.5">
              {(effectiveTool.steps || []).map((step, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3.5 text-sm text-slate-200 leading-relaxed"
                >
                  <span className="font-num w-6 h-6 rounded-md bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3E5AB] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    0{index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <div className="pt-4 border-t border-neutral-800 space-y-3">
              <h3 className="text-base font-bold text-white">
                أبرز المميزات والمعادلات القياسية المعتمدة
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(effectiveTool.features || []).map((feat, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs sm:text-sm text-slate-300 leading-relaxed"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* FAQ Section */}
          <section
            aria-label="الأسئلة الشائعة"
            className="no-print rounded-2xl border border-neutral-800 bg-[#141414] p-6 sm:p-8 space-y-5"
          >
            <div className="space-y-1 border-b border-neutral-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#D4AF37]" />
                <span>الأسئلة الشائعة حول {effectiveTool.shortTitle || effectiveTool.title}</span>
              </h2>
              <p className="text-xs text-slate-400">
                إجابات موثقة ومربوطة تلقائياً بهيكلة البيانات المنظمة (FAQPage Schema) لمحركات البحث
              </p>
            </div>

            <div className="divide-y divide-neutral-800">
              {(effectiveTool.faqs || []).map((faq, idx) => (
                <div
                  key={idx}
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                  className="py-4 first:pt-1 last:pb-1 space-y-2"
                >
                  <h3 itemProp="name" className="text-base font-bold text-[#F3E5AB]">
                    {faq.question}
                  </h3>
                  <div
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <p itemProp="text" className="text-sm text-slate-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Compact Bottom-of-Page Quick SEO Sub-Routes */}
          {quickSeoSubRoutes.length > 0 && (
            <section
              aria-label="تحويلات سريعة شائعة"
              className="no-print rounded-2xl border border-neutral-800/80 bg-[#0F0F0F] p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-[#F3E5AB]">
                  تحويلات وإعدادات سريعة شائعة (تضبط القوائم المنسدلة تلقائياً):
                </h3>
                <span className="text-[11px] text-slate-500">روابط سريعة</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickSeoSubRoutes.map((preset) => (
                  <button
                    key={preset.slug}
                    type="button"
                    onClick={() =>
                      onSelectTool &&
                      onSelectTool(preset.category, preset.slug, preset.params)
                    }
                    className="px-3 py-1.5 rounded-xl bg-[#141414] border border-neutral-800 hover:border-[#D4AF37] text-xs font-semibold text-slate-300 hover:text-[#D4AF37] transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Left Column: Sticky Sidebar */}
        <aside className="no-print lg:col-span-4 space-y-6 lg:sticky lg:top-20">
          <div className="w-full">
            <AdSlot
              slotId="3030394853"
              placement="above_tool_workspace"
              category={effectiveTool.category}
              label="إعلان الشريط الجانبي الثابت"
            />
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-[#141414] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#D4AF37]" />
                <span>أدوات ذات صلة</span>
              </h2>
              <span className="text-xs text-slate-400">ربط داخلي تلقائي</span>
            </div>

            <div className="space-y-2.5">
              {relatedTools.map((rel) => (
                <button
                  key={rel.slug}
                  type="button"
                  onClick={() => onSelectTool && onSelectTool(rel.category, rel.slug)}
                  className="w-full text-right p-3 rounded-xl border border-neutral-800 bg-[#0A0A0A] hover:border-[#D4AF37]/60 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-[#F3E5AB] transition-colors">
                      {rel.shortTitle || rel.title}
                    </span>
                    <ArrowUpLeft className="w-4 h-4 text-slate-500 group-hover:text-[#D4AF37] shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {rel.subtitle || rel.metaDescription}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-[#141414] p-5 space-y-2.5">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#D4AF37]" />
              <span>الكلمات المفتاحية المستهدفة</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {(effectiveTool.keywords || []).join(' · ')}
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}
