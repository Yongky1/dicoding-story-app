import NotFoundView from '../views/pages/NotFoundView';

export default class NotFoundPage {
  constructor() {
    this.view = new NotFoundView();
  }

  async render() {
    const app = document.querySelector('#app');
    if (app) {
      app.innerHTML = this.view.render();
    }
  }
} 