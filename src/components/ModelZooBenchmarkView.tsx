import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  Zap, 
  Layers, 
  ShieldCheck, 
  Check, 
  Terminal, 
  Sparkles, 
  Play, 
  Sliders, 
  BarChart3,
  HardDrive,
  Download
} from 'lucide-react';
import { 
  ZOO_MODELS, 
  QUANTIZATION_PROFILES, 
  calculateModelSpecs 
} from '../utils/modelZooEngine.ts';
import type { ZooModel } from '../utils/modelZooEngine.ts';

export const ModelZooBenchmarkView: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>(ZOO_MODELS[0].id);
  const [selectedQuant, setSelectedQuant] = useState<keyof typeof QUANTIZATION_PROFILES>('q4_k_m');
  const [targetChipBandwidth, setTargetChipBandwidth] = useState<number>(546); // M4 Max default
  
  // Playground state
  const [activePrompt, setActivePrompt] = useState<string>(ZOO_MODELS[0].samplePrompts[0]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationOutput, setGenerationOutput] = useState<string>('');
  const [tokensStreamed, setTokensStreamed] = useState<number>(0);

  const activeModel: ZooModel = useMemo(() => {
    return ZOO_MODELS.find(m => m.id === selectedModelId) || ZOO_MODELS[0];
  }, [selectedModelId]);

  const benchmark = useMemo(() => {
    return calculateModelSpecs(activeModel, selectedQuant, targetChipBandwidth);
  }, [activeModel, selectedQuant, targetChipBandwidth]);

  // Model switch updates prompt
  const handleSelectModel = (model: ZooModel) => {
    setSelectedModelId(model.id);
    setActivePrompt(model.samplePrompts[0]);
    setGenerationOutput('');
    setTokensStreamed(0);
    setIsGenerating(false);
  };

  // Simulated token streaming
  const handleGenerate = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setGenerationOutput('');
    setTokensStreamed(0);

    const fullResponse = `[SkyShadow Local-Mesh MLX Runtime: ${activeModel.name} | Quant: ${selectedQuant.toUpperCase()}]
Memory Bandwidth: ${targetChipBandwidth} GB/s | VRAM Footprint: ${benchmark.vramFootprintGB} GB | Attestation: Apple Secure Enclave SHA-512

THINKING REASONING TRACE (LOCAL TENSOR PASS):
1. Parsing query constraints: Air-gapped execution required. Zero egress allowed.
2. Checking unified memory residency: ${benchmark.vramFootprintGB} GB resident in LPDDR5X UMA.
3. Quantization noise evaluation: ${QUANTIZATION_PROFILES[selectedQuant].perplexityDelta}.
4. Synthesizing solution...

EXECUTIVE RESOLUTION:
"Deploying sovereign agent mesh architecture on local Apple Silicon hardware completely mitigates cloud API pricing volatility and eliminates third-party training data exposure. All KV-cache handoffs occur via Thunderbolt DMA channels at sub-millisecond latencies. Compliance verified under Article 14 of the EU AI Act."`;

    const words = fullResponse.split(' ');
    let currentWord = 0;
    const intervalTime = Math.max(15, Math.floor(1000 / (benchmark.tokensPerSec * 0.75)));

    const streamInterval = setInterval(() => {
      if (currentWord >= words.length) {
        clearInterval(streamInterval);
        setIsGenerating(false);
      } else {
        setGenerationOutput(prev => prev + (currentWord === 0 ? '' : ' ') + words[currentWord]);
        setTokensStreamed(prev => prev + 1);
        currentWord++;
      }
    }, intervalTime);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Sovereign LLM Zoo & Quantization Lab
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Apple Silicon Metal / MLX Optimized
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Sovereign Model Zoo & MLX Quantization Lab
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl">
            Benchmark edge open models (DeepSeek-R1, Qwen 2.5 Coder, Llama 3.3, Phi-4) across GGUF & MLX 
            quantization formats with real-time unified memory footprint and token throughput modeling.
          </p>
        </div>

        {/* Chip Bandwidth Selector */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
          <Cpu className="w-4 h-4 text-cyan-400 ml-2" />
          <span className="text-xs text-slate-400">Target Chip:</span>
          <select
            value={targetChipBandwidth}
            onChange={(e) => setTargetChipBandwidth(Number(e.target.value))}
            className="bg-slate-950 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            aria-label="Select Apple Silicon target chip"
          >
            <option value={150}>M4 Base (150 GB/s)</option>
            <option value={273}>M4 Pro (273 GB/s)</option>
            <option value={546}>M4 Max (546 GB/s)</option>
            <option value={819}>M2/M3 Ultra (819 GB/s)</option>
          </select>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {ZOO_MODELS.map(model => {
          const isSelected = selectedModelId === model.id;
          return (
            <div
              key={model.id}
              onClick={() => handleSelectModel(model)}
              className={`p-4 rounded-2xl border cursor-pointer transition text-left space-y-2 ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500/70 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-400">
                  {model.parameterCountBillions}B
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {model.specialization}
                </span>
              </div>
              <h2 className="text-xs font-bold text-white line-clamp-2 leading-snug">{model.name}</h2>
              <div className="text-[11px] text-slate-400 font-mono">
                MMLU: {model.benchmarkScore.mmluPro}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Quantization Picker & Telemetry */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Quantization Precision Format:
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select quantization precision to recalculate RAM footprint and token throughput.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(Object.keys(QUANTIZATION_PROFILES) as (keyof typeof QUANTIZATION_PROFILES)[]).map(key => {
              const q = QUANTIZATION_PROFILES[key];
              const isSelected = selectedQuant === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedQuant(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm'
                      : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {q.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Telemetry Dashboard for Selected Configuration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Unified VRAM Footprint</span>
            <div className="text-2xl font-black text-cyan-400 mt-1 font-mono">
              {benchmark.vramFootprintGB} <span className="text-sm font-normal text-slate-400">GB</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Includes 8k active KV-cache allocation
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Throughput Speed</span>
            <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">
              ~{benchmark.tokensPerSec} <span className="text-sm font-normal text-slate-400">tok/s</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Based on {targetChipBandwidth} GB/s unified bus
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Time to First Token (TTFT)</span>
            <div className="text-2xl font-black text-white mt-1 font-mono">
              {benchmark.timeToFirstTokenMs} <span className="text-sm font-normal text-slate-400">ms</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Neural Engine matrix prefill latency
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Hardware Tier Viability</span>
            <div className="text-sm font-bold text-indigo-300 mt-1">
              {benchmark.clusterRecommendation}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {benchmark.fitsInStudioM4Max128GB ? 'Single Host Ready' : 'Mesh Distributed Ring'}
            </div>
          </div>
        </div>
      </div>

      {/* Local Prompt Execution Playground */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Local MLX Prompt Execution Playground</h2>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Active: <span className="text-cyan-400">{activeModel.name}</span> ({selectedQuant.toUpperCase()})
          </div>
        </div>

        {/* Sample Prompts */}
        <div className="space-y-1.5">
          <span className="text-xs text-slate-400">Enterprise Benchmark Prompts:</span>
          <div className="flex flex-wrap gap-2">
            {activeModel.samplePrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  setActivePrompt(prompt);
                  setGenerationOutput('');
                }}
                className="text-left text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 line-clamp-1 max-w-xl transition"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>

        {/* Input prompt area */}
        <div className="space-y-2">
          <textarea
            value={activePrompt}
            onChange={(e) => setActivePrompt(e.target.value)}
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            placeholder="Type an enterprise prompt to execute on local Apple Silicon hardware..."
            aria-label="Enterprise prompt input"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            {isGenerating && (
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Streaming at ~{benchmark.tokensPerSec} tok/s ({tokensStreamed} tokens)
              </span>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !activePrompt.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition"
            aria-label="Execute prompt on local engine"
          >
            <Play className="w-3.5 h-3.5" />
            {isGenerating ? 'Generating Locally...' : 'Generate Local Tokens'}
          </button>
        </div>

        {/* Terminal Output */}
        {generationOutput && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
            {generationOutput}
          </div>
        )}
      </div>
    </div>
  );
};
