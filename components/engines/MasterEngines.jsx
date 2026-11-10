'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowLeftRight,
  Download,
  Printer,
  Copy,
  Check,
  Upload,
  Sparkles,
  FileText,
  Scale,
  Calculator,
  ShieldCheck,
  Link2,
} from 'lucide-react';
import AdSlot from '../AdSlot';
import { useSiteConfig } from '../../context/SiteConfigContext';
import {
  CURRENCY_LIST,
  GOLD_KARATS,
  GOLD_WEIGHTS,
  GOLD_MARKETS,
  UNIT_FAMILIES,
  FUEL_GRADES,
} from '../../lib/tools-matrix-generator';
import {
  calculateZakatAndGold,
  calculateFuelTrip,
  calculateLoanSchedule,
  calculateCertificateProfit,
  calculateGoldWorkmanship,
  calculateCurrencyConversion,
  numberToArabicWordsTafqeet,
  calculateIslamicInheritance,
  calculateInvestmentComparison,
  calculateVehicleMaintenanceSchedule,
  EGYPT_27_GOVERNORATES,
  generateBarcodeBars,
  calculateShippingAwbSummary,
  evaluateCustomToolFormula,
  calculateEgyptInterGovernorateTrip,
} from '../../src/utils/calculations';
import { generateQrMatrix } from '../../src/utils/qrMatrix';
import LiveCameraScanner from '../LiveCameraScanner';
import BatchProcessorEngine from '../BatchProcessorEngine';
import EgyptFinishingCalculator from '../EgyptFinishingCalculator';
import ExpandedMasterEngines, { EXPANDED_48_SLUGS } from './ExpandedMasterEngines';
import ProductPromoStudio from '../tools/ProductPromoStudio';
import { ExcelExportBtn } from '../../lib/export-to-csv';

const formatNum = (val, decimals = 2) => {
  const num = Number(val) || 0;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

/**
 * Helper to parse URL query parameters from either `window.location.search`
 * or hash query string (`#/currencies/comprehensive-currency-converter?from=USD&to=EGP&amount=250`)
 */
export function parseUrlQueryParams() {
  if (typeof window === 'undefined') return {};
  const result = {};
  const searchPart = window.location.search || '';
  const hashPart = window.location.hash.includes('?')
    ? window.location.hash.slice(window.location.hash.indexOf('?'))
    : '';
  const combined = searchPart || hashPart;
  if (!combined) return result;
  const params = new URLSearchParams(combined);
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

/* ============================================================================
 * 1. COMPREHENSIVE CURRENCY MASTER ENGINE (`engineType === 'currency'`)
 * Single unified hub with dropdowns for all 28 currencies, swap button, and URL query sync
 * ========================================================================== */
export function CurrencyMasterEngine({ defaultParams = {} }) {
  const [fromCode, setFromCode] = useState(defaultParams.fromCode || 'USD');
  const [toCode, setToCode] = useState(defaultParams.toCode || 'EGP');
  const [amount, setAmount] = useState(defaultParams.amount || 100);
  const [customRate, setCustomRate] = useState(defaultParams.defaultRate || 50.45);
  const [isManualRate, setIsManualRate] = useState(false);
  const [bankFeePercent, setBankFeePercent] = useState(0);

  useEffect(() => {
    const q = parseUrlQueryParams();
    const nextFrom = q.from || defaultParams.fromCode || 'USD';
    const nextTo = q.to || defaultParams.toCode || 'EGP';
    const nextAmt = q.amount ? Number(q.amount) : defaultParams.amount || 100;

    setFromCode(nextFrom);
    setToCode(nextTo);
    setAmount(nextAmt);
    setIsManualRate(false);
  }, [defaultParams]);

  const computeDefaultRate = (fCode, tCode) => {
    const f = CURRENCY_LIST.find((c) => c.code === fCode) || CURRENCY_LIST[0];
    const t = CURRENCY_LIST.find((c) => c.code === tCode) || CURRENCY_LIST[1];
    return Number((f.rateToEgp / t.rateToEgp).toFixed(4));
  };

  const activeRate = isManualRate ? customRate : computeDefaultRate(fromCode, toCode);
  const result = useMemo(
    () => calculateCurrencyConversion(amount, activeRate, bankFeePercent),
    [amount, activeRate, bankFeePercent]
  );

  const handleSwap = () => {
    const nextFrom = toCode;
    const nextTo = fromCode;
    setFromCode(nextFrom);
    setToCode(nextTo);
    setIsManualRate(false);
  };

  return (
    <div className="space-y-6">
      {/* Quick Popular Currency Pairs Bar inside the Master Tool */}
      <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-neutral-800">
        <span className="text-xs font-bold text-slate-400">أزواج العملات الأكثر تداولاً:</span>
        {[
          { f: 'USD', t: 'EGP', label: 'دولار ⇄ جنيه' },
          { f: 'SAR', t: 'EGP', label: 'ريال سعودي ⇄ جنيه' },
          { f: 'AED', t: 'EGP', label: 'درهم إماراتي ⇄ جنيه' },
          { f: 'KWD', t: 'EGP', label: 'دينار كويتي ⇄ جنيه' },
          { f: 'EUR', t: 'EGP', label: 'يورو ⇄ جنيه' },
          { f: 'USD', t: 'SAR', label: 'دولار ⇄ ريال' },
        ].map((pair) => (
          <button
            key={`${pair.f}-${pair.t}`}
            type="button"
            onClick={() => {
              setFromCode(pair.f);
              setToCode(pair.t);
              setIsManualRate(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              fromCode === pair.f && toCode === pair.t
                ? 'bg-[#D4AF37] text-black'
                : 'bg-[#0A0A0A] text-slate-300 border border-neutral-800 hover:border-[#D4AF37]'
            }`}
          >
            {pair.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-end">
        <div className="md:col-span-5 space-y-2">
          <label htmlFor="fx-master-from" className="block text-xs font-bold text-slate-200">
            من العملة الأساسية (اختر من 28 عملة)
          </label>
          <select
            id="fx-master-from"
            value={fromCode}
            onChange={(e) => {
              setFromCode(e.target.value);
              setIsManualRate(false);
            }}
            className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          >
            {CURRENCY_LIST.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name} ({c.symbol})
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1 flex justify-center">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="تبديل العملتين"
            className="p-2.5 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors cursor-pointer"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        <div className="md:col-span-5 space-y-2">
          <label htmlFor="fx-master-to" className="block text-xs font-bold text-slate-200">
            إلى العملة المستهدفة (اختر من 28 عملة)
          </label>
          <select
            id="fx-master-to"
            value={toCode}
            onChange={(e) => {
              setToCode(e.target.value);
              setIsManualRate(false);
            }}
            className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          >
            {CURRENCY_LIST.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name} ({c.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-2">
          <label htmlFor="fx-master-amt" className="block text-xs font-bold text-[#F3E5AB]">
            المبلغ المراد تحويله ({fromCode})
          </label>
          <input
            id="fx-master-amt"
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="fx-master-rate" className="block text-xs font-bold text-slate-200">
            سعر الصرف (1 {fromCode} = ? {toCode})
          </label>
          <input
            id="fx-master-rate"
            type="number"
            min="0.00001"
            step="any"
            value={activeRate}
            onChange={(e) => {
              setIsManualRate(true);
              setCustomRate(Number(e.target.value));
            }}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="fx-master-fee" className="block text-xs font-bold text-slate-200">
            عمولة البنك / تدبير العملة (%)
          </label>
          <input
            id="fx-master-fee"
            type="number"
            min="0"
            max="35"
            step="0.5"
            value={bankFeePercent}
            onChange={(e) => setBankFeePercent(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>
      </div>

      {/* Result Box */}
      <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs text-slate-400 block">
            نتيجة التحويل الفوري ({formatNum(amount)} {fromCode} إلى {toCode})
          </span>
          <div className="font-num text-2xl sm:text-3xl font-extrabold text-[#D4AF37]">
            {formatNum(result.convertedAmount)} <small className="text-sm">{toCode}</small>
          </div>
        </div>
        <div className="text-xs text-slate-300 space-y-1 sm:text-left">
          <div>
            المعدل العكسي:{' '}
            <span className="font-num">
              1 {toCode} = {result.inverseExchangeRate} {fromCode}
            </span>
          </div>
          {bankFeePercent > 0 && (
            <div className="text-emerald-400">
              شامل عمولة البنك ({bankFeePercent}%):{' '}
              <strong className="font-num">
                {formatNum(result.totalWithFee)} {toCode}
              </strong>
            </div>
          )}
        </div>
      </div>

      <AdSlot slotId="2020293842" placement="post-result" label="إعلان أسفل محرك العملات" />

      {/* Multipliers Table */}
      <div className="overflow-x-auto rounded-xl border border-neutral-800">
        <table className="w-full text-right text-xs sm:text-sm">
          <thead className="bg-neutral-900 text-slate-300 border-b border-neutral-800">
            <tr>
              <th className="py-3 px-4 font-bold">الفئة النقدية</th>
              <th className="py-3 px-4 font-bold">
                من {fromCode} إلى {toCode}
              </th>
              <th className="py-3 px-4 font-bold">
                من {toCode} إلى {fromCode}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 bg-[#0A0A0A]">
            {result.multipliersTable.map((row) => (
              <tr key={row.baseAmount}>
                <td className="py-2.5 px-4 font-num font-bold text-[#F3E5AB]">
                  {formatNum(row.baseAmount, 0)}
                </td>
                <td className="py-2.5 px-4 font-num text-white">
                  {formatNum(row.fromToTarget)} {toCode}
                </td>
                <td className="py-2.5 px-4 font-num text-slate-300">
                  {formatNum(row.targetToFrom, 4)} {fromCode}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================================
 * 2. COMPREHENSIVE GOLD, BULLION & ZAKAT ENGINE (`engineType === 'gold'`)
 * ========================================================================== */
export function GoldMasterEngine({ defaultParams = {} }) {
  const [currencySymbol, setCurrencySymbol] = useState(defaultParams.currencySymbol || 'ج.م');
  const [baseKarat21Price, setBaseKarat21Price] = useState(
    defaultParams.baseKarat21Price || 3780
  );
  const [selectedKarat, setSelectedKarat] = useState(defaultParams.selectedKarat || 21);
  const [weightGrams, setWeightGrams] = useState(defaultParams.weightGrams || 8);
  const [workmanshipPerGram, setWorkmanshipPerGram] = useState(
    defaultParams.workmanshipPerGram || 110
  );
  const [stampAndTaxPerGram, setStampAndTaxPerGram] = useState(25);
  const [cashbackPercent, setCashbackPercent] = useState(defaultParams.cashbackPercent ?? 45);
  const [cashSavings, setCashSavings] = useState(defaultParams.cashSavings || 0);

  useEffect(() => {
    const q = parseUrlQueryParams();
    if (q.karat) setSelectedKarat(Number(q.karat));
    else if (defaultParams.selectedKarat) setSelectedKarat(defaultParams.selectedKarat);

    if (q.weight) setWeightGrams(Number(q.weight));
    else if (defaultParams.weightGrams) setWeightGrams(defaultParams.weightGrams);

    if (defaultParams.currencySymbol) setCurrencySymbol(defaultParams.currencySymbol);
    if (defaultParams.baseKarat21Price) setBaseKarat21Price(defaultParams.baseKarat21Price);
    if (defaultParams.workmanshipPerGram !== undefined)
      setWorkmanshipPerGram(defaultParams.workmanshipPerGram);
    if (defaultParams.cashSavings !== undefined) setCashSavings(defaultParams.cashSavings);
  }, [defaultParams]);

  const goldRes = useMemo(
    () =>
      calculateGoldWorkmanship({
        baseKarat21Price,
        selectedKarat: [24, 22, 21, 18, 14].includes(selectedKarat) ? selectedKarat : 21,
        weightGrams,
        workmanshipPerGram,
        stampAndTaxPerGram,
        cashbackPercentOnResale: cashbackPercent,
        dealerBuySpreadPerGram: 25,
      }),
    [
      baseKarat21Price,
      selectedKarat,
      weightGrams,
      workmanshipPerGram,
      stampAndTaxPerGram,
      cashbackPercent,
    ]
  );

  const zakatRes = useMemo(
    () =>
      calculateZakatAndGold({
        gold24PricePerGram: goldRes.price24,
        cashAndSavings: cashSavings,
        stocksAndInvestments: 0,
        businessInventory: 0,
        gold24Grams: (weightGrams * selectedKarat) / 24,
        gold21Grams: 0,
        gold18Grams: 0,
        liabilitiesAndDebts: 0,
      }),
    [goldRes.price24, cashSavings, weightGrams, selectedKarat]
  );

  return (
    <div className="space-y-6">
      {/* Market Presets + Bullion Weight Quick Selector */}
      <div className="space-y-3 pb-4 border-b border-neutral-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400">اختر سوق الذهب:</span>
          {GOLD_MARKETS.map((m) => (
            <button
              key={m.code}
              type="button"
              onClick={() => {
                setCurrencySymbol(m.currency);
                setBaseKarat21Price(m.base21Price);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                currencySymbol === m.currency
                  ? 'bg-[#D4AF37] text-black'
                  : 'bg-[#0A0A0A] text-slate-300 border border-neutral-800 hover:border-[#D4AF37]'
              }`}
            >
              {m.country} ({m.currency})
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400">أوزان السبائك والعملات القياسية:</span>
          {GOLD_WEIGHTS.slice(0, 10).map((w) => (
            <button
              key={w.slug}
              type="button"
              onClick={() => setWeightGrams(w.weight)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                weightGrams === w.weight
                  ? 'bg-[#F3E5AB] text-black'
                  : 'bg-[#0A0A0A] text-slate-300 border border-neutral-800 hover:border-[#D4AF37]'
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-2">
          <label htmlFor="gold-m-p21" className="block text-xs font-bold text-[#F3E5AB]">
            سعر جرام عيار 21 الخام ({currencySymbol})
          </label>
          <input
            id="gold-m-p21"
            type="number"
            min="1"
            step="any"
            value={baseKarat21Price}
            onChange={(e) => setBaseKarat21Price(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="gold-m-karat" className="block text-xs font-bold text-slate-200">
            العيار المختار (جميع الأعيرة)
          </label>
          <select
            id="gold-m-karat"
            value={selectedKarat}
            onChange={(e) => setSelectedKarat(Number(e.target.value))}
            className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          >
            {GOLD_KARATS.map((k) => (
              <option key={k.karat} value={k.karat}>
                {k.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="gold-m-weight" className="block text-xs font-bold text-slate-200">
            الوزن بالجرام (جم)
          </label>
          <input
            id="gold-m-weight"
            type="number"
            min="0.1"
            step="any"
            value={weightGrams}
            onChange={(e) => setWeightGrams(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="gold-m-work" className="block text-xs font-bold text-slate-200">
            المصنعية والدمغة للجرام ({currencySymbol})
          </label>
          <input
            id="gold-m-work"
            type="number"
            min="0"
            step="any"
            value={workmanshipPerGram}
            onChange={(e) => setWorkmanshipPerGram(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="gold-m-cb" className="block text-xs font-bold text-emerald-400">
            نسبة الكاش باك عند إعادة البيع (%)
          </label>
          <input
            id="gold-m-cb"
            type="number"
            min="0"
            max="100"
            value={cashbackPercent}
            onChange={(e) => setCashbackPercent(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="gold-m-cash" className="block text-xs font-bold text-slate-200">
            مدخرات نقدية إضافية لحساب الزكاة ({currencySymbol})
          </label>
          <input
            id="gold-m-cash"
            type="number"
            min="0"
            step="any"
            value={cashSavings}
            onChange={(e) => setCashSavings(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>
      </div>

      {/* Live Prices Across All Karats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {[
          { label: 'عيار 24', val: goldRes.price24 },
          { label: 'عيار 22', val: goldRes.price22 },
          { label: 'عيار 21', val: goldRes.price21 },
          { label: 'عيار 18', val: goldRes.price18 },
          { label: 'الجنيه الذهب (8g)', val: goldRes.goldCoin8gRawPrice },
        ].map((item) => (
          <div
            key={item.label}
            className="p-3 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-center"
          >
            <span className="text-[11px] text-slate-400 block">{item.label}</span>
            <span className="font-num text-sm font-extrabold text-[#F3E5AB]">
              {formatNum(item.val)} {currencySymbol}
            </span>
          </div>
        ))}
      </div>

      {/* Result Summary Box */}
      <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-5 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-neutral-800 pb-4">
          <div>
            <span className="text-xs text-slate-400 block">
              قيمة الذهب الخام ({weightGrams} جم عيار {selectedKarat})
            </span>
            <span className="font-num text-xl font-bold text-white">
              {formatNum(goldRes.rawGoldTotalValue)} {currencySymbol}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">إجمالي المصنعية والدمغة</span>
            <span className="font-num text-xl font-bold text-amber-400">
              {formatNum(goldRes.totalWorkmanshipAndTax)} {currencySymbol}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">إجمالي تكلفة الشراء بالمصنعية</span>
            <span className="font-num text-2xl font-extrabold text-[#D4AF37]">
              {formatNum(goldRes.totalPurchaseCost)} {currencySymbol}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">صافي البيع المتوقع (شامل الكاش باك):</span>
            <strong className="font-num text-sm text-emerald-400">
              {formatNum(goldRes.netResaleValue)} {currencySymbol}
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block">مكافئ الذهب الخالص عيار 24:</span>
            <strong className="font-num text-sm text-white">
              {formatNum(zakatRes.pureGold24EquivalentGrams)} جم (النصاب 85 جم)
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block">زكاة الذهب والمال المستحقة (2.5%):</span>
            <strong className="font-num text-sm text-[#F3E5AB]">
              {zakatRes.isEligibleForZakat
                ? `${formatNum(zakatRes.totalZakatDue)} ${currencySymbol}`
                : `لم يبلغ النصاب (${zakatRes.nisabCompletionPercent}%)`}
            </strong>
          </div>
        </div>
      </div>

      <AdSlot slotId="2020293842" placement="post-result" label="إعلان أسفل محرك الذهب" />
    </div>
  );
}

/* ============================================================================
 * 3. ARABIC FINANCIAL TAFQEET ENGINE (`engineType === 'tafqeet'`)
 * محول الأرقام إلى حروف باللغة العربية للشيكات والعقود والفواتير
 * ========================================================================== */
export function TafqeetMasterEngine({ defaultParams = {} }) {
  const [amount, setAmount] = useState(defaultParams.amount || 125450.75);
  const [currencyIndex, setCurrencyIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const CURRENCY_TAFQEET_OPTIONS = [
    { main: 'جنيه مصري', sub: 'قرشاً', code: 'EGP' },
    { main: 'ريال سعودي', sub: 'هللة', code: 'SAR' },
    { main: 'درهم إماراتي', sub: 'فلساً', code: 'AED' },
    { main: 'دينار كويتي', sub: 'فلساً', code: 'KWD' },
    { main: 'دولار أمريكي', sub: 'سنتاً', code: 'USD' },
    { main: 'يورو أوروبي', sub: 'سنتاً', code: 'EUR' },
  ];

  useEffect(() => {
    const q = parseUrlQueryParams();
    if (q.amount) setAmount(Number(q.amount));
    else if (defaultParams.amount) setAmount(defaultParams.amount);
  }, [defaultParams]);

  const activeCurr = CURRENCY_TAFQEET_OPTIONS[currencyIndex] || CURRENCY_TAFQEET_OPTIONS[0];
  const tafqeetRes = useMemo(
    () => numberToArabicWordsTafqeet(amount, activeCurr.main, activeCurr.sub),
    [amount, activeCurr]
  );

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(tafqeetRes.fullLegalCheckString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label htmlFor="tafqeet-amt" className="block text-xs font-bold text-[#F3E5AB]">
            أدخل المبلغ المالي بالأرقام (يدعم الكسور العشرية)
          </label>
          <input
            id="tafqeet-amt"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-3 text-base text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="tafqeet-curr" className="block text-xs font-bold text-slate-200">
            اختر العملة المالية ووحدة الكسر
          </label>
          <select
            id="tafqeet-curr"
            value={currencyIndex}
            onChange={(e) => setCurrencyIndex(Number(e.target.value))}
            className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          >
            {CURRENCY_TAFQEET_OPTIONS.map((c, idx) => (
              <option key={c.code} value={idx}>
                {c.main} ({c.code}) — الكسر: {c.sub}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-[#D4AF37]/50 bg-[#0A0A0A] p-6 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-[#D4AF37]">
            الصيغة القانونية المعتمدة للشيكات والعقود والفواتير:
          </span>
          <span className="font-num text-xs text-slate-400">
            #{tafqeetRes.numericFormatted} {activeCurr.code}#
          </span>
        </div>

        <p
          data-testid="tafqeet-output-text"
          className="text-lg sm:text-2xl font-extrabold text-white leading-relaxed bg-[#141414] p-4 rounded-xl border border-neutral-800"
        >
          {tafqeetRes.fullLegalCheckString}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <span className="text-xs text-slate-400">
            الجزء الصحيح: <strong className="text-slate-200">{tafqeetRes.integerPartWords}</strong>
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs font-extrabold hover:bg-[#e5c247] cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'تم نسخ نص التفقيط بنجاح' : 'نسخ نص التفقيط للشيك أو العقد'}</span>
          </button>
        </div>
      </div>

      <AdSlot slotId="2020293842" placement="post-result" label="إعلان أسفل محرك التفقيط" />
    </div>
  );
}

/* ============================================================================
 * 4. ISLAMIC SHARIA INHERITANCE ENGINE (`engineType === 'inheritance'`)
 * حاسبة تقسيم الميراث الشرعي والأنصبة
 * ========================================================================== */
export function InheritanceMasterEngine({ defaultParams = {} }) {
  const [estateGrossValue, setEstateGrossValue] = useState(
    defaultParams.estateGrossValue || 1200000
  );
  const [debtsAndFuneralExpenses, setDebtsAndFuneralExpenses] = useState(0);
  const [bequestAmount, setBequestAmount] = useState(0);
  const [hasHusband, setHasHusband] = useState(false);
  const [wivesCount, setWivesCount] = useState(defaultParams.wivesCount ?? 1);
  const [sonsCount, setSonsCount] = useState(defaultParams.sonsCount ?? 2);
  const [daughtersCount, setDaughtersCount] = useState(defaultParams.daughtersCount ?? 1);
  const [hasFather, setHasFather] = useState(false);
  const [hasMother, setHasMother] = useState(true);

  useEffect(() => {
    const q = parseUrlQueryParams();
    if (q.estate) setEstateGrossValue(Number(q.estate));
    else if (defaultParams.estateGrossValue)
      setEstateGrossValue(defaultParams.estateGrossValue);
  }, [defaultParams]);

  const inhRes = useMemo(
    () =>
      calculateIslamicInheritance({
        estateGrossValue,
        debtsAndFuneralExpenses,
        bequestAmount,
        hasHusband,
        wivesCount,
        sonsCount,
        daughtersCount,
        hasFather,
        hasMother,
      }),
    [
      estateGrossValue,
      debtsAndFuneralExpenses,
      bequestAmount,
      hasHusband,
      wivesCount,
      sonsCount,
      daughtersCount,
      hasFather,
      hasMother,
    ]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#F3E5AB]">إجمالي قيمة التركة (ج.م)</label>
          <input
            type="number"
            min="0"
            value={estateGrossValue}
            onChange={(e) => setEstateGrossValue(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">الديون وتكاليف التجهيز</label>
          <input
            type="number"
            min="0"
            value={debtsAndFuneralExpenses}
            onChange={(e) => setDebtsAndFuneralExpenses(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">
            الوصية الشرعية (حد أقصى الثلث)
          </label>
          <input
            type="number"
            min="0"
            value={bequestAmount}
            onChange={(e) => setBequestAmount(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-4 rounded-2xl bg-[#0A0A0A] border border-neutral-800">
        <div>
          <label className="text-xs text-slate-400 block mb-1">عدد الأبناء الذكور</label>
          <input
            type="number"
            min="0"
            max="20"
            value={sonsCount}
            onChange={(e) => setSonsCount(Number(e.target.value))}
            className="font-num w-full rounded-lg bg-[#141414] border border-neutral-700 px-3 py-1.5 text-sm text-white"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">عدد البنات</label>
          <input
            type="number"
            min="0"
            max="20"
            value={daughtersCount}
            onChange={(e) => setDaughtersCount(Number(e.target.value))}
            className="font-num w-full rounded-lg bg-[#141414] border border-neutral-700 px-3 py-1.5 text-sm text-white"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">عدد الزوجات (0-4)</label>
          <input
            type="number"
            min="0"
            max="4"
            disabled={hasHusband}
            value={hasHusband ? 0 : wivesCount}
            onChange={(e) => setWivesCount(Number(e.target.value))}
            className="font-num w-full rounded-lg bg-[#141414] border border-neutral-700 px-3 py-1.5 text-sm text-white disabled:opacity-40"
          />
        </div>
        <div className="flex items-center pt-5">
          <label className="inline-flex items-center gap-2 text-xs text-white cursor-pointer">
            <input
              type="checkbox"
              checked={hasHusband}
              onChange={(e) => {
                setHasHusband(e.target.checked);
                if (e.target.checked) setWivesCount(0);
              }}
              className="accent-[#D4AF37]"
            />
            <span>يوجد زوج</span>
          </label>
        </div>
        <div className="flex items-center pt-5">
          <label className="inline-flex items-center gap-2 text-xs text-white cursor-pointer">
            <input
              type="checkbox"
              checked={hasFather}
              onChange={(e) => setHasFather(e.target.checked)}
              className="accent-[#D4AF37]"
            />
            <span>الأب على قيد الحياة</span>
          </label>
        </div>
        <div className="flex items-center pt-5">
          <label className="inline-flex items-center gap-2 text-xs text-white cursor-pointer">
            <input
              type="checkbox"
              checked={hasMother}
              onChange={(e) => setHasMother(e.target.checked)}
              className="accent-[#D4AF37]"
            />
            <span>الأم على قيد الحياة</span>
          </label>
        </div>
      </div>

      {/* Distributable Summary & Table */}
      <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
          <span className="text-xs text-slate-400">
            صافي التركة القابلة للتوزيع الشرعي:
          </span>
          <span className="font-num text-xl font-extrabold text-[#D4AF37]">
            {formatNum(inhRes.distributableEstate)} ج.م
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-neutral-900 text-slate-300">
              <tr>
                <th className="py-2.5 px-3">الوارث</th>
                <th className="py-2.5 px-3">العدد</th>
                <th className="py-2.5 px-3">نوع الاستحقاق والنصيب</th>
                <th className="py-2.5 px-3">إجمالي النصيب</th>
                <th className="py-2.5 px-3">نصيب الفرد الواحد</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {inhRes.shares.map((row) => (
                <tr key={row.heirTitle}>
                  <td className="py-2.5 px-3 font-bold text-[#F3E5AB]">{row.heirTitle}</td>
                  <td className="py-2.5 px-3 font-num">{row.count}</td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {row.shareType} ({row.fractionLabel})
                  </td>
                  <td className="py-2.5 px-3 font-num font-bold text-white">
                    {formatNum(row.totalShareAmount)} ج.م
                  </td>
                  <td className="py-2.5 px-3 font-num font-bold text-emerald-400">
                    {formatNum(row.perPersonAmount)} ج.م
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdSlot slotId="2020293842" placement="post-result" label="إعلان أسفل حاسبة المواريث" />
    </div>
  );
}

/* ============================================================================
 * 5. UNITS & AREA MASTER ENGINE (`engineType === 'unit'`)
 * ========================================================================== */
export function UnitMasterEngine({ defaultParams = {} }) {
  const [familyId, setFamilyId] = useState(defaultParams.familyId || 'area');
  const currentFamily =
    UNIT_FAMILIES.find((f) => f.familyId === familyId) || UNIT_FAMILIES[0];

  const [fromUnitId, setFromUnitId] = useState(
    defaultParams.fromUnitId || currentFamily.units[0].id
  );
  const [toUnitId, setToUnitId] = useState(
    defaultParams.toUnitId || currentFamily.units[1].id
  );
  const [inputValue, setInputValue] = useState(defaultParams.inputValue || 1);

  useEffect(() => {
    const q = parseUrlQueryParams();
    if (q.family) setFamilyId(q.family);
    else if (defaultParams.familyId) setFamilyId(defaultParams.familyId);

    if (q.from) setFromUnitId(q.from);
    else if (defaultParams.fromUnitId) setFromUnitId(defaultParams.fromUnitId);

    if (q.to) setToUnitId(q.to);
    else if (defaultParams.toUnitId) setToUnitId(defaultParams.toUnitId);

    if (q.val) setInputValue(Number(q.val));
    else if (defaultParams.inputValue !== undefined) setInputValue(defaultParams.inputValue);
  }, [defaultParams]);

  const fromUnit =
    currentFamily.units.find((u) => u.id === fromUnitId) || currentFamily.units[0];
  const toUnit =
    currentFamily.units.find((u) => u.id === toUnitId) || currentFamily.units[1];

  const baseValue = (Number(inputValue) || 0) * fromUnit.factorToBase;
  const convertedValue = baseValue / toUnit.factorToBase;

  return (
    <div className="space-y-6">
      {/* Unit Family Tabs */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-neutral-800">
        {UNIT_FAMILIES.map((fam) => (
          <button
            key={fam.familyId}
            type="button"
            onClick={() => {
              setFamilyId(fam.familyId);
              setFromUnitId(fam.units[0].id);
              setToUnitId(fam.units[1].id);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              familyId === fam.familyId
                ? 'bg-[#D4AF37] text-black'
                : 'bg-[#0A0A0A] text-slate-300 border border-neutral-800 hover:border-[#D4AF37]'
            }`}
          >
            {fam.familyName}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-2">
          <label htmlFor="unit-val" className="block text-xs font-bold text-[#F3E5AB]">
            القيمة المراد تحويلها
          </label>
          <input
            id="unit-val"
            type="number"
            step="any"
            value={inputValue}
            onChange={(e) => setInputValue(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="unit-from" className="block text-xs font-bold text-slate-200">
            من وحدة
          </label>
          <select
            id="unit-from"
            value={fromUnit.id}
            onChange={(e) => setFromUnitId(e.target.value)}
            className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          >
            {currentFamily.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="unit-to" className="block text-xs font-bold text-slate-200">
            إلى وحدة
          </label>
          <select
            id="unit-to"
            value={toUnit.id}
            onChange={(e) => setToUnitId(e.target.value)}
            className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          >
            {currentFamily.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 block">
            نتيجة التحويل القياسي ({inputValue} {fromUnit.name})
          </span>
          <div className="font-num text-2xl sm:text-3xl font-extrabold text-[#D4AF37]">
            {formatNum(convertedValue, 4)} <small className="text-sm">{toUnit.name}</small>
          </div>
        </div>
        <span className="text-xs text-slate-400">
          معامل التحويل المباشر: 1 {fromUnit.name} ={' '}
          {formatNum(fromUnit.factorToBase / toUnit.factorToBase, 6)} {toUnit.name}
        </span>
      </div>

      <AdSlot slotId="2020293842" placement="post-result" label="إعلان أسفل محرك الوحدات" />

      {/* All Sister Units Equivalence Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {currentFamily.units.map((u) => (
          <div
            key={u.id}
            className="p-3 rounded-xl border border-neutral-800 bg-[#0A0A0A] flex flex-col justify-between"
          >
            <span className="text-xs text-slate-400">{u.name}</span>
            <span className="font-num text-sm font-bold text-white mt-1">
              {formatNum(baseValue / u.factorToBase, 4)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
 * 6. FINANCE, LOANS & CERTIFICATES MASTER ENGINE (`engineType === 'finance'`)
 * ========================================================================== */
export function FinanceMasterEngine({ defaultParams = {} }) {
  const [mode, setMode] = useState(defaultParams.mode || 'certificate');
  const [principalAmount, setPrincipalAmount] = useState(
    defaultParams.principalAmount || 200000
  );
  const [annualRate, setAnnualRate] = useState(defaultParams.annualRate || 27);
  const [durationMonths, setDurationMonths] = useState(defaultParams.durationMonths || 36);
  const [interestType, setInterestType] = useState(
    defaultParams.interestType || 'declining'
  );

  useEffect(() => {
    const q = parseUrlQueryParams();
    if (q.mode) setMode(q.mode);
    else if (defaultParams.mode) setMode(defaultParams.mode);

    if (q.amount) setPrincipalAmount(Number(q.amount));
    else if (defaultParams.principalAmount) setPrincipalAmount(defaultParams.principalAmount);

    if (q.rate) setAnnualRate(Number(q.rate));
    else if (defaultParams.annualRate) setAnnualRate(defaultParams.annualRate);

    if (q.months) setDurationMonths(Number(q.months));
    else if (defaultParams.durationMonths) setDurationMonths(defaultParams.durationMonths);
  }, [defaultParams]);

  const certRes = useMemo(
    () =>
      calculateCertificateProfit({
        principalAmount,
        annualYieldPercent: annualRate,
        durationYears: durationMonths / 12,
      }),
    [principalAmount, annualRate, durationMonths]
  );

  const loanRes = useMemo(
    () =>
      calculateLoanSchedule({
        principalAmount,
        annualInterestRate: annualRate,
        durationMonths,
        interestType,
        adminFeePercent: 1.5,
      }),
    [principalAmount, annualRate, durationMonths, interestType]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0A0A0A] border border-neutral-800">
        <button
          type="button"
          onClick={() => setMode('certificate')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
            mode === 'certificate' ? 'bg-[#D4AF37] text-black' : 'text-slate-300'
          }`}
        >
          حاسبة أرباح الشهادات والودائع
        </button>
        <button
          type="button"
          onClick={() => setMode('loan')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
            mode === 'loan' ? 'bg-[#D4AF37] text-black' : 'text-slate-300'
          }`}
        >
          حاسبة أقساط القروض والتمويل
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-2">
          <label htmlFor="fin-principal" className="block text-xs font-bold text-[#F3E5AB]">
            المبلغ الأساسي (ج.م)
          </label>
          <input
            id="fin-principal"
            type="number"
            min="1000"
            step="5000"
            value={principalAmount}
            onChange={(e) => setPrincipalAmount(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="fin-rate" className="block text-xs font-bold text-slate-200">
            نسبة العائد / الفائدة السنوية (%)
          </label>
          <input
            id="fin-rate"
            type="number"
            min="1"
            step="0.25"
            value={annualRate}
            onChange={(e) => setAnnualRate(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="fin-months" className="block text-xs font-bold text-slate-200">
            المدة الزمنية (بالأشهر)
          </label>
          <input
            id="fin-months"
            type="number"
            min="6"
            max="360"
            step="6"
            value={durationMonths}
            onChange={(e) => setDurationMonths(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>
      </div>

      {mode === 'certificate' ? (
        <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-xs text-slate-400 block">العائد الشهري</span>
            <span className="font-num text-2xl font-extrabold text-[#D4AF37]">
              {formatNum(certRes.monthlyPayout)} ج.م
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">العائد الربع سنوي</span>
            <span className="font-num text-xl font-bold text-white">
              {formatNum(certRes.quarterlyPayout)} ج.م
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">العائد السنوي</span>
            <span className="font-num text-xl font-bold text-emerald-400">
              {formatNum(certRes.annualPayout)} ج.م
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">إجمالي الأرباح الكلية</span>
            <span className="font-num text-xl font-bold text-[#F3E5AB]">
              {formatNum(certRes.totalProfitAtMaturity)} ج.م
            </span>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-xs text-slate-400 block">القسط الشهري المتساوي</span>
            <span className="font-num text-2xl font-extrabold text-[#D4AF37]">
              {formatNum(loanRes.monthlyInstallment)} ج.م
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">إجمالي الفوائد البنكية</span>
            <span className="font-num text-xl font-bold text-amber-400">
              {formatNum(loanRes.totalInterest)} ج.م
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">إجمالي المبلغ المسدد</span>
            <span className="font-num text-xl font-bold text-white">
              {formatNum(loanRes.totalPayment)} ج.م
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">صافي التمويل المستلم</span>
            <span className="font-num text-xl font-bold text-emerald-400">
              {formatNum(loanRes.netDisbursedAmount)} ج.م
            </span>
          </div>
        </div>
      )}

      <AdSlot slotId="2020293842" placement="post-result" label="إعلان أسفل محرك التمويل" />
    </div>
  );
}

/* ============================================================================
 * 7. BUSINESS, E-COMMERCE, WALLETS & TAX ENGINE (`engineType === 'business'`)
 * ========================================================================== */
export function BusinessMasterEngine({ defaultParams = {} }) {
  const [subTool, setSubTool] = useState(defaultParams.subTool || 'ecommerce');
  const [baseCost, setBaseCost] = useState(1000);
  const [secondaryCost, setSecondaryCost] = useState(250);
  const [ratePercent, setRatePercent] = useState(14);
  const [yearsCount, setYearsCount] = useState(5);

  useEffect(() => {
    if (defaultParams.subTool) setSubTool(defaultParams.subTool);
  }, [defaultParams]);

  const computed = useMemo(() => {
    if (subTool === 'wallets') {
      const fee = baseCost * 0.015;
      return {
        primaryLabel: 'الصافي المستلم بعد خصم عمولة التحويل/السحب',
        primaryVal: `${formatNum(baseCost - fee)} ج.م`,
        secondaryLabel: 'المبلغ المطلوب تحويله ليصلك الصافي كاملاً',
        secondaryVal: `${formatNum(baseCost + fee)} ج.م`,
      };
    }
    if (subTool === 'vat-customs') {
      const vat = baseCost * (ratePercent / 100);
      const customs = baseCost * (secondaryCost / 1000);
      return {
        primaryLabel: `الإجمالي شامل ضريبة القيمة المضافة (${ratePercent}%) والجمارك`,
        primaryVal: `${formatNum(baseCost + vat + customs)} ج.م`,
        secondaryLabel: 'قيمة الضريبة المضافة وحدها',
        secondaryVal: `${formatNum(vat)} ج.م`,
      };
    }
    if (subTool === 'gratuity') {
      const first5 = Math.min(5, yearsCount) * (baseCost * 0.5);
      const after5 = Math.max(0, yearsCount - 5) * baseCost;
      return {
        primaryLabel: `إجمالي مكافأة نهاية الخدمة (${yearsCount} سنوات عمل)`,
        primaryVal: `${formatNum(first5 + after5)} ج.م`,
        secondaryLabel: 'المتوسط السنوي للمكافأة',
        secondaryVal: `${formatNum((first5 + after5) / Math.max(1, yearsCount))} ج.م`,
      };
    }
    // E-commerce / Margin / ROI default
    const totalUnitCost = baseCost + secondaryCost;
    const targetPrice = totalUnitCost * (1 + ratePercent / 100);
    const netProfit = targetPrice - totalUnitCost;
    return {
      primaryLabel: 'سعر البيع المقترح لتحقيق الربح المستهدف',
      primaryVal: `${formatNum(targetPrice)} ج.م`,
      secondaryLabel: 'صافي الربح للوحدة / العملية الواحدة',
      secondaryVal: `${formatNum(netProfit)} ج.م (${ratePercent}%)`,
    };
  }, [subTool, baseCost, secondaryCost, ratePercent, yearsCount]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 pb-4 border-b border-neutral-800">
        {[
          { id: 'ecommerce', label: 'تسعير المنتجات والتجارة' },
          { id: 'wallets', label: 'عمولات المحافظ وPayPal' },
          { id: 'vat-customs', label: 'الجمارك وضريبة VAT' },
          { id: 'gratuity', label: 'مكافأة نهاية الخدمة' },
          { id: 'margin-discount', label: 'هامش الربح والخصم' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSubTool(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
              subTool === tab.id
                ? 'bg-[#D4AF37] text-black'
                : 'bg-[#0A0A0A] text-slate-300 border border-neutral-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#F3E5AB]">
            {subTool === 'gratuity' ? 'الراتب الشامل الأخير' : 'المبلغ / التكلفة الأساسية'}
          </label>
          <input
            type="number"
            value={baseCost}
            onChange={(e) => setBaseCost(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">
            {subTool === 'gratuity'
              ? 'عدد سنوات الخدمة'
              : 'مصاريف الشحن / الإعلان / الرسوم الإضافية'}
          </label>
          <input
            type="number"
            value={subTool === 'gratuity' ? yearsCount : secondaryCost}
            onChange={(e) =>
              subTool === 'gratuity'
                ? setYearsCount(Number(e.target.value))
                : setSecondaryCost(Number(e.target.value))
            }
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">
            النسبة المئوية (الربح / الضريبة %)
          </label>
          <input
            type="number"
            value={ratePercent}
            onChange={(e) => setRatePercent(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 block">{computed.primaryLabel}</span>
          <span className="font-num text-2xl font-extrabold text-[#D4AF37]">
            {computed.primaryVal}
          </span>
        </div>
        <div className="sm:text-left">
          <span className="text-xs text-slate-400 block">{computed.secondaryLabel}</span>
          <span className="font-num text-lg font-bold text-emerald-400">
            {computed.secondaryVal}
          </span>
        </div>
      </div>

      <AdSlot slotId="2020293842" placement="post-result" label="إعلان أسفل حاسبة الأعمال" />
    </div>
  );
}

/* ============================================================================
 * 8. LIFESTYLE, AGE, BMI, GPA & CONSTRUCTION ENGINE (`engineType === 'lifestyle'`)
 * ========================================================================== */
export function LifestyleMasterEngine({ defaultParams = {} }) {
  const [lifeMode, setLifeMode] = useState(defaultParams.lifeMode || 'age');
  const [birthYear, setBirthYear] = useState(1995);
  const [weightKg, setWeightKg] = useState(78);
  const [heightCm, setHeightCm] = useState(175);
  const [areaSqm, setAreaSqm] = useState(140);

  useEffect(() => {
    if (defaultParams.lifeMode) setLifeMode(defaultParams.lifeMode);
  }, [defaultParams]);

  const currentYear = new Date().getFullYear();
  const ageYears = Math.max(0, currentYear - birthYear);
  const hijriAge = Math.round(ageYears * 1.0307);
  const bmi = Number((weightKg / Math.pow(heightCm / 100, 2)).toFixed(1));
  const dailyCalories = Math.round((10 * weightKg + 6.25 * heightCm - 5 * 28 + 5) * 1.55);
  const recommendedAcHp = areaSqm <= 14 ? '1.5 حصان' : areaSqm <= 22 ? '2.25 حصان' : '3 حصان';
  const finishingCost = areaSqm * 4800;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 pb-4 border-b border-neutral-800">
        {[
          { id: 'age', label: 'حاسبة العمر بالهجري والميلادي' },
          { id: 'bmi', label: 'السعرات وكتلة الجسم BMI' },
          { id: 'construction', label: 'تكلفة التشطيب والبناء' },
          { id: 'ac-btu', label: 'قدرة التكييف للغرفة (حصان)' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setLifeMode(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
              lifeMode === tab.id
                ? 'bg-[#D4AF37] text-black'
                : 'bg-[#0A0A0A] text-slate-300 border border-neutral-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#F3E5AB]">سنة الميلاد (للعمر)</label>
          <input
            type="number"
            value={birthYear}
            onChange={(e) => setBirthYear(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2 text-sm text-white"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">الوزن (كجم)</label>
          <input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2 text-sm text-white"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">الطول (سم)</label>
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2 text-sm text-white"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">المساحة بالمتر المربع (م²)</label>
          <input
            type="number"
            value={areaSqm}
            onChange={(e) => setAreaSqm(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2 text-sm text-white"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <span className="text-xs text-slate-400 block">العمر الميلادي / الهجري</span>
          <span className="font-num text-lg font-extrabold text-[#D4AF37]">
            {ageYears} سنة ({hijriAge} هجري)
          </span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block">مؤشر BMI والسعرات</span>
          <span className="font-num text-lg font-bold text-white">
            BMI {bmi} · {dailyCalories} سعرة
          </span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block">التكييف المناسب للمساحة</span>
          <span className="font-num text-lg font-bold text-emerald-400">
            {recommendedAcHp}
          </span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block">ميزانية التشطيب التقديرية</span>
          <span className="font-num text-lg font-bold text-[#F3E5AB]">
            {formatNum(finishingCost)} ج.م
          </span>
        </div>
      </div>

      <AdSlot slotId="2020293842" placement="post-result" label="إعلان أسفل الحاسبات اليومية" />
    </div>
  );
}

/* ============================================================================
 * 9. IMAGE STUDIO & PDF CONVERTER ENGINE (`engineType === 'image'`)
 * ========================================================================== */
export function ImageMasterEngine({ defaultParams = {} }) {
  const [targetFormat, setTargetFormat] = useState(
    defaultParams.targetFormatMime || 'image/webp'
  );
  const [quality, setQuality] = useState(defaultParams.quality || 82);
  const [maxWidth, setMaxWidth] = useState(defaultParams.maxWidth || 1200);
  const [sourceInfo, setSourceInfo] = useState({
    name: 'meezan-artwork.png',
    originalBytes: 185400,
    width: 1200,
    height: 750,
  });
  const [compressedInfo, setCompressedInfo] = useState({
    dataUrl: '',
    bytes: 0,
    width: 1200,
    height: 750,
    savingsPercent: 0,
  });

  const sourceCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (defaultParams.targetFormatMime) setTargetFormat(defaultParams.targetFormatMime);
    if (defaultParams.quality) setQuality(defaultParams.quality);
    if (defaultParams.maxWidth) setMaxWidth(defaultParams.maxWidth);
  }, [defaultParams]);

  const createDemoCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 750;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0A0A0A';
      ctx.fillRect(0, 0, 1200, 750);
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, 1120, 670);
      ctx.fillStyle = '#F3E5AB';
      ctx.font = 'bold 48px Cairo, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('منصة مِيزان — استوديو ضغط وتحويل الصور الشامل', 600, 360);
    }
    sourceCanvasRef.current = canvas;
    const raw = canvas.toDataURL('image/png');
    setSourceInfo({
      name: 'meezan-sample.png',
      originalBytes: Math.round(((raw.length - 22) * 3) / 4),
      width: 1200,
      height: 750,
    });
  };

  useEffect(() => {
    createDemoCanvas();
  }, []);

  useEffect(() => {
    const src = sourceCanvasRef.current;
    if (!src) return;
    const scale = src.width > maxWidth ? maxWidth / src.width : 1;
    const outW = Math.max(1, Math.round(src.width * scale));
    const outH = Math.max(1, Math.round(src.height * scale));
    const outCanvas = document.createElement('canvas');
    outCanvas.width = outW;
    outCanvas.height = outH;
    const ctx = outCanvas.getContext('2d');
    if (!ctx) return;
    if (targetFormat === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, outW, outH);
    }
    ctx.drawImage(src, 0, 0, outW, outH);
    const outUrl = outCanvas.toDataURL(targetFormat, quality / 100);
    const outBytes = Math.round(((outUrl.length - outUrl.indexOf(',') - 1) * 3) / 4);
    const orig = Math.max(1, sourceInfo.originalBytes || outBytes);
    const savings = Math.max(0, ((orig - outBytes) / orig) * 100);
    setCompressedInfo({
      dataUrl: outUrl,
      bytes: outBytes,
      width: outW,
      height: outH,
      savingsPercent: Number(savings.toFixed(1)),
    });
  }, [sourceInfo, targetFormat, quality, maxWidth]);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        c.getContext('2d')?.drawImage(img, 0, 0);
        sourceCanvasRef.current = c;
        setSourceInfo({
          name: file.name,
          originalBytes: file.size,
          width: img.width,
          height: img.height,
        });
      };
      if (typeof ev.target?.result === 'string') img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border-2 border-dashed border-neutral-700 hover:border-[#D4AF37] bg-[#0A0A0A] p-6 text-center space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
        <Upload className="w-8 h-8 text-[#D4AF37] mx-auto" />
        <p className="text-sm font-bold text-white">
          اسحب الصورة أو اضغط لرفعها — المعالجة محلية 100% عبر HTML5 Canvas بدون سيرفر
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-xs font-bold cursor-pointer"
        >
          اختيار صورة من جهازك
        </button>
      </div>

      {/* Quick Dimension Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400">مقاسات سريعة:</span>
        {[
          { label: 'بوست سوشيال (1080px)', w: 1080 },
          { label: 'يوتيوب HD (1280px)', w: 1280 },
          { label: 'وثائق حكومية (800px)', w: 800 },
          { label: 'أيقونة مصغرة (512px)', w: 512 },
        ].map((p) => (
          <button
            key={p.w}
            type="button"
            onClick={() => setMaxWidth(p.w)}
            className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
              maxWidth === p.w
                ? 'bg-[#D4AF37] text-black'
                : 'bg-[#0A0A0A] text-slate-300 border border-neutral-800'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-2">
          <label htmlFor="img-m-fmt" className="block text-xs font-bold text-slate-200">
            الصيغة المطلوبة (شامل WebP / JPG / PNG)
          </label>
          <select
            id="img-m-fmt"
            value={targetFormat}
            onChange={(e) => setTargetFormat(e.target.value)}
            className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white"
          >
            <option value="image/webp">WebP (أفضل ضغط وسرعة)</option>
            <option value="image/jpeg">JPG / JPEG</option>
            <option value="image/png">PNG (شفافية كاملة)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="img-m-q" className="block text-xs font-bold text-slate-200">
            نسبة الجودة ({quality}%)
          </label>
          <input
            id="img-m-q"
            type="range"
            min="15"
            max="100"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-[#D4AF37]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="img-m-w" className="block text-xs font-bold text-slate-200">
            العرض الأقصى بالبكسل
          </label>
          <input
            id="img-m-w"
            type="number"
            min="100"
            max="4000"
            value={maxWidth}
            onChange={(e) => setMaxWidth(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs text-slate-400">
            الحجم بعد الضغط ({compressedInfo.width}×{compressedInfo.height}px)
          </span>
          <div className="font-num text-2xl font-extrabold text-[#D4AF37]">
            {formatNum(compressedInfo.bytes / 1024, 1)} KB{' '}
            <small className="text-xs text-emerald-400">
              (توفير {compressedInfo.savingsPercent}%)
            </small>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {compressedInfo.dataUrl && (
            <a
              href={compressedInfo.dataUrl}
              download="meezan-optimized-image.webp"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs font-bold"
            >
              <Download className="w-4 h-4" />
              <span>تحميل الصورة المضغوطة فوراً</span>
            </a>
          )}
          <button
            type="button"
            onClick={() => typeof window !== 'undefined' && window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#141414] border border-neutral-700 text-xs font-bold text-white cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#D4AF37]" />
            <span>حفظ كوثيقة PDF A4</span>
          </button>
        </div>
      </div>

      {/* Integrated Batch Image Studio (Feature 5) */}
      <BatchProcessorEngine initialTab="images" />

      <AdSlot slotId="2020293842" placement="post-result" label="إعلان أسفل محرك الصور" />
    </div>
  );
}

/* ============================================================================
 * 10. FUEL, MAINTENANCE & UTILITIES ENGINE (`engineType === 'energy'`)
 * ========================================================================== */
export function EnergyMasterEngine({ defaultParams = {} }) {
  let siteConfigCtx = null;
  try {
    siteConfigCtx = useSiteConfig();
  } catch (_err) {
    siteConfigCtx = null;
  }

  const liveEnergy = siteConfigCtx?.config?.liveRates?.energyAndUtilities || {};
  const liveFuel80 = Number(liveEnergy.fuel80 ?? liveEnergy.gas80) >= 18 ? Number(liveEnergy.fuel80 ?? liveEnergy.gas80) : 20.75;
  const liveFuel92 = Number(liveEnergy.fuel92 ?? liveEnergy.gas92) >= 18 ? Number(liveEnergy.fuel92 ?? liveEnergy.gas92) : 22.25;
  const liveFuel95 = Number(liveEnergy.fuel95 ?? liveEnergy.gas95) >= 18 ? Number(liveEnergy.fuel95 ?? liveEnergy.gas95) : 24.0;
  const liveDiesel = Number(liveEnergy.diesel) > 0 ? Number(liveEnergy.diesel) : 13.5;

  const liveFuelGrades = useMemo(
    () => [
      {
        id: 'fuel80',
        name: 'بنزين 80',
        price: liveFuel80,
        optionLabel: `بنزين 80 بسعر ${liveFuel80.toFixed(2)} ج.م`,
      },
      {
        id: 'fuel92',
        name: 'بنزين 92',
        price: liveFuel92,
        optionLabel: `بنزين 92 بسعر ${liveFuel92.toFixed(2)} ج.م`,
      },
      {
        id: 'fuel95',
        name: 'بنزين 95',
        price: liveFuel95,
        optionLabel: `بنزين 95 بسعر ${liveFuel95.toFixed(2)} ج.م`,
      },
      {
        id: 'diesel',
        name: 'سولار / ديزل',
        price: liveDiesel,
        optionLabel: `سولار / ديزل بسعر ${liveDiesel.toFixed(2)} ج.م`,
      },
    ],
    [liveFuel80, liveFuel92, liveFuel95, liveDiesel]
  );

  const [distanceKm, setDistanceKm] = useState(defaultParams.distanceKm || 220);
  const [isRoundTrip, setIsRoundTrip] = useState(defaultParams.isRoundTrip ?? true);
  const [consumptionPer100Km, setConsumptionPer100Km] = useState(
    defaultParams.consumptionPer100Km || 8.2
  );
  const [selectedGradeId, setSelectedGradeId] = useState(
    defaultParams.selectedFuelGrade || 'fuel92'
  );
  const [fuelPricePerLiter, setFuelPricePerLiter] = useState(() => {
    const initial = Number(defaultParams.fuelPricePerLiter);
    return initial >= 18 ? initial : liveFuel92;
  });
  const [passengersCount, setPassengersCount] = useState(
    defaultParams.passengersCount || 4
  );

  useEffect(() => {
    const q = parseUrlQueryParams();
    if (q.distance) setDistanceKm(Number(q.distance));
    else if (defaultParams.distanceKm) setDistanceKm(defaultParams.distanceKm);

    if (q.grade && ['fuel80', 'fuel92', 'fuel95', 'diesel'].includes(q.grade)) {
      setSelectedGradeId(q.grade);
      const matched = liveFuelGrades.find((g) => g.id === q.grade);
      if (matched) setFuelPricePerLiter(matched.price);
    } else if (q.fuelPrice && Number(q.fuelPrice) >= 18) {
      const numPrice = Number(q.fuelPrice);
      setFuelPricePerLiter(numPrice);
      const matched = liveFuelGrades.find((g) => Math.abs(g.price - numPrice) < 0.01);
      if (matched) setSelectedGradeId(matched.id);
    } else if (defaultParams.fuelPricePerLiter && Number(defaultParams.fuelPricePerLiter) >= 18) {
      setFuelPricePerLiter(Number(defaultParams.fuelPricePerLiter));
    } else {
      const matched = liveFuelGrades.find((g) => g.id === selectedGradeId) || liveFuelGrades[1];
      setFuelPricePerLiter(matched.price);
    }
  }, [defaultParams, liveFuelGrades, selectedGradeId]);

  const handleSelectGrade = (gradeId) => {
    setSelectedGradeId(gradeId);
    const matched = liveFuelGrades.find((g) => g.id === gradeId);
    if (matched) {
      setFuelPricePerLiter(matched.price);
    }
  };

  const result = useMemo(
    () =>
      calculateFuelTrip({
        distanceKm,
        isRoundTrip,
        consumptionPer100Km,
        fuelPricePerLiter,
        passengersCount,
      }),
    [distanceKm, isRoundTrip, consumptionPer100Km, fuelPricePerLiter, passengersCount]
  );

  return (
    <div className="space-y-6">
      {/* Official Egypt Fuel Grade Dropdown + Quick Selector Pills */}
      <div className="space-y-3 pb-4 border-b border-neutral-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="en-fuel-grade-select" className="block text-xs font-bold text-[#F3E5AB]">
              اختر نوع البنزين الرسمي في مصر
            </label>
            <select
              id="en-fuel-grade-select"
              data-testid="fuel-grade-select"
              value={selectedGradeId}
              onChange={(e) => handleSelectGrade(e.target.value)}
              className="w-full rounded-xl bg-[#0A0A0A] border border-[#D4AF37]/40 px-4 py-2.5 text-sm font-bold text-white focus:border-[#D4AF37] focus:outline-none"
            >
              {liveFuelGrades.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.optionLabel}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="en-fuel-price-input" className="block text-xs font-bold text-slate-200">
              سعر لتر البنزين المعتمد (ج.م / لتر)
            </label>
            <input
              id="en-fuel-price-input"
              data-testid="fuel-price-per-liter-input"
              type="number"
              step="0.25"
              min="1"
              value={fuelPricePerLiter}
              onChange={(e) => setFuelPricePerLiter(Number(e.target.value))}
              className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm font-bold text-[#D4AF37] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {liveFuelGrades.map((f) => (
            <button
              key={f.id}
              type="button"
              data-testid={`fuel-grade-btn-${f.id}`}
              onClick={() => handleSelectGrade(f.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                Number(fuelPricePerLiter) === Number(f.price)
                  ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'bg-[#0A0A0A] text-slate-300 border border-neutral-800 hover:border-[#D4AF37]/40'
              }`}
            >
              {f.optionLabel}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="en-dist" className="text-xs font-bold text-slate-200">
              المسافة بالكيلومتر
            </label>
            <button
              type="button"
              onClick={() => setIsRoundTrip(!isRoundTrip)}
              className="text-xs text-[#D4AF37] font-bold cursor-pointer"
            >
              {isRoundTrip ? 'ذهاب وعودة (×2)' : 'اتجاه واحد فقط'}
            </button>
          </div>
          <input
            id="en-dist"
            type="number"
            min="1"
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="en-cons" className="block text-xs font-bold text-slate-200">
            معدل استهلاك الوقود (لتر لكل 100 كم)
          </label>
          <input
            id="en-cons"
            type="number"
            min="1"
            step="0.2"
            value={consumptionPer100Km}
            onChange={(e) => setConsumptionPer100Km(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="en-passengers" className="block text-xs font-bold text-slate-200">
            عدد الركاب (لتقسيم تكلفة المشوار)
          </label>
          <input
            id="en-passengers"
            type="number"
            min="1"
            max="50"
            value={passengersCount}
            onChange={(e) => setPassengersCount(Math.max(1, Number(e.target.value)))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <span className="text-xs text-slate-400 block">إجمالي المسافة</span>
          <span className="font-num text-xl font-bold text-white">
            {result.effectiveDistanceKm} كم
          </span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block">اللترات المطلوبة</span>
          <span className="font-num text-xl font-bold text-[#F3E5AB]">
            {result.totalLitersNeeded} لتر
          </span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block">إجمالي تكلفة الوقود</span>
          <span data-testid="fuel-total-trip-cost" className="font-num text-2xl font-extrabold text-[#D4AF37]">
            {formatNum(result.totalTripCost)} ج.م
          </span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block">
            تكلفة الفرد ({passengersCount} ركاب)
          </span>
          <span className="font-num text-xl font-bold text-emerald-400">
            {formatNum(result.costPerPassenger)} ج.م
          </span>
        </div>
      </div>

      <AdSlot slotId="2020293842" placement="post-result" label="إعلان أسفل محرك الطاقة" />
    </div>
  );
}

/* ============================================================================
 * 11. OFFICIAL CONTRACTS, INVOICES & CV MASTER ENGINE (`engineType === 'document'`)
 * ========================================================================== */
export function DocumentMasterEngine({ defaultParams = {} }) {
  const [docType, setDocType] = useState(defaultParams.docType || 'car-sale');
  const [templateTitle, setTemplateTitle] = useState(
    defaultParams.templateTitle || 'عقد بيع مركبة ابتدائي نهائي'
  );
  const [governorate, setGovernorate] = useState(defaultParams.governorate || 'القاهرة');
  const [firstPartyName, setFirstPartyName] = useState('أحمد محمود عبد الرحمن');
  const [firstPartyId, setFirstPartyId] = useState('28805140102345');
  const [secondPartyName, setSecondPartyName] = useState('محمد سامي الشريف');
  const [secondPartyId, setSecondPartyId] = useState('29109200105678');
  const [subjectDetails, setSubjectDetails] = useState(
    'المركبة / الوحدة / الخدمة الموضحة بالمعاينة النافية للجهالة'
  );
  const [contractValue, setContractValue] = useState(850000);

  useEffect(() => {
    if (defaultParams.docType) setDocType(defaultParams.docType);
    if (defaultParams.templateTitle) setTemplateTitle(defaultParams.templateTitle);
    if (defaultParams.governorate) setGovernorate(defaultParams.governorate);
  }, [defaultParams]);

  const tafqeetAmount = useMemo(
    () => numberToArabicWordsTafqeet(contractValue, 'جنيه مصري', 'قرشاً'),
    [contractValue]
  );

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <span className="text-xs font-bold text-[#F3E5AB]">
          القالب النشط: {templateTitle}
        </span>
        <button
          type="button"
          onClick={() => typeof window !== 'undefined' && window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-xs font-bold cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة / حفظ كملف PDF بتنسيق A4</span>
        </button>
      </div>

      <div className="no-print grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs text-slate-300">
            اسم الطرف الأول (البائع / المؤجر / المُصدر / صاحب السيرة)
          </label>
          <input
            type="text"
            value={firstPartyName}
            onChange={(e) => setFirstPartyName(e.target.value)}
            className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2 text-xs text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-slate-300">
            اسم الطرف الثاني (المشتري / المستأجر / العميل / الجهة)
          </label>
          <input
            type="text"
            value={secondPartyName}
            onChange={(e) => setSecondPartyName(e.target.value)}
            className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2 text-xs text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-slate-300">
            بيان وتفاصيل الوثيقة (السيارة / العقار / البنود / الخبرات)
          </label>
          <input
            type="text"
            value={subjectDetails}
            onChange={(e) => setSubjectDetails(e.target.value)}
            className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2 text-xs text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-slate-300">
            القيمة المالية الإجمالية (يتم تفقيطها تلقائياً داخل العقد)
          </label>
          <input
            type="number"
            value={contractValue}
            onChange={(e) => setContractValue(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2 text-xs text-white"
          />
        </div>
      </div>

      {/* Printable A4 Sheet */}
      <div className="print-only-sheet rounded-2xl bg-white text-slate-950 p-6 sm:p-10 shadow-2xl border border-slate-300 space-y-5 leading-relaxed">
        <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between">
          <h3 className="text-xl font-extrabold">{templateTitle}</h3>
          <span className="text-xs font-bold border border-slate-400 px-2.5 py-1 rounded">
            {governorate} · وثيقة A4 رسمية
          </span>
        </div>

        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            <strong>الطرف الأول:</strong> {firstPartyName} (رقم قومي / سجل: {firstPartyId})
          </p>
          <p>
            <strong>الطرف الثاني:</strong> {secondPartyName} (رقم قومي / سجل: {secondPartyId})
          </p>
          <p>
            <strong>موضوع الوثيقة ({docType}):</strong> اتفق الطرفان بكامل الأهلية القانونية على{' '}
            {subjectDetails} بقيمة مالية إجمالية قدرها{' '}
            <strong className="font-num">{formatNum(contractValue)} ج.م</strong> (
            {tafqeetAmount.fullLegalCheckString}).
          </p>
          <p>
            <strong>الإقرار والمخالصة:</strong> يقر الطرفان بصحة البيانات أعلاه وبالالتزام التام
            بجميع البنود القانونية، ويعد التوقيع أدناه حجة نافذة أمام كافة الجهات الرسمية.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-300 text-xs text-center">
          <div>
            <strong>توقيع الطرف الأول</strong>
            <div className="border-b border-dashed border-slate-400 w-40 mx-auto pt-6" />
          </div>
          <div>
            <strong>توقيع الطرف الثاني</strong>
            <div className="border-b border-dashed border-slate-400 w-40 mx-auto pt-6" />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
          <span>★ تم الحساب والتوليد عبر منصة Dix Tools للخدمات والأدوات الذكية</span>
          <span dir="ltr">dixtools.com</span>
        </div>
      </div>

      <AdSlot slotId="2020293842" placement="post-result" label="إعلان أسفل محرك العقود" />
    </div>
  );
}

/* ============================================================================
 * 12. QR CODE & BARCODE STUDIO ENGINE (`engineType === 'qr'`)
 * ========================================================================== */
export function QrMasterEngine({ defaultParams = {} }) {
  const [payloadText, setPayloadText] = useState('https://meezan-hub.com');
  const [fgColor, setFgColor] = useState(defaultParams.fgColor || '#D4AF37');
  const [bgColor, setBgColor] = useState(defaultParams.bgColor || '#0A0A0A');
  const [canvasSize, setCanvasSize] = useState(defaultParams.canvasSize || 800);
  const [pngUrl, setPngUrl] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    if (defaultParams.fgColor) setFgColor(defaultParams.fgColor);
    if (defaultParams.bgColor) setBgColor(defaultParams.bgColor);
    if (defaultParams.canvasSize) setCanvasSize(defaultParams.canvasSize);
  }, [defaultParams]);

  useEffect(() => {
    const matrix = generateQrMatrix(payloadText);
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const quiet = 4;
    const total = matrix.length + quiet * 2;
    const cell = canvasSize / total;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = fgColor;

    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix.length; c++) {
        if (matrix[r][c]) {
          ctx.fillRect(
            Math.floor((c + quiet) * cell),
            Math.floor((r + quiet) * cell),
            Math.ceil(cell),
            Math.ceil(cell)
          );
        }
      }
    }
    setPngUrl(canvas.toDataURL('image/png'));
  }, [payloadText, fgColor, bgColor, canvasSize]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7 space-y-4">
          <div className="space-y-2">
            <label htmlFor="qr-m-text" className="block text-xs font-bold text-[#F3E5AB]">
              أدخل الرابط أو رقم الواتساب أو كود المنتج المراد تحويله لرمز QR / Barcode
            </label>
            <input
              id="qr-m-text"
              type="text"
              dir="ltr"
              value={payloadText}
              onChange={(e) => setPayloadText(e.target.value)}
              className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">لون الرمز</label>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-full h-10 rounded-lg bg-[#0A0A0A] border border-neutral-800 p-1 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">لون الخلفية</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-10 rounded-lg bg-[#0A0A0A] border border-neutral-800 p-1 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">الأبعاد (px)</label>
              <input
                type="number"
                min="200"
                max="1600"
                step="100"
                value={canvasSize}
                onChange={(e) => setCanvasSize(Number(e.target.value))}
                className="font-num w-full h-10 rounded-lg bg-[#0A0A0A] border border-neutral-800 px-3 text-xs text-white"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-5 flex flex-col items-center justify-center rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-5 space-y-4">
          <canvas ref={canvasRef} className="w-48 h-48 rounded-xl border border-neutral-800" />
          {pngUrl && (
            <a
              href={pngUrl}
              download={`meezan-qr-${canvasSize}px.png`}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs font-bold"
            >
              <Download className="w-4 h-4" />
              <span>تحميل رمز QR بدقة {canvasSize}×{canvasSize} PNG</span>
            </a>
          )}
        </div>
      </div>

      {/* Integrated Live Camera Scanner (Feature 4) & Batch Barcode Studio (Feature 5) */}
      <LiveCameraScanner />
      <BatchProcessorEngine initialTab="barcodes" />

      <AdSlot slotId="2020293842" placement="post-result" label="إعلان أسفل محرك QR" />
    </div>
  );
}

/* ============================================================================
 * 13. TEXT, WHATSAPP, PASSWORDS & DEVELOPER CODE ENGINE (`engineType === 'text-code'`)
 * ========================================================================== */
export function TextCodeMasterEngine({ defaultParams = {} }) {
  const [textMode, setTextMode] = useState(defaultParams.textMode || 'word-counter');
  const [inputText, setInputText] = useState(
    'منصة مِيزان الذكية تضم أكثر من 52 أداة رئيسية شاملة لتسهيل أعمالك اليومية.'
  );
  const [phoneNum, setPhoneNum] = useState('201001234567');

  useEffect(() => {
    if (defaultParams.textMode) setTextMode(defaultParams.textMode);
  }, [defaultParams]);

  const wordsCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charsCount = inputText.length;
  const waLink = `https://wa.me/${phoneNum.replace(/\D/g, '')}?text=${encodeURIComponent(
    inputText
  )}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 pb-4 border-b border-neutral-800">
        {[
          { id: 'word-counter', label: 'عداد الكلمات ومنسق النصوص' },
          { id: 'whatsapp', label: 'مولد رابط واتساب المباشر' },
          { id: 'password', label: 'فاحص ومولد كلمات المرور' },
          { id: 'dev-toolkit', label: 'محول Base64 و URL' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTextMode(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
              textMode === tab.id
                ? 'bg-[#D4AF37] text-black'
                : 'bg-[#0A0A0A] text-slate-300 border border-neutral-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {textMode === 'whatsapp' && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#F3E5AB]">
            رقم الهاتف مع كود الدولة بدون علامة + (مثال: 201001234567)
          </label>
          <input
            type="text"
            dir="ltr"
            value={phoneNum}
            onChange={(e) => setPhoneNum(e.target.value)}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white"
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-200">
          النص المدخل / الرسالة التلقائية / الكود
        </label>
        <textarea
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 p-4 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
        />
      </div>

      <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <span className="text-xs text-slate-400 block">عدد الكلمات والحروف</span>
          <span className="font-num text-xl font-extrabold text-[#D4AF37]">
            {wordsCount} كلمة · {charsCount} حرف
          </span>
        </div>
        <div className="sm:col-span-2">
          <span className="text-xs text-slate-400 block">
            {textMode === 'whatsapp' ? 'رابط واتساب المباشر الجاهز للنسخ:' : 'المخرج المعالج:'}
          </span>
          <span dir="ltr" className="font-num text-xs sm:text-sm text-emerald-400 break-all">
            {textMode === 'whatsapp' ? waLink : encodeURIComponent(inputText).slice(0, 120)}
          </span>
        </div>
      </div>

      <AdSlot slotId="2020293842" placement="post-result" label="إعلان أسفل أدوات النصوص" />
    </div>
  );
}

/* ============================================================================
 * 14. INVESTMENT COMPARATOR ENGINE (`engineType === 'investment-comparator'`)
 *     (`gold-vs-bank-comparator`)
 * ========================================================================== */
export function InvestmentComparatorEngine({ defaultParams = {} }) {
  let siteConfigCtx = null;
  try {
    siteConfigCtx = useSiteConfig();
  } catch (_err) {
    siteConfigCtx = null;
  }

  const liveGold21 =
    Number(siteConfigCtx?.config?.liveRates?.gold?.karat21) > 0
      ? Number(siteConfigCtx.config.liveRates.gold.karat21)
      : 3811;
  const liveUsdToEgp =
    Number(siteConfigCtx?.config?.liveRates?.currenciesToEgp?.USD) > 0
      ? Number(siteConfigCtx.config.liveRates.currenciesToEgp.USD)
      : 50.45;
  const liveCertYield =
    Number(siteConfigCtx?.config?.liveRates?.bankingAndTaxes?.certAnnualYield) > 0
      ? Number(siteConfigCtx.config.liveRates.bankingAndTaxes.certAnnualYield)
      : 27;

  const [capitalAmountEgp, setCapitalAmountEgp] = useState(
    defaultParams.capitalAmountEgp || 250000
  );
  const [durationYears, setDurationYears] = useState(defaultParams.durationYears || 3);
  const [bankCertRatePercent, setBankCertRatePercent] = useState(
    defaultParams.bankCertRatePercent || liveCertYield
  );
  const [goldAnnualGrowthPercent, setGoldAnnualGrowthPercent] = useState(
    defaultParams.goldAnnualGrowthPercent || 29
  );
  const [usdAnnualGrowthPercent, setUsdAnnualGrowthPercent] = useState(
    defaultParams.usdAnnualGrowthPercent || 18
  );

  const comparison = useMemo(
    () =>
      calculateInvestmentComparison({
        capitalAmountEgp,
        durationYears,
        liveGold21Price: liveGold21,
        liveUsdRate: liveUsdToEgp,
        bankCertificateYieldPercent: bankCertRatePercent,
        expectedGoldAnnualGrowthPercent: goldAnnualGrowthPercent,
        expectedUsdAnnualGrowthPercent: usdAnnualGrowthPercent,
      }),
    [
      capitalAmountEgp,
      durationYears,
      liveGold21,
      liveUsdToEgp,
      bankCertRatePercent,
      goldAnnualGrowthPercent,
      usdAnnualGrowthPercent,
    ]
  );

  return (
    <div className="space-y-6" data-testid="investment-comparator-engine">
      {/* Live Oracle Rates Header */}
      <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#0A0A0A] p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold text-[#F3E5AB]">
            أسعار الأساس اللحظية في مصر (تحديث كل 60 ثانية):
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
          <span className="px-3 py-1 rounded-lg bg-[#141414] border border-[#D4AF37]/30 text-[#D4AF37] font-num">
            ذهب عيار 21: {formatNum(liveGold21, 0)} ج.م/جم
          </span>
          <span className="px-3 py-1 rounded-lg bg-[#141414] border border-emerald-500/30 text-emerald-300 font-num">
            شهادة البنك: {bankCertRatePercent}% سنوياً
          </span>
          <span className="px-3 py-1 rounded-lg bg-[#141414] border border-sky-500/30 text-sky-300 font-num">
            الدولار: {formatNum(liveUsdToEgp, 2)} ج.م
          </span>
        </div>
      </div>

      {/* Capital & Duration Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#F3E5AB]">
            مبلغ الاستثمار الأساسي (بالجنيه المصري)
          </label>
          <input
            type="number"
            data-testid="inv-capital-input"
            min="1000"
            step="5000"
            value={capitalAmountEgp}
            onChange={(e) => setCapitalAmountEgp(Math.max(0, Number(e.target.value)))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-[#D4AF37]/40 px-4 py-2.5 text-sm font-bold text-white focus:border-[#D4AF37] focus:outline-none"
          />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[100000, 250000, 500000, 1000000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setCapitalAmountEgp(preset)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-num cursor-pointer ${
                  capitalAmountEgp === preset
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-[#0A0A0A] text-slate-300 border border-neutral-800'
                }`}
              >
                {formatNum(preset, 0)} ج.م
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#F3E5AB]">
            مدة الاستثمار (بالسنوات: {durationYears} {durationYears === 1 ? 'سنة' : 'سنوات'})
          </label>
          <input
            type="range"
            data-testid="inv-years-slider"
            min="1"
            max="10"
            value={durationYears}
            onChange={(e) => setDurationYears(Number(e.target.value))}
            className="w-full accent-[#D4AF37] mt-2"
          />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[1, 2, 3, 5].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setDurationYears(yr)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                  durationYears === yr
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-[#0A0A0A] text-slate-300 border border-neutral-800'
                }`}
              >
                {yr} {yr === 1 ? 'سنة' : 'سنوات'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-300">
            معدل نمو الذهب السنوي المتوقع ({goldAnnualGrowthPercent}%) مقابل الشهادة ({bankCertRatePercent}%)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">نمو الذهب %</span>
              <input
                type="number"
                value={goldAnnualGrowthPercent}
                onChange={(e) => setGoldAnnualGrowthPercent(Number(e.target.value))}
                className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3 py-2 text-xs text-[#D4AF37]"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">فائدة الشهادة %</span>
              <input
                type="number"
                value={bankCertRatePercent}
                onChange={(e) => setBankCertRatePercent(Number(e.target.value))}
                className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3 py-2 text-xs text-emerald-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Verdict Card ("الأفضل لك هو...") */}
      <div
        data-testid="investment-verdict-banner"
        className="rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-l from-[#D4AF37]/20 via-[#141414] to-[#0A0A0A] p-5 shadow-[0_10px_35px_rgba(212,175,55,0.18)] space-y-2"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#D4AF37] text-black text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            توصية المستشار الاستثماري الذكي
          </span>
          <span className="text-xs font-bold text-emerald-400 font-num">
            {comparison.goldGramsPurchased} جرام ذهب عيار 21 · أو {formatNum(comparison.usdAmountPurchased, 0)} دولار
          </span>
        </div>
        <h3 className="text-lg sm:text-xl font-black text-white">
          {comparison.winnerHeadline}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {comparison.winnerReason}
        </p>
      </div>

      {/* Visual Bar Chart & 3-Way Asset Comparison */}
      <div className="space-y-4 rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5">
        <h4 className="text-sm font-extrabold text-[#F3E5AB]">
          المقارنة البصرية للقيمة النهائية وصافي الربح بعد {durationYears}{' '}
          {durationYears === 1 ? 'سنة' : 'سنوات'}
        </h4>
        <div className="space-y-4">
          {comparison.options.map((opt) => {
            const isWinner = opt.key === comparison.winnerKey;
            const barColor =
              opt.key === 'gold'
                ? 'bg-gradient-to-l from-[#D4AF37] to-[#F3E5AB]'
                : opt.key === 'bank'
                ? 'bg-gradient-to-l from-emerald-400 to-emerald-600'
                : 'bg-gradient-to-l from-sky-400 to-sky-600';

            return (
              <div
                key={opt.key}
                className={`rounded-xl border p-4 space-y-2.5 transition-all ${
                  isWinner
                    ? 'border-[#D4AF37] bg-[#141414]'
                    : 'border-neutral-800 bg-[#0E0E0E]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">{opt.title}</span>
                    {isWinner && (
                      <span className="px-2 py-0.5 rounded bg-[#D4AF37] text-black text-[10px] font-black">
                        الأعلى عائداً ★
                      </span>
                    )}
                  </div>
                  <div className="text-left">
                    <span className="font-num text-base sm:text-lg font-black text-[#D4AF37] block">
                      الإجمالي: {formatNum(opt.finalValueEgp, 0)} ج.م
                    </span>
                    <span className="font-num text-xs font-bold text-emerald-400">
                      صافي الربح: +{formatNum(opt.netProfitEgp, 0)} ج.م (+{opt.roiPercent}%)
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3.5 rounded-lg bg-black border border-neutral-800 overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-md transition-all duration-500 ${barColor}`}
                    style={{ width: `${Math.max(12, opt.barWidthPercent)}%` }}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400">
                  <span>{opt.unitsPurchasedLabel} — {opt.subtitle}</span>
                  {opt.monthlyEquivalentEgp > 0 && (
                    <span className="font-num text-emerald-300 font-bold">
                      عائد شهري تقريبي: {formatNum(opt.monthlyEquivalentEgp, 0)} ج.م/شهر
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AdSlot slotId="2020293842" placement="post-result" label="إعلان أسفل مستشار الاستثمار" />
    </div>
  );
}

/* ============================================================================
 * 15. VEHICLE MAINTENANCE & TRAFFIC LICENSING ENGINE (`engineType === 'vehicle-maintenance'`)
 *     (`vehicle-maintenance-tracker` & `vehicle-maintenance-oil-tracker`)
 * ========================================================================== */
const MAINT_STORAGE_KEY = 'dix_vehicle_maintenance_log_v1';

export function VehicleMaintenanceEngine({ defaultParams = {} }) {
  const [vehicleType, setVehicleType] = useState(defaultParams.vehicleType || 'car');
  const [currentOdometerKm, setCurrentOdometerKm] = useState(
    defaultParams.currentOdometerKm || 64500
  );
  const [engineCc, setEngineCc] = useState(defaultParams.engineCc || 1600);
  const [licenseYears, setLicenseYears] = useState(defaultParams.licenseYears || 3);
  const [lastServiceMap, setLastServiceMap] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem(MAINT_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (_e) {
        // Ignore storage error
      }
    }
    return {};
  });
  const [savedNotice, setSavedNotice] = useState('');

  const schedule = useMemo(
    () =>
      calculateVehicleMaintenanceSchedule({
        vehicleType,
        currentOdometerKm,
        lastServiceKmMap: lastServiceMap,
        engineCc,
        licenseYears,
      }),
    [vehicleType, currentOdometerKm, lastServiceMap, engineCc, licenseYears]
  );

  const handleMarkServicedToday = (partId, partName) => {
    const updated = {
      ...lastServiceMap,
      [partId]: currentOdometerKm,
    };
    setLastServiceMap(updated);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(MAINT_STORAGE_KEY, JSON.stringify(updated));
      } catch (_e) {
        // Ignore
      }
    }
    setSavedNotice(`تم تسجيل صيانة «${partName}» عند عداد ${formatNum(currentOdometerKm, 0)} كم بنجاح ✓`);
    window.setTimeout(() => setSavedNotice(''), 3500);
  };

  return (
    <div className="space-y-6" data-testid="vehicle-maintenance-engine">
      {/* Vehicle Type Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'car', label: '🚗 سيارة ملاكي / SUV' },
            { id: 'motorcycle', label: '🏍️ موتوسيكل / دراجة نارية' },
          ].map((v) => (
            <button
              key={v.id}
              type="button"
              data-testid={`vehicle-type-btn-${v.id}`}
              onClick={() => setVehicleType(v.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                vehicleType === v.id
                  ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'bg-[#0A0A0A] text-slate-300 border border-neutral-800'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        {savedNotice && (
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
            {savedNotice}
          </span>
        )}
      </div>

      {/* Odometer & Traffic Licensing Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#F3E5AB]">
            قراءة عداد الكيلومترات الحالي (KM)
          </label>
          <input
            type="number"
            data-testid="vehicle-odometer-input"
            min="0"
            step="500"
            value={currentOdometerKm}
            onChange={(e) => setCurrentOdometerKm(Math.max(0, Number(e.target.value)))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-[#D4AF37]/40 px-4 py-2.5 text-sm font-bold text-[#D4AF37] focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-200">
            سعة المحرك اللترية (CC) لحساب رسوم المرور
          </label>
          <select
            value={engineCc}
            onChange={(e) => setEngineCc(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white"
          >
            {vehicleType === 'motorcycle' ? (
              <>
                <option value={150}>150 CC (موتوسيكل قياسي)</option>
                <option value={200}>200 CC</option>
                <option value={250}>250 CC فأكثر</option>
              </>
            ) : (
              <>
                <option value={1300}>أقل من أو يساوي 1300 CC</option>
                <option value={1600}>من 1301 إلى 1600 CC (الأكثر شيوعاً)</option>
                <option value={2000}>من 1601 إلى 2000 CC</option>
                <option value={2500}>أعلى من 2000 CC</option>
              </>
            )}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-200">
            مدة تجديد رخصة التسيير (سنوات)
          </label>
          <select
            value={licenseYears}
            onChange={(e) => setLicenseYears(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-4 py-2.5 text-sm text-white"
          >
            <option value={1}>سنة واحدة (1 سنة)</option>
            <option value={2}>سنتان (2 سنة)</option>
            <option value={3}>3 سنوات (تجديد كامل)</option>
          </select>
        </div>
      </div>

      {/* Parts Wear Progress Bars */}
      <div className="space-y-3">
        <h4 className="text-sm font-extrabold text-[#F3E5AB]">
          جدول مواعيد الصيانة الدورية ومؤشر استهلاك القطع (%)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schedule.parts.map((part) => {
            const barColor =
              part.status === 'urgent'
                ? 'bg-rose-500'
                : part.status === 'soon'
                ? 'bg-amber-400'
                : 'bg-emerald-400';

            return (
              <div
                key={part.id}
                className="rounded-xl border border-neutral-800 bg-[#0A0A0A] p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs sm:text-sm font-extrabold text-white block">
                      {part.name}
                    </span>
                    <span className="text-[11px] text-slate-400 font-num">
                      يتغير كل {formatNum(part.intervalKm, 0)} كم · آخر صيانة:{' '}
                      {formatNum(part.lastServiceKm, 0)} كم
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      part.status === 'urgent'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : part.status === 'soon'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {part.statusLabel} ({part.wearPercent}%)
                  </span>
                </div>

                <div className="w-full h-2.5 rounded-lg bg-black border border-neutral-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${barColor}`}
                    style={{ width: `${Math.max(5, part.wearPercent)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-num text-[#D4AF37] font-bold">
                    الصيانة القادمة: {formatNum(part.nextDueKm, 0)} كم (متبقي{' '}
                    {formatNum(part.remainingKm, 0)} كم)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleMarkServicedToday(part.id, part.name)}
                    className="px-2.5 py-1 rounded-lg bg-[#141414] hover:bg-[#D4AF37] hover:text-black border border-[#D4AF37]/40 text-[11px] font-bold text-[#F3E5AB] cursor-pointer transition-colors"
                  >
                    سجّل صيانة اليوم ✓
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Egyptian Traffic Licensing & Inspection Estimator */}
      <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <span className="text-xs text-slate-400 block">الضريبة والتأمين الإجباري</span>
          <span className="font-num text-lg font-bold text-white">
            {formatNum(
              schedule.licensingEstimate.annualTaxEgp +
                schedule.licensingEstimate.compulsoryInsuranceEgp,
              0
            )}{' '}
            ج.م
          </span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block">الملصق الإلكتروني والفحص</span>
          <span className="font-num text-lg font-bold text-[#F3E5AB]">
            {formatNum(
              schedule.licensingEstimate.electronicStickerAndPlatesEgp +
                schedule.licensingEstimate.technicalInspectionEgp,
              0
            )}{' '}
            ج.م
          </span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block">طفاية الحريق وحقيبة الإسعافات</span>
          <span className="font-num text-lg font-bold text-emerald-400">
            {formatNum(schedule.licensingEstimate.fireExtinguisherAndFirstAidEgp, 0)} ج.م
          </span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block">
            إجمالي رسوم تجديد المرور ({licenseYears} س)
          </span>
          <span
            data-testid="traffic-licensing-total"
            className="font-num text-2xl font-extrabold text-[#D4AF37]"
          >
            {formatNum(schedule.licensingEstimate.totalLicensingCostEgp, 0)} ج.م
          </span>
        </div>
      </div>

      <AdSlot slotId="2020293842" placement="post-result" label="إعلان أسفل دفتر صيانة المركبات" />
    </div>
  );
}

/* ============================================================================
 * 16. COMMERCIAL SHIPPING AWB GENERATOR (`engineType === 'shipping-awb'`)
 *     (`shipping-awb-generator`)
 * ========================================================================== */
export function ShippingAwbEngine({ defaultParams = {} }) {
  const [senderName, setSenderName] = useState('متجر النخبة للتجارة الإلكترونية');
  const [senderPhone, setSenderPhone] = useState('01001234567');
  const [recipientName, setRecipientName] = useState('محمود أشرف عبد العزيز');
  const [recipientPhone, setRecipientPhone] = useState('01123456789');
  const [governorateId, setGovernorateId] = useState(defaultParams.governorateId || 'CAI');
  const [detailedAddress, setDetailedAddress] = useState(
    'شارع عباس العقاد، مدينة نصر، بجوار الحديقة الدولية، عمارة 14، الدور 3'
  );
  const [productDescription] = useState(
    'ساعة ذكية ألترا + سماعة بلوتوث أصلية بالضمان'
  );
  const [codAmountEgp, setCodAmountEgp] = useState(defaultParams.codAmountEgp || 1450);
  const [piecesCount, setPiecesCount] = useState(defaultParams.piecesCount || 1);
  const [weightKg, setWeightKg] = useState(defaultParams.weightKg || 1.5);
  const [allowOpenPackage, setAllowOpenPackage] = useState(
    defaultParams.allowOpenPackage ?? true
  );

  const summary = useMemo(
    () =>
      calculateShippingAwbSummary({
        governorateId,
        codAmountEgp,
        weightKg,
        piecesCount,
        allowOpenPackage,
      }),
    [governorateId, codAmountEgp, weightKg, piecesCount, allowOpenPackage]
  );

  const qrMatrix = useMemo(
    () =>
      generateQrMatrix(
        `AWB:${summary.awbTrackingNumber}|GOV:${summary.governorate.name}|COD:${summary.codAmountEgp}EGP|TEL:${recipientPhone}`
      ),
    [summary.awbTrackingNumber, summary.governorate.name, summary.codAmountEgp, recipientPhone]
  );

  return (
    <div className="space-y-6" data-testid="shipping-awb-engine">
      {/* Action Header */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <span className="text-xs font-extrabold text-[#F3E5AB] block">
            بوليصة شحن تجارية قياسية (27 محافظة مصرية) — باركود 1D + QR Code
          </span>
          <span className="text-[11px] text-slate-400">
            جاهزة للطباعة على ورق A4 أو طابعات ملصقات الشحن الحرارية (Thermal Label)
          </span>
        </div>
        <button
          type="button"
          data-testid="print-awb-btn"
          onClick={() => typeof window !== 'undefined' && window.print()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs font-black cursor-pointer shadow-lg hover:bg-[#e5c247]"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة بوليصة الشحن PDF فوراً</span>
        </button>
      </div>

      {/* Form Inputs */}
      <div className="no-print grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#F3E5AB]">اسم الراسل / المتجر</label>
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2 text-xs text-white"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#F3E5AB]">اسم المستلم (العميل)</label>
          <input
            type="text"
            data-testid="awb-recipient-input"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2 text-xs text-white"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#F3E5AB]">رقم هاتف المستلم</label>
          <input
            type="text"
            dir="ltr"
            value={recipientPhone}
            onChange={(e) => setRecipientPhone(e.target.value)}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2 text-xs text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#F3E5AB]">
            المحافظة (جميع محافظات مصر الـ 27)
          </label>
          <select
            data-testid="awb-governorate-select"
            value={governorateId}
            onChange={(e) => setGovernorateId(e.target.value)}
            className="w-full rounded-xl bg-[#0A0A0A] border border-[#D4AF37]/40 px-3.5 py-2 text-xs font-bold text-white"
          >
            {EGYPT_27_GOVERNORATES.map((gov) => (
              <option key={gov.id} value={gov.id}>
                {gov.name} — (شحن قياسي: {gov.baseShippingEgp} ج.م)
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold text-slate-300">العنوان التفصيلي وعلامة مميزة</label>
          <input
            type="text"
            value={detailedAddress}
            onChange={(e) => setDetailedAddress(e.target.value)}
            className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2 text-xs text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#F3E5AB]">
            المبلغ المطلوب تحصيله (COD ج.م)
          </label>
          <input
            type="number"
            data-testid="awb-cod-input"
            min="0"
            value={codAmountEgp}
            onChange={(e) => setCodAmountEgp(Math.max(0, Number(e.target.value)))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-[#D4AF37]/40 px-3.5 py-2 text-xs font-bold text-[#D4AF37]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">عدد القطع والوزن (كجم)</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min="1"
              value={piecesCount}
              onChange={(e) => setPiecesCount(Math.max(1, Number(e.target.value)))}
              className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3 py-2 text-xs text-white"
              placeholder="القطع"
            />
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={weightKg}
              onChange={(e) => setWeightKg(Math.max(0.5, Number(e.target.value)))}
              className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3 py-2 text-xs text-white"
              placeholder="الوزن كجم"
            />
          </div>
        </div>

        <div className="space-y-1.5 flex flex-col justify-end">
          <button
            type="button"
            onClick={() => setAllowOpenPackage(!allowOpenPackage)}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-extrabold border cursor-pointer transition-all ${
              allowOpenPackage
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
            }`}
          >
            {allowOpenPackage
              ? '✓ مسموح بفتح الشحنة ومعاينتها أمام المندوب'
              : '✕ غير مسموح بفتح الشحنة قبل السداد'}
          </button>
        </div>
      </div>

      {/* Printable Standard AWB Label */}
      <div
        data-testid="awb-printable-sheet"
        className="print-only-sheet rounded-2xl bg-white text-slate-950 p-5 sm:p-7 shadow-2xl border-2 border-slate-900 space-y-4"
      >
        {/* Top Row: Carrier Header + 1D Barcode */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-slate-900 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              AIR WAYBILL · بوليصة شحن وتحصيل رسمية
            </span>
            <h3 className="text-xl font-black text-slate-950">{senderName}</h3>
            <span className="text-xs font-bold text-slate-700 font-num">
              هاتف الراسل: {senderPhone} · تاريخ الإصدار: {new Date().toLocaleDateString('ar-EG')}
            </span>
          </div>

          {/* 1D Linear Barcode SVG */}
          <div className="flex flex-col items-center bg-white border border-slate-300 rounded-lg px-3 py-2">
            <svg
              viewBox={`0 0 ${summary.barcodeBars.length * 3} 44`}
              className="w-48 h-11"
              aria-label="1D Barcode"
            >
              {summary.barcodeBars.map((bar, idx) =>
                idx % 2 === 0 ? (
                  <rect key={idx} x={idx * 3} y={0} width={Math.max(1.5, bar * 1.1)} height={44} fill="#000000" />
                ) : null
              )}
            </svg>
            <span dir="ltr" className="font-num text-xs font-black tracking-widest text-slate-900 mt-1">
              {summary.awbTrackingNumber}
            </span>
          </div>
        </div>

        {/* Middle Grid: Recipient Info + Governorate Zone + QR Code */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center border-b-2 border-slate-900 pb-4">
          <div className="sm:col-span-8 space-y-2 text-xs sm:text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded bg-slate-900 text-white font-black text-sm">
                محافظة: {summary.governorate.name} ({summary.governorate.zoneCode})
              </span>
              <span
                className={`px-3 py-1 rounded font-black text-xs border ${
                  allowOpenPackage
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                    : 'bg-rose-100 text-rose-900 border-rose-400'
                }`}
              >
                {allowOpenPackage ? 'مسموح بفتح الشحنة ومعاينتها ✓' : 'ممنوع فتح الشحنة ✕'}
              </span>
            </div>
            <p>
              <strong>المستلم:</strong> {recipientName} —{' '}
              <strong className="font-num" dir="ltr">
                {recipientPhone}
              </strong>
            </p>
            <p>
              <strong>العنوان بالتفصيل:</strong> {detailedAddress}
            </p>
            <p>
              <strong>محتويات الطرد:</strong> {productDescription} ({piecesCount} قطعة ·{' '}
              {weightKg} كجم)
            </p>
          </div>

          {/* 2D QR Code */}
          <div className="sm:col-span-4 flex flex-col items-center justify-center border-r border-slate-300 pr-4">
            <svg
              viewBox={`0 0 ${qrMatrix.length} ${qrMatrix.length}`}
              className="w-24 h-24 border border-slate-300 p-1 bg-white"
              aria-label="2D QR Code"
            >
              {qrMatrix.map((row, rIdx) =>
                row.map((cell, cIdx) =>
                  cell ? (
                    <rect key={`${rIdx}-${cIdx}`} x={cIdx} y={rIdx} width={1} height={1} fill="#000" />
                  ) : null
                )
              )}
            </svg>
            <span className="text-[10px] font-bold text-slate-600 mt-1">امسح QR لتأكيد التسليم</span>
          </div>
        </div>

        {/* Bottom COD & Merchant Payout Box */}
        <div className="grid grid-cols-3 gap-3 bg-slate-100 rounded-xl p-3 border border-slate-300 text-center">
          <div>
            <span className="text-[11px] font-bold text-slate-600 block">
              المطلوب تحصيله من العميل (COD)
            </span>
            <span className="font-num text-xl font-black text-slate-950">
              {formatNum(summary.codAmountEgp, 0)} ج.م
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-600 block">
              تكلفة الشحن ({summary.governorate.name})
            </span>
            <span className="font-num text-base font-extrabold text-slate-800">
              {formatNum(summary.totalShippingFee, 0)} ج.م
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-600 block">
              صافي مستحقات التاجر
            </span>
            <span className="font-num text-lg font-black text-emerald-700">
              {formatNum(summary.netMerchantPayoutEgp, 0)} ج.م
            </span>
          </div>
        </div>
      </div>

      <AdSlot slotId="2020293842" placement="post-result" label="إعلان أسفل مولد بوليصة الشحن" />
    </div>
  );
}

/* ============================================================================
 * 17. PRODUCT PROMO BADGE & E-COMMERCE STUDIO (`engineType === 'promo-badge'`)
 *     (`product-promo-badge-maker` -> `components/tools/ProductPromoStudio.jsx`)
 * ========================================================================== */
export function ProductPromoBadgeEngine({ defaultParams = {} }) {
  return <ProductPromoStudio defaultParams={defaultParams} />;
}

/* ============================================================================
 * 18. NO-CODE DYNAMIC CUSTOM FORMULA ENGINE (`engineType === 'custom-formula'`)
 * Renders dynamic fields (`number`, `select`, `text`) and evaluates `tool.formula`
 * with live Egypt Oracle variables + custom global variables from Module 6.
 * ========================================================================== */
export function CustomFormulaEngine({ tool }) {
  let siteConfigCtx = null;
  try {
    siteConfigCtx = useSiteConfig();
  } catch (_err) {
    siteConfigCtx = null;
  }

  const fields = useMemo(() => {
    if (Array.isArray(tool?.fields) && tool.fields.length > 0) {
      return tool.fields;
    }
    return [
      {
        id: 'f-weight',
        varName: 'weight',
        label: 'الوزن بالجرام (weight)',
        type: 'number',
        defaultValue: 10,
      },
      {
        id: 'f-workmanship',
        varName: 'workmanship',
        label: 'المصنعية الإجمالية (workmanship)',
        type: 'number',
        defaultValue: 800,
      },
    ];
  }, [tool?.fields]);

  const [values, setValues] = useState(() => {
    const init = {};
    for (const f of fields) {
      init[f.varName] =
        f.type === 'number'
          ? Number(f.defaultValue ?? 1)
          : f.defaultValue ?? (f.options?.[0]?.value || '');
    }
    return init;
  });

  useEffect(() => {
    const init = {};
    for (const f of fields) {
      init[f.varName] =
        f.type === 'number'
          ? Number(f.defaultValue ?? 1)
          : f.defaultValue ?? (f.options?.[0]?.value || '');
    }
    setValues(init);
  }, [fields]);

  const liveOracleVars = useMemo(() => {
    const lr = siteConfigCtx?.config?.liveRates || {};
    const customVarsList = Array.isArray(lr.customVariables) ? lr.customVariables : [];
    const customMap = {};
    for (const cv of customVarsList) {
      if (cv?.key) customMap[cv.key] = Number(cv.value) || 0;
    }
    return {
      karat24: Number(lr.gold?.karat24) || 4355,
      karat22: Number(lr.gold?.karat22) || 3992,
      karat21: Number(lr.gold?.karat21) || 3811,
      karat18: Number(lr.gold?.karat18) || 3266,
      karat14: Number(lr.gold?.karat14) || 2540,
      goldCoin8g: Number(lr.gold?.goldCoin8g) || 30488,
      USD: Number(lr.currenciesToEgp?.USD) || 50.45,
      SAR: Number(lr.currenciesToEgp?.SAR) || 13.45,
      AED: Number(lr.currenciesToEgp?.AED) || 13.74,
      KWD: Number(lr.currenciesToEgp?.KWD) || 164.2,
      EUR: Number(lr.currenciesToEgp?.EUR) || 54.6,
      GBP: Number(lr.currenciesToEgp?.GBP) || 64.1,
      fuel80: Number(lr.energyAndUtilities?.fuel80) || 20.75,
      fuel92: Number(lr.energyAndUtilities?.fuel92) || 22.25,
      fuel95: Number(lr.energyAndUtilities?.fuel95) || 24.0,
      diesel: Number(lr.energyAndUtilities?.diesel) || 13.5,
      certYield: Number(lr.bankingAndTaxes?.certAnnualYield) || 27.0,
      vatEgypt: Number(lr.bankingAndTaxes?.vatEgyptPercent) || 14.0,
      ...customMap,
    };
  }, [siteConfigCtx?.config?.liveRates]);

  const evalResult = useMemo(
    () =>
      evaluateCustomToolFormula(
        tool?.formula || '(weight * karat21) + workmanship',
        values,
        liveOracleVars
      ),
    [tool?.formula, values, liveOracleVars]
  );

  const tafqeetResult = useMemo(
    () => numberToArabicWordsTafqeet(Math.max(0, evalResult.value), 'جنيه مصري', 'قرشاً'),
    [evalResult.value]
  );

  return (
    <div className="space-y-6" data-testid="custom-formula-engine">
      <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#0A0A0A] p-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-extrabold text-[#F3E5AB] flex items-center gap-1.5">
          <Calculator className="w-4 h-4 text-[#D4AF37]" />
          <span>{tool?.badge || 'أداة مخصصة · No-Code Formula Engine'}</span>
        </span>
        <span
          dir="ltr"
          className="font-num text-[11px] px-3 py-1 rounded-lg bg-[#141414] border border-neutral-800 text-[#D4AF37]"
        >
          Formula: {tool?.formula}
        </span>
      </div>

      {/* Dynamic Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((f) => (
          <div key={f.id || f.varName} className="space-y-1.5">
            <label className="block text-xs font-bold text-[#F3E5AB]">
              {f.label}{' '}
              <span dir="ltr" className="font-num text-[10px] text-slate-400">
                ({f.varName})
              </span>
            </label>
            {f.type === 'select' && Array.isArray(f.options) && f.options.length > 0 ? (
              <select
                value={values[f.varName] ?? ''}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    [f.varName]: Number.isFinite(Number(e.target.value))
                      ? Number(e.target.value)
                      : e.target.value,
                  }))
                }
                className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-xs font-bold text-white focus:border-[#D4AF37] focus:outline-none"
              >
                {f.options.map((opt, idx) => (
                  <option key={idx} value={opt.value}>
                    {opt.label} ({opt.value})
                  </option>
                ))}
              </select>
            ) : f.type === 'text' ? (
              <input
                type="text"
                value={values[f.varName] ?? ''}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    [f.varName]: e.target.value,
                  }))
                }
                className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              />
            ) : (
              <input
                type="number"
                step="any"
                data-testid={`custom-field-${f.varName}`}
                value={values[f.varName] ?? 0}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    [f.varName]: Number(e.target.value),
                  }))
                }
                className="font-num w-full rounded-xl bg-[#0A0A0A] border border-[#D4AF37]/40 px-3.5 py-2.5 text-sm font-bold text-white focus:border-[#D4AF37] focus:outline-none"
              />
            )}
          </div>
        ))}
      </div>

      {/* Live Result Box */}
      <div
        data-testid="custom-formula-result-box"
        className="rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-l from-[#D4AF37]/15 via-[#141414] to-[#0A0A0A] p-6 space-y-3 shadow-xl"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-slate-300 block">
              {tool?.resultLabel || 'النتيجة النهائية المحسوبة'}
            </span>
            <div className="font-num text-2xl sm:text-3xl font-black text-[#D4AF37] mt-1">
              {evalResult.formattedValue} {tool?.resultUnit || 'ج.م'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => typeof window !== 'undefined' && window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs font-black cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة التقرير PDF A4</span>
          </button>
        </div>

        <p className="text-xs text-emerald-300 font-bold border-t border-neutral-800 pt-2.5">
          التفقيط القانوني: {tafqeetResult.fullLegalCheckString}
        </p>
      </div>

      <AdSlot slotId="2020293842" placement="post-result" label="إعلان أسفل الأداة المخصصة" />
    </div>
  );
}

/* ============================================================================
 * 19. EGYPT 27 GOVERNORATES HUB ENGINE (`engineType === 'egypt-governorates-hub'`)
 *     (`egypt-governorates-hub`) - [Feature 6]
 * ========================================================================== */
export function EgyptGovernoratesHubEngine({ defaultParams = {} }) {
  let siteConfigCtx = null;
  try {
    siteConfigCtx = useSiteConfig();
  } catch (_err) {
    siteConfigCtx = null;
  }

  const liveEnergy = siteConfigCtx?.config?.liveRates?.energyAndUtilities || {};
  const liveFuel80 =
    Number(liveEnergy.fuel80 ?? liveEnergy.gas80) >= 18
      ? Number(liveEnergy.fuel80 ?? liveEnergy.gas80)
      : 20.75;
  const liveFuel92 =
    Number(liveEnergy.fuel92 ?? liveEnergy.gas92) >= 18
      ? Number(liveEnergy.fuel92 ?? liveEnergy.gas92)
      : 22.25;
  const liveFuel95 =
    Number(liveEnergy.fuel95 ?? liveEnergy.gas95) >= 18
      ? Number(liveEnergy.fuel95 ?? liveEnergy.gas95)
      : 24.0;
  const liveDiesel = Number(liveEnergy.diesel) > 0 ? Number(liveEnergy.diesel) : 13.5;

  const fuelOptions = useMemo(
    () => [
      { id: 'fuel80', label: `بنزين 80 (${liveFuel80.toFixed(2)} ج.م/لتر)`, price: liveFuel80 },
      { id: 'fuel92', label: `بنزين 92 (${liveFuel92.toFixed(2)} ج.م/لتر)`, price: liveFuel92 },
      { id: 'fuel95', label: `بنزين 95 (${liveFuel95.toFixed(2)} ج.م/لتر)`, price: liveFuel95 },
      { id: 'diesel', label: `سولار / ديزل (${liveDiesel.toFixed(2)} ج.م/لتر)`, price: liveDiesel },
    ],
    [liveFuel80, liveFuel92, liveFuel95, liveDiesel]
  );

  const [fromGovId, setFromGovId] = useState(defaultParams.fromGovId || 'CAI');
  const [toGovId, setToGovId] = useState(defaultParams.toGovId || 'ALX');
  const [isRoundTrip, setIsRoundTrip] = useState(Boolean(defaultParams.isRoundTrip));
  const [selectedFuelId, setSelectedFuelId] = useState(defaultParams.fuelGradeId || 'fuel92');
  const [consumptionPer100Km, setConsumptionPer100Km] = useState(
    Number(defaultParams.consumptionPer100Km) || 8.5
  );
  const [packageWeightKg, setPackageWeightKg] = useState(
    Number(defaultParams.packageWeightKg) || 2
  );
  const [searchGovQuery, setSearchGovQuery] = useState('');

  const activeFuelObj =
    fuelOptions.find((f) => f.id === selectedFuelId) || fuelOptions[1];

  const tripSummary = useMemo(
    () =>
      calculateEgyptInterGovernorateTrip({
        fromGovId,
        toGovId,
        isRoundTrip,
        fuelPricePerLiter: activeFuelObj.price,
        consumptionPer100Km,
        packageWeightKg,
      }),
    [
      fromGovId,
      toGovId,
      isRoundTrip,
      activeFuelObj.price,
      consumptionPer100Km,
      packageWeightKg,
    ]
  );

  const filteredDirectory = useMemo(() => {
    const q = searchGovQuery.trim();
    if (!q) return EGYPT_27_GOVERNORATES;
    return EGYPT_27_GOVERNORATES.filter(
      (g) =>
        g.name.includes(q) ||
        g.region.includes(q) ||
        g.landlineCode.includes(q) ||
        g.postalCode.includes(q)
    );
  }, [searchGovQuery]);

  const csvRows = useMemo(
    () =>
      EGYPT_27_GOVERNORATES.map((g) => [
        g.name,
        g.region,
        g.landlineCode,
        g.postalCode,
        `${g.distanceFromCairoKm} كم`,
        `${g.baseShippingEgp} ج.م`,
        g.deliveryDays,
      ]),
    []
  );

  return (
    <div className="space-y-6" data-testid="egypt-governorates-hub-engine">
      {/* Top Route Selector & Swap */}
      <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-5 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
          <span className="text-xs sm:text-sm font-black text-[#F3E5AB]">
            حاسبة المسافات، تكلفة البنزين الرسمية، الشحن، والأكواد البريدية بين الـ 27 محافظة مصرية
          </span>
          <button
            type="button"
            data-testid="gov-swap-btn"
            onClick={() => {
              const prevFrom = fromGovId;
              setFromGovId(toGovId);
              setToGovId(prevFrom);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#D4AF37] text-black text-xs font-black cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>عكس خط السير ⇄</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#F3E5AB]">
              محافظة الانطلاق (من)
            </label>
            <select
              data-testid="gov-from-select"
              value={fromGovId}
              onChange={(e) => setFromGovId(e.target.value)}
              className="w-full rounded-xl bg-[#141414] border border-[#D4AF37]/40 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-white"
            >
              {EGYPT_27_GOVERNORATES.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} (مفتاح {g.landlineCode} · بريد {g.postalCode})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#F3E5AB]">
              محافظة الوصول (إلى)
            </label>
            <select
              data-testid="gov-to-select"
              value={toGovId}
              onChange={(e) => setToGovId(e.target.value)}
              className="w-full rounded-xl bg-[#141414] border border-[#D4AF37]/40 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-white"
            >
              {EGYPT_27_GOVERNORATES.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} (مفتاح {g.landlineCode} · بريد {g.postalCode})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              نوع الوقود المعتمد في مصر
            </label>
            <select
              data-testid="gov-fuel-grade-select"
              value={selectedFuelId}
              onChange={(e) => setSelectedFuelId(e.target.value)}
              className="w-full rounded-xl bg-[#141414] border border-neutral-800 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-[#D4AF37]"
            >
              {fuelOptions.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-300">
                استهلاك لتر/100كم
              </label>
              <input
                type="number"
                step="0.5"
                min="3"
                value={consumptionPer100Km}
                onChange={(e) => setConsumptionPer100Km(Number(e.target.value))}
                className="font-num w-full rounded-xl bg-[#141414] border border-neutral-800 px-3 py-2 text-xs font-bold text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-300">
                وزن الطرد (كجم)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={packageWeightKg}
                onChange={(e) => setPackageWeightKg(Number(e.target.value))}
                className="font-num w-full rounded-xl bg-[#141414] border border-neutral-800 px-3 py-2 text-xs font-bold text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsRoundTrip(false)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                !isRoundTrip
                  ? 'bg-[#D4AF37] text-black'
                  : 'bg-[#141414] text-slate-300 border border-neutral-800'
              }`}
            >
              اتجاه واحد (ذهاب فقط)
            </button>
            <button
              type="button"
              onClick={() => setIsRoundTrip(true)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                isRoundTrip
                  ? 'bg-[#D4AF37] text-black'
                  : 'bg-[#141414] text-slate-300 border border-neutral-800'
              }`}
            >
              ذهاب وعودة (×2)
            </button>
          </div>
          <span className="text-[11px] text-slate-400">
            إقليم الانطلاق: <strong className="text-[#F3E5AB]">{tripSummary.fromGov.region}</strong> ⬅ إقليم الوصول:{' '}
            <strong className="text-[#F3E5AB]">{tripSummary.toGov.region}</strong>
          </span>
        </div>
      </div>

      {/* Results Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-4 space-y-1">
          <span className="text-xs text-slate-400 block">
            المسافة وزمن السفر التقريبي
          </span>
          <div
            data-testid="gov-distance-km"
            className="font-num text-2xl font-black text-white"
          >
            {tripSummary.effectiveDistanceKm} كم
          </div>
          <span className="text-xs font-bold text-[#F3E5AB] block">
            ⏱ نحو {tripSummary.travelTimeFormatted} بالسيارة
          </span>
        </div>

        <div className="rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-br from-[#1C1605] to-[#0A0A0A] p-4 space-y-1">
          <span className="text-xs text-[#F3E5AB] font-bold block">
            تكلفة البنزين للرحلة ({activeFuelObj.label.split(' ')[1]})
          </span>
          <div
            data-testid="gov-fuel-trip-cost"
            className="font-num text-2xl font-black text-[#D4AF37]"
          >
            {formatNum(tripSummary.fuelTripCostEgp, 0)} ج.م
          </div>
          <span className="font-num text-xs text-emerald-400 font-bold block">
            ⛽ تحتاج نحو {tripSummary.fuelLitersNeeded} لتر وقود
          </span>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-4 space-y-1">
          <span className="text-xs text-slate-400 block">
            متوسط تكلفة الشحن التجاري ({packageWeightKg} كجم)
          </span>
          <div
            data-testid="gov-shipping-cost"
            className="font-num text-2xl font-black text-emerald-400"
          >
            {formatNum(tripSummary.commercialShippingCostEgp, 0)} ج.م
          </div>
          <span className="text-xs text-slate-300 block">
            📦 مدة التوصيل: {tripSummary.deliveryDaysEstimate}
          </span>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-4 space-y-1.5">
          <span className="text-xs text-slate-400 block">
            كود الأرضي والرمز البريدي الرئيسي
          </span>
          <div className="text-xs font-bold text-white flex items-center justify-between">
            <span>{tripSummary.fromGov.name}:</span>
            <span className="font-num text-[#D4AF37]">
              أرضي {tripSummary.fromGov.landlineCode} · بريد {tripSummary.fromGov.postalCode}
            </span>
          </div>
          <div className="text-xs font-bold text-white flex items-center justify-between border-t border-neutral-800 pt-1">
            <span>{tripSummary.toGov.name}:</span>
            <span className="font-num text-emerald-400">
              أرضي {tripSummary.toGov.landlineCode} · بريد {tripSummary.toGov.postalCode}
            </span>
          </div>
        </div>
      </div>

      {/* Full 27 Egyptian Governorates Reference Table + 1-Click Excel Export */}
      <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-sm sm:text-base font-black text-white">
              الدليل الرسمي الشامل لجميع محافظات مصر الـ 27 (الأكواد الأرضية، البريد، الشحن، والمسافة)
            </h3>
            <p className="text-xs text-slate-400">
              اضغط على أي محافظة لتعيينها كمحافظة وصول وحساب تكلفة البنزين والشحن إليها فوراً
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={searchGovQuery}
              onChange={(e) => setSearchGovQuery(e.target.value)}
              placeholder="ابحث باسم المحافظة أو الكود..."
              className="rounded-xl bg-[#141414] border border-neutral-800 px-3.5 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
            />
            <ExcelExportBtn
              filename="dix-tools-egypt-27-governorates.csv"
              headers={[
                'المحافظة',
                'الإقليم الجغرافي',
                'كود المفتاح الأرضي',
                'الرمز البريدي الرئيسي',
                'المسافة من القاهرة',
                'سعر الشحن الأساسي',
                'مدة التوصيل المعتادة',
              ]}
              rows={csvRows}
              label="تصدير دليل الـ 27 محافظة (Excel)"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-neutral-800 max-h-80">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#141414] text-[#F3E5AB] border-b border-neutral-800 sticky top-0">
              <tr>
                <th className="py-2.5 px-3">المحافظة</th>
                <th className="py-2.5 px-3">الإقليم</th>
                <th className="py-2.5 px-3">كود الأرضي</th>
                <th className="py-2.5 px-3">الرمز البريدي</th>
                <th className="py-2.5 px-3">المسافة عن القاهرة</th>
                <th className="py-2.5 px-3">الشحن التجاري</th>
                <th className="py-2.5 px-3">مدة التوصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {filteredDirectory.map((g) => (
                <tr
                  key={g.id}
                  onClick={() => setToGovId(g.id)}
                  className={`cursor-pointer transition-colors ${
                    g.id === toGovId
                      ? 'bg-[#D4AF37]/15 text-white'
                      : 'hover:bg-[#141414] text-slate-200'
                  }`}
                >
                  <td className="py-2.5 px-3 font-extrabold text-white">{g.name}</td>
                  <td className="py-2.5 px-3 text-slate-400">{g.region}</td>
                  <td className="py-2.5 px-3 font-num font-bold text-[#D4AF37]">
                    {g.landlineCode}
                  </td>
                  <td className="py-2.5 px-3 font-num font-bold text-emerald-400">
                    {g.postalCode}
                  </td>
                  <td className="py-2.5 px-3 font-num">{g.distanceFromCairoKm} كم</td>
                  <td className="py-2.5 px-3 font-num font-bold text-[#F3E5AB]">
                    {g.baseShippingEgp} ج.م
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">{g.deliveryDays}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdSlot slotId="2020293842" placement="post-result" label="إعلان أسفل دليل المحافظات" />
    </div>
  );
}

/* ============================================================================
 * MASTER ROUTER ENGINE DISPATCHER (`MasterEngines.jsx`)
 * ========================================================================== */
export default function MasterEngines({ tool }) {
  if (!tool) return null;
  const { slug, engineType, defaultParams } = tool;

  if (EXPANDED_48_SLUGS.has(slug) || EXPANDED_48_SLUGS.has(engineType)) {
    return <ExpandedMasterEngines tool={tool} />;
  }

  switch (engineType) {
    case 'egypt-finishing':
      return <EgyptFinishingCalculator defaultParams={defaultParams} />;
    case 'custom-formula':
      return <CustomFormulaEngine tool={tool} />;
    case 'egypt-governorates-hub':
      return <EgyptGovernoratesHubEngine defaultParams={defaultParams} />;
    case 'live-scanner':
      return <LiveCameraScanner />;
    case 'batch-processor':
      return <BatchProcessorEngine initialTab={defaultParams?.initialTab || 'barcodes'} />;
    case 'currency':
      return <CurrencyMasterEngine defaultParams={defaultParams} />;
    case 'gold':
      return <GoldMasterEngine defaultParams={defaultParams} />;
    case 'investment-comparator':
      return <InvestmentComparatorEngine defaultParams={defaultParams} />;
    case 'vehicle-maintenance':
      return <VehicleMaintenanceEngine defaultParams={defaultParams} />;
    case 'shipping-awb':
      return <ShippingAwbEngine defaultParams={defaultParams} />;
    case 'promo-badge':
      return <ProductPromoBadgeEngine defaultParams={defaultParams} />;
    case 'tafqeet':
      return <TafqeetMasterEngine defaultParams={defaultParams} />;
    case 'inheritance':
      return <InheritanceMasterEngine defaultParams={defaultParams} />;
    case 'unit':
      return <UnitMasterEngine defaultParams={defaultParams} />;
    case 'finance':
      return <FinanceMasterEngine defaultParams={defaultParams} />;
    case 'business':
      return <BusinessMasterEngine defaultParams={defaultParams} />;
    case 'lifestyle':
      return <LifestyleMasterEngine defaultParams={defaultParams} />;
    case 'image':
      return <ImageMasterEngine defaultParams={defaultParams} />;
    case 'energy':
      return <EnergyMasterEngine defaultParams={defaultParams} />;
    case 'document':
      return <DocumentMasterEngine defaultParams={defaultParams} />;
    case 'qr':
      return <QrMasterEngine defaultParams={defaultParams} />;
    case 'text-code':
      return <TextCodeMasterEngine defaultParams={defaultParams} />;
    default:
      return <ExpandedMasterEngines tool={tool} />;
  }
}
