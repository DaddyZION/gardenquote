"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, X, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed as PWA
    const standalone = window.matchMedia("(display-mode: standalone)").matches 
      || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;
    setIsIOS(iOS);

    // Listen for the beforeinstallprompt event (Android/Desktop Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    // If we have a deferred prompt, use it
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsStandalone(true);
      }
      setDeferredPrompt(null);
    } else {
      // Show manual instructions for Android
      setShowAndroidModal(true);
    }
  };

  // Don't show if already installed
  if (isStandalone) {
    return null;
  }

  return (
    <>
      <Button
        onClick={handleInstallClick}
        variant="outline"
        size="lg"
        className="w-full border-violet-500/30 text-violet-400 hover:bg-violet-500/10 hover:border-violet-500/50 group"
      >
        <Download className="h-5 w-5 mr-2 group-hover:animate-bounce" />
        Add to Home Screen
        <Smartphone className="h-4 w-4 ml-2 opacity-50" />
      </Button>

      {/* iOS Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-violet-400" />
                Install InstaQuote
              </h2>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-slate-300 text-sm">
                Install InstaQuote on your iPhone for quick access:
              </p>
              
              <div className="space-y-3">
                <Step number={1}>
                  Tap the <Share className="inline h-4 w-4 text-blue-400 mx-1" /> <span className="text-blue-400 font-medium">Share</span> button at the bottom of Safari
                </Step>
                <Step number={2}>
                  Scroll down and tap <span className="text-slate-100 font-medium">&quot;Add to Home Screen&quot;</span>
                </Step>
                <Step number={3}>
                  Tap <span className="text-blue-400 font-medium">&quot;Add&quot;</span> in the top right corner
                </Step>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => setShowIOSModal(false)}
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                >
                  Got it!
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Android Instructions Modal */}
      {showAndroidModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-violet-400" />
                Install InstaQuote
              </h2>
              <button
                onClick={() => setShowAndroidModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-slate-300 text-sm">
                Install InstaQuote on your Android for quick access:
              </p>
              
              <div className="space-y-3">
                <Step number={1}>
                  Tap the <span className="text-slate-100 font-medium">⋮</span> menu button in Chrome (top right)
                </Step>
                <Step number={2}>
                  Tap <span className="text-slate-100 font-medium">&quot;Add to Home screen&quot;</span> or <span className="text-slate-100 font-medium">&quot;Install app&quot;</span>
                </Step>
                <Step number={3}>
                  Tap <span className="text-blue-400 font-medium">&quot;Add&quot;</span> to confirm
                </Step>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => setShowAndroidModal(false)}
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                >
                  Got it!
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Step({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-6 h-6 bg-violet-500/20 rounded-full flex items-center justify-center text-violet-400 text-sm font-bold">
        {number}
      </div>
      <p className="text-slate-400 text-sm leading-relaxed">{children}</p>
    </div>
  );
}
