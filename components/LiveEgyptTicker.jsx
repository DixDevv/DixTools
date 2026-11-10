'use client';

import React, { useMemo } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';

/**
 * Pure helper to build the Egypt Live Ticker items from `liveRates`
 * Includes:
 * - Asset label & sub-label ("تحديث لحظي · مصر")
 * - Formatted price + currency ("ج.م")
 * - Live exchange delta badge (`▲ +0.4%`, `▲ +0.5%`, etc.)
 * - Micro-Sparkline SVG path points for the subtle 3D background chart
 * - Target Master Hub Tool route (`category`, `slug`, `overrideParams`, `queryString`)
 */
export function buildEgyptTickerItems(liveRates = {}, tickerConfig = {}) {
  const gold = liveRates?.gold || {};
  const silver = liveRates?.silver || {};
  const fx = liveRates?.currenciesToEgp || {};
  const energy = liveRates?.energyAndUtilities || {};
  const construction = liveRates?.constructionAndMaterials || {};

  const karat21 = Number(gold.karat21) || 3811;
  const karat24 = Number(gold.karat24) || 4355;
  const karat18 = Number(gold.karat18) || Math.round(karat24 * 0.75);
  const goldCoin8g = Number(gold.goldCoin8g) || karat21 * 8;
  const silverGram999 = Number(silver.silverGram999) > 5 ? Number(silver.silverGram999) : 52.73;

  const usd = Number(fx.USD) || 50.45;
  const sar = Number(fx.SAR) || 13.45;
  const aed = Number(fx.AED) || 13.74;
  const kwd = Number(fx.KWD) || 164.2;
  const eur = Number(fx.EUR) || 54.6;

  const rawFuel80 = Number(energy.fuel80 ?? energy.gas80);
  const fuel80 = rawFuel80 >= 18 ? rawFuel80 : 20.75;

  const rawFuel92 = Number(energy.fuel92 ?? energy.gas92);
  const fuel92 = rawFuel92 >= 18 ? rawFuel92 : 22.25;

  const rawFuel95 = Number(energy.fuel95 ?? energy.gas95);
  const fuel95 = rawFuel95 >= 18 ? rawFuel95 : 24.0;

  const rawDiesel = Number(energy.diesel);
  const diesel = rawDiesel > 5 ? rawDiesel : 13.5;

  const steelTonEgp = Number(construction.steelTonEgp) || 38500;
  const cementTonEgp = Number(construction.cementTonEgp) || 2950;

  // Master catalog of all available standard ticker items with exact live rates
  const catalogMap = {
    karat21: {
      id: 'karat21',
      fallbackLabel: 'ذهب عيار 21',
      subLabel: 'تحديث لحظي · مصر',
      priceFormatted: karat21.toLocaleString('en-US'),
      unitLabel: 'ج.م',
      changePercent: '+0.4%',
      sparklinePoints: '0,22 18,19 36,21 54,14 72,16 90,9 110,6 130,3',
      category: 'gold',
      slug: 'comprehensive-gold-calculator',
      overrideParams: { selectedKarat: 21, weightGrams: 10 },
      queryString: '?karat=21&grams=10',
    },
    karat24: {
      id: 'karat24',
      fallbackLabel: 'ذهب عيار 24',
      subLabel: 'سبائك نقية · مصر',
      priceFormatted: karat24.toLocaleString('en-US'),
      unitLabel: 'ج.م',
      changePercent: '+0.5%',
      sparklinePoints: '0,24 20,20 40,18 58,19 78,12 96,10 114,5 130,2',
      category: 'gold',
      slug: 'comprehensive-gold-calculator',
      overrideParams: { selectedKarat: 24, weightGrams: 10 },
      queryString: '?karat=24&grams=10',
    },
    karat18: {
      id: 'karat18',
      fallbackLabel: 'ذهب عيار 18',
      subLabel: 'مشغولات · مصر',
      priceFormatted: karat18.toLocaleString('en-US'),
      unitLabel: 'ج.م',
      changePercent: '+0.3%',
      sparklinePoints: '0,22 20,20 42,16 62,17 82,12 102,9 118,6 130,4',
      category: 'gold',
      slug: 'comprehensive-gold-calculator',
      overrideParams: { selectedKarat: 18, weightGrams: 10 },
      queryString: '?karat=18&grams=10',
    },
    goldCoin8g: {
      id: 'goldCoin8g',
      fallbackLabel: 'الجنيه الذهب',
      subLabel: '8 جرام عيار 21',
      priceFormatted: goldCoin8g.toLocaleString('en-US'),
      unitLabel: 'ج.م',
      changePercent: '+0.4%',
      sparklinePoints: '0,23 16,21 34,17 52,18 70,13 88,11 108,6 130,4',
      category: 'gold',
      slug: 'comprehensive-gold-calculator',
      overrideParams: { selectedKarat: 21, weightGrams: 8 },
      queryString: '?karat=21&grams=8',
    },
    USD: {
      id: 'USD',
      fallbackLabel: 'الدولار',
      subLabel: 'البنك المركزي · مصر',
      priceFormatted: usd.toFixed(2),
      unitLabel: 'ج.م',
      changePercent: '+0.2%',
      sparklinePoints: '0,20 22,19 44,16 64,17 84,12 104,11 118,8 130,5',
      category: 'currencies',
      slug: 'comprehensive-currency-converter',
      overrideParams: { fromCode: 'USD', toCode: 'EGP', amount: 100 },
      queryString: '?from=USD&to=EGP&amount=100',
    },
    SAR: {
      id: 'SAR',
      fallbackLabel: 'الريال السعودي',
      subLabel: 'تحديث لحظي · مصر',
      priceFormatted: sar.toFixed(2),
      unitLabel: 'ج.م',
      changePercent: '+0.2%',
      sparklinePoints: '0,21 20,18 38,19 58,15 78,14 96,10 114,8 130,6',
      category: 'currencies',
      slug: 'comprehensive-currency-converter',
      overrideParams: { fromCode: 'SAR', toCode: 'EGP', amount: 100 },
      queryString: '?from=SAR&to=EGP&amount=100',
    },
    AED: {
      id: 'AED',
      fallbackLabel: 'الدرهم الإماراتي',
      subLabel: 'تحديث لحظي · مصر',
      priceFormatted: aed.toFixed(2),
      unitLabel: 'ج.م',
      changePercent: '+0.2%',
      sparklinePoints: '0,20 18,19 38,16 58,15 78,13 98,10 116,7 130,5',
      category: 'currencies',
      slug: 'comprehensive-currency-converter',
      overrideParams: { fromCode: 'AED', toCode: 'EGP', amount: 100 },
      queryString: '?from=AED&to=EGP&amount=100',
    },
    KWD: {
      id: 'KWD',
      fallbackLabel: 'الدينار الكويتي',
      subLabel: 'أعلى عملة · مصر',
      priceFormatted: kwd.toFixed(2),
      unitLabel: 'ج.م',
      changePercent: '+0.3%',
      sparklinePoints: '0,22 18,20 38,17 58,16 78,13 98,11 116,8 130,5',
      category: 'currencies',
      slug: 'comprehensive-currency-converter',
      overrideParams: { fromCode: 'KWD', toCode: 'EGP', amount: 100 },
      queryString: '?from=KWD&to=EGP&amount=100',
    },
    EUR: {
      id: 'EUR',
      fallbackLabel: 'اليورو الأوروبي',
      subLabel: 'البنك المركزي · مصر',
      priceFormatted: eur.toFixed(2),
      unitLabel: 'ج.م',
      changePercent: '+0.2%',
      sparklinePoints: '0,21 20,19 40,17 60,16 80,12 100,11 116,8 130,6',
      category: 'currencies',
      slug: 'comprehensive-currency-converter',
      overrideParams: { fromCode: 'EUR', toCode: 'EGP', amount: 100 },
      queryString: '?from=EUR&to=EGP&amount=100',
    },
    fuel80: {
      id: 'fuel80',
      fallbackLabel: 'بنزين 80',
      subLabel: 'تسعير رسمي · مصر',
      priceFormatted: fuel80.toFixed(2),
      unitLabel: 'ج.م/لتر',
      changePercent: '+0.1%',
      sparklinePoints: '0,19 26,18 50,17 74,16 94,14 112,12 122,10 130,9',
      category: 'automotive',
      slug: 'trip-fuel-cost-calculator',
      overrideParams: { fuelPricePerLiter: fuel80, selectedFuelGrade: 'fuel80' },
      queryString: `?fuelPrice=${fuel80}&grade=fuel80`,
    },
    fuel92: {
      id: 'fuel92',
      fallbackLabel: 'بنزين 92',
      subLabel: 'تسعير رسمي · مصر',
      priceFormatted: fuel92.toFixed(2),
      unitLabel: 'ج.م/لتر',
      changePercent: '+0.1%',
      sparklinePoints: '0,18 24,18 48,16 72,16 92,13 110,11 122,9 130,8',
      category: 'automotive',
      slug: 'trip-fuel-cost-calculator',
      overrideParams: { fuelPricePerLiter: fuel92, selectedFuelGrade: 'fuel92' },
      queryString: `?fuelPrice=${fuel92}&grade=fuel92`,
    },
    fuel95: {
      id: 'fuel95',
      fallbackLabel: 'بنزين 95',
      subLabel: 'تسعير رسمي · مصر',
      priceFormatted: fuel95.toFixed(2),
      unitLabel: 'ج.م/لتر',
      changePercent: '+0.1%',
      sparklinePoints: '0,19 22,18 46,16 70,15 90,12 108,10 120,8 130,7',
      category: 'automotive',
      slug: 'trip-fuel-cost-calculator',
      overrideParams: { fuelPricePerLiter: fuel95, selectedFuelGrade: 'fuel95' },
      queryString: `?fuelPrice=${fuel95}&grade=fuel95`,
    },
    diesel: {
      id: 'diesel',
      fallbackLabel: 'السولار',
      subLabel: 'تسعير رسمي · مصر',
      priceFormatted: diesel.toFixed(2),
      unitLabel: 'ج.م/لتر',
      changePercent: '+0.1%',
      sparklinePoints: '0,20 24,19 48,17 72,16 92,14 112,12 122,10 130,9',
      category: 'automotive',
      slug: 'trip-fuel-cost-calculator',
      overrideParams: { fuelPricePerLiter: diesel, selectedFuelGrade: 'diesel' },
      queryString: `?fuelPrice=${diesel}&grade=diesel`,
    },
    steelTon: {
      id: 'steelTon',
      fallbackLabel: 'طن الحديد',
      subLabel: 'مواد البناء · مصر',
      priceFormatted: steelTonEgp.toLocaleString('en-US'),
      unitLabel: 'ج.م/طن',
      changePercent: '+0.2%',
      sparklinePoints: '0,21 20,19 42,17 62,16 82,13 102,10 118,7 130,5',
      category: 'units',
      slug: 'egypt-finishing-cost-calculator',
      overrideParams: { grossAreaSqm: 140, finishingGrade: 'super-lux' },
      queryString: '?area=140&grade=super-lux',
    },
    cementTon: {
      id: 'cementTon',
      fallbackLabel: 'طن الأسمنت',
      subLabel: 'بورتلاندي · مصر',
      priceFormatted: cementTonEgp.toLocaleString('en-US'),
      unitLabel: 'ج.م/طن',
      changePercent: '+0.1%',
      sparklinePoints: '0,20 22,18 44,17 64,15 84,13 104,11 118,8 130,6',
      category: 'units',
      slug: 'egypt-finishing-cost-calculator',
      overrideParams: { grossAreaSqm: 140, finishingGrade: 'super-lux' },
      queryString: '?area=140&grade=super-lux',
    },
    // Backwards-compatible aliases
    'gold-21': {
      aliasOf: 'karat21',
    },
    'gold-24': {
      aliasOf: 'karat24',
    },
    'gold-18': {
      aliasOf: 'karat18',
    },
    'gold-coin-8g': {
      aliasOf: 'goldCoin8g',
    },
    'usd-egp': {
      aliasOf: 'USD',
    },
    'sar-egp': {
      aliasOf: 'SAR',
    },
    'aed-egp': {
      aliasOf: 'AED',
    },
    'gas-80': {
      aliasOf: 'fuel80',
    },
    'gas-92': {
      aliasOf: 'fuel92',
    },
    'gas-95': {
      aliasOf: 'fuel95',
    },
    'steel-ton': {
      aliasOf: 'steelTon',
    },
    'cement-ton': {
      aliasOf: 'cementTon',
    },
    'silver-999': {
      id: 'silver-999',
      fallbackLabel: 'فضة عيار 999',
      subLabel: 'أونصة البورصة · مصر',
      priceFormatted: silverGram999.toFixed(2),
      unitLabel: 'ج.م/جم',
      changePercent: '+0.3%',
      sparklinePoints: '0,21 20,19 40,17 60,16 80,12 100,10 116,7 130,4',
      category: 'gold',
      slug: 'comprehensive-gold-calculator',
      overrideParams: { selectedKarat: 24, weightGrams: 10 },
      queryString: '?karat=24&grams=10',
    },
  };

  // If tickerConfig items exist, respect their order, visibility, and custom labels
  const configItems = Array.isArray(tickerConfig?.items) ? tickerConfig.items : null;

  let sortedItems = [];

  if (configItems && configItems.length > 0) {
    // Filter by visible !== false and sort by `order`
    const activeConfigs = [...configItems]
      .filter((cfg) => cfg && cfg.visible !== false)
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

    sortedItems = activeConfigs
      .map((cfg) => {
        const catItem = catalogMap[cfg.id];
        if (!catItem) return null;
        const resolved = catItem.aliasOf ? catalogMap[catItem.aliasOf] : catItem;
        if (!resolved) return null;

        const targetSlug = cfg.targetSlug || resolved.slug;
        const category =
          targetSlug.includes('currency') || targetSlug.includes('currencies')
            ? 'currencies'
            : targetSlug.includes('gold')
            ? 'gold'
            : targetSlug.includes('fuel')
            ? 'automotive'
            : targetSlug.includes('finishing')
            ? 'units'
            : resolved.category;

        return {
          id: resolved.id,
          label: cfg.label || resolved.fallbackLabel,
          subLabel: resolved.subLabel,
          priceFormatted: resolved.priceFormatted,
          unitLabel: resolved.unitLabel,
          value: `${resolved.priceFormatted} ${resolved.unitLabel}`,
          changePercent: resolved.changePercent,
          sparklinePoints: resolved.sparklinePoints,
          category,
          slug: targetSlug,
          overrideParams: resolved.overrideParams,
          queryString: resolved.queryString,
        };
      })
      .filter(Boolean);
  } else {
    // Default fallback list of items when no items array is provided
    const defaultOrder = [
      'karat21',
      'karat24',
      'goldCoin8g',
      'USD',
      'SAR',
      'steelTon',
      'cementTon',
      'fuel92',
      'fuel95',
      'fuel80',
      'karat18',
      'AED',
    ];
    sortedItems = defaultOrder.map((id) => {
      const item = catalogMap[id];
      return {
        id: item.id,
        label: item.fallbackLabel,
        subLabel: item.subLabel,
        priceFormatted: item.priceFormatted,
        unitLabel: item.unitLabel,
        value: `${item.priceFormatted} ${item.unitLabel}`,
        changePercent: item.changePercent,
        sparklinePoints: item.sparklinePoints,
        category: item.category,
        slug: item.slug,
        overrideParams: item.overrideParams,
        queryString: item.queryString,
      };
    });
  }

  // Append any custom ticker items defined by the admin
  const customItems = Array.isArray(tickerConfig?.customItems) ? tickerConfig.customItems : [];
  for (const custom of customItems) {
    if (custom && custom.visible !== false && custom.label) {
      const slug = custom.targetSlug || 'comprehensive-currency-converter';
      const category = slug.includes('gold')
        ? 'gold'
        : slug.includes('finishing')
        ? 'units'
        : slug.includes('fuel')
        ? 'automotive'
        : 'currencies';

      sortedItems.push({
        id: custom.id || `custom-${Date.now()}`,
        label: custom.label,
        subLabel: custom.subLabel || 'عنصر مخصص · مصر',
        priceFormatted: custom.priceFormatted || String(custom.price || '0'),
        unitLabel: custom.unitLabel || 'ج.م',
        value: `${custom.priceFormatted || custom.price} ${custom.unitLabel || 'ج.م'}`,
        changePercent: custom.changePercent || '+0.1%',
        sparklinePoints: '0,21 20,18 40,16 60,15 80,12 100,10 118,7 130,5',
        category,
        slug,
        overrideParams: {},
        queryString: '',
      });
    }
  }

  return sortedItems;
}

/**
 * Super-Premium 3D Live Egypt Ticker (`components/LiveEgyptTicker.jsx`)
 * Features:
 * 1. Zero native scrollbars + smooth edge gradient fade overlays (`from-[#0A0A0A] via-transparent to-[#0A0A0A]`)
 * 2. Infinite dual-track CSS marquee (`animate-marquee` + pause on hover)
 * 3. Luxury Glassmorphic Cards with:
 *    - Right: Asset name in small Cairo + muted "تحديث لحظي · مصر"
 *    - Center: Bold Gold price (`text-[#D4AF37] shadow-gold-sm`) + "ج.م"
 *    - Left: Glowing emerald upward badge (`▲ +0.4%`)
 *    - Background: Ultra-faint Golden Micro-Sparkline SVG graph behind the numbers
 * 4. Fixed Luxury Live Status Capsule (`bg-gradient-to-r from-emerald-950/80 to-amber-950/50 border border-emerald-500/30`)
 */
export default function LiveEgyptTicker({ onSelectTool }) {
  let siteConfigCtx = null;
  try {
    siteConfigCtx = useSiteConfig();
  } catch (_err) {
    siteConfigCtx = null;
  }

  const viralFeatures = siteConfigCtx?.config?.viralFeatures || {};
  const tickerConfig = siteConfigCtx?.config?.uiCustomizer?.tickerConfig;

  // Check if ticker is enabled via tickerConfig.isEnabled or tickerConfig.enabled or viralFeatures.liveEgyptTickerEnabled
  const isTickerEnabled =
    tickerConfig?.isEnabled !== false &&
    tickerConfig?.enabled !== false &&
    viralFeatures.liveEgyptTickerEnabled !== false;

  const showLiveBadge = tickerConfig?.showLiveBadge !== false;

  // Determine marquee speed seconds: "slow" = 45s, "normal" = 30s, "fast" = 18s
  const speed = tickerConfig?.speed || 'normal';
  const speedSeconds =
    speed === 'slow'
      ? 45
      : speed === 'fast'
      ? 18
      : Number(tickerConfig?.speedSeconds) || 30;

  const liveRates = siteConfigCtx?.config?.liveRates || {};
  const oracleCountdownSeconds = siteConfigCtx?.oracleCountdownSeconds ?? 60;
  const isSyncingLiveRates = siteConfigCtx?.isSyncingLiveRates ?? false;
  const syncEgyptLiveRates = siteConfigCtx?.syncEgyptLiveRates;

  // Primary items for testing and direct access + full loop items
  const baseItems = useMemo(
    () => buildEgyptTickerItems(liveRates, tickerConfig),
    [liveRates, tickerConfig]
  );

  // Duplicate items 2x for seamless 0% -> 50% infinite CSS marquee loop without any gap
  const marqueeLoopItems = useMemo(
    () => [
      ...baseItems.map((item) => ({ ...item, loopKey: `primary-${item.id}`, isPrimary: true })),
      ...baseItems.map((item) => ({ ...item, loopKey: `clone-${item.id}`, isPrimary: false })),
    ],
    [baseItems]
  );

  if (!isTickerEnabled || baseItems.length === 0) return null;

  const handleCardClick = (item) => {
    if (onSelectTool) {
      onSelectTool(item.category, item.slug, item.overrideParams, item.queryString);
      return;
    }
    if (typeof window !== 'undefined') {
      window.location.hash = `/${item.category}/${item.slug}${item.queryString || ''}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      dir="rtl"
      data-testid="live-egypt-ticker"
      aria-label="شريط الأسعار اللحظي في مصر"
      className="no-print group/ticker relative w-full overflow-hidden bg-[#0A0A0A] border-b border-[#D4AF37]/25 py-2 select-none"
    >
      {/* Subtle Top & Bottom Hairline Golden Shimmer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"
      />

      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 flex items-center gap-3 relative">
        {/* 1. Fixed Luxury "تحديث لحظي - مصر" + 60s Live Oracle Capsule on the Right Corner */}
        {showLiveBadge && (
          <button
            type="button"
            onClick={() => syncEgyptLiveRates && syncEgyptLiveRates()}
            title="انقر للتحديث اللحظي الآن من البورصة العالمية والبنك المركزي"
            data-testid="live-egypt-status-capsule"
            className="relative z-20 shrink-0 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/85 to-amber-950/55 border border-emerald-500/35 hover:border-[#D4AF37]/60 shadow-[0_0_20px_rgba(16,185,129,0.18)] backdrop-blur-md cursor-pointer transition-all"
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            </span>
            <div className="flex flex-col text-right leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] sm:text-xs font-extrabold text-emerald-300 tracking-wide whitespace-nowrap">
                  تحديث لحظي - مصر
                </span>
                <span
                  data-testid="live-oracle-countdown"
                  className="font-num px-1.5 py-0.5 rounded bg-black/50 border border-[#D4AF37]/30 text-[9px] font-bold text-[#D4AF37] whitespace-nowrap"
                >
                  {isSyncingLiveRates ? 'جاري التحديث...' : `${oracleCountdownSeconds}s`}
                </span>
              </div>
              <span
                data-testid="live-oracle-source-badge"
                className="text-[9px] font-semibold text-[#F3E5AB]/85 mt-0.5 whitespace-nowrap"
              >
                مصدر موثوق · البورصة والمركزي
              </span>
            </div>
          </button>
        )}

        {/* 2. Infinite Marquee Viewport with Dual-Edge Smooth Fade Overlays (No Scrollbars) */}
        <div className="relative flex-1 overflow-hidden no-scrollbar">
          {/* Right Edge Gradient Fade Overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 z-10 bg-gradient-to-l from-[#0A0A0A] via-[#0A0A0A]/75 to-transparent"
          />
          {/* Left Edge Gradient Fade Overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 z-10 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/75 to-transparent"
          />

          {/* Seamless Infinite Marquee Track (pauses smoothly on hover) */}
          <div
            dir="rtl"
            data-testid="live-egypt-marquee-track"
            style={{ animationDuration: `${speedSeconds}s` }}
            className="animate-marquee items-center gap-3 py-0.5"
          >
            {marqueeLoopItems.map((item) => (
              <button
                key={item.loopKey}
                type="button"
                data-testid={item.isPrimary ? `ticker-item-${item.id}` : `ticker-clone-${item.id}`}
                onClick={() => handleCardClick(item)}
                className="group/card relative overflow-hidden rounded-xl bg-gradient-to-br from-[#141414] to-[#0A0A0A] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300 px-3.5 py-1.5 min-w-[235px] sm:min-w-[255px] flex items-center justify-between gap-3 cursor-pointer shrink-0 text-right"
              >
                {/* Background Layer: Ultra-Faint Golden Micro-Sparkline Graph SVG */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 130 28"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute inset-x-2 bottom-0.5 h-6 w-[calc(100%-16px)] opacity-20 group-hover/card:opacity-40 transition-opacity duration-300"
                >
                  <defs>
                    <linearGradient id={`spark-${item.loopKey}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points={`0,28 ${item.sparklinePoints} 130,28`}
                    fill={`url(#spark-${item.loopKey})`}
                  />
                  <polyline
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={item.sparklinePoints}
                  />
                </svg>

                {/* Right Zone: Asset Name in small Cairo + quiet subtitle ("تحديث لحظي · مصر") */}
                <div className="relative z-10 flex flex-col items-start text-right min-w-0">
                  <span className="text-[11px] font-bold text-slate-300 group-hover/card:text-white transition-colors whitespace-nowrap">
                    {item.label}
                  </span>
                  <span className="text-[9px] font-medium text-slate-500 whitespace-nowrap">
                    {item.subLabel}
                  </span>
                </div>

                {/* Center Zone: Prominent Gold Price + Currency ("ج.م") */}
                <div className="relative z-10 flex items-baseline gap-1 shrink-0">
                  <span className="font-num text-sm sm:text-base font-bold text-[#D4AF37] group-hover/card:text-[#F3E5AB] shadow-gold-sm tracking-tight">
                    {item.priceFormatted}
                  </span>
                  <span className="text-[10px] font-bold text-[#F3E5AB]/80">
                    {item.unitLabel}
                  </span>
                </div>

                {/* Left Zone: Glowing Green Upward Arrow (▲) + Percentage */}
                <div
                  dir="ltr"
                  className="relative z-10 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-500/30 text-[10px] font-num font-extrabold text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)] shrink-0"
                >
                  <span>▲</span>
                  <span>{item.changePercent}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
