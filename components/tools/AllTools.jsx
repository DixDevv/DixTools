'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Scale,
  Fuel,
  Landmark,
  Gem,
  ArrowLeftRight,
  ImageDown,
  QrCode,
  FileSignature,
  Calculator,
  Coins,
  Download,
  Printer,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  Copy,
  Upload,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import AdSlot from '../AdSlot';
import {
  calculateZakatAndGold,
  calculateFuelTrip,
  calculateLoanSchedule,
  calculateCertificateProfit,
  calculateGoldWorkmanship,
  calculateCurrencyConversion,
  calculateInvoiceTotals,
} from '../../src/utils/calculations';
import { generateQrMatrix } from '../../src/utils/qrMatrix';

const formatNum = (val, decimals = 2) => {
  const num = Number(val) || 0;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

/* ============================================================================
 * 1. ZAKAT & GOLD CALCULATOR (`zakat-gold-calculator`)
 * ========================================================================== */
export function ZakatGoldCalculator() {
  const [currency, setCurrency] = useState('ج.م');
  const [gold24Price, setGold24Price] = useState(4320);
  const [cashAndSavings, setCashAndSavings] = useState(250000);
  const [stocksAndInvestments, setStocksAndInvestments] = useState(45000);
  const [businessInventory, setBusinessInventory] = useState(0);
  const [gold24Grams, setGold24Grams] = useState(10);
  const [gold21Grams, setGold21Grams] = useState(35);
  const [gold18Grams, setGold18Grams] = useState(12);
  const [liabilitiesAndDebts, setLiabilitiesAndDebts] = useState(15000);
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () =>
      calculateZakatAndGold({
        gold24PricePerGram: gold24Price,
        cashAndSavings,
        stocksAndInvestments,
        businessInventory,
        gold24Grams,
        gold21Grams,
        gold18Grams,
        liabilitiesAndDebts,
      }),
    [
      gold24Price,
      cashAndSavings,
      stocksAndInvestments,
      businessInventory,
      gold24Grams,
      gold21Grams,
      gold18Grams,
      liabilitiesAndDebts,
    ]
  );

  const applyCurrencyPreset = (currLabel, defaultPrice24) => {
    setCurrency(currLabel);
    setGold24Price(defaultPrice24);
  };

  const handleReset = () => {
    setGold24Price(4320);
    setCashAndSavings(0);
    setStocksAndInvestments(0);
    setBusinessInventory(0);
    setGold24Grams(0);
    setGold21Grams(0);
    setGold18Grams(0);
    setLiabilitiesAndDebts(0);
  };

  const handleCopySummary = () => {
    const summaryText = `نتيجة حساب زكاة المال والذهب (منصة مِيزان):
- صافي الوعاء الزكوي: ${formatNum(result.netZakatableWealth)} ${currency}
- قيمة النصاب الشرعي (85 جرام عيار 24): ${formatNum(result.nisabThresholdValue)} ${currency}
- الحالة الشرعية: ${result.isEligibleForZakat ? 'بلغ النصاب وتجب فيه الزكاة (2.5%)' : 'لم يبلغ النصاب الشرعي'}
- مقدار الزكاة الواجب إخراجه: ${formatNum(result.totalZakatDue)} ${currency}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Currency Presets & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">عملة الحساب وسعر عيار 24:</span>
          {[
            { label: 'ج.م (مصر)', symbol: 'ج.م', price: 4320 },
            { label: 'ر.س (السعودية)', symbol: 'ر.س', price: 335 },
            { label: 'د.إ (الإمارات)', symbol: 'د.إ', price: 328 },
            { label: 'دولار ($)', symbol: '$', price: 89 },
          ].map((preset) => (
            <button
              key={preset.symbol}
              type="button"
              onClick={() => applyCurrencyPreset(preset.symbol, preset.price)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                currency === preset.symbol
                  ? 'bg-[#D4AF37] text-slate-950'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-[#D4AF37]/50'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>تصفير الحقول</span>
        </button>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label
            htmlFor="zakat-gold24-price"
            className="block text-xs font-bold text-[#F3E5AB]"
          >
            سعر جرام الذهب عيار 24 اليوم ({currency}) — لتحديد النصاب (85 جم)
          </label>
          <input
            id="zakat-gold24-price"
            type="number"
            min="0"
            step="any"
            value={gold24Price}
            onChange={(e) => setGold24Price(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="zakat-cash"
            className="block text-xs font-bold text-slate-200"
          >
            السيولة النقدية والمدخرات البنكية ({currency})
          </label>
          <input
            id="zakat-cash"
            type="number"
            min="0"
            step="any"
            value={cashAndSavings}
            onChange={(e) => setCashAndSavings(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="zakat-stocks"
            className="block text-xs font-bold text-slate-200"
          >
            قيمة الأسهم، الصناديق الاستثمارية، أو عروض التجارة ({currency})
          </label>
          <input
            id="zakat-stocks"
            type="number"
            min="0"
            step="any"
            value={stocksAndInvestments}
            onChange={(e) => setStocksAndInvestments(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="zakat-debts"
            className="block text-xs font-bold text-rose-300"
          >
            الديون الحالة والأقساط واجبة السداد فوراً ({currency})
          </label>
          <input
            id="zakat-debts"
            type="number"
            min="0"
            step="any"
            value={liabilitiesAndDebts}
            onChange={(e) => setLiabilitiesAndDebts(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>
      </div>

      {/* Gold Weights Sub-Grid */}
      <div className="pt-2 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#D4AF37]" />
            <span>أوزان الذهب المدخر (يتم تحويل العيارات تلقائياً إلى مكافئ عيار 24 الخالص)</span>
          </h3>
          <span className="font-num text-xs text-[#D4AF37]">
            المكافئ الصافي: {formatNum(result.pureGold24EquivalentGrams)} جم عيار 24
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="zakat-g24" className="block text-xs text-slate-300">
              وزن ذهب عيار 24 (بالجرام)
            </label>
            <input
              id="zakat-g24"
              type="number"
              min="0"
              step="any"
              value={gold24Grams}
              onChange={(e) => setGold24Grams(Number(e.target.value))}
              className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="zakat-g21" className="block text-xs text-slate-300">
              وزن ذهب عيار 21 (بالجرام)
            </label>
            <input
              id="zakat-g21"
              type="number"
              min="0"
              step="any"
              value={gold21Grams}
              onChange={(e) => setGold21Grams(Number(e.target.value))}
              className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="zakat-g18" className="block text-xs text-slate-300">
              وزن ذهب عيار 18 (بالجرام)
            </label>
            <input
              id="zakat-g18"
              type="number"
              min="0"
              step="any"
              value={gold18Grams}
              onChange={(e) => setGold18Grams(Number(e.target.value))}
              className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Primary Result Box */}
      <div className="rounded-2xl border border-[#D4AF37]/40 bg-slate-950/90 p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold">
              {result.isEligibleForZakat ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>بلغ النصاب الشرعي وتجب فيه الزكاة (2.5%)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-amber-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>لم يبلغ النصاب الشرعي بعد ({result.nisabCompletionPercent}% من النصاب)</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              قيمة نصاب الزكاة (85 جرام ذهب عيار 24):{' '}
              <strong className="font-num text-slate-200">
                {formatNum(result.nisabThresholdValue)} {currency}
              </strong>
            </p>
          </div>

          <div className="text-right sm:text-left">
            <span className="block text-xs text-slate-400">مقدار الزكاة الواجب إخراجه</span>
            <span
              data-testid="zakat-due-value"
              className="font-num text-2xl sm:text-3xl font-extrabold text-[#D4AF37]"
            >
              {formatNum(result.totalZakatDue)} <small className="text-sm">{currency}</small>
            </span>
          </div>
        </div>

        {/* Breakdown Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 block">إجمالي النقد والأسهم</span>
            <span className="font-num text-sm font-bold text-white">
              {formatNum(result.totalCashAndAssets)} {currency}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 block">قيمة الذهب المدخر</span>
            <span className="font-num text-sm font-bold text-white">
              {formatNum(result.totalGoldValue)} {currency}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 block">صافي الوعاء الزكوي</span>
            <span className="font-num text-sm font-bold text-emerald-400">
              {formatNum(result.netZakatableWealth)} {currency}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 block">زكاة الذهب / زكاة النقد</span>
            <span className="font-num text-sm font-bold text-[#F3E5AB]">
              {formatNum(result.zakatOnGoldPortion)} / {formatNum(result.zakatOnCashPortion)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-slate-950 text-xs font-bold hover:bg-[#e3be42] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'تم نسخ تقرير الزكاة بنجاح' : 'نسخ تقرير الزكاة التفصيلي'}</span>
          </button>
          <span className="text-[11px] text-slate-400">
            معادلة ربع العشر المعتمدة شرعاً: صافي الوعاء الزكوي × 2.5%
          </span>
        </div>
      </div>

      {/* Strategic Ad Placement #2: Directly Below Result & Action Button */}
      <AdSlot
        slotId="2020293842"
        placement="post-result"
        label="إعلان أسفل نتيجة حساب الزكاة"
      />
    </div>
  );
}

/* ============================================================================
 * 2. FUEL & TRIP COST CALCULATOR (`fuel-trip-calculator`)
 * ========================================================================== */
export function FuelTripCalculator() {
  const [distanceKm, setDistanceKm] = useState(215);
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  const [consumptionPer100Km, setConsumptionPer100Km] = useState(8.2);
  const [fuelPricePerLiter, setFuelPricePerLiter] = useState(22.25);
  const [selectedFuelName, setSelectedFuelName] = useState('بنزين 92');
  const [passengersCount, setPassengersCount] = useState(4);

  const fuelPresets = [
    { name: 'بنزين 80', price: 20.75 },
    { name: 'بنزين 92', price: 22.25 },
    { name: 'بنزين 95', price: 24.0 },
    { name: 'سولار / ديزل', price: 13.5 },
  ];

  const carConsumptionPresets = [
    { label: 'اقتصادية (6.2 لتر/100كم)', rate: 6.2 },
    { label: 'سيدان متوسطة (8.2 لتر/100كم)', rate: 8.2 },
    { label: 'دفع رباعي SUV (11.5 لتر/100كم)', rate: 11.5 },
  ];

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
      {/* Fuel Grade Quick Selector */}
      <div className="space-y-2 pb-4 border-b border-slate-800">
        <span className="block text-xs font-bold text-slate-300">
          اختر نوع الوقود أو عدّل السعر يدوياً:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {fuelPresets.map((fuel) => (
            <button
              key={fuel.name}
              type="button"
              onClick={() => {
                setSelectedFuelName(fuel.name);
                setFuelPricePerLiter(fuel.price);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedFuelName === fuel.name && fuelPricePerLiter === fuel.price
                  ? 'bg-[#D4AF37] text-slate-950'
                  : 'bg-slate-900 text-slate-200 border border-slate-800 hover:border-[#D4AF37]/50'
              }`}
            >
              <span>{fuel.name}</span>
              <span className="mx-1.5 opacity-60">·</span>
              <span className="font-num">{fuel.price} ج.م/لتر</span>
            </button>
          ))}
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="fuel-distance" className="text-xs font-bold text-slate-200">
              مسافة المشوار بالاتجاه الواحد (كم)
            </label>
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setIsRoundTrip(false)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
                  !isRoundTrip ? 'bg-[#D4AF37] text-slate-950' : 'text-slate-400'
                }`}
              >
                ذهاب فقط
              </button>
              <button
                type="button"
                onClick={() => setIsRoundTrip(true)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
                  isRoundTrip ? 'bg-[#D4AF37] text-slate-950' : 'text-slate-400'
                }`}
              >
                ذهاب وعودة (×2)
              </button>
            </div>
          </div>
          <input
            id="fuel-distance"
            type="number"
            min="1"
            step="any"
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="fuel-price" className="block text-xs font-bold text-slate-200">
            سعر لتر البنزين / الوقود الحالي
          </label>
          <input
            id="fuel-price"
            type="number"
            min="0.1"
            step="0.25"
            value={fuelPricePerLiter}
            onChange={(e) => setFuelPricePerLiter(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="fuel-consumption" className="block text-xs font-bold text-slate-200">
            معدل استهلاك السيارة (لتر لكل 100 كيلومتر)
          </label>
          <input
            id="fuel-consumption"
            type="number"
            min="1"
            step="0.1"
            value={consumptionPer100Km}
            onChange={(e) => setConsumptionPer100Km(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {carConsumptionPresets.map((car) => (
              <button
                key={car.rate}
                type="button"
                onClick={() => setConsumptionPer100Km(car.rate)}
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:border-[#D4AF37]/50 cursor-pointer whitespace-nowrap shrink-0"
              >
                {car.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="fuel-passengers" className="block text-xs font-bold text-slate-200">
            عدد الأفراد المشاركين في تقسيم التكلفة
          </label>
          <input
            id="fuel-passengers"
            type="number"
            min="1"
            max="50"
            value={passengersCount}
            onChange={(e) => setPassengersCount(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>
      </div>

      {/* Trip Cost Result Box */}
      <div className="rounded-2xl border border-[#D4AF37]/40 bg-slate-950/90 p-5 sm:p-6 space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 block">إجمالي المسافة</span>
            <span className="font-num text-xl font-extrabold text-white">
              {formatNum(result.effectiveDistanceKm, 1)} <small className="text-xs">كم</small>
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 block">كمية الوقود المطلوبة</span>
            <span className="font-num text-xl font-extrabold text-emerald-400">
              {formatNum(result.totalLitersNeeded, 2)} <small className="text-xs">لتر</small>
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 block">التكلفة الإجمالية للرحلة</span>
            <span
              data-testid="fuel-total-cost"
              className="font-num text-2xl font-extrabold text-[#D4AF37]"
            >
              {formatNum(result.totalTripCost, 2)} <small className="text-xs">ج.م</small>
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 block">
              نصيب الفرد ({passengersCount} ركاب)
            </span>
            <span className="font-num text-xl font-extrabold text-[#F3E5AB]">
              {formatNum(result.costPerPassenger, 2)} <small className="text-xs">ج.م</small>
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <span>
            تكلفة الكيلومتر الواحد:{' '}
            <strong className="font-num text-slate-200">{formatNum(result.costPerKm, 2)} ج.م/كم</strong>
          </span>
          <span>
            نوع الوقود المختار: <strong className="text-[#F3E5AB]">{selectedFuelName}</strong>
          </span>
        </div>
      </div>

      {/* Strategic Ad Placement #2 */}
      <AdSlot
        slotId="2020293842"
        placement="post-result"
        label="إعلان أسفل حاسبة البنزين"
      />
    </div>
  );
}

/* ============================================================================
 * 3. LOAN & BANK CERTIFICATE CALCULATOR (`loan-certificate-calculator`)
 * ========================================================================== */
export function LoanCertificateCalculator() {
  const [mode, setMode] = useState('certificate'); // 'certificate' | 'loan'
  // Certificate State
  const [certPrincipal, setCertPrincipal] = useState(200000);
  const [certYield, setCertYield] = useState(27);
  const [certYears, setCertYears] = useState(3);
  // Loan State
  const [loanPrincipal, setLoanPrincipal] = useState(300000);
  const [loanRate, setLoanRate] = useState(22);
  const [loanMonths, setLoanMonths] = useState(48);
  const [loanType, setLoanType] = useState('declining');
  const [adminFeePercent, setAdminFeePercent] = useState(1.5);

  const certResult = useMemo(
    () =>
      calculateCertificateProfit({
        principalAmount: certPrincipal,
        annualYieldPercent: certYield,
        durationYears: certYears,
      }),
    [certPrincipal, certYield, certYears]
  );

  const loanResult = useMemo(
    () =>
      calculateLoanSchedule({
        principalAmount: loanPrincipal,
        annualInterestRate: loanRate,
        durationMonths: loanMonths,
        interestType: loanType,
        adminFeePercent,
      }),
    [loanPrincipal, loanRate, loanMonths, loanType, adminFeePercent]
  );

  return (
    <div className="space-y-6">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800">
        <button
          type="button"
          onClick={() => setMode('certificate')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
            mode === 'certificate'
              ? 'bg-[#D4AF37] text-slate-950'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          حاسبة أرباح الشهادات والودائع البنكية
        </button>
        <button
          type="button"
          onClick={() => setMode('loan')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
            mode === 'loan'
              ? 'bg-[#D4AF37] text-slate-950'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          حاسبة القسط الشهري للقروض والتمويل
        </button>
      </div>

      {mode === 'certificate' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <label htmlFor="cert-amount" className="block text-xs font-bold text-slate-200">
                مبلغ الشهادة أو الوديعة (ج.م)
              </label>
              <input
                id="cert-amount"
                type="number"
                min="1000"
                step="1000"
                value={certPrincipal}
                onChange={(e) => setCertPrincipal(Number(e.target.value))}
                className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="cert-yield" className="block text-xs font-bold text-slate-200">
                نسبة العائد السنوي (%)
              </label>
              <input
                id="cert-yield"
                type="number"
                min="1"
                max="100"
                step="0.5"
                value={certYield}
                onChange={(e) => setCertYield(Number(e.target.value))}
                className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[19, 22, 23.5, 27, 30].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setCertYield(rate)}
                    className="font-num text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-[#D4AF37]/50 cursor-pointer"
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="cert-years" className="block text-xs font-bold text-slate-200">
                مدة الشهادة (بالسنوات)
              </label>
              <input
                id="cert-years"
                type="number"
                min="1"
                max="10"
                step="1"
                value={certYears}
                onChange={(e) => setCertYears(Number(e.target.value))}
                className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#D4AF37]/40 bg-slate-950/90 p-5 sm:p-6 space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">العائد الشهري الثابت</span>
                <span
                  data-testid="cert-monthly-payout"
                  className="font-num text-2xl font-extrabold text-[#D4AF37]"
                >
                  {formatNum(certResult.monthlyPayout)} <small className="text-xs">ج.م</small>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">العائد الربع سنوي (كل 3 أشهر)</span>
                <span className="font-num text-xl font-extrabold text-white">
                  {formatNum(certResult.quarterlyPayout)} <small className="text-xs">ج.م</small>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">العائد السنوي الكامل</span>
                <span className="font-num text-xl font-extrabold text-emerald-400">
                  {formatNum(certResult.annualPayout)} <small className="text-xs">ج.م</small>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">
                  إجمالي الأرباح في نهاية المدة ({certYears} سنوات)
                </span>
                <span className="font-num text-xl font-extrabold text-[#F3E5AB]">
                  {formatNum(certResult.totalProfitAtMaturity)} <small className="text-xs">ج.م</small>
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span>
                إجمالي أصل المبلغ + الأرباح عند الاستحقاق:{' '}
                <strong className="font-num text-white">
                  {formatNum(certResult.totalMaturityValue)} ج.م
                </strong>
              </span>
              <span>
                متوسط الربح اليومي:{' '}
                <strong className="font-num text-emerald-400">
                  {formatNum(certResult.dailyAverageProfit)} ج.م / يوم
                </strong>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label htmlFor="loan-amount" className="block text-xs font-bold text-slate-200">
                قيمة القرض أو التمويل المطلوب (ج.م)
              </label>
              <input
                id="loan-amount"
                type="number"
                min="1000"
                step="5000"
                value={loanPrincipal}
                onChange={(e) => setLoanPrincipal(Number(e.target.value))}
                className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="loan-rate" className="block text-xs font-bold text-slate-200">
                معدل الفائدة السنوي (%)
              </label>
              <input
                id="loan-rate"
                type="number"
                min="0"
                step="0.25"
                value={loanRate}
                onChange={(e) => setLoanRate(Number(e.target.value))}
                className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="loan-months" className="block text-xs font-bold text-slate-200">
                فترة السداد (بالأشهر)
              </label>
              <input
                id="loan-months"
                type="number"
                min="6"
                max="360"
                step="6"
                value={loanMonths}
                onChange={(e) => setLoanMonths(Number(e.target.value))}
                className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[12, 24, 36, 48, 60, 84].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setLoanMonths(m)}
                    className="font-num text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-[#D4AF37]/50 cursor-pointer"
                  >
                    {m} شهر ({m / 12} سنة)
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-200">
                نظام احتساب الفائدة البنكية
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLoanType('declining')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    loanType === 'declining'
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F3E5AB]'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  فائدة متناقصة (PMT)
                </button>
                <button
                  type="button"
                  onClick={() => setLoanType('flat')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    loanType === 'flat'
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F3E5AB]'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  فائدة ثابتة (مباشرة)
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#D4AF37]/40 bg-slate-950/90 p-5 sm:p-6 space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">القسط الشهري المتساوي</span>
                <span
                  data-testid="loan-monthly-installment"
                  className="font-num text-2xl font-extrabold text-[#D4AF37]"
                >
                  {formatNum(loanResult.monthlyInstallment)} <small className="text-xs">ج.م</small>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">إجمالي الفوائد البنكية</span>
                <span className="font-num text-xl font-extrabold text-amber-400">
                  {formatNum(loanResult.totalInterest)} <small className="text-xs">ج.م</small>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">إجمالي المبلغ المسدد</span>
                <span className="font-num text-xl font-extrabold text-white">
                  {formatNum(loanResult.totalPayment)} <small className="text-xs">ج.م</small>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">
                  صافي القرض بعد المصاريف ({adminFeePercent}%)
                </span>
                <span className="font-num text-xl font-extrabold text-emerald-400">
                  {formatNum(loanResult.netDisbursedAmount)} <small className="text-xs">ج.م</small>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Strategic Ad Placement #2 */}
      <AdSlot
        slotId="2020293842"
        placement="post-result"
        label="إعلان أسفل حاسبة القروض والشهادات"
      />
    </div>
  );
}

/* ============================================================================
 * 4. GOLD WORKMANSHIP & BULLION CALCULATOR (`gold-workmanship-calculator`)
 * ========================================================================== */
export function GoldWorkmanshipCalculator() {
  const [baseKarat21Price, setBaseKarat21Price] = useState(3780);
  const [selectedKarat, setSelectedKarat] = useState(21);
  const [weightGrams, setWeightGrams] = useState(8);
  const [workmanshipPerGram, setWorkmanshipPerGram] = useState(110);
  const [stampAndTaxPerGram, setStampAndTaxPerGram] = useState(25);
  const [cashbackPercentOnResale, setCashbackPercentOnResale] = useState(45);
  const [dealerBuySpreadPerGram, setDealerBuySpreadPerGram] = useState(25);

  const bullionPresets = [
    {
      label: 'جنيه ذهب (8 جم عيار 21)',
      karat: 21,
      weight: 8,
      workmanship: 55,
      tax: 15,
      cashback: 45,
    },
    {
      label: 'سبيكة 5 جرام (عيار 24)',
      karat: 24,
      weight: 5,
      workmanship: 65,
      tax: 15,
      cashback: 50,
    },
    {
      label: 'سبيكة 10 جرام (عيار 24)',
      karat: 24,
      weight: 10,
      workmanship: 58,
      tax: 14,
      cashback: 50,
    },
    {
      label: 'أونصة ذهب 31.1 جم (عيار 24)',
      karat: 24,
      weight: 31.1,
      workmanship: 50,
      tax: 12,
      cashback: 50,
    },
    {
      label: 'مشغولات عيار 18 (15 جم)',
      karat: 18,
      weight: 15,
      workmanship: 210,
      tax: 30,
      cashback: 0,
    },
  ];

  const result = useMemo(
    () =>
      calculateGoldWorkmanship({
        baseKarat21Price,
        selectedKarat,
        weightGrams,
        workmanshipPerGram,
        stampAndTaxPerGram,
        cashbackPercentOnResale,
        dealerBuySpreadPerGram,
      }),
    [
      baseKarat21Price,
      selectedKarat,
      weightGrams,
      workmanshipPerGram,
      stampAndTaxPerGram,
      cashbackPercentOnResale,
      dealerBuySpreadPerGram,
    ]
  );

  return (
    <div className="space-y-6">
      {/* Live Derived Gold Prices Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
        {[
          { label: 'عيار 24 (سبائك)', val: result.price24 },
          { label: 'عيار 22', val: result.price22 },
          { label: 'عيار 21 (الأساسي)', val: result.price21 },
          { label: 'عيار 18', val: result.price18 },
          { label: 'الجنيه الذهب (8جم)', val: result.goldCoin8gRawPrice },
        ].map((item) => (
          <div key={item.label} className="text-center p-2 rounded-lg bg-slate-900/70">
            <span className="block text-[11px] text-slate-400">{item.label}</span>
            <span className="font-num text-sm font-bold text-[#F3E5AB]">
              {formatNum(item.val, 0)} ج.م
            </span>
          </div>
        ))}
      </div>

      {/* Bullion & Jewelry Quick Presets */}
      <div className="space-y-2">
        <span className="block text-xs font-bold text-slate-300">
          قوالب سريعة للسبائك والجنيهات والمشغولات:
        </span>
        <div className="flex flex-wrap gap-2">
          {bullionPresets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setSelectedKarat(preset.karat);
                setWeightGrams(preset.weight);
                setWorkmanshipPerGram(preset.workmanship);
                setStampAndTaxPerGram(preset.tax);
                setCashbackPercentOnResale(preset.cashback);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-200 hover:border-[#D4AF37] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-2">
          <label htmlFor="gold-base21" className="block text-xs font-bold text-[#F3E5AB]">
            سعر جرام عيار 21 الخام اليوم (ج.م)
          </label>
          <input
            id="gold-base21"
            type="number"
            min="1"
            step="5"
            value={baseKarat21Price}
            onChange={(e) => setBaseKarat21Price(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="gold-karat-select" className="block text-xs font-bold text-slate-200">
            العيار المراد حسابه
          </label>
          <select
            id="gold-karat-select"
            value={selectedKarat}
            onChange={(e) => setSelectedKarat(Number(e.target.value))}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          >
            <option value={24}>ذهب عيار 24 (سبائك نقية 999.9)</option>
            <option value={22}>ذهب عيار 22 (مشغولات خليجية)</option>
            <option value={21}>ذهب عيار 21 (الأكثر تداولاً والعملات)</option>
            <option value={18}>ذهب عيار 18 (المشغولات الحديثة)</option>
            <option value={14}>ذهب عيار 14 (اقتصادي)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="gold-weight" className="block text-xs font-bold text-slate-200">
            الوزن الإجمالي بالجرام (جم)
          </label>
          <input
            id="gold-weight"
            type="number"
            min="0.1"
            step="0.1"
            value={weightGrams}
            onChange={(e) => setWeightGrams(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="gold-workmanship" className="block text-xs font-bold text-slate-200">
            المصنعية للجرام الواحد (ج.م)
          </label>
          <input
            id="gold-workmanship"
            type="number"
            min="0"
            step="5"
            value={workmanshipPerGram}
            onChange={(e) => setWorkmanshipPerGram(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="gold-tax" className="block text-xs font-bold text-slate-200">
            الدمغة والضريبة للجرام الواحد (ج.م)
          </label>
          <input
            id="gold-tax"
            type="number"
            min="0"
            step="1"
            value={stampAndTaxPerGram}
            onChange={(e) => setStampAndTaxPerGram(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="gold-cashback" className="block text-xs font-bold text-emerald-400">
            نسبة الكاش باك (استرداد المصنعية عند البيع %)
          </label>
          <input
            id="gold-cashback"
            type="number"
            min="0"
            max="100"
            step="5"
            value={cashbackPercentOnResale}
            onChange={(e) => setCashbackPercentOnResale(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>
      </div>

      {/* Purchase & Resale Receipt Card */}
      <div className="rounded-2xl border border-[#D4AF37]/40 bg-slate-950/90 p-5 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 block">
              قيمة الذهب الخام ({weightGrams} جم عيار {selectedKarat})
            </span>
            <span className="font-num text-xl font-bold text-white">
              {formatNum(result.rawGoldTotalValue)} <small className="text-xs">ج.م</small>
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 block">إجمالي المصنعية والدمغة والضريبة</span>
            <span className="font-num text-xl font-bold text-amber-400">
              {formatNum(result.totalWorkmanshipAndTax)} <small className="text-xs">ج.م</small>
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 block">
              إجمالي السعر النهائي للشراء من الصائغ
            </span>
            <span
              data-testid="gold-total-purchase"
              className="font-num text-2xl sm:text-3xl font-extrabold text-[#D4AF37]"
            >
              {formatNum(result.totalPurchaseCost)} <small className="text-xs">ج.م</small>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">تكلفة الجرام شامل المصنعية:</span>
            <strong className="font-num text-sm text-slate-100">
              {formatNum(result.effectiveCostPerGram)} ج.م / جرام
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block">قيمة الكاش باك المسترد عند البيع:</span>
            <strong className="font-num text-sm text-emerald-400">
              {formatNum(result.resaleCashbackAmount)} ج.م
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block">صافي مبلغ البيع الفوري المتوقع:</span>
            <strong className="font-num text-sm text-[#F3E5AB]">
              {formatNum(result.netResaleValue)} ج.م
            </strong>
          </div>
        </div>
      </div>

      {/* Strategic Ad Placement #2 */}
      <AdSlot
        slotId="2020293842"
        placement="post-result"
        label="إعلان أسفل حاسبة مصنعية الذهب"
      />
    </div>
  );
}

/* ============================================================================
 * 5. CURRENCY CONVERTER & MULTIPLIERS (`currency-converter`)
 * ========================================================================== */
const CURRENCIES = [
  { code: 'USD', name: 'دولار أمريكي ($)', rateToEgp: 50.45 },
  { code: 'EGP', name: 'جنيه مصري (ج.م)', rateToEgp: 1.0 },
  { code: 'SAR', name: 'ريال سعودي (ر.س)', rateToEgp: 13.45 },
  { code: 'AED', name: 'درهم إماراتي (د.إ)', rateToEgp: 13.74 },
  { code: 'KWD', name: 'دينار كويتي (د.ك)', rateToEgp: 164.2 },
  { code: 'EUR', name: 'يورو أوروبي (€)', rateToEgp: 54.6 },
  { code: 'GBP', name: 'جنيه إسترليني (£)', rateToEgp: 64.1 },
  { code: 'QAR', name: 'ريال قطري (ر.ق)', rateToEgp: 13.85 },
];

export function CurrencyConverterTool() {
  const [fromCode, setFromCode] = useState('USD');
  const [toCode, setToCode] = useState('EGP');
  const [amount, setAmount] = useState(100);
  const [customRate, setCustomRate] = useState(50.45);
  const [isManualRate, setIsManualRate] = useState(false);
  const [bankFeePercent, setBankFeePercent] = useState(0);

  const computeDefaultRate = (fCode, tCode) => {
    const fromCurr = CURRENCIES.find((c) => c.code === fCode) || CURRENCIES[0];
    const toCurr = CURRENCIES.find((c) => c.code === tCode) || CURRENCIES[1];
    return Number((fromCurr.rateToEgp / toCurr.rateToEgp).toFixed(4));
  };

  const activeRate = isManualRate ? customRate : computeDefaultRate(fromCode, toCode);

  const result = useMemo(
    () => calculateCurrencyConversion(amount, activeRate, bankFeePercent),
    [amount, activeRate, bankFeePercent]
  );

  const handleSwapCurrencies = () => {
    const nextFrom = toCode;
    const nextTo = fromCode;
    setFromCode(nextFrom);
    setToCode(nextTo);
    setIsManualRate(false);
    setCustomRate(computeDefaultRate(nextFrom, nextTo));
  };

  return (
    <div className="space-y-6">
      {/* Currency Selectors & Swap */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-end">
        <div className="md:col-span-5 space-y-2">
          <label htmlFor="fx-from" className="block text-xs font-bold text-slate-200">
            من العملة الأساسية
          </label>
          <select
            id="fx-from"
            value={fromCode}
            onChange={(e) => {
              setFromCode(e.target.value);
              setIsManualRate(false);
            }}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1 flex justify-center">
          <button
            type="button"
            onClick={handleSwapCurrencies}
            aria-label="تبديل العملتين"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-slate-950 transition-colors cursor-pointer"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        <div className="md:col-span-5 space-y-2">
          <label htmlFor="fx-to" className="block text-xs font-bold text-slate-200">
            إلى العملة المستهدفة
          </label>
          <select
            id="fx-to"
            value={toCode}
            onChange={(e) => {
              setToCode(e.target.value);
              setIsManualRate(false);
            }}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Amount & Exchange Rate Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-2">
          <label htmlFor="fx-amount" className="block text-xs font-bold text-[#F3E5AB]">
            المبلغ المراد تحويله ({fromCode})
          </label>
          <input
            id="fx-amount"
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="fx-rate" className="text-xs font-bold text-slate-200">
              سعر الصرف (1 {fromCode} = ? {toCode})
            </label>
            <button
              type="button"
              onClick={() => {
                setIsManualRate(false);
                setCustomRate(computeDefaultRate(fromCode, toCode));
              }}
              className="text-[11px] text-[#D4AF37] hover:underline cursor-pointer"
            >
              استعادة السعر المرجعي
            </button>
          </div>
          <input
            id="fx-rate"
            type="number"
            min="0.0001"
            step="any"
            value={activeRate}
            onChange={(e) => {
              setIsManualRate(true);
              setCustomRate(Number(e.target.value));
            }}
            className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="fx-fee" className="block text-xs font-bold text-slate-200">
            عمولة البنك / تدبير العملة الاختيارية (%)
          </label>
          <input
            id="fx-fee"
            type="number"
            min="0"
            max="30"
            step="0.5"
            value={bankFeePercent}
            onChange={(e) => setBankFeePercent(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>
      </div>

      {/* Conversion Result Banner */}
      <div className="rounded-2xl border border-[#D4AF37]/40 bg-slate-950/90 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs text-slate-400 block">
            نتيجة التحويل المباشر ({formatNum(amount)} {fromCode} إلى {toCode})
          </span>
          <div
            data-testid="fx-converted-value"
            className="font-num text-2xl sm:text-3xl font-extrabold text-[#D4AF37]"
          >
            {formatNum(result.convertedAmount)} <small className="text-sm">{toCode}</small>
          </div>
        </div>

        <div className="text-xs text-slate-300 space-y-1 sm:text-left">
          <div>
            السعر العكسي: <span className="font-num">1 {toCode} = {result.inverseExchangeRate} {fromCode}</span>
          </div>
          {bankFeePercent > 0 && (
            <div className="text-emerald-400">
              شامل عمولة البنك ({bankFeePercent}%):{' '}
              <strong className="font-num">{formatNum(result.totalWithFee)} {toCode}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Strategic Ad Placement #2 */}
      <AdSlot
        slotId="2020293842"
        placement="post-result"
        label="إعلان أسفل نتيجة تحويل العملات"
      />

      {/* Automatic Multipliers Table (10, 50, 100, 500, 1000) */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold text-white">
          جدول المضاعفات التلقائي للفئات النقدية ({fromCode} ⇄ {toCode})
        </h3>
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-slate-900 text-slate-300 border-b border-slate-800">
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
            <tbody className="divide-y divide-slate-800/70 bg-slate-950/60">
              {result.multipliersTable.map((row) => (
                <tr key={row.baseAmount} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-2.5 px-4 font-num font-bold text-[#F3E5AB]">
                    {formatNum(row.baseAmount, 0)}
                  </td>
                  <td className="py-2.5 px-4 font-num text-white">
                    {formatNum(row.fromToTarget, 2)} {toCode}
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
    </div>
  );
}

/* ============================================================================
 * 6. IMAGE COMPRESSOR & FORMAT CONVERTER (`image-compressor-converter`)
 * ========================================================================== */
export function ImageCompressorConverter() {
  const [targetFormat, setTargetFormat] = useState('image/webp');
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1400);
  const [sourceInfo, setSourceInfo] = useState({
    name: 'sample-meezan-banner.png',
    originalBytes: 0,
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

  // Generate an initial rich demo canvas image so the tool works immediately on load
  const drawDemoImageToSourceCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 750;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 1200, 750);
      grad.addColorStop(0, '#0B132B');
      grad.addColorStop(0.5, '#1C2541');
      grad.addColorStop(1, '#3A506B');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 750);

      // Decorative geometric gold rings & patterns for realistic compression testing
      for (let i = 0; i < 18; i++) {
        ctx.beginPath();
        ctx.arc(600, 375, 60 + i * 32, 0, Math.PI * 2);
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(212, 175, 55, 0.35)' : 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 52px Cairo, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('منصة مِيزان — اختبار ضغط وتحويل الصور', 600, 355);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = '28px Tajawal, sans-serif';
      ctx.fillText('HTML5 Canvas Client-Side WebP / JPEG / PNG Compression', 600, 425);
    }

    sourceCanvasRef.current = canvas;
    const rawPngUrl = canvas.toDataURL('image/png');
    const approxOriginalBytes = Math.round(((rawPngUrl.length - 22) * 3) / 4);
    setSourceInfo({
      name: 'meezan-high-res-sample.png',
      originalBytes: approxOriginalBytes,
      width: canvas.width,
      height: canvas.height,
    });
  };

  const runCompression = () => {
    const srcCanvas = sourceCanvasRef.current;
    if (!srcCanvas) return;

    const scale = srcCanvas.width > maxWidth ? maxWidth / srcCanvas.width : 1;
    const outW = Math.max(1, Math.round(srcCanvas.width * scale));
    const outH = Math.max(1, Math.round(srcCanvas.height * scale));

    const outCanvas = document.createElement('canvas');
    outCanvas.width = outW;
    outCanvas.height = outH;
    const ctx = outCanvas.getContext('2d');
    if (!ctx) return;

    // Fill white background when exporting to JPEG (no alpha channel)
    if (targetFormat === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, outW, outH);
    }
    ctx.drawImage(srcCanvas, 0, 0, outW, outH);

    const q = Math.min(1, Math.max(0.1, quality / 100));
    const outDataUrl = outCanvas.toDataURL(targetFormat, q);
    const outBytes = Math.round(((outDataUrl.length - outDataUrl.indexOf(',') - 1) * 3) / 4);
    const origBytes = Math.max(1, sourceInfo.originalBytes || outBytes);
    const savings = Math.max(0, ((origBytes - outBytes) / origBytes) * 100);

    setCompressedInfo({
      dataUrl: outDataUrl,
      bytes: outBytes,
      width: outW,
      height: outH,
      savingsPercent: Number(savings.toFixed(1)),
    });
  };

  useEffect(() => {
    drawDemoImageToSourceCanvas();
  }, []);

  useEffect(() => {
    if (sourceCanvasRef.current) {
      runCompression();
    }
  }, [sourceInfo, targetFormat, quality, maxWidth]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }
        sourceCanvasRef.current = canvas;
        setSourceInfo({
          name: file.name,
          originalBytes: file.size,
          width: img.width,
          height: img.height,
        });
      };
      if (typeof ev.target?.result === 'string') {
        img.src = ev.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const extMap = {
    'image/webp': 'webp',
    'image/jpeg': 'jpg',
    'image/png': 'png',
  };

  return (
    <div className="space-y-6">
      {/* Upload Dropzone */}
      <div className="rounded-2xl border-2 border-dashed border-slate-700 hover:border-[#D4AF37] bg-slate-950/60 p-6 text-center transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileUpload}
          className="hidden"
          id="image-upload-input"
        />
        <div className="flex flex-col items-center gap-3">
          <Upload className="w-8 h-8 text-[#D4AF37]" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-white">
              اختر صورة من جهازك لضغطها أو تحويل صيغتها محلياً (100% داخل المتصفح)
            </p>
            <p className="text-xs text-slate-400">
              الملف النشط حالياً: <span className="font-num text-[#F3E5AB]">{sourceInfo.name}</span> ({sourceInfo.width}×{sourceInfo.height} بكسل)
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-[#D4AF37] text-slate-950 text-xs font-bold hover:bg-[#e2be46] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              اختيار صورة من الجهاز
            </button>
            <button
              type="button"
              onClick={drawDemoImageToSourceCanvas}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-medium hover:border-[#D4AF37]/50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              إعادة تحميل الصورة النموذجية
            </button>
          </div>
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-2">
          <label htmlFor="img-format" className="block text-xs font-bold text-slate-200">
            الصيغة المستهدفة (Output Format)
          </label>
          <select
            id="img-format"
            value={targetFormat}
            onChange={(e) => setTargetFormat(e.target.value)}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          >
            <option value="image/webp">WebP (أعلى نسبة ضغط وأفضل للـ SEO)</option>
            <option value="image/jpeg">JPEG / JPG (مناسب للصور الفوتوغرافية)</option>
            <option value="image/png">PNG (جودة كاملة بدون ضغط فقدان)</option>
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="img-quality" className="font-bold text-slate-200">
              جودة الصورة المضغوطة
            </label>
            <span className="font-num font-bold text-[#D4AF37]">{quality}%</span>
          </div>
          <input
            id="img-quality"
            type="range"
            min="15"
            max="100"
            step="5"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-[#D4AF37] cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="img-maxwidth" className="block text-xs font-bold text-slate-200">
            الحد الأقصى للعرض (بكسل)
          </label>
          <input
            id="img-maxwidth"
            type="number"
            min="200"
            max="4000"
            step="100"
            value={maxWidth}
            onChange={(e) => setMaxWidth(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>
      </div>

      {/* Compression Metrics & Download Action */}
      <div className="rounded-2xl border border-[#D4AF37]/40 bg-slate-950/90 p-5 sm:p-6 space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 block">الحجم الأصلي (PNG)</span>
            <span className="font-num text-lg font-bold text-slate-200">
              {formatNum(sourceInfo.originalBytes / 1024, 1)} KB
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 block">
              الحجم بعد الضغط ({extMap[targetFormat]?.toUpperCase()})
            </span>
            <span
              data-testid="compressed-size-kb"
              className="font-num text-xl font-extrabold text-[#D4AF37]"
            >
              {formatNum(compressedInfo.bytes / 1024, 1)} KB
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 block">نسبة التوفير في المساحة</span>
            <span className="font-num text-xl font-extrabold text-emerald-400">
              {compressedInfo.savingsPercent}%
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 block">الأبعاد النهائية</span>
            <span className="font-num text-lg font-bold text-white">
              {compressedInfo.width} × {compressedInfo.height}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800">
          {compressedInfo.dataUrl && (
            <a
              href={compressedInfo.dataUrl}
              download={`meezan-optimized.${extMap[targetFormat] || 'webp'}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] text-slate-950 text-xs sm:text-sm font-bold hover:bg-[#e2be46] transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>
                تحميل الصورة المضغوطة ({extMap[targetFormat]?.toUpperCase()})
              </span>
            </a>
          )}
          <span className="text-xs text-slate-400">
            تمت المعالجة محلياً عبر HTML5 Canvas بدون إرسال أي بيانات للخادم
          </span>
        </div>
      </div>

      {/* Strategic Ad Placement #2 */}
      <AdSlot
        slotId="2020293842"
        placement="post-result"
        label="إعلان أسفل تحميل الصورة المضغوطة"
      />
    </div>
  );
}

/* ============================================================================
 * 7. PROFESSIONAL COLOR QR CODE GENERATOR (`qr-code-generator`)
 * ========================================================================== */
export function QrCodeGeneratorTool() {
  const [qrMode, setQrMode] = useState('url'); // 'url' | 'whatsapp' | 'wifi' | 'text'
  const [urlText, setUrlText] = useState('https://meezan-hub.com');
  const [waPhone, setWaPhone] = useState('201000000000');
  const [waMessage, setWaMessage] = useState('مرحباً، أود الاستفسار عن خدماتكم');
  const [wifiSsid, setWifiSsid] = useState('Meezan_Guest_5G');
  const [wifiPassword, setWifiPassword] = useState('Meezan@2026');
  const [freeText, setFreeText] = useState('منصة مِيزان للأدوات الذكية');

  const [fgColor, setFgColor] = useState('#0B132B');
  const [bgColor, setBgColor] = useState('#FFFDF7');
  const [canvasSize, setCanvasSize] = useState(320);
  const [pngDataUrl, setPngDataUrl] = useState('');

  const qrCanvasRef = useRef(null);

  const payloadString = useMemo(() => {
    if (qrMode === 'whatsapp') {
      const cleanPhone = waPhone.replace(/\D/g, '');
      return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;
    }
    if (qrMode === 'wifi') {
      return `WIFI:T:WPA;S:${wifiSsid};P:${wifiPassword};;`;
    }
    if (qrMode === 'text') {
      return freeText || 'Meezan Hub';
    }
    return urlText || 'https://meezan-hub.com';
  }, [qrMode, urlText, waPhone, waMessage, wifiSsid, wifiPassword, freeText]);

  useEffect(() => {
    const matrix = generateQrMatrix(payloadString);
    const canvas = qrCanvasRef.current;
    if (!canvas) return;

    const size = canvasSize;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const quietZone = 4;
    const totalModules = matrix.length + quietZone * 2;
    const cellSize = size / totalModules;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = fgColor;
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix.length; c++) {
        if (matrix[r][c]) {
          const x = Math.floor((c + quietZone) * cellSize);
          const y = Math.floor((r + quietZone) * cellSize);
          const w = Math.ceil(cellSize);
          const h = Math.ceil(cellSize);
          ctx.fillRect(x, y, w, h);
        }
      }
    }

    setPngDataUrl(canvas.toDataURL('image/png'));
  }, [payloadString, fgColor, bgColor, canvasSize]);

  const colorPresets = [
    { name: 'كحلي رسمي', fg: '#0B132B', bg: '#FFFDF7' },
    { name: 'أسود كلاسيكي', fg: '#000000', bg: '#FFFFFF' },
    { name: 'ذهبي ملكي داكن', fg: '#D4AF37', bg: '#090D16' },
    { name: 'زمردي فاخر', fg: '#064E3B', bg: '#ECFDF5' },
  ];

  return (
    <div className="space-y-6">
      {/* Content Type Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-800">
        {[
          { id: 'url', label: 'رابط موقع (URL)' },
          { id: 'whatsapp', label: 'محادثة واتساب مباشرة' },
          { id: 'wifi', label: 'شبكة واي فاي (Wi-Fi)' },
          { id: 'text', label: 'نص حر / بيانات' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setQrMode(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              qrMode === tab.id
                ? 'bg-[#D4AF37] text-slate-950'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-[#D4AF37]/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Layout: Inputs on Right, Live Canvas Preview on Left */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7 space-y-4">
          {qrMode === 'url' && (
            <div className="space-y-2">
              <label htmlFor="qr-url-input" className="block text-xs font-bold text-slate-200">
                أدخل رابط الموقع أو الصفحة (URL)
              </label>
              <input
                id="qr-url-input"
                type="url"
                dir="ltr"
                value={urlText}
                onChange={(e) => setUrlText(e.target.value)}
                placeholder="https://example.com"
                className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          )}

          {qrMode === 'whatsapp' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="qr-wa-phone" className="block text-xs font-bold text-slate-200">
                  رقم الهاتف بكود الدولة (بدون +)
                </label>
                <input
                  id="qr-wa-phone"
                  type="text"
                  dir="ltr"
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                  className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="qr-wa-msg" className="block text-xs font-bold text-slate-200">
                  الرسالة التلقائية
                </label>
                <input
                  id="qr-wa-msg"
                  type="text"
                  value={waMessage}
                  onChange={(e) => setWaMessage(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
          )}

          {qrMode === 'wifi' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="qr-wifi-ssid" className="block text-xs font-bold text-slate-200">
                  اسم شبكة الواي فاي (SSID)
                </label>
                <input
                  id="qr-wifi-ssid"
                  type="text"
                  dir="ltr"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="qr-wifi-pass" className="block text-xs font-bold text-slate-200">
                  كلمة مرور الواي فاي
                </label>
                <input
                  id="qr-wifi-pass"
                  type="text"
                  dir="ltr"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
          )}

          {qrMode === 'text' && (
            <div className="space-y-2">
              <label htmlFor="qr-free-text" className="block text-xs font-bold text-slate-200">
                النص أو البيانات المراد تشفيرها
              </label>
              <input
                id="qr-free-text"
                type="text"
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          )}

          {/* Color & Size Controls */}
          <div className="space-y-2 pt-2">
            <span className="block text-xs font-bold text-slate-300">قوالب ألوان احترافية:</span>
            <div className="flex flex-wrap gap-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setFgColor(preset.fg);
                    setBgColor(preset.bg);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-200 hover:border-[#D4AF37] cursor-pointer whitespace-nowrap shrink-0"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="space-y-1">
              <label htmlFor="qr-fg-color" className="block text-xs text-slate-400">
                لون الرمز
              </label>
              <input
                id="qr-fg-color"
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-full h-10 rounded-lg bg-slate-950 border border-slate-800 p-1 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="qr-bg-color" className="block text-xs text-slate-400">
                لون الخلفية
              </label>
              <input
                id="qr-bg-color"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-10 rounded-lg bg-slate-950 border border-slate-800 p-1 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="qr-size-select" className="block text-xs text-slate-400">
                دقة الصورة
              </label>
              <select
                id="qr-size-select"
                value={canvasSize}
                onChange={(e) => setCanvasSize(Number(e.target.value))}
                className="font-num w-full h-10 rounded-lg bg-slate-950 border border-slate-800 px-2 text-xs text-white"
              >
                <option value={320}>320×320 px</option>
                <option value={600}>600×600 px</option>
                <option value={1000}>1000×1000 HD</option>
              </select>
            </div>
          </div>
        </div>

        {/* QR Canvas Preview Box */}
        <div className="md:col-span-5 flex flex-col items-center justify-center rounded-2xl border border-[#D4AF37]/40 bg-slate-950 p-5 space-y-4">
          <canvas
            ref={qrCanvasRef}
            data-testid="qr-canvas"
            className="w-52 h-52 rounded-xl shadow-lg border border-slate-800"
          />
          {pngDataUrl && (
            <a
              href={pngDataUrl}
              download={`meezan-qr-${qrMode}.png`}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-slate-950 text-xs font-bold hover:bg-[#e3be42] transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>تحميل صورة QR عالية الجودة (PNG)</span>
            </a>
          )}
        </div>
      </div>

      {/* Strategic Ad Placement #2 */}
      <AdSlot
        slotId="2020293842"
        placement="post-result"
        label="إعلان أسفل مولد رمز QR"
      />
    </div>
  );
}

/* ============================================================================
 * 8. OFFICIAL CONTRACT & INVOICE GENERATOR (`contract-invoice-generator`)
 * ========================================================================== */
export function ContractInvoiceGenerator() {
  const [docType, setDocType] = useState('car-sale'); // 'car-sale' | 'lease' | 'invoice'
  const [docDate, setDocDate] = useState('2026-11-05');
  const [governorate, setGovernorate] = useState('القاهرة');

  // Parties
  const [firstPartyName, setFirstPartyName] = useState('أحمد محمود عبد الرحمن');
  const [firstPartyId, setFirstPartyId] = useState('28805140102345');
  const [firstPartyAddress, setFirstPartyAddress] = useState('شارع التسعين، التجمع الخامس، القاهرة');

  const [secondPartyName, setSecondPartyName] = useState('محمد سامي الشريف');
  const [secondPartyId, setSecondPartyId] = useState('29109200105678');
  const [secondPartyAddress, setSecondPartyAddress] = useState('شارع التحرير، الدقي، الجيزة');

  // Car Sale Specifics
  const [carBrandModel, setCarBrandModel] = useState('تويوتا كورولا — موديل 2024 — فئة ثانية');
  const [carPlateNumber, setCarPlateNumber] = useState('أ ب ج - 4821 (مرور القاهرة الجديدة)');
  const [carChassisNumber, setCarChassisNumber] = useState('JTDBR32E800194827');
  const [carMotorNumber, setCarMotorNumber] = useState('1ZR-8941205');
  const [carColor, setCarColor] = useState('فضي ميتاليك');
  const [totalContractAmount, setTotalContractAmount] = useState(1150000);
  const [paidAmount, setPaidAmount] = useState(1150000);
  const [penaltyAmount, setPenaltyAmount] = useState(100000);

  // Lease Specifics
  const [propertyAddress, setPropertyAddress] = useState(
    'الشقة رقم (12) بالدور الرابع، العقار رقم 24 شارع مكرم عبيد، مدينة نصر'
  );
  const [leaseDurationMonths, setLeaseDurationMonths] = useState(12);
  const [monthlyRent, setMonthlyRent] = useState(12000);
  const [securityDeposit, setSecurityDeposit] = useState(24000);

  // Invoice Specifics
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-1084');
  const [vatPercent, setVatPercent] = useState(14);
  const [discountValue, setDiscountValue] = useState(500);
  const [invoiceItems, setInvoiceItems] = useState([
    { id: '1', description: 'تصميم وتطوير منصة ويب متكاملة مع تهيئة SEO', quantity: 1, unitPrice: 18500 },
    { id: '2', description: 'استضافة سحابية وحماية SSL لمدة عام', quantity: 1, unitPrice: 3500 },
  ]);

  const invoiceTotals = useMemo(
    () => calculateInvoiceTotals(invoiceItems, discountValue, vatPercent),
    [invoiceItems, discountValue, vatPercent]
  );

  const handleAddInvoiceItem = () => {
    setInvoiceItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        description: 'بند خدمة أو منتج جديد',
        quantity: 1,
        unitPrice: 1000,
      },
    ]);
  };

  const handleRemoveInvoiceItem = (id) => {
    if (invoiceItems.length <= 1) return;
    setInvoiceItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePrintA4 = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Document Template Selector & Print Button */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'car-sale', label: 'عقد بيع مركبة (سيارة / موتوسيكل)' },
            { id: 'lease', label: 'عقد إيجار شقة / وحدة محدد المدة' },
            { id: 'invoice', label: 'فاتورة ضريبية وتجارية رسمية' },
          ].map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => setDocType(tpl.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                docType === tpl.id
                  ? 'bg-[#D4AF37] text-slate-950'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-[#D4AF37]/50'
              }`}
            >
              {tpl.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handlePrintA4}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-slate-950 text-xs font-bold hover:bg-[#e3be42] transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة / حفظ كملف PDF بتنسيق A4</span>
        </button>
      </div>

      {/* Form Inputs (Hidden during Print) */}
      <div className="no-print space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="doc-date" className="block text-xs font-bold text-slate-300">
              تاريخ تحرير الوثيقة
            </label>
            <input
              id="doc-date"
              type="date"
              value={docDate}
              onChange={(e) => setDocDate(e.target.value)}
              className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="doc-gov" className="block text-xs font-bold text-slate-300">
              المحافظة / المدينة المختصة
            </label>
            <input
              id="doc-gov"
              type="text"
              value={governorate}
              onChange={(e) => setGovernorate(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white"
            />
          </div>
          {docType === 'invoice' && (
            <div className="space-y-1.5">
              <label htmlFor="inv-num" className="block text-xs font-bold text-slate-300">
                رقم الفاتورة المرجعي
              </label>
              <input
                id="inv-num"
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="font-num w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white"
              />
            </div>
          )}
        </div>

        {/* First & Second Party Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-[#F3E5AB]">
              {docType === 'car-sale'
                ? 'بيانات الطرف الأول (البائع)'
                : docType === 'lease'
                ? 'بيانات الطرف الأول (المؤجر / المالك)'
                : 'بيانات الشركة أو المُصدر (البائع)'}
            </h4>
            <input
              type="text"
              aria-label="اسم الطرف الأول"
              value={firstPartyName}
              onChange={(e) => setFirstPartyName(e.target.value)}
              placeholder="الاسم الكامل"
              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
            />
            <input
              type="text"
              aria-label="الرقم القومي أو السجل للطرف الأول"
              value={firstPartyId}
              onChange={(e) => setFirstPartyId(e.target.value)}
              placeholder="الرقم القومي / السجل التجاري"
              className="font-num w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
            />
            <input
              type="text"
              aria-label="عنوان الطرف الأول"
              value={firstPartyAddress}
              onChange={(e) => setFirstPartyAddress(e.target.value)}
              placeholder="العنوان بالتفصيل"
              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-[#F3E5AB]">
              {docType === 'car-sale'
                ? 'بيانات الطرف الثاني (المشتري)'
                : docType === 'lease'
                ? 'بيانات الطرف الثاني (المستأجر)'
                : 'بيانات العميل المستلم (المشتري)'}
            </h4>
            <input
              type="text"
              aria-label="اسم الطرف الثاني"
              value={secondPartyName}
              onChange={(e) => setSecondPartyName(e.target.value)}
              placeholder="الاسم الكامل"
              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
            />
            <input
              type="text"
              aria-label="الرقم القومي للطرف الثاني"
              value={secondPartyId}
              onChange={(e) => setSecondPartyId(e.target.value)}
              placeholder="الرقم القومي / المعرف الضريبي"
              className="font-num w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
            />
            <input
              type="text"
              aria-label="عنوان الطرف الثاني"
              value={secondPartyAddress}
              onChange={(e) => setSecondPartyAddress(e.target.value)}
              placeholder="العنوان بالتفصيل"
              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        {/* Specific Fields by Document Type */}
        {docType === 'car-sale' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="space-y-1">
              <label className="text-xs text-slate-400">ماركة وموديل المركبة</label>
              <input
                type="text"
                value={carBrandModel}
                onChange={(e) => setCarBrandModel(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">رقم اللوحات والمرور</label>
              <input
                type="text"
                value={carPlateNumber}
                onChange={(e) => setCarPlateNumber(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">رقم الشاسيه (VIN)</label>
              <input
                type="text"
                value={carChassisNumber}
                onChange={(e) => setCarChassisNumber(e.target.value)}
                className="font-num w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">رقم الموتور واللون</label>
              <input
                type="text"
                value={`${carMotorNumber} - ${carColor}`}
                onChange={(e) => setCarMotorNumber(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">إجمالي ثمن البيع (ج.م)</label>
              <input
                type="number"
                value={totalContractAmount}
                onChange={(e) => setTotalContractAmount(Number(e.target.value))}
                className="font-num w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">قيمة الشرط الجزائي (ج.م)</label>
              <input
                type="number"
                value={penaltyAmount}
                onChange={(e) => setPenaltyAmount(Number(e.target.value))}
                className="font-num w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
        )}

        {docType === 'lease' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="sm:col-span-3 space-y-1">
              <label className="text-xs text-slate-400">عنوان ووصف الوحدة المؤجرة بالتفصيل</label>
              <input
                type="text"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">القيمة الإيجارية الشهرية (ج.م)</label>
              <input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                className="font-num w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">مدة الإيجار (بالأشهر)</label>
              <input
                type="number"
                value={leaseDurationMonths}
                onChange={(e) => setLeaseDurationMonths(Number(e.target.value))}
                className="font-num w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">مبلغ التأمين النقدي (ج.م)</label>
              <input
                type="number"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                className="font-num w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
        )}

        {docType === 'invoice' && (
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F3E5AB]">بنود الفاتورة والأصناف</span>
              <button
                type="button"
                onClick={handleAddInvoiceItem}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#D4AF37]/20 text-[#F3E5AB] text-xs font-semibold hover:bg-[#D4AF37]/30 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة صنف جديد</span>
              </button>
            </div>

            {invoiceItems.map((item, idx) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                <input
                  type="text"
                  aria-label={`وصف البند ${idx + 1}`}
                  value={item.description}
                  onChange={(e) => {
                    const val = e.target.value;
                    setInvoiceItems((prev) =>
                      prev.map((it) => (it.id === item.id ? { ...it, description: val } : it))
                    );
                  }}
                  className="col-span-6 rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white"
                />
                <input
                  type="number"
                  aria-label={`الكمية للبند ${idx + 1}`}
                  min="1"
                  value={item.quantity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setInvoiceItems((prev) =>
                      prev.map((it) => (it.id === item.id ? { ...it, quantity: val } : it))
                    );
                  }}
                  className="font-num col-span-2 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white"
                />
                <input
                  type="number"
                  aria-label={`سعر الوحدة للبند ${idx + 1}`}
                  min="0"
                  value={item.unitPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setInvoiceItems((prev) =>
                      prev.map((it) => (it.id === item.id ? { ...it, unitPrice: val } : it))
                    );
                  }}
                  className="font-num col-span-3 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveInvoiceItem(item.id)}
                  aria-label={`حذف البند ${idx + 1}`}
                  className="col-span-1 flex justify-center text-rose-400 hover:text-rose-300 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Printable A4 Sheet Preview */}
      <div
        data-testid="a4-document-sheet"
        className="print-only-sheet rounded-2xl bg-white text-slate-950 p-6 sm:p-10 shadow-2xl border border-slate-300 space-y-6 leading-relaxed"
      >
        {/* Official Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950">
              {docType === 'car-sale' && 'عقد بيع مركبة ابتدائي نهائي'}
              {docType === 'lease' && 'عقد إيجار أملاك محدد المدة (خاضع للقانون المدني)'}
              {docType === 'invoice' && `فاتورة ضريبية وتجارية رقم (${invoiceNumber})`}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              حُرر في محافظة: {governorate} · بتاريخ: <span className="font-num">{docDate}</span>
            </p>
          </div>
          <div className="text-left text-xs font-bold text-slate-700 border border-slate-400 px-3 py-1.5 rounded">
            وثيقة رسمية A4
          </div>
        </div>

        {/* Document Body */}
        {docType === 'car-sale' && (
          <div className="space-y-4 text-sm text-slate-900">
            <p>
              إنه في يوم الموافق <strong className="font-num">{docDate}</strong> بمحافظة{' '}
              <strong>{governorate}</strong>، تم الاتفاق والتراضي بين كلٍ من:
            </p>
            <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-300 space-y-1 text-xs sm:text-sm">
              <p>
                <strong>أولاً: السيد / {firstPartyName}</strong> — ويحمل بطاقة رقم قومي:{' '}
                <span className="font-num font-bold">{firstPartyId}</span> — والمقيم في:{' '}
                {firstPartyAddress}. <strong>(طرف أول - بائع)</strong>
              </p>
              <p>
                <strong>ثانياً: السيد / {secondPartyName}</strong> — ويحمل بطاقة رقم قومي:{' '}
                <span className="font-num font-bold">{secondPartyId}</span> — والمقيم في:{' '}
                {secondPartyAddress}. <strong>(طرف ثانٍ - مشترٍ)</strong>
              </p>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <p>
                <strong>البند الأول (موضوع البيع):</strong> باع وأسقط وتنازل بكافة الضمانات الفعلية
                والقانونية الطرف الأول (البائع) إلى الطرف الثاني (المشتري) القابل لذلك، المركبة رقم:{' '}
                <strong>{carPlateNumber}</strong>، ماركة وموديل: <strong>{carBrandModel}</strong>،
                شاسيه رقم: <strong className="font-num">{carChassisNumber}</strong>، موتور رقم:{' '}
                <strong className="font-num">{carMotorNumber}</strong>.
              </p>
              <p>
                <strong>البند الثاني (الثمن وطريقة السداد):</strong> تم هذا البيع نظير ثمن إجمالي
                وجملته <strong className="font-num">{formatNum(totalContractAmount)} ج.م</strong>، وقد
                دفع الطرف الثاني مبلغاً وقدره{' '}
                <strong className="font-num">{formatNum(paidAmount)} ج.م</strong> نقداً بمجلس هذا العقد،
                ويُعد توقيع الطرف الأول بمثابة مخالصة تامة ونهائية باستلام الثمن.
              </p>
              <p>
                <strong>البند الثالث (المعاينة والمسؤولية القانونية):</strong> يقر الطرف الثاني
                بأنه عاين المركبة المبيعة المعاينة التامة النافية للجهالة شرعاً وقانوناً وقبلها بحالتها،
                وتنتقل المسؤولية المدنية والجنائية والمرورية إلى المشتري منذ ساعة وتاريخ تحرير هذا العقد.
              </p>
              <p>
                <strong>البند الرابع (الشرط الجزائي):</strong> في حالة إخلال أي طرف ببنود هذا العقد أو
                الامتناع عن إتمام إجراءات نقل الملكية والتسجيل بالشهر العقاري، يلتزم الطرف المخل بدفع
                شرط جزائي قدره <strong className="font-num">{formatNum(penaltyAmount)} ج.م</strong> دون
                حاجة إلى تنبيه أو إنذار قضائي.
              </p>
            </div>
          </div>
        )}

        {docType === 'lease' && (
          <div className="space-y-4 text-sm text-slate-900">
            <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-300 space-y-1 text-xs sm:text-sm">
              <p>
                <strong>أولاً (المؤجر): السيد / {firstPartyName}</strong> — رقم قومي:{' '}
                <span className="font-num font-bold">{firstPartyId}</span> — المقيم في:{' '}
                {firstPartyAddress}.
              </p>
              <p>
                <strong>ثانياً (المستأجر): السيد / {secondPartyName}</strong> — رقم قومي:{' '}
                <span className="font-num font-bold">{secondPartyId}</span> — المقيم في:{' '}
                {secondPartyAddress}.
              </p>
            </div>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <p>
                <strong>البند الأول (العين المؤجرة):</strong> أجر الطرف الأول للطرف الثاني القابل لذلك
                العين الكائنة في: <strong>{propertyAddress}</strong> بقصد استعمالها سكنى/مقر إداري،
                خاضعة لأحكام القانون المدني رقم 4 لسنة 1996.
              </p>
              <p>
                <strong>البند الثاني (المدة والقيمة الإيجارية):</strong> مدة هذا العقد{' '}
                <strong className="font-num">{leaseDurationMonths} شهراً</strong>، بأجرة شهرية قدرها{' '}
                <strong className="font-num">{formatNum(monthlyRent)} ج.م</strong> تُدفع مقدماً أول كل
                شهر، كما دفع المستأجر تأميناً نقدياً قدره{' '}
                <strong className="font-num">{formatNum(securityDeposit)} ج.م</strong> يرد عند انتهاء
                العقد وتسليم العين بحالتها.
              </p>
              <p>
                <strong>البند الثالث (الحفاظ على العين):</strong> يلتزم المستأجر بعدم التأجير من الباطن
                أو التنازل عن الإيجار أو إحداث أي تعديلات جوهرية بالحوائط دون إذن كتابي من المالك،
                ويلتزم بسداد استهلاك الكهرباء والمياه والغاز طوال مدة الإيجار.
              </p>
            </div>
          </div>
        )}

        {docType === 'invoice' && (
          <div className="space-y-5 text-xs sm:text-sm text-slate-900">
            <div className="grid grid-cols-2 gap-4 p-3.5 rounded-lg bg-slate-100 border border-slate-300">
              <div>
                <span className="text-slate-500 block">مُصدر الفاتورة (البائع):</span>
                <strong>{firstPartyName}</strong>
                <div className="font-num text-xs text-slate-700">سجل/بطاقة: {firstPartyId}</div>
                <div className="text-xs text-slate-700">{firstPartyAddress}</div>
              </div>
              <div>
                <span className="text-slate-500 block">مطلوب من العميل (المشتري):</span>
                <strong>{secondPartyName}</strong>
                <div className="font-num text-xs text-slate-700">معرف/رقم: {secondPartyId}</div>
                <div className="text-xs text-slate-700">{secondPartyAddress}</div>
              </div>
            </div>

            <table className="w-full text-right border-collapse border border-slate-300">
              <thead className="bg-slate-200 text-slate-900">
                <tr>
                  <th className="border border-slate-300 py-2 px-3">#</th>
                  <th className="border border-slate-300 py-2 px-3">البيان / وصف الصنف</th>
                  <th className="border border-slate-300 py-2 px-3">الكمية</th>
                  <th className="border border-slate-300 py-2 px-3">سعر الوحدة</th>
                  <th className="border border-slate-300 py-2 px-3">الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {invoiceItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="border border-slate-300 py-2 px-3 font-num">{idx + 1}</td>
                    <td className="border border-slate-300 py-2 px-3 font-medium">
                      {item.description}
                    </td>
                    <td className="border border-slate-300 py-2 px-3 font-num">{item.quantity}</td>
                    <td className="border border-slate-300 py-2 px-3 font-num">
                      {formatNum(item.unitPrice)} ج.م
                    </td>
                    <td className="border border-slate-300 py-2 px-3 font-num font-bold">
                      {formatNum(item.quantity * item.unitPrice)} ج.م
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-full sm:w-72 space-y-1.5 p-3 rounded-lg bg-slate-100 border border-slate-300">
                <div className="flex justify-between">
                  <span>الإجمالي الفرعي:</span>
                  <strong className="font-num">{formatNum(invoiceTotals.subtotal)} ج.م</strong>
                </div>
                <div className="flex justify-between">
                  <span>الخصم الممنوح:</span>
                  <strong className="font-num">{formatNum(invoiceTotals.discountAmount)} ج.م</strong>
                </div>
                <div className="flex justify-between">
                  <span>ضريبة القيمة المضافة ({vatPercent}%):</span>
                  <strong className="font-num">{formatNum(invoiceTotals.vatAmount)} ج.م</strong>
                </div>
                <div className="flex justify-between border-t border-slate-400 pt-1.5 text-base font-extrabold">
                  <span>الصافي المستحق:</span>
                  <span data-testid="invoice-grand-total" className="font-num">
                    {formatNum(invoiceTotals.grandTotal)} ج.م
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Official Signatures Footer */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-300 text-xs sm:text-sm text-center">
          <div className="space-y-6">
            <strong>توقيع الطرف الأول (البائع / المؤجر / المُصدر)</strong>
            <div className="border-b border-dashed border-slate-400 w-48 mx-auto pt-4" />
            <span className="text-slate-600">{firstPartyName}</span>
          </div>
          <div className="space-y-6">
            <strong>توقيع الطرف الثاني (المشتري / المستأجر / المستلم)</strong>
            <div className="border-b border-dashed border-slate-400 w-48 mx-auto pt-4" />
            <span className="text-slate-600">{secondPartyName}</span>
          </div>
        </div>
      </div>

      {/* Strategic Ad Placement #2 */}
      <AdSlot
        slotId="2020293842"
        placement="post-result"
        label="إعلان أسفل مولد العقود والفواتير"
      />
    </div>
  );
}

/* ============================================================================
 * DYNAMIC TOOL RENDERER MAP (`AllTools.jsx`)
 * ========================================================================== */
export const TOOL_COMPONENTS_MAP = {
  'zakat-gold-calculator': ZakatGoldCalculator,
  'fuel-trip-calculator': FuelTripCalculator,
  'loan-certificate-calculator': LoanCertificateCalculator,
  'gold-workmanship-calculator': GoldWorkmanshipCalculator,
  'currency-converter': CurrencyConverterTool,
  'image-compressor-converter': ImageCompressorConverter,
  'qr-code-generator': QrCodeGeneratorTool,
  'contract-invoice-generator': ContractInvoiceGenerator,
};

export default function AllTools({ slug }) {
  const SelectedToolComponent = TOOL_COMPONENTS_MAP[slug] || ZakatGoldCalculator;
  return <SelectedToolComponent />;
}
