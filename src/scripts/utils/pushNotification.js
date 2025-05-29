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
            console.log('Konten baru tersedia; silakan refresh.');
          }
        });
      });

      // Handle controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service worker controller berubah. Service worker baru sedang mengontrol halaman.');
      });

      console.log('Registrasi ServiceWorker berhasil');
      return registration;
    } catch (error) {
      console.error('Registrasi ServiceWorker gagal:', error);
      throw error;
    }
  }
  throw new Error('ServiceWorker tidak didukung');
};

// Fungsi untuk memeriksa dan meminta izin notifikasi
const checkNotificationPermission = async () => {
  if (!('Notification' in window)) {
    throw new Error('Browser ini tidak mendukung notifikasi');
  }

  const permission = await Notification.requestPermission();
  
  if (permission === 'denied') {
    throw new Error('Izin notifikasi ditolak. Silakan aktifkan izin notifikasi di pengaturan browser Anda.');
  }
  
  if (permission === 'default') {
    throw new Error('Izin notifikasi belum diberikan. Silakan berikan izin notifikasi untuk menggunakan fitur ini.');
  }

  return permission;
};

// Fungsi untuk subscribe push notification
const subscribePushNotification = async (token = localStorage.getItem('token')) => {
  try {
    // Periksa izin notifikasi terlebih dahulu
    await checkNotificationPermission();

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

    if (!response.ok) {
      throw new Error('Gagal berlangganan push notification');
    }

    const responseData = await response.json();
    if (responseData.error) {
      throw new Error(responseData.message);
    }

    return responseData.data;
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      throw new Error('Izin notifikasi ditolak. Silakan aktifkan izin notifikasi di pengaturan browser Anda.');
    }
    throw error;
  }
};

// Fungsi untuk unsubscribe push notification
const unsubscribePushNotification = async (token = localStorage.getItem('token')) => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  
  if (subscription) {
    const { endpoint } = subscription;
    const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ endpoint })
    });

    if (!response.ok) {
      throw new Error('Gagal berhenti berlangganan push notification');
    }

    const responseData = await response.json();
    if (responseData.error) {
      throw new Error(responseData.message);
    }

    await subscription.unsubscribe();
  }
};

// Fungsi untuk mengirim notifikasi report ke diri sendiri
const notifyReportToSelf = async (reportId, token = localStorage.getItem('token')) => {
  const response = await fetch(`https://story-api.dicoding.dev/v1/reports/${reportId}/notify-me`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to notify report to self');
  return response.json();
};

// Fungsi untuk mengirim notifikasi report ke user tertentu
const notifyReportToUser = async (reportId, userId, token = localStorage.getItem('token')) => {
  const response = await fetch(`https://story-api.dicoding.dev/v1/reports/${reportId}/notify-me`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ userId })
  });
  if (!response.ok) throw new Error('Failed to notify report to user');
  return response.json();
};

// Fungsi untuk mengirim notifikasi report ke semua user
const notifyReportToAll = async (reportId, token = localStorage.getItem('token')) => {
  const response = await fetch(`https://story-api.dicoding.dev/v1/reports/${reportId}/notify-all`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to notify report to all users');
  return response.json();
};

// Fungsi untuk mengirim notifikasi komentar ke pemilik report
const notifyCommentToReportOwner = async (reportId, commentId, token = localStorage.getItem('token')) => {
  const response = await fetch(`https://story-api.dicoding.dev/v1/reports/${reportId}/comments/${commentId}/notify`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to notify comment to report owner');
  return response.json();
};

// Inisialisasi service worker dan auto subscribe jika user sudah login
const initPushNotification = async () => {
  try {
    await registerServiceWorker();
    // Tidak ada subscribe otomatis di sini!
  } catch (error) {
    console.error('Gagal menginisialisasi push notification:', error.message);
  }
};

export { 
  initPushNotification, 
  subscribePushNotification, 
  unsubscribePushNotification,
  notifyReportToSelf,
  notifyReportToUser,
  notifyReportToAll,
  notifyCommentToReportOwner,
  checkNotificationPermission
}; 