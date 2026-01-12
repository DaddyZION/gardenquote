// GardenQuote Calculation Utilities
// All the "Secret Sauce" formulas for landscaping estimates

export interface EstimatorInputs {
  length: number; // meters
  width: number; // meters
  depth: number; // millimeters
  diggingOut: boolean;
}

export interface CalculationResults {
  area: number; // m²
  volume: number; // m³
  wasteVolume: number; // m³ (with bulking factor)
  skipsNeeded: number; // 6-yard skips
  slabs600x600: number; // number of slabs
  subBaseTonnes: number; // tonnes of limestone
  sandTonnes: number; // tonnes of sand
}

/**
 * Calculate area in square meters
 */
export function calculateArea(length: number, width: number): number {
  return length * width;
}

/**
 * Calculate volume in cubic meters
 * Converts depth from mm to m
 */
export function calculateVolume(area: number, depthMm: number): number {
  return area * (depthMm / 1000);
}

/**
 * Calculate waste volume with bulking/expansion factor
 * Soil expands by ~30% when dug out
 */
export function calculateWasteVolume(volume: number, diggingOut: boolean): number {
  if (!diggingOut) return 0;
  return volume * 1.3; // 30% expansion factor
}

/**
 * Calculate number of 6-yard skips needed
 */
export function calculateSkipsNeeded(wasteVolume: number): number {
  if (wasteVolume === 0) return 0;
  return Math.ceil(wasteVolume / 6);
}

/**
 * Calculate number of 600x600mm slabs needed
 * Each slab covers 0.36m² (0.6 x 0.6)
 * Includes 10% extra for cuts and breakage
 */
export function calculateSlabs(area: number): number {
  const slabArea = 0.36; // m²
  const wasteMultiplier = 1.1; // 10% extra
  return Math.ceil((area / slabArea) * wasteMultiplier);
}

/**
 * Calculate sub-base required in tonnes
 * Limestone density ~2.2 tonnes per m³
 */
export function calculateSubBase(volume: number): number {
  const limestoneDensity = 2.2;
  return Number((volume * limestoneDensity).toFixed(2));
}

/**
 * Calculate sand required in tonnes
 * Sharp sand density ~1.7 tonnes per m³
 */
export function calculateSand(volume: number): number {
  const sandDensity = 1.7;
  return Number((volume * sandDensity).toFixed(2));
}

/**
 * Main calculation function - runs all formulas
 */
export function calculateAll(inputs: EstimatorInputs): CalculationResults {
  const area = calculateArea(inputs.length, inputs.width);
  const volume = calculateVolume(area, inputs.depth);
  const wasteVolume = calculateWasteVolume(volume, inputs.diggingOut);
  const skipsNeeded = calculateSkipsNeeded(wasteVolume);
  const slabs600x600 = calculateSlabs(area);
  const subBaseTonnes = calculateSubBase(volume);
  const sandTonnes = calculateSand(volume);

  return {
    area: Number(area.toFixed(2)),
    volume: Number(volume.toFixed(3)),
    wasteVolume: Number(wasteVolume.toFixed(3)),
    skipsNeeded,
    slabs600x600,
    subBaseTonnes,
    sandTonnes,
  };
}

/**
 * Typical UK material prices (adjustable)
 */
export const MATERIAL_PRICES = {
  slabPer600x600: 3.50, // £ per slab
  subBasePerTonne: 30, // £ per tonne of limestone
  sandPerTonne: 45, // £ per tonne of sharp sand
  skipHire6Yard: 250, // £ per 6-yard skip
};

/**
 * Estimate materials cost based on calculated quantities
 */
export function estimateMaterialsCost(results: CalculationResults): number {
  const slabsCost = results.slabs600x600 * MATERIAL_PRICES.slabPer600x600;
  const subBaseCost = results.subBaseTonnes * MATERIAL_PRICES.subBasePerTonne;
  const sandCost = results.sandTonnes * MATERIAL_PRICES.sandPerTonne;
  const skipCost = results.skipsNeeded * MATERIAL_PRICES.skipHire6Yard;

  return Number((slabsCost + subBaseCost + sandCost + skipCost).toFixed(2));
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
  subBase: number;
  sand: number;
  clientPrice: number;
}): string {
  const message = `🌿 GardenQuote Estimate 🌿

📐 Area: ${quote.area}m²

📦 Materials Required:
• Slabs (600x600): ${quote.slabs} pcs
• Sub-base: ${quote.subBase} tonnes
• Sand: ${quote.sand} tonnes

💰 Total Price: £${quote.clientPrice.toFixed(2)}

This quote is valid for 14 days.
Thank you for choosing us!`;

  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
