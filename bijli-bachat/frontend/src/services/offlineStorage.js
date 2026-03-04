import { LOCAL_STORAGE_KEY } from "../utils/constants";

// Simple localStorage-based offline storage (can be replaced with IndexedDB later)

export function loadBillsFromStorage() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to parse stored bills", e);
    return [];
  }
}

export function saveBillsToStorage(bills) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bills ?? []));
  } catch (e) {
    console.error("Failed to save bills", e);
  }
}

