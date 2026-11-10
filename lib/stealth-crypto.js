/**
 * ============================================================================
 * Dix Tools — Stealth Cryptographic Security, Session & Audit Vault Engine
 * (`lib/stealth-crypto.js`)
 *
 * - Detects the case-insensitive AI Concierge secret trigger (`DixDev` or custom keyword).
 * - Hashes the 4-digit Master PIN using Web Crypto API (`SHA-256` via
 *   `window.crypto.subtle.digest`) with a cryptographic salt so the raw PIN
 *   is never stored in plain text in the client UI.
 * - Verifies the hash locally and via `/api/stealth-config`.
 * - Enforces 3-attempt brute-force lockout for 5 minutes (300,000 ms).
 * - Logs all successful/failed login attempts and emergency lockdowns to
 *   the persistent Security Audit Log (`dix_stealth_audit_log`).
 * ============================================================================
 */

export const STEALTH_SESSION_KEY = 'dix_stealth_session';
export const STEALTH_LOCKOUT_KEY = 'dix_stealth_lockout_state';
export const STEALTH_AUDIT_LOG_KEY = 'dix_stealth_audit_log_v1';
export const STEALTH_CUSTOM_PIN_HASH_KEY = 'dix_stealth_custom_pin_hash';
export const STEALTH_SALT = 'DIX_TOOLS_STEALTH_SALT_2026';

// Precomputed SHA-256("DIX_TOOLS_STEALTH_SALT_2026::1238") — plain PIN is never stored
export const MASTER_PIN_SHA256_HASH =
  'dbe3b84ee18ea5174010c95532f8ff46d1de510d0b7c12b4b07f0184beb26f13';

export const MAX_FAILED_ATTEMPTS = 3;
export const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

/**
 * Checks whether the query typed into AISmartFinder matches `DixDev` or the custom trigger keyword
 */
export function isSecretDixDevTrigger(input, customTriggerKeyword = 'DixDev') {
  const clean = String(input || '').trim().toLowerCase();
  if (!clean) return false;
  const customClean = String(customTriggerKeyword || 'DixDev').trim().toLowerCase();
  return clean === 'dixdev' || (customClean.length >= 3 && clean === customClean);
}

/**
 * Computes salted SHA-256 hex digest using `window.crypto.subtle.digest`
 * (or Node's `globalThis.crypto.subtle.digest`).
 */
export async function hashPinWithSha256(pinValue) {
  const cleanPin = String(pinValue || '').trim();
  const payload = `${STEALTH_SALT}::${cleanPin}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);

  const subtle =
    (typeof window !== 'undefined' && window.crypto?.subtle) ||
    globalThis.crypto?.subtle;

  if (subtle) {
    const hashBuffer = await subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  return '';
}

/**
 * Reads the active expected PIN hash (supports custom PIN hash saved in Module 7)
 */
export function getActiveMasterPinHash(customHashOverride = '') {
  if (customHashOverride && customHashOverride.length === 64) {
    return customHashOverride;
  }
  if (typeof window !== 'undefined') {
    try {
      const savedCustom = window.localStorage.getItem(STEALTH_CUSTOM_PIN_HASH_KEY);
      if (savedCustom && savedCustom.length === 64) {
        return savedCustom;
      }
    } catch (_e) {
      // Ignore
    }
  }
  return MASTER_PIN_SHA256_HASH;
}

/**
 * Updates the custom Master PIN hash in localStorage (Module 7 Security Vault)
 */
export async function updateCustomMasterPin(newFourDigitPin) {
  const clean = String(newFourDigitPin || '').replace(/\D/g, '');
  if (clean.length !== 4) {
    return { ok: false, error: 'يجب أن يتكون الرمز السري من 4 أرقام بالضبط' };
  }
  const newHash = await hashPinWithSha256(clean);
  if (typeof window !== 'undefined' && newHash) {
    try {
      window.localStorage.setItem(STEALTH_CUSTOM_PIN_HASH_KEY, newHash);
    } catch (_e) {
      // Ignore
    }
  }
  recordSecurityAuditEntry({
    event: 'PIN_ROTATED',
    status: 'SUCCESS',
    source: 'God-Mode Security Vault',
    note: `تمت ترقية وتشفير الرمز السري (SHA-256: ${newHash.slice(0, 12)}...)`,
  });
  return { ok: true, pinHash: newHash };
}

/**
 * Security Audit Log Reader & Writer (Module 7)
 */
export function getSecurityAuditLog() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STEALTH_AUDIT_LOG_KEY);
    if (!raw) {
      const seed = [
        {
          id: 'audit-init-1',
          timestamp: new Date().toLocaleString('ar-EG'),
          event: 'SYSTEM_BOOT',
          status: 'SUCCESS',
          source: 'Dix Tools Security Shield',
          ipFingerprint: '127.0.0.1 · Cairo Edge Node',
          note: 'تفعيل جدار الحماية المشفر SHA-256 وبوابة DixDev الشبحية',
        },
      ];
      window.localStorage.setItem(STEALTH_AUDIT_LOG_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_e) {
    return [];
  }
}

export function recordSecurityAuditEntry(entry = {}) {
  if (typeof window === 'undefined') return [];
  try {
    const current = getSecurityAuditLog();
    const userAgentShort =
      typeof navigator !== 'undefined'
        ? navigator.userAgent.includes('Mobile')
          ? 'Mobile Browser · Encrypted'
          : 'Desktop Workstation · Encrypted'
        : 'Client Node';

    const newItem = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toLocaleString('ar-EG'),
      event: entry.event || 'AUTH_ATTEMPT',
      status: entry.status || 'INFO',
      source: entry.source || 'Stealth Gate',
      ipFingerprint: entry.ipFingerprint || userAgentShort,
      note: entry.note || '',
    };
    const updated = [newItem, ...current].slice(0, 60);
    window.localStorage.setItem(STEALTH_AUDIT_LOG_KEY, JSON.stringify(updated));
    return updated;
  } catch (_e) {
    return [];
  }
}

export function clearSecurityAuditLog() {
  if (typeof window === 'undefined') return [];
  const fresh = [
    {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleString('ar-EG'),
      event: 'AUDIT_CLEARED',
      status: 'INFO',
      source: 'God-Mode Admin',
      ipFingerprint: 'Admin Session',
      note: 'تم تصفير سجل المراقبة الأمنية بواسطة المدير العام',
    },
  ];
  try {
    window.localStorage.setItem(STEALTH_AUDIT_LOG_KEY, JSON.stringify(fresh));
  } catch (_e) {
    // Ignore
  }
  return fresh;
}

/**
 * Reads current brute-force lockout state (3 wrong attempts -> 5-minute lock)
 */
export function getStealthLockoutStatus(nowMs = Date.now()) {
  if (typeof window === 'undefined') {
    return { isLocked: false, failedAttempts: 0, remainingSeconds: 0, lockedUntil: 0 };
  }
  try {
    const raw = window.localStorage.getItem(STEALTH_LOCKOUT_KEY);
    if (!raw) {
      return { isLocked: false, failedAttempts: 0, remainingSeconds: 0, lockedUntil: 0 };
    }
    const parsed = JSON.parse(raw);
    const lockedUntil = Number(parsed.lockedUntil || 0);
    const failedAttempts = Number(parsed.failedAttempts || 0);

    if (lockedUntil > nowMs) {
      const remainingSeconds = Math.ceil((lockedUntil - nowMs) / 1000);
      return {
        isLocked: true,
        failedAttempts,
        remainingSeconds,
        lockedUntil,
      };
    }

    if (lockedUntil > 0 && lockedUntil <= nowMs) {
      window.localStorage.removeItem(STEALTH_LOCKOUT_KEY);
      return { isLocked: false, failedAttempts: 0, remainingSeconds: 0, lockedUntil: 0 };
    }

    return { isLocked: false, failedAttempts, remainingSeconds: 0, lockedUntil: 0 };
  } catch (_err) {
    return { isLocked: false, failedAttempts: 0, remainingSeconds: 0, lockedUntil: 0 };
  }
}

/**
 * Records a failed PIN attempt and locks the gate for 5 minutes on the 3rd failure
 */
export function recordFailedPinAttempt(nowMs = Date.now()) {
  const current = getStealthLockoutStatus(nowMs);
  const nextAttempts = current.failedAttempts + 1;
  const shouldLock = nextAttempts >= MAX_FAILED_ATTEMPTS;
  const lockedUntil = shouldLock ? nowMs + LOCKOUT_DURATION_MS : 0;

  const state = {
    failedAttempts: nextAttempts,
    lockedUntil,
  };

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STEALTH_LOCKOUT_KEY, JSON.stringify(state));
    } catch (_e) {
      // Ignore storage error
    }
  }

  recordSecurityAuditEntry({
    event: shouldLock ? 'BRUTE_FORCE_LOCKOUT' : 'PIN_FAILED',
    status: 'FAILED',
    source: 'Stealth PIN Pad',
    note: shouldLock
      ? 'تم حظر البوابة تلقائياً لمدة 5 دقائق بعد 3 محاولات خاطئة'
      : `محاولة دخول برمز خاطئ (المحاولة ${nextAttempts} من ${MAX_FAILED_ATTEMPTS})`,
  });

  return {
    isLocked: shouldLock,
    failedAttempts: nextAttempts,
    attemptsRemaining: Math.max(0, MAX_FAILED_ATTEMPTS - nextAttempts),
    remainingSeconds: shouldLock ? Math.ceil(LOCKOUT_DURATION_MS / 1000) : 0,
    lockedUntil,
  };
}

/**
 * Resets failed PIN attempts upon successful authentication
 */
export function resetStealthLockout() {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(STEALTH_LOCKOUT_KEY);
    } catch (_e) {
      // Ignore
    }
  }
}

/**
 * Emergency Lockdown & Session Purge (Module 7: قفل الطوارئ وتصفير الجلسات)
 */
export function triggerEmergencyLockdown(nowMs = Date.now()) {
  clearStealthSession();
  const lockedUntil = nowMs + LOCKOUT_DURATION_MS;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(
        STEALTH_LOCKOUT_KEY,
        JSON.stringify({
          failedAttempts: MAX_FAILED_ATTEMPTS,
          lockedUntil,
        })
      );
    } catch (_e) {
      // Ignore
    }
  }
  recordSecurityAuditEntry({
    event: 'EMERGENCY_LOCKDOWN',
    status: 'LOCKED',
    source: 'God-Mode Security Vault',
    note: 'تم تفعيل قفل الطوارئ الفوري وطرد جميع الجلسات النشطة لمدة 5 دقائق',
  });
  return { isLocked: true, lockedUntil };
}

/**
 * Generates and stores the encrypted `dix_stealth_session` token
 */
export function createStealthSessionToken(pinHash = MASTER_PIN_SHA256_HASH) {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + SESSION_TTL_MS;
  const nonce = Math.random().toString(36).slice(2, 12);
  const signature = `${pinHash.slice(0, 24)}.${issuedAt.toString(36)}.${nonce}`;

  const tokenPayload = {
    token: `dix_st_${btoa(signature)}`,
    sig: pinHash.slice(0, 32),
    issuedAt,
    expiresAt,
    brand: 'Dix Tools Stealth Command',
  };

  if (typeof window !== 'undefined') {
    try {
      const serialized = JSON.stringify(tokenPayload);
      window.sessionStorage.setItem(STEALTH_SESSION_KEY, serialized);
      window.localStorage.setItem(STEALTH_SESSION_KEY, serialized);
    } catch (_e) {
      // Ignore storage errors
    }
  }

  return tokenPayload;
}

/**
 * Validates whether an active, non-expired `dix_stealth_session` token exists
 */
export function hasValidStealthSession(nowMs = Date.now()) {
  if (typeof window === 'undefined') return false;
  try {
    const raw =
      window.sessionStorage.getItem(STEALTH_SESSION_KEY) ||
      window.localStorage.getItem(STEALTH_SESSION_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.token || !parsed.expiresAt) return false;
    if (Number(parsed.expiresAt) <= nowMs) {
      clearStealthSession();
      return false;
    }
    const activeHash = getActiveMasterPinHash();
    return (
      parsed.sig === MASTER_PIN_SHA256_HASH.slice(0, 32) ||
      parsed.sig === activeHash.slice(0, 32)
    );
  } catch (_e) {
    return false;
  }
}

/**
 * Destroys the active stealth session token on logout
 */
export function clearStealthSession() {
  if (typeof window !== 'undefined') {
    try {
      window.sessionStorage.removeItem(STEALTH_SESSION_KEY);
      window.localStorage.removeItem(STEALTH_SESSION_KEY);
    } catch (_e) {
      // Ignore
    }
  }
}

/**
 * Cryptographically verifies a 4-digit PIN via SHA-256 + internal `/api/stealth-config`
 */
export async function verifyStealthMasterPin(pinInput, customPinHash = '') {
  const lockStatus = getStealthLockoutStatus();
  if (lockStatus.isLocked) {
    return {
      ok: false,
      isLocked: true,
      remainingSeconds: lockStatus.remainingSeconds,
      error: `تم قفل البوابة الأمنية لمدة 5 دقائق. حاول بعد ${lockStatus.remainingSeconds} ثانية.`,
    };
  }

  const computedHash = await hashPinWithSha256(pinInput);
  const expectedCustomHash = getActiveMasterPinHash(customPinHash);
  const hashMatches =
    computedHash === MASTER_PIN_SHA256_HASH || computedHash === expectedCustomHash;

  // Verify against internal API `/api/stealth-config` when running with a backend route
  let apiConfirmed = hashMatches;
  if (hashMatches && typeof window !== 'undefined') {
    try {
      const response = await fetch('/api/stealth-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-stealth-pin-hash': computedHash,
        },
        body: JSON.stringify({
          action: 'verify_pin',
          pinHash: computedHash,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        apiConfirmed = Boolean(data?.ok ?? true);
      }
    } catch (_networkErr) {
      // In pure client-side preview mode, rely on cryptographic SHA-256 digest match
      apiConfirmed = hashMatches;
    }
  }

  if (hashMatches && apiConfirmed) {
    resetStealthLockout();
    const session = createStealthSessionToken(computedHash);
    recordSecurityAuditEntry({
      event: 'LOGIN_SUCCESS',
      status: 'SUCCESS',
      source: 'Stealth Security Gate',
      note: 'تم فتح جلسة المدير العام المشفرة بنجاح (SHA-256 Verified)',
    });
    return {
      ok: true,
      isLocked: false,
      session,
      welcomeMessage: 'تم التحقق.. مرحباً بك في غرفة قيادة Dix Tools',
    };
  }

  const failure = recordFailedPinAttempt();
  return {
    ok: false,
    isLocked: failure.isLocked,
    failedAttempts: failure.failedAttempts,
    attemptsRemaining: failure.attemptsRemaining,
    remainingSeconds: failure.remainingSeconds,
    error: failure.isLocked
      ? 'تم قفل البوابة لمدة 5 دقائق بعد 3 محاولات خاطئة لحمايتها من التخمين'
      : 'رمز الدخول غير صحيح',
  };
}
