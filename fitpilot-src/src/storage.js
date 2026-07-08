const DB_NAME = "fitpilot-db";
const DB_VERSION = 1;
const STORE_NAME = "app-data";
const DATA_KEY = "fitpilot-v1";
const BACKUP_KEY = "fitpilot-v1-backup";

function openDb() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("IndexedDB indisponible"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Ouverture IndexedDB impossible"));
  });
}

async function idbGet(key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).get(key);
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error || new Error("Lecture IndexedDB impossible"));
    tx.oncomplete = () => db.close();
  });
}

async function idbSet(key, value) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(value, key);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error || new Error("Écriture IndexedDB impossible"));
    };
  });
}

export async function chargerDonnees() {
  try {
    const value = await idbGet(DATA_KEY);
    if (value) return value;
  } catch {
    // Repli localStorage ci-dessous.
  }

  try {
    const raw = localStorage.getItem(BACKUP_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function sauvegarderDonnees(data) {
  try {
    localStorage.setItem(BACKUP_KEY, JSON.stringify(data));
  } catch {
    // Le stockage de secours peut être indisponible en navigation privée.
  }

  try {
    await idbSet(DATA_KEY, data);
  } catch {
    // Le repli localStorage a déjà été tenté.
  }
}
