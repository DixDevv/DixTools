/**
 * ============================================================================
 * MEEZAN HUB ARCHITECTURE (`lib/tools-matrix-generator.js`)
 * Master Hub Tools (52 Distinct UI Tools) vs. Background SEO Sub-Routes (6,363+)
 *
 * Architectural Separation:
 * 1. `getMasterTools()` -> Returns 52 completely distinct Master Hub Tools
 *    (`isMasterTool: true`, `isSubVariant: false`). Used EXCLUSIVELY in the
 *    Homepage (`app/page.jsx`), Category grids, and Related Tools mesh so the
 *    user never sees repetitive currency/weight/karat cards!
 * 2. `getSeoSubRoutes()` -> Generates 6,363+ background programmatic SEO routes
 *    (`isSubVariant: true`, `isMasterTool: false`, `parentMasterSlug`) for
 *    `app/sitemap.js` and Google organic search landing, which automatically
 *    open the parent Master Tool pre-configured with the sub-route's parameters.
 * ============================================================================
 */

export const SITE_CONFIG = {
  name: 'Dix Tools | منصة الأدوات والخدمات الذكية الشاملة',
  shortName: 'Dix Tools',
  domain: 'https://dixtools.com',
  description:
    'منصة ديكس تولز للخدمات والأدوات الذكية (Dix Tools): أكثر من 52 أداة وحاسبة رئيسية شاملة (و6,400+ مسار بحث مخصص) تعمل محلياً 100% من المتصفح: المال والذهب والزكاة، المواريث، التفقيط، السيارات والخدمات، استوديو الصور والـ QR، ومولدات العقود الرسمية A4.',
  adsensePublisherId: 'ca-pub-8942019482716500',
};

export const MATRIX_CATEGORIES = [
  {
    id: 'currencies',
    slug: 'currencies',
    pillarId: 'pillar-finance',
    name: 'المال والعملات وأسعار الصرف',
    shortName: 'المال والعملات',
    engineType: 'currency',
    icon: 'ArrowLeftRight',
    badge: 'محول شامل + عملات وبنوك',
    description: 'محول العملات الشامل لجميع عملات العالم وحاسبات العمولات البنكية والتجارة الإلكترونية.',
  },
  {
    id: 'gold',
    slug: 'gold',
    pillarId: 'pillar-finance',
    name: 'الذهب والسبائك والزكاة والمواريث',
    shortName: 'الذهب والزكاة',
    engineType: 'gold',
    icon: 'Gem',
    badge: 'شامل الأعيرة والزكاة والتركات',
    description: 'حاسبة الذهب الشاملة بالمصنعية والكاش باك، وحاسبة زكاة المال والذهب، وتقسيم المواريث الشرعية.',
  },
  {
    id: 'finance',
    slug: 'finance',
    pillarId: 'pillar-finance',
    name: 'البنوك والقروض والشهادات والتجارة',
    shortName: 'البنوك والتجارة',
    engineType: 'finance',
    icon: 'Landmark',
    badge: 'قروض وشهادات وتسعير منتجات',
    description: 'حاسبات القروض، الشهادات البنكية، تسعير المنتجات، الجمارك والضريبة، نهاية الخدمة، والتضخم.',
  },
  {
    id: 'automotive',
    slug: 'automotive',
    pillarId: 'pillar-daily',
    name: 'السيارات والوقود وفواتير المرافق',
    shortName: 'السيارات والمرافق',
    engineType: 'energy',
    icon: 'Fuel',
    badge: 'بنزين وصيانة وكهرباء ومياه',
    description: 'حاسبة استهلاك البنزين وتكلفة المشوار، صيانة السيارات وتغيير الزيت، وفواتير الكهرباء والمياه والغاز.',
  },
  {
    id: 'units',
    slug: 'units',
    pillarId: 'pillar-daily',
    name: 'المساحات والقياسات والحاسبات اليومية',
    shortName: 'القياسات والخدمات اليومية',
    engineType: 'unit',
    icon: 'Scale',
    badge: 'مساحات وأراضي وعمر وصحة وبناء',
    description: 'محول المساحات الزراعية الشامل، القياسات الهندسية، حاسبة العمر، BMI، الحمل، GPA، وتكلفة البناء.',
  },
  {
    id: 'images',
    slug: 'images',
    pillarId: 'pillar-media',
    name: 'استوديو الصور والـ PDF والسوشيال ميديا',
    shortName: 'استوديو الصور والـ PDF',
    engineType: 'image',
    icon: 'ImageDown',
    badge: 'HTML5 Canvas بدون سيرفر',
    description: 'استوديو ضغط وتحويل صيغ الصور الشامل، دمج الصور إلى PDF، وضبط مقاسات السوشيال ميديا.',
  },
  {
    id: 'digital',
    slug: 'digital',
    pillarId: 'pillar-media',
    name: 'أدوات الـ QR والتفقيط والنصوص والأكواد',
    shortName: 'الـ QR والتفقيط والأكواد',
    engineType: 'qr',
    icon: 'QrCode',
    badge: 'تفقيط الشيكات وQR وأدوات المطورين',
    description: 'تفقيط المبالغ المالية بالحروف العربية، استوديو QR والباركود، روابط واتساب، كلمات المرور، وJSON.',
  },
  {
    id: 'documents',
    slug: 'documents',
    pillarId: 'pillar-documents',
    name: 'مولدات العقود الرسمية والفواتير والـ CV',
    shortName: 'العقود والفواتير A4',
    engineType: 'document',
    icon: 'FileSignature',
    badge: 'جاهز للطباعة A4 PDF',
    description: 'مولد عقود بيع السيارات، إيجار الشقق، الفواتير الضريبية، السيرة الذاتية ATS CV، وإيصالات الاستلام.',
  },
];

/* ----------------------------------------------------------------------------
 * SHARED DATASETS FOR DROPDOWNS & BACKGROUND SEO MATRIX
 * -------------------------------------------------------------------------- */
export const CURRENCY_LIST = [
  { code: 'USD', name: 'الدولار الأمريكي', short: 'دولار أمريكي', symbol: '$', rateToEgp: 50.45 },
  { code: 'EGP', name: 'الجنيه المصري', short: 'جنيه مصري', symbol: 'ج.م', rateToEgp: 1.0 },
  { code: 'SAR', name: 'الريال السعودي', short: 'ريال سعودي', symbol: 'ر.س', rateToEgp: 13.45 },
  { code: 'AED', name: 'الدرهم الإماراتي', short: 'درهم إماراتي', symbol: 'د.إ', rateToEgp: 13.74 },
  { code: 'KWD', name: 'الدينار الكويتي', short: 'دينار كويتي', symbol: 'د.ك', rateToEgp: 164.2 },
  { code: 'QAR', name: 'الريال القطري', short: 'ريال قطري', symbol: 'ر.ق', rateToEgp: 13.85 },
  { code: 'BHD', name: 'الدينار البحريني', short: 'دينار بحريني', symbol: 'د.ب', rateToEgp: 133.8 },
  { code: 'OMR', name: 'الريال العماني', short: 'ريال عماني', symbol: 'ر.ع', rateToEgp: 131.0 },
  { code: 'JOD', name: 'الدينار الأردني', short: 'دينار أردني', symbol: 'د.أ', rateToEgp: 71.15 },
  { code: 'EUR', name: 'اليورو الأوروبي', short: 'يورو', symbol: '€', rateToEgp: 54.6 },
  { code: 'GBP', name: 'الجنيه الإسترليني', short: 'جنيه إسترليني', symbol: '£', rateToEgp: 64.1 },
  { code: 'CHF', name: 'الفرنك السويسري', short: 'فرنك سويسري', symbol: 'CHF', rateToEgp: 57.2 },
  { code: 'CAD', name: 'الدولار الكندي', short: 'دولار كندي', symbol: 'C$', rateToEgp: 36.4 },
  { code: 'AUD', name: 'الدولار الأسترالي', short: 'دولار أسترالي', symbol: 'A$', rateToEgp: 33.1 },
  { code: 'JPY', name: 'الين الياباني', short: 'ين ياباني', symbol: '¥', rateToEgp: 0.33 },
  { code: 'CNY', name: 'اليوان الصيني', short: 'يوان صيني', symbol: '¥', rateToEgp: 6.98 },
  { code: 'TRY', name: 'الليرة التركية', short: 'ليرة تركية', symbol: '₺', rateToEgp: 1.47 },
  { code: 'MAD', name: 'الدرهم المغربي', short: 'درهم مغربي', symbol: 'د.م', rateToEgp: 5.05 },
  { code: 'DZD', name: 'الدينار الجزائري', short: 'دينار جزائري', symbol: 'د.ج', rateToEgp: 0.375 },
  { code: 'TND', name: 'الدينار التونسي', short: 'دينار تونسي', symbol: 'د.ت', rateToEgp: 16.15 },
  { code: 'LYD', name: 'الدينار الليبي', short: 'دينار ليبي', symbol: 'د.ل', rateToEgp: 10.38 },
  { code: 'IQD', name: 'الدينار العراقي', short: 'دينار عراقي', symbol: 'د.ع', rateToEgp: 0.0385 },
  { code: 'LBP', name: 'الليرة اللبنانية', short: 'ليرة لبنانية', symbol: 'ل.ل', rateToEgp: 0.00056 },
  { code: 'SDG', name: 'الجنيه السوداني', short: 'جنيه سوداني', symbol: 'ج.س', rateToEgp: 0.084 },
  { code: 'YER', name: 'الريال اليمني', short: 'ريال يمني', symbol: 'ر.ي', rateToEgp: 0.2 },
  { code: 'RUB', name: 'الروبل الروسي', short: 'روبل روسي', symbol: '₽', rateToEgp: 0.52 },
  { code: 'INR', name: 'الروبية الهندية', short: 'روبية هندية', symbol: '₹', rateToEgp: 0.6 },
  { code: 'MYR', name: 'الرينغيت الماليزي', short: 'رينغيت ماليزي', symbol: 'RM', rateToEgp: 11.45 },
];

export const GOLD_KARATS = [
  { karat: 24, name: 'عيار 24 (سبائك نقية 999.9)', slug: '24k', workmanshipDefault: 60 },
  { karat: 22, name: 'عيار 22 (ذهب خليجي)', slug: '22k', workmanshipDefault: 95 },
  { karat: 21, name: 'عيار 21 (الأكثر تداولاً والعملات)', slug: '21k', workmanshipDefault: 120 },
  { karat: 18, name: 'عيار 18 (مشغولات عصرية)', slug: '18k', workmanshipDefault: 210 },
  { karat: 14, name: 'عيار 14 (مشغولات اقتصادية)', slug: '14k', workmanshipDefault: 180 },
  { karat: 12, name: 'عيار 12', slug: '12k', workmanshipDefault: 150 },
];

export const GOLD_WEIGHTS = [
  { weight: 1, label: '1 جرام (سبيكة دقيقة)', slug: '1-gram', cashback: 40 },
  { weight: 2.5, label: '2.5 جرام (سبيكة ربع توله)', slug: '2-5-gram', cashback: 45 },
  { weight: 4, label: '4 جرام (نصف جنيه ذهب)', slug: '4-gram', cashback: 45 },
  { weight: 5, label: '5 جرام (سبيكة استثمارية)', slug: '5-gram', cashback: 50 },
  { weight: 8, label: '8 جرام (جنيه ذهب كامل)', slug: '8-gram-coin', cashback: 50 },
  { weight: 10, label: '10 جرام (سبيكة قياسية)', slug: '10-gram', cashback: 50 },
  { weight: 15, label: '15 جرام (شبكة أو طقم خفيف)', slug: '15-gram', cashback: 20 },
  { weight: 20, label: '20 جرام (سبيكة متوسطة)', slug: '20-gram', cashback: 50 },
  { weight: 25, label: '25 جرام', slug: '25-gram', cashback: 35 },
  { weight: 31.1, label: '31.1 جرام (أونصة ذهب كاملة)', slug: '31-1-ounce', cashback: 50 },
  { weight: 40, label: '40 جرام (5 جنيهات ذهب)', slug: '40-gram', cashback: 50 },
  { weight: 50, label: '50 جرام (سبيكة كبيرة)', slug: '50-gram', cashback: 50 },
  { weight: 85, label: '85 جرام (نصاب الزكاة الشرعي)', slug: '85-gram-nisab', cashback: 50 },
  { weight: 100, label: '100 جرام (سبيكة بنكية)', slug: '100-gram', cashback: 50 },
  { weight: 250, label: '250 جرام (ربع كيلو ذهب)', slug: '250-gram', cashback: 50 },
  { weight: 500, label: '500 جرام (نصف كيلو ذهب)', slug: '500-gram', cashback: 50 },
  { weight: 1000, label: '1000 جرام (كيلو ذهب خالص)', slug: '1000-gram-kilo', cashback: 55 },
];

export const GOLD_MARKETS = [
  { code: 'EGP', country: 'مصر', currency: 'ج.م', slug: 'egypt', base21Price: 3780 },
  { code: 'SAR', country: 'السعودية', currency: 'ر.س', slug: 'saudi', base21Price: 293 },
  { code: 'AED', country: 'الإمارات', currency: 'د.إ', slug: 'uae', base21Price: 287 },
  { code: 'KWD', country: 'الكويت', currency: 'د.ك', slug: 'kuwait', base21Price: 24.5 },
  { code: 'QAR', country: 'قطر', currency: 'ر.ق', slug: 'qatar', base21Price: 285 },
  { code: 'JOD', country: 'الأردن', currency: 'د.أ', slug: 'jordan', base21Price: 55.4 },
  { code: 'USD', country: 'السوق العالمي بالدولار', currency: '$', slug: 'global-usd', base21Price: 78.2 },
];

export const GOLD_CALC_MODES = [
  { id: 'buy-workmanship', name: 'حساب سعر الشراء بالمصنعية والدمغة', short: 'شراء بالمصنعية' },
  { id: 'zakat-check', name: 'حساب زكاة الذهب والنصاب الشرعي', short: 'زكاة الذهب' },
];

export const UNIT_FAMILIES = [
  {
    familyId: 'area',
    familyName: 'المساحات والأراضي الزراعية والعقارية',
    units: [
      { id: 'sqm', name: 'متر مربع (م²)', factorToBase: 1 },
      { id: 'feddan', name: 'فدان زراعي مصري', factorToBase: 4200.833 },
      { id: 'qirat', name: 'قيراط أراضي (1/24 فدان)', factorToBase: 175.0347 },
      { id: 'sahm', name: 'سهم زراعي (1/24 قيراط)', factorToBase: 7.2931 },
      { id: 'hectare', name: 'هكتار دولي', factorToBase: 10000 },
      { id: 'acre', name: 'إيكر (Acre)', factorToBase: 4046.856 },
      { id: 'dunam', name: 'دونم (1000 م²)', factorToBase: 1000 },
      { id: 'sqkm', name: 'كيلومتر مربع (كم²)', factorToBase: 1000000 },
      { id: 'sqft', name: 'قدم مربع (ft²)', factorToBase: 0.092903 },
      { id: 'sqyd', name: 'ياردة مربعة (yd²)', factorToBase: 0.836127 },
    ],
  },
  {
    familyId: 'length',
    familyName: 'الأطوال والمسافات الهندسية',
    units: [
      { id: 'meter', name: 'متر (m)', factorToBase: 1 },
      { id: 'km', name: 'كيلومتر (km)', factorToBase: 1000 },
      { id: 'cm', name: 'سنتيمتر (cm)', factorToBase: 0.01 },
      { id: 'mm', name: 'ملليمتر (mm)', factorToBase: 0.001 },
      { id: 'inch', name: 'بوصة / إنش (Inch)', factorToBase: 0.0254 },
      { id: 'foot', name: 'قدم (Foot)', factorToBase: 0.3048 },
      { id: 'yard', name: 'ياردة (Yard)', factorToBase: 0.9144 },
      { id: 'mile', name: 'ميل بري (Mile)', factorToBase: 1609.344 },
      { id: 'nautical-mile', name: 'ميل بحري (Nautical Mile)', factorToBase: 1852 },
      { id: 'qasaba', name: 'قصبة مساحية مصرية', factorToBase: 3.55 },
    ],
  },
  {
    familyId: 'weight',
    familyName: 'الأوزان والكتل وتجارة المعادن',
    units: [
      { id: 'kg', name: 'كيلوجرام (kg)', factorToBase: 1 },
      { id: 'gram', name: 'جرام (g)', factorToBase: 0.001 },
      { id: 'ton', name: 'طن متري (Ton)', factorToBase: 1000 },
      { id: 'pound', name: 'رطل إنجليزي (lb)', factorToBase: 0.453592 },
      { id: 'ounce-troy', name: 'أونصة ذهب تروي (31.1g)', factorToBase: 0.0311035 },
      { id: 'ounce-std', name: 'أوقية عادية (oz)', factorToBase: 0.0283495 },
      { id: 'qintar', name: 'قنطار مصري زراعي', factorToBase: 44.928 },
      { id: 'dirham', name: 'درهم شرعي (3.12g)', factorToBase: 0.00312 },
      { id: 'carat', name: 'قيراط ألماس (0.2g)', factorToBase: 0.0002 },
    ],
  },
  {
    familyId: 'volume',
    familyName: 'الحجوم والسوائل والمكاييل',
    units: [
      { id: 'liter', name: 'لتر قياسي (L)', factorToBase: 1 },
      { id: 'ml', name: 'ملليلتر (mL)', factorToBase: 0.001 },
      { id: 'cubic-meter', name: 'متر مكعب (م³)', factorToBase: 1000 },
      { id: 'gallon-us', name: 'جالون أمريكي (Gal)', factorToBase: 3.78541 },
      { id: 'barrel-oil', name: 'برميل نفط قياسي', factorToBase: 158.987 },
      { id: 'cup', name: 'كوب معياري (240mL)', factorToBase: 0.24 },
      { id: 'ardab', name: 'إردب حبوب مصري', factorToBase: 198 },
      { id: 'kaila', name: 'كيلة زراعية', factorToBase: 16.5 },
    ],
  },
  {
    familyId: 'speed',
    familyName: 'السرعة والملاحة والرياح',
    units: [
      { id: 'kmh', name: 'كيلومتر في الساعة (km/h)', factorToBase: 1 },
      { id: 'mph', name: 'ميل في الساعة (mph)', factorToBase: 1.60934 },
      { id: 'ms', name: 'متر في الثانية (m/s)', factorToBase: 3.6 },
      { id: 'knot', name: 'عقدة بحرية (Knot)', factorToBase: 1.852 },
      { id: 'mach', name: 'ماخ (سرعة الصوت)', factorToBase: 1225.04 },
    ],
  },
  {
    familyId: 'digital-storage',
    familyName: 'سعات التخزين الرقمي والبيانات',
    units: [
      { id: 'mb', name: 'ميجابايت (MB)', factorToBase: 1 },
      { id: 'kb', name: 'كيلوبايت (KB)', factorToBase: 0.0009765625 },
      { id: 'gb', name: 'جيجابايت (GB)', factorToBase: 1024 },
      { id: 'tb', name: 'تيرابايت (TB)', factorToBase: 1048576 },
      { id: 'mbit', name: 'ميجابت (Mbit)', factorToBase: 0.125 },
      { id: 'gbit', name: 'جيجابت (Gbit)', factorToBase: 128 },
    ],
  },
];

export const FUEL_GRADES = [
  { id: 'fuel80', key: 'fuel80', name: 'بنزين 80', fullName: 'بنزين 80 بسعر 20.75 ج.م', price: 20.75 },
  { id: 'fuel92', key: 'fuel92', name: 'بنزين 92', fullName: 'بنزين 92 بسعر 22.25 ج.م', price: 22.25 },
  { id: 'fuel95', key: 'fuel95', name: 'بنزين 95', fullName: 'بنزين 95 بسعر 24.00 ج.م', price: 24.0 },
  { id: 'diesel', key: 'diesel', name: 'سولار / ديزل', fullName: 'سولار / ديزل بسعر 19.50 ج.م', price: 19.5 },
];

function buildDynamicFaqs(title, categoryName, summary, formulaHint) {
  return [
    {
      question: `كيف تعمل أداة «${title}» وما مدى دقة نتائجها؟`,
      answer: `${summary} تعتمد الأداة على معادلات رياضية ومصرفية قياسية (${formulaHint}) وتعمل مباشرة من متصفحك بسرعة لحظية دون الحاجة لإرسال بياناتك لأي خادم خارجي.`,
    },
    {
      question: `هل تغنيني هذه الأداة الشاملة عن البحث في عشرات الصفحات المتفرقة؟`,
      answer: `نعم بالتأكيد. صممت أداة «${title}» بنظام المركز الشامل (Master Hub Tool) حيث تضم بداخلها جميع القوائم المنسدلة للعملات، الأعيرة، الوحدات، أو الصيغ في شاشة واحدة مع إمكانية التبديل اللحظي.`,
    },
    {
      question: `هل استخدام ${title} مجاني بالكامل ويدعم الهواتف الذكية؟`,
      answer: `نعم، جميع أدوات قسم «${categoryName}» على منصة مِيزان مجانية 100% ومصممة بتقنية التجاوب الذكي للعمل بكفاءة عالية على الهواتف المحمولة والأجهزة اللوحية وأجهزة الكمبيوتر.`,
    },
    {
      question: `كيف أحتفظ بالنتيجة أو أطبع التقرير الناتج من الأداة؟`,
      answer: `تتيح لك الأداة نسخ النتيجة بضغطة زر، أو مشاركة الرابط المخصص بالمتغيرات، أو طباعة وحفظ المخرجات مباشرة بتنسيق A4 PDF أو صور عالية الجودة.`,
    },
  ];
}

/* ============================================================================
 * PART 1: THE 52 DISTINCT MASTER HUB TOOLS (`isMasterTool: true`)
 * Shown on Homepage (`app/page.jsx`) and Category Grids — ZERO DUPLICATION!
 * ========================================================================== */
const RAW_MASTER_TOOLS_SPEC = [
  // --------------------------------------------------------------------------
  // PILLAR 1: المال والبنوك والتجارة (14 Distinct Master Tools)
  // --------------------------------------------------------------------------
  {
    slug: 'comprehensive-currency-converter',
    category: 'currencies',
    pillarId: 'pillar-finance',
    engineType: 'currency',
    badge: '28 عملة · تبديل فوري ⇄',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'merchants',
    title: 'محول العملات الشامل وأسعار الصرف اليوم',
    shortTitle: 'محول العملات الشامل',
    subtitle: 'جميع عملات العالم في شاشة واحدة مع زر التبديل ⇄ وجدول المضاعفات وعمولة البنك',
    summary:
      'محول العملات الرئيسي الشامل لـ 28 عملة عربية وعالمية (الدولار، الريال، الدرهم، الدينار، اليورو، الجنيه..) مع قوائم منسدلة ذكية، حساب عمولة تدبير العملة، وجدول مضاعفات الفئات النقدية.',
    defaultParams: { fromCode: 'USD', toCode: 'EGP', amount: 100, defaultRate: 50.45 },
    visualConfig: {
      theme: 'gold-currency',
      primarySymbol: 'USD ⇄ EGP',
      secondarySymbol: '28 FX',
      accentLabel: 'محول العملات الشامل',
    },
  },
  {
    slug: 'comprehensive-gold-calculator',
    category: 'gold',
    pillarId: 'pillar-finance',
    engineType: 'gold',
    badge: 'جميع الأعيرة والسبائك',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'banks-gold',
    title: 'حاسبة أسعار الذهب والمصنعية والسبائك الشاملة',
    shortTitle: 'حاسبة الذهب والسبائك الشاملة',
    subtitle: 'عيار 24 و21 و18 والسبائك والجنيهات مع حساب المصنعية والدمغة والكاش باك',
    summary:
      'الأداة الشاملة لحساب أسعار شراء وبيع الذهب والمشغولات والسبائك والجنيه الذهب في مصر والسعودية والإمارات والكويت، شاملة المصنعية والدمغة ونسبة استرداد الكاش باك عند البيع.',
    defaultParams: {
      calcMode: 'buy-workmanship',
      selectedKarat: 21,
      weightGrams: 8,
      baseKarat21Price: 3780,
      currencySymbol: 'ج.م',
    },
    visualConfig: {
      theme: 'gold-bullion',
      primarySymbol: '24K · 21K',
      secondarySymbol: '999.9',
      accentLabel: 'حاسبة الذهب الشاملة',
    },
  },
  {
    slug: 'zakat-wealth-gold-calculator',
    category: 'gold',
    pillarId: 'pillar-finance',
    engineType: 'gold',
    badge: 'نصاب 85 جم عيار 24',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'banks-gold',
    title: 'حاسبة زكاة المال والذهب والمدخرات الشرعية',
    shortTitle: 'حاسبة زكاة المال والذهب',
    subtitle: 'حساب نصاب الزكاة الشرعي ومكافئ الذهب الخالص وربع العشر (2.5%) للنقود والذهب والأسهم',
    summary:
      'احسب زكاة أموالك ومدخراتك البنكية ومقتنيات الذهب (عيار 24 و21 و18) وعروض التجارة والأسهم بعد خصم الديون ومقارنتها بنصاب 85 جراماً من الذهب الخالص.',
    defaultParams: {
      calcMode: 'zakat-check',
      selectedKarat: 21,
      weightGrams: 100,
      baseKarat21Price: 3780,
      currencySymbol: 'ج.م',
    },
    visualConfig: {
      theme: 'gold-bullion',
      primarySymbol: '2.5%',
      secondarySymbol: '85g 24K',
      accentLabel: 'زكاة المال والذهب',
    },
  },
  {
    slug: 'bank-loan-installment-calculator',
    category: 'finance',
    pillarId: 'pillar-finance',
    engineType: 'finance',
    badge: 'فائدة متناقصة وثابتة',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'banks-gold',
    title: 'حاسبة القروض والتمويل وجدول الأقساط الشهرية',
    shortTitle: 'حاسبة القروض والتمويل',
    subtitle: 'القروض الشخصية والسيارات والتمويل العقاري بالفائدة المتناقصة أو الثابتة',
    summary:
      'احسب القسط الشهري المتساوي، إجمالي الفوائد البنكية، المصاريف الإدارية، وصافي مبلغ التمويل المستلم لأي قرض بنكي بدقة.',
    defaultParams: { mode: 'loan', principalAmount: 300000, annualRate: 22, durationMonths: 36 },
    visualConfig: {
      theme: 'gold-finance',
      primarySymbol: '22%',
      secondarySymbol: 'LOAN',
      accentLabel: 'حاسبة القروض والتمويل',
    },
  },
  {
    slug: 'bank-certificates-profit-calculator',
    category: 'finance',
    pillarId: 'pillar-finance',
    engineType: 'finance',
    badge: 'عائد شهري وسنوي',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'banks-gold',
    title: 'حاسبة أرباح الشهادات والودائع البنكية',
    shortTitle: 'حاسبة الشهادات والودائع',
    subtitle: 'حساب العائد الشهري والربع سنوي والسنوي والتراكمي للشهادات البنكية (27% و30%)',
    summary:
      'احسب بدقة صافي أرباح الشهادات الادخارية والودائع البنكية ذات العائد الشهري أو السنوي الثابت والمتدرج وإجمالي أصل المبلغ عند الاستحقاق.',
    defaultParams: {
      mode: 'certificate',
      principalAmount: 200000,
      annualRate: 27,
      durationMonths: 36,
    },
    visualConfig: {
      theme: 'gold-finance',
      primarySymbol: '27%',
      secondarySymbol: 'CERT',
      accentLabel: 'عوائد الشهادات البنكية',
    },
  },
  {
    slug: 'islamic-inheritance-calculator',
    category: 'gold',
    pillarId: 'pillar-finance',
    engineType: 'inheritance',
    badge: 'أنصبة شرعية دقيقة',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'banks-gold',
    title: 'حاسبة تقسيم الميراث الشرعي والتركات',
    shortTitle: 'حاسبة تقسيم الميراث الشرعي',
    subtitle: 'حساب أنصبة الورثة الشرعية (الفروض والتعصيب) بعد سداد الديون والوصية الشرعية',
    summary:
      'حاسبة المواريث الشرعية لتوزيع التركة (العقارات والأموال والذهب) بين الزوج أو الزوجات والأبناء والبنات والأب والأم وفق أحكام الشريعة الإسلامية.',
    defaultParams: { estateGrossValue: 1200000, sonsCount: 2, daughtersCount: 1, wivesCount: 1 },
    visualConfig: {
      theme: 'gold-bullion',
      primarySymbol: '1/8 · 2:1',
      secondarySymbol: 'فرائض',
      accentLabel: 'تقسيم المواريث الشرعية',
    },
  },
  {
    slug: 'ecommerce-product-pricing-calculator',
    category: 'finance',
    pillarId: 'pillar-finance',
    engineType: 'business',
    badge: 'تسعير وعائد الإعلانات ROAS',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'merchants',
    title: 'حاسبة تسعير المنتجات وأرباح التجارة الإلكترونية',
    shortTitle: 'تسعير منتجات التجارة الإلكترونية',
    subtitle: 'حساب تكلفة المنتج، الشحن، المرتجعات، إعلانات الممول، وصافي ربح القطعة',
    summary:
      'أداة احترافية للتجار وأصحاب المتاجر الإلكترونية لحساب السعر المثالي لبيع المنتج مع احتساب نسبة تسليم الشحنات (Delivery Rate) وتكلفة الإعلان للطلب (CPA).',
    defaultParams: { subTool: 'ecommerce' },
    visualConfig: {
      theme: 'gold-finance',
      primarySymbol: 'ROAS',
      secondarySymbol: 'NET %',
      accentLabel: 'تسعير التجارة الإلكترونية',
    },
  },
  {
    slug: 'electronic-wallets-fees-calculator',
    category: 'currencies',
    pillarId: 'pillar-finance',
    engineType: 'business',
    badge: 'Instapay · PayPal · Cash',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'merchants',
    title: 'حاسبة عمولات البنوك والمحافظ الإلكترونية (PayPal / Instapay / Cash)',
    shortTitle: 'عمولات PayPal والمحافظ الإلكترونية',
    subtitle: 'حساب رسوم السحب والتحويل في فودافون كاش وإنستاباي وباي بال وبايونير وسترايب',
    summary:
      'اعرف الصافي الذي سيصلك بعد خصم عمولة التحويل أو المبلغ الذي يجب أن تطلبه من العميل ليصلك المبلغ كاملاً عبر المحافظ الإلكترونية وبوابات الدفع.',
    defaultParams: { subTool: 'wallets' },
    visualConfig: {
      theme: 'gold-currency',
      primarySymbol: 'FEES',
      secondarySymbol: '1% - 4.4%',
      accentLabel: 'عمولات المحافظ والبنوك',
    },
  },
  {
    slug: 'customs-vat-tax-calculator',
    category: 'finance',
    pillarId: 'pillar-finance',
    engineType: 'business',
    badge: 'VAT 14% · 15% + جمارك',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'merchants',
    title: 'حاسبة الجمارك وضريبة القيمة المضافة (VAT)',
    shortTitle: 'حاسبة الجمارك وضريبة VAT',
    subtitle: 'إضافة أو استخراج ضريبة القيمة المضافة (14% مصر / 15% السعودية) وحساب الرسوم الجمركية',
    summary:
      'احسب قيمة الضريبة المضافة من السعر الشامل أو غير الشامل للضريبة مع تقدير الرسوم الجمركية وضريبة الجدول على الشحنات والواردات.',
    defaultParams: { subTool: 'vat-customs' },
    visualConfig: {
      theme: 'gold-finance',
      primarySymbol: 'VAT',
      secondarySymbol: '14% / 15%',
      accentLabel: 'الجمارك وضريبة القيمة المضافة',
    },
  },
  {
    slug: 'cash-vs-installment-inflation-calculator',
    category: 'finance',
    pillarId: 'pillar-finance',
    engineType: 'business',
    badge: 'القيمة الزمنية للنقود',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'banks-gold',
    title: 'حاسبة المقارنة بين الشراء كاش أو بالتقسيط والتضخم',
    shortTitle: 'مقارنة الكاش بالتقسيط والتضخم',
    subtitle: 'هل تشتري كاش الآن أم تقسط وتضع أموالك في شهادة أو ذهب؟ القرار المالي بالأرقام',
    summary:
      'تقارن الأداة بين سعر الكاش وإجمالي الأقساط مع احتساب العائد البديل لو استثمرت مبلغ الكاش في البنك أو الذهب وتأثير معدل التضخم السنوي.',
    defaultParams: { subTool: 'cash-vs-installment' },
    visualConfig: {
      theme: 'gold-finance',
      primarySymbol: 'CASH',
      secondarySymbol: 'VS EMI',
      accentLabel: 'مقارنة الكاش بالتقسيط',
    },
  },
  {
    slug: 'end-of-service-gratuity-calculator',
    category: 'finance',
    pillarId: 'pillar-finance',
    engineType: 'business',
    badge: 'قانون العمل المصري والخليجي',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'top-today',
    title: 'حاسبة مكافأة نهاية الخدمة والمعاش التقاعدي',
    shortTitle: 'حاسبة مكافأة نهاية الخدمة',
    subtitle: 'حساب مستحقات نهاية الخدمة ورصيد الإجازات للموظفين في القطاعين الخاص والحكومي',
    summary:
      'احسب إجمالي مكافأة نهاية الخدمة القانونية بناءً على سنوات العمل (أول 5 سنوات وما بعدها) والراتب الشامل وسبب انتهاء العقد.',
    defaultParams: { subTool: 'gratuity' },
    visualConfig: {
      theme: 'gold-finance',
      primarySymbol: 'EOSB',
      secondarySymbol: 'HR',
      accentLabel: 'مكافأة نهاية الخدمة',
    },
  },
  {
    slug: 'profit-margin-discount-calculator',
    category: 'finance',
    pillarId: 'pillar-finance',
    engineType: 'business',
    badge: 'هامش الربح والتخفيضات',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'merchants',
    title: 'حاسبة هامش الربح والخصم التجاري (Margin & Markup)',
    shortTitle: 'هامش الربح والخصم التجاري',
    subtitle: 'حساب الفرق بين نسبة الربح من التكلفة (Markup) وهامش الربح من البيع (Gross Margin)',
    summary:
      'أداة سريعة للتجار لحساب السعر بعد الخصم المزدوج، صافي الربح النقدي، ونسبة هامش الربح الإجمالية بدقة.',
    defaultParams: { subTool: 'margin-discount' },
    visualConfig: {
      theme: 'gold-finance',
      primarySymbol: 'MARGIN',
      secondarySymbol: 'SALE %',
      accentLabel: 'هامش الربح والخصومات',
    },
  },
  {
    slug: 'break-even-point-calculator',
    category: 'finance',
    pillarId: 'pillar-finance',
    engineType: 'business',
    badge: 'دراسة جدوى المشاريع',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'merchants',
    title: 'حاسبة نقطة التعادل للمشاريع (Break-Even Point)',
    shortTitle: 'حاسبة نقطة التعادل للمشاريع',
    subtitle: 'كم قطعة أو عميل تحتاج لبيعه شهرياً لتغطية الإيجار والرواتب والبدء في تحقيق الربح؟',
    summary:
      'احسب عدد الوحدات وقيمة المبيعات اللازمة لتغطية التكاليف الثابتة والمتغيرة لمشروعك وتحديد متى يبدأ المشروع في جني الأرباح الصافية.',
    defaultParams: { subTool: 'breakeven' },
    visualConfig: {
      theme: 'gold-finance',
      primarySymbol: 'BEP',
      secondarySymbol: 'UNITS',
      accentLabel: 'نقطة التعادل للمشاريع',
    },
  },
  {
    slug: 'real-estate-roi-calculator',
    category: 'finance',
    pillarId: 'pillar-finance',
    engineType: 'business',
    badge: 'العائد الإيجاري والرأسمالي',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'banks-gold',
    title: 'حاسبة العائد على الاستثمار العقاري والإيجاري (ROI)',
    shortTitle: 'عائد الاستثمار العقاري ROI',
    subtitle: 'حساب نسبة العائد الإيجاري السنوي وفترة استرداد رأس المال للشقق والمحلات التجارية',
    summary:
      'احسب جدوى شراء عقار للاستثمار أو الإيجار مع احتساب مصاريف الصيانة والوديعة ومعدل الزيادة السنوية في الإيجار وقيمة العقار.',
    defaultParams: { subTool: 'real-estate-roi' },
    visualConfig: {
      theme: 'gold-finance',
      primarySymbol: 'ROI %',
      secondarySymbol: 'REALTY',
      accentLabel: 'عائد الاستثمار العقاري',
    },
  },

  // --------------------------------------------------------------------------
  // PILLAR 2: السيارات والخدمات اليومية والعامة (13 Distinct Master Tools)
  // --------------------------------------------------------------------------
  {
    slug: 'fuel-trip-cost-calculator',
    category: 'automotive',
    pillarId: 'pillar-daily',
    engineType: 'energy',
    badge: 'بنزين 95 / 92 / 80 / سولار',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'cars-motos',
    title: 'حاسبة استهلاك البنزين وتكلفة المشوار والسفر',
    shortTitle: 'حاسبة بنزين المشوار والسفر',
    subtitle: 'حساب عدد اللترات وتكلفة الوقود الذهاب والعودة وتقسيم التكلفة على الركاب',
    summary:
      'احسب تكلفة البنزين أو السولار لأي مشوار داخل المدينة أو سفر بين المحافظات لجميع فئات السيارات والموتوسيكلات وتعرف على نصيب كل راكب.',
    defaultParams: {
      energyMode: 'fuel',
      distanceKm: 220,
      isRoundTrip: true,
      consumptionPer100Km: 8.2,
      fuelPricePerLiter: 22.25,
    },
    visualConfig: {
      theme: 'gold-energy',
      primarySymbol: '220 KM',
      secondarySymbol: 'FUEL',
      accentLabel: 'حاسبة بنزين المشوار',
    },
  },
  {
    slug: 'vehicle-maintenance-oil-tracker',
    category: 'automotive',
    pillarId: 'pillar-daily',
    engineType: 'vehicle-maintenance',
    badge: 'زيت محرك · فلاتر · ترخيص المرور',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'cars-motos',
    title: 'دفتر صيانة المركبات وحاسبة رسوم ترخيص المرور (سيارات وموتوسيكلات)',
    shortTitle: 'دفتر صيانة المركبات وحاسبة المرور',
    subtitle: 'ادخل قراءة عداد الكيلومترات الحالي واعرف مواعيد تغيير الزيت والفلتر والبوجهات وتيل الفرامل ورسوم المرور',
    summary:
      'أداة ذكية لأصحاب السيارات والموتوسيكلات لحساب الكيلومترات المتبقية على غيار الزيت والفلاتر والبوجهات وتيل الفرامل مع حفظ سجل الصيانات وحساب رسوم ترخيص المرور المصري.',
    defaultParams: { energyMode: 'maintenance', vehicleType: 'car', currentOdometerKm: 64500 },
    visualConfig: {
      theme: 'gold-energy',
      primarySymbol: '10,000',
      secondarySymbol: 'OIL KM',
      accentLabel: 'صيانة السيارة وحاسبة المرور',
    },
  },
  {
    slug: 'electricity-bill-appliance-calculator',
    category: 'automotive',
    pillarId: 'pillar-daily',
    engineType: 'energy',
    badge: 'كيلوواط وشرائح الكهرباء',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'top-today',
    title: 'حاسبة فاتورة الكهرباء واستهلاك الأجهزة المنزلية',
    shortTitle: 'حاسبة فاتورة الكهرباء والأجهزة',
    subtitle: 'حساب استهلاك التكييف والسخان والغسالة بالكيلوواط/ساعة وتقدير الفاتورة الشهرية',
    summary:
      'احسب كم يستهلك كل جهاز كهربائي في منزلك يومياً وشهرياً بالكيلوواط وتكلفة الشريحة لتوفير استهلاك الكهرباء وشحن العداد مسبق الدفع.',
    defaultParams: { energyMode: 'electricity' },
    visualConfig: {
      theme: 'gold-energy',
      primarySymbol: 'kWh',
      secondarySymbol: 'BILL',
      accentLabel: 'حاسبة فاتورة الكهرباء',
    },
  },
  {
    slug: 'water-gas-bill-calculator',
    category: 'automotive',
    pillarId: 'pillar-daily',
    engineType: 'energy',
    badge: 'متر مكعب مياه وغاز',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'top-today',
    title: 'حاسبة فاتورة المياه والغاز الطبيعي المنزلية',
    shortTitle: 'حاسبة فاتورة المياه والغاز',
    subtitle: 'حساب قيمة استهلاك المياه والغاز الطبيعي بالمتر المكعب وفق الشرائح المعتمدة',
    summary:
      'أدخل القراءة السابقة والحالية لعداد المياه أو الغاز الطبيعي لمعرفة كمية الاستهلاك بالمتر المكعب وتقدير الفاتورة الشهرية.',
    defaultParams: { energyMode: 'water-gas' },
    visualConfig: {
      theme: 'gold-energy',
      primarySymbol: 'm³',
      secondarySymbol: 'GAS/H2O',
      accentLabel: 'فاتورة المياه والغاز',
    },
  },
  {
    slug: 'agricultural-land-area-converter',
    category: 'units',
    pillarId: 'pillar-daily',
    engineType: 'unit',
    badge: 'فدان · قيراط · سهم · م²',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'merchants',
    title: 'محول وحدات المساحة والأراضي الزراعية والعقارات الشامل',
    shortTitle: 'محول المساحات والأراضي (فدان/قيراط)',
    subtitle: 'تحويل فوري بين الفدان والقيراط والسهم والمتر المربع والهكتار والدونم والقصبة',
    summary:
      'المحول المعتمد للمساحات الزراعية والعقارية: يحول أي مساحة بين الفدان (24 قيراط) والقيراط (175.03 م²) والسهم (7.29 م²) والمتر المربع في جدول واحد.',
    defaultParams: { familyId: 'area', fromUnitId: 'feddan', toUnitId: 'sqm', inputValue: 1 },
    visualConfig: {
      theme: 'gold-unit',
      primarySymbol: 'فدان',
      secondarySymbol: '4200 م²',
      accentLabel: 'محول المساحات والأراضي',
    },
  },
  {
    slug: 'comprehensive-units-converter',
    category: 'units',
    pillarId: 'pillar-daily',
    engineType: 'unit',
    badge: 'أطوال · أوزان · حجوم · سرعة',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'top-today',
    title: 'محول الوحدات والقياسات الهندسية الشامل',
    shortTitle: 'محول القياسات الهندسية الشامل',
    subtitle: 'تبويبات شاملة لتحويل الأطوال، الأوزان والكتل، الحجوم والمكاييل، السرعة، وسعات البيانات',
    summary:
      'أداة واحدة تجمع كافة تحويلات الوحدات القياسية والهندسية والتجارية (متر، بوصة، قدم، كيلوجرام، رطل، أونصة، لتر، جالون، إردب، جيجابايت).',
    defaultParams: { familyId: 'length', fromUnitId: 'meter', toUnitId: 'foot', inputValue: 10 },
    visualConfig: {
      theme: 'gold-unit',
      primarySymbol: 'UNITS',
      secondarySymbol: 'ALL-IN-1',
      accentLabel: 'محول الوحدات الشامل',
    },
  },
  {
    slug: 'exact-age-hijri-gregorian-calculator',
    category: 'units',
    pillarId: 'pillar-daily',
    engineType: 'lifestyle',
    badge: 'سنوات · أشهر · أيام · هجري',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'top-today',
    title: 'حاسبة العمر الدقيقة بالهجري والميلادي وفرق العمر',
    shortTitle: 'حاسبة العمر بالهجري والميلادي',
    subtitle: 'احسب عمرك بالسنوات والأشهر والأيام والساعات وموعد عيد ميلادك القادم وعمرك الهجري',
    summary:
      'أدخل تاريخ ميلادك لتحصل على تفصيل كامل لعمرك بالميلادي والهجري القمري وعدد الأيام المتبقية على يوم ميلادك القادم.',
    defaultParams: { lifeMode: 'age' },
    visualConfig: {
      theme: 'gold-unit',
      primarySymbol: 'AGE',
      secondarySymbol: 'هجري/ميلادي',
      accentLabel: 'حاسبة العمر الدقيقة',
    },
  },
  {
    slug: 'bmi-calories-macro-calculator',
    category: 'units',
    pillarId: 'pillar-daily',
    engineType: 'lifestyle',
    badge: 'BMI · BMR · TDEE',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'top-today',
    title: 'حاسبة السعرات الحرارية ومؤشر كتلة الجسم والوزن المثالي',
    shortTitle: 'حاسبة السعرات الحرارية و BMI',
    subtitle: 'حساب مؤشر كتلة الجسم BMI، الوزن المثالي، واحتياجك اليومي من السعرات والبروتين',
    summary:
      'اعرف تصنيف وزنك الصحي ومعدل الحرق اليومي (TDEE) والسعرات المطلوبة للتخسيس أو التضخيم أو ثبات الوزن.',
    defaultParams: { lifeMode: 'bmi' },
    visualConfig: {
      theme: 'gold-unit',
      primarySymbol: 'BMI',
      secondarySymbol: 'KCAL',
      accentLabel: 'السعرات وكتلة الجسم',
    },
  },
  {
    slug: 'pregnancy-due-date-calculator',
    category: 'units',
    pillarId: 'pillar-daily',
    engineType: 'lifestyle',
    badge: 'أسابيع الحمل وموعد الولادة',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'top-today',
    title: 'حاسبة الحمل وموعد الولادة المتوقع بالأسابيع والأشهر',
    shortTitle: 'حاسبة الحمل وموعد الولادة',
    subtitle: 'حساب عمر الحمل الحالي بالأسابيع والثلث الحالي والتاريخ المتوقع للولادة بدقة',
    summary:
      'تعتمد على قاعدة نيغيل الطبية (Naegele’s Rule) لحساب موعد الولادة المتوقع وعدد الأسابيع المنقضية والمتبقية من الحمل.',
    defaultParams: { lifeMode: 'pregnancy' },
    visualConfig: {
      theme: 'gold-unit',
      primarySymbol: '40 WK',
      secondarySymbol: 'EDD',
      accentLabel: 'حاسبة الحمل والولادة',
    },
  },
  {
    slug: 'university-gpa-percentage-calculator',
    category: 'units',
    pillarId: 'pillar-daily',
    engineType: 'lifestyle',
    badge: 'GPA 4.0 · 5.0 · نسبة مئوية',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'top-today',
    title: 'حاسبة المعدل التراكمي الجامعي GPA والنسبة المئوية',
    shortTitle: 'حاسبة المعدل الجامعي GPA',
    subtitle: 'حساب المعدل الفصلي والتراكمي من 4 أو 5 وتحويل GPA إلى نسبة مئوية والتقدير اللفظي',
    summary:
      'أداة متكاملة لطلاب الجامعات والمدارس لحساب المعدل التراكمي بالساعات المعتمدة وتحويله إلى نسبة مئوية وتقدير (امتياز، جيد جداً، جيد).',
    defaultParams: { lifeMode: 'gpa' },
    visualConfig: {
      theme: 'gold-unit',
      primarySymbol: 'GPA 4.0',
      secondarySymbol: '95%',
      accentLabel: 'حاسبة المعدل الجامعي',
    },
  },
  {
    slug: 'world-time-zone-difference-calculator',
    category: 'units',
    pillarId: 'pillar-daily',
    engineType: 'lifestyle',
    badge: 'توقيت القاهرة · مكة · دبي · لندن',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'top-today',
    title: 'حاسبة فرق التوقيت العالمي بين المدن والعواصم',
    shortTitle: 'حاسبة فرق التوقيت العالمي',
    subtitle: 'مقارنة الساعة الآن وفرق التوقيت بين القاهرة ومكة المكرمة ودبي ولندن ونيويورك',
    summary:
      'حدد وقت الاجتماع أو المكالمة في مدينتك واعرف ما يقابله فوراً في جميع العواصم العربية والعالمية (UTC Offset).',
    defaultParams: { lifeMode: 'timezone' },
    visualConfig: {
      theme: 'gold-unit',
      primarySymbol: 'UTC+3',
      secondarySymbol: 'TIME',
      accentLabel: 'فرق التوقيت العالمي',
    },
  },
  {
    slug: 'egypt-finishing-cost-calculator',
    category: 'units',
    pillarId: 'pillar-daily',
    engineType: 'egypt-finishing',
    badge: 'مقايسة 10 مراحل · خامات · PDF/Excel',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'top-today',
    title: 'حاسبة تكلفة تشطيب الشقق والمباني والمقايسة الهندسية في مصر',
    shortTitle: 'حاسبة تكلفة تشطيب الشقق والمقايسة',
    subtitle: 'مقايسة هندسية تفصيلية لـ 10 مراحل تشطيب في مصر مع حصر كميات الأسمنت والرمل وسلك السويدي والسيراميك والدهانات',
    summary:
      'أشمل حاسبة ومقايسة هندسية لتكلفة تشطيب الشقق والفيلات في مصر (على الطوب الأحمر، نصف تشطيب، أو تجديد قديم) بمستويات الاقتصادي والسوبر لوكس والألترا لوكس مع حصر الخامات وتصدير عرض سعر رسمي PDF وExcel.',
    defaultParams: {
      grossAreaSqm: 140,
      netAreaRatioPercent: 82,
      propertyType: 'apartment',
      roomsCount: 3,
      bathroomsCount: 2,
      receptionPieces: 2,
      currentCondition: 'core-shell',
      finishingGrade: 'super-lux',
    },
    visualConfig: {
      theme: 'gold-unit',
      primarySymbol: 'BOQ م²',
      secondarySymbol: 'تشطيب مصر',
      accentLabel: 'مقايسة التشطيب الهندسية',
    },
  },
  {
    slug: 'construction-finishing-cost-calculator',
    category: 'units',
    pillarId: 'pillar-daily',
    engineType: 'egypt-finishing',
    badge: 'أسمنت · رمل · طوب · سيراميك',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'merchants',
    title: 'حاسبة تكلفة البناء والتشطيب وكميات المواد للشقق',
    shortTitle: 'حاسبة تكلفة التشطيب والبناء',
    subtitle: 'تقدير كميات الأسمنت والرمل والسيراميك والدهانات وتكلفة تشطيب الشقة بالمتر المربع',
    summary:
      'أدخل مساحة الشقة أو الأرض ومستوى التشطيب المطلوب (اقتصادي، لوكس، سوبر لوكس) لمعرفة الميزانية التقديرية وكميات الخامات.',
    defaultParams: {
      grossAreaSqm: 120,
      netAreaRatioPercent: 82,
      propertyType: 'apartment',
      roomsCount: 3,
      bathroomsCount: 1,
      receptionPieces: 2,
      currentCondition: 'core-shell',
      finishingGrade: 'super-lux',
    },
    visualConfig: {
      theme: 'gold-unit',
      primarySymbol: 'م² بناء',
      secondarySymbol: 'COST',
      accentLabel: 'تكلفة البناء والتشطيب',
    },
  },
  {
    slug: 'ac-tonnage-btu-room-calculator',
    category: 'units',
    pillarId: 'pillar-daily',
    engineType: 'lifestyle',
    badge: '1.5 حصان · 2.25 حصان · 3 حصان',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'top-today',
    title: 'حاسبة قدرة التكييف المناسبة لمساحة الغرفة (حصان و BTU)',
    shortTitle: 'حاسبة قدرة التكييف للغرفة',
    subtitle: 'ادخل الطول والعرض والارتفاع وتعرف على التكييف الأنسب بالحصان والـ BTU',
    summary:
      'تجنب شراء تكييف أضعف أو أكبر من حاجة غرفتك: تحسب الأداة القدرة الحصانية ووحدات التبريد (BTU) مع مراعاة الدور الأخير وتعرض الغرفة للشمس.',
    defaultParams: { lifeMode: 'ac-btu' },
    visualConfig: {
      theme: 'gold-unit',
      primarySymbol: 'BTU',
      secondarySymbol: '2.25 HP',
      accentLabel: 'حاسبة قدرة التكييف',
    },
  },

  // --------------------------------------------------------------------------
  // PILLAR 3: أدوات الصور والملفات والـ PDF والكود (13 Distinct Master Tools)
  // --------------------------------------------------------------------------
  {
    slug: 'comprehensive-image-studio',
    category: 'images',
    pillarId: 'pillar-media',
    engineType: 'image',
    badge: 'WebP · PNG · JPG (بدون سيرفر)',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'top-today',
    title: 'استوديو ضغط وتحويل صيغ الصور الشامل (WebP / PNG / JPG)',
    shortTitle: 'استوديو ضغط وتحويل الصور الشامل',
    subtitle: 'تصغير حجم الصورة حتى 80% وتحويل الصيغة وتغيير الأبعاد محلياً 100% داخل متصفحك',
    summary:
      'أداة واحدة شاملة تغنيك عن عشرات الأدوات: ارفع أي صورة واختر الصيغة المستهدفة (WebP أو JPG أو PNG) ومستوى الجودة والأبعاد مع معاينة الحجم قبل وبعد الضغط.',
    defaultParams: {
      studioMode: 'compress-convert',
      targetFormatMime: 'image/webp',
      quality: 82,
      maxWidth: 1200,
    },
    visualConfig: {
      theme: 'gold-image',
      primarySymbol: 'IMG',
      secondarySymbol: '-80% KB',
      accentLabel: 'استوديو الصور الشامل',
    },
  },
  {
    slug: 'images-to-pdf-converter',
    category: 'images',
    pillarId: 'pillar-media',
    engineType: 'image',
    badge: 'تجميع صور ووثائق في PDF A4',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'top-today',
    title: 'أداة دمج وتحويل الصور والبطاقات إلى ملف PDF جاهز للطباعة',
    shortTitle: 'تحويل ودمج الصور إلى PDF',
    subtitle: 'رتب صور المستندات أو البطاقة الشخصية في صفحة A4 واحدة وحمّلها كملف PDF فوراً',
    summary:
      'مثالية للتقديمات الحكومية والجامعية: ارفع صورة أو عدة صور ليتم تنسيقها بحجم ورق A4 القياسي مع إمكانية حفظها وطباعتها كملف PDF نظيف.',
    defaultParams: {
      studioMode: 'images-to-pdf',
      targetFormatMime: 'image/jpeg',
      quality: 90,
      maxWidth: 1600,
    },
    visualConfig: {
      theme: 'gold-image',
      primarySymbol: 'IMG→PDF',
      secondarySymbol: 'A4 DOC',
      accentLabel: 'تحويل الصور إلى PDF',
    },
  },
  {
    slug: 'pro-qr-code-studio',
    category: 'digital',
    pillarId: 'pillar-media',
    engineType: 'qr',
    badge: 'دقة 1000×1000 PNG مدى الحياة',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'merchants',
    title: 'استوديو صناعة رمز QR الاحترافي بالألوان للروابط والواي فاي والواتساب',
    shortTitle: 'استوديو صناعة رمز QR الاحترافي',
    subtitle: 'توليد رموز QR للروابط، شبكات Wi-Fi، محادثات واتساب، والبطاقات الشخصية بألوان مخصصة',
    summary:
      'أنشئ رمز استجابة سريعة (QR Code) ثابت لا تنتهي صلاحيته أبداً مع التحكم الكامل في ألوان الرمز والخلفية ودقة الطباعة حتى 1600 بكسل.',
    defaultParams: { qrMode: 'url', fgColor: '#D4AF37', bgColor: '#0A0A0A', canvasSize: 800 },
    visualConfig: {
      theme: 'gold-qr',
      primarySymbol: 'QR HD',
      secondarySymbol: '1000PX',
      accentLabel: 'استوديو رمز QR الاحترافي',
    },
  },
  {
    slug: 'commercial-barcode-generator',
    category: 'digital',
    pillarId: 'pillar-media',
    engineType: 'qr',
    badge: 'Code-128 · EAN-13 للمحلات',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'merchants',
    title: 'مولد الباركود التجاري للمنتجات وملصقات الكاشير (Barcode)',
    shortTitle: 'مولد الباركود التجاري للمنتجات',
    subtitle: 'إنشاء باركود خطي قياسي للمنتجات والأصناف مع اسم الصنف والسعر جاهز للطباعة',
    summary:
      'أداة مخصصة للتجار وأصحاب المحلات والمخازن لتوليد باركود المنتجات والأصناف وتحميله كصورة عالية الدقة لأجهزة قارئ الباركود.',
    defaultParams: { qrMode: 'barcode', fgColor: '#000000', bgColor: '#FFFFFF', canvasSize: 600 },
    visualConfig: {
      theme: 'gold-qr',
      primarySymbol: '||| |||',
      secondarySymbol: 'EAN/128',
      accentLabel: 'مولد الباركود التجاري',
    },
  },
  {
    slug: 'arabic-number-to-words-tafqeet',
    category: 'digital',
    pillarId: 'pillar-media',
    engineType: 'tafqeet',
    badge: 'فقط وقدره ... لا غير',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'merchants',
    title: 'محول الأرقام إلى حروف باللغة العربية (تفقيط المبالغ المالية للشيكات والعقود)',
    shortTitle: 'تفقيط المبالغ المالية بالحروف',
    subtitle: 'تحويل أي مبلغ رقمي إلى صيغة قانونية مكتوبة بالحروف العربية مع العملة والقروش/الهللات',
    summary:
      'أداة لا غنى عنها للمحاسبين والمحامين والتجار: اكتب المبلغ بالأرقام لتحصل فوراً على النص العربي القانوني («فقط وقدره ... لا غير») جاهزاً للنسخ في الشيكات والعقود والفواتير.',
    defaultParams: { amount: 125450.75, currencyMain: 'جنيه مصري', currencySub: 'قرشاً' },
    visualConfig: {
      theme: 'gold-qr',
      primarySymbol: 'تفقيط',
      secondarySymbol: 'شيكات',
      accentLabel: 'تفقيط المبالغ المالية',
    },
  },
  {
    slug: 'whatsapp-direct-link-generator',
    category: 'digital',
    pillarId: 'pillar-media',
    engineType: 'text-code',
    badge: 'رابط wa.me + رسالة جاهزة',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'merchants',
    title: 'مولد روابط واتساب المباشرة مع الرسالة الجاهزة للتجار والإعلانات',
    shortTitle: 'مولد رابط واتساب مباشر',
    subtitle: 'أنشئ رابط محادثة واتساب يفتح الشات مباشرة بدون تسجيل الرقم مع نص طلب مسبق',
    summary:
      'ضاعف مبيعات إعلاناتك: اكتب رقم هاتفك مع كود الدولة والرسالة التلقائية لتحصل على رابط واتساب مختصر جاهز لوضعه في فيسبوك وإنستجرام.',
    defaultParams: { textMode: 'whatsapp' },
    visualConfig: {
      theme: 'gold-qr',
      primarySymbol: 'WA.ME',
      secondarySymbol: 'CHAT',
      accentLabel: 'مولد رابط واتساب مباشر',
    },
  },
  {
    slug: 'word-counter-text-formatter',
    category: 'digital',
    pillarId: 'pillar-media',
    engineType: 'text-code',
    badge: 'كلمات · حروف · تنظيف النص',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'top-today',
    title: 'عداد الكلمات والحروف وزمن القراءة ومنسق النصوص العربية',
    shortTitle: 'عداد الكلمات ومنسق النصوص',
    subtitle: 'حساب عدد الكلمات والحروف بدون مسافات وإزالة التشكيل والأسطر الفارغة المكررة',
    summary:
      'أداة متكاملة للكتاب والطلاب وصناع المحتوى لحساب الكلمات والفقرات وزمن القراءة وتنظيف النصوص العربية من التشكيل والمسافات الزائدة.',
    defaultParams: { textMode: 'word-counter' },
    visualConfig: {
      theme: 'gold-qr',
      primarySymbol: 'WORDS',
      secondarySymbol: 'TEXT',
      accentLabel: 'عداد الكلمات ومنسق النصوص',
    },
  },
  {
    slug: 'password-generator-security-checker',
    category: 'digital',
    pillarId: 'pillar-media',
    engineType: 'text-code',
    badge: 'تشفير محلي 100%',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'top-today',
    title: 'مولد كلمات المرور القوية وفاحص مستوى الأمان والاختراق',
    shortTitle: 'مولد وفاحص كلمات المرور',
    subtitle: 'توليد كلمات سر عشوائية فائقة القوة واختبار مدى صعوبة تخمين كلمة مرورك',
    summary:
      'احمِ حساباتك البنكية والشخصية عبر توليد كلمات مرور مشفرة داخل متصفحك مع مؤشر قياس الإنتروبيا والوقت اللازم لكسرها.',
    defaultParams: { textMode: 'password' },
    visualConfig: {
      theme: 'gold-qr',
      primarySymbol: 'PASS',
      secondarySymbol: '256-BIT',
      accentLabel: 'مولد كلمات المرور القوية',
    },
  },
  {
    slug: 'arabic-english-text-decorator',
    category: 'digital',
    pillarId: 'pillar-media',
    engineType: 'text-code',
    badge: 'خطوط وزخارف احترافية',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'top-today',
    title: 'زخرفة النصوص والأسماء الاحترافية بالعربية والإنجليزية',
    shortTitle: 'زخرفة النصوص والأسماء',
    subtitle: 'تشكيل وزخرفة الأسماء والعناوين للبروفايل والألعاب والسوشيال ميديا بضغطة نسخ واحدة',
    summary:
      'اكتب اسمك أو جملتك لتحصل فوراً على أكثر من 12 نمطاً احترافياً من الزخارف العربية والإنجليزية الجاهزة للنسخ.',
    defaultParams: { textMode: 'decorator' },
    visualConfig: {
      theme: 'gold-qr',
      primarySymbol: 'زخرفة',
      secondarySymbol: 'FONTS',
      accentLabel: 'زخرفة النصوص والأسماء',
    },
  },
  {
    slug: 'text-table-data-extractor',
    category: 'digital',
    pillarId: 'pillar-media',
    engineType: 'text-code',
    badge: 'استخراج أرقام وإيميلات وروابط',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'merchants',
    title: 'قارئ ومستخرج الأرقام والإيميلات والروابط من النصوص',
    shortTitle: 'مستخرج الأرقام والإيميلات من النص',
    subtitle: 'الصق أي نص عشوائي طويل لاستخراج جميع أرقام الهواتف أو البريد الإلكتروني أو الروابط',
    summary:
      'وفر ساعات من البحث اليدوي: تقوم الأداة بمسح النصوص والملفات النصية واستخراج قوائم الهواتف والإيميلات والروابط بدون تكرار.',
    defaultParams: { textMode: 'extractor' },
    visualConfig: {
      theme: 'gold-qr',
      primarySymbol: 'PARSE',
      secondarySymbol: 'DATA',
      accentLabel: 'مستخرج البيانات والأرقام',
    },
  },
  {
    slug: 'developer-json-base64-toolkit',
    category: 'digital',
    pillarId: 'pillar-media',
    engineType: 'text-code',
    badge: 'JSON · Base64 · URL Encode',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'top-today',
    title: 'منسق ومحول أكواد JSON و Base64 و URL للمطورين',
    shortTitle: 'أدوات JSON و Base64 للمطورين',
    subtitle: 'تنسيق وفحص كود JSON والتحويل الفوري بين النصوص العربية وترميز Base64 و URL',
    summary:
      'صندوق أدوات سريع للمبرمجين ومديري المواقع لتنسيق ملفات JSON وفك تشفير Base64 وروابط URL العربية الطويلة.',
    defaultParams: { textMode: 'dev-toolkit' },
    visualConfig: {
      theme: 'gold-qr',
      primarySymbol: '{JSON}',
      secondarySymbol: 'BASE64',
      accentLabel: 'أدوات المطورين والأكواد',
    },
  },
  {
    slug: 'color-palette-hex-rgb-converter',
    category: 'digital',
    pillarId: 'pillar-media',
    engineType: 'text-code',
    badge: 'HEX ⇄ RGB ⇄ HSL + تباين',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'top-today',
    title: 'محول أكواد الألوان (HEX / RGB / HSL) ومولد التدرجات للمصممين',
    shortTitle: 'محول أكواد الألوان للمصممين',
    subtitle: 'تحويل فوري بين صيغ الألوان مع توليد درجات اللون وكود CSS جاهز للنسخ',
    summary:
      'اختر أي لون لمعرفة أكواد HEX و RGB و HSL ودرجات التفتيح والتغميق المتناسقة مع تصميماتك.',
    defaultParams: { textMode: 'colors' },
    visualConfig: {
      theme: 'gold-qr',
      primarySymbol: '#D4AF37',
      secondarySymbol: 'RGB/HSL',
      accentLabel: 'محول أكواد الألوان',
    },
  },

  // --------------------------------------------------------------------------
  // PILLAR 4: النماذج والعقود والمولدات الجاهزة للطباعة PDF (12 Distinct Master Tools)
  // --------------------------------------------------------------------------
  {
    slug: 'vehicle-motorcycle-sale-contract',
    category: 'documents',
    pillarId: 'pillar-documents',
    engineType: 'document',
    badge: 'A4 PDF · سيارات وموتوسيكلات',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'cars-motos',
    title: 'مولد عقد بيع سيارة أو موتوسيكل ابتدائي رسمي جاهز للطباعة',
    shortTitle: 'مولد عقد بيع سيارة أو موتوسيكل',
    subtitle: 'صياغة قانونية شاملة لبيانات المركبة والشاسيه والموتور والثمن والشرط الجزائي على ورق A4',
    summary:
      'املأ بيانات البائع والمشتري ومواصفات السيارة أو الدراجة النارية (الموتوسيكل) واطبع عقد بيع ابتدائي كامل الأركان القانونية بتنسيق A4 PDF بدون علامات مائية.',
    defaultParams: {
      docType: 'car-sale',
      templateTitle: 'عقد بيع مركبة (سيارة / موتوسيكل) ابتدائي نهائي',
      governorate: 'القاهرة',
    },
    visualConfig: {
      theme: 'gold-document',
      primarySymbol: 'A4 PDF',
      secondarySymbol: 'CAR/MOTO',
      accentLabel: 'عقد بيع سيارة أو موتوسيكل',
    },
  },
  {
    slug: 'apartment-commercial-lease-contract',
    category: 'documents',
    pillarId: 'pillar-documents',
    engineType: 'document',
    badge: 'A4 PDF · قانون مدني محدد المدة',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'top-today',
    title: 'مولد عقد إيجار شقة سكنية أو محل تجاري محدد المدة',
    shortTitle: 'مولد عقد إيجار شقة أو محل',
    subtitle: 'عقد إيجار قانون جديد كامل البنود مع القيمة الإيجارية والتأمين والزيادة السنوية',
    summary:
      'حرر واطبع عقد إيجار أملاك (شقة سكنية، مكتب إداري، أو محل تجاري) بصياغة قانونية تحفظ حقوق المالك والمستأجر وجاهز للطباعة الفورية على ورق A4.',
    defaultParams: {
      docType: 'lease',
      templateTitle: 'عقد إيجار وحدة سكنية / تجارية محدد المدة',
      governorate: 'القاهرة',
    },
    visualConfig: {
      theme: 'gold-document',
      primarySymbol: 'A4 PDF',
      secondarySymbol: 'LEASE',
      accentLabel: 'عقد إيجار شقة أو محل',
    },
  },
  {
    slug: 'tax-sales-invoice-generator',
    category: 'documents',
    pillarId: 'pillar-documents',
    engineType: 'document',
    badge: 'حساب تلقائي للضريبة والخصم',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'merchants',
    title: 'مولد فواتير المبيعات الضريبية وعروض الأسعار الفورية (A4 PDF)',
    shortTitle: 'مولد الفواتير وعروض الأسعار',
    subtitle: 'أضف الأصناف والكميات والأسعار والخصم والضريبة واطبع فاتورة رسمية أنيقة لعملائك',
    summary:
      'نظام إصدار فواتير وعروض أسعار مجاني يعمل من متصفحك: يحسب الإجماليات والضريبة وتفقيط المبلغ بالحروف تلقائياً ويطبع الفاتورة بتنسيق A4.',
    defaultParams: {
      docType: 'invoice',
      templateTitle: 'فاتورة مبيعات ضريبية / عرض سعر رسمي',
      governorate: 'القاهرة',
    },
    visualConfig: {
      theme: 'gold-document',
      primarySymbol: 'INVOICE',
      secondarySymbol: 'A4 PDF',
      accentLabel: 'مولد الفواتير وعروض الأسعار',
    },
  },
  {
    slug: 'ats-resume-cv-builder',
    category: 'documents',
    pillarId: 'pillar-documents',
    engineType: 'document',
    badge: 'متوافق مع أنظمة التوظيف ATS',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'top-today',
    title: 'صانع السيرة الذاتية الاحترافية المتوافقة مع أنظمة ATS (CV Builder)',
    shortTitle: 'صانع السيرة الذاتية ATS CV',
    subtitle: 'أدخل خبراتك ومهاراتك ومؤهلاتك واحصل على سيرة ذاتية قياسية جاهزة للطباعة كـ PDF',
    summary:
      'صمم سيرتك الذاتية بتخطيط ATS النظيف الذي تقرؤه أنظمة فرز السير الذاتية في الشركات الكبرى وحمّلها كملف A4 PDF فوراً.',
    defaultParams: {
      docType: 'ats-cv',
      templateTitle: 'السيرة الذاتية الاحترافية (ATS Standard Resume)',
      governorate: 'القاهرة',
    },
    visualConfig: {
      theme: 'gold-document',
      primarySymbol: 'ATS CV',
      secondarySymbol: 'RESUME',
      accentLabel: 'صانع السيرة الذاتية ATS',
    },
  },
  {
    slug: 'cash-receipt-clearance-generator',
    category: 'documents',
    pillarId: 'pillar-documents',
    engineType: 'document',
    badge: 'إيصال استلام + مخالصة نهائية',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'merchants',
    title: 'مولد إيصال استلام نقدية وسند قبض ومخالصة مالية',
    shortTitle: 'مولد إيصال استلام نقدية ومخالصة',
    subtitle: 'سند قبض رسمي وإقرار براءة ذمة مالية مع تفقيط المبلغ بالحروف وتوقيع المستلم والشهود',
    summary:
      'وثّق معاملاتك النقدية وسداد الدفعات والأقساط عبر إصدار إيصال استلام نقدية أو مخالصة مالية نهائية جاهزة للطباعة.',
    defaultParams: {
      docType: 'receipt',
      templateTitle: 'إيصال استلام نقدية وإقرار مخالصة مالية',
      governorate: 'القاهرة',
    },
    visualConfig: {
      theme: 'gold-document',
      primarySymbol: 'RECEIPT',
      secondarySymbol: 'A4 PDF',
      accentLabel: 'إيصال استلام ومخالصة',
    },
  },
  {
    slug: 'salary-slip-hr-generator',
    category: 'documents',
    pillarId: 'pillar-documents',
    engineType: 'document',
    badge: 'مفردات مرتب رسمية HR',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'top-today',
    title: 'مولد كشف ومفردات المرتب الرسمي للموظفين والشركات (Salary Slip)',
    shortTitle: 'مولد كشف ومفردات المرتب',
    subtitle: 'بيان مفصل بالراتب الأساسي والبدلات والحوافز وخصومات التأمينات والضرائب وصافي الدخل',
    summary:
      'أصدر بيان مفردات مرتب رسمي لتقديمه للبنوك والجهات الرسمية أو لتسليمه للموظفين شهرياً بتنسيق جدول A4 واضح.',
    defaultParams: {
      docType: 'salary-slip',
      templateTitle: 'بيان مفردات وكشف راتب موظف (Official Salary Slip)',
      governorate: 'القاهرة',
    },
    visualConfig: {
      theme: 'gold-document',
      primarySymbol: 'PAYSLIP',
      secondarySymbol: 'HR A4',
      accentLabel: 'كشف ومفردات المرتب',
    },
  },
  {
    slug: 'privacy-policy-terms-generator',
    category: 'documents',
    pillarId: 'pillar-documents',
    engineType: 'document',
    badge: 'متوافق مع Google AdSense',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'merchants',
    title: 'مولد سياسة الخصوصية وشروط الاستخدام للمواقع والمتاجر الإلكترونية',
    shortTitle: 'مولد سياسة الخصوصية والشروط',
    subtitle: 'توليد صفحة سياسة الخصوصية وملفات الكوكيز وشروط الخدمة لمقبولية جوجل أدسنس والمتاجر',
    summary:
      'أدخل اسم موقعك أو متجرك ورابطه لتحصل على نص قانوني متكامل لسياسة الخصوصية واتفاقية الاستخدام جاهز للنسخ أو الطباعة.',
    defaultParams: {
      docType: 'privacy-policy',
      templateTitle: 'وثيقة سياسة الخصوصية وشروط الاستخدام الرسمية',
      governorate: 'الإنترنت والتجارة الإلكترونية',
    },
    visualConfig: {
      theme: 'gold-document',
      primarySymbol: 'POLICY',
      secondarySymbol: 'GDPR/ADS',
      accentLabel: 'مولد سياسة الخصوصية',
    },
  },
  {
    slug: 'retail-price-discount-tags-maker',
    category: 'documents',
    pillarId: 'pillar-documents',
    engineType: 'document',
    badge: 'بطاقات أسعار وعروض للمحلات',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'merchants',
    title: 'مصمم بطاقات الأسعار وملصقات الخصم والعروض للمحلات التجارية',
    shortTitle: 'مصمم بطاقات الأسعار والخصم',
    subtitle: 'صمم واطبع بطاقات عرض السعر قبل وبعد الخصم لوضعها على الرفوف والفترينات',
    summary:
      'أداة عملية لأصحاب المحلات والملابس والسوبرماركت لتصميم وطباعة ملصقات الأسعار والتخفيضات على ورق A4.',
    defaultParams: {
      docType: 'price-tags',
      templateTitle: 'بطاقة عرض سعر وخصم تجاري',
      governorate: 'القاهرة',
    },
    visualConfig: {
      theme: 'gold-document',
      primarySymbol: 'SALE %',
      secondarySymbol: 'TAGS',
      accentLabel: 'بطاقات الأسعار والخصم',
    },
  },
  {
    slug: 'certificate-of-appreciation-generator',
    category: 'documents',
    pillarId: 'pillar-documents',
    engineType: 'document',
    badge: 'إطار ذهبي فاخر للطباعة',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'top-today',
    title: 'مولد شهادات التقدير والتكريم واجتياز الدورات التدريبية',
    shortTitle: 'مولد شهادات التقدير والتكريم',
    subtitle: 'صمم شهادة شكر وتقدير أو شهادة إتمام دورة تدريبية بإطار رسمي أنيق جاهز للطباعة',
    summary:
      'أدخل اسم المُكرّم وسبب التقدير واسم المؤسسة وتاريخ الإصدار لطباعة شهادة تقدير فاخرة فوراً.',
    defaultParams: {
      docType: 'appreciation-cert',
      templateTitle: 'شهادة شكر وتقدير وتكريم رسمية',
      governorate: 'القاهرة',
    },
    visualConfig: {
      theme: 'gold-document',
      primarySymbol: 'AWARD',
      secondarySymbol: 'CERT A4',
      accentLabel: 'مولد شهادات التقدير',
    },
  },
  {
    slug: 'official-hr-letters-generator',
    category: 'documents',
    pillarId: 'pillar-documents',
    engineType: 'document',
    badge: 'طلب إجازة · استقالة · تعريف بالراتب',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'top-today',
    title: 'مولد خطابات العمل الرسمية وطلب الإجازة والاستقالة وشهادة الخبرة',
    shortTitle: 'مولد خطابات العمل والإجازات',
    subtitle: 'نماذج جاهزة لطلب إجازة، تقديم استقالة، شهادة خبرة، وخطاب لمن يهمه الأمر',
    summary:
      'اختر نوع الخطاب الإداري وعدل البيانات ليتم تنسيق خطاب رسمي موجه للإدارة أو السفارات والجهات الحكومية.',
    defaultParams: {
      docType: 'hr-letter',
      templateTitle: 'خطاب عمل إداري رسمي / شهادة خبرة',
      governorate: 'القاهرة',
    },
    visualConfig: {
      theme: 'gold-document',
      primarySymbol: 'LETTER',
      secondarySymbol: 'HR DOC',
      accentLabel: 'خطابات العمل الرسمية',
    },
  },
  {
    slug: 'business-partnership-contract-generator',
    category: 'documents',
    pillarId: 'pillar-documents',
    engineType: 'document',
    badge: 'تحديد الحصص والأرباح والإدارة',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'merchants',
    title: 'مولد عقد شراكة تجارية واتفاقية توزيع الأرباح والخسائر',
    shortTitle: 'مولد عقد شراكة تجارية',
    subtitle: 'توثيق حصص الشركاء في رأس المال ونسب توزيع الأرباح وصلاحيات الإدارة والانسحاب',
    summary:
      'احفظ حقوق الشركاء في أي مشروع تجاري أو شركة ناشئة عبر صياغة عقد شراكة واضح ومفصل جاهز للطباعة والتوقيع.',
    defaultParams: {
      docType: 'partnership',
      templateTitle: 'عقد شراكة وتأسيس مشروع تجاري',
      governorate: 'القاهرة',
    },
    visualConfig: {
      theme: 'gold-document',
      primarySymbol: 'PARTNER',
      secondarySymbol: 'A4 PDF',
      accentLabel: 'عقد شراكة تجارية',
    },
  },
  {
    slug: 'engineering-handover-protocol-generator',
    category: 'documents',
    pillarId: 'pillar-documents',
    engineType: 'document',
    badge: 'مقاولات وتشطيبات هندسية',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'merchants',
    title: 'مولد محضر استلام أعمال وتشطيبات وعقد مقاولات',
    shortTitle: 'محضر استلام أعمال وتشطيبات',
    subtitle: 'توثيق استلام مراحل التشطيب والمحارة والسباكة والكهرباء بين المالك والمهندس أو المقاول',
    summary:
      'نموذج هندسي وقانوني لإثبات معاينة واستلام بنود التشطيبات والمقاولات والدفعات المالية المرتبطة بكل مرحلة.',
    defaultParams: {
      docType: 'handover',
      templateTitle: 'محضر معاينة واستلام أعمال هندسية وتشطيبات',
      governorate: 'القاهرة',
    },
    visualConfig: {
      theme: 'gold-document',
      primarySymbol: 'ENG A4',
      secondarySymbol: 'HANDOVER',
      accentLabel: 'محضر استلام تشطيبات',
    },
  },

  // --------------------------------------------------------------------------
  // STRATEGIC HIGH-CPC & HIGH-RETENTION TOOLS (4 Flagship Enterprise Engines)
  // --------------------------------------------------------------------------
  {
    slug: 'gold-vs-bank-comparator',
    category: 'gold',
    pillarId: 'pillar-wealth',
    engineType: 'investment-comparator',
    badge: 'ذهب 21 ⇄ شهادة 27% ⇄ دولار',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'top-today',
    title: 'مستشار المقارنة الاستثمارية الذكي (الذهب مقابل الشهادات البنكية 27% مقابل الدولار)',
    shortTitle: 'مستشار المقارنة الاستثمارية الذكي',
    subtitle: 'قارن بالرسوم البيانية والمعادلات بين استثمار مبلغك في الذهب عيار 21 أو شهادات البنك (27%) أو الدولار في مصر',
    summary:
      'أداة استشارية مالية متقدمة تحسب صافي القيمة المستقبلية والأرباح المتوقعة عند استثمار مبلغ مالي في الذهب (بسعر عيار 21 اللحظي في مصر) مقارنة بشهادات الادخار البنكية (27%) والدولار الأمريكي مع توصية استثمارية فورية («الأفضل لك هو...»).',
    defaultParams: {
      capitalAmountEgp: 250000,
      durationYears: 3,
      bankCertRatePercent: 27,
      goldAnnualGrowthPercent: 29,
      usdAnnualGrowthPercent: 18,
    },
    visualConfig: {
      theme: 'gold-bullion',
      primarySymbol: 'ROI %',
      secondarySymbol: 'GOLD/BANK',
      accentLabel: 'مستشار المقارنة الاستثمارية',
    },
  },
  {
    slug: 'vehicle-maintenance-tracker',
    category: 'automotive',
    pillarId: 'pillar-daily',
    engineType: 'vehicle-maintenance',
    badge: 'سيارات وموتوسيكلات · سجل محفوظ',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'cars-motos',
    title: 'دفتر صيانة المركبات الذكي وحاسبة رسوم ترخيص المرور (سيارات وموتوسيكلات)',
    shortTitle: 'دفتر صيانة المركبات وحاسبة المرور',
    subtitle: 'مؤشرات مئوية لمواعيد تغيير الزيت والفلتر والبوجهات وتيل الفرامل مع حفظ تاريخ صيانتك وحاسبة رسوم المرور',
    summary:
      'أدخل قراءة عداد الكيلومترات الحالي لسيارتك أو الموتوسيكل لمعرفة نسبة استهلاك قطع الغيار ومواعيد الصيانة القادمة بدقة، مع حفظ سجل الصيانات على جهازك وحساب رسوم تجديد رخصة المرور والفحص الفني في مصر.',
    defaultParams: {
      vehicleType: 'car',
      currentOdometerKm: 64500,
      engineCc: 1600,
      licenseYears: 3,
    },
    visualConfig: {
      theme: 'gold-energy',
      primarySymbol: 'ODO KM',
      secondarySymbol: 'SERVICE',
      accentLabel: 'دفتر صيانة المركبات والمرور',
    },
  },
  {
    slug: 'shipping-awb-generator',
    category: 'documents',
    pillarId: 'pillar-documents',
    engineType: 'shipping-awb',
    badge: '27 محافظة · باركود + QR للطباعة',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'merchants',
    title: 'مولد بوليصة الشحن التجارية بالباركود ورمز QR للتجار وشركات الشحن (AWB)',
    shortTitle: 'مولد بوليصة الشحن بالباركود AWB',
    subtitle: 'إصدار بوليصة شحن قياسية لجميع محافظات مصر الـ 27 مع مبلغ التحصيل COD وصافي مستحقات التاجر جاهزة للطباعة',
    summary:
      'صمم واطبع بوليصة شحن تجارية (Air Waybill) احترافية للتجارة الإلكترونية وشركات الشحن في مصر، تشمل قائمة الـ 27 محافظة، حساب رسوم الشحن والتحصيل عند الاستلام (COD)، باركود أحادي (1D Barcode) ورمز QR ثنائي للطباعة الفورية.',
    defaultParams: {
      governorateId: 'cairo',
      codAmountEgp: 1450,
      piecesCount: 1,
      weightKg: 1.5,
      allowOpenPackage: true,
    },
    visualConfig: {
      theme: 'gold-document',
      primarySymbol: 'AWB',
      secondarySymbol: 'COD/QR',
      accentLabel: 'بوليصة شحن تجارية بالباركود',
    },
  },
  {
    slug: 'product-promo-badge-maker',
    category: 'images',
    pillarId: 'pillar-media',
    engineType: 'promo-badge',
    badge: '16 قالباً جاهزاً + أختام خصم + تفريغ خلفية',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'merchants',
    title: 'استوديو تصميم عروض المنتجات وشارات الخصم بالمتصفح (Product Promo Studio)',
    shortTitle: 'استوديو تصميم عروض المنتجات (16 قالباً)',
    subtitle:
      'اختر من 16 قالباً إعلانياً جاهزاً (الجمعة البيضاء، رمضان، فلاش سيل، نيون، VIP) مع تفريغ الخلفية البيضاء وأختام الخصم والسعر قبل وبعد',
    summary:
      'استوديو تصميم إعلانات متكامل للتجار والمسوقين داخل المتصفح عبر HTML5 Canvas يضم 16 قالباً تجارياً مختلفاً، 3 مقاسات (مربع 1080×1080، ستوري وريلز 1080×1920، وإعلان عرضي 1200×628)، أداة إزالة الخلفية البيضاء تلقائياً، أختام دائرية وشرائط ركنية مذهبة، وتصدير فوري PNG / JPG / WebP وPDF.',
    defaultParams: {
      templateId: 'luxury-black-gold',
      canvasSizeId: 'square',
      badgeText: 'خصم لفترة محدودة',
      productTitle: 'ساعة كرونوغراف ملكية إصدار خاص — ضمان عامين',
      productSubtitle: 'مقاومة للمياه · ستانلس ستيل مطلي ذهب عيار 24 · علبة فاخرة',
      priceBeforeEgp: 4850,
      priceAfterEgp: 2425,
      goldFrameEnabled: true,
    },
    visualConfig: {
      theme: 'gold-image',
      primarySymbol: '16 TPL',
      secondarySymbol: 'STUDIO',
      accentLabel: 'استوديو عروض المنتجات (16 قالباً)',
    },
  },
  {
    slug: 'egypt-governorates-hub',
    category: 'automotive',
    pillarId: 'pillar-everyday',
    engineType: 'egypt-governorates-hub',
    badge: '27 محافظة · مسافات + بنزين + شحن + بريد',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'drivers',
    title: 'دليل وحاسبة خدمات الـ 27 محافظة مصرية (المسافات، تكلفة البنزين، الشحن، والرمز البريدي)',
    shortTitle: 'دليل وحاسبة الـ 27 محافظة مصرية',
    subtitle: 'احسب المسافة بالكيلومتر وزمن السفر وتكلفة البنزين الرسمية ومتوسط الشحن وكود الأرضي والرمز البريدي بين أي محافظتين',
    summary:
      'الأداة الشاملة لخدمات محافظات مصر الـ 27: اختر محافظة الانطلاق ومحافظة الوصول لحساب المسافة بالكيلومتر، زمن السفر التقريبي، تكلفة وقود الرحلة بأسعار البنزين الرسمية (20.75 و22.25 و24.00 ج.م)، متوسط تكلفة الشحن التجاري، كود المفتاح الأرضي، والرمز البريدي الرئيسي لكل محافظة.',
    defaultParams: {
      fromGovId: 'CAI',
      toGovId: 'ALX',
      isRoundTrip: false,
      fuelGradeId: 'fuel92',
      consumptionPer100Km: 8.5,
      packageWeightKg: 2,
    },
    visualConfig: {
      theme: 'gold-energy',
      primarySymbol: '27 GOV',
      secondarySymbol: 'KM/FUEL',
      accentLabel: 'دليل محافظات مصر الشامل',
    },
  },
  {
    slug: 'live-qr-barcode-scanner',
    category: 'digital',
    pillarId: 'pillar-media',
    engineType: 'live-scanner',
    badge: 'فحص بالكاميرا + رفع صورة 100% بالمتصفح',
    trendingBadge: 'سريع ⚡',
    trendingTag: 'merchants',
    title: 'القارئ المباشر للباركود ورمز QR بالكاميرا أو الصور (Live Barcode & QR Scanner)',
    shortTitle: 'قارئ الباركود و QR بالكاميرا',
    subtitle: 'افتح كاميرا الموبايل أو اللابتوب مباشرة أو ارفع صورة لقراءة أي باركود منتج تجاري أو رمز QR فوراً',
    summary:
      'قارئ باركود ورمز استجابة سريع (QR Code) تفاعلي يعمل 100% داخل المتصفح عبر الكاميرا المباشرة أو رفع الصور، يعرض النتيجة في بطاقة ذهبية فاخرة مع أزرار نسخ النص أو فتح الرابط مباشرة أو المشاركة.',
    defaultParams: {},
    visualConfig: {
      theme: 'gold-digital',
      primarySymbol: 'SCAN',
      secondarySymbol: 'QR/1D',
      accentLabel: 'قارئ الباركود بالكاميرا',
    },
  },
  {
    slug: 'batch-image-barcode-processor',
    category: 'images',
    pillarId: 'pillar-media',
    engineType: 'batch-processor',
    badge: 'حتى 20 صورة أو 20 باركود بضغطة زر',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'merchants',
    title: 'محرك المعالجة الجماعية للصور وتوليد الباركود (Batch Image & Barcode Studio)',
    shortTitle: 'المعالجة الجماعية للصور والباركود',
    subtitle: 'ضغط وتحويل مجموعة صور إلى WebP/PNG/JPG أو توليد حتى 20 باركود ورمز QR دفعة واحدة مع شريط تقدم لحظي',
    summary:
      'استوديو المعالجة الجماعية للتجار والمصممين: اسحب وأفلت مجموعة صور لضغطها وتحويلها إلى WebP أو PNG أو JPG دفعة واحدة، أو أدخل حتى 20 كود منتج لتوليد وتحميل جميع رموز الباركود و QR بضغطة زر واحدة 100% من متصفحك.',
    defaultParams: {
      initialTab: 'barcodes',
    },
    visualConfig: {
      theme: 'gold-image',
      primarySymbol: 'BATCH',
      secondarySymbol: '20X',
      accentLabel: 'استوديو المعالجة الجماعية',
    },
  },

  // ==========================================================================
  // EXPANSION PACK: 48 NEW DISTINCT MASTER HUB TOOLS ACROSS 8 SECTORS
  // ==========================================================================

  // --------------------------------------------------------------------------
  // أولاً: أدوات المال والرواتب والجمعيات والاستثمار (8 أدوات جديدة)
  // --------------------------------------------------------------------------
  {
    slug: 'rosca-gameya-calculator',
    category: 'finance',
    pillarId: 'pillar-finance',
    engineType: 'rosca-gameya-calculator',
    badge: 'جدول القبض بالشهور + طباعة كشف PDF',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'banks-gold',
    title: 'حاسبة ومنظم الجمعيات المالية الشهرية وجدول ترتيب القبض',
    shortTitle: 'حاسبة ومنظم الجمعيات الشهرية',
    subtitle: 'حساب نصيب الفرد والأسهم الكاملة والنصف سهم وجدول ترتيب القبض بالشهور مع طباعة كشف الجمعية A4 PDF',
    summary:
      'الأداة المتكاملة لتنظيم وحساب الجمعيات المالية الشهرية بين الأهل والزملاء: حدد قيمة السهم الشهري وعدد المشتركين وتاريخ بداية الجمعية لتوليد جدول ترتيب القبض بالشهور والأسماء وصافي المقبوض وطباعة كشف رسمي PDF أو تصديره إلى Excel.',
    defaultParams: {
      monthlyShareEgp: 3000,
      membersCount: 10,
      startMonth: '2026-12',
      adminReserveFeeEgp: 0,
    },
    visualConfig: {
      theme: 'gold-finance',
      primarySymbol: 'جمعية',
      secondarySymbol: '12 شهر',
      accentLabel: 'منظم الجمعيات الشهرية',
    },
  },
  {
    slug: 'egypt-net-salary-tax',
    category: 'finance',
    pillarId: 'pillar-finance',
    engineType: 'egypt-net-salary-tax',
    badge: 'شرائح الضرائب والتأمينات المصرية 2026',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'banks-gold',
    title: 'حاسبة ضريبة الدخل والتأمينات الاجتماعية وصافي المرتب في مصر',
    shortTitle: 'حاسبة صافي المرتب والضرائب بمصر',
    subtitle: 'تحويل المرتب الإجمالي (Gross) إلى صافي (Net) والعكس وفق شرائح كسب العمل والتأمينات المصرية المحدثة',
    summary:
      'احسب مفردات مرتبك في مصر بدقة محاسبية: تحويل الراتب الإجمالي إلى صافي أو الصافي إلى إجمالي مع حساب حصة الموظف (11%) وحصة صاحب العمل (18.75%) في التأمينات الاجتماعية، الإعفاء الشخصي السنوي، وشرائح ضريبة كسب العمل.',
    defaultParams: {
      calcDirection: 'gross-to-net',
      monthlySalaryEgp: 18000,
      insuranceSalaryEgp: 12600,
      monthlyBonusesEgp: 0,
    },
    visualConfig: {
      theme: 'gold-finance',
      primarySymbol: 'NET/GROSS',
      secondarySymbol: 'TAX EG',
      accentLabel: 'ضريبة الدخل وصافي المرتب',
    },
  },
  {
    slug: 'mortgage-housing-calculator',
    category: 'finance',
    pillarId: 'pillar-finance',
    engineType: 'mortgage-housing-calculator',
    badge: 'مبادرات 3% و 8% والتمويل العقاري الحر',
    trendingBadge: 'جديد ✨',
    trendingTag: 'banks-gold',
    title: 'حاسبة التمويل العقاري وأقساط شقق الإسكان الاجتماعي والمتوسط',
    shortTitle: 'حاسبة التمويل العقاري وشقق الإسكان',
    subtitle: 'حساب المقدم، دفعات الاستلام، وديعة الصيانة، والقسط الشهري على 3 إلى 30 سنة',
    summary:
      'حاسبة التمويل العقاري الشاملة لشقق الإسكان الاجتماعي، سكن مصر، دار مصر، وجنة والتمويل العقاري البنكي: احسب مقدم الحجز، دفعات الاستلام الربع سنوية، وديعة الصيانة، والقسط الشهري الثابت أو المتناقص حتى 30 عاماً.',
    defaultParams: {
      unitPriceEgp: 1500000,
      downPaymentPercent: 20,
      annualInterestRate: 8,
      durationYears: 20,
      maintenanceDepositPercent: 5,
    },
    visualConfig: {
      theme: 'gold-finance',
      primarySymbol: 'عقاري',
      secondarySymbol: '30 سنة',
      accentLabel: 'حاسبة التمويل العقاري',
    },
  },
  {
    slug: 'credit-card-interest-calc',
    category: 'finance',
    pillarId: 'pillar-finance',
    engineType: 'credit-card-interest-calc',
    badge: 'فترة السماح + السحب النقدي + التقسيط',
    trendingBadge: 'مهم للعملاء ⚡',
    trendingTag: 'banks-gold',
    title: 'حاسبة فوائد البطاقات الائتمانية (الفيزا) والحد الأدنى للسداد',
    shortTitle: 'حاسبة فوائد الفيزا والبطاقات الائتمانية',
    subtitle: 'حساب فترة السماح 55 يوماً، رسوم السحب النقدي من الكريدت كارد، وتكلفة سداد الحد الأدنى 5%',
    summary:
      'تجنب فخ الفوائد المركبة للبطاقات الائتمانية: احسب الفائدة الشهرية عند سداد الحد الأدنى فقط (5%)، عدد شهور سداد المديونية بالكامل، رسوم السحب النقدي من ماكينة ATM، ومقارنة تقسيط المشتريات بالفيزا.',
    defaultParams: {
      cardBalanceEgp: 25000,
      monthlyInterestPercent: 3.25,
      minPaymentPercent: 5,
      fixedMonthlyPaymentEgp: 2500,
      cashAdvanceAmountEgp: 0,
    },
    visualConfig: {
      theme: 'gold-finance',
      primarySymbol: 'VISA/MC',
      secondarySymbol: '55 يوم',
      accentLabel: 'حاسبة البطاقات الائتمانية',
    },
  },
  {
    slug: 'partnership-profit-splitter',
    category: 'finance',
    pillarId: 'pillar-finance',
    engineType: 'partnership-profit-splitter',
    badge: 'رأس المال + نسبة الإدارة والمجهود',
    trendingBadge: 'للتجار والشركاء 🔥',
    trendingTag: 'merchants',
    title: 'حاسبة تقسيم أرباح الشركاء والمشاريع التجارية (رأس المال والمجهود)',
    shortTitle: 'حاسبة تقسيم أرباح الشركاء',
    subtitle: 'توزيع الأرباح العادل بين الشركاء حسب نسبة المساهمة في رأس المال ونسبة الإدارة والتشغيل',
    summary:
      'أداة محاسبية وشرعية لتوزيع أرباح الشركات والمشاريع المشتركة: تفصل بين نسبة الإدارة والمجهود للشريك المدير، واحتياطي تطوير المشروع، ثم توزع صافي الربح المتبقي بدقة حسب حصة كل شريك في رأس المال.',
    defaultParams: {
      netProfitEgp: 180000,
      managementSharePercent: 20,
      reinvestmentReservePercent: 10,
    },
    visualConfig: {
      theme: 'gold-finance',
      primarySymbol: 'شركاء',
      secondarySymbol: 'ROI %',
      accentLabel: 'تقسيم أرباح الشركاء',
    },
  },
  {
    slug: 'gold-dollar-profit-loss',
    category: 'gold',
    pillarId: 'pillar-finance',
    engineType: 'gold-dollar-profit-loss',
    badge: 'صافي الربح بعد المصنعية والسبريد والتضخم',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'banks-gold',
    title: 'حاسبة مكسب وخسارة المضاربة والادخار في الذهب والدولار',
    shortTitle: 'حاسبة مكسب وخسارة الذهب والدولار',
    subtitle: 'احسب صافي ربحك الحقيقي عند بيع الذهب أو الدولار بعد خصم المصنعية وفارق البيع والشراء والتضخم',
    summary:
      'اعرف هل كسبت أم خسرت فعلياً عند بيع مدخراتك من الذهب أو الدولار: تحسب الأداة تكلفة الشراء الأصلية شاملة المصنعية، قيمة البيع بالسعر اللحظي في مصر، صافي الربح بالجنيه والنسبة المئوية، وسعر التعادل المطلوب لتحقيق مكسب.',
    defaultParams: {
      assetType: 'gold21',
      quantity: 25,
      buyPricePerUnit: 3350,
      buyWorkmanshipPerGram: 110,
      sellPricePerUnit: 3811,
      cashbackPerGram: 35,
      holdingMonths: 8,
    },
    visualConfig: {
      theme: 'gold-bullion',
      primarySymbol: 'P&L ±',
      secondarySymbol: 'GOLD/$',
      accentLabel: 'مكسب وخسارة الذهب والدولار',
    },
  },
  {
    slug: 'savings-goal-planner',
    category: 'finance',
    pillarId: 'pillar-finance',
    engineType: 'savings-goal-planner',
    badge: 'خطة ادخار لشقة أو سيارة أو زواج',
    trendingBadge: 'تخطيط مالي ✨',
    trendingTag: 'banks-gold',
    title: 'مخطط الادخار الذكي والوصول للهدف المالي مع العائد التراكمي',
    shortTitle: 'مخطط الادخار والهدف المالي',
    subtitle: 'احسب كم يجب أن تدخر شهرياً للوصول لمبلغ شقة أو سيارة أو زواج خلال مدة محددة مع الفائدة المركبة',
    summary:
      'خطط لهدفك المالي القادم بدقة: أدخل المبلغ المستهدف، المدخرات الحالية، عدد الشهور المتاحة، ومعدل العائد السنوي المتوقع (في الذهب أو الشهادات أو الصناديق) لتعرف القسط الادخاري الشهري المطلوب وجدول نمو ثروتك.',
    defaultParams: {
      goalName: 'شراء سيارة / مقدم شقة',
      targetAmountEgp: 500000,
      initialSavingsEgp: 80000,
      durationMonths: 24,
      annualReturnPercent: 22,
    },
    visualConfig: {
      theme: 'gold-finance',
      primarySymbol: 'GOAL',
      secondarySymbol: 'SAVE',
      accentLabel: 'مخطط الوصول للهدف المالي',
    },
  },
  {
    slug: 'break-even-roi-calculator',
    category: 'finance',
    pillarId: 'pillar-finance',
    engineType: 'break-even-roi-calculator',
    badge: 'نقطة التعادل + هامش المساهمة + ROI',
    trendingBadge: 'للتجار والمشاريع 🔥',
    trendingTag: 'merchants',
    title: 'حاسبة نقطة التعادل للمشاريع التجارية وعائد الاستثمار (Break-Even & ROI)',
    shortTitle: 'حاسبة نقطة التعادل وعائد الاستثمار',
    subtitle: 'متى يغطي مشروعك تكاليفه الثابتة والمتغيرة ويبدأ بتحقيق ربح صافي؟ وكم عدد الوحدات المطلوب بيعها؟',
    summary:
      'دراسة جدوى مالية فورية لأي مشروع تجاري أو مصنع أو مطعم أو متجر إلكتروني: احسب عدد الوحدات المطلوب بيعها شهرياً لتغطية الإيجار والرواتب (نقطة التعادل)، هامش المساهمة للقطعة، صافي الربح الشهري، وفترة استرداد رأس المال.',
    defaultParams: {
      fixedMonthlyCostsEgp: 35000,
      unitSellingPriceEgp: 450,
      unitVariableCostEgp: 270,
      expectedMonthlySalesUnits: 300,
      initialCapitalInvestedEgp: 180000,
    },
    visualConfig: {
      theme: 'gold-finance',
      primarySymbol: 'B.E.P',
      secondarySymbol: 'ROI %',
      accentLabel: 'نقطة التعادل للمشاريع',
    },
  },

  // --------------------------------------------------------------------------
  // ثانياً: أدوات الهندسة، العقارات، الكهرباء والطاقة (6 أدوات جديدة)
  // --------------------------------------------------------------------------
  {
    slug: 'ac-btu-horsepower-calc',
    category: 'units',
    pillarId: 'pillar-daily',
    engineType: 'ac-btu-horsepower-calc',
    badge: 'بالحصان (1.5 إلى 5 حصان) + BTU + استهلاك الكهرباء',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'drivers',
    title: 'حاسبة قدرة التكييف المناسبة للغرفة (بالحصان والـ BTU واستهلاك الكهرباء)',
    shortTitle: 'حاسبة قدرة التكييف بالحصان و BTU',
    subtitle: 'حدد قدرة التكييف المثالية (1.5، 2.25، 3، 4، 5 حصان) حسب المساحة، الارتفاع، الدور الأخير، وتعرض الغرفة للشمس',
    summary:
      'حاسبة هندسية دقيقة لاختيار قدرة التكييف المناسبة لغرفتك أو صالة شقتك في مناخ مصر والخليج: تحسب سعة التبريد المطلوبة بالـ BTU وبالحصان، وتقارن بين التكييف الإنفرتر والعادي في استهلاك الكهرباء الشهري ومقاس سلك ومفتاح التكييف.',
    defaultParams: {
      roomLengthM: 5,
      roomWidthM: 4,
      ceilingHeightM: 3,
      isTopFloor: false,
      sunExposure: 'medium',
      occupantsCount: 3,
      isInverter: true,
    },
    visualConfig: {
      theme: 'gold-unit',
      primarySymbol: 'HP/BTU',
      secondarySymbol: 'AC COOL',
      accentLabel: 'حاسبة قدرة التكييف',
    },
  },
  {
    slug: 'wire-breaker-amp-calc',
    category: 'units',
    pillarId: 'pillar-daily',
    engineType: 'wire-breaker-amp-calc',
    badge: 'قطر السلك (مم²) + القاطع MCB + هبوط الجهد',
    trendingBadge: 'هندسة وكهرباء ⚡',
    trendingTag: 'drivers',
    title: 'حاسبة مقاس السلك الكهربائي (مم²) والقاطع الأوتوماتيك (الأمبير) وهبوط الجهد',
    shortTitle: 'حاسبة مقاس السلك والقاطع الأوتوماتيك',
    subtitle: 'حساب قطر السلك النحاسي (1.5 إلى 35 مم²) وسعة مفتاح الأوتوماتيك المناسب للأحمال بالواط والأمبير',
    summary:
      'أداة هندسية لفنيي ومهندسي الكهرباء وأصحاب الشقق أثناء التشطيب: أدخل القدرة بالواط أو الأمبير وطول مسار السلك ونوع التغذية (220V فاز واحد أو 380V ثلاثة فاز) لمعرفة مقاس السلك المعتمد بالـ مم² وسعة مفتاح القاطع الأوتوماتيك (MCB) ونسبة هبوط الجهد.',
    defaultParams: {
      loadWatts: 3500,
      voltage: 220,
      cableLengthMeters: 25,
      powerFactor: 0.9,
      phaseType: 'single',
    },
    visualConfig: {
      theme: 'gold-unit',
      primarySymbol: 'mm² / A',
      secondarySymbol: '220V/380V',
      accentLabel: 'مقاس السلك والقاطع',
    },
  },
  {
    slug: 'solar-battery-inverter-calc',
    category: 'automotive',
    pillarId: 'pillar-daily',
    engineType: 'solar-battery-inverter-calc',
    badge: 'عدد الألواح + سعة البطاريات + حجم الإنفرتر',
    trendingBadge: 'طاقة بديلة ☀️',
    trendingTag: 'drivers',
    title: 'حاسبة منظومة الطاقة الشمسية والبطاريات والإنفرتر للمنازل والمزارع',
    shortTitle: 'حاسبة الطاقة الشمسية والبطاريات والإنفرتر',
    subtitle: 'حساب عدد الألواح الشمسية، سعة البطاريات بالأمبير ساعة، وحجم الإنفرتر لتشغيل الأجهزة عند انقطاع الكهرباء',
    summary:
      'صمم منظومة الطاقة الشمسية أو نظام الطوارئ المنزلي (UPS/Inverter) بدقة: احسب إجمالي الأحمال بالواط، عدد ساعات التشغيل المطلوبة، سعة بطاريات الليثيوم أو الجل (Ah / kWh)، عدد ألواح الطاقة الشمسية (550W)، وقدرة الإنفرتر ومنظم الشحن MPPT.',
    defaultParams: {
      totalLoadWatts: 1200,
      backupHours: 5,
      systemVoltage: 24,
      panelWattage: 550,
      batteryType: 'lithium',
      peakSunHours: 5.5,
    },
    visualConfig: {
      theme: 'gold-energy',
      primarySymbol: 'SOLAR',
      secondarySymbol: 'kW / Ah',
      accentLabel: 'منظومة الطاقة الشمسية',
    },
  },
  {
    slug: 'battery-pack-bms-calc',
    category: 'automotive',
    pillarId: 'pillar-daily',
    engineType: 'battery-pack-bms-calc',
    badge: '18650 / LiFePO4 · 3S/4S/7S/13S + BMS',
    trendingBadge: 'حصري للمهندسين 🔥',
    trendingTag: 'drivers',
    title: 'حاسبة تجميع بطاريات الليثيوم (18650 / Li-ion / LiFePO4) واختيار شريحة BMS',
    shortTitle: 'حاسبة تجميع بطاريات الليثيوم والـ BMS',
    subtitle: 'حساب التوصيل توالي وتوازي (S×P)، الفولت الاسمي وأقصى فولت شحن، السعة بالـ mAh و Wh، وزمن التشغيل',
    summary:
      'الأداة الهندسية المتخصصة لتجميع بطاريات الليثيوم للسكوتر الكهربائي، الدراجات، الشنيور، وأنظمة الطوارئ: اختر نوع الخلية (Li-ion 3.7V أو LiFePO4 3.2V) وعدد خلايا التوالي (S) والتوازي (P) لحساب الفولت الكلي، السعة بالـ Ah والـ Wh، أقصى تيار تفريغ، ومواصفات شريحة الـ BMS والشاحن.',
    defaultParams: {
      cellChemistry: 'li-ion-3.7',
      seriesCountS: 3,
      parallelCountP: 4,
      singleCellCapacityMah: 2600,
      singleCellMaxDischargeAmp: 10,
      connectedLoadWatts: 60,
    },
    visualConfig: {
      theme: 'gold-energy',
      primarySymbol: '3S · 4P',
      secondarySymbol: 'BMS / Wh',
      accentLabel: 'تجميع بطاريات الليثيوم',
    },
  },
  {
    slug: 'rental-yield-payback-calc',
    category: 'finance',
    pillarId: 'pillar-finance',
    engineType: 'rental-yield-payback-calc',
    badge: 'العائد الإيجاري الصافي + سنوات استرداد العقار',
    trendingBadge: 'استثمار عقاري 🏢',
    trendingTag: 'banks-gold',
    title: 'حاسبة العائد الإيجاري السنوي وفترة استرداد ثمن العقار (Rental Yield & Payback)',
    shortTitle: 'حاسبة العائد الإيجاري واسترداد العقار',
    subtitle: 'احسب صافي العائد السنوي للشقق والمحلات التجارية وعدد سنوات استرداد رأس المال مع الزيادة السنوية للإيجار',
    summary:
      'قَيّم أي فرصة استثمار عقاري (شقة سكنية، عيادة، أو محل تجاري) قبل الشراء: تحسب الأداة إجمالي وصافي العائد الإيجاري السنوي (Gross & Net Rental Yield %) بعد خصم الصيانة وفترات الشغور، وعدد السنوات اللازمة لاسترداد ثمن العقار بالكامل.',
    defaultParams: {
      propertyPurchasePriceEgp: 2500000,
      finishingAndClosingCostEgp: 350000,
      monthlyRentEgp: 18000,
      annualRentIncreasePercent: 10,
      annualMaintenanceAndVacancyEgp: 15000,
    },
    visualConfig: {
      theme: 'gold-finance',
      primarySymbol: 'YIELD %',
      secondarySymbol: 'REALTY',
      accentLabel: 'العائد الإيجاري للعقار',
    },
  },
  {
    slug: 'cctv-storage-calculator',
    category: 'digital',
    pillarId: 'pillar-media',
    engineType: 'cctv-storage-calculator',
    badge: 'H.265+ / H.264 · 2MP إلى 8MP 4K',
    trendingBadge: 'لفنيي الكاميرات 📹',
    trendingTag: 'merchants',
    title: 'حاسبة مساحة هارد كاميرات المراقبة (CCTV Hard Drive Storage & Bandwidth)',
    shortTitle: 'حاسبة هارد كاميرات المراقبة CCTV',
    subtitle: 'حساب حجم الهارد ديسك بالتيرابايت (TB) وسرعة الشبكة حسب عدد الكاميرات، الدقة بالميجابكسل، وعدد أيام التسجيل',
    summary:
      'احسب سعة الهارد ديسك المخصص للمراقبة (1TB / 2TB / 4TB / 6TB / 8TB) بدقة هندسية: أدخل عدد الكاميرات، دقة التصوير (2MP 1080p أو 4MP أو 5MP أو 8MP 4K)، تقنية الضغط (H.265+ أو H.264)، وساعات التسجيل اليومية لمعرفة المساحة المطلوبة وأقرب هارد تجاري مناسب.',
    defaultParams: {
      camerasCount: 8,
      resolutionMp: '4mp',
      compressionCodec: 'h265plus',
      fps: 20,
      recordingDays: 30,
      hoursPerDay: 24,
    },
    visualConfig: {
      theme: 'gold-digital',
      primarySymbol: 'CCTV TB',
      secondarySymbol: 'H.265+',
      accentLabel: 'مساحة هارد الكاميرات',
    },
  },

  // --------------------------------------------------------------------------
  // ثالثاً: أدوات السيارات، الموتوسيكلات، وكباتن التوصيل (5 أدوات جديدة)
  // --------------------------------------------------------------------------
  {
    slug: 'ride-driver-net-profit',
    category: 'automotive',
    pillarId: 'pillar-daily',
    engineType: 'ride-driver-net-profit',
    badge: 'أوبر · ديدي · إندرايف · طلبات ومرسول',
    trendingBadge: 'الأكثر طلباً 🔥',
    trendingTag: 'drivers',
    title: 'حاسبة صافي ربح كابتن أوبر وديدي وإندرايف ومناديب التوصيل والدليفري',
    shortTitle: 'حاسبة صافي ربح كابتن أوبر والدليفري',
    subtitle: 'احسب صافي يوميتك ودخلك الشهري الحقيقي بعد خصم البنزين، عمولة التطبيق، وتكلفة غيار الزيت وإهلاك الكاوتش',
    summary:
      'الأداة اليومية لكل كابتن سيارة أو موتوسيكل يعمل مع أوبر، ديدي، إندرايف، أو شركات التوصيل: تحسب تكلفة الوقود الفعلية بأسعار البنزين الرسمية في مصر (80 / 92 / 95 / غاز)، عمولة التطبيق، ومصروف الإهلاك والزيت لكل كيلومتر لتعرف صافي ربحك في الساعة واليوم والشهر.',
    defaultParams: {
      vehicleType: 'car',
      dailyGrossRevenueEgp: 1650,
      dailyDistanceKm: 240,
      appCommissionPercent: 18,
      fuelGradeId: 'fuel92',
      consumptionPer100Km: 8.5,
      workingDaysPerMonth: 26,
      dailyWorkHours: 10,
    },
    visualConfig: {
      theme: 'gold-energy',
      primarySymbol: 'CAPTAIN',
      secondarySymbol: 'NET EGP',
      accentLabel: 'صافي ربح كابتن التوصيل',
    },
  },
  {
    slug: 'gear-sprocket-tire-calc',
    category: 'automotive',
    pillarId: 'pillar-daily',
    engineType: 'gear-sprocket-tire-calc',
    badge: 'نسبة التروس الأمامي/الخلفي + مقاس الكاوتش',
    trendingBadge: 'للسيارات والموتوسيكلات ⚙️',
    trendingTag: 'drivers',
    title: 'حاسبة تعديل مقاسات الكاوتش وآلات الجر والتروس والسرعة القصوى (Sprocket & Tire)',
    shortTitle: 'حاسبة التروس وآلات الجر ومقاس الكاوتش',
    subtitle: 'اعرف تأثير تغيير عدد سنون الترس الأمامي/الخلفي أو مقاس الإطار على السحب (العزم) والسرعة القصوى وعداد السرعة',
    summary:
      'حاسبة ميكانيكية متخصصة للموتوسيكلات والسيارات: قارن بين الترس الأمامي والخلفي الأصلي والمعدّل (Sprocket Gear Ratio) أو مقاس الإطار القديم والجديد لمعرفة نسبة زيادة السرعة القصوى أو قوة السحب والتسارع في المطالع مع تصحيح قراءة عداد الـ RPM والسرعة.',
    defaultParams: {
      frontSprocketStock: 15,
      rearSprocketStock: 41,
      frontSprocketNew: 16,
      rearSprocketNew: 39,
      stockTopSpeedKmh: 115,
      tireRimDiameterInch: 18,
    },
    visualConfig: {
      theme: 'gold-energy',
      primarySymbol: 'GEAR ±',
      secondarySymbol: 'KM/H',
      accentLabel: 'حاسبة آلات الجر والكاوتش',
    },
  },
  {
    slug: 'used-vehicle-inspection-checklist',
    category: 'automotive',
    pillarId: 'pillar-daily',
    engineType: 'used-vehicle-inspection-checklist',
    badge: 'تقييم حالة المركبة % + خصم المصاريف + السعر العادل',
    trendingBadge: 'قبل الشراء 🔍',
    trendingTag: 'drivers',
    title: 'فاحص ومقيم شراء سيارة أو موتوسيكل مستعمل وحساب السعر العادل',
    shortTitle: 'فاحص ومقيم شراء مركبة مستعملة',
    subtitle: 'قائمة فحص هندسية تفاعلية للماتور، الشاسيه، الفتيس، العفشة، الكهرباء، والورق تحسب نسبة الحالة والسعر العادل',
    summary:
      'افحص أي سيارة أو موتوسيكل مستعمل قبل دفع العربون: قائمة تقييم شاملة من 12 بنداً فنياً وقانونياً تحسب النسبة المئوية لحالة المركبة، وتخصم تكلفة الإصلاحات الفورية ومصاريف التسجيل لتعطيك السعر العادل للتفاوض مع البائع وتقرير فحص جاهز للطباعة.',
    defaultParams: {
      sellerAskingPriceEgp: 450000,
      vehicleCategory: 'car',
      modelYear: 2019,
    },
    visualConfig: {
      theme: 'gold-energy',
      primarySymbol: 'CHECK %',
      secondarySymbol: 'FAIR EGP',
      accentLabel: 'فاحص المركبات المستعملة',
    },
  },
  {
    slug: 'fuel-octave-oil-mixer',
    category: 'automotive',
    pillarId: 'pillar-daily',
    engineType: 'fuel-octave-oil-mixer',
    badge: '10W40 / 20W50 / 5W30 + مواعيد الغيار والإضافات',
    trendingBadge: 'حماية الماتور 🛢️',
    trendingTag: 'drivers',
    title: 'حاسبة مواعيد ومواصفات لزوجة زيت الموتور والإضافات وتكلفة الصيانة السنوية',
    shortTitle: 'حاسبة لزوجة زيت الموتور والإضافات',
    subtitle: 'حدد لزوجة الزيت المثالية (5W30 / 10W40 / 20W50) حسب عداد الكيلومترات وحرارة الجو واحسب مواعيد الغيار',
    summary:
      'مرشد هندسي لاختيار لزوجة وتصنيف زيت المحرك (API SN/SP) للموتوسيكلات والسيارات حسب قراءة العداد وحالة الماتور ودرجة حرارة الصيف والشتاء في مصر، مع حاسبة خلط إضافات الأوكتان والزيت وموعد الكيلومتر القادم لتغيير الزيت والفلتر.',
    defaultParams: {
      currentOdometerKm: 65000,
      engineCondition: 'good',
      oilGradeType: 'semi-5000',
      monthlyDrivenKm: 2000,
      oilChangeCostEgp: 1150,
      fuelTankLiters: 45,
    },
    visualConfig: {
      theme: 'gold-energy',
      primarySymbol: '10W-40',
      secondarySymbol: 'OIL KM',
      accentLabel: 'مستشار لزوجة زيت الموتور',
    },
  },
  {
    slug: 'traffic-fines-license-estimator',
    category: 'automotive',
    pillarId: 'pillar-daily',
    engineType: 'traffic-fines-license-estimator',
    badge: 'الضريبة + التأمين + الملصق الإلكتروني + الفحص',
    trendingBadge: 'خدمات المرور 🪪',
    trendingTag: 'drivers',
    title: 'حاسبة رسوم تجديد رخصة السيارة والموتوسيكل والضريبة والملصق الإلكتروني',
    shortTitle: 'حاسبة رسوم تجديد الرخصة والمرور',
    subtitle: 'تقدير إجمالي تكلفة تجديد الترخيص لمدة سنة أو سنتين أو 3 سنوات حسب السعة اللترية (CC) وموديل المركبة',
    summary:
      'اعرف التكلفة التقديرية لتجديد رخصة سيارتك أو الموتوسيكل في وحدات المرور المصرية قبل الذهاب: تحسب الأداة الضريبة السنوية حسب السعة اللترية (أقل من 1000 سي سي حتى أكثر من 2000 سي سي)، التأمين الإجباري، الملصق الإلكتروني، رسم تطوير اللوحات، والفحص الفني.',
    defaultParams: {
      engineCcCategory: '1300-1600',
      licenseDurationYears: 3,
      needsTechnicalInspection: true,
      needsFirstAidAndExtinguisher: false,
      estimatedTrafficFinesEgp: 0,
    },
    visualConfig: {
      theme: 'gold-energy',
      primarySymbol: 'LICENSE',
      secondarySymbol: '1-3 YRS',
      accentLabel: 'رسوم تجديد رخصة المرور',
    },
  },

  // --------------------------------------------------------------------------
  // رابعاً: أدوات التجار، الدروبشيبينج، والإعلانات الممولة (6 أدوات جديدة)
  // --------------------------------------------------------------------------
  {
    slug: 'ads-roas-cpa-calculator',
    category: 'finance',
    pillarId: 'pillar-finance',
    engineType: 'ads-roas-cpa-calculator',
    badge: 'Facebook & TikTok Ads · CPA & Break-Even ROAS',
    trendingBadge: 'الأكثر طلباً للتجار 🔥',
    trendingTag: 'merchants',
    title: 'حاسبة ميزانية الإعلانات الممولة وعائد الإنفاق الإعلاني (Ads ROAS & CPA Calculator)',
    shortTitle: 'حاسبة الإعلانات الممولة و ROAS',
    subtitle: 'حساب تكلفة الأوردر الواحد (CPA)، العائد على الإعلان (ROAS)، نسبة التسليم الفعلي، وأعلى سعر أوردر مربح',
    summary:
      'الأداة الأساسية للمعلنين ومشتري الميديا (Media Buyers) والتجار على فيسبوك وإنستجرام وتيك توك: احسب نقطة تعادل الإعلان (Break-Even ROAS)، صافي ربح الحملة بعد خصم تكلفة المنتج ونسبة المرتجعات والشحن، وأقصى تكلفة مسموحة للأوردر الواحد (Max CPA).',
    defaultParams: {
      productSellingPriceEgp: 650,
      productCostEgp: 280,
      adSpendEgp: 12000,
      totalOrdersCount: 95,
      deliverySuccessPercent: 82,
      returnShippingLossPerOrderEgp: 55,
    },
    visualConfig: {
      theme: 'gold-finance',
      primarySymbol: 'ROAS',
      secondarySymbol: 'CPA EGP',
      accentLabel: 'حاسبة الإعلانات الممولة',
    },
  },
  {
    slug: 'cod-shipping-reconciliation',
    category: 'currencies',
    pillarId: 'pillar-finance',
    engineType: 'cod-shipping-reconciliation',
    badge: 'مراجعة شيتات الشحن والتحصيل COD + كشف العجز',
    trendingBadge: 'مهم للمتاجر 📦',
    trendingTag: 'merchants',
    title: 'مراجع حسابات شركات الشحن والتحصيل النقدي (COD Shipping Sheet Auditor)',
    shortTitle: 'مراجع حسابات وتحصيل شركات الشحن COD',
    subtitle: 'طابق إجمالي البوالص المرسلة بالمرتجعات وعمولة التحصيل لحساب الصافي المستحق لمتجرك عند شركة الشحن بدقة',
    summary:
      'اضبط حساباتك مع شركات الشحن ومناديب التوصيل بدون أخطاء: أدخل عدد الأوردرات المسلّمة والمرتجعة والمؤجلة، متوسط قيمة التحصيل (COD)، سعر الشحن، وغرامة المرتجع ليعطيك النظام الصافي المستحق استلامه ويقارنه بالمبلغ المحول لك لكشف أي فرق مالي.',
    defaultParams: {
      totalShippedOrders: 120,
      deliveredOrdersCount: 96,
      returnedOrdersCount: 18,
      pendingOrdersCount: 6,
      avgOrderCodValueEgp: 580,
      shippingFeePerOrderEgp: 65,
      returnFeePerOrderEgp: 35,
      codCollectionFeePercent: 1,
      actualCompanyPayoutEgp: 48500,
    },
    visualConfig: {
      theme: 'gold-currency',
      primarySymbol: 'COD',
      secondarySymbol: 'AUDIT',
      accentLabel: 'مراجع حسابات الشحن COD',
    },
  },
  {
    slug: 'bundle-tiered-discount-calc',
    category: 'currencies',
    pillarId: 'pillar-finance',
    engineType: 'bundle-tiered-discount-calc',
    badge: 'قطعة بـ X وقطعتين بـ Y + شحن مجاني بأمان',
    trendingBadge: 'مضاعفة المبيعات 🚀',
    trendingTag: 'merchants',
    title: 'حاسبة عروض البكجات والخصم المتدرج للتجار (Bundle & Tiered Pricing)',
    shortTitle: 'حاسبة عروض البكجات والخصم المتدرج',
    subtitle: 'صمّم عروض (قطعة، قطعتين، 3 قطع + شحن مجاني) مع ضمان عدم نزول هامش ربحك الصافي عن الحد الآمن',
    summary:
      'ضاعف متوسط قيمة سلة المشتريات (AOV) في متجرك بدون خسارة: تحسب الأداة صافي ربحك في العرض الفردي وعرض القطعتين وعرض الـ 3 قطع بعد خصم تكلفة البضاعة وتكلفة الشحن المجاني وتكلفة الإعلان لكل أوردر.',
    defaultParams: {
      unitProductCostEgp: 190,
      singleUnitPriceEgp: 450,
      twoUnitsBundlePriceEgp: 799,
      threeUnitsBundlePriceEgp: 1099,
      merchantShippingCostEgp: 65,
      adCpaPerOrderEgp: 110,
    },
    visualConfig: {
      theme: 'gold-currency',
      primarySymbol: '1X·2X·3X',
      secondarySymbol: 'BUNDLE',
      accentLabel: 'حاسبة عروض البكجات',
    },
  },
  {
    slug: 'utm-whatsapp-campaign-builder',
    category: 'digital',
    pillarId: 'pillar-media',
    engineType: 'utm-whatsapp-campaign-builder',
    badge: 'روابط تتبع UTM + رسالة طلب واتساب جاهزة + QR',
    trendingBadge: 'للمسوقين والتجار 📲',
    trendingTag: 'merchants',
    title: 'مولد روابط الحملات الإعلانية (UTM Builder) ورسائل طلب المنتج عبر واتساب مع QR',
    shortTitle: 'مولد روابط حملات UTM وطلبات واتساب',
    subtitle: 'أنشئ روابط تتبع إعلانات جوجل وفيسبوك وتيك توك وروابط طلب منتج مباشر عبر واتساب مزودة بكود QR فوري',
    summary:
      'أداة مزدوجة للمسوقين وأصحاب المتاجر: قم ببناء رابط تتبع الحملة الإعلانية بمعاملات UTM القياسية لمعرفة مصدر كل مبيعة، وولّد في نفس اللحظة رابط طلب واتساب مباشر يحتوي على اسم المنتج والسعر والعرض مع رمز QR جاهز للتحميل.',
    defaultParams: {
      websiteUrl: 'https://dixtools.com/shop',
      utmSource: 'facebook',
      utmMedium: 'paid_social',
      utmCampaign: 'black_gold_sale_2026',
      whatsappPhone: '201000000000',
      productName: 'عرض البكج الملكي الذهبي',
      productPriceEgp: '799',
    },
    visualConfig: {
      theme: 'gold-digital',
      primarySymbol: 'UTM+WA',
      secondarySymbol: 'QR LINK',
      accentLabel: 'مولد روابط الحملات وواتساب',
    },
  },
  {
    slug: 'social-ad-hook-generator',
    category: 'digital',
    pillarId: 'pillar-media',
    engineType: 'social-ad-hook-generator',
    badge: '5 صيغ بيعية (مصر والخليج) + سكريبت ريلز + هشتاجات',
    trendingBadge: 'كتابة إعلانات ✍️',
    trendingTag: 'merchants',
    title: 'مولد النصوص الإعلانية البيعية وسكريبتات الريلز والهشتاجات للمنتجات (Ad Copy Generator)',
    shortTitle: 'مولد نصوص الإعلانات البيعية والهشتاجات',
    subtitle: 'يولّد 5 صيغ إعلانية عالية التحويل (AIDA, PAS, سكريبت ريلز، عرض خاطف) باللهجة المصرية أو الخليجية بضغطة زر',
    summary:
      'اكتب إعلاناً يبيع في 5 ثوانٍ: أدخل اسم المنتج، الميزة التنافسية، السعر، والعرض الإضافي لتحصل فوراً على 5 نصوص إعلانية جاهزة للنشر على فيسبوك وإنستجرام وتيك توك باللهجة المصرية أو الخليجية أو الفصحى مع أقوى الهشتاجات.',
    defaultParams: {
      productTitle: 'ساعة ذكية ألترا مقاومة للمياه',
      mainBenefit: 'بطارية تدوم 10 أيام مع ضمان استبدال سنة كاملة',
      offerPrice: '999 ج.م بدلاً من 1450 ج.م + شحن مجاني',
      dialect: 'egyptian',
    },
    visualConfig: {
      theme: 'gold-digital',
      primarySymbol: 'AD COPY',
      secondarySymbol: '5 HOOKS',
      accentLabel: 'مولد النصوص الإعلانية',
    },
  },
  {
    slug: 'seo-serp-og-simulator',
    category: 'digital',
    pillarId: 'pillar-media',
    engineType: 'seo-serp-og-simulator',
    badge: 'معاينة جوجل + فيسبوك + واتساب + كود Meta Tags',
    trendingBadge: 'محترفي SEO 🌐',
    trendingTag: 'merchants',
    title: 'محاكي ظهور الموقع والمنتجات في جوجل وفيسبوك وواتساب (SERP & OpenGraph Simulator)',
    shortTitle: 'محاكي ظهور جوجل وفيسبوك وواتساب',
    subtitle: 'معاينة حية لشكل عنوان صفحتك والوصف والصورة المصغرة قبل نشرها مع توليد أكواد HTML Meta Tags',
    summary:
      'اختبر كيف يظهر موقعك أو صفحة منتجك أمام العملاء في نتائج بحث جوجل (كمبيوتر وموبايل) وفي بطاقات مشاركة فيسبوك وواتساب وتويتر، مع عداد الحروف والبكسلات المثالي وتوليد أكواد الـ SEO & OpenGraph جاهزة للنسخ.',
    defaultParams: {
      pageTitle: 'منصة Dix Tools | حاسبات الذهب والعملات والعقود الذكية في مصر',
      pageDescription:
        'احسب أسعار الذهب بالمصنعية، تحويل العملات لحظياً، تكلفة تشطيب الشقق، واطبع العقود الرسمية مجاناً 100% من متصفحك.',
      pageUrl: 'https://dixtools.com/gold/comprehensive-gold-calculator',
      siteBrandName: 'Dix Tools',
    },
    visualConfig: {
      theme: 'gold-digital',
      primarySymbol: 'SERP/OG',
      secondarySymbol: 'SEO PREVIEW',
      accentLabel: 'محاكي جوجل والسوشيال',
    },
  },

  // --------------------------------------------------------------------------
  // خامساً: استوديو الـ PDF والميديا والألوان المتقدم بالمتصفح (6 أدوات جديدة)
  // --------------------------------------------------------------------------
  {
    slug: 'pdf-page-organizer-splitter',
    category: 'images',
    pillarId: 'pillar-media',
    engineType: 'pdf-page-organizer-splitter',
    badge: 'تقسيم واستخراج وترتيب صفحات PDF 100% بالمتصفح',
    trendingBadge: 'خصوصية تامة 📄',
    trendingTag: 'merchants',
    title: 'استوديو تقسيم واستخراج وترتيب صفحات PDF وتوليد المذكرات (PDF Page Organizer)',
    shortTitle: 'استوديو تقسيم وترتيب صفحات PDF',
    subtitle: 'استخرج صفحات محددة، أعد ترتيب الصفحات، أو قسّم ملفات ومستندات PDF مباشرة داخل متصفحك بدون رفع لسيرفر',
    summary:
      'تحكم كامل بصفحات مستنداتك ومذكراتك بسرية تامة 100% داخل المتصفح: حدد نطاق الصفحات المطلوب استخراجها (مثل 1-5 أو 2,4,8)، أعد ترتيب الصفحات أو تدويرها، واطبع أو احفظ الملف المستخرج بصيغة PDF نظيفة فوراً.',
    defaultParams: {
      totalPagesCount: 12,
      extractRangeInput: '1-4, 7, 10-12',
      pageOrientation: 'portrait',
    },
    visualConfig: {
      theme: 'gold-image',
      primarySymbol: 'PDF SPLIT',
      secondarySymbol: 'A4 ORG',
      accentLabel: 'تقسيم وترتيب صفحات PDF',
    },
  },
  {
    slug: 'document-watermark-stamper',
    category: 'images',
    pillarId: 'pillar-media',
    engineType: 'document-watermark-stamper',
    badge: 'علامة مائية مائلة متكررة لحماية البطاقات والعقود والصور',
    trendingBadge: 'حماية المستندات 🛡️',
    trendingTag: 'merchants',
    title: 'أداة ختم وحماية الصور والبطاقات والمستندات بعلامة مائية متكررة (Watermark Stamper)',
    shortTitle: 'ختم الصور والمستندات بعلامة مائية',
    subtitle: 'ضع اسم متجرك أو عبارة (نسخة مخصصة لـ... لا يعتد بها في البنوك) بشكل مائل ومتكرر لمنع سرقة الصور والمستندات',
    summary:
      'احمِ صور بطاقتك الشخصية، عقودك، أو صور منتجات متجرك الحصرية من السرقة والاستخدام غير المصرح به: ارفع الصورة واكتب نص العلامة المائية المكررة وتحكم في زاوية الميل والشفافية واللون الذهبي أو الأبيض وحمّل الصورة المختومة بدقة عالية.',
    defaultParams: {
      watermarkText: 'نسخة مخصصة للتقديم فقط — Dix Tools Official',
      angleDeg: -30,
      opacityPercent: 28,
      repeatColumns: 3,
    },
    visualConfig: {
      theme: 'gold-image',
      primarySymbol: 'STAMP',
      secondarySymbol: 'PROTECT',
      accentLabel: 'ختم وحماية المستندات والصور',
    },
  },
  {
    slug: 'image-color-palette-extractor',
    category: 'images',
    pillarId: 'pillar-media',
    engineType: 'image-color-palette-extractor',
    badge: 'استخراج أكواد HEX + RGB + CSS Gradient من أي صورة',
    trendingBadge: 'للمصممين 🎨',
    trendingTag: 'merchants',
    title: 'مستخرج باليتة الألوان وأكواد HEX و CSS Gradient من أي صورة (Color Palette Studio)',
    shortTitle: 'مستخرج باليتة الألوان من الصور',
    subtitle: 'ارفع أي صورة أو شعار لاستخراج ألوانها الأساسية وتدرجاتها اللونية بصيغة HEX و RGB و CSS بضغطة زر',
    summary:
      'أداة ذكية للمصممين والمطورين وصناع الهوية البصرية: ارفع أي صورة ليقوم محرك HTML5 Canvas بتحليل البكسلات واستخراج أبرز 6 ألوان متناسقة مع أكواد HEX و RGB وكود تدرج CSS جاهز للنسخ.',
    defaultParams: {
      presetTheme: 'luxury-black-gold',
    },
    visualConfig: {
      theme: 'gold-image',
      primarySymbol: '#D4AF37',
      secondarySymbol: 'PALETTE',
      accentLabel: 'مستخرج باليتة الألوان',
    },
  },
  {
    slug: 'social-media-image-resizer',
    category: 'images',
    pillarId: 'pillar-media',
    engineType: 'social-media-image-resizer',
    badge: 'قوالب بوست 1080×1080 · ستوري وريلز 1080×1920 · غلاف',
    trendingBadge: 'سوشيال ومتاجر 📐',
    trendingTag: 'merchants',
    title: 'مقص ومضبط أبعاد الصور لجميع منصات السوشيال ميديا والمتاجر الإلكترونية',
    shortTitle: 'مضبط أبعاد صور السوشيال والمتاجر',
    subtitle: 'اضبط مقاس أي صورة لبوست إنستجرام وفيسبوك (1080×1080)، ستوري وريلز (1080×1920)، وصور منتجات أمازون ونون',
    summary:
      'وداعاً لقص الصور العشوائي في منصات التواصل والمتاجر: اختر القالب المطلوب (بوست مربع، ريلز وتيك توك طولي، غلاف يوتيوب وفيسبوك، أو صورة منتج متجر إلكتروني) مع إضافة خلفية ذهبية أو داكنة فاخرة وتحميل فوري بصيغة PNG/WebP.',
    defaultParams: {
      presetId: 'ig-square-1080',
      paddingPx: 40,
      bgStyle: 'dark-gold',
    },
    visualConfig: {
      theme: 'gold-image',
      primarySymbol: '1080PX',
      secondarySymbol: 'RESIZE',
      accentLabel: 'مضبط أبعاد السوشيال ميديا',
    },
  },
  {
    slug: 'exif-privacy-cleaner',
    category: 'images',
    pillarId: 'pillar-media',
    engineType: 'exif-privacy-cleaner',
    badge: 'مسح بيانات الكاميرا والموقع الجغرافي GPS من الصور',
    trendingBadge: 'حماية الخصوصية 🔒',
    trendingTag: 'merchants',
    title: 'فاحص وماسح البيانات الخفية والموقع الجغرافي من الصور (EXIF & GPS Privacy Cleaner)',
    shortTitle: 'ماسح البيانات الخفية والموقع من الصور',
    subtitle: 'افحص وامسح بيانات الكاميرا وتاريخ الالتقاط وإحداثيات الموقع الجغرافي (GPS) المخفية داخل صورك بضغطة زر',
    summary:
      'قبل مشاركة صورك الشخصية أو صور العمل على الإنترنت، تأكد من خلوها من إحداثيات موقعك الجغرافي (GPS) ونوع هاتفك: تقوم الأداة بفحص الصورة وإعادة توليد نسخة مطابقة 100% خالية تماماً من أي بيانات EXIF أو تتبع مخفي داخل متصفحك.',
    defaultParams: {},
    visualConfig: {
      theme: 'gold-image',
      primarySymbol: 'NO EXIF',
      secondarySymbol: 'GPS OFF',
      accentLabel: 'ماسح البيانات الخفية EXIF',
    },
  },
  {
    slug: 'audio-voice-trimmer-recorder',
    category: 'images',
    pillarId: 'pillar-media',
    engineType: 'audio-voice-trimmer-recorder',
    badge: 'تسجيل صوتي + قص المقاطع + تحميل WAV نقي',
    trendingBadge: 'استوديو صوتي 🎙️',
    trendingTag: 'merchants',
    title: 'مسجل الصوت وقاطع المقاطع الصوتية وصانع النغمات بالمتصفح (Audio Recorder & Trimmer)',
    shortTitle: 'مسجل وقاطع المقاطع الصوتية',
    subtitle: 'سجّل ملاحظة صوتية أو ارفع ملفاً صوتياً، حدد ثانية البداية والنهاية، وحمّل المقطع المقصوص بصيغة WAV عالية النقاء',
    summary:
      'استوديو صوتي خفيف يعمل بالكامل داخل متصفحك عبر Web Audio API: يمكنك تسجيل صوتك مباشرة أو اختيار ملف صوتي أو توليد نغمة تنبيه، مع تحديد نقطة البداية والنهاية بالثواني وتحميل المقطع الصوتي فوراً بدون رفع لأي سيرفر.',
    defaultParams: {
      trimStartSec: 0,
      trimEndSec: 15,
      sampleDurationSec: 30,
    },
    visualConfig: {
      theme: 'gold-image',
      primarySymbol: 'AUDIO',
      secondarySymbol: 'WAV CUT',
      accentLabel: 'مسجل وقاطع الصوتيات',
    },
  },

  // --------------------------------------------------------------------------
  // سادساً: أدوات البرمجة، الشبكات، والـ IT (6 أدوات جديدة)
  // --------------------------------------------------------------------------
  {
    slug: 'json-sql-code-formatter',
    category: 'digital',
    pillarId: 'pillar-media',
    engineType: 'json-sql-code-formatter',
    badge: 'Beautify · Minify · مقارنة نصين Diff بالأخضر والأحمر',
    trendingBadge: 'للمطورين 💻',
    trendingTag: 'merchants',
    title: 'منسق ومحول ومقارن الأكواد والنصوص (JSON / SQL / HTML / CSS Formatter & Diff)',
    shortTitle: 'منسق ومقارن الأكواد JSON & Diff',
    subtitle: 'تنسيق الكود (Beautify)، ضغطه (Minify)، التحقق من JSON، ومقارنة نصين لإظهار الاختلافات باللون الأخضر والأحمر',
    summary:
      'أداة شاملة للمبرمجين ومحللي البيانات: قم بتنسيق أو ضغط أكواد JSON و SQL و HTML و CSS، أو استخدم وضع المقارنة (Text/Code Diff) لمقارنة نسختين من الكود أو النص سطراً بسطر مع تظليل الإضافات بالأخضر والحذف بالأحمر.',
    defaultParams: {
      mode: 'json-beautify',
    },
    visualConfig: {
      theme: 'gold-digital',
      primarySymbol: '{ JSON }',
      secondarySymbol: 'DIFF ±',
      accentLabel: 'منسق ومقارن الأكواد',
    },
  },
  {
    slug: 'jwt-base64-hash-studio',
    category: 'digital',
    pillarId: 'pillar-media',
    engineType: 'jwt-base64-hash-studio',
    badge: 'JWT Decoder + Base64 UTF-8 + SHA-256 + URL Encode',
    trendingBadge: 'أمن المعلومات 🔐',
    trendingTag: 'merchants',
    title: 'استوديو التشفير وفك الرموز للمطورين (JWT Decoder, Base64, SHA-256 & URL Encoder)',
    shortTitle: 'استوديو التشفير وفك رموز JWT و Base64',
    subtitle: 'فك وتحليل توكن JWT، تشفير وفك Base64 للنصوص العربية والإنجليزية، توليد بصمة SHA-256، وترميز الروابط',
    summary:
      'صندوق أدوات التشفير المحلي للمطورين ومهندسي أمن المعلومات: يعمل 100% داخل متصفحك لفك محتوى JWT (Header & Payload) والتحقق من صلاحية انتهائه، مع محول Base64 يدعم اللغة العربية، ومولد هاش SHA-256 المشفر.',
    defaultParams: {
      activeTab: 'jwt',
    },
    visualConfig: {
      theme: 'gold-digital',
      primarySymbol: 'JWT/SHA',
      secondarySymbol: 'BASE64',
      accentLabel: 'استوديو التشفير للمطورين',
    },
  },
  {
    slug: 'regex-tester-arabic',
    category: 'digital',
    pillarId: 'pillar-media',
    engineType: 'regex-tester-arabic',
    badge: 'قوالب موبايل مصري 010/011/012/015 + الرقم القومي 14 رقم',
    trendingBadge: 'قوالب عربية جاهزة 🧪',
    trendingTag: 'merchants',
    title: 'مختبر ومولد التعبيرات النمطية الجاهزة (Arabic & Egypt Regex Tester)',
    shortTitle: 'مختبر ومولد التعبيرات النمطية Regex',
    subtitle: 'اختبر أي تعبير Regex حياً مع قوالب جاهزة لأرقام الموبايل المصرية، الرقم القومي 14 رقم، الإيميل، والأسماء العربية',
    summary:
      'وفّر ساعات من كتابة واختبار التعبيرات النمطية (Regular Expressions): اختر بضغطة زر قالب التحقق من رقم هاتف مصري (010/011/012/015)، الرقم القومي المصري (14 رقماً)، البريد الإلكتروني، أو الحروف العربية الصافية، وشاهد النتائج المطابقة فوراً.',
    defaultParams: {
      presetKey: 'egypt-mobile',
    },
    visualConfig: {
      theme: 'gold-digital',
      primarySymbol: '/REGEX/',
      secondarySymbol: '010·14ID',
      accentLabel: 'مختبر Regex والقوالب المصرية',
    },
  },
  {
    slug: 'egypt-national-id-analyzer',
    category: 'units',
    pillarId: 'pillar-daily',
    engineType: 'egypt-national-id-analyzer',
    badge: 'تاريخ الميلاد + العمر باليوم + المحافظة + النوع + سن المعاش',
    trendingBadge: 'الأكثر طلباً في مصر 🔥',
    trendingTag: 'banks-gold',
    title: 'محلل بيانات الرقم القومي المصري الذكي (تاريخ الميلاد، المحافظة، العمر، وسن المعاش)',
    shortTitle: 'محلل الرقم القومي المصري الذكي',
    subtitle: 'أدخل الـ 14 رقماً لاستخراج تاريخ الميلاد الكامل، العمر باليوم والشهر والسنة، محافظة الميلاد، النوع، البرج، وسن المعاش',
    summary:
      'الأداة الفورية لتحليل وفحص الرقم القومي المصري المكون من 14 رقماً (100% داخل متصفحك بدون حفظ أي بيانات): تستخرج تلقائياً تاريخ الميلاد، العمر الدقيق، كود واسم محافظة الميلاد من الـ 27 محافظة أو المولود بالخارج، النوع، البرج الفلكي، وتاريخ التقاعد الرسمي.',
    defaultParams: {
      nationalIdInput: '29507150101234',
    },
    visualConfig: {
      theme: 'gold-unit',
      primarySymbol: '14 رقماً',
      secondarySymbol: 'ID EGYPT',
      accentLabel: 'محلل الرقم القومي المصري',
    },
  },
  {
    slug: 'network-speed-ip-inspector',
    category: 'digital',
    pillarId: 'pillar-media',
    engineType: 'network-speed-ip-inspector',
    badge: 'قياس الـ Ping + سرعة التحميل + حاسبة زمن تنزيل الملفات',
    trendingBadge: 'فحص الشبكة 🌐',
    trendingTag: 'drivers',
    title: 'فاحص سرعة الإنترنت والـ Ping وحاسبة زمن تحميل الملفات ومعلومات المتصفح',
    shortTitle: 'فاحص سرعة الإنترنت والـ Ping',
    subtitle: 'اختبر زمن الاستجابة (Ping ms)، سرعة الاتصال، واحسب الوقت اللازم لتحميل الملفات والألعاب بأي حجم جيجابايت',
    summary:
      'افحص جودة اتصالك بالإنترنت وزمن الاستجابة (Latency / Ping ms) الفعلي من متصفحك، مع حاسبة دقيقة لزمن تحميل الملفات الكبيرة بالـ GB حسب سرعة باقتك (Mbps)، وعرض شامل لمواصفات المتصفح والشاشة والنظام.',
    defaultParams: {
      connectionSpeedMbps: 30,
      downloadFileSizeGb: 15,
    },
    visualConfig: {
      theme: 'gold-digital',
      primarySymbol: 'PING ms',
      secondarySymbol: 'MBPS',
      accentLabel: 'فاحص سرعة الإنترنت والشبكة',
    },
  },
  {
    slug: 'mock-data-generator',
    category: 'digital',
    pillarId: 'pillar-media',
    engineType: 'mock-data-generator',
    badge: 'أسماء عربية + هواتف مصرية + محافظات · JSON / CSV / SQL',
    trendingBadge: 'للمبرمجين والـ QA 🗄️',
    trendingTag: 'merchants',
    title: 'مولد بيانات تجريبية عربية ومصرية للمطورين وقواعد البيانات (Mock Data Generator)',
    shortTitle: 'مولد بيانات تجريبية JSON / CSV / SQL',
    subtitle: 'ولّد حتى 100 سجل تجريبي بأسماء عربية، أرقام هواتف مصرية، محافظات، وإيميلات بصيغة JSON أو Excel CSV أو SQL',
    summary:
      'اختبر تطبيقاتك وقواعد بياناتك ببيانات عربية ومصرية واقعية بدلاً من النصوص الإنجليزية العشوائية: يولّد المحرك أسماء عربية ثلاثية، أرقام موبايل مصرية صحيحة الصيغة، محافظات، وظائف، ورواتب مع التصدير الفوري بصيغة JSON أو CSV أو SQL INSERT.',
    defaultParams: {
      rowsCount: 15,
      exportFormat: 'json',
      localeType: 'ar-EG',
    },
    visualConfig: {
      theme: 'gold-digital',
      primarySymbol: 'MOCK DB',
      secondarySymbol: 'JSON/SQL',
      accentLabel: 'مولد البيانات التجريبية',
    },
  },

  // --------------------------------------------------------------------------
  // سابعاً: أدوات التعليم، الأسرة، والإنتاجية اليومية (5 أدوات جديدة)
  // --------------------------------------------------------------------------
  {
    slug: 'thanaweya-percentage-calc',
    category: 'units',
    pillarId: 'pillar-daily',
    engineType: 'thanaweya-percentage-calc',
    badge: 'ثانوية عامة (410 أو 320 درجة) + أزهرية + دبلومات فنية',
    trendingBadge: 'للطلاب والأهالي 🎓',
    trendingTag: 'banks-gold',
    title: 'حاسبة مجموع ونسبة الثانوية العامة والأزهرية والدبلومات الفنية والشهادات المعادلة',
    shortTitle: 'حاسبة نسبة الثانوية العامة والشهادات',
    subtitle: 'احسب النسبة المئوية لمجموعك بدقة، وعدد الدرجات لكل 1%، والفرق عن تنسيق الكليات المستهدفة',
    summary:
      'حاسبة فورية لطلاب الثانوية العامة (نظام 410 درجات أو النظام المعدل 320 درجة)، الثانوية الأزهرية (650 درجة)، والدبلومات الفنية والشهادات المعادلة: تحسب النسبة المئوية الدقيقة والتقدير العام وكم تعادل الدرجة الواحدة في المجموع الكلي.',
    defaultParams: {
      studentScore: 365,
      maxTotalScore: 410,
      targetFacultyPercent: 90,
    },
    visualConfig: {
      theme: 'gold-unit',
      primarySymbol: '95.5%',
      secondarySymbol: '410 / 320',
      accentLabel: 'حاسبة نسبة الثانوية العامة',
    },
  },
  {
    slug: 'kids-worksheet-generator',
    category: 'documents',
    pillarId: 'pillar-documents',
    engineType: 'kids-worksheet-generator',
    badge: 'شيتات KG1 / KG2 / ابتدائي · جمع وطرح وحروف جاهزة للطباعة A4',
    trendingBadge: 'للأمهات والمعلمين 🌟',
    trendingTag: 'drivers',
    title: 'مولد شيتات تأسيس الأطفال والتمارين الحسابية والحروف الجاهزة للطباعة A4 PDF',
    shortTitle: 'مولد شيتات تأسيس وتمارين الأطفال PDF',
    subtitle: 'ولّد أوراق عمل تفاعلية بأسماء أطفالك في الجمع والطرح ومقارنة الأرقام وتلوين الحروف جاهزة للطباعة الفورية A4',
    summary:
      'استوديو تعليمي مجاني للأمهات والمعلمين والحضانات: اختر مستوى الطفل (KG1، KG2، أو الصفوف الابتدائية) ونوع التمرين (جمع، طرح، ضرب، مقارنة أكبر وأصغر، أو تدريب كتابة الحروف والأرقام) مع كتابة اسم الطفل أعلى الشيت وطباعة فورية A4 PDF مع نموذج الإجابة.',
    defaultParams: {
      childName: 'أحمد',
      gradeLevel: 'kg2',
      worksheetType: 'addition-subtraction',
      questionsCount: 12,
      maxNumberLimit: 20,
    },
    visualConfig: {
      theme: 'gold-document',
      primarySymbol: 'KG1·KG2',
      secondarySymbol: 'A4 KIDS',
      accentLabel: 'مولد شيتات تأسيس الأطفال',
    },
  },
  {
    slug: 'work-hours-overtime-calc',
    category: 'finance',
    pillarId: 'pillar-finance',
    engineType: 'work-hours-overtime-calc',
    badge: 'ساعات إضافية نهارية 1.35x وليلية 1.7x وعطلات 2x',
    trendingBadge: 'للموظفين و HR ⏱️',
    trendingTag: 'banks-gold',
    title: 'حاسبة ساعات العمل الإضافي (Overtime) والورديات والخصومات للموظفين والشركات',
    shortTitle: 'حاسبة ساعات العمل الإضافي والخصومات',
    subtitle: 'حساب قيمة ساعة العمل، أجر الساعات الإضافية النهارية والليلية وأيام الإجازات، وخصم دقائق التأخير',
    summary:
      'احسب مستحقاتك الشهرية من العمل الإضافي (Overtime) بدقة وفق قانون العمل: تحسب الأداة أجر الساعة الأساسي، مقابل الساعات الإضافية النهارية (135%) والليلية (170%) وأيام الراحة والعطلات الرسمية (200%)، وتخصم ساعات أو أيام الغياب والتأخير.',
    defaultParams: {
      baseMonthlySalaryEgp: 12000,
      workDaysPerMonth: 26,
      hoursPerDay: 8,
      dayOvertimeHours: 14,
      nightOvertimeHours: 6,
      holidayOvertimeDays: 2,
      lateDeductionHours: 2,
    },
    visualConfig: {
      theme: 'gold-finance',
      primarySymbol: 'OT 1.7X',
      secondarySymbol: 'HR PAY',
      accentLabel: 'حاسبة العمل الإضافي والورديات',
    },
  },
  {
    slug: 'sleep-hydration-calculator',
    category: 'units',
    pillarId: 'pillar-daily',
    engineType: 'sleep-hydration-calculator',
    badge: 'دورات النوم 90 دقيقة + لتر المياه اليومي + البروتين',
    trendingBadge: 'صحة ونشاط 💤',
    trendingTag: 'drivers',
    title: 'حاسبة دورات النوم الصحي (Sleep Cycles) واحتياج الجسم اليومي من المياه والبروتين',
    shortTitle: 'حاسبة دورات النوم والمياه والبروتين',
    subtitle: 'اعرف أفضل وقت للنوم أو الاستيقاظ بنشاط تام وفق دورات الـ 90 دقيقة مع حساب احتياجك اليومي من الماء والبروتين',
    summary:
      'استيقظ بكامل نشاطك دون خمول: تحسب الأداة مواعيد النوم والاستيقاظ المثالية بناءً على دورات النوم الفسيولوجية (90 دقيقة لكل دورة + 15 دقيقة للدخول في النوم)، وتحسب في نفس الشاشة كمية المياه باللتر والأكواب واحتياج البروتين اليومي حسب وزنك ومجهودك.',
    defaultParams: {
      wakeUpTime: '07:00',
      bodyWeightKg: 78,
      activityLevel: 'moderate',
      weatherSeason: 'summer',
    },
    visualConfig: {
      theme: 'gold-unit',
      primarySymbol: '90 MIN',
      secondarySymbol: 'H2O + PRO',
      accentLabel: 'دورات النوم والمياه اليومية',
    },
  },
  {
    slug: 'islamic-inheritance-udhiya-calc',
    category: 'gold',
    pillarId: 'pillar-finance',
    engineType: 'islamic-inheritance-udhiya-calc',
    badge: 'زكاة الفطر + فدية الصيام وكفارة اليمين + تقسيم أسهم الأضحية',
    trendingBadge: 'أحكام شرعية 🌙',
    trendingTag: 'banks-gold',
    title: 'حاسبة زكاة الفطر والكفارات وتقسيم أنصبة وأسهم الأضحية المشتركة',
    shortTitle: 'حاسبة زكاة الفطر والكفارات والأضحية',
    subtitle: 'حساب قيمة زكاة الفطر لأفراد الأسرة، فدية الصيام وكفارة اليمين، وتوزيع أسهم وأوزان الأضحية (سبع البقرة)',
    summary:
      'حاسبة شرعية ميسرة تجمع حساب زكاة الفطر نقداً أو بالكيلو والصاع لجميع أفراد الأسرة، حساب فدية إفطار المريض وكفارة اليمين، بالإضافة إلى منظم تقسيم الأضحية المشتركة (حتى 7 أسهم في البقرة أو الجمل) وحساب نصيب كل مشترك من اللحم الصافي وتوزيع الأثلاث.',
    defaultParams: {
      familyMembersCount: 5,
      zakatFitrPerPersonEgp: 35,
      fidyahPerDayEgp: 30,
      fastingMissedDays: 0,
      udhiyaTotalPriceEgp: 63000,
      udhiyaNetMeatKg: 175,
      udhiyaSharesCount: 7,
    },
    visualConfig: {
      theme: 'gold-bullion',
      primarySymbol: 'زكاة/أضحية',
      secondarySymbol: '1/7 سهم',
      accentLabel: 'زكاة الفطر وتقسيم الأضحية',
    },
  },

  // --------------------------------------------------------------------------
  // ثامناً: مولدات العقود والنماذج التجارية الإضافية الجاهزة للطباعة A4 PDF (6 أدوات جديدة)
  // --------------------------------------------------------------------------
  {
    slug: 'partnership-contract-generator',
    category: 'documents',
    pillarId: 'pillar-documents',
    engineType: 'partnership-contract-generator',
    badge: 'عقد شراكة تجارية كامل البنود + جاهز للطباعة A4 PDF',
    trendingBadge: 'الأكثر طلباً للشركات 🔥',
    trendingTag: 'merchants',
    title: 'مولد عقد شركة / شراكة تجارية رسمي بين طرفين أو أكثر (Partnership Contract A4)',
    shortTitle: 'مولد عقد شراكة تجارية رسمي A4',
    subtitle: 'صياغة قانونية شاملة لتوزيع رأس المال، الإدارة، نسب الأرباح والخسائر، التخارج، وفض النزاعات جاهز للطباعة PDF',
    summary:
      'أنشئ عقد شراكة تجارية أو مشروع مشترك محكم الصياغة القانونية في دقائق: يحدد العقد حصص كل شريك في رأس المال، مكافأة الإدارة، مواعيد توزيع الأرباح الدورية، ضوابط انسحاب أو دخول شريك جديد، والشرط الجزائي، جاهز للطباعة المباشرة على ورق A4.',
    defaultParams: {
      companyName: 'شركة النور للتجارة والتوريدات',
      businessActivity: 'تجارة وتوزيع الأجهزة الإلكترونية ومستلزماتها',
      totalCapitalEgp: 600000,
      partner1Name: 'أحمد محمود عبد الرحمن',
      partner1SharePercent: 60,
      partner2Name: 'محمد حسن إبراهيم',
      partner2SharePercent: 40,
      managerName: 'أحمد محمود عبد الرحمن',
      contractDurationYears: 5,
    },
    visualConfig: {
      theme: 'gold-document',
      primarySymbol: 'عقد شراكة',
      secondarySymbol: 'A4 PDF',
      accentLabel: 'مولد عقد شراكة تجارية',
    },
  },
  {
    slug: 'finishing-contract-generator',
    category: 'documents',
    pillarId: 'pillar-documents',
    engineType: 'finishing-contract-generator',
    badge: 'عقد تشطيب ومقاولات بالدفعات والشرط الجزائي A4 PDF',
    trendingBadge: 'مربوط بحاسبة التشطيب 🏗️',
    trendingTag: 'drivers',
    title: 'مولد عقد اتفاق تشطيب شقة ومقاولات بين المالك والمهندس أو المقاول (A4 PDF)',
    shortTitle: 'مولد عقد اتفاق تشطيب ومقاولات A4',
    subtitle: 'عقد هندسي مفصل بنظام النسبة الإشرافية أو المقطوعية يشمل جدول الدفعات والمواصفات والشرط الجزائي للتأخير',
    summary:
      'احفظ حقوق المالك والمهندس المنفذ بعقد اتفاق تشطيب شقة أو وحدة إدارية كامل البنود: يوضح مساحة وموقع العقار، نظام التعاقد (نسبة إشراف أو مقايسة شاملة)، جدول صرف الدفعات حسب مراحل الاستلام، فترة الضمان، وغرامة التأخير اليومية، جاهز للطباعة A4.',
    defaultParams: {
      ownerName: 'المهندس / طارق علي مصطفى',
      contractorName: 'مكتب دريم هوم للتشطيبات الهندسية',
      unitAddress: 'القاهرة الجديدة — التجمع الخامس — الحي الثالث',
      unitAreaSqm: 165,
      contractSystem: 'supervision-percent',
      totalEstimatedBudgetEgp: 750000,
      supervisionFeePercent: 12,
      executionDurationDays: 90,
      dailyDelayPenaltyEgp: 500,
    },
    visualConfig: {
      theme: 'gold-document',
      primarySymbol: 'عقد تشطيب',
      secondarySymbol: 'BOQ A4',
      accentLabel: 'مولد عقد تشطيب ومقاولات',
    },
  },
  {
    slug: 'employment-nda-generator',
    category: 'documents',
    pillarId: 'pillar-documents',
    engineType: 'employment-nda-generator',
    badge: 'عقد عمل موظف / فريلانسر + اتفاقية عدم إفشاء الأسرار NDA',
    trendingBadge: 'للشركات والفريلانسر 💼',
    trendingTag: 'merchants',
    title: 'مولد عقد عمل موظف أو فريلانسر واتفاقية سرية المعلومات وعدم المنافسة (Employment & NDA)',
    shortTitle: 'مولد عقد عمل واتفاقية سرية NDA',
    subtitle: 'إصدار عقد عمل رسمي أو عقد تنفيذ مشروع حر مدمج ببنود حماية أسرار العمل والملكية الفكرية جاهز للطباعة A4',
    summary:
      'صمّم عقد عمل احترافي لموظفي شركتك أو اتفاقية سرية معلومات (NDA) مع المستقلين والمطورين: يشمل المسمى الوظيفي، الراتب الأساسي والبدلات، فترة الاختبار (3 شهور)، ملكية الأكواد والتصميمات، والشرط الجزائي عند إفشاء بيانات العملاء، جاهز للطباعة A4 PDF.',
    defaultParams: {
      employerName: 'شركة ديكس للحلول الرقمية والتجارة',
      employeeName: 'كريم عادل المنشاوي',
      jobTitle: 'مدير تسويق رقمي ومشتري إعلانات',
      monthlySalaryEgp: 16000,
      probationMonths: 3,
      ndaPenaltyEgp: 100000,
      contractType: 'full-time-with-nda',
    },
    visualConfig: {
      theme: 'gold-document',
      primarySymbol: 'HR + NDA',
      secondarySymbol: 'A4 PDF',
      accentLabel: 'مولد عقد عمل و NDA',
    },
  },
  {
    slug: 'inventory-stock-sheet-maker',
    category: 'documents',
    pillarId: 'pillar-documents',
    engineType: 'inventory-stock-sheet-maker',
    badge: 'مطابقة الرصيد الدفتري والفعلي + طباعة A4 وتصدير Excel',
    trendingBadge: 'للمحلات والمخازن 📋',
    trendingTag: 'merchants',
    title: 'مولد كشف جرد المخازن والبضاعة وحساب العجز والزيادة (Inventory Stock Sheet)',
    shortTitle: 'مولد كشف جرد المخازن والبضاعة',
    subtitle: 'جدول جرد مخزني احترافي يحسب الرصيد الدفتري، الجرد الفعلي، العجز أو الزيادة، وقيمة البضاعة للطباعة أو Excel',
    summary:
      'أداة محاسبية ومخزنية جاهزة لأصحاب المحلات والصيدليات والمخازن والشركات: أدخل الأصناف والرصيد الدفتري والكمية الفعلية لفرز العجز أو الزيادة تلقائياً وحساب إجمالي تقييم المخزون بسعر التكلفة وسعر البيع، مع طباعة محضر جرد رسمي A4 أو تصديره لملف Excel.',
    defaultParams: {
      warehouseName: 'المخزن الرئيسي — فرع مدينة نصر',
      auditorName: 'محمود سعيد (أمين المخزن)',
    },
    visualConfig: {
      theme: 'gold-document',
      primarySymbol: 'STOCK',
      secondarySymbol: 'EXCEL/A4',
      accentLabel: 'كشف جرد المخازن والبضاعة',
    },
  },
  {
    slug: 'cash-voucher-receipt-maker',
    category: 'documents',
    pillarId: 'pillar-documents',
    engineType: 'cash-voucher-receipt-maker',
    badge: 'سند قبض / سند صرف / إقرار عهدة مع التفقيط بالحروف A4',
    trendingBadge: 'للمحاسبين والتجار 🧾',
    trendingTag: 'merchants',
    title: 'مولد سندات القبض والصرف النقدي وإقرار استلام العهدة بالتفقيط الآلي (A4 PDF)',
    shortTitle: 'مولد سندات القبض والصرف والعهدة',
    subtitle: 'أصدر سند قبض نقدي أو شيك أو سند صرف أو إقرار عهدة مالية مع كتابة المبلغ بالحروف العربية تلقائياً للطباعة',
    summary:
      'وداعاً لدفاتر الإيصالات الورقية التقليدية: أصدر سند قبض أو سند صرف نقدي/بنكي أو إقرار استلام عهدة مالية برقم تسلسلي، مع تحويل المبلغ تلقائياً إلى الحروف العربية القانونية («فقط وقدره... لا غير») وخانات توقيع المستلم والمحاسب والمدير المالي.',
    defaultParams: {
      voucherType: 'receipt-in',
      voucherNumber: 'RV-2026-1084',
      amountEgp: 45000,
      personName: 'شركة الأمل للتوريدات الهندسية',
      paymentMethod: 'نقداً بالخزينة',
      purposeText: 'دفعة تحت حساب توريد خامات ومستلزمات تشطيب وفق الفاتورة رقم 412',
    },
    visualConfig: {
      theme: 'gold-document',
      primarySymbol: 'سند مالي',
      secondarySymbol: 'تفقيط A4',
      accentLabel: 'مولد سندات القبض والصرف',
    },
  },
  {
    slug: 'weekly-planner-schedule-maker',
    category: 'documents',
    pillarId: 'pillar-documents',
    engineType: 'weekly-planner-schedule-maker',
    badge: 'جدول مذاكرة · جدول عمل · جدول تمارين جاهز للطباعة A4',
    trendingBadge: 'إنتاجية وتنظيم 📅',
    trendingTag: 'drivers',
    title: 'مصمم الجداول الأسبوعية (جدول مذاكرة، جدول مهام عمل، أو تمارين) جاهز للطباعة بالأسود والذهبي',
    shortTitle: 'مصمم الجداول الأسبوعية للطباعة A4',
    subtitle: 'صمّم جدولك الأسبوعي من السبت إلى الجمعة مع أهداف الأسبوع ومتتبع العادات اليومية واطبعه فوراً بتنسيق A4 فاخر',
    summary:
      'نظّم أسبوعك الدراسي أو المهني أو الرياضي بأعلى إنتاجية: اختر من القوالب الجاهزة (جدول مذاكرة ثانوية عامة وجامعة، جدول إدارة مهام الشركات، أو جدول تمارين وتغذية)، عدّل المواعيد والمهام، واطبع الجدول بتصميم فاخر على ورق A4.',
    defaultParams: {
      plannerPreset: 'study-schedule',
      ownerName: 'خطة الأسبوع الذهبية للإنجاز',
      topPriorityGoal: 'إتمام مراجعة الوحدات الأساسية وحل 5 اختبارات شاملة',
    },
    visualConfig: {
      theme: 'gold-document',
      primarySymbol: '7 DAYS',
      secondarySymbol: 'PLAN A4',
      accentLabel: 'مصمم الجداول الأسبوعية',
    },
  },
];

let _cachedMasterTools = null;
let _cachedSeoSubRoutes = null;
let _cachedAllTools = null;
let _cachedBySlugMap = null;

/**
 * Returns ALL Distinct Master Hub Tools (`isMasterTool: true`).
 * Used exclusively by the Homepage (`app/page.jsx`), Category grids, and Related Tools mesh!
 */
export function getMasterTools() {
  if (_cachedMasterTools) return _cachedMasterTools;

  _cachedMasterTools = RAW_MASTER_TOOLS_SPEC.map((spec) => {
    const catObj =
      MATRIX_CATEGORIES.find((c) => c.slug === spec.category) || MATRIX_CATEGORIES[0];
    return {
      ...spec,
      id: spec.slug,
      isMasterTool: true,
      isSubVariant: false,
      categoryName: catObj.name,
      icon: catObj.icon,
      metaTitle: `${spec.title} | ${SITE_CONFIG.shortName}`,
      metaDescription: spec.summary,
      keywords: [
        spec.shortTitle,
        spec.title,
        spec.subtitle,
        catObj.shortName,
        'حاسبة فورية مجانية',
        'منصة ديكس تولز',
        'Dix Tools',
      ],
      steps: [
        `اختر الإعدادات أو القوائم المنسدلة المطلوبة من واجهة «${spec.shortTitle}» الموحدة.`,
        `أدخل القيم الرقمية أو النصية ليتم الحساب والمعالجة لحظياً في أجزاء من الثانية من متصفحك.`,
        `انسخ النتيجة النهائية أو اطبع التقرير بصيغة A4 PDF أو شارك الرابط المجهز بالمتغيرات.`,
      ],
      features: [
        `أداة مركزية شاملة (Master Hub Tool) تغنيك عن التنقل بين عشرات الصفحات المكررة.`,
        `تعمل محلياً 100% داخل المتصفح بسرعة فائقة وخصوصية تامة للبيانات.`,
        `دعم قراءة المتغيرات تلقائياً من الرابط ومن المساعد الذكي (Smart Pre-fill).`,
      ],
      faqs: buildDynamicFaqs(
        spec.title,
        catObj.name,
        spec.summary,
        spec.subtitle
      ),
    };
  });

  return _cachedMasterTools;
}

/**
 * Generates the 6,363+ Background Programmatic SEO Sub-Routes (`isSubVariant: true`).
 * Hidden from main UI cards (`isSubVariant: true`), but active in `sitemap.js`
 * and direct search URL routing!
 */
export function getSeoSubRoutes() {
  if (_cachedSeoSubRoutes) return _cachedSeoSubRoutes;

  const subRoutes = [];

  // 1. Currency Pair & Amount Sub-Routes -> point to `comprehensive-currency-converter`
  const fxAmounts = [1, 50, 100, 500, 1000];
  for (const from of CURRENCY_LIST) {
    for (const to of CURRENCY_LIST) {
      if (from.code === to.code) continue;
      const pairRate = Number((from.rateToEgp / to.rateToEgp).toFixed(4));
      const baseSlug = `convert-${from.code.toLowerCase()}-to-${to.code.toLowerCase()}`;
      const title = `تحويل ${from.name} (${from.code}) إلى ${to.name} (${to.code}) اليوم`;
      const summary = `حاسبة تحويل ${from.name} (${from.code}) إلى ${to.name} (${to.code}) بسعر الصرف المحدث (${pairRate}) مع جدول المضاعفات التلقائي.`;

      subRoutes.push({
        id: baseSlug,
        slug: baseSlug,
        isMasterTool: false,
        isSubVariant: true,
        parentMasterSlug: 'comprehensive-currency-converter',
        category: 'currencies',
        categoryName: 'المال والعملات وأسعار الصرف',
        engineType: 'currency',
        icon: 'ArrowLeftRight',
        badge: `${from.code} ⇄ ${to.code}`,
        title,
        shortTitle: `تحويل ${from.short} إلى ${to.short}`,
        subtitle: `1 ${from.code} = ${pairRate} ${to.code}`,
        metaTitle: `${title} | محول العملات الشامل`,
        metaDescription: summary,
        summary,
        keywords: [`تحويل ${from.short} إلى ${to.short}`, `${from.code} to ${to.code}`],
        defaultParams: {
          fromCode: from.code,
          toCode: to.code,
          amount: 100,
          defaultRate: pairRate,
        },
        queryParams: { from: from.code, to: to.code, amount: 100 },
        visualConfig: {
          theme: 'gold-currency',
          primarySymbol: from.code,
          secondarySymbol: to.code,
          accentLabel: `1 ${from.code} = ${pairRate} ${to.code}`,
        },
        steps: [
          `تم ضبط العملة الأساسية تلقائياً على ${from.name} (${from.code}) والعملة المستهدفة على ${to.name} (${to.code}).`,
          `يمكنك تغيير المبلغ أو التبديل لأي عملة أخرى من القوائم المنسدلة داخل الأداة الشاملة.`,
        ],
        features: [`تحويل مباشر بين ${from.code} و ${to.code} مع جدول المضاعفات.`],
        faqs: buildDynamicFaqs(title, 'المال والعملات وأسعار الصرف', summary, `1 ${from.code} = ${pairRate} ${to.code}`),
      });
    }
  }

  for (const from of CURRENCY_LIST.slice(0, 12)) {
    for (const to of CURRENCY_LIST.slice(0, 6)) {
      if (from.code === to.code) continue;
      const pairRate = Number((from.rateToEgp / to.rateToEgp).toFixed(4));
      for (const amt of fxAmounts) {
        const slug = `convert-${amt}-${from.code.toLowerCase()}-to-${to.code.toLowerCase()}`;
        const convertedVal = Number((amt * pairRate).toFixed(2));
        const title = `كم يساوي ${amt} ${from.short} (${from.code}) بـ${to.name} (${to.code})؟`;
        const summary = `حساب تحويل مبلغ ${amt} ${from.name} إلى ${to.name} اليوم: النتيجة الفورية هي ${convertedVal} ${to.code}.`;
        subRoutes.push({
          id: slug,
          slug,
          isMasterTool: false,
          isSubVariant: true,
          parentMasterSlug: 'comprehensive-currency-converter',
          category: 'currencies',
          categoryName: 'المال والعملات وأسعار الصرف',
          engineType: 'currency',
          icon: 'ArrowLeftRight',
          badge: `${amt} ${from.code} ⇄ ${to.code}`,
          title,
          shortTitle: `${amt} ${from.short} كم ${to.short}`,
          subtitle: `${amt} ${from.code} = ${convertedVal} ${to.code}`,
          metaTitle: title,
          metaDescription: summary,
          summary,
          keywords: [`${amt} ${from.short} كم ${to.short}`],
          defaultParams: {
            fromCode: from.code,
            toCode: to.code,
            amount: amt,
            defaultRate: pairRate,
          },
          queryParams: { from: from.code, to: to.code, amount: amt },
          visualConfig: {
            theme: 'gold-currency',
            primarySymbol: `${amt} ${from.code}`,
            secondarySymbol: to.code,
            accentLabel: `${convertedVal} ${to.code}`,
          },
          steps: [`تم ضبط المبلغ تلقائياً على ${amt} ${from.code} مقابل ${to.code}.`],
          features: [`تحويل فوري لمبلغ ${amt} ${from.code}.`],
          faqs: buildDynamicFaqs(title, 'المال والعملات وأسعار الصرف', summary, `${amt} × ${pairRate}`),
        });
      }
    }
  }

  // 2. Gold Karat, Weight & Market Sub-Routes -> point to `comprehensive-gold-calculator` or `zakat-wealth-gold-calculator`
  for (const karat of GOLD_KARATS) {
    for (const weightObj of GOLD_WEIGHTS) {
      for (const market of GOLD_MARKETS) {
        for (const mode of GOLD_CALC_MODES) {
          const slug = `gold-${mode.id}-${karat.slug}-${weightObj.slug}-${market.slug}`;
          const title = `حاسبة ${mode.short} لوزن ${weightObj.label} ذهب ${karat.name} في ${market.country}`;
          const summary = `احسب بدقة ${mode.name} لوزن ${weightObj.label} من الذهب ${karat.name} في سوق ${market.country} (${market.currency}).`;
          subRoutes.push({
            id: slug,
            slug,
            isMasterTool: false,
            isSubVariant: true,
            parentMasterSlug:
              mode.id === 'zakat-check'
                ? 'zakat-wealth-gold-calculator'
                : 'comprehensive-gold-calculator',
            category: 'gold',
            categoryName: 'الذهب والسبائك والزكاة والمواريث',
            engineType: 'gold',
            icon: 'Gem',
            badge: `عيار ${karat.karat} · ${weightObj.weight} جم`,
            title,
            shortTitle: `${mode.short}: ${weightObj.weight} جم عيار ${karat.karat} (${market.country})`,
            subtitle: `${market.country} (${market.currency})`,
            metaTitle: title,
            metaDescription: summary,
            summary,
            keywords: [`سعر ${weightObj.weight} جرام ذهب عيار ${karat.karat} في ${market.country}`],
            defaultParams: {
              calcMode: mode.id,
              selectedKarat: karat.karat,
              weightGrams: weightObj.weight,
              workmanshipPerGram: karat.workmanshipDefault,
              cashbackPercent: weightObj.cashback,
              baseKarat21Price: market.base21Price,
              currencySymbol: market.currency,
              countryName: market.country,
            },
            queryParams: {
              karat: karat.karat,
              weight: weightObj.weight,
              market: market.code,
              mode: mode.id,
            },
            visualConfig: {
              theme: 'gold-bullion',
              primarySymbol: `${karat.karat}K`,
              secondarySymbol: `${weightObj.weight}g`,
              accentLabel: `${market.country}`,
            },
            steps: [`تم ضبط العيار على ${karat.karat} والوزن على ${weightObj.weight} جم تلقائياً.`],
            features: [`حساب فوري لوزن ${weightObj.weight} جم عيار ${karat.karat}.`],
            faqs: buildDynamicFaqs(title, 'الذهب والسبائك والزكاة والمواريث', summary, `${weightObj.weight}g × ${karat.karat}K`),
          });
        }
      }
    }
  }

  // 3. Unit Conversion Sub-Routes -> point to `agricultural-land-area-converter` or `comprehensive-units-converter`
  const unitValues = [1, 5, 10, 50, 100];
  for (const family of UNIT_FAMILIES) {
    for (const fromU of family.units) {
      for (const toU of family.units) {
        if (fromU.id === toU.id) continue;
        for (const val of unitValues) {
          const slug =
            val === 1
              ? `unit-${family.familyId}-${fromU.id}-to-${toU.id}`
              : `unit-${family.familyId}-${val}-${fromU.id}-to-${toU.id}`;
          const factor = Number(((fromU.factorToBase * val) / toU.factorToBase).toFixed(4));
          const title = `تحويل ${val} ${fromU.name} إلى ${toU.name}`;
          const summary = `حاسبة تحويل ${val} ${fromU.name} إلى ${toU.name} (${val} ${fromU.name} = ${factor} ${toU.name}).`;
          subRoutes.push({
            id: slug,
            slug,
            isMasterTool: false,
            isSubVariant: true,
            parentMasterSlug:
              family.familyId === 'area'
                ? 'agricultural-land-area-converter'
                : 'comprehensive-units-converter',
            category: 'units',
            categoryName: 'المساحات والقياسات والحاسبات اليومية',
            engineType: 'unit',
            icon: 'Scale',
            badge: `${fromU.id} ⇄ ${toU.id}`,
            title,
            shortTitle: `تحويل ${val > 1 ? val + ' ' : ''}${fromU.name.split(' ')[0]} إلى ${toU.name.split(' ')[0]}`,
            subtitle: `${val} ${fromU.name} = ${factor} ${toU.name}`,
            metaTitle: title,
            metaDescription: summary,
            summary,
            keywords: [title],
            defaultParams: {
              familyId: family.familyId,
              fromUnitId: fromU.id,
              toUnitId: toU.id,
              inputValue: val,
            },
            queryParams: { family: family.familyId, from: fromU.id, to: toU.id, val },
            visualConfig: {
              theme: 'gold-unit',
              primarySymbol: fromU.id.toUpperCase(),
              secondarySymbol: toU.id.toUpperCase(),
              accentLabel: `${val} = ${factor}`,
            },
            steps: [`تم ضبط التحويل تلقائياً من ${fromU.name} إلى ${toU.name}.`],
            features: [`تحويل قياسي فوري.`],
            faqs: buildDynamicFaqs(title, family.familyName, summary, `${val} × ${factor}`),
          });
        }
      }
    }
  }

  // 4. Finance Loans & Certificates Sub-Routes -> point to `bank-loan-installment-calculator` or `bank-certificates-profit-calculator`
  const loanTypes = [
    { id: 'loan-personal-dec', mode: 'loan', name: 'قرض شخصي متناقص', rate: 22.5, interestType: 'declining' },
    { id: 'loan-car', mode: 'loan', name: 'قرض سيارة', rate: 21.0, interestType: 'declining' },
    { id: 'cert-annual', mode: 'certificate', name: 'شهادة بنكية 27%', rate: 27.0, interestType: 'flat' },
    { id: 'cert-high', mode: 'certificate', name: 'شهادة ادخار 30%', rate: 30.0, interestType: 'flat' },
  ];
  const finAmounts = [50000, 100000, 200000, 300000, 500000, 1000000];
  const finTenures = [12, 24, 36, 60, 84];

  for (const fType of loanTypes) {
    for (const amt of finAmounts) {
      for (const months of finTenures) {
        const slug = `finance-${fType.id}-${amt / 1000}k-${months / 12}-years`;
        const title = `حاسبة ${fType.name} بمبلغ ${amt.toLocaleString('en-US')} جنيه لمدة ${months} شهر`;
        const summary = `احسب القسط أو العائد الشهري لـ ${fType.name} بمبلغ ${amt.toLocaleString('en-US')} ج.م بفائدة ${fType.rate}%.`;
        subRoutes.push({
          id: slug,
          slug,
          isMasterTool: false,
          isSubVariant: true,
          parentMasterSlug:
            fType.mode === 'certificate'
              ? 'bank-certificates-profit-calculator'
              : 'bank-loan-installment-calculator',
          category: 'finance',
          categoryName: 'البنوك والقروض والشهادات والتجارة',
          engineType: 'finance',
          icon: 'Landmark',
          badge: `${amt / 1000}K · ${fType.rate}%`,
          title,
          shortTitle: `${fType.name} (${amt / 1000} ألف)`,
          subtitle: `مدة ${months} شهر · ${fType.rate}%`,
          metaTitle: title,
          metaDescription: summary,
          summary,
          keywords: [title],
          defaultParams: {
            mode: fType.mode,
            principalAmount: amt,
            annualRate: fType.rate,
            durationMonths: months,
            interestType: fType.interestType,
          },
          queryParams: { mode: fType.mode, amount: amt, rate: fType.rate, months },
          visualConfig: {
            theme: 'gold-finance',
            primarySymbol: `${fType.rate}%`,
            secondarySymbol: `${amt / 1000}K`,
            accentLabel: fType.name,
          },
          steps: [`تم ضبط المبلغ على ${amt.toLocaleString('en-US')} ج.م والمدة على ${months} شهراً.`],
          features: [`حساب فوري للأقساط والعوائد.`],
          faqs: buildDynamicFaqs(title, 'البنوك والقروض والشهادات والتجارة', summary, `${amt} @ ${fType.rate}%`),
        });
      }
    }
  }

  // 5. Fuel & Trip Distance Background SEO Sub-Routes -> point to `fuel-trip-cost-calculator`
  const vehicles = [
    { id: 'sedan-eco', name: 'سيارة سيدان اقتصادية', lPer100: 6.5 },
    { id: 'sedan-mid', name: 'سيارة سيدان متوسطة', lPer100: 8.2 },
    { id: 'suv', name: 'سيارة SUV دفع رباعي', lPer100: 10.8 },
    { id: 'motorcycle', name: 'موتوسيكل / دراجة نارية', lPer100: 3.1 },
    { id: 'microbus', name: 'ميكروباص / فان تجاري', lPer100: 12.5 },
  ];
  const distances = [20, 35, 50, 75, 100, 140, 180, 220, 280, 350, 450, 550, 700, 900];
  for (const v of vehicles) {
    for (const d of distances) {
      for (const f of FUEL_GRADES) {
        const slug = `fuel-${v.id}-${d}km-${f.id}`;
        const title = `حاسبة تكلفة بنزين مشوار ${d} كم لـ ${v.name} (${f.name})`;
        const summary = `احسب عدد اللترات وتكلفة الوقود لمسافة ${d} كم (ذهاب وعودة) لـ ${v.name} باستخدام ${f.name}.`;
        subRoutes.push({
          id: slug,
          slug,
          isMasterTool: false,
          isSubVariant: true,
          parentMasterSlug: 'fuel-trip-cost-calculator',
          category: 'automotive',
          categoryName: 'السيارات والوقود وفواتير المرافق',
          engineType: 'energy',
          icon: 'Fuel',
          badge: `${d} كم · ${f.name}`,
          title,
          shortTitle: `مشوار ${d} كم (${v.name})`,
          subtitle: `${f.name} (${f.price} ج.م/لتر)`,
          metaTitle: title,
          metaDescription: summary,
          summary,
          keywords: [title],
          defaultParams: {
            energyMode: 'fuel',
            distanceKm: d,
            isRoundTrip: true,
            consumptionPer100Km: v.lPer100,
            fuelPricePerLiter: f.price,
          },
          queryParams: { distance: d, fuelPrice: f.price },
          visualConfig: {
            theme: 'gold-energy',
            primarySymbol: `${d} KM`,
            secondarySymbol: 'FUEL',
            accentLabel: v.name,
          },
          steps: [`تم ضبط المسافة على ${d} كم ومعدل الاستهلاك على ${v.lPer100} لتر/100كم.`],
          features: [`حساب فوري لتكلفة المشوار.`],
          faqs: buildDynamicFaqs(title, 'السيارات والوقود وفواتير المرافق', summary, `${d} km`),
        });
      }
    }
  }

  // 6. Official Documents & Contracts across Arab Jurisdictions -> point to parent document Master Tools
  const docTemplates = [
    { id: 'car-sale', parent: 'vehicle-motorcycle-sale-contract', docType: 'car-sale', name: 'عقد بيع سيارة ابتدائي' },
    { id: 'moto-sale', parent: 'vehicle-motorcycle-sale-contract', docType: 'car-sale', name: 'عقد بيع موتوسيكل' },
    { id: 'apt-lease', parent: 'apartment-commercial-lease-contract', docType: 'lease', name: 'عقد إيجار شقة سكنية' },
    { id: 'shop-lease', parent: 'apartment-commercial-lease-contract', docType: 'lease', name: 'عقد إيجار محل تجاري' },
    { id: 'tax-invoice', parent: 'tax-sales-invoice-generator', docType: 'invoice', name: 'فاتورة مبيعات ضريبية' },
    { id: 'cash-receipt', parent: 'cash-receipt-clearance-generator', docType: 'receipt', name: 'إيصال استلام نقدية' },
    { id: 'salary-slip', parent: 'salary-slip-hr-generator', docType: 'salary-slip', name: 'بيان مفردات مرتب' },
    { id: 'ats-cv', parent: 'ats-resume-cv-builder', docType: 'ats-cv', name: 'نموذج سيرة ذاتية ATS' },
  ];
  const jurisdictions = [
    { id: 'cairo', name: 'القاهرة' },
    { id: 'giza', name: 'الجيزة' },
    { id: 'alex', name: 'الإسكندرية' },
    { id: 'mansoura', name: 'المنصورة' },
    { id: 'tanta', name: 'طنطا' },
    { id: 'asyut', name: 'أسيوط' },
    { id: 'riyadh', name: 'الرياض' },
    { id: 'jeddah', name: 'جدة' },
    { id: 'dubai', name: 'دبي' },
    { id: 'kuwait', name: 'الكويت' },
    { id: 'doha', name: 'الدوحة' },
    { id: 'amman', name: 'عمّان' },
  ];
  const payModes = [
    { id: 'cash', name: 'نقداً بالكامل' },
    { id: 'installments', name: 'بالتقسيط' },
    { id: 'bank-transfer', name: 'بتحويل بنكي' },
    { id: 'cheque', name: 'بشيك مصرفي' },
  ];

  for (const tpl of docTemplates) {
    for (const jur of jurisdictions) {
      for (const pm of payModes) {
        const slug = `doc-${tpl.id}-${jur.id}-${pm.id}`;
        const title = `نموذج ${tpl.name} (${jur.name}) — ${pm.name} جاهز للطباعة PDF`;
        const summary = `حرر واطبع فوراً ${tpl.name} المعتمد في (${jur.name}) بنظام الدفع (${pm.name}) بتنسيق ورق A4.`;
        subRoutes.push({
          id: slug,
          slug,
          isMasterTool: false,
          isSubVariant: true,
          parentMasterSlug: tpl.parent,
          category: 'documents',
          categoryName: 'مولدات العقود الرسمية والفواتير والـ CV',
          engineType: 'document',
          icon: 'FileSignature',
          badge: `A4 PDF · ${jur.name}`,
          title,
          shortTitle: `${tpl.name} (${jur.name})`,
          subtitle: `${pm.name} · جاهز للطباعة A4`,
          metaTitle: title,
          metaDescription: summary,
          summary,
          keywords: [title],
          defaultParams: {
            docType: tpl.docType,
            templateTitle: `${tpl.name} (${pm.name})`,
            governorate: jur.name,
          },
          queryParams: { doc: tpl.docType, gov: jur.name },
          visualConfig: {
            theme: 'gold-document',
            primarySymbol: 'A4 PDF',
            secondarySymbol: jur.id.toUpperCase(),
            accentLabel: tpl.name,
          },
          steps: [`تم ضبط القالب تلقائياً على ${tpl.name} (${jur.name}).`],
          features: [`طباعة فورية على ورق A4.`],
          faqs: buildDynamicFaqs(title, 'مولدات العقود الرسمية والفواتير والـ CV', summary, 'A4 PDF'),
        });
      }
    }
  }

  // 7. Image & Tafqeet Background SEO Sub-Routes -> point to `comprehensive-image-studio` and `arabic-number-to-words-tafqeet`
  const imgSources = ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'heic', 'tiff', 'gif'];
  const imgTargets = [
    { ext: 'webp', mime: 'image/webp' },
    { ext: 'jpg', mime: 'image/jpeg' },
    { ext: 'png', mime: 'image/png' },
  ];
  const imgPresets = [
    { id: 'gov-200kb', w: 800, q: 75, name: 'أقل من 200 كيلوبايت للتقديمات' },
    { id: 'social-1080', w: 1080, q: 85, name: 'مقاس سوشيال ميديا 1080px' },
    { id: 'web-seo', w: 1200, q: 82, name: 'ضغط فائق لتسريع المواقع' },
    { id: 'hd-1920', w: 1920, q: 90, name: 'جودة عالية Full HD' },
    { id: 'thumb-512', w: 512, q: 80, name: 'صورة مصغرة 512px' },
    { id: 'print-2400', w: 2400, q: 92, name: 'جودة طباعة 2400px' },
  ];

  for (const s of imgSources) {
    for (const t of imgTargets) {
      for (const p of imgPresets) {
        const slug = `image-${s}-to-${t.ext}-${p.id}`;
        const title = `تحويل صور ${s.toUpperCase()} إلى ${t.ext.toUpperCase()} (${p.name})`;
        const summary = `أداة تحويل وضغط الصور من ${s.toUpperCase()} إلى ${t.ext.toUpperCase()} بإعداد (${p.name}) محلياً 100% من المتصفح.`;
        subRoutes.push({
          id: slug,
          slug,
          isMasterTool: false,
          isSubVariant: true,
          parentMasterSlug: 'comprehensive-image-studio',
          category: 'images',
          categoryName: 'استوديو الصور والـ PDF والسوشيال ميديا',
          engineType: 'image',
          icon: 'ImageDown',
          badge: `${s.toUpperCase()} → ${t.ext.toUpperCase()}`,
          title,
          shortTitle: `تحويل ${s.toUpperCase()} إلى ${t.ext.toUpperCase()}`,
          subtitle: p.name,
          metaTitle: title,
          metaDescription: summary,
          summary,
          keywords: [title],
          defaultParams: {
            targetFormatMime: t.mime,
            quality: p.q,
            maxWidth: p.w,
          },
          queryParams: { format: t.ext, quality: p.q, width: p.w },
          visualConfig: {
            theme: 'gold-image',
            primarySymbol: s.toUpperCase(),
            secondarySymbol: t.ext.toUpperCase(),
            accentLabel: p.name,
          },
          steps: [`ارفع صورتك بصيغة ${s.toUpperCase()} لتحويلها فوراً إلى ${t.ext.toUpperCase()}.`],
          features: [`معالجة محلية عبر HTML5 Canvas.`],
          faqs: buildDynamicFaqs(title, 'استوديو الصور والـ PDF والسوشيال ميديا', summary, `${p.w}px`),
        });
      }
    }
  }

  _cachedSeoSubRoutes = subRoutes;
  return _cachedSeoSubRoutes;
}

/**
 * Returns ALL routes (52 Master Tools + 6,363+ Background SEO Sub-Routes)
 * Used by `app/sitemap.js` and `generateStaticParams()`.
 */
export function getAllMatrixTools() {
  if (_cachedAllTools) return _cachedAllTools;

  const masters = getMasterTools();
  const subs = getSeoSubRoutes();
  _cachedAllTools = [...masters, ...subs];

  _cachedBySlugMap = new Map();
  for (const t of _cachedAllTools) {
    _cachedBySlugMap.set(t.slug, t);
  }
  const fuelMaster = _cachedBySlugMap.get('fuel-trip-cost-calculator');
  if (fuelMaster) {
    _cachedBySlugMap.set('trip-fuel-cost-calculator', fuelMaster);
  }

  return _cachedAllTools;
}

/**
 * Resolves a tool by slug.
 * If the slug is a background SEO sub-route (`isSubVariant: true`), it returns
 * the sub-route merged with its parent Master Tool engine configuration!
 */
export function getToolBySlug(category, slug) {
  if (!_cachedBySlugMap) {
    getAllMatrixTools();
  }
  const found = _cachedBySlugMap.get(slug);
  if (found) {
    return found;
  }
  const masters = getMasterTools();
  if (category) {
    const byCat = masters.find((m) => m.category === category);
    if (byCat) return byCat;
  }
  return masters[0];
}

/**
 * Returns statistics for both the 52 Distinct Master Tools (displayed in UI)
 * and the total background SEO routes (indexed in Sitemap).
 */
export function getMatrixStats() {
  const masters = getMasterTools();
  const all = getAllMatrixTools();

  const masterByCategory = {};
  const totalByCategory = {};

  for (const cat of MATRIX_CATEGORIES) {
    masterByCategory[cat.slug] = 0;
    totalByCategory[cat.slug] = 0;
  }

  for (const m of masters) {
    masterByCategory[m.category] = (masterByCategory[m.category] || 0) + 1;
  }

  for (const t of all) {
    totalByCategory[t.category] = (totalByCategory[t.category] || 0) + 1;
  }

  return {
    masterToolsCount: masters.length,
    seoSubRoutesCount: all.length - masters.length,
    totalCount: all.length,
    byCategory: masterByCategory,
    seoByCategory: totalByCategory,
  };
}

/**
 * Returns ONLY distinct Master Tools for the "أدوات ذات صلة" sidebar mesh
 * so the user NEVER sees repetitive sub-variants in Related Tools!
 */
export function getRelatedMatrixTools(currentTool, limit = 6) {
  const masters = getMasterTools();
  if (!currentTool) return masters.slice(0, limit);

  const sameCatMasters = masters.filter(
    (t) => t.category === currentTool.category && t.slug !== currentTool.slug
  );
  const otherMasters = masters.filter((t) => t.category !== currentTool.category);

  return [...sameCatMasters, ...otherMasters].slice(0, limit);
}

/**
 * Returns a compact list of 10 popular Background SEO Quick Presets
 * to display ONLY in the quiet footer at the bottom of a Master Tool page
 * ("تحويلات وإعدادات سريعة شائعة").
 */
export function getQuickSubRoutesForMaster(tool) {
  if (!tool) return [];
  const targetMasterSlug = tool.isSubVariant ? tool.parentMasterSlug : tool.slug;

  if (targetMasterSlug === 'comprehensive-currency-converter' || tool.engineType === 'currency') {
    return [
      { label: 'USD ⇄ EGP (دولار إلى جنيه)', slug: 'convert-usd-to-egp', category: 'currencies', params: { fromCode: 'USD', toCode: 'EGP', amount: 100 } },
      { label: 'SAR ⇄ EGP (ريال إلى جنيه)', slug: 'convert-sar-to-egp', category: 'currencies', params: { fromCode: 'SAR', toCode: 'EGP', amount: 100 } },
      { label: 'KWD ⇄ EGP (دينار كويتي إلى جنيه)', slug: 'convert-kwd-to-egp', category: 'currencies', params: { fromCode: 'KWD', toCode: 'EGP', amount: 100 } },
      { label: 'AED ⇄ EGP (درهم إلى جنيه)', slug: 'convert-aed-to-egp', category: 'currencies', params: { fromCode: 'AED', toCode: 'EGP', amount: 100 } },
      { label: 'EUR ⇄ EGP (يورو إلى جنيه)', slug: 'convert-eur-to-egp', category: 'currencies', params: { fromCode: 'EUR', toCode: 'EGP', amount: 100 } },
      { label: 'USD ⇄ SAR (دولار إلى ريال)', slug: 'convert-usd-to-sar', category: 'currencies', params: { fromCode: 'USD', toCode: 'SAR', amount: 100 } },
      { label: 'GBP ⇄ EGP (إسترليني إلى جنيه)', slug: 'convert-gbp-to-egp', category: 'currencies', params: { fromCode: 'GBP', toCode: 'EGP', amount: 100 } },
      { label: '100 USD ⇄ EGP', slug: 'convert-100-usd-to-egp', category: 'currencies', params: { fromCode: 'USD', toCode: 'EGP', amount: 100 } },
    ];
  }

  if (tool.engineType === 'gold') {
    return [
      { label: 'جنيه ذهب 8 جم عيار 21 (مصر)', slug: 'gold-buy-workmanship-21k-8-gram-coin-egypt', category: 'gold', params: { selectedKarat: 21, weightGrams: 8, currencySymbol: 'ج.م', baseKarat21Price: 3780 } },
      { label: 'سبيكة 10 جم عيار 24 (مصر)', slug: 'gold-buy-workmanship-24k-10-gram-egypt', category: 'gold', params: { selectedKarat: 24, weightGrams: 10, currencySymbol: 'ج.م', baseKarat21Price: 3780 } },
      { label: 'أونصة ذهب 31.1 جم عيار 24', slug: 'gold-buy-workmanship-24k-31-1-ounce-egypt', category: 'gold', params: { selectedKarat: 24, weightGrams: 31.1, currencySymbol: 'ج.م', baseKarat21Price: 3780 } },
      { label: 'زكاة 85 جم ذهب عيار 24 (النصاب)', slug: 'gold-zakat-check-24k-85-gram-nisab-egypt', category: 'gold', params: { calcMode: 'zakat-check', selectedKarat: 24, weightGrams: 85, currencySymbol: 'ج.م', baseKarat21Price: 3780 } },
      { label: 'سبيكة 5 جم عيار 24 (السعودية)', slug: 'gold-buy-workmanship-24k-5-gram-saudi', category: 'gold', params: { selectedKarat: 24, weightGrams: 5, currencySymbol: 'ر.س', baseKarat21Price: 293 } },
      { label: 'شبكة 20 جم عيار 18 بالمصنعية', slug: 'gold-buy-workmanship-18k-20-gram-egypt', category: 'gold', params: { selectedKarat: 18, weightGrams: 20, currencySymbol: 'ج.م', baseKarat21Price: 3780 } },
    ];
  }

  if (tool.engineType === 'unit') {
    return [
      { label: 'فدان ⇄ متر مربع (م²)', slug: 'unit-area-feddan-to-sqm', category: 'units', params: { familyId: 'area', fromUnitId: 'feddan', toUnitId: 'sqm', inputValue: 1 } },
      { label: 'قيراط ⇄ متر مربع (م²)', slug: 'unit-area-qirat-to-sqm', category: 'units', params: { familyId: 'area', fromUnitId: 'qirat', toUnitId: 'sqm', inputValue: 1 } },
      { label: 'فدان ⇄ قيراط أراضي', slug: 'unit-area-feddan-to-qirat', category: 'units', params: { familyId: 'area', fromUnitId: 'feddan', toUnitId: 'qirat', inputValue: 1 } },
      { label: 'ميل بري ⇄ كيلومتر', slug: 'unit-length-mile-to-km', category: 'units', params: { familyId: 'length', fromUnitId: 'mile', toUnitId: 'km', inputValue: 1 } },
      { label: 'رطل (lb) ⇄ كيلوجرام', slug: 'unit-weight-pound-to-kg', category: 'units', params: { familyId: 'weight', fromUnitId: 'pound', toUnitId: 'kg', inputValue: 1 } },
      { label: 'أونصة تروي ⇄ جرام', slug: 'unit-weight-ounce-troy-to-gram', category: 'units', params: { familyId: 'weight', fromUnitId: 'ounce-troy', toUnitId: 'gram', inputValue: 1 } },
    ];
  }

  if (tool.engineType === 'finance') {
    return [
      { label: 'شهادة 200 ألف جنيه (27%)', slug: 'finance-cert-annual-200k-3-years', category: 'finance', params: { mode: 'certificate', principalAmount: 200000, annualRate: 27, durationMonths: 36 } },
      { label: 'شهادة 500 ألف جنيه (30%)', slug: 'finance-cert-high-500k-3-years', category: 'finance', params: { mode: 'certificate', principalAmount: 500000, annualRate: 30, durationMonths: 36 } },
      { label: 'قرض شخصي 300 ألف (3 سنوات)', slug: 'finance-loan-personal-dec-300k-3-years', category: 'finance', params: { mode: 'loan', principalAmount: 300000, annualRate: 22.5, durationMonths: 36 } },
      { label: 'قرض سيارة 500 ألف (5 سنوات)', slug: 'finance-loan-car-500k-5-years', category: 'finance', params: { mode: 'loan', principalAmount: 500000, annualRate: 21, durationMonths: 60 } },
    ];
  }

  return [];
}
