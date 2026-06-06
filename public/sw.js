const CACHE_NAME = 'eduflow-pwa-cache-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/dashboard',
        '/icons/icon-192x192.png',
        '/icons/icon-512x512.png',
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // For non-GET requests (POST, PUT, etc.) always pass through to network
  if (event.request.method && event.request.method !== 'GET') {
    event.respondWith(fetch(event.request));
    return;
  }

  // Don't cache API routes or external requests, except standard static assets
  if (!url.pathname.startsWith('/_next/static') && 
      !url.pathname.startsWith('/icons') &&
      url.origin === location.origin) {
    // Network first for pages and dynamic content (only GET requests reach here)
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Only cache successful GET responses
          if (!response || response.status !== 200 || response.type === 'opaque') return response;
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // wrap in try/catch to avoid unhandled rejections
            try {
              cache.put(event.request, resClone).catch(() => {});
            } catch (e) {
              // ignore cache errors
            }
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((response) => {
            if (response) return response;
            return caches.match('/');
          });
        })
    );
    return;
  }

  // Stale-while-revalidate for static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          try {
            if (networkResponse && !networkResponse.bodyUsed) {
              cache.put(event.request, networkResponse.clone()).catch(() => {});
            }
          } catch (e) {
            // ignore cloning/caching errors
          }
        });
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );
});
