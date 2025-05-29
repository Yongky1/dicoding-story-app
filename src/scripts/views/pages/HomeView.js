class HomeView {
  render() {
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <section class="home-header">
          <h1 class="home-title"><i class="fas fa-book-open"></i> Dicoding Stories</h1>
          <p class="home-desc">Explore stories shared by the Dicoding community</p>
          <button id="clear-cache-btn" class="btn btn-danger" style="margin-top:1rem;">Hapus Cache</button>
        </section>
        <section class="home-main">
          <div class="map-card">
            <div id="stories-map" class="map-container" aria-label="Map showing story locations"></div>
          </div>
          <div class="story-grid" id="story-grid" role="feed" aria-label="Story feed"></div>
        </section>
      `;
    }
    // Tambahkan event listener untuk tombol hapus cache
    setTimeout(() => {
      const btn = document.getElementById('clear-cache-btn');
      if (btn) {
        btn.addEventListener('click', async () => {
          const { clearStories } = await import('../../utils/storyDB');
          await clearStories();
          alert('Cache berhasil dihapus!');
          window.location.reload();
        });
      }
    }, 0);
  }

  showStories(stories) {
    const storyGrid = document.getElementById('story-grid');
    if (!storyGrid) return;
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
        storyGrid.innerHTML = storiesHTML;
        return;
      }
      storyGrid.innerHTML = `<div class="empty-state"><i class="fas fa-inbox"></i><p>No stories found. Be the first to share your story!</p></div>`;
      return;
    }
    // Jika ada stories asli
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
    storyGrid.innerHTML = storiesHTML;

    // Event handler untuk tombol simpan
    import('../../utils/storyDB').then(({ isStorySaved, saveStoryBookmark }) => {
      storyGrid.querySelectorAll('.save-story-btn').forEach(async btn => {
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
    storyGrid.querySelectorAll('.detail-story-btn').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        window.location.hash = `#/story/${id}`;
      };
    });
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

  hideLoading() {
    const storyGrid = document.getElementById('story-grid');
    if (storyGrid) {
      const loadingElement = storyGrid.querySelector('.loading');
      if (loadingElement) {
        loadingElement.remove();
      }
    }
  }

  initMap() {
    if (document.getElementById('stories-map')) {
      const MapComponent = require('../../components/MapComponent').default;
      this._mapComponent = new MapComponent();
      this._mapComponent.init('stories-map');
    }
  }
}

export default HomeView; 