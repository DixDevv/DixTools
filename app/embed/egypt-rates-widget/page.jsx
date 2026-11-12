'use client';

import React, { useState } from 'react';
import {
  Coins,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Code2,
  Fuel,
  DollarSign,
} from 'lucide-react';
import { useSiteConfig } from '../../../context/SiteConfigContext';
import { SITE_CONFIG } from '../../../lib/tools-matrix-generator';

export function buildEgyptWidgetIframeCode(origin = 'https://dixtools.com') {
  const widgetUrl = `${origin}/#/embed/egypt-rates-widget`;
  return `<div style="max-width:680px;margin:0 auto;font-family:sans-serif;text-align:center;"><iframe src="${widgetUrl}" width="100%" height="520" style="border:2px solid #D4AF37;border-radius:16px;overflow:hidden;background:#0A0A0A;" loading="lazy" title="جدول أسعار الذهب والدولار والبنزين اللحظي في مصر - Dix Tools"></iframe><div style="margin-top:6px;font-size:12px;"><a href="${origin}" target="_blank" rel="noopener" style="color:#D4AF37;font-weight:bold;text-decoration:none;">تحديث لحظي عبر منصة Dix Tools</a></div></div>`;
}

export default function EgyptRatesWidgetEmbedPage({ onOpenFullTool }) {
  const { config, syncEgyptLiveRates, isSyncingLiveRates, oracleCountdownSeconds } =
    useSiteConfig();
  const [copiedIframe, setCopiedIframe] = useState(false);
  const [showCodeDrawer, setShowCodeDrawer] = useState(true);

  const lr = config.liveRates || {};
  const k24 = Number(lr.gold?.karat24) || 4355;
  const k21 = Number(lr.gold?.karat21) || 3811;
  const k18 = Number(lr.gold?.karat18) || 3266;
  const coin8g = Number(lr.gold?.goldCoin8g) || 30488;

  const usd = Number(lr.currenciesToEgp?.USD) || 50.45;
  const sar = Number(lr.currenciesToEgp?.SAR) || 13.45;
  const eur = Number(lr.currenciesToEgp?.EUR) || 54.6;
  const kwd = Number(lr.currenciesToEgp?.KWD) || 164.2;

  const fuel80 = Number(lr.energyAndUtilities?.fuel80) || 20.75;
  const fuel92 = Number(lr.energyAndUtilities?.fuel92) || 22.25;
  const fuel95 = Number(lr.energyAndUtilities?.fuel95) || 24.0;
  const diesel = Number(lr.energyAndUtilities?.diesel) || 19.5;

  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : SITE_CONFIG.domain || 'https://dixtools.com';

  const iframeSnippet = buildEgyptWidgetIframeCode(origin);

  const handleCopyIframe = () => {
    navigator.clipboard?.writeText(iframeSnippet);
    setCopiedIframe(true);
    setTimeout(() => setCopiedIframe(false), 2000);
  };

  return (
    <main
      dir="rtl"
      data-testid="egypt-rates-embed-widget"
      className="min-h-screen bg-[#0A0A0A] text-slate-100 p-3 sm:p-5 flex flex-col justify-between"
    >
      <div className="max-w-3xl mx-auto w-full rounded-3xl border-2 border-[#D4AF37] bg-[#141414] p-4 sm:p-6 shadow-2xl space-y-5">
        {/* Widget Header */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>تحديث لحظي أوتوماتيكي كل 60 ثانية ({oracleCountdownSeconds || 60}ث)</span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-white">
                جدول أسعار الذهب والدولار والوقود في مصر اليوم
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => syncEgyptLiveRates && syncEgyptLiveRates()}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-xs font-bold text-[#F3E5AB] hover:border-[#D4AF37] cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-[#D4AF37] ${
                  isSyncingLiveRates ? 'animate-spin' : ''
                }`}
              />
              <span>تحديث</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCodeDrawer((v) => !v)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#D4AF37] text-black text-xs font-black cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>كود التضمين للمواقع &lt;iframe&gt;</span>
            </button>
          </div>
        </header>

        {/* 3-Section Live Egypt Table (Gold, FX, Fuel) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Gold Section */}
          <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-3.5 space-y-2.5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="text-xs font-black text-[#D4AF37] flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5" />
                أسعار الذهب (ج.م)
              </span>
              <span className="text-[10px] text-slate-400">سوق الصاغة</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-900">
                <span className="text-slate-300 font-bold">ذهب عيار 21</span>
                <span className="font-num font-black text-[#D4AF37]">
                  {k21.toLocaleString('en-US')} ج.م
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-900">
                <span className="text-slate-300 font-bold">ذهب عيار 24</span>
                <span className="font-num font-black text-[#F3E5AB]">
                  {k24.toLocaleString('en-US')} ج.م
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-900">
                <span className="text-slate-300 font-bold">ذهب عيار 18</span>
                <span className="font-num font-bold text-white">
                  {k18.toLocaleString('en-US')} ج.م
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-300 font-bold">الجنيه الذهب (8g)</span>
                <span className="font-num font-black text-emerald-400">
                  {coin8g.toLocaleString('en-US')} ج.م
                </span>
              </div>
            </div>
          </div>

          {/* Currencies Section */}
          <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-3.5 space-y-2.5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="text-xs font-black text-[#F3E5AB] flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#D4AF37]" />
                العملات الأجنبية
              </span>
              <span className="text-[10px] text-slate-400">البنك المركزي</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-900">
                <span className="text-slate-300 font-bold">الدولار الأمريكي</span>
                <span className="font-num font-black text-[#D4AF37]">{usd.toFixed(2)} ج.م</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-900">
                <span className="text-slate-300 font-bold">الريال السعودي</span>
                <span className="font-num font-bold text-white">{sar.toFixed(2)} ج.م</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-900">
                <span className="text-slate-300 font-bold">اليورو الأوروبي</span>
                <span className="font-num font-bold text-white">{eur.toFixed(2)} ج.م</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-300 font-bold">الدينار الكويتي</span>
                <span className="font-num font-black text-emerald-400">
                  {kwd.toFixed(2)} ج.م
                </span>
              </div>
            </div>
          </div>

          {/* Official Fuel Section */}
          <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-3.5 space-y-2.5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="text-xs font-black text-[#F3E5AB] flex items-center gap-1.5">
                <Fuel className="w-3.5 h-3.5 text-[#D4AF37]" />
                أسعار الوقود بمصر
              </span>
              <span className="text-[10px] text-slate-400">تسعير رسمي</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-900">
                <span className="text-slate-300 font-bold">بنزين 80</span>
                <span className="font-num font-bold text-white">
                  {fuel80.toFixed(2)} ج.م/لتر
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-900">
                <span className="text-slate-300 font-bold">بنزين 92</span>
                <span className="font-num font-black text-[#D4AF37]">
                  {fuel92.toFixed(2)} ج.م/لتر
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-900">
                <span className="text-slate-300 font-bold">بنزين 95</span>
                <span className="font-num font-bold text-white">
                  {fuel95.toFixed(2)} ج.م/لتر
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-300 font-bold">السولار / الديزل</span>
                <span className="font-num font-black text-emerald-400">
                  {diesel.toFixed(2)} ج.م/لتر
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ready-to-Copy <iframe> Embed Snippet */}
        {showCodeDrawer && (
          <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-4 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black text-[#F3E5AB]">
                انسخ كود التضمين &lt;iframe&gt; لإضافة جدول أسعار مصر اللحظي في موقعك أو مدونتك مجاناً:
              </span>
              <button
                type="button"
                data-testid="copy-egypt-widget-iframe-btn"
                onClick={handleCopyIframe}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#D4AF37] text-black text-xs font-black cursor-pointer shrink-0"
              >
                {copiedIframe ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedIframe ? 'تم نسخ الكود!' : 'نسخ كود <iframe>'}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={2}
              dir="ltr"
              data-testid="egypt-widget-iframe-code"
              value={iframeSnippet}
              className="font-num w-full rounded-xl bg-[#141414] border border-neutral-800 p-2.5 text-[11px] text-emerald-400 focus:outline-none"
            />
          </div>
        )}

        {/* Active DoFollow Backlink Attribution Footer */}
        <footer className="pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <a
            href={origin}
            target="_blank"
            rel="noopener"
            data-testid="egypt-widget-backlink"
            onClick={(e) => {
              if (onOpenFullTool) {
                e.preventDefault();
                onOpenFullTool('gold', 'comprehensive-gold-calculator');
              }
            }}
            className="inline-flex items-center gap-1.5 font-black text-[#D4AF37] hover:underline"
          >
            <span>تحديث لحظي عبر منصة Dix Tools</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <span className="text-[11px] text-slate-400 font-num">
            {lr.lastUpdatedArabic || 'بتوقيت القاهرة الرسمي'}
          </span>
        </footer>
      </div>
    </main>
  );
}
