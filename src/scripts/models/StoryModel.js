import storyApi from '../api/storyApi';
import { saveStories, getStories as getStoriesFromDB } from '../utils/storyDB';

class StoryModel {
  constructor() {
    this._stories = [];
  }

  async getAllStories() {
    try {
      // Cek koneksi terlebih dahulu
      if (!navigator.onLine) {
        console.log('Offline mode: Mengambil data dari IndexedDB');
        const offlineStories = await getStoriesFromDB();
        if (offlineStories.length > 0) {
          return offlineStories;
        }
        throw new Error('Anda sedang offline, data tidak dapat dimuat.');
      }

      // Online mode: fetch dari API
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }

      const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('401');
        }
        throw new Error('Gagal mengambil data stories');
      }

      const responseJson = await response.json();
      if (!responseJson.error) {
        this._stories = responseJson.listStory;
        // Simpan ke IndexedDB
        await saveStories(this._stories);
        return this._stories;
      }
      throw new Error(responseJson.message);
    } catch (error) {
      console.log('Error in getAllStories:', error.message);
      // Jika error 401, throw langsung untuk ditangani di presenter
      if (error.message === '401') {
        throw error;
      }
      // Untuk error lain, coba ambil dari IndexedDB
      const offlineStories = await getStoriesFromDB();
      if (offlineStories.length > 0) {
        return offlineStories;
      }
      throw error;
    }
  }

  async addStory(formData) {
    try {
      const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      const responseJson = await response.json();
      if (!responseJson.error) {
        return responseJson;
      }
      throw new Error(responseJson.message);
    } catch (error) {
      throw new Error(`Failed to add story: ${error.message}`);
    }
  }

  async getStoryById(id) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://story-api.dicoding.dev/v1/stories/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const responseJson = await response.json();
      if (!responseJson.error) {
        return responseJson.story;
      }
      throw new Error(responseJson.message);
    } catch (error) {
      throw new Error(`Failed to fetch story: ${error.message}`);
    }
  }

  async getStories() {
    try {
      const response = await storyApi.getStories();
      if (!response.error) {
        return response.listStory;
      } else {
        throw new Error(response.message || 'Failed to fetch stories');
      }
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch stories');
      } else if (error.request) {
        throw new Error('No response from server. Please check your internet connection.');
      } else {
      throw new Error(error.message || 'Failed to fetch stories');
      }
    }
  }

  async login(email, password) {
    try {
      const response = await storyApi.login(email, password);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to login');
    }
  }

  async register(name, email, password) {
    try {
      const response = await storyApi.register(name, email, password);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to register');
    }
  }
}

export default StoryModel; 