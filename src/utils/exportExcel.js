import * as XLSX from "xlsx-js-style";

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

const thinBorder = {
  top: { style: "thin", color: { rgb: "000000" } },
  bottom: { style: "thin", color: { rgb: "000000" } },
  left: { style: "thin", color: { rgb: "000000" } },
  right: { style: "thin", color: { rgb: "000000" } },
};

const headerStyle = {
  font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11, name: "Calibri" },
  fill: { fgColor: { rgb: "1F4E79" } },
  alignment: { horizontal: "center", vertical: "center", wrapText: true },
  border: thinBorder,
};

const cellStyle = {
  border: thinBorder,
  alignment: { vertical: "center" },
};

const COL_WIDTHS = [
  { wch: 24 }, // NUMERO DE CONTENEDOR
  { wch: 16 }, // FECHA SALIDA
  { wch: 30 }, // CLIENTE/RAZON SOCIAL
  { wch: 22 }, // NOMBRE CONTACTO
  { wch: 18 }, // TELEFONO CONTACTO
  { wch: 14 }, // DIAS CREDITO
  { wch: 18 }, // ORIGEN
  { wch: 18 }, // DESTINO
  { wch: 20 }, // UNIDAD / PLACAS
  { wch: 22 }, // OPERADOR
  { wch: 18 }, // COSTO DE FLETE
  { wch: 10 }, // FOLIO
  { wch: 16 }, // FACTURA
];

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

  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cellRef = XLSX.utils.encode_cell({ r, c });
      if (worksheet[cellRef]) {
        worksheet[cellRef].s = r === 0 ? headerStyle : cellStyle;
      }
    }
  }

  worksheet["!cols"] = COL_WIDTHS;

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
