import Router from './router/router';
import { checkAuth, updateNavigation, logout } from './utils/auth';
import { initViewTransitions } from './utils/transitions';
import { initPushNotification } from './utils/pushNotification';
import NotificationManager from './components/NotificationManager';

class App {
  constructor() {
    this.router = new Router();
    this.notificationManager = new NotificationManager();
    window.notificationManager = this.notificationManager; // Make it accessible globally for onclick handlers
  }

  init() {
    checkAuth();
    initViewTransitions();
    initPushNotification();
    
    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data.type === 'NEW_NOTIFICATION') {
        this.notificationManager.addNotification(event.data.notification);
      }
    });
    
    const handleAndUpdate = () => {
      this.router.handleRoute();
      updateNavigation();
    };

    // Add logout event listener
    const logoutMenu = document.getElementById('logoutMenu');
    if (logoutMenu) {
      logoutMenu.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    }

    window.addEventListener('hashchange', handleAndUpdate);
    window.addEventListener('load', handleAndUpdate);
    window.addEventListener('auth-change', updateNavigation);
  }
}

export default App;