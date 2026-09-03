const WHATSAPP_NUMBER = "5215563179011";

const GOOGLE_MAPS_LINK = "https://maps.app.goo.gl/jq4xrTgDrZkaS6kAA";

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

function buildWhatsAppMessage(folio) {
  return [
    `\u{1F4E6} *Manifiesto de Envío*`,
    "",
    `\u{1F4C4} Folio: ${String(folio.folio).padStart(4, "0")}`,
    `\u{1F4B3} Factura: ${folio.factura}`,
    `\u{1F5C3}\uFE0F Contenedor: ${folio.containerName}`,
    `\u{1F4C5} Fecha de salida: ${formatDate(folio.date)}`,
    `\u{1F3E2} Empresa: ${folio.company}`,
    `\u{1F464} Contacto: ${folio.contact}`,
    `\u{1F4DE} Teléfono: ${folio.phone}`,
    `\u{1F4CD} Origen: ${folio.origen}`,
    `\u{1F3ED} Destino: ${folio.destino}`,
    `\u{1F697} Placas: ${folio.plates}`,
    `\u{1F9D1}\u200D\u{1F4BB} Operador: ${folio.operator}`,
    `\u{1F4C8} Costo: $${Number(folio.cost).toLocaleString("es-MX")}`,
    "",
    `\u{1F5FA}\uFE0F Ubicación: ${GOOGLE_MAPS_LINK}`,
  ].join("\n");
}

export function buildWhatsAppUrl(folio) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(folio))}`;
}

export async function shareManifestText(folio) {
  const message = buildWhatsAppMessage(folio);

  if (navigator.share) {
    try {
      await navigator.share({
        title: `Manifiesto ${String(folio.folio).padStart(4, "0")}`,
        text: message,
      });
      return;
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("No se pudo compartir el mensaje:", err);
    }
  }

  window.open(buildWhatsAppUrl(folio), "_blank", "noopener,noreferrer");
}
