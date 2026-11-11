// Service worker tối giản: cache giao diện để mở nhanh, KHÔNG bao giờ cache API.
const CACHE = 'vi-canhan-v5';
const ASSETS = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Không chặn request tới Apps Script (dữ liệu luôn live)
  if (url.hostname.includes('script.google.com')) return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request))
  );
});
