import { FaWhatsapp } from "react-icons/fa";
import { buildWhatsAppUrl } from "../utils/whatsapp";

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
  { key: "rfc", label: "RFC" },
  { key: "term", label: "Plazo" },
];

function FolioInfo({ folio }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] uppercase tracking-wider text-white/60">
        Folio
      </span>
      <span className="font-mono text-lg font-bold">
        {String(folio).padStart(4, "0")}
      </span>
    </div>
  );
}

function RouteTracker({ origen, destino }) {
  return (
    <div className="mt-4 flex items-center gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-white">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
          <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
        </svg>
      </div>
      <span className="max-w-[40%] truncate text-sm font-medium text-ink" title={origen}>
        {origen}
      </span>
      <div className="relative h-px flex-1 bg-[repeating-linear-gradient(90deg,theme(colors.brandgreen.DEFAULT)_0,theme(colors.brandgreen.DEFAULT)_6px,transparent_6px,transparent_12px)]" />
      <span className="max-w-[40%] truncate text-sm font-medium text-ink" title={destino}>
        {destino}
      </span>
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brandgreen text-navy">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
          <path d="M6 2v20l7-4 7 4V2z" />
        </svg>
      </div>
    </div>
  );
}

export default function FolioCard({ folio, onDelete }) {
  return (
    <article className="folio-edge flex overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
      <div className="flex w-16 shrink-0 flex-col items-center justify-center gap-1 bg-navy py-4 pl-3 text-white sm:w-20">
        <FolioInfo folio={folio.folio} /></div>

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
            <a
              href={buildWhatsAppUrl(folio)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm btn-circle text-green-600 hover:bg-green-50"
              title="Enviar por WhatsApp"
              aria-label={`Enviar folio ${folio.folio} por WhatsApp`}
            >
              <FaWhatsapp className="h-4 w-4" />
            </a>
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

        <RouteTracker origen={folio.origen} destino={folio.destino} />

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

        <div className="mt-4 border-t border-ink/10 pt-3 text-xs text-ink/50">
          No de Factura: <span className="font-medium text-ink">{folio.factura}</span>
        </div>
      </div>
    </article>
  );
}
