export interface ZakatInput {
  gold24PricePerGram: number;
  cashAndSavings: number;
  stocksAndInvestments: number;
  businessInventory: number;
  gold24Grams: number;
  gold21Grams: number;
  gold18Grams: number;
  liabilitiesAndDebts: number;
}

export interface ZakatResult {
  nisabThresholdValue: number;
  pureGold24EquivalentGrams: number;
  totalGoldValue: number;
  totalCashAndAssets: number;
  grossWealth: number;
  netZakatableWealth: number;
  isEligibleForZakat: boolean;
  totalZakatDue: number;
  zakatOnCashPortion: number;
  zakatOnGoldPortion: number;
  nisabCompletionPercent: number;
}

export function calculateZakatAndGold(input: ZakatInput): ZakatResult {
  const price24 = Math.max(0, Number(input.gold24PricePerGram) || 0);
  const cash = Math.max(0, Number(input.cashAndSavings) || 0);
  const stocks = Math.max(0, Number(input.stocksAndInvestments) || 0);
  const inventory = Math.max(0, Number(input.businessInventory) || 0);
  const g24 = Math.max(0, Number(input.gold24Grams) || 0);
  const g21 = Math.max(0, Number(input.gold21Grams) || 0);
  const g18 = Math.max(0, Number(input.gold18Grams) || 0);
  const debts = Math.max(0, Number(input.liabilitiesAndDebts) || 0);

  const nisabThresholdValue = price24 * 85;
  const pureGold24EquivalentGrams = g24 + (g21 * 21) / 24 + (g18 * 18) / 24;
  const totalGoldValue = pureGold24EquivalentGrams * price24;
  const totalCashAndAssets = cash + stocks + inventory;
  const grossWealth = totalCashAndAssets + totalGoldValue;
  const netZakatableWealth = Math.max(0, grossWealth - debts);

  const isEligibleForZakat =
    nisabThresholdValue > 0 && netZakatableWealth >= nisabThresholdValue;
  const totalZakatDue = isEligibleForZakat ? netZakatableWealth * 0.025 : 0;

  const goldShareRatio = grossWealth > 0 ? totalGoldValue / grossWealth : 0;
  const zakatOnGoldPortion = totalZakatDue * goldShareRatio;
  const zakatOnCashPortion = totalZakatDue - zakatOnGoldPortion;

  const nisabCompletionPercent =
    nisabThresholdValue > 0
      ? Math.min(100, (netZakatableWealth / nisabThresholdValue) * 100)
      : 0;

  return {
    nisabThresholdValue: Number(nisabThresholdValue.toFixed(2)),
    pureGold24EquivalentGrams: Number(pureGold24EquivalentGrams.toFixed(2)),
    totalGoldValue: Number(totalGoldValue.toFixed(2)),
    totalCashAndAssets: Number(totalCashAndAssets.toFixed(2)),
    grossWealth: Number(grossWealth.toFixed(2)),
    netZakatableWealth: Number(netZakatableWealth.toFixed(2)),
    isEligibleForZakat,
    totalZakatDue: Number(totalZakatDue.toFixed(2)),
    zakatOnCashPortion: Number(zakatOnCashPortion.toFixed(2)),
    zakatOnGoldPortion: Number(zakatOnGoldPortion.toFixed(2)),
    nisabCompletionPercent: Number(nisabCompletionPercent.toFixed(1)),
  };
}

export interface FuelTripInput {
  distanceKm: number;
  isRoundTrip: boolean;
  consumptionPer100Km: number;
  fuelPricePerLiter: number;
  passengersCount: number;
}

export interface FuelTripResult {
  effectiveDistanceKm: number;
  totalLitersNeeded: number;
  totalTripCost: number;
  costPerPassenger: number;
  costPerKm: number;
}

export function calculateFuelTrip(input: FuelTripInput): FuelTripResult {
  const baseDistance = Math.max(0, Number(input.distanceKm) || 0);
  const effectiveDistanceKm = input.isRoundTrip ? baseDistance * 2 : baseDistance;
  const consumption = Math.max(0, Number(input.consumptionPer100Km) || 0);
  const fuelPrice = Math.max(0, Number(input.fuelPricePerLiter) || 0);
  const passengers = Math.max(1, Math.floor(Number(input.passengersCount) || 1));

  const totalLitersNeeded = (effectiveDistanceKm * consumption) / 100;
  const totalTripCost = totalLitersNeeded * fuelPrice;
  const costPerPassenger = totalTripCost / passengers;
  const costPerKm = effectiveDistanceKm > 0 ? totalTripCost / effectiveDistanceKm : 0;

  return {
    effectiveDistanceKm: Number(effectiveDistanceKm.toFixed(1)),
    totalLitersNeeded: Number(totalLitersNeeded.toFixed(2)),
    totalTripCost: Number(totalTripCost.toFixed(2)),
    costPerPassenger: Number(costPerPassenger.toFixed(2)),
    costPerKm: Number(costPerKm.toFixed(2)),
  };
}

export interface LoanInput {
  principalAmount: number;
  annualInterestRate: number;
  durationMonths: number;
  interestType: 'declining' | 'flat';
  adminFeePercent?: number;
}

export interface LoanResult {
  monthlyInstallment: number;
  totalPayment: number;
  totalInterest: number;
  adminFeeAmount: number;
  netDisbursedAmount: number;
  firstMonthInterest: number;
  firstMonthPrincipal: number;
}

export function calculateLoanSchedule(input: LoanInput): LoanResult {
  const principal = Math.max(0, Number(input.principalAmount) || 0);
  const annualRate = Math.max(0, Number(input.annualInterestRate) || 0);
  const months = Math.max(1, Math.floor(Number(input.durationMonths) || 1));
  const adminPercent = Math.max(0, Number(input.adminFeePercent) || 0);

  const adminFeeAmount = principal * (adminPercent / 100);
  const netDisbursedAmount = Math.max(0, principal - adminFeeAmount);

  if (principal === 0) {
    return {
      monthlyInstallment: 0,
      totalPayment: 0,
      totalInterest: 0,
      adminFeeAmount: 0,
      netDisbursedAmount: 0,
      firstMonthInterest: 0,
      firstMonthPrincipal: 0,
    };
  }

  if (input.interestType === 'flat' || annualRate === 0) {
    const years = months / 12;
    const totalInterest = principal * (annualRate / 100) * years;
    const totalPayment = principal + totalInterest;
    const monthlyInstallment = totalPayment / months;
    const firstMonthInterest = totalInterest / months;
    const firstMonthPrincipal = principal / months;

    return {
      monthlyInstallment: Number(monthlyInstallment.toFixed(2)),
      totalPayment: Number(totalPayment.toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2)),
      adminFeeAmount: Number(adminFeeAmount.toFixed(2)),
      netDisbursedAmount: Number(netDisbursedAmount.toFixed(2)),
      firstMonthInterest: Number(firstMonthInterest.toFixed(2)),
      firstMonthPrincipal: Number(firstMonthPrincipal.toFixed(2)),
    };
  }

  const monthlyRate = annualRate / 100 / 12;
  const factor = Math.pow(1 + monthlyRate, months);
  const monthlyInstallment = (principal * (monthlyRate * factor)) / (factor - 1);
  const totalPayment = monthlyInstallment * months;
  const totalInterest = totalPayment - principal;
  const firstMonthInterest = principal * monthlyRate;
  const firstMonthPrincipal = monthlyInstallment - firstMonthInterest;

  return {
    monthlyInstallment: Number(monthlyInstallment.toFixed(2)),
    totalPayment: Number(totalPayment.toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
    adminFeeAmount: Number(adminFeeAmount.toFixed(2)),
    netDisbursedAmount: Number(netDisbursedAmount.toFixed(2)),
    firstMonthInterest: Number(firstMonthInterest.toFixed(2)),
    firstMonthPrincipal: Number(firstMonthPrincipal.toFixed(2)),
  };
}

export interface CertificateInput {
  principalAmount: number;
  annualYieldPercent: number;
  durationYears: number;
}

export interface CertificateResult {
  monthlyPayout: number;
  quarterlyPayout: number;
  annualPayout: number;
  totalProfitAtMaturity: number;
  totalMaturityValue: number;
  dailyAverageProfit: number;
}

export function calculateCertificateProfit(input: CertificateInput): CertificateResult {
  const principal = Math.max(0, Number(input.principalAmount) || 0);
  const yieldRate = Math.max(0, Number(input.annualYieldPercent) || 0);
  const years = Math.max(0.25, Number(input.durationYears) || 1);

  const annualPayout = principal * (yieldRate / 100);
  const monthlyPayout = annualPayout / 12;
  const quarterlyPayout = annualPayout / 4;
  const totalProfitAtMaturity = annualPayout * years;
  const totalMaturityValue = principal + totalProfitAtMaturity;
  const dailyAverageProfit = annualPayout / 365;

  return {
    monthlyPayout: Number(monthlyPayout.toFixed(2)),
    quarterlyPayout: Number(quarterlyPayout.toFixed(2)),
    annualPayout: Number(annualPayout.toFixed(2)),
    totalProfitAtMaturity: Number(totalProfitAtMaturity.toFixed(2)),
    totalMaturityValue: Number(totalMaturityValue.toFixed(2)),
    dailyAverageProfit: Number(dailyAverageProfit.toFixed(2)),
  };
}

export interface GoldWorkmanshipInput {
  baseKarat21Price: number;
  selectedKarat: 24 | 22 | 21 | 18 | 14;
  weightGrams: number;
  workmanshipPerGram: number;
  stampAndTaxPerGram: number;
  cashbackPercentOnResale: number;
  dealerBuySpreadPerGram: number;
}

export interface GoldWorkmanshipResult {
  karatPureGramPrice: number;
  price24: number;
  price22: number;
  price21: number;
  price18: number;
  price14: number;
  goldCoin8gRawPrice: number;
  rawGoldTotalValue: number;
  totalWorkmanshipAndTax: number;
  totalPurchaseCost: number;
  effectiveCostPerGram: number;
  resaleCashbackAmount: number;
  netResaleValue: number;
  spreadAndFeeDifference: number;
}

export function calculateGoldWorkmanship(
  input: GoldWorkmanshipInput
): GoldWorkmanshipResult {
  const p21 = Math.max(0, Number(input.baseKarat21Price) || 0);
  const weight = Math.max(0, Number(input.weightGrams) || 0);
  const workmanship = Math.max(0, Number(input.workmanshipPerGram) || 0);
  const stampTax = Math.max(0, Number(input.stampAndTaxPerGram) || 0);
  const cashbackPercent = Math.min(
    100,
    Math.max(0, Number(input.cashbackPercentOnResale) || 0)
  );
  const spread = Math.max(0, Number(input.dealerBuySpreadPerGram) || 0);

  const price24 = (p21 * 24) / 21;
  const price22 = (p21 * 22) / 21;
  const price21 = p21;
  const price18 = (p21 * 18) / 21;
  const price14 = (p21 * 14) / 21;

  const karatMap: Record<24 | 22 | 21 | 18 | 14, number> = {
    24: price24,
    22: price22,
    21: price21,
    18: price18,
    14: price14,
  };

  const karatPureGramPrice = karatMap[input.selectedKarat] ?? price21;
  const rawGoldTotalValue = karatPureGramPrice * weight;
  const feePerGram = workmanship + stampTax;
  const totalWorkmanshipAndTax = feePerGram * weight;
  const totalPurchaseCost = rawGoldTotalValue + totalWorkmanshipAndTax;
  const effectiveCostPerGram = weight > 0 ? totalPurchaseCost / weight : 0;

  const resaleCashbackAmount = totalWorkmanshipAndTax * (cashbackPercent / 100);
  const buybackGramPrice = Math.max(0, karatPureGramPrice - spread);
  const netResaleValue = buybackGramPrice * weight + resaleCashbackAmount;
  const spreadAndFeeDifference = Math.max(0, totalPurchaseCost - netResaleValue);

  return {
    karatPureGramPrice: Number(karatPureGramPrice.toFixed(2)),
    price24: Number(price24.toFixed(2)),
    price22: Number(price22.toFixed(2)),
    price21: Number(price21.toFixed(2)),
    price18: Number(price18.toFixed(2)),
    price14: Number(price14.toFixed(2)),
    goldCoin8gRawPrice: Number((price21 * 8).toFixed(2)),
    rawGoldTotalValue: Number(rawGoldTotalValue.toFixed(2)),
    totalWorkmanshipAndTax: Number(totalWorkmanshipAndTax.toFixed(2)),
    totalPurchaseCost: Number(totalPurchaseCost.toFixed(2)),
    effectiveCostPerGram: Number(effectiveCostPerGram.toFixed(2)),
    resaleCashbackAmount: Number(resaleCashbackAmount.toFixed(2)),
    netResaleValue: Number(netResaleValue.toFixed(2)),
    spreadAndFeeDifference: Number(spreadAndFeeDifference.toFixed(2)),
  };
}

export interface CurrencyMultiplierRow {
  baseAmount: number;
  fromToTarget: number;
  targetToFrom: number;
}

export interface CurrencyConversionResult {
  convertedAmount: number;
  effectiveExchangeRate: number;
  inverseExchangeRate: number;
  bankFeeAmount: number;
  totalWithFee: number;
  multipliersTable: CurrencyMultiplierRow[];
}

export const MULTIPLIER_STEPS = [1, 10, 50, 100, 500, 1000, 5000];

export function calculateCurrencyConversion(
  amount: number,
  exchangeRate: number,
  bankFeePercent = 0
): CurrencyConversionResult {
  const cleanAmount = Math.max(0, Number(amount) || 0);
  const rate = Math.max(0.000001, Number(exchangeRate) || 1);
  const feePct = Math.max(0, Number(bankFeePercent) || 0);

  const convertedAmount = cleanAmount * rate;
  const bankFeeAmount = convertedAmount * (feePct / 100);
  const totalWithFee = convertedAmount + bankFeeAmount;
  const inverseExchangeRate = 1 / rate;

  const multipliersTable: CurrencyMultiplierRow[] = MULTIPLIER_STEPS.map((step) => ({
    baseAmount: step,
    fromToTarget: Number((step * rate).toFixed(2)),
    targetToFrom: Number((step * inverseExchangeRate).toFixed(4)),
  }));

  return {
    convertedAmount: Number(convertedAmount.toFixed(2)),
    effectiveExchangeRate: Number(rate.toFixed(4)),
    inverseExchangeRate: Number(inverseExchangeRate.toFixed(6)),
    bankFeeAmount: Number(bankFeeAmount.toFixed(2)),
    totalWithFee: Number(totalWithFee.toFixed(2)),
    multipliersTable,
  };
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceTotalsResult {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  vatAmount: number;
  grandTotal: number;
}

export function calculateInvoiceTotals(
  items: InvoiceLineItem[],
  discountValue: number,
  vatPercent: number
): InvoiceTotalsResult {
  const subtotal = items.reduce((acc, item) => {
    const qty = Math.max(0, Number(item.quantity) || 0);
    const price = Math.max(0, Number(item.unitPrice) || 0);
    return acc + qty * price;
  }, 0);

  const discountAmount = Math.min(subtotal, Math.max(0, Number(discountValue) || 0));
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const vatRate = Math.max(0, Number(vatPercent) || 0);
  const vatAmount = taxableAmount * (vatRate / 100);
  const grandTotal = taxableAmount + vatAmount;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    taxableAmount: Number(taxableAmount.toFixed(2)),
    vatAmount: Number(vatAmount.toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2)),
  };
}

/* ============================================================================
 * ARABIC FINANCIAL TAFQEET (تفقيط المبالغ المالية للشيكات والعقود والفواتير)
 * ========================================================================== */
const ARABIC_ONES = [
  '',
  'واحد',
  'اثنان',
  'ثلاثة',
  'أربعة',
  'خمسة',
  'ستة',
  'سبعة',
  'ثمانية',
  'تسعة',
  'عشرة',
  'أحد عشر',
  'اثنا عشر',
  'ثلاثة عشر',
  'أربعة عشر',
  'خمسة عشر',
  'ستة عشر',
  'سبعة عشر',
  'ثمانية عشر',
  'تسعة عشر',
];

const ARABIC_TENS = [
  '',
  'عشرة',
  'عشرون',
  'ثلاثون',
  'أربعون',
  'خمسون',
  'ستون',
  'سبعون',
  'ثمانون',
  'تسعون',
];

const ARABIC_HUNDREDS = [
  '',
  'مائة',
  'مائتان',
  'ثلاثمائة',
  'أربعمائة',
  'خمسمائة',
  'ستمائة',
  'سبعمائة',
  'ثمانمائة',
  'تسعمائة',
];

function convertThreeDigitsToArabic(n: number): string {
  const num = Math.floor(Math.max(0, n));
  if (num === 0) return '';

  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;
  const parts: string[] = [];

  if (hundreds > 0) {
    parts.push(ARABIC_HUNDREDS[hundreds]);
  }

  if (remainder > 0) {
    if (remainder < 20) {
      parts.push(ARABIC_ONES[remainder]);
    } else {
      const ones = remainder % 10;
      const tens = Math.floor(remainder / 10);
      if (ones > 0) {
        parts.push(`${ARABIC_ONES[ones]} و${ARABIC_TENS[tens]}`);
      } else {
        parts.push(ARABIC_TENS[tens]);
      }
    }
  }

  return parts.join(' و');
}

export interface TafqeetResult {
  numericFormatted: string;
  integerPartWords: string;
  fractionPartWords: string;
  fullLegalCheckString: string;
}

export function numberToArabicWordsTafqeet(
  amount: number,
  currencyMain = 'جنيه مصري',
  currencySub = 'قرشاً'
): TafqeetResult {
  const clean = Math.max(0, Number(amount) || 0);
  const integerPart = Math.floor(clean);
  const fractionPart = Math.round((clean - integerPart) * 100);

  if (integerPart === 0 && fractionPart === 0) {
    return {
      numericFormatted: '0.00',
      integerPartWords: 'صفر',
      fractionPartWords: '',
      fullLegalCheckString: `فقط وقدره صفر ${currencyMain} لا غير.`,
    };
  }

  const millions = Math.floor(integerPart / 1000000);
  const thousands = Math.floor((integerPart % 1000000) / 1000);
  const hundreds = integerPart % 1000;

  const segments: string[] = [];

  if (millions > 0) {
    if (millions === 1) segments.push('مليون');
    else if (millions === 2) segments.push('مليونان');
    else if (millions >= 3 && millions <= 10)
      segments.push(`${convertThreeDigitsToArabic(millions)} ملايين`);
    else segments.push(`${convertThreeDigitsToArabic(millions)} مليوناً`);
  }

  if (thousands > 0) {
    if (thousands === 1) segments.push('ألف');
    else if (thousands === 2) segments.push('ألفان');
    else if (thousands >= 3 && thousands <= 10)
      segments.push(`${convertThreeDigitsToArabic(thousands)} آلاف`);
    else segments.push(`${convertThreeDigitsToArabic(thousands)} ألفاً`);
  }

  if (hundreds > 0) {
    segments.push(convertThreeDigitsToArabic(hundreds));
  }

  const integerPartWords = segments.join(' و') || 'صفر';
  const fractionPartWords =
    fractionPart > 0 ? `${convertThreeDigitsToArabic(fractionPart)} ${currencySub}` : '';

  const fullLegalCheckString =
    fractionPart > 0
      ? `فقط وقدره ${integerPartWords} ${currencyMain} و${fractionPartWords} لا غير.`
      : `فقط وقدره ${integerPartWords} ${currencyMain} لا غير.`;

  return {
    numericFormatted: clean.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    integerPartWords,
    fractionPartWords,
    fullLegalCheckString,
  };
}

/* ============================================================================
 * ISLAMIC SHARIA INHERITANCE CALCULATOR (حاسبة تقسيم المواريث الشرعية)
 * ========================================================================== */
export interface InheritanceInput {
  estateGrossValue: number;
  debtsAndFuneralExpenses: number;
  bequestAmount: number;
  hasHusband: boolean;
  wivesCount: number;
  sonsCount: number;
  daughtersCount: number;
  hasFather: boolean;
  hasMother: boolean;
}

export interface HeirShareRow {
  heirTitle: string;
  count: number;
  shareType: string;
  fractionLabel: string;
  totalShareAmount: number;
  perPersonAmount: number;
  sharePercent: number;
}

export interface InheritanceResult {
  netEstateBeforeBequest: number;
  effectiveBequestAmount: number;
  distributableEstate: number;
  shares: HeirShareRow[];
}

export function calculateIslamicInheritance(input: InheritanceInput): InheritanceResult {
  const gross = Math.max(0, Number(input.estateGrossValue) || 0);
  const debts = Math.max(0, Number(input.debtsAndFuneralExpenses) || 0);
  const netBeforeBequest = Math.max(0, gross - debts);

  // Islamic Bequest (الوصية الشرعية) is capped at 1/3 of net estate
  const maxAllowedBequest = netBeforeBequest / 3;
  const effectiveBequestAmount = Math.min(
    maxAllowedBequest,
    Math.max(0, Number(input.bequestAmount) || 0)
  );
  const distributable = Math.max(0, netBeforeBequest - effectiveBequestAmount);

  const sons = Math.max(0, Math.floor(Number(input.sonsCount) || 0));
  const daughters = Math.max(0, Math.floor(Number(input.daughtersCount) || 0));
  const wives = input.hasHusband
    ? 0
    : Math.min(4, Math.max(0, Math.floor(Number(input.wivesCount) || 0)));
  const hasDescendants = sons > 0 || daughters > 0;

  // Fixed Shares (أصحاب الفروض) in 24ths denominator
  let husbandWeight = 0;
  let wivesWeight = 0;
  let fatherFixedWeight = 0;
  let motherWeight = 0;
  let daughtersFixedWeight = 0;

  if (input.hasHusband) {
    husbandWeight = hasDescendants ? 6 : 12; // 1/4 or 1/2
  } else if (wives > 0) {
    wivesWeight = hasDescendants ? 3 : 6; // 1/8 or 1/4
  }

  if (input.hasMother) {
    motherWeight = hasDescendants ? 4 : 8; // 1/6 or 1/3
  }

  if (input.hasFather) {
    if (sons > 0) {
      fatherFixedWeight = 4; // 1/6 fixed
    } else if (daughters > 0) {
      fatherFixedWeight = 4; // 1/6 + residuary
    }
  }

  if (sons === 0 && daughters > 0) {
    daughtersFixedWeight = daughters === 1 ? 12 : 16; // 1/2 for 1 daughter, 2/3 for 2+ daughters
  }

  const totalFixedWeight =
    husbandWeight + wivesWeight + fatherFixedWeight + motherWeight + daughtersFixedWeight;

  // Handle Awl (العول) if fixed shares exceed 24
  const baseDenom = Math.max(24, totalFixedWeight);
  const shares: HeirShareRow[] = [];

  const pushShare = (
    heirTitle: string,
    count: number,
    shareType: string,
    fractionLabel: string,
    amount: number
  ) => {
    if (count <= 0 || amount <= 0) return;
    shares.push({
      heirTitle,
      count,
      shareType,
      fractionLabel,
      totalShareAmount: Number(amount.toFixed(2)),
      perPersonAmount: Number((amount / count).toFixed(2)),
      sharePercent:
        distributable > 0 ? Number(((amount / distributable) * 100).toFixed(2)) : 0,
    });
  };

  if (husbandWeight > 0) {
    pushShare(
      'الزوج',
      1,
      'فرض شرعي',
      hasDescendants ? 'الربع (1/4)' : 'النصف (1/2)',
      (distributable * husbandWeight) / baseDenom
    );
  }

  if (wivesWeight > 0) {
    pushShare(
      'الزوجات',
      wives,
      'فرض شرعي',
      hasDescendants ? 'الثمن (1/8)' : 'الربع (1/4)',
      (distributable * wivesWeight) / baseDenom
    );
  }

  if (motherWeight > 0) {
    pushShare(
      'الأم',
      1,
      'فرض شرعي',
      hasDescendants ? 'السدس (1/6)' : 'الثلث (1/3)',
      (distributable * motherWeight) / baseDenom
    );
  }

  const remainingWeight = Math.max(0, baseDenom - totalFixedWeight);
  const remainingEstate = (distributable * remainingWeight) / baseDenom;

  if (sons > 0) {
    if (input.hasFather) {
      pushShare(
        'الأب',
        1,
        'فرض شرعي',
        'السدس (1/6)',
        (distributable * fatherFixedWeight) / baseDenom
      );
    }
    // Sons and daughters share residuary (للذكر مثل حظ الأنثيين)
    const totalParts = sons * 2 + daughters;
    const sonTotal = (remainingEstate * (sons * 2)) / totalParts;
    const daughterTotal = (remainingEstate * daughters) / totalParts;

    pushShare('الأبناء الذكور', sons, 'تعصيب (2:1)', 'الباقي تعصيباً', sonTotal);
    if (daughters > 0) {
      pushShare('البنات', daughters, 'تعصيب بالغير (1:2)', 'الباقي تعصيباً', daughterTotal);
    }
  } else {
    // No sons
    if (daughters > 0) {
      pushShare(
        'البنات',
        daughters,
        'فرض شرعي',
        daughters === 1 ? 'النصف (1/2)' : 'الثلثان (2/3)',
        (distributable * daughtersFixedWeight) / baseDenom
      );
    }

    if (input.hasFather) {
      const fatherTotal =
        (distributable * fatherFixedWeight) / baseDenom + remainingEstate;
      pushShare(
        'الأب',
        1,
        daughters > 0 ? 'فرض + تعصيب' : 'تعصيب بالنفس',
        daughters > 0 ? 'السدس + الباقي' : 'الباقي تعصيباً',
        fatherTotal
      );
    }
  }

  return {
    netEstateBeforeBequest: Number(netBeforeBequest.toFixed(2)),
    effectiveBequestAmount: Number(effectiveBequestAmount.toFixed(2)),
    distributableEstate: Number(distributable.toFixed(2)),
    shares,
  };
}

/* ============================================================================
 * 1. SMART INVESTMENT COMPARATOR (`gold-vs-bank-comparator`)
 * Compares Gold 21K vs Bank Certificates (27%) vs USD over a chosen duration
 * ========================================================================== */
export interface InvestmentComparisonInput {
  capitalAmountEgp: number;
  durationYears: number;
  liveGold21Price: number;
  workmanshipPerGram?: number;
  expectedGoldAnnualGrowthPercent?: number;
  bankCertificateYieldPercent?: number;
  liveUsdRate: number;
  expectedUsdAnnualGrowthPercent?: number;
}

export interface InvestmentOptionProjection {
  key: 'gold' | 'bank' | 'usd';
  title: string;
  subtitle: string;
  unitsPurchasedLabel: string;
  finalValueEgp: number;
  netProfitEgp: number;
  roiPercent: number;
  monthlyEquivalentEgp: number;
  barWidthPercent: number;
}

export interface InvestmentComparisonResult {
  capitalAmountEgp: number;
  durationYears: number;
  goldGramsPurchased: number;
  usdAmountPurchased: number;
  options: InvestmentOptionProjection[];
  winnerKey: 'gold' | 'bank' | 'usd';
  winnerTitle: string;
  winnerHeadline: string;
  winnerReason: string;
  advantageOverSecondEgp: number;
}

export function calculateInvestmentComparison(
  input: InvestmentComparisonInput
): InvestmentComparisonResult {
  const capital = Math.max(1000, Number(input.capitalAmountEgp) || 100000);
  const years = Math.max(0.5, Math.min(20, Number(input.durationYears) || 3));
  const gold21 = Math.max(1000, Number(input.liveGold21Price) || 3811);
  const workmanship = Math.max(0, Number(input.workmanshipPerGram ?? 80));
  const goldGrowthRate = Math.max(0, Number(input.expectedGoldAnnualGrowthPercent ?? 28)) / 100;
  const bankYieldRate = Math.max(0, Number(input.bankCertificateYieldPercent ?? 27)) / 100;
  const usdRate = Math.max(10, Number(input.liveUsdRate) || 50.45);
  const usdGrowthRate = Math.max(0, Number(input.expectedUsdAnnualGrowthPercent ?? 16)) / 100;

  // 1. Gold 21K Projection (compound annual growth minus workmanship buy spread)
  const effectiveBuyGoldGram = gold21 + workmanship;
  const goldGramsPurchased = capital / effectiveBuyGoldGram;
  const projectedFutureGold21Gram = gold21 * Math.pow(1 + goldGrowthRate, years);
  const goldFinalValue = Math.round(goldGramsPurchased * projectedFutureGold21Gram);
  const goldNetProfit = Math.round(goldFinalValue - capital);
  const goldRoiPercent = Number(((goldNetProfit / capital) * 100).toFixed(1));

  // 2. Bank Certificate Projection (Simple cumulative annual yield or annual payout)
  const bankNetProfit = Math.round(capital * bankYieldRate * years);
  const bankFinalValue = Math.round(capital + bankNetProfit);
  const bankRoiPercent = Number(((bankNetProfit / capital) * 100).toFixed(1));
  const bankMonthlyPayout = Math.round((capital * bankYieldRate) / 12);

  // 3. USD Projection (compound annual currency appreciation)
  const usdAmountPurchased = capital / usdRate;
  const projectedFutureUsdRate = usdRate * Math.pow(1 + usdGrowthRate, years);
  const usdFinalValue = Math.round(usdAmountPurchased * projectedFutureUsdRate);
  const usdNetProfit = Math.round(usdFinalValue - capital);
  const usdRoiPercent = Number(((usdNetProfit / capital) * 100).toFixed(1));

  const maxFinalValue = Math.max(goldFinalValue, bankFinalValue, usdFinalValue, 1);

  const rawOptions: InvestmentOptionProjection[] = [
    {
      key: 'gold',
      title: 'الذهب والسبائك (عيار 21 / 24)',
      subtitle: `نمو سنوي مركب ~${Math.round(goldGrowthRate * 100)}% · تحوط ضد التضخم`,
      unitsPurchasedLabel: `${goldGramsPurchased.toFixed(2)} جرام ذهب`,
      finalValueEgp: goldFinalValue,
      netProfitEgp: goldNetProfit,
      roiPercent: goldRoiPercent,
      monthlyEquivalentEgp: Math.round(goldNetProfit / (years * 12)),
      barWidthPercent: Math.max(15, Math.round((goldFinalValue / maxFinalValue) * 100)),
    },
    {
      key: 'bank',
      title: `الشهادات البنكية المصرية (${Math.round(bankYieldRate * 100)}%)`,
      subtitle: `عائد ثابت مضمون · يصرف دورياً (${bankMonthlyPayout.toLocaleString('en-US')} ج.م/شهر)`,
      unitsPurchasedLabel: `شهادة ادخار بعائد ${Math.round(bankYieldRate * 100)}%`,
      finalValueEgp: bankFinalValue,
      netProfitEgp: bankNetProfit,
      roiPercent: bankRoiPercent,
      monthlyEquivalentEgp: bankMonthlyPayout,
      barWidthPercent: Math.max(15, Math.round((bankFinalValue / maxFinalValue) * 100)),
    },
    {
      key: 'usd',
      title: 'الدولار الأمريكي (USD Cash)',
      subtitle: `بسعر صرف ${usdRate.toFixed(2)} ج.م · نمو سنوي ~${Math.round(usdGrowthRate * 100)}%`,
      unitsPurchasedLabel: `${usdAmountPurchased.toFixed(1)} دولار أمريكي`,
      finalValueEgp: usdFinalValue,
      netProfitEgp: usdNetProfit,
      roiPercent: usdRoiPercent,
      monthlyEquivalentEgp: Math.round(usdNetProfit / (years * 12)),
      barWidthPercent: Math.max(15, Math.round((usdFinalValue / maxFinalValue) * 100)),
    },
  ];

  const sorted = [...rawOptions].sort((a, b) => b.finalValueEgp - a.finalValueEgp);
  const winner = sorted[0];
  const second = sorted[1];
  const advantageOverSecondEgp = Math.max(0, winner.finalValueEgp - second.finalValueEgp);

  let winnerReason = '';
  if (winner.key === 'gold') {
    winnerReason = `حفظ القوة الشرائية وتحقيق أعلى نمو رأسمالي تراكمي (+${winner.roiPercent}%) خلال ${years} سنوات بفارق ${advantageOverSecondEgp.toLocaleString('en-US')} ج.م عن أقرب منافس.`;
  } else if (winner.key === 'bank') {
    winnerReason = `تحقيق أعلى عائد نقدي مضمون (${winner.roiPercent}%) مع تدفق شهري ثابت بقيمة ${bankMonthlyPayout.toLocaleString('en-US')} ج.م بدون مخاطر تقلب السوق.`;
  } else {
    winnerReason = `السيولة الدولارية الفورية وتحقيق صافي ربح ${winner.netProfitEgp.toLocaleString('en-US')} ج.م خلال فترة الاستثمار.`;
  }

  return {
    capitalAmountEgp: capital,
    durationYears: years,
    goldGramsPurchased: Number(goldGramsPurchased.toFixed(2)),
    usdAmountPurchased: Number(usdAmountPurchased.toFixed(2)),
    options: rawOptions,
    winnerKey: winner.key,
    winnerTitle: winner.title,
    winnerHeadline: `الأفضل لك هو: ${winner.title}`,
    winnerReason,
    advantageOverSecondEgp,
  };
}

/* ============================================================================
 * 2. VEHICLE MAINTENANCE & EGYPT TRAFFIC LICENSING (`vehicle-maintenance-tracker`)
 * ========================================================================== */
export interface VehicleMaintenanceInput {
  vehicleType: 'car' | 'motorcycle';
  currentOdometerKm: number;
  engineCc?: number;
  licenseYears?: number;
  lastServiceKmMap?: Record<string, number>;
}

export interface MaintenancePartStatus {
  id: string;
  name: string;
  intervalKm: number;
  lastServiceKm: number;
  kmSinceLastService: number;
  nextDueKm: number;
  remainingKm: number;
  wearPercent: number;
  status: 'good' | 'soon' | 'urgent';
  statusLabel: string;
}

export interface TrafficLicensingEstimate {
  annualTaxEgp: number;
  compulsoryInsuranceEgp: number;
  technicalInspectionEgp: number;
  electronicStickerAndPlatesEgp: number;
  fireExtinguisherAndFirstAidEgp: number;
  totalLicensingCostEgp: number;
}

export interface VehicleMaintenanceResult {
  vehicleType: 'car' | 'motorcycle';
  currentOdometerKm: number;
  parts: MaintenancePartStatus[];
  urgentCount: number;
  licensingEstimate: TrafficLicensingEstimate;
}

export function calculateVehicleMaintenanceSchedule(
  input: VehicleMaintenanceInput
): VehicleMaintenanceResult {
  const vehicleType = input.vehicleType === 'motorcycle' ? 'motorcycle' : 'car';
  const currentKm = Math.max(0, Math.floor(Number(input.currentOdometerKm) || 45000));
  const engineCc = Math.max(100, Number(input.engineCc) || (vehicleType === 'car' ? 1600 : 200));
  const licenseYears = Math.max(1, Math.min(3, Math.floor(Number(input.licenseYears) || 1)));
  const lastMap = input.lastServiceKmMap || {};

  const specs =
    vehicleType === 'motorcycle'
      ? [
          { id: 'engine-oil', name: 'تغيير زيت الموتور والفلتر', intervalKm: 2000 },
          { id: 'air-filter', name: 'فلتر الهواء وتنظيف الكربراتير/الإنجكشن', intervalKm: 6000 },
          { id: 'spark-plugs', name: 'البوجيهات وضبط الكهرباء', intervalKm: 10000 },
          { id: 'brake-pads', name: 'تيل الفرامل الأمامي والخلفي', intervalKm: 12000 },
          { id: 'clutch-drivetrain', name: 'طقم الجر والجنزير وورق الدبرياج', intervalKm: 18000 },
        ]
      : [
          { id: 'engine-oil', name: 'تغيير زيت المحرك والفلتر (10,000 كم)', intervalKm: 10000 },
          { id: 'air-filter', name: 'فلتر الهواء وفلتر التكييف', intervalKm: 20000 },
          { id: 'brake-pads', name: 'تيل الفرامل والكشف على الطنابير', intervalKm: 35000 },
          { id: 'spark-plugs', name: 'طقم البوجيهات ودورة التبريد', intervalKm: 40000 },
          { id: 'clutch-drivetrain', name: 'طقم الكاتينة / الفتيس والدبرياج', intervalKm: 60000 },
        ];

  let urgentCount = 0;

  const parts: MaintenancePartStatus[] = specs.map((spec) => {
    const defaultLastKm = Math.floor(currentKm / spec.intervalKm) * spec.intervalKm;
    const rawLast = lastMap[spec.id];
    const lastServiceKm =
      typeof rawLast === 'number' && rawLast >= 0 && rawLast <= currentKm
        ? rawLast
        : defaultLastKm;

    const kmSinceLastService = Math.max(0, currentKm - lastServiceKm);
    const nextDueKm = lastServiceKm + spec.intervalKm;
    const remainingKm = Math.max(0, nextDueKm - currentKm);
    const wearPercent = Math.min(
      100,
      Math.max(0, Math.round((kmSinceLastService / spec.intervalKm) * 100))
    );

    let status: 'good' | 'soon' | 'urgent' = 'good';
    let statusLabel = 'حالة ممتازة';
    if (wearPercent >= 90 || remainingKm <= 500) {
      status = 'urgent';
      statusLabel = 'يستلزم التغيير فوراً';
      urgentCount += 1;
    } else if (wearPercent >= 70) {
      status = 'soon';
      statusLabel = 'اقترب موعد الصيانة';
    }

    return {
      id: spec.id,
      name: spec.name,
      intervalKm: spec.intervalKm,
      lastServiceKm,
      kmSinceLastService,
      nextDueKm,
      remainingKm,
      wearPercent,
      status,
      statusLabel,
    };
  });

  // Egyptian Traffic Licensing & Inspection Fee Estimator
  let baseAnnualTax = 350;
  if (vehicleType === 'car') {
    if (engineCc <= 1300) baseAnnualTax = 650;
    else if (engineCc <= 1600) baseAnnualTax = 950;
    else if (engineCc <= 2000) baseAnnualTax = 2200;
    else baseAnnualTax = 4500;
  }

  const annualTaxEgp = baseAnnualTax * licenseYears;
  const compulsoryInsuranceEgp = (vehicleType === 'car' ? 420 : 240) * licenseYears;
  const technicalInspectionEgp = vehicleType === 'car' ? 680 : 320;
  const electronicStickerAndPlatesEgp = 350 * licenseYears;
  const fireExtinguisherAndFirstAidEgp = vehicleType === 'car' ? 550 : 180;
  const totalLicensingCostEgp =
    annualTaxEgp +
    compulsoryInsuranceEgp +
    technicalInspectionEgp +
    electronicStickerAndPlatesEgp +
    fireExtinguisherAndFirstAidEgp;

  return {
    vehicleType,
    currentOdometerKm: currentKm,
    parts,
    urgentCount,
    licensingEstimate: {
      annualTaxEgp,
      compulsoryInsuranceEgp,
      technicalInspectionEgp,
      electronicStickerAndPlatesEgp,
      fireExtinguisherAndFirstAidEgp,
      totalLicensingCostEgp,
    },
  };
}

/* ============================================================================
 * 3. COMMERCIAL SHIPPING AWB & BARCODE GENERATOR (`shipping-awb-generator`)
 * Includes all 27 Egyptian Governorates + COD Net Merchant Payout + Barcode
 * ========================================================================== */
export interface EgyptGovernorateShipping {
  id: string;
  name: string;
  zoneCode: string;
  baseShippingEgp: number;
  deliveryDays: string;
  landlineCode: string;
  postalCode: string;
  region: string;
  distanceFromCairoKm: number;
  lat: number;
  lng: number;
}

export const EGYPT_27_GOVERNORATES: EgyptGovernorateShipping[] = [
  { id: 'CAI', name: 'القاهرة', zoneCode: 'CAI-01', baseShippingEgp: 55, deliveryDays: '24 ساعة', landlineCode: '02', postalCode: '11511', region: 'القاهرة الكبرى', distanceFromCairoKm: 0, lat: 30.0444, lng: 31.2357 },
  { id: 'GIZ', name: 'الجيزة', zoneCode: 'GIZ-02', baseShippingEgp: 55, deliveryDays: '24 ساعة', landlineCode: '02', postalCode: '12511', region: 'القاهرة الكبرى', distanceFromCairoKm: 18, lat: 30.0131, lng: 31.2089 },
  { id: 'ALX', name: 'الإسكندرية', zoneCode: 'ALX-03', baseShippingEgp: 65, deliveryDays: '24 - 48 ساعة', landlineCode: '03', postalCode: '21500', region: 'الساحل الشمالي والدلتا', distanceFromCairoKm: 220, lat: 31.2001, lng: 29.9187 },
  { id: 'QAL', name: 'القليوبية', zoneCode: 'QAL-04', baseShippingEgp: 60, deliveryDays: '24 - 48 ساعة', landlineCode: '013', postalCode: '13511', region: 'القاهرة الكبرى', distanceFromCairoKm: 48, lat: 30.4660, lng: 31.1848 },
  { id: 'DKH', name: 'الدقهلية', zoneCode: 'DKH-05', baseShippingEgp: 70, deliveryDays: '48 ساعة', landlineCode: '050', postalCode: '35511', region: 'وسط وشرق الدلتا', distanceFromCairoKm: 130, lat: 31.0409, lng: 31.3785 },
  { id: 'SHR', name: 'الشرقية', zoneCode: 'SHR-06', baseShippingEgp: 70, deliveryDays: '48 ساعة', landlineCode: '055', postalCode: '44511', region: 'وسط وشرق الدلتا', distanceFromCairoKm: 85, lat: 30.5877, lng: 31.5020 },
  { id: 'GHR', name: 'الغربية', zoneCode: 'GHR-07', baseShippingEgp: 70, deliveryDays: '48 ساعة', landlineCode: '040', postalCode: '31511', region: 'وسط الدلتا', distanceFromCairoKm: 95, lat: 30.7865, lng: 31.0004 },
  { id: 'MNF', name: 'المنوفية', zoneCode: 'MNF-08', baseShippingEgp: 70, deliveryDays: '48 ساعة', landlineCode: '048', postalCode: '32511', region: 'وسط الدلتا', distanceFromCairoKm: 82, lat: 30.5503, lng: 31.0106 },
  { id: 'BHR', name: 'البحيرة', zoneCode: 'BHR-09', baseShippingEgp: 75, deliveryDays: '48 ساعة', landlineCode: '045', postalCode: '22511', region: 'غرب الدلتا', distanceFromCairoKm: 160, lat: 31.0364, lng: 30.4682 },
  { id: 'KFS', name: 'كفر الشيخ', zoneCode: 'KFS-10', baseShippingEgp: 75, deliveryDays: '48 ساعة', landlineCode: '047', postalCode: '33511', region: 'شمال الدلتا', distanceFromCairoKm: 140, lat: 31.1107, lng: 30.9388 },
  { id: 'DMT', name: 'دمياط', zoneCode: 'DMT-11', baseShippingEgp: 75, deliveryDays: '48 ساعة', landlineCode: '057', postalCode: '34511', region: 'شمال شرق الدلتا', distanceFromCairoKm: 195, lat: 31.4175, lng: 31.8144 },
  { id: 'PTS', name: 'بورسعيد', zoneCode: 'PTS-12', baseShippingEgp: 75, deliveryDays: '48 ساعة', landlineCode: '066', postalCode: '42511', region: 'مدن القناة', distanceFromCairoKm: 200, lat: 31.2653, lng: 32.3019 },
  { id: 'ISM', name: 'الإسماعيلية', zoneCode: 'ISM-13', baseShippingEgp: 75, deliveryDays: '48 ساعة', landlineCode: '064', postalCode: '41511', region: 'مدن القناة', distanceFromCairoKm: 125, lat: 30.5965, lng: 32.2715 },
  { id: 'SUZ', name: 'السويس', zoneCode: 'SUZ-14', baseShippingEgp: 75, deliveryDays: '48 ساعة', landlineCode: '062', postalCode: '43511', region: 'مدن القناة', distanceFromCairoKm: 135, lat: 29.9668, lng: 32.5498 },
  { id: 'FYM', name: 'الفيوم', zoneCode: 'FYM-15', baseShippingEgp: 80, deliveryDays: '2 - 3 أيام', landlineCode: '084', postalCode: '63511', region: 'شمال الصعيد', distanceFromCairoKm: 105, lat: 29.3084, lng: 30.8428 },
  { id: 'BNS', name: 'بني سويف', zoneCode: 'BNS-16', baseShippingEgp: 80, deliveryDays: '2 - 3 أيام', landlineCode: '082', postalCode: '62511', region: 'شمال الصعيد', distanceFromCairoKm: 120, lat: 29.0661, lng: 31.0994 },
  { id: 'MNY', name: 'المنيا', zoneCode: 'MNY-17', baseShippingEgp: 85, deliveryDays: '2 - 3 أيام', landlineCode: '086', postalCode: '61511', region: 'وسط الصعيد', distanceFromCairoKm: 245, lat: 28.1099, lng: 30.7503 },
  { id: 'AST', name: 'أسيوط', zoneCode: 'AST-18', baseShippingEgp: 90, deliveryDays: '3 أيام', landlineCode: '088', postalCode: '71511', region: 'وسط الصعيد', distanceFromCairoKm: 375, lat: 27.1810, lng: 31.1837 },
  { id: 'SHG', name: 'سوهاج', zoneCode: 'SHG-19', baseShippingEgp: 95, deliveryDays: '3 أيام', landlineCode: '093', postalCode: '82511', region: 'جنوب الصعيد', distanceFromCairoKm: 470, lat: 26.5570, lng: 31.6948 },
  { id: 'QNA', name: 'قنا', zoneCode: 'QNA-20', baseShippingEgp: 100, deliveryDays: '3 - 4 أيام', landlineCode: '096', postalCode: '83511', region: 'جنوب الصعيد', distanceFromCairoKm: 605, lat: 26.1551, lng: 32.7160 },
  { id: 'LXR', name: 'الأقصر', zoneCode: 'LXR-21', baseShippingEgp: 105, deliveryDays: '3 - 4 أيام', landlineCode: '095', postalCode: '85511', region: 'جنوب الصعيد', distanceFromCairoKm: 660, lat: 25.6872, lng: 32.6396 },
  { id: 'ASW', name: 'أسوان', zoneCode: 'ASW-22', baseShippingEgp: 110, deliveryDays: '3 - 4 أيام', landlineCode: '097', postalCode: '81511', region: 'جنوب الصعيد', distanceFromCairoKm: 880, lat: 24.0889, lng: 32.8998 },
  { id: 'RDS', name: 'البحر الأحمر', zoneCode: 'RDS-23', baseShippingEgp: 115, deliveryDays: '3 - 4 أيام', landlineCode: '065', postalCode: '84511', region: 'البحر الأحمر والقناة', distanceFromCairoKm: 455, lat: 27.2579, lng: 33.8116 },
  { id: 'MTR', name: 'مطروح', zoneCode: 'MTR-24', baseShippingEgp: 115, deliveryDays: '3 - 4 أيام', landlineCode: '046', postalCode: '51511', region: 'الساحل الشمالي الغربي', distanceFromCairoKm: 495, lat: 31.3543, lng: 27.2373 },
  { id: 'WAD', name: 'الوادي الجديد', zoneCode: 'WAD-25', baseShippingEgp: 125, deliveryDays: '4 - 5 أيام', landlineCode: '092', postalCode: '72511', region: 'الصحراء الغربية', distanceFromCairoKm: 600, lat: 25.4514, lng: 30.5463 },
  { id: 'NSI', name: 'شمال سيناء', zoneCode: 'NSI-26', baseShippingEgp: 130, deliveryDays: '4 - 5 أيام', landlineCode: '068', postalCode: '45511', region: 'شبه جزيرة سيناء', distanceFromCairoKm: 340, lat: 31.1316, lng: 33.7984 },
  { id: 'SSI', name: 'جنوب سيناء', zoneCode: 'SSI-27', baseShippingEgp: 120, deliveryDays: '3 - 4 أيام', landlineCode: '069', postalCode: '46511', region: 'شبه جزيرة سيناء', distanceFromCairoKm: 500, lat: 27.9158, lng: 34.3300 },
];

export interface ShippingAwbInput {
  governorateId: string;
  codAmountEgp: number;
  piecesCount: number;
  weightKg?: number;
  allowOpenPackage: boolean;
  fragileItem?: boolean;
}

export interface ShippingAwbSummary {
  governorate: EgyptGovernorateShipping;
  baseShippingFee: number;
  extraWeightFee: number;
  totalShippingFee: number;
  codAmountEgp: number;
  netMerchantPayoutEgp: number;
  awbTrackingNumber: string;
  barcodeBars: number[];
}

export function generateBarcodeBars(code: string): number[] {
  const clean = String(code || 'DIX-2026-0001');
  const bars: number[] = [2, 1, 1, 2, 3, 1]; // Start pattern
  for (let i = 0; i < clean.length; i += 1) {
    const ch = clean.charCodeAt(i);
    bars.push(((ch >> 0) % 3) + 1);
    bars.push(((ch >> 2) % 3) + 1);
    bars.push(((ch >> 4) % 3) + 1);
    bars.push(((ch + i) % 2) + 1);
  }
  bars.push(2, 3, 1, 1, 2); // Stop pattern
  return bars;
}

export function calculateShippingAwbSummary(input: ShippingAwbInput): ShippingAwbSummary {
  const gov =
    EGYPT_27_GOVERNORATES.find((g) => g.id === input.governorateId || g.name === input.governorateId) ||
    EGYPT_27_GOVERNORATES[0];

  const cod = Math.max(0, Number(input.codAmountEgp) || 0);
  const pieces = Math.max(1, Math.floor(Number(input.piecesCount) || 1));
  const weightKg = Math.max(0.5, Number(input.weightKg) || 1);

  const baseShippingFee = gov.baseShippingEgp;
  const extraKg = Math.max(0, Math.ceil(weightKg - 3));
  const extraWeightFee = extraKg * 15;
  const totalShippingFee = baseShippingFee + extraWeightFee;
  const netMerchantPayoutEgp = Math.max(0, cod - totalShippingFee);

  const seed = Math.abs(Math.round(cod * 13 + pieces * 97 + baseShippingFee * 31)) % 900000 + 100000;
  const awbTrackingNumber = `DIX-${gov.id}-${seed}`;
  const barcodeBars = generateBarcodeBars(awbTrackingNumber);

  return {
    governorate: gov,
    baseShippingFee,
    extraWeightFee,
    totalShippingFee,
    codAmountEgp: cod,
    netMerchantPayoutEgp,
    awbTrackingNumber,
    barcodeBars,
  };
}

/* ============================================================================
 * 4. NO-CODE DYNAMIC TOOL & FORMULA EVALUATOR (`evaluateCustomToolFormula`)
 * Safely evaluates custom mathematical formulas referencing user inputs and
 * Egypt Live Oracle variables (`karat21`, `karat24`, `USD`, `SAR`, `fuel92`, etc.)
 * ========================================================================== */
export interface CustomFormulaEvalResult {
  ok: boolean;
  value: number;
  formattedValue: string;
  resolvedExpression: string;
  usedVariables: Record<string, number>;
  error?: string;
}

export function evaluateCustomToolFormula(
  formula: string,
  userInputs: Record<string, number | string> = {},
  liveOracleVariables: Record<string, number> = {}
): CustomFormulaEvalResult {
  const rawFormula = String(formula || '').trim();
  if (!rawFormula) {
    return {
      ok: false,
      value: 0,
      formattedValue: '0.00',
      resolvedExpression: '',
      usedVariables: {},
      error: 'المعادلة فارغة',
    };
  }

  const combinedVars: Record<string, number> = {
    karat24: 4355,
    karat22: 3992,
    karat21: 3811,
    karat18: 3266,
    karat14: 2540,
    goldCoin8g: 30488,
    USD: 50.45,
    SAR: 13.45,
    AED: 13.74,
    KWD: 164.2,
    EUR: 54.6,
    GBP: 64.1,
    fuel80: 20.75,
    fuel92: 22.25,
    fuel95: 24.0,
    diesel: 19.5,
    certYield: 27.0,
    vatEgypt: 14.0,
    ...liveOracleVariables,
  };

  for (const [k, v] of Object.entries(userInputs)) {
    const num = Number(v);
    if (Number.isFinite(num)) {
      combinedVars[k] = num;
    }
  }

  const usedVariables: Record<string, number> = {};

  // Replace variable identifiers while preserving Math.* functions
  const resolvedExpression = rawFormula.replace(
    /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g,
    (match) => {
      if (
        match === 'Math' ||
        match === 'round' ||
        match === 'floor' ||
        match === 'ceil' ||
        match === 'abs' ||
        match === 'min' ||
        match === 'max' ||
        match === 'pow' ||
        match === 'sqrt'
      ) {
        return match;
      }
      if (Object.prototype.hasOwnProperty.call(combinedVars, match)) {
        const val = Number(combinedVars[match]) || 0;
        usedVariables[match] = val;
        return String(val);
      }
      return '0';
    }
  );

  // Security sanitizer: allow only digits, decimal points, arithmetic operators, parentheses, commas, whitespace, and Math.* calls
  const strippedMath = resolvedExpression.replace(
    /Math\.(round|floor|ceil|abs|min|max|pow|sqrt)/g,
    ''
  );
  if (!/^[0-9+\-*/%().,\s]*$/.test(strippedMath)) {
    return {
      ok: false,
      value: 0,
      formattedValue: '0.00',
      resolvedExpression,
      usedVariables,
      error: 'رموز غير مسموح بها في المعادلة الحسابية',
    };
  }

  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(`"use strict"; return (${resolvedExpression});`);
    const rawResult = Number(fn());
    if (!Number.isFinite(rawResult)) {
      return {
        ok: false,
        value: 0,
        formattedValue: '0.00',
        resolvedExpression,
        usedVariables,
        error: 'نتيجة غير معرفة (تأكد من عدم القسمة على صفر)',
      };
    }
    const rounded = Number(rawResult.toFixed(2));
    return {
      ok: true,
      value: rounded,
      formattedValue: rounded.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      resolvedExpression,
      usedVariables,
    };
  } catch (_err) {
    return {
      ok: false,
      value: 0,
      formattedValue: '0.00',
      resolvedExpression,
      usedVariables,
      error: 'خطأ في صياغة المعادلة الحسابية (تحقق من الأقواس والعلامات)',
    };
  }
}

/* ============================================================================
 * 5. ADOPS CTR & A/B SPLIT TESTING ANALYTICS (`computeAdPlacementCtrStats`)
 * ========================================================================== */
export interface AdVariantMetrics {
  impressions: number;
  clicks: number;
}

export interface AdPlacementCtrSummary {
  totalImpressions: number;
  totalClicks: number;
  overallCtrPercent: number;
  variantACtrPercent: number;
  variantBCtrPercent: number;
  winningVariant: 'A' | 'B' | 'TIE';
  upliftPercent: number;
}

export function computeAdPlacementCtrStats(
  variantA: AdVariantMetrics = { impressions: 0, clicks: 0 },
  variantB: AdVariantMetrics = { impressions: 0, clicks: 0 }
): AdPlacementCtrSummary {
  const impA = Math.max(0, Number(variantA?.impressions) || 0);
  const clkA = Math.max(0, Number(variantA?.clicks) || 0);
  const impB = Math.max(0, Number(variantB?.impressions) || 0);
  const clkB = Math.max(0, Number(variantB?.clicks) || 0);

  const totalImpressions = impA + impB;
  const totalClicks = clkA + clkB;

  const overallCtrPercent =
    totalImpressions > 0 ? Number(((totalClicks / totalImpressions) * 100).toFixed(2)) : 0;
  const variantACtrPercent =
    impA > 0 ? Number(((clkA / impA) * 100).toFixed(2)) : 0;
  const variantBCtrPercent =
    impB > 0 ? Number(((clkB / impB) * 100).toFixed(2)) : 0;

  let winningVariant: 'A' | 'B' | 'TIE' = 'TIE';
  if (variantACtrPercent > variantBCtrPercent) winningVariant = 'A';
  else if (variantBCtrPercent > variantACtrPercent) winningVariant = 'B';

  const minNonZero = Math.min(variantACtrPercent, variantBCtrPercent);
  const maxCtr = Math.max(variantACtrPercent, variantBCtrPercent);
  const upliftPercent =
    minNonZero > 0
      ? Number((((maxCtr - minNonZero) / minNonZero) * 100).toFixed(1))
      : maxCtr > 0
      ? 100
      : 0;

  return {
    totalImpressions,
    totalClicks,
    overallCtrPercent,
    variantACtrPercent,
    variantBCtrPercent,
    winningVariant,
    upliftPercent,
  };
}

/* ============================================================================
 * 6. BULK PROGRAMMATIC SEO TEMPLATE RENDERER (`renderBulkSeoTemplate`)
 * ========================================================================== */
export interface BulkSeoTemplateContext {
  tool_name: string;
  current_date?: string;
  egypt_rate?: string;
  year?: string | number;
  category_name?: string;
}

export function renderBulkSeoTemplate(
  templateString: string,
  context: BulkSeoTemplateContext
): string {
  const tpl = String(templateString || '').trim();
  if (!tpl) return context.tool_name || 'Dix Tools';

  const replacements: Record<string, string> = {
    '{tool_name}': context.tool_name || 'حاسبة Dix Tools الذكية',
    '{current_date}': context.current_date || 'نوفمبر 2026',
    '{egypt_rate}': context.egypt_rate || '3,811 ج.م (عيار 21)',
    '{year}': String(context.year || 2026),
    '{category_name}': context.category_name || 'الأدوات المالية والذهبية',
  };

  let output = tpl;
  for (const [token, value] of Object.entries(replacements)) {
    output = output.split(token).join(value);
  }
  return output;
}

/* ============================================================================
 * 7. 301 / 302 REDIRECT ENGINE (`resolveRedirectRule`)
 * ========================================================================== */
export interface SeoRedirectRule {
  id: string;
  fromPath: string;
  toPath: string;
  statusCode: number;
  hits?: number;
  active?: boolean;
}

export function resolveRedirectRule(
  currentSlugOrPath: string,
  rules: SeoRedirectRule[] = []
): SeoRedirectRule | null {
  const normalize = (p: string) =>
    String(p || '')
      .trim()
      .replace(/^#\/?/, '')
      .replace(/^\/+|\/+$/g, '')
      .toLowerCase();

  const target = normalize(currentSlugOrPath);
  if (!target) return null;

  for (const rule of rules) {
    if (rule.active === false) continue;
    const fromNorm = normalize(rule.fromPath);
    if (!fromNorm) continue;
    if (fromNorm === target || target.endsWith(`/${fromNorm}`)) {
      return rule;
    }
  }
  return null;
}

/* ============================================================================
 * 8. EGYPT 27 GOVERNORATES HUB (`egypt-governorates-hub`)
 *    Distance, Travel Time, Official Fuel Trip Cost, Commercial Shipping,
 *    Landline Area Code & Main Postal Code between any two Egyptian governorates
 * ========================================================================== */
export interface EgyptInterGovernorateInput {
  fromGovId: string;
  toGovId: string;
  isRoundTrip?: boolean;
  fuelPricePerLiter?: number;
  consumptionPer100Km?: number;
  packageWeightKg?: number;
}

export interface EgyptInterGovernorateResult {
  fromGov: EgyptGovernorateShipping;
  toGov: EgyptGovernorateShipping;
  oneWayDistanceKm: number;
  effectiveDistanceKm: number;
  estimatedHours: number;
  estimatedMinutes: number;
  travelTimeFormatted: string;
  fuelLitersNeeded: number;
  fuelTripCostEgp: number;
  commercialShippingCostEgp: number;
  deliveryDaysEstimate: string;
}

export function calculateEgyptInterGovernorateTrip(
  input: EgyptInterGovernorateInput
): EgyptInterGovernorateResult {
  const fromGov =
    EGYPT_27_GOVERNORATES.find(
      (g) => g.id === input.fromGovId || g.name === input.fromGovId
    ) || EGYPT_27_GOVERNORATES[0];
  const toGov =
    EGYPT_27_GOVERNORATES.find(
      (g) => g.id === input.toGovId || g.name === input.toGovId
    ) || EGYPT_27_GOVERNORATES[2];

  let oneWayDistanceKm = 15;
  if (fromGov.id !== toGov.id) {
    if (fromGov.id === 'CAI') {
      oneWayDistanceKm = toGov.distanceFromCairoKm;
    } else if (toGov.id === 'CAI') {
      oneWayDistanceKm = fromGov.distanceFromCairoKm;
    } else {
      // Haversine highway road approximation (× 1.26 road winding factor)
      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const R = 6371;
      const dLat = toRad(toGov.lat - fromGov.lat);
      const dLng = toRad(toGov.lng - fromGov.lng);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(fromGov.lat)) *
          Math.cos(toRad(toGov.lat)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const straightKm = R * c;
      oneWayDistanceKm = Math.max(25, Math.round(straightKm * 1.26));
    }
  }

  const isRoundTrip = Boolean(input.isRoundTrip);
  const effectiveDistanceKm = isRoundTrip ? oneWayDistanceKm * 2 : oneWayDistanceKm;

  // Average highway travel speed in Egypt ~ 85 km/h + 15 min city exit buffer
  const totalMinutes = Math.max(20, Math.round((oneWayDistanceKm / 85) * 60 + 15));
  const estimatedHours = Math.floor(totalMinutes / 60);
  const estimatedMinutes = totalMinutes % 60;
  const travelTimeFormatted =
    estimatedHours > 0
      ? `${estimatedHours} ساعة و ${estimatedMinutes} دقيقة`
      : `${estimatedMinutes} دقيقة`;

  const consumption = Math.max(2, Number(input.consumptionPer100Km) || 8.5);
  const fuelPrice = Math.max(1, Number(input.fuelPricePerLiter) || 22.25);
  const fuelLitersNeeded = Number(((effectiveDistanceKm * consumption) / 100).toFixed(1));
  const fuelTripCostEgp = Math.round(fuelLitersNeeded * fuelPrice);

  const weightKg = Math.max(0.5, Number(input.packageWeightKg) || 1);
  const extraKg = Math.max(0, Math.ceil(weightKg - 3));
  const baseZoneFee = Math.max(fromGov.baseShippingEgp, toGov.baseShippingEgp);
  const interZoneSurcharge =
    fromGov.region === toGov.region ? 0 : Math.min(35, Math.round(oneWayDistanceKm * 0.04));
  const commercialShippingCostEgp = baseZoneFee + interZoneSurcharge + extraKg * 15;

  return {
    fromGov,
    toGov,
    oneWayDistanceKm,
    effectiveDistanceKm,
    estimatedHours,
    estimatedMinutes,
    travelTimeFormatted,
    fuelLitersNeeded,
    fuelTripCostEgp,
    commercialShippingCostEgp,
    deliveryDaysEstimate: toGov.deliveryDays,
  };
}

/* ============================================================================
 * 9. INTERACTIVE MARKET SENTIMENT POLL (`MarketSentimentPoll.jsx`)
 * ========================================================================== */
export interface MarketSentimentSummary {
  upVotes: number;
  downVotes: number;
  totalVotes: number;
  upPercent: number;
  downPercent: number;
  dominantTrend: 'bullish' | 'bearish' | 'neutral';
  dominantLabel: string;
}

export function computeMarketSentimentPercentages(
  upVotesInput: number,
  downVotesInput: number
): MarketSentimentSummary {
  const upVotes = Math.max(0, Math.floor(Number(upVotesInput) || 0));
  const downVotes = Math.max(0, Math.floor(Number(downVotesInput) || 0));
  const totalVotes = upVotes + downVotes;

  if (totalVotes === 0) {
    return {
      upVotes: 0,
      downVotes: 0,
      totalVotes: 0,
      upPercent: 50,
      downPercent: 50,
      dominantTrend: 'neutral',
      dominantLabel: 'تعادل في توقعات المتداولين اليوم',
    };
  }

  const upPercent = Math.round((upVotes / totalVotes) * 100);
  const downPercent = Math.max(0, 100 - upPercent);

  let dominantTrend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  let dominantLabel = 'تعادل في توقعات السوق اليوم';
  if (upPercent >= 55) {
    dominantTrend = 'bullish';
    dominantLabel = `اتجاه صاعد متوقع (${upPercent}% يرجحون الارتفاع 📈)`;
  } else if (downPercent >= 55) {
    dominantTrend = 'bearish';
    dominantLabel = `اتجاه هابط متوقع (${downPercent}% يرجحون الانخفاض 📉)`;
  }

  return {
    upVotes,
    downVotes,
    totalVotes,
    upPercent,
    downPercent,
    dominantTrend,
    dominantLabel,
  };
}

/* ============================================================================
 * 10. UTF-8 BOM CSV / EXCEL FORMATTER (`lib/export-to-csv.js`)
 * ========================================================================== */
export function buildCsvStringWithBom(
  headers: string[] = [],
  rows: Array<Array<string | number> | Record<string, string | number>> = []
): string {
  const escapeCsvCell = (val: unknown): string => {
    const str = String(val ?? '').replace(/\r?\n/g, ' ').trim();
    if (str.includes(',') || str.includes('"') || str.includes(';')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines: string[] = [];
  if (headers.length > 0) {
    lines.push(headers.map(escapeCsvCell).join(','));
  }

  for (const row of rows) {
    if (Array.isArray(row)) {
      lines.push(row.map(escapeCsvCell).join(','));
    } else if (row && typeof row === 'object') {
      const vals = Object.values(row);
      lines.push(vals.map(escapeCsvCell).join(','));
    }
  }

  return `\uFEFF${lines.join('\r\n')}`;
}

/* ============================================================================
 * 11. EGYPT APARTMENT & BUILDING FINISHING COST & ENGINEERING BOQ CALCULATOR
 *     (`egypt-finishing-cost-calculator`)
 * ========================================================================== */
export type FinishingPropertyType = 'apartment' | 'villa' | 'shop' | 'office' | 'building';
export type FinishingConditionType = 'core-shell' | 'semi-finished' | 'renovation';
export type FinishingGradeType = 'economic' | 'super-lux' | 'ultra-lux';

export interface EgyptConstructionLiveRates {
  steelTonEgp?: number;
  cementTonEgp?: number;
  cementBag50KgEgp?: number;
  sandCubicMeterEgp?: number;
  gravelCubicMeterEgp?: number;
  elSewedyRollEgp?: number;
  costPerSqmEconomic?: number;
  costPerSqmSuperLux?: number;
  costPerSqmUltraLux?: number;
}

export interface EgyptFinishingCustomOptions {
  includeGypsumBoard?: boolean;
  includeAlumetal?: boolean;
  includeArmoredDoor?: boolean;
  includeAcPreInstall?: boolean;
  engineeringSupervisionPercent?: number;
}

export interface EgyptFinishingBoqInput {
  grossAreaSqm: number;
  netAreaRatioPercent?: number;
  propertyType?: FinishingPropertyType;
  roomsCount?: number;
  bathroomsCount?: number;
  receptionPiecesCount?: number;
  currentCondition?: FinishingConditionType;
  finishingGrade?: FinishingGradeType;
  customOptions?: EgyptFinishingCustomOptions;
  liveConstructionRates?: EgyptConstructionLiveRates;
}

export interface FinishingStageRow {
  stageNumber: number;
  id: string;
  title: string;
  specification: string;
  materialsCostEgp: number;
  laborCostEgp: number;
  totalCostEgp: number;
  sharePercent: number;
  enabled: boolean;
}

export interface EgyptRawMaterialsBoq {
  cementBags50Kg: number;
  sandCubicMeters: number;
  estimatedCementAndSandCostEgp: number;
  wire15mmRolls: number;
  wire2mmAnd3mmRolls: number;
  wire4mmAnd6mmRolls: number;
  totalWireRolls: number;
  estimatedWiresCostEgp: number;
  flooringSqmWithWaste: number;
  wallsBathKitchenSqm: number;
  totalCeramicAndPorcelainSqm: number;
  sealerPails: number;
  puttyPails: number;
  emulsionPaintPails: number;
}

export interface EgyptFinishingBoqResult {
  grossAreaSqm: number;
  netAreaSqm: number;
  netAreaRatioPercent: number;
  propertyType: FinishingPropertyType;
  propertyTypeLabel: string;
  currentCondition: FinishingConditionType;
  conditionLabel: string;
  finishingGrade: FinishingGradeType;
  gradeLabel: string;
  roomsCount: number;
  bathroomsCount: number;
  receptionPiecesCount: number;
  totalEstimatedCostEgp: number;
  minEstimatedCostEgp: number;
  maxEstimatedCostEgp: number;
  averageCostPerGrossSqmEgp: number;
  averageCostPerNetSqmEgp: number;
  totalMaterialsCostEgp: number;
  totalLaborCostEgp: number;
  supervisionFeeEgp: number;
  materialsSharePercent: number;
  laborSharePercent: number;
  stages: FinishingStageRow[];
  rawMaterialsBoq: EgyptRawMaterialsBoq;
}

export function calculateEgyptFinishingBoq(
  input: EgyptFinishingBoqInput
): EgyptFinishingBoqResult {
  const grossAreaSqm = Math.max(30, Math.min(5000, Number(input.grossAreaSqm) || 140));
  const netAreaRatioPercent = Math.max(
    75,
    Math.min(92, Number(input.netAreaRatioPercent) || 82)
  );
  const netAreaSqm = Math.round(grossAreaSqm * (netAreaRatioPercent / 100));

  const propertyType: FinishingPropertyType = input.propertyType || 'apartment';
  const currentCondition: FinishingConditionType = input.currentCondition || 'core-shell';
  const finishingGrade: FinishingGradeType = input.finishingGrade || 'super-lux';

  const roomsCount = Math.max(1, Math.min(30, Math.floor(Number(input.roomsCount) || 3)));
  const bathroomsCount = Math.max(
    1,
    Math.min(12, Math.floor(Number(input.bathroomsCount) || 2))
  );
  const receptionPiecesCount = Math.max(
    1,
    Math.min(10, Math.floor(Number(input.receptionPiecesCount) || 2))
  );

  const opts = {
    includeGypsumBoard: input.customOptions?.includeGypsumBoard !== false,
    includeAlumetal: input.customOptions?.includeAlumetal !== false,
    includeArmoredDoor: input.customOptions?.includeArmoredDoor !== false,
    includeAcPreInstall: input.customOptions?.includeAcPreInstall !== false,
    engineeringSupervisionPercent: Math.max(
      0,
      Math.min(25, Number(input.customOptions?.engineeringSupervisionPercent ?? 10))
    ),
  };

  const rates = {
    steelTonEgp: Number(input.liveConstructionRates?.steelTonEgp) || 38500,
    cementTonEgp: Number(input.liveConstructionRates?.cementTonEgp) || 2950,
    cementBag50KgEgp:
      Number(input.liveConstructionRates?.cementBag50KgEgp) ||
      Math.round((Number(input.liveConstructionRates?.cementTonEgp) || 2950) / 20),
    sandCubicMeterEgp: Number(input.liveConstructionRates?.sandCubicMeterEgp) || 240,
    gravelCubicMeterEgp: Number(input.liveConstructionRates?.gravelCubicMeterEgp) || 330,
    elSewedyRollEgp: Number(input.liveConstructionRates?.elSewedyRollEgp) || 1950,
    costPerSqmEconomic: Number(input.liveConstructionRates?.costPerSqmEconomic) || 3850,
    costPerSqmSuperLux: Number(input.liveConstructionRates?.costPerSqmSuperLux) || 5950,
    costPerSqmUltraLux: Number(input.liveConstructionRates?.costPerSqmUltraLux) || 9400,
  };

  const propertyTypeMap: Record<
    FinishingPropertyType,
    { label: string; factor: number }
  > = {
    apartment: { label: 'شقة سكنية', factor: 1.0 },
    villa: { label: 'فيلا / دوبلكس', factor: 1.16 },
    shop: { label: 'محل تجاري / معرض', factor: 1.12 },
    office: { label: 'مقر / مكتب إداري', factor: 1.05 },
    building: { label: 'عمارة كاملة', factor: 0.96 },
  };

  const conditionMap: Record<FinishingConditionType, string> = {
    'core-shell': 'على الطوب الأحمر (Core & Shell — تأسيس كامل + محارة)',
    'semi-finished': 'نصف تشطيب (على المحارة والحلوق — يخصم المحارة تلقائياً)',
    renovation: 'تجديد شقة قديمة (Renovation — يشمل التكسير وإزالة القديم والردش)',
  };

  const gradeMap: Record<
    FinishingGradeType,
    { label: string; baseSqmRate: number; gradeMult: number }
  > = {
    economic: {
      label: 'تشطيب اقتصادي / استثماري (Economic)',
      baseSqmRate: rates.costPerSqmEconomic,
      gradeMult: 0.68,
    },
    'super-lux': {
      label: 'تشطيب سوبر لوكس (Super Lux — الأكثر طلباً)',
      baseSqmRate: rates.costPerSqmSuperLux,
      gradeMult: 1.0,
    },
    'ultra-lux': {
      label: 'تشطيب ألترا لوكس / فندقي (Ultra Lux VIP)',
      baseSqmRate: rates.costPerSqmUltraLux,
      gradeMult: 1.58,
    },
  };

  const propMeta = propertyTypeMap[propertyType] || propertyTypeMap.apartment;
  const gradeMeta = gradeMap[finishingGrade] || gradeMap['super-lux'];

  // Scale factor calibrated to the admin-controlled per-sqm rate for Super Lux (5,950 EGP/m²)
  const rateScale = (gradeMeta.baseSqmRate / 5950) * propMeta.factor;

  // Raw Materials Engineering Estimator (BOQ)
  const needsPlastering = currentCondition !== 'semi-finished';
  const cementBagsPlaster = needsPlastering ? Math.ceil(netAreaSqm * 0.45) : 0;
  const cementBagsFlooring = Math.ceil(netAreaSqm * 0.35) + bathroomsCount * 6;
  const cementBags50Kg = cementBagsPlaster + cementBagsFlooring;

  const sandPlasterM3 = needsPlastering ? Math.ceil(netAreaSqm * 0.085) : 0;
  const sandFlooringM3 = Math.ceil(netAreaSqm * 0.075) + bathroomsCount * 1.5;
  const sandCubicMeters = Math.ceil(sandPlasterM3 + sandFlooringM3);
  const estimatedCementAndSandCostEgp = Math.round(
    cementBags50Kg * rates.cementBag50KgEgp + sandCubicMeters * rates.sandCubicMeterEgp
  );

  // Electrical Wires (El-Sewedy 100m rolls)
  const wire15mmRolls = Math.max(2, Math.ceil((roomsCount + receptionPiecesCount) * 0.85));
  const wire2mmAnd3mmRolls = Math.max(
    3,
    Math.ceil((roomsCount + receptionPiecesCount + bathroomsCount) * 1.15)
  );
  const wire4mmAnd6mmRolls = Math.max(
    2,
    Math.ceil((roomsCount + receptionPiecesCount) * 0.65)
  );
  const totalWireRolls = wire15mmRolls + wire2mmAnd3mmRolls + wire4mmAnd6mmRolls;
  const estimatedWiresCostEgp = Math.round(totalWireRolls * rates.elSewedyRollEgp);

  // Ceramic & Porcelain (Flooring + 10% waste + Skirting + Bath/Kitchen walls)
  const flooringSqmWithWaste = Math.ceil(netAreaSqm * 1.1);
  const wallsBathKitchenSqm = Math.ceil(bathroomsCount * 34 + 28);
  const totalCeramicAndPorcelainSqm = flooringSqmWithWaste + wallsBathKitchenSqm;

  // Painting materials (Sealer, Putty, Emulsion pails)
  const paintableAreaSqm = Math.round(netAreaSqm * 3.1);
  const sealerPails = Math.max(2, Math.ceil(paintableAreaSqm / 95));
  const puttyPails = Math.max(4, Math.ceil(paintableAreaSqm / 38));
  const emulsionPaintPails = Math.max(3, Math.ceil(paintableAreaSqm / 65));

  // Stage-by-Stage Cost Calculation (10 Engineering Stages)
  // Stage 1: Architectural Modifications, Demolition & Debris Hauling
  const stage1Base =
    currentCondition === 'renovation'
      ? grossAreaSqm * 310 + bathroomsCount * 4500
      : grossAreaSqm * 95;
  const stage1Mat = Math.round(stage1Base * 0.3 * rateScale);
  const stage1Lab = Math.round(stage1Base * 0.7 * rateScale);

  // Stage 2: Electrical Foundation & Finishing (El-Sewedy wires, panels, switches, spots)
  const stage2Mat = Math.round(
    (estimatedWiresCostEgp + (roomsCount + receptionPiecesCount) * 4200) * rateScale
  );
  const stage2Lab = Math.round(
    (grossAreaSqm * 185 + (roomsCount + receptionPiecesCount) * 1100) * rateScale
  );

  // Stage 3: Plumbing Foundation, Sika 107 Waterproofing & Sanitary Ware
  const bathFactor = bathroomsCount + 0.85; // bathrooms + kitchen
  const stage3Mat = Math.round(bathFactor * 24500 * rateScale);
  const stage3Lab = Math.round(bathFactor * 8200 * rateScale);

  // Stage 4: Plastering, Spatter & Screeds (المحارة والطرطشة والبؤج والأوتار)
  // Automatically deducted if `currentCondition === 'semi-finished'`
  const stage4Enabled = currentCondition !== 'semi-finished';
  const stage4Mat = stage4Enabled
    ? Math.round(
        (cementBagsPlaster * rates.cementBag50KgEgp +
          sandPlasterM3 * rates.sandCubicMeterEgp +
          grossAreaSqm * 55) *
          rateScale
      )
    : 0;
  const stage4Lab = stage4Enabled ? Math.round(grossAreaSqm * 290 * rateScale) : 0;

  // Stage 5: Suspended Ceilings, Gypsum Board & Cornices
  const stage5Enabled = opts.includeGypsumBoard;
  const stage5Mat = stage5Enabled ? Math.round(netAreaSqm * 245 * rateScale) : 0;
  const stage5Lab = stage5Enabled ? Math.round(netAreaSqm * 145 * rateScale) : 0;

  // Stage 6: Flooring & Walls (Ceramic / Laser-cut / Porcelain / Marble + Adhesive + Labor)
  const sqmTilePrice =
    finishingGrade === 'ultra-lux'
      ? 920
      : finishingGrade === 'super-lux'
      ? 490
      : 310;
  const stage6Mat = Math.round(
    (totalCeramicAndPorcelainSqm * sqmTilePrice +
      cementBagsFlooring * rates.cementBag50KgEgp +
      sandFlooringM3 * rates.sandCubicMeterEgp) *
      propMeta.factor
  );
  const stage6Lab = Math.round(totalCeramicAndPorcelainSqm * 195 * rateScale);

  // Stage 7: Doors & Carpentry (Armored Main Door + Interior Room & Bath Doors)
  const armoredDoorCost = opts.includeArmoredDoor
    ? finishingGrade === 'ultra-lux'
      ? 26500
      : finishingGrade === 'super-lux'
      ? 16500
      : 10500
    : 0;
  const interiorDoorsCount = roomsCount + bathroomsCount;
  const interiorDoorUnitCost =
    finishingGrade === 'ultra-lux'
      ? 11500
      : finishingGrade === 'super-lux'
      ? 7200
      : 4500;
  const stage7Mat = Math.round(
    armoredDoorCost + interiorDoorsCount * interiorDoorUnitCost * 0.78
  );
  const stage7Lab = Math.round(
    (opts.includeArmoredDoor ? 1800 : 0) + interiorDoorsCount * interiorDoorUnitCost * 0.22
  );

  // Stage 8: Alumetal / UPVC Windows & Balcony Doors
  const stage8Enabled = opts.includeAlumetal;
  const openingsCount = roomsCount + bathroomsCount + receptionPiecesCount;
  const stage8Mat = stage8Enabled
    ? Math.round(openingsCount * 6800 * rateScale)
    : 0;
  const stage8Lab = stage8Enabled
    ? Math.round(openingsCount * 1500 * rateScale)
    : 0;

  // Stage 9: Painting & Decoration (Sealer, 3 Putty Coats, Jotun/GLC Emulsion)
  const stage9Mat = Math.round(
    (sealerPails * 1150 + puttyPails * 580 + emulsionPaintPails * 2450) * rateScale
  );
  const stage9Lab = Math.round(paintableAreaSqm * 95 * rateScale);

  // Subtotal before Stage 10 (AC Pre-install, Contingencies & Engineering Supervision)
  const subtotalBeforeStage10 =
    stage1Mat +
    stage1Lab +
    stage2Mat +
    stage2Lab +
    stage3Mat +
    stage3Lab +
    stage4Mat +
    stage4Lab +
    stage5Mat +
    stage5Lab +
    stage6Mat +
    stage6Lab +
    stage7Mat +
    stage7Lab +
    stage8Mat +
    stage8Lab +
    stage9Mat +
    stage9Lab;

  const acPreInstallMat = opts.includeAcPreInstall
    ? Math.round((roomsCount + receptionPiecesCount) * 4200 * rateScale)
    : 0;
  const acPreInstallLab = opts.includeAcPreInstall
    ? Math.round((roomsCount + receptionPiecesCount) * 1600 * rateScale)
    : 0;
  const supervisionFeeEgp = Math.round(
    (subtotalBeforeStage10 + acPreInstallMat + acPreInstallLab) *
      (opts.engineeringSupervisionPercent / 100)
  );

  const stage10Mat = acPreInstallMat;
  const stage10Lab = acPreInstallLab + supervisionFeeEgp;

  const rawStages = [
    {
      stageNumber: 1,
      id: 'demolition-debris',
      title: 'بند 1: التعديلات المعمارية، التكسير، وتشوين ونقل المخلفات',
      specification:
        currentCondition === 'renovation'
          ? 'تكسير وإزالة السيراميك والمحارة القديمة + تعديل القواطيع + نقل المخلفات والردش'
          : 'فتح الشنايش وتعديل القواطيع المعمارية وتشوين المون ونقل المخلفات',
      materialsCostEgp: stage1Mat,
      laborCostEgp: stage1Lab,
      enabled: true,
    },
    {
      stageNumber: 2,
      id: 'electrical-works',
      title: 'بند 2: تأسيس وتشطيب الكهرباء (سلك السويدي، لوحة قواطع، مفاتيح، سبوتات)',
      specification:
        finishingGrade === 'ultra-lux'
          ? 'تأسيس سمارت هوم + أسلاك السويدي أصلية + قواطع شنايدر + مفاتيح وبرايز فندقية + بروفايل ليد'
          : finishingGrade === 'super-lux'
          ? 'خراطيم وعلب مصطفى محمود + أسلاك السويدي المعتمدة + لوحة قواطع + مفاتيح فينوس/سانشي + سبوتات'
          : 'تأسيس خراطيم وأسلاك معتمدة + لوحة قواطع أساسية + مفاتيح وبرايز قياسية',
      materialsCostEgp: stage2Mat,
      laborCostEgp: stage2Lab,
      enabled: true,
    },
    {
      stageNumber: 3,
      id: 'plumbing-waterproofing',
      title: 'بند 3: تأسيس وتشطيب السباكة والعزل الكيميائي والخلاطات والصحي',
      specification:
        finishingGrade === 'ultra-lux'
          ? 'مواسير بانينجر ألماني + عزل سيكا 107 مزدوج + قواعد دفن وخلاطات Grohe / Ideal Standard'
          : finishingGrade === 'super-lux'
          ? 'مواسير الشريف / BR + عزل كيميائي سيكا 107 للحمامات + أطقم صحي وخلاطات فرز أول بضمان'
          : 'مواسير تغذية وصرف معتمدة + عزل أرضيات الحمامات + أطقم صحي وخلاطات اقتصادية',
      materialsCostEgp: stage3Mat,
      laborCostEgp: stage3Lab,
      enabled: true,
    },
    {
      stageNumber: 4,
      id: 'plastering-works',
      title: 'بند 4: أعمال المحارة والطرطشة والبؤج والأوتار (أسمنت، رمل، ومصنعية)',
      specification: stage4Enabled
        ? 'طرطشة مسمارية أسمنتية + بؤج وأوتار ميزان ليزر + سلك شبك فايبر للفواصل والزوايا'
        : 'مخصوم تلقائياً لأن حالة العقار المختارة «نصف تشطيب على المحارة والحلوق»',
      materialsCostEgp: stage4Mat,
      laborCostEgp: stage4Lab,
      enabled: stage4Enabled,
    },
    {
      stageNumber: 5,
      id: 'gypsum-ceilings',
      title: 'بند 5: أعمال الأسقف المعلقة والجبس بورد والكرانيش وبيوت النور',
      specification: stage5Enabled
        ? 'ألواح جبس بورد كناوف (أخضر مقاوم للرطوبة بالحمامات والمطبخ وأبيض للغرف) + صاج محمل 0.4'
        : 'تم استبعاد بند الجبس بورد بناءً على اختيارك في الإعدادات المخصصة',
      materialsCostEgp: stage5Mat,
      laborCostEgp: stage5Lab,
      enabled: stage5Enabled,
    },
    {
      stageNumber: 6,
      id: 'flooring-ceramic-porcelain',
      title: 'بند 6: أعمال الأرضيات والحوائط (سيراميك / بورسلين / رخام + مونة ولصق)',
      specification:
        finishingGrade === 'ultra-lux'
          ? 'بورسلين مستورد أو رخام بالريسبشن + غرف HDF ألماني + حمامات كليوباترا/الجوهرة بمادة لصق'
          : finishingGrade === 'super-lux'
          ? 'سيراميك قطع ليزر فرز أول (كليوباترا / الجوهرة / أرت) للريسبشن والغرف والحمامات شامل الوزرة'
          : 'سيراميك فرز أول محلي عملي للأرضيات والحوائط شامل مونة التركيب والوزرة',
      materialsCostEgp: stage6Mat,
      laborCostEgp: stage6Lab,
      enabled: true,
    },
    {
      stageNumber: 7,
      id: 'carpentry-doors',
      title: 'بند 7: أعمال الأبواب والنجارة (باب الشقة المصفح + أبواب الغرف والحمامات)',
      specification: `${
        opts.includeArmoredDoor ? 'باب شقة رئيسي مصفح + ' : ''
      }${interiorDoorsCount} باب داخلي للغرف والحمامات شاملة الحلوق والدهان والأكر والكوالين`,
      materialsCostEgp: stage7Mat,
      laborCostEgp: stage7Lab,
      enabled: true,
    },
    {
      stageNumber: 8,
      id: 'alumetal-windows',
      title: 'بند 8: أعمال الألوميتال والزجاج والشبابيك (قطاعات PS / جامبو / UPVC)',
      specification: stage8Enabled
        ? finishingGrade === 'ultra-lux'
          ? 'قطاعات UPVC أو جامبو دبل جلاس عازل للصوت والحرارة والأتربة مع سلك بليسيه'
          : 'قطاعات ألوميتال PS كبير / صغير بزجاج عاكس وسلك مانع للحشرات وإكسسوارات أصلية'
        : 'تم استبعاد بند الألوميتال بناءً على اختيارك في الإعدادات المخصصة',
      materialsCostEgp: stage8Mat,
      laborCostEgp: stage8Lab,
      enabled: stage8Enabled,
    },
    {
      stageNumber: 9,
      id: 'painting-decoration',
      title: 'بند 9: أعمال النقاشة والدهانات (سيلر، معجون 3 سكاكين، وجه نهائي جوتن/GLC)',
      specification:
        finishingGrade === 'ultra-lux'
          ? 'سيلر مائي جوتن + 4 سكاكين معجون وصنفرة باللمبة + دهانات جوتن فينوماستيك قابلة للغسيل + ديكورات'
          : finishingGrade === 'super-lux'
          ? 'سيلر مائي + 3 سكاكين معجون دايتون/GLC + بطانة + وجهين تشطيب نهائي جوتن / GLC'
          : 'سيلر مائي + سكاكين معجون + دهانات بلاستيك مط وربع لامع اقتصادية معتمدة',
      materialsCostEgp: stage9Mat,
      laborCostEgp: stage9Lab,
      enabled: true,
    },
    {
      stageNumber: 10,
      id: 'ac-supervision-misc',
      title: `بند 10: تأسيس التكييفات، النثريات، ونسبة الإشراف الهندسي (${opts.engineeringSupervisionPercent}%)`,
      specification: `${
        opts.includeAcPreInstall ? 'مواسير نحاس وصرف حواجز تكييفات + ' : ''
      }نثريات الموقع ومراجعة استلام المهندس الاستشاري (${opts.engineeringSupervisionPercent}%)`,
      materialsCostEgp: stage10Mat,
      laborCostEgp: stage10Lab,
      enabled: opts.includeAcPreInstall || opts.engineeringSupervisionPercent > 0,
    },
  ];

  const totalMaterialsCostEgp = rawStages.reduce(
    (sum, s) => sum + s.materialsCostEgp,
    0
  );
  const totalLaborCostEgp = rawStages.reduce((sum, s) => sum + s.laborCostEgp, 0);
  const totalEstimatedCostEgp = totalMaterialsCostEgp + totalLaborCostEgp;

  const stages: FinishingStageRow[] = rawStages.map((s) => {
    const totalCostEgp = s.materialsCostEgp + s.laborCostEgp;
    const sharePercent =
      totalEstimatedCostEgp > 0
        ? Number(((totalCostEgp / totalEstimatedCostEgp) * 100).toFixed(1))
        : 0;
    return {
      ...s,
      totalCostEgp,
      sharePercent,
    };
  });

  const minEstimatedCostEgp = Math.round(totalEstimatedCostEgp * 0.93);
  const maxEstimatedCostEgp = Math.round(totalEstimatedCostEgp * 1.08);
  const averageCostPerGrossSqmEgp = Math.round(totalEstimatedCostEgp / grossAreaSqm);
  const averageCostPerNetSqmEgp = Math.round(totalEstimatedCostEgp / Math.max(1, netAreaSqm));

  const materialsSharePercent =
    totalEstimatedCostEgp > 0
      ? Math.round((totalMaterialsCostEgp / totalEstimatedCostEgp) * 100)
      : 68;
  const laborSharePercent = Math.max(0, 100 - materialsSharePercent);

  return {
    grossAreaSqm,
    netAreaSqm,
    netAreaRatioPercent,
    propertyType,
    propertyTypeLabel: propMeta.label,
    currentCondition,
    conditionLabel: conditionMap[currentCondition],
    finishingGrade,
    gradeLabel: gradeMeta.label,
    roomsCount,
    bathroomsCount,
    receptionPiecesCount,
    totalEstimatedCostEgp,
    minEstimatedCostEgp,
    maxEstimatedCostEgp,
    averageCostPerGrossSqmEgp,
    averageCostPerNetSqmEgp,
    totalMaterialsCostEgp,
    totalLaborCostEgp,
    supervisionFeeEgp,
    materialsSharePercent,
    laborSharePercent,
    stages,
    rawMaterialsBoq: {
      cementBags50Kg,
      sandCubicMeters,
      estimatedCementAndSandCostEgp,
      wire15mmRolls,
      wire2mmAnd3mmRolls,
      wire4mmAnd6mmRolls,
      totalWireRolls,
      estimatedWiresCostEgp,
      flooringSqmWithWaste,
      wallsBathKitchenSqm,
      totalCeramicAndPorcelainSqm,
      sealerPails,
      puttyPails,
      emulsionPaintPails,
    },
  };
}
