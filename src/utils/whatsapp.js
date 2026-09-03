import { generateManifestPDF } from "./generatePDF";

const WHATSAPP_NUMBER = "5215563179011";

const GOOGLE_MAPS_LINK = "https://maps.app.goo.gl/XXXXXX";

function formatDate(isoDate) {
  if (!isoDate) return "—";
  const [year, month, day] = isoDate.split("-");
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return d.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function buildWhatsAppUrl(folio) {
  const msg = [
    `\u{1F4E6} *Manifiesto de Envío*`,
    "",
    `\u{1F4C4} Folio: ${String(folio.folio).padStart(4, "0")}`,
    `\u{1F4B3} Factura: ${folio.factura}`,
    `\u{1F4CD} Dirección de envío: ${folio.destino}`,
    `\u{1F5FA}\uFE0F Ubicación: ${GOOGLE_MAPS_LINK}`,
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function shareManifestPDF(folio) {
  const { blob, filename } = generateManifestPDF(folio);
  downloadBlob(blob, filename);
  window.open(buildWhatsAppUrl(folio), "_blank", "noopener,noreferrer");
}
