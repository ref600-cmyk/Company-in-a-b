import type { ClusterNode, InterconnectLink } from '../utils/meshTopologyEngine.ts';

export interface ClusterTopologyPreset {
  id: string;
  name: string;
  description: string;
  targetScale: string;
  totalRamGB: number;
  interconnect: string;
  nodes: ClusterNode[];
  links: InterconnectLink[];
}

export const ENTERPRISE_4_NODE_TOPOLOGY: ClusterNode[] = [
  {
    id: 'node-alpha',
    name: 'Master Orchestrator & Fast Dispatcher',
    role: 'orchestrator',
    chip: 'Apple M4 Pro (14-Core CPU, 20-Core GPU)',
    ramGB: 64,
    allocatedRamGB: 28,
    memoryBandwidthGBs: 273,
    status: 'online',
    activeModel: 'Llama-3.2-3B-Instruct (MLX Float16)',
    tps: 185,
    temperatureC: 42,
    powerWatts: 24,
    assignedAgents: ['Orion (Master Orchestrator)']
  },
  {
    id: 'node-beta',
    name: 'Deep Reasoning & Code Synthesizer',
    role: 'code-synthesis',
    chip: 'Apple M4 Pro (14-Core CPU, 20-Core GPU)',
    ramGB: 64,
    allocatedRamGB: 52,
    memoryBandwidthGBs: 273,
    status: 'online',
    activeModel: 'Qwen-2.5-Coder-32B-Instruct (MLX 4-bit)',
    tps: 68,
    temperatureC: 58,
    powerWatts: 46,
    assignedAgents: ['Vulcan (Lead Software Architect)', 'Cypher (Data & ETL Engineer)']
  },
  {
    id: 'node-gamma',
    name: 'Sovereign Knowledge Vault & Embeddings',
    role: 'vector-vault',
    chip: 'Apple M4 (10-Core CPU, 10-Core GPU)',
    ramGB: 32,
    allocatedRamGB: 19,
    memoryBandwidthGBs: 120,
    status: 'online',
    activeModel: 'bge-m3-multilingual (Dense+Sparse HNSW)',
    tps: 340,
    temperatureC: 39,
    powerWatts: 18,
    assignedAgents: ['Mnemosyne (Knowledge Scribe)']
  },
  {
    id: 'node-delta',
    name: 'Multimodal Gateway & Sentinel Shield',
    role: 'multimodal-gateway',
    chip: 'Apple M4 Pro (14-Core CPU, 20-Core GPU)',
    ramGB: 64,
    allocatedRamGB: 34,
    memoryBandwidthGBs: 273,
    status: 'online',
    activeModel: 'Whisper-Large-v3-Turbo + Moondream2',
    tps: 110,
    temperatureC: 47,
    powerWatts: 31,
    assignedAgents: ['Aegis (CISO Compliance Sentinel)', 'Iris (Live Operations Sentinel)']
  }
];

export const ENTERPRISE_LINKS: InterconnectLink[] = [
  {
    sourceId: 'node-alpha',
    targetId: 'node-beta',
    interfaceType: 'Thunderbolt 4 (40 Gbps)',
    bandwidthGbps: 40,
    latencyMicrosec: 140,
    packetLossPercent: 0.0,
    status: 'active'
  },
  {
    sourceId: 'node-beta',
    targetId: 'node-gamma',
    interfaceType: 'Thunderbolt 4 (40 Gbps)',
    bandwidthGbps: 40,
    latencyMicrosec: 155,
    packetLossPercent: 0.0,
    status: 'active'
  },
  {
    sourceId: 'node-gamma',
    targetId: 'node-delta',
    interfaceType: 'Thunderbolt 4 (40 Gbps)',
    bandwidthGbps: 40,
    latencyMicrosec: 148,
    packetLossPercent: 0.0,
    status: 'active'
  },
  {
    sourceId: 'node-delta',
    targetId: 'node-alpha',
    interfaceType: 'Thunderbolt 4 (40 Gbps)',
    bandwidthGbps: 40,
    latencyMicrosec: 138,
    packetLossPercent: 0.0,
    status: 'active'
  }
];

export const CLUSTER_PRESETS: ClusterTopologyPreset[] = [
  {
    id: 'starter-dual',
    name: '2-Node Edge Appliance (128GB Unified RAM)',
    description: 'Entry-level dual Mac Mini M4 Pro configuration connected via direct Thunderbolt 4 cross-cable. Ideal for law firms, medical clinics, and branch offices.',
    targetScale: 'Up to 75 users',
    totalRamGB: 128,
    interconnect: 'Direct Thunderbolt 4 (40 Gbps)',
    nodes: [
      {
        id: 'node-alpha',
        name: 'Node 1: Dispatcher & Orchestrator',
        role: 'orchestrator',
        chip: 'Apple M4 Pro (64GB)',
        ramGB: 64,
        allocatedRamGB: 38,
        memoryBandwidthGBs: 273,
        status: 'online',
        activeModel: 'Llama-3.3-70B-Instruct (3-bit MLX)',
        tps: 42,
        temperatureC: 52,
        powerWatts: 38,
        assignedAgents: ['Orion (Orchestrator)', 'Aegis (Sentinel)']
      },
      {
        id: 'node-beta',
        name: 'Node 2: Code & Vector Vault',
        role: 'code-synthesis',
        chip: 'Apple M4 Pro (64GB)',
        ramGB: 64,
        allocatedRamGB: 44,
        memoryBandwidthGBs: 273,
        status: 'online',
        activeModel: 'Qwen-2.5-Coder-32B + bge-m3',
        tps: 76,
        temperatureC: 54,
        powerWatts: 41,
        assignedAgents: ['Vulcan (Software Architect)', 'Mnemosyne (Knowledge Scribe)']
      }
    ],
    links: [
      {
        sourceId: 'node-alpha',
        targetId: 'node-beta',
        interfaceType: 'Thunderbolt 4 (40 Gbps)',
        bandwidthGbps: 40,
        latencyMicrosec: 110,
        packetLossPercent: 0.0,
        status: 'active'
      }
    ]
  },
  {
    id: 'enterprise-quad',
    name: '4-Node Enterprise Ring (224GB Unified RAM)',
    description: 'Production-grade 4-node daisy-chained ring architecture with dedicated nodes for Orchestration, 32B Code Reasoning, Vector Cortex, and Multimodal Gateways.',
    targetScale: '75 to 500 users',
    totalRamGB: 224,
    interconnect: 'Thunderbolt 4 Daisy-Chain Ring (40 Gbps)',
    nodes: ENTERPRISE_4_NODE_TOPOLOGY,
    links: ENTERPRISE_LINKS
  },
  {
    id: 'hyperscale-rack',
    name: '8-Node Sovereign Datacenter Rack (512GB - 1TB UMA)',
    description: 'Full 19-inch 2U rack mount enclosure holding 8 Apple Silicon nodes linked with dual-port 80Gbps Thunderbolt 5 mesh and redundant power supplies.',
    targetScale: '500+ users / Global Enterprise Tier',
    totalRamGB: 512,
    interconnect: 'Thunderbolt 5 Dual-Port Mesh (80 Gbps)',
    nodes: [
      ...ENTERPRISE_4_NODE_TOPOLOGY,
      {
        id: 'node-epsilon',
        name: 'High-Throughput Batch Inference 1',
        role: 'heavy-inference',
        chip: 'Apple M4 Max (128GB)',
        ramGB: 128,
        allocatedRamGB: 96,
        memoryBandwidthGBs: 410,
        status: 'online',
        activeModel: 'DeepSeek-V3-MoE (Quantized 4-bit)',
        tps: 145,
        temperatureC: 61,
        powerWatts: 68,
        assignedAgents: ['Batch Worker Swarm 1']
      },
      {
        id: 'node-zeta',
        name: 'High-Throughput Batch Inference 2',
        role: 'heavy-inference',
        chip: 'Apple M4 Max (128GB)',
        ramGB: 128,
        allocatedRamGB: 94,
        memoryBandwidthGBs: 410,
        status: 'online',
        activeModel: 'DeepSeek-V3-MoE (Quantized 4-bit)',
        tps: 142,
        temperatureC: 60,
        powerWatts: 67,
        assignedAgents: ['Batch Worker Swarm 2']
      }
    ],
    links: ENTERPRISE_LINKS
  }
];
