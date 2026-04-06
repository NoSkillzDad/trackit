// public/sw.js

self.addEventListener("install", (event) => {
    // Force the waiting service worker to become the active service worker.
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    // Allow the service worker to take control of pages immediately.
    event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
    // This empty fetch handler is the "secret sauce" for PWA installability.
    // It tells the browser: "I am capable of handling network requests."
    event.respondWith(fetch(event.request));
});