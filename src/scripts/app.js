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