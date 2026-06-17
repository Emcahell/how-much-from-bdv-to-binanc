import { useState, useEffect } from "react";
import Calculator from "./Calculator";
import { getSavedRate, RATE_CHANGED_EVENT } from "../lib/storage";

export default function CalculatorApp() {
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRate(getSavedRate());
    setLoading(false);

    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      setRate(customEvent.detail);
    };
    window.addEventListener(RATE_CHANGED_EVENT, handler);
    return () => window.removeEventListener(RATE_CHANGED_EVENT, handler);
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 sm:px-0">
        <div className="rounded-xl bg-[#181a20] border border-[#2b3139] p-8 text-center">
          <div className="inline-block w-5 h-5 border-2 border-[#2b3139] border-t-[#f0b90b] rounded-full animate-spin mb-3" />
          <p className="text-sm text-[#848e9c]">Preparando la página…</p>
        </div>
      </div>
    );
  }

  return <Calculator rate={rate} />;
}
