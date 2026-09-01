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

export function exportToExcel(folios) {
  const rows = folios.map((folio) => ({
    "NUMERO DE CONTENEDOR": folio.containerName,
    "FECHA SALIDA": formatDate(folio.createdAt),
    "CLIENTE/RAZON SOCIAL": folio.company,
    "NOMBRE CONTACTO": folio.contact,
    "TELEFONO CONTACTO": folio.phone,
    "DIAS CREDITO": folio.term,
    ORIGEN: folio.origen,
    DESTINO: folio.destino,
    "UNIDAD / PLACAS": folio.plates,
    OPERADOR: folio.operator,
    "COSTO DE FLETE": formatCost(folio.cost),
    FOLIO: String(folio.folio).padStart(4, "0"),
    FACTURA: folio.factura,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows, { header: COLUMNS });

  const workbook = XLSX.book_new();
  XLSX.book_append_sheet(workbook, worksheet, "Manifiestos");

  const filename = `CONCENTRADO_${
    new Date().toLocaleString("es-MX", { month: "short" }).toUpperCase()
  }_${new Date().getFullYear().toString().slice(-2)}.xlsx`;

  XLSX.writeFile(workbook, filename);
}