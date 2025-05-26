import Router from './router/router';
import { checkAuth, logout } from './utils/auth';
import { initViewTransitions } from './utils/transitions';
import { initPushNotification } from './utils/pushNotification';
import NotificationManager from './components/NotificationManager';
import NavigationView from './views/NavigationView';

class App {
  constructor() {
    this.router = new Router();
    this.notificationManager = new NotificationManager();
    window.notificationManager = this.notificationManager;
    this.navigationView = new NavigationView();
  }

  renderNavigationBar() {
    const navDrawer = document.getElementById('navigationDrawer');
    this.navigationView.setLoggedIn(checkAuth());
    navDrawer.innerHTML = this.navigationView.render();
    if (checkAuth()) {
      this.navigationView.bindLogout(async (e) => {
        e.preventDefault();
        await logout();
      });
    }
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

    this.renderNavigationBar();

    window.addEventListener('hashchange', handleAndUpdate);
    window.addEventListener('load', handleAndUpdate);
    window.addEventListener('auth-change', () => {
      this.renderNavigationBar();
    });
  }
}

export default App;