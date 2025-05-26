const CACHE_NAME = 'dicoding-story-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/bundle.js',
  '/manifest.json',
  '/offline.html'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Cache each URL individually to handle failures gracefully
        const cachePromises = urlsToCache.map(url => {
          return fetch(url)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Failed to fetch ${url}`);
              }
              return cache.put(url, response);
            })
            .catch(error => {
              console.warn(`Failed to cache ${url}:`, error);
              // Continue even if some files fail to cache
              return Promise.resolve();
            });
        });
        return Promise.all(cachePromises);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) {
          return response;
        }

        // Clone the request because it can only be used once
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it can only be used once
            const responseToCache = response.clone();

            // Cache the response
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch(error => {
                console.warn('Failed to cache response:', error);
              });

            return response;
          })
          .catch(() => {
            // If network fails and request is for a page, return offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            // If network fails and request is for an image, return null
            if (event.request.destination === 'image') {
              return new Response('', {
                status: 404,
                statusText: 'Not Found'
              });
            }
            // For other requests, return a basic offline response
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
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