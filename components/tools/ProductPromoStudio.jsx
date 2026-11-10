'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Upload,
  Download,
  Printer,
  Share2,
  ZoomIn,
  ZoomOut,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  FlipHorizontal,
  RotateCcw,
  Sparkles,
  Award,
  Tag,
  Layers,
  Check,
  Image as ImageIcon,
  ShieldCheck,
  Wand2,
  Phone,
  Store,
} from 'lucide-react';
import AdSlot from '../AdSlot';
import { useSiteConfig } from '../../context/SiteConfigContext';

/* ============================================================================
 * 1. TEMPLATES GALLERY SPECIFICATION (16 DISTINCT COMMERCIAL TEMPLATES)
 * ========================================================================== */
export const PROMO_STUDIO_TEMPLATES = [
  {
    id: 'luxury-black-gold',
    number: 1,
    name: 'قالب الفخامة الأسود والذهبي',
    shortName: 'الفخامة الأسود والذهبي',
    subtitle: 'خلفية داكنة مع إطار ذهبي مزدوج وإضاءة خلفية دافئة تحت المنتج',
    badgeDefault: 'عرض ملكي خاص',
    previewBg: 'linear-gradient(135deg, #0A0A0A 0%, #2A2008 55%, #D4AF37 100%)',
    accentHex: '#D4AF37',
    secondaryHex: '#F3E5AB',
    ribbonDefault: 'royal-gold',
    stampDefault: 'أصلي 100%',
  },
  {
    id: 'white-friday-mega',
    number: 2,
    name: 'قالب الجمعة البيضاء العظمى',
    shortName: 'الجمعة البيضاء 🔥',
    subtitle: 'خلفية سوداء وحمراء نارية مع شارة White Friday وخصم ضخم',
    badgeDefault: 'الجمعة البيضاء',
    previewBg: 'linear-gradient(135deg, #09090B 0%, #7F1D1D 55%, #EF4444 100%)',
    accentHex: '#EF4444',
    secondaryHex: '#FEF08A',
    ribbonDefault: 'fire-red',
    stampDefault: 'الكمية محدودة',
  },
  {
    id: 'okazion-clearance',
    number: 3,
    name: 'أوكازيون الموسم والتصفيات',
    shortName: 'أوكازيون وتصفيات',
    subtitle: 'تصميم تجاري خاطف للنظر بالأصفر والأحمر القوي لعروض التصفية',
    badgeDefault: 'أوكازيون التصفية',
    previewBg: 'linear-gradient(135deg, #991B1B 0%, #DC2626 50%, #FACC15 100%)',
    accentHex: '#FACC15',
    secondaryHex: '#FFFFFF',
    ribbonDefault: 'fire-red',
    stampDefault: 'الكمية محدودة',
  },
  {
    id: 'ramadan-eid-special',
    number: 4,
    name: 'عروض رمضان والأعياد والمناسبات',
    shortName: 'عروض رمضان والعيد 🌙',
    subtitle: 'زخارف إسلامية ذهبية، هلال، وفوانيس مضيئة',
    badgeDefault: 'عرض الموسم المبارك',
    previewBg: 'linear-gradient(135deg, #061A14 0%, #064E3B 55%, #D4AF37 100%)',
    accentHex: '#D4AF37',
    secondaryHex: '#A7F3D0',
    ribbonDefault: 'royal-gold',
    stampDefault: 'شحن مجاني ⚡',
  },
  {
    id: 'cyber-neon-tech',
    number: 5,
    name: 'نيون العروض والإلكترونيات (Cyber/Neon)',
    shortName: 'سايبر نيون للإلكترونيات',
    subtitle: 'إطار متوهج بالبنفسجي والأزرق النيون مثالي للموبايلات والإكسسوارات',
    badgeDefault: 'أقوى عرض تقني ⚡',
    previewBg: 'linear-gradient(135deg, #090514 0%, #3B0764 50%, #06B6D4 100%)',
    accentHex: '#22D3EE',
    secondaryHex: '#E879F9',
    ribbonDefault: 'luxury-black',
    stampDefault: 'أصلي 100%',
  },
  {
    id: 'vip-exclusive-card',
    number: 6,
    name: 'بطاقة الـ VIP والصفوة',
    shortName: 'بطاقة VIP الملكية 👑',
    subtitle: 'تاج ذهبي ملكي وخطوط كلاسيكية للمنتجات الفاخرة والساعات والعطور',
    badgeDefault: 'إصدار VIP حصري',
    previewBg: 'linear-gradient(135deg, #050505 0%, #1C1917 60%, #CA8A04 100%)',
    accentHex: '#EAB308',
    secondaryHex: '#FEF9C3',
    ribbonDefault: 'royal-gold',
    stampDefault: 'أصلي 100%',
  },
  {
    id: 'flash-sale-timer',
    number: 7,
    name: 'فلاش سيل وساعة الحسم (Flash Sale)',
    shortName: 'فلاش سيل 00:59 ⏱',
    subtitle: 'يرسم عداد وقت تنازلي بصري 00:59 مع شريط ينتهي العرض اليوم',
    badgeDefault: 'ينتهي العرض اليوم!',
    previewBg: 'linear-gradient(135deg, #111827 0%, #7C2D12 50%, #F97316 100%)',
    accentHex: '#FB923C',
    secondaryHex: '#FDE047',
    ribbonDefault: 'fire-red',
    stampDefault: 'الكمية محدودة',
  },
  {
    id: 'bundle-bogo-offer',
    number: 8,
    name: 'عرض القطعتين والثالثة هدية / البكج التوفيري',
    shortName: 'عرض البكج 2+1 هدية 🎁',
    subtitle: 'مصمم لعروض المجموعات والبكجات مع إبراز قيمة التوفير',
    badgeDefault: 'بكج التوفير العملاق',
    previewBg: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 55%, #F59E0B 100%)',
    accentHex: '#FBBF24',
    secondaryHex: '#93C5FD',
    ribbonDefault: 'royal-gold',
    stampDefault: 'شحن مجاني ⚡',
  },
  {
    id: 'free-shipping-cod',
    number: 9,
    name: 'شحن مجاني وعاين قبل الاستلام',
    shortName: 'شحن مجاني + معاينة 🚚',
    subtitle: 'يركز على الثقة، أيقونة شحن سريع، وشارة الدفع عند الاستلام',
    badgeDefault: 'شحن مجاني لباب البيت',
    previewBg: 'linear-gradient(135deg, #052E16 0%, #065F46 55%, #10B981 100%)',
    accentHex: '#34D399',
    secondaryHex: '#FEF08A',
    ribbonDefault: 'royal-gold',
    stampDefault: 'عاين قبل الدفع',
  },
  {
    id: 'minimal-clean-insta',
    number: 10,
    name: 'القالب العصري الهادئ (Minimalist Studio)',
    shortName: 'إنستجرام هادئ (Minimal)',
    subtitle: 'خلفية فاتحة متدرجة أنيقة جداً لبوستات إنستجرام والملابس',
    badgeDefault: 'تشكيلة الموسم الجديد',
    previewBg: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 55%, #CBD5E1 100%)',
    accentHex: '#0F172A',
    secondaryHex: '#B45309',
    ribbonDefault: 'luxury-black',
    stampDefault: 'أصلي 100%',
  },
  {
    id: 'new-arrival-podium',
    number: 11,
    name: 'وصل حديثاً (New Arrival)',
    shortName: 'وصل حديثاً (منصة 3D)',
    subtitle: 'يرسم منصة دائرية ثلاثية الأبعاد مع ظل واقعي تحت المنتج',
    badgeDefault: 'وصل حديثاً ✨',
    previewBg: 'linear-gradient(135deg, #18181B 0%, #27272A 50%, #D4AF37 100%)',
    accentHex: '#D4AF37',
    secondaryHex: '#E4E4E7',
    ribbonDefault: 'royal-gold',
    stampDefault: 'الأكثر مبيعاً',
  },
  {
    id: 'best-seller-guarantee',
    number: 12,
    name: 'الأكثر مبيعاً في مصر 🔥',
    shortName: 'الأكثر مبيعاً ⭐⭐⭐⭐⭐',
    subtitle: 'مع وسام ذهبي 5 نجوم وختم ضمان الجودة',
    badgeDefault: 'الأكثر مبيعاً في مصر 🔥',
    previewBg: 'linear-gradient(135deg, #1C1008 0%, #451A03 55%, #D97706 100%)',
    accentHex: '#F59E0B',
    secondaryHex: '#FEF3C7',
    ribbonDefault: 'royal-gold',
    stampDefault: 'الأكثر مبيعاً',
  },
  {
    id: 'half-price-50',
    number: 13,
    name: 'عرض نصف الثمن (50% OFF)',
    shortName: 'بنصف الثمن 50% OFF',
    subtitle: 'يقسم الخلفية هندسياً لإبراز السعر قبل وبعد الخصم بقوة',
    badgeDefault: 'خصم 50% بنصف الثمن',
    previewBg: 'linear-gradient(135deg, #09090B 0%, #09090B 49%, #E11D48 51%, #9F1239 100%)',
    accentHex: '#F43F5E',
    secondaryHex: '#FDE047',
    ribbonDefault: 'fire-red',
    stampDefault: 'الكمية محدودة',
  },
  {
    id: 'auto-moto-parts',
    number: 14,
    name: 'قالب قطع الغيار والسيارات والموتوسيكلات',
    shortName: 'سيارات وقطع غيار ⚙️',
    subtitle: 'تصميم معدني كربوني رياضي قوي مع لمسات ذهبية وحمراء',
    badgeDefault: 'أداء أصلي ومضمون ⚙️',
    previewBg: 'linear-gradient(135deg, #090A0F 0%, #1F2937 55%, #DC2626 100%)',
    accentHex: '#EF4444',
    secondaryHex: '#D4AF37',
    ribbonDefault: 'fire-red',
    stampDefault: 'أصلي 100%',
  },
  {
    id: 'story-reels-vertical',
    number: 15,
    name: 'قالب ستوري وريلز الممول (9:16)',
    shortName: 'ستوري وريلز وتيك توك 📱',
    subtitle: 'مصمم خصيصاً لإعلانات الإنستجرام والفيسبوك وتيك توك الطولية',
    badgeDefault: 'عرض حصري لمتابعينا 🔥',
    previewBg: 'linear-gradient(135deg, #1E1B4B 0%, #4C1D95 50%, #EC4899 100%)',
    accentHex: '#F472B6',
    secondaryHex: '#FDE047',
    ribbonDefault: 'royal-gold',
    stampDefault: 'شحن مجاني ⚡',
    recommendedSizeId: 'story',
  },
  {
    id: 'before-after-split',
    number: 16,
    name: 'قالب المقارنة والسعر القديم مقابل الجديد',
    shortName: 'مقارنة السعر قبل / بعد',
    subtitle: 'يقارن بصرياً بين السعر القديم المشطوب وسعر العرض الحالي مع قيمة التوفير',
    badgeDefault: 'وفر أكثر اليوم',
    previewBg: 'linear-gradient(135deg, #27272A 0%, #0F172A 50%, #10B981 100%)',
    accentHex: '#10B981',
    secondaryHex: '#D4AF37',
    ribbonDefault: 'royal-gold',
    stampDefault: 'عاين قبل الدفع',
  },
];

export const CANVAS_SIZE_PRESETS = [
  {
    id: 'square',
    label: 'بوست مربع (1080×1080)',
    shortLabel: '1080×1080 مربع',
    width: 1080,
    height: 1080,
    ratio: '1:1',
  },
  {
    id: 'story',
    label: 'ستوري / ريلز (1080×1920)',
    shortLabel: '1080×1920 ستوري',
    width: 1080,
    height: 1920,
    ratio: '9:16',
  },
  {
    id: 'landscape',
    label: 'إعلان عرضي (1200×628)',
    shortLabel: '1200×628 إعلان ممول',
    width: 1200,
    height: 628,
    ratio: '1.91:1',
  },
];

export const PROMO_QUICK_PHRASES = [
  'خصم لفترة محدودة',
  'الجمعة البيضاء',
  'أوكازيون',
  'شحن مجاني',
  'الدفع عند الاستلام',
  'الأكثر مبيعاً 🔥',
  'عرض القطعتين + هدية',
];

export const PROMO_CIRCULAR_STAMPS = [
  { id: 'أصلي 100%', label: 'أصلي 100%', sub: 'ضمان الجودة', style: 'gold' },
  { id: 'الأكثر مبيعاً', label: 'الأكثر مبيعاً', sub: 'اختيار العملاء ⭐', style: 'gold' },
  { id: 'شحن مجاني ⚡', label: 'شحن مجاني ⚡', sub: 'لجميع المحافظات', style: 'red' },
  { id: 'الكمية محدودة', label: 'الكمية محدودة', sub: 'احجز الآن فوراً', style: 'red' },
  { id: 'عاين قبل الدفع', label: 'عاين قبل الدفع', sub: 'ضمان الثقة 100%', style: 'gold' },
];

export const PROMO_CORNER_RIBBONS = [
  { id: 'royal-gold', label: 'ذهبي ملكي', bg1: '#F3E5AB', bg2: '#D4AF37', textHex: '#0A0A0A' },
  { id: 'fire-red', label: 'أحمر ناري', bg1: '#EF4444', bg2: '#991B1B', textHex: '#FFFFFF' },
  { id: 'luxury-black', label: 'أسود فخم', bg1: '#27272A', bg2: '#09090B', textHex: '#D4AF37' },
  { id: 'none', label: 'بدون شريط', bg1: 'transparent', bg2: 'transparent', textHex: 'transparent' },
];

export const SAMPLE_PRODUCT_PRESETS = [
  {
    id: 'watch-gold',
    label: 'ساعة كرونوغراف ملكية + سبيكة ذهب',
    defaultTitle: 'ساعة كرونوغراف ملكية إصدار خاص — ضمان عامين',
    defaultSubtitle: 'مقاومة للمياه · ستانلس ستيل مطلي ذهب عيار 24 · علبة فاخرة',
    priceBefore: 4850,
    priceAfter: 2425,
  },
  {
    id: 'sneaker-ultra',
    label: 'حذاء رياضي ألترا رانينج برو',
    defaultTitle: 'حذاء رياضي الترا برو — نعل طبي مريح',
    defaultSubtitle: 'خامة أصلية مستوردة · خفيف جداً للمشي والجري · متاح جميع المقاسات',
    priceBefore: 2200,
    priceAfter: 1299,
  },
  {
    id: 'headphone-pro',
    label: 'سماعة بلوتوث برو عازلة للضوضاء',
    defaultTitle: 'سماعة بلوتوث برو ANC — بطارية 40 ساعة',
    defaultSubtitle: 'صوت محيطي فائق النقاء · مايك مزدوج للمكالمات · شحن سريع Type-C',
    priceBefore: 1950,
    priceAfter: 1150,
  },
  {
    id: 'perfume-vip',
    label: 'عطر عود ملكي فرنسي VIP (100 مل)',
    defaultTitle: 'عطر رويال عود VIP — ثبات 48 ساعة',
    defaultSubtitle: 'تركيز أو دو بارفان أصلي 100% · زجاجة كريستال فاخرة · هدية مجانية',
    priceBefore: 1600,
    priceAfter: 899,
  },
];

/* ============================================================================
 * 2. PURE HELPER FUNCTIONS (EXPORTED FOR FAST NODE:TEST UNIT VERIFICATION)
 * ========================================================================== */

export function calculatePromoDiscountMetrics(priceBefore, priceAfter) {
  const before = Math.max(0, Number(priceBefore) || 0);
  const after = Math.max(0, Number(priceAfter) || 0);
  if (before <= 0 || after >= before) {
    return {
      priceBefore: before,
      priceAfter: after,
      discountAmount: 0,
      discountPercent: 0,
      isDiscountValid: false,
    };
  }
  const discountAmount = Number((before - after).toFixed(2));
  const discountPercent = Math.min(95, Math.max(1, Math.round((discountAmount / before) * 100)));
  return {
    priceBefore: before,
    priceAfter: after,
    discountAmount,
    discountPercent,
    isDiscountValid: true,
  };
}

/**
 * Removes near-white background pixels (`R >= threshold && G >= threshold && B >= threshold`)
 * from an RGBA Uint8ClampedArray in-place with soft alpha feathering.
 */
export function removeWhiteBackgroundFromImageData(rgbaData, threshold = 236) {
  if (!rgbaData || typeof rgbaData.length !== 'number') return 0;
  let removedCount = 0;
  const softStart = Math.max(180, threshold - 22);

  for (let i = 0; i < rgbaData.length; i += 4) {
    const r = rgbaData[i];
    const g = rgbaData[i + 1];
    const b = rgbaData[i + 2];
    const a = rgbaData[i + 3];
    if (a === 0) continue;

    const minChannel = Math.min(r, g, b);
    const maxChannel = Math.max(r, g, b);
    const colorSpread = maxChannel - minChannel;

    // Near-white neutral pixel check
    if (minChannel >= threshold && colorSpread <= 24) {
      rgbaData[i + 3] = 0;
      removedCount++;
    } else if (minChannel >= softStart && colorSpread <= 28) {
      // Smooth edge anti-aliasing feather
      const ratio = (threshold - minChannel) / Math.max(1, threshold - softStart);
      rgbaData[i + 3] = Math.round(a * Math.max(0, Math.min(1, ratio)));
      removedCount++;
    }
  }
  return removedCount;
}

const formatNum = (val) => {
  const num = Number(val) || 0;
  return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
};

/* ============================================================================
 * 3. PROGRAMMATIC DEFAULT PRODUCT ILLUSTRATION RENDERER
 *    Draws a realistic 3D product on canvas when the user hasn't uploaded one
 * ========================================================================== */
function drawDefaultSampleProduct(ctx, presetId, cx, cy, baseRadius, dropShadow) {
  ctx.save();

  // Floor contact drop shadow
  if (dropShadow) {
    const shadowGrad = ctx.createRadialGradient(
      cx,
      cy + baseRadius * 0.86,
      baseRadius * 0.08,
      cx,
      cy + baseRadius * 0.86,
      baseRadius * 0.88
    );
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.78)');
    shadowGrad.addColorStop(0.55, 'rgba(0, 0, 0, 0.35)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy + baseRadius * 0.86, baseRadius * 0.82, baseRadius * 0.19, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  if (presetId === 'sneaker-ultra') {
    // Sporty Ultra Running Shoe Illustration
    ctx.translate(cx, cy);
    ctx.rotate(-0.14);

    // Midsole (White/Gold Cushion)
    const soleGrad = ctx.createLinearGradient(-baseRadius * 0.75, baseRadius * 0.2, baseRadius * 0.75, baseRadius * 0.45);
    soleGrad.addColorStop(0, '#FFFFFF');
    soleGrad.addColorStop(0.65, '#E2E8F0');
    soleGrad.addColorStop(1, '#D4AF37');
    ctx.fillStyle = soleGrad;
    ctx.beginPath();
    ctx.roundRect(-baseRadius * 0.78, baseRadius * 0.14, baseRadius * 1.56, baseRadius * 0.28, 34);
    ctx.fill();

    // Shoe Upper Body
    const upperGrad = ctx.createLinearGradient(-baseRadius * 0.7, -baseRadius * 0.45, baseRadius * 0.65, baseRadius * 0.2);
    upperGrad.addColorStop(0, '#18181B');
    upperGrad.addColorStop(0.55, '#09090B');
    upperGrad.addColorStop(1, '#27272A');
    ctx.fillStyle = upperGrad;
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-baseRadius * 0.72, baseRadius * 0.16);
    ctx.quadraticCurveTo(-baseRadius * 0.75, -baseRadius * 0.38, -baseRadius * 0.28, -baseRadius * 0.44);
    ctx.lineTo(baseRadius * 0.12, -baseRadius * 0.12);
    ctx.quadraticCurveTo(baseRadius * 0.62, -baseRadius * 0.08, baseRadius * 0.74, baseRadius * 0.16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Metallic Gold Speed Stripes
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    for (let s = 0; s < 3; s++) {
      ctx.beginPath();
      ctx.moveTo(-baseRadius * 0.25 + s * 38, -baseRadius * 0.18);
      ctx.lineTo(-baseRadius * 0.05 + s * 38, baseRadius * 0.1);
      ctx.stroke();
    }

    // Tag label
    ctx.fillStyle = '#F3E5AB';
    ctx.font = '900 22px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DIX ULTRA PRO', 0, baseRadius * 0.33);
  } else if (presetId === 'headphone-pro') {
    // Studio Wireless ANC Headphones Illustration
    const r = baseRadius * 0.62;
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 22;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.1, r, Math.PI * 0.92, Math.PI * 0.08, false);
    ctx.stroke();

    ctx.strokeStyle = '#18181B';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.1, r - 6, Math.PI * 0.95, Math.PI * 0.05, false);
    ctx.stroke();

    // Left & Right Ear Cups
    [-1, 1].forEach((dir) => {
      const cupX = cx + dir * r * 0.92;
      const cupY = cy + r * 0.22;
      ctx.save();
      ctx.translate(cupX, cupY);
      ctx.rotate(dir * 0.15);
      const cupGrad = ctx.createLinearGradient(-45, -70, 45, 70);
      cupGrad.addColorStop(0, '#27272A');
      cupGrad.addColorStop(0.5, '#09090B');
      cupGrad.addColorStop(1, '#D4AF37');
      ctx.fillStyle = cupGrad;
      ctx.strokeStyle = '#F3E5AB';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-46, -68, 92, 136, 42);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });

    // Center glowing audio wave badge
    ctx.fillStyle = 'rgba(212, 175, 55, 0.16)';
    ctx.beginPath();
    ctx.arc(cx, cy + 10, r * 0.48, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#F3E5AB';
    ctx.font = '900 26px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ANC PRO 5.3', cx, cy + 18);
  } else if (presetId === 'perfume-vip') {
    // Royal Crystal Oud Perfume Bottle
    const bw = baseRadius * 0.88;
    const bh = baseRadius * 1.05;
    const bx = cx - bw / 2;
    const by = cy - bh * 0.38;

    // Gold Spray Cap
    const capGrad = ctx.createLinearGradient(cx - 50, by - 95, cx + 50, by);
    capGrad.addColorStop(0, '#F3E5AB');
    capGrad.addColorStop(0.5, '#D4AF37');
    capGrad.addColorStop(1, '#854D0E');
    ctx.fillStyle = capGrad;
    ctx.beginPath();
    ctx.roundRect(cx - 46, by - 88, 92, 62, 14);
    ctx.fill();
    ctx.fillRect(cx - 24, by - 28, 48, 28);

    // Crystal Bottle Body
    const bottleGrad = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
    bottleGrad.addColorStop(0, '#1C1917');
    bottleGrad.addColorStop(0.5, '#09090B');
    bottleGrad.addColorStop(1, '#292524');
    ctx.fillStyle = bottleGrad;
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, 32);
    ctx.fill();
    ctx.stroke();

    // Inner Gold Plaque
    ctx.fillStyle = capGrad;
    ctx.beginPath();
    ctx.roundRect(cx - bw * 0.34, by + bh * 0.22, bw * 0.68, bh * 0.54, 16);
    ctx.fill();

    ctx.fillStyle = '#0A0A0A';
    ctx.font = '900 28px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ROYAL OUD', cx, by + bh * 0.45);
    ctx.font = 'bold 18px Cairo, sans-serif';
    ctx.fillText('EAU DE PARFUM', cx, by + bh * 0.58);
    ctx.fillText('100 ML · VIP', cx, by + bh * 0.69);
  } else {
    // Default ('watch-gold'): Luxury Chronograph Watch + 24K Gold Bullion Bar
    // 1. Gold Bullion Card on Right
    const barGrad = ctx.createLinearGradient(cx - 20, cy - baseRadius * 0.55, cx + baseRadius * 0.72, cy + baseRadius * 0.55);
    barGrad.addColorStop(0, '#FEF08A');
    barGrad.addColorStop(0.45, '#D4AF37');
    barGrad.addColorStop(1, '#854D0E');
    ctx.save();
    ctx.translate(cx + baseRadius * 0.26, cy + 10);
    ctx.rotate(0.1);
    ctx.fillStyle = barGrad;
    ctx.strokeStyle = '#FEF9C3';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-baseRadius * 0.42, -baseRadius * 0.54, baseRadius * 0.84, baseRadius * 1.08, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0A0A0A';
    ctx.font = '900 28px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DIX GOLD', 0, -baseRadius * 0.18);
    ctx.font = 'bold 20px Cairo, sans-serif';
    ctx.fillText('999.9 FINE GOLD', 0, 8);
    ctx.fillText('24 KARAT', 0, 42);
    ctx.restore();

    // 2. Royal Chronograph Watch on Left
    const wx = cx - baseRadius * 0.24;
    const wy = cy + 6;
    const wr = baseRadius * 0.48;

    // Watch Strap
    ctx.fillStyle = '#18181B';
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(wx - wr * 0.42, wy - wr * 1.38, wr * 0.84, wr * 2.76, 18);
    ctx.fill();
    ctx.stroke();

    // Watch Bezel
    ctx.fillStyle = barGrad;
    ctx.beginPath();
    ctx.arc(wx, wy, wr, 0, Math.PI * 2);
    ctx.fill();

    // Watch Dial
    const dialGrad = ctx.createRadialGradient(wx, wy, 8, wx, wy, wr * 0.84);
    dialGrad.addColorStop(0, '#1E293B');
    dialGrad.addColorStop(1, '#09090B');
    ctx.fillStyle = dialGrad;
    ctx.beginPath();
    ctx.arc(wx, wy, wr * 0.82, 0, Math.PI * 2);
    ctx.fill();

    // Hour Markers & Hands
    ctx.strokeStyle = '#F3E5AB';
    ctx.lineWidth = 3;
    for (let h = 0; h < 12; h++) {
      const ang = (h * Math.PI) / 6;
      ctx.beginPath();
      ctx.moveTo(wx + Math.cos(ang) * wr * 0.66, wy + Math.sin(ang) * wr * 0.66);
      ctx.lineTo(wx + Math.cos(ang) * wr * 0.76, wy + Math.sin(ang) * wr * 0.76);
      ctx.stroke();
    }
    // Watch Hands (10:10 position)
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.lineTo(wx - wr * 0.38, wy - wr * 0.26);
    ctx.stroke();
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.lineTo(wx + wr * 0.46, wy - wr * 0.32);
    ctx.stroke();
  }

  ctx.restore();
}

/* ============================================================================
 * 4. MASTER HTML5 CANVAS RENDER ENGINE (`drawPromoCanvas`)
 *    Draws all 16 templates, lighting, frames, product, stamps, ribbons & CTA
 * ========================================================================== */
export function drawPromoCanvas(ctx, state) {
  if (!ctx || !state) return;
  const {
    width = 1080,
    height = 1080,
    templateId = 'luxury-black-gold',
    productTitle = 'ساعة كرونوغراف ملكية إصدار خاص — ضمان عامين',
    productSubtitle = 'مقاومة للمياه · ستانلس ستيل مطلي ذهب عيار 24 · علبة فاخرة',
    priceBefore = 4850,
    priceAfter = 2425,
    currencySymbol = 'ج.م',
    customDiscountPercent = null,
    badgePhrase = 'خصم لفترة محدودة',
    ctaText = 'اطلب الآن عبر واتساب:',
    merchantPhone = '01000000000',
    storeName = 'متجر النخبة التجاري',
    activeStampId = 'أصلي 100%',
    cornerRibbonId = 'royal-gold',
    samplePresetId = 'watch-gold',
    uploadedImg = null,
    logoImg = null,
    zoom = 1,
    offsetX = 0,
    offsetY = 0,
    flipX = false,
    dropShadow = true,
    showDixWatermark = true,
  } = state;

  const tpl =
    PROMO_STUDIO_TEMPLATES.find((t) => t.id === templateId) || PROMO_STUDIO_TEMPLATES[0];
  const metrics = calculatePromoDiscountMetrics(priceBefore, priceAfter);
  const effectiveDiscount =
    customDiscountPercent !== null && customDiscountPercent > 0
      ? customDiscountPercent
      : metrics.discountPercent;

  const isVertical = height > width * 1.3;
  const isLandscape = width > height * 1.3;

  ctx.save();
  ctx.clearRect(0, 0, width, height);

  /* ------------------------------------------------------------------------
   * STEP A: TEMPLATE-SPECIFIC BACKGROUND, LIGHTING & GEOMETRIC DECORATIONS
   * ---------------------------------------------------------------------- */
  if (templateId === 'luxury-black-gold') {
    const bg = ctx.createRadialGradient(width * 0.5, height * 0.42, 40, width * 0.5, height * 0.5, Math.max(width, height) * 0.75);
    bg.addColorStop(0, '#2B2108');
    bg.addColorStop(0.55, '#0E0C07');
    bg.addColorStop(1, '#050505');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Warm golden ambient glow behind product
    const glow = ctx.createRadialGradient(width * 0.5, height * 0.44, 10, width * 0.5, height * 0.44, width * 0.38);
    glow.addColorStop(0, 'rgba(212, 175, 55, 0.34)');
    glow.addColorStop(1, 'rgba(212, 175, 55, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    // Double Royal Gold Frame
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 8;
    ctx.strokeRect(28, 28, width - 56, height - 56);
    ctx.strokeStyle = 'rgba(243, 229, 171, 0.45)';
    ctx.lineWidth = 2;
    ctx.strokeRect(42, 42, width - 84, height - 84);
  } else if (templateId === 'white-friday-mega') {
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#09090B');
    bg.addColorStop(0.55, '#450A0A');
    bg.addColorStop(1, '#991B1B');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Dynamic diagonal fire stripes
    ctx.fillStyle = 'rgba(239, 68, 68, 0.14)';
    for (let i = -height; i < width + height; i += 140) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 70, 0);
      ctx.lineTo(i - height + 70, height);
      ctx.lineTo(i - height, height);
      ctx.closePath();
      ctx.fill();
    }

    // Top White Friday Header Pill
    ctx.fillStyle = '#FEF08A';
    ctx.font = `900 ${Math.round(width * 0.028)}px Cairo, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('⚡ WHITE FRIDAY MEGA DEAL · الجمعة البيضاء ⚡', width * 0.5, height * 0.065);
  } else if (templateId === 'okazion-clearance') {
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#991B1B');
    bg.addColorStop(0.5, '#DC2626');
    bg.addColorStop(1, '#7F1D1D');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Sunburst yellow rays
    ctx.save();
    ctx.translate(width * 0.5, height * 0.42);
    ctx.fillStyle = 'rgba(250, 204, 21, 0.14)';
    for (let r = 0; r < 16; r++) {
      ctx.rotate((Math.PI * 2) / 16);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-45, -width);
      ctx.lineTo(45, -width);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 10;
    ctx.setLineDash([24, 14]);
    ctx.strokeRect(24, 24, width - 48, height - 48);
    ctx.setLineDash([]);
  } else if (templateId === 'ramadan-eid-special') {
    const bg = ctx.createRadialGradient(width * 0.5, height * 0.35, 30, width * 0.5, height * 0.5, Math.max(width, height) * 0.8);
    bg.addColorStop(0, '#065F46');
    bg.addColorStop(0.6, '#064E3B');
    bg.addColorStop(1, '#022C22');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Golden Arch & Crescent Moon + Hanging Lanterns
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 5;
    ctx.strokeRect(32, 32, width - 64, height - 64);

    // Hanging Lanterns (Left & Right)
    [width * 0.14, width * 0.86].forEach((lx) => {
      ctx.strokeStyle = '#F3E5AB';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(lx, 32);
      ctx.lineTo(lx, height * 0.14);
      ctx.stroke();

      ctx.fillStyle = '#D4AF37';
      ctx.beginPath();
      ctx.moveTo(lx - 26, height * 0.14);
      ctx.lineTo(lx + 26, height * 0.14);
      ctx.lineTo(lx + 36, height * 0.2);
      ctx.lineTo(lx, height * 0.25);
      ctx.lineTo(lx - 36, height * 0.2);
      ctx.closePath();
      ctx.fill();

      const lanternGlow = ctx.createRadialGradient(lx, height * 0.19, 4, lx, height * 0.19, 64);
      lanternGlow.addColorStop(0, 'rgba(254, 240, 138, 0.75)');
      lanternGlow.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = lanternGlow;
      ctx.beginPath();
      ctx.arc(lx, height * 0.19, 64, 0, Math.PI * 2);
      ctx.fill();
    });

    // Golden Crescent
    ctx.fillStyle = '#F3E5AB';
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.11, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#065F46';
    ctx.beginPath();
    ctx.arc(width * 0.5 + 12, height * 0.11 - 6, 30, 0, Math.PI * 2);
    ctx.fill();
  } else if (templateId === 'cyber-neon-tech') {
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#070312');
    bg.addColorStop(0.5, '#1E1B4B');
    bg.addColorStop(1, '#090D16');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Cyber perspective grid lines
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.15)';
    ctx.lineWidth = 2;
    for (let x = 0; x < width; x += 90) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 90) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Glowing Cyan & Magenta Neon Frame
    ctx.save();
    ctx.shadowColor = '#22D3EE';
    ctx.shadowBlur = 24;
    ctx.strokeStyle = '#22D3EE';
    ctx.lineWidth = 6;
    ctx.strokeRect(34, 34, width - 68, height - 68);
    ctx.shadowColor = '#E879F9';
    ctx.strokeStyle = '#E879F9';
    ctx.lineWidth = 3;
    ctx.strokeRect(48, 48, width - 96, height - 96);
    ctx.restore();
  } else if (templateId === 'vip-exclusive-card') {
    const bg = ctx.createRadialGradient(width * 0.5, height * 0.35, 30, width * 0.5, height * 0.5, Math.max(width, height) * 0.75);
    bg.addColorStop(0, '#292524');
    bg.addColorStop(0.6, '#0C0A09');
    bg.addColorStop(1, '#000000');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Classic ornate corner borders
    ctx.strokeStyle = '#EAB308';
    ctx.lineWidth = 6;
    ctx.strokeRect(36, 36, width - 72, height - 72);
    ctx.lineWidth = 2;
    ctx.strokeRect(52, 52, width - 104, height - 104);

    // Royal Crown Icon at Top Center
    const crownX = width * 0.5;
    const crownY = height * 0.095;
    ctx.fillStyle = '#FACC15';
    ctx.beginPath();
    ctx.moveTo(crownX - 48, crownY + 20);
    ctx.lineTo(crownX - 56, crownY - 18);
    ctx.lineTo(crownX - 22, crownY + 2);
    ctx.lineTo(crownX, crownY - 28);
    ctx.lineTo(crownX + 22, crownY + 2);
    ctx.lineTo(crownX + 56, crownY - 18);
    ctx.lineTo(crownX + 48, crownY + 20);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#FEF08A';
    ctx.font = `900 ${Math.round(width * 0.022)}px Cairo, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('VIP ROYAL SELECTION · نخبة الصفوة', crownX, crownY + 48);
  } else if (templateId === 'flash-sale-timer') {
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#111827');
    bg.addColorStop(0.55, '#7C2D12');
    bg.addColorStop(1, '#431407');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Visual Countdown Timer Bar at Top (`00 : 59 : 42`)
    const timerW = Math.min(width * 0.56, 560);
    const timerH = Math.round(height * 0.085);
    const timerX = (width - timerW) / 2;
    const timerY = height * 0.045;

    ctx.fillStyle = '#09090B';
    ctx.strokeStyle = '#FB923C';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(timerX, timerY, timerW, timerH, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FDE047';
    ctx.font = `900 ${Math.round(timerH * 0.52)}px Cairo, monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('⏱ ينتهي خلال  42 : 59 : 00', width * 0.5, timerY + timerH * 0.68);
  } else if (templateId === 'bundle-bogo-offer') {
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#0F172A');
    bg.addColorStop(0.55, '#1E3A8A');
    bg.addColorStop(1, '#172554');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Bundle savings pill header
    const pillW = Math.min(width * 0.62, 620);
    const pillH = Math.round(height * 0.075);
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.roundRect((width - pillW) / 2, height * 0.045, pillW, pillH, 999);
    ctx.fill();

    ctx.fillStyle = '#09090B';
    ctx.font = `900 ${Math.round(pillH * 0.52)}px Cairo, sans-serif`;
    ctx.textAlign = 'center';
    const savingsVal = metrics.discountAmount > 0 ? `${formatNum(metrics.discountAmount)} ${currencySymbol}` : '50%';
    ctx.fillText(`🎁 عرض البكج التوفيري — وفّر ${savingsVal} فوراً!`, width * 0.5, height * 0.045 + pillH * 0.68);
  } else if (templateId === 'free-shipping-cod') {
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#022C22');
    bg.addColorStop(0.55, '#064E3B');
    bg.addColorStop(1, '#065F46');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Top Trust Banner (Free Shipping + Inspect Before Paying)
    const barW = width - 120;
    const barH = Math.round(height * 0.078);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.22)';
    ctx.strokeStyle = '#34D399';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(60, height * 0.045, barW, barH, 18);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ECFDF5';
    ctx.font = `900 ${Math.round(barH * 0.46)}px Cairo, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('🚚 شحن مجاني سريع · 🛡️ الدفع بعد المعاينة والاستلام', width * 0.5, height * 0.045 + barH * 0.66);
  } else if (templateId === 'minimal-clean-insta') {
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#FAF8F5');
    bg.addColorStop(0.5, '#F1ECE1');
    bg.addColorStop(1, '#E5DEC9');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Soft organic studio arch in background
    ctx.fillStyle = '#EAE2CE';
    ctx.beginPath();
    ctx.roundRect(width * 0.16, height * 0.1, width * 0.68, height * 0.62, [280, 280, 24, 24]);
    ctx.fill();

    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 3;
    ctx.strokeRect(36, 36, width - 72, height - 72);
  } else if (templateId === 'new-arrival-podium') {
    const bg = ctx.createRadialGradient(width * 0.5, height * 0.38, 20, width * 0.5, height * 0.5, Math.max(width, height) * 0.75);
    bg.addColorStop(0, '#3F3F46');
    bg.addColorStop(0.55, '#18181B');
    bg.addColorStop(1, '#09090B');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // 3D Cylindrical Podium under the product
    const podCx = width * 0.5;
    const podCy = isLandscape ? height * 0.58 : height * 0.55;
    const podRx = width * 0.31;
    const podRy = height * 0.055;
    const podH = height * 0.065;

    const podSideGrad = ctx.createLinearGradient(podCx - podRx, podCy, podCx + podRx, podCy);
    podSideGrad.addColorStop(0, '#78350F');
    podSideGrad.addColorStop(0.5, '#D4AF37');
    podSideGrad.addColorStop(1, '#451A03');
    ctx.fillStyle = podSideGrad;
    ctx.beginPath();
    ctx.ellipse(podCx, podCy + podH, podRx, podRy, 0, 0, Math.PI);
    ctx.lineTo(podCx - podRx, podCy);
    ctx.ellipse(podCx, podCy, podRx, podRy, 0, Math.PI, 0, true);
    ctx.closePath();
    ctx.fill();

    const podTopGrad = ctx.createRadialGradient(podCx, podCy, 10, podCx, podCy, podRx);
    podTopGrad.addColorStop(0, '#FEF9C3');
    podTopGrad.addColorStop(0.65, '#D4AF37');
    podTopGrad.addColorStop(1, '#92400E');
    ctx.fillStyle = podTopGrad;
    ctx.beginPath();
    ctx.ellipse(podCx, podCy, podRx, podRy, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (templateId === 'best-seller-guarantee') {
    const bg = ctx.createRadialGradient(width * 0.5, height * 0.4, 40, width * 0.5, height * 0.5, Math.max(width, height) * 0.78);
    bg.addColorStop(0, '#78350F');
    bg.addColorStop(0.55, '#1C1917');
    bg.addColorStop(1, '#09090B');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // 5 Golden Stars Bar at Top
    ctx.fillStyle = '#FACC15';
    ctx.font = `900 ${Math.round(width * 0.036)}px Cairo, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('★ ★ ★ ★ ★', width * 0.5, height * 0.075);
    ctx.fillStyle = '#FEF3C7';
    ctx.font = `bold ${Math.round(width * 0.022)}px Cairo, sans-serif`;
    ctx.fillText('الأعلى تقييماً والأكثر مبيعاً في السوق المصري', width * 0.5, height * 0.11);
  } else if (templateId === 'half-price-50') {
    // Bold geometric diagonal split background
    ctx.fillStyle = '#09090B';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#BE123C';
    ctx.beginPath();
    ctx.moveTo(width * 0.58, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, height);
    ctx.lineTo(width * 0.32, height);
    ctx.closePath();
    ctx.fill();

    // Giant watermark 50% in background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.font = `900 ${Math.round(width * 0.28)}px Cairo, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('50% OFF', width * 0.5, height * 0.46);
  } else if (templateId === 'auto-moto-parts') {
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#090A0F');
    bg.addColorStop(0.5, '#1F2937');
    bg.addColorStop(1, '#111827');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Carbon-fiber diagonal weave lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 4;
    for (let i = -height; i < width + height; i += 28) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i - height, height);
      ctx.stroke();
    }

    // Racing red & gold stripes
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(0, 0, width, 18);
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(0, 18, width, 8);
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 6;
    ctx.strokeRect(28, 36, width - 56, height - 64);
  } else if (templateId === 'story-reels-vertical') {
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#1E1B4B');
    bg.addColorStop(0.5, '#4C1D95');
    bg.addColorStop(1, '#831843');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Glowing rings
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.25)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.38, width * 0.36, 0, Math.PI * 2);
    ctx.stroke();
  } else if (templateId === 'before-after-split') {
    // Split Screen Price Comparison Layout
    ctx.fillStyle = '#18181B';
    ctx.fillRect(0, 0, width * 0.5, height);
    ctx.fillStyle = '#064E3B';
    ctx.fillRect(width * 0.5, 0, width * 0.5, height);

    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(width * 0.5, 0);
    ctx.lineTo(width * 0.5, height);
    ctx.stroke();

    // Top comparison labels
    ctx.fillStyle = '#FCA5A5';
    ctx.font = `900 ${Math.round(width * 0.026)}px Cairo, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`السعر القديم: ${formatNum(priceBefore)} ${currencySymbol}`, width * 0.25, height * 0.08);

    ctx.fillStyle = '#6EE7B7';
    ctx.fillText(`سعر العرض: ${formatNum(priceAfter)} ${currencySymbol}`, width * 0.75, height * 0.08);
  }

  /* ------------------------------------------------------------------------
   * STEP B: PRODUCT IMAGE OR DEFAULT 3D SHOWCASE ILLUSTRATION
   * ---------------------------------------------------------------------- */
  const productCenterX = (isLandscape ? width * 0.32 : width * 0.5) + offsetX;
  const productCenterY =
    (isLandscape ? height * 0.48 : isVertical ? height * 0.39 : height * 0.41) + offsetY;
  const maxProductBoxW = isLandscape ? width * 0.46 : width * 0.62;
  const maxProductBoxH = isLandscape ? height * 0.64 : isVertical ? height * 0.42 : height * 0.46;

  ctx.save();
  ctx.translate(productCenterX, productCenterY);
  ctx.scale(flipX ? -zoom : zoom, zoom);

  if (uploadedImg) {
    const scale = Math.min(maxProductBoxW / uploadedImg.width, maxProductBoxH / uploadedImg.height);
    const drawW = uploadedImg.width * scale;
    const drawH = uploadedImg.height * scale;

    if (dropShadow) {
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
      ctx.shadowBlur = 38;
      ctx.shadowOffsetY = 24;
      ctx.drawImage(uploadedImg, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();
    } else {
      ctx.drawImage(uploadedImg, -drawW / 2, -drawH / 2, drawW, drawH);
    }
  } else {
    const radius = Math.min(maxProductBoxW, maxProductBoxH) * 0.52;
    drawDefaultSampleProduct(ctx, samplePresetId, 0, 0, radius, dropShadow);
  }
  ctx.restore();

  /* ------------------------------------------------------------------------
   * STEP C: CORNER RIBBON (TOP LEFT DIAGONAL RIBBON)
   * ---------------------------------------------------------------------- */
  const ribbonSpec =
    PROMO_CORNER_RIBBONS.find((r) => r.id === cornerRibbonId) || PROMO_CORNER_RIBBONS[0];
  if (ribbonSpec && ribbonSpec.id !== 'none') {
    ctx.save();
    ctx.translate(0, 0);
    const ribGrad = ctx.createLinearGradient(0, 0, 280, 280);
    ribGrad.addColorStop(0, ribbonSpec.bg1);
    ribGrad.addColorStop(1, ribbonSpec.bg2);
    ctx.fillStyle = ribGrad;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 14;

    ctx.beginPath();
    ctx.moveTo(0, 145);
    ctx.lineTo(145, 0);
    ctx.lineTo(255, 0);
    ctx.lineTo(0, 255);
    ctx.closePath();
    ctx.fill();

    ctx.translate(98, 98);
    ctx.rotate(-Math.PI / 4);
    ctx.fillStyle = ribbonSpec.textHex;
    ctx.font = '900 26px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      effectiveDiscount > 0 ? `خصم ${effectiveDiscount}%` : badgePhrase.slice(0, 16),
      0,
      8
    );
    ctx.restore();
  }

  /* ------------------------------------------------------------------------
   * STEP D: TOP-RIGHT PROMO PHRASE BADGE & CIRCULAR SEAL STAMP
   * ---------------------------------------------------------------------- */
  const badgeW = Math.min(width * 0.38, 390);
  const badgeH = Math.round(Math.min(width, height) * 0.078);
  const badgeX = width - badgeW - 48;
  const badgeY = 52;

  ctx.save();
  ctx.fillStyle = tpl.accentHex;
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 20);
  ctx.fill();

  ctx.fillStyle = templateId === 'minimal-clean-insta' ? '#FFFFFF' : '#0A0A0A';
  ctx.font = `900 ${Math.round(badgeH * 0.44)}px Cairo, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(badgePhrase.slice(0, 24), badgeX + badgeW / 2, badgeY + badgeH * 0.65);
  ctx.restore();

  // Circular Seal Stamp (e.g. `أصلي 100%`, `الأكثر مبيعاً`, `شحن مجاني ⚡`)
  const stampSpec = PROMO_CIRCULAR_STAMPS.find((s) => s.id === activeStampId);
  if (stampSpec) {
    const stampR = Math.round(Math.min(width, height) * 0.088);
    const stampCx = isLandscape ? width * 0.54 : width - stampR - 58;
    const stampCy = isLandscape ? height * 0.25 : height * 0.34;

    ctx.save();
    const isRedStamp = stampSpec.style === 'red';
    const stampGrad = ctx.createRadialGradient(stampCx, stampCy, 8, stampCx, stampCy, stampR);
    if (isRedStamp) {
      stampGrad.addColorStop(0, '#F43F5E');
      stampGrad.addColorStop(1, '#9F1239');
    } else {
      stampGrad.addColorStop(0, '#FEF08A');
      stampGrad.addColorStop(0.6, '#D4AF37');
      stampGrad.addColorStop(1, '#92400E');
    }

    ctx.fillStyle = stampGrad;
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(stampCx, stampCy, stampR, 0, Math.PI * 2);
    ctx.fill();

    // Inner dashed seal ring
    ctx.strokeStyle = isRedStamp ? '#FEF08A' : '#0A0A0A';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(stampCx, stampCy, stampR * 0.84, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = isRedStamp ? '#FFFFFF' : '#0A0A0A';
    ctx.font = `900 ${Math.round(stampR * 0.31)}px Cairo, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(stampSpec.label, stampCx, stampCy - 4);
    ctx.font = `bold ${Math.round(stampR * 0.21)}px Cairo, sans-serif`;
    ctx.fillText(stampSpec.sub, stampCx, stampCy + stampR * 0.34);
    ctx.restore();
  }

  /* ------------------------------------------------------------------------
   * STEP E: BOTTOM PRODUCT DETAILS, PRICE COMPARISON CARD & CTA BUTTON
   * ---------------------------------------------------------------------- */
  const cardX = isLandscape ? width * 0.53 : 48;
  const cardW = isLandscape ? width * 0.43 : width - 96;
  const cardH = isLandscape ? height * 0.68 : isVertical ? height * 0.31 : height * 0.31;
  const cardY = isLandscape ? height * 0.22 : height - cardH - 46;

  ctx.save();
  const isLightTheme = templateId === 'minimal-clean-insta';
  ctx.fillStyle = isLightTheme ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 10, 10, 0.93)';
  ctx.strokeStyle = tpl.accentHex;
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 28);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Helper to fit text inside maxWidth by auto-adjusting font size
  const setAutoFittedFont = (weight, initialPx, minPx, textStr, maxW) => {
    let px = initialPx;
    ctx.font = `${weight} ${px}px Cairo, sans-serif`;
    while (px > minPx && ctx.measureText(textStr).width > maxW) {
      px -= 2;
      ctx.font = `${weight} ${px}px Cairo, sans-serif`;
    }
    return px;
  };

  // Product Title & Subtitle inside Card
  const textCenterX = cardX + cardW / 2;
  const maxTextW = cardW * 0.9;

  ctx.save();
  ctx.fillStyle = isLightTheme ? '#0F172A' : '#FFFFFF';
  ctx.textAlign = 'center';
  const cleanTitle = productTitle.slice(0, 56);
  setAutoFittedFont('900', Math.round(Math.min(cardW * 0.044, 40)), 20, cleanTitle, maxTextW);
  ctx.fillText(cleanTitle, textCenterX, cardY + cardH * 0.21);

  if (productSubtitle) {
    ctx.fillStyle = isLightTheme ? '#475569' : '#CBD5E1';
    const cleanSub = productSubtitle.slice(0, 72);
    setAutoFittedFont('bold', Math.round(Math.min(cardW * 0.027, 24)), 15, cleanSub, maxTextW);
    ctx.fillText(cleanSub, textCenterX, cardY + cardH * 0.35);
  }

  // Price After Discount (Large Prominent Number) & Price Before Discount (Red Diagonal Strikethrough)
  const priceRowY = cardY + cardH * 0.61;
  const newPriceFontPx = Math.round(Math.min(cardW * 0.068, 64));
  const oldPriceFontPx = Math.round(Math.min(cardW * 0.036, 34));

  ctx.fillStyle = isLightTheme ? '#B45309' : tpl.accentHex;
  const afterText = `${formatNum(priceAfter)} ${currencySymbol}`;

  if (priceBefore > priceAfter) {
    setAutoFittedFont('900', newPriceFontPx, 28, afterText, cardW * 0.52);
    ctx.fillText(afterText, textCenterX - cardW * 0.16, priceRowY);

    // Old price with diagonal red strikethrough
    const oldX = textCenterX + cardW * 0.24;
    const oldY = priceRowY - 8;
    const oldText = `${formatNum(priceBefore)} ${currencySymbol}`;
    ctx.fillStyle = '#94A3B8';
    setAutoFittedFont('bold', oldPriceFontPx, 18, oldText, cardW * 0.34);
    ctx.fillText(oldText, oldX, oldY);

    const measuredOldW = Math.min(cardW * 0.32, Math.max(90, ctx.measureText(oldText).width));
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(oldX - measuredOldW * 0.52, oldY + 6);
    ctx.lineTo(oldX + measuredOldW * 0.52, oldY - 20);
    ctx.stroke();
  } else {
    setAutoFittedFont('900', newPriceFontPx, 28, afterText, maxTextW);
    ctx.fillText(afterText, textCenterX, priceRowY);
  }

  // Bottom CTA Button Bar inside Card
  const ctaBarW = cardW * 0.9;
  const ctaBarH = Math.round(Math.min(76, Math.max(48, cardH * 0.21)));
  const ctaBarX = cardX + (cardW - ctaBarW) / 2;
  const ctaBarY = cardY + cardH - ctaBarH - 18;

  ctx.fillStyle = tpl.accentHex;
  ctx.beginPath();
  ctx.roundRect(ctaBarX, ctaBarY, ctaBarW, ctaBarH, 16);
  ctx.fill();

  ctx.fillStyle = isLightTheme ? '#FFFFFF' : '#0A0A0A';
  ctx.textAlign = 'center';
  const fullCtaLine = [ctaText, merchantPhone, storeName ? `· ${storeName}` : '']
    .filter(Boolean)
    .join(' ')
    .slice(0, 68);
  setAutoFittedFont('900', Math.round(ctaBarH * 0.44), 16, fullCtaLine, ctaBarW * 0.92);
  ctx.fillText(fullCtaLine, textCenterX, ctaBarY + ctaBarH * 0.64);
  ctx.restore();

  /* ------------------------------------------------------------------------
   * STEP F: USER UPLOADED STORE LOGO & DIX TOOLS STEALTH WATERMARK
   * ---------------------------------------------------------------------- */
  if (logoImg) {
    ctx.save();
    const logoSize = Math.round(Math.min(width, height) * 0.1);
    const lx = 54;
    const ly = height - cardH - logoSize - 64;
    ctx.fillStyle = 'rgba(10, 10, 10, 0.78)';
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(lx - 8, ly - 8, logoSize + 16, logoSize + 16, 16);
    ctx.fill();
    ctx.stroke();
    ctx.drawImage(logoImg, lx, ly, logoSize, logoSize);
    ctx.restore();
  }

  if (showDixWatermark) {
    ctx.save();
    ctx.fillStyle = isLightTheme ? 'rgba(15, 23, 42, 0.65)' : 'rgba(243, 229, 171, 0.72)';
    ctx.font = 'bold 18px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('تم التصميم عبر استوديو التجار — Dix Tools', width * 0.5, height - 14);
    ctx.restore();
  }

  ctx.restore();
}

/* ============================================================================
 * 5. MAIN 3-COLUMN INTERACTIVE STUDIO COMPONENT (`ProductPromoStudio.jsx`)
 * ========================================================================== */
export default function ProductPromoStudio({ defaultParams = {} }) {
  let siteConfigCtx = null;
  try {
    siteConfigCtx = useSiteConfig();
  } catch (_e) {
    siteConfigCtx = null;
  }

  const showDixWatermark =
    siteConfigCtx?.config?.viralFeatures?.pdfWatermarkEnabled !== false;

  // Template & Canvas Size State
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    defaultParams.templateId || 'luxury-black-gold'
  );
  const [canvasSizeId, setCanvasSizeId] = useState(defaultParams.canvasSizeId || 'square');
  const [samplePresetId, setSamplePresetId] = useState('watch-gold');

  // Product Image & Pixel Manipulation State
  const [rawUploadedImg, setRawUploadedImg] = useState(null);
  const [processedUploadedImg, setProcessedUploadedImg] = useState(null);
  const [autoRemoveWhiteBg, setAutoRemoveWhiteBg] = useState(false);
  const [whiteBgThreshold, setWhiteBgThreshold] = useState(236);
  const [logoImg, setLogoImg] = useState(null);

  // Quick Canvas Positioning Controls
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [dropShadow, setDropShadow] = useState(true);

  // Texts, Prices, Badges, Ribbons & Export Format
  const [productTitle, setProductTitle] = useState(
    defaultParams.productTitle || 'ساعة كرونوغراف ملكية إصدار خاص — ضمان عامين'
  );
  const [productSubtitle, setProductSubtitle] = useState(
    defaultParams.productSubtitle || 'مقاومة للمياه · ستانلس ستيل مطلي ذهب عيار 24 · علبة فاخرة'
  );
  const [priceBefore, setPriceBefore] = useState(defaultParams.priceBeforeEgp || 4850);
  const [priceAfter, setPriceAfter] = useState(defaultParams.priceAfterEgp || 2425);
  const [currencySymbol, setCurrencySymbol] = useState('ج.م');
  const [customDiscountPercent, setCustomDiscountPercent] = useState(null);
  const [badgePhrase, setBadgePhrase] = useState(defaultParams.badgeText || 'خصم لفترة محدودة');
  const [ctaText, setCtaText] = useState('اطلب الآن عبر واتساب:');
  const [merchantPhone, setMerchantPhone] = useState('01000000000');
  const [storeName, setStoreName] = useState('متجر النخبة');
  const [activeStampId, setActiveStampId] = useState('أصلي 100%');
  const [cornerRibbonId, setCornerRibbonId] = useState('royal-gold');
  const [exportFormat, setExportFormat] = useState('png'); // 'png' | 'jpeg' | 'webp'
  const [outputDataUrl, setOutputDataUrl] = useState('');
  const [shareFeedback, setShareFeedback] = useState('');

  const canvasRef = useRef(null);
  const productFileInputRef = useRef(null);
  const logoFileInputRef = useRef(null);

  const activeCanvasPreset = useMemo(
    () => CANVAS_SIZE_PRESETS.find((s) => s.id === canvasSizeId) || CANVAS_SIZE_PRESETS[0],
    [canvasSizeId]
  );

  const activeTemplateObj = useMemo(
    () =>
      PROMO_STUDIO_TEMPLATES.find((t) => t.id === selectedTemplateId) ||
      PROMO_STUDIO_TEMPLATES[0],
    [selectedTemplateId]
  );

  const discountMetrics = useMemo(
    () => calculatePromoDiscountMetrics(priceBefore, priceAfter),
    [priceBefore, priceAfter]
  );

  // Handle template selection: apply template's signature badge/ribbon/stamp & recommended aspect ratio
  const handleSelectTemplate = useCallback((tpl) => {
    setSelectedTemplateId(tpl.id);
    if (tpl.badgeDefault) setBadgePhrase(tpl.badgeDefault);
    if (tpl.ribbonDefault) setCornerRibbonId(tpl.ribbonDefault);
    if (tpl.stampDefault) setActiveStampId(tpl.stampDefault);
    if (tpl.recommendedSizeId) {
      setCanvasSizeId(tpl.recommendedSizeId);
    }
  }, []);

  // Auto White-BG Remover via Canvas Pixel Manipulation
  useEffect(() => {
    if (!rawUploadedImg) {
      setProcessedUploadedImg(null);
      return;
    }
    if (!autoRemoveWhiteBg) {
      setProcessedUploadedImg(rawUploadedImg);
      return;
    }

    try {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = rawUploadedImg.width;
      offCanvas.height = rawUploadedImg.height;
      const offCtx = offCanvas.getContext('2d');
      if (!offCtx) {
        setProcessedUploadedImg(rawUploadedImg);
        return;
      }
      offCtx.drawImage(rawUploadedImg, 0, 0);
      const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
      removeWhiteBackgroundFromImageData(imgData.data, whiteBgThreshold);
      offCtx.putImageData(imgData, 0, 0);

      const cleanedImg = new Image();
      cleanedImg.onload = () => setProcessedUploadedImg(cleanedImg);
      cleanedImg.src = offCanvas.toDataURL('image/png');
    } catch (_err) {
      setProcessedUploadedImg(rawUploadedImg);
    }
  }, [rawUploadedImg, autoRemoveWhiteBg, whiteBgThreshold]);

  // Live Canvas Redraw Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = activeCanvasPreset.width;
    canvas.height = activeCanvasPreset.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawPromoCanvas(ctx, {
      width: activeCanvasPreset.width,
      height: activeCanvasPreset.height,
      templateId: selectedTemplateId,
      productTitle,
      productSubtitle,
      priceBefore,
      priceAfter,
      currencySymbol,
      customDiscountPercent,
      badgePhrase,
      ctaText,
      merchantPhone,
      storeName,
      activeStampId,
      cornerRibbonId,
      samplePresetId,
      uploadedImg: processedUploadedImg,
      logoImg,
      zoom,
      offsetX,
      offsetY,
      flipX,
      dropShadow,
      showDixWatermark,
    });

    try {
      const mimeType =
        exportFormat === 'jpeg'
          ? 'image/jpeg'
          : exportFormat === 'webp'
          ? 'image/webp'
          : 'image/png';
      setOutputDataUrl(canvas.toDataURL(mimeType, 0.95));
    } catch (_e) {
      // Ignore taint in restricted environments
    }
  }, [
    activeCanvasPreset,
    selectedTemplateId,
    productTitle,
    productSubtitle,
    priceBefore,
    priceAfter,
    currencySymbol,
    customDiscountPercent,
    badgePhrase,
    ctaText,
    merchantPhone,
    storeName,
    activeStampId,
    cornerRibbonId,
    samplePresetId,
    processedUploadedImg,
    logoImg,
    zoom,
    offsetX,
    offsetY,
    flipX,
    dropShadow,
    showDixWatermark,
    exportFormat,
  ]);

  const handleProductFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        setRawUploadedImg(img);
        setZoom(1);
        setOffsetX(0);
        setOffsetY(0);
      };
      if (typeof ev.target?.result === 'string') img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => setLogoImg(img);
      if (typeof ev.target?.result === 'string') img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleApplyDiscountSlider = (pct) => {
    const percentage = Number(pct);
    setCustomDiscountPercent(percentage);
    if (priceBefore > 0) {
      const calculatedAfter = Math.round(priceBefore * (1 - percentage / 100));
      setPriceAfter(calculatedAfter);
    }
  };

  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mimeType =
      exportFormat === 'jpeg'
        ? 'image/jpeg'
        : exportFormat === 'webp'
        ? 'image/webp'
        : 'image/png';
    const ext = exportFormat === 'jpeg' ? 'jpg' : exportFormat;
    const dataUrl = canvas.toDataURL(mimeType, 0.96);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `dix-promo-${selectedTemplateId}-${activeCanvasPreset.width}x${activeCanvasPreset.height}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPdf = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDirectShare = async () => {
    const shareText = `${productTitle} — الآن بسعر ${formatNum(priceAfter)} ${currencySymbol} بدلاً من ${formatNum(priceBefore)} ${currencySymbol} (${badgePhrase})`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: productTitle,
          text: shareText,
          url: window.location.href,
        });
        setShareFeedback('تمت المشاركة بنجاح ✓');
        setTimeout(() => setShareFeedback(''), 3000);
        return;
      } catch (_e) {
        // Fallback to clipboard copy
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareText} - ${window.location.href}`);
      setShareFeedback('تم نسخ نص العرض والرابط ✓');
      setTimeout(() => setShareFeedback(''), 3000);
    }
  };

  return (
    <div
      className="space-y-6"
      data-testid="product-promo-badge-engine"
      data-active-template={selectedTemplateId}
      data-canvas-size={`${activeCanvasPreset.width}x${activeCanvasPreset.height}`}
    >
      {/* Studio Top Summary Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-l from-[#171206] via-[#0E0E0E] to-[#0A0A0A] px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37]">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-black text-white">
              استوديو تصميم عروض المنتجات وشارات الخصم — 16 قالباً تجارياً جاهزاً
            </h2>
            <p className="text-xs text-slate-400">
              اختر القالب من اليمين، عاين وحرك المنتج في المنتصف، وخصص الأسعار والشارات وحمّل التصميم فوراً من اليسار
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-[#F3E5AB] font-bold">
            القالب النشط: <strong className="text-[#D4AF37]">{activeTemplateObj.shortName}</strong>
          </span>
          <span className="font-num px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-700/40 text-emerald-300 font-bold">
            {activeCanvasPreset.width}×{activeCanvasPreset.height}px
          </span>
        </div>
      </div>

      {/* ====================================================================
       * 3-COLUMN PROFESSIONAL STUDIO LAYOUT (RTL: Right = Col 1, Center = Col 2, Left = Col 3)
       * ================================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* ------------------------------------------------------------------
         * COLUMN 1 (RIGHT IN RTL): 16-TEMPLATE GALLERY (`xl:col-span-3`)
         * ---------------------------------------------------------------- */}
        <div
          className="xl:col-span-3 rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-3.5 space-y-3"
          data-testid="promo-templates-gallery"
        >
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <h3 className="text-xs font-black text-white">
                معرض القوالب (16 قالباً)
              </h3>
            </div>
            <span className="font-num text-[10px] px-2 py-0.5 rounded-md bg-[#D4AF37]/15 text-[#F3E5AB] font-bold shrink-0">
              16 قالب
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            اضغط على أي قالب لتغيير الخلفية والإطارات والإضاءة فوراً:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2 max-h-[700px] overflow-y-auto pl-1">
            {PROMO_STUDIO_TEMPLATES.map((tpl) => {
              const isSelected = tpl.id === selectedTemplateId;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  data-testid={`promo-template-${tpl.id}`}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`group text-right rounded-xl p-2 border transition-all cursor-pointer flex items-center gap-2.5 ${
                    isSelected
                      ? 'border-[#D4AF37] bg-[#1C1606] shadow-[0_0_16px_rgba(212,175,55,0.2)]'
                      : 'border-neutral-800 bg-[#121212] hover:border-[#D4AF37]/50'
                  }`}
                >
                  {/* Visual Mini Preview Swatch */}
                  <div
                    className="w-12 h-12 rounded-lg border border-white/15 shrink-0 relative overflow-hidden flex flex-col items-center justify-center"
                    style={{ background: tpl.previewBg }}
                  >
                    <span className="font-num text-[10px] font-black px-1.5 py-0.5 rounded bg-black/70 text-white">
                      #{tpl.number}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`text-xs font-extrabold leading-snug ${
                          isSelected ? 'text-[#D4AF37]' : 'text-white'
                        }`}
                      >
                        {tpl.shortName}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />}
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1 leading-snug">
                      {tpl.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------------
         * COLUMN 2 (CENTER): LIVE INTERACTIVE CANVAS & QUICK CONTROLS (`xl:col-span-5`)
         * ---------------------------------------------------------------- */}
        <div className="xl:col-span-5 rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-4 space-y-4">
          {/* Aspect Ratio / Canvas Dimensions Switcher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F3E5AB]">
                مقاس لوحة الإعلان (Canvas):
              </span>
              <span className="font-num text-[11px] text-slate-400">
                {activeCanvasPreset.width}×{activeCanvasPreset.height} بكسل
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {CANVAS_SIZE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  data-testid={`canvas-size-${preset.id}`}
                  onClick={() => setCanvasSizeId(preset.id)}
                  className={`py-2 px-2 rounded-xl text-[11px] font-extrabold border transition-all cursor-pointer text-center ${
                    canvasSizeId === preset.id
                      ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                      : 'bg-[#141414] text-slate-300 border-neutral-800 hover:border-[#D4AF37]/50'
                  }`}
                >
                  <div>{preset.shortLabel}</div>
                  <div className="text-[10px] opacity-80 font-num">{preset.ratio}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Live HTML5 Canvas Container */}
          <div className="relative flex flex-col items-center justify-center rounded-2xl bg-[#111111] border border-neutral-800 p-3 sm:p-4 min-h-[360px]">
            <canvas
              ref={canvasRef}
              data-testid="promo-studio-canvas"
              className={`w-full rounded-xl border border-[#D4AF37]/30 shadow-2xl bg-black ${
                canvasSizeId === 'story'
                  ? 'max-w-[290px] aspect-[9/16]'
                  : canvasSizeId === 'landscape'
                  ? 'max-w-[460px] aspect-[1200/628]'
                  : 'max-w-[390px] aspect-square'
              }`}
            />
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
              <span>{activeTemplateObj.name}</span>
              <span>·</span>
              <span className="font-num text-[#D4AF37] font-bold">
                خصم {customDiscountPercent ?? discountMetrics.discountPercent}%
              </span>
            </div>
          </div>

          {/* Quick Product Image Manipulation Controls Under Canvas */}
          <div className="rounded-xl border border-neutral-800 bg-[#121212] p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F3E5AB]">
                تحكم سريع في موقع وحجم وظل المنتج:
              </span>
              <button
                type="button"
                onClick={() => {
                  setZoom(1);
                  setOffsetX(0);
                  setOffsetY(0);
                  setFlipX(false);
                  setDropShadow(true);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D4AF37] hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                aria-label="تكبير صورة المنتج"
                onClick={() => setZoom((z) => Math.min(2.2, Number((z + 0.1).toFixed(2))))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0A0A0A] border border-neutral-800 text-xs font-bold text-slate-200 hover:border-[#D4AF37] cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>تكبير +</span>
              </button>
              <button
                type="button"
                aria-label="تصغير صورة المنتج"
                onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.1).toFixed(2))))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0A0A0A] border border-neutral-800 text-xs font-bold text-slate-200 hover:border-[#D4AF37] cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>تصغير -</span>
              </button>
              <button
                type="button"
                aria-label="تحريك لأعلى"
                onClick={() => setOffsetY((y) => y - 24)}
                className="p-2 rounded-lg bg-[#0A0A0A] border border-neutral-800 text-slate-200 hover:border-[#D4AF37] cursor-pointer"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="تحريك لأسفل"
                onClick={() => setOffsetY((y) => y + 24)}
                className="p-2 rounded-lg bg-[#0A0A0A] border border-neutral-800 text-slate-200 hover:border-[#D4AF37] cursor-pointer"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="تحريك لليمين"
                onClick={() => setOffsetX((x) => x + 24)}
                className="p-2 rounded-lg bg-[#0A0A0A] border border-neutral-800 text-slate-200 hover:border-[#D4AF37] cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="تحريك لليسار"
                onClick={() => setOffsetX((x) => x - 24)}
                className="p-2 rounded-lg bg-[#0A0A0A] border border-neutral-800 text-slate-200 hover:border-[#D4AF37] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setFlipX((f) => !f)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer ${
                  flipX
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                    : 'bg-[#0A0A0A] text-slate-200 border-neutral-800 hover:border-[#D4AF37]'
                }`}
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
                <span>عكس الاتجاه</span>
              </button>
              <button
                type="button"
                onClick={() => setDropShadow((s) => !s)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer ${
                  dropShadow
                    ? 'bg-[#D4AF37]/20 text-[#F3E5AB] border-[#D4AF37]'
                    : 'bg-[#0A0A0A] text-slate-400 border-neutral-800'
                }`}
              >
                <span>{dropShadow ? '✓ ظل واقعي (Drop Shadow)' : 'تفعيل الظل الواقعي'}</span>
              </button>
            </div>

            {/* Built-in Sample Products Switcher (for testing without uploading) */}
            {!rawUploadedImg && (
              <div className="pt-2 border-t border-neutral-800/80 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 block">
                  منتج المعاينة الافتراضي (قبل رفع صورتك الخاصة):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {SAMPLE_PRODUCT_PRESETS.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => {
                        setSamplePresetId(sample.id);
                        setProductTitle(sample.defaultTitle);
                        setProductSubtitle(sample.defaultSubtitle);
                        setPriceBefore(sample.priceBefore);
                        setPriceAfter(sample.priceAfter);
                      }}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer truncate ${
                        samplePresetId === sample.id
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                          : 'bg-[#0A0A0A] text-slate-300 border-neutral-800 hover:border-[#D4AF37]/50'
                      }`}
                    >
                      {sample.label.split(' ')[0]} {sample.label.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------------
         * COLUMN 3 (LEFT IN RTL): CUSTOMIZATION, BADGES & EXPORT (`xl:col-span-4`)
         * ---------------------------------------------------------------- */}
        <div className="xl:col-span-4 rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-4 space-y-5">
          {/* 1. Upload Product Image + Auto White-BG Remover */}
          <div className="rounded-2xl border-2 border-dashed border-[#D4AF37]/50 bg-[#121212] p-3.5 space-y-3">
            <input
              ref={productFileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleProductFileChange}
              className="hidden"
            />
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-black text-white">
                  1. صورة المنتج (PNG / JPG / WebP)
                </span>
              </div>
              {rawUploadedImg && (
                <button
                  type="button"
                  onClick={() => {
                    setRawUploadedImg(null);
                    setProcessedUploadedImg(null);
                  }}
                  className="text-[11px] font-bold text-rose-400 hover:underline cursor-pointer"
                >
                  استعادة المنتج الافتراضي
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => productFileInputRef.current?.click()}
              className="w-full py-2.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#e3be42] text-black text-xs font-black inline-flex items-center justify-center gap-2 shadow cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>
                {rawUploadedImg ? 'تغيير صورة المنتج المرفوعة' : 'ارفع صورة منتجك من جهازك'}
              </span>
            </button>

            {/* Auto White Background Remover Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-neutral-800">
              <button
                type="button"
                data-testid="toggle-white-bg-remover"
                onClick={() => setAutoRemoveWhiteBg((v) => !v)}
                className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border cursor-pointer ${
                  autoRemoveWhiteBg
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-[#0A0A0A] border-neutral-800 text-slate-300'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  {autoRemoveWhiteBg
                    ? '✓ إزالة الخلفية البيضاء تلقائياً مفعّلة'
                    : 'تفريغ الخلفية البيضاء تلقائياً (White-BG Remover)'}
                </span>
              </button>

              {autoRemoveWhiteBg && (
                <div className="flex items-center gap-2 w-full pt-1">
                  <span className="text-[10px] text-slate-400">حساسية التفريغ:</span>
                  <input
                    type="range"
                    min="200"
                    max="252"
                    value={whiteBgThreshold}
                    onChange={(e) => setWhiteBgThreshold(Number(e.target.value))}
                    className="flex-1 accent-[#D4AF37]"
                  />
                  <span className="font-num text-[10px] text-[#D4AF37] font-bold">
                    {whiteBgThreshold}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 2. Product Texts & Pricing */}
          <div className="space-y-3 border-t border-neutral-800 pt-4">
            <h3 className="text-xs font-black text-[#D4AF37] flex items-center gap-1.5">
              <Tag className="w-4 h-4" />
              <span>2. تخصيص النصوص والأسعار ونسبة الخصم</span>
            </h3>

            <div className="space-y-1">
              <label htmlFor="promo-title-in" className="text-[11px] font-bold text-slate-300 block">
                اسم المنتج الرئيسي
              </label>
              <input
                id="promo-title-in"
                type="text"
                data-testid="promo-product-title-input"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                placeholder="مثال: حذاء رياضي الترا أو سماعة بلوتوث برو"
                className="w-full rounded-xl bg-[#141414] border border-neutral-800 px-3.5 py-2 text-xs font-bold text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="promo-sub-in" className="text-[11px] font-bold text-slate-300 block">
                الوصف الفرعي أو الميزة التنافسية
              </label>
              <input
                id="promo-sub-in"
                type="text"
                data-testid="promo-product-subtitle-input"
                value={productSubtitle}
                onChange={(e) => setProductSubtitle(e.target.value)}
                placeholder="مثال: خامة أصلية - ضمان سنة - شحن فوري"
                className="w-full rounded-xl bg-[#141414] border border-neutral-800 px-3.5 py-2 text-xs text-slate-200 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label htmlFor="promo-before-in" className="text-[11px] font-bold text-slate-400 block">
                  السعر قبل الخصم ({currencySymbol})
                </label>
                <input
                  id="promo-before-in"
                  type="number"
                  value={priceBefore}
                  onChange={(e) => {
                    setPriceBefore(Number(e.target.value));
                    setCustomDiscountPercent(null);
                  }}
                  className="font-num w-full rounded-xl bg-[#141414] border border-neutral-800 px-3.5 py-2 text-xs font-bold text-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="promo-after-in" className="text-[11px] font-bold text-[#D4AF37] block">
                  السعر بعد الخصم ({currencySymbol})
                </label>
                <input
                  id="promo-after-in"
                  type="number"
                  data-testid="promo-price-after-input"
                  value={priceAfter}
                  onChange={(e) => {
                    setPriceAfter(Number(e.target.value));
                    setCustomDiscountPercent(null);
                  }}
                  className="font-num w-full rounded-xl bg-[#141414] border border-[#D4AF37]/50 px-3.5 py-2 text-xs font-black text-[#D4AF37]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <label htmlFor="promo-curr-sel" className="text-[11px] font-bold text-slate-300">
                العملة المعروضة على التصميم:
              </label>
              <select
                id="promo-curr-sel"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="rounded-xl bg-[#141414] border border-neutral-800 px-3 py-1.5 text-xs font-bold text-white"
              >
                <option value="ج.م">ج.م (جنيه مصري)</option>
                <option value="ر.س">ر.س (ريال سعودي)</option>
                <option value="د.إ">د.إ (درهم إماراتي)</option>
                <option value="د.ك">د.ك (دينار كويتي)</option>
                <option value="$">$ (دولار أمريكي)</option>
              </select>
            </div>

            {/* Discount Slider (10% to 80%) */}
            <div className="rounded-xl bg-[#141414] border border-neutral-800 p-3 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-300">شريط تحديد نسبة الخصم السريع:</span>
                <span className="font-num font-black text-[#D4AF37]">
                  خصم {customDiscountPercent ?? discountMetrics.discountPercent}% (توفير{' '}
                  {formatNum(discountMetrics.discountAmount)} {currencySymbol})
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={customDiscountPercent ?? (discountMetrics.discountPercent || 25)}
                onChange={(e) => handleApplyDiscountSlider(e.target.value)}
                className="w-full accent-[#D4AF37]"
              />
              <div className="flex justify-between font-num text-[10px] text-slate-400">
                <span>10%</span>
                <span>25%</span>
                <span>50%</span>
                <span>70%</span>
                <span>80%</span>
              </div>
            </div>

            {/* 1-Click Ready Promo Phrases */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#F3E5AB] block">
                عبارات ترويجية جاهزة بضغطة زر:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PROMO_QUICK_PHRASES.map((phrase) => (
                  <button
                    key={phrase}
                    type="button"
                    onClick={() => setBadgePhrase(phrase)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                      badgePhrase === phrase
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-[#141414] text-slate-300 border border-neutral-800 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Call To Action (CTA) + Merchant Phone & Store Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="space-y-1">
                <label htmlFor="promo-cta-in" className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#D4AF37]" />
                  <span>نص زر الشراء ورقم الواتساب</span>
                </label>
                <input
                  id="promo-cta-in"
                  type="text"
                  value={merchantPhone}
                  onChange={(e) => setMerchantPhone(e.target.value)}
                  placeholder="01000000000"
                  className="font-num w-full rounded-xl bg-[#141414] border border-neutral-800 px-3 py-2 text-xs font-bold text-white"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="promo-store-in" className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <Store className="w-3 h-3 text-[#D4AF37]" />
                  <span>اسم المتجر / العلامة التجارية</span>
                </label>
                <input
                  id="promo-store-in"
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="متجر النخبة"
                  className="w-full rounded-xl bg-[#141414] border border-neutral-800 px-3 py-2 text-xs font-bold text-white"
                />
              </div>
            </div>
          </div>

          {/* 3. Circular Stamps & Corner Ribbons Library */}
          <div className="space-y-3 border-t border-neutral-800 pt-4">
            <h3 className="text-xs font-black text-[#D4AF37] flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>3. مكتبة الأختام الدائرية والشرائط الركنية</span>
            </h3>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-300 block">
                الختم الدائري المذهب / الأحمر (Circular Stamp):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PROMO_CIRCULAR_STAMPS.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    data-testid={`stamp-btn-${st.id}`}
                    onClick={() => setActiveStampId(st.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold border cursor-pointer ${
                      activeStampId === st.id
                        ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                        : 'bg-[#141414] text-slate-300 border-neutral-800 hover:border-[#D4AF37]/40'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-300 block">
                الشريط الركني المائل (Corner Ribbon):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {PROMO_CORNER_RIBBONS.map((rib) => (
                  <button
                    key={rib.id}
                    type="button"
                    data-testid={`ribbon-btn-${rib.id}`}
                    onClick={() => setCornerRibbonId(rib.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border cursor-pointer ${
                      cornerRibbonId === rib.id
                        ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                        : 'bg-[#141414] text-slate-300 border-neutral-800'
                    }`}
                  >
                    {rib.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Store Logo Upload & Watermark Info */}
            <div className="flex items-center justify-between gap-2 rounded-xl bg-[#141414] border border-neutral-800 p-3">
              <input
                ref={logoFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoFileChange}
                className="hidden"
              />
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-white block">
                  شعار متجرك الخاص (Store Logo)
                </span>
                <span className="text-[10px] text-slate-400 block">
                  العلامة المائية لـ Dix Tools:{' '}
                  <strong className="text-[#D4AF37]">
                    {showDixWatermark ? 'مفعّلة (تُدار من DixDev)' : 'مخفية من الإدارة'}
                  </strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => logoFileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-[#0A0A0A] border border-[#D4AF37]/50 text-[#F3E5AB] text-[11px] font-bold hover:bg-[#D4AF37] hover:text-black transition-colors cursor-pointer shrink-0"
              >
                {logoImg ? 'تغيير الشعار ✓' : '+ رفع لوجو المتجر'}
              </button>
            </div>
          </div>

          {/* AdSlot BEFORE Download Action Button */}
          <AdSlot
            slotId="3030394852"
            placement="before_action_button"
            categoryId="images"
            label="منطقة النقرة الذهبية — قبل تحميل صورة العرض"
          />

          {/* 4. Instant Export Buttons (PNG / JPG / WebP + PDF Print + Direct Share) */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-300">صيغة التحميل المباشر:</span>
              <div className="flex gap-1.5">
                {[
                  { id: 'png', label: 'PNG شفافة/فائقة' },
                  { id: 'jpeg', label: 'JPG مضغوطة' },
                  { id: 'webp', label: 'WebP سريعة' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setExportFormat(fmt.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold cursor-pointer ${
                      exportFormat === fmt.id
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-[#141414] text-slate-300 border border-neutral-800'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              data-testid="download-promo-png-btn"
              onClick={handleDownloadImage}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black text-xs sm:text-sm font-black shadow-lg hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>
                📥 تحميل التصميم بجودة عالية ({exportFormat.toUpperCase()} ·{' '}
                {activeCanvasPreset.width}×{activeCanvasPreset.height})
              </span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                data-testid="export-promo-pdf-btn"
                onClick={handlePrintPdf}
                className="py-2.5 px-3 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#D4AF37]" />
                <span>📄 تصدير PDF للطباعة</span>
              </button>

              <button
                type="button"
                data-testid="share-promo-btn"
                onClick={handleDirectShare}
                className="py-2.5 px-3 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] border border-neutral-800 text-slate-200 text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-emerald-400" />
                <span>{shareFeedback || '📤 مشاركة مباشرة'}</span>
              </button>
            </div>
          </div>

          {/* AdSlot AFTER Download Action Button */}
          <AdSlot
            slotId="4040495863"
            placement="inside_result_box"
            categoryId="images"
            label="إعلان أسفل تحميل التصميم"
          />
        </div>
      </div>
    </div>
  );
}
