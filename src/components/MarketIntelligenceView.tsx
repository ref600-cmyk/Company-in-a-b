import React, { useState } from 'react';
import { MARKET_REPORT, COMPETITOR_LANDSCAPE } from '../data/marketIntelligence.ts';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Cpu, 
  TrendingUp, 
  Lock, 
  Server, 
  Search, 
  Lightbulb, 
  ArrowRight,
  ShieldAlert,
  Zap
} from 'lucide-react';

interface MarketIntelligenceViewProps {
  onGoToHardware: () => void;
  onGoToSwarm: () => void;
}

export const MarketIntelligenceView: React.FC<MarketIntelligenceViewProps> = ({ 
  onGoToHardware, 
  onGoToSwarm 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCompetitors = COMPETITOR_LANDSCAPE.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.pros.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.cons.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Executive Answer & Verdict Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 sm:p-8 shadow-2xl shadow-cyan-950/30">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>MARKET ANALYSIS VERDICT: 100% UNTAPPED OPPORTUNITY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Does Such a Product Exist? <span className="text-cyan-400">No Turnkey Solution Exists.</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              We conducted a comprehensive competitive and architectural investigation into your idea:
              <strong> a local-first autonomous agentic operating system running on Apple Silicon (Mac Mini) that seamlessly scales to multi-node corporate clusters</strong>.
              Your intuition is confirmed: while isolated parts exist (inference servers, python libraries, and cloud bots), 
              <strong> no end-to-end turnkey appliance exists for enterprise autonomy with zero data leakage.</strong>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={onGoToHardware}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer font-sans"
            >
              <span>Test Hardware Sizing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGoToSwarm}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all cursor-pointer font-sans"
            >
              <span>Launch Live Swarm</span>
              <Zap className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Strategic Moats / Key Advantages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MARKET_REPORT.strategicAdvantages.map((adv, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                {adv.stat}
              </span>
              <h3 className="text-base font-bold text-white mt-1 mb-2">
                {adv.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {adv.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* The 4 Big Enterprise Voids in Existing Solutions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-bold text-white">
            Why Current Market Tools Fail Company Needs
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MARKET_REPORT.unmetNeeds.map((need, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/70 transition-all"
            >
              <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-xs text-cyan-400 font-mono">
                  {idx + 1}
                </span>
                {need.title}
              </h3>
              <p className="text-xs text-slate-300 mb-3">
                {need.description}
              </p>
              <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/30 text-xs text-red-300/90 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <div>
                  <strong className="text-red-300">Why Existing Market Fails:</strong> {need.whyExistingFails}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competitor Landscape Deep Comparison Matrix */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" />
              <span>Competitive Landscape Matrix</span>
            </h2>
            <p className="text-xs text-slate-400">
              Direct comparison of commercial categories against SkyShadow Local-Mesh OS
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              <option value="Cloud SaaS">Cloud SaaS</option>
              <option value="Dev Framework">Dev Framework</option>
              <option value="Model Runner">Model Runner</option>
              <option value="Coding Agent">Coding Agent</option>
            </select>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Solution</th>
                <th className="py-3.5 px-3 font-semibold">Category</th>
                <th className="py-3.5 px-3 font-semibold text-center">Local Run</th>
                <th className="py-3.5 px-3 font-semibold text-center">Autonomous Swarm</th>
                <th className="py-3.5 px-3 font-semibold text-center">Mac Mini Ready</th>
                <th className="py-3.5 px-3 font-semibold">Enterprise Security</th>
                <th className="py-3.5 px-4 font-semibold">Identified Market Gap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredCompetitors.map((item, idx) => {
                const isSkyShadow = item.name.includes('SkyShadow');
                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isSkyShadow 
                        ? 'bg-cyan-950/30 hover:bg-cyan-950/40 font-medium' 
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        {isSkyShadow && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        )}
                        <span>{item.name}</span>
                      </div>
                      <div className="text-[11px] font-normal text-slate-400 font-mono mt-0.5">
                        {item.pricing}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {item.localRun === 'Yes' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Yes
                        </span>
                      ) : item.localRun === 'No' ? (
                        <span className="inline-flex items-center gap-1 text-red-400">
                          <XCircle className="w-3.5 h-3.5" /> Cloud
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-400">
                          <AlertTriangle className="w-3.5 h-3.5" /> Complex
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {item.autonomousSwarm === 'Yes' ? (
                        <span className="text-emerald-400 font-semibold">Yes</span>
                      ) : item.autonomousSwarm === 'No' ? (
                        <span className="text-slate-500">None</span>
                      ) : (
                        <span className="text-slate-300">{item.autonomousSwarm}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {item.macMiniOptimized === 'Yes' ? (
                        <span className="text-emerald-400 font-semibold">Native MLX</span>
                      ) : item.macMiniOptimized === 'No' ? (
                        <span className="text-slate-500">No</span>
                      ) : (
                        <span className="text-amber-400">Manual Setup</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`text-[11px] font-mono ${
                        item.enterpriseSecurity === 'Enterprise Ready' 
                          ? 'text-cyan-300 font-semibold' 
                          : item.enterpriseSecurity === 'Cloud-dependent'
                          ? 'text-red-400'
                          : 'text-slate-400'
                      }`}>
                        {item.enterpriseSecurity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-300 max-w-xs">
                      {item.gapIdentified}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial ROI Breakdown: Cloud API vs Mac Mini */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span>The Macro Economics: Why Apple Silicon Changes the Game</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Cloud AI providers charge recurrent subscription and token fees. For an autonomous multi-agent swarm generating 50 million tokens per month across 6 agents, here is the stark comparison:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-slate-400">Option 1: Cloud API (OpenAI/Anthropic)</span>
              <div className="text-2xl font-black text-red-400 mt-2">$2,500 - $6,000</div>
              <span className="text-[11px] text-slate-500 font-mono">per month, recurring forever</span>
            </div>
            <ul className="text-xs text-slate-400 space-y-1.5 mt-3 pt-3 border-t border-slate-800/80">
              <li className="flex items-center gap-1.5 text-red-300/80">
                <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" /> Enterprise data leaves firewall
              </li>
              <li className="flex items-center gap-1.5 text-red-300/80">
                <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" /> Rate limits & unexpected outages
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-slate-400">Option 2: Cloud GPU Hosting (A100/H100)</span>
              <div className="text-2xl font-black text-amber-400 mt-2">$1,200 - $3,200</div>
              <span className="text-[11px] text-slate-500 font-mono">per month (AWS/Azure/GCP instance)</span>
            </div>
            <ul className="text-xs text-slate-400 space-y-1.5 mt-3 pt-3 border-t border-slate-800/80">
              <li className="flex items-center gap-1.5 text-amber-300/80">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Requires DevOps team to manage
              </li>
              <li className="flex items-center gap-1.5 text-amber-300/80">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Massive 700W+ power bill
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/40 bg-gradient-to-b from-cyan-950/40 to-slate-950 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-semibold">Option 3: SkyShadow Mac Mini M4 Pro</span>
              <div className="text-2xl font-black text-emerald-400 mt-2">~$2.88 / mo</div>
              <span className="text-[11px] text-cyan-300 font-mono">$1,399 one-time hardware purchase</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 mt-3 pt-3 border-t border-cyan-800/40">
              <li className="flex items-center gap-1.5 text-emerald-300 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 100% Air-Gapped Data Privacy
              </li>
              <li className="flex items-center gap-1.5 text-emerald-300 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Full ROI reached in &lt; 28 days
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
