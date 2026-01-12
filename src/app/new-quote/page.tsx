"use client";

import { Header } from "@/components/Header";
import { Estimator, type SavedQuote } from "@/components/Estimator";
import { Calculator } from "lucide-react";
import { useCallback } from "react";

export default function NewQuotePage() {
  const handleSaveQuote = useCallback((quote: SavedQuote) => {
    // Get existing saved quotes
    const existingStr = localStorage.getItem("gardenquote_saved");
    const existing: SavedQuote[] = existingStr ? JSON.parse(existingStr) : [];
    
    // Add new quote
    const updated = [quote, ...existing];
    
    // Save back to localStorage
    localStorage.setItem("gardenquote_saved", JSON.stringify(updated));
    
    // Show confirmation
    alert("Quote saved successfully!");
  }, []);

  return (
    <>
      <Header
        title="New Quote"
        subtitle="Enter job dimensions"
        icon={<Calculator className="h-6 w-6" />}
      />

      <main className="px-4 py-6 max-w-lg mx-auto">
        <Estimator onSaveQuote={handleSaveQuote} />
      </main>
    </>
  );
}
