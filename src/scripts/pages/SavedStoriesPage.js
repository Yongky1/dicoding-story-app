import { getSavedStories, deleteSavedStory, clearSavedStories } from '../utils/storyDB';

export default class SavedStoriesPage {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <section>
        <h2><i class="fas fa-save"></i> Saved Stories (Offline)</h2>
        <button id="clear-all-saved" class="btn btn-danger" style="margin-bottom:1rem;">Hapus Semua</button>
        <div id="saved-stories-list"></div>
      </section>
    `;
    this.showSavedStories();
    document.getElementById('clear-all-saved').onclick = async () => {
      await clearSavedStories();
      this.showSavedStories();
    };
  }

  async showSavedStories() {
    const stories = await getSavedStories();
    const list = document.getElementById('saved-stories-list');
    if (!stories.length) {
      list.innerHTML = '<p>Tidak ada story tersimpan.</p>';
      return;
    }
    list.innerHTML = stories.map(story => `
      <div class="story-card" style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;">
        <img src="${story.photoUrl}" alt="Story" style="max-width:120px;max-height:80px;object-fit:cover;border-radius:8px;">
        <div style="flex:1;">
          <h3 style="margin:0 0 0.5rem 0;">${story.name}</h3>
          <p style="margin:0 0 0.5rem 0;">${story.description}</p>
          <button class="delete-saved" data-id="${story.id}" style="background:#ef4444;color:white;border:none;padding:0.5rem 1rem;border-radius:4px;cursor:pointer;">Hapus</button>
        </div>
      </div>
    `).join('');
    list.querySelectorAll('.delete-saved').forEach(btn => {
      btn.onclick = async () => {
        await deleteSavedStory(btn.dataset.id);
        this.showSavedStories();
      };
    });
  }
} 