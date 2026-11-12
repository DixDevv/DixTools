import React, { useState, useEffect, useMemo } from 'react';
import {
  MATRIX_CATEGORIES,
  SITE_CONFIG,
  getAllMatrixTools,
  getToolBySlug,
  getMatrixStats,
} from '../lib/tools-matrix-generator';
import HomePage from '../app/page.jsx';
import DynamicToolPage from '../app/[category]/[slug]/page.jsx';
import StealthAdminRoutePage from '../app/[secretAdminRoute]/page.jsx';
import EmbedToolPage from '../app/embed/[slug]/page.jsx';
import EgyptRatesWidgetEmbedPage from '../app/embed/egypt-rates-widget/page.jsx';
import sitemap from '../app/sitemap.js';
import {
  SiteConfigProvider,
  useSiteConfig,
} from '../context/SiteConfigContext';
import StealthAccessModal, {
  useSecretFiveTapTrigger,
} from '../components/StealthAccessModal';
import { GlobalAdOpsOverlays } from '../components/AdSlot';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LiveEgyptTicker from '../components/LiveEgyptTicker';
import CommandPalette from '../components/CommandPalette';
import FloatingScratchpad from '../components/FloatingScratchpad';
import { resolveRedirectRule } from './utils/calculations';
import { X, Sparkles, Megaphone, Wrench } from 'lucide-react';

function AppShell() {
  const { config, effectiveMasterTools } = useSiteConfig();
  const registerFooterTap = useSecretFiveTapTrigger();
  const stats = useMemo(() => getMatrixStats(), []);

  const [route, setRoute] = useState<{
    view: 'home' | 'tool' | 'stealth-admin' | 'embed';
    category: string;
    slug: string;
    overrideParams?: Record<string, unknown> | null;
  }>({
    view: 'home',
    category: 'all',
    slug: '',
    overrideParams: null,
  });
  const [showSitemapModal, setShowSitemapModal] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  // Trigger Smart Popup if enabled in Module 4
  useEffect(() => {
    const popupCfg = config.uiCustomizer?.smartPopup;
    if (!popupCfg?.enabled) {
      setPopupOpen(false);
      return;
    }
    const key = 'dix_smart_popup_impressions';
    const shownCount = Number(window.sessionStorage.getItem(key) || 0);
    if (shownCount < Number(popupCfg.maxShowsPerVisitor || 2)) {
      setPopupOpen(true);
      window.sessionStorage.setItem(key, String(shownCount + 1));
    }
  }, [config.uiCustomizer?.smartPopup]);

  useEffect(() => {
    const syncFromHash = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, '');
      const [pathPart] = rawHash.split('?');
      if (!pathPart) {
        setRoute({ view: 'home', category: 'all', slug: '', overrideParams: null });
        return;
      }

      // Check 301/302 Redirects Engine (Module 5)
      const matchedRedirect = resolveRedirectRule(
        pathPart,
        config.seoEngineConfig?.redirects || []
      );
      if (matchedRedirect && matchedRedirect.toPath) {
        const cleanDest = matchedRedirect.toPath.replace(/^#\/?/, '').replace(/^\/+/, '');
        if (cleanDest && cleanDest !== pathPart) {
          window.location.hash = `/${cleanDest}`;
          return;
        }
      }

      const parts = pathPart.split('/').filter(Boolean);
      if (parts.length === 2 && parts[0] === 'embed') {
        setRoute({
          view: 'embed',
          category: 'all',
          slug: parts[1],
          overrideParams: null,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (parts.length === 2) {
        const [cat, slg] = parts;
        const customFound = effectiveMasterTools?.find((t: { slug: string }) => t.slug === slg);
        const found =
          customFound ||
          (cat === 'tools'
            ? getAllMatrixTools().find((t: { slug: string }) => t.slug === slg)
            : getToolBySlug(cat, slg));
        if (found) {
          setRoute((prev) => ({
            view: 'tool',
            category: found.category,
            slug: found.slug,
            overrideParams: prev.slug === found.slug ? prev.overrideParams : null,
          }));
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      } else if (parts.length === 1) {
        const [singleSeg] = parts;
        const foundCat = MATRIX_CATEGORIES.find((c) => c.slug === singleSeg);
        if (foundCat) {
          setRoute({ view: 'home', category: singleSeg, slug: '', overrideParams: null });
          return;
        }
        // Any other single segment (e.g. `/stealth-command-x99`) routes to `[secretAdminRoute]`
        setRoute({
          view: 'stealth-admin',
          category: 'all',
          slug: singleSeg,
          overrideParams: null,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [config.seoEngineConfig?.redirects, effectiveMasterTools]);

  const navigateHome = (category = 'all') => {
    if (category === 'all') {
      window.history.pushState(null, '', window.location.pathname);
    } else {
      window.location.hash = `/${category}`;
    }
    setRoute({ view: 'home', category, slug: '', overrideParams: null });
    document.title = config.seoAndScripts?.siteName || SITE_CONFIG.name;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToTool = (
    category: string,
    slug: string,
    overrideParams: Record<string, unknown> | null = null,
    queryString = ''
  ) => {
    setRoute({ view: 'tool', category, slug, overrideParams });
    window.location.hash = `/${category}/${slug}${queryString || ''}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToStealthAdmin = (secretSlug: string) => {
    setRoute({
      view: 'stealth-admin',
      category: 'all',
      slug: secretSlug,
      overrideParams: null,
    });
    window.location.hash = `/${secretSlug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const firstGoldTool = useMemo(
    () =>
      getAllMatrixTools().find(
        (t: { slug: string }) => t.slug === 'comprehensive-gold-calculator'
      ) || getAllMatrixTools()[0],
    []
  );

  const generatedSitemapSample = useMemo(() => sitemap().slice(0, 100), []);
  const totalSitemapUrls =
    stats.totalCount +
    MATRIX_CATEGORIES.length +
    1 +
    (config.toolsConfig?.customAddedTools?.length || 0);

  // Standalone Chromeless Embed View (/embed/[slug]) — without site Header or Footer
  if (route.view === 'embed') {
    if (route.slug === 'egypt-rates-widget') {
      return (
        <EgyptRatesWidgetEmbedPage
          onOpenFullTool={(cat: string, slg: string) => navigateToTool(cat, slg)}
        />
      );
    }
    return (
      <EmbedToolPage
        params={{ slug: route.slug }}
        onOpenFullTool={(cat: string, slg: string) => navigateToTool(cat, slg)}
      />
    );
  }

  const announcementBar = config.uiCustomizer?.announcementBar;
  const isGlobalMaintenance =
    Boolean(config.uiCustomizer?.globalMaintenanceMode) && route.view !== 'stealth-admin';

  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-[#0A0A0A] text-slate-100">
      {/* Module 4: Global Announcement Bar */}
      {announcementBar?.enabled && !announcementDismissed && (
        <div
          data-testid="global-announcement-bar"
          className="no-print bg-gradient-to-l from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black px-4 py-2 text-xs font-extrabold flex items-center justify-between gap-3 shadow-md"
        >
          <div className="flex flex-wrap items-center gap-2 mx-auto">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black text-[#D4AF37] text-[10px] font-black">
              <Megaphone className="w-3 h-3" />
              {announcementBar.badge || 'تنبيه هام'}
            </span>
            <span>{announcementBar.text}</span>
            {announcementBar.ctaLabel && (
              <a
                href={announcementBar.ctaUrl || '#tools-workspace'}
                className="underline font-black hover:opacity-80"
              >
                {announcementBar.ctaLabel} ←
              </a>
            )}
          </div>
          <button
            type="button"
            onClick={() => setAnnouncementDismissed(true)}
            aria-label="إغلاق شريط الإشعارات"
            className="p-1 rounded hover:bg-black/10 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Live Egypt Ticker (Gold, FX, Fuel, Steel, Cement & Custom Items) */}
      {config.uiCustomizer?.tickerConfig?.isEnabled !== false &&
        config.uiCustomizer?.tickerConfig?.enabled !== false && (
          <LiveEgyptTicker onSelectTool={navigateToTool} />
        )}

      {/* Dix Tools Official Luxury Header */}
      <Header
        activeView={route.view}
        activeCategory={route.category}
        onNavigateHome={(cat: string) => navigateHome(cat)}
        onOpenFeaturedTool={() => navigateToTool(firstGoldTool.category, firstGoldTool.slug)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1">
        {route.view === 'stealth-admin' ? (
          <StealthAdminRoutePage
            params={{ secretAdminRoute: route.slug }}
            onGoHome={() => navigateHome('all')}
            onOpenTool={(cat: string, slg: string) => navigateToTool(cat, slg)}
          />
        ) : isGlobalMaintenance ? (
          <div className="max-w-3xl mx-auto px-4 py-20 text-center">
            <div className="rounded-3xl border-2 border-[#D4AF37] bg-[#141414] p-10 space-y-5 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mx-auto">
                <Wrench className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-black text-white">
                منصة Dix Tools في وضع الصيانة والتحديث اللحظي
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                {config.uiCustomizer?.maintenanceMessage}
              </p>
              <button
                type="button"
                onClick={() =>
                  navigateToStealthAdmin(
                    config.security?.secretAdminSlug || 'stealth-command-x99'
                  )
                }
                className="px-5 py-2.5 rounded-xl bg-[#0A0A0A] border border-[#D4AF37]/50 text-xs font-bold text-[#D4AF37] cursor-pointer"
              >
                دخول غرفة القيادة للمشرفين
              </button>
            </div>
          </div>
        ) : route.view === 'home' ? (
          <HomePage
            selectedCategory={route.category}
            onSelectCategory={(cat: string) => navigateHome(cat)}
            onSelectTool={navigateToTool}
          />
        ) : (
          <DynamicToolPage
            params={{ category: route.category, slug: route.slug }}
            overrideParams={route.overrideParams}
            onSelectTool={navigateToTool}
            onGoHome={() => navigateHome('all')}
            onSelectCategory={(cat: string) => navigateHome(cat)}
          />
        )}
      </main>

      {/* Dix Tools Official Footer (Includes Secret 5-Rapid-Tap Trigger on Logo!) */}
      <Footer
        stats={stats}
        siteDescription={config.seoAndScripts?.siteDescription || SITE_CONFIG.description}
        onSelectCategory={(cat: string) => navigateHome(cat)}
        onOpenSitemapModal={() => setShowSitemapModal(true)}
        onSecretLogoTap={registerFooterTap}
      />

      {/* Global Command Palette (`Ctrl + K` / Floating Search Lens + Secret `DixDev` Trigger) */}
      <CommandPalette
        onSelectTool={(t: { category: string; slug: string }) =>
          navigateToTool(t.category, t.slug)
        }
      />

      {/* Stealth Passkey Gate Modal (`Ctrl + Shift + L` / 5 rapid taps on footer logo) */}
      <StealthAccessModal onSuccessNavigate={navigateToStealthAdmin} />

      {/* Global AdOps Overlays (Sticky Bottom Mobile Anchor + Interstitial Modal + AdBlock Recovery) */}
      <GlobalAdOpsOverlays />

      {/* Floating Financial Scratchpad (Quick Pinboard) */}
      <FloatingScratchpad />

      {/* Module 4: Smart Promotional Popup Modal */}
      {popupOpen && config.uiCustomizer?.smartPopup?.enabled && (
        <div
          role="dialog"
          aria-modal="true"
          data-testid="smart-promo-popup"
          className="no-print fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-md w-full rounded-3xl border-2 border-[#D4AF37] bg-[#141414] p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">
              {config.uiCustomizer.smartPopup.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {config.uiCustomizer.smartPopup.message}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <a
                href={config.uiCustomizer.smartPopup.ctaUrl || '#tools-workspace'}
                onClick={() => setPopupOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs font-black"
              >
                {config.uiCustomizer.smartPopup.ctaLabel || 'استكشف الآن'}
              </a>
              <button
                type="button"
                onClick={() => setPopupOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sitemap Inspector Modal */}
      {showSitemapModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="خريطة الموقع لـ 5000+ أداة"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-3xl w-full rounded-2xl border border-neutral-700 bg-[#141414] p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-white">
                خريطة الموقع المولدة عبر (app/sitemap.js) — إجمالي {totalSitemapUrls.toLocaleString('en-US')} رابط (عرض أول 100 نموذج)
              </h3>
              <button
                type="button"
                onClick={() => setShowSitemapModal(false)}
                aria-label="إغلاق"
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto space-y-2 pr-1">
              {generatedSitemapSample.map((entry, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-[#0A0A0A] border border-neutral-800 flex items-center justify-between gap-4 text-xs"
                >
                  <span dir="ltr" className="font-num text-[#F3E5AB] truncate">
                    {entry.url}
                  </span>
                  <span className="font-num text-slate-400 shrink-0">
                    Priority: {entry.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <SiteConfigProvider>
      <AppShell />
    </SiteConfigProvider>
  );
}
