'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Sparkles, ArrowUpLeft, Gem, DollarSign, Fuel, ShieldAlert } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { getMasterTools } from '../lib/tools-matrix-generator';

/**
 * CommandPalette (`components/CommandPalette.jsx`)
 * Opens with `Ctrl + K` / `Cmd + K` or via the Header / Floating search lens button.
 * Features:
 * - Instant search across all Master Tools in Arabic & English
 * - Live Egypt Oracle mini-badges (Gold 21K, USD, Fuel 92)
 * - Secret `DixDev` trigger detection (case-insensitive): clears input immediately,
 *   closes the palette, and opens `StealthAccessModal` (`PIN: 1238`).
 */
export default function CommandPalette({ onSelectTool }) {
  const {
    config,
    visibleMasterTools,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setIsStealthModalOpen,
  } = useSiteConfig();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const toolsPool = useMemo(() => {
    return visibleMasterTools && visibleMasterTools.length > 0
      ? visibleMasterTools
      : getMasterTools();
  }, [visibleMasterTools]);

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return toolsPool.slice(0, 10);
    return toolsPool
      .filter((t) => {
        const hay = `${t.title} ${t.shortTitle} ${t.subtitle} ${t.summary} ${t.slug} ${
          t.badge || ''
        }`.toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 12);
  }, [query, toolsPool]);

  // Global Ctrl+K / Cmd+K & Escape keyboard listener
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setSelectedIndex(0);
      window.setTimeout(() => {
        inputRef.current?.focus();
      }, 40);
    } else {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  const triggerWord = (config?.security?.triggerKeyword || 'DixDev').toLowerCase();

  const handleQueryChange = (val) => {
    // Check if user typed DixDev directly
    if (val.trim().toLowerCase() === triggerWord) {
      setQuery('');
      setIsCommandPaletteOpen(false);
      setIsStealthModalOpen(true);
      return;
    }
    setQuery(val);
    setSelectedIndex(0);
  };

  const handleNavigateTool = (tool) => {
    if (!tool) return;
    setIsCommandPaletteOpen(false);
    setQuery('');
    if (typeof onSelectTool === 'function') {
      onSelectTool(tool);
    } else if (typeof window !== 'undefined') {
      window.location.hash = `#/${tool.category}/${tool.slug}`;
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim().toLowerCase() === triggerWord) {
        setQuery('');
        setIsCommandPaletteOpen(false);
        setIsStealthModalOpen(true);
        return;
      }
      if (filteredTools[selectedIndex]) {
        handleNavigateTool(filteredTools[selectedIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredTools.length > 0 ? (prev + 1) % filteredTools.length : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredTools.length > 0
          ? (prev - 1 + filteredTools.length) % filteredTools.length
          : 0
      );
    }
  };

  const gold21 = Number(config?.liveRates?.gold?.karat21 || 3811);
  const usdRate = Number(config?.liveRates?.currenciesToEgp?.USD || 50.45);
  const fuel92 = Number(config?.liveRates?.energyAndUtilities?.fuel92 || 22.25);

  return (
    <>
      {/* Floating Quick Command Button (Bottom Left) */}
      <button
        type="button"
        data-testid="floating-command-palette-trigger"
        onClick={() => setIsCommandPaletteOpen(true)}
        title="البحث الفوري السريع في جميع الأدوات (Ctrl + K)"
        className="no-print fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#121212]/95 hover:bg-[#1A1A1A] border border-[#D4AF37]/50 text-xs font-extrabold text-[#F3E5AB] shadow-[0_10px_30px_rgba(0,0,0,0.85)] cursor-pointer transition-all hover:scale-105"
      >
        <Search className="w-4 h-4 text-[#D4AF37]" />
        <span className="hidden sm:inline">بحث سريع</span>
        <kbd
          dir="ltr"
          className="px-1.5 py-0.5 rounded bg-[#0A0A0A] border border-neutral-700 text-[10px] font-num text-[#D4AF37]"
        >
          Ctrl+K
        </kbd>
      </button>

      {/* Modal Overlay */}
      {isCommandPaletteOpen && (
        <div
          data-testid="command-palette-modal"
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-md p-4 pt-14 sm:pt-20"
          onClick={() => setIsCommandPaletteOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-[#D4AF37]/60 bg-[#0E0E0E] shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-800 bg-[#141414]">
              <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                data-testid="command-palette-input"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="ابحث عن أي أداة (ذهب، دولار، صيانة، بوليصة شحن، تفقيط، QR)..."
                className="w-full bg-transparent text-sm font-bold text-white placeholder:text-slate-500 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  مسح
                </button>
              )}
              <button
                type="button"
                data-testid="command-palette-close-btn"
                onClick={() => setIsCommandPaletteOpen(false)}
                className="p-1.5 rounded-lg bg-[#0A0A0A] border border-neutral-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Egypt Instant Prices Bar inside Command Palette */}
            <div className="px-4 py-2.5 bg-[#0A0A0A] border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                الأسعار الفورية الآن في مصر:
              </span>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                <a
                  href="#/gold/comprehensive-gold-calculator"
                  onClick={() => setIsCommandPaletteOpen(false)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#141414] border border-[#D4AF37]/30 text-[#F3E5AB] font-num hover:border-[#D4AF37]"
                >
                  <Gem className="w-3 h-3 text-[#D4AF37]" />
                  <span>عيار 21: {gold21.toLocaleString('en-US')} ج.م</span>
                </a>
                <a
                  href="#/currencies/comprehensive-currency-converter"
                  onClick={() => setIsCommandPaletteOpen(false)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#141414] border border-emerald-500/30 text-emerald-300 font-num hover:border-emerald-400"
                >
                  <DollarSign className="w-3 h-3 text-emerald-400" />
                  <span>الدولار: {usdRate.toFixed(2)} ج.م</span>
                </a>
                <a
                  href="#/automotive/fuel-trip-cost-calculator"
                  onClick={() => setIsCommandPaletteOpen(false)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#141414] border border-amber-500/30 text-amber-300 font-num hover:border-amber-400"
                >
                  <Fuel className="w-3 h-3 text-amber-400" />
                  <span>بنزين 92: {fuel92.toFixed(2)} ج.م</span>
                </a>
              </div>
            </div>

            {/* Tools Results List */}
            <div className="max-h-[340px] overflow-y-auto p-2 space-y-1">
              {filteredTools.length === 0 ? (
                <div className="py-10 text-center space-y-2">
                  <ShieldAlert className="w-7 h-7 text-[#D4AF37] mx-auto opacity-80" />
                  <p className="text-xs font-bold text-slate-400">
                    لا توجد أداة مطابقة لـ «{query}» — جرب كلمات مثل: ذهب، شهادة، بوليصة، صيانة
                  </p>
                </div>
              ) : (
                filteredTools.map((tool, idx) => {
                  const isActive = idx === selectedIndex;
                  return (
                    <button
                      key={tool.slug}
                      type="button"
                      data-testid={`cmd-tool-item-${tool.slug}`}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => handleNavigateTool(tool)}
                      className={`w-full text-right px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-3 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-l from-[#D4AF37]/20 to-[#181818] border border-[#D4AF37]/50'
                          : 'bg-transparent border border-transparent hover:bg-[#141414]'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-extrabold text-white truncate">
                            {tool.shortTitle || tool.title}
                          </span>
                          {tool.badge && (
                            <span className="px-2 py-0.5 rounded bg-[#0A0A0A] border border-neutral-800 text-[10px] font-bold text-[#D4AF37] shrink-0">
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {tool.subtitle}
                        </p>
                      </div>
                      <ArrowUpLeft className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Hints */}
            <div className="px-4 py-2.5 bg-[#0A0A0A] border-t border-neutral-800 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span>↑↓ للتنقل</span>
                <span>Enter للفتح الفوري</span>
                <span>Esc للإغلاق</span>
              </div>
              <span className="text-[#D4AF37] font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                محرك البحث الفوري — Dix Tools
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
