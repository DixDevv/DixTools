import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateZakatAndGold,
  calculateFuelTrip,
  calculateLoanSchedule,
  calculateCertificateProfit,
  calculateGoldWorkmanship,
  calculateCurrencyConversion,
  calculateInvoiceTotals,
} from './calculations';
import { generateQrMatrix } from './qrMatrix';

test('calculateZakatAndGold computes Nisab and 2.5% Zakat accurately across gold karats', () => {
  const result = calculateZakatAndGold({
    gold24PricePerGram: 4000,
    cashAndSavings: 200000,
    stocksAndInvestments: 50000,
    businessInventory: 0,
    gold24Grams: 10,
    gold21Grams: 48, // 48 * 21 / 24 = 42g pure 24k
    gold18Grams: 16, // 16 * 18 / 24 = 12g pure 24k -> total 64g pure 24k
    liabilitiesAndDebts: 16000,
  });

  // Nisab = 85 * 4000 = 340,000
  assert.equal(result.nisabThresholdValue, 340000);
  assert.equal(result.pureGold24EquivalentGrams, 64);
  // Gold value = 64 * 4000 = 256,000
  assert.equal(result.totalGoldValue, 256000);
  // Gross = 250,000 + 256,000 = 506,000; Net = 506,000 - 16,000 = 490,000
  assert.equal(result.netZakatableWealth, 490000);
  assert.equal(result.isEligibleForZakat, true);
  // 2.5% of 490,000 = 12,250
  assert.equal(result.totalZakatDue, 12250);
});

test('calculateZakatAndGold returns 0 Zakat when below 85g Gold 24K Nisab', () => {
  const result = calculateZakatAndGold({
    gold24PricePerGram: 4000,
    cashAndSavings: 100000,
    stocksAndInvestments: 0,
    businessInventory: 0,
    gold24Grams: 0,
    gold21Grams: 20,
    gold18Grams: 0,
    liabilitiesAndDebts: 10000,
  });

  assert.equal(result.isEligibleForZakat, false);
  assert.equal(result.totalZakatDue, 0);
});

test('calculateFuelTrip computes round-trip fuel liters, total cost, and passenger split with official Egypt fuel92 (22.25 EGP)', () => {
  const result = calculateFuelTrip({
    distanceKm: 220,
    isRoundTrip: true,
    consumptionPer100Km: 8.5,
    fuelPricePerLiter: 22.25,
    passengersCount: 4,
  });

  assert.equal(result.effectiveDistanceKm, 440);
  assert.equal(result.totalLitersNeeded, 37.4);
  assert.equal(result.totalTripCost, 832.15);
  assert.equal(result.costPerPassenger, 208.04);
});

test('calculateLoanSchedule and calculateCertificateProfit compute banking figures accurately', () => {
  const flatLoan = calculateLoanSchedule({
    principalAmount: 120000,
    annualInterestRate: 20,
    durationMonths: 24,
    interestType: 'flat',
    adminFeePercent: 1.5,
  });

  // Flat interest: 120000 * 20% * 2 years = 48000; Total = 168000; Monthly = 7000
  assert.equal(flatLoan.totalInterest, 48000);
  assert.equal(flatLoan.monthlyInstallment, 7000);
  assert.equal(flatLoan.adminFeeAmount, 1800);

  const decliningLoan = calculateLoanSchedule({
    principalAmount: 100000,
    annualInterestRate: 24,
    durationMonths: 12,
    interestType: 'declining',
  });
  assert.ok(decliningLoan.monthlyInstallment > 9400 && decliningLoan.monthlyInstallment < 9500);

  const cert = calculateCertificateProfit({
    principalAmount: 200000,
    annualYieldPercent: 27,
    durationYears: 3,
  });
  assert.equal(cert.annualPayout, 54000);
  assert.equal(cert.monthlyPayout, 4500);
  assert.equal(cert.totalProfitAtMaturity, 162000);
  assert.equal(cert.totalMaturityValue, 362000);
});

test('calculateGoldWorkmanship and calculateCurrencyConversion and calculateInvoiceTotals work properly', () => {
  const gold = calculateGoldWorkmanship({
    baseKarat21Price: 3780,
    selectedKarat: 21,
    weightGrams: 10,
    workmanshipPerGram: 120,
    stampAndTaxPerGram: 30,
    cashbackPercentOnResale: 40,
    dealerBuySpreadPerGram: 30,
  });

  assert.equal(gold.price24, 4320);
  assert.equal(gold.price18, 3240);
  assert.equal(gold.rawGoldTotalValue, 37800);
  assert.equal(gold.totalWorkmanshipAndTax, 1500);
  assert.equal(gold.totalPurchaseCost, 39300);
  assert.equal(gold.resaleCashbackAmount, 600);

  const fx = calculateCurrencyConversion(100, 50.5, 2);
  assert.equal(fx.convertedAmount, 5050);
  assert.equal(fx.bankFeeAmount, 101);
  assert.equal(fx.multipliersTable.length, 7);
  assert.equal(fx.multipliersTable[3].baseAmount, 100);
  assert.equal(fx.multipliersTable[3].fromToTarget, 5050);

  const invoice = calculateInvoiceTotals(
    [
      { id: '1', description: 'تطوير موقع', quantity: 2, unitPrice: 5000 },
      { id: '2', description: 'استضافة', quantity: 1, unitPrice: 2000 },
    ],
    1000,
    14
  );
  assert.equal(invoice.subtotal, 12000);
  assert.equal(invoice.taxableAmount, 11000);
  assert.equal(invoice.vatAmount, 1540);
  assert.equal(invoice.grandTotal, 12540);

  const qr = generateQrMatrix('https://meezan-hub.com');
  assert.ok(qr.length >= 21);
  assert.equal(qr.length, qr[0].length);
});

test('getMasterTools returns 52 distinct Master Hub Tools while getSeoSubRoutes keeps 5,000+ SEO sub-routes in background', async () => {
  const {
    getMasterTools,
    getSeoSubRoutes,
    getAllMatrixTools,
    getMatrixStats,
    getToolBySlug,
  } = await import('../../lib/tools-matrix-generator.js');

  const masterTools = getMasterTools();
  const seoSubRoutes = getSeoSubRoutes();
  const allTools = getAllMatrixTools();
  const stats = getMatrixStats();

  assert.ok(masterTools.length >= 50, `Expected >= 50 master tools, got ${masterTools.length}`);
  assert.ok(masterTools.every((t: { isMasterTool: boolean; isSubVariant: boolean }) => t.isMasterTool === true && t.isSubVariant === false));
  assert.ok(seoSubRoutes.every((t: { isMasterTool: boolean; isSubVariant: boolean }) => t.isMasterTool === false && t.isSubVariant === true));
  assert.ok(allTools.length >= 5000);
  assert.equal(stats.masterToolsCount, masterTools.length);

  const sampleMaster = getToolBySlug('currencies', 'comprehensive-currency-converter');
  assert.equal(sampleMaster.isMasterTool, true);
});

test('numberToArabicWordsTafqeet and calculateIslamicInheritance compute accurately', async () => {
  const { numberToArabicWordsTafqeet, calculateIslamicInheritance } = await import(
    './calculations'
  );

  const tafqeet = numberToArabicWordsTafqeet(125450.75, 'جنيه مصري', 'قرشاً');
  assert.ok(tafqeet.fullLegalCheckString.includes('فقط وقدره'));
  assert.ok(tafqeet.fullLegalCheckString.includes('جنيه مصري'));
  assert.ok(tafqeet.fullLegalCheckString.includes('لا غير'));

  const inh = calculateIslamicInheritance({
    estateGrossValue: 240000,
    debtsAndFuneralExpenses: 0,
    bequestAmount: 0,
    hasHusband: false,
    wivesCount: 1, // 1/8 = 30,000
    sonsCount: 1, // residuary 2 parts
    daughtersCount: 1, // residuary 1 part
    hasFather: false,
    hasMother: false,
  });
  assert.equal(inh.distributableEstate, 240000);
  const wifeShare = inh.shares.find((s) => s.heirTitle === 'الزوجات');
  assert.equal(wifeShare?.totalShareAmount, 30000);
});

test('resolveSmartConciergeQuery routes to Master Hub Tools with query string and Smart Pre-fill', async () => {
  const { resolveSmartConciergeQuery } = await import(
    '../../lib/arabic-intent-matcher.js'
  );

  const fxRes = resolveSmartConciergeQuery('عاوز أحول 250 دولار لجنيه مصري');
  assert.equal(fxRes.matchedTool.slug, 'comprehensive-currency-converter');
  assert.equal(fxRes.overrideParams.amount, 250);
  assert.equal(fxRes.overrideParams.fromCode, 'USD');
  assert.equal(fxRes.overrideParams.toCode, 'EGP');
  assert.equal(fxRes.queryString, '?from=USD&to=EGP&amount=250');

  const zakatRes = resolveSmartConciergeQuery('احسبلي زكاة 120 جرام دهب عيار 21');
  assert.equal(zakatRes.matchedTool.slug, 'zakat-wealth-gold-calculator');
  assert.equal(zakatRes.overrideParams.weightGrams, 120);
  assert.equal(zakatRes.overrideParams.selectedKarat, 21);
});

test('God-Tier SEO Engine generates deterministic AggregateRating, real-time freshness signals, 10-row snippet tables, sitemap priorities, and IndexNow payloads', async () => {
  const {
    getFreshnessSignals,
    getDeterministicRating,
    buildFreshToolSeoMeta,
    getSemanticLsiKeywords,
  } = await import('../../lib/seo-freshness-engine.js');
  const { generatePreCalculatedRows } = await import('../../components/SEOSnippetTables.jsx');
  const { getToolBySlug } = await import('../../lib/tools-matrix-generator.js');
  const { default: sitemap } = await import('../../app/sitemap.js');
  const { default: robots } = await import('../../app/robots.js');
  const { buildIndexNowPayload } = await import('../../app/api/indexnow/route.js');

  const signals = getFreshnessSignals(new Date('2026-05-15T10:00:00Z'));
  assert.equal(signals.year, 2026);
  assert.equal(signals.monthNameAr, 'مايو');

  const r1 = getDeterministicRating('comprehensive-gold-calculator');
  const r2 = getDeterministicRating('comprehensive-currency-converter');
  assert.ok(r1.ratingValue === '4.8' || r1.ratingValue === '4.9');
  assert.notEqual(r1.ratingCount, r2.ratingCount);

  const goldTool = getToolBySlug('gold', 'comprehensive-gold-calculator');
  const freshMeta = buildFreshToolSeoMeta(goldTool);
  assert.ok(freshMeta.freshTitle.includes('Dix Tools'));
  assert.ok(freshMeta.isTimeSensitive === true);

  const lsi = getSemanticLsiKeywords(goldTool);
  assert.ok(lsi.length >= 10);

  const rows = generatePreCalculatedRows(goldTool);
  assert.equal(rows.length, 10);

  const sm = sitemap();
  assert.ok(sm.length > 5000);
  assert.equal(sm[0].priority, 1.0);

  const rb = robots();
  assert.ok(rb.sitemap.includes('sitemap.xml'));

  const indexNow = buildIndexNowPayload();
  assert.ok(indexNow.urlList.length > 50);
});

test('lib/stealth-crypto.js detects DixDev case-insensitively and verifies PIN 1238 via SHA-256 without storing plain text', async () => {
  const {
    isSecretDixDevTrigger,
    hashPinWithSha256,
    verifyStealthMasterPin,
    MASTER_PIN_SHA256_HASH,
  } = await import('../../lib/stealth-crypto.js');

  assert.equal(isSecretDixDevTrigger('DixDev'), true);
  assert.equal(isSecretDixDevTrigger('  dixdev '), true);
  assert.equal(isSecretDixDevTrigger('DIXDEV'), true);
  assert.equal(isSecretDixDevTrigger('حاسبة الذهب'), false);

  const hash1238 = await hashPinWithSha256('1238');
  assert.equal(hash1238, MASTER_PIN_SHA256_HASH);

  const wrongRes = await verifyStealthMasterPin('9999');
  assert.equal(wrongRes.ok, false);
  assert.equal(wrongRes.error, 'رمز الدخول غير صحيح');

  const okRes = await verifyStealthMasterPin('1238');
  assert.equal(okRes.ok, true);
  assert.ok(okRes.session?.token.startsWith('dix_st_'));
  assert.equal(okRes.welcomeMessage, 'تم التحقق.. مرحباً بك في غرفة قيادة Dix Tools');
});

test('calculateEgyptGoldPrices, calculateEgyptSilverPrices, and fetchEgyptLiveOracleFromApis compute Egypt gold karats, silver grades, EGP currencies, and 60s oracle status accurately', async () => {
  const {
    calculateEgyptGoldPrices,
    calculateEgyptSilverPrices,
    formatCairoTimestamp,
    fetchEgyptLiveOracleFromApis,
    ORACLE_REFRESH_INTERVAL_SECONDS,
  } = await import('../../app/api/egypt-live-oracle/route.js');

  assert.equal(ORACLE_REFRESH_INTERVAL_SECONDS, 60);

  const gold = calculateEgyptGoldPrices(2700, 50.0, 120);
  // 2700 / 31.1034768 * 50 = 4340.35 -> 4340
  assert.equal(gold.karat24, 4340);
  assert.equal(gold.karat21, Math.round(4340 * (21 / 24)));
  assert.equal(gold.karat18, Math.round(4340 * (18 / 24)));
  assert.equal(gold.karat14, Math.round(4340 * (14 / 24)));
  assert.equal(gold.goldCoin8g, gold.karat21 * 8);
  assert.equal(gold.defaultWorkmanship, 120);

  const silver = calculateEgyptSilverPrices(31.1034768, 50.0);
  assert.equal(silver.silverGram999, 50.0);
  assert.equal(silver.silverGram925, 46.25);

  const stamp = formatCairoTimestamp(new Date('2026-11-06T12:00:00Z'));
  assert.ok(stamp.includes('توقيت القاهرة'));

  const livePayload = await fetchEgyptLiveOracleFromApis(120);
  assert.equal(livePayload.ok, true);
  assert.equal(livePayload.oracleStatus, 'LIVE_VERIFIED');
  assert.equal(livePayload.refreshIntervalSeconds, 60);
  assert.ok(livePayload.currenciesToEgp.USD > 20);
  assert.ok(livePayload.gold.karat21 > 2000);
  assert.ok(livePayload.silver.silverGram999 > 10);
  assert.equal(livePayload.energyAndUtilities.fuel80, 20.75);
  assert.equal(livePayload.energyAndUtilities.fuel92, 22.25);
  assert.equal(livePayload.energyAndUtilities.fuel95, 24.0);
  assert.equal(livePayload.energyAndUtilities.gas80, 20.75);
  assert.equal(livePayload.energyAndUtilities.gas92, 22.25);
  assert.equal(livePayload.energyAndUtilities.gas95, 24.0);
  assert.equal(livePayload.energyAndUtilities.diesel, 19.5);
  assert.equal(livePayload.bankingAndTaxes.certAnnualYield, 27);
  assert.equal(livePayload.bankingAndTaxes.vatEgyptPercent, 14);
});

test('Viral Growth & Retention modules (LiveEgyptTicker, ShareResultCard, useUserToolsMemory, manifest.js) work accurately', async () => {
  const { buildEgyptTickerItems } = await import('../../components/LiveEgyptTicker.jsx');
  const { buildWhatsAppShareMessage } = await import('../../components/ShareResultCard.jsx');
  const {
    toggleFavoriteToolSlug,
    recordCalculationHistoryEntry,
    MAX_HISTORY_ITEMS,
  } = await import('../../hooks/useUserToolsMemory.js');
  const { default: manifest } = await import('../../app/manifest.js');

  // 1. Live Egypt Ticker items
  const rawTickerItems = buildEgyptTickerItems({
    gold: { karat21: 3820, karat24: 4365, goldCoin8g: 30560 },
    currenciesToEgp: { USD: 50.5, SAR: 13.46 },
    energyAndUtilities: { fuel80: 20.75, fuel92: 22.25, fuel95: 24.0 },
  });
  const tickerItems = (rawTickerItems || []) as Array<{
    id: string;
    label: string;
    slug: string;
    priceFormatted: string;
    sparklinePoints: string;
    changePercent: string;
  }>;
  assert.ok(tickerItems.length >= 8);
  assert.equal(tickerItems[0]?.label, 'ذهب عيار 21');
  assert.equal(tickerItems[0]?.slug, 'comprehensive-gold-calculator');
  assert.ok(tickerItems[0]?.sparklinePoints?.length > 10);
  assert.ok(tickerItems[0]?.changePercent?.startsWith('+'));
  assert.equal(tickerItems[3]?.label, 'الدولار');
  assert.equal(tickerItems[3]?.slug, 'comprehensive-currency-converter');
  const steelItem = tickerItems.find((i) => i.id === 'steelTon' || i.id === 'steel-ton');
  assert.ok(steelItem);
  assert.equal(steelItem.slug, 'egypt-finishing-cost-calculator');
  const cementItem = tickerItems.find((i) => i.id === 'cementTon' || i.id === 'cement-ton');
  assert.ok(cementItem);
  assert.equal(cementItem.slug, 'egypt-finishing-cost-calculator');
  const gas92Item = tickerItems.find((i) => i.id === 'fuel92' || i.id === 'gas-92');
  assert.equal(gas92Item?.priceFormatted, '22.25');
  assert.equal(gas92Item?.slug, 'trip-fuel-cost-calculator');
  const gas95Item = tickerItems.find((i) => i.id === 'fuel95' || i.id === 'gas-95');
  assert.equal(gas95Item?.priceFormatted, '24.00');
  const gas80Item = tickerItems.find((i) => i.id === 'fuel80' || i.id === 'gas-80');
  assert.equal(gas80Item?.priceFormatted, '20.75');

  // Test buildEgyptTickerItems with explicit tickerConfig (visibility, ordering, custom label, and custom item)
  const rawCustomConfigTicker = buildEgyptTickerItems(
    {
      gold: { karat21: 3850 },
      currenciesToEgp: { USD: 50.5 },
    },
    {
      isEnabled: true,
      speed: 'fast',
      items: [
        { id: 'USD', label: 'الدولار في البنوك', visible: true, order: 1, targetSlug: 'comprehensive-currency-converter' },
        { id: 'karat21', label: 'عيار 21 استثماري', visible: true, order: 2, targetSlug: 'comprehensive-gold-calculator' },
        { id: 'fuel92', label: 'بنزين 92', visible: false, order: 3, targetSlug: 'trip-fuel-cost-calculator' },
      ],
      customItems: [
        { id: 'custom_1', label: 'سهم أرامكو', price: '32.50', priceFormatted: '32.50', unitLabel: 'ر.س', visible: true },
      ],
    }
  );
  const customConfigTicker = (rawCustomConfigTicker || []) as Array<{
    id: string;
    label: string;
    priceFormatted: string;
  }>;
  assert.equal(customConfigTicker.length, 3);
  assert.equal(customConfigTicker[0]?.id, 'USD');
  assert.equal(customConfigTicker[0]?.label, 'الدولار في البنوك');
  assert.equal(customConfigTicker[1]?.id, 'karat21');
  assert.equal(customConfigTicker[1]?.label, 'عيار 21 استثماري');
  assert.equal(customConfigTicker[2]?.label, 'سهم أرامكو');
  assert.equal(customConfigTicker[2]?.priceFormatted, '32.50');

  // 2. ShareResultCard WhatsApp message builder
  const waMsg = buildWhatsAppShareMessage({
    toolTitle: 'حاسبة الذهب والزكاة الشاملة',
    inputsSummary: '10 جرام عيار 21 بالمصنعية',
    resultPrimary: '39,300 ج.م',
    toolUrl: 'https://dixtools.com/#/gold/comprehensive-gold-calculator',
  });
  assert.ok(waMsg.includes('تم الحساب عبر منصة Dix Tools'));
  assert.ok(waMsg.includes('39,300 ج.م'));

  // 3. Favorites & 5-item calculation history
  let favs = toggleFavoriteToolSlug('comprehensive-gold-calculator', []);
  assert.deepEqual(favs, ['comprehensive-gold-calculator']);
  favs = toggleFavoriteToolSlug('comprehensive-currency-converter', favs);
  assert.equal(favs.length, 2);
  favs = toggleFavoriteToolSlug('comprehensive-gold-calculator', favs);
  assert.deepEqual(favs, ['comprehensive-currency-converter']);

  let history: unknown[] = [];
  for (let i = 1; i <= 7; i += 1) {
    history = recordCalculationHistoryEntry(
      {
        slug: `tool-${i}`,
        category: 'finance',
        toolTitle: `أداة رقم ${i}`,
        inputsSummary: `مدخل ${i}`,
        resultSummary: `${i * 1000} ج.م`,
      },
      history
    );
  }
  assert.equal(history.length, MAX_HISTORY_ITEMS);
  assert.equal((history[0] as { slug: string }).slug, 'tool-7');

  // 4. PWA Web App Manifest
  const pwaManifest = manifest();
  assert.equal(pwaManifest.short_name, 'Dix Tools');
  assert.equal(pwaManifest.background_color, '#0A0A0A');
  assert.equal(pwaManifest.theme_color, '#D4AF37');
  assert.equal(pwaManifest.display, 'standalone');
  assert.ok(pwaManifest.icons.length >= 2);
});

test('Strategic High-CPC Engines (Gold vs Bank Comparator, Vehicle Maintenance Tracker, 27-Gov Shipping AWB Generator, and Product Promo Studio) compute accurately', async () => {
  const {
    calculateInvestmentComparison,
    calculateVehicleMaintenanceSchedule,
    calculateShippingAwbSummary,
    EGYPT_27_GOVERNORATES,
    generateBarcodeBars,
  } = await import('./calculations');
  const { getToolBySlug } = await import('../../lib/tools-matrix-generator.js');

  // 1. Verify all 4 strategic Master Tools exist in tools-matrix-generator
  const invTool = getToolBySlug('gold', 'gold-vs-bank-comparator');
  assert.equal(invTool.slug, 'gold-vs-bank-comparator');
  assert.equal(invTool.engineType, 'investment-comparator');

  const maintTool = getToolBySlug('automotive', 'vehicle-maintenance-tracker');
  assert.equal(maintTool.slug, 'vehicle-maintenance-tracker');
  assert.equal(maintTool.engineType, 'vehicle-maintenance');

  const awbTool = getToolBySlug('documents', 'shipping-awb-generator');
  assert.equal(awbTool.slug, 'shipping-awb-generator');
  assert.equal(awbTool.engineType, 'shipping-awb');

  const promoTool = getToolBySlug('images', 'product-promo-badge-maker');
  assert.equal(promoTool.slug, 'product-promo-badge-maker');
  assert.equal(promoTool.engineType, 'promo-badge');

  // 2. Test Investment Comparison (Gold vs Bank 27% vs USD)
  const cmp = calculateInvestmentComparison({
    capitalAmountEgp: 250000,
    durationYears: 3,
    liveGold21Price: 3811,
    liveUsdRate: 50.45,
    bankCertificateYieldPercent: 27,
    expectedGoldAnnualGrowthPercent: 29,
    expectedUsdAnnualGrowthPercent: 18,
  });
  assert.equal(cmp.options.length, 3);
  assert.equal(cmp.winnerKey, 'gold');
  assert.ok(cmp.winnerHeadline.startsWith('الأفضل لك هو:'));
  assert.ok(cmp.goldGramsPurchased > 60);

  // 3. Test Vehicle Maintenance Schedule & Egyptian Traffic Licensing
  const schedule = calculateVehicleMaintenanceSchedule({
    vehicleType: 'car',
    currentOdometerKm: 64500,
    engineCc: 1600,
    licenseYears: 3,
  });
  assert.equal(schedule.parts.length, 5);
  assert.ok(schedule.parts.every((p) => p.wearPercent >= 0 && p.wearPercent <= 100));
  assert.ok(schedule.licensingEstimate.totalLicensingCostEgp > 1500);

  // 4. Test 27 Egyptian Governorates & Shipping AWB Summary
  assert.equal(EGYPT_27_GOVERNORATES.length, 27);
  const bars = generateBarcodeBars('DIX-2026-849201');
  assert.ok(bars.length > 30);

  const awb = calculateShippingAwbSummary({
    governorateId: 'ALX',
    codAmountEgp: 1500,
    weightKg: 2,
    piecesCount: 2,
    allowOpenPackage: true,
  });
  assert.equal(awb.governorate.name, 'الإسكندرية');
  assert.ok(awb.totalShippingFee >= 65);
  assert.equal(awb.netMerchantPayoutEgp, 1500 - awb.totalShippingFee);
});

test('God-Mode Master Admin Panel engines (No-Code Formula Builder, AdOps A/B CTR Stats, Bulk SEO Templates, 301/302 Redirects, and Cloud Sync API) work accurately', async () => {
  const {
    evaluateCustomToolFormula,
    computeAdPlacementCtrStats,
    renderBulkSeoTemplate,
    resolveRedirectRule,
  } = await import('./calculations');
  const {
    handleGetStealthConfig,
    handlePostStealthConfig,
  } = await import('../../app/api/stealth-config/route.js');
  const { MASTER_PIN_SHA256_HASH } = await import('../../lib/stealth-crypto.js');

  // 1. No-Code Formula Evaluator with custom variables + Egypt Live Oracle rates
  const formulaRes = evaluateCustomToolFormula(
    '(weight * karat21) + workmanship + (cementTons * cementTonEgp)',
    { weight: 10, workmanship: 1200, cementTons: 2 },
    { karat21: 3811, cementTonEgp: 2950 }
  );
  assert.equal(formulaRes.ok, true);
  // (10 * 3811) + 1200 + (2 * 2950) = 38110 + 1200 + 5900 = 45210
  assert.equal(formulaRes.value, 45210);
  assert.equal(formulaRes.formattedValue, '45,210.00');

  // Unsafe formula rejection
  const unsafeRes = evaluateCustomToolFormula('window.alert(1)', {}, {});
  assert.equal(unsafeRes.ok, false);

  // 2. AdOps CTR & A/B Split Testing Analytics
  const ctrStats = computeAdPlacementCtrStats(
    { impressions: 1000, clicks: 50 }, // 5.00%
    { impressions: 1000, clicks: 80 }  // 8.00%
  );
  assert.equal(ctrStats.totalImpressions, 2000);
  assert.equal(ctrStats.totalClicks, 130);
  assert.equal(ctrStats.overallCtrPercent, 6.5);
  assert.equal(ctrStats.variantACtrPercent, 5);
  assert.equal(ctrStats.variantBCtrPercent, 8);
  assert.equal(ctrStats.winningVariant, 'B');
  assert.equal(ctrStats.upliftPercent, 60);

  // 3. Bulk Programmatic SEO Template Renderer
  const seoTitle = renderBulkSeoTemplate(
    '{tool_name} - تحديث {current_date} | السعر {egypt_rate} | {year}',
    {
      tool_name: 'حاسبة الذهب الشاملة',
      current_date: 'نوفمبر 2026',
      egypt_rate: '3,811 ج.م',
      year: 2026,
    }
  );
  assert.equal(seoTitle, 'حاسبة الذهب الشاملة - تحديث نوفمبر 2026 | السعر 3,811 ج.م | 2026');

  // 4. 301 / 302 Redirects Resolver
  const redirectMatch = resolveRedirectRule('/old-gold-price', [
    {
      id: 'r1',
      fromPath: '/old-gold-price',
      toPath: '/gold/comprehensive-gold-calculator',
      statusCode: 301,
      active: true,
    },
  ]);
  assert.ok(redirectMatch);
  assert.equal(redirectMatch?.toPath, '/gold/comprehensive-gold-calculator');
  assert.equal(redirectMatch?.statusCode, 301);

  // 5. Stealth Cloud Config API
  const postRes = handlePostStealthConfig(
    {
      config: { version: '3.0.0-GodMode' },
      snapshots: [{ id: 's1', name: 'Test Snap' }],
    },
    MASTER_PIN_SHA256_HASH
  );
  assert.equal(postRes.status, 200);
  assert.equal(postRes.payload.ok, true);

  const getRes = handleGetStealthConfig();
  assert.equal(getRes.ok, true);
  assert.equal(getRes.snapshotsCount, 1);
});

test('7 New Interactive Client-Side Features (Egypt 27 Governorates Hub, Market Sentiment Poll, UTF-8 BOM Excel Exporter, Live Scanner & Batch Studio Master Tools) work accurately', async () => {
  const {
    EGYPT_27_GOVERNORATES,
    calculateEgyptInterGovernorateTrip,
    computeMarketSentimentPercentages,
    buildCsvStringWithBom,
  } = await import('./calculations');
  const { getToolBySlug } = await import('../../lib/tools-matrix-generator.js');

  // 1. All 27 Egyptian Governorates have landlineCode and postalCode
  assert.equal(EGYPT_27_GOVERNORATES.length, 27);
  assert.ok(
    EGYPT_27_GOVERNORATES.every(
      (g) => g.landlineCode.startsWith('0') && g.postalCode.length === 5
    )
  );

  // 2. Inter-Governorate Trip Calculator (Cairo -> Alexandria, 220 km, Fuel 92 @ 22.25 EGP)
  const trip = calculateEgyptInterGovernorateTrip({
    fromGovId: 'CAI',
    toGovId: 'ALX',
    isRoundTrip: false,
    fuelPricePerLiter: 22.25,
    consumptionPer100Km: 8.5,
    packageWeightKg: 2,
  });
  assert.equal(trip.oneWayDistanceKm, 220);
  assert.equal(trip.effectiveDistanceKm, 220);
  assert.equal(trip.fromGov.landlineCode, '02');
  assert.equal(trip.toGov.landlineCode, '03');
  assert.equal(trip.toGov.postalCode, '21500');
  // 220 * 8.5 / 100 = 18.7 L * 22.25 = 416.075 -> 416 EGP
  assert.equal(trip.fuelLitersNeeded, 18.7);
  assert.equal(trip.fuelTripCostEgp, 416);
  assert.ok(trip.commercialShippingCostEgp >= 65);

  // 3. Market Sentiment Poll Percentages
  const sentiment = computeMarketSentimentPercentages(180, 60);
  assert.equal(sentiment.totalVotes, 240);
  assert.equal(sentiment.upPercent, 75);
  assert.equal(sentiment.downPercent, 25);
  assert.equal(sentiment.dominantTrend, 'bullish');

  // 4. UTF-8 BOM CSV Exporter for Arabic Excel compatibility
  const csv = buildCsvStringWithBom(
    ['المحافظة', 'كود الأرضي'],
    [
      ['القاهرة', '02'],
      ['الإسكندرية, وسط', '03'],
    ]
  );
  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes('القاهرة,02'));
  assert.ok(csv.includes('"الإسكندرية, وسط",03'));

  // 5. Verify new Master Tools exist in tools-matrix-generator
  const govHub = getToolBySlug('automotive', 'egypt-governorates-hub');
  const scannerTool = getToolBySlug('digital', 'live-qr-barcode-scanner');
  const batchTool = getToolBySlug('images', 'batch-image-barcode-processor');
  assert.equal(govHub?.engineType, 'egypt-governorates-hub');
  assert.equal(scannerTool?.engineType, 'live-scanner');
  assert.equal(batchTool?.engineType, 'batch-processor');
});

test('Egypt Apartment Finishing Cost & Engineering BOQ Calculator (calculateEgyptFinishingBoq) computes 10 stages, condition adjustments, raw materials BOQ, and SEO tables accurately', async () => {
  const { calculateEgyptFinishingBoq } = await import('./calculations');
  const { getToolBySlug } = await import('../../lib/tools-matrix-generator.js');
  const { generatePreCalculatedRows } = await import('../../components/SEOSnippetTables.jsx');

  // 1. Verify Master Tool registration
  const finTool = getToolBySlug('units', 'egypt-finishing-cost-calculator');
  assert.ok(finTool);
  assert.equal(finTool.slug, 'egypt-finishing-cost-calculator');
  assert.equal(finTool.engineType, 'egypt-finishing');

  // 2. Core & Shell vs Semi-Finished vs Renovation for a 150 m² apartment (Super Lux)
  const baseInput = {
    grossAreaSqm: 150,
    netAreaRatioPercent: 82,
    propertyType: 'apartment' as const,
    roomsCount: 3,
    bathroomsCount: 2,
    receptionPiecesCount: 2,
    currentCondition: 'core-shell' as const,
    finishingGrade: 'super-lux' as const,
    customOptions: {
      includeGypsumBoard: true,
      includeAlumetal: true,
      includeArmoredDoor: true,
      includeAcPreInstall: true,
      engineeringSupervisionPercent: 10,
    },
  };

  const coreShellRes = calculateEgyptFinishingBoq(baseInput);
  assert.equal(coreShellRes.grossAreaSqm, 150);
  assert.equal(coreShellRes.netAreaSqm, 123);
  assert.equal(coreShellRes.stages.length, 10);
  assert.ok(coreShellRes.totalEstimatedCostEgp > 400000);
  assert.ok(coreShellRes.minEstimatedCostEgp < coreShellRes.totalEstimatedCostEgp);
  assert.ok(coreShellRes.maxEstimatedCostEgp > coreShellRes.totalEstimatedCostEgp);
  assert.equal(coreShellRes.materialsSharePercent + coreShellRes.laborSharePercent, 100);

  // Stage 4 (Plastering) should be active in core-shell and 0 in semi-finished
  const plasterCore = coreShellRes.stages.find((s) => s.id === 'plastering-works');
  assert.ok(plasterCore && plasterCore.totalCostEgp > 0);

  const semiRes = calculateEgyptFinishingBoq({
    ...baseInput,
    currentCondition: 'semi-finished',
  });
  const plasterSemi = semiRes.stages.find((s) => s.id === 'plastering-works');
  assert.equal(plasterSemi?.totalCostEgp, 0);
  assert.ok(semiRes.totalEstimatedCostEgp < coreShellRes.totalEstimatedCostEgp);

  // Renovation should add demolition & debris removal in Stage 1
  const renoRes = calculateEgyptFinishingBoq({
    ...baseInput,
    currentCondition: 'renovation',
  });
  const stage1Reno = renoRes.stages.find((s) => s.id === 'demolition-debris');
  const stage1Core = coreShellRes.stages.find((s) => s.id === 'demolition-debris');
  assert.ok((stage1Reno?.totalCostEgp || 0) > (stage1Core?.totalCostEgp || 0));

  // 3. Raw Materials BOQ Estimator checks
  const boq = coreShellRes.rawMaterialsBoq;
  assert.ok(boq.cementBags50Kg >= 30);
  assert.ok(boq.sandCubicMeters >= 6);
  assert.ok(boq.wire15mmRolls >= 2);
  assert.ok(boq.wire2mmAnd3mmRolls >= 3);
  assert.ok(boq.wire4mmAnd6mmRolls >= 2);
  assert.ok(boq.flooringSqmWithWaste > coreShellRes.netAreaSqm);
  assert.ok(boq.wallsBathKitchenSqm >= 50);
  assert.ok(boq.sealerPails >= 2);
  assert.ok(boq.puttyPails >= 4);
  assert.ok(boq.emulsionPaintPails >= 3);

  // 4. Pre-calculated SEO Table rows for egypt-finishing
  const seoRows = generatePreCalculatedRows(finTool, {
    constructionAndMaterials: {
      costPerSqmEconomic: 3850,
      costPerSqmSuperLux: 5950,
      costPerSqmUltraLux: 9400,
    },
  });
  assert.equal(seoRows.length, 10);
  assert.ok(seoRows.some((r: { col1: string }) => r.col1.includes('100 متر')));
  assert.ok(seoRows.some((r: { col1: string }) => r.col1.includes('120 متر')));
  assert.ok(seoRows.some((r: { col1: string }) => r.col1.includes('150 متر')));
  assert.ok(seoRows.some((r: { col1: string }) => r.col1.includes('200 متر')));
});

test('48 New Expanded Master Hub Tools (ExpandedMasterEngines) register with isMasterTool=true, zero duplicates, and accurate calculations', async () => {
  const { getMasterTools } = await import('../../lib/tools-matrix-generator.js');
  const { resolveSmartConciergeQuery } = await import('../../lib/arabic-intent-matcher.js');
  const {
    EXPANDED_48_SLUGS,
    analyzeEgyptNationalId,
    calculateBatteryPackAndBms,
    calculateRideDriverProfit,
    calculateCodShippingReconciliation,
    calculateRoscaGameyaSchedule,
    calculateEgyptSalaryTax,
    calculateAcBtuAndHorsepower,
  } = await import('../../components/engines/ExpandedMasterEngines.jsx');

  const masters = getMasterTools();
  assert.equal(EXPANDED_48_SLUGS.size, 49);

  // Verify every single one of the 48 slugs exists in getMasterTools() with isMasterTool: true
  const slugSet = new Set(masters.map((t: { slug: string }) => t.slug));
  assert.equal(slugSet.size, masters.length, 'All Master Hub Tool slugs must be 100% unique');

  for (const slug of EXPANDED_48_SLUGS) {
    const found = masters.find((t: { slug: string }) => t.slug === slug);
    assert.ok(found, `Missing expanded master tool: ${slug}`);
    assert.equal(found.isMasterTool, true);
    assert.ok(Array.isArray(found.faqs) && found.faqs.length >= 3);
  }

  // 1. Egypt National ID Analyzer
  const idRes = analyzeEgyptNationalId('29507150101234', new Date('2026-11-08T12:00:00Z'));
  assert.equal(idRes.isValid, true);
  assert.equal(idRes.birthYear, 1995);
  assert.equal(idRes.birthMonth, 7);
  assert.equal(idRes.birthDay, 15);
  assert.equal(idRes.governorateName, 'القاهرة');
  assert.equal(idRes.gender, 'ذكر');
  assert.equal(idRes.retirementYear, 2055);

  // 2. Lithium Battery Pack & BMS (3S4P)
  const bmsRes = calculateBatteryPackAndBms({
    cellChemistry: 'li-ion-3.7',
    seriesCountS: 3,
    parallelCountP: 4,
    singleCellCapacityMah: 2500,
    singleCellMaxDischargeAmp: 10,
    connectedLoadWatts: 50,
  });
  assert.equal(bmsRes.configCode, '3S4P');
  assert.equal(bmsRes.totalCellsCount, 12);
  assert.equal(bmsRes.nominalVoltage, 11.1);
  assert.equal(bmsRes.maxChargeVoltage, 12.6);
  assert.equal(bmsRes.totalCapacityAh, 10);
  assert.equal(bmsRes.totalEnergyWh, 111);

  // 3. Ride-Share Driver Profit
  const captainRes = calculateRideDriverProfit({
    vehicleType: 'car',
    dailyGrossRevenueEgp: 1500,
    dailyDistanceKm: 200,
    appCommissionPercent: 20,
    fuelPricePerLiter: 22.25,
    consumptionPer100Km: 8,
    workingDaysPerMonth: 25,
    dailyWorkHours: 10,
    oilAndMaintenancePerKmEgp: 0.5,
  });
  assert.equal(captainRes.dailyFuelLiters, 16);
  assert.equal(captainRes.dailyFuelCostEgp, 356);
  assert.equal(captainRes.dailyAppCommissionEgp, 300);
  assert.equal(captainRes.dailyMaintenanceDepreciationEgp, 100);
  assert.equal(captainRes.netDailyProfitEgp, 744);
  assert.equal(captainRes.netMonthlyProfitEgp, 18600);

  // 4. COD Shipping Reconciliation
  const codRes = calculateCodShippingReconciliation({
    deliveredOrdersCount: 100,
    returnedOrdersCount: 10,
    pendingOrdersCount: 5,
    avgOrderCodValueEgp: 500,
    shippingFeePerOrderEgp: 60,
    returnFeePerOrderEgp: 30,
    codCollectionFeePercent: 1,
    actualCompanyPayoutEgp: 42500,
  });
  assert.equal(codRes.grossCollectedCodEgp, 50000);
  assert.equal(codRes.deliveredShippingTotalEgp, 6000);
  assert.equal(codRes.returnedPenaltyTotalEgp, 300);
  assert.equal(codRes.codCollectionFeeTotalEgp, 500);
  assert.equal(codRes.expectedNetPayoutEgp, 43200);
  assert.equal(codRes.payoutVarianceEgp, -700);
  assert.equal(codRes.hasShortage, true);

  // 5. ROSCA Gameya, Egypt Salary Tax, and AC BTU
  const gameya = calculateRoscaGameyaSchedule({ monthlyShareEgp: 2000, membersCount: 12 });
  assert.equal(gameya.grossMonthlyPotEgp, 24000);
  assert.equal(gameya.schedule.length, 12);

  const sal = calculateEgyptSalaryTax({ calcDirection: 'gross-to-net', monthlySalaryEgp: 15000 });
  assert.ok(sal.netMonthlySalary > 11000 && sal.netMonthlySalary < 15000);

  const ac = calculateAcBtuAndHorsepower({ roomLengthM: 5, roomWidthM: 4, ceilingHeightM: 3 });
  assert.ok(ac.recommendedHorsepower >= 1.5);

  // 6. AI Concierge semantic routing to expanded tools
  const qId = resolveSmartConciergeQuery('تحليل الرقم القومي المصري');
  assert.equal(qId.matchedTool.slug, 'egypt-national-id-analyzer');
});

test('ProductPromoStudio (`product-promo-badge-maker`) provides all 16 distinct templates, 3 canvas sizes, discount calculations, and Auto White-BG pixel manipulation', async () => {
  const {
    PROMO_STUDIO_TEMPLATES,
    CANVAS_SIZE_PRESETS,
    PROMO_CIRCULAR_STAMPS,
    PROMO_CORNER_RIBBONS,
    calculatePromoDiscountMetrics,
    removeWhiteBackgroundFromImageData,
  } = await import('../../components/tools/ProductPromoStudio.jsx');

  // 1. Verify all 16 requested templates exist with exact IDs
  assert.equal(PROMO_STUDIO_TEMPLATES.length, 16);
  const expectedTemplateIds = [
    'luxury-black-gold',
    'white-friday-mega',
    'okazion-clearance',
    'ramadan-eid-special',
    'cyber-neon-tech',
    'vip-exclusive-card',
    'flash-sale-timer',
    'bundle-bogo-offer',
    'free-shipping-cod',
    'minimal-clean-insta',
    'new-arrival-podium',
    'best-seller-guarantee',
    'half-price-50',
    'auto-moto-parts',
    'story-reels-vertical',
    'before-after-split',
  ];
  for (const id of expectedTemplateIds) {
    const found = PROMO_STUDIO_TEMPLATES.find((t: { id: string }) => t.id === id);
    assert.ok(found, `Missing template ID: ${id}`);
  }

  // 2. Verify 3 Canvas Size Presets (1080x1080, 1080x1920, 1200x628)
  assert.equal(CANVAS_SIZE_PRESETS.length, 3);
  assert.equal(CANVAS_SIZE_PRESETS[0].width, 1080);
  assert.equal(CANVAS_SIZE_PRESETS[0].height, 1080);
  assert.equal(CANVAS_SIZE_PRESETS[1].width, 1080);
  assert.equal(CANVAS_SIZE_PRESETS[1].height, 1920);
  assert.equal(CANVAS_SIZE_PRESETS[2].width, 1200);
  assert.equal(CANVAS_SIZE_PRESETS[2].height, 628);

  // 3. Stamps & Corner Ribbons
  assert.equal(PROMO_CIRCULAR_STAMPS.length, 5);
  assert.equal(PROMO_CORNER_RIBBONS.length, 4);

  // 4. Discount calculation metrics
  const disc = calculatePromoDiscountMetrics(4850, 2425);
  assert.equal(disc.isDiscountValid, true);
  assert.equal(disc.discountAmount, 2425);
  assert.equal(disc.discountPercent, 50);

  // 5. Auto White-BG Remover pixel manipulation
  // Create 2 pixels: pixel 0 is pure white (255,255,255,255), pixel 1 is dark gold (212,175,55,255)
  const sampleRgba = new Uint8ClampedArray([255, 255, 255, 255, 212, 175, 55, 255]);
  const removed = removeWhiteBackgroundFromImageData(sampleRgba, 236);
  assert.equal(removed, 1);
  assert.equal(sampleRgba[3], 0); // White pixel alpha became 0
  assert.equal(sampleRgba[7], 255); // Gold pixel alpha remained 255
});

test('SiteQADiagnosticSuite (`runMasterToolsEngineStressTest`) stress-tests all 108 Master Hub Tools with zero NaN or undefined results', async () => {
  const { runMasterToolsEngineStressTest } = await import(
    '../../components/admin/SiteQADiagnosticSuite.jsx'
  );
  const { getMasterTools } = await import('../../lib/tools-matrix-generator.js');

  const masterTools = getMasterTools();
  assert.equal(masterTools.length, 108);

  const report = runMasterToolsEngineStressTest(masterTools, {
    gold: { karat21: 3811, karat24: 4355 },
    currenciesToEgp: { USD: 50.45 },
    energyAndUtilities: { fuel80: 20.75, fuel92: 22.25, fuel95: 24.0, diesel: 19.5 },
  });

  assert.equal(report.totalTools, 108);
  assert.equal(report.passedCount, 108);
  assert.equal(report.failedCount, 0);
  assert.equal(report.allPassed, true);

  for (const row of report.toolResults) {
    assert.equal(row.passed, true, `Tool ${row.slug} failed QA stress test`);
    assert.ok(Number.isFinite(row.sampleOutput), `Tool ${row.slug} returned NaN`);
  }
});

test('Revenue Recovery & Automation Pack: Dropshipping ROAS Engine, Webhook Broadcaster, Floating Scratchpad, and External Widget Embed', async () => {
  const {
    calculateDropshippingAffiliatePricing,
    buildEgyptLiveRatesBroadcastPayload,
  } = await import('./calculations');
  const { computeScratchpadSummary } = await import('../../components/FloatingScratchpad.jsx');
  const { buildEgyptWidgetIframeCode } = await import(
    '../../app/embed/egypt-rates-widget/page.jsx'
  );

  // 1. Dropshipping, Affiliate & E-Commerce Pricing Engine
  const drop = calculateDropshippingAffiliatePricing({
    productCostCogsEgp: 300,
    packagingCostEgp: 20,
    platformCommissionPercent: 10,
    shippingFeeDeliveredEgp: 60,
    returnShippingFeeRtoEgp: 30,
    deliverySuccessRatePercent: 80,
    adSpendCpaPerOrderEgp: 100,
    targetNetMarginPercent: 25,
    sellingPriceEgp: 750,
    expectedMonthlyOrdersShipped: 200,
  });

  assert.ok(drop.recommendedSellingPriceEgp > 600);
  assert.ok(drop.breakEvenRoas > 1);
  assert.equal(drop.deliveredOrdersMonthly, 160);
  assert.equal(drop.returnedOrdersMonthly, 40);
  assert.ok(Number.isFinite(drop.expectedMonthlyNetProfitEgp));

  // 2. Webhook & Telegram Broadcast Payload Builder
  const broadcast = buildEgyptLiveRatesBroadcastPayload(
    {
      gold: { karat21: 3811, karat24: 4355, karat18: 3267, goldCoin8g: 30488 },
      currenciesToEgp: { USD: 50.45, SAR: 13.45 },
      energyAndUtilities: { fuel80: 20.75, fuel92: 22.25, fuel95: 24.0, diesel: 19.5 },
    },
    'https://dix-tools.vercel.app'
  );

  assert.equal(broadcast.jsonPayload.goldEgp.karat21, 3811);
  assert.equal(broadcast.jsonPayload.currenciesToEgp.USD, 50.45);
  assert.equal(broadcast.jsonPayload.fuelPricesEgp.fuel92, 22.25);
  assert.ok(broadcast.formattedMessage.includes('Dix Tools'));
  assert.ok(
    broadcast.formattedMessage.includes('3,811') || broadcast.formattedMessage.includes('3811')
  );

  // 3. Floating Scratchpad cumulative summary
  const summary = computeScratchpadSummary([
    { id: '1', label: 'ذهب عيار 21', value: 3811 },
    { id: '2', label: 'قسط شهري', value: 6189 },
  ]);
  assert.equal(summary.countNumeric, 2);
  assert.equal(summary.sumNumeric, 10000);
  assert.equal(summary.averageNumeric, 5000);

  // 4. External Egypt Rates Widget iframe snippet
  const iframeCode = buildEgyptWidgetIframeCode('https://dix-tools.vercel.app');
  assert.ok(iframeCode.includes('/#/embed/egypt-rates-widget'));
  assert.ok(iframeCode.includes('تحديث لحظي عبر منصة Dix Tools'));
});

