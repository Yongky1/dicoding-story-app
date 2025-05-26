const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        updateViaCache: 'none'
      });
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content is available, but don't force refresh
            console.log('New content is available; please refresh.');
          }
        });
      });

      // Handle controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service worker controller changed. New service worker is controlling the page.');
      });

      console.log('ServiceWorker registration successful');
      return registration;
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
      throw error;
    }
  }
  throw new Error('ServiceWorker not supported');
};

// Fungsi untuk subscribe push notification ke server Dicoding
const subscribePushNotification = async (token = localStorage.getItem('token')) => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
  });
  const { endpoint, keys } = subscription.toJSON();
  const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ endpoint, keys })
  });
  if (!response.ok) throw new Error('Failed to subscribe push notification');
  return subscription;
};

// Fungsi untuk unsubscribe push notification dari server Dicoding
const unsubscribePushNotification = async (token = localStorage.getItem('token')) => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    const { endpoint } = subscription;
    // Hapus dari server
    const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ endpoint })
    });
    if (!response.ok) throw new Error('Failed to unsubscribe push notification');
    await subscription.unsubscribe();
  }
};

// Inisialisasi service worker saja (tanpa auto subscribe)
const initPushNotification = async () => {
  try {
    await registerServiceWorker();
    // Tidak auto subscribe di sini, biar manual oleh user
    console.log('Service worker registered for push notification');
  } catch (error) {
    console.error('Failed to initialize push notification:', error);
  }
};

export { initPushNotification, subscribePushNotification, unsubscribePushNotification }; 