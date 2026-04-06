// self.addEventListener('install', () => self.skipWaiting());
// self.addEventListener('fetch', (event) => {
//     event.respondWith(fetch(event.request));
// });
self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", () => {
    clients.claim();
});

self.addEventListener("fetch", (event) => {
    event.respondWith(fetch(event.request));
});
