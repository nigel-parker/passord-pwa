const CACHE_NAME = 'passord-v6';
const urlsToCache = [
    './',
    'index.html',
    'styles.css',
    'passord.js',
    'app.js',
    'nokler.js',
    'nokler-ui.js',
    'nokler.csv',
    'manifest.json',
    'icon-192.png',
    'icon-512.png'
];

// Install service worker and cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
            .catch(err => {
                console.log('Cache addAll failed:', err);
            })
    );
});

// nokler.csv is network-first so a redeploy updates it without a cache bump.
// cache: 'no-cache' bypasses the browser HTTP cache (Pages sends max-age=600)
// and revalidates with the server. Everything else is cache-first.
self.addEventListener('fetch', event => {
    if (event.request.url.endsWith('nokler.csv')) {
        event.respondWith(
            fetch(event.request, { cache: 'no-cache' })
                .then(response => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Clean up old caches and take control immediately
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});
