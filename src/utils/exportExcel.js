import * as XLSX from "xlsx";

const COLUMNS = [
  "NUMERO DE CONTENEDOR",
  "FECHA SALIDA",
  "CLIENTE/RAZON SOCIAL",
  "NOMBRE CONTACTO",
  "TELEFONO CONTACTO",
  "DIAS CREDITO",
  "ORIGEN",
  "DESTINO",
  "UNIDAD / PLACAS",
  "OPERADOR",
  "COSTO DE FLETE",
  "FOLIO",
  "FACTURA",
];

function formatDate(isoDate) {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return d.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCost(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(value));
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

export function exportToExcel(folios) {
  const data = [
    COLUMNS,
    ...folios.map((folio) => [
      folio.containerName,
      formatDate(folio.createdAt),
      folio.company,
      folio.contact,
      folio.phone,
      folio.term,
      folio.origen,
      folio.destino,
      folio.plates,
      folio.operator,
      formatCost(folio.cost),
      String(folio.folio).padStart(4, "0"),
      folio.factura,
    ]),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Manifiestos");

  const filename = `CONCENTRADO_${
    new Date().toLocaleString("es-MX", { month: "short" }).toUpperCase()
  }_${new Date().getFullYear().toString().slice(-2)}.xlsx`;

  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  downloadBlob(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    filename
  );
}
