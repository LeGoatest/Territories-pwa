const CACHE_NAME = 'territories-v4.1';
const ASSETS = [
  './',
  './index.html',
  './css/output.css',
  './js/ui.js',
  './js/engine.js',
  './fragments/board.html',
  './manifest.webmanifest',
  'https://unpkg.com/htmx.org@2.0.0',
  'https://code.iconify.design/3/3.1.0/iconify.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
