import { useEffect, useState } from "react";
import Header from "./components/Header";
import ManifestForm from "./components/ManifestForm";
import FolioCard from "./components/FolioCard";
import { loadFolios, saveFolios, nextFolioNumber } from "./utils/storage";

export default function App() {
  const [folios, setFolios] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFolios(loadFolios());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveFolios(folios);
  }, [folios, hydrated]);

  function handleSave(entry) {
    setFolios((prev) => [
      {
        ...entry,
        id: crypto.randomUUID(),
        folio: nextFolioNumber(prev),
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }

  function handleDelete(id) {
    setFolios((prev) => prev.filter((f) => f.id !== id));
  }

  const sorted = [...folios].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="min-h-screen bg-paper pb-16">
      <Header />

      <main className="mx-auto -mt-6 max-w-3xl px-6">
        <ManifestForm onSave={handleSave} />

        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-navy">
              Manifiestos registrados
            </h2>
            <span className="text-sm text-ink/50">
              {folios.length} {folios.length === 1 ? "folio" : "folios"}
            </span>
          </div>

          {sorted.length === 0 ? (
            <div className="rounded-xl border border-dashed border-ink/20 bg-white/50 p-8 text-center text-sm text-ink/50">
              Aún no hay manifiestos guardados. Complete el formulario para
              registrar el primero.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {sorted.map((folio) => (
                <FolioCard key={folio.id} folio={folio} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="mx-auto mt-16 max-w-3xl px-6 text-center text-xs text-ink/40">
        Transportes Portillo — Más de 20 años moviendo a México
      </footer>
    </div>
  );
}
