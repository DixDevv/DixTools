'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, X, CheckCircle2, Share } from 'lucide-react';

/**
 * ============================================================================
 * Dix Tools PWA Install Button & Mobile Banner (`components/PWAInstallBanner.jsx`)
 * Supports Chromium `beforeinstallprompt` one-click install + guided modal
 * when running in iOS Safari or desktop preview environments.
 * ============================================================================
 */
export default function PWAInstallBanner({ variant = 'header' }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [dismissedMobileBar, setDismissedMobileBar] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    // Register lightweight service worker for PWA installability criteria
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    setIsInstalled(standalone);

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setInstallSuccess(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (isInstalled && !installSuccess) {
    return null;
  }

  const handleTriggerInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice?.outcome === 'accepted') {
          setIsInstalled(true);
          setInstallSuccess(true);
          setDeferredPrompt(null);
        }
        return;
      } catch (_err) {
        // Fallback to guided modal
      }
    }
    setShowInstallModal(true);
  };

  if (variant === 'mobile-bar') {
    if (dismissedMobileBar) return null;
    return (
      <div
        dir="rtl"
        data-testid="pwa-mobile-install-banner"
        className="no-print md:hidden w-full bg-gradient-to-r from-[#1A1405] via-[#121212] to-[#1A1405] border-b border-[#D4AF37]/40 px-3 py-2 flex items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="truncate">
            <span className="text-xs font-extrabold text-white block truncate">
              📲 ثبّت تطبيق Dix Tools على هاتفك
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              يعمل بسرعة فائقة وبدون متصفح
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleTriggerInstall}
            className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-extrabold cursor-pointer whitespace-nowrap"
          >
            تثبيت الآن
          </button>
          <button
            type="button"
            aria-label="إغلاق شريط التثبيت"
            onClick={() => setDismissedMobileBar(true)}
            className="p-1 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        data-testid="pwa-header-install-btn"
        onClick={handleTriggerInstall}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141414] hover:bg-[#1E1807] border border-[#D4AF37]/60 hover:border-[#D4AF37] text-[#F3E5AB] text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0"
      >
        <Smartphone className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>📲 ثبّت تطبيق Dix Tools</span>
      </button>

      {showInstallModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="تثبيت تطبيق Dix Tools على الهاتف أو الكمبيوتر"
          data-testid="pwa-install-guide-modal"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-md w-full rounded-3xl border-2 border-[#D4AF37] bg-[#141414] p-6 space-y-4 shadow-2xl text-right">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <img
                  src="/assets/aistudio/MY_LOGO__e0c9a45b.png"
                  alt="Dix Tools"
                  className="w-9 h-9 rounded-xl border border-[#D4AF37]/60 object-contain bg-[#0A0A0A] p-1"
                />
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    📲 ثبّت تطبيق Dix Tools المستقل
                  </h3>
                  <span className="text-[11px] text-[#D4AF37] font-bold">
                    52 أداة ذكية شاملة · الأسود والذهبي
                  </span>
                </div>
              </div>
              <button
                type="button"
                aria-label="إغلاق نافذة التثبيت"
                onClick={() => setShowInstallModal(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
                <p className="font-bold text-[#F3E5AB]">
                  لتثبيت التطبيق على iPhone أو iPad بضغطة واحدة:
                </p>
                <ol className="space-y-2 list-decimal list-inside text-slate-300">
                  <li>
                    اضغط على أيقونة المشاركة <Share className="inline w-4 h-4 text-[#D4AF37]" /> في
                    شريط متصفح Safari بالأسفل.
                  </li>
                  <li>
                    اختر <strong>«إضافة إلى الشاشة الرئيسية» (Add to Home Screen)</strong>.
                  </li>
                  <li>
                    اضغط <strong>إضافة (Add)</strong> ليظهر شعار <strong>Dix Tools</strong> كتطبيق
                    مستقل.
                  </li>
                </ol>
              </div>
            ) : (
              <div className="space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
                <p className="font-bold text-[#F3E5AB]">
                  لتثبيت تطبيق Dix Tools مباشرة على هاتفك الأندرويد أو جهازك:
                </p>
                <ol className="space-y-2 list-decimal list-inside text-slate-300">
                  <li>
                    افتح قائمة المتصفح العلوية <strong>(⋮)</strong> في Chrome أو Edge.
                  </li>
                  <li>
                    اختر <strong>«تثبيت التطبيق» (Install App)</strong> أو{' '}
                    <strong>«إضافة إلى الشاشة الرئيسية»</strong>.
                  </li>
                  <li>
                    سيعمل <strong>Dix Tools</strong> بملء الشاشة كتطبيق مستقل تماماً مع حفظ أدواتك
                    المفضلة وسجل عملياتك.
                  </li>
                </ol>
              </div>
            )}

            <div className="rounded-xl bg-[#0A0A0A] border border-neutral-800 p-3 flex items-center gap-2 text-xs text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>تطبيق خفيف فائق السرعة (0 ميجابايت) · يدعم العمل الفوري</span>
            </div>

            <button
              type="button"
              onClick={() => setShowInstallModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs font-extrabold cursor-pointer"
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}
    </>
  );
}
