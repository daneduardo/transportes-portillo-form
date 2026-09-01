import { jsPDF } from "jspdf";

const NAVY = [11, 37, 69];
const GREEN = [124, 185, 63];
const INK = [26, 32, 44];
const LIGHT = [243, 244, 246];

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

function formatRfc(rfc) {
  return rfc && rfc.trim() !== "" ? rfc : "N/A";
}

export function generateManifestPDF(folio) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  let y = 14;

  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageWidth, 24, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("TRANSPORTES PORTILLO", margin, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Manifiesto de Carga", margin, y + 13);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(`Manifiesto #${String(folio.folio).padStart(4, "0")}`, pageWidth - margin, y + 8, {
    align: "right",
  });

  y = 34;

  doc.setTextColor(...INK);
  doc.setFontSize(9);
  doc.text(
    `Folio: ${String(folio.folio).padStart(4, "0")}   |   Factura: ${folio.factura}`,
    margin,
    y
  );
  y += 8;

  doc.setFillColor(...GREEN);
  doc.roundedRect(margin, y, contentWidth, 16, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(folio.containerName, margin + 4, y + 6);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(formatDate(folio.date), margin + 4, y + 12);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(
    currencyFormatter.format(folio.cost),
    pageWidth - margin - 4,
    y + 10,
    { align: "right" }
  );

  y += 26;

  doc.setFontSize(9);
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.text("RUTA", margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(folio.origen, margin, y);
  doc.text("→", pageWidth / 2, y, { align: "center" });
  doc.text(folio.destino, pageWidth - margin, y, { align: "right" });
  y += 12;

  doc.setDrawColor(...GREEN);
  doc.setLineWidth(1);
  doc.line(margin, y, pageWidth - margin, y);

  doc.setFillColor(...LIGHT);
  doc.roundedRect(margin, y + 4, contentWidth, 34, 2, 2, "F");

  const leftData = [
    ["Empresa", folio.company],
    ["Contacto", folio.contact],
    ["Teléfono", folio.phone],
  ];

  const rightData = [
    ["Operador", folio.operator],
    ["Placas", folio.plates],
    ["Plazo", folio.term],
  ];

  doc.setFontSize(6.5);
  doc.setTextColor(130, 130, 130);
  doc.setFont("helvetica", "bold");

  let dataY = y + 10;
  let colX = margin + 5;
  leftData.forEach(([label, value]) => {
    doc.text(label.toUpperCase(), colX, dataY);
    doc.setTextColor(...INK);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.text(String(value), colX, dataY + 5);
    doc.setFontSize(6.5);
    doc.setTextColor(130, 130, 130);
    doc.setFont("helvetica", "bold");
    dataY += 11;
  });

  dataY = y + 10;
  colX = pageWidth / 2 + 5;
  rightData.forEach(([label, value]) => {
    doc.text(label.toUpperCase(), colX, dataY);
    doc.setTextColor(...INK);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.text(String(value), colX, dataY + 5);
    doc.setFontSize(6.5);
    doc.setTextColor(130, 130, 130);
    doc.setFont("helvetica", "bold");
    dataY += 11;
  });

  y += 45;

  doc.setFontSize(6.5);
  doc.setTextColor(130, 130, 130);
  doc.text("RFC", margin, y);
  doc.text("FACTURA", pageWidth / 2, y);
  doc.text("FECHA", pageWidth - margin, y, { align: "right" });
  y += 5;
  doc.setTextColor(...INK);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(formatRfc(folio.rfc), margin, y);
  doc.text(folio.factura, pageWidth / 2, y);
  doc.text(
    new Date(folio.createdAt).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    pageWidth - margin,
    y,
    { align: "right" }
  );

  const blob = doc.output("blob");
  return {
    blob,
    filename: `MANIFIESTO_${String(folio.folio).padStart(4, "0")}.pdf`,
  };
}