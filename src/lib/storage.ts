const STORAGE_KEY = "bdv_binance_exchange_rate";
const CARD_TYPE_KEY = "bdv_binance_card_type";
import { type CardType } from "../config/calculator";

export const RATE_CHANGED_EVENT = "bdv-rate-changed";
export const CARD_TYPE_CHANGED_EVENT = "bdv-card-type-changed";

export type { CardType };

/** Reads the saved exchange rate from localStorage, or null if not set */
export function getSavedRate(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const num = parseFloat(raw);
    return isNaN(num) || num <= 0 ? null : num;
  } catch {
    return null;
  }
}

/** Saves the exchange rate to localStorage */
export function saveRate(rate: number): void {
  localStorage.setItem(STORAGE_KEY, String(rate));
}

/** Reads the saved card type from localStorage, defaults to "virtual" */
export function getSavedCardType(): CardType {
  try {
    const raw = localStorage.getItem(CARD_TYPE_KEY);
    if (raw === "fisica" || raw === "virtual") return raw;
  } catch {}
  return "virtual";
}

/** Saves the card type to localStorage */
export function saveCardType(cardType: CardType): void {
  localStorage.setItem(CARD_TYPE_KEY, cardType);
}
