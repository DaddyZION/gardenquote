"use client";

import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, Trash2, Send, Calendar, Ruler } from "lucide-react";
import { generateWhatsAppUrl } from "@/utils/calculations";
import type { SavedQuote } from "@/components/Estimator";

export default function SavedJobsPage() {
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load saved quotes from localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("pricer_saved");
    if (saved) {
      try {
        setSavedQuotes(JSON.parse(saved));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const handleDelete = useCallback((id: string) => {
    const updated = savedQuotes.filter((q) => q.id !== id);
    setSavedQuotes(updated);
    localStorage.setItem("pricer_saved", JSON.stringify(updated));
  }, [savedQuotes]);

  const handleWhatsApp = useCallback((quote: SavedQuote) => {
    const url = generateWhatsAppUrl({
      area: quote.results.area,
      slabs: quote.results.slabs600x600,
      subBase: quote.results.subBaseTonnes,
      sand: quote.results.sandTonnes,
      clientPrice: quote.quote.clientPrice,
    });
    window.open(url, "_blank");
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!mounted) {
    return (
      <>
        <Header
          title="Saved Jobs"
          subtitle="Your saved quotes"
          icon={<FolderOpen className="h-6 w-6" />}
        />
        <main className="px-4 py-6 max-w-lg mx-auto">
          <div className="text-center py-12 text-slate-400">
            Loading...
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header
        title="Saved Jobs"
        subtitle={`${savedQuotes.length} quote${savedQuotes.length !== 1 ? "s" : ""} saved`}
        icon={<FolderOpen className="h-6 w-6" />}
      />

      <main className="px-4 py-6 max-w-lg mx-auto">
        {savedQuotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-full mb-4">
              <FolderOpen className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">
              No Saved Quotes
            </h3>
            <p className="text-slate-500 max-w-xs mx-auto">
              Create a new quote and save it to see it here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedQuotes.map((quote) => (
              <Card key={quote.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-base">
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-amber-500" />
                      <span>{quote.results.area}m²</span>
                    </div>
                    <span className="text-2xl font-bold text-emerald-400">
                      £{quote.quote.clientPrice.toFixed(2)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <Calendar className="h-3 w-3" />
                    {formatDate(quote.timestamp)}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                    <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                      <p className="text-xs text-slate-400">Length</p>
                      <p className="font-semibold text-slate-200">{quote.inputs.length}m</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                      <p className="text-xs text-slate-400">Width</p>
                      <p className="font-semibold text-slate-200">{quote.inputs.width}m</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                      <p className="text-xs text-slate-400">Depth</p>
                      <p className="font-semibold text-slate-200">{quote.inputs.depth}cm</p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1 mb-4">
                    <p>Slabs: {quote.results.slabs600x600} pcs • Sub-base: {quote.results.subBaseTonnes}t • Sand: {quote.results.sandTonnes}t</p>
                    {quote.inputs.diggingOut && (
                      <p className="text-red-400">🪓 Digging out • {quote.results.skipsNeeded} skip(s) needed</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="whatsapp"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleWhatsApp(quote)}
                    >
                      <Send className="h-4 w-4" />
                      WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(quote.id)}
                      className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
