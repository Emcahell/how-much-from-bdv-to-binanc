const STORAGE_KEY = "bdv_binance_exchange_rate";
export const RATE_CHANGED_EVENT = "bdv-rate-changed";

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
