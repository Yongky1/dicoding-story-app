import HomeView from '../views/pages/HomeView';
import HomePresenter from '../presenters/pages/HomePresenter';
import { updateNavigation } from '../utils/auth';

export default class HomePage {
  async render() {
    const homeView = new HomeView();
    homeView.render();
    updateNavigation();
    const presenter = new HomePresenter(homeView);
    await presenter.showStories();
  }
}