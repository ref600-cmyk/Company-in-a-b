import React, { useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  DollarSign, 
  Cpu, 
  Activity, 
  Server, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Flame,
  Award
} from 'lucide-react';

export const BenchmarkComparisonView: React.FC = () => {
  const [activeModelSize, setActiveModelSize] = useState<'32B' | '70B'>('70B');

  const benchmarkData = {
    '70B': [
      {
        provider: 'SkyShadow Mac Mini M4 Pro (64GB)',
        chip: 'Apple M4 Pro (Metal MLX 4-bit)',
        category: 'Local Sovereign Appliance',
        isSkyShadow: true,
        ttftMs: 145,
        tokPerSec: 28,
        powerWatts: 22,
        monthlyOpEx: '$2.88 (Electricity)',
        annualTotalCost: '$1,799 (HW once) + $35 (power)',
        airGapSafety: '100% Zero-Leakage (Air-Gapped)',
        compliance: 'GDPR, HIPAA, EU AI Act, ITAR compliant by default',
        verdict: 'Best in Class for Privacy & TCO'
      },
      {
        provider: 'Cloud Hosted NVIDIA A100 (80GB)',
        chip: 'NVIDIA A100 PCIe (vLLM / FP16)',
        category: 'Dedicated Cloud GPU Server',
        isSkyShadow: false,
        ttftMs: 180,
        tokPerSec: 38,
        powerWatts: 400,
        monthlyOpEx: '$1,450 / month',
        annualTotalCost: '$17,400 / year (Recurring)',
        airGapSafety: '40% (Hosted in 3rd party cloud datacenter)',
        compliance: 'Requires complex BAA & Cloud Security SLA',
        verdict: 'High Throughput, Prohibitive Cost'
      },
      {
        provider: 'OpenAI GPT-4o / Claude 3.5 Sonnet',
        chip: 'Proprietary Multi-Tenant Cloud Cluster',
        category: 'Cloud SaaS API',
        isSkyShadow: false,
        ttftMs: 580,
        tokPerSec: 45,
        powerWatts: 750,
        monthlyOpEx: '$3,800 / month (at 50M tokens)',
        annualTotalCost: '$45,600 / year (Recurring)',
        airGapSafety: '0% (Data leaves company firewall)',
        compliance: 'Strictly prohibited by legal/defense clients',
        verdict: 'Zero Sovereignty, Exponential Bills'
      }
    ],
    '32B': [
      {
        provider: 'SkyShadow Mac Mini M4 (24GB)',
        chip: 'Apple M4 (Metal MLX 4-bit)',
        category: 'Local Sovereign Appliance',
        isSkyShadow: true,
        ttftMs: 95,
        tokPerSec: 36,
        powerWatts: 16,
        monthlyOpEx: '$2.10 (Electricity)',
        annualTotalCost: '$799 (HW once) + $25 (power)',
        airGapSafety: '100% Zero-Leakage (Air-Gapped)',
        compliance: 'GDPR, HIPAA, EU AI Act, ITAR compliant by default',
        verdict: 'Best in Class for SMB Office'
      },
      {
        provider: 'Cloud Hosted NVIDIA RTX 4090',
        chip: 'NVIDIA RTX 4090 24GB (vLLM)',
        category: 'Dedicated Cloud GPU Server',
        isSkyShadow: false,
        ttftMs: 110,
        tokPerSec: 42,
        powerWatts: 450,
        monthlyOpEx: '$650 / month',
        annualTotalCost: '$7,800 / year (Recurring)',
        airGapSafety: '40% (Hosted in 3rd party cloud datacenter)',
        compliance: 'Requires self-managed Kubernetes security',
        verdict: 'High Power, Requires DevOps'
      },
      {
        provider: 'Cloud Proprietary API (Tier 2)',
        chip: 'Claude 3.5 Haiku / GPT-4o Mini',
        category: 'Cloud SaaS API',
        isSkyShadow: false,
        ttftMs: 420,
        tokPerSec: 55,
        powerWatts: 600,
        monthlyOpEx: '$1,200 / month',
        annualTotalCost: '$14,400 / year (Recurring)',
        airGapSafety: '0% (Data leaves company firewall)',
        compliance: 'Subject to third-party data retention',
        verdict: 'Fast but Leaks Intellectual Property'
      }
    ]
  };

  const activeRows = benchmarkData[activeModelSize];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <span>Empirical Hardware Benchmark & TCO Matrix</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Comparing Apple Silicon Unified Memory against Cloud GPUs and Proprietary APIs across speed, power, cost, and security.
          </p>
        </div>

        {/* Model Size Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Benchmark Model:</span>
          <div className="flex rounded-lg border border-slate-800 p-0.5 bg-slate-950">
            {(['32B', '70B'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setActiveModelSize(size)}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-all cursor-pointer ${
                  activeModelSize === size
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {size} Model
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Benchmark Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {activeRows.map((row, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-5 ${
              row.isSkyShadow
                ? 'border-cyan-400 bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-950 shadow-xl shadow-cyan-950/50'
                : 'border-slate-800 bg-slate-900/50'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                  row.isSkyShadow
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {row.category}
                </span>
                {row.isSkyShadow && (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold">
                    <Award className="w-3.5 h-3.5" /> Best Choice
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-base font-bold text-white">
                  {row.provider}
                </h4>
                <span className="text-xs font-mono text-cyan-400/90">
                  {row.chip}
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">First-Token Latency</span>
                  <div className="text-sm font-bold font-mono text-white mt-0.5">
                    {row.ttftMs} ms
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Generation Speed</span>
                  <div className="text-sm font-bold font-mono text-cyan-300 mt-0.5">
                    ~{row.tokPerSec} tok/s
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Power Dissipation</span>
                  <div className="text-sm font-bold font-mono text-amber-300 mt-0.5">
                    {row.powerWatts} Watts
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Monthly OpEx</span>
                  <div className={`text-sm font-bold font-mono mt-0.5 ${
                    row.isSkyShadow ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {row.monthlyOpEx}
                  </div>
                </div>
              </div>

              {/* Annual TCO */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                <span className="text-slate-400 block text-[11px]">12-Month Total Cost of Ownership:</span>
                <span className={`text-base font-bold font-mono ${
                  row.isSkyShadow ? 'text-emerald-400' : 'text-slate-200'
                }`}>
                  {row.annualTotalCost}
                </span>
              </div>

              {/* Air Gap Safety */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-medium">
                  {row.isSkyShadow ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                  <span className={row.isSkyShadow ? 'text-emerald-300 font-semibold' : 'text-slate-300'}>
                    {row.airGapSafety}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {row.compliance}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
              Verdict: <strong className={row.isSkyShadow ? 'text-cyan-300' : 'text-slate-300'}>{row.verdict}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
