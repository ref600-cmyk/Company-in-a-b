import React, { useState, useMemo } from 'react';
import { BUSINESS_PLAN } from '../data/businessPlanData.ts';
import { calculate5YearForecast, calculateCustomerLtvCac, GrowthScenario } from '../utils/financialForecaster.ts';
import { 
  TrendingUp, 
  DollarSign, 
  Award, 
  Target, 
  CheckCircle2, 
  Zap, 
  Users, 
  Briefcase, 
  BarChart3, 
  Layers, 
  ShieldCheck, 
  ArrowUpRight,
  ChevronRight,
  Building2,
  Calendar
} from 'lucide-react';

export const ValuationBusinessPlanView: React.FC = () => {
  const [scenario, setScenario] = useState<GrowthScenario>('target');
  const [hardwarePrice, setHardwarePrice] = useState<number>(1899);
  const [softwareMonthly, setSoftwareMonthly] = useState<number>(149);

  const forecast = useMemo(() => {
    return calculate5YearForecast({
      scenario,
      baseHardwarePriceUSD: hardwarePrice,
      monthlySoftwareNodeUSD: softwareMonthly
    });
  }, [scenario, hardwarePrice, softwareMonthly]);

  const unitEconomics = useMemo(() => {
    return calculateCustomerLtvCac(softwareMonthly, 48, 850);
  }, [softwareMonthly]);

  const year5 = forecast[4];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Executive Rating Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 p-6 sm:p-8 shadow-2xl shadow-emerald-950/20">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>VENTURE RATING: {BUSINESS_PLAN.overallRating} / 10.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Executive Valuation & 5-Year Business Blueprint
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              <strong>{BUSINESS_PLAN.ratingTier}</strong>. By pairing Apple Silicon's hardware margin with high-retention software recurring ARR, SkyShadow creates an enterprise cash-flow flywheel capable of scaling from a single $599 office appliance to a multi-billion dollar enterprise operating system.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-right shrink-0">
            <span className="text-xs font-mono text-slate-400 uppercase">Year 5 Target Valuation</span>
            <div className="text-3xl font-black text-emerald-400">
              ${(year5.enterpriseValuationUSD / 1000000000).toFixed(2)}B
            </div>
            <span className="text-[11px] font-mono text-cyan-300">
              At ${(year5.softwareArrUSD / 1000000).toFixed(1)}M Annual Recurring Revenue
            </span>
          </div>
        </div>
      </div>

      {/* 6-Pillar Venture Scorecard */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">
            6-Pillar Venture Opportunity Scorecard
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BUSINESS_PLAN.scorecardMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-semibold text-slate-400">
                    {metric.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                    {metric.scoreOutOf10} / 10
                  </span>
                </div>
                <div className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{metric.verdict}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {metric.justification}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive 5-Year Financial Forecast Engine */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Interactive 5-Year Financial Forecast Model</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust growth assumptions and pricing to simulate hardware volume, ARR trajectory, and enterprise valuation.
            </p>
          </div>

          {/* Scenario Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Scenario:</span>
            <div className="flex rounded-lg border border-slate-800 p-0.5 bg-slate-950">
              {(['conservative', 'target', 'hyper'] as const).map((sc) => (
                <button
                  key={sc}
                  onClick={() => setScenario(sc)}
                  className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md capitalize transition-all cursor-pointer ${
                    scenario === sc
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sc}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sliders for pricing variables */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">
              Appliance Hardware Price:
            </label>
            <div className="flex items-center justify-between">
              <span className="text-base font-bold font-mono text-cyan-300">
                ${hardwarePrice.toLocaleString()}
              </span>
              <span className="text-[10px] font-mono text-slate-500">35% Gross Margin</span>
            </div>
            <input
              type="range"
              min="1299"
              max="2999"
              step="100"
              value={hardwarePrice}
              onChange={(e) => setHardwarePrice(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">
              Monthly Software Node Subscription:
            </label>
            <div className="flex items-center justify-between">
              <span className="text-base font-bold font-mono text-emerald-300">
                ${softwareMonthly}/mo
              </span>
              <span className="text-[10px] font-mono text-slate-500">92% Gross Margin</span>
            </div>
            <input
              type="range"
              min="79"
              max="299"
              step="10"
              value={softwareMonthly}
              onChange={(e) => setSoftwareMonthly(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer mt-1"
            />
          </div>

          <div>
            <span className="text-xs font-mono text-slate-400 block mb-1">
              Customer LTV / CAC Ratio:
            </span>
            <div className="text-xl font-black text-white mt-1">
              {unitEconomics.ltvCacRatio} : 1
            </div>
            <span className="text-[10px] font-mono text-emerald-400">
              Elite SaaS tier (&gt; 3.0x is standard)
            </span>
          </div>

          <div>
            <span className="text-xs font-mono text-slate-400 block mb-1">
              CAC Payback Timeline:
            </span>
            <div className="text-xl font-black text-cyan-300 mt-1">
              {unitEconomics.paybackMonths} Months
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              Rapid cash recovery window
            </span>
          </div>
        </div>

        {/* Forecast Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Year</th>
                <th className="py-3 px-3 font-semibold text-right">Appliances Shipped</th>
                <th className="py-3 px-3 font-semibold text-right">Active Mesh Nodes</th>
                <th className="py-3 px-3 font-semibold text-right">Hardware Rev</th>
                <th className="py-3 px-3 font-semibold text-right">Software ARR</th>
                <th className="py-3 px-3 font-semibold text-right">Total Revenue</th>
                <th className="py-3 px-3 font-semibold text-center">Gross Margin</th>
                <th className="py-3 px-4 font-semibold text-right">Enterprise Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {forecast.map((yr) => (
                <tr key={yr.year} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">
                    {yr.yearLabel}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300">
                    {yr.appliancesShipped.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-cyan-300 font-semibold">
                    {yr.activeSoftwareNodes.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400">
                    ${(yr.hardwareRevenueUSD / 1000000).toFixed(1)}M
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                    ${(yr.softwareArrUSD / 1000000).toFixed(1)}M
                  </td>
                  <td className="py-3 px-3 text-right text-white font-bold">
                    ${(yr.totalRevenueUSD / 1000000).toFixed(1)}M
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-200">
                      {yr.grossMarginPercent}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-cyan-400 font-extrabold">
                    {yr.enterpriseValuationUSD >= 1000000000
                      ? `$${(yr.enterpriseValuationUSD / 1000000000).toFixed(2)}B`
                      : `$${(yr.enterpriseValuationUSD / 1000000).toFixed(0)}M`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Valuation Milestones: Seed to Unicorn Exit */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">
            Venture Capital Valuation Milestones & Exit Trajectory
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BUSINESS_PLAN.valuationRounds.map((round, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                    {round.timeline}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    Raise: {round.capitalRaisedUSD}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-1">
                  {round.stage}
                </h4>
                <div className="text-2xl font-black text-emerald-400 my-2">
                  {round.valuationUSD}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  <strong>Key Milestone:</strong> {round.milestone}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                Comparable: <span className="text-slate-300">{round.comparableExit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ideal Customer Profiles (ICPs) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">
            High-Margin Ideal Customer Profiles (ICPs)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BUSINESS_PLAN.icpSegments.map((icp, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 uppercase">
                  {icp.badge}
                </span>
                <h4 className="text-sm font-bold text-white mt-2 mb-1.5">
                  {icp.title}
                </h4>
                <p className="text-xs text-red-300/90 mb-2">
                  <strong>The Crisis:</strong> {icp.painPoint}
                </p>
                <p className="text-xs text-emerald-300/90">
                  <strong>The SkyShadow Fix:</strong> {icp.whySkyShadowWins}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs font-mono text-cyan-400 font-bold">
                Contract: {icp.dealSize}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3-Phase GTM Strategy */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-cyan-400" />
          <span>3-Phase Go-To-Market Execution Plan</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {BUSINESS_PLAN.gtmPhases.map((phase, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-cyan-400 font-semibold">{phase.duration}</span>
                <span>{phase.phase.split(':')[0]}</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                {phase.title}
              </h4>
              <p className="text-xs text-slate-300">
                {phase.focus}
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
                {phase.tactics.map((t, tIdx) => (
                  <li key={tIdx} className="flex items-start gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-emerald-400 font-semibold">
                Target: {phase.targetMetrics}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
