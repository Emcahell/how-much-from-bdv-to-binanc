import { useState, useEffect } from "react";
import Calculator from "./Calculator";
import { getSavedRate, RATE_CHANGED_EVENT } from "../lib/storage";

export default function CalculatorApp() {
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    setRate(getSavedRate());

    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      setRate(customEvent.detail);
    };
    window.addEventListener(RATE_CHANGED_EVENT, handler);
    return () => window.removeEventListener(RATE_CHANGED_EVENT, handler);
  }, []);

  return <Calculator rate={rate} />;
}
