'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  Calculator,
  Printer,
  Share2,
  CheckCircle2,
  Layers,
  Hammer,
  PackageCheck,
  Sparkles,
} from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import {
  calculateEgyptFinishingBoq,
  numberToArabicWordsTafqeet,
} from '../src/utils/calculations';
import { ExcelExportBtn } from '../lib/export-to-csv';

const formatNum = (val, decimals = 0) => {
  const num = Number(val) || 0;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

export default function EgyptFinishingCalculator({ defaultParams = {} }) {
  let siteConfigCtx = null;
  try {
    siteConfigCtx = useSiteConfig();
  } catch (_err) {
    siteConfigCtx = null;
  }

  const liveRates = siteConfigCtx?.config?.liveRates || {};
  const constructionRates = liveRates?.constructionAndMaterials || {};
  const customVarsList = Array.isArray(liveRates?.customVariables)
    ? liveRates.customVariables
    : [];

  const getCustomVar = (key, fallbackVal) => {
    if (Number(constructionRates?.[key]) > 0) return Number(constructionRates[key]);
    const found = customVarsList.find((v) => v?.key === key);
    if (found && Number(found.value) > 0) return Number(found.value);
    return fallbackVal;
  };

  const liveConstructionRates = useMemo(
    () => ({
      steelTonEgp: getCustomVar('steelTonEgp', 38500),
      cementTonEgp: getCustomVar('cementTonEgp', 2950),
      cementBag50KgEgp: getCustomVar('cementBag50KgEgp', 148),
      sandCubicMeterEgp: getCustomVar('sandCubicMeterEgp', 240),
      gravelCubicMeterEgp: getCustomVar('gravelCubicMeterEgp', 330),
      elSewedyRollEgp: getCustomVar('elSewedyRollEgp', 1950),
      costPerSqmEconomic: getCustomVar('costPerSqmEconomic', 3850),
      costPerSqmSuperLux: getCustomVar('costPerSqmSuperLux', 5950),
      costPerSqmUltraLux: getCustomVar('costPerSqmUltraLux', 9400),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [liveRates]
  );

  // 1. Property & Condition Inputs
  const [grossAreaSqm, setGrossAreaSqm] = useState(
    Number(defaultParams.grossAreaSqm) || 150
  );
  const [netAreaRatioPercent, setNetAreaRatioPercent] = useState(
    Number(defaultParams.netAreaRatioPercent) || 82
  );
  const [propertyType, setPropertyType] = useState(
    defaultParams.propertyType || 'apartment'
  );
  const [roomsCount, setRoomsCount] = useState(Number(defaultParams.roomsCount) || 3);
  const [bathroomsCount, setBathroomsCount] = useState(
    Number(defaultParams.bathroomsCount) || 2
  );
  const [receptionPiecesCount, setReceptionPiecesCount] = useState(
    Number(defaultParams.receptionPiecesCount) || 2
  );
  const [currentCondition, setCurrentCondition] = useState(
    defaultParams.currentCondition || 'core-shell'
  );
  const [finishingGrade, setFinishingGrade] = useState(
    defaultParams.finishingGrade || 'super-lux'
  );

  // 4. Custom Checkboxes
  const [includeGypsumBoard, setIncludeGypsumBoard] = useState(true);
  const [includeAlumetal, setIncludeAlumetal] = useState(true);
  const [includeArmoredDoor, setIncludeArmoredDoor] = useState(true);
  const [includeAcPreInstall, setIncludeAcPreInstall] = useState(true);
  const [engineeringSupervisionPercent, setEngineeringSupervisionPercent] = useState(10);

  // Output Tabs: 'summary' | 'stages' | 'materials'
  const [activeResultTab, setActiveResultTab] = useState('summary');
  const [calculationPulse, setCalculationPulse] = useState(false);

  useEffect(() => {
    if (defaultParams.grossAreaSqm) setGrossAreaSqm(Number(defaultParams.grossAreaSqm));
    if (defaultParams.finishingGrade) setFinishingGrade(defaultParams.finishingGrade);
    if (defaultParams.currentCondition) setCurrentCondition(defaultParams.currentCondition);
  }, [defaultParams]);

  const boq = useMemo(
    () =>
      calculateEgyptFinishingBoq({
        grossAreaSqm,
        netAreaRatioPercent,
        propertyType,
        roomsCount,
        bathroomsCount,
        receptionPiecesCount,
        currentCondition,
        finishingGrade,
        customOptions: {
          includeGypsumBoard,
          includeAlumetal,
          includeArmoredDoor,
          includeAcPreInstall,
          engineeringSupervisionPercent,
        },
        liveConstructionRates,
      }),
    [
      grossAreaSqm,
      netAreaRatioPercent,
      propertyType,
      roomsCount,
      bathroomsCount,
      receptionPiecesCount,
      currentCondition,
      finishingGrade,
      includeGypsumBoard,
      includeAlumetal,
      includeArmoredDoor,
      includeAcPreInstall,
      engineeringSupervisionPercent,
      liveConstructionRates,
    ]
  );

  const tafqeetTotal = useMemo(
    () =>
      numberToArabicWordsTafqeet(
        Math.max(0, boq.totalEstimatedCostEgp),
        'جنيه مصري',
        'قرشاً'
      ),
    [boq.totalEstimatedCostEgp]
  );

  const excelHeaders = [
    'رقم البند',
    'اسم بند التشطيب الهندسي',
    'المواصفات الفنية المعتمدة',
    'تكلفة الخامات والمون (ج.م)',
    'تكلفة المصنعيات (ج.م)',
    'الإجمالي (ج.م)',
    'النسبة المئوية (%)',
  ];

  const excelRows = useMemo(() => {
    const stageRows = boq.stages.map((st) => [
      `بند ${st.stageNumber}`,
      st.title,
      st.specification,
      st.materialsCostEgp,
      st.laborCostEgp,
      st.totalCostEgp,
      `${st.sharePercent}%`,
    ]);
    stageRows.push([
      'الإجمالي',
      `إجمالي مقايسة تشطيب ${boq.propertyTypeLabel} (${boq.grossAreaSqm} م² — ${boq.gradeLabel})`,
      boq.conditionLabel,
      boq.totalMaterialsCostEgp,
      boq.totalLaborCostEgp,
      boq.totalEstimatedCostEgp,
      '100%',
    ]);
    return stageRows;
  }, [boq]);

  const handleShareWhatsApp = () => {
    const text = [
      `🏛️ *مقايسة تشطيب هندسية معتمدة — منصة Dix Tools*`,
      `• العقار: ${boq.propertyTypeLabel} — مساحة إجمالية ${boq.grossAreaSqm} م² (صافي ${boq.netAreaSqm} م²)`,
      `• الحالة: ${boq.conditionLabel}`,
      `• مستوى التشطيب: ${boq.gradeLabel}`,
      `• إجمالي التكلفة التقديرية: *${formatNum(boq.totalEstimatedCostEgp)} ج.م*`,
      `• ثمن الخامات والمون: ${formatNum(boq.totalMaterialsCostEgp)} ج.م (${boq.materialsSharePercent}%)`,
      `• مصنعيات الصنايعية والإشراف: ${formatNum(boq.totalLaborCostEgp)} ج.م (${boq.laborSharePercent}%)`,
      `• الكميات الأساسية: ${boq.rawMaterialsBoq.cementBags50Kg} شكارة أسمنت + ${boq.rawMaterialsBoq.sandCubicMeters} م³ رمل + ${boq.rawMaterialsBoq.totalWireRolls} لفة سلك السويدي + ${boq.rawMaterialsBoq.totalCeramicAndPorcelainSqm} م² سيراميك/بورسلين`,
      `🔗 احسب مقايسة شقتك مجاناً عبر Dix Tools: ${typeof window !== 'undefined' ? window.location.href : 'https://dixtools.com'}`,
    ].join('\n');

    if (typeof window !== 'undefined') {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      const a = document.createElement('a');
      a.href = waUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="space-y-6" data-testid="egypt-finishing-calculator">
      {/* Live Construction Material Rates Strip from Egypt Oracle */}
      <div className="no-print rounded-2xl border border-[#D4AF37]/35 bg-[#0A0A0A] p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-extrabold text-[#F3E5AB]">
            أسعار مواد البناء والتشطيب اللحظية في مصر (مربوطة بـ SiteConfigContext):
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold font-num">
          <span className="px-2.5 py-1 rounded-lg bg-[#141414] border border-[#D4AF37]/30 text-[#D4AF37]">
            طن الحديد: {formatNum(liveConstructionRates.steelTonEgp)} ج.م
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#141414] border border-emerald-500/30 text-emerald-300">
            طن الأسمنت: {formatNum(liveConstructionRates.cementTonEgp)} ج.م (الشكارة{' '}
            {formatNum(liveConstructionRates.cementBag50KgEgp)} ج.م)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#141414] border border-neutral-800 text-slate-200">
            متر الرمل: {formatNum(liveConstructionRates.sandCubicMeterEgp)} ج.م
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#141414] border border-sky-500/30 text-sky-300">
            لفة سلك السويدي: {formatNum(liveConstructionRates.elSewedyRollEgp)} ج.م
          </span>
        </div>
      </div>

      {/* SECTION 1: INTERACTIVE FINISHING CONFIGURATOR */}
      <div className="no-print rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 sm:p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3.5">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-sm sm:text-base font-black text-white">
              أولاً: مدخلات العقار، الحالة الحالية، ومستوى التشطيب الهندسي
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[90, 120, 150, 200, 300].map((presetArea) => (
              <button
                key={presetArea}
                type="button"
                data-testid={`finishing-preset-area-${presetArea}`}
                onClick={() => setGrossAreaSqm(presetArea)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-num cursor-pointer ${
                  grossAreaSqm === presetArea
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-[#141414] text-slate-300 border border-neutral-800 hover:border-[#D4AF37]/40'
                }`}
              >
                {presetArea} م²
              </button>
            ))}
          </div>
        </div>

        {/* 1. Basic Property Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-[#F3E5AB]">
              إجمالي المساحة بالمتر المربع (Gross Area m²)
            </label>
            <input
              type="number"
              min="40"
              max="3000"
              step="5"
              data-testid="finishing-gross-area-input"
              value={grossAreaSqm}
              onChange={(e) => setGrossAreaSqm(Math.max(30, Number(e.target.value)))}
              className="font-num w-full rounded-xl bg-[#141414] border border-[#D4AF37]/50 px-3.5 py-2.5 text-sm font-black text-white focus:border-[#D4AF37] focus:outline-none"
            />
            <span className="text-[11px] text-emerald-400 font-num block">
              المساحة الصافية للفرش ({netAreaRatioPercent}%): نحو {boq.netAreaSqm} م²
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              نسبة الصافي (%)
            </label>
            <select
              value={netAreaRatioPercent}
              onChange={(e) => setNetAreaRatioPercent(Number(e.target.value))}
              className="font-num w-full rounded-xl bg-[#141414] border border-neutral-800 px-3 py-2.5 text-xs font-bold text-white"
            >
              <option value={80}>80% (أبراج حديثة)</option>
              <option value={82}>82% (المتوسط القياسي)</option>
              <option value={85}>85% (نسبة هدر منخفضة)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">نوع العقار</label>
            <select
              data-testid="finishing-property-type-select"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full rounded-xl bg-[#141414] border border-neutral-800 px-3 py-2.5 text-xs font-bold text-white"
            >
              <option value="apartment">شقة سكنية</option>
              <option value="villa">فيلا / دوبلكس</option>
              <option value="shop">محل تجاري</option>
              <option value="office">مكتب إداري</option>
              <option value="building">عمارة كاملة</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              عدد الغرف + الريسبشن
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="number"
                min="1"
                max="20"
                title="عدد الغرف"
                value={roomsCount}
                onChange={(e) => setRoomsCount(Math.max(1, Number(e.target.value)))}
                className="font-num w-full rounded-xl bg-[#141414] border border-neutral-800 px-2.5 py-2 text-xs font-bold text-white text-center"
              />
              <input
                type="number"
                min="1"
                max="8"
                title="قطع الريسبشن"
                value={receptionPiecesCount}
                onChange={(e) => setReceptionPiecesCount(Math.max(1, Number(e.target.value)))}
                className="font-num w-full rounded-xl bg-[#141414] border border-neutral-800 px-2.5 py-2 text-xs font-bold text-[#D4AF37] text-center"
              />
            </div>
            <span className="text-[10px] text-slate-400 block">
              {roomsCount} غرف · ريسبشن {receptionPiecesCount} قطع
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              عدد الحمامات
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[1, 2, 3].map((bCount) => (
                <button
                  key={bCount}
                  type="button"
                  data-testid={`finishing-bath-btn-${bCount}`}
                  onClick={() => setBathroomsCount(bCount)}
                  className={`py-2 rounded-xl text-xs font-black font-num cursor-pointer ${
                    bathroomsCount === bCount
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-[#141414] text-slate-300 border border-neutral-800'
                  }`}
                >
                  {bCount === 3 ? '3+' : bCount}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Current Condition Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-extrabold text-[#F3E5AB]">
            2. الحالة الحالية للعقار (Current Condition):
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                id: 'core-shell',
                title: 'على الطوب الأحمر (Core & Shell)',
                desc: 'يشمل تأسيس كل البنود من الصفر + الطرطشة والبؤج والمحارة الكاملة',
              },
              {
                id: 'semi-finished',
                title: 'نصف تشطيب (Semi-Finished)',
                desc: 'على المحارة والحلوق — يخصم تكلفة بند المحارة والحلوق تلقائياً',
              },
              {
                id: 'renovation',
                title: 'تجديد شقة قديمة (Renovation)',
                desc: 'يضيف تلقائياً بند تكسير وإزالة السيراميك القديم ونقل المخلفات والردش',
              },
            ].map((cond) => (
              <button
                key={cond.id}
                type="button"
                data-testid={`finishing-condition-${cond.id}`}
                onClick={() => setCurrentCondition(cond.id)}
                className={`text-right rounded-2xl p-4 border transition-all cursor-pointer space-y-1 ${
                  currentCondition === cond.id
                    ? 'border-2 border-[#D4AF37] bg-[#1C1605]'
                    : 'border-neutral-800 bg-[#141414] hover:border-[#D4AF37]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-black text-white">
                    {cond.title}
                  </span>
                  {currentCondition === cond.id && (
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{cond.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Finishing Grade Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-extrabold text-[#F3E5AB]">
            3. مستوى التشطيب المطلوب (Finishing Grade):
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                id: 'economic',
                badge: `متوسط ${formatNum(liveConstructionRates.costPerSqmEconomic)} ج.م/م²`,
                title: 'تشطيب اقتصادي / استثماري (Economic)',
                desc: 'خامات عملية معتمدة: سيراميك فرز أول محلي، دهانات اقتصادية، خلاطات محلية، أبواب جاهزة',
              },
              {
                id: 'super-lux',
                badge: `الأكثر طلباً 🔥 · ${formatNum(liveConstructionRates.costPerSqmSuperLux)} ج.م/م²`,
                title: 'تشطيب سوبر لوكس (Super Lux)',
                desc: 'سلك السويدي، مواسير الشريف/بانينجر، عزل سيكا 107، سيراميك قطع ليزر كليوباترا، جوتن/GLC، جبس بورد، ألوميتال PS',
              },
              {
                id: 'ultra-lux',
                badge: `VIP فندقي · ${formatNum(liveConstructionRates.costPerSqmUltraLux)} ج.م/م²`,
                title: 'تشطيب ألترا لوكس / فندقي (Ultra Lux)',
                desc: 'بورسلين مستورد أو رخام بالريسبشن، غرف HDF، خلاطات وقواعد دفن Grohe، ألوميتال دبل جلاس UPVC، سمارت هوم',
              },
            ].map((gr) => (
              <button
                key={gr.id}
                type="button"
                data-testid={`finishing-grade-${gr.id}`}
                onClick={() => setFinishingGrade(gr.id)}
                className={`text-right rounded-2xl p-4 border transition-all cursor-pointer space-y-1.5 ${
                  finishingGrade === gr.id
                    ? 'border-2 border-[#D4AF37] bg-gradient-to-br from-[#211A05] to-[#141414] shadow-[0_0_25px_rgba(212,175,55,0.2)]'
                    : 'border-neutral-800 bg-[#141414] hover:border-[#D4AF37]/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-num text-[10px] font-black px-2.5 py-0.5 rounded-md bg-[#D4AF37]/20 text-[#F3E5AB]">
                    {gr.badge}
                  </span>
                  {finishingGrade === gr.id && (
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  )}
                </div>
                <div className="text-xs sm:text-sm font-black text-white">{gr.title}</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{gr.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Custom Checkboxes & Engineering Supervision */}
        <div className="space-y-3 pt-2 border-t border-neutral-800">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-extrabold text-[#F3E5AB]">
              4. تخصيص البنود الاختيارية ونسبة الإشراف الهندسي:
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-300 font-bold">نسبة الإشراف الهندسي:</span>
              {[0, 10, 12, 15].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  data-testid={`supervision-pct-${pct}`}
                  onClick={() => setEngineeringSupervisionPercent(pct)}
                  className={`px-2.5 py-1 rounded-lg font-num text-xs font-bold cursor-pointer ${
                    engineeringSupervisionPercent === pct
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-[#141414] text-slate-300 border border-neutral-800'
                  }`}
                >
                  {pct === 0 ? 'بدون إشراف (0%)' : `${pct}%`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[
              {
                id: 'gypsum',
                label: 'تشمل الجبس بورد والأسقف المعلقة',
                checked: includeGypsumBoard,
                toggle: () => setIncludeGypsumBoard(!includeGypsumBoard),
              },
              {
                id: 'alumetal',
                label: 'تشمل شبابيك الألوميتال / UPVC',
                checked: includeAlumetal,
                toggle: () => setIncludeAlumetal(!includeAlumetal),
              },
              {
                id: 'armored-door',
                label: 'تشمل باب شقة مصفح تركي',
                checked: includeArmoredDoor,
                toggle: () => setIncludeArmoredDoor(!includeArmoredDoor),
              },
              {
                id: 'ac-pipes',
                label: 'تشمل تأسيس مواسير التكييفات',
                checked: includeAcPreInstall,
                toggle: () => setIncludeAcPreInstall(!includeAcPreInstall),
              },
            ].map((chk) => (
              <label
                key={chk.id}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                  chk.checked
                    ? 'bg-[#141414] border-[#D4AF37]/50 text-white'
                    : 'bg-[#0A0A0A] border-neutral-800 text-slate-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={chk.checked}
                  onChange={chk.toggle}
                  className="accent-[#D4AF37] w-4 h-4"
                />
                <span>{chk.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Calculate Action CTA */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            data-testid="calculate-finishing-boq-btn"
            onClick={() => {
              setCalculationPulse(true);
              setTimeout(() => setCalculationPulse(false), 600);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-[#D4AF37] to-[#F3E5AB] text-black text-xs sm:text-sm font-black shadow-[0_10px_25px_rgba(212,175,55,0.3)] hover:brightness-105 transition-all cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            <span>احسب مقايسة التشطيب والكميات الهندسية الآن</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              data-testid="print-finishing-quotation-btn"
              onClick={() => typeof window !== 'undefined' && window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#141414] border border-[#D4AF37]/50 text-[#F3E5AB] hover:bg-[#D4AF37] hover:text-black text-xs font-extrabold transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة عرض سعر رسمي PDF (A4)</span>
            </button>

            <ExcelExportBtn
              filename={`dix-tools-finishing-boq-${boq.grossAreaSqm}sqm.csv`}
              headers={excelHeaders}
              rows={excelRows}
              label="تصدير المقايسة إلى Excel (CSV)"
            />

            <button
              type="button"
              data-testid="share-finishing-whatsapp-btn"
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30 text-xs font-extrabold transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة المقايسة واتساب</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: 3 LUXURY OUTPUT TABS */}
      <div
        className={`no-print space-y-5 transition-transform duration-300 ${
          calculationPulse ? 'scale-[1.01]' : ''
        }`}
      >
        {/* Tab Switcher */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            {
              id: 'summary',
              icon: Sparkles,
              label: '1. ملخص التكلفة المالية (Financial Summary)',
            },
            {
              id: 'stages',
              icon: Layers,
              label: '2. تفصيل البنود الـ 10 (Stage Breakdown)',
            },
            {
              id: 'materials',
              icon: PackageCheck,
              label: '3. حاسبة الكميات الخام للشراء (BOQ)',
            },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                data-testid={`finishing-tab-${tab.id}`}
                onClick={() => setActiveResultTab(tab.id)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer border ${
                  activeResultTab === tab.id
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                    : 'bg-[#0A0A0A] text-slate-200 border-neutral-800 hover:border-[#D4AF37]/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: FINANCIAL SUMMARY */}
        {activeResultTab === 'summary' && (
          <div
            data-testid="finishing-panel-summary"
            className="rounded-3xl border-2 border-[#D4AF37] bg-gradient-to-br from-[#1C1605] via-[#141414] to-[#0A0A0A] p-5 sm:p-7 shadow-2xl space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#D4AF37] text-black text-xs font-black">
                  {boq.propertyTypeLabel} {boq.grossAreaSqm} م² · {boq.gradeLabel}
                </span>
                <div className="text-xs text-slate-300 font-bold">
                  إجمالي التكلفة التقديرية للتشطيب المتكامل في مصر:
                </div>
                <div
                  data-testid="finishing-total-cost-egp"
                  className="font-num text-3xl sm:text-4xl font-black text-[#D4AF37]"
                >
                  {formatNum(boq.totalEstimatedCostEgp)} ج.م
                </div>
                <p className="text-xs text-emerald-300 font-bold">
                  {tafqeetTotal.fullLegalCheckString}
                </p>
                <div className="text-xs text-slate-300 font-num pt-1">
                  النطاق السوقي الدقيق: من{' '}
                  <strong className="text-[#F3E5AB]">
                    {formatNum(boq.minEstimatedCostEgp)} ج.م
                  </strong>{' '}
                  إلى{' '}
                  <strong className="text-[#F3E5AB]">
                    {formatNum(boq.maxEstimatedCostEgp)} ج.م
                  </strong>
                </div>
              </div>

              <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#0A0A0A] border border-neutral-800 p-4 space-y-1">
                  <span className="text-[11px] text-slate-400 block">
                    متوسط تكلفة المتر الإجمالي
                  </span>
                  <div
                    data-testid="finishing-cost-per-sqm"
                    className="font-num text-xl font-black text-white"
                  >
                    {formatNum(boq.averageCostPerGrossSqmEgp)} ج.م/م²
                  </div>
                  <span className="text-[10px] text-[#D4AF37] font-num block">
                    للمتر الصافي: {formatNum(boq.averageCostPerNetSqmEgp)} ج.م/م²
                  </span>
                </div>

                <div className="rounded-2xl bg-[#0A0A0A] border border-neutral-800 p-4 space-y-1">
                  <span className="text-[11px] text-slate-400 block">
                    المساحة الصافية والغرف
                  </span>
                  <div className="font-num text-xl font-black text-[#F3E5AB]">
                    {boq.netAreaSqm} م² صافي
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    {boq.roomsCount} غرف · {boq.bathroomsCount} حمام · ريسبشن{' '}
                    {boq.receptionPiecesCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Materials vs Labor Bar Chart */}
            <div className="rounded-2xl bg-[#0A0A0A] border border-neutral-800 p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-extrabold">
                <span className="text-[#D4AF37] font-num">
                  🧱 إجمالي ثمن الخامات والمون (Materials):{' '}
                  {formatNum(boq.totalMaterialsCostEgp)} ج.م ({boq.materialsSharePercent}%)
                </span>
                <span className="text-emerald-400 font-num">
                  👷 إجمالي مصنعيات الصنايعية والإشراف (Labor):{' '}
                  {formatNum(boq.totalLaborCostEgp)} ج.م ({boq.laborSharePercent}%)
                </span>
              </div>

              <div className="w-full h-4 rounded-full bg-neutral-900 border border-neutral-800 overflow-hidden flex">
                <div
                  className="h-full bg-gradient-to-l from-[#D4AF37] to-[#F3E5AB] transition-all duration-500"
                  style={{ width: `${boq.materialsSharePercent}%` }}
                />
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-700 transition-all duration-500"
                  style={{ width: `${boq.laborSharePercent}%` }}
                />
              </div>

              {/* Visual Bar Breakdown for Top Stages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-neutral-800/80">
                {boq.stages.map((st) => (
                  <div key={st.id} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-200 font-bold truncate">
                        {st.title.split('(')[0]}
                      </span>
                      <span className="font-num text-[#D4AF37] font-bold shrink-0">
                        {formatNum(st.totalCostEgp)} ج.م ({st.sharePercent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-neutral-900 overflow-hidden">
                      <div
                        className="h-full bg-[#D4AF37]"
                        style={{ width: `${Math.min(100, st.sharePercent * 2.5)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STAGE-BY-STAGE BREAKDOWN TABLE (10 STAGES) */}
        {activeResultTab === 'stages' && (
          <div
            data-testid="finishing-panel-stages"
            className="rounded-3xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-5 sm:p-6 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm sm:text-base font-black text-[#F3E5AB] flex items-center gap-2">
                <Hammer className="w-4 h-4 text-[#D4AF37]" />
                <span>
                  جدول تفصيل بنود التشطيب الـ 10 (خامات + مصنعيات + المواصفات الفنية)
                </span>
              </h4>
              <span className="font-num text-xs font-bold text-[#D4AF37]">
                الإجمالي: {formatNum(boq.totalEstimatedCostEgp)} ج.م
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-neutral-800">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#141414] text-[#F3E5AB] border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-3">البند الهندسي والمواصفات</th>
                    <th className="py-3 px-3 whitespace-nowrap">ثمن الخامات (ج.م)</th>
                    <th className="py-3 px-3 whitespace-nowrap">المصنعية (ج.م)</th>
                    <th className="py-3 px-3 whitespace-nowrap">إجمالي البند (ج.م)</th>
                    <th className="py-3 px-3 whitespace-nowrap">النسبة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {boq.stages.map((st) => (
                    <tr
                      key={st.id}
                      data-testid={`finishing-stage-row-${st.stageNumber}`}
                      className={`hover:bg-[#141414] transition-colors ${
                        !st.enabled ? 'opacity-50' : ''
                      }`}
                    >
                      <td className="py-3 px-3 space-y-1">
                        <div className="font-extrabold text-white">{st.title}</div>
                        <div className="text-[11px] text-slate-400">{st.specification}</div>
                      </td>
                      <td className="py-3 px-3 font-num font-bold text-slate-200 whitespace-nowrap">
                        {formatNum(st.materialsCostEgp)} ج.م
                      </td>
                      <td className="py-3 px-3 font-num font-bold text-emerald-400 whitespace-nowrap">
                        {formatNum(st.laborCostEgp)} ج.م
                      </td>
                      <td className="py-3 px-3 font-num font-black text-[#D4AF37] whitespace-nowrap">
                        {formatNum(st.totalCostEgp)} ج.م
                      </td>
                      <td className="py-3 px-3 font-num font-bold text-[#F3E5AB] whitespace-nowrap">
                        {st.sharePercent}%
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#141414] border-t-2 border-[#D4AF37]/50 font-black text-xs">
                  <tr>
                    <td className="py-3.5 px-3 text-white">
                      الإجمالي الكلي للمقايسة ({boq.grossAreaSqm} م² — {boq.gradeLabel})
                    </td>
                    <td className="py-3.5 px-3 font-num text-[#F3E5AB]">
                      {formatNum(boq.totalMaterialsCostEgp)} ج.م
                    </td>
                    <td className="py-3.5 px-3 font-num text-emerald-400">
                      {formatNum(boq.totalLaborCostEgp)} ج.م
                    </td>
                    <td className="py-3.5 px-3 font-num text-base text-[#D4AF37]">
                      {formatNum(boq.totalEstimatedCostEgp)} ج.م
                    </td>
                    <td className="py-3.5 px-3 font-num text-white">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: RAW MATERIALS ESTIMATOR (BOQ) */}
        {activeResultTab === 'materials' && (
          <div
            data-testid="finishing-panel-materials"
            className="rounded-3xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-5 sm:p-6 space-y-5"
          >
            <div className="space-y-1 border-b border-neutral-800 pb-3">
              <h4 className="text-sm sm:text-base font-black text-[#F3E5AB]">
                حاسبة الكميات الخام الفعلية المطلوبة للشراء (Engineering Raw Materials BOQ)
              </h4>
              <p className="text-xs text-slate-400">
                محسوبة هندسياً لمساحة {boq.grossAreaSqm} م² (صافي {boq.netAreaSqm} م²) وعدد{' '}
                {boq.roomsCount} غرف و{boq.bathroomsCount} حمام
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Cement & Sand */}
              <div className="rounded-2xl border border-neutral-800 bg-[#141414] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-black text-[#D4AF37]">
                    1. الأسمنت البورتلاندي والرمل (للمحارة والسيراميك)
                  </span>
                  <span className="font-num text-xs font-bold text-emerald-400">
                    ~ {formatNum(boq.rawMaterialsBoq.estimatedCementAndSandCostEgp)} ج.م
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-[#0A0A0A] border border-neutral-800 p-3">
                    <span className="text-slate-400 block">شكاير الأسمنت (50 كجم)</span>
                    <span
                      data-testid="boq-cement-bags"
                      className="font-num text-lg font-black text-white"
                    >
                      {boq.rawMaterialsBoq.cementBags50Kg} شكارة
                    </span>
                  </div>
                  <div className="rounded-xl bg-[#0A0A0A] border border-neutral-800 p-3">
                    <span className="text-slate-400 block">أمتار الرمل المطلوبة</span>
                    <span
                      data-testid="boq-sand-m3"
                      className="font-num text-lg font-black text-[#F3E5AB]"
                    >
                      {boq.rawMaterialsBoq.sandCubicMeters} م³ رمل
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. El-Sewedy Electrical Wires */}
              <div className="rounded-2xl border border-neutral-800 bg-[#141414] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-black text-[#D4AF37]">
                    2. لفات أسلاك الكهرباء المعتمدة (السويدي — لفة 100 متر)
                  </span>
                  <span className="font-num text-xs font-bold text-emerald-400">
                    الإجمالي: {boq.rawMaterialsBoq.totalWireRolls} لفة (~{' '}
                    {formatNum(boq.rawMaterialsBoq.estimatedWiresCostEgp)} ج.م)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-xl bg-[#0A0A0A] border border-neutral-800 p-3">
                    <span className="text-[11px] text-slate-400 block">1.5 مم (إنارة)</span>
                    <span className="font-num text-base font-black text-white">
                      {boq.rawMaterialsBoq.wire15mmRolls} لفات
                    </span>
                  </div>
                  <div className="rounded-xl bg-[#0A0A0A] border border-neutral-800 p-3">
                    <span className="text-[11px] text-slate-400 block">2 و3 مم (برايز)</span>
                    <span className="font-num text-base font-black text-[#F3E5AB]">
                      {boq.rawMaterialsBoq.wire2mmAnd3mmRolls} لفات
                    </span>
                  </div>
                  <div className="rounded-xl bg-[#0A0A0A] border border-neutral-800 p-3">
                    <span className="text-[11px] text-slate-400 block">4 و6 مم (تكييف)</span>
                    <span className="font-num text-base font-black text-emerald-400">
                      {boq.rawMaterialsBoq.wire4mmAnd6mmRolls} لفات
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Ceramic & Porcelain */}
              <div className="rounded-2xl border border-neutral-800 bg-[#141414] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-black text-[#D4AF37]">
                    3. السيراميك والبورسلين (شامل 10% هالك ووزرة)
                  </span>
                  <span className="font-num text-xs font-bold text-[#F3E5AB]">
                    الإجمالي: {boq.rawMaterialsBoq.totalCeramicAndPorcelainSqm} م²
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-[#0A0A0A] border border-neutral-800 p-3">
                    <span className="text-slate-400 block">أرضيات الغرف والريسبشن</span>
                    <span className="font-num text-lg font-black text-white">
                      {boq.rawMaterialsBoq.flooringSqmWithWaste} م²
                    </span>
                  </div>
                  <div className="rounded-xl bg-[#0A0A0A] border border-neutral-800 p-3">
                    <span className="text-slate-400 block">حوائط وأرضيات الحمام والمطبخ</span>
                    <span className="font-num text-lg font-black text-emerald-400">
                      {boq.rawMaterialsBoq.wallsBathKitchenSqm} م²
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Painting Materials */}
              <div className="rounded-2xl border border-neutral-800 bg-[#141414] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-black text-[#D4AF37]">
                    4. مواد النقاشة والدهانات (جوتن / GLC)
                  </span>
                  <span className="text-[11px] text-slate-400">بستلات 15–20 كجم</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-xl bg-[#0A0A0A] border border-neutral-800 p-3">
                    <span className="text-[11px] text-slate-400 block">سيلر مائي</span>
                    <span className="font-num text-base font-black text-white">
                      {boq.rawMaterialsBoq.sealerPails} بستلة
                    </span>
                  </div>
                  <div className="rounded-xl bg-[#0A0A0A] border border-neutral-800 p-3">
                    <span className="text-[11px] text-slate-400 block">معجون جاهز</span>
                    <span className="font-num text-base font-black text-[#F3E5AB]">
                      {boq.rawMaterialsBoq.puttyPails} بستلة
                    </span>
                  </div>
                  <div className="rounded-xl bg-[#0A0A0A] border border-neutral-800 p-3">
                    <span className="text-[11px] text-slate-400 block">بلاستيك تشطيب</span>
                    <span className="font-num text-base font-black text-emerald-400">
                      {boq.rawMaterialsBoq.emulsionPaintPails} بستلة
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PRINT-READY A4 OFFICIAL FINISHING QUOTATION SHEET */}
      <div className="hidden print:block print-only-sheet rounded-2xl bg-white text-slate-950 p-8 border-2 border-slate-900 space-y-4">
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
          <div>
            <h2 className="text-xl font-black">
              مقايسة تشطيب هندسية وعرض سعر رسمي (A4 Official BOQ)
            </h2>
            <p className="text-xs text-slate-600">
              {boq.propertyTypeLabel} · المساحة: {boq.grossAreaSqm} م² · {boq.gradeLabel}
            </p>
          </div>
          <div className="text-left text-xs font-bold">
            <div>منصة Dix Tools الهندسية</div>
            <div dir="ltr">dixtools.com</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs border border-slate-300 p-3 rounded-lg">
          <div>
            <strong>إجمالي المقايسة:</strong> {formatNum(boq.totalEstimatedCostEgp)} ج.م
          </div>
          <div>
            <strong>إجمالي الخامات:</strong> {formatNum(boq.totalMaterialsCostEgp)} ج.م
          </div>
          <div>
            <strong>إجمالي المصنعيات:</strong> {formatNum(boq.totalLaborCostEgp)} ج.م
          </div>
        </div>

        <table className="w-full text-right text-xs border-collapse border border-slate-400">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-400">
              <th className="p-2 border border-slate-300">البند الهندسي</th>
              <th className="p-2 border border-slate-300">الخامات</th>
              <th className="p-2 border border-slate-300">المصنعية</th>
              <th className="p-2 border border-slate-300">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {boq.stages.map((st) => (
              <tr key={st.id} className="border-b border-slate-300">
                <td className="p-2 border border-slate-300 font-bold">{st.title}</td>
                <td className="p-2 border border-slate-300 font-num">
                  {formatNum(st.materialsCostEgp)} ج.م
                </td>
                <td className="p-2 border border-slate-300 font-num">
                  {formatNum(st.laborCostEgp)} ج.م
                </td>
                <td className="p-2 border border-slate-300 font-num font-bold">
                  {formatNum(st.totalCostEgp)} ج.م
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
