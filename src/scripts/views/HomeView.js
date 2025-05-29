class HomeView {
  constructor() {
    this._stories = [];
  }

  render() {
    console.log('HomeView.render() dipanggil');
    return `
      <div class="home-main-container">
        <div class="map-card">
          <h2><i class="fas fa-map-marked-alt"></i> Story Locations</h2>
          <div id="stories-map"></div>
        </div>
        <div class="stories-card">
          <h2><i class="fas fa-book-open"></i> Stories</h2>
          <div id="stories-list" class="stories-list" style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-top:1rem;">
            <div class="loading">
              <i class="fas fa-spinner fa-spin"></i>
              <span>Loading stories...</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async showStories(stories) {
    console.log('showStories called with:', stories);
    this._stories = stories;
    const storiesList = document.getElementById('stories-list');
    if (!storiesList) {
      console.warn('stories-list container not found!');
      return;
    }

    if (!stories || stories.length === 0) {
      const isOffline = !navigator.onLine;
      if (isOffline) {
        // Dummy data untuk pengalaman offline pertama kali (lebih dari satu)
        const dummyStories = [
          {
            id: 'dummy-1',
            name: 'Offline Story 1',
            description: 'Ini adalah contoh story offline. Silakan online untuk melihat story asli.',
            photoUrl: '',
            createdAt: new Date().toISOString(),
            lat: -6.2,
            lon: 106.8
          },
          {
            id: 'dummy-2',
            name: 'Offline Story 2',
            description: 'Cobalah online untuk mendapatkan data story terbaru.',
            photoUrl: '',
            createdAt: new Date().toISOString(),
            lat: -7.2,
            lon: 110.4
          },
          {
            id: 'dummy-3',
            name: 'Offline Story 3',
            description: 'Aplikasi tetap bisa diakses walau tanpa internet!',
            photoUrl: '',
            createdAt: new Date().toISOString(),
            lat: -8.6,
            lon: 115.2
          }
        ];
        const storiesHTML = dummyStories.map(story => `
          <div class="story-card">
            ${story.photoUrl ? `<img src="${story.photoUrl}" alt="${story.name}'s story" class="story-image" style="height:120px;">` : ''}
            <div class="story-content">
              <h3>${story.name}</h3>
              <p>${story.description}</p>
              <div class="story-meta">
                <span class="story-date">
                  <i class="far fa-calendar-alt"></i>
                  ${new Date(story.createdAt).toLocaleDateString()}
                </span>
                ${story.lat && story.lon ? 
                  `<span class="story-location">
                    <i class="fas fa-map-marker-alt"></i> 
                    ${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}
                  </span>` : 
                  ''}
              </div>
            </div>
          </div>
        `).join('');
        storiesList.innerHTML = storiesHTML;
        return;
      }
      // Jika online tapi data kosong
      storiesList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-inbox"></i>
          <p>No stories found. Be the first to share your story!</p>
        </div>
      `;
      return;
    }

    // Render sementara, lalu update tombol simpan setelah cek status
    const storiesHTML = stories.map(story => `
      <div class="story-card">
        ${story.photoUrl ? `<img src="${story.photoUrl}" alt="${story.name}'s story" class="story-image" style="height:120px;">` : ''}
        <div class="story-content">
          <h3>${story.name}</h3>
          <p>${story.description}</p>
          <div class="story-meta">
            <span class="story-date">
              <i class="far fa-calendar-alt"></i>
              ${new Date(story.createdAt).toLocaleDateString()}
            </span>
            ${story.lat && story.lon ? 
              `<span class="story-location">
                <i class="fas fa-map-marker-alt"></i> 
                ${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}
              </span>` : 
              ''}
          </div>
          <div style="margin-top:0.5rem;display:flex;gap:0.5rem;">
            <button class="detail-story-btn" data-id="${story.id}" style="background:#10b981;color:white;border:none;padding:0.5rem 1rem;border-radius:4px;cursor:pointer;">
              <i class="fas fa-eye"></i> Lihat Detail
            </button>
            <button class="save-story-btn" data-id="${story.id}" style="background:#2563eb;color:white;border:none;padding:0.5rem 1rem;border-radius:4px;cursor:pointer;">
              <i class="fas fa-bookmark"></i> Simpan
            </button>
          </div>
        </div>
      </div>
    `).join('');

    storiesList.innerHTML = storiesHTML;

    // Update status tombol simpan sesuai IndexedDB
    import('../utils/storyDB').then(({ isStorySaved, saveStoryBookmark }) => {
      storiesList.querySelectorAll('.save-story-btn').forEach(async btn => {
        const id = btn.dataset.id;
        const saved = await isStorySaved(id);
        if (saved) {
          btn.innerHTML = '<i class="fas fa-check"></i> Disimpan';
          btn.disabled = true;
        } else {
          btn.innerHTML = '<i class="fas fa-bookmark"></i> Simpan';
          btn.disabled = false;
        }
        btn.onclick = async () => {
          const story = stories.find(s => s.id == id);
          if (story) {
            await saveStoryBookmark(story);
            btn.innerHTML = '<i class="fas fa-check"></i> Disimpan';
            btn.disabled = true;
          }
        };
      });
    });

    // Event handler untuk tombol detail
    storiesList.querySelectorAll('.detail-story-btn').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        window.location.hash = `#/story/${id}`;
      };
    });
  }

  showError(message) {
    const storiesList = document.getElementById('stories-list');
    if (storiesList) {
      storiesList.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          ${message}
        </div>
      `;
    }
  }

  showLoading() {
    const storiesList = document.getElementById('stories-list');
    if (storiesList) {
      storiesList.innerHTML = `
        <div class="loading">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Loading stories...</span>
        </div>
      `;
    }
  }

  hideLoading() {
    const storiesList = document.getElementById('stories-list');
    if (storiesList) {
      const loadingElement = storiesList.querySelector('.loading');
      if (loadingElement) {
        loadingElement.remove();
      }
    }
  }

  initMap() {
    if (document.getElementById('stories-map')) {
      const MapComponent = require('../components/MapComponent').default;
      this._mapComponent = new MapComponent();
      this._mapComponent.init('stories-map');
    }
  }
}

export default HomeView; 