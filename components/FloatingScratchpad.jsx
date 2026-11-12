'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Pin,
  Plus,
  Trash2,
  Copy,
  Check,
  X,
  Calculator,
  Sparkles,
} from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

const SCRATCHPAD_STORAGE_KEY = 'dix_tools_quick_pinboard_v1';

const DEFAULT_PINBOARD_ITEMS = [
  {
    id: 'pin-default-1',
    label: 'سبيكة ذهب 10 جرام عيار 24',
    value: 43550,
    unit: 'ج.م',
    createdAt: 'محفوظ تلقائياً',
  },
  {
    id: 'pin-default-2',
    label: 'عائد شهادة بنكية 27% (سنوي)',
    value: 54000,
    unit: 'ج.م',
    createdAt: 'محفوظ تلقائياً',
  },
];

export function computeScratchpadSummary(items = []) {
  const safeItems = Array.isArray(items) ? items : [];
  let sumNumeric = 0;
  let countNumeric = 0;

  for (const item of safeItems) {
    const num = Number(item?.value);
    if (Number.isFinite(num)) {
      sumNumeric += num;
      countNumeric += 1;
    }
  }

  return {
    totalItems: safeItems.length,
    countNumeric,
    sumNumeric: Number(sumNumeric.toFixed(2)),
    averageNumeric:
      countNumeric > 0 ? Number((sumNumeric / countNumeric).toFixed(2)) : 0,
  };
}

export default function FloatingScratchpad() {
  const { config } = useSiteConfig();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState(DEFAULT_PINBOARD_ITEMS);
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newUnit, setNewUnit] = useState('ج.م');
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = window.localStorage.getItem(SCRATCHPAD_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Keep defaults
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    try {
      window.localStorage.setItem(SCRATCHPAD_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota errors
    }
  }, [items, isMounted]);

  // Listen for custom 'dix:pin-number' events dispatched by any tool or button
  useEffect(() => {
    const handlePinEvent = (e) => {
      const detail = e?.detail;
      if (!detail) return;
      const numericVal = Number(
        String(detail.value || '0').replace(/[^0-9.-]/g, '')
      );
      const entry = {
        id: `pin-${Date.now()}`,
        label: detail.label || 'نتيجة أداة محفوظة',
        value: Number.isFinite(numericVal) ? numericVal : 0,
        unit: detail.unit || 'ج.م',
        createdAt: new Date().toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setItems((prev) => [entry, ...prev]);
      setIsOpen(true);
    };
    window.addEventListener('dix:pin-number', handlePinEvent);
    return () => window.removeEventListener('dix:pin-number', handlePinEvent);
  }, []);

  const summary = useMemo(() => computeScratchpadSummary(items), [items]);

  if (config.viralFeatures?.floatingScratchpadEnabled === false) {
    return null;
  }

  const handleAddEntry = (e) => {
    e.preventDefault();
    const cleanVal = Number(String(newValue).replace(/,/g, ''));
    if (!newLabel.trim() && !Number.isFinite(cleanVal)) return;

    const entry = {
      id: `pin-${Date.now()}`,
      label: newLabel.trim() || `رقم محفوظ #${items.length + 1}`,
      value: Number.isFinite(cleanVal) ? cleanVal : 0,
      unit: newUnit.trim() || 'ج.م',
      createdAt: new Date().toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setItems((prev) => [entry, ...prev]);
    setNewLabel('');
    setNewValue('');
  };

  const handleQuickPinLiveRate = (label, val, unit = 'ج.م') => {
    const entry = {
      id: `pin-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      label,
      value: Number(val) || 0,
      unit,
      createdAt: new Date().toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setItems((prev) => [entry, ...prev]);
  };

  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCopyAll = () => {
    const lines = [
      '📌 مفكرة الأرقام السريعة — منصة Dix Tools',
      '━━━━━━━━━━━━━━━━━━',
      ...items.map(
        (it, idx) =>
          `${idx + 1}. ${it.label}: ${Number(it.value).toLocaleString('en-US')} ${it.unit}`
      ),
      '━━━━━━━━━━━━━━━━━━',
      `∑ الإجمالي التراكمي: ${summary.sumNumeric.toLocaleString('en-US')} ج.م`,
    ];
    navigator.clipboard?.writeText(lines.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const k21 = Number(config.liveRates?.gold?.karat21) || 3811;
  const usd = Number(config.liveRates?.currenciesToEgp?.USD) || 50.45;

  return (
    <div className="no-print">
      {/* Floating Corner Trigger Button */}
      <button
        type="button"
        data-testid="floating-scratchpad-trigger"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="مفكرة أرقام سريعة (Quick Pinboard)"
        className="fixed bottom-16 left-4 z-40 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border-2 border-[#D4AF37] bg-[#141414]/95 backdrop-blur-md text-[#F3E5AB] shadow-2xl hover:bg-[#1c1a12] transition-all cursor-pointer"
      >
        <div className="w-7 h-7 rounded-xl bg-[#D4AF37] text-black flex items-center justify-center font-black">
          <Pin className="w-4 h-4" />
        </div>
        <div className="text-right">
          <div className="text-[11px] font-black text-white leading-tight">
            مفكرة الأرقام السريعة
          </div>
          <div className="font-num text-[10px] text-[#D4AF37] font-bold">
            {items.length} محفوظ · ∑ {summary.sumNumeric.toLocaleString('en-US')}
          </div>
        </div>
      </button>

      {/* Floating Drawer / Pinboard */}
      {isOpen && (
        <aside
          data-testid="floating-scratchpad-drawer"
          aria-label="مفكرة أرقام سريعة (Quick Pinboard)"
          className="fixed bottom-32 left-4 z-50 w-[340px] sm:w-[390px] max-w-[calc(100vw-2rem)] rounded-3xl border-2 border-[#D4AF37] bg-[#0A0A0A] p-4 sm:p-5 shadow-2xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-white">
                  مفكرة أرقام سريعة (Quick Pinboard)
                </h3>
                <p className="text-[10px] text-slate-400">
                  احفظ نتائج حساباتك واجمعها تلقائياً أثناء تنقلك بين الأدوات
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-[#141414] text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Add New Pin Form */}
          <form onSubmit={handleAddEntry} className="space-y-2">
            <input
              type="text"
              data-testid="scratchpad-label-input"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="وصف الرقم (مثال: تكلفة سيراميك الشقة / قسط البنك)"
              className="w-full rounded-xl bg-[#141414] border border-neutral-800 px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="any"
                data-testid="scratchpad-value-input"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="القيمة الرقمية (مثال: 45000)"
                className="font-num flex-1 rounded-xl bg-[#141414] border border-neutral-800 px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
              />
              <input
                type="text"
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                className="w-16 rounded-xl bg-[#141414] border border-neutral-800 px-2.5 py-2 text-xs text-center text-[#F3E5AB]"
              />
              <button
                type="submit"
                data-testid="scratchpad-add-btn"
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#D4AF37] text-black text-xs font-black hover:bg-[#F3E5AB] cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>تثبيت</span>
              </button>
            </div>
          </form>

          {/* Quick 1-Click Live Rate Pins */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              تثبيت سريع:
            </span>
            <button
              type="button"
              onClick={() => handleQuickPinLiveRate('جرام ذهب عيار 21 اليوم', k21, 'ج.م')}
              className="px-2 py-1 rounded-lg bg-[#141414] border border-neutral-800 text-[10px] font-bold text-[#F3E5AB] hover:border-[#D4AF37] cursor-pointer"
            >
              + عيار 21 ({k21})
            </button>
            <button
              type="button"
              onClick={() => handleQuickPinLiveRate('سعر الدولار اللحظي', usd, 'ج.م')}
              className="px-2 py-1 rounded-lg bg-[#141414] border border-neutral-800 text-[10px] font-bold text-[#F3E5AB] hover:border-[#D4AF37] cursor-pointer"
            >
              + الدولار ({usd})
            </button>
          </div>

          {/* Pinned Items List */}
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {items.length === 0 ? (
              <div className="rounded-xl border border-neutral-800 bg-[#141414] p-4 text-center text-xs text-slate-400">
                لا توجد أرقام مثبتة حالياً. أضف أي رقم لحفظه أثناء تنقلك بين الأدوات.
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-neutral-800 bg-[#141414] px-3 py-2 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{item.label}</div>
                    <div className="text-[10px] text-slate-500">{item.createdAt}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-num text-xs font-black text-[#D4AF37]">
                      {Number(item.value).toLocaleString('en-US')} {item.unit}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-400 hover:text-red-300 cursor-pointer p-1"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cumulative Summary & Actions */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
            <div>
              <div className="text-[10px] text-slate-400">إجمالي الأرقام المثبتة (∑ Sum)</div>
              <div
                data-testid="scratchpad-total-sum"
                className="font-num text-sm font-black text-emerald-400"
              >
                {summary.sumNumeric.toLocaleString('en-US')} ج.م
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyAll}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#D4AF37] text-black text-xs font-black cursor-pointer"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAll ? 'تم النسخ!' : 'نسخ المفكرة'}</span>
              </button>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={() => setItems([])}
                  className="px-2.5 py-1.5 rounded-xl bg-red-950/60 text-red-300 text-xs font-bold cursor-pointer"
                >
                  مسح
                </button>
              )}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
