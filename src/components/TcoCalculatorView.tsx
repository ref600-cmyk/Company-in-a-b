import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  DollarSign, 
  TrendingDown, 
  ShieldCheck, 
  Leaf, 
  Clock, 
  Download, 
  Copy, 
  Check, 
  ArrowRight,
  Server,
  Zap,
  HardDrive,
  Users,
  Layers
} from 'lucide-react';
import { 
  calculateEnterpriseTco, 
  HARDWARE_TCO_PROFILES 
} from '../utils/tcoCalculatorEngine.ts';
import type { TcoInputParams } from '../utils/tcoCalculatorEngine.ts';

interface TcoCalculatorViewProps {
  onGoToHardware?: () => void;
  onGoToDeployment?: () => void;
}

export const TcoCalculatorView: React.FC<TcoCalculatorViewProps> = ({
  onGoToHardware,
  onGoToDeployment
}) => {
  const [teamSize, setTeamSize] = useState<number>(300);
  const [monthlyQueries, setMonthlyQueries] = useState<number>(250);
  const [tokensPerQuery, setTokensPerQuery] = useState<number>(3200);
  const [sensitivityTier, setSensitivityTier] = useState<'standard' | 'confidential' | 'defense-grade'>('confidential');
  const [hardwarePreset, setHardwarePreset] = useState<'mac-mini-m4-duo' | 'mac-studio-m4-max-quad' | 'hyperscale-rack-8x'>('mac-studio-m4-max-quad');
  const [copiedMemo, setCopiedMemo] = useState(false);

  const params: TcoInputParams = useMemo(() => ({
    teamSize,
    monthlyQueriesPerEmployee: monthlyQueries,
    averageTokensPerQuery: tokensPerQuery,
    dataSensitivityTier: sensitivityTier,
    edgeHardwarePreset: hardwarePreset,
    yearsHorizon: 3
  }), [teamSize, monthlyQueries, tokensPerQuery, sensitivityTier, hardwarePreset]);

  const result = useMemo(() => calculateEnterpriseTco(params), [params]);
  const activeHardware = HARDWARE_TCO_PROFILES[hardwarePreset];

  const handleCopyMemo = () => {
    const memo = `SKYSHADOW AUTONOMOUS LOCAL-MESH OS: EXECUTIVE TCO MEMORANDUM
Generated for: ${teamSize}-person enterprise organization
Assessment Horizon: 3-Year Comprehensive Total Cost of Ownership

1. FINANCIAL HIGHLIGHTS
- 3-Year Cloud API Projected Spend: $${result.threeYearTotals.cloudApi.toLocaleString()}
- 3-Year SkyShadow Sovereign Edge Spend: $${result.threeYearTotals.skyshadowEdge.toLocaleString()}
- Net 3-Year Direct Savings: $${result.threeYearTotals.netSavingsVsCloudApi.toLocaleString()}
- Payback Period: ${result.paybackPeriodMonths} Months
- 3-Year Capital ROI: ${result.roiPercentage}%
- Cost Per Query (Edge vs Cloud): $${result.costPerQuery.skyshadowEdge} vs $${result.costPerQuery.cloudApi}

2. RISK & REGULATORY MITIGATION
- Data Sensitivity Classification: ${sensitivityTier.toUpperCase()}
- Calculated Data Breach Risk Reduction: $${(result.dataBreachRiskMitigationUSD / 1_000_000).toFixed(2)}M
- Regulatory Exposure to Public Cloud AI Sockets: 0.00% (Strict Air-Gap)

3. SUSTAINABILITY & ESG
- Annual Carbon Footprint Reduction: ${result.co2ReductionKgPerYear.toLocaleString()} kg CO2e
- Hardware Architecture: ${activeHardware.name}
- Initial Hardware Capex: $${result.skyshadowCapexInitial.toLocaleString()}`;

    navigator.clipboard.writeText(memo);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2500);
  };

  const handleDownloadMemo = () => {
    const dataBlob = new Blob([JSON.stringify({
      title: "SkyShadow Enterprise TCO Financial Analysis",
      generatedAt: new Date().toISOString(),
      inputs: params,
      results: result
    }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `skyshadow-tco-analysis-${teamSize}users.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              CFO Financial Modeling Suite
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              3-Year Enterprise Horizon
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            SkyShadow vs Cloud API TCO & ROI Engine
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl">
            Simulate realistic enterprise token consumption, multi-agent reasoning loops, hardware CAPEX, 
            and data breach risk liability reduction compared to OpenAI, Anthropic, and AWS Bedrock.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyMemo}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-900 border border-slate-700 hover:bg-slate-800 transition"
            aria-label="Copy Executive Memorandum"
          >
            {copiedMemo ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copiedMemo ? 'Copied to Clipboard' : 'Copy Executive Memo'}
          </button>
          <button
            onClick={handleDownloadMemo}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 transition"
            aria-label="Download Full TCO JSON Audit"
          >
            <Download className="w-4 h-4" />
            Export TCO Report
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Savings */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-emerald-500/30 shadow-lg shadow-emerald-500/5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">3-Year Net Savings</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            ${result.threeYearTotals.netSavingsVsCloudApi.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="text-emerald-400 font-semibold">{result.roiPercentage}%</span> 3-Year Capital ROI
          </div>
        </div>

        {/* Payback Period */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Payback Period</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {result.paybackPeriodMonths} <span className="text-sm font-normal text-slate-400">Months</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Capex amortized in under {Math.ceil(result.paybackPeriodMonths / 12)} year(s)
          </div>
        </div>

        {/* Data Breach Risk Reduction */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Breach Liability Shield</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-400">
            ${(result.dataBreachRiskMitigationUSD / 1_000_000).toFixed(2)}M
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Ponemon enterprise liability reduction
          </div>
        </div>

        {/* Sustainability Carbon Reduction */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Annual CO2e Reduction</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-teal-400">
            {result.co2ReductionKgPerYear.toLocaleString()} <span className="text-sm font-normal text-slate-400">kg</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            vs hyperscaler GPU datacenter power draw
          </div>
        </div>
      </div>

      {/* Main Grid: Left Interactive Sliders, Right Comparison Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders & Configuration Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Calculator className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Enterprise Usage Parameters</h2>
          </div>

          {/* Team Size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="team-size-slider" className="text-slate-300 font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                Enterprise Headcount:
              </label>
              <span className="font-mono text-cyan-400 font-bold">{teamSize.toLocaleString()} Employees</span>
            </div>
            <input
              id="team-size-slider"
              type="range"
              min="20"
              max="2000"
              step="10"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>20 (Pilot)</span>
              <span>500 (Mid-Market)</span>
              <span>2,000 (Global Enterprise)</span>
            </div>
          </div>

          {/* Monthly Queries */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="monthly-queries-slider" className="text-slate-300 font-medium flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Monthly Agent Queries / Employee:
              </label>
              <span className="font-mono text-cyan-400 font-bold">{monthlyQueries} Queries</span>
            </div>
            <input
              id="monthly-queries-slider"
              type="range"
              min="50"
              max="1000"
              step="25"
              value={monthlyQueries}
              onChange={(e) => setMonthlyQueries(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>50 (Casual)</span>
              <span>250 (Active Copilot)</span>
              <span>1,000 (Autonomous Swarm)</span>
            </div>
          </div>

          {/* Tokens Per Query */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="tokens-per-query-slider" className="text-slate-300 font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                Avg Tokens / Query (Context + Reasoning):
              </label>
              <span className="font-mono text-cyan-400 font-bold">{tokensPerQuery.toLocaleString()} Tokens</span>
            </div>
            <input
              id="tokens-per-query-slider"
              type="range"
              min="800"
              max="12000"
              step="200"
              value={tokensPerQuery}
              onChange={(e) => setTokensPerQuery(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>800 (Basic QA)</span>
              <span>3,200 (Multi-Turn Swarm)</span>
              <span>12,000 (Deep CoT / Code)</span>
            </div>
          </div>

          {/* Data Sensitivity Tier */}
          <div className="space-y-2">
            <label className="text-slate-300 font-medium text-sm">Data Sensitivity & Compliance Tier:</label>
            <div className="grid grid-cols-3 gap-2">
              {(['standard', 'confidential', 'defense-grade'] as const).map(tier => (
                <button
                  key={tier}
                  onClick={() => setSensitivityTier(tier)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold capitalize border transition text-center ${
                    sensitivityTier === tier
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tier.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Hardware Cluster Selection */}
          <div className="space-y-2">
            <label className="text-slate-300 font-medium text-sm flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              Sovereign Edge Cluster Specification:
            </label>
            <div className="space-y-2">
              {(Object.keys(HARDWARE_TCO_PROFILES) as (keyof typeof HARDWARE_TCO_PROFILES)[]).map(key => {
                const item = HARDWARE_TCO_PROFILES[key];
                const selected = hardwarePreset === key;
                return (
                  <div
                    key={key}
                    onClick={() => setHardwarePreset(key)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      selected
                        ? 'bg-cyan-500/10 border-cyan-500/60 shadow-md'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div>
                      <div className={`text-xs font-bold ${selected ? 'text-cyan-300' : 'text-slate-200'}`}>
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Capex: ${item.initialCapex.toLocaleString()} · Power: ~{item.annualPowerKWh} kWh/yr
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-300">
                      ${item.initialCapex.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Breakdown & Side-by-Side Comparison (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Side-by-Side 3-Year Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              3-Year Enterprise Financial Ledger Comparison
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3">Expense Category</th>
                    <th className="py-3 px-3 text-right">Cloud API (OpenAI/Anthropic)</th>
                    <th className="py-3 px-3 text-right text-cyan-400">SkyShadow Sovereign Edge</th>
                    <th className="py-3 px-3 text-right text-emerald-400">Delta Savings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
                  <tr>
                    <td className="py-3 px-3 font-sans text-slate-300">Hardware / Setup CAPEX</td>
                    <td className="py-3 px-3 text-right text-slate-400">$0</td>
                    <td className="py-3 px-3 text-right text-cyan-300">${result.skyshadowCapexInitial.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right text-rose-400">-${result.skyshadowCapexInitial.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-sans text-slate-300">Annual Token / Inference OPEX</td>
                    <td className="py-3 px-3 text-right text-slate-300">${result.cloudApiCostPerYear.toLocaleString()} / yr</td>
                    <td className="py-3 px-3 text-right text-cyan-300">${result.skyshadowOpexPerYear.toLocaleString()} / yr</td>
                    <td className="py-3 px-3 text-right text-emerald-400">+${(result.cloudApiCostPerYear - result.skyshadowOpexPerYear).toLocaleString()} / yr</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-sans text-slate-300">3-Year Cumulative Operating Total</td>
                    <td className="py-3 px-3 text-right text-slate-200 font-bold">${result.threeYearTotals.cloudApi.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right text-cyan-300 font-bold">${result.threeYearTotals.skyshadowEdge.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right text-emerald-400 font-bold text-sm">+${result.threeYearTotals.netSavingsVsCloudApi.toLocaleString()}</td>
                  </tr>
                  <tr className="bg-slate-800/30">
                    <td className="py-3 px-3 font-sans text-slate-200 font-semibold">Cost Per Executed Agent Query</td>
                    <td className="py-3 px-3 text-right text-amber-400 font-bold">${result.costPerQuery.cloudApi}</td>
                    <td className="py-3 px-3 text-right text-emerald-400 font-bold">${result.costPerQuery.skyshadowEdge}</td>
                    <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                      {Math.round((result.costPerQuery.cloudApi / Math.max(0.00001, result.costPerQuery.skyshadowEdge)))}x cheaper
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Strategic Rationale & Competitive Moat */}
          <div className="bg-gradient-to-r from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Why CFOs & Enterprise Boards Choose SkyShadow Over Cloud APIs
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-cyan-400 font-bold">1. Zero Token Metering Anxiety</span>
                <p className="text-slate-400 leading-relaxed">
                  Engineers and autonomous agents can execute millions of iterative code debugging passes, 
                  tree-of-thought explorations, and vector searches without spiking variable cloud invoices.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-bold">2. Absolute Data Gravity</span>
                <p className="text-slate-400 leading-relaxed">
                  Proprietary source code, customer PII, medical records, and legal briefs remain sealed 
                  inside Apple Silicon unified memory—eliminating data breach liabilities and cloud vendor lock-in.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-indigo-400 font-bold">3. Sub-Millisecond Ring Latency</span>
                <p className="text-slate-400 leading-relaxed">
                  Thunderbolt 4/5 mesh ring architecture transmits KV-cache tensors at 145µs latency—100x faster 
                  than internet roundtrips to AWS us-east-1 datacenter clusters.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-teal-400 font-bold">4. Predictable Asset Depreciation</span>
                <p className="text-slate-400 leading-relaxed">
                  Mac Mini and Mac Studio hardware qualifies as enterprise capital assets with standard 36-month 
                  tax depreciation schedules, transforming unpredictable cloud spend into fixed company equity.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap gap-3">
              {onGoToHardware && (
                <button
                  onClick={onGoToHardware}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                  Configure Hardware Sizing
                  <ArrowRight className="w-3 h-3 ml-1" />
                </button>
              )}
              {onGoToDeployment && (
                <button
                  onClick={onGoToDeployment}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  <Server className="w-3.5 h-3.5 text-emerald-400" />
                  View Turnkey Blueprints
                  <ArrowRight className="w-3 h-3 ml-1" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
