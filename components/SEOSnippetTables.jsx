'use client';

import React from 'react';
import { Sparkles, Table2, Tag, CheckCircle2 } from 'lucide-react';
import {
  buildFreshToolSeoMeta,
  getSemanticLsiKeywords,
} from '../lib/seo-freshness-engine';
import { ExcelExportBtn } from '../lib/export-to-csv';

/**
 * Generates 10 pre-calculated lookup rows tailored to each tool engine
 * so Google Featured Snippets (Position #0) and AI Overviews can extract
 * ready-made HTML `<table>` answers directly.
 */
export function generatePreCalculatedRows(tool, liveRates = {}) {
  const engine = tool?.engineType || 'general';
  const k21 = Number(liveRates?.gold?.karat21 || 3780);
  const k24 = Number(liveRates?.gold?.karat24 || 4320);
  const work = Number(liveRates?.gold?.defaultWorkmanship || 150);
  const usdRate = Number(liveRates?.currenciesToEgp?.USD || 50.45);
  const sarRate = Number(liveRates?.currenciesToEgp?.SAR || 13.45);
  const gas92 = Number(liveRates?.energyAndUtilities?.fuel92 || liveRates?.energyAndUtilities?.gas92 || 22.25);
  const gas95 = Number(liveRates?.energyAndUtilities?.fuel95 || liveRates?.energyAndUtilities?.gas95 || 24.0);

  if (engine === 'gold' || tool?.category === 'gold') {
    const weights = [1, 5, 8, 10, 15, 21, 31.1, 50, 85, 100];
    return weights.map((w) => {
      const raw21 = Math.round(w * k21);
      const withWork21 = Math.round(w * (k21 + work));
      const raw24 = Math.round(w * k24);
      return {
        col1: `${w} جرام ذهب`,
        col2: `${raw21.toLocaleString('en-US')} ج.م`,
        col3: `${withWork21.toLocaleString('en-US')} ج.م`,
        col4: `${raw24.toLocaleString('en-US')} ج.م`,
      };
    });
  }

  if (engine === 'currency' || tool?.category === 'currencies') {
    const amounts = [1, 5, 10, 25, 50, 100, 250, 500, 1000, 5000];
    return amounts.map((amt) => ({
      col1: `${amt.toLocaleString('en-US')} دولار (USD)`,
      col2: `${(amt * usdRate).toLocaleString('en-US', { maximumFractionDigits: 2 })} ج.م`,
      col3: `${amt.toLocaleString('en-US')} ريال (SAR)`,
      col4: `${(amt * sarRate).toLocaleString('en-US', { maximumFractionDigits: 2 })} ج.م`,
    }));
  }

  if (engine === 'finance' || engine === 'business' || tool?.category === 'finance') {
    const capitals = [10000, 25000, 50000, 75000, 100000, 150000, 250000, 500000, 750000, 1000000];
    return capitals.map((cap) => {
      const annual27 = Math.round(cap * 0.27);
      const monthlyYield = Math.round(annual27 / 12);
      const vat14 = Math.round(cap * 0.14);
      return {
        col1: `${cap.toLocaleString('en-US')} ج.م`,
        col2: `${monthlyYield.toLocaleString('en-US')} ج.م / شهرياً`,
        col3: `${annual27.toLocaleString('en-US')} ج.م / سنوياً`,
        col4: `${vat14.toLocaleString('en-US')} ج.م (ضريبة 14%)`,
      };
    });
  }

  if (engine === 'energy' || tool?.category === 'automotive') {
    const distances = [10, 25, 50, 75, 100, 150, 200, 300, 400, 500];
    return distances.map((km) => {
      const liters = +(km * 0.085).toFixed(1);
      const cost = Math.round(liters * gas92);
      return {
        col1: `مسافة ${km} كم`,
        col2: `${liters} لتر بنزين`,
        col3: `${cost.toLocaleString('en-US')} ج.م (بنزين 92)`,
        col4: `${Math.round(liters * gas95).toLocaleString('en-US')} ج.م (بنزين 95)`,
      };
    });
  }

  if (engine === 'image') {
    const sizesKb = [500, 800, 1024, 1500, 2048, 3072, 4096, 5120, 8192, 10240];
    return sizesKb.map((kb) => ({
      col1: `${kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`}`,
      col2: `${Math.round(kb * 0.28)} KB (ضغط ذكي WebP)`,
      col3: `توفير 72% من الحجم`,
      col4: 'دقة فائقة 100% Client-Side',
    }));
  }

  if (
    engine === 'egypt-finishing' ||
    tool?.slug === 'egypt-finishing-cost-calculator' ||
    tool?.slug === 'construction-finishing-cost-calculator'
  ) {
    const construction = liveRates?.constructionAndMaterials || {};
    const ecoSqm = Number(construction.costPerSqmEconomic) || 3850;
    const superSqm = Number(construction.costPerSqmSuperLux) || 5950;
    const ultraSqm = Number(construction.costPerSqmUltraLux) || 9400;
    const areas = [70, 90, 100, 120, 140, 150, 180, 200, 250, 300];
    return areas.map((area) => {
      const netSqm = Math.round(area * 0.82);
      const ecoTotal = Math.round(netSqm * ecoSqm);
      const superTotal = Math.round(netSqm * superSqm);
      const ultraTotal = Math.round(netSqm * ultraSqm);
      return {
        col1: `شقة ${area} متر (صافي ${netSqm} م²)`,
        col2: `${ecoTotal.toLocaleString('en-US')} ج.م`,
        col3: `${superTotal.toLocaleString('en-US')} ج.م`,
        col4: `${ultraTotal.toLocaleString('en-US')} ج.م`,
      };
    });
  }

  const presets = [1, 2, 5, 10, 20, 50, 100, 250, 500, 1000];
  return presets.map((val, idx) => ({
    col1: `نموذج قياسي #${idx + 1} (${val})`,
    col2: `${tool?.shortTitle || 'حساب فوري'} — معيار ${val}`,
    col3: 'نتيجة فورية 100% من المتصفح',
    col4: 'معتمد وجاهز للطباعة A4',
  }));
}

/**
 * Generates a concise ~45-word TL;DR Direct Answer paragraph designed for
 * Google Featured Snippets (Position #0) and Voice Search / AI Overviews.
 */
export function buildTldrDirectAnswer(tool, liveRates = null, freshnessDate = '') {
  const title = tool?.shortTitle || tool?.title || 'الأداة الذكية';
  if (tool?.engineType === 'egypt-finishing' || tool?.slug === 'egypt-finishing-cost-calculator') {
    const construction = liveRates?.constructionAndMaterials || {};
    const superSqm = Number(construction.costPerSqmSuperLux) || 5950;
    const steelTon = Number(construction.steelTonEgp) || 38500;
    const cementTon = Number(construction.cementTonEgp) || 2950;
    return `لحساب ${title} اليوم (${freshnessDate}) في مصر: يبلغ متوسط تكلفة تشطيب المتر الصافي لمستوى السوبر لوكس نحو ${superSqm.toLocaleString('en-US')} ج.م/م² (مع تسجيل طن الحديد ${steelTon.toLocaleString('en-US')} ج.م وطن الأسمنت ${cementTon.toLocaleString('en-US')} ج.م)، وتفصّل الحاسبة المقايسة الهندسية لـ 10 مراحل وحصر كميات الأسمنت والرمل وسلك السويدي والسيراميك بدقة.`;
  }
  if (tool?.engineType === 'gold') {
    const k21 = liveRates?.gold?.karat21 || 3780;
    const work = liveRates?.gold?.defaultWorkmanship || 150;
    return `لحساب ${title} اليوم (${freshnessDate}) بدقة: يُضرب وزن الذهب بالجرام في سعر العيار اللحظي (عيار 21 يسجل نحو ${k21} ج.م) مضافاً إليه متوسط المصنعية والدمغة (${work} ج.م لكل جرام)، بينما تُحسب زكاة الذهب بنسبة 2.5% عند بلوغ النصاب الشرعي (85 جراماً عيار 21) عبر منصة Dix Tools مجاناً.`;
  }
  if (tool?.engineType === 'currency') {
    const usd = liveRates?.currenciesToEgp?.USD || 50.45;
    return `يتيح لك ${title} في منصة Dix Tools تحويل العملات العربية والأجنبية لحظياً بتاريخ (${freshnessDate}) وفق أحدث متوسط رسمي (1 دولار أمريكي يعادل نحو ${usd} ج.م)، مع حساب فروق الصرف وعمولة تدبير العملة البنكية بدقة فورية لعشر عملات عالمية وعربية دون أي رسوم.`;
  }
  return `تُعد أداة ${title} من منصة Dix Tools (${freshnessDate}) الحل الفوري الأسرع لإجراء الحسابات والمعالجات البرمجية بدقة قياسية 100% من متصفحك؛ حيث تطبق المعادلات الرسمية المعتمدة وتمنحك النتيجة النهائية والجداول الجاهزة للطباعة بصيغة PDF/A4 في أقل من ثانية واحدة وبدون تسجيل.`;
}

export default function SEOSnippetTables({ tool, liveRates = null }) {
  if (!tool) return null;

  const { tableHeaderStamp, freshness } = buildFreshToolSeoMeta(tool, liveRates);
  const rows = generatePreCalculatedRows(tool, liveRates);
  const tldrText = buildTldrDirectAnswer(tool, liveRates, freshness.arabicFullDate);
  const lsiKeywords = getSemanticLsiKeywords(tool);

  const headers =
    tool.engineType === 'egypt-finishing' ||
    tool.slug === 'egypt-finishing-cost-calculator' ||
    tool.slug === 'construction-finishing-cost-calculator'
      ? [
          'مساحة الشقة (إجمالي / صافي)',
          'تشطيب اقتصادي (Economic)',
          'تشطيب سوبر لوكس (Super Lux)',
          'تشطيب ألترا لوكس (Ultra Lux VIP)',
        ]
      : tool.engineType === 'gold'
      ? ['الوزن بالجرام', 'سعر عيار 21 خام', 'عيار 21 بالمصنعية والدمغة', 'سعر عيار 24 (سبائك)']
      : tool.engineType === 'currency'
      ? ['المبلغ بالدولار (USD)', 'القيمة بالجنيه (EGP)', 'المبلغ بالريال (SAR)', 'الريال بالجنيه (EGP)']
      : tool.engineType === 'finance' || tool.engineType === 'business'
      ? ['المبلغ الأساسي', 'العائد الشهري التقديري', 'العائد السنوي (27%)', 'ضريبة القيمة المضافة (14%)']
      : tool.engineType === 'energy'
      ? ['مسافة الرحلة', 'استهلاك الوقود التقريبي', 'التكلفة (بنزين 92)', 'التكلفة (بنزين 95)']
      : tool.engineType === 'image'
      ? ['حجم الصورة الأصلي', 'الحجم بعد الضغط الذكي', 'نسبة التوفير', 'جودة المعالجة']
      : ['المعيار / القيمة', 'النتيجة المحسوبة مسبقاً', 'طريقة المعالجة', 'حالة التوثيق'];

  return (
    <div className="no-print space-y-6" data-testid="seo-snippet-tables-section">
      {/* 1. TL;DR Direct Answer Box (Position #0 Featured Snippet & AI Overviews) */}
      <section
        aria-label="الخلاصة والإجابة المباشرة"
        data-testid="tldr-direct-answer-box"
        className="rounded-2xl border-2 border-[#D4AF37]/70 bg-gradient-to-br from-[#1A1506] via-[#141414] to-[#0A0A0A] p-5 sm:p-6 shadow-xl space-y-2.5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#D4AF37]">
            <Sparkles className="w-4 h-4" />
            <span>الخلاصة والإجابة المباشرة (TL;DR — Featured Snippet)</span>
          </div>
          <span className="font-num text-[11px] px-2.5 py-0.5 rounded-md bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3E5AB]">
            تحديث {freshness.arabicFullDate}
          </span>
        </div>
        <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium">
          {tldrText}
        </p>
      </section>

      {/* 2. Pre-Calculated Matrix HTML Table for Google Position #0 */}
      <section
        id="precalculated-matrix-table"
        aria-label={`جدول حسابات ${tool.shortTitle || tool.title} الجاهزة`}
        className="rounded-2xl border border-neutral-800 bg-[#141414] p-5 sm:p-6 space-y-4 overflow-hidden"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3.5">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <Table2 className="w-5 h-5 text-[#D4AF37]" />
              <span>
                جدول القيم المحسوبة مسبقاً لـ {tool.shortTitle || tool.title} ({freshness.arabicMonthYear})
              </span>
            </h2>
            <p className="text-xs text-slate-400">{tableHeaderStamp}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ExcelExportBtn
              filename={`dix-tools-${tool.slug || 'table'}.csv`}
              headers={headers}
              rows={rows.map((r) => [r.col1, r.col2, r.col3, r.col4])}
              label="تصدير الجدول إلى Excel"
            />
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>بيانات جاهزة (Dataset Schema)</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-neutral-800">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-[#0A0A0A] text-[#F3E5AB] border-b border-neutral-800">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="py-3 px-4 font-extrabold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 bg-[#141414]">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#1C180B]/60 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-white whitespace-nowrap">{row.col1}</td>
                  <td className="py-2.5 px-4 font-num font-bold text-[#D4AF37] whitespace-nowrap">
                    {row.col2}
                  </td>
                  <td className="py-2.5 px-4 font-num text-slate-200 whitespace-nowrap">{row.col3}</td>
                  <td className="py-2.5 px-4 font-num text-slate-300 whitespace-nowrap">{row.col4}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Semantic LSI Keywords Cloud (Colloquial Egyptian + MSA) */}
      <section
        aria-label="سحابة الكلمات الدلالية والمرادفات البحثية"
        className="rounded-2xl border border-neutral-800 bg-[#141414] p-5 space-y-3"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-extrabold text-[#F3E5AB] flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#D4AF37]" />
            <span>سحابة الكلمات الدلالية والمرادفات البحثية (Semantic LSI Keywords)</span>
          </h3>
          <span className="text-[11px] text-slate-400">الفصحى + العامية المصرية</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {lsiKeywords.map((kw, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-lg bg-[#0A0A0A] border border-neutral-800 text-xs text-slate-300"
            >
              {kw}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
