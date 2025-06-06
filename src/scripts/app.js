import Router from './router/router';
import { checkAuth, logout } from './utils/auth';
import { initViewTransitions } from './utils/transitions';
import { initPushNotification } from './utils/pushNotification';
import NotificationManager from './components/NotificationManager';
import NavigationView from './views/NavigationView';
import offlineIndicator from './utils/offlineIndicator';

class App {
  constructor() {
    this.router = new Router();
    this.notificationManager = new NotificationManager();
    window.notificationManager = this.notificationManager;
    this.navigationView = new NavigationView();
  }

  renderNavigationBar() {
    const navDrawer = document.getElementById('navigationDrawer');
    if (!navDrawer) return;

    // Cleanup existing navigation
    this.navigationView.destroy();
    
    // Update login status and render
    this.navigationView.setLoggedIn(checkAuth());
    navDrawer.innerHTML = this.navigationView.render();
    
    // Bind logout handler if user is logged in
    if (checkAuth()) {
      this.navigationView.bindLogout(async (e) => {
        e.preventDefault();
        console.log('Logout button clicked');
        try {
          await logout();
        } catch (error) {
          console.error('Logout failed:', error);
        }
      });
    }
    
    // Initialize notification manager
    setTimeout(() => {
      this.notificationManager.init();
      // Tambahkan event listener untuk tombol subscribe push notification
      const subscribeBtn = document.getElementById('subscribePushButton');
      if (subscribeBtn) {
        subscribeBtn.addEventListener('click', async () => {
          const { subscribePushNotification, unsubscribePushNotification } = await import('./utils/pushNotification');
          // Jika sudah subscribe, lakukan unsubscribe
          if (subscribeBtn.dataset.subscribed === 'true') {
            try {
              await unsubscribePushNotification();
              subscribeBtn.innerHTML = '<i class="fas fa-bell"></i> Subscribe Notifikasi';
              subscribeBtn.dataset.subscribed = 'false';
              alert('Berhasil unsubscribe push notification!\n\nCatatan: Untuk mengatur ulang izin notifikasi, silakan ubah pengaturan notifikasi di browser Anda (klik ikon gembok di address bar > Notifikasi > Izinkan/Tolak).');
            } catch (err) {
              alert('Gagal unsubscribe push notification: ' + err.message);
            }
            return;
          }
          // Selalu minta permission
          let permission = Notification.permission;
          if (permission !== 'granted') {
            permission = await Notification.requestPermission();
          }
          if (permission === 'denied') {
            alert('Izin notifikasi ditolak. Silakan aktifkan izin notifikasi di pengaturan browser Anda (klik ikon gembok di address bar > Notifikasi > Izinkan).');
            return;
          }
          if (permission === 'granted') {
            try {
              await subscribePushNotification();
              subscribeBtn.innerHTML = '<i class="fas fa-bell-slash"></i> Unsubscribe Notifikasi';
              subscribeBtn.dataset.subscribed = 'true';
              new Notification('Berhasil Subscribe!', {
                body: 'Kamu sudah berhasil subscribe notifikasi.',
                icon: '/icons/icon-192x192.png'
              });
              alert('Berhasil subscribe push notification!');
            } catch (err) {
              alert('Gagal subscribe push notification: ' + err.message);
            }
          }
        });
        // Cek status awal, jika sudah subscribe, ubah tombol
        (async () => {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          if (subscription) {
            subscribeBtn.innerHTML = '<i class="fas fa-bell-slash"></i> Unsubscribe Notifikasi';
            subscribeBtn.dataset.subscribed = 'true';
          } else {
            subscribeBtn.innerHTML = '<i class="fas fa-bell"></i> Subscribe Notifikasi';
            subscribeBtn.dataset.subscribed = 'false';
          }
        })();
      }
    }, 0);
  }

  init() {
    checkAuth();
    initViewTransitions();
    initPushNotification();

    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data.type === 'NEW_NOTIFICATION') {
        this.notificationManager.addNotification(event.data.notification);
      }
    });

    const handleAndUpdate = () => {
      this.router.handleRoute();
      this.renderNavigationBar();
    };

    // Initial render
    this.renderNavigationBar();

    // Event listeners
    window.addEventListener('hashchange', handleAndUpdate);
    window.addEventListener('load', handleAndUpdate);
    window.addEventListener('auth-change', () => {
      console.log('[App] auth-change event triggered');
      this.renderNavigationBar();
      // After logout, if not logged in, force to login page
      if (!checkAuth()) {
        window.location.hash = '/login';
        console.log('[App] Force hash to /login');
        this.router.handleRoute(); // Paksa router untuk render login
        console.log('[App] router.handleRoute() dipanggil');
      }
    });
  }
}

export default App;