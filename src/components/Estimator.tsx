"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  calculateAll, 
  calculateQuote, 
  generateWhatsAppUrl,
  type EstimatorInputs,
  type CalculationResults,
  type QuoteResults 
} from "@/utils/calculations";
import { MaterialsCalculator } from "@/components/MaterialsCalculator";
import { 
  Ruler, 
  Layers, 
  Box,
  Shovel, 
  Calculator,
  Send,
  Save,
  RotateCcw,
  Copy,
  Check
} from "lucide-react";

// Depth options in cm
const DEPTH_OPTIONS = [2.5, 5, 7.5, 10, 15];

interface SavedQuote {
  id: string;
  timestamp: number;
  inputs: EstimatorInputs;
  results: CalculationResults;
  quote: QuoteResults;
  dayRate: number;
  daysEstimated: number;
  materialsCost: number;
}

interface EstimatorProps {
  onSaveQuote?: (quote: SavedQuote) => void;
}

export function Estimator({ onSaveQuote }: EstimatorProps) {
  // Input state
  const [length, setLength] = useState<string>("");
  const [width, setWidth] = useState<string>("");
  const [depthIndex, setDepthIndex] = useState<number>(1); // Default to 5cm
  const [diggingOut, setDiggingOut] = useState<boolean>(false);

  // Quote state
  const [dayRate, setDayRate] = useState<string>("250");
  const [daysEstimated, setDaysEstimated] = useState<string>("1");
  const [materialsCost, setMaterialsCost] = useState<string>("0");

  // Calculation results
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [quoteResults, setQuoteResults] = useState<QuoteResults | null>(null);
  
  // Copy to clipboard state
  const [copied, setCopied] = useState(false);

  // localStorage key for current quote
  const STORAGE_KEY = "pricer_current";

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setLength(data.length || "");
        setWidth(data.width || "");
        setDepthIndex(data.depthIndex ?? 1);
        setDiggingOut(data.diggingOut ?? false);
        setDayRate(data.dayRate || "250");
        setDaysEstimated(data.daysEstimated || "1");
        setMaterialsCost(data.materialsCost || "0");
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Save to localStorage whenever inputs change
  useEffect(() => {
    const data = {
      length,
      width,
      depthIndex,
      diggingOut,
      dayRate,
      daysEstimated,
      materialsCost,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [length, width, depthIndex, diggingOut, dayRate, daysEstimated, materialsCost]);

  // Callback for materials calculator total change
  const handleMaterialsCostChange = useCallback((total: number) => {
    setMaterialsCost(total.toString());
  }, []);

  // Calculate results whenever inputs change
  useEffect(() => {
    const lengthNum = parseFloat(length) || 0;
    const widthNum = parseFloat(width) || 0;

    if (lengthNum > 0 && widthNum > 0) {
      const inputs: EstimatorInputs = {
        length: lengthNum,
        width: widthNum,
        depth: DEPTH_OPTIONS[depthIndex],
        diggingOut,
      };
      const calcResults = calculateAll(inputs);
      setResults(calcResults);
    } else {
      setResults(null);
    }
  }, [length, width, depthIndex, diggingOut]);

  // Calculate quote whenever quote inputs or results change
  useEffect(() => {
    if (results) {
      const dayRateNum = parseFloat(dayRate) || 0;
      const daysNum = parseFloat(daysEstimated) || 0;
      const materialsNum = parseFloat(materialsCost) || 0;

      const quote = calculateQuote({
        dayRate: dayRateNum,
        daysEstimated: daysNum,
        materialsCost: materialsNum,
      });
      setQuoteResults(quote);
    } else {
      setQuoteResults(null);
    }
  }, [results, dayRate, daysEstimated, materialsCost]);

  const handleReset = useCallback(() => {
    setLength("");
    setWidth("");
    setDepthIndex(1);
    setDiggingOut(false);
    setDayRate("250");
    setDaysEstimated("1");
    setMaterialsCost("0");
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const handleSaveQuote = useCallback(() => {
    if (!results || !quoteResults) return;

    const savedQuote: SavedQuote = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      inputs: {
        length: parseFloat(length) || 0,
        width: parseFloat(width) || 0,
        depth: DEPTH_OPTIONS[depthIndex],
        diggingOut,
      },
      results,
      quote: quoteResults,
      dayRate: parseFloat(dayRate) || 0,
      daysEstimated: parseFloat(daysEstimated) || 0,
      materialsCost: parseFloat(materialsCost) || 0,
    };

    onSaveQuote?.(savedQuote);
  }, [results, quoteResults, length, width, depthIndex, diggingOut, dayRate, daysEstimated, materialsCost, onSaveQuote]);

  const handleWhatsAppShare = useCallback(() => {
    if (!results || !quoteResults) return;

    const url = generateWhatsAppUrl({
      area: results.area,
      slabs: results.slabs600x600,
      subBase: results.subBaseTonnes,
      sand: results.sandTonnes,
      clientPrice: quoteResults.clientPrice,
    });

    window.open(url, "_blank");
  }, [results, quoteResults]);

  const handleCopyToClipboard = useCallback(async () => {
    if (!results || !quoteResults) return;

    const quoteText = `🌿 Pricer Estimate 🌿

📐 Dimensions: ${length}m × ${width}m
📏 Depth: ${DEPTH_OPTIONS[depthIndex]}cm
📐 Area: ${results.area}m²

📦 Materials Required:
• Slabs (600x600): ${results.slabs600x600} pcs
• Sub-base: ${results.subBaseTonnes} tonnes
• Sand: ${results.sandTonnes} tonnes
${results.skipsNeeded > 0 ? `• Skips needed: ${results.skipsNeeded}` : ''}

💷 Quote Summary:
• Materials: £${parseFloat(materialsCost).toFixed(2)}
• Labour (${daysEstimated} days @ £${dayRate}/day): £${quoteResults.laborCost.toFixed(2)}
• Cost to You: £${quoteResults.totalCost.toFixed(2)}
• Price to Client: £${quoteResults.clientPrice.toFixed(2)}

This quote is valid for 14 days.`;

    try {
      await navigator.clipboard.writeText(quoteText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = quoteText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [results, quoteResults, length, width, depthIndex, materialsCost, dayRate, daysEstimated]);

  return (
    <div className="space-y-6 pb-6">
      {/* Dimensions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-amber-500" />
            Dimensions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Length"
              unit="m"
              type="text"
              inputMode="decimal"
              placeholder="0.0"
              value={length}
              onChange={(e) => setLength(e.target.value)}
            />
            <Input
              label="Width"
              unit="m"
              type="text"
              inputMode="decimal"
              placeholder="0.0"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </div>

          <Slider
            label="Depth"
            unit="cm"
            value={[depthIndex]}
            onValueChange={(value) => setDepthIndex(value[0])}
            min={0}
            max={DEPTH_OPTIONS.length - 1}
            step={1}
          />
          <div className="flex justify-between text-xs text-slate-500 -mt-2 px-1">
            {DEPTH_OPTIONS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="pt-2">
            <Switch
              label="Digging Out?"
              checked={diggingOut}
              onCheckedChange={setDiggingOut}
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Card */}
      {results && (
        <Card variant="highlight">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-amber-500" />
              Calculations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <ResultItem
                icon={<Layers className="h-5 w-5" />}
                label="Area"
                value={`${results.area}m²`}
              />
              <ResultItem
                icon={<Box className="h-5 w-5" />}
                label="Volume"
                value={`${results.volume}m³`}
              />
            </div>

            <div className="border-t border-slate-700 my-4" />

            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
              Materials Required
            </h4>
            <div className="space-y-3">
              <MaterialItem
                label="Slabs (600x600)"
                value={results.slabs600x600}
                unit="pcs"
                note="Includes 10% for cuts"
              />
              <MaterialItem
                label="Sub-base (Limestone)"
                value={results.subBaseTonnes}
                unit="tonnes"
              />
              <MaterialItem
                label="Sharp Sand"
                value={results.sandTonnes}
                unit="tonnes"
              />
            </div>

            {diggingOut && results.wasteVolume > 0 && (
              <>
                <div className="border-t border-slate-700 my-4" />
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Waste Removal
                </h4>
                <div className="flex items-center gap-3 bg-red-900/30 border border-red-500/30 rounded-xl p-4">
                  <Shovel className="h-6 w-6 text-red-400" />
                  <div>
                    <p className="text-sm text-slate-300">
                      Waste Volume: <span className="font-bold text-red-400">{results.wasteVolume}m³</span>
                    </p>
                    <p className="text-lg font-bold text-slate-100">
                      6-Yard Skips Needed: <span className="text-red-400">{results.skipsNeeded}</span>
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Materials Calculator */}
      {results && (
        <MaterialsCalculator 
          results={results} 
          onTotalChange={handleMaterialsCostChange}
        />
      )}

      {/* Quote Card */}
      {results && (
        <Card variant="success">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              Quote Builder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Day Rate"
                unit="£"
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={dayRate}
                onChange={(e) => setDayRate(e.target.value)}
              />
              <Input
                label="Days"
                type="text"
                inputMode="decimal"
                placeholder="1"
                value={daysEstimated}
                onChange={(e) => setDaysEstimated(e.target.value)}
              />
            </div>

            {quoteResults && (
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center py-2 text-sm">
                  <span className="text-slate-400">Materials Cost:</span>
                  <span className="font-semibold text-slate-200">
                    £{parseFloat(materialsCost).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 text-sm">
                  <span className="text-slate-400">Labour Cost:</span>
                  <span className="font-semibold text-slate-200">
                    £{quoteResults.laborCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-slate-700">
                  <span className="text-slate-300 font-medium">Cost to You:</span>
                  <span className="text-xl font-bold text-slate-100">
                    £{quoteResults.totalCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 bg-emerald-900/50 border border-emerald-500/30 rounded-xl px-4 -mx-1">
                  <span className="text-emerald-300 font-semibold">Price to Client:</span>
                  <span className="text-2xl font-bold text-emerald-400">
                    £{quoteResults.clientPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 text-center">
                  Includes 20% markup
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {results && quoteResults && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="whatsapp"
              size="lg"
              className="w-full"
              onClick={handleWhatsAppShare}
            >
              <Send className="h-5 w-5" />
              WhatsApp
            </Button>
            <Button
              variant={copied ? "success" : "secondary"}
              size="lg"
              className="w-full"
              onClick={handleCopyToClipboard}
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  Copy Quote
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              size="default"
              onClick={handleSaveQuote}
            >
              <Save className="h-5 w-5" />
              Save Job
            </Button>
            <Button
              variant="outline"
              size="default"
              onClick={handleReset}
            >
              <RotateCcw className="h-5 w-5" />
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper components
function ResultItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-slate-700/50 rounded-xl p-3">
      <div className="text-amber-500">{icon}</div>
      <div>
        <p className="text-xs text-slate-400 uppercase">{label}</p>
        <p className="text-lg font-bold text-slate-100">{value}</p>
      </div>
    </div>
  );
}

function MaterialItem({
  label,
  value,
  unit,
  note,
}: {
  label: string;
  value: number;
  unit: string;
  note?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <span className="text-slate-300">{label}</span>
        {note && <span className="text-xs text-slate-500 block">{note}</span>}
      </div>
      <span className="text-lg font-bold text-amber-400">
        {value} <span className="text-sm font-normal text-slate-400">{unit}</span>
      </span>
    </div>
  );
}

export type { SavedQuote };
