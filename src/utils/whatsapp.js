import { generateManifestPDF } from "./generatePDF";

const WHATSAPP_NUMBER = "5215563179011";

const GOOGLE_MAPS_LINK = "https://maps.app.goo.gl/jq4xrTgDrZkaS6kAA";

function buildWhatsAppMessage(folio) {
  return [
    `\u{1F4E6} *Manifiesto de Envío*`,
    "",
    `\u{1F4C4} Folio: ${String(folio.folio).padStart(4, "0")}`,
    `\u{1F4B3} Factura: ${folio.factura}`,
    `\u{1F4CD} Dirección de envío: ${folio.destino}`,
    `\u{1F5FA}\uFE0F Ubicación: ${GOOGLE_MAPS_LINK}`,
  ].join("\n");
}

export function buildWhatsAppUrl(folio) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(folio))}`;
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

export async function shareManifestPDF(folio) {
  const { blob, filename } = generateManifestPDF(folio);
  const file = new File([blob], filename, { type: "application/pdf" });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        text: buildWhatsAppMessage(folio),
      });
      return;
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("No se pudo compartir el archivo:", err);
    }
  }

  downloadBlob(blob, filename);
  window.open(buildWhatsAppUrl(folio), "_blank", "noopener,noreferrer");
}
