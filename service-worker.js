// service-worker.js

const CACHE_NAME = 'my-app-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/scripts/main.js',
    '/images/icon.png'
];

self.addEventListener('install', event => {
    // Precargar recursos en la caché
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});


self.addEventListener('fetch', event => {
    // Manejar solicitudes fetch
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
