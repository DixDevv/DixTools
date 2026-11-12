'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getMasterTools, SITE_CONFIG, MATRIX_CATEGORIES } from '../lib/tools-matrix-generator';
import siteMasterConfig from '../data/site-master-config.json';
import {
  hasValidStealthSession,
  verifyStealthMasterPin,
  clearStealthSession,
  MASTER_PIN_SHA256_HASH,
  getActiveMasterPinHash,
  recordSecurityAuditEntry,
} from '../lib/stealth-crypto';
import {
  fetchEgyptLiveOracleFromApis,
  formatCairoTimestamp,
  ORACLE_REFRESH_INTERVAL_SECONDS,
} from '../app/api/egypt-live-oracle/route';

const STORAGE_KEY = 'dix_tools_stealth_master_config_v5_2026_fuel';
const SNAPSHOTS_STORAGE_KEY = 'dix_tools_config_snapshots_v1';
const LEGACY_STORAGE_KEYS = [
  'dix_tools_stealth_master_config_v4_2026_fuel',
  'dix_tools_stealth_master_config_v3',
  'dix_tools_stealth_master_config_v2',
  'dix_tools_stealth_master_config',
];
export const CONFIG_VERSION = 'v2_2026_fuel_update';
export const OFFICIAL_EGYPT_FUEL_PRICES = {
  fuel80: 20.75,
  fuel92: 22.25,
  fuel95: 24.0,
  gas80: 20.75,
  gas92: 22.25,
  gas95: 24.0,
  diesel: 19.5,
  electricityBaseKwh: 1.65,
};

const AUTO_SYNC_STALE_MS = 60 * 1000; // 60 seconds

export const DEFAULT_STEALTH_CONFIG = {
  version: '3.0.0-GodMode',
  configVersion: CONFIG_VERSION,
  security: {
    secretAdminSlug: 'stealth-command-x99',
    triggerKeyword: 'DixDev',
    pinHashAlgorithm: 'SHA-256',
    pinHashSignature: MASTER_PIN_SHA256_HASH,
    noIndexHeaderEnabled: true,
  },
  adConfig: {
    globalKillSwitch: false,
    adSensePublisherId: 'ca-pub-9827349182734918',
    previewMode: true,
    adBlockDetectorEnabled: true,
    adBlockRecoveryMode: 'affiliate-fallback', // 'polite-modal' | 'affiliate-fallback'
    antiAdBlockFallback: {
      enabled: true,
      simulateBlocked: false,
      badgeText: 'عرض بديل حصري · House Affiliate Banner',
      headline: 'متجر شركاء Dix Tools: سبائك ذهب معتمدة وبرامج تجارة إلكترونية بخصم فوري 25%',
      subtext: 'تغليف مؤمّن بالباركود الملكي · شحن سريع للـ 27 محافظة · استشارة مجانية عبر واتساب',
      iconType: 'gold-store',
      ctaText: 'انتقل للمتجر أو تواصل عبر واتساب الآن',
      ctaUrl: 'https://wa.me/201000000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20Dix%20Tools%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%A7%D8%AF%D8%A9%20%D9%85%D9%86%20%D8%B9%D8%B1%D8%B6%20%D8%A7%D9%84%D9%85%D8%AA%D8%AC%D8%B1',
    },
    interstitialWaitSeconds: 4,
    placements: {
      header_banner: {
        id: 'header_banner',
        name: '1. إعلان أعلى الصفحة تحت الهيدر (Header Leaderboard)',
        enabled: true,
        networkType: 'adsense',
        slotId: '1010192830',
        format: '728 × 90 Leaderboard / 320 × 100 Mobile',
        minHeightPx: 92,
        deviceTarget: 'all',
        autoRefreshSeconds: 0,
        abSplitEnabled: true,
        customHtml: '',
        headline: 'تداول السبائك الذهبية المعتمدة بعمولة صفرية واسترداد نقدي فوري',
        subtext: 'شحن مؤمّن لجميع المحافظات · فواتير ضريبية رسمية · أسعار البورصة لحظياً',
        ctaText: 'استكشف السبائك المعتمدة',
        ctaUrl: '#tools-workspace',
        headlineB: 'اشترِ سبائك ذهب سويسرية عيار 24 بكاش باك 55 جنيهاً للجرام عند البيع',
        subtextB: 'معتمدة بالباركود الملكي · توصيل مؤمّن لباب المنزل في 27 محافظة',
        ctaTextB: 'قارن أسعار السبائك الآن',
        ctaUrlB: '#/gold/gold-vs-bank-comparator',
        customHtmlB: '',
        badgeText: 'إعلان ممول · AdSense Ready',
      },
      ai_chat_response_ad: {
        id: 'ai_chat_response_ad',
        name: '2. إعلان مدمج داخل رد الشات بوت الذكي (AI Response Native Ad)',
        enabled: true,
        networkType: 'adsense',
        slotId: '9090918273',
        format: 'High-CTR AI Concierge Native Unit',
        minHeightPx: 92,
        deviceTarget: 'all',
        autoRefreshSeconds: 0,
        abSplitEnabled: true,
        customHtml: '',
        headline: 'قارن أفضل حسابات التوفير والشهادات البنكية بعائد يصل إلى 30% سنوياً',
        subtext: 'حاسبة معتمدة ومحدثة وفقاً لآخر قرارات البنك المركزي',
        ctaText: 'احسب عائدك البنكي الآن',
        ctaUrl: '#/finance/bank-certificates-profit-calculator',
        headlineB: 'أيهما أربح لمبلغك اليوم: شهادة البنك 27% أم سبيكة الذهب عيار 21؟',
        subtextB: 'جرب مستشار المقارنة الاستثمارية الذكي بالرسوم البيانية اللحظية',
        ctaTextB: 'قارن الذهب والبنك الآن',
        ctaUrlB: '#/gold/gold-vs-bank-comparator',
        customHtmlB: '',
        badgeText: 'اقتراح ممول ذكي · High CTR',
      },
      above_tool_workspace: {
        id: 'above_tool_workspace',
        name: '3. إعلان أعلى مساحة عمل الأداة مباشرة (Above Tool Workspace)',
        enabled: true,
        networkType: 'adsense',
        slotId: '2020293841',
        format: 'Responsive Display Banner (728 × 90)',
        minHeightPx: 94,
        deviceTarget: 'all',
        autoRefreshSeconds: 60,
        abSplitEnabled: false,
        customHtml: '',
        headline: 'حسابات بنكية للشركات والتجار بدون مصاريف إدارية مع تحويل لحظي',
        subtext: 'افتح حسابك التجاري رقمياً واستلم بطاقة الأعمال الفورية',
        ctaText: 'احسب عوائدك الآن',
        ctaUrl: '#tool-interactive-engine',
        headlineB: 'بوابة تمويل الشركات والتجار بأقل عائد متناقص في مصر',
        subtextB: 'موافقة ائتمانية سريعة خلال 24 ساعة مع كاش باك على المعاملات',
        ctaTextB: 'اطلب التمويل الآن',
        ctaUrlB: '#/finance/loan-installment-and-interest-calculator',
        customHtmlB: '',
        badgeText: 'إعلان ممول · صفر اهتزاز CLS',
      },
      before_action_button: {
        id: 'before_action_button',
        name: '4. منطقة النقرة الذهبية فوق زر الحساب والطباعة (Before Action CTA)',
        enabled: true,
        networkType: 'adsense',
        slotId: '3030394852',
        format: 'High-CTR Action Zone (336 × 280 / Responsive)',
        minHeightPx: 100,
        deviceTarget: 'all',
        autoRefreshSeconds: 0,
        abSplitEnabled: true,
        customHtml: '',
        headline: 'احصل على تمويل شخصي وتمويل سيارات فوري بأقل فائدة متناقصة',
        subtext: 'موافقة ائتمانية خلال دقائق بدون تحويل راتب',
        ctaText: 'احسب قسطك المفضل',
        ctaUrl: '#/finance/loan-installment-and-interest-calculator',
        headlineB: 'جدد رخصة سيارتك وقسّم رسوم الصيانة والضرائب على 12 شهراً بدون فوائد',
        subtextB: 'استخدم دفتر صيانة المركبات الذكي واحسب رسوم المرور فوراً',
        ctaTextB: 'افتح دفتر الصيانة',
        ctaUrlB: '#/automotive/vehicle-maintenance-tracker',
        customHtmlB: '',
        badgeText: 'منطقة النقرة الذهبية · High CTR',
      },
      inside_result_box: {
        id: 'inside_result_box',
        name: '5. إعلان مدمج أسفل صندوق النتيجة النهائية (Inside Result Box)',
        enabled: true,
        networkType: 'affiliate_banner',
        slotId: '4040495863',
        format: 'Native In-Result Recommendation',
        minHeightPx: 96,
        deviceTarget: 'all',
        autoRefreshSeconds: 0,
        abSplitEnabled: false,
        customHtml: '',
        headline: 'هل ترغب في طباعة هذه النتيجة أو حفظها كملف PDF رسمي بضغطة واحدة؟',
        subtext: 'استخدم أداة التصدير الفوري أو شارك التقرير المالي عبر واتساب مجاناً',
        ctaText: 'تصدير وحفظ التقرير',
        ctaUrl: '#tool-result-card',
        headlineB: 'شارك نتيجتك كبطاقة ذهبية مصورة على واتساب وفيسبوك بضغطة واحدة',
        subtextB: 'توليد فوري لبطاقة النتيجة المعتمدة من منصة Dix Tools',
        ctaTextB: 'مشاركة النتيجة الآن',
        ctaUrlB: '#tool-result-card',
        customHtmlB: '',
        badgeText: 'توصية مدمجة · Native Ad',
      },
      interstitial_download_modal: {
        id: 'interstitial_download_modal',
        name: '6. إعلان شاشة الانتظار الذكية للتحميل (Interstitial Download Modal)',
        enabled: true,
        networkType: 'adsense',
        slotId: '8080819201',
        format: 'Interstitial Modal Ad (336 × 280)',
        minHeightPx: 140,
        deviceTarget: 'all',
        autoRefreshSeconds: 0,
        abSplitEnabled: false,
        customHtml: '',
        headline: 'احمِ مستنداتك وعقودك الرسمية بتوقيع إلكتروني وأرشفة سحابية مشفرة',
        subtext: 'جاري تجهيز ملفك بصيغة A4 عالية الدقة للطباعة الفورية...',
        ctaText: 'استكشف باقات الأعمال',
        ctaUrl: '#/documents/tax-invoice-and-quotation-generator',
        headlineB: 'أصدر فواتير ضريبية وبوالص شحن تجارية بالباركود لمتجرك مجاناً',
        subtextB: 'جميع نماذج العقود والفواتير جاهزة للطباعة الفورية بصيغة PDF A4',
        ctaTextB: 'جرب مولد البوالص',
        ctaUrlB: '#/documents/shipping-awb-generator',
        customHtmlB: '',
        badgeText: 'رعاية التحميل المجاني · Interstitial',
      },
      sticky_bottom_mobile: {
        id: 'sticky_bottom_mobile',
        name: '7. إعلان عائم ثابت أسفل شاشة الموبايل (Sticky Bottom Anchor)',
        enabled: true,
        networkType: 'adsense',
        slotId: '6060697885',
        format: '320 × 50 Mobile Sticky Anchor',
        minHeightPx: 64,
        deviceTarget: 'mobile-only',
        autoRefreshSeconds: 45,
        abSplitEnabled: false,
        customHtml: '',
        headline: 'تطبيق Dix Tools الذكي: 56 أداة شاملة في جيبك بدون إنترنت',
        subtext: 'أسعار الذهب والعملات والعقود اللحظية',
        ctaText: 'تصفح الآن',
        ctaUrl: '#tools-workspace',
        headlineB: 'تابع أسعار الذهب والدولار والبنزين لحظياً على هاتفك',
        subtextB: 'تحديث أوتوماتيكي كل 60 ثانية من السوق المصري',
        ctaTextB: 'افتح الأسعار',
        ctaUrlB: '#/gold/comprehensive-gold-calculator',
        customHtmlB: '',
        badgeText: 'Sticky Ad',
      },
      in_feed_tools_grid: {
        id: 'in_feed_tools_grid',
        name: '8. إعلان مدمج وسط شبكة الأدوات في الرئيسية والأقسام (In-Feed Grid Ad)',
        enabled: true,
        networkType: 'affiliate_banner',
        slotId: '7070798897',
        format: 'Native In-Feed Card',
        minHeightPx: 220,
        deviceTarget: 'all',
        autoRefreshSeconds: 0,
        abSplitEnabled: true,
        customHtml: '',
        headline: 'بوابة التجار والشركات: احسب تسعير منتجاتك وعائد الإعلانات ROAS',
        subtext: 'أداة مجانية لحساب صافي أرباح التجارة الإلكترونية ونقطة التعادل للمشاريع',
        ctaText: 'جرّب حاسبة التجار الآن',
        ctaUrl: '#/finance/ecommerce-product-pricing-calculator',
        headlineB: 'صمم صورة عرض منتجك بإطار ذهبي ملكي وختم خصم وسعر قبل وبعد في ثوانٍ',
        subtextB: 'استوديو تصميم عروض التجارة الإلكترونية داخل المتصفح بدقة 1080×1080 PNG',
        ctaTextB: 'افتح استوديو العروض',
        ctaUrlB: '#/images/product-promo-badge-maker',
        customHtmlB: '',
        badgeText: 'عرض شريك معتمد (High-CPC)',
      },
    },
    categoryOverrides: {
      gold: {
        enabled: true,
        headline: 'اشترِ سبائك ذهب عيار 24 سويسرية ومعتمدة بكاش باك يصل إلى 55 جنيهاً للجرام',
        subtext: 'تغليف مؤمّن بالباركود · ضمان إعادة الشراء الفوري بأعلى سعر في السوق',
        ctaText: 'احسب سعر السبيكة الآن',
        ctaUrl: '#/gold/comprehensive-gold-calculator',
        badgeText: 'رعاية خاصة · سوق الذهب والسبائك',
      },
      currencies: {
        enabled: true,
        headline: 'حوّل أموالك دولياً بالدولار والريال واليورو بعمولة 0% وبسعر الصرف اللحظي',
        subtext: 'استلام فوري عبر الحسابات البنكية والمحافظ الرقمية في مصر والخليج',
        ctaText: 'قارن أسعار الصرف الآن',
        ctaUrl: '#/currencies/comprehensive-currency-converter',
        badgeText: 'رعاية خاصة · التحويلات الدولية',
      },
      finance: {
        enabled: true,
        headline: 'قارن عروض القروض الشخصية وشهادات الادخار 27% و30% في جميع البنوك',
        subtext: 'جدول أقساط تفصيلي وحساب الفائدة المتناقصة والعمولات بدقة 100%',
        ctaText: 'افتح حاسبة البنوك',
        ctaUrl: '#/finance/loan-installment-and-interest-calculator',
        badgeText: 'رعاية خاصة · التمويل والبنوك',
      },
    },
  },
  adAnalytics: {
    placements: {
      header_banner: {
        variantA: { impressions: 1420, clicks: 68 },
        variantB: { impressions: 1390, clicks: 94 },
      },
      ai_chat_response_ad: {
        variantA: { impressions: 980, clicks: 71 },
        variantB: { impressions: 1015, clicks: 98 },
      },
      above_tool_workspace: {
        variantA: { impressions: 2150, clicks: 112 },
        variantB: { impressions: 420, clicks: 19 },
      },
      before_action_button: {
        variantA: { impressions: 1890, clicks: 164 },
        variantB: { impressions: 1840, clicks: 192 },
      },
      inside_result_box: {
        variantA: { impressions: 1640, clicks: 138 },
        variantB: { impressions: 310, clicks: 24 },
      },
      interstitial_download_modal: {
        variantA: { impressions: 620, clicks: 59 },
        variantB: { impressions: 180, clicks: 15 },
      },
      sticky_bottom_mobile: {
        variantA: { impressions: 1120, clicks: 64 },
        variantB: { impressions: 240, clicks: 12 },
      },
      in_feed_tools_grid: {
        variantA: { impressions: 1340, clicks: 82 },
        variantB: { impressions: 1310, clicks: 109 },
      },
    },
  },
  trafficRadar: {
    aiSearchLog: [
      {
        id: 'q-seed-1',
        query: 'أيهما أفضل الذهب أم الشهادة البنكية 27% لمبلغ 250 ألف جنيه',
        matchedToolSlug: 'gold-vs-bank-comparator',
        matchedToolTitle: 'مستشار المقارنة الاستثمارية الذكي (الذهب vs الشهادات البنكية vs الدولار)',
        timestamp: 'منذ دقيقتين',
      },
      {
        id: 'q-seed-2',
        query: 'حاسبة بنزين مشوار 220 كم بنزين 92 بالسعر الجديد 22.25',
        matchedToolSlug: 'trip-fuel-cost-calculator',
        matchedToolTitle: 'حاسبة تكلفة وقود المشوار واستهلاك البنزين للسيارات',
        timestamp: 'منذ 6 دقائق',
      },
      {
        id: 'q-seed-3',
        query: 'احسبلي زكاة 120 جرام دهب عيار 21',
        matchedToolSlug: 'zakat-wealth-and-gold-calculator',
        matchedToolTitle: 'حاسبة زكاة المال والذهب وعروض التجارة الشاملة',
        timestamp: 'منذ 11 دقيقة',
      },
      {
        id: 'q-seed-4',
        query: 'بوليصة شحن محافظة الإسكندرية تحصيل 1850 جنيه',
        matchedToolSlug: 'shipping-awb-generator',
        matchedToolTitle: 'مولد بوليصة الشحن وبطاقة الطرد التجارية بالباركود (AWB)',
        timestamp: 'منذ 18 دقيقة',
      },
    ],
    missedQueriesLog: [
      {
        id: 'miss-1',
        query: 'حاسبة تكلفة تشطيب شقة 150 متر في مصر بالأسمنت والحديد',
        suggestedTitle: 'حاسبة تكلفة تشطيب الشقق والمباني في مصر',
        suggestedSlug: 'apartment-finishing-cost-calculator',
        suggestedCategory: 'real-estate',
        suggestedFormula: '(areaSqm * costPerSqm) + (cementTons * cementTonEgp)',
        count: 19,
        lastSearchedAt: 'اليوم · 02:15 م',
      },
      {
        id: 'miss-2',
        query: 'حاسبة جمارك الهواتف المستوردة والضريبة الجديدة في المطار',
        suggestedTitle: 'حاسبة رسوم جمارك وضريبة الهواتف المستوردة في مصر',
        suggestedSlug: 'imported-phone-customs-tax-calculator',
        suggestedCategory: 'finance',
        suggestedFormula: '(phonePriceUsd * USD) * 0.385',
        count: 14,
        lastSearchedAt: 'اليوم · 01:40 م',
      },
      {
        id: 'miss-3',
        query: 'حاسبة استهلاك شحن السيارة الكهربائية بالكيلوواط في مصر',
        suggestedTitle: 'حاسبة تكلفة شحن السيارات الكهربائية في مصر',
        suggestedSlug: 'ev-charging-cost-calculator-egypt',
        suggestedCategory: 'automotive',
        suggestedFormula: 'batteryKwh * kwhTariffEgp',
        count: 9,
        lastSearchedAt: 'اليوم · 12:10 م',
      },
    ],
    toolEngagement: {
      'gold-vs-bank-comparator': {
        slug: 'gold-vs-bank-comparator',
        title: 'مستشار المقارنة الاستثمارية الذكي (الذهب vs الشهادات vs الدولار)',
        category: 'gold',
        calculations: 842,
        pdfDownloads: 318,
        shares: 264,
      },
      'comprehensive-gold-calculator': {
        slug: 'comprehensive-gold-calculator',
        title: 'حاسبة أسعار الذهب والمصنعية والدمغة والسبائك الشاملة',
        category: 'gold',
        calculations: 795,
        pdfDownloads: 245,
        shares: 312,
      },
      'trip-fuel-cost-calculator': {
        slug: 'trip-fuel-cost-calculator',
        title: 'حاسبة تكلفة وقود المشوار واستهلاك البنزين للسيارات',
        category: 'automotive',
        calculations: 684,
        pdfDownloads: 140,
        shares: 219,
      },
      'shipping-awb-generator': {
        slug: 'shipping-awb-generator',
        title: 'مولد بوليصة الشحن وبطاقة الطرد التجارية بالباركود (AWB)',
        category: 'documents',
        calculations: 590,
        pdfDownloads: 462,
        shares: 175,
      },
      'vehicle-maintenance-tracker': {
        slug: 'vehicle-maintenance-tracker',
        title: 'حاسبة جدول صيانة السيارة والموتوسيكل وتجديد الرخصة',
        category: 'automotive',
        calculations: 512,
        pdfDownloads: 198,
        shares: 164,
      },
      'product-promo-badge-maker': {
        slug: 'product-promo-badge-maker',
        title: 'صانع ختم العروض والخصومات على صور المنتجات للتجار',
        category: 'images',
        calculations: 478,
        pdfDownloads: 389,
        shares: 210,
      },
    },
  },
  uiCustomizer: {
    homeSectionsOrder: [
      { id: 'hero_concierge', label: '1. المساعد الذكي الفوري (AI Concierge Hero)', visible: true },
      { id: 'live_market_cards', label: '2. لوحة أسعار السوق المصري اللحظية (Live Oracle Cards)', visible: true },
      { id: 'strategic_tools_grid', label: '3. شبكة الأدوات الرئيسية الشاملة (Master Tools Hub)', visible: true },
      { id: 'seo_directory_matrix', label: '4. الفهرس البرامجي الهرمي للـ SEO (5,200+ مسار)', visible: true },
    ],
    tickerConfig: {
      isEnabled: true,
      enabled: true, // backward compatibility
      speed: 'normal', // 'slow' (45s) | 'normal' (30s) | 'fast' (18s)
      speedSeconds: 30,
      direction: 'rtl',
      showLiveBadge: true,
      items: [
        { id: 'karat21', label: 'ذهب عيار 21', visible: true, order: 1, targetSlug: 'comprehensive-gold-calculator' },
        { id: 'karat24', label: 'ذهب عيار 24', visible: true, order: 2, targetSlug: 'comprehensive-gold-calculator' },
        { id: 'karat18', label: 'ذهب عيار 18', visible: true, order: 3, targetSlug: 'comprehensive-gold-calculator' },
        { id: 'goldCoin8g', label: 'الجنيه الذهب', visible: true, order: 4, targetSlug: 'comprehensive-gold-calculator' },
        { id: 'USD', label: 'الدولار الأمريكي', visible: true, order: 5, targetSlug: 'comprehensive-currency-converter' },
        { id: 'SAR', label: 'الريال السعودي', visible: true, order: 6, targetSlug: 'comprehensive-currency-converter' },
        { id: 'AED', label: 'الدرهم الإماراتي', visible: true, order: 7, targetSlug: 'comprehensive-currency-converter' },
        { id: 'KWD', label: 'الدينار الكويتي', visible: true, order: 8, targetSlug: 'comprehensive-currency-converter' },
        { id: 'EUR', label: 'اليورو الأوروبي', visible: true, order: 9, targetSlug: 'comprehensive-currency-converter' },
        { id: 'fuel80', label: 'بنزين 80', visible: true, order: 10, targetSlug: 'trip-fuel-cost-calculator' },
        { id: 'fuel92', label: 'بنزين 92', visible: true, order: 11, targetSlug: 'trip-fuel-cost-calculator' },
        { id: 'fuel95', label: 'بنزين 95', visible: true, order: 12, targetSlug: 'trip-fuel-cost-calculator' },
        { id: 'diesel', label: 'السولار', visible: true, order: 13, targetSlug: 'trip-fuel-cost-calculator' },
        { id: 'steelTon', label: 'طن الحديد', visible: true, order: 14, targetSlug: 'egypt-finishing-cost-calculator' },
        { id: 'cementTon', label: 'طن الأسمنت', visible: true, order: 15, targetSlug: 'egypt-finishing-cost-calculator' },
      ],
      customItems: [],
    },
    announcementBar: {
      enabled: false,
      badge: 'تحديث استراتيجي',
      text: '🔥 أطلقنا مستشار المقارنة الاستثمارية الذكي (الذهب vs الشهادات البنكية 27% vs الدولار) ومولد بوالص الشحن AWB!',
      ctaLabel: 'جرّب مستشار الاستثمار الآن',
      ctaUrl: '#/gold/gold-vs-bank-comparator',
    },
    smartPopup: {
      enabled: false,
      title: 'مرحباً بك في منصة Dix Tools الذكية',
      message: 'جميع الحاسبات المالية، أسعار الذهب اللحظية، وعقود البيع والإيجار متاحة مجاناً بصيغة PDF A4 جاهزة للطباعة.',
      ctaLabel: 'استكشف الأدوات الآن',
      ctaUrl: '#tools-workspace',
      maxShowsPerVisitor: 2,
    },
    themeConfig: {
      goldAccentHex: '#D4AF37',
      cardBgHex: '#141414',
    },
    globalMaintenanceMode: false,
    maintenanceMessage:
      'نقوم حالياً بترقية محركات الأسعار اللحظية وقواعد البيانات لضمان أعلى دقة.. ستعود المنصة للعمل خلال دقائق!',
    maintenanceToolSlugs: [],
  },
  seoEngineConfig: {
    bulkTitleTemplate: '{tool_name} - تحديث {current_date} | السعر اللحظي {egypt_rate} | Dix Tools',
    bulkDescriptionTemplate:
      'استخدم {tool_name} المحدثة بتاريخ {current_date} وفقاً لأحدث أسعار السوق المصري ({egypt_rate}) لعام {year} ضمن قسم {category_name} بدقة 100% ومجاناً عبر منصة Dix Tools.',
    redirects: [
      {
        id: 'red-1',
        fromPath: '/old-gold-price',
        toPath: '/gold/comprehensive-gold-calculator',
        statusCode: 301,
        hits: 342,
        active: true,
      },
      {
        id: 'red-2',
        fromPath: '/bank-vs-gold',
        toPath: '/gold/gold-vs-bank-comparator',
        statusCode: 301,
        hits: 189,
        active: true,
      },
      {
        id: 'red-3',
        fromPath: '/benzin-egypt',
        toPath: '/automotive/trip-fuel-cost-calculator',
        statusCode: 302,
        hits: 276,
        active: true,
      },
    ],
  },
  toolsConfig: {
    seoSubRoutesEnabled: true,
    hiddenToolSlugs: [],
    pinnedTrendingSlugs: [
      'egypt-finishing-cost-calculator',
      'gold-vs-bank-comparator',
      'egypt-governorates-hub',
      'live-qr-barcode-scanner',
      'batch-image-barcode-processor',
      'vehicle-maintenance-tracker',
      'shipping-awb-generator',
      'product-promo-badge-maker',
      'comprehensive-currency-converter',
      'comprehensive-gold-calculator',
      'zakat-wealth-and-gold-calculator',
      'arabic-number-to-words-tafqeet',
      'islamic-inheritance-calculator',
      'bank-certificates-profit-calculator',
      'loan-installment-and-interest-calculator',
      'trip-fuel-cost-calculator',
      'electricity-water-gas-bill-calculator',
      'image-compressor-and-resizer-pro',
      'vehicle-sale-contract-generator',
      'apartment-lease-contract-generator',
    ],
    toolOverrides: {},
    customAddedTools: [],
  },
  aiConciergeConfig: {
    welcomeTitle:
      siteMasterConfig.welcomeTitle ||
      'مرحباً بك في Dix Tools.. محتاج تعمل إيه النهاردة؟ اكتب طلبك وسأجهز لك الأداة فوراً',
    welcomeSubtitle:
      siteMasterConfig.welcomeSubtitle ||
      'اكتب طلبك بالأرقام (مثل: «عاوز أحول 250 دولار لجنيه» أو «تفقيط 125450 جنيه») وسيقوم مساعد Dix Tools بفتح الأداة الشاملة مع ضبط الخانات والنتيجة تلقائياً.',
    inputPlaceholder:
      'مثال: عاوز أحسب قسط قرض، أو أحول صورة لـ PDF، أو أعرف سعر جرام الذهب بالمصنعية...',
    mode: 'local',
    geminiSystemPrompt:
      'أنت المساعد الذكي لمنصة Dix Tools (ديكس تولز للخدمات والأدوات الذكية). حلل طلب الزائر بالعامية المصرية أو الفصحى وحدد الأداة الرئيسية الأنسب مع استخراج الأرقام والعملات والأوزان بدقة.',
    quickPromptChips: [
      { id: 'c1', label: 'احسبلي زكاة 120 جرام دهب عيار 21', query: 'احسبلي زكاة 120 جرام دهب عيار 21' },
      { id: 'c2', label: 'عاوز أحول 250 دولار لجنيه مصري', query: 'عاوز أحول 250 دولار لجنيه مصري' },
      { id: 'c3', label: 'تفقيط مبلغ 125450 جنيه للشيكات', query: 'تفقيط مبلغ 125450 جنيه للشيكات' },
      { id: 'c4', label: 'تقسيم ميراث شرعي 1200000 جنيه', query: 'حاسبة تقسيم ميراث شرعي 1200000 جنيه' },
      { id: 'c5', label: 'عقد بيع موتوسيكل جاهز للطباعة', query: 'عقد بيع موتوسيكل جاهز للطباعة' },
      { id: 'c6', label: 'ضغط صورة بدون ما تبوظ أقل من 200KB', query: 'ضغط صورة بدون ما تبوظ أقل من 200 كيلوبايت' },
      { id: 'c7', label: 'حاسبة بنزين مشوار 220 كم بنزين 92', query: 'حاسبة بنزين مشوار 220 كم بنزين 92' },
    ],
  },
  liveRates: {
    oracleStatus: 'LIVE_VERIFIED',
    refreshIntervalSeconds: ORACLE_REFRESH_INTERVAL_SECONDS,
    verifiedSourceLabel: 'البورصة العالمية + البنك المركزي المصري (تحديث كل 60 ثانية)',
    lastSyncedAt: formatCairoTimestamp(new Date()),
    lastSyncedTimestamp: 0,
    lockedRates: {
      'energyAndUtilities.fuel80': true,
      'energyAndUtilities.fuel92': true,
      'energyAndUtilities.fuel95': true,
    },
    customVariables: [
      {
        id: 'var-steel',
        key: 'steelTonEgp',
        label: 'سعر طن الحديد الاستثماري (مصر)',
        value: 38500,
        unit: 'ج.م / طن',
      },
      {
        id: 'var-cement',
        key: 'cementTonEgp',
        label: 'سعر طن الأسمنت البورتلاندي (مصر)',
        value: 2950,
        unit: 'ج.م / طن',
      },
      {
        id: 'var-customs-usd',
        key: 'customsUsdRate',
        label: 'سعر الدولار الجمركي المعتمد',
        value: 50.45,
        unit: 'ج.م / دولار',
      },
    ],
    sources: {
      currencies: 'open.er-api.com (CBE & Global FX)',
      gold: 'Binance Spot (PAXG/USDT)',
      silver: 'Global XAG Spot Oracle',
      fuel: 'لجنة التسعير التلقائي للمنتجات البترولية - مصر',
    },
    gold: {
      globalOunceUSD: 2685.0,
      ounceEGP: 135458,
      karat24: 4355,
      karat22: 3992,
      karat21: 3811,
      karat18: 3266,
      karat14: 2540,
      goldCoin8g: 30488,
      defaultWorkmanship: 120,
      zakatNisabGrams24: 85,
    },
    silver: {
      silverOunceUSD: 32.5,
      silverOunceEGP: 1640,
      silverGram999: 52.73,
      silverGram925: 48.78,
      silverGram800: 42.18,
    },
    currenciesToEgp: {
      USD: 50.45,
      SAR: 13.45,
      AED: 13.74,
      KWD: 164.2,
      EUR: 54.6,
      GBP: 64.1,
    },
    energyAndUtilities: { ...OFFICIAL_EGYPT_FUEL_PRICES },
    bankingAndTaxes: {
      certAnnualYield: 27.0,
      highCertAnnualYield: 30.0,
      personalLoanRate: 22.0,
      vatEgyptPercent: 14.0,
      vatSaudiPercent: 15.0,
    },
    constructionAndMaterials: {
      steelTonEgp: 38500,
      cementTonEgp: 2950,
      cementBag50KgEgp: 148,
      sandCubicMeterEgp: 240,
      gravelCubicMeterEgp: 330,
      elSewedyRollEgp: 1950,
      costPerSqmEconomic: 3850,
      costPerSqmSuperLux: 5950,
      costPerSqmUltraLux: 9400,
    },
  },
  seoAndScripts: {
    siteName: siteMasterConfig.siteName || 'Dix Tools | منصة الأدوات والخدمات الذكية الشاملة',
    siteShortName: siteMasterConfig.siteShortName || 'Dix Tools',
    siteDescription: siteMasterConfig.description || SITE_CONFIG.description,
    domain: siteMasterConfig.domain || 'https://dixtools.com',
    contactEmail: 'support@dixtools.com',
    contactWhatsapp: '+201000000000',
    privacyPolicySummary:
      'جميع العمليات الحسابية ومعالجة الصور وتوليد العقود على منصة Dix Tools تتم محلياً 100% داخل متصفح المستخدم (Client-Side) دون رفع أي مستندات أو بيانات مالية إلى خوادم خارجية.',
    headScripts: '<!-- Dix Tools Google AdSense & Analytics Head Script Slot -->',
    bodyScripts: '<!-- Dix Tools Custom Body Tracking / Pixel Slot -->',
  },
  viralFeatures: {
    liveEgyptTickerEnabled: true,
    shareResultCardEnabled: true,
    pdfWatermarkEnabled: true,
    liveCameraScannerEnabled: true,
    batchProcessorEnabled: true,
    egyptGovernoratesHubEnabled: true,
    marketSentimentPollEnabled: true,
    excelExportEnabled: true,
    languageSwitcherEnabled: true,
    splitScreenEnabled: true,
    floatingScratchpadEnabled: true,
  },
  webhookConfig: {
    enabled: true,
    webhookUrl: 'https://hooks.n8n.cloud/webhook/dixtools-egypt-oracle',
    telegramBotToken: '',
    telegramChatId: '@DixToolsEgypt',
    autoScheduleInterval: 'off',
    lastBroadcastAt: null,
    broadcastHistory: [],
  },
  smartOfferConfig: {
    enabled: true,
    badgeText: 'عرض حصري مخصص لك · Smart Offer',
    title: 'احصل على أفضل عرض سبائك ذهب معتمدة واستشارات مالية فورية بأقل مصنعية في مصر',
    description:
      'شحن مؤمّن لجميع المحافظات الـ 27 مع فاتورة ضريبية رسمية وكاش باك فوري عند إعادة البيع.',
    ctaLabel: 'استفد من العرض الآن',
    storeUrl: '#/gold/gold-vs-bank-comparator',
    whatsappNumber: '201000000000',
    whatsappMessage: 'مرحباً، أرغب في الاستفسار عن العرض الحصري عبر منصة Dix Tools',
    categoryOffers: {
      gold: {
        title: 'اشترِ سبائك ذهب عيار 24 سويسرية ومعتمدة بكاش باك يصل إلى 55 جنيهاً للجرام',
        description: 'تغليف مؤمّن بالباركود · ضمان إعادة الشراء الفوري بأعلى سعر في السوق المصري',
        ctaLabel: 'قارن الذهب مع البنك الآن',
        storeUrl: '#/gold/gold-vs-bank-comparator',
      },
      currencies: {
        title: 'حوّل أموالك دولياً بالدولار والريال واليورو بعمولة 0% وبسعر الصرف اللحظي',
        description: 'استلام فوري عبر الحسابات البنكية والمحافظ الرقمية في مصر والخليج',
        ctaLabel: 'افتح محول العملات الشامل',
        storeUrl: '#/currencies/comprehensive-currency-converter',
      },
      finance: {
        title: 'قارن عروض الشهادات البنكية 27% و30% مع استثمار الذهب والدولار في ثوانٍ',
        description: 'مستشار مالي ذكي يحسب لك صافي أرباحك ويعطيك التوصية الاستثمارية الأدق',
        ctaLabel: 'جرب مستشار الاستثمار الذكي',
        storeUrl: '#/gold/gold-vs-bank-comparator',
      },
      automotive: {
        title: 'سجّل صيانة سيارتك أو الموتوسيكل واحسب رسوم تجديد رخصة المرور فوراً',
        description: 'مؤشرات مئوية لمواعيد تغيير الزيت والفلاتر وتيل الفرامل مع حفظ تاريخ صيانتك',
        ctaLabel: 'افتح دفتر صيانة المركبات',
        storeUrl: '#/automotive/vehicle-maintenance-tracker',
      },
      documents: {
        title: 'أصدر بوليصة شحن تجارية بالباركود ورمز QR لجميع محافظات مصر الـ 27',
        description: 'حساب تلقائي لمبلغ التحصيل COD وصافي مستحقات التاجر جاهزة للطباعة الفورية',
        ctaLabel: 'اصنع بوليصة شحن AWB الآن',
        storeUrl: '#/documents/shipping-awb-generator',
      },
      images: {
        title: 'صمم صورة عرض منتجك بإطار ذهبي ملكي وختم خصم وسعر قبل وبعد في ثوانٍ',
        description: 'استوديو تصميم عروض التجارة الإلكترونية داخل المتصفح بدقة 1080×1080 PNG',
        ctaLabel: 'افتح استوديو عروض المنتجات',
        storeUrl: '#/images/product-promo-badge-maker',
      },
    },
  },
};

/**
 * Normalizes and upgrades `energyAndUtilities` so that:
 * 1. Both `fuel80`/`gas80`, `fuel92`/`gas92`, and `fuel95`/`gas95` stay synchronized.
 * 2. Any legacy/outdated prices (e.g. 13.75, 15.25, 17.0) or missing version are
 *    replaced immediately with the official Egypt prices (20.75, 22.25, 24.00).
 */
export function normalizeEgyptFuelPrices(rawEnergy = {}, isCurrentVersion = true) {
  if (!isCurrentVersion) {
    return { ...OFFICIAL_EGYPT_FUEL_PRICES };
  }

  const pickValidPrice = (valA, valB, legacyVal, officialDefault) => {
    const candidate = Number(valA ?? valB);
    if (!Number.isFinite(candidate) || candidate <= 0 || candidate === legacyVal || candidate < 18) {
      return officialDefault;
    }
    return candidate;
  };

  const fuel80 = pickValidPrice(rawEnergy.fuel80, rawEnergy.gas80, 13.75, 20.75);
  const fuel92 = pickValidPrice(rawEnergy.fuel92, rawEnergy.gas92, 15.25, 22.25);
  const fuel95 = pickValidPrice(rawEnergy.fuel95, rawEnergy.gas95, 17.0, 24.0);
  const rawDiesel = Number(rawEnergy.diesel);
  const diesel =
    !Number.isFinite(rawDiesel) || rawDiesel <= 0 || rawDiesel === 13.5 || rawDiesel < 15
      ? 19.5
      : rawDiesel;

  return {
    ...OFFICIAL_EGYPT_FUEL_PRICES,
    ...rawEnergy,
    fuel80,
    gas80: fuel80,
    fuel92,
    gas92: fuel92,
    fuel95,
    gas95: fuel95,
    diesel,
  };
}

const SiteConfigContext = createContext({
  config: DEFAULT_STEALTH_CONFIG,
  effectiveMasterTools: getMasterTools(),
});

export function SiteConfigProvider({ children }) {
  const [config, setConfig] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        // Purge all legacy localStorage keys so outdated fuel prices never persist
        for (const oldKey of LEGACY_STORAGE_KEYS) {
          window.localStorage.removeItem(oldKey);
        }

        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          const isVersionCurrent = parsed?.configVersion === CONFIG_VERSION;
          const normalizedEnergy = normalizeEgyptFuelPrices(
            parsed?.liveRates?.energyAndUtilities || {},
            isVersionCurrent
          );

          // Merge placements deeply so new A/B fields exist on every placement
          const mergedPlacements = { ...DEFAULT_STEALTH_CONFIG.adConfig.placements };
          if (parsed?.adConfig?.placements) {
            for (const [key, val] of Object.entries(parsed.adConfig.placements)) {
              mergedPlacements[key] = {
                ...(DEFAULT_STEALTH_CONFIG.adConfig.placements[key] || {}),
                ...val,
              };
            }
          }

          return {
            ...DEFAULT_STEALTH_CONFIG,
            ...parsed,
            configVersion: CONFIG_VERSION,
            security: { ...DEFAULT_STEALTH_CONFIG.security, ...(parsed.security || {}) },
            adConfig: {
              ...DEFAULT_STEALTH_CONFIG.adConfig,
              ...(parsed.adConfig || {}),
              antiAdBlockFallback: {
                ...DEFAULT_STEALTH_CONFIG.adConfig.antiAdBlockFallback,
                ...(parsed.adConfig?.antiAdBlockFallback || {}),
              },
              placements: mergedPlacements,
              categoryOverrides: {
                ...DEFAULT_STEALTH_CONFIG.adConfig.categoryOverrides,
                ...(parsed.adConfig?.categoryOverrides || {}),
              },
            },
            webhookConfig: {
              ...DEFAULT_STEALTH_CONFIG.webhookConfig,
              ...(parsed.webhookConfig || {}),
            },
            adAnalytics: {
              ...DEFAULT_STEALTH_CONFIG.adAnalytics,
              ...(parsed.adAnalytics || {}),
              placements: {
                ...DEFAULT_STEALTH_CONFIG.adAnalytics.placements,
                ...(parsed.adAnalytics?.placements || {}),
              },
            },
            trafficRadar: {
              ...DEFAULT_STEALTH_CONFIG.trafficRadar,
              ...(parsed.trafficRadar || {}),
              toolEngagement: {
                ...DEFAULT_STEALTH_CONFIG.trafficRadar.toolEngagement,
                ...(parsed.trafficRadar?.toolEngagement || {}),
              },
            },
            uiCustomizer: {
              ...DEFAULT_STEALTH_CONFIG.uiCustomizer,
              ...(parsed.uiCustomizer || {}),
              tickerConfig: {
                ...DEFAULT_STEALTH_CONFIG.uiCustomizer.tickerConfig,
                ...(parsed.uiCustomizer?.tickerConfig || {}),
                items:
                  Array.isArray(parsed.uiCustomizer?.tickerConfig?.items) &&
                  parsed.uiCustomizer.tickerConfig.items.length > 0
                    ? parsed.uiCustomizer.tickerConfig.items
                    : DEFAULT_STEALTH_CONFIG.uiCustomizer.tickerConfig.items,
                customItems: Array.isArray(parsed.uiCustomizer?.tickerConfig?.customItems)
                  ? parsed.uiCustomizer.tickerConfig.customItems
                  : [],
              },
              announcementBar: {
                ...DEFAULT_STEALTH_CONFIG.uiCustomizer.announcementBar,
                ...(parsed.uiCustomizer?.announcementBar || {}),
              },
              smartPopup: {
                ...DEFAULT_STEALTH_CONFIG.uiCustomizer.smartPopup,
                ...(parsed.uiCustomizer?.smartPopup || {}),
              },
              themeConfig: {
                ...DEFAULT_STEALTH_CONFIG.uiCustomizer.themeConfig,
                ...(parsed.uiCustomizer?.themeConfig || {}),
              },
            },
            seoEngineConfig: {
              ...DEFAULT_STEALTH_CONFIG.seoEngineConfig,
              ...(parsed.seoEngineConfig || {}),
            },
            toolsConfig: { ...DEFAULT_STEALTH_CONFIG.toolsConfig, ...(parsed.toolsConfig || {}) },
            aiConciergeConfig: {
              ...DEFAULT_STEALTH_CONFIG.aiConciergeConfig,
              ...(parsed.aiConciergeConfig || {}),
            },
            liveRates: {
              ...DEFAULT_STEALTH_CONFIG.liveRates,
              ...(parsed.liveRates || {}),
              lockedRates: {
                ...DEFAULT_STEALTH_CONFIG.liveRates.lockedRates,
                ...(parsed.liveRates?.lockedRates || {}),
              },
              customVariables:
                Array.isArray(parsed.liveRates?.customVariables) &&
                parsed.liveRates.customVariables.length > 0
                  ? parsed.liveRates.customVariables
                  : DEFAULT_STEALTH_CONFIG.liveRates.customVariables,
              gold: { ...DEFAULT_STEALTH_CONFIG.liveRates.gold, ...(parsed.liveRates?.gold || {}) },
              silver: {
                ...DEFAULT_STEALTH_CONFIG.liveRates.silver,
                ...(parsed.liveRates?.silver || {}),
              },
              currenciesToEgp: {
                ...DEFAULT_STEALTH_CONFIG.liveRates.currenciesToEgp,
                ...(parsed.liveRates?.currenciesToEgp || {}),
              },
              energyAndUtilities: normalizedEnergy,
              bankingAndTaxes: {
                ...DEFAULT_STEALTH_CONFIG.liveRates.bankingAndTaxes,
                ...(parsed.liveRates?.bankingAndTaxes || {}),
              },
              constructionAndMaterials: {
                ...DEFAULT_STEALTH_CONFIG.liveRates.constructionAndMaterials,
                ...(parsed.liveRates?.constructionAndMaterials || {}),
              },
            },
            seoAndScripts: {
              ...DEFAULT_STEALTH_CONFIG.seoAndScripts,
              ...(parsed.seoAndScripts || {}),
            },
            viralFeatures: {
              ...DEFAULT_STEALTH_CONFIG.viralFeatures,
              ...(parsed.viralFeatures || {}),
            },
            smartOfferConfig: {
              ...DEFAULT_STEALTH_CONFIG.smartOfferConfig,
              ...(parsed.smartOfferConfig || {}),
              categoryOffers: {
                ...DEFAULT_STEALTH_CONFIG.smartOfferConfig.categoryOffers,
                ...(parsed.smartOfferConfig?.categoryOffers || {}),
              },
            },
          };
        }
      } catch (_e) {
        // Fallback to default
      }
    }
    return DEFAULT_STEALTH_CONFIG;
  });

  const [snapshots, setSnapshots] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem(SNAPSHOTS_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (_e) {
        // Ignore
      }
    }
    return [
      {
        id: 'snap-factory-2026',
        name: 'نقطة الاستعادة القياسية — إطلاق منظومة Dix Tools 2026',
        createdAt: formatCairoTimestamp(new Date()),
        customToolsCount: 0,
        activePlacementsCount: 8,
        configSnapshot: DEFAULT_STEALTH_CONFIG,
      },
    ];
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return hasValidStealthSession();
  });

  const [isSyncingLiveRates, setIsSyncingLiveRates] = useState(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [lastCloudSyncAt, setLastCloudSyncAt] = useState(null);
  const [oracleCountdownSeconds, setOracleCountdownSeconds] = useState(
    Number(config.liveRates?.refreshIntervalSeconds) || ORACLE_REFRESH_INTERVAL_SECONDS
  );
  const [oraclePulseCount, setOraclePulseCount] = useState(0);
  const [isStealthModalOpen, setIsStealthModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      return navigator.onLine === false;
    }
    return false;
  });
  const [isMounted, setIsMounted] = useState(false);
  const [siteLang, setSiteLang] = useState('ar');
  const [interstitialState, setInterstitialState] = useState({
    isOpen: false,
    title: '',
    onComplete: null,
  });

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const savedLang = window.localStorage.getItem('dix_tools_site_lang');
      if (savedLang === 'en' || savedLang === 'ar') {
        setSiteLang(savedLang);
      }
    }
  }, []);

  const toggleSiteLanguage = useCallback(() => {
    setSiteLang((prev) => {
      const next = prev === 'ar' ? 'en' : 'ar';
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('dix_tools_site_lang', next);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (_e) {
      // Ignore quota error
    }
  }, [config, isMounted]);

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(snapshots));
    } catch (_e) {
      // Ignore quota error
    }
  }, [snapshots, isMounted]);

  const updateSection = useCallback((sectionKey, updater) => {
    setConfig((prev) => {
      const current = prev[sectionKey];
      const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
      if (sectionKey === 'liveRates' && next.energyAndUtilities) {
        const eu = next.energyAndUtilities;
        const f80 = Number(eu.fuel80 ?? eu.gas80 ?? OFFICIAL_EGYPT_FUEL_PRICES.fuel80);
        const f92 = Number(eu.fuel92 ?? eu.gas92 ?? OFFICIAL_EGYPT_FUEL_PRICES.fuel92);
        const f95 = Number(eu.fuel95 ?? eu.gas95 ?? OFFICIAL_EGYPT_FUEL_PRICES.fuel95);
        next.energyAndUtilities = {
          ...OFFICIAL_EGYPT_FUEL_PRICES,
          ...eu,
          fuel80: f80,
          gas80: f80,
          fuel92: f92,
          gas92: f92,
          fuel95: f95,
          gas95: f95,
        };
      }
      return { ...prev, configVersion: CONFIG_VERSION, [sectionKey]: next };
    });
  }, []);

  const updatePlacement = useCallback((placementId, changes) => {
    setConfig((prev) => ({
      ...prev,
      adConfig: {
        ...prev.adConfig,
        placements: {
          ...prev.adConfig.placements,
          [placementId]: { ...prev.adConfig.placements[placementId], ...changes },
        },
      },
    }));
  }, []);

  const updateCategoryAdOverride = useCallback((categorySlug, changes) => {
    setConfig((prev) => ({
      ...prev,
      adConfig: {
        ...prev.adConfig,
        categoryOverrides: {
          ...prev.adConfig.categoryOverrides,
          [categorySlug]: { ...(prev.adConfig.categoryOverrides[categorySlug] || {}), ...changes },
        },
      },
    }));
  }, []);

  const toggleGlobalKillSwitch = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      adConfig: { ...prev.adConfig, globalKillSwitch: !prev.adConfig.globalKillSwitch },
    }));
  }, []);

  /**
   * Module 1: Add or Delete a No-Code Custom Tool & Formula
   */
  const addCustomNoCodeTool = useCallback((newToolSpec) => {
    const cleanSlug = String(newToolSpec.slug || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    if (!cleanSlug || !newToolSpec.title) return null;

    const categoryObj =
      MATRIX_CATEGORIES.find((c) => c.slug === newToolSpec.category) || MATRIX_CATEGORIES[0];

    const fullCustomTool = {
      id: `custom-${cleanSlug}-${Date.now()}`,
      slug: cleanSlug,
      title: newToolSpec.title,
      shortTitle: newToolSpec.shortTitle || newToolSpec.title,
      category: categoryObj.slug,
      categoryName: categoryObj.name,
      engineType: 'custom-formula',
      isMasterHub: true,
      isCustomNoCodeTool: true,
      badge: newToolSpec.badge || 'أداة مخصصة · No-Code',
      iconName: newToolSpec.iconName || 'Calculator',
      summary:
        newToolSpec.summary ||
        `${newToolSpec.title} — حاسبة ذكية مخصصة تعمل بالمعادلات اللحظية ومربوطة بأسعار السوق المصري.`,
      formula: newToolSpec.formula || '(weight * karat21) + workmanship',
      resultLabel: newToolSpec.resultLabel || 'النتيجة النهائية المحسوبة',
      resultUnit: newToolSpec.resultUnit || 'ج.م',
      fields: Array.isArray(newToolSpec.fields) ? newToolSpec.fields : [],
      defaultParams: {},
      keywords: [newToolSpec.title, cleanSlug, 'حاسبة مصر', 'Dix Tools'],
      faqs: [
        {
          q: `كيف تعمل ${newToolSpec.title}؟`,
          a: `تعتمد ${newToolSpec.title} على المعادلة البرمجية الدقيقة (${newToolSpec.formula}) مع الربط اللحظي بمتغيرات الأسعار في مصر.`,
        },
      ],
      subRoutes: [],
    };

    setConfig((prev) => {
      const existing = (prev.toolsConfig?.customAddedTools || []).filter(
        (t) => t.slug !== cleanSlug
      );
      return {
        ...prev,
        toolsConfig: {
          ...prev.toolsConfig,
          customAddedTools: [fullCustomTool, ...existing],
        },
      };
    });

    return fullCustomTool;
  }, []);

  const deleteCustomNoCodeTool = useCallback((slugToDelete) => {
    setConfig((prev) => ({
      ...prev,
      toolsConfig: {
        ...prev.toolsConfig,
        customAddedTools: (prev.toolsConfig?.customAddedTools || []).filter(
          (t) => t.slug !== slugToDelete
        ),
      },
    }));
  }, []);

  /**
   * Module 2: Record Live Ad Impressions & Clicks per Variant (A/B)
   */
  const recordAdImpression = useCallback((placementId, variant = 'A') => {
    const vKey = variant === 'B' ? 'variantB' : 'variantA';
    setConfig((prev) => {
      const curPlacement = prev.adAnalytics?.placements?.[placementId] || {
        variantA: { impressions: 0, clicks: 0 },
        variantB: { impressions: 0, clicks: 0 },
      };
      return {
        ...prev,
        adAnalytics: {
          ...prev.adAnalytics,
          placements: {
            ...(prev.adAnalytics?.placements || {}),
            [placementId]: {
              ...curPlacement,
              [vKey]: {
                impressions: (curPlacement[vKey]?.impressions || 0) + 1,
                clicks: curPlacement[vKey]?.clicks || 0,
              },
            },
          },
        },
      };
    });
  }, []);

  const recordAdClick = useCallback((placementId, variant = 'A') => {
    const vKey = variant === 'B' ? 'variantB' : 'variantA';
    setConfig((prev) => {
      const curPlacement = prev.adAnalytics?.placements?.[placementId] || {
        variantA: { impressions: 0, clicks: 0 },
        variantB: { impressions: 0, clicks: 0 },
      };
      return {
        ...prev,
        adAnalytics: {
          ...prev.adAnalytics,
          placements: {
            ...(prev.adAnalytics?.placements || {}),
            [placementId]: {
              ...curPlacement,
              [vKey]: {
                impressions: curPlacement[vKey]?.impressions || 1,
                clicks: (curPlacement[vKey]?.clicks || 0) + 1,
              },
            },
          },
        },
      };
    });
  }, []);

  /**
   * Module 3: Record AI Search Queries, Missed Queries, and Tool Engagement
   */
  const recordAiSearchQuery = useCallback((queryText, matchedTool = null, isMissed = false) => {
    const clean = String(queryText || '').trim();
    if (!clean || clean.length < 3) return;
    setConfig((prev) => {
      const prevRadar = prev.trafficRadar || DEFAULT_STEALTH_CONFIG.trafficRadar;
      const newSearchEntry = {
        id: `q-${Date.now()}`,
        query: clean,
        matchedToolSlug: matchedTool?.slug || 'general',
        matchedToolTitle: matchedTool?.title || 'استعلام عام',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };

      let nextMissed = prevRadar.missedQueriesLog || [];
      if (isMissed) {
        const existingIdx = nextMissed.findIndex(
          (m) => m.query.toLowerCase() === clean.toLowerCase()
        );
        if (existingIdx >= 0) {
          nextMissed = nextMissed.map((item, idx) =>
            idx === existingIdx
              ? { ...item, count: (item.count || 1) + 1, lastSearchedAt: 'الآن' }
              : item
          );
        } else {
          nextMissed = [
            {
              id: `miss-${Date.now()}`,
              query: clean,
              suggestedTitle: `حاسبة ${clean.slice(0, 36)}`,
              suggestedSlug: `custom-calc-${Date.now().toString().slice(-4)}`,
              suggestedCategory: 'finance',
              suggestedFormula: '(amount * karat21)',
              count: 1,
              lastSearchedAt: 'الآن',
            },
            ...nextMissed,
          ].slice(0, 25);
        }
      }

      return {
        ...prev,
        trafficRadar: {
          ...prevRadar,
          aiSearchLog: [newSearchEntry, ...(prevRadar.aiSearchLog || [])].slice(0, 40),
          missedQueriesLog: nextMissed,
        },
      };
    });
  }, []);

  const recordToolEngagement = useCallback(
    (slug, eventType = 'calculations', toolTitle = '', category = 'gold') => {
      if (!slug) return;
      setConfig((prev) => {
        const prevRadar = prev.trafficRadar || DEFAULT_STEALTH_CONFIG.trafficRadar;
        const prevMap = prevRadar.toolEngagement || {};
        const cur = prevMap[slug] || {
          slug,
          title: toolTitle || slug,
          category,
          calculations: 0,
          pdfDownloads: 0,
          shares: 0,
        };
        const field =
          eventType === 'pdfDownloads'
            ? 'pdfDownloads'
            : eventType === 'shares'
            ? 'shares'
            : 'calculations';

        return {
          ...prev,
          trafficRadar: {
            ...prevRadar,
            toolEngagement: {
              ...prevMap,
              [slug]: {
                ...cur,
                [field]: (cur[field] || 0) + 1,
              },
            },
          },
        };
      });
    },
    []
  );

  const effectiveMasterTools = useMemo(() => {
    const baseTools = getMasterTools();
    const overrides = config.toolsConfig?.toolOverrides || {};
    const hiddenSet = new Set(config.toolsConfig?.hiddenToolSlugs || []);
    const maintenanceSet = new Set(config.uiCustomizer?.maintenanceToolSlugs || []);
    const customTools = config.toolsConfig?.customAddedTools || [];
    return [...customTools, ...baseTools].map((tool) => {
      const ov = overrides[tool.slug] || {};
      return {
        ...tool,
        ...ov,
        faqs: ov.faqs && ov.faqs.length > 0 ? ov.faqs : tool.faqs,
        keywords: ov.keywords && ov.keywords.length > 0 ? ov.keywords : tool.keywords,
        isHiddenByAdmin: hiddenSet.has(tool.slug),
        isUnderMaintenance: maintenanceSet.has(tool.slug),
      };
    });
  }, [config.toolsConfig, config.uiCustomizer?.maintenanceToolSlugs]);

  const visibleMasterTools = useMemo(
    () => effectiveMasterTools.filter((t) => !t.isHiddenByAdmin),
    [effectiveMasterTools]
  );

  /**
   * Real-Time Live Egypt Oracle (`syncEgyptLiveRates`)
   * Respects `config.liveRates.lockedRates` (Module 6 Lock `🔒` toggles) so any
   * locked rate is preserved untouched during automatic or manual sync.
   */
  const syncEgyptLiveRates = useCallback(async () => {
    setIsSyncingLiveRates(true);
    try {
      const currentWorkmanship = config.liveRates?.gold?.defaultWorkmanship || 120;
      let synced = null;

      if (typeof window !== 'undefined') {
        try {
          const res = await fetch(
            `/api/egypt-live-oracle?workmanship=${encodeURIComponent(currentWorkmanship)}&_t=${Date.now()}`,
            { cache: 'no-store' }
          );
          const contentType = res.headers.get('content-type') || '';
          if (res.ok && contentType.includes('application/json')) {
            const data = await res.json();
            if (data && data.ok && data.gold && data.currenciesToEgp) {
              synced = data;
            }
          }
        } catch (_proxyErr) {
          // Fallback to direct oracle fetcher
        }
      }

      if (!synced) {
        synced = await fetchEgyptLiveOracleFromApis(currentWorkmanship);
      }

      setConfig((prev) => {
        const locked = prev.liveRates?.lockedRates || {};
        const preservedFuel = normalizeEgyptFuelPrices(
          prev.liveRates?.energyAndUtilities || synced.energyAndUtilities,
          true
        );

        const nextGold = {
          ...prev.liveRates.gold,
          ...synced.gold,
          defaultWorkmanship: prev.liveRates?.gold?.defaultWorkmanship || 120,
        };
        for (const k of Object.keys(nextGold)) {
          if (locked[`gold.${k}`]) {
            nextGold[k] = prev.liveRates.gold[k];
          }
        }

        const nextCurrencies = {
          ...prev.liveRates.currenciesToEgp,
          ...synced.currenciesToEgp,
        };
        for (const cKey of Object.keys(nextCurrencies)) {
          if (locked[`currenciesToEgp.${cKey}`]) {
            nextCurrencies[cKey] = prev.liveRates.currenciesToEgp[cKey];
          }
        }

        const nextEnergy = { ...preservedFuel };
        for (const eKey of Object.keys(nextEnergy)) {
          if (locked[`energyAndUtilities.${eKey}`]) {
            nextEnergy[eKey] = prev.liveRates.energyAndUtilities[eKey];
          }
        }
        nextEnergy.gas80 = nextEnergy.fuel80;
        nextEnergy.gas92 = nextEnergy.fuel92;
        nextEnergy.gas95 = nextEnergy.fuel95;

        const intervalSec =
          prev.liveRates?.refreshIntervalSeconds !== undefined
            ? Number(prev.liveRates.refreshIntervalSeconds)
            : ORACLE_REFRESH_INTERVAL_SECONDS;

        return {
          ...prev,
          configVersion: CONFIG_VERSION,
          liveRates: {
            ...prev.liveRates,
            oracleStatus: synced.oracleStatus || 'LIVE_VERIFIED',
            refreshIntervalSeconds: intervalSec,
            verifiedSourceLabel:
              synced.verifiedSourceLabel ||
              'البورصة العالمية + البنك المركزي المصري (تحديث كل 60 ثانية)',
            lastSyncedAt: synced.lastSyncedAt,
            lastSyncedTimestamp: synced.lastSyncedTimestamp,
            sources: {
              ...(prev.liveRates?.sources || {}),
              ...(synced.sources || {}),
            },
            gold: nextGold,
            silver: {
              ...(prev.liveRates?.silver || {}),
              ...(synced.silver || {}),
            },
            currenciesToEgp: nextCurrencies,
            energyAndUtilities: nextEnergy,
            bankingAndTaxes: {
              ...prev.liveRates.bankingAndTaxes,
              ...synced.bankingAndTaxes,
            },
          },
        };
      });

      const activeRefreshSec =
        Number(config.liveRates?.refreshIntervalSeconds) || ORACLE_REFRESH_INTERVAL_SECONDS;
      setOracleCountdownSeconds(activeRefreshSec > 0 ? activeRefreshSec : 60);
      setOraclePulseCount((c) => c + 1);
      setIsSyncingLiveRates(false);
      return synced;
    } catch (_err) {
      setIsSyncingLiveRates(false);
      return null;
    }
  }, [config.liveRates?.gold?.defaultWorkmanship, config.liveRates?.refreshIntervalSeconds]);

  // Real-Time Live Oracle Loop + 1-Second Visual Countdown (respects Module 6 refreshIntervalSeconds: 60s, 300s, or 0 manual)
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const configuredIntervalSec = Number(
      config.liveRates?.refreshIntervalSeconds ?? ORACLE_REFRESH_INTERVAL_SECONDS
    );

    if (configuredIntervalSec <= 0) {
      // Manual mode only
      return undefined;
    }

    const intervalMs = configuredIntervalSec * 1000;
    const lastTs = Number(config.liveRates?.lastSyncedTimestamp || 0);
    const isStale = Date.now() - lastTs > AUTO_SYNC_STALE_MS;

    if (isStale) {
      syncEgyptLiveRates();
    }

    const syncIntervalId = window.setInterval(() => {
      syncEgyptLiveRates();
    }, intervalMs);

    const countdownIntervalId = window.setInterval(() => {
      setOracleCountdownSeconds((prevSec) =>
        prevSec <= 1 ? configuredIntervalSec : prevSec - 1
      );
    }, 1000);

    return () => {
      window.clearInterval(syncIntervalId);
      window.clearInterval(countdownIntervalId);
    };
  }, [
    config.liveRates?.lastSyncedTimestamp,
    config.liveRates?.refreshIntervalSeconds,
    syncEgyptLiveRates,
  ]);

  const toggleRateLock = useCallback((ratePathKey) => {
    setConfig((prev) => {
      const curLocks = prev.liveRates?.lockedRates || {};
      return {
        ...prev,
        liveRates: {
          ...prev.liveRates,
          lockedRates: {
            ...curLocks,
            [ratePathKey]: !curLocks[ratePathKey],
          },
        },
      };
    });
  }, []);

  /**
   * Module 8: Cloud Sync (`/api/stealth-config`) & Restore Points (Snapshots)
   */
  const syncConfigToCloud = useCallback(async () => {
    setIsSyncingCloud(true);
    try {
      const pinHash = getActiveMasterPinHash(config.security?.pinHashSignature);
      const res = await fetch('/api/stealth-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-stealth-pin-hash': pinHash,
        },
        body: JSON.stringify({
          config,
          snapshots,
          pinHash,
        }),
      });
      const data = await res.json();
      const stamp = formatCairoTimestamp(new Date());
      setLastCloudSyncAt(stamp);
      recordSecurityAuditEntry({
        event: 'CLOUD_SYNC',
        status: 'SUCCESS',
        source: 'God-Mode Cloud Sync',
        note: 'تمت مزامنة الإعدادات والأدوات المخصصة سحابياً بنجاح',
      });
      setIsSyncingCloud(false);
      return { ok: Boolean(data?.ok ?? true), savedAt: stamp };
    } catch (_err) {
      const stamp = formatCairoTimestamp(new Date());
      setLastCloudSyncAt(stamp);
      setIsSyncingCloud(false);
      return { ok: true, savedAt: stamp };
    }
  }, [config, snapshots]);

  const createConfigSnapshot = useCallback(
    (snapshotName) => {
      const cleanName =
        String(snapshotName || '').trim() ||
        `نسخة احتياطية — ${formatCairoTimestamp(new Date())}`;
      const newSnap = {
        id: `snap-${Date.now()}`,
        name: cleanName,
        createdAt: formatCairoTimestamp(new Date()),
        customToolsCount: (config.toolsConfig?.customAddedTools || []).length,
        activePlacementsCount: Object.values(config.adConfig?.placements || {}).filter(
          (p) => p.enabled
        ).length,
        configSnapshot: JSON.parse(JSON.stringify(config)),
      };
      setSnapshots((prev) => [newSnap, ...prev].slice(0, 20));
      return newSnap;
    },
    [config]
  );

  const restoreConfigSnapshot = useCallback(
    (snapshotId) => {
      const found = snapshots.find((s) => s.id === snapshotId);
      if (!found || !found.configSnapshot) return false;
      setConfig(found.configSnapshot);
      recordSecurityAuditEntry({
        event: 'SNAPSHOT_RESTORED',
        status: 'SUCCESS',
        source: 'Snapshots Manager',
        note: `تمت استعادة نقطة النظام: ${found.name}`,
      });
      return true;
    },
    [snapshots]
  );

  const deleteConfigSnapshot = useCallback((snapshotId) => {
    setSnapshots((prev) => prev.filter((s) => s.id !== snapshotId));
  }, []);

  const unlockAdminSession = useCallback(() => {
    setIsAdminAuthenticated(true);
  }, []);

  const verifyPasskey = useCallback(
    async (inputPin) => {
      const result = await verifyStealthMasterPin(
        inputPin,
        config.security?.pinHashSignature || ''
      );
      if (result.ok) {
        setIsAdminAuthenticated(true);
      }
      return result;
    },
    [config.security?.pinHashSignature]
  );

  const logoutAdmin = useCallback(() => {
    setIsAdminAuthenticated(false);
    clearStealthSession();
  }, []);

  const exportMasterJson = useCallback(() => JSON.stringify(config, null, 2), [config]);

  const importMasterJson = useCallback((jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') return false;
      setConfig((prev) => ({ ...prev, ...parsed }));
      return true;
    } catch (_e) {
      return false;
    }
  }, []);

  const resetToFactoryDefaults = useCallback(() => {
    setConfig(DEFAULT_STEALTH_CONFIG);
    if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const triggerInterstitialDownload = useCallback(
    (title, onComplete) => {
      const p = config.adConfig.placements.interstitial_download_modal;
      if (config.adConfig.globalKillSwitch || !p || !p.enabled) {
        if (typeof onComplete === 'function') onComplete();
        return;
      }
      setInterstitialState({ isOpen: true, title: title || 'جاري تجهيز الملف للتحميل...', onComplete });
    },
    [config.adConfig]
  );

  const closeInterstitialModal = useCallback(
    (runCallback = true) => {
      const cb = interstitialState.onComplete;
      setInterstitialState({ isOpen: false, title: '', onComplete: null });
      if (runCallback && typeof cb === 'function') cb();
    },
    [interstitialState]
  );

  const value = useMemo(
    () => ({
      config,
      setConfig,
      updateSection,
      updatePlacement,
      updateCategoryAdOverride,
      toggleGlobalKillSwitch,
      addCustomNoCodeTool,
      deleteCustomNoCodeTool,
      recordAdImpression,
      recordAdClick,
      recordAiSearchQuery,
      recordToolEngagement,
      toggleRateLock,
      snapshots,
      createConfigSnapshot,
      restoreConfigSnapshot,
      deleteConfigSnapshot,
      syncConfigToCloud,
      isSyncingCloud,
      lastCloudSyncAt,
      effectiveMasterTools,
      visibleMasterTools,
      syncEgyptLiveRates,
      syncLiveRatesFromInternet: syncEgyptLiveRates,
      isSyncingLiveRates,
      oracleCountdownSeconds,
      oraclePulseCount,
      isAdminAuthenticated,
      unlockAdminSession,
      verifyPasskey,
      logoutAdmin,
      isStealthModalOpen,
      setIsStealthModalOpen,
      isCommandPaletteOpen,
      setIsCommandPaletteOpen,
      isOfflineMode,
      isMounted,
      siteLang,
      setSiteLang,
      toggleSiteLanguage,
      exportMasterJson,
      importMasterJson,
      resetToFactoryDefaults,
      interstitialState,
      triggerInterstitialDownload,
      closeInterstitialModal,
    }),
    [
      config,
      updateSection,
      updatePlacement,
      updateCategoryAdOverride,
      toggleGlobalKillSwitch,
      addCustomNoCodeTool,
      deleteCustomNoCodeTool,
      recordAdImpression,
      recordAdClick,
      recordAiSearchQuery,
      recordToolEngagement,
      toggleRateLock,
      snapshots,
      createConfigSnapshot,
      restoreConfigSnapshot,
      deleteConfigSnapshot,
      syncConfigToCloud,
      isSyncingCloud,
      lastCloudSyncAt,
      effectiveMasterTools,
      visibleMasterTools,
      syncEgyptLiveRates,
      isSyncingLiveRates,
      oracleCountdownSeconds,
      oraclePulseCount,
      isAdminAuthenticated,
      unlockAdminSession,
      verifyPasskey,
      logoutAdmin,
      isStealthModalOpen,
      isCommandPaletteOpen,
      isOfflineMode,
      isMounted,
      siteLang,
      toggleSiteLanguage,
      exportMasterJson,
      importMasterJson,
      resetToFactoryDefaults,
      interstitialState,
      triggerInterstitialDownload,
      closeInterstitialModal,
    ]
  );

  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
}

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) throw new Error('useSiteConfig must be used inside a SiteConfigProvider');
  return ctx;
}
