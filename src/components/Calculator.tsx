import { useState, useCallback, useEffect, type ReactNode } from "react";
import {
  Landmark,
  ArrowLeftRight,
  CreditCard,
  Smartphone,
  ArrowUpDown,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import {
  BDV_PURCHASE_RATE,
  BDV_SPEND_RATE,
  BINANCE_COMMISSION_RATE,
  LABELS,
  formatInput,
  formatDisplay,
} from "../config/calculator";

/** Resultados del cálculo */
interface CalcResult {
  ves: number;
  usd: number;
  usdAfterPurchase: number;
  usdAfterSpend: number;
  usdAfterBinance: number;
}

function calculate(ves: number, rate: number): CalcResult {
  const usd = ves / rate;
  const usdAfterPurchase = usd * (1 - BDV_PURCHASE_RATE);
  const usdAfterSpend = usdAfterPurchase * (1 - BDV_SPEND_RATE);
  const usdAfterBinance = usdAfterSpend * (1 - BINANCE_COMMISSION_RATE);
  return { ves, usd, usdAfterPurchase, usdAfterSpend, usdAfterBinance };
}

function calculateFromUsd(usd: number, rate: number): CalcResult {
  const ves = usd * rate;
  return calculate(ves, rate);
}

/** Limpia un string de entrada: solo dígitos y un punto decimal */
function cleanNumericInput(raw: string): string {
  const cleaned = raw.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length > 2) return parts[0] + "." + parts.slice(1).join("");
  return cleaned;
}

/** Formatea un número con comas de miles y decimales */
function formatWithCommas(numStr: string): string {
  if (!numStr) return "";
  const parts = numStr.split(".");
  const intPart = parts[0];
  const decPart = parts[1];
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (decPart !== undefined) return withCommas + "." + decPart;
  if (numStr.endsWith(".")) return withCommas + ".";
  return withCommas;
}

interface CalculatorProps {
  rate: number | null;
}

export default function Calculator({ rate }: CalculatorProps) {
  const [ves, setVes] = useState("");
  const [usd, setUsd] = useState("");
  const [lastEdited, setLastEdited] = useState<"ves" | "usd" | null>(null);

  const [result, setResult] = useState<CalcResult>({
    ves: 0,
    usd: 0,
    usdAfterPurchase: 0,
    usdAfterSpend: 0,
    usdAfterBinance: 0,
  });

  const recalc = useCallback(() => {
    if (rate === null) return;
    const vesNum = parseFloat(ves) || 0;
    const usdNum = parseFloat(usd) || 0;

    if (lastEdited === "ves") {
      const r = calculate(vesNum, rate);
      setResult(r);
      setUsd(formatInput(r.usd));
    } else if (lastEdited === "usd") {
      const r = calculateFromUsd(usdNum, rate);
      setResult(r);
      setVes(formatInput(r.ves));
    } else {
      if (vesNum > 0) {
        setResult(calculate(vesNum, rate));
      }
    }
  }, [ves, usd, lastEdited, rate]);

  useEffect(() => {
    recalc();
  }, [recalc]);

  const handleVesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cleaned = cleanNumericInput(raw);
    const cursorPos = e.target.selectionStart ?? raw.length;
    const formatted = formatWithCommas(cleaned);
    const newCursorPos = cursorPos + (formatted.length - raw.length);
    setVes(cleaned);
    setLastEdited("ves");
    requestAnimationFrame(() => {
      e.target.setSelectionRange(newCursorPos, newCursorPos);
    });
  };

  const handleUsdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cleaned = cleanNumericInput(raw);
    const cursorPos = e.target.selectionStart ?? raw.length;
    const formatted = formatWithCommas(cleaned);
    const newCursorPos = cursorPos + (formatted.length - raw.length);
    setUsd(cleaned);
    setLastEdited("usd");
    requestAnimationFrame(() => {
      e.target.setSelectionRange(newCursorPos, newCursorPos);
    });
  };

  /* ── Sin tasa configurada ──────────────────────────────── */
  if (rate === null) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 sm:px-0">
        <div className="rounded-xl bg-[#181a20] border border-[#2b3139] p-8 text-center">
          <AlertTriangle className="w-10 h-10 text-[#f0b90b] mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-[#eaecef] mb-2">
            Tasa no configurada
          </h2>
          <p className="text-sm text-[#848e9c]">
            Presiona el botón de configuración en la parte superior para
            ingresar la tasa de conversión del BDV.
          </p>
        </div>
      </div>
    );
  }

  /* ── Conversor ─────────────────────────────────────────── */
  const rateDetail = `${rate} VES = 1 USD`;

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 px-4 sm:px-0">
      {/* Inputs */}
      <div className="rounded-xl bg-[#181a20] border border-[#2b3139] p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#eaecef]">
            Convertidor
          </h2>
          <span className="text-xs text-[#848e9c] bg-[#2b3139] px-2 py-1 rounded">
            {rateDetail}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-3 sm:gap-4 items-end">
          {/* VES Input */}
          <div>
            <label className="block text-xs text-[#848e9c] mb-1.5">
              {LABELS.vesInput}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={formatWithCommas(ves)}
                onChange={handleVesChange}
                placeholder="0.00"
                className="w-full bg-[#2b3139] border border-[#2b3139] rounded-lg px-3 py-2.5 text-lg text-[#eaecef] placeholder-[#5e6673] focus:border-[#f0b90b] focus:outline-none transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#848e9c]">
                VES
              </span>
            </div>
          </div>

          {/* Swap indicator */}
          <div className="hidden sm:flex items-center justify-center pb-2">
            <div className="w-8 h-8 rounded-full bg-[#2b3139] flex items-center justify-center">
              <ArrowUpDown className="w-4 h-4 text-[#f0b90b]" />
            </div>
          </div>

          {/* USD Input */}
          <div>
            <label className="block text-xs text-[#848e9c] mb-1.5">
              {LABELS.usdInput}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={formatWithCommas(usd)}
                onChange={handleUsdChange}
                placeholder="0.00"
                className="w-full bg-[#2b3139] border border-[#2b3139] rounded-lg px-3 py-2.5 text-lg text-[#eaecef] placeholder-[#5e6673] focus:border-[#f0b90b] focus:outline-none transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#848e9c]">
                USD
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Flow Results */}
      <div className="rounded-xl bg-[#181a20] border border-[#2b3139] p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-[#848e9c] mb-4 uppercase tracking-wider">
          Flujo de conversión
        </h3>

        <div className="space-y-3">
          {/* Step 1: VES → USD */}
          <FlowStep
            icon={<Landmark className="w-5 h-5 text-[#f0b90b]" />}
            label="Compra en BDV"
            from={`${formatDisplay(result.ves)} VES`}
            to={`${formatDisplay(result.usd)} USD`}
            detail={rateDetail}
            accent="#f0b90b"
          />

          {/* Step 2: Comisión compra divisas 0.5% */}
          <FlowStep
            icon={<ArrowLeftRight className="w-5 h-5 text-[#f0b90b]" />}
            label={LABELS.bdvPurchaseCommission}
            from={`${formatDisplay(result.usd)} USD`}
            to={`${formatDisplay(result.usdAfterPurchase)} USD`}
            detail={`-${(BDV_PURCHASE_RATE * 100).toFixed(1)}% por compra`}
            accent="#f0b90b"
            isDiscount
          />

          {/* Step 3: Comisión gasto divisas 2.5% */}
          <FlowStep
            icon={<CreditCard className="w-5 h-5 text-[#f0b90b]" />}
            label={LABELS.bdvSpendCommission}
            from={`${formatDisplay(result.usdAfterPurchase)} USD`}
            to={`${formatDisplay(result.usdAfterSpend)} USD`}
            detail={`-${(BDV_SPEND_RATE * 100).toFixed(1)}% por transferencia`}
            accent="#f0b90b"
            isDiscount
          />

          {/* Step 4: Comisión Binance 3.6% */}
          <FlowStep
            icon={<Smartphone className="w-5 h-5 text-[#f6465d]" />}
            label={LABELS.binanceCommission}
            from={`${formatDisplay(result.usdAfterSpend)} USD`}
            to={`${formatDisplay(result.usdAfterBinance)} USD`}
            detail={`-${(BINANCE_COMMISSION_RATE * 100).toFixed(1)}% por transferencia`}
            accent="#f6465d"
            isDiscount
          />

          {/* Final Result */}
          <div className="mt-4 pt-4 border-t border-[#2b3139]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#848e9c]">
                {LABELS.binanceResult}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[#0ecb81]">
                ${formatDisplay(result.usdAfterBinance)}
              </span>
            </div>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-[#5e6673]">
              <span>
                Total perdido en comisiones: $
                {formatDisplay(result.usd - result.usdAfterBinance)}
              </span>
              <span>
                {(
                  ((result.usd - result.usdAfterBinance) / (result.usd || 1)) *
                  100
                ).toFixed(2)}
                % total
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-componente interno ────────────────────────────────── */

interface FlowStepProps {
  icon: ReactNode;
  label: string;
  from: string;
  to: string;
  detail: string;
  accent: string;
  isDiscount?: boolean;
}

function FlowStep({
  icon,
  label,
  from,
  to,
  detail,
  accent,
  isDiscount = false,
}: FlowStepProps) {
  return (
    <div className="flex items-center gap-3 bg-[#1e2329] rounded-lg p-3">
      <div className="flex-shrink-0">{icon}</div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <span className="text-sm font-medium text-[#eaecef] truncate">{label}</span>
          <span className="text-[10px] text-[#5e6673]">{detail}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-xs">
          <span className="text-[#848e9c]">{from}</span>
          <ChevronRight className="w-3 h-3 text-[#5e6673] flex-shrink-0" />
          <span
            className="font-semibold whitespace-nowrap"
            style={{ color: isDiscount ? "#f6465d" : accent }}
          >
            {isDiscount ? "-" : ""}
            {to}
          </span>
        </div>
      </div>
    </div>
  );
}
