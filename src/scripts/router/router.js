import HomePage from '../pages/HomePage';
import AddStoryPage from '../pages/AddStoryPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import SavedStoriesPage from '../pages/SavedStoriesPage';
import StoryDetailPage from '../pages/StoryDetailPage';
import NotFoundPage from '../pages/NotFoundPage';

class Router {
  constructor() {
    this.routes = {
      '/': HomePage,
      '/add-story': AddStoryPage,
      '/login': LoginPage,
      '/register': RegisterPage,
      '/saved-stories': SavedStoriesPage,
      // '/story/:id': StoryDetailPage, // handled dynamically below
    };
    this.currentPage = null;
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    let Page = this.routes[hash];
    
    // Handle dynamic route for story detail
    if (!Page && hash.startsWith('/story/')) {
      Page = StoryDetailPage;
    }

    if (this.currentPage && typeof this.currentPage.destroy === 'function') {
      this.currentPage.destroy();
    }

    if (Page) {
      this.currentPage = new Page();
      this.currentPage.render();
    } else {
      // Show NotFound page for invalid routes
      this.currentPage = new NotFoundPage();
      this.currentPage.render();
    }
    
    window.scrollTo(0, 0);
  }
}

export default Router;