import { generateManifestPDF } from "./generatePDF";

const WHATSAPP_NUMBER = "5215563179011";

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

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
    `\u{1F69B} *MANIFIESTO #${String(folio.folio).padStart(4, "0")}*`,
    "",
    `\u{1F4E6} Contenedor: ${folio.containerName}`,
    `\u{1F4C5} Fecha salida: ${formatDate(folio.date)}`,
    `\u{1F464} Cliente: ${folio.company}`,
    `\u{1F4DE} Contacto: ${folio.contact} | ${folio.phone}`,
    `\u{1F6E3}\uFE0F Ruta: ${folio.origen} \u2192 ${folio.destino}`,
    `\u{1F697} Unidad: ${folio.plates}`,
    `\u{1F468}\u200D\u{1F3A4} Operador: ${folio.operator}`,
    `\u{1F4B0} Costo: ${currencyFormatter.format(folio.cost)}`,
    `\u{1F4C4} Folio: ${String(folio.folio).padStart(4, "0")} | Factura: ${folio.factura}`,
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

export async function shareManifestPDF(folio) {
  const { blob, filename } = generateManifestPDF(folio);

  const file = new File([blob], filename, { type: "application/pdf" });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: `Manifiesto #${String(folio.folio).padStart(4, "0")}`,
      });
      return;
    } catch (err) {
      if (err.name === "AbortError") return;
    }
  }

  downloadBlob(blob, filename);
  window.open(buildWhatsAppUrl(folio), "_blank", "noopener,noreferrer");
}
