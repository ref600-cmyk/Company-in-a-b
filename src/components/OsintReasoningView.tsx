import React, { useState, useId } from 'react';
import { 
  Eye, 
  Search, 
  ShieldAlert, 
  Cpu, 
  Terminal, 
  Layers, 
  Lock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Copy, 
  Sparkles, 
  RefreshCw, 
  Database, 
  Key, 
  Globe, 
  Activity,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Zap,
  HardDrive
} from 'lucide-react';
import { 
  synthesizeOsintProfile, 
  calculateReasoningMemoryOverhead, 
  generateInvestigationMarkdownReport 
} from '../utils/osintReasoningEngine.ts';
import type { OsintInvestigationReport, OsintEntity } from '../types/index.ts';

const PRESET_TARGETS = [
  { domain: 'defense-contractor.internal', label: 'Defense Contractor (Air-Gapped)', level: 'Critical Risk' },
  { domain: 'fintech-sovereign.uk', label: 'Tier-1 FinTech UK (London DC)', level: 'Medium Risk' },
  { domain: 'healthcare-genomics.local', label: 'Genomics Bio-Enclave (HIPAA)', level: 'Guarded' },
  { domain: 'skyshadow.co.uk', label: 'SkyShadow Sovereign Root (Self)', level: 'Hardened' }
];

export const OsintReasoningView: React.FC = () => {
  const [targetInput, setTargetInput] = useState('defense-contractor.internal');
  const [activeReport, setActiveReport] = useState<OsintInvestigationReport>(() => 
    synthesizeOsintProfile('defense-contractor.internal')
  );
  const [modelTier, setModelTier] = useState<'32B' | '70B' | '14B'>('32B');
  const [thinkingTokens, setThinkingTokens] = useState<number>(8192);
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedEntityType, setSelectedEntityType] = useState<string>('all');
  const [expandedThoughtSteps, setExpandedThoughtSteps] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true
  });

  const memoryStats = calculateReasoningMemoryOverhead(thinkingTokens, modelTier);
  const searchInputId = useId();
  const tokenSliderId = useId();

  const handleRunInvestigation = (targetToRun?: string) => {
    const domain = targetToRun || targetInput;
    setIsInvestigating(true);
    setTimeout(() => {
      const report = synthesizeOsintProfile(domain);
      setActiveReport(report);
      setIsInvestigating(false);
    }, 600);
  };

  const toggleStep = (stepNumber: number) => {
    setExpandedThoughtSteps(prev => ({
      ...prev,
      [stepNumber]: !prev[stepNumber]
    }));
  };

  const handleCopyReport = () => {
    const md = generateInvestigationMarkdownReport(activeReport);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    const md = generateInvestigationMarkdownReport(activeReport);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkyShadow-OSINT-Report-${activeReport.target}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredEntities = selectedEntityType === 'all' 
    ? activeReport.entities 
    : activeReport.entities.filter(e => e.type === selectedEntityType);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-6 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/60 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" /> Sovereign OSINT & Extreme Reasoning
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Zero WAN Exfiltration
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              Deep Chain-of-Thought Intelligence & Reconnaissance
            </h1>
            <p className="text-slate-400 text-sm max-w-3xl mt-1.5">
              Air-gapped passive reconnaissance and multi-phase hypothesis cross-examination running strictly on Apple Silicon Unified Memory Architecture (UMA). Replaces cloud OSINT SaaS with zero data leakage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyReport}
              className="px-3.5 py-2 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-2"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Dossier' : 'Copy Report MD'}
            </button>
            <button
              onClick={handleDownloadReport}
              className="px-3.5 py-2 rounded-lg text-xs font-mono bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow-lg shadow-cyan-600/20 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Markdown
            </button>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider mr-2">Target Presets:</span>
          {PRESET_TARGETS.map(preset => (
            <button
              key={preset.domain}
              onClick={() => {
                setTargetInput(preset.domain);
                handleRunInvestigation(preset.domain);
              }}
              className={`px-3 py-1.5 rounded-md font-mono text-xs border transition-all ${
                targetInput === preset.domain 
                  ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-sm shadow-cyan-500/20' 
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span className="text-white font-semibold">{preset.domain}</span>
              <span className="text-slate-500 ml-1.5">({preset.level})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Target Search & Reasoning Engine Configuration Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Search & Execute */}
        <div className="lg:col-span-7 border border-slate-800 bg-slate-900/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor={searchInputId} className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Search className="w-4 h-4 text-cyan-400" /> Passive Reconnaissance Target
            </label>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Queried via In-Memory Bloom Filter
            </span>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                id={searchInputId}
                type="text"
                value={targetInput}
                onChange={e => setTargetInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRunInvestigation()}
                placeholder="domain.internal, 198.51.100.0/24, or entity name..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <button
              onClick={() => handleRunInvestigation()}
              disabled={isInvestigating}
              className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium text-xs font-mono shadow-md shadow-cyan-600/20 transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isInvestigating ? 'animate-spin' : ''}`} />
              {isInvestigating ? 'Synthesizing...' : 'Execute CoT'}
            </button>
          </div>

          {/* Model Tier Selector */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono">Extreme Model:</span>
              <div className="inline-flex rounded-lg border border-slate-800 p-0.5 bg-slate-950">
                {(['14B', '32B', '70B'] as const).map(tier => (
                  <button
                    key={tier}
                    onClick={() => setModelTier(tier)}
                    className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                      modelTier === tier 
                        ? 'bg-cyan-600 text-white font-bold' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tier} MLX
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor={tokenSliderId} className="text-slate-400 font-mono">Thinking Budget:</label>
              <input
                id={tokenSliderId}
                type="range"
                min="2048"
                max="32768"
                step="2048"
                value={thinkingTokens}
                onChange={e => setThinkingTokens(Number(e.target.value))}
                className="w-28 accent-cyan-500 cursor-pointer"
              />
              <span className="font-mono text-cyan-300 font-bold">{thinkingTokens.toLocaleString()} tok</span>
            </div>
          </div>
        </div>

        {/* Right: Unified Memory Architecture Telemetry */}
        <div className="lg:col-span-5 border border-slate-800 bg-slate-900/50 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" /> Apple Silicon UMA Sizing Telemetry
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                Metal 3 Engine
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center mb-3">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="block text-[10px] font-mono text-slate-500 uppercase">Model Weight</span>
                <span className="text-base font-mono font-bold text-slate-100">{memoryStats.weightGb} GB</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="block text-[10px] font-mono text-slate-500 uppercase">KV Cache ({thinkingTokens / 1024}K)</span>
                <span className="text-base font-mono font-bold text-cyan-400">+{memoryStats.kvCacheGb} GB</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="block text-[10px] font-mono text-slate-500 uppercase">Total UMA RAM</span>
                <span className="text-base font-mono font-bold text-emerald-400">{memoryStats.totalRamGb} GB</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Speed: {memoryStats.tokensPerSec} tok/s
            </span>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded border ${
                memoryStats.supportedOnMacMini 
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800' 
                  : 'bg-slate-900 text-slate-600 border-slate-800'
              }`}>
                Mac Mini 24G
              </span>
              <span className={`px-2 py-0.5 rounded border ${
                memoryStats.supportedOnMacStudio 
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800' 
                  : 'bg-slate-900 text-slate-600 border-slate-800'
              }`}>
                Mac Studio 64G
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Investigation Dossier Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase mb-1">
            <span>Overall Threat Score</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-mono font-bold ${
              activeReport.overallThreatScore > 65 ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {activeReport.overallThreatScore}
            </span>
            <span className="text-slate-500 font-mono text-sm">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            {activeReport.overallThreatScore > 65 ? 'Elevated external attack surface' : 'Hardened perimeter posture'}
          </p>
        </div>

        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase mb-1">
            <span>Discovered OSINT Entities</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-white">
              {activeReport.entities.length}
            </span>
            <span className="text-slate-500 font-mono text-sm">sovereign nodes</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Passive DNS, BGP, TLS & Breached hashes
          </p>
        </div>

        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase mb-1">
            <span>CoT Reasoning Depth</span>
            <Terminal className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-blue-400">
              {activeReport.reasoningTrace.length}
            </span>
            <span className="text-slate-500 font-mono text-sm">phases completed</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            {activeReport.localInferenceStats.thinkingBudgetTokens.toLocaleString()} thinking tokens expanded
          </p>
        </div>

        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase mb-1">
            <span>Forensic Attestation</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-mono font-bold text-emerald-300 truncate">
              {activeReport.investigationId}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Secure Enclave hardware attested
          </p>
        </div>
      </div>

      {/* Extreme Chain-of-Thought Reasoning Trace (DeepSeek-R1 / Qwen-2.5 Extreme Mode) */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-950 text-blue-300 border border-blue-800/60 uppercase">
                5-Phase Extreme Reasoning Protocol
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Hardware Model: {activeReport.localInferenceStats.model}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" /> Autonomous Forensic Reasoning Chain
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setExpandedThoughtSteps({ 1: true, 2: true, 3: true, 4: true, 5: true })}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={() => setExpandedThoughtSteps({})}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              Collapse
            </button>
          </div>
        </div>

        {/* Reasoning Steps */}
        <div className="space-y-4">
          {activeReport.reasoningTrace.map(step => {
            const isExpanded = Boolean(expandedThoughtSteps[step.stepNumber]);
            const phaseLabels: Record<string, { label: string; color: string }> = {
              hypothesis: { label: 'Phase 1: Hypothesis Formulation', color: 'border-amber-500/60 text-amber-300 bg-amber-950/40' },
              cross_examination: { label: 'Phase 2: Adversarial Cross-Examination', color: 'border-cyan-500/60 text-cyan-300 bg-cyan-950/40' },
              counter_factual: { label: 'Phase 3: Counter-Factual Attack Simulation', color: 'border-purple-500/60 text-purple-300 bg-purple-950/40' },
              synthesis: { label: 'Phase 4: Multi-Agent Consensus Synthesis', color: 'border-blue-500/60 text-blue-300 bg-blue-950/40' },
              verdict: { label: 'Phase 5: Sovereign Cryptographic Verdict', color: 'border-emerald-500/60 text-emerald-300 bg-emerald-950/40' }
            };

            const meta = phaseLabels[step.phase] || { label: step.phase, color: 'border-slate-700 text-slate-300 bg-slate-900' };

            return (
              <div 
                key={step.stepNumber} 
                className="border border-slate-800/90 bg-slate-950/60 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleStep(step.stepNumber)}
                  className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-900/60 transition-colors border-b border-slate-900"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono font-bold flex items-center justify-center">
                      {step.stepNumber}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-mono border ${meta.color}`}>
                      {meta.label}
                    </span>
                    <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                      ({step.tokensUsed} tokens)
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                      <span>Confidence:</span>
                      <span className="font-bold">{step.confidence}%</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 space-y-3 bg-slate-950/90 text-sm">
                    {/* The Thought Block */}
                    <div className="border border-slate-800 bg-black/60 rounded-lg p-3 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
                      <div className="text-cyan-500/80 mb-1 select-none flex items-center justify-between">
                        <span>&lt;thought&gt; (Air-gapped CoT Trace)</span>
                        <span className="text-[10px] text-slate-600">Local Hardware Execution</span>
                      </div>
                      <pre className="whitespace-pre-wrap font-mono text-slate-200">
                        {step.thoughtTrace.replace(/^<thought>\n?/, '').replace(/\n?<\/thought>$/, '')}
                      </pre>
                      <div className="text-cyan-500/80 mt-1 select-none">&lt;/thought&gt;</div>
                    </div>

                    {/* Verification Evidence check */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/30 border border-emerald-900/50 text-xs font-mono text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong>Attestation Check:</strong> {step.verificationCheck}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sovereign OSINT Reconnaissance Entities Matrix */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/60 uppercase">
                Zero-Leakage Surface
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Target: {activeReport.target}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" /> Sovereign Passive OSINT Reconnaissance Entities
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            {[
              { id: 'all', label: 'All Entities' },
              { id: 'domain', label: 'Domain/DNS' },
              { id: 'ip_range', label: 'BGP/IP' },
              { id: 'certificate', label: 'TLS Attestation' },
              { id: 'cve_vulnerability', label: 'CVE Audit' },
              { id: 'breached_credential', label: 'Dark-Web Hash' },
              { id: 'threat_actor', label: 'MITRE TTP' }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setSelectedEntityType(filter.id)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedEntityType === filter.id
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Entities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntities.map(entity => {
            const riskColor = entity.riskScore >= 75 
              ? 'text-rose-400 border-rose-800/80 bg-rose-950/30' 
              : entity.riskScore >= 40 
              ? 'text-amber-400 border-amber-800/80 bg-amber-950/30' 
              : 'text-emerald-400 border-emerald-800/80 bg-emerald-950/30';

            return (
              <div 
                key={entity.id} 
                className="border border-slate-800 bg-slate-950/60 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {entity.type.replace('_', ' ')}
                    </span>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${riskColor}`}>
                      Risk {entity.riskScore}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-white mb-1">{entity.label}</h4>
                  <div className="text-xs font-mono text-cyan-300 break-all mb-3 bg-slate-900/80 p-2 rounded border border-slate-800/60">
                    {entity.value}
                  </div>

                  {/* Metadata key-values */}
                  <div className="space-y-1.5 mb-3 text-xs">
                    {Object.entries(entity.details).map(([k, v]) => (
                      <div key={k} className="flex flex-col text-[11px] font-mono">
                        <span className="text-slate-500 uppercase">{k}:</span>
                        <span className="text-slate-300">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-900 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                  <span className="truncate">Src: {entity.source}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Forensic Verdict & Mitigations */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Executive Sovereign Verdict & Mitigations</h3>
        </div>

        <blockquote className="p-4 rounded-xl bg-slate-950 border-l-4 border-cyan-500 text-slate-200 text-sm font-medium leading-relaxed">
          {activeReport.finalVerdict}
        </blockquote>

        <div className="mt-4">
          <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2">
            Automated Counter-Measure Directives:
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
            {activeReport.recommendedMitigations.map((mitigation, idx) => (
              <li key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/60 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{mitigation}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
