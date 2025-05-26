import HomeView from '../views/pages/HomeView';
import HomePresenter from '../presenters/pages/HomePresenter';
import { updateNavigation } from '../utils/auth';

export default class HomePage {
  async render() {
    console.log('Mulai render HomeView');
    const homeView = new HomeView();
    homeView.render();
    console.log('Selesai render HomeView');
    updateNavigation();
    try {
      if (homeView.initMap) homeView.initMap();
    } catch (e) {
      console.warn('Map gagal diinisialisasi:', e);
    }
    setTimeout(() => {
      const presenter = new HomePresenter(homeView);
      presenter.showStories();
    }, 50);
  }
}