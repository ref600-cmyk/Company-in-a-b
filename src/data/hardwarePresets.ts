import { HardwarePreset, ModelSpec } from '../types/index.ts';

export const HARDWARE_PRESETS: HardwarePreset[] = [
  {
    id: 'mac-mini-m4-16gb',
    name: 'Apple Mac Mini M4 (Entry Tier)',
    category: 'mac-mini',
    chip: 'Apple M4 (10-core CPU, 10-core GPU)',
    unifiedMemoryGB: 16,
    memoryBandwidthGBs: 120,
    approxPriceUSD: 599,
    powerWatts: 15,
    description: 'Perfect for small business, boutique agencies, or single-team task autonomy.',
    recommendedRole: 'Fast local reasoning & routine workflow execution',
    supportedModels: ['Qwen-2.5-Coder-7B-Q4', 'Llama-3.2-3B', 'Mistral-7B-Instruct'],
    maxConcurrentAgents: 4,
    tokensPerSec: 42
  },
  {
    id: 'mac-mini-m4-24gb',
    name: 'Apple Mac Mini M4 (Recommended SMB Tier)',
    category: 'mac-mini',
    chip: 'Apple M4 (10-core CPU, 10-core GPU)',
    unifiedMemoryGB: 24,
    memoryBandwidthGBs: 120,
    approxPriceUSD: 799,
    powerWatts: 18,
    description: 'The sweet spot for SMBs. Easily runs 14B parameter models with deep context and multi-agent coordination.',
    recommendedRole: 'Mid-sized company autonomous coordinator',
    supportedModels: ['Qwen-2.5-Coder-14B-Q4', 'DeepSeek-R1-Distill-14B', 'Llama-3.1-8B-Q8'],
    maxConcurrentAgents: 8,
    tokensPerSec: 36
  },
  {
    id: 'mac-mini-m4-pro-64gb',
    name: 'Apple Mac Mini M4 Pro (Powerhouse)',
    category: 'mac-mini',
    chip: 'Apple M4 Pro (14-core CPU, 20-core GPU)',
    unifiedMemoryGB: 64,
    memoryBandwidthGBs: 273,
    approxPriceUSD: 1799,
    powerWatts: 30,
    description: 'Unbelievable enterprise punch in a tiny box. Can fit a 70B parameter model quantized at 4-bit with 273 GB/s memory bandwidth!',
    recommendedRole: 'Autonomous departmental headquarters (Legal, Finance, Dev)',
    supportedModels: ['Llama-3.3-70B-Q4', 'Qwen-2.5-32B-Q4', 'DeepSeek-R1-Distill-32B'],
    maxConcurrentAgents: 16,
    tokensPerSec: 28
  },
  {
    id: 'mac-studio-m2-ultra-192gb',
    name: 'Apple Mac Studio M2 Ultra (Division Tier)',
    category: 'mac-studio',
    chip: 'Apple M2 Ultra (24-core CPU, 76-core GPU)',
    unifiedMemoryGB: 192,
    memoryBandwidthGBs: 800,
    approxPriceUSD: 6999,
    powerWatts: 85,
    description: 'Uncapped corporate local AI powerhouse. 192GB unified RAM with 800 GB/s bandwidth runs multiple 70B models simultaneously.',
    recommendedRole: 'Corporate division central neural core',
    supportedModels: ['Llama-3.3-70B-Q8', 'Command-R-Plus-104B-Q4', 'Mistral-Large-2411-Q4'],
    maxConcurrentAgents: 32,
    tokensPerSec: 54
  },
  {
    id: 'cluster-3x-mac-mini-m4-pro',
    name: 'SkyShadow Tri-Mesh Mini Cluster (3x Mac Mini M4 Pro)',
    category: 'cluster',
    chip: '3x Apple M4 Pro (42 CPU cores, 60 GPU cores total)',
    unifiedMemoryGB: 192,
    memoryBandwidthGBs: 819,
    approxPriceUSD: 5397,
    powerWatts: 85,
    description: 'High-availability office mesh interconnected via Thunderbolt 5 (80Gbps) or 10GbE. Redundant node failover with Raft consensus.',
    recommendedRole: 'Autonomous company backbone with zero single point of failure',
    supportedModels: ['Distributed Model Swarm', '70B Reasoning Node + 2x 32B Worker Nodes'],
    maxConcurrentAgents: 48,
    tokensPerSec: 90
  },
  {
    id: 'enterprise-k8s-dgx-mesh',
    name: 'SkyShadow Enterprise Hybrid Mesh (K8s / On-Prem)',
    category: 'enterprise',
    chip: 'Hybrid Local Nodes + On-Premises GPU Server Cluster',
    unifiedMemoryGB: 512,
    memoryBandwidthGBs: 3000,
    approxPriceUSD: 24000,
    powerWatts: 650,
    description: 'For Fortune 500 corporate deployments. Connects local branch Mac Minis to central on-premise private clouds.',
    recommendedRole: 'Global corporate multi-subsidiary autonomous agent swarm',
    supportedModels: ['Any open-weights model up to 405B', 'Custom fine-tuned company checkpoints'],
    maxConcurrentAgents: 200,
    tokensPerSec: 180
  }
];

export const AVAILABLE_MODELS: ModelSpec[] = [
  {
    id: 'qwen-2.5-coder-7b',
    name: 'Qwen 2.5 Coder 7B',
    parameters: '7 Billion',
    quantization: '4-bit (MLX/GGUF)',
    ramRequiredGB: 5.5,
    bestFor: 'Fast edge coding, git operations, shell task execution',
    engine: 'MLX',
    contextWindow: 32768
  },
  {
    id: 'deepseek-r1-distill-14b',
    name: 'DeepSeek R1 Distill 14B',
    parameters: '14 Billion',
    quantization: '4-bit (MLX)',
    ramRequiredGB: 9.2,
    bestFor: 'Deep step-by-step reasoning, mathematical auditing, SQL generation',
    engine: 'MLX',
    contextWindow: 65536
  },
  {
    id: 'qwen-2.5-32b',
    name: 'Qwen 2.5 32B Instruct',
    parameters: '32 Billion',
    quantization: '4-bit (MLX)',
    ramRequiredGB: 20.4,
    bestFor: 'Complex multi-agent planning, architecture design, contract review',
    engine: 'MLX',
    contextWindow: 131072
  },
  {
    id: 'llama-3.3-70b',
    name: 'Llama 3.3 70B Instruct',
    parameters: '70 Billion',
    quantization: '4-bit (MLX / GGUF Q4_K_M)',
    ramRequiredGB: 41.5,
    bestFor: 'Corporate executive synthesis, top-tier reasoning rivaling GPT-4o',
    engine: 'MLX',
    contextWindow: 131072
  }
];
