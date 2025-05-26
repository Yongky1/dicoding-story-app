import StoryModel from '../models/StoryModel';

export default class StoryDetailPage {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = `<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>`;

    // Ambil id dari hash
    const hash = window.location.hash;
    const id = hash.split('/')[2];

    if (!id) {
      app.innerHTML = '<p>Story ID tidak ditemukan.</p>';
      return;
    }

    try {
      const model = new StoryModel();
      const story = await model.getStoryById(id);
      app.innerHTML = `
        <div class="story-detail-card" style="max-width:500px;margin:2rem auto;background:#fff;padding:2rem;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,0.07);">
          <h2 style="margin-bottom:1rem;"><i class="fas fa-info-circle"></i> Detail Story</h2>
          <img src="${story.photoUrl}" alt="Story" style="width:100%;max-width:400px;border-radius:12px;margin-bottom:1rem;object-fit:cover;">
          <h3 style="margin-bottom:0.5rem;">${story.name}</h3>
          <p style="margin-bottom:1rem;">${story.description}</p>
          <p style="color:#6b7280;"><i class="far fa-calendar-alt"></i> ${new Date(story.createdAt).toLocaleDateString()}</p>
          ${story.lat && story.lon ? `<p style="color:#ef4444;"><i class="fas fa-map-marker-alt"></i> ${story.lat}, ${story.lon}</p><div id="story-map" style="height:300px;margin-bottom:1rem;border-radius:12px;"></div>` : ''}
          <button onclick="window.history.back()" style="margin-top:1rem;padding:0.5rem 1.5rem;border:none;background:#2563eb;color:white;border-radius:6px;cursor:pointer;">Kembali</button>
        </div>
      `;
      // Inisialisasi map jika ada lat dan lon
      if (story.lat && story.lon && window.L) {
        const map = L.map('story-map').setView([story.lat, story.lon], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        L.marker([story.lat, story.lon]).addTo(map)
          .bindPopup(story.name)
          .openPopup();
      }
    } catch (e) {
      app.innerHTML = `<p>Gagal mengambil detail story: ${e.message}</p>`;
    }
  }
} 