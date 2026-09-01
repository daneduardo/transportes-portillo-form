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

export function nextFacturaNumber(folios) {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = String(today.getFullYear()).slice(-2);
  const prefix = `${day}${month}${year}`;

  const sameDayFolios = folios.filter(
    (f) => f.factura && f.factura.startsWith(prefix)
  );

  if (sameDayFolios.length === 0) {
    return `${prefix}001`;
  }

  const highest = sameDayFolios.reduce(
    (max, f) => Math.max(max, Number(f.factura.slice(-3))), 0
  );
  const nextSeq = String(highest + 1).padStart(3, "0");
  return `${prefix}${nextSeq}`;
}
