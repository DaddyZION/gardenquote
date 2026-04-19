// GardenQuote Calculation Utilities
// All the "Secret Sauce" formulas for landscaping estimates

export type SlabSize = "600x600" | "600x900";
export type SandCementRatio = "3:1" | "4:1" | "5:1" | "6:1";

export interface EstimatorInputs {
  length: number; // meters
  width: number; // meters
  diggingOut: boolean;
  digOutLength: number; // meters
  digOutWidth: number; // meters
  digOutDepthMm: number; // millimeters
  slabSize: SlabSize;
  motDepthMm: number; // MOT Type 1 depth in mm
  mortarDepthMm: number; // mortar bed depth in mm
  sandCementRatio: SandCementRatio;
}

export interface CalculationResults {
  area: number; // m²
  totalDepthMm: number; // total installation depth (MOT + mortar + slab)
  wasteVolume: number; // m³ (with bulking factor)
  wasteTonnes: number; // tonnes of waste
  skipsNeeded: number; // 6-yard skips
  digOutArea: number; // m² of dig out
  digOutVolume: number; // m³ raw dig out volume
  slabCount: number; // number of slabs
  slabSize: SlabSize;
  motDepthMm: number; // MOT depth used
  motType1Tonnes: number; // tonnes of MOT Type 1
  mortarDepthMm: number; // mortar bed depth used
  sandTonnes: number; // tonnes of sand (for mix)
  cementBags: number; // 25kg bags of cement
  sandCementRatio: SandCementRatio;
  // Backward compat aliases
  slabs600x600: number;
  subBaseTonnes: number;
}

/**
 * Calculate area in square meters
 */
export function calculateArea(length: number, width: number): number {
  return length * width;
}

/**
 * Slab thickness in mm (standard paving slab)
 */
export const SLAB_THICKNESS_MM = 50;

/**
 * Calculate waste volume with bulking/expansion factor
 * Uses separate dig-out dimensions (L × W × D)
 * Soil expands by ~30% when dug out
 * Soil density ~1.8 tonnes/m³
 */
export function calculateDigOut(
  diggingOut: boolean,
  digOutLength: number,
  digOutWidth: number,
  digOutDepthMm: number
): { digOutArea: number; digOutVolume: number; wasteVolume: number; wasteTonnes: number; skipsNeeded: number } {
  if (!diggingOut || digOutLength <= 0 || digOutWidth <= 0 || digOutDepthMm <= 0) {
    return { digOutArea: 0, digOutVolume: 0, wasteVolume: 0, wasteTonnes: 0, skipsNeeded: 0 };
  }
  const digOutArea = digOutLength * digOutWidth;
  const digOutVolume = digOutArea * (digOutDepthMm / 1000);
  const wasteVolume = digOutVolume * 1.3; // 30% expansion
  const wasteTonnes = Number((digOutVolume * 1.8).toFixed(2)); // soil density
  const skipsNeeded = Math.ceil(wasteVolume / 6);
  return {
    digOutArea: Number(digOutArea.toFixed(2)),
    digOutVolume: Number(digOutVolume.toFixed(3)),
    wasteVolume: Number(wasteVolume.toFixed(3)),
    wasteTonnes,
    skipsNeeded,
  };
}

/**
 * Slab coverage areas in m²
 */
const SLAB_AREAS: Record<SlabSize, number> = {
  "600x600": 0.36, // 0.6 x 0.6
  "600x900": 0.54, // 0.6 x 0.9
};

/**
 * Calculate number of slabs needed for the given slab size
 * Includes 10% extra for cuts and breakage
 */
export function calculateSlabs(area: number, slabSize: SlabSize = "600x600"): number {
  const slabArea = SLAB_AREAS[slabSize];
  const wasteMultiplier = 1.1; // 10% extra
  return Math.ceil((area / slabArea) * wasteMultiplier);
}

/**
 * Calculate MOT Type 1 sub-base required in tonnes
 * MOT Type 1 density ~2.1 tonnes per m³
 * User specifies the actual MOT depth they want to lay
 */
export function calculateMOT(area: number, motDepthMm: number): number {
  if (motDepthMm <= 0) return 0;
  const motVolume = area * (motDepthMm / 1000);
  const motDensity = 2.1;
  return Number((motVolume * motDensity).toFixed(2));
}

/**
 * Calculate sand and cement quantities for mortar bed
 * User specifies the mortar bed depth
 * Sand density ~1.6 tonnes/m³, cement density ~1.5 tonnes/m³
 */
export function calculateSandCement(
  area: number,
  ratio: SandCementRatio,
  mortarDepthMm: number
): { sandTonnes: number; cementBags: number } {
  if (mortarDepthMm <= 0) return { sandTonnes: 0, cementBags: 0 };
  const bedVolume = area * (mortarDepthMm / 1000); // m³

  const ratioParts = parseInt(ratio.split(":")[0]); // e.g. 4 from "4:1"
  const totalParts = ratioParts + 1;

  const sandVolume = bedVolume * (ratioParts / totalParts);
  const cementVolume = bedVolume * (1 / totalParts);

  const sandTonnes = Number((sandVolume * 1.6).toFixed(2));
  const cementKg = cementVolume * 1500;
  const cementBags = Math.ceil(cementKg / 25); // 25kg bags

  return { sandTonnes, cementBags };
}

/**
 * Main calculation function - runs all formulas
 */
export function calculateAll(inputs: EstimatorInputs): CalculationResults {
  const area = calculateArea(inputs.length, inputs.width);
  const digOut = calculateDigOut(
    inputs.diggingOut,
    inputs.digOutLength,
    inputs.digOutWidth,
    inputs.digOutDepthMm
  );
  const slabCount = calculateSlabs(area, inputs.slabSize);
  const motType1Tonnes = calculateMOT(area, inputs.motDepthMm);
  const { sandTonnes, cementBags } = calculateSandCement(area, inputs.sandCementRatio, inputs.mortarDepthMm);
  const totalDepthMm = inputs.motDepthMm + inputs.mortarDepthMm + SLAB_THICKNESS_MM;

  return {
    area: Number(area.toFixed(2)),
    totalDepthMm,
    wasteVolume: digOut.wasteVolume,
    wasteTonnes: digOut.wasteTonnes,
    skipsNeeded: digOut.skipsNeeded,
    digOutArea: digOut.digOutArea,
    digOutVolume: digOut.digOutVolume,
    slabCount,
    slabSize: inputs.slabSize,
    motDepthMm: inputs.motDepthMm,
    motType1Tonnes,
    mortarDepthMm: inputs.mortarDepthMm,
    sandTonnes,
    cementBags,
    sandCementRatio: inputs.sandCementRatio,
    // Backward compat
    slabs600x600: slabCount,
    subBaseTonnes: motType1Tonnes,
  };
}

/**
 * Typical UK material prices (adjustable)
 */
export const MATERIAL_PRICES = {
  slabPer600x600: 3.50, // £ per slab
  slabPer600x900: 5.50, // £ per slab
  motType1PerTonne: 28, // £ per tonne of MOT Type 1
  sandPerTonne: 45, // £ per tonne of sharp sand
  cementPerBag: 6.50, // £ per 25kg bag
  skipHire6Yard: 250, // £ per 6-yard skip
  // Legacy aliases
  subBasePerTonne: 28,
};

/**
 * Estimate materials cost based on calculated quantities
 */
export function estimateMaterialsCost(results: CalculationResults): number {
  const slabPrice = results.slabSize === "600x900" ? MATERIAL_PRICES.slabPer600x900 : MATERIAL_PRICES.slabPer600x600;
  const slabsCost = results.slabCount * slabPrice;
  const motCost = results.motType1Tonnes * MATERIAL_PRICES.motType1PerTonne;
  const sandCost = results.sandTonnes * MATERIAL_PRICES.sandPerTonne;
  const cementCost = results.cementBags * MATERIAL_PRICES.cementPerBag;
  const skipCost = results.skipsNeeded * MATERIAL_PRICES.skipHire6Yard;

  return Number((slabsCost + motCost + sandCost + cementCost + skipCost).toFixed(2));
}

/**
 * Quote calculation helpers
 */
export interface QuoteInputs {
  dayRate: number;
  daysEstimated: number;
  materialsCost: number;
}

export interface QuoteResults {
  laborCost: number;
  totalCost: number; // Cost to you (materials + labor)
  clientPrice: number; // Price to client (cost + 20% markup)
}

export function calculateQuote(inputs: QuoteInputs): QuoteResults {
  const laborCost = inputs.dayRate * inputs.daysEstimated;
  const totalCost = inputs.materialsCost + laborCost;
  const clientPrice = totalCost * 1.2; // 20% markup

  return {
    laborCost: Number(laborCost.toFixed(2)),
    totalCost: Number(totalCost.toFixed(2)),
    clientPrice: Number(clientPrice.toFixed(2)),
  };
}

/**
 * Generate WhatsApp share URL
 */
export function generateWhatsAppUrl(quote: {
  area: number;
  slabs: number;
  slabSize: string;
  motType1: number;
  sand: number;
  cementBags: number;
  sandCementRatio: string;
  clientPrice: number;
}): string {
  const message = `⚡ InstaQuote Estimate ⚡

📐 Area: ${quote.area}m²

📦 Materials Required:
• Slabs (${quote.slabSize}): ${quote.slabs} pcs
• MOT Type 1: ${quote.motType1} tonnes
• Sand (${quote.sandCementRatio} mix): ${quote.sand} tonnes
• Cement: ${quote.cementBags} × 25kg bags

💰 Total Price: £${quote.clientPrice.toFixed(2)}

This quote is valid for 14 days.
Thank you for choosing us!`;

  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
