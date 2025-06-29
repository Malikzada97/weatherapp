// Enterprise-level Service Worker with advanced caching

const CACHE_VERSION = 'v1-enterprise';
const STATIC_CACHE = `static-cache-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-cache-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/state.js',
  '/js/storage.js',
  '/js/chatbot.js',
  '/js/speech.js',
  '/js/serviceWorkerHelper.js',
  '/manifest.json',
  '/assets/avatars/user.png',
  '/assets/avatars/bot.png',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch event — runtime caching strategy
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Network first for index.html (always try to get latest app shell)
  if (url.pathname === '/' || url.pathname.endsWith('index.html')) {
    event.respondWith(
      fetch(event.request).then(res => {
        return caches.open(STATIC_CACHE).then(cache => {
          cache.put(event.request, res.clone());
          return res;
        });
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache first for static assets
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
    return;
  }

  // Dynamic cache for any future API/backend
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(res => {
        return caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(event.request, res.clone());
          return res;
        });
      });
    }).catch(() => {
      return new Response("You're offline. Please reconnect.", {
        status: 503,
        headers: { 'Content-Type': 'text/plain' }
      });
    })
  );
});
