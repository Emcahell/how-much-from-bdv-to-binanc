import { useState, useEffect, useRef, useCallback } from "react";
import { Settings, X } from "lucide-react";
import { getSavedRate, saveRate, RATE_CHANGED_EVENT } from "../lib/storage";

export default function RateManager() {
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [currentRate, setCurrentRate] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // On mount: load saved rate or show modal
  useEffect(() => {
    const saved = getSavedRate();
    if (saved !== null) {
      setCurrentRate(saved);
      window.dispatchEvent(new CustomEvent(RATE_CHANGED_EVENT, { detail: saved }));
    } else {
      setShowModal(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus input when modal opens
  useEffect(() => {
    if (showModal) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showModal]);

  /** Convierte dígitos crudos a número (últimos 2 dígitos = decimales) */
  const rawToNumber = (raw: string): number => {
    if (!raw) return 0;
    const num = parseInt(raw, 10);
    return isNaN(num) ? 0 : num / 100;
  };

  /** Convierte un número a dígitos crudos (×100, sin punto) */
  const numberToRaw = (num: number): string => {
    return String(Math.round(num * 100));
  };

  /** Formatea dígitos crudos para display: inserta punto 2 posiciones desde la derecha */
  const formatRaw = (raw: string): string => {
    if (!raw) return "";
    // Pad con ceros a la izquierda hasta tener al menos 3 dígitos (ej: "5" → "005" → "0.05")
    const padded = raw.padStart(3, "0");
    const intPart = padded.slice(0, -2);
    const decPart = padded.slice(-2);
    // Agregar comas a la parte entera
    const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return withCommas + "." + decPart;
  };

  const handleSave = useCallback(() => {
    const num = rawToNumber(inputValue);
    if (num <= 0) return;
    saveRate(num);
    setCurrentRate(num);
    setShowModal(false);
    window.dispatchEvent(new CustomEvent(RATE_CHANGED_EVENT, { detail: num }));
  }, [inputValue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape" && currentRate !== null) setShowModal(false);
  };

  return (
    <>
      {/* Header button */}
      <button
        onClick={() => {
          if (currentRate !== null) setInputValue(numberToRaw(currentRate));
          else setInputValue("");
          setShowModal(true);
        }}
        className="flex items-center gap-2 rounded-lg bg-[#181a20] border border-[#2b3139] px-3 py-1.5 text-sm hover:border-[#f0b90b] transition-colors cursor-pointer"
        title="Configurar tasa de conversión"
      >
        {currentRate !== null ? (
          <>
            <span className="text-[#848e9c] hidden sm:inline">Tasa:</span>
            <span className="font-semibold text-[#f0b90b]">
              {currentRate} VES / 1 USD
            </span>
          </>
        ) : (
          <span className="text-[#848e9c]">Configurar tasa</span>
        )}
        <Settings className="w-4 h-4 text-[#848e9c]" />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => {
              if (currentRate !== null) setShowModal(false);
            }}
          />

          {/* Modal content */}
          <div className="relative w-full max-w-sm rounded-xl bg-[#181a20] border border-[#2b3139] p-6 shadow-2xl">
            {/* Close button (only if there's a saved rate) */}
            {currentRate !== null && (
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 p-1 rounded-lg hover:bg-[#2b3139] transition-colors text-[#5e6673] hover:text-[#eaecef]"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Title */}
            <h3 className="text-lg font-semibold text-[#eaecef] mb-1">
              {currentRate === null ? "Bienvenido" : "Actualizar tasa"}
            </h3>
            <p className="text-sm text-[#848e9c] mb-5">
              {currentRate === null
                ? "Ingresa la tasa de conversión que te cobra el BDV para comprar USD."
                : "Ingresa la tasa actualizada de conversión del BDV."}
            </p>

            {/* Input */}
            <div className="mb-5">
              <label className="block text-xs text-[#848e9c] mb-1.5">
                VES por 1 USD
              </label>
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={formatRaw(inputValue)}
                onChange={(e) => {
                  // Solo aceptar dígitos, ignorar puntos y comas
                  const digits = e.target.value.replace(/\D/g, "");
                  // Limitar a 10 dígitos (máx ~9,999,999.99)
                  if (digits.length > 10) return;
                  setInputValue(digits);
                }}
                onKeyDown={handleKeyDown}
                placeholder="0.00"
                className="w-full bg-[#2b3139] border border-[#2b3139] rounded-lg px-3 py-2.5 text-lg text-[#eaecef] placeholder-[#5e6673] focus:border-[#f0b90b] focus:outline-none transition-colors"
              />
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={!inputValue || rawToNumber(inputValue) <= 0}
              className="w-full py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-[#f0b90b] text-[#0b0e11] hover:bg-[#c99400]"
            >
              {currentRate !== null ? "Actualizar tasa" : "Guardar tasa"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
