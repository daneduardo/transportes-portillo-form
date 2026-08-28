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

const DATA_ROWS = [
  { key: "company", label: "Empresa" },
  { key: "contact", label: "Contacto" },
  { key: "phone", label: "Teléfono" },
  { key: "operator", label: "Operador" },
  { key: "plates", label: "Placas" },
  { key: "term", label: "Plazo" },
];

export default function FolioCard({ folio, onDelete }) {
  return (
    <article className="folio-edge flex overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
      <div className="flex w-16 shrink-0 flex-col items-center justify-center gap-1 bg-navy py-4 pl-3 text-white sm:w-20">
        <span className="text-[10px] uppercase tracking-wider text-white/60">
          Folio
        </span>
        <span className="font-mono text-lg font-semibold">
          {String(folio.folio).padStart(4, "0")}
        </span>
      </div>

      <div className="flex-1 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-navy">
              {folio.containerName}
            </h3>
            <p className="text-xs text-ink/60">{formatDate(folio.date)}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-brandgreen/15 px-3 py-1 font-mono text-sm font-semibold text-green-800">
              {currencyFormatter.format(folio.cost)}
            </span>
            <button
              type="button"
              onClick={() => onDelete(folio.id)}
              className="btn btn-ghost btn-sm btn-circle text-ink/40 hover:bg-error/10 hover:text-error"
              aria-label={`Eliminar folio ${folio.folio}`}
              title="Eliminar folio"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M9 3h6l1 2h4v2H4V5h4l1-2zm-2 6h10l-1 12H8L7 9zm3 2v8h1v-8h-1zm4 0v8h1v-8h-1z" />
              </svg>
            </button>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
          {DATA_ROWS.map((row) => (
            <div key={row.key}>
              <dt className="text-[11px] uppercase tracking-wide text-ink/45">
                {row.label}
              </dt>
              <dd className="font-medium text-ink">{folio[row.key]}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
