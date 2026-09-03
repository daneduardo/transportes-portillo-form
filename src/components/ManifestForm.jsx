import { useState } from "react";
import RouteDivider from "./RouteDivider";
// import LocationAutocomplete from "./LocationAutocomplete"; // STANDBY: Google Places autocomplete for Origen/Destino (needs VITE_GOOGLE_MAPS_API_KEY)
import { FaTimes } from "react-icons/fa";

const EMPTY_FORM = {
  containerName: "",
  date: "",
  company: "",
  contact: "",
  phone: "",
  operator: "",
  plates: "",
  origen: "",
  destino: "",
  rfc: "",
  term: "",
  cost: "",
};

const RFC_PATTERN = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;

const OPERATORS = [
  "26BG5V - ROLANDO BAUTISTA",
  "89BG9V - GERARDO REZENDIZ",
  "37AX2C - DANIEL RAMIREZ",
];

const FIELD_META = [
  { name: "containerName", label: "Nombre del contenedor", type: "text", placeholder: "Ej. MSCU 123456-7", span: 1 },
  { name: "date", label: "Fecha de Salida", type: "date", span: 1 },
  { name: "company", label: "Nombre de la empresa", type: "text", placeholder: "Ej. Grupo Logístico del Bajío", span: 2 },
  { name: "origen", label: "Origen", type: "text", placeholder: "Ej. Ciudad de México, CDMX", span: 1 },
  { name: "destino", label: "Destino", type: "text", placeholder: "Ej. Guadalajara, Jalisco", span: 1 },
  { name: "contact", label: "Contacto", type: "text", placeholder: "Nombre de quien solicita", span: 1 },
  { name: "phone", label: "Teléfono", type: "tel", placeholder: "999 123 4567", span: 1 },
  { name: "plates", label: "Placas", type: "text", placeholder: "Ej. AB-123-C", span: 1 },
  { name: "operator", label: "Operador", type: "select", span: 1 },
  { name: "rfc", label: "RFC (opcional)", type: "text", placeholder: "Ej. ABC123456T1A", span: 2 },
  { name: "term", label: "Plazo", type: "text", placeholder: "Ej. 3 días hábiles", span: 1 },
  { name: "cost", label: "Costo (MXN)", type: "number", placeholder: "0.00", span: 1 },
];

export default function ManifestForm({ onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "plates" || name === "rfc" ? value.toUpperCase() : value,
    }));
  }

  function isValid() {
    return Object.entries(form).every(([key, value]) => {
      if (key === "cost") return String(value).trim() !== "" && Number(value) >= 0;
      if (key === "rfc") {
        const rfcValue = value.trim().toUpperCase();
        return rfcValue === "" || RFC_PATTERN.test(rfcValue);
      }
      return String(value).trim() !== "";
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (!isValid()) return;

    onSave({
      ...form,
      cost: Number(form.cost),
    });

    setForm(EMPTY_FORM);
    setTouched(false);
    setShowConfirmation(true);
    window.setTimeout(() => setShowConfirmation(false), 3500);
  }

  function handleReset() {
    setForm(EMPTY_FORM);
    setTouched(false);
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
      <RouteDivider />

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          {FIELD_META.map((field) => {
            const value = form[field.name];
            const isEmpty = String(value).trim() === "";
            const rfcInvalid = field.name === "rfc" && !isEmpty && !RFC_PATTERN.test(value.trim().toUpperCase());
            const showError = field.name === "rfc" ? rfcInvalid : touched && isEmpty;
            return (
              <div
                key={field.name}
                className={field.span === 2 ? "sm:col-span-2" : undefined}
              >
                <label className="label pb-1" htmlFor={field.name}>
                  <span className="label-text font-semibold text-navy">
                    {field.label}
                  </span>
                </label>

                {field.name === "operator" ? (
                  <select
                    id={field.name}
                    name={field.name}
                    className={`select select-bordered w-full focus:border-brandgreen focus:outline focus:outline-2 focus:outline-brandgreen/40 ${
                      showError ? "input-error" : ""
                    }`}
                    value={value}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Selecciona un operador
                    </option>
                    {OPERATORS.map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                ) : field.name === "cost" ? (
                  <label
                    className={`input input-bordered flex w-full items-center gap-2 focus-within:border-brandgreen focus-within:outline focus-within:outline-2 focus-within:outline-brandgreen/40 ${
                      showError ? "input-error" : ""
                    }`}
                  >
                    <span className="font-mono text-sm text-ink/60">$</span>
                    <input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      placeholder={field.placeholder}
                      className="grow font-mono"
                      value={value}
                      onChange={handleChange}
                    />
                    <span className="text-xs text-ink/50">MXN</span>
                  </label>
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    className={`input input-bordered w-full focus:border-brandgreen focus:outline focus:outline-2 focus:outline-brandgreen/40 ${
                      showError ? "input-error" : ""
                    }`}
                    value={value}
                    onChange={handleChange}
                  />
                )}

                {showError && (
                  <span className="mt-1 block text-xs text-error">
                    {rfcInvalid
                      ? "RFC inválido. Debe tener el formato correcto (3-4 letras, 6 dígitos y 3 caracteres finales)."
                      : "Este campo es obligatorio."}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {showConfirmation && (
          <section
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          >
            <div
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl transform transition-shadow hover:shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-navy">
                  Manifiesto guardado
                </h3>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="text-ink/60 hover:text-ink flex items-center gap-1"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-4 p-4 rounded-xl bg-brandgreen/10">
                <p className="font-medium text-ink">
                  <span className="font-semibold">Folio:</span>{" "}
                  <span className="font-mono text-lg">
                    {form.folio || "0001"}
                  </span>
                </p>
                <p className="font-medium text-ink mt-1">
                  <span className="font-semibold">Factura:</span>{" "}
                  <span className="font-mono text-lg">
                    {form.factura || "310826001"}
                  </span>
                </p>
              </div>

              <p className="text-ink/60 text-sm mb-6">
                El manifiesto ha sido guardado correctamente.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="btn btn-ghost w-full"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </section>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-ghost text-ink"
          >
            Limpiar
          </button>
          <button
            type="submit"
            className="btn border-none bg-brandgreen text-navy hover:bg-brandgreen-dark hover:text-white"
          >
            Guardar manifiesto
          </button>
        </div>
      </form>
    </section>
  );
}
