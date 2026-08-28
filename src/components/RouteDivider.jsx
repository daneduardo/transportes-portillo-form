// Signature element: a compact "route line" echoing the truck-in-transit
// graphic from the brand flyer — folio in, delivery term out.
export default function RouteDivider() {
  return (
    <div className="flex items-center gap-3 px-1 pb-6 text-navy">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-white">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M4 4h9v9H4zM19 9h-4v6h4a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2zM4 15h11v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
        </svg>
      </div>
      <div className="relative h-px flex-1 bg-[repeating-linear-gradient(90deg,theme(colors.brandgreen.DEFAULT)_0,theme(colors.brandgreen.DEFAULT)_6px,transparent_6px,transparent_12px)]" />
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brandgreen text-navy">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M6 2v20l7-4 7 4V2z" />
        </svg>
      </div>
      <span className="sr-only">Del registro del folio al plazo de entrega</span>
    </div>
  );
}
