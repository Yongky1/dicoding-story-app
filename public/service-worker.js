const CACHE_NAME = 'dicoding-story-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

self.addEventListener('push', (event) => {
  let notificationData;
  try {
    notificationData = JSON.parse(event.data.text());
  } catch (e) {
    notificationData = {
      title: 'Dicoding Story App',
      options: {
        body: event.data.text()
      }
    };
  }

  // Add timestamp to notification data
  notificationData.timestamp = Date.now();

  const options = {
    body: notificationData.options.body,
    icon: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      notification: notificationData,
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Story',
      },
      {
        action: 'close',
        title: 'Close',
      },
    ]
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    // Send message to client to add notification to UI
    const notificationData = event.notification.data.notification;
    event.waitUntil(
      clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'NEW_NOTIFICATION',
            notification: notificationData
          });
        });
      })
    );

    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
}); 