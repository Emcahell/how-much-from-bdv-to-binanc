/** Comisión del BDV al comprar divisas (VES → USD) — 0.5% */
export const BDV_PURCHASE_RATE = 0.005;

/** Comisión del BDV al gastar divisas — variable por tipo de tarjeta */
export const BDV_SPEND_RATES = {
  virtual: 0.025, // 2.5% — tarjeta virtual
  fisica: 0.015,  // 1.5% — tarjeta física
} as const;

/** Comisión de Binance al recibir USD del BDV — 3.6% */
export const BINANCE_COMMISSION_RATE = 0.036;

export type CardType = "virtual" | "fisica";

/** Etiquetas descriptivas para cada paso del flujo */
export const LABELS = {
  vesInput: "Bolívares (VES)",
  usdInput: "Dólares (USD)",
  bdvPurchaseCommission: "Comisión BDV — Compra de divisas",
  bdvSpendCommission: "Comisión BDV — Gasto de divisas",
  binanceCommission: "Comisión Binance",
  binanceResult: "Total en Binance (USD)",
} as const;

/** Formatea un número para inputs numéricos (sin comas) */
export function formatInput(value: number): string {
  return value.toFixed(2);
}

/** Formatea un número para display con separadores de miles */
export function formatDisplay(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
