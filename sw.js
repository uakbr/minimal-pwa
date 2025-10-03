const CACHE_NAME = 'days-until-forever-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestURL = new URL(event.request.url);

  if (requestURL.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // If a window is already open, focus it
        for (const client of clientList) {
          if ('focus' in client) {
            return client.focus();
          }
        }
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow('./');
        }
      })
  );
});

// Handle periodic background sync for notifications
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'countdown-reminder') {
    event.waitUntil(showCountdownNotification());
  }
});

// Manual message-based notification trigger (fallback for browsers without periodic sync)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    scheduleNotification(event.data.delay);
  }
});

async function showCountdownNotification() {
  try {
    // Get event data from IndexedDB or use message passing
    const title = 'Countdown Reminder';
    const options = {
      body: 'Check your countdown progress!',
      icon: './icon-192.png',
      badge: './icon-192.png',
      tag: 'countdown-reminder',
      requireInteraction: false,
      vibrate: [200, 100, 200]
    };
    
    await self.registration.showNotification(title, options);
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}

function scheduleNotification(delay) {
  // Use setTimeout for immediate scheduling
  setTimeout(() => {
    showCountdownNotification();
  }, delay);
}
