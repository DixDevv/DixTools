'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowUpLeft,
  CheckCircle2,
  Zap,
  Bot,
  Link2,
  Shield,
  Lock,
  Delete,
  X,
  AlertTriangle,
} from 'lucide-react';
import { resolveSmartConciergeQuery } from '../lib/arabic-intent-matcher';
import {
  isSecretDixDevTrigger,
  verifyStealthMasterPin,
  getStealthLockoutStatus,
} from '../lib/stealth-crypto';
import AdSlot from './AdSlot';
import ToolDynamicBanner from './ToolDynamicBanner';
import { useSiteConfig, DEFAULT_STEALTH_CONFIG } from '../context/SiteConfigContext';

/**
 * ============================================================================
 * AISmartFinder Component (`components/AISmartFinder.jsx`)
 * AI Tool Concierge Hero + Encrypted Stealth Security Gate (`DixDev` Trigger)
 * + Live Traffic Radar & Missed Queries Analytics Logger
 * ============================================================================
 */
export default function AISmartFinder({
  onOpenToolWithParams,
  masterToolsCount = 56,
  totalSeoRoutesCount = 5288,
}) {
  let siteConfigCtx = null;
  try {
    siteConfigCtx = useSiteConfig();
  } catch (_err) {
    siteConfigCtx = null;
  }

  const aiConciergeConfig =
    siteConfigCtx?.config?.aiConciergeConfig || DEFAULT_STEALTH_CONFIG.aiConciergeConfig;
  const quickChips =
    aiConciergeConfig.quickPromptChips || DEFAULT_STEALTH_CONFIG.aiConciergeConfig.quickPromptChips;
  const secretAdminSlug =
    siteConfigCtx?.config?.security?.secretAdminSlug ||
    DEFAULT_STEALTH_CONFIG.security.secretAdminSlug ||
    'stealth-command-x99';
  const customTriggerKeyword =
    siteConfigCtx?.config?.security?.triggerKeyword ||
    DEFAULT_STEALTH_CONFIG.security.triggerKeyword ||
    'DixDev';
  const customPinHash = siteConfigCtx?.config?.security?.pinHashSignature || '';

  const [userInput, setUserInput] = useState('');
  const [activeQuery, setActiveQuery] = useState('احسبلي زكاة 120 جرام دهب عيار 21');
  const [conciergeResult, setConciergeResult] = useState(() =>
    resolveSmartConciergeQuery('احسبلي زكاة 120 جرام دهب عيار 21')
  );

  // Stealth Security Gate States (Activated when user submits `DixDev` or custom trigger)
  const [isStealthGateActive, setIsStealthGateActive] = useState(false);
  const [pinDigits, setPinDigits] = useState('');
  const [gateStatus, setGateStatus] = useState('idle'); // 'idle' | 'verifying' | 'success' | 'error'
  const [gateMessage, setGateMessage] = useState('');
  const [shakeError, setShakeError] = useState(false);
  const [lockoutState, setLockoutState] = useState(() => getStealthLockoutStatus());
  const hiddenPinInputRef = useRef(null);

  useEffect(() => {
    if (!isStealthGateActive) return undefined;
    const syncLockout = () => setLockoutState(getStealthLockoutStatus());
    syncLockout();
    const timer = setInterval(syncLockout, 1000);
    if (hiddenPinInputRef.current) {
      hiddenPinInputRef.current.focus();
    }
    return () => clearInterval(timer);
  }, [isStealthGateActive]);

  const triggerPinVerification = async (fourDigitPin) => {
    setGateStatus('verifying');
    const result = await verifyStealthMasterPin(fourDigitPin, customPinHash);

    if (result.ok) {
      setGateStatus('success');
      setGateMessage(result.welcomeMessage || 'تم التحقق.. مرحباً بك في غرفة قيادة Dix Tools');
      if (siteConfigCtx?.unlockAdminSession) {
        siteConfigCtx.unlockAdminSession();
      }
      setTimeout(() => {
        setIsStealthGateActive(false);
        setPinDigits('');
        if (typeof window !== 'undefined') {
          window.location.hash = `/${secretAdminSlug}`;
        }
      }, 450);
      return;
    }

    setGateStatus('error');
    setGateMessage(result.error || 'رمز الدخول غير صحيح');
    setLockoutState(getStealthLockoutStatus());
    setShakeError(true);
    setTimeout(() => {
      setShakeError(false);
      setPinDigits('');
      if (hiddenPinInputRef.current) {
        hiddenPinInputRef.current.focus();
      }
    }, 550);
  };

  const handlePinDigitInput = (nextValue) => {
    const currentLock = getStealthLockoutStatus();
    if (currentLock.isLocked || gateStatus === 'verifying' || gateStatus === 'success') {
      setLockoutState(currentLock);
      return;
    }
    const cleanDigits = String(nextValue || '').replace(/\D/g, '').slice(0, 4);
    setPinDigits(cleanDigits);
    if (gateStatus === 'error') {
      setGateStatus('idle');
      setGateMessage('');
    }
    if (cleanDigits.length === 4) {
      triggerPinVerification(cleanDigits);
    }
  };

  const handleAppendDigit = (digit) => {
    if (pinDigits.length >= 4) return;
    handlePinDigitInput(`${pinDigits}${digit}`);
  };

  const handleBackspaceDigit = () => {
    if (!pinDigits.length) return;
    setPinDigits((prev) => prev.slice(0, -1));
  };

  const handleRunQuery = (qText) => {
    const clean = (qText || userInput).trim();
    if (!clean) return;

    // 1. Intercept Secret Trigger `DixDev` or custom keyword (case-insensitive)
    if (isSecretDixDevTrigger(clean, customTriggerKeyword)) {
      setUserInput(''); // Immediately wipe input field leaving zero visual footprint
      setPinDigits('');
      setGateStatus('idle');
      setGateMessage('');
      setLockoutState(getStealthLockoutStatus());
      setIsStealthGateActive(true);
      return;
    }

    setActiveQuery(clean);

    // Check if query matches any custom No-Code tool created in Module 1
    const customTools = siteConfigCtx?.config?.toolsConfig?.customAddedTools || [];
    const matchedCustom = customTools.find(
      (ct) =>
        clean.toLowerCase().includes(ct.title.toLowerCase()) ||
        clean.toLowerCase().includes(ct.slug.toLowerCase())
    );

    if (matchedCustom) {
      const customRes = {
        matchedTool: matchedCustom,
        overrideParams: {},
        queryString: '',
        conciergeReply: `تم العثور على الأداة المخصصة «${matchedCustom.title}» وتجهيز معادلتها الحسابية (${matchedCustom.formula}).`,
        instantHighlightLabel: 'معادلة الأداة المخصصة',
        instantHighlightValue: matchedCustom.formula,
        secondarySuggestions: [],
      };
      setConciergeResult(customRes);
      if (siteConfigCtx?.recordAiSearchQuery) {
        siteConfigCtx.recordAiSearchQuery(clean, matchedCustom, false);
      }
      return;
    }

    const resolved = resolveSmartConciergeQuery(clean);
    setConciergeResult(resolved);

    // Log query into Module 3 Traffic Radar
    if (siteConfigCtx?.recordAiSearchQuery) {
      const isFallbackMiss = Boolean(resolved?.isFallbackDefault);
      siteConfigCtx.recordAiSearchQuery(clean, resolved?.matchedTool, isFallbackMiss);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleRunQuery(userInput);
  };

  const handleChipClick = (chipQuery) => {
    setUserInput(chipQuery);
    handleRunQuery(chipQuery);
  };

  const handleOpenMatchedTool = () => {
    if (!conciergeResult?.matchedTool) return;
    const { matchedTool, overrideParams, queryString } = conciergeResult;
    if (siteConfigCtx?.recordToolEngagement) {
      siteConfigCtx.recordToolEngagement(
        matchedTool.slug,
        'calculations',
        matchedTool.title,
        matchedTool.category
      );
    }
    if (onOpenToolWithParams) {
      onOpenToolWithParams(
        matchedTool.category,
        matchedTool.slug,
        overrideParams,
        queryString || ''
      );
    }
  };

  return (
    <section
      aria-label="المساعد الذكي لاختيار وتشغيل الأدوات الشاملة"
      className="relative rounded-3xl border border-[#D4AF37]/45 bg-gradient-to-b from-[#141414] via-[#0F0F0F] to-[#0A0A0A] p-5 sm:p-8 lg:p-10 shadow-2xl space-y-6"
    >
      {/* Top Identity Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/90 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#D4AF37] block">
              المساعد الذكي الفوري — Dix Tools AI Concierge
            </span>
            <span className="text-[11px] text-slate-400">
              يوجّهك للأداة الشاملة الموحدة مع ضبط القوائم المنسدلة وتمرير المتغيرات في الرابط تلقائياً
            </span>
          </div>
        </div>

        <span className="font-num text-xs text-[#F3E5AB] bg-[#0A0A0A] border border-neutral-800 px-3 py-1.5 rounded-lg">
          {masterToolsCount} أداة رئيسية شاملة · {totalSeoRoutesCount.toLocaleString('en-US')} مسار ذكي
        </span>
      </div>

      {/* Encrypted Stealth Security Gate (Replaces Concierge when `DixDev` is triggered) */}
      {isStealthGateActive ? (
        <div
          data-testid="stealth-security-gate"
          onClick={() => hiddenPinInputRef.current?.focus()}
          className={`max-w-md mx-auto rounded-3xl border-2 p-6 space-y-5 shadow-2xl transition-all ${
            shakeError
              ? 'border-red-500 bg-red-950/25 translate-x-1'
              : gateStatus === 'success'
              ? 'border-emerald-500 bg-[#0D1912]'
              : 'border-[#D4AF37] bg-[#0A0A0A]'
          }`}
        >
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="font-num text-[10px] font-extrabold text-[#D4AF37] tracking-wider block">
                  SHA-256 ENCRYPTED STEALTH GATE
                </span>
                <h2 className="text-sm sm:text-base font-extrabold text-white">
                  بوابة التحقق المشفرة — Dix Tools
                </h2>
              </div>
            </div>
            <button
              type="button"
              aria-label="إغلاق البوابة السرية"
              onClick={(e) => {
                e.stopPropagation();
                setIsStealthGateActive(false);
                setPinDigits('');
              }}
              className="p-1.5 rounded-xl bg-[#141414] border border-neutral-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-center text-slate-300">
            أدخل رمز المرور السري المكون من 4 أرقام (Master PIN) للتحقق التلقائي الفوري
          </p>

          {/* Hidden Keyboard Capture Input + 4-Digit Masked Slots (`* * * *`) */}
          <div className="relative">
            <input
              ref={hiddenPinInputRef}
              type="tel"
              inputMode="numeric"
              autoFocus
              aria-label="أدخل رمز المرور السري المكون من 4 أرقام"
              data-testid="stealth-pin-hidden-input"
              value={pinDigits}
              disabled={lockoutState.isLocked || gateStatus === 'success'}
              onChange={(e) => handlePinDigitInput(e.target.value)}
              className="sr-only"
            />

            <div
              dir="ltr"
              data-testid="stealth-pin-masked-boxes"
              className="grid grid-cols-4 gap-3 max-w-xs mx-auto"
            >
              {[0, 1, 2, 3].map((slotIdx) => {
                const isFilled = pinDigits.length > slotIdx;
                const isCurrent = pinDigits.length === slotIdx && !lockoutState.isLocked;
                return (
                  <div
                    key={slotIdx}
                    className={`h-14 rounded-2xl border-2 flex items-center justify-center font-num text-2xl font-extrabold transition-all ${
                      gateStatus === 'error'
                        ? 'border-red-500 bg-red-950/30 text-red-400'
                        : gateStatus === 'success'
                        ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
                        : isFilled
                        ? 'border-[#D4AF37] bg-[#1A1506] text-[#D4AF37] shadow-lg'
                        : isCurrent
                        ? 'border-[#D4AF37]/80 bg-[#141414] text-slate-500'
                        : 'border-neutral-800 bg-[#141414] text-slate-600'
                    }`}
                  >
                    {isFilled ? '*' : '•'}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Golden Numeric PIN Pad */}
          <div dir="ltr" className="grid grid-cols-3 gap-2 max-w-xs mx-auto pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                disabled={lockoutState.isLocked || gateStatus === 'success'}
                data-testid={`pin-pad-${digit}`}
                onClick={() => handleAppendDigit(digit)}
                className="font-num py-2.5 rounded-xl bg-[#141414] hover:bg-[#1F1908] border border-neutral-800 hover:border-[#D4AF37] text-sm font-extrabold text-white hover:text-[#D4AF37] transition-all cursor-pointer"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPinDigits('')}
              disabled={lockoutState.isLocked || gateStatus === 'success'}
              className="py-2.5 rounded-xl bg-[#141414] border border-neutral-800 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
            >
              مسح الكل
            </button>
            <button
              type="button"
              disabled={lockoutState.isLocked || gateStatus === 'success'}
              data-testid="pin-pad-0"
              onClick={() => handleAppendDigit('0')}
              className="font-num py-2.5 rounded-xl bg-[#141414] hover:bg-[#1F1908] border border-neutral-800 hover:border-[#D4AF37] text-sm font-extrabold text-white hover:text-[#D4AF37] transition-all cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspaceDigit}
              disabled={lockoutState.isLocked || gateStatus === 'success'}
              aria-label="حذف رقم"
              className="py-2.5 rounded-xl bg-[#141414] border border-neutral-800 flex items-center justify-center text-slate-300 hover:text-[#D4AF37] cursor-pointer"
            >
              <Delete className="w-4 h-4" />
            </button>
          </div>

          {/* Status / Error / Lockout Messages */}
          {lockoutState.isLocked ? (
            <div
              data-testid="stealth-lockout-banner"
              className="rounded-xl border border-red-600 bg-red-950/60 p-3 text-center space-y-1"
            >
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-red-300">
                <AlertTriangle className="w-4 h-4" />
                <span>تم قفل البوابة الأمنية مؤقتاً لمدة 5 دقائق</span>
              </div>
              <p className="font-num text-[11px] text-red-200">
                يرجى الانتظار {lockoutState.remainingSeconds} ثانية قبل المحاولة مجدداً.
              </p>
            </div>
          ) : gateMessage ? (
            <div
              data-testid="stealth-gate-message"
              className={`rounded-xl border px-3.5 py-2.5 text-center text-xs font-extrabold ${
                gateStatus === 'success'
                  ? 'border-emerald-500 bg-emerald-950/50 text-emerald-300'
                  : 'border-red-600 bg-red-950/50 text-red-300'
              }`}
            >
              {gateMessage}
            </div>
          ) : (
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span className="inline-flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>تشفير SHA-256 · جلسة محمية</span>
              </span>
              <span className="font-num">
                المحاولات المتبقية: {Math.max(0, 3 - (lockoutState.failedAttempts || 0))}/3
              </span>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Main Welcome Headline */}
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
              {aiConciergeConfig.welcomeTitle ||
                'مرحباً بك في Dix Tools.. محتاج تعمل إيه النهاردة؟ اكتب طلبك وسأجهز لك الأداة فوراً'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {aiConciergeConfig.welcomeSubtitle}
            </p>
          </div>

          {/* Interactive Concierge Search / Chat Bar */}
          <form onSubmit={handleFormSubmit} className="max-w-3xl mx-auto">
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-[#0A0A0A] p-2 rounded-2xl border border-[#D4AF37]/50 focus-within:border-[#D4AF37] shadow-inner">
              <input
                type="text"
                aria-label="اكتب طلبك للمساعد الذكي"
                data-testid="ai-concierge-input"
                value={userInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setUserInput(val);
                  if (val.trim().length > 3 && !isSecretDixDevTrigger(val, customTriggerKeyword)) {
                    setConciergeResult(resolveSmartConciergeQuery(val));
                    setActiveQuery(val);
                  }
                }}
                placeholder={aiConciergeConfig.inputPlaceholder}
                className="flex-1 bg-transparent px-4 py-3 text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                data-testid="ai-concierge-submit-btn"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#D4AF37] text-black text-xs sm:text-sm font-extrabold hover:bg-[#e5c247] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>جهّز الأداة والنتيجة</span>
              </button>
            </div>
          </form>

          {/* One-Touch Quick Prompt Chips */}
          <div className="max-w-4xl mx-auto space-y-2">
            <div className="text-center text-xs font-semibold text-slate-400">
              جرّب بلمسة واحدة (طلبات سريعة شائعة):
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {quickChips.map((chip) => (
                <button
                  key={chip.id || chip.label}
                  type="button"
                  onClick={() => handleChipClick(chip.query)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    activeQuery === chip.query
                      ? 'bg-[#D4AF37] text-black shadow-md'
                      : 'bg-[#0A0A0A] text-slate-200 border border-neutral-800 hover:border-[#D4AF37]/60'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Instant Smart Pre-fill Response Card */}
          {conciergeResult && conciergeResult.matchedTool && (
            <div
              data-testid="ai-concierge-result-card"
              className="max-w-4xl mx-auto rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-5 sm:p-6 space-y-5 shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم ربط الطلب بالأداة الشاملة الموحدة (Master Hub Tool) مع التعبئة التلقائية</span>
                    {conciergeResult.queryString && (
                      <span
                        dir="ltr"
                        className="font-num text-[11px] bg-[#141414] border border-neutral-800 text-[#F3E5AB] px-2 py-0.5 rounded inline-flex items-center gap-1"
                      >
                        <Link2 className="w-3 h-3 text-[#D4AF37]" />
                        {conciergeResult.queryString}
                      </span>
                    )}
                  </div>
                  <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    {conciergeResult.conciergeReply}
                  </p>
                </div>

                <div className="rounded-xl bg-[#141414] border border-[#D4AF37]/40 px-4 py-3 text-right md:text-left shrink-0 max-w-xs">
                  <span className="text-[11px] text-slate-400 block">
                    {conciergeResult.instantHighlightLabel}
                  </span>
                  <span
                    data-testid="concierge-instant-answer"
                    className="font-num text-base sm:text-xl font-extrabold text-[#D4AF37] block break-words"
                  >
                    {conciergeResult.instantHighlightValue}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-5">
                  <ToolDynamicBanner tool={conciergeResult.matchedTool} compact />
                </div>

                <div className="md:col-span-7 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs text-[#D4AF37] font-semibold">
                      {conciergeResult.matchedTool.categoryName} · أداة رئيسية شاملة
                    </span>
                    <h2 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                      {conciergeResult.matchedTool.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {conciergeResult.matchedTool.summary}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleOpenMatchedTool}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D4AF37] text-black text-xs sm:text-sm font-extrabold hover:bg-[#e5c247] transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-lg"
                    >
                      <Zap className="w-4 h-4" />
                      <span>افتح الأداة بالنتيجة فوراً</span>
                      <ArrowUpLeft className="w-4 h-4" />
                    </button>

                    {conciergeResult.secondarySuggestions?.slice(0, 2).map((sug) => (
                      <button
                        key={sug.slug}
                        type="button"
                        onClick={() =>
                          onOpenToolWithParams &&
                          onOpenToolWithParams(sug.category, sug.slug, sug.defaultParams, '')
                        }
                        className="px-3 py-2 rounded-xl bg-[#141414] border border-neutral-800 hover:border-[#D4AF37]/50 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer truncate max-w-[210px]"
                      >
                        {sug.shortTitle}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Strategic Placement #2: `ai_chat_response_ad` Directly Below AI Concierge Response */}
      <div className="max-w-4xl mx-auto pt-1">
        <AdSlot
          slotId="9090918273"
          placement="ai_chat_response_ad"
          category={conciergeResult?.matchedTool?.category || ''}
          label="إعلان مدمج أسفل رد المساعد الذكي (ai_chat_response_ad)"
        />
      </div>
    </section>
  );
}
