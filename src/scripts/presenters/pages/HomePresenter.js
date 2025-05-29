import StoryModel from '../../models/StoryModel';
import MapComponent from '../../components/MapComponent';

class HomePresenter {
  constructor(view) {
    this.view = view;
    this.model = new StoryModel();
    this.mapComponent = null;
  }

  async showStories() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        this.view.showError('You must login to view stories.');
        return;
      }

      this.view.showLoading();
      const stories = await this.model.getAllStories();
      
      // Tambahkan semua marker sekaligus agar tidak menimpa marker sebelumnya
      const validStories = stories.filter(story => (story.lat || story.latitude) && (story.lon || story.longitude));
      if (validStories.length > 0 && this.view._mapComponent) {
        this.view._mapComponent.addMarkers(validStories.map(story => ({
          lat: story.lat || story.latitude,
          lng: story.lon || story.longitude,
          popupContent: `<b>${story.name}</b><br>${story.description}`
        })));
        if (this.view._mapComponent.fitBounds) {
          const bounds = validStories.map(story => [story.lat || story.latitude, story.lon || story.longitude]);
          this.view._mapComponent.fitBounds(bounds);
        }
      }

      this.view.showStories(stories);
    } catch (e) {
      console.log('Error in showStories:', e.message);
      if (e.message === '401') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.hash = '/login';
        return;
      }
      // Jika offline dan tidak ada data di IndexedDB
      if (!navigator.onLine) {
        this.view.showError('Anda sedang offline. Data tidak dapat dimuat.');
        return;
      }
      this.view.showError(e.message);
    } finally {
      this.view.hideLoading();
    }
  }
}

export default HomePresenter; 