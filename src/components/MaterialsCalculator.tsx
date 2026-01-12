"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MATERIAL_PRICES,
  type CalculationResults 
} from "@/utils/calculations";
import { 
  Package,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Plus,
  Trash2
} from "lucide-react";

interface MaterialItem {
  id: string;
  name: string;
  quantity: string;
  unitPrice: string;
  unit: string;
}

interface MaterialsCalculatorProps {
  results: CalculationResults | null;
  onTotalChange: (total: number) => void;
}

// Default materials based on calculated results
const getDefaultMaterials = (results: CalculationResults | null): MaterialItem[] => {
  if (!results) return [];
  
  return [
    {
      id: "slabs",
      name: "Slabs (600x600)",
      quantity: results.slabs600x600.toString(),
      unitPrice: MATERIAL_PRICES.slabPer600x600.toString(),
      unit: "pcs",
    },
    {
      id: "subbase",
      name: "Sub-base (Limestone)",
      quantity: results.subBaseTonnes.toString(),
      unitPrice: MATERIAL_PRICES.subBasePerTonne.toString(),
      unit: "tonnes",
    },
    {
      id: "sand",
      name: "Sharp Sand",
      quantity: results.sandTonnes.toString(),
      unitPrice: MATERIAL_PRICES.sandPerTonne.toString(),
      unit: "tonnes",
    },
    ...(results.skipsNeeded > 0
      ? [
          {
            id: "skips",
            name: "Skip Hire (6-yard)",
            quantity: results.skipsNeeded.toString(),
            unitPrice: MATERIAL_PRICES.skipHire6Yard.toString(),
            unit: "skips",
          },
        ]
      : []),
  ];
};

// Common extra materials that can be added
const EXTRA_MATERIALS = [
  { name: "Cement (25kg bags)", unitPrice: "6.50", unit: "bags" },
  { name: "Building Sand", unitPrice: "40", unit: "tonnes" },
  { name: "Gravel/Shingle", unitPrice: "35", unit: "tonnes" },
  { name: "Edging Stones", unitPrice: "4", unit: "pcs" },
  { name: "Membrane/Weed Fabric", unitPrice: "25", unit: "rolls" },
  { name: "Pointing Compound", unitPrice: "22", unit: "tubs" },
  { name: "Kiln Dried Sand", unitPrice: "8", unit: "bags" },
  { name: "Fence Panels", unitPrice: "35", unit: "panels" },
  { name: "Fence Posts", unitPrice: "12", unit: "posts" },
  { name: "Postcrete", unitPrice: "7", unit: "bags" },
  { name: "Sleepers", unitPrice: "25", unit: "pcs" },
  { name: "Topsoil", unitPrice: "30", unit: "tonnes" },
  { name: "Bark Mulch", unitPrice: "45", unit: "m³" },
  { name: "Turf", unitPrice: "4", unit: "m²" },
  { name: "Delivery", unitPrice: "50", unit: "trips" },
];

export function MaterialsCalculator({ results, onTotalChange }: MaterialsCalculatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [includeVAT, setIncludeVAT] = useState(false);

  // Initialize materials when results change
  useEffect(() => {
    if (results) {
      setMaterials(getDefaultMaterials(results));
    }
  }, [results?.area, results?.slabs600x600, results?.subBaseTonnes, results?.sandTonnes, results?.skipsNeeded]);

  // Calculate total whenever materials change
  useEffect(() => {
    const subtotal = materials.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      return sum + qty * price;
    }, 0);
    
    const total = includeVAT ? subtotal * 1.2 : subtotal;
    onTotalChange(Number(total.toFixed(2)));
  }, [materials, includeVAT, onTotalChange]);

  const updateMaterial = useCallback((id: string, field: keyof MaterialItem, value: string) => {
    setMaterials((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }, []);

  const removeMaterial = useCallback((id: string) => {
    setMaterials((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addMaterial = useCallback((extra: typeof EXTRA_MATERIALS[0]) => {
    const newItem: MaterialItem = {
      id: `${extra.name}-${Date.now()}`,
      name: extra.name,
      quantity: "1",
      unitPrice: extra.unitPrice,
      unit: extra.unit,
    };
    setMaterials((prev) => [...prev, newItem]);
    setShowAddMenu(false);
  }, []);

  const addCustomMaterial = useCallback(() => {
    const newItem: MaterialItem = {
      id: `custom-${Date.now()}`,
      name: "Custom Item",
      quantity: "1",
      unitPrice: "0",
      unit: "pcs",
    };
    setMaterials((prev) => [...prev, newItem]);
    setShowAddMenu(false);
  }, []);

  const resetToDefaults = useCallback(() => {
    if (results) {
      setMaterials(getDefaultMaterials(results));
    }
  }, [results]);

  const subtotal = materials.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    return sum + qty * price;
  }, 0);

  const vatAmount = includeVAT ? subtotal * 0.2 : 0;
  const total = subtotal + vatAmount;

  if (!results) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-amber-500" />
            Materials Calculator
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Collapsed view - just show total */}
        {!isExpanded && (
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-400">Estimated Materials Cost:</span>
            <span className="text-xl font-bold text-amber-400">£{total.toFixed(2)}</span>
          </div>
        )}

        {/* Expanded view - full calculator */}
        {isExpanded && (
          <div className="space-y-4">
            {/* Materials list */}
            <div className="space-y-3">
              {materials.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-700/30 rounded-xl p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateMaterial(item.id, "name", e.target.value)}
                      className="bg-transparent text-slate-200 font-medium text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 rounded px-1 -ml-1 flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMaterial(item.id)}
                      className="h-7 w-7 p-0 text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Qty</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={item.quantity}
                        onChange={(e) => updateMaterial(item.id, "quantity", e.target.value)}
                        className="w-full h-10 bg-slate-800 border border-slate-600 rounded-lg px-3 text-slate-100 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">£ per {item.unit}</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={item.unitPrice}
                        onChange={(e) => updateMaterial(item.id, "unitPrice", e.target.value)}
                        className="w-full h-10 bg-slate-800 border border-slate-600 rounded-lg px-3 text-slate-100 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Subtotal</label>
                      <div className="h-10 bg-slate-800/50 border border-slate-700 rounded-lg px-3 flex items-center text-amber-400 font-semibold">
                        £{((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add material button */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>

              {showAddMenu && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 border border-slate-600 rounded-xl shadow-xl max-h-64 overflow-y-auto z-10">
                  <div className="p-2 border-b border-slate-700">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={addCustomMaterial}
                      className="w-full justify-start text-amber-400"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Custom Item
                    </Button>
                  </div>
                  <div className="p-2 space-y-1">
                    {EXTRA_MATERIALS.map((extra) => (
                      <button
                        key={extra.name}
                        onClick={() => addMaterial(extra)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-700 text-slate-300 text-sm flex justify-between items-center transition-colors"
                      >
                        <span>{extra.name}</span>
                        <span className="text-xs text-slate-500">£{extra.unitPrice}/{extra.unit}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reset button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToDefaults}
              className="w-full text-slate-400"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to calculated amounts
            </Button>

            {/* VAT toggle */}
            <div className="border-t border-slate-700 pt-3">
              <Switch
                label="Include VAT (20%)"
                checked={includeVAT}
                onCheckedChange={setIncludeVAT}
              />
            </div>

            {/* Totals */}
            <div className="bg-slate-700/50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subtotal:</span>
                <span className="text-slate-200">£{subtotal.toFixed(2)}</span>
              </div>
              {includeVAT && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">VAT (20%):</span>
                  <span className="text-slate-200">£{vatAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-slate-600">
                <span className="text-slate-200 font-semibold">Materials Total:</span>
                <span className="text-xl font-bold text-amber-400">£{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
