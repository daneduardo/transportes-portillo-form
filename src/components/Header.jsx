export default function Header() {
  return (
    <header className="relative overflow-hidden bg-navy text-white">
      {/* Diagonal green cut, echoing the flyer's corner treatment */}
      <div
        className="pointer-events-none absolute -right-10 -top-24 h-56 w-[60%] bg-brandgreen"
        style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-10 -top-24 h-56 w-[60%] bg-navy-light opacity-40"
        style={{ clipPath: "polygon(45% 0, 100% 0, 100% 60%, 0 100%)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl px-6 py-10 sm:py-12">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-brandgreen-light">
          Transportes Portillo
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold uppercase tracking-wide sm:text-4xl">
          Manifiesto de carga
        </h1>
        <p className="mt-2 max-w-md font-body text-sm text-white/70">
          Más de 20 años moviendo a México. Registre los datos de cada
          contenedor para llevar el control de su despacho.
        </p>
      </div>
    </header>
  );
}
