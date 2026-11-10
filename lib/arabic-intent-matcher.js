/**
 * ============================================================================
 * ARABIC COLLOQUIAL & MSA SEMANTIC INTENT MATCHER (`lib/arabic-intent-matcher.js`)
 * Maps user requests directly to the 52 Unified Master Hub Tools (`isMasterTool: true`)
 * and builds URL query strings (`?from=USD&to=EGP&amount=100`) + `overrideParams`
 * for instant Smart Pre-fill!
 * ============================================================================
 */

import {
  getMasterTools,
  CURRENCY_LIST,
} from './tools-matrix-generator';
import {
  calculateCurrencyConversion,
  calculateGoldWorkmanship,
  calculateZakatAndGold,
  calculateFuelTrip,
  calculateLoanSchedule,
  calculateCertificateProfit,
  numberToArabicWordsTafqeet,
  calculateIslamicInheritance,
} from '../src/utils/calculations';

const EASTERN_DIGITS_MAP = {
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
};

export function normalizeArabicText(raw = '') {
  if (!raw) return '';
  let text = String(raw).toLowerCase().trim();
  text = text.replace(/[٠-٩]/g, (d) => EASTERN_DIGITS_MAP[d] || d);
  text = text.replace(/[\u064B-\u065F\u0670]/g, '');
  text = text.replace(/[أإآ]/g, 'ا');
  text = text.replace(/ة/g, 'ه');
  text = text.replace(/ى/g, 'ي');
  text = text
    .replace(/\bدهب\b/g, 'ذهب')
    .replace(/\bالدهب\b/g, 'الذهب')
    .replace(/\bعربيه\b/g, 'سياره')
    .replace(/\bالعربيه\b/g, 'السياره')
    .replace(/\bموتسيكل\b/g, 'موتوسيكل')
    .replace(/\bمكنه\b/g, 'موتوسيكل')
    .replace(/\bاستماره\b/g, 'نموذج')
    .replace(/\bفايده\b/g, 'فائده')
    .replace(/\bالمصنعيه\b/g, 'مصنعيه')
    .replace(/\bبكام\b/g, 'سعر')
    .replace(/\bعاوز\b/g, '')
    .replace(/\bعايز\b/g, '')
    .replace(/\bمحتاج\b/g, '')
    .replace(/\bاحسبلي\b/g, 'حساب')
    .replace(/\bاعمل\b/g, '');
  return text.replace(/\s+/g, ' ').trim();
}

const CURRENCY_ALIASES = [
  { code: 'USD', patterns: ['دولار', 'امريكي', 'usd', '$', 'اخضر'] },
  { code: 'EGP', patterns: ['جنيه', 'مصري', 'ج.م', 'egp', 'لمصري', 'لجنيه'] },
  { code: 'SAR', patterns: ['ريال سعودي', 'سعودي', 'ريال', 'ر.س', 'sar'] },
  { code: 'AED', patterns: ['درهم اماراتي', 'اماراتي', 'درهم', 'د.ا', 'aed'] },
  { code: 'KWD', patterns: ['دينار كويتي', 'كويتي', 'د.ك', 'kwd'] },
  { code: 'EUR', patterns: ['يورو', 'اوروبي', 'eur', '€'] },
  { code: 'GBP', patterns: ['استرليني', 'جنيه استرليني', 'gbp', '£'] },
  { code: 'QAR', patterns: ['قطري', 'ريال قطري', 'qar'] },
  { code: 'JOD', patterns: ['اردني', 'دينار اردني', 'jod'] },
  { code: 'BHD', patterns: ['بحريني', 'دينار بحريني', 'bhd'] },
  { code: 'OMR', patterns: ['عماني', 'ريال عماني', 'omr'] },
  { code: 'TRY', patterns: ['ليره تركيه', 'تركي', 'try'] },
];

export function extractIntentAndEntities(rawQuery = '') {
  const norm = normalizeArabicText(rawQuery);
  const allNumbers = (norm.match(/\d+(\.\d+)?/g) || []).map(Number);

  let detectedKarat = 21;
  const karatMatch = norm.match(/عيار\s*(24|22|21|18|14|12)/);
  if (karatMatch) {
    detectedKarat = Number(karatMatch[1]);
  }

  const nonKaratNumbers = allNumbers.filter((n) => {
    if (karatMatch && n === detectedKarat && allNumbers.length > 1) return false;
    if ([95, 92, 80].includes(n) && norm.includes('بنزين') && allNumbers.length > 1) return false;
    return true;
  });

  const primaryNumber = nonKaratNumbers.length > 0 ? nonKaratNumbers[0] : allNumbers[0] || null;

  let scaledAmount = primaryNumber;
  if (scaledAmount !== null) {
    if (norm.includes('مليون') && scaledAmount < 1000) {
      scaledAmount = scaledAmount * 1000000;
    } else if ((norm.includes('الف') || norm.includes('الاف')) && scaledAmount < 1000) {
      scaledAmount = scaledAmount * 1000;
    }
  }

  const foundCurrencies = [];
  for (const cAlias of CURRENCY_ALIASES) {
    for (const pat of cAlias.patterns) {
      const idx = norm.indexOf(pat);
      if (idx !== -1) {
        foundCurrencies.push({ code: cAlias.code, index: idx });
        break;
      }
    }
  }
  foundCurrencies.sort((a, b) => a.index - b.index);

  let intentType = 'general';

  if (
    norm.includes('تفقيط') ||
    norm.includes('حروف') ||
    norm.includes('فقط وقدره') ||
    norm.includes('شيك')
  ) {
    intentType = 'tafqeet';
  } else if (
    norm.includes('ميراث') ||
    norm.includes('مواريث') ||
    norm.includes('تركه') ||
    norm.includes('ورثه') ||
    norm.includes('شرعي')
  ) {
    intentType = 'inheritance';
  } else if (
    norm.includes('زكاه') ||
    norm.includes('نصاب') ||
    norm.includes('ربع العشر')
  ) {
    intentType = 'zakat';
  } else if (
    norm.includes('ذهب') ||
    norm.includes('مصنعيه') ||
    norm.includes('سبيكه') ||
    norm.includes('سبائك') ||
    norm.includes('جنيه ذهب') ||
    norm.includes('صاغه') ||
    norm.includes('كاش باك')
  ) {
    intentType = 'gold';
  } else if (
    foundCurrencies.length >= 2 ||
    norm.includes('دولار') ||
    norm.includes('ريال') ||
    norm.includes('درهم') ||
    norm.includes('دينار') ||
    norm.includes('يورو') ||
    norm.includes('عمله') ||
    norm.includes('صرف') ||
    norm.includes('احول') ||
    norm.includes('تحويل')
  ) {
    intentType = 'currency';
  } else if (
    norm.includes('قرض') ||
    norm.includes('قسط') ||
    norm.includes('شهاده') ||
    norm.includes('وديعه') ||
    norm.includes('فائده') ||
    norm.includes('تمويل') ||
    norm.includes('بنك')
  ) {
    intentType =
      norm.includes('شهاده') || norm.includes('وديعه') || norm.includes('عائد')
        ? 'certificate'
        : 'loan';
  } else if (
    norm.includes('بنزين') ||
    norm.includes('مشوار') ||
    norm.includes('سفر') ||
    norm.includes('وقود') ||
    norm.includes('سولار')
  ) {
    intentType = 'fuel';
  } else if (
    norm.includes('عقد') ||
    norm.includes('فاتوره') ||
    norm.includes('ايصال') ||
    norm.includes('ايجار') ||
    norm.includes('بيع سياره') ||
    norm.includes('موتوسيكل') ||
    norm.includes('سيره ذاتيه') ||
    norm.includes('cv')
  ) {
    intentType = 'document';
  } else if (
    norm.includes('صوره') ||
    norm.includes('صور') ||
    norm.includes('ضغط') ||
    norm.includes('webp') ||
    norm.includes('pdf')
  ) {
    intentType = 'image';
  } else if (
    norm.includes('qr') ||
    norm.includes('باركود') ||
    norm.includes('واي فاي') ||
    norm.includes('واتساب')
  ) {
    intentType = 'qr';
  } else if (
    norm.includes('تشطيب') ||
    norm.includes('مقايسه') ||
    norm.includes('محاره') ||
    norm.includes('سيراميك') ||
    norm.includes('جبس بورد') ||
    norm.includes('سباكه') ||
    norm.includes('نقاشه')
  ) {
    intentType = 'finishing';
  } else if (
    norm.includes('فدان') ||
    norm.includes('قيراط') ||
    norm.includes('سهم') ||
    norm.includes('مساحه')
  ) {
    intentType = 'unit';
  }

  return {
    normalizedQuery: norm,
    intentType,
    primaryNumber,
    scaledAmount,
    detectedKarat,
    foundCurrencies: foundCurrencies.map((c) => c.code),
  };
}

/**
 * Resolves the user's request into a single Master Hub Tool (`isMasterTool: true`)
 * with URL query string (`?from=USD&to=EGP&amount=100`) and instant calculation!
 */
export function resolveSmartConciergeQuery(rawQuery = '') {
  const masterTools = getMasterTools();
  const findMaster = (slug) =>
    masterTools.find((m) => m.slug === slug) || masterTools[0];

  const parsed = extractIntentAndEntities(rawQuery);
  const {
    normalizedQuery,
    intentType,
    primaryNumber,
    scaledAmount,
    detectedKarat,
    foundCurrencies,
  } = parsed;

  // 1. TAFQEET (تفقيط المبالغ المالية بالحروف)
  if (intentType === 'tafqeet') {
    const amount = scaledAmount || 125450;
    const tafqeetRes = numberToArabicWordsTafqeet(amount, 'جنيه مصري', 'قرشاً');
    const baseTool = findMaster('arabic-number-to-words-tafqeet');
    const overrideParams = { amount, currencyMain: 'جنيه مصري', currencySub: 'قرشاً' };
    const queryString = `?amount=${amount}`;

    return {
      matchedTool: { ...baseTool, defaultParams: overrideParams },
      overrideParams,
      queryString,
      conciergeReply: `تم تفقيط المبلغ (${amount.toLocaleString('en-US')}) بالحروف العربية فوراً: «${tafqeetRes.fullLegalCheckString}»`,
      instantHighlightLabel: 'التفقيط القانوني الجاهز للشيكات والعقود',
      instantHighlightValue: tafqeetRes.fullLegalCheckString,
      secondarySuggestions: masterTools.filter((t) => t.category === 'digital').slice(0, 3),
    };
  }

  // 2. ISLAMIC INHERITANCE (تقسيم الميراث الشرعي)
  if (intentType === 'inheritance') {
    const estateVal = scaledAmount && scaledAmount >= 1000 ? scaledAmount : 1200000;
    const inhRes = calculateIslamicInheritance({
      estateGrossValue: estateVal,
      debtsAndFuneralExpenses: 0,
      bequestAmount: 0,
      hasHusband: false,
      wivesCount: 1,
      sonsCount: 2,
      daughtersCount: 1,
      hasFather: false,
      hasMother: false,
    });
    const baseTool = findMaster('islamic-inheritance-calculator');
    const overrideParams = {
      estateGrossValue: estateVal,
      wivesCount: 1,
      sonsCount: 2,
      daughtersCount: 1,
    };
    const queryString = `?estate=${estateVal}`;

    return {
      matchedTool: { ...baseTool, defaultParams: overrideParams },
      overrideParams,
      queryString,
      conciergeReply: `تم تجهيز حاسبة المواريث الشرعية لتركة بقيمة ${estateVal.toLocaleString('en-US')} ج.م وتوزيع الأنصبة الشرعية للورثة.`,
      instantHighlightLabel: 'صافي التركة القابلة للتوزيع الشرعي',
      instantHighlightValue: `${inhRes.distributableEstate.toLocaleString('en-US')} ج.م`,
      secondarySuggestions: masterTools.filter((t) => t.category === 'gold').slice(0, 3),
    };
  }

  // 3. ZAKAT & GOLD ZAKAT INTENT -> `zakat-wealth-gold-calculator`
  if (intentType === 'zakat') {
    const isGoldWeight =
      normalizedQuery.includes('جرام') ||
      normalizedQuery.includes('ذهب') ||
      (primaryNumber && primaryNumber <= 2000);
    const weightGrams = isGoldWeight ? primaryNumber || 100 : 85;
    const cashVal = !isGoldWeight && scaledAmount ? scaledAmount : 0;

    const baseTool = findMaster('zakat-wealth-gold-calculator');
    const price24 = (3780 * 24) / 21;
    const zakatCalc = calculateZakatAndGold({
      gold24PricePerGram: price24,
      cashAndSavings: cashVal,
      stocksAndInvestments: 0,
      businessInventory: 0,
      gold24Grams: (weightGrams * detectedKarat) / 24,
      gold21Grams: 0,
      gold18Grams: 0,
      liabilitiesAndDebts: 0,
    });

    const overrideParams = {
      ...baseTool.defaultParams,
      selectedKarat: detectedKarat,
      weightGrams,
      cashSavings: cashVal,
      calcMode: 'zakat-check',
    };
    const queryString = `?karat=${detectedKarat}&weight=${weightGrams}&mode=zakat-check`;

    return {
      matchedTool: { ...baseTool, defaultParams: overrideParams },
      overrideParams,
      queryString,
      conciergeReply: zakatCalc.isEligibleForZakat
        ? `تم حساب الزكاة فوراً لـ ${weightGrams} جرام ذهب عيار ${detectedKarat}${cashVal ? ` + ${cashVal.toLocaleString('en-US')} ج.م نقد` : ''}: بلغ النصاب الشرعي، ومقدار الزكاة الواجب إخراجه (2.5%) هو ${zakatCalc.totalZakatDue.toLocaleString('en-US')} ج.م.`
        : `تم فحص النصاب الشرعي لـ ${weightGrams} جرام ذهب عيار ${detectedKarat}: المكافئ الصافي (${zakatCalc.pureGold24EquivalentGrams} جم عيار 24) لم يبلغ نصاب الزكاة الشرعي (85 جرام عيار 24) بعد.`,
      instantHighlightLabel: 'مقدار الزكاة الشرعية (2.5%)',
      instantHighlightValue: `${zakatCalc.totalZakatDue.toLocaleString('en-US')} ج.م`,
      secondarySuggestions: masterTools.filter((t) => t.category === 'gold').slice(0, 3),
    };
  }

  // 4. GOLD PRICE & WORKMANSHIP -> `comprehensive-gold-calculator`
  if (intentType === 'gold') {
    const weightGrams = primaryNumber || 10;
    const baseTool = findMaster('comprehensive-gold-calculator');
    const workmanship = detectedKarat === 24 ? 60 : detectedKarat === 18 ? 210 : 120;
    const goldCalc = calculateGoldWorkmanship({
      baseKarat21Price: 3780,
      selectedKarat: [24, 22, 21, 18, 14].includes(detectedKarat) ? detectedKarat : 21,
      weightGrams,
      workmanshipPerGram: workmanship,
      stampAndTaxPerGram: 25,
      cashbackPercentOnResale: 45,
      dealerBuySpreadPerGram: 25,
    });

    const overrideParams = {
      ...baseTool.defaultParams,
      selectedKarat: detectedKarat,
      weightGrams,
      workmanshipPerGram: workmanship,
    };
    const queryString = `?karat=${detectedKarat}&weight=${weightGrams}`;

    return {
      matchedTool: { ...baseTool, defaultParams: overrideParams },
      overrideParams,
      queryString,
      conciergeReply: `جهزت لك «حاسبة الذهب والسبائك الشاملة» مضبوطة تلقائياً على وزن ${weightGrams} جرام (عيار ${detectedKarat}): إجمالي السعر النهائي للشراء بالمصنعية هو ${goldCalc.totalPurchaseCost.toLocaleString('en-US')} ج.م.`,
      instantHighlightLabel: `إجمالي شراء ${weightGrams} جم عيار ${detectedKarat} بالمصنعية`,
      instantHighlightValue: `${goldCalc.totalPurchaseCost.toLocaleString('en-US')} ج.م`,
      secondarySuggestions: masterTools.filter((t) => t.category === 'gold').slice(0, 3),
    };
  }

  // 5. CURRENCY CONVERSION -> Opens Single Master Tool `comprehensive-currency-converter` with `?from=USD&to=EGP&amount=100`
  if (intentType === 'currency') {
    const fromCode = foundCurrencies[0] || 'USD';
    const toCode = foundCurrencies[1] || (fromCode === 'EGP' ? 'USD' : 'EGP');
    const amount = scaledAmount || 100;

    const fromObj = CURRENCY_LIST.find((c) => c.code === fromCode) || CURRENCY_LIST[0];
    const toObj = CURRENCY_LIST.find((c) => c.code === toCode) || CURRENCY_LIST[1];
    const rate = Number((fromObj.rateToEgp / toObj.rateToEgp).toFixed(4));

    const fxCalc = calculateCurrencyConversion(amount, rate, 0);
    const baseTool = findMaster('comprehensive-currency-converter');

    const overrideParams = {
      fromCode,
      toCode,
      amount,
      defaultRate: rate,
    };
    const queryString = `?from=${fromCode}&to=${toCode}&amount=${amount}`;

    return {
      matchedTool: { ...baseTool, defaultParams: overrideParams },
      overrideParams,
      queryString,
      conciergeReply: `تم ضبط «محول العملات الشامل» على تحويل ${amount.toLocaleString('en-US')} ${fromObj.name} (${fromCode}) إلى ${toObj.name} (${toCode}) بسعر الصرف ${rate}: النتيجة الفورية هي ${fxCalc.convertedAmount.toLocaleString('en-US')} ${toCode}.`,
      instantHighlightLabel: `${amount.toLocaleString('en-US')} ${fromCode} يساوي اليوم`,
      instantHighlightValue: `${fxCalc.convertedAmount.toLocaleString('en-US')} ${toCode}`,
      secondarySuggestions: masterTools.filter((t) => t.category === 'currencies' || t.category === 'finance').slice(0, 3),
    };
  }

  // 6. BANK CERTIFICATES & LOANS
  if (intentType === 'certificate' || intentType === 'loan') {
    const amount = scaledAmount && scaledAmount >= 1000 ? scaledAmount : 200000;
    if (intentType === 'certificate') {
      const baseTool = findMaster('bank-certificates-profit-calculator');
      const certCalc = calculateCertificateProfit({
        principalAmount: amount,
        annualYieldPercent: 27,
        durationYears: 3,
      });
      const overrideParams = {
        mode: 'certificate',
        principalAmount: amount,
        annualRate: 27,
        durationMonths: 36,
      };
      const queryString = `?mode=certificate&amount=${amount}&rate=27`;
      return {
        matchedTool: { ...baseTool, defaultParams: overrideParams },
        overrideParams,
        queryString,
        conciergeReply: `تم ضبط «حاسبة الشهادات والودائع البنكية» على مبلغ ${amount.toLocaleString('en-US')} ج.م بعائد 27%: يمنحك عائداً شهرياً قدره ${certCalc.monthlyPayout.toLocaleString('en-US')} ج.م.`,
        instantHighlightLabel: 'العائد الشهري الثابت للشهادة',
        instantHighlightValue: `${certCalc.monthlyPayout.toLocaleString('en-US')} ج.م / شهرياً`,
        secondarySuggestions: masterTools.filter((t) => t.category === 'finance').slice(0, 3),
      };
    }

    const baseTool = findMaster('bank-loan-installment-calculator');
    const loanCalc = calculateLoanSchedule({
      principalAmount: amount,
      annualInterestRate: 22,
      durationMonths: 36,
      interestType: 'declining',
    });
    const overrideParams = {
      mode: 'loan',
      principalAmount: amount,
      annualRate: 22,
      durationMonths: 36,
      interestType: 'declining',
    };
    const queryString = `?mode=loan&amount=${amount}&months=36`;
    return {
      matchedTool: { ...baseTool, defaultParams: overrideParams },
      overrideParams,
      queryString,
      conciergeReply: `تم ضبط «حاسبة القروض والتمويل» لمبلغ ${amount.toLocaleString('en-US')} ج.م لمدة 36 شهراً: القسط الشهري المتساوي هو ${loanCalc.monthlyInstallment.toLocaleString('en-US')} ج.م.`,
      instantHighlightLabel: 'القسط الشهري المتوقع للقرض',
      instantHighlightValue: `${loanCalc.monthlyInstallment.toLocaleString('en-US')} ج.م / شهر`,
      secondarySuggestions: masterTools.filter((t) => t.category === 'finance').slice(1, 4),
    };
  }

  // 7. FUEL & TRIP COST -> `fuel-trip-cost-calculator`
  if (intentType === 'fuel') {
    const distanceKm = primaryNumber || 200;
    const fuelPrice = normalizedQuery.includes('95')
      ? 24.0
      : normalizedQuery.includes('80')
      ? 20.75
      : 22.25;
    const fuelCalc = calculateFuelTrip({
      distanceKm,
      isRoundTrip: true,
      consumptionPer100Km: 8.2,
      fuelPricePerLiter: fuelPrice,
      passengersCount: 4,
    });
    const baseTool = findMaster('fuel-trip-cost-calculator');
    const overrideParams = {
      ...baseTool.defaultParams,
      distanceKm,
      isRoundTrip: true,
      fuelPricePerLiter: fuelPrice,
    };
    const queryString = `?distance=${distanceKm}&fuelPrice=${fuelPrice}`;

    return {
      matchedTool: { ...baseTool, defaultParams: overrideParams },
      overrideParams,
      queryString,
      conciergeReply: `تم ضبط «حاسبة استهلاك البنزين وتكلفة المشوار» لمسافة ${distanceKm} كم (ذهاب وعودة = ${fuelCalc.effectiveDistanceKm} كم): تحتاج ${fuelCalc.totalLitersNeeded} لتر وقود بتكلفة ${fuelCalc.totalTripCost.toLocaleString('en-US')} ج.م.`,
      instantHighlightLabel: `تكلفة الوقود (${fuelCalc.totalLitersNeeded} لتر)`,
      instantHighlightValue: `${fuelCalc.totalTripCost.toLocaleString('en-US')} ج.م`,
      secondarySuggestions: masterTools.filter((t) => t.category === 'automotive').slice(0, 3),
    };
  }

  // 8. OFFICIAL CONTRACTS & A4 DOCUMENTS
  if (intentType === 'document') {
    const isLease = normalizedQuery.includes('ايجار') || normalizedQuery.includes('شقه');
    const isInvoice = normalizedQuery.includes('فاتوره') || normalizedQuery.includes('عرض سعر');
    const isCv = normalizedQuery.includes('سيره') || normalizedQuery.includes('cv');

    const slug = isCv
      ? 'ats-resume-cv-builder'
      : isInvoice
      ? 'tax-sales-invoice-generator'
      : isLease
      ? 'apartment-commercial-lease-contract'
      : 'vehicle-motorcycle-sale-contract';
    const baseTool = findMaster(slug);

    return {
      matchedTool: baseTool,
      overrideParams: baseTool.defaultParams,
      queryString: `?doc=${baseTool.defaultParams.docType}`,
      conciergeReply: `جهزت لك الأداة الشاملة «${baseTool.title}» بصياغة قانونية كاملة وجاهزة للتعبئة والطباعة الفورية بتنسيق ورق A4 PDF.`,
      instantHighlightLabel: 'قالب رسمي جاهز للطباعة',
      instantHighlightValue: 'A4 PDF معتمد',
      secondarySuggestions: masterTools.filter((t) => t.category === 'documents').slice(0, 3),
    };
  }

  // 9. IMAGE STUDIO & PDF
  if (intentType === 'image') {
    const isPdf = normalizedQuery.includes('pdf');
    const baseTool = findMaster(
      isPdf ? 'images-to-pdf-converter' : 'comprehensive-image-studio'
    );
    return {
      matchedTool: baseTool,
      overrideParams: baseTool.defaultParams,
      queryString: `?format=webp&quality=82`,
      conciergeReply: `«${baseTool.title}» جاهز: يعمل محلياً 100% داخل متصفحك عبر HTML5 Canvas بدون رفع صورك لأي سيرفر.`,
      instantHighlightLabel: 'معالجة محلية فورية',
      instantHighlightValue: 'WebP / PNG / JPG / PDF',
      secondarySuggestions: masterTools.filter((t) => t.category === 'images').slice(0, 3),
    };
  }

  // 10. QR & BARCODE STUDIO
  if (intentType === 'qr') {
    const isWhatsapp = normalizedQuery.includes('واتساب') || normalizedQuery.includes('واتس');
    const baseTool = findMaster(
      isWhatsapp ? 'whatsapp-direct-link-generator' : 'pro-qr-code-studio'
    );
    return {
      matchedTool: baseTool,
      overrideParams: baseTool.defaultParams,
      queryString: `?size=1000`,
      conciergeReply: `«${baseTool.title}» جاهز للعمل فوراً بدقة طباعة فائقة (1000×1000 PNG).`,
      instantHighlightLabel: 'دقة التوليد المحلي',
      instantHighlightValue: '1000×1000 HD PNG',
      secondarySuggestions: masterTools.filter((t) => t.category === 'digital').slice(0, 3),
    };
  }

  // 10.5 EGYPT FINISHING & ENGINEERING BOQ (`egypt-finishing-cost-calculator`)
  if (intentType === 'finishing') {
    const areaSqm = primaryNumber && primaryNumber >= 40 && primaryNumber <= 2000 ? primaryNumber : 140;
    const isUltra = normalizedQuery.includes('الترا') || normalizedQuery.includes('فندقي');
    const isEco = normalizedQuery.includes('اقتصادي') || normalizedQuery.includes('تجار');
    const grade = isUltra ? 'ultra-lux' : isEco ? 'economic' : 'super-lux';
    const baseTool = findMaster('egypt-finishing-cost-calculator');
    const overrideParams = {
      ...baseTool.defaultParams,
      grossAreaSqm: areaSqm,
      finishingGrade: grade,
    };
    const netSqm = Math.round(areaSqm * 0.82);
    const ratePerSqm = grade === 'ultra-lux' ? 9400 : grade === 'economic' ? 3850 : 5950;
    const estTotal = Math.round(netSqm * ratePerSqm);
    const queryString = `?area=${areaSqm}&grade=${grade}`;

    return {
      matchedTool: { ...baseTool, defaultParams: overrideParams },
      overrideParams,
      queryString,
      conciergeReply: `جهزت لك «حاسبة تكلفة تشطيب الشقق والمقايسة الهندسية في مصر» مضبوطة على مساحة ${areaSqm} م² (صافي ${netSqm} م²) بمستوى ${grade === 'ultra-lux' ? 'ألترا لوكس' : grade === 'economic' ? 'اقتصادي' : 'سوبر لوكس'}: التكلفة التقديرية تبلغ نحو ${estTotal.toLocaleString('en-US')} ج.م شاملة الخامات والمصنعيات.`,
      instantHighlightLabel: `تكلفة تشطيب ${areaSqm} م² (مقايسة 10 مراحل)`,
      instantHighlightValue: `${estTotal.toLocaleString('en-US')} ج.م`,
      secondarySuggestions: masterTools.filter((t) => t.category === 'units').slice(0, 3),
    };
  }

  // 11. UNITS & AREA CONVERSION
  if (intentType === 'unit') {
    const val = primaryNumber || 1;
    const baseTool = findMaster('agricultural-land-area-converter');
    const overrideParams = {
      ...baseTool.defaultParams,
      inputValue: val,
    };
    const queryString = `?family=area&from=feddan&to=sqm&val=${val}`;
    return {
      matchedTool: { ...baseTool, defaultParams: overrideParams },
      overrideParams,
      queryString,
      conciergeReply: `تم ضبط «محول المساحات والأراضي الشامل» لتحويل قيمة (${val}) بين الفدان والقيراط والسهم والمتر المربع بدقة.`,
      instantHighlightLabel: 'تحويل قياسي فوري',
      instantHighlightValue: `${val} فدان = ${(val * 4200.83).toLocaleString('en-US', { maximumFractionDigits: 1 })} م²`,
      secondarySuggestions: masterTools.filter((t) => t.category === 'units').slice(0, 3),
    };
  }

  // 12. EXPANDED 48 MASTER TOOLS SEMANTIC KEYWORD ROUTER
  const expandedRules = [
    { slug: 'egypt-national-id-analyzer', keys: ['رقم قومي', 'الرقم القومي', 'بطاقه شخصيه', 'تاريخ ميلاد من الرقم'] },
    { slug: 'rosca-gameya-calculator', keys: ['جمعيه', 'الجمعيه', 'قبض الجمعيه'] },
    { slug: 'egypt-net-salary-tax', keys: ['صافي المرتب', 'ضريبه الدخل', 'تامينات الموظف', 'مرتب'] },
    { slug: 'battery-pack-bms-calc', keys: ['بطاريه ليثيوم', '18650', 'bms', 'تجميع بطاريات'] },
    { slug: 'ride-driver-net-profit', keys: ['اوبر', 'ديدي', 'اندرايف', 'كابتن', 'دليفري', 'مرسول'] },
    { slug: 'cod-shipping-reconciliation', keys: ['تحصيل الشحن', 'شركه الشحن', 'cod', 'مرتجعات الشحن'] },
    { slug: 'kids-worksheet-generator', keys: ['شيتات اطفال', 'تاسيس اطفال', 'kg1', 'kg2', 'تمارين حسابيه'] },
    { slug: 'ac-btu-horsepower-calc', keys: ['قدره التكييف', 'تكييف', 'btu', 'كم حصان'] },
    { slug: 'wire-breaker-amp-calc', keys: ['مقاس السلك', 'قاطع', 'امبير', 'مفتاح اوتوماتيك'] },
    { slug: 'solar-battery-inverter-calc', keys: ['طاقه شمسيه', 'انفرتر', 'الواح شمسيه'] },
    { slug: 'cctv-storage-calculator', keys: ['كاميرات مراقبه', 'هارد كاميرات', 'cctv'] },
    { slug: 'thanaweya-percentage-calc', keys: ['ثانويه عامه', 'مجموع الثانويه', 'نسبه الثانويه'] },
    { slug: 'ads-roas-cpa-calculator', keys: ['اعلانات مموله', 'roas', 'cpa', 'فيسبوك ادز'] },
    { slug: 'islamic-inheritance-udhiya-calc', keys: ['زكاه الفطر', 'اضحيه', 'سبع البقره', 'كفاره'] },
  ];

  for (const rule of expandedRules) {
    if (rule.keys.some((k) => normalizedQuery.includes(normalizeArabicText(k)))) {
      const matched = findMaster(rule.slug);
      return {
        matchedTool: matched,
        overrideParams: matched.defaultParams,
        queryString: '',
        conciergeReply: `جهزت لك الأداة المتخصصة «${matched.title}» — تعمل فوراً داخل المتصفح بمعادلات دقيقة.`,
        instantHighlightLabel: matched.shortTitle || matched.categoryName,
        instantHighlightValue: matched.badge,
        secondarySuggestions: masterTools.filter((t) => t.category === matched.category).slice(0, 3),
      };
    }
  }

  // Fallback Text Search across all Distinct Master Tools
  const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length >= 2);
  let bestTool = masterTools[0];
  let bestScore = 0;

  for (const t of masterTools) {
    const haystack = normalizeArabicText(
      `${t.title} ${t.shortTitle || ''} ${t.subtitle || ''} ${t.summary || ''} ${t.slug}`
    );
    if (haystack.includes(normalizedQuery)) {
      bestTool = t;
      bestScore = 100;
      break;
    }
    let score = 0;
    for (const w of queryWords) {
      if (haystack.includes(w)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestTool = t;
    }
  }

  return {
    matchedTool: bestTool,
    overrideParams: bestTool.defaultParams,
    queryString: '',
    conciergeReply: `وجدت لك الأداة الشاملة الأنسب لطلبك: «${bestTool.title}» — اضغط بالأسفل لفتحها مباشرة بكامل القوائم المنسدلة.`,
    instantHighlightLabel: bestTool.categoryName,
    instantHighlightValue: bestTool.badge,
    secondarySuggestions: masterTools.slice(0, 3),
  };
}
