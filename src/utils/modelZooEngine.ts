export interface QuantizationProfile {
  id: 'q4_k_m' | 'q5_k_m' | 'q8_0' | 'fp16';
  name: string;
  bitsPerWeight: number;
  perplexityDelta: string; // e.g. "+0.08"
  description: string;
}

export const QUANTIZATION_PROFILES: Record<string, QuantizationProfile> = {
  q4_k_m: {
    id: 'q4_k_m',
    name: 'Q4_K_M (Medium 4-bit)',
    bitsPerWeight: 4.5,
    perplexityDelta: '+0.12 (Imperceptible in coding & reasoning)',
    description: 'Gold standard for local edge deployment: 70% RAM reduction with near-lossless capability'
  },
  q5_k_m: {
    id: 'q5_k_m',
    name: 'Q5_K_M (High 5-bit)',
    bitsPerWeight: 5.5,
    perplexityDelta: '+0.04 (Identical to reference)',
    description: 'High fidelity for precision financial modeling and legal parsing'
  },
  q8_0: {
    id: 'q8_0',
    name: 'Q8_0 (8-bit Quantized)',
    bitsPerWeight: 8.5,
    perplexityDelta: '+0.01 (Near-zero loss)',
    description: 'Reference-quality reasoning when unified memory headroom allows'
  },
  fp16: {
    id: 'fp16',
    name: 'FP16 (Half Precision)',
    bitsPerWeight: 16.0,
    perplexityDelta: 'Baseline (0.00)',
    description: 'Uncompressed raw weights for academic benchmark verification'
  }
};

export interface ZooModel {
  id: string;
  name: string;
  creator: string;
  parameterCountBillions: number;
  architecture: string;
  contextLengthTokens: number;
  specialization: 'reasoning' | 'coding' | 'general' | 'agentic-multimodal';
  license: string;
  benchmarkScore: {
    mmluPro: number;
    humanEval: number;
    math500: number;
  };
  samplePrompts: string[];
}

export const ZOO_MODELS: ZooModel[] = [
  {
    id: 'deepseek-r1-70b',
    name: 'DeepSeek-R1-Distill-Llama-70B',
    creator: 'DeepSeek AI',
    parameterCountBillions: 70.6,
    architecture: 'Dense Transformer with CoT Reasoning',
    contextLengthTokens: 131072,
    specialization: 'reasoning',
    license: 'MIT (Fully Sovereign / Commercial Allowed)',
    benchmarkScore: {
      mmluPro: 84.0,
      humanEval: 89.2,
      math500: 93.8
    },
    samplePrompts: [
      'Derive an adversarial threat vector against an unauthenticated SAMP mesh node and synthesize mitigation.',
      'Analyze the cryptographic soundness of zero-knowledge audit proofs in high-frequency trading.'
    ]
  },
  {
    id: 'qwen-coder-32b',
    name: 'Qwen-2.5-Coder-32B-Instruct',
    creator: 'Alibaba Cloud / Open Source',
    parameterCountBillions: 32.5,
    architecture: 'RoPE Multi-Head Attention',
    contextLengthTokens: 131072,
    specialization: 'coding',
    license: 'Apache 2.0 (Permissive Commercial)',
    benchmarkScore: {
      mmluPro: 78.5,
      humanEval: 92.4,
      math500: 83.1
    },
    samplePrompts: [
      'Generate a zero-allocation Rust ring buffer driver for Thunderbolt 5 DMA transfers.',
      'Refactor an asynchronous eBPF packet filter to prevent buffer overruns under 40Gbps load.'
    ]
  },
  {
    id: 'llama-3-3-70b',
    name: 'Meta Llama-3.3-70B-Instruct',
    creator: 'Meta Open Source',
    parameterCountBillions: 70.6,
    architecture: 'Grouped-Query Attention (GQA)',
    contextLengthTokens: 128000,
    specialization: 'general',
    license: 'Llama 3.3 Community (Enterprise Air-Gapped Ready)',
    benchmarkScore: {
      mmluPro: 81.2,
      humanEval: 88.0,
      math500: 89.4
    },
    samplePrompts: [
      'Draft a comprehensive board resolution for air-gapped sovereign AI infrastructure financing.',
      'Synthesize an enterprise M&A risk report for a $50M target asset with technical debt evaluation.'
    ]
  },
  {
    id: 'phi-4-14b',
    name: 'Microsoft Phi-4-14B',
    creator: 'Microsoft Research',
    parameterCountBillions: 14.7,
    architecture: 'Synthetic Data Pre-trained Small LM',
    contextLengthTokens: 16384,
    specialization: 'reasoning',
    license: 'MIT',
    benchmarkScore: {
      mmluPro: 74.8,
      humanEval: 82.6,
      math500: 84.5
    },
    samplePrompts: [
      'Evaluate mathematical convergence for a distributed consensus protocol with 20% packet drop.',
      'Solve this linear programming optimization for server rack thermal dissipation.'
    ]
  },
  {
    id: 'mistral-nemo-12b',
    name: 'Mistral NeMo 12B Enterprise',
    creator: 'Mistral AI & NVIDIA',
    parameterCountBillions: 12.2,
    architecture: 'Tekken Tokenizer Dense LM',
    contextLengthTokens: 128000,
    specialization: 'agentic-multimodal',
    license: 'Apache 2.0',
    benchmarkScore: {
      mmluPro: 71.4,
      humanEval: 76.8,
      math500: 74.0
    },
    samplePrompts: [
      'Parse unstructured JSON telemetry logs and generate an ISO 27001 compliance audit alert.',
      'Summarize multi-lingual European financial regulations for cross-border sovereign deployments.'
    ]
  }
];

export interface ModelPerformanceBenchmark {
  modelId: string;
  quantization: string;
  vramFootprintGB: number;
  tokensPerSec: number;
  timeToFirstTokenMs: number;
  fitsInSingleM4Mini16GB: boolean;
  fitsInSingleM4Pro64GB: boolean;
  fitsInStudioM4Max128GB: boolean;
  clusterRecommendation: string;
}

export function calculateModelSpecs(
  model: ZooModel,
  quantizationKey: keyof typeof QUANTIZATION_PROFILES,
  memoryBandwidthGBs = 546 // M4 Max bandwidth baseline
): ModelPerformanceBenchmark {
  const quant = QUANTIZATION_PROFILES[quantizationKey] || QUANTIZATION_PROFILES.q4_k_m;
  
  // Weight size in GB: (Billions * bits) / 8 + 1.2GB overhead
  const weightsGB = (model.parameterCountBillions * quant.bitsPerWeight) / 8;
  const kvCacheGB = 2.5; // Baseline 8k active context KV cache
  const totalVramGB = +(weightsGB + kvCacheGB).toFixed(1);

  // Tokens/sec on Unified Memory = (Memory Bandwidth * 0.75 efficiency) / weightsGB
  const theoreticalToksSec = Math.round((memoryBandwidthGBs * 0.72) / Math.max(1, weightsGB));
  const tokensPerSec = Math.min(180, Math.max(8, theoreticalToksSec));

  // Time to first token (prefill) in ms
  const timeToFirstTokenMs = Math.round(150 + (model.parameterCountBillions * 2.2));

  return {
    modelId: model.id,
    quantization: quant.id,
    vramFootprintGB: totalVramGB,
    tokensPerSec,
    timeToFirstTokenMs,
    fitsInSingleM4Mini16GB: totalVramGB <= 13.5, // 16GB minus OS headroom
    fitsInSingleM4Pro64GB: totalVramGB <= 56,
    fitsInStudioM4Max128GB: totalVramGB <= 118,
    clusterRecommendation: totalVramGB <= 56 
      ? '1x Mac Studio M4 Pro / Max' 
      : totalVramGB <= 118 
      ? '1x Mac Studio 128GB or 2x Mac Mini 64GB Mesh' 
      : 'Enterprise 4-Node Daisy-Chain Mesh'
  };
}
