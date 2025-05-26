// Utility IndexedDB untuk story
const DB_NAME = 'dicoding-story-db';
const DB_VERSION = 2; // Naikkan versi untuk upgrade
const STORE_NAME = 'stories';
const SAVED_STORE = 'savedStories';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(SAVED_STORE)) {
        db.createObjectStore(SAVED_STORE, { keyPath: 'id' });
      }
    };
  });
}

export async function saveStories(stories) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await new Promise((resolve, reject) => {
    store.clear().onsuccess = resolve;
    store.clear().onerror = reject;
  });
  for (const story of stories) {
    store.put(story);
  }
  await tx.complete;
  db.close();
}

export async function getStories() {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function clearStories() {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await new Promise((resolve, reject) => {
    store.clear().onsuccess = resolve;
    store.clear().onerror = reject;
  });
  db.close();
}

// Fitur bookmark/simpan story pilihan user
export async function saveStoryBookmark(story) {
  const db = await openDB();
  const tx = db.transaction(SAVED_STORE, 'readwrite');
  const store = tx.objectStore(SAVED_STORE);
  store.put(story);
  await tx.complete;
  db.close();
}

export async function getSavedStories() {
  const db = await openDB();
  const tx = db.transaction(SAVED_STORE, 'readonly');
  const store = tx.objectStore(SAVED_STORE);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteSavedStory(id) {
  const db = await openDB();
  const tx = db.transaction(SAVED_STORE, 'readwrite');
  const store = tx.objectStore(SAVED_STORE);
  store.delete(id);
  await tx.complete;
  db.close();
}

export async function clearSavedStories() {
  const db = await openDB();
  const tx = db.transaction(SAVED_STORE, 'readwrite');
  const store = tx.objectStore(SAVED_STORE);
  await new Promise((resolve, reject) => {
    store.clear().onsuccess = resolve;
    store.clear().onerror = reject;
  });
  db.close();
}

export async function isStorySaved(id) {
  const db = await openDB();
  const tx = db.transaction(SAVED_STORE, 'readonly');
  const store = tx.objectStore(SAVED_STORE);
  return new Promise((resolve, reject) => {
    const request = store.get(id);
    request.onsuccess = () => resolve(!!request.result);
    request.onerror = () => reject(request.error);
  });
} 