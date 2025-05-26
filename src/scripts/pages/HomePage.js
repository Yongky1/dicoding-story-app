import HomeView from '../views/pages/HomeView';
import HomePresenter from '../presenters/pages/HomePresenter';
import { updateNavigation } from '../utils/auth';

export default class HomePage {
  async render() {
    const homeView = new HomeView();
    homeView.render();
    updateNavigation();
    this.attachLogoutHandler();
    const presenter = new HomePresenter(homeView);
    await presenter.showStories();
  }

  attachLogoutHandler() {
    const logoutMenu = document.getElementById('logoutMenu');
    if (logoutMenu) {
      const newLogoutMenu = logoutMenu.cloneNode(true);
      logoutMenu.parentNode.replaceChild(newLogoutMenu, logoutMenu);
      newLogoutMenu.addEventListener('click', async (e) => {
        e.preventDefault();
        await logout();
      });
    }
  }
}