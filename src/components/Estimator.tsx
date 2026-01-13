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
  Check,
  Fence,
  X
} from "lucide-react";

// Depth options in cm (up to 1.5m)
const DEPTH_OPTIONS = [5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150];

interface SavedQuote {
  id: string;
  name: string;
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

// Fence calculation helper
function calculateFencingCost(fenceLength: string, fenceHeight: "4ft" | "5ft" | "6ft", includeGravel: boolean) {
  const len = parseFloat(fenceLength) || 0;
  if (len <= 0) return null;
  
  const panelWidth = 1.83;
  const panels = Math.ceil(len / panelWidth);
  const posts = panels + 1;
  const postcrete = posts * 2;
  const gravelBoards = includeGravel ? panels : 0;
  const postCaps = posts;
  
  const heightInfo = {
    "4ft": { postLength: "6ft", panelPrice: 25, postPrice: 10 },
    "5ft": { postLength: "7ft", panelPrice: 30, postPrice: 12 },
    "6ft": { postLength: "8ft", panelPrice: 35, postPrice: 14 },
  };
  const info = heightInfo[fenceHeight];
  
  const panelCost = panels * info.panelPrice;
  const postCost = posts * info.postPrice;
  const postcreteCost = postcrete * 7;
  const gravelCost = gravelBoards * 12;
  const capsCost = postCaps * 3;
  const totalFenceCost = panelCost + postCost + postcreteCost + gravelCost + capsCost;

  return {
    panels,
    posts,
    postcrete,
    gravelBoards,
    postCaps,
    postLength: info.postLength,
    totalCost: totalFenceCost,
  };
}

export function Estimator({ onSaveQuote }: EstimatorProps) {
  // Input state
  const [length, setLength] = useState<string>("");
  const [width, setWidth] = useState<string>("");
  const [depthIndex, setDepthIndex] = useState<number>(1); // Default to 10cm
  const [diggingOut, setDiggingOut] = useState<boolean>(false);
  
  // Fence calculator state
  const [showFencing, setShowFencing] = useState<boolean>(false);
  const [fenceLength, setFenceLength] = useState<string>("");
  const [fenceHeight, setFenceHeight] = useState<"4ft" | "5ft" | "6ft">("6ft");
  const [includeGravel, setIncludeGravel] = useState<boolean>(true);
  const [fencingCost, setFencingCost] = useState<number>(0);

  // Quote state
  const [dayRate, setDayRate] = useState<string>("250");
  const [daysEstimated, setDaysEstimated] = useState<string>("1");
  const [materialsCost, setMaterialsCost] = useState<string>("0");

  // Calculation results
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [quoteResults, setQuoteResults] = useState<QuoteResults | null>(null);
  
  // Copy to clipboard state
  const [copied, setCopied] = useState(false);
  
  // Save modal state
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [quoteName, setQuoteName] = useState("");

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

  // Update fencing cost when fence inputs change
  useEffect(() => {
    if (showFencing) {
      const fenceCalc = calculateFencingCost(fenceLength, fenceHeight, includeGravel);
      setFencingCost(fenceCalc?.totalCost || 0);
    } else {
      setFencingCost(0);
    }
  }, [showFencing, fenceLength, fenceHeight, includeGravel]);

  // Calculate quote whenever quote inputs or results change
  useEffect(() => {
    if (results) {
      const dayRateNum = parseFloat(dayRate) || 0;
      const daysNum = parseFloat(daysEstimated) || 0;
      const materialsNum = parseFloat(materialsCost) || 0;

      const quote = calculateQuote({
        dayRate: dayRateNum,
        daysEstimated: daysNum,
        materialsCost: materialsNum + fencingCost, // Include fencing in materials
      });
      setQuoteResults(quote);
    } else {
      setQuoteResults(null);
    }
  }, [results, dayRate, daysEstimated, materialsCost, fencingCost]);

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

  const openSaveModal = useCallback(() => {
    if (!results || !quoteResults) return;
    setQuoteName("");
    setShowSaveModal(true);
  }, [results, quoteResults]);

  const handleSaveQuote = useCallback(() => {
    if (!results || !quoteResults || !quoteName.trim()) return;

    const savedQuote: SavedQuote = {
      id: Date.now().toString(),
      name: quoteName.trim(),
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
    setShowSaveModal(false);
    setQuoteName("");
  }, [results, quoteResults, quoteName, length, width, depthIndex, diggingOut, dayRate, daysEstimated, materialsCost, onSaveQuote]);

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

    // Build fencing section if applicable
    const fenceCalc = showFencing ? calculateFencingCost(fenceLength, fenceHeight, includeGravel) : null;
    const fencingSection = fenceCalc ? `
🪵 Fencing (${fenceLength}m @ ${fenceHeight}):
• Panels: ${fenceCalc.panels} pcs
• Posts (${fenceCalc.postLength}): ${fenceCalc.posts} pcs
• Postcrete: ${fenceCalc.postcrete} bags
${fenceCalc.gravelBoards > 0 ? `• Gravel Boards: ${fenceCalc.gravelBoards} pcs\n` : ''}• Post Caps: ${fenceCalc.postCaps} pcs
• Fencing Total: £${fenceCalc.totalCost.toFixed(2)}
` : '';

    const quoteText = `🌿 Pricer Estimate 🌿

📐 Dimensions: ${length}m × ${width}m
📏 Depth: ${DEPTH_OPTIONS[depthIndex]}cm
📐 Area: ${results.area}m²

📦 Materials Required:
• Slabs (600x600): ${results.slabs600x600} pcs
• Sub-base: ${results.subBaseTonnes} tonnes
• Sand: ${results.sandTonnes} tonnes
${results.skipsNeeded > 0 ? `• Skips needed: ${results.skipsNeeded}` : ''}
${fencingSection}
💷 Quote Summary:
• Materials: £${parseFloat(materialsCost).toFixed(2)}${fenceCalc ? `\n• Fencing: £${fenceCalc.totalCost.toFixed(2)}` : ''}
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
  }, [results, quoteResults, length, width, depthIndex, materialsCost, dayRate, daysEstimated, showFencing, fenceLength, fenceHeight, includeGravel]);

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
          <div className="flex justify-between text-xs text-slate-500 -mt-2 px-1 overflow-x-auto">
            {DEPTH_OPTIONS.map((d, i) => (
              <span key={d} className={i === depthIndex ? "text-amber-500 font-bold" : ""}>{d >= 100 ? `${d/100}m` : d}</span>
            ))}
          </div>

          <div className="pt-2">
            <Switch
              label="Digging Out?"
              checked={diggingOut}
              onCheckedChange={setDiggingOut}
            />
          </div>
          
          <div className="pt-2 border-t border-slate-700">
            <Switch
              label="Fencing?"
              checked={showFencing}
              onCheckedChange={setShowFencing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Fencing Calculator */}
      {showFencing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fence className="h-5 w-5 text-amber-500" />
              Fence Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Fence Line Length"
              unit="m"
              type="text"
              inputMode="decimal"
              placeholder="0.0"
              value={fenceLength}
              onChange={(e) => setFenceLength(e.target.value)}
            />

            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">
                Fence Height
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["4ft", "5ft", "6ft"] as const).map((h) => (
                  <button
                    key={h}
                    onClick={() => setFenceHeight(h)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all touch-manipulation ${
                      fenceHeight === h
                        ? "bg-amber-500 text-slate-900"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <Switch
              label="Include Gravel Boards?"
              checked={includeGravel}
              onCheckedChange={setIncludeGravel}
            />

            {/* Fence Calculations */}
            {parseFloat(fenceLength) > 0 && (
              <div className="bg-slate-700/50 rounded-xl p-4 space-y-3">
                <h4 className="text-sm font-semibold text-amber-500 uppercase tracking-wide">
                  Materials Needed
                </h4>
                {(() => {
                  const len = parseFloat(fenceLength) || 0;
                  // Standard fence panel is 6ft (1.83m) wide
                  const panelWidth = 1.83;
                  const panels = Math.ceil(len / panelWidth);
                  // Posts = panels + 1 (one at each end plus between panels)
                  const posts = panels + 1;
                  // Postcrete: 1-2 bags per post (use 2 for safety)
                  const postcrete = posts * 2;
                  // Gravel boards: same as panels
                  const gravelBoards = includeGravel ? panels : 0;
                  // Post caps
                  const postCaps = posts;
                  
                  // Height-specific details
                  const heightInfo = {
                    "4ft": { postLength: "6ft", panelPrice: 25, postPrice: 10 },
                    "5ft": { postLength: "7ft", panelPrice: 30, postPrice: 12 },
                    "6ft": { postLength: "8ft", panelPrice: 35, postPrice: 14 },
                  };
                  const info = heightInfo[fenceHeight];
                  
                  const panelCost = panels * info.panelPrice;
                  const postCost = posts * info.postPrice;
                  const postcreteCost = postcrete * 7;
                  const gravelCost = gravelBoards * 12;
                  const capsCost = postCaps * 3;
                  const totalFenceCost = panelCost + postCost + postcreteCost + gravelCost + capsCost;

                  return (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Fence Panels ({fenceHeight}):</span>
                        <span className="text-slate-100 font-medium">{panels} pcs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Posts ({info.postLength}):</span>
                        <span className="text-slate-100 font-medium">{posts} pcs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Postcrete (bags):</span>
                        <span className="text-slate-100 font-medium">{postcrete} bags</span>
                      </div>
                      {includeGravel && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Gravel Boards:</span>
                          <span className="text-slate-100 font-medium">{gravelBoards} pcs</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-400">Post Caps:</span>
                        <span className="text-slate-100 font-medium">{postCaps} pcs</span>
                      </div>
                      
                      <div className="border-t border-slate-600 pt-2 mt-2 space-y-1">
                        <p className="text-xs text-slate-500 mb-2">Estimated costs:</p>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Panels @ £{info.panelPrice}:</span>
                          <span className="text-slate-400">£{panelCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Posts @ £{info.postPrice}:</span>
                          <span className="text-slate-400">£{postCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Postcrete @ £7:</span>
                          <span className="text-slate-400">£{postcreteCost.toFixed(2)}</span>
                        </div>
                        {includeGravel && (
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Gravel boards @ £12:</span>
                            <span className="text-slate-400">£{gravelCost.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Post caps @ £3:</span>
                          <span className="text-slate-400">£{capsCost.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between pt-2 border-t border-slate-600">
                        <span className="text-slate-200 font-semibold">Fencing Total:</span>
                        <span className="text-lg font-bold text-amber-400">£{totalFenceCost.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
              onClick={openSaveModal}
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

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-slate-100">Save Quote</h2>
              <button
                onClick={() => setShowSaveModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Client Name or Address
                </label>
                <Input
                  type="text"
                  placeholder="e.g. John Smith, 42 Oak Lane"
                  value={quoteName}
                  onChange={(e) => setQuoteName(e.target.value)}
                  className="text-lg"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="default"
                  className="flex-1"
                  onClick={() => setShowSaveModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="default"
                  className="flex-1"
                  onClick={handleSaveQuote}
                  disabled={!quoteName.trim()}
                >
                  <Save className="h-5 w-5" />
                  Save
                </Button>
              </div>
            </div>
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
