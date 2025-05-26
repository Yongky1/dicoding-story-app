class HomeView {
  render() {
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <section class="home-header">
          <h1 class="home-title"><i class="fas fa-book-open"></i> Dicoding Stories</h1>
          <p class="home-desc">Explore stories shared by the Dicoding community</p>
        </section>
        <section class="home-main">
          <div class="map-card">
            <div id="stories-map" class="map-container" aria-label="Map showing story locations"></div>
          </div>
          <div class="story-grid" id="story-grid" role="feed" aria-label="Story feed"></div>
        </section>
      `;
    }
  }

  showStories(storiesHtml) {
    const storyGrid = document.getElementById('story-grid');
    if (storyGrid) {
      storyGrid.innerHTML = storiesHtml;
    }
  }

  showLoading() {
    const storyGrid = document.getElementById('story-grid');
    if (storyGrid) {
      storyGrid.innerHTML = `<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading stories...</div>`;
    }
  }

  showError(message) {
    const storyGrid = document.getElementById('story-grid');
    if (storyGrid) {
      storyGrid.innerHTML = `<div class="error" role="alert"><i class="fas fa-exclamation-circle"></i> Error: ${message}</div>`;
    }
  }
}

export default HomeView; 