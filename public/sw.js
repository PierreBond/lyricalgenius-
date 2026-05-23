// Lyric Genius - Offline Service Worker (PWA and Offline Playback Support)

const CACHE_NAME = 'lyric-genius-cache-v2';

// Core static assets to pre-cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
];

// Helper to check if request is cacheable (static assets, fonts, app index, or trivia media images)
function isCacheable(request) {
  const url = new URL(request.url);
  // Avoid caching non-HTTP requests (like chrome extensions, or websocket)
  if (!url.protocol.startsWith('http')) return false;
  // Ignore POST or any non-GET requests
  if (request.method !== 'GET') return false;
  
  return true;
}

// 1. Install Event: Setup static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching core app shell items');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Clean up legacy caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Erasing legacy cache repository:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Serve from cache or fallback
self.addEventListener('fetch', (event) => {
  if (!isCacheable(event.request)) {
    return;
  }

  const url = new URL(event.request.url);

  // For navigational requests (routes to the main HTML index), use a Network-First strategy
  // falling back immediately to '/' so the app boots up fine while offline.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          console.log('[Service Worker] Offline navigation fallback invoked');
          return caches.match('/') || caches.match('/index.html');
        })
    );
    return;
  }

  // For all other static assets (js, css, images, fonts), apply a Stale-While-Revalidate caching pattern.
  // This serves cached resources instantly for lightning speed offline / online, while fetching fresh copies in the background.
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch((err) => {
          console.log('[Service Worker] Resource fetched from cache (offline fallback for):', url.pathname);
          // Return cached response if exists, otherwise throw
          if (cachedResponse) return cachedResponse;
          throw err;
        });

      return cachedResponse || fetchPromise;
    })
  );
});
