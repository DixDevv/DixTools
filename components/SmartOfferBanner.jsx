'use client';

import React from 'react';
import { Sparkles, ExternalLink, MessageCircle, ShieldCheck } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

/**
 * SmartOfferBanner (`components/SmartOfferBanner.jsx`)
 * Renders a luxury Black & Gold High-CPC / Affiliate / WhatsApp Smart Offer Card
 * directly below the calculator result box. Fully controlled from the Stealth Admin
 * Panel (`DixDev` / PIN: `1238`) with per-category dynamic offer customization.
 */
export default function SmartOfferBanner({ category = 'default', toolTitle = '' }) {
  let siteConfigCtx = null;
  try {
    siteConfigCtx = useSiteConfig();
  } catch (_e) {
    siteConfigCtx = null;
  }

  const offerCfg = siteConfigCtx?.config?.smartOfferConfig;
  if (offerCfg && offerCfg.enabled === false) {
    return null;
  }

  const catOverride = offerCfg?.categoryOffers?.[category] || {};
  const badgeText = offerCfg?.badgeText || 'عرض حصري مخصص لك · Smart Offer';
  const title =
    catOverride.title ||
    offerCfg?.title ||
    'احصل على أفضل عرض سبائك ذهب معتمدة واستشارات مالية فورية بأقل مصنعية في مصر';
  const description =
    catOverride.description ||
    offerCfg?.description ||
    'شحن مؤمّن لجميع المحافظات الـ 27 مع فاتورة ضريبية رسمية وكاش باك فوري عند إعادة البيع.';
  const ctaLabel = catOverride.ctaLabel || offerCfg?.ctaLabel || 'استفد من العرض الآن';
  const storeUrl = catOverride.storeUrl || offerCfg?.storeUrl || '#/gold/gold-vs-bank-comparator';
  const whatsappNumber = (offerCfg?.whatsappNumber || '201000000000').replace(/\D/g, '');
  const whatsappText = encodeURIComponent(
    `${offerCfg?.whatsappMessage || 'مرحباً، أرغب في الاستفسار عن العرض الحصري عبر منصة Dix Tools'}${
      toolTitle ? ` (بخصوص: ${toolTitle})` : ''
    }`
  );
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;

  return (
    <div
      data-testid="smart-offer-banner"
      className="no-print relative overflow-hidden rounded-2xl border border-[#D4AF37]/50 bg-gradient-to-l from-[#1A1508] via-[#121212] to-[#0A0A0A] p-5 shadow-[0_12px_35px_rgba(0,0,0,0.75)] transition-all hover:border-[#D4AF37]"
    >
      {/* Subtle top metallic highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-80" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[11px] font-extrabold text-[#F3E5AB]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{badgeText}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>شريك موثوق · Dix Tools</span>
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-black text-white leading-snug">{title}</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href={storeUrl}
            data-testid="smart-offer-cta-link"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-l from-[#D4AF37] to-[#F3E5AB] text-black text-xs font-black shadow-[0_6px_20px_rgba(212,175,55,0.28)] hover:brightness-110 transition-all"
          >
            <span>{ctaLabel}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="smart-offer-whatsapp-link"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold transition-all"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>تواصل واتساب</span>
          </a>
        </div>
      </div>
    </div>
  );
}
