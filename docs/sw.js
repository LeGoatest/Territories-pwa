// Territories v1.1 - Cache-Only Service Worker
const CACHE_NAME = 'territories-v1.2.0';
const ASSETS = [
  './',
  './index.html',
  './assets/css/output.css',
  './manifest.webmanifest',
  './assets/images/icon.svg',
  './assets/images/icon-512.svg',
  './assets/images/icon-192.png',
  './assets/images/icon-512.png',
  './assets/js/engine.js',
  './assets/js/iconify.min.js'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            clients.claim(),
            // Delete old caches
            caches.keys().then(keys => {
                return Promise.all(
                    keys.filter(key => key !== CACHE_NAME)
                        .map(key => caches.delete(key))
                );
            })
        ])
    );
});

self.addEventListener('fetch', event => {
    // Standard cache-first strategy
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
