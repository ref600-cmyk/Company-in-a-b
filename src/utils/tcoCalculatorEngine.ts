export interface TcoInputParams {
  teamSize: number;
  monthlyQueriesPerEmployee: number;
  averageTokensPerQuery: number; // e.g. 2,500 tokens (input + output)
  dataSensitivityTier: 'standard' | 'confidential' | 'defense-grade';
  edgeHardwarePreset: 'mac-mini-m4-duo' | 'mac-studio-m4-max-quad' | 'hyperscale-rack-8x';
  yearsHorizon: 3;
}

export interface TcoComparisonResult {
  cloudApiCostPerYear: number;
  cloudPrivateHostCostPerYear: number;
  skyshadowCapexInitial: number;
  skyshadowOpexPerYear: number; // electricity, maintenance
  threeYearTotals: {
    cloudApi: number;
    cloudPrivateHost: number;
    skyshadowEdge: number;
    netSavingsVsCloudApi: number;
    netSavingsVsPrivateHost: number;
  };
  paybackPeriodMonths: number;
  roiPercentage: number;
  dataBreachRiskMitigationUSD: number;
  co2ReductionKgPerYear: number;
  annualQueriesTotal: number;
  costPerQuery: {
    cloudApi: number;
    skyshadowEdge: number;
  };
}

export const HARDWARE_TCO_PROFILES = {
  'mac-mini-m4-duo': {
    name: '2x Mac Mini M4 Pro (128GB Cluster)',
    initialCapex: 4800,
    annualPowerKWh: 350,
    electricityRatePerKWh: 0.16,
    annualMaintenance: 200,
    maxAnnualQueries: 1_200_000
  },
  'mac-studio-m4-max-quad': {
    name: '4x Mac Studio M4 Max (512GB Cluster)',
    initialCapex: 16800,
    annualPowerKWh: 1050,
    electricityRatePerKWh: 0.16,
    annualMaintenance: 600,
    maxAnnualQueries: 5_000_000
  },
  'hyperscale-rack-8x': {
    name: '8x Sovereign High-UMA Edge Nodes (1.5TB Cluster)',
    initialCapex: 39600,
    annualPowerKWh: 2400,
    electricityRatePerKWh: 0.16,
    annualMaintenance: 1200,
    maxAnnualQueries: 15_000_000
  }
};

// Blended API pricing per 1M tokens (Enterprise Agentic Swarm tier: reasoning + tool loops + long context: ~$9.00/M blended)
const CLOUD_BLENDED_RATE_PER_MILLION_TOKENS = 9.0;

// Cloud private dedicated instance baseline (e.g. AWS Bedrock provisioned throughput / Azure private endpoint: ~$14,000/month for equivalent throughput)
const CLOUD_DEDICATED_HOST_ANNUAL_BASE = 168000;

export function calculateEnterpriseTco(params: TcoInputParams): TcoComparisonResult {
  const annualQueriesTotal = Math.max(1, params.teamSize * params.monthlyQueriesPerEmployee * 12);
  const totalTokensAnnual = annualQueriesTotal * params.averageTokensPerQuery;
  
  // Cloud API token costs
  const cloudApiCostPerYear = (totalTokensAnnual / 1_000_000) * CLOUD_BLENDED_RATE_PER_MILLION_TOKENS;
  
  // Dedicated Cloud Private Host scale
  const cloudPrivateHostCostPerYear = CLOUD_DEDICATED_HOST_ANNUAL_BASE + (params.teamSize > 500 ? (params.teamSize - 500) * 120 : 0);

  // Hardware profile
  const profile = HARDWARE_TCO_PROFILES[params.edgeHardwarePreset] || HARDWARE_TCO_PROFILES['mac-studio-m4-max-quad'];
  const skyshadowCapexInitial = profile.initialCapex;
  const annualElectricity = profile.annualPowerKWh * profile.electricityRatePerKWh;
  const skyshadowOpexPerYear = annualElectricity + profile.annualMaintenance;

  // 3-Year Totals
  const cloudApi3Year = cloudApiCostPerYear * 3;
  const cloudPrivateHost3Year = cloudPrivateHostCostPerYear * 3;
  const skyshadowEdge3Year = skyshadowCapexInitial + (skyshadowOpexPerYear * 3);

  const netSavingsVsCloudApi = cloudApi3Year - skyshadowEdge3Year;
  const netSavingsVsPrivateHost = cloudPrivateHost3Year - skyshadowEdge3Year;

  // Payback period in months: Initial Capex / (Monthly Cloud Spend - Monthly Edge Opex)
  const monthlyCloudCost = cloudApiCostPerYear / 12;
  const monthlyEdgeOpex = skyshadowOpexPerYear / 12;
  const netMonthlyCashSavings = Math.max(1, monthlyCloudCost - monthlyEdgeOpex);
  const paybackPeriodMonths = Math.min(36, Math.max(0.5, +(skyshadowCapexInitial / netMonthlyCashSavings).toFixed(1)));

  // ROI % over 3 years: (Net Savings / SkyShadow 3-year Cost) * 100
  const roiPercentage = Math.round((netSavingsVsCloudApi / Math.max(1, skyshadowEdge3Year)) * 100);

  // Estimated data breach liability risk reduction based on Ponemon Institute average cost of breach ($4.45M) weighted by sensitivity tier
  const riskMultiplier = params.dataSensitivityTier === 'defense-grade' ? 0.35 : params.dataSensitivityTier === 'confidential' ? 0.20 : 0.08;
  const dataBreachRiskMitigationUSD = Math.round(4_450_000 * riskMultiplier);

  // CO2 reduction (Cloud GPU hyperscaler rack ~1.2 kW continuous vs Apple Silicon cluster ~120W)
  // ~1.08 kW delta * 8760 hours * 0.385 kg CO2/kWh = ~3,640 kg CO2 saved per year
  const co2ReductionKgPerYear = Math.round(3640 * (profile.initialCapex / 16800));

  return {
    cloudApiCostPerYear: Math.round(cloudApiCostPerYear),
    cloudPrivateHostCostPerYear: Math.round(cloudPrivateHostCostPerYear),
    skyshadowCapexInitial,
    skyshadowOpexPerYear: Math.round(skyshadowOpexPerYear),
    threeYearTotals: {
      cloudApi: Math.round(cloudApi3Year),
      cloudPrivateHost: Math.round(cloudPrivateHost3Year),
      skyshadowEdge: Math.round(skyshadowEdge3Year),
      netSavingsVsCloudApi: Math.round(netSavingsVsCloudApi),
      netSavingsVsPrivateHost: Math.round(netSavingsVsPrivateHost)
    },
    paybackPeriodMonths,
    roiPercentage,
    dataBreachRiskMitigationUSD,
    co2ReductionKgPerYear,
    annualQueriesTotal,
    costPerQuery: {
      cloudApi: +(cloudApiCostPerYear / annualQueriesTotal).toFixed(4),
      skyshadowEdge: +(skyshadowOpexPerYear / annualQueriesTotal).toFixed(5)
    }
  };
}
