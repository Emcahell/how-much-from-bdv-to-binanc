import { useState, useEffect } from "react";
import Calculator from "./Calculator";
import { getSavedRate, getSavedCardType, RATE_CHANGED_EVENT, CARD_TYPE_CHANGED_EVENT, type CardType } from "../lib/storage";

export default function CalculatorApp() {
  const [rate, setRate] = useState<number | null>(null);
  const [cardType, setCardType] = useState<CardType>("virtual");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRate(getSavedRate());
    setCardType(getSavedCardType());
    setLoading(false);

    const rateHandler = (e: Event) => {
      setRate((e as CustomEvent<number>).detail);
    };
    const cardHandler = (e: Event) => {
      setCardType((e as CustomEvent<CardType>).detail);
    };
    window.addEventListener(RATE_CHANGED_EVENT, rateHandler);
    window.addEventListener(CARD_TYPE_CHANGED_EVENT, cardHandler);
    return () => {
      window.removeEventListener(RATE_CHANGED_EVENT, rateHandler);
      window.removeEventListener(CARD_TYPE_CHANGED_EVENT, cardHandler);
    };
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

  return <Calculator rate={rate} cardType={cardType} />;
}
