export const FAVORITES_STORAGE_KEY = 'dix_tools_user_favorite_slugs_v1';
export const HISTORY_STORAGE_KEY = 'dix_tools_user_calc_history_v1';
export const MAX_HISTORY_ITEMS = 5;
export const MEMORY_SYNC_EVENT = 'dix_tools_memory_updated';

function readStorageJson(key, fallback) {
  if (typeof window === 'undefined' || !window.localStorage) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch (_err) {
    return fallback;
  }
}

function writeStorageJson(key, value) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(MEMORY_SYNC_EVENT));
  } catch (_err) {
    // Ignore storage quota errors
  }
}

export function getSavedFavoriteSlugs() {
  const list = readStorageJson(FAVORITES_STORAGE_KEY, []);
  return Array.isArray(list) ? list.filter((s) => typeof s === 'string' && s.trim()) : [];
}

export function toggleFavoriteToolSlug(slug, currentSlugs) {
  const cleanSlug = String(slug || '').trim();
  if (!cleanSlug) return [];
  const base = Array.isArray(currentSlugs) ? currentSlugs : getSavedFavoriteSlugs();
  const exists = base.includes(cleanSlug);
  const next = exists ? base.filter((item) => item !== cleanSlug) : [cleanSlug, ...base];
  writeStorageJson(FAVORITES_STORAGE_KEY, next);
  return next;
}

export function getSavedCalculationsHistory() {
  const list = readStorageJson(HISTORY_STORAGE_KEY, []);
  return Array.isArray(list) ? list.slice(0, MAX_HISTORY_ITEMS) : [];
}

export function recordCalculationHistoryEntry(entry, currentHistory) {
  if (!entry || typeof entry !== 'object' || !entry.slug) {
    return Array.isArray(currentHistory) ? currentHistory : getSavedCalculationsHistory();
  }
  const base = Array.isArray(currentHistory) ? currentHistory : getSavedCalculationsHistory();
  const now = new Date();
  const formattedTime = now.toLocaleString('ar-EG', {
    timeZone: 'Africa/Cairo',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const normalizedEntry = {
    id: entry.id || `${entry.slug}-${Date.now()}`,
    slug: String(entry.slug),
    category: String(entry.category || 'finance'),
    toolTitle: String(entry.toolTitle || entry.shortTitle || 'أداة Dix Tools'),
    inputsSummary: String(entry.inputsSummary || 'حساب قياسي فوري'),
    resultSummary: String(entry.resultSummary || 'تم استخراج النتيجة'),
    queryString: String(entry.queryString || ''),
    timestamp: formattedTime,
    createdAt: Date.now(),
  };

  // Deduplicate if the exact same tool + resultSummary is already at index 0
  const filtered = base.filter(
    (item) => !(item.slug === normalizedEntry.slug && item.resultSummary === normalizedEntry.resultSummary)
  );

  const next = [normalizedEntry, ...filtered].slice(0, MAX_HISTORY_ITEMS);
  writeStorageJson(HISTORY_STORAGE_KEY, next);
  return next;
}

export function clearCalculationsHistoryStorage() {
  writeStorageJson(HISTORY_STORAGE_KEY, []);
  return [];
}

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom React Hook (`hooks/useUserToolsMemory.js`)
 * Manages localStorage-backed Favorite Tools (`⭐`) and Last 5 Calculations History
 * without requiring login, and syncs live across components in the same tab.
 */
export function useUserToolsMemory() {
  const [favoriteSlugs, setFavoriteSlugs] = useState(() => getSavedFavoriteSlugs());
  const [recentCalculations, setRecentCalculations] = useState(() => getSavedCalculationsHistory());

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const syncState = () => {
      setFavoriteSlugs(getSavedFavoriteSlugs());
      setRecentCalculations(getSavedCalculationsHistory());
    };

    window.addEventListener(MEMORY_SYNC_EVENT, syncState);
    window.addEventListener('storage', syncState);
    return () => {
      window.removeEventListener(MEMORY_SYNC_EVENT, syncState);
      window.removeEventListener('storage', syncState);
    };
  }, []);

  const isFavoriteTool = useCallback(
    (slug) => favoriteSlugs.includes(String(slug || '').trim()),
    [favoriteSlugs]
  );

  const toggleFavoriteTool = useCallback((slug) => {
    const next = toggleFavoriteToolSlug(slug);
    setFavoriteSlugs(next);
    return next;
  }, []);

  const addCalculationRecord = useCallback((entry) => {
    const next = recordCalculationHistoryEntry(entry);
    setRecentCalculations(next);
    return next;
  }, []);

  const clearCalculationHistory = useCallback(() => {
    const next = clearCalculationsHistoryStorage();
    setRecentCalculations(next);
    return next;
  }, []);

  return {
    favoriteSlugs,
    recentCalculations,
    isFavoriteTool,
    toggleFavoriteTool,
    addCalculationRecord,
    clearCalculationHistory,
  };
}

export default useUserToolsMemory;
