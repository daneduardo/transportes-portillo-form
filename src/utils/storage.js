const STORAGE_KEY = "portillo_manifiestos";

export function loadFolios() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveFolios(folios) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(folios));
  } catch {
    // Storage unavailable (private browsing, quota, etc.) — fail silently,
    // the in-memory list still works for the current session.
  }
}

export function nextFolioNumber(folios) {
  const highest = folios.reduce((max, f) => Math.max(max, f.folio || 0), 0);
  return highest + 1;
}
