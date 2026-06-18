import { useState, useEffect } from "react";
import { Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    ) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  // Don't show button if already installed or prompt not available
  if (isInstalled || !deferredPrompt) return null;

  return (
    <button
      onClick={handleInstall}
      className="flex items-center gap-1.5 rounded-lg bg-[#f0b90b] px-3 py-1.5 text-sm font-semibold text-[#0b0e11] hover:bg-[#c99400] transition-colors cursor-pointer"
      title="Instalar aplicación"
    >
      <Download className="w-4 h-4" />
      <span className="hidden sm:inline">Instalar</span>
    </button>
  );
}
