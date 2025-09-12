// Basic Service Worker to prevent 404 errors
// This is a minimal service worker that does nothing

self.addEventListener('install', (event) => {
    // Skip waiting to activate immediately
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Claim all clients
    event.waitUntil(self.clients.claim());
});

// Handle fetch events (optional - for caching)
self.addEventListener('fetch', (event) => {
    // For now, just pass through all requests
    // You can add caching logic here if needed
});