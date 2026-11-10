'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Shield, Lock, X, Delete, AlertTriangle } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import {
  verifyStealthMasterPin,
  getStealthLockoutStatus,
} from '../lib/stealth-crypto';

export default function StealthAccessModal({ onSuccessNavigate }) {
  const { config, isStealthModalOpen, setIsStealthModalOpen, unlockAdminSession } =
    useSiteConfig();
  const [pinDigits, setPinDigits] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [shakeError, setShakeError] = useState(false);
  const [lockoutState, setLockoutState] = useState(() => getStealthLockoutStatus());
  const pinInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCtrlShiftL = (e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'l';
      const isAltShiftA = e.altKey && e.shiftKey && e.key.toLowerCase() === 'a';
      if (isCtrlShiftL || isAltShiftA) {
        e.preventDefault();
        setPinDigits('');
        setStatus('idle');
        setMessage('');
        setLockoutState(getStealthLockoutStatus());
        setIsStealthModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsStealthModalOpen]);

  useEffect(() => {
    if (!isStealthModalOpen) return undefined;
    const sync = () => setLockoutState(getStealthLockoutStatus());
    sync();
    const t = setInterval(sync, 1000);
    if (pinInputRef.current) pinInputRef.current.focus();
    return () => clearInterval(t);
  }, [isStealthModalOpen]);

  if (!isStealthModalOpen) return null;

  const verifyPinNow = async (fourDigitPin) => {
    setStatus('verifying');
    const result = await verifyStealthMasterPin(fourDigitPin);
    if (result.ok) {
      setStatus('success');
      setMessage(result.welcomeMessage || 'تم التحقق.. مرحباً بك في غرفة قيادة Dix Tools');
      if (unlockAdminSession) unlockAdminSession();
      setTimeout(() => {
        setIsStealthModalOpen(false);
        setPinDigits('');
        const slug = config?.security?.secretAdminSlug || 'stealth-command-x99';
        if (typeof onSuccessNavigate === 'function') {
          onSuccessNavigate(slug);
        } else {
          window.location.hash = `/${slug}`;
        }
      }, 400);
      return;
    }

    setStatus('error');
    setMessage(result.error || 'رمز الدخول غير صحيح');
    setLockoutState(getStealthLockoutStatus());
    setShakeError(true);
    setTimeout(() => {
      setShakeError(false);
      setPinDigits('');
    }, 500);
  };

  const handlePinChange = (raw) => {
    const lock = getStealthLockoutStatus();
    if (lock.isLocked || status === 'verifying' || status === 'success') {
      setLockoutState(lock);
      return;
    }
    const clean = String(raw || '').replace(/\D/g, '').slice(0, 4);
    setPinDigits(clean);
    if (clean.length === 4) {
      verifyPinNow(clean);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="بوابة الدخول الشبحية المشفرة"
      data-testid="stealth-access-modal"
      onClick={() => pinInputRef.current?.focus()}
      className="no-print fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div
        className={`w-full max-w-md rounded-3xl border-2 p-6 space-y-5 shadow-2xl transition-all ${
          shakeError
            ? 'border-red-500 bg-red-950/30 translate-x-1'
            : 'border-[#D4AF37] bg-gradient-to-b from-[#171307] via-[#121212] to-[#0A0A0A]'
        }`}
      >
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#D4AF37] block">
                SHA-256 STEALTH SECURITY GATE
              </span>
              <h2 className="text-base font-extrabold text-white">
                بوابة غرفة قيادة Dix Tools
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsStealthModalOpen(false)}
            className="p-1.5 rounded-xl bg-neutral-900 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <input
          ref={pinInputRef}
          type="tel"
          inputMode="numeric"
          autoFocus
          aria-label="أدخل رمز المرور السري 4 أرقام"
          data-testid="stealth-modal-pin-input"
          value={pinDigits}
          disabled={lockoutState.isLocked}
          onChange={(e) => handlePinChange(e.target.value)}
          className="sr-only"
        />

        <div dir="ltr" className="grid grid-cols-4 gap-3 max-w-xs mx-auto">
          {[0, 1, 2, 3].map((idx) => {
            const filled = pinDigits.length > idx;
            return (
              <div
                key={idx}
                className={`h-14 rounded-2xl border-2 flex items-center justify-center font-num text-2xl font-extrabold ${
                  filled
                    ? 'border-[#D4AF37] bg-[#1A1506] text-[#D4AF37]'
                    : 'border-neutral-800 bg-[#0A0A0A] text-slate-600'
                }`}
              >
                {filled ? '*' : '•'}
              </div>
            );
          })}
        </div>

        <div dir="ltr" className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <button
              key={d}
              type="button"
              disabled={lockoutState.isLocked}
              onClick={() => handlePinChange(`${pinDigits}${d}`)}
              className="font-num py-2.5 rounded-xl bg-[#0A0A0A] border border-neutral-800 hover:border-[#D4AF37] text-sm font-extrabold text-white cursor-pointer"
            >
              {d}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPinDigits('')}
            className="py-2.5 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-xs text-slate-400 cursor-pointer"
          >
            مسح
          </button>
          <button
            type="button"
            disabled={lockoutState.isLocked}
            onClick={() => handlePinChange(`${pinDigits}0`)}
            className="font-num py-2.5 rounded-xl bg-[#0A0A0A] border border-neutral-800 hover:border-[#D4AF37] text-sm font-extrabold text-white cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => setPinDigits((p) => p.slice(0, -1))}
            className="py-2.5 rounded-xl bg-[#0A0A0A] border border-neutral-800 flex items-center justify-center text-slate-300 cursor-pointer"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>

        {lockoutState.isLocked ? (
          <div className="rounded-xl border border-red-600 bg-red-950/50 p-3 text-center text-xs text-red-200 font-bold flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>البوابة مقفلة لمدة {lockoutState.remainingSeconds} ثانية</span>
          </div>
        ) : message ? (
          <div
            className={`rounded-xl border px-3 py-2 text-center text-xs font-extrabold ${
              status === 'success'
                ? 'border-emerald-500 bg-emerald-950/50 text-emerald-300'
                : 'border-red-600 bg-red-950/50 text-red-300'
            }`}
          >
            {message}
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>تحقق تلقائي عند إدخال الرقم الرابع</span>
            </span>
            <span className="font-num">/{config.security.secretAdminSlug}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function useSecretFiveTapTrigger() {
  const { setIsStealthModalOpen } = useSiteConfig();
  const tapState = useRef({ count: 0, lastTap: 0 });

  return () => {
    const now = Date.now();
    if (now - tapState.current.lastTap < 650) {
      tapState.current.count += 1;
    } else {
      tapState.current.count = 1;
    }
    tapState.current.lastTap = now;

    if (tapState.current.count >= 5) {
      tapState.current.count = 0;
      setIsStealthModalOpen(true);
    }
  };
}
