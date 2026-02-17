const CACHE_NAME = 'territories-v1';
const ASSETS = [
  './',
  './index.html',
  './css/output.css',
  './manifest.webmanifest',
  './js/engine.js',
  './js/ui.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
