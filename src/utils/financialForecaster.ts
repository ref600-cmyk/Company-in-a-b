import type { FinancialYearProjection } from '../types/index.ts';

export type GrowthScenario = 'conservative' | 'target' | 'hyper';

export interface ForecasterParams {
  scenario: GrowthScenario;
  baseHardwarePriceUSD?: number;
  monthlySoftwareNodeUSD?: number;
  annualChurnRate?: number;
}

export function calculate5YearForecast(params: ForecasterParams): FinancialYearProjection[] {
  const { scenario, baseHardwarePriceUSD = 1899, monthlySoftwareNodeUSD = 149, annualChurnRate = 0.06 } = params;

  // Scenario multipliers
  const scale = scenario === 'hyper' ? 2.2 : scenario === 'conservative' ? 0.6 : 1.0;

  // Yearly unit shipments trajectory
  const baseUnits = [
    Math.round(250 * scale),
    Math.round(1200 * scale),
    Math.round(4500 * scale),
    Math.round(14000 * scale),
    Math.round(38000 * scale),
  ];

  const results: FinancialYearProjection[] = [];
  let cumulativeActiveNodes = 0;

  for (let i = 0; i < 5; i++) {
    const year = i + 1;
    const yearLabel = `Year ${year} (${2025 + year})`;
    const shippedThisYear = baseUnits[i];

    // Cumulative active nodes accounting for low enterprise churn
    cumulativeActiveNodes = Math.round((cumulativeActiveNodes * (1 - annualChurnRate)) + (shippedThisYear * 1.8)); // avg 1.8 nodes per customer setup

    // Hardware revenue ($1,899 turnkey appliance with ~35% hardware gross margin)
    const hardwareRevenueUSD = shippedThisYear * baseHardwarePriceUSD;

    // Software ARR ($149/mo blended node subscription = $1,788/yr per node, 92% gross margin)
    const annualSoftwarePerNode = monthlySoftwareNodeUSD * 12;
    const softwareArrUSD = Math.round(cumulativeActiveNodes * annualSoftwarePerNode);

    const totalRevenueUSD = hardwareRevenueUSD + softwareArrUSD;

    // Blended gross margin: hardware is ~35%, software is ~92%
    const hardwareGrossProfit = hardwareRevenueUSD * 0.35;
    const softwareGrossProfit = softwareArrUSD * 0.92;
    const totalGrossProfit = hardwareGrossProfit + softwareGrossProfit;
    const grossMarginPercent = Math.round((totalGrossProfit / totalRevenueUSD) * 100);

    // Net margin ramps as fixed R&D scales
    const netMarginPercent = year === 1 ? -18 : year === 2 ? 8 : year === 3 ? 24 : year === 4 ? 32 : 36;
    const cashFlowUSD = Math.round(totalRevenueUSD * (netMarginPercent / 100));

    // Headcount scaling
    const headcount = Math.round(12 + (year * year * 6 * scale));

    // Enterprise Valuation:
    // Blended multiple: Software ARR valued at 18x-25x (high-retention deep tech enterprise software) + Hardware at 2x
    const arrMultiple = year <= 2 ? 22 : year <= 4 ? 18 : 15;
    const enterpriseValuationUSD = Math.round((softwareArrUSD * arrMultiple) + (hardwareRevenueUSD * 2.5));

    results.push({
      year,
      yearLabel,
      appliancesShipped: shippedThisYear,
      activeSoftwareNodes: cumulativeActiveNodes,
      hardwareRevenueUSD,
      softwareArrUSD,
      totalRevenueUSD,
      grossMarginPercent,
      netMarginPercent,
      headcount,
      cashFlowUSD,
      enterpriseValuationUSD
    });
  }

  return results;
}

export function calculateCustomerLtvCac(monthlyNodeUSD: number = 149, avgLifespanMonths: number = 48, blendedCacUSD: number = 850) {
  const grossMargin = 0.90;
  const ltv = Math.round(monthlyNodeUSD * avgLifespanMonths * grossMargin);
  const ratio = Math.round((ltv / blendedCacUSD) * 10) / 10;
  const paybackMonths = Math.round((blendedCacUSD / (monthlyNodeUSD * grossMargin)) * 10) / 10;

  return {
    ltv,
    cac: blendedCacUSD,
    ltvCacRatio: ratio,
    paybackMonths
  };
}
