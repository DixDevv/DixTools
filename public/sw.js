/**
 * Dix Tools Service Worker (`public/sw.js`)
 * Offline-First PWA & Live Egypt Oracle Snapshot Cache
 * - Caches app shell, fonts, and calculator assets (`Stale-While-Revalidate`)
 * - Caches `/api/egypt-live-oracle` and `/api/egypt-rates` responses (`Network-First` with
 *   instant offline fallback so all calculators work 100% offline with the last saved Egypt rates).
 */
const SHELL_CACHE_NAME = 'dix-tools-shell-v3';
const ORACLE_CACHE_NAME = 'dix-tools-oracle-v3';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== SHELL_CACHE_NAME && k !== ORACLE_CACHE_NAME)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1. Network-First + Offline Snapshot Cache for Egypt Live Oracle APIs
  if (
    url.pathname.startsWith('/api/egypt-live-oracle') ||
    url.pathname.startsWith('/api/egypt-rates')
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(ORACLE_CACHE_NAME).then((cache) => {
              cache.put('/api/egypt-live-oracle-latest', clone);
            });
          }
          return response;
        })
        .catch(() =>
          caches
            .open(ORACLE_CACHE_NAME)
            .then((cache) => cache.match('/api/egypt-live-oracle-latest'))
        )
    );
    return;
  }

  // 2. Stale-While-Revalidate for Same-Origin App Shell & Calculator Pages
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const networkFetch = fetch(event.request)
          .then((response) => {
            if (response && response.status === 200 && response.type === 'basic') {
              const responseClone = response.clone();
              caches.open(SHELL_CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          })
          .catch(() => cachedResponse || caches.match('/index.html'));

        return cachedResponse || networkFetch;
      })
    );
  }
});
