import React from 'react';
import { ACADEMIC_PROOFS, DEPENDENCY_MOAT_STRATEGIES } from '../data/academicResearchData.ts';
import { 
  BookOpen, 
  ShieldCheck, 
  Cpu, 
  Network, 
  Lock, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Share2,
  Atom,
  Zap,
  Globe2
} from 'lucide-react';

export const AcademicMoatView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Executive Strategic Thesis */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 p-6 sm:p-8 shadow-2xl shadow-blue-950/30">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Atom className="w-4 h-4 text-blue-400" />
            <span>ACADEMIC FOUNDATION & ECOSYSTEM DEPENDENCY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            The Sovereign AI Revolution: How to Make the World Depend on Us
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            The AI revolution is reaching an inflection point: centralized cloud LLMs are hitting severe privacy regulations (EU AI Act, GDPR, HIPAA), prohibitive network latency, and exorbitant token subscriptions.
            Academic computer science proves that <strong>autoregressive transformer decoding is bandwidth-bound, not compute-bound</strong>.
            By anchoring the corporate world onto the <strong>Sovereign AI Mesh Protocol (SAMP)</strong> running on Apple Silicon's Unified Memory, SkyShadow becomes the indispensable substrate of enterprise intelligence.
          </p>
        </div>
      </div>

      {/* 4 Pillars to Make Everyone Depend on Us */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">
              The 4 Unstoppable Moat Strategies: "The Indispensable Ingredient"
            </h2>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            Proprietary Architecture & Network Lock-in
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {DEPENDENCY_MOAT_STRATEGIES.map((strat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 uppercase font-bold">
                    Pillar {idx + 1}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    Defensibility: {strat.defensibilityScore} / 10
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {strat.pillar}
                </h3>
                <h4 className="text-xs font-semibold text-cyan-400 font-mono">
                  {strat.headline}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>The Mechanism:</strong> {strat.mechanism}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-cyan-200">
                <strong className="text-cyan-300">Why Everyone Depends On Us:</strong> {strat.howEveryoneDependsOnUs}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Papers & Mathematical Proofs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">
            Peer-Reviewed Academic Foundations & Empirical Proofs
          </h2>
        </div>

        <div className="space-y-4">
          {ACADEMIC_PROOFS.map((proof) => (
            <div
              key={proof.id}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                    {proof.domain}
                  </span>
                  <h3 className="text-sm font-bold text-white">
                    {proof.title}
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold shrink-0">
                  Moat Impact: {proof.moatRating}
                </span>
              </div>

              <div className="text-xs font-mono text-slate-400">
                Citation: <span className="text-slate-300">{proof.citation}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <strong className="text-cyan-300">Empirical Computer Science Finding:</strong> {proof.keyFinding}
              </div>

              <div className="text-xs text-emerald-300/90 font-medium">
                <strong>SkyShadow Implementation:</strong> {proof.applicabilityToSkyShadow}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The Sovereign AI Mesh Topology Architecture */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>The Irreplaceable Layer: Where SkyShadow Sits in the Enterprise Stack</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Just as VMware became the unshakeable layer for enterprise server virtualization in the 2000s, SkyShadow becomes the foundational layer connecting commodity Apple Silicon hardware to autonomous corporate agency.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-3">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-center space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Layer 4: Application</span>
            <div className="text-sm font-bold text-white">Autonomous Agent Swarm</div>
            <p className="text-[11px] text-slate-400">Finance, Code, Security, Legal, Customer Ops</p>
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/50 bg-cyan-950/30 text-center space-y-1 shadow-lg shadow-cyan-950/40">
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Layer 3: The Protocol (US)</span>
            <div className="text-sm font-bold text-cyan-300">SkyShadow Local-Mesh OS</div>
            <p className="text-[11px] text-cyan-200">Raft Consensus • Air-Gap Gate • SAMP</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-center space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Layer 2: Acceleration</span>
            <div className="text-sm font-bold text-white">Apple Metal & MLX Kernel</div>
            <p className="text-[11px] text-slate-400">273 - 800 GB/s Unified Memory Access</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-center space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Layer 1: Hardware</span>
            <div className="text-sm font-bold text-white">Mac Mini M4 / Studio</div>
            <p className="text-[11px] text-slate-400">Commodity $599 - $1,799 Silicon Appliance</p>
          </div>
        </div>
      </div>
    </div>
  );
};
