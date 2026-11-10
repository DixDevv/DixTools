'use client';

import React from 'react';
import { MATRIX_CATEGORIES } from '../lib/tools-matrix-generator';

/**
 * ============================================================================
 * Dix Tools Brand Logo & Header (`components/Header.jsx`)
 * Luxury Black & Gold Header featuring:
 * - 3D Isometric Tech Cube SVG Icon with Golden Glow (`#D4AF37`)
 * - Wordmark: `Dix` in Royal Gold (`#D4AF37`) + `Tools` in Pure White (`#FFFFFF`)
 * - Arabic Subtitle: منصة ديكس تولز للخدمات والأدوات الذكية
 * ============================================================================
 */
export function DixToolsBrandLogo({ onClick, size = 'md', testId }) {
  const isLarge = size === 'lg';

  return (
    <div
      data-testid={testId}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className="group inline-flex items-center gap-3 select-none cursor-pointer focus:outline-none"
    >
      {/* Custom Dix Tools Logo Image with Glow */}
      <div
        className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#1C1607] via-[#121212] to-[#0A0A0A] border border-[#D4AF37]/60 shadow-[0_0_22px_rgba(212,175,55,0.32)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.55)] transition-all overflow-hidden ${
          isLarge ? 'w-12 h-12' : 'w-10 h-10'
        }`}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl bg-[#D4AF37]/10 blur-md group-hover:bg-[#D4AF37]/20 transition-all"
        />
        <img
          src="/assets/aistudio/MY_LOGO__e0c9a45b.png"
          alt="Dix Tools"
          className={`${isLarge ? 'w-11 h-11' : 'w-9 h-9'} relative z-10 object-contain drop-shadow-[0_0_8px_rgba(212,175,55,0.65)]`}
        />
      </div>

      {/* Brand Wordmark: Dix (Royal Gold #D4AF37) + Tools (White #FFFFFF) */}
      <div className="flex flex-col text-right">
        <div
          dir="ltr"
          className={`font-extrabold tracking-tight leading-none flex items-center gap-1 ${
            isLarge ? 'text-2xl' : 'text-xl'
          }`}
        >
          <span className="text-[#D4AF37] drop-shadow-[0_0_12px_rgba(212,175,55,0.45)]">
            Dix
          </span>
          <span className="text-white">Tools</span>
        </div>
        <span className="text-[10px] font-bold text-slate-400 tracking-wide mt-0.5">
          منصة ديكس تولز للأدوات الذكية
        </span>
      </div>
    </div>
  );
}

import PWAInstallBanner from './PWAInstallBanner';
import { Search, WifiOff, Globe } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

export default function Header({
  activeView = 'home',
  activeCategory = 'all',
  onNavigateHome,
  onOpenFeaturedTool,
}) {
  let siteConfigCtx = null;
  try {
    siteConfigCtx = useSiteConfig();
  } catch (_e) {
    siteConfigCtx = null;
  }

  const isOfflineMode = siteConfigCtx?.isOfflineMode === true;
  const setIsCommandPaletteOpen = siteConfigCtx?.setIsCommandPaletteOpen;
  const siteLang = siteConfigCtx?.siteLang || 'ar';
  const toggleSiteLanguage = siteConfigCtx?.toggleSiteLanguage;
  const langSwitcherEnabled =
    siteConfigCtx?.config?.viralFeatures?.languageSwitcherEnabled !== false;

  const isEn = siteLang === 'en';

  return (
    <header className="no-print sticky top-0 z-30 border-b border-neutral-800/90 bg-[#0A0A0A]/95 backdrop-blur-md">
      {/* Offline Status Banner when navigator.onLine === false */}
      {isOfflineMode && (
        <div
          data-testid="offline-status-banner"
          className="bg-amber-950/90 border-b border-[#D4AF37]/40 px-4 py-1.5 text-center text-xs font-extrabold text-[#F3E5AB] flex items-center justify-center gap-2"
        >
          <WifiOff className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>
            {isEn
              ? 'Offline Mode — Running on latest cached Egypt rates'
              : 'وضع عدم الاتصال - يعمل بآخر تحديث محفوظ'}
          </span>
        </div>
      )}

      {/* Mobile One-Click PWA Install Bar */}
      <PWAInstallBanner variant="mobile-bar" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Dix Tools Luxury Brand Logo */}
        <DixToolsBrandLogo
          testId="header-dix-tools-logo"
          onClick={() => onNavigateHome && onNavigateHome('all')}
        />

        {/* Zone 2: Primary Pillar & Category Navigation */}
        <nav
          aria-label="التنقل الرئيسي في منصة Dix Tools"
          className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-300"
        >
          <button
            type="button"
            onClick={() => onNavigateHome && onNavigateHome('all')}
            className={`hover:text-[#D4AF37] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeView === 'home' && activeCategory === 'all' ? 'text-[#D4AF37] font-bold' : ''
            }`}
          >
            {isEn ? 'Home' : 'الرئيسية'}
          </button>
          {MATRIX_CATEGORIES.slice(0, 4).map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => onNavigateHome && onNavigateHome(cat.slug)}
              className={`hover:text-[#D4AF37] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeCategory === cat.slug ? 'text-[#D4AF37] font-bold' : ''
              }`}
            >
              {isEn ? cat.slug.toUpperCase() : cat.shortName}
            </button>
          ))}
        </nav>

        {/* Zone 3: Quick Search (Ctrl+K), AR/EN Language Switcher, PWA Install CTA & Featured Tool CTA */}
        <div className="flex items-center gap-2 shrink-0">
          {setIsCommandPaletteOpen && (
            <button
              type="button"
              data-testid="header-command-palette-btn"
              onClick={() => setIsCommandPaletteOpen(true)}
              title="البحث السريع في الأدوات (Ctrl + K)"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#141414] hover:bg-[#1C1C1C] border border-[#D4AF37]/40 text-xs font-extrabold text-[#F3E5AB] cursor-pointer transition-all"
            >
              <Search className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden lg:inline">{isEn ? 'Quick Search' : 'بحث فوري'}</span>
              <kbd
                dir="ltr"
                className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-[#0A0A0A] border border-neutral-800 text-[10px] font-num text-[#D4AF37]"
              >
                Ctrl+K
              </kbd>
            </button>
          )}

          {langSwitcherEnabled && toggleSiteLanguage && (
            <button
              type="button"
              data-testid="header-lang-switcher"
              onClick={toggleSiteLanguage}
              aria-label="تبديل لغة الواجهة AR / EN"
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-[#141414] hover:bg-[#1C1C1C] border border-neutral-800 hover:border-[#D4AF37]/60 text-xs font-black text-[#D4AF37] cursor-pointer transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="font-num">{isEn ? 'AR عربي' : 'EN / ع'}</span>
            </button>
          )}

          <div className="hidden sm:block">
            <PWAInstallBanner variant="header" />
          </div>
          <button
            type="button"
            onClick={() => onOpenFeaturedTool && onOpenFeaturedTool()}
            className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-xs sm:text-sm font-extrabold hover:bg-[#e5c247] shadow-[0_0_16px_rgba(212,175,55,0.3)] transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isEn ? 'Gold & Zakat Hub' : 'حاسبة الذهب والزكاة'}
          </button>
        </div>
      </div>
    </header>
  );
}
