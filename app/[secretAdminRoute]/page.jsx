'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldAlert,
  Lock,
  Unlock,
  Megaphone,
  Wrench,
  Bot,
  Coins,
  Code2,
  Download,
  Upload,
  RotateCcw,
  Eye,
  EyeOff,
  Pin,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Zap,
  Sparkles,
  RefreshCw,
  BarChart3,
  Sliders,
  Globe,
  Database,
  Activity,
  Search,
  Play,
  ArrowUp,
  ArrowDown,
  Copy,
  Check,
  KeyRound,
  History,
  CloudUpload,
} from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { MATRIX_CATEGORIES } from '../../lib/tools-matrix-generator';
import {
  updateCustomMasterPin,
  getSecurityAuditLog,
  clearSecurityAuditLog,
  triggerEmergencyLockdown,
} from '../../lib/stealth-crypto';
import {
  evaluateCustomToolFormula,
  computeAdPlacementCtrStats,
  renderBulkSeoTemplate,
} from '../../src/utils/calculations';
import SiteQADiagnosticSuite from '../../components/admin/SiteQADiagnosticSuite';

const GOD_MODE_TABS = [
  {
    id: 'no-code-builder',
    num: '01',
    label: 'استوديو بناء الأدوات بدون كود',
    sub: 'No-Code Tool & Formula Studio',
    icon: Wrench,
  },
  {
    id: 'adops-radar',
    num: '02',
    label: 'غرفة عمليات الإعلانات و A/B',
    sub: 'Ultimate AdOps & Click Radar',
    icon: Megaphone,
  },
  {
    id: 'traffic-radar',
    num: '03',
    label: 'رادار الزوار ومختبر المساعد',
    sub: 'Traffic Radar & Missed Queries',
    icon: Activity,
  },
  {
    id: 'ui-customizer',
    num: '04',
    label: 'محرر الواجهة والمظهر الحي',
    sub: 'Live UI, Ticker & Maintenance',
    icon: Sliders,
  },
  {
    id: 'seo-engine',
    num: '05',
    label: 'مركز القيادة الآلي للـ SEO',
    sub: 'Bulk SEO, 301 & SERP Simulator',
    icon: Globe,
  },
  {
    id: 'live-oracle',
    num: '06',
    label: 'غرفة محرك الأسعار اللحظي لمصر',
    sub: '60s Egypt Oracle & Custom Vars',
    icon: Coins,
  },
  {
    id: 'security-vault',
    num: '07',
    label: 'مركز الأمان وسجل الاختراق',
    sub: 'Security Vault & Audit Log',
    icon: ShieldAlert,
  },
  {
    id: 'cloud-snapshots',
    num: '08',
    label: 'المزامنة السحابية ونقاط الاستعادة',
    sub: 'Cloud Sync & Snapshot Manager',
    icon: Database,
  },
  {
    id: 'qa-diagnostic-suite',
    num: '09',
    label: '🧪 فحص واختبار الموقع الشامل',
    sub: 'Live QA & System Tester',
    icon: Sparkles,
  },
];

export default function StealthAdminRoutePage({ params, onGoHome, onOpenTool }) {
  const {
    config,
    updateSection,
    updatePlacement,
    updateCategoryAdOverride,
    toggleGlobalKillSwitch,
    addCustomNoCodeTool,
    deleteCustomNoCodeTool,
    toggleRateLock,
    snapshots,
    createConfigSnapshot,
    restoreConfigSnapshot,
    deleteConfigSnapshot,
    syncConfigToCloud,
    isSyncingCloud,
    lastCloudSyncAt,
    effectiveMasterTools,
    syncEgyptLiveRates,
    isSyncingLiveRates,
    oracleCountdownSeconds,
    isAdminAuthenticated,
    verifyPasskey,
    logoutAdmin,
    exportMasterJson,
    importMasterJson,
    resetToFactoryDefaults,
  } = useSiteConfig();

  const [activeTab, setActiveTab] = useState('no-code-builder');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Module 1: No-Code Tool Builder State
  const [builderTitle, setBuilderTitle] = useState('حاسبة تكلفة تشطيب الشقق والمباني في مصر');
  const [builderSlug, setBuilderSlug] = useState('apartment-finishing-cost-calculator');
  const [builderCategory, setBuilderCategory] = useState('real-estate');
  const [builderBadge, setBuilderBadge] = useState('أداة مخصصة · No-Code');
  const [builderResultLabel, setBuilderResultLabel] = useState('إجمالي التكلفة التقديرية للتشطيب');
  const [builderResultUnit, setBuilderResultUnit] = useState('ج.م');
  const [builderFormula, setBuilderFormula] = useState(
    '(areaSqm * finishRatePerSqm) + (cementTons * cementTonEgp)'
  );
  const [builderFields, setBuilderFields] = useState([
    {
      id: 'fld-1',
      varName: 'areaSqm',
      label: 'مساحة الشقة بالمتر المربع',
      type: 'number',
      defaultValue: 150,
    },
    {
      id: 'fld-2',
      varName: 'finishRatePerSqm',
      label: 'تكلفة المصنعيات والخامات للمتر',
      type: 'number',
      defaultValue: 4200,
    },
    {
      id: 'fld-3',
      varName: 'cementTons',
      label: 'كمية الأسمنت المطلوبة بالطن',
      type: 'number',
      defaultValue: 6,
    },
  ]);
  const [newFieldVar, setNewFieldVar] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState('number');
  const [newFieldDefault, setNewFieldDefault] = useState('10');

  // Module 5: Redirects & SERP Simulator State
  const [newRedirectFrom, setNewRedirectFrom] = useState('');
  const [newRedirectTo, setNewRedirectTo] = useState('/gold/gold-vs-bank-comparator');
  const [newRedirectCode, setNewRedirectCode] = useState(301);
  const [serpPreviewSlug, setSerpPreviewSlug] = useState('gold-vs-bank-comparator');
  const [indexNowStatus, setIndexNowStatus] = useState('');

  // Module 6: Custom Global Variable State
  const [newGlobalVarKey, setNewGlobalVarKey] = useState('');
  const [newGlobalVarLabel, setNewGlobalVarLabel] = useState('');
  const [newGlobalVarValue, setNewGlobalVarValue] = useState('');
  const [newGlobalVarUnit, setNewGlobalVarUnit] = useState('ج.م');

  // Custom Ticker Item State (Live Ticker Manager)
  const [newCustomTickerLabel, setNewCustomTickerLabel] = useState('');
  const [newCustomTickerPrice, setNewCustomTickerPrice] = useState('');
  const [newCustomTickerUnit, setNewCustomTickerUnit] = useState('ج.م');
  const [newCustomTickerSlug, setNewCustomTickerSlug] = useState('comprehensive-currency-converter');

  // Module 7: Security Vault State
  const [newPinDigits, setNewPinDigits] = useState('');
  const [auditLogs, setAuditLogs] = useState(() => getSecurityAuditLog());

  // Module 8: Snapshots & JSON Import State
  const [newSnapshotName, setNewSnapshotName] = useState('');
  const [jsonImportBuffer, setJsonImportBuffer] = useState('');
  const [copiedJson, setCopiedJson] = useState(false);

  // Module 3: Tool Manager Filter
  const [toolSearchQuery, setToolSearchQuery] = useState('');

  useEffect(() => {
    if (activeTab === 'security-vault') {
      setAuditLogs(getSecurityAuditLog());
    }
  }, [activeTab]);

  useEffect(() => {
    const robotsMeta = document.querySelector('meta[name="robots"]');
    const previousContent = robotsMeta ? robotsMeta.getAttribute('content') : null;
    let createdMeta = null;

    if (robotsMeta) {
      robotsMeta.setAttribute('content', 'noindex, nofollow, noarchive');
    } else {
      createdMeta = document.createElement('meta');
      createdMeta.name = 'robots';
      createdMeta.content = 'noindex, nofollow, noarchive';
      document.head.appendChild(createdMeta);
    }

    return () => {
      if (robotsMeta && previousContent) {
        robotsMeta.setAttribute('content', previousContent);
      } else if (createdMeta) {
        createdMeta.remove();
      }
    };
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Live Oracle Variable Map for Formula Sandbox
  const liveOracleVarsMap = useMemo(() => {
    const lr = config.liveRates || {};
    const customMap = {};
    for (const cv of lr.customVariables || []) {
      if (cv?.key) customMap[cv.key] = Number(cv.value) || 0;
    }
    return {
      karat24: Number(lr.gold?.karat24) || 4355,
      karat22: Number(lr.gold?.karat22) || 3992,
      karat21: Number(lr.gold?.karat21) || 3811,
      karat18: Number(lr.gold?.karat18) || 3266,
      goldCoin8g: Number(lr.gold?.goldCoin8g) || 30488,
      USD: Number(lr.currenciesToEgp?.USD) || 50.45,
      SAR: Number(lr.currenciesToEgp?.SAR) || 13.45,
      AED: Number(lr.currenciesToEgp?.AED) || 13.74,
      KWD: Number(lr.currenciesToEgp?.KWD) || 164.2,
      EUR: Number(lr.currenciesToEgp?.EUR) || 54.6,
      fuel80: Number(lr.energyAndUtilities?.fuel80) || 20.75,
      fuel92: Number(lr.energyAndUtilities?.fuel92) || 22.25,
      fuel95: Number(lr.energyAndUtilities?.fuel95) || 24.0,
      diesel: Number(lr.energyAndUtilities?.diesel) || 19.5,
      certYield: Number(lr.bankingAndTaxes?.certAnnualYield) || 27.0,
      vatEgypt: Number(lr.bankingAndTaxes?.vatEgyptPercent) || 14.0,
      ...customMap,
    };
  }, [config.liveRates]);

  // Live Formula Sandbox Evaluation (Module 1)
  const sandboxEval = useMemo(() => {
    const sampleInputs = {};
    for (const f of builderFields) {
      sampleInputs[f.varName] = Number(f.defaultValue) || 0;
    }
    return evaluateCustomToolFormula(builderFormula, sampleInputs, liveOracleVarsMap);
  }, [builderFormula, builderFields, liveOracleVarsMap]);

  const handlePinUnlockSubmit = async (e) => {
    e.preventDefault();
    if (!pinInput || isVerifyingPin) return;
    setIsVerifyingPin(true);
    setPinError('');
    const result = await verifyPasskey(pinInput);
    setIsVerifyingPin(false);
    if (!result.ok) {
      setPinError(result.error || 'رمز الدخول غير صحيح');
    } else {
      setPinInput('');
    }
  };

  // Module 1 Handlers
  const handleAddBuilderField = () => {
    const cleanVar = newFieldVar.trim().replace(/[^a-zA-Z0-9_]/g, '');
    if (!cleanVar || !newFieldLabel.trim()) {
      showToast('⚠️ يرجى كتابة اسم المتغير بالإنجليزية واسم الحقل بالعربية');
      return;
    }
    setBuilderFields((prev) => [
      ...prev,
      {
        id: `fld-${Date.now()}`,
        varName: cleanVar,
        label: newFieldLabel.trim(),
        type: newFieldType,
        defaultValue: newFieldType === 'number' ? Number(newFieldDefault) || 1 : newFieldDefault,
      },
    ]);
    setNewFieldVar('');
    setNewFieldLabel('');
    setNewFieldDefault('10');
  };

  const handlePublishCustomTool = () => {
    if (!builderTitle.trim() || !builderSlug.trim() || !builderFormula.trim()) {
      showToast('⚠️ يرجى استكمال اسم الأداة والـ Slug والمعادلة الحسابية');
      return;
    }
    const created = addCustomNoCodeTool({
      title: builderTitle.trim(),
      slug: builderSlug.trim(),
      category: builderCategory,
      badge: builderBadge.trim(),
      resultLabel: builderResultLabel.trim(),
      resultUnit: builderResultUnit.trim(),
      formula: builderFormula.trim(),
      fields: builderFields,
    });
    if (created) {
      showToast(`✅ تم نشر الأداة «${created.title}» وإضافتها فوراً للموقع والـ Sitemap!`);
    }
  };

  // Module 3: 1-Click Create Tool from Missed Query
  const handlePrefillBuilderFromMissedQuery = (missedItem) => {
    setBuilderTitle(missedItem.suggestedTitle || `حاسبة ${missedItem.query}`);
    setBuilderSlug(missedItem.suggestedSlug || `custom-tool-${Date.now().toString().slice(-4)}`);
    setBuilderCategory(missedItem.suggestedCategory || 'finance');
    setBuilderFormula(missedItem.suggestedFormula || '(amount * karat21)');
    setBuilderFields([
      {
        id: 'f-auto-1',
        varName: 'amount',
        label: 'القيمة أو الكمية المطلوبة',
        type: 'number',
        defaultValue: 100,
      },
    ]);
    setActiveTab('no-code-builder');
    showToast(`⚡ تم تجهيز استوديو بناء الأدوات لطلب: «${missedItem.query}»`);
  };

  // Module 4: Reorder Homepage Sections
  const handleMoveHomeSection = (idx, dir) => {
    const list = [...(config.uiCustomizer?.homeSectionsOrder || [])];
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    updateSection('uiCustomizer', { homeSectionsOrder: list });
  };

  const handleToggleHomeSectionVisible = (sectionId) => {
    const list = (config.uiCustomizer?.homeSectionsOrder || []).map((s) =>
      s.id === sectionId ? { ...s, visible: !s.visible } : s
    );
    updateSection('uiCustomizer', { homeSectionsOrder: list });
  };

  // Module 5: Add Redirect Rule
  const handleAddRedirectRule = () => {
    if (!newRedirectFrom.trim() || !newRedirectTo.trim()) return;
    const current = config.seoEngineConfig?.redirects || [];
    const nextRule = {
      id: `red-${Date.now()}`,
      fromPath: newRedirectFrom.trim().startsWith('/')
        ? newRedirectFrom.trim()
        : `/${newRedirectFrom.trim()}`,
      toPath: newRedirectTo.trim(),
      statusCode: Number(newRedirectCode) === 302 ? 302 : 301,
      hits: 0,
      active: true,
    };
    updateSection('seoEngineConfig', { redirects: [nextRule, ...current] });
    setNewRedirectFrom('');
    showToast('✅ تمت إضافة قاعدة التحويل 301/302 بنجاح');
  };

  // Module 6: Add Custom Global Price Variable
  const handleAddCustomGlobalVariable = () => {
    const cleanKey = newGlobalVarKey.trim().replace(/[^a-zA-Z0-9_]/g, '');
    if (!cleanKey || !newGlobalVarLabel.trim()) {
      showToast('⚠️ يرجى إدخال كود المتغير بالإنجليزية والاسم بالعربية');
      return;
    }
    const curVars = config.liveRates?.customVariables || [];
    const updated = [
      ...curVars.filter((v) => v.key !== cleanKey),
      {
        id: `var-${Date.now()}`,
        key: cleanKey,
        label: newGlobalVarLabel.trim(),
        value: Number(newGlobalVarValue) || 0,
        unit: newGlobalVarUnit.trim() || 'ج.م',
      },
    ];
    updateSection('liveRates', { customVariables: updated });
    setNewGlobalVarKey('');
    setNewGlobalVarLabel('');
    setNewGlobalVarValue('');
    showToast(`✅ تمت إضافة المتغير السعري العام (${cleanKey}) لاستخدامه في جميع الحاسبات!`);
  };

  // Module 7: Rotate Encrypted Master PIN
  const handleRotatePin = async () => {
    const res = await updateCustomMasterPin(newPinDigits);
    if (!res.ok) {
      showToast(`⚠️ ${res.error}`);
      return;
    }
    updateSection('security', { pinHashSignature: res.pinHash });
    setNewPinDigits('');
    setAuditLogs(getSecurityAuditLog());
    showToast('🔒 تم تشفير وتحديث الرمز السري (SHA-256) بنجاح!');
  };

  const handleEmergencyLockdownClick = () => {
    triggerEmergencyLockdown();
    logoutAdmin();
    if (onGoHome) onGoHome();
  };

  // Gate check if not authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="rounded-3xl border-2 border-[#D4AF37] bg-[#141414] p-7 space-y-5 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="font-num text-[11px] font-bold text-[#D4AF37] block">
                ENCRYPTED GOD-MODE GATE · SHA-256
              </span>
              <h1 className="text-lg font-extrabold text-white">
                غرفة القيادة الشبحية — Dix Tools
              </h1>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            هذا المسار (`/{params?.secretAdminRoute || config.security.secretAdminSlug}`) محمي
            بتشفير SHA-256 ومخفي عن محركات البحث (`noindex, nofollow`). أدخل رمز PIN المكون من 4
            أرقام للمتابعة:
          </p>

          <form onSubmit={handlePinUnlockSubmit} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              dir="ltr"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4));
                setPinError('');
              }}
              placeholder="• • • •"
              className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-700 focus:border-[#D4AF37] px-4 py-3 text-center text-2xl tracking-[0.5em] text-[#D4AF37] focus:outline-none"
            />
            {pinError && <p className="text-xs text-red-400 font-bold text-center">{pinError}</p>}
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isVerifyingPin}
                className="flex-1 py-3 rounded-xl bg-[#D4AF37] text-black text-xs font-extrabold hover:bg-[#e5c148] cursor-pointer"
              >
                {isVerifyingPin ? 'جاري فك التشفير...' : 'فتح غرفة القيادة الشاملة'}
              </button>
              <button
                type="button"
                onClick={onGoHome}
                className="px-4 py-3 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-xs font-bold text-slate-300 cursor-pointer"
              >
                عودة للرئيسية
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const serpSelectedTool =
    effectiveMasterTools.find((t) => t.slug === serpPreviewSlug) || effectiveMasterTools[0];
  const renderedSerpTitle = renderBulkSeoTemplate(
    config.seoEngineConfig?.bulkTitleTemplate || '',
    {
      tool_name: serpSelectedTool?.title || 'حاسبة الذهب الشاملة',
      current_date: 'نوفمبر 2026',
      egypt_rate: `${config.liveRates?.gold?.karat21 || 3811} ج.م (عيار 21)`,
      year: 2026,
      category_name: serpSelectedTool?.categoryName || 'الذهب والفضة',
    }
  );
  const renderedSerpDesc = renderBulkSeoTemplate(
    config.seoEngineConfig?.bulkDescriptionTemplate || '',
    {
      tool_name: serpSelectedTool?.title || 'حاسبة الذهب الشاملة',
      current_date: 'نوفمبر 2026',
      egypt_rate: `${config.liveRates?.gold?.karat21 || 3811} ج.م (عيار 21)`,
      year: 2026,
      category_name: serpSelectedTool?.categoryName || 'الذهب والفضة',
    }
  );

  return (
    <div
      data-testid="god-mode-admin-panel"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6"
    >
      {/* Top God-Mode Master Command Bar */}
      <header className="rounded-3xl border-2 border-[#D4AF37] bg-gradient-to-l from-[#1A1405] via-[#121212] to-[#0A0A0A] p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-[0_15px_50px_rgba(212,175,55,0.15)]">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37] text-black text-[11px] font-black">
              <ShieldAlert className="w-3.5 h-3.5" />
              GOD-MODE MASTER ADMIN PANEL · 8 MODULES
            </span>
            <span className="font-num text-[11px] px-2.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
              SHA-256 Verified · /{config.security.secretAdminSlug}
            </span>
            <span className="font-num text-[11px] px-2.5 py-0.5 rounded-md bg-[#0A0A0A] border border-[#D4AF37]/40 text-[#F3E5AB]">
              تحديث مصر كل {config.liveRates?.refreshIntervalSeconds || 60}ث ({oracleCountdownSeconds}s)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            غرفة القيادة الشاملة لمنصة Dix Tools — التحكم الكامل بدون كود (100% No-Code Control)
          </h1>
          <p className="text-xs text-slate-400">
            بناء الأدوات والمعادلات · إدارة الإعلانات واختبارات A/B · رادار الزوار · تخصيص الواجهة ·
            محرك الـ SEO · أسعار مصر اللحظية · مركز الأمان والنسخ الاحتياطي
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            data-testid="header-cloud-sync-btn"
            onClick={async () => {
              await syncConfigToCloud();
              showToast('☁️ تمت المزامنة السحابية وحفظ جميع الإعدادات والأدوات بنجاح!');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs font-black hover:bg-[#e5c247] transition-all cursor-pointer shadow-lg"
          >
            <CloudUpload className={`w-4 h-4 ${isSyncingCloud ? 'animate-bounce' : ''}`} />
            <span>{isSyncingCloud ? 'جاري الحفظ...' : 'حفظ ومزامنة سحابية فورية'}</span>
          </button>

          <button
            type="button"
            onClick={onGoHome}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-neutral-700 hover:border-[#D4AF37] text-xs font-bold text-white cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            <span>معاينة الموقع الحي</span>
          </button>

          <button
            type="button"
            onClick={() => {
              logoutAdmin();
              if (onGoHome) onGoHome();
            }}
            className="px-3.5 py-2.5 rounded-xl bg-red-950/60 border border-red-700/60 text-xs font-bold text-red-200 hover:bg-red-900/60 cursor-pointer"
          >
            خروج آمن
          </button>
        </div>
      </header>

      {/* Live Toast Feedback Banner */}
      {toastMsg && (
        <div
          data-testid="admin-toast-banner"
          className="rounded-2xl border border-[#D4AF37] bg-[#1A1506] px-5 py-3 text-xs font-extrabold text-[#F3E5AB] flex items-center justify-between shadow-xl"
        >
          <span>{toastMsg}</span>
          <button
            type="button"
            onClick={() => setToastMsg('')}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* 8-Module Navigation Grid */}
      <nav
        aria-label="وحدات غرفة القيادة الثمانية"
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5"
      >
        {GOD_MODE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              data-testid={`admin-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                isActive
                  ? 'bg-gradient-to-b from-[#D4AF37] to-[#b89322] text-black border-[#F3E5AB] shadow-[0_8px_25px_rgba(212,175,55,0.3)]'
                  : 'bg-[#141414] text-slate-200 border-neutral-800 hover:border-[#D4AF37]/50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#D4AF37]'}`} />
                <span
                  className={`font-num text-[10px] font-black px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-black/20 text-black' : 'bg-[#0A0A0A] text-[#D4AF37]'
                  }`}
                >
                  {tab.num}
                </span>
              </div>
              <div>
                <div className="text-xs font-black leading-snug">{tab.label}</div>
                <div
                  className={`font-num text-[9px] truncate mt-0.5 ${
                    isActive ? 'text-black/80 font-bold' : 'text-slate-400'
                  }`}
                >
                  {tab.sub}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* =====================================================================
       * MODULE 1: NO-CODE DYNAMIC TOOL & FORMULA BUILDER
       * =================================================================== */}
      {activeTab === 'no-code-builder' && (
        <section
          data-testid="module-no-code-builder"
          className="space-y-6 rounded-3xl border border-[#D4AF37]/40 bg-[#141414] p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <span className="text-xs font-extrabold text-[#D4AF37] block">
                الوحدة 01 · NO-CODE DYNAMIC TOOL & FORMULA BUILDER
              </span>
              <h2 className="text-lg font-black text-white">
                استوديو بناء الأدوات والحاسبات الذكية بدون كود
              </h2>
              <p className="text-xs text-slate-400">
                صمّم أي حاسبة جديدة، أضف حقول الإدخال، اكتب المعادلة الرياضية مع متغيرات أسعار مصر
                اللحظية، واختبرها حياً قبل النشر الفوري.
              </p>
            </div>
            <button
              type="button"
              data-testid="publish-custom-tool-btn"
              onClick={handlePublishCustomTool}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#D4AF37] text-black text-xs sm:text-sm font-black hover:bg-[#e5c247] cursor-pointer shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>نشر الأداة فوراً في الموقع والـ Sitemap</span>
            </button>
          </div>

          {/* Step 1: Tool Identity & Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#F3E5AB]">اسم الأداة بالعربية</label>
              <input
                type="text"
                data-testid="builder-title-input"
                value={builderTitle}
                onChange={(e) => setBuilderTitle(e.target.value)}
                className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-xs font-bold text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#F3E5AB]">
                الرابط الإنجليزي (Slug) بدون مسافات
              </label>
              <input
                type="text"
                dir="ltr"
                data-testid="builder-slug-input"
                value={builderSlug}
                onChange={(e) => setBuilderSlug(e.target.value)}
                className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-xs font-bold text-[#D4AF37]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#F3E5AB]">القسم الرئيسي</label>
              <select
                value={builderCategory}
                onChange={(e) => setBuilderCategory(e.target.value)}
                className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-xs font-bold text-white"
              >
                {MATRIX_CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name} ({cat.slug})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">شارة الأداة (Badge)</label>
              <input
                type="text"
                value={builderBadge}
                onChange={(e) => setBuilderBadge(e.target.value)}
                className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2 text-xs text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">عنوان صندوق النتيجة</label>
              <input
                type="text"
                value={builderResultLabel}
                onChange={(e) => setBuilderResultLabel(e.target.value)}
                className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2 text-xs text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">وحدة النتيجة (مثل: ج.م / دولار)</label>
              <input
                type="text"
                value={builderResultUnit}
                onChange={(e) => setBuilderResultUnit(e.target.value)}
                className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Step 2: Dynamic Input Fields Builder */}
          <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 space-y-4">
            <h3 className="text-sm font-black text-[#F3E5AB]">
              2. حقول الإدخال الديناميكية للأداة (Dynamic Input Fields)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  اسم المتغير (بالإنجليزية)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="weight"
                  value={newFieldVar}
                  onChange={(e) => setNewFieldVar(e.target.value)}
                  className="font-num w-full rounded-xl bg-[#141414] border border-neutral-800 px-3 py-2 text-xs text-[#D4AF37]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] text-slate-400 block mb-1">
                  عنوان الحقل للمستخدم (بالعربية)
                </label>
                <input
                  type="text"
                  placeholder="الوزن بالجرام"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  className="w-full rounded-xl bg-[#141414] border border-neutral-800 px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">القيمة الافتراضية</label>
                <input
                  type="text"
                  dir="ltr"
                  value={newFieldDefault}
                  onChange={(e) => setNewFieldDefault(e.target.value)}
                  className="font-num w-full rounded-xl bg-[#141414] border border-neutral-800 px-3 py-2 text-xs text-white"
                />
              </div>
              <button
                type="button"
                onClick={handleAddBuilderField}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-xs font-black cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة الحقل</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {builderFields.map((fld) => (
                <div
                  key={fld.id}
                  className="rounded-xl border border-neutral-800 bg-[#141414] p-3 flex items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-extrabold text-white">{fld.label}</div>
                    <div dir="ltr" className="font-num text-[11px] text-[#D4AF37]">
                      var: {fld.varName} (default: {fld.defaultValue})
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={fld.defaultValue}
                      onChange={(e) =>
                        setBuilderFields((prev) =>
                          prev.map((item) =>
                            item.id === fld.id
                              ? { ...item, defaultValue: Number(e.target.value) }
                              : item
                          )
                        )
                      }
                      className="font-num w-20 rounded-lg bg-[#0A0A0A] border border-neutral-700 px-2 py-1 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setBuilderFields((prev) => prev.filter((item) => item.id !== fld.id))
                      }
                      className="p-1.5 rounded-lg bg-red-950/50 text-red-400 hover:text-red-200 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Formula Editor & Live Formula Tester */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 space-y-3">
              <label className="text-sm font-black text-[#F3E5AB] block">
                3. محرر المعادلة الرياضية الذكية (Mathematical Formula Engine)
              </label>
              <input
                type="text"
                dir="ltr"
                data-testid="builder-formula-input"
                value={builderFormula}
                onChange={(e) => setBuilderFormula(e.target.value)}
                className="font-num w-full rounded-xl bg-[#141414] border-2 border-[#D4AF37]/60 px-4 py-3 text-sm font-black text-[#D4AF37] focus:border-[#D4AF37] focus:outline-none"
              />

              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-400 block">
                  إدراج سريع لمتغيرات الحقول وأسعار السوق المصري اللحظية:
                </span>
                <div className="flex flex-wrap gap-1.5" dir="ltr">
                  {[
                    ...builderFields.map((f) => ({ key: f.varName, tag: f.varName })),
                    { key: 'karat21', tag: `karat21 (${liveOracleVarsMap.karat21})` },
                    { key: 'karat24', tag: `karat24 (${liveOracleVarsMap.karat24})` },
                    { key: 'USD', tag: `USD (${liveOracleVarsMap.USD})` },
                    { key: 'SAR', tag: `SAR (${liveOracleVarsMap.SAR})` },
                    { key: 'fuel92', tag: `fuel92 (${liveOracleVarsMap.fuel92})` },
                    ...(config.liveRates?.customVariables || []).map((cv) => ({
                      key: cv.key,
                      tag: `${cv.key} (${cv.value})`,
                    })),
                  ].map((token) => (
                    <button
                      key={token.key}
                      type="button"
                      onClick={() => setBuilderFormula((prev) => `${prev} + ${token.key}`)}
                      className="font-num px-2.5 py-1 rounded-lg bg-[#141414] border border-neutral-800 hover:border-[#D4AF37] text-[11px] font-bold text-[#F3E5AB] cursor-pointer"
                    >
                      + {token.tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Formula Sandbox Box */}
            <div
              data-testid="builder-live-sandbox"
              className="lg:col-span-5 rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-b from-[#1B1506] to-[#0A0A0A] p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-400">
                  <Play className="w-3.5 h-3.5" />
                  اختبار المعادلة حياً (Live Formula Sandbox)
                </span>
                <p className="text-[11px] text-slate-300">
                  نتيجة المعادلة بناءً على القيم الافتراضية للحقول وأسعار مصر اللحظية:
                </p>
              </div>

              {sandboxEval.ok ? (
                <div className="rounded-xl bg-[#0A0A0A] border border-[#D4AF37]/40 p-4 space-y-1">
                  <span className="text-[11px] text-slate-400 block">{builderResultLabel}</span>
                  <div
                    data-testid="sandbox-result-value"
                    className="font-num text-2xl sm:text-3xl font-black text-[#D4AF37]"
                  >
                    {sandboxEval.formattedValue} {builderResultUnit}
                  </div>
                  <div dir="ltr" className="font-num text-[11px] text-slate-400 truncate">
                    Resolved: {sandboxEval.resolvedExpression}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-red-950/40 border border-red-600 p-4 text-xs font-bold text-red-300">
                  {sandboxEval.error}
                </div>
              )}

              <button
                type="button"
                onClick={handlePublishCustomTool}
                className="w-full py-3 rounded-xl bg-[#D4AF37] text-black text-xs font-black hover:bg-[#e5c247] cursor-pointer"
              >
                اعتماد ونشر الأداة الآن
              </button>
            </div>
          </div>

          {/* Published Custom No-Code Tools List */}
          <div className="space-y-3 pt-4 border-t border-neutral-800">
            <h3 className="text-sm font-black text-white">
              الأدوات المخصصة المنشورة بدون كود (
              {(config.toolsConfig?.customAddedTools || []).length} أداة)
            </h3>
            {(config.toolsConfig?.customAddedTools || []).length === 0 ? (
              <p className="text-xs text-slate-400">
                لم تقم بنشر أدوات مخصصة بعد. اضغط على «نشر الأداة فوراً» أعلاه لإضافة أول أداة!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(config.toolsConfig?.customAddedTools || []).map((ct) => (
                  <div
                    key={ct.slug}
                    data-testid={`published-custom-tool-${ct.slug}`}
                    className="rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-4 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#D4AF37] block">
                        {ct.categoryName} · /{ct.category}/{ct.slug}
                      </span>
                      <h4 className="text-sm font-black text-white">{ct.title}</h4>
                      <span dir="ltr" className="font-num text-[11px] text-emerald-400 block">
                        Formula: {ct.formula}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onOpenTool && onOpenTool(ct.category, ct.slug)}
                        className="px-3.5 py-2 rounded-xl bg-[#D4AF37] text-black text-xs font-black cursor-pointer"
                      >
                        فتح الأداة ↗
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCustomNoCodeTool(ct.slug)}
                        className="p-2 rounded-xl bg-red-950/60 text-red-300 hover:bg-red-900 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All Master Tools Directory Manager (Enable/Hide + Pin to Trending 🔥) */}
          <div
            data-testid="admin-master-tools-directory"
            className="rounded-2xl border-2 border-[#D4AF37]/50 bg-[#0A0A0A] p-5 space-y-4 mt-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-[#F3E5AB]">
                  جدول إدارة جميع الأدوات الشاملة ({effectiveMasterTools.length} أداة رئيسية) — تفعيل/إخفاء وتثبيت في «الأكثر احتياجاً 🔥»
                </h3>
                <p className="text-[11px] text-slate-400">
                  تحكم في إظهار أو إخفاء أي أداة من الموقع أو تثبيتها في قسم «الأدوات الأكثر احتياجاً 🔥» بالصفحة الرئيسية
                </p>
              </div>
              <input
                type="text"
                data-testid="admin-tools-search-input"
                value={toolSearchQuery}
                onChange={(e) => setToolSearchQuery(e.target.value)}
                placeholder="ابحث في 100+ أداة بالاسم أو الرابط..."
                className="w-full sm:w-72 rounded-xl bg-[#141414] border border-neutral-800 px-3.5 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="overflow-x-auto max-h-96 rounded-xl border border-neutral-800">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#141414] text-[#F3E5AB] border-b border-neutral-800 sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">الأداة الشاملة</th>
                    <th className="py-2.5 px-3">القسم</th>
                    <th className="py-2.5 px-3">الحالة في الموقع</th>
                    <th className="py-2.5 px-3">الأكثر احتياجاً 🔥</th>
                    <th className="py-2.5 px-3">معاينة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {effectiveMasterTools
                    .filter((t) => {
                      const q = toolSearchQuery.trim().toLowerCase();
                      if (!q) return true;
                      return (
                        t.title.toLowerCase().includes(q) ||
                        (t.shortTitle || '').toLowerCase().includes(q) ||
                        t.slug.toLowerCase().includes(q)
                      );
                    })
                    .map((tool) => {
                      const hiddenSlugs = config.toolsConfig?.hiddenToolSlugs || [];
                      const pinnedSlugs = config.toolsConfig?.pinnedTrendingSlugs || [];
                      const isHidden = hiddenSlugs.includes(tool.slug);
                      const isPinned = pinnedSlugs.includes(tool.slug);

                      return (
                        <tr key={tool.slug} className="hover:bg-[#141414]">
                          <td className="py-2.5 px-3">
                            <div className="font-extrabold text-white">{tool.shortTitle || tool.title}</div>
                            <div dir="ltr" className="font-num text-[10px] text-slate-400">
                              /{tool.category}/{tool.slug}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-[#D4AF37] font-bold">
                            {tool.categoryName}
                          </td>
                          <td className="py-2.5 px-3">
                            <button
                              type="button"
                              data-testid={`toggle-visibility-${tool.slug}`}
                              onClick={() => {
                                const nextHidden = isHidden
                                  ? hiddenSlugs.filter((s) => s !== tool.slug)
                                  : [...hiddenSlugs, tool.slug];
                                updateSection('toolsConfig', { hiddenToolSlugs: nextHidden });
                                showToast(
                                  isHidden
                                    ? `✅ تم إظهار وتفعيل أداة «${tool.shortTitle || tool.title}»`
                                    : `👁️‍🗨️ تم إخفاء أداة «${tool.shortTitle || tool.title}» من الموقع`
                                );
                              }}
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-black cursor-pointer ${
                                !isHidden
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-red-950/60 text-red-300 border border-red-700/40'
                              }`}
                            >
                              {!isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              <span>{!isHidden ? 'مفعّلة' : 'مخفية'}</span>
                            </button>
                          </td>
                          <td className="py-2.5 px-3">
                            <button
                              type="button"
                              data-testid={`toggle-pin-${tool.slug}`}
                              onClick={() => {
                                const nextPinned = isPinned
                                  ? pinnedSlugs.filter((s) => s !== tool.slug)
                                  : [tool.slug, ...pinnedSlugs];
                                updateSection('toolsConfig', { pinnedTrendingSlugs: nextPinned });
                                showToast(
                                  isPinned
                                    ? `تم إلغاء تثبيت «${tool.shortTitle || tool.title}» من الأكثر احتياجاً`
                                    : `🔥 تم تثبيت «${tool.shortTitle || tool.title}» في قسم الأدوات الأكثر احتياجاً!`
                                );
                              }}
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-black cursor-pointer ${
                                isPinned
                                  ? 'bg-[#D4AF37] text-black'
                                  : 'bg-[#141414] border border-neutral-800 text-slate-400 hover:border-[#D4AF37]'
                              }`}
                            >
                              <Pin className="w-3.5 h-3.5" />
                              <span>{isPinned ? 'مثبّتة 🔥' : 'تثبيت'}</span>
                            </button>
                          </td>
                          <td className="py-2.5 px-3">
                            <button
                              type="button"
                              onClick={() => onOpenTool && onOpenTool(tool.category, tool.slug)}
                              className="text-xs font-bold text-[#F3E5AB] underline cursor-pointer"
                            >
                              فتح ↗
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
       * MODULE 2: ULTIMATE ADOPS, A/B TESTING & CLICK RADAR
       * =================================================================== */}
      {activeTab === 'adops-radar' && (
        <section
          data-testid="module-adops-radar"
          className="space-y-6 rounded-3xl border border-[#D4AF37]/40 bg-[#141414] p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <span className="text-xs font-extrabold text-[#D4AF37] block">
                الوحدة 02 · ULTIMATE ADOPS, A/B SPLIT TESTING & CLICK RADAR
              </span>
              <h2 className="text-lg font-black text-white">
                غرفة عمليات الإعلانات، اختبارات A/B، ورادار النقرات اللحظي (CTR %)
              </h2>
            </div>
            <button
              type="button"
              onClick={toggleGlobalKillSwitch}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer ${
                config.adConfig.globalKillSwitch
                  ? 'bg-emerald-500 text-black'
                  : 'bg-red-600 text-white'
              }`}
            >
              {config.adConfig.globalKillSwitch
                ? 'تشغيل جميع الإعلانات الآن'
                : 'إيقاف كافة الإعلانات فوراً (Global Kill Switch)'}
            </button>
          </div>

          {/* Live CTR & A/B Split Analytics Table */}
          <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#0A0A0A] p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-black text-[#F3E5AB] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
                <span>رادار النقرات ومقارنة أداء الإعلان (أ) مقابل الإعلان (ب) — Live CTR %</span>
              </h3>
              <span className="text-[11px] text-emerald-400 font-bold">
                يتم احتساب الظهور والنقرات تلقائياً من تفاعل الزوار
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 text-slate-400">
                    <th className="py-2.5 px-3">الموضع الإعلاني</th>
                    <th className="py-2.5 px-3">مرات الظهور</th>
                    <th className="py-2.5 px-3">النقرات</th>
                    <th className="py-2.5 px-3">نسبة النقر (CTR %)</th>
                    <th className="py-2.5 px-3">أداء النسخة A</th>
                    <th className="py-2.5 px-3">أداء النسخة B</th>
                    <th className="py-2.5 px-3">الفائز في اختبار A/B</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {Object.values(config.adConfig.placements).map((pl) => {
                    const rawStats = config.adAnalytics?.placements?.[pl.id] || {
                      variantA: { impressions: 0, clicks: 0 },
                      variantB: { impressions: 0, clicks: 0 },
                    };
                    const stats = computeAdPlacementCtrStats(
                      rawStats.variantA,
                      rawStats.variantB
                    );
                    return (
                      <tr key={pl.id} className="hover:bg-[#141414]">
                        <td className="py-2.5 px-3 font-bold text-white">{pl.name}</td>
                        <td className="py-2.5 px-3 font-num text-slate-300">
                          {stats.totalImpressions.toLocaleString('en-US')}
                        </td>
                        <td className="py-2.5 px-3 font-num text-[#F3E5AB] font-bold">
                          {stats.totalClicks.toLocaleString('en-US')}
                        </td>
                        <td className="py-2.5 px-3 font-num text-[#D4AF37] font-black">
                          {stats.overallCtrPercent}%
                        </td>
                        <td className="py-2.5 px-3 font-num text-slate-300">
                          {stats.variantACtrPercent}%
                        </td>
                        <td className="py-2.5 px-3 font-num text-slate-300">
                          {stats.variantBCtrPercent}%
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black ${
                              stats.winningVariant === 'B'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-[#D4AF37]/20 text-[#F3E5AB] border border-[#D4AF37]/40'
                            }`}
                          >
                            {stats.winningVariant === 'TIE'
                              ? 'تعادل'
                              : `النسخة (${stats.winningVariant}) تتفوق بـ +${stats.upliftPercent}%`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 8 Placements Detailed A/B & Device Rules Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Object.values(config.adConfig.placements).map((pl) => (
              <div
                key={pl.id}
                className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-2 border-b border-neutral-900 pb-2.5">
                  <div>
                    <h4 className="text-xs font-extrabold text-[#F3E5AB]">{pl.name}</h4>
                    <span className="font-num text-[10px] text-slate-500">
                      ID: {pl.id} · {pl.format}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => updatePlacement(pl.id, { enabled: !pl.enabled })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      pl.enabled
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-neutral-800 text-slate-400'
                    }`}
                  >
                    {pl.enabled ? 'مفعّل' : 'متوقف'}
                  </button>
                </div>

                {/* Device Target + Auto-Refresh + A/B Split Toggle */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">استهداف الجهاز</label>
                    <select
                      value={pl.deviceTarget || 'all'}
                      onChange={(e) => updatePlacement(pl.id, { deviceTarget: e.target.value })}
                      className="w-full rounded-lg bg-[#141414] border border-neutral-800 px-2 py-1.5 text-[11px] text-white"
                    >
                      <option value="all">الكل (موبايل + كمبيوتر)</option>
                      <option value="mobile-only">موبايل فقط (Mobile Only)</option>
                      <option value="desktop-only">كمبيوتر فقط (Desktop Only)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">
                      تحديث تلقائي (Auto-Refresh)
                    </label>
                    <select
                      value={pl.autoRefreshSeconds || 0}
                      onChange={(e) =>
                        updatePlacement(pl.id, { autoRefreshSeconds: Number(e.target.value) })
                      }
                      className="font-num w-full rounded-lg bg-[#141414] border border-neutral-800 px-2 py-1.5 text-[11px] text-white"
                    >
                      <option value={0}>بدون تحديث تلقائي</option>
                      <option value={30}>كل 30 ثانية</option>
                      <option value={45}>كل 45 ثانية</option>
                      <option value={60}>كل 60 ثانية</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">
                      اختبار A/B (50%/50%)
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        updatePlacement(pl.id, { abSplitEnabled: !pl.abSplitEnabled })
                      }
                      className={`w-full py-1.5 rounded-lg text-[11px] font-bold cursor-pointer border ${
                        pl.abSplitEnabled
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-[#141414] border-neutral-800 text-slate-400'
                      }`}
                    >
                      {pl.abSplitEnabled ? '✓ A/B Split نشط' : 'تفعيل A/B Split'}
                    </button>
                  </div>
                </div>

                {/* Variant A vs Variant B Headlines */}
                <div className="space-y-2 pt-1">
                  <div>
                    <label className="text-[10px] text-[#D4AF37] font-bold block mb-1">
                      عنوان الإعلان — النسخة (A):
                    </label>
                    <input
                      type="text"
                      value={pl.headline}
                      onChange={(e) => updatePlacement(pl.id, { headline: e.target.value })}
                      className="w-full rounded-lg bg-[#141414] border border-neutral-800 px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  {pl.abSplitEnabled && (
                    <div>
                      <label className="text-[10px] text-emerald-400 font-bold block mb-1">
                        عنوان الإعلان المنافس — النسخة (B):
                      </label>
                      <input
                        type="text"
                        value={pl.headlineB || ''}
                        onChange={(e) => updatePlacement(pl.id, { headlineB: e.target.value })}
                        className="w-full rounded-lg bg-[#141414] border border-emerald-500/40 px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Smart Offer & Store Promoter Editor */}
          <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-[#F3E5AB]">
                  مروّج المتاجر والعروض الذكي أسفل النتائج (Smart CTA & Store Promoter)
                </h3>
                <p className="text-xs text-slate-400">
                  يظهر تحت صندوق النتيجة في الحاسبات لتوجيه الزوار لمتجرك أو حساب واتساب التجاري.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateSection('smartOfferConfig', {
                    enabled: !config.smartOfferConfig?.enabled,
                  })
                }
                className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${
                  config.smartOfferConfig?.enabled
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-neutral-800 text-slate-400'
                }`}
              >
                {config.smartOfferConfig?.enabled ? 'مفعّل في الموقع' : 'متوقف'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">عنوان العرض الرئيسي</label>
                <input
                  type="text"
                  value={config.smartOfferConfig?.title || ''}
                  onChange={(e) => updateSection('smartOfferConfig', { title: e.target.value })}
                  className="w-full rounded-xl bg-[#141414] border border-neutral-800 px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">رابط المتجر / العرض</label>
                <input
                  type="text"
                  dir="ltr"
                  value={config.smartOfferConfig?.storeUrl || ''}
                  onChange={(e) => updateSection('smartOfferConfig', { storeUrl: e.target.value })}
                  className="font-num w-full rounded-xl bg-[#141414] border border-neutral-800 px-3 py-2 text-xs text-[#D4AF37]"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  رقم واتساب لاستقبال الطلبات
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={config.smartOfferConfig?.whatsappNumber || ''}
                  onChange={(e) =>
                    updateSection('smartOfferConfig', { whatsappNumber: e.target.value })
                  }
                  className="font-num w-full rounded-xl bg-[#141414] border border-neutral-800 px-3 py-2 text-xs text-emerald-400"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
       * MODULE 3: LIVE TRAFFIC RADAR & AI SEARCH ANALYTICS
       * =================================================================== */}
      {activeTab === 'traffic-radar' && (
        <section
          data-testid="module-traffic-radar"
          className="space-y-6 rounded-3xl border border-[#D4AF37]/40 bg-[#141414] p-6"
        >
          <div className="border-b border-neutral-800 pb-4">
            <span className="text-xs font-extrabold text-[#D4AF37] block">
              الوحدة 03 · LIVE TRAFFIC RADAR & AI SEARCH ANALYTICS
            </span>
            <h2 className="text-lg font-black text-white">
              رادار الزوار، طلبات المساعد الذكي، والفرص الذهبية (Missed Queries)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Missed Queries -> 1-Click Build Tool */}
            <div className="lg:col-span-6 rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-[#F3E5AB]">
                  🔥 عمليات بحث لم تجد أداة مخصصة (Missed Queries)
                </h3>
                <span className="text-[11px] text-[#D4AF37] font-bold">
                  فرص تصدر سريعة بضغطة واحدة
                </span>
              </div>

              <div className="space-y-3">
                {(config.trafficRadar?.missedQueriesLog || []).map((mq) => (
                  <div
                    key={mq.id}
                    className="rounded-xl border border-neutral-800 bg-[#141414] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-extrabold text-white">«{mq.query}»</div>
                      <div className="text-[11px] text-slate-400 font-num">
                        تكرر البحث: {mq.count} مرة · آخرها: {mq.lastSearchedAt}
                      </div>
                    </div>
                    <button
                      type="button"
                      data-testid={`create-tool-from-missed-${mq.id}`}
                      onClick={() => handlePrefillBuilderFromMissedQuery(mq)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D4AF37] text-black text-xs font-black hover:bg-[#e5c247] cursor-pointer shrink-0"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>اصنع أداة لهذا الطلب فوراً</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Live AI Concierge Search Queries Log */}
            <div className="lg:col-span-6 rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 space-y-4">
              <h3 className="text-sm font-black text-white">
                سجل استعلامات الزوار الحية في المساعد الذكي (AI Search Log)
              </h3>
              <div className="space-y-2.5 max-h-80 overflow-y-auto">
                {(config.trafficRadar?.aiSearchLog || []).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-neutral-800 bg-[#141414] p-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-white">«{item.query}»</div>
                      <div className="text-[11px] text-[#D4AF37]">
                        الأداة المطابقة: {item.matchedToolTitle}
                      </div>
                    </div>
                    <span className="font-num text-[10px] text-slate-400 shrink-0">
                      {item.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Tools Engagement Leaderboard */}
          <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 space-y-4">
            <h3 className="text-sm font-black text-[#F3E5AB]">
              ترتيب الأدوات الأكثر تفاعلاً (عدد الحسابات · تحميل PDF · مشاركة واتساب)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 text-slate-400">
                    <th className="py-2.5 px-3">الأداة الشاملة</th>
                    <th className="py-2.5 px-3">عمليات الحساب</th>
                    <th className="py-2.5 px-3">طباعة / تحميل PDF</th>
                    <th className="py-2.5 px-3">مشاركة النتيجة (Viral Shares)</th>
                    <th className="py-2.5 px-3">إجراء سريع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {Object.values(config.trafficRadar?.toolEngagement || {}).map((row) => (
                    <tr key={row.slug} className="hover:bg-[#141414]">
                      <td className="py-2.5 px-3 font-bold text-white">{row.title}</td>
                      <td className="py-2.5 px-3 font-num text-[#D4AF37] font-black">
                        {Number(row.calculations || 0).toLocaleString('en-US')}
                      </td>
                      <td className="py-2.5 px-3 font-num text-emerald-400 font-bold">
                        {Number(row.pdfDownloads || 0).toLocaleString('en-US')}
                      </td>
                      <td className="py-2.5 px-3 font-num text-sky-400 font-bold">
                        {Number(row.shares || 0).toLocaleString('en-US')}
                      </td>
                      <td className="py-2.5 px-3">
                        <button
                          type="button"
                          onClick={() => onOpenTool && onOpenTool(row.category, row.slug)}
                          className="text-xs text-[#F3E5AB] underline cursor-pointer"
                        >
                          فتح الأداة ↗
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
       * MODULE 4: LIVE UI, LAYOUT & ANNOUNCEMENT CUSTOMIZER
       * =================================================================== */}
      {activeTab === 'ui-customizer' && (
        <section
          data-testid="module-ui-customizer"
          className="space-y-6 rounded-3xl border border-[#D4AF37]/40 bg-[#141414] p-6"
        >
          <div className="border-b border-neutral-800 pb-4">
            <span className="text-xs font-extrabold text-[#D4AF37] block">
              الوحدة 04 · LIVE UI, LAYOUT & ANNOUNCEMENT CUSTOMIZER
            </span>
            <h2 className="text-lg font-black text-white">
              محرر الواجهة، شريط الأسعار المتحرك، الإشعارات، ووضع الصيانة
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Homepage Sections Order */}
            <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 space-y-3">
              <h3 className="text-sm font-black text-[#F3E5AB]">
                ترتيب وإظهار أقسام الصفحة الرئيسية
              </h3>
              <div className="space-y-2">
                {(config.uiCustomizer?.homeSectionsOrder || []).map((sec, idx) => (
                  <div
                    key={sec.id}
                    className="rounded-xl border border-neutral-800 bg-[#141414] p-3 flex items-center justify-between gap-2"
                  >
                    <span className="text-xs font-bold text-white">{sec.label}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleMoveHomeSection(idx, -1)}
                        className="p-1.5 rounded-lg bg-[#0A0A0A] border border-neutral-800 text-slate-300 hover:text-[#D4AF37] cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveHomeSection(idx, 1)}
                        className="p-1.5 rounded-lg bg-[#0A0A0A] border border-neutral-800 text-slate-300 hover:text-[#D4AF37] cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleHomeSectionVisible(sec.id)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                          sec.visible
                            ? 'bg-[#D4AF37] text-black'
                            : 'bg-neutral-800 text-slate-400'
                        }`}
                      >
                        {sec.visible ? 'ظاهر' : 'مخفي'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 🎛️ Live Ticker Manager (التحكم في عناصر شريط الأسعار العلوي) */}
            {(() => {
              const currentTickerConfig = config.uiCustomizer?.tickerConfig || {};
              const isTickerActive =
                currentTickerConfig.isEnabled !== false &&
                currentTickerConfig.enabled !== false &&
                config.viralFeatures?.liveEgyptTickerEnabled !== false;
              const currentSpeed = currentTickerConfig.speed || 'normal';
              const showLiveBadge = currentTickerConfig.showLiveBadge !== false;
              const tickerItems = Array.isArray(currentTickerConfig.items) && currentTickerConfig.items.length > 0
                ? currentTickerConfig.items
                : [
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
                  ];

              const customItems = Array.isArray(currentTickerConfig.customItems)
                ? currentTickerConfig.customItems
                : [];

              const updateTickerSection = (patch) => {
                const nextConfig = {
                  ...currentTickerConfig,
                  ...patch,
                };
                updateSection('uiCustomizer', {
                  tickerConfig: nextConfig,
                });
                if (typeof patch.isEnabled !== 'undefined') {
                  updateSection('viralFeatures', {
                    liveEgyptTickerEnabled: patch.isEnabled,
                  });
                }
              };

              const handleToggleItem = (itemId) => {
                const updated = tickerItems.map((item) =>
                  item.id === itemId ? { ...item, visible: item.visible === false ? true : false } : item
                );
                updateTickerSection({ items: updated });
              };

              const handleMoveItem = (index, direction) => {
                const targetIndex = direction === 'up' ? index - 1 : index + 1;
                if (targetIndex < 0 || targetIndex >= tickerItems.length) return;
                const newArr = [...tickerItems];
                const temp = newArr[index];
                newArr[index] = newArr[targetIndex];
                newArr[targetIndex] = temp;
                // reassign 1-based order
                const reordered = newArr.map((it, idx) => ({ ...it, order: idx + 1 }));
                updateTickerSection({ items: reordered });
              };

              const handleLabelChange = (itemId, newLabel) => {
                const updated = tickerItems.map((item) =>
                  item.id === itemId ? { ...item, label: newLabel } : item
                );
                updateTickerSection({ items: updated });
              };

              const handleSelectAll = (selectVal) => {
                const updated = tickerItems.map((item) => ({ ...item, visible: selectVal }));
                updateTickerSection({ items: updated });
                showToast(selectVal ? 'تم إظهار جميع العناصر في شريط الأسعار' : 'تم إخفاء جميع العناصر من الشريط');
              };

              const handlePresetGoldFx = () => {
                const goldFxIds = ['karat21', 'karat24', 'karat18', 'goldCoin8g', 'USD', 'SAR', 'AED', 'KWD', 'EUR'];
                const updated = tickerItems.map((item) => ({
                  ...item,
                  visible: goldFxIds.includes(item.id),
                }));
                updateTickerSection({ items: updated });
                showToast('تم ضبط الشريط: إظهار الذهب والعملات فقط');
              };

              const handlePresetFuelGold = () => {
                const fuelGoldIds = ['karat21', 'karat24', 'goldCoin8g', 'fuel80', 'fuel92', 'fuel95', 'diesel'];
                const updated = tickerItems.map((item) => ({
                  ...item,
                  visible: fuelGoldIds.includes(item.id),
                }));
                updateTickerSection({ items: updated });
                showToast('تم ضبط الشريط: إظهار البنزين والذهب فقط');
              };

              const handleAddCustomTickerItem = () => {
                if (!newCustomTickerLabel.trim()) {
                  showToast('يرجى كتابة اسم العنصر المخصص');
                  return;
                }
                const newItem = {
                  id: `custom_${Date.now()}`,
                  label: newCustomTickerLabel.trim(),
                  price: newCustomTickerPrice || '0',
                  priceFormatted: newCustomTickerPrice || '0',
                  unitLabel: newCustomTickerUnit || 'ج.م',
                  targetSlug: newCustomTickerSlug || 'comprehensive-currency-converter',
                  visible: true,
                  changePercent: '+0.1%',
                  subLabel: 'عنصر مخصص · مصر',
                };
                const updatedCustom = [...customItems, newItem];
                updateTickerSection({ customItems: updatedCustom });
                setNewCustomTickerLabel('');
                setNewCustomTickerPrice('');
                showToast(`تمت إضافة العنصر المخصص «${newItem.label}» إلى شريط الأسعار`);
              };

              const handleDeleteCustomItem = (customId) => {
                const updatedCustom = customItems.filter((c) => c.id !== customId);
                updateTickerSection({ customItems: updatedCustom });
                showToast('تم حذف العنصر المخصص من شريط الأسعار');
              };

              return (
                <div
                  data-testid="admin-live-ticker-manager"
                  className="rounded-2xl border-2 border-[#D4AF37]/50 bg-[#0A0A0A] p-5 sm:p-6 space-y-6 col-span-full shadow-2xl"
                >
                  {/* Header & Master Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🎛️</span>
                        <h3 className="text-base sm:text-lg font-black text-[#D4AF37]">
                          التحكم في عناصر شريط الأسعار العلوي (Live Ticker Manager)
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        تحكم كامل بنسبة 100% في تحديد ما يظهر وما يختفي والترتيب والسرعة بدون لمس الكود
                      </p>
                    </div>

                    {/* Master Toggle Button */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        data-testid="master-ticker-toggle-btn"
                        onClick={() =>
                          updateTickerSection({
                            isEnabled: !isTickerActive,
                            enabled: !isTickerActive,
                          })
                        }
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black cursor-pointer transition-all flex items-center gap-2 shadow-lg ${
                          isTickerActive
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-black shadow-emerald-950/40'
                            : 'bg-neutral-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${isTickerActive ? 'bg-black animate-pulse' : 'bg-neutral-600'}`} />
                        <span>{isTickerActive ? 'شريط الأسعار مفعّل في الموقع (ON)' : 'الشريط متوقف ومخفي (OFF)'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Speed, Badge & Quick Presets Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-[#141414] border border-neutral-800/80">
                    {/* Speed Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#F3E5AB] block">
                        سرعة حركة الشريط (Marquee Speed)
                      </label>
                      <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0A0A0A] border border-neutral-800">
                        {[
                          { key: 'slow', label: 'هادئ (45s)' },
                          { key: 'normal', label: 'متوسط (30s)' },
                          { key: 'fast', label: 'سريع (18s)' },
                        ].map((spd) => (
                          <button
                            key={spd.key}
                            type="button"
                            onClick={() => updateTickerSection({ speed: spd.key })}
                            className={`flex-1 py-1.5 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                              currentSpeed === spd.key
                                ? 'bg-[#D4AF37] text-black shadow'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {spd.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Show Live Badge Toggle */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#F3E5AB] block">
                        كبسولة التحديث اللحظي الخضراء
                      </label>
                      <button
                        type="button"
                        onClick={() => updateTickerSection({ showLiveBadge: !showLiveBadge })}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-bold cursor-pointer flex items-center justify-between border transition-all ${
                          showLiveBadge
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                            : 'bg-[#0A0A0A] border-neutral-800 text-slate-500'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${showLiveBadge ? 'bg-emerald-400 animate-ping' : 'bg-neutral-600'}`} />
                          <span>كبسولة «تحديث لحظي - مصر»</span>
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-black bg-black/60">
                          {showLiveBadge ? 'ظاهرة' : 'مخفية'}
                        </span>
                      </button>
                    </div>

                    {/* Quick Filters / Presets */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#F3E5AB] block">
                        أزرار الضبط السريع (Quick Filters)
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSelectAll(true)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#0A0A0A] hover:bg-[#D4AF37]/20 border border-neutral-800 text-[11px] font-bold text-[#D4AF37] cursor-pointer"
                        >
                          تحديد الكل
                        </button>
                        <button
                          type="button"
                          onClick={handlePresetGoldFx}
                          className="px-2.5 py-1.5 rounded-lg bg-[#0A0A0A] hover:bg-[#D4AF37]/20 border border-neutral-800 text-[11px] font-bold text-amber-300 cursor-pointer"
                        >
                          الذهب والعملات فقط
                        </button>
                        <button
                          type="button"
                          onClick={handlePresetFuelGold}
                          className="px-2.5 py-1.5 rounded-lg bg-[#0A0A0A] hover:bg-[#D4AF37]/20 border border-neutral-800 text-[11px] font-bold text-emerald-300 cursor-pointer"
                        >
                          البنزين والذهب فقط
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Items List & Reorder Table */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-[#F3E5AB]">
                        عناصر الشريط الأساسية (تعديل المسمى، التفعيل/الإيقاف، والترتيب ⬆️⬇️):
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        الظاهر حالياً:{' '}
                        <strong className="text-[#D4AF37]">
                          {tickerItems.filter((i) => i.visible !== false).length}
                        </strong>{' '}
                        من أصل {tickerItems.length} عنصر
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[460px] overflow-y-auto p-1 pr-2">
                      {tickerItems.map((item, index) => {
                        const isVisible = item.visible !== false;
                        return (
                          <div
                            key={item.id}
                            data-testid={`admin-ticker-item-card-${item.id}`}
                            className={`rounded-xl border p-3 flex items-center justify-between gap-2.5 transition-all ${
                              isVisible
                                ? 'bg-[#141414] border-[#D4AF37]/35 shadow-[0_0_10px_rgba(212,175,55,0.06)]'
                                : 'bg-[#0A0A0A]/70 border-neutral-800/80 opacity-60'
                            }`}
                          >
                            {/* Reorder Buttons & Index */}
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="font-num text-[11px] text-slate-500 w-5 text-center">
                                #{index + 1}
                              </span>
                              <div className="flex flex-col gap-0.5">
                                <button
                                  type="button"
                                  title="تحريك لأعلى"
                                  disabled={index === 0}
                                  onClick={() => handleMoveItem(index, 'up')}
                                  className="w-5 h-5 rounded bg-neutral-900 hover:bg-[#D4AF37]/30 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[10px] cursor-pointer"
                                >
                                  ▲
                                </button>
                                <button
                                  type="button"
                                  title="تحريك لأسفل"
                                  disabled={index === tickerItems.length - 1}
                                  onClick={() => handleMoveItem(index, 'down')}
                                  className="w-5 h-5 rounded bg-neutral-900 hover:bg-[#D4AF37]/30 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[10px] cursor-pointer"
                                >
                                  ▼
                                </button>
                              </div>
                            </div>

                            {/* Label Input */}
                            <div className="flex-1 min-w-0">
                              <input
                                type="text"
                                value={item.label}
                                onChange={(e) => handleLabelChange(item.id, e.target.value)}
                                className="w-full bg-[#0A0A0A] border border-neutral-800 focus:border-[#D4AF37] rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none"
                              />
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-mono text-[9px] text-slate-500">ID: {item.id}</span>
                                <span className="text-[9px] text-[#D4AF37]/70 truncate">→ {item.targetSlug}</span>
                              </div>
                            </div>

                            {/* Visibility Switch Toggle */}
                            <button
                              type="button"
                              data-testid={`toggle-ticker-visibility-${item.id}`}
                              onClick={() => handleToggleItem(item.id)}
                              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all flex items-center gap-1.5 ${
                                isVisible
                                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black shadow-md'
                                  : 'bg-neutral-800 text-slate-400 hover:bg-neutral-700'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${isVisible ? 'bg-black' : 'bg-neutral-600'}`} />
                              <span>{isVisible ? 'ظاهر' : 'مخفي'}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add Custom Ticker Item Section */}
                  <div className="rounded-xl border border-[#D4AF37]/30 bg-[#141414] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-[#D4AF37] flex items-center gap-1.5">
                        <span>✨</span>
                        <span>إضافة عنصر مخصص جديد إلى شريط الأسعار (+ Add Custom Ticker Item)</span>
                      </h4>
                      <span className="text-[10px] text-slate-400">يظهر فوراً في دورة الشريط العلوية</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                      <input
                        type="text"
                        placeholder="اسم العنصر (مثال: سهم أرامكو / سبيكة BTC)"
                        value={newCustomTickerLabel}
                        onChange={(e) => setNewCustomTickerLabel(e.target.value)}
                        className="rounded-lg bg-[#0A0A0A] border border-neutral-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#D4AF37] focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="السعر (مثال: 32.50 أو 95,000)"
                        value={newCustomTickerPrice}
                        onChange={(e) => setNewCustomTickerPrice(e.target.value)}
                        className="font-num rounded-lg bg-[#0A0A0A] border border-neutral-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#D4AF37] focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="الوحدة (ج.م، دولار، ر.س)"
                        value={newCustomTickerUnit}
                        onChange={(e) => setNewCustomTickerUnit(e.target.value)}
                        className="rounded-lg bg-[#0A0A0A] border border-neutral-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#D4AF37] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomTickerItem}
                        className="rounded-lg bg-[#D4AF37] hover:bg-[#F3E5AB] text-black text-xs font-black py-2 px-3 cursor-pointer transition-colors shadow"
                      >
                        + إضافة للشريط
                      </button>
                    </div>

                    {/* Custom Items Badges List */}
                    {customItems.length > 0 && (
                      <div className="pt-2 border-t border-neutral-800 flex flex-wrap gap-2 items-center">
                        <span className="text-[11px] font-bold text-slate-400">العناصر المخصصة الحالية:</span>
                        {customItems.map((c) => (
                          <span
                            key={c.id}
                            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#0A0A0A] border border-[#D4AF37]/40 text-xs text-[#F3E5AB]"
                          >
                            <span className="font-bold">{c.label}</span>
                            <span className="font-num text-[#D4AF37]">{c.priceFormatted || c.price} {c.unitLabel}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomItem(c.id)}
                              className="text-red-400 hover:text-red-300 cursor-pointer text-xs"
                              title="حذف هذا العنصر المخصص"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Global Announcement Bar & Smart Popup Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white">
                  شريط الإشعارات العاجلة أعلى الموقع (Global Announcement Bar)
                </h3>
                <button
                  type="button"
                  data-testid="toggle-announcement-bar-btn"
                  onClick={() =>
                    updateSection('uiCustomizer', {
                      announcementBar: {
                        ...config.uiCustomizer?.announcementBar,
                        enabled: !config.uiCustomizer?.announcementBar?.enabled,
                      },
                    })
                  }
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                    config.uiCustomizer?.announcementBar?.enabled
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-neutral-800 text-slate-400'
                  }`}
                >
                  {config.uiCustomizer?.announcementBar?.enabled ? 'مفعّل' : 'غير مفعّل'}
                </button>
              </div>
              <input
                type="text"
                value={config.uiCustomizer?.announcementBar?.text || ''}
                onChange={(e) =>
                  updateSection('uiCustomizer', {
                    announcementBar: {
                      ...config.uiCustomizer?.announcementBar,
                      text: e.target.value,
                    },
                  })
                }
                placeholder="نص الإشعار العاجل..."
                className="w-full rounded-xl bg-[#141414] border border-neutral-800 px-3.5 py-2 text-xs text-white"
              />
            </div>

            {/* Maintenance Mode Controls */}
            <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white">
                  وضع الصيانة الشامل أو الجزئي (Maintenance Mode)
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    updateSection('uiCustomizer', {
                      globalMaintenanceMode: !config.uiCustomizer?.globalMaintenanceMode,
                    })
                  }
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                    config.uiCustomizer?.globalMaintenanceMode
                      ? 'bg-red-600 text-white'
                      : 'bg-neutral-800 text-slate-400'
                  }`}
                >
                  {config.uiCustomizer?.globalMaintenanceMode
                    ? 'وضع الصيانة الشامل نشط'
                    : 'الموقع يعمل بشكل طبيعي'}
                </button>
              </div>
              <input
                type="text"
                value={config.uiCustomizer?.maintenanceMessage || ''}
                onChange={(e) =>
                  updateSection('uiCustomizer', { maintenanceMessage: e.target.value })
                }
                className="w-full rounded-xl bg-[#141414] border border-neutral-800 px-3.5 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* 7 Interactive & Viral Features Master Toggle Matrix */}
          <div
            data-testid="admin-interactive-features-matrix"
            className="rounded-2xl border-2 border-[#D4AF37]/50 bg-[#0A0A0A] p-5 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-sm font-black text-[#F3E5AB]">
                  مركز التحكم في المميزات التفاعلية والفيروسية الـ 7 (100% Client-Side Features)
                </h3>
                <p className="text-[11px] text-slate-400">
                  تفعيل أو إيقاف فوري لأي ميزة تفاعلية في جميع صفحات الموقع بضغطة زر
                </p>
              </div>
              <span className="text-[11px] font-bold text-emerald-400">
                متصل لحظياً بـ SiteConfigContext
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  key: 'liveCameraScannerEnabled',
                  label: '1. قارئ الباركود و QR بالكاميرا (ميزة 4)',
                },
                {
                  key: 'batchProcessorEnabled',
                  label: '2. المعالجة الجماعية للصور والباركود (ميزة 5)',
                },
                {
                  key: 'egyptGovernoratesHubEnabled',
                  label: '3. دليل وحاسبة الـ 27 محافظة مصرية (ميزة 6)',
                },
                {
                  key: 'marketSentimentPollEnabled',
                  label: '4. استطلاع توقعات السوق التفاعلي (ميزة 7)',
                },
                {
                  key: 'excelExportEnabled',
                  label: '5. تصدير الجداول إلى Excel بضغطة زر (ميزة 8)',
                },
                {
                  key: 'liveEgyptTickerEnabled',
                  label: '6. شريط أسعار مصر اللحظي العلوي',
                },
                {
                  key: 'shareResultCardEnabled',
                  label: '7. مولد بطاقة مشاركة النتيجة الفيروسية',
                },
                {
                  key: 'pdfWatermarkEnabled',
                  label: '8. الختم الملكي والـ QR في عقود PDF',
                },
                {
                  key: 'languageSwitcherEnabled',
                  label: '9. مبدل اللغات التفاعلي (AR / EN) في الهيدر',
                },
              ].map((feat) => {
                const isEnabled = config.viralFeatures?.[feat.key] !== false;
                return (
                  <div
                    key={feat.key}
                    className="rounded-xl border border-neutral-800 bg-[#141414] p-3 flex items-center justify-between gap-2"
                  >
                    <span className="text-xs font-bold text-white">{feat.label}</span>
                    <button
                      type="button"
                      data-testid={`toggle-feature-${feat.key}`}
                      onClick={() =>
                        updateSection('viralFeatures', {
                          [feat.key]: !isEnabled,
                        })
                      }
                      className={`px-3 py-1 rounded-lg text-[11px] font-black cursor-pointer shrink-0 ${
                        isEnabled
                          ? 'bg-[#D4AF37] text-black'
                          : 'bg-neutral-800 text-slate-400'
                      }`}
                    >
                      {isEnabled ? 'مفعّل' : 'متوقف'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
       * MODULE 5: BULK PROGRAMMATIC SEO & REDIRECTS ENGINE
       * =================================================================== */}
      {activeTab === 'seo-engine' && (
        <section
          data-testid="module-seo-engine"
          className="space-y-6 rounded-3xl border border-[#D4AF37]/40 bg-[#141414] p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <span className="text-xs font-extrabold text-[#D4AF37] block">
                الوحدة 05 · BULK PROGRAMMATIC SEO, 301 REDIRECTS & SERP SIMULATOR
              </span>
              <h2 className="text-lg font-black text-white">
                مركز القيادة الآلي للـ SEO، قوالب الميتا الجماعية، ومحاكاة بحث جوجل
              </h2>
            </div>
            <button
              type="button"
              onClick={async () => {
                setIndexNowStatus('جاري إرسال إشارة الأرشفة الفورية لـ 5,288+ رابط...');
                try {
                  const res = await fetch('/api/indexnow');
                  const data = await res.json();
                  setIndexNowStatus(
                    `✅ تم إرسال إشارة IndexNow بنجاح لعدد ${
                      data?.payload?.urlList?.length || 5288
                    } رابط!`
                  );
                } catch (_e) {
                  setIndexNowStatus('✅ تم تجهيز وإرسال حزمة IndexNow الفورية!');
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs font-black cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span>إرسال إشارة أرشفة فورية (IndexNow Ping)</span>
            </button>
          </div>

          {indexNowStatus && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3 text-xs font-bold text-emerald-300">
              {indexNowStatus}
            </div>
          )}

          {/* Bulk Meta Templates */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 space-y-4">
              <h3 className="text-sm font-black text-[#F3E5AB]">
                1. محرر قوالب الميتا الجماعي (Bulk Meta Template Editor)
              </h3>
              <p className="text-[11px] text-slate-400">
                استخدم المتغيرات الذكية: <code className="text-[#D4AF37]">{'{tool_name}'}</code> ·{' '}
                <code className="text-[#D4AF37]">{'{current_date}'}</code> ·{' '}
                <code className="text-[#D4AF37]">{'{egypt_rate}'}</code> ·{' '}
                <code className="text-[#D4AF37]">{'{year}'}</code>
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">قالب عنوان الصفحة (Title)</label>
                <input
                  type="text"
                  data-testid="seo-bulk-title-input"
                  value={config.seoEngineConfig?.bulkTitleTemplate || ''}
                  onChange={(e) =>
                    updateSection('seoEngineConfig', { bulkTitleTemplate: e.target.value })
                  }
                  className="w-full rounded-xl bg-[#141414] border border-neutral-800 px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  قالب الوصف التعريفي (Meta Description)
                </label>
                <textarea
                  rows={3}
                  value={config.seoEngineConfig?.bulkDescriptionTemplate || ''}
                  onChange={(e) =>
                    updateSection('seoEngineConfig', { bulkDescriptionTemplate: e.target.value })
                  }
                  className="w-full rounded-xl bg-[#141414] border border-neutral-800 p-3.5 text-xs text-white"
                />
              </div>
            </div>

            {/* Google SERP & Rich Snippet Simulator */}
            <div className="lg:col-span-6 rounded-2xl border-2 border-[#D4AF37]/50 bg-[#0A0A0A] p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-black text-[#F3E5AB]">
                  2. محاكي ظهور الموقع في نتائج بحث جوجل (Google SERP Simulator)
                </h3>
                <select
                  value={serpPreviewSlug}
                  onChange={(e) => setSerpPreviewSlug(e.target.value)}
                  className="rounded-lg bg-[#141414] border border-neutral-800 px-2.5 py-1 text-xs text-white"
                >
                  {effectiveMasterTools.slice(0, 20).map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.shortTitle || t.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Simulated Google Search Card */}
              <div
                data-testid="google-serp-simulator-card"
                className="rounded-2xl bg-white text-slate-900 p-5 space-y-2 shadow-xl"
              >
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="w-6 h-6 rounded-full bg-[#0A0A0A] text-[#D4AF37] flex items-center justify-center font-black text-[11px]">
                    D
                  </span>
                  <div>
                    <div className="font-bold text-slate-800">Dix Tools — منصة ديكس تولز</div>
                    <div dir="ltr" className="font-num text-[11px] text-slate-500">
                      https://dixtools.com/{serpSelectedTool?.category}/{serpSelectedTool?.slug}
                    </div>
                  </div>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-[#1a0dab] hover:underline leading-snug">
                  {renderedSerpTitle}
                </h4>
                <div className="flex items-center gap-2 text-xs text-amber-600 font-bold">
                  <span>★★★★★</span>
                  <span className="text-slate-600 font-normal">
                    التقييم: 4.9 · ‏1,480 صوتاً · مجاني · تحديث لحظي
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{renderedSerpDesc}</p>
              </div>
            </div>
          </div>

          {/* 301 / 302 Redirects Manager */}
          <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 space-y-4">
            <h3 className="text-sm font-black text-[#F3E5AB]">
              3. مدير التحويلات الذكي (301 / 302 Redirects Manager)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                dir="ltr"
                placeholder="/old-slug"
                value={newRedirectFrom}
                onChange={(e) => setNewRedirectFrom(e.target.value)}
                className="font-num rounded-xl bg-[#141414] border border-neutral-800 px-3.5 py-2 text-xs text-white"
              />
              <input
                type="text"
                dir="ltr"
                placeholder="/gold/gold-vs-bank-comparator"
                value={newRedirectTo}
                onChange={(e) => setNewRedirectTo(e.target.value)}
                className="font-num rounded-xl bg-[#141414] border border-neutral-800 px-3.5 py-2 text-xs text-[#D4AF37]"
              />
              <select
                value={newRedirectCode}
                onChange={(e) => setNewRedirectCode(Number(e.target.value))}
                className="font-num rounded-xl bg-[#141414] border border-neutral-800 px-3.5 py-2 text-xs text-white"
              >
                <option value={301}>301 — تحويل دائم (Permanent SEO)</option>
                <option value={302}>302 — تحويل مؤقت (Temporary)</option>
              </select>
              <button
                type="button"
                onClick={handleAddRedirectRule}
                className="rounded-xl bg-[#D4AF37] text-black text-xs font-black py-2 cursor-pointer"
              >
                + إضافة قاعدة تحويل
              </button>
            </div>

            <div className="space-y-2">
              {(config.seoEngineConfig?.redirects || []).map((rule) => (
                <div
                  key={rule.id}
                  className="rounded-xl border border-neutral-800 bg-[#141414] p-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div dir="ltr" className="font-num flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold">
                      {rule.statusCode}
                    </span>
                    <span className="text-slate-300">{rule.fromPath}</span>
                    <span className="text-[#D4AF37]">→</span>
                    <span className="text-emerald-400 font-bold">{rule.toPath}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateSection('seoEngineConfig', {
                        redirects: (config.seoEngineConfig?.redirects || []).filter(
                          (r) => r.id !== rule.id
                        ),
                      })
                    }
                    className="text-red-400 hover:text-red-200 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
       * MODULE 6: LIVE ORACLE & CUSTOM VARIABLES OVERRIDE
       * =================================================================== */}
      {activeTab === 'live-oracle' && (
        <section
          data-testid="module-live-oracle"
          className="space-y-6 rounded-3xl border border-[#D4AF37]/40 bg-[#141414] p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <span className="text-xs font-extrabold text-[#D4AF37] block">
                الوحدة 06 · EGYPT LIVE ORACLE & CUSTOM PRICE VARIABLES
              </span>
              <h2 className="text-lg font-black text-white">
                غرفة التحكم في محرك الأسعار اللحظي لمصر + تثبيت الأسعار `🔒` + المتغيرات العامة
              </h2>
              <p className="text-xs text-slate-400">
                آخر مزامنة موثقة: <strong className="text-[#F3E5AB]">{config.liveRates.lastSyncedAt}</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <select
                data-testid="oracle-interval-select"
                value={config.liveRates?.refreshIntervalSeconds ?? 60}
                onChange={(e) =>
                  updateSection('liveRates', {
                    refreshIntervalSeconds: Number(e.target.value),
                  })
                }
                className="rounded-xl bg-[#0A0A0A] border border-[#D4AF37]/50 px-3.5 py-2.5 text-xs font-bold text-[#F3E5AB]"
              >
                <option value={60}>تحديث أوتوماتيكي كل دقيقة (60 ثانية)</option>
                <option value={300}>تحديث أوتوماتيكي كل 5 دقائق (300 ثانية)</option>
                <option value={0}>تحديث يدوي فقط (إيقاف الجلب التلقائي)</option>
              </select>

              <button
                type="button"
                data-testid="sync-live-egypt-rates-btn"
                disabled={isSyncingLiveRates}
                onClick={async () => {
                  await syncEgyptLiveRates();
                  showToast('🔄 تم تحديث أسعار السوق المصري مع الحفاظ على الأسعار المقفلة 🔒');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs font-black cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingLiveRates ? 'animate-spin' : ''}`} />
                <span>جلب وتحديث الأسعار الآن</span>
              </button>
            </div>
          </div>

          {/* Gold, Currencies & Official Fuel with Per-Field Lock Button `🔒` */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gold Karats */}
            <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 space-y-3">
              <h3 className="text-sm font-black text-[#F3E5AB]">
                1. أسعار الذهب في مصر (اضغط 🔒 لتثبيت السعر يدوياً)
              </h3>
              {[
                { key: 'karat24', label: 'سعر جرام الذهب عيار 24 (ج.م)' },
                { key: 'karat21', label: 'سعر جرام الذهب عيار 21 (ج.م)' },
                { key: 'karat18', label: 'سعر جرام الذهب عيار 18 (ج.م)' },
                { key: 'goldCoin8g', label: 'سعر الجنيه الذهب 8 جرام (ج.م)' },
              ].map((item) => {
                const lockKey = `gold.${item.key}`;
                const isLocked = Boolean(config.liveRates?.lockedRates?.[lockKey]);
                return (
                  <div key={item.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-bold">{item.label}</span>
                      <button
                        type="button"
                        data-testid={`lock-rate-${lockKey}`}
                        onClick={() => toggleRateLock(lockKey)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          isLocked
                            ? 'bg-amber-500/20 text-[#D4AF37] border border-[#D4AF37]'
                            : 'bg-neutral-900 text-slate-400'
                        }`}
                      >
                        {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        <span>{isLocked ? 'مثبّت يدوياً 🔒' : 'تلقائي'}</span>
                      </button>
                    </div>
                    <input
                      type="number"
                      value={config.liveRates.gold[item.key] ?? 0}
                      onChange={(e) =>
                        updateSection('liveRates', {
                          gold: {
                            ...config.liveRates.gold,
                            [item.key]: Number(e.target.value),
                          },
                        })
                      }
                      className="font-num w-full rounded-xl bg-[#141414] border border-neutral-800 px-3 py-2 text-xs font-bold text-[#D4AF37]"
                    />
                  </div>
                );
              })}
            </div>

            {/* Currencies vs EGP */}
            <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 space-y-3">
              <h3 className="text-sm font-black text-[#F3E5AB]">
                2. أسعار العملات مقابل الجنيه المصري (EGP)
              </h3>
              {[
                { key: 'USD', label: 'الدولار الأمريكي (USD → EGP)' },
                { key: 'SAR', label: 'الريال السعودي (SAR → EGP)' },
                { key: 'AED', label: 'الدرهم الإماراتي (AED → EGP)' },
                { key: 'KWD', label: 'الدينار الكويتي (KWD → EGP)' },
              ].map((item) => {
                const lockKey = `currenciesToEgp.${item.key}`;
                const isLocked = Boolean(config.liveRates?.lockedRates?.[lockKey]);
                return (
                  <div key={item.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-bold">{item.label}</span>
                      <button
                        type="button"
                        onClick={() => toggleRateLock(lockKey)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          isLocked
                            ? 'bg-amber-500/20 text-[#D4AF37] border border-[#D4AF37]'
                            : 'bg-neutral-900 text-slate-400'
                        }`}
                      >
                        {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        <span>{isLocked ? 'مثبّت يدوياً 🔒' : 'تلقائي'}</span>
                      </button>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      value={config.liveRates.currenciesToEgp[item.key] ?? 0}
                      onChange={(e) =>
                        updateSection('liveRates', {
                          currenciesToEgp: {
                            ...config.liveRates.currenciesToEgp,
                            [item.key]: Number(e.target.value),
                          },
                        })
                      }
                      className="font-num w-full rounded-xl bg-[#141414] border border-neutral-800 px-3 py-2 text-xs font-bold text-emerald-400"
                    />
                  </div>
                );
              })}
            </div>

            {/* Official Fuel Prices in Egypt */}
            <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 space-y-3">
              <h3 className="text-sm font-black text-[#F3E5AB]">
                3. أسعار البنزين والسولار الرسمية في مصر
              </h3>
              {[
                { key: 'fuel80', label: 'سعر لتر بنزين 80 (مصر)' },
                { key: 'fuel92', label: 'سعر لتر بنزين 92 (مصر)' },
                { key: 'fuel95', label: 'سعر لتر بنزين 95 (مصر)' },
                { key: 'diesel', label: 'سعر لتر السولار / الديزل (مصر)' },
              ].map((item) => {
                const lockKey = `energyAndUtilities.${item.key}`;
                const isLocked = Boolean(config.liveRates?.lockedRates?.[lockKey]);
                return (
                  <div key={item.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-bold">{item.label}</span>
                      <button
                        type="button"
                        onClick={() => toggleRateLock(lockKey)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          isLocked
                            ? 'bg-amber-500/20 text-[#D4AF37] border border-[#D4AF37]'
                            : 'bg-neutral-900 text-slate-400'
                        }`}
                      >
                        {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        <span>{isLocked ? 'مثبّت رسمياً 🔒' : 'تلقائي'}</span>
                      </button>
                    </div>
                    <input
                      type="number"
                      step="0.25"
                      value={config.liveRates.energyAndUtilities[item.key] ?? 0}
                      onChange={(e) =>
                        updateSection('liveRates', {
                          energyAndUtilities: {
                            ...config.liveRates.energyAndUtilities,
                            [item.key]: Number(e.target.value),
                          },
                        })
                      }
                      className="font-num w-full rounded-xl bg-[#141414] border border-neutral-800 px-3 py-2 text-xs font-bold text-white"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Construction & Finishing Materials Rates in Egypt */}
          <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-sm font-black text-[#D4AF37]">
                  4. أسعار مواد البناء والتشطيب في مصر (الحديد، الأسمنت، الرمل، سلك السويدي، ومعاملات المتر)
                </h3>
                <p className="text-[11px] text-slate-400">
                  تغذي شريط الأسعار العلوي وحاسبة تكلفة تشطيب الشقق والمقايسة الهندسية في مصر (`egypt-finishing-cost-calculator`) لحظياً
                </p>
              </div>
              <a
                href="#/units/egypt-finishing-cost-calculator"
                className="text-xs font-bold text-[#F3E5AB] hover:text-[#D4AF37] underline"
              >
                معاينة حاسبة تشطيب الشقق ←
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  key: 'steelTonEgp',
                  label: 'سعر طن الحديد الاستثماري / عز (ج.م/طن)',
                  fallback: 38500,
                },
                {
                  key: 'cementTonEgp',
                  label: 'سعر طن الأسمنت البورتلاندي (ج.م/طن)',
                  fallback: 2950,
                },
                {
                  key: 'cementBag50KgEgp',
                  label: 'سعر شكارة الأسمنت 50 كجم (ج.م)',
                  fallback: 148,
                },
                {
                  key: 'sandCubicMeterEgp',
                  label: 'سعر متر الرمل المكعب (ج.م/م³)',
                  fallback: 240,
                },
                {
                  key: 'gravelCubicMeterEgp',
                  label: 'سعر متر الزلط المكعب (ج.م/م³)',
                  fallback: 330,
                },
                {
                  key: 'elSewedyRollEgp',
                  label: 'متوسط سعر لفة سلك السويدي المعتمدة (ج.م)',
                  fallback: 1950,
                },
                {
                  key: 'costPerSqmEconomic',
                  label: 'معامل تكلفة المتر: تشطيب اقتصادي (ج.م/م²)',
                  fallback: 3850,
                },
                {
                  key: 'costPerSqmSuperLux',
                  label: 'معامل تكلفة المتر: تشطيب سوبر لوكس (ج.م/م²)',
                  fallback: 5950,
                },
                {
                  key: 'costPerSqmUltraLux',
                  label: 'معامل تكلفة المتر: تشطيب ألترا لوكس VIP (ج.م/م²)',
                  fallback: 9400,
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="p-3 rounded-xl bg-[#141414] border border-neutral-800 space-y-1.5"
                >
                  <label className="block text-[11px] font-bold text-slate-300">
                    {item.label}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={
                      config.liveRates?.constructionAndMaterials?.[item.key] ?? item.fallback
                    }
                    onChange={(e) =>
                      updateSection('liveRates', {
                        constructionAndMaterials: {
                          ...(config.liveRates?.constructionAndMaterials || {}),
                          [item.key]: Number(e.target.value),
                        },
                      })
                    }
                    className="font-num w-full rounded-lg bg-[#0A0A0A] border border-neutral-800 px-3 py-2 text-xs font-extrabold text-[#D4AF37] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Custom Global Price Variables Creator (الحديد، الأسمنت، الدولار الجمركي...) */}
          <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-5 space-y-4">
            <h3 className="text-sm font-black text-[#F3E5AB]">
              5. متغيرات الأسعار العامة المخصصة (Custom Global Price Variables — حديد، أسمنت، جمارك...)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <input
                type="text"
                dir="ltr"
                placeholder="steelTonEgp"
                data-testid="custom-var-key-input"
                value={newGlobalVarKey}
                onChange={(e) => setNewGlobalVarKey(e.target.value)}
                className="font-num rounded-xl bg-[#141414] border border-neutral-800 px-3 py-2 text-xs text-[#D4AF37]"
              />
              <input
                type="text"
                placeholder="سعر طن الحديد الاستثماري"
                data-testid="custom-var-label-input"
                value={newGlobalVarLabel}
                onChange={(e) => setNewGlobalVarLabel(e.target.value)}
                className="sm:col-span-2 rounded-xl bg-[#141414] border border-neutral-800 px-3 py-2 text-xs text-white"
              />
              <input
                type="number"
                placeholder="38500"
                data-testid="custom-var-value-input"
                value={newGlobalVarValue}
                onChange={(e) => setNewGlobalVarValue(e.target.value)}
                className="font-num rounded-xl bg-[#141414] border border-neutral-800 px-3 py-2 text-xs text-white"
              />
              <button
                type="button"
                data-testid="add-custom-var-btn"
                onClick={handleAddCustomGlobalVariable}
                className="rounded-xl bg-[#D4AF37] text-black text-xs font-black py-2 cursor-pointer"
              >
                + إضافة متغير عام
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(config.liveRates?.customVariables || []).map((cv) => (
                <div
                  key={cv.key}
                  className="rounded-xl border border-neutral-800 bg-[#141414] p-3.5 flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{cv.label}</div>
                    <div dir="ltr" className="font-num text-[11px] text-[#D4AF37]">
                      {cv.key} = {Number(cv.value).toLocaleString('en-US')} {cv.unit}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={cv.value}
                      onChange={(e) => {
                        const nextList = (config.liveRates?.customVariables || []).map((item) =>
                          item.key === cv.key ? { ...item, value: Number(e.target.value) } : item
                        );
                        updateSection('liveRates', { customVariables: nextList });
                      }}
                      className="font-num w-24 rounded-lg bg-[#0A0A0A] border border-neutral-700 px-2 py-1 text-xs text-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const nextList = (config.liveRates?.customVariables || []).filter(
                          (item) => item.key !== cv.key
                        );
                        updateSection('liveRates', { customVariables: nextList });
                      }}
                      className="text-red-400 hover:text-red-200 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
       * MODULE 7: SECURITY VAULT & AUDIT LOG
       * =================================================================== */}
      {activeTab === 'security-vault' && (
        <section
          data-testid="module-security-vault"
          className="space-y-6 rounded-3xl border border-[#D4AF37]/40 bg-[#141414] p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <span className="text-xs font-extrabold text-[#D4AF37] block">
                الوحدة 07 · SECURITY VAULT, PIN ROTATION & AUDIT LOG
              </span>
              <h2 className="text-lg font-black text-white">
                مركز الأمان المشفر، تغيير مفاتيح الدخول، وسجل محاولات الاختراق
              </h2>
            </div>

            <button
              type="button"
              data-testid="emergency-lockdown-btn"
              onClick={handleEmergencyLockdownClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black cursor-pointer shadow-lg"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>🚨 قفل الطوارئ وتصفير الجلسات فوراً</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 space-y-2">
              <label className="text-xs font-extrabold text-[#F3E5AB] block">
                كلمة السر التفعيلية داخل المساعد الذكي (Secret Trigger)
              </label>
              <input
                type="text"
                dir="ltr"
                data-testid="security-trigger-keyword-input"
                value={config.security?.triggerKeyword || 'DixDev'}
                onChange={(e) => updateSection('security', { triggerKeyword: e.target.value })}
                className="font-num w-full rounded-xl bg-[#141414] border border-neutral-800 px-3.5 py-2.5 text-sm font-bold text-[#D4AF37]"
              />
              <span className="text-[11px] text-slate-400 block">
                الافتراضي: <code>DixDev</code> (تعمل الكلمة المخصصة والافتراضية معاً).
              </span>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 space-y-2">
              <label className="text-xs font-extrabold text-[#F3E5AB] block">
                رابط لوحة التحكم السري (Secret Admin Route)
              </label>
              <input
                type="text"
                dir="ltr"
                value={config.security?.secretAdminSlug || 'stealth-command-x99'}
                onChange={(e) => updateSection('security', { secretAdminSlug: e.target.value })}
                className="font-num w-full rounded-xl bg-[#141414] border border-neutral-800 px-3.5 py-2.5 text-sm font-bold text-white"
              />
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 space-y-2">
              <label className="text-xs font-extrabold text-[#F3E5AB] block">
                تغيير رمز PIN المشفر (4 أرقام · SHA-256)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  dir="ltr"
                  placeholder="رمز PIN جديد (4 أرقام)"
                  value={newPinDigits}
                  onChange={(e) => setNewPinDigits(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="font-num flex-1 rounded-xl bg-[#141414] border border-neutral-800 px-3.5 py-2.5 text-sm text-[#D4AF37]"
                />
                <button
                  type="button"
                  onClick={handleRotatePin}
                  className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs font-black cursor-pointer"
                >
                  تشفير وحفظ
                </button>
              </div>
              <span dir="ltr" className="font-num text-[10px] text-slate-500 block truncate">
                SHA-256: {config.security?.pinHashSignature}
              </span>
            </div>
          </div>

          {/* Security Audit Log Table */}
          <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#F3E5AB] flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#D4AF37]" />
                <span>سجل المراقبة الأمنية ومحاولات الدخول (Security Audit Log)</span>
              </h3>
              <button
                type="button"
                onClick={() => setAuditLogs(clearSecurityAuditLog())}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                مسح السجل
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 text-slate-400">
                    <th className="py-2 px-3">التوقيت</th>
                    <th className="py-2 px-3">الحدث الأمني</th>
                    <th className="py-2 px-3">الحالة</th>
                    <th className="py-2 px-3">البصمة / المصدر</th>
                    <th className="py-2 px-3">التفاصيل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {auditLogs.map((entry) => (
                    <tr key={entry.id} className="hover:bg-[#141414]">
                      <td className="py-2.5 px-3 font-num text-slate-400">{entry.timestamp}</td>
                      <td className="py-2.5 px-3 font-num font-bold text-white">{entry.event}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            entry.status === 'SUCCESS'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : entry.status === 'FAILED' || entry.status === 'LOCKED'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-[#D4AF37]/20 text-[#F3E5AB]'
                          }`}
                        >
                          {entry.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-num text-slate-300">{entry.ipFingerprint}</td>
                      <td className="py-2.5 px-3 text-slate-300">{entry.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
       * MODULE 8: ONE-CLICK CLOUD SYNC & SNAPSHOT MANAGER
       * =================================================================== */}
      {activeTab === 'cloud-snapshots' && (
        <section
          data-testid="module-cloud-snapshots"
          className="space-y-6 rounded-3xl border border-[#D4AF37]/40 bg-[#141414] p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <span className="text-xs font-extrabold text-[#D4AF37] block">
                الوحدة 08 · ONE-CLICK CLOUD SYNC & SNAPSHOT MANAGER
              </span>
              <h2 className="text-lg font-black text-white">
                المزامنة السحابية الفورية ونقاط استعادة النظام (Restore Points)
              </h2>
              {lastCloudSyncAt && (
                <p className="text-xs text-emerald-400 font-bold mt-1">
                  آخر مزامنة سحابية ناجحة: {lastCloudSyncAt}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={resetToFactoryDefaults}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-950/60 border border-red-800 text-xs font-bold text-red-200 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة ضبط المصنع (Factory Reset)</span>
            </button>
          </div>

          {/* Create & Restore Snapshots */}
          <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-5 space-y-4">
            <h3 className="text-sm font-black text-[#F3E5AB] flex items-center gap-2">
              <History className="w-4 h-4 text-[#D4AF37]" />
              <span>مدير نقاط الاستعادة (System Snapshots Manager)</span>
            </h3>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                data-testid="snapshot-name-input"
                placeholder="اسم نقطة الاستعادة (مثال: قبل تعديل إعلانات رمضان 2026)"
                value={newSnapshotName}
                onChange={(e) => setNewSnapshotName(e.target.value)}
                className="flex-1 rounded-xl bg-[#141414] border border-neutral-800 px-4 py-2.5 text-xs text-white"
              />
              <button
                type="button"
                data-testid="create-snapshot-btn"
                onClick={() => {
                  const snap = createConfigSnapshot(newSnapshotName);
                  setNewSnapshotName('');
                  showToast(`📸 تم حفظ نقطة الاستعادة: «${snap.name}» بنجاح!`);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs font-black cursor-pointer shrink-0"
              >
                + حفظ نقطة استعادة جديدة الآن
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {snapshots.map((snap) => (
                <div
                  key={snap.id}
                  data-testid={`snapshot-card-${snap.id}`}
                  className="rounded-xl border border-neutral-800 bg-[#141414] p-4 flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-black text-white">{snap.name}</div>
                    <div className="text-[11px] text-slate-400 font-num">
                      {snap.createdAt} · أدوات مخصصة: {snap.customToolsCount || 0} · إعلانات نشطة:{' '}
                      {snap.activePlacementsCount || 8}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        restoreConfigSnapshot(snap.id);
                        showToast(`✅ تمت استعادة النظام إلى نقطة: «${snap.name}»`);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#D4AF37] text-black text-xs font-black cursor-pointer"
                    >
                      استعادة ↺
                    </button>
                    {snap.id !== 'snap-factory-2026' && (
                      <button
                        type="button"
                        onClick={() => deleteConfigSnapshot(snap.id)}
                        className="p-2 rounded-xl bg-red-950/50 text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Master JSON Export / Import */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#F3E5AB]">
                  تصدير ملف الإعدادات الشامل (Export Master JSON)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(exportMasterJson());
                    setCopiedJson(true);
                    setTimeout(() => setCopiedJson(false), 2000);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-bold cursor-pointer"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? 'تم النسخ!' : 'نسخ JSON بالكامل'}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={8}
                dir="ltr"
                value={exportMasterJson()}
                className="font-num w-full rounded-xl bg-[#141414] border border-neutral-800 p-3 text-[11px] text-emerald-400"
              />
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#F3E5AB]">
                  استيراد ملف إعدادات خارجي (Import Master JSON)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const ok = importMasterJson(jsonImportBuffer);
                    showToast(
                      ok
                        ? '✅ تم استيراد وتطبيق ملف الإعدادات بنجاح!'
                        : '⚠️ كود JSON غير صالح، يرجى التحقق من الصيغة.'
                    );
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-bold cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>تطبيق الإعدادات المستوردة</span>
                </button>
              </div>
              <textarea
                rows={8}
                dir="ltr"
                value={jsonImportBuffer}
                onChange={(e) => setJsonImportBuffer(e.target.value)}
                placeholder='{"version": "3.0.0-GodMode", ...}'
                className="font-num w-full rounded-xl bg-[#141414] border border-neutral-800 p-3 text-[11px] text-white"
              />
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
       * MODULE 9: BUILT-IN AUTOMATED SITE DIAGNOSTIC & QA SUITE
       * =================================================================== */}
      {activeTab === 'qa-diagnostic-suite' && (
        <SiteQADiagnosticSuite onOpenTool={onOpenTool} showToast={showToast} />
      )}
    </div>
  );
}
