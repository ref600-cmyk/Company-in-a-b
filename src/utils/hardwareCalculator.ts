export interface SizingInput {
  hardwareId: string;
  totalMemoryGB: number;
  memoryBandwidthGBs: number;
  nodeCount: number;
  selectedModelParamB: number; // e.g. 8, 14, 32, 70
  quantizationBits: number; // 4 or 8
  contextTokensK: number; // e.g. 8, 16, 32, 64
  estimatedMonthlyCloudTokensM: number; // e.g. 50 million tokens
}

export interface SizingResult {
  modelWeightMemoryGB: number;
  kvCacheMemoryGB: number;
  vectorDbAndOsGB: number;
  totalRequiredMemoryGB: number;
  availableClusterMemoryGB: number;
  memoryUtilizationPercent: number;
  isViable: boolean;
  estimatedTokensPerSecond: number;
  maxConcurrentAgents: number;
  monthlyElectricityCostUSD: number;
  monthlyCloudEquivalentCostUSD: number;
  monthlyNetSavingsUSD: number;
  roiMonths: number;
  bottleneckWarning?: string;
}

/**
 * Calculates model memory footprint:
 * Model weight (GB) ~= (Parameters in Billions * Quantization Bits) / 8 * 1.15 (overhead)
 */
export function calculateModelWeightMemory(paramB: number, quantBits: number): number {
  const baseSize = (paramB * quantBits) / 8;
  // 15% runtime buffer for metadata and activations
  return Math.round(baseSize * 1.15 * 10) / 10;
}

/**
 * Calculates KV cache memory footprint per concurrent session:
 * KV cache ~= 2 * layers * hidden_dim * context_len * bytes_per_element
 * Heuristic approximation: ~0.5 GB per 8k context for 8B-32B models, ~1.2 GB per 8k context for 70B
 */
export function calculateKvCacheMemory(paramB: number, contextK: number, activeStreams: number): number {
  const factor = paramB >= 50 ? 0.15 : 0.07;
  const gbPerStream = (contextK / 8) * factor * 8;
  return Math.round(gbPerStream * activeStreams * 10) / 10;
}

/**
 * Pure calculation function for Mac Mini / local hardware sizing
 */
export function calculateHardwareSizing(input: SizingInput): SizingResult {
  const clusterMemoryGB = input.totalMemoryGB * input.nodeCount;
  const modelWeightGB = calculateModelWeightMemory(input.selectedModelParamB, input.quantizationBits);
  
  // OS base + Docker / Vector DB (LanceDB/Qdrant) buffer
  const baseOsBuffer = 3.5 * input.nodeCount;
  const vectorDbBuffer = 2.0 * input.nodeCount;
  const fixedOverheadGB = baseOsBuffer + vectorDbBuffer;

  const remainingMemoryForInference = Math.max(0, clusterMemoryGB - modelWeightGB - fixedOverheadGB);
  
  // Max agents that can run concurrently based on KV cache budget (~1.5GB per agent session)
  const memoryPerAgent = input.selectedModelParamB >= 50 ? 2.5 : 1.2;
  const theoreticalAgents = Math.floor(remainingMemoryForInference / memoryPerAgent);
  const maxConcurrentAgents = Math.max(1, Math.min(theoreticalAgents, input.nodeCount * 12));

  const kvCacheGB = calculateKvCacheMemory(input.selectedModelParamB, input.contextTokensK, Math.min(maxConcurrentAgents, 4));
  const totalRequiredMemoryGB = Math.round((modelWeightGB + kvCacheGB + fixedOverheadGB) * 10) / 10;
  
  const memoryUtilizationPercent = Math.min(100, Math.round((totalRequiredMemoryGB / clusterMemoryGB) * 100));
  const isViable = totalRequiredMemoryGB <= clusterMemoryGB;

  // Apple Silicon token generation speed heuristic:
  // Speed is strongly bound by memory bandwidth: tok/s ~= bandwidth (GB/s) / model_weight (GB) * efficiency (typically 0.6 - 0.75 on MLX)
  const efficiency = 0.65;
  const rawTokensPerSec = modelWeightGB > 0 ? (input.memoryBandwidthGBs / modelWeightGB) * efficiency : 25;
  const estimatedTokensPerSecond = Math.round(Math.max(5, Math.min(rawTokensPerSec, 140)));

  // Financial ROI calculations:
  // Electricity: Apple Silicon Mac Mini idle is ~5W, load is ~35W. Average 20W. 24/7 = 14.4 kWh/month. At $0.20/kWh = ~$2.88/month/node.
  const monthlyElectricityCostUSD = Math.round(input.nodeCount * 14.4 * 0.20 * 100) / 100;
  
  // Equivalent Cloud API cost: Blended prompt+completion cost for Claude 3.5 Sonnet / GPT-4o is ~$5 per 1M tokens.
  const costPerMillionTokens = 5.0;
  const monthlyCloudEquivalentCostUSD = Math.round(input.estimatedMonthlyCloudTokensM * costPerMillionTokens);
  const monthlyNetSavingsUSD = Math.max(0, monthlyCloudEquivalentCostUSD - monthlyElectricityCostUSD);

  // Hardware investment (Mac Mini M4 ~$599-$1,399, Mac Studio ~$1,999-$3,999)
  const estimatedHardwareCost = (input.totalMemoryGB >= 64 ? 2199 : input.totalMemoryGB >= 32 ? 1199 : 699) * input.nodeCount;
  const roiMonths = monthlyNetSavingsUSD > 0 ? Math.round((estimatedHardwareCost / monthlyNetSavingsUSD) * 10) / 10 : 999;

  let bottleneckWarning: string | undefined;
  if (!isViable) {
    bottleneckWarning = `Model exceeds physical RAM (${totalRequiredMemoryGB}GB required vs ${clusterMemoryGB}GB available). Consider 4-bit quantization or adding nodes.`;
  } else if (memoryUtilizationPercent > 88) {
    bottleneckWarning = `High memory pressure (${memoryUtilizationPercent}%). Heavy multi-agent spikes might swap to SSD.`;
  }

  return {
    modelWeightMemoryGB: modelWeightGB,
    kvCacheMemoryGB: kvCacheGB,
    vectorDbAndOsGB: fixedOverheadGB,
    totalRequiredMemoryGB,
    availableClusterMemoryGB: clusterMemoryGB,
    memoryUtilizationPercent,
    isViable,
    estimatedTokensPerSecond,
    maxConcurrentAgents,
    monthlyElectricityCostUSD,
    monthlyCloudEquivalentCostUSD,
    monthlyNetSavingsUSD,
    roiMonths,
    bottleneckWarning,
  };
}
