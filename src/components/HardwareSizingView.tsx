import React, { useState, useMemo } from 'react';
import { HARDWARE_PRESETS, AVAILABLE_MODELS } from '../data/hardwarePresets.ts';
import { calculateHardwareSizing } from '../utils/hardwareCalculator.ts';
import { BenchmarkComparisonView } from './BenchmarkComparisonView.tsx';
import { 
  Cpu, 
  HardDrive, 
  Zap, 
  DollarSign, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Server,
  Layers,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

interface HardwareSizingViewProps {
  onGoToSwarm: () => void;
  onGoToDeployment: () => void;
}

export const HardwareSizingView: React.FC<HardwareSizingViewProps> = ({ 
  onGoToSwarm, 
  onGoToDeployment 
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('mac-mini-m4-pro-64gb');
  const [nodeCount, setNodeCount] = useState<number>(1);
  const [selectedModelParamB, setSelectedModelParamB] = useState<number>(70);
  const [quantizationBits, setQuantizationBits] = useState<number>(4);
  const [contextTokensK, setContextTokensK] = useState<number>(16);
  const [monthlyTokensM, setMonthlyTokensM] = useState<number>(50);

  const activePreset = useMemo(() => {
    return HARDWARE_PRESETS.find(p => p.id === selectedPresetId) || HARDWARE_PRESETS[2];
  }, [selectedPresetId]);

  const sizingResult = useMemo(() => {
    return calculateHardwareSizing({
      hardwareId: activePreset.id,
      totalMemoryGB: activePreset.unifiedMemoryGB,
      memoryBandwidthGBs: activePreset.memoryBandwidthGBs,
      nodeCount,
      selectedModelParamB,
      quantizationBits,
      contextTokensK,
      estimatedMonthlyCloudTokensM: monthlyTokensM
    });
  }, [activePreset, nodeCount, selectedModelParamB, quantizationBits, contextTokensK, monthlyTokensM]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Sizing Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <span>Apple Silicon & Enterprise Fleet Hardware Simulator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Calculate exact Unified Memory (UMA) allocation, tokens/sec, and cost savings across Mac Mini & cluster configurations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onGoToDeployment}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all cursor-pointer"
          >
            <Server className="w-4 h-4 text-cyan-400" />
            <span>View Deployment Scripts</span>
          </button>
          <button
            onClick={onGoToSwarm}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all cursor-pointer font-sans"
          >
            <span>Simulate Swarm</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hardware Presets Selector */}
      <div className="space-y-3">
        <label className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider block">
          1. Select Apple Silicon or Mesh Hardware Tier
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {HARDWARE_PRESETS.map((preset) => {
            const isSelected = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                onClick={() => setSelectedPresetId(preset.id)}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/30 shadow-lg shadow-cyan-950/50'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900'
                }`}
                aria-pressed={isSelected}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-sm font-bold text-white">
                      {preset.name}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-cyan-400 mb-2">
                    {preset.chip}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {preset.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">
                    {preset.unifiedMemoryGB}GB RAM • {preset.memoryBandwidthGBs} GB/s
                  </span>
                  <span className="text-emerald-400 font-bold">
                    ${preset.approxPriceUSD.toLocaleString()}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulator Tuning Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Sliders & Configuration */}
        <div className="lg:col-span-2 space-y-6 p-6 rounded-2xl border border-slate-800 bg-slate-900/50">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>2. Tune Workload & Model Specifications</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Model Size Parameter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300 flex justify-between">
                <span>Foundation Model Parameters:</span>
                <span className="font-mono text-cyan-400 font-bold">{selectedModelParamB} Billion (B)</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[7, 14, 32, 70].map((param) => (
                  <button
                    key={param}
                    onClick={() => setSelectedModelParamB(param)}
                    className={`py-2 text-xs font-mono font-medium rounded-lg border transition-all cursor-pointer ${
                      selectedModelParamB === param
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {param}B
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                {selectedModelParamB === 70 ? 'Llama-3.3-70B (State-of-the-art enterprise reasoning)' :
                 selectedModelParamB === 32 ? 'Qwen-2.5-32B (High coding & architectural mastery)' :
                 selectedModelParamB === 14 ? 'DeepSeek-R1-14B (Fast math & step-by-step logic)' :
                 'Qwen-Coder-7B (Ultra-fast edge tool caller)'}
              </p>
            </div>

            {/* Quantization */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300 flex justify-between">
                <span>Apple MLX Quantization:</span>
                <span className="font-mono text-cyan-400 font-bold">{quantizationBits}-bit precision</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[4, 8].map((bits) => (
                  <button
                    key={bits}
                    onClick={() => setQuantizationBits(bits)}
                    className={`py-2 text-xs font-mono font-medium rounded-lg border transition-all cursor-pointer ${
                      quantizationBits === bits
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {bits}-bit {bits === 4 ? '(Recommended)' : '(Unquantized weights)'}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                4-bit MLX retains 99.2% FP16 reasoning with 50% RAM reduction.
              </p>
            </div>

            {/* Cluster Node Count */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300 flex justify-between">
                <span>Mesh Cluster Nodes (Raft Consensus):</span>
                <span className="font-mono text-cyan-400 font-bold">{nodeCount} {nodeCount === 1 ? 'Box' : 'Boxes'}</span>
              </label>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={nodeCount}
                onChange={(e) => setNodeCount(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>1 (Single Mini)</span>
                <span>4 (Office Quad)</span>
                <span>8 (Dept Mesh)</span>
              </div>
            </div>

            {/* Context Window Length */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300 flex justify-between">
                <span>Context Window Per Agent:</span>
                <span className="font-mono text-cyan-400 font-bold">{contextTokensK}k Tokens</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[8, 16, 32, 64].map((k) => (
                  <button
                    key={k}
                    onClick={() => setContextTokensK(k)}
                    className={`py-2 text-xs font-mono font-medium rounded-lg border transition-all cursor-pointer ${
                      contextTokensK === k
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {k}k
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                16k tokens allows ~35 pages of company documents in active memory.
              </p>
            </div>
          </div>

          {/* Monthly Tokens Volume Slider */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-slate-300">
                Estimated Company Monthly Token Consumption:
              </label>
              <span className="font-mono text-emerald-400 font-bold text-sm">
                {monthlyTokensM} Million Tokens / Month
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={monthlyTokensM}
              onChange={(e) => setMonthlyTokensM(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Equivalent to roughly {Math.round(monthlyTokensM * 18)} autonomous customer support or engineering tickets handled per month.
            </p>
          </div>
        </div>

        {/* Right Col: Live Hardware Viability & Metrics */}
        <div className="space-y-4 p-6 rounded-2xl border border-slate-800 bg-slate-950 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Hardware Viability
              </span>
              {sizingResult.isViable ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Fully Viable</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>RAM Overload</span>
                </span>
              )}
            </div>

            {/* RAM Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Total Cluster RAM:</span>
                <span className="font-mono font-bold text-white">
                  {sizingResult.totalRequiredMemoryGB}GB / {sizingResult.availableClusterMemoryGB}GB
                </span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    !sizingResult.isViable
                      ? 'bg-red-500'
                      : sizingResult.memoryUtilizationPercent > 85
                      ? 'bg-amber-400'
                      : 'bg-cyan-400'
                  }`}
                  style={{ width: `${Math.min(100, sizingResult.memoryUtilizationPercent)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Model: {sizingResult.modelWeightMemoryGB}GB</span>
                <span>KV Cache: {sizingResult.kvCacheMemoryGB}GB</span>
                <span>OS & DB: {sizingResult.vectorDbAndOsGB}GB</span>
              </div>
            </div>

            {sizingResult.bottleneckWarning && (
              <div className="mt-4 p-3 rounded-xl bg-amber-950/20 border border-amber-900/30 text-xs text-amber-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>{sizingResult.bottleneckWarning}</span>
              </div>
            )}

            {/* Core Output Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400">Token Speed</span>
                <div className="text-xl font-black text-cyan-300 mt-1 flex items-center gap-1">
                  <span>~{sizingResult.estimatedTokensPerSecond}</span>
                  <span className="text-xs font-normal text-slate-500 font-mono">tok/s</span>
                </div>
                <span className="text-[10px] text-slate-500">MLX Metal acceleration</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400">Max Swarm Agents</span>
                <div className="text-xl font-black text-white mt-1 flex items-center gap-1">
                  <span>{sizingResult.maxConcurrentAgents}</span>
                  <span className="text-xs font-normal text-slate-500 font-mono">parallel</span>
                </div>
                <span className="text-[10px] text-slate-500">Zero context thrashing</span>
              </div>
            </div>

            {/* Financial ROI Comparison */}
            <div className="mt-5 p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-emerald-300">
                  Monthly Cloud API Cost:
                </span>
                <span className="font-mono text-xs text-red-300 line-through">
                  ${sizingResult.monthlyCloudEquivalentCostUSD.toLocaleString()}/mo
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-emerald-300">
                  Local Electricity Bill:
                </span>
                <span className="font-mono text-xs text-slate-300">
                  ${sizingResult.monthlyElectricityCostUSD.toFixed(2)}/mo
                </span>
              </div>
              <div className="pt-2 border-t border-emerald-800/40 flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  Net Monthly Savings:
                </span>
                <span className="font-mono font-black text-emerald-400 text-sm">
                  +${sizingResult.monthlyNetSavingsUSD.toLocaleString()} / mo
                </span>
              </div>
              <div className="text-[11px] font-mono text-emerald-300/80 pt-1 flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Full Hardware Payback: {sizingResult.roiMonths} months</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-side Empirical Benchmark & TCO Analysis */}
      <div className="pt-6 border-t border-slate-800">
        <BenchmarkComparisonView />
      </div>
    </div>
  );
};
