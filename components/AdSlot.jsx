'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ExternalLink,
  ShieldCheck,
  X,
  Clock,
  AlertTriangle,
  RefreshCw,
  ShoppingBag,
  MessageCircle,
  Award,
} from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

const LEGACY_PLACEMENT_ALIAS = {
  'top-leaderboard': 'header_banner',
  'in-article-mid': 'above_tool_workspace',
  'Sticky-bottom-mobile': 'sticky_bottom_mobile',
  'post-result': 'inside_result_box',
};

/**
 * 1. درع استرداد أرباح مانع الإعلانات (AntiAdBlockFallback - House Affiliate / Store Banner)
 * Displays a luxury customizable House Affiliate / E-Commerce / WhatsApp Store Banner
 * whenever AdSense is blocked by the visitor's browser or when previewed from DixDev.
 */
export function AntiAdBlockFallback({
  fallbackConfig = {},
  placement = 'above_tool_workspace',
  onCtaClick,
  className = '',
}) {
  const badgeText =
    fallbackConfig.badgeText || 'عرض بديل حصري · House Affiliate Banner';
  const headline =
    fallbackConfig.headline ||
    'متجر شركاء Dix Tools: سبائك ذهب معتمدة وبرامج تجارة إلكترونية بخصم فوري 25%';
  const subtext =
    fallbackConfig.subtext ||
    'تغليف مؤمّن بالباركود الملكي · شحن سريع للـ 27 محافظة · استشارة مجانية عبر واتساب';
  const ctaText =
    fallbackConfig.ctaText || 'انتقل للمتجر أو تواصل عبر واتساب الآن';
  const ctaUrl =
    fallbackConfig.ctaUrl ||
    'https://wa.me/201000000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20Dix%20Tools';
  const iconType = fallbackConfig.iconType || 'gold-store';

  const IconComponent =
    iconType === 'whatsapp-vip'
      ? MessageCircle
      : iconType === 'ecommerce-pro'
      ? ShoppingBag
      : Award;

  return (
    <aside
      data-testid={`anti-adblock-fallback-${placement}`}
      aria-label={badgeText}
      className={`no-print w-full rounded-2xl border-2 border-[#D4AF37]/70 bg-gradient-to-l from-[#171307] via-[#0E0E0E] to-[#171206] p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${className}`}
    >
      <div className="flex items-start gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0 shadow-md">
          <IconComponent className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[10px] font-black text-[#F3E5AB]">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>{badgeText}</span>
          </div>
          <h3 className="text-sm sm:text-base font-black text-white leading-snug">
            {headline}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">{subtext}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <a
          href={ctaUrl}
          target={ctaUrl.startsWith('http') ? '_blank' : undefined}
          rel={ctaUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
          onClick={onCtaClick}
          data-testid="anti-adblock-fallback-cta"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-l from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black text-xs font-black hover:brightness-110 transition-all shadow-lg"
        >
          <span>{ctaText}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </aside>
  );
}

export default function AdSlot({
  placement = 'above_tool_workspace',
  categorySlug = '',
  category = '',
  label,
  className = '',
}) {
  const { config, recordAdImpression, recordAdClick } = useSiteConfig();
  const resolvedKey = LEGACY_PLACEMENT_ALIAS[placement] || placement;
  const adConfig = config.adConfig;
  const placementCfg = adConfig?.placements?.[resolvedKey];

  const [activeVariant, setActiveVariant] = useState('A');
  const [refreshTick, setRefreshTick] = useState(0);
  const [isBrowserAdBlocked, setIsBrowserAdBlocked] = useState(false);
  const impressionLoggedRef = useRef(false);

  // Smart AdBlock detection inside AdSlot
  useEffect(() => {
    if (typeof window === 'undefined' || !adConfig?.adBlockDetectorEnabled) {
      setIsBrowserAdBlocked(false);
      return undefined;
    }
    const bait = document.createElement('div');
    bait.className = 'adsbox pub_300x250 ad-banner google-ad-slot';
    bait.style.position = 'absolute';
    bait.style.left = '-9999px';
    bait.style.height = '10px';
    bait.style.width = '10px';
    document.body.appendChild(bait);

    const timer = window.setTimeout(() => {
      const blocked =
        bait.offsetHeight === 0 ||
        bait.clientHeight === 0 ||
        window.getComputedStyle(bait).display === 'none';
      if (blocked) {
        setIsBrowserAdBlocked(true);
      }
      bait.remove();
    }, 250);

    return () => {
      window.clearTimeout(timer);
      bait.remove();
    };
  }, [adConfig?.adBlockDetectorEnabled]);

  // Pick initial A/B variant (50% / 50%) when abSplitEnabled is true
  useEffect(() => {
    if (placementCfg?.abSplitEnabled) {
      setActiveVariant(Math.random() < 0.5 ? 'B' : 'A');
    } else {
      setActiveVariant('A');
    }
  }, [placementCfg?.abSplitEnabled, resolvedKey]);

  // Auto-refresh timer if autoRefreshSeconds > 0
  useEffect(() => {
    const sec = Number(placementCfg?.autoRefreshSeconds || 0);
    if (!placementCfg?.enabled || adConfig?.globalKillSwitch || sec < 15) return undefined;
    const timer = window.setInterval(() => {
      setRefreshTick((t) => t + 1);
      if (placementCfg?.abSplitEnabled) {
        setActiveVariant((prev) => (prev === 'A' ? 'B' : 'A'));
      }
      if (recordAdImpression) {
        recordAdImpression(resolvedKey, activeVariant);
      }
    }, sec * 1000);
    return () => window.clearInterval(timer);
  }, [
    placementCfg?.autoRefreshSeconds,
    placementCfg?.enabled,
    placementCfg?.abSplitEnabled,
    adConfig?.globalKillSwitch,
    resolvedKey,
    activeVariant,
    recordAdImpression,
  ]);

  // Record initial impression once per mount
  useEffect(() => {
    if (
      !impressionLoggedRef.current &&
      adConfig &&
      !adConfig.globalKillSwitch &&
      placementCfg?.enabled &&
      recordAdImpression
    ) {
      impressionLoggedRef.current = true;
      recordAdImpression(resolvedKey, activeVariant);
    }
  }, [adConfig, placementCfg?.enabled, resolvedKey, activeVariant, recordAdImpression]);

  if (!adConfig || adConfig.globalKillSwitch || !placementCfg || !placementCfg.enabled) {
    return null;
  }

  const fallbackCfg = adConfig.antiAdBlockFallback || {};
  const shouldShowAntiAdBlockFallback =
    fallbackCfg.enabled !== false &&
    (isBrowserAdBlocked || Boolean(fallbackCfg.simulateBlocked));

  const handleAdClick = () => {
    if (recordAdClick) {
      recordAdClick(resolvedKey, activeVariant);
    }
  };

  if (shouldShowAntiAdBlockFallback) {
    return (
      <AntiAdBlockFallback
        fallbackConfig={fallbackCfg}
        placement={resolvedKey}
        onCtaClick={handleAdClick}
        className={className}
      />
    );
  }

  const effectiveCat = categorySlug || category;
  const catOverride =
    effectiveCat &&
    adConfig.categoryOverrides?.[effectiveCat] &&
    adConfig.categoryOverrides[effectiveCat].enabled
      ? adConfig.categoryOverrides[effectiveCat]
      : null;

  const useVariantB = placementCfg.abSplitEnabled && activeVariant === 'B';

  const activeHeadline =
    catOverride?.headline ||
    (useVariantB && placementCfg.headlineB ? placementCfg.headlineB : placementCfg.headline);
  const activeSubtext =
    catOverride?.subtext ||
    (useVariantB && placementCfg.subtextB ? placementCfg.subtextB : placementCfg.subtext);
  const activeCtaText =
    catOverride?.ctaText ||
    (useVariantB && placementCfg.ctaTextB ? placementCfg.ctaTextB : placementCfg.ctaText);
  const activeCtaUrl =
    catOverride?.ctaUrl ||
    (useVariantB && placementCfg.ctaUrlB ? placementCfg.ctaUrlB : placementCfg.ctaUrl) ||
    '#tools-workspace';
  const activeCustomHtml =
    useVariantB && placementCfg.customHtmlB ? placementCfg.customHtmlB : placementCfg.customHtml;
  const activeBadge = catOverride?.badgeText || label || placementCfg.badgeText || 'إعلان ممول';

  // Device targeting visibility class (`all` | `mobile-only` | `desktop-only`)
  const deviceVisibilityClass =
    placementCfg.deviceTarget === 'mobile-only'
      ? 'md:hidden'
      : placementCfg.deviceTarget === 'desktop-only'
      ? 'hidden md:flex'
      : 'flex';

  const minHeightClass =
    placementCfg.minHeightPx >= 180
      ? 'min-h-[210px]'
      : placementCfg.minHeightPx >= 95
      ? 'min-h-[100px]'
      : 'min-h-[88px]';

  if (resolvedKey === 'in_feed_tools_grid') {
    return (
      <aside
        aria-label={activeBadge}
        data-ad-placement={resolvedKey}
        data-ad-variant={useVariantB ? 'B' : 'A'}
        className={`no-print rounded-2xl border border-[#D4AF37]/45 bg-gradient-to-br from-[#171307] via-[#121212] to-[#0A0A0A] p-5 ${deviceVisibilityClass} flex-col justify-between gap-4 shadow-lg ${minHeightClass} ${className}`}
      >
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#D4AF37]/20 text-[11px] font-bold text-[#F3E5AB]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              {activeBadge}
            </span>
            <span className="font-num text-[11px] text-slate-500">
              Ad #{placementCfg.slotId} {placementCfg.abSplitEnabled ? `· A/B (${activeVariant})` : ''}
            </span>
          </div>
          {placementCfg.networkType === 'custom_html' && activeCustomHtml ? (
            <div
              onClick={handleAdClick}
              className="text-xs text-slate-200 overflow-hidden"
              dangerouslySetInnerHTML={{ __html: activeCustomHtml }}
            />
          ) : (
            <>
              <h3 className="text-base font-extrabold text-white leading-snug">{activeHeadline}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{activeSubtext}</p>
            </>
          )}
        </div>
        <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
          <span className="text-[11px] text-[#D4AF37] font-semibold">برعاية Dix Tools</span>
          <a
            href={activeCtaUrl}
            onClick={handleAdClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#D4AF37] text-black text-xs font-extrabold hover:bg-[#e5c148] transition-colors"
          >
            <span>{activeCtaText}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </aside>
    );
  }

  return (
    <aside
      aria-label={`${activeBadge} (${resolvedKey})`}
      data-ad-placement={resolvedKey}
      data-ad-slot={placementCfg.slotId}
      data-ad-variant={useVariantB ? 'B' : 'A'}
      className={`no-print w-full rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-l from-[#141414] via-[#101010] to-[#171308] p-3.5 sm:p-4 ${deviceVisibilityClass} flex-col justify-between ${minHeightClass} shadow-md ${className}`}
    >
      <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 border-b border-neutral-800/80 pb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#D4AF37]" />
          <span className="font-bold text-[#F3E5AB]">{activeBadge}</span>
          <span aria-hidden="true">·</span>
          <span className="font-num text-slate-500">
            Slot ({placementCfg.slotId})
            {placementCfg.abSplitEnabled ? ` · Variant ${activeVariant}` : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {Number(placementCfg.autoRefreshSeconds) > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-num">
              <RefreshCw className="w-2.5 h-2.5" />
              {placementCfg.autoRefreshSeconds}s #{refreshTick}
            </span>
          )}
          <span className="font-num text-[10px] text-slate-500">{placementCfg.format}</span>
        </div>
      </div>

      {placementCfg.networkType === 'custom_html' && activeCustomHtml ? (
        <div
          onClick={handleAdClick}
          className="py-2 text-xs text-slate-200 overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: activeCustomHtml }}
        />
      ) : (
        <div className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>{activeHeadline}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{activeSubtext}</p>
          </div>
          <a
            href={activeCtaUrl}
            onClick={handleAdClick}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-xs font-extrabold hover:bg-[#e5c148] transition-colors shrink-0"
          >
            <span>{activeCtaText}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-neutral-900">
        <span className="inline-flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
          مساحة محجوزة مسبقاً لمنع اهتزاز الصفحة (CLS = 0)
        </span>
        <span className="font-num">{placementCfg.networkType}</span>
      </div>
    </aside>
  );
}

export function GlobalAdOpsOverlays() {
  const { config, interstitialState, closeInterstitialModal, recordAdClick } = useSiteConfig();
  const { adConfig } = config;
  const stickyCfg = adConfig.placements?.sticky_bottom_mobile;
  const interstitialCfg = adConfig.placements?.interstitial_download_modal;

  const [stickyDismissed, setStickyDismissed] = useState(false);
  const [countdown, setCountdown] = useState(adConfig.interstitialWaitSeconds || 4);
  const [adBlockDetected, setAdBlockDetected] = useState(false);

  useEffect(() => {
    if (!adConfig.adBlockDetectorEnabled || adConfig.globalKillSwitch) {
      setAdBlockDetected(false);
      return;
    }
    const bait = document.createElement('div');
    bait.className = 'adsbox pub_300x250 ad-banner';
    bait.style.position = 'absolute';
    bait.style.left = '-9999px';
    bait.style.height = '10px';
    document.body.appendChild(bait);
    const timer = setTimeout(() => {
      if (bait.offsetHeight === 0) setAdBlockDetected(true);
      bait.remove();
    }, 350);
    return () => {
      clearTimeout(timer);
      bait.remove();
    };
  }, [adConfig.adBlockDetectorEnabled, adConfig.globalKillSwitch]);

  useEffect(() => {
    if (!interstitialState.isOpen) return;
    setCountdown(adConfig.interstitialWaitSeconds || 4);
    const interval = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [interstitialState.isOpen, adConfig.interstitialWaitSeconds]);

  if (adConfig.globalKillSwitch) return null;

  return (
    <>
      {stickyCfg && stickyCfg.enabled && !stickyDismissed && (
        <div
          data-testid="sticky-bottom-mobile-ad"
          className="no-print fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#0D0D0D]/95 backdrop-blur-md border-t border-[#D4AF37]/50 px-3 py-2 shadow-2xl"
        >
          <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-[#D4AF37] block">{stickyCfg.badgeText}</span>
              <p className="text-xs font-bold text-white truncate">{stickyCfg.headline}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={stickyCfg.ctaUrl || '#tools-workspace'}
                onClick={() => recordAdClick && recordAdClick('sticky_bottom_mobile', 'A')}
                className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-extrabold"
              >
                {stickyCfg.ctaText}
              </a>
              <button
                type="button"
                onClick={() => setStickyDismissed(true)}
                aria-label="إغلاق الإعلان العائم"
                className="p-1 rounded-lg bg-neutral-900 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {interstitialState.isOpen && interstitialCfg && (
        <div
          role="dialog"
          aria-modal="true"
          data-testid="interstitial-download-modal"
          className="no-print fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-lg rounded-3xl border border-[#D4AF37] bg-[#141414] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F3E5AB]">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span>{interstitialState.title}</span>
              </div>
              <button
                type="button"
                onClick={() => closeInterstitialModal(false)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                إلغاء ×
              </button>
            </div>
            <AdSlot placement="interstitial_download_modal" />
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                {countdown > 0
                  ? `سيكون ملفك جاهزاً خلال ${countdown} ثوانٍ...`
                  : 'تم تجهيز المستند بالكامل للطباعة والتحميل!'}
              </span>
              <button
                type="button"
                disabled={countdown > 0}
                onClick={() => closeInterstitialModal(true)}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                  countdown > 0
                    ? 'bg-neutral-800 text-slate-400 cursor-not-allowed'
                    : 'bg-[#D4AF37] text-black hover:bg-[#e5c247] cursor-pointer'
                }`}
              >
                {countdown > 0 ? `انتظر (${countdown}ث)` : 'متابعة التحميل والطباعة الآن'}
              </button>
            </div>
          </div>
        </div>
      )}

      {adBlockDetected && adConfig.adBlockRecoveryMode === 'polite-modal' && (
        <div className="no-print fixed bottom-4 left-4 z-40 max-w-sm rounded-2xl border border-[#D4AF37] bg-[#141414] p-4 shadow-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#D4AF37] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              دعم استمرار أدوات Dix Tools مجاناً
            </span>
            <button
              type="button"
              onClick={() => setAdBlockDetected(false)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              ×
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            جميع الحاسبات والعقود مجانية 100%؛ إيقاف مانع الإعلانات يدعم بقاء الخدمة مجانية للجميع.
          </p>
        </div>
      )}
    </>
  );
}
