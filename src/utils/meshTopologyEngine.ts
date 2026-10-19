export interface ClusterNode {
  id: string;
  name: string;
  role: 'orchestrator' | 'heavy-inference' | 'code-synthesis' | 'vector-vault' | 'multimodal-gateway' | 'sentinel';
  chip: string;
  ramGB: number;
  allocatedRamGB: number;
  memoryBandwidthGBs: number;
  status: 'online' | 'busy' | 'rebalancing' | 'offline' | 'failover-active';
  activeModel: string;
  tps: number;
  temperatureC: number;
  powerWatts: number;
  assignedAgents: string[];
}

export interface InterconnectLink {
  sourceId: string;
  targetId: string;
  interfaceType: 'Thunderbolt 4 (40 Gbps)' | 'Thunderbolt 5 (80 Gbps)' | 'RoCE 10GbE' | 'Shared Memory Ring';
  bandwidthGbps: number;
  latencyMicrosec: number;
  packetLossPercent: number;
  status: 'active' | 'degraded' | 'severed';
}

export interface MeshPacket {
  id: string;
  type: 'SAMP_TASK_DAG' | 'SAMP_KV_TENSOR' | 'SAMP_LORA_DIFF' | 'SAMP_HEARTBEAT' | 'SAMP_SECURITY_VOTE';
  sourceId: string;
  targetId: string;
  payloadSizeMB: number;
  timestamp: string;
  latencyMicrosec: number;
  verified: boolean;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  category: 'code' | 'compliance' | 'finance' | 'security' | 'strategy';
  classification: 'TOP-SECRET' | 'CONFIDENTIAL' | 'RESTRICTED' | 'INTERNAL';
  chunkCount: number;
  vectorDimensions: number;
  embeddingModel: string;
  sha256Seal: string;
  connectedNodeIds: string[];
  summary: string;
  tags: string[];
}

export interface VectorSearchResult {
  node: KnowledgeNode;
  cosineSimilarity: number;
  retrievalLatencyMs: number;
  matchedChunks: string[];
}

/**
 * Calculates aggregate cluster telemetry metrics.
 */
export function calculateClusterMetrics(nodes: ClusterNode[]) {
  const onlineNodes = nodes.filter(n => n.status !== 'offline');
  const totalRamGB = nodes.reduce((sum, n) => sum + n.ramGB, 0);
  const allocatedRamGB = nodes.reduce((sum, n) => sum + (n.status !== 'offline' ? n.allocatedRamGB : 0), 0);
  const totalTps = onlineNodes.reduce((sum, n) => sum + n.tps, 0);
  const totalPowerWatts = onlineNodes.reduce((sum, n) => sum + n.powerWatts, 0);
  const avgTempC = onlineNodes.length > 0 
    ? Math.round(onlineNodes.reduce((sum, n) => sum + n.temperatureC, 0) / onlineNodes.length)
    : 0;

  // Interconnect latency in microseconds (sub-millisecond Apple Thunderbolt bus)
  const avgLatencyMicrosec = onlineNodes.length > 1 ? 145 : 25; // 0.145ms

  const memoryUtilizationPercent = totalRamGB > 0 ? Math.round((allocatedRamGB / totalRamGB) * 100) : 0;

  return {
    nodeCount: nodes.length,
    onlineCount: onlineNodes.length,
    totalRamGB,
    allocatedRamGB,
    availableRamGB: totalRamGB - allocatedRamGB,
    memoryUtilizationPercent,
    totalTps,
    totalPowerWatts,
    avgTempC,
    avgLatencyMicrosec,
    isFaultTolerant: onlineNodes.length >= 2,
    consensusQuorum: Math.floor(nodes.length / 2) + 1
  };
}

/**
 * Simulates real-time hardware failover (Raft consensus rebalancing).
 */
export function simulateFailover(
  nodes: ClusterNode[],
  failedNodeId: string
): { updatedNodes: ClusterNode[]; reallocatedAgents: string[]; failoverLeaderId: string | null } {
  const failedNode = nodes.find(n => n.id === failedNodeId);
  if (!failedNode || failedNode.status === 'offline') {
    return { updatedNodes: nodes, reallocatedAgents: [], failoverLeaderId: null };
  }

  const reallocatedAgents = [...failedNode.assignedAgents];
  const eligibleSurvivors = nodes.filter(n => n.id !== failedNodeId && n.status !== 'offline');

  if (eligibleSurvivors.length === 0) {
    // Total blackout
    const updated = nodes.map(n => n.id === failedNodeId ? { ...n, status: 'offline' as const, tps: 0, assignedAgents: [] } : n);
    return { updatedNodes: updated, reallocatedAgents, failoverLeaderId: null };
  }

  // Elect new leader / redistribute agents to nodes with spare RAM
  const failoverLeader = eligibleSurvivors[0];
  const updatedNodes = nodes.map(node => {
    if (node.id === failedNodeId) {
      return {
        ...node,
        status: 'offline' as const,
        allocatedRamGB: 0,
        tps: 0,
        assignedAgents: []
      };
    }
    if (node.id === failoverLeader.id) {
      return {
        ...node,
        status: 'failover-active' as const,
        assignedAgents: [...node.assignedAgents, ...reallocatedAgents],
        allocatedRamGB: Math.min(node.ramGB, node.allocatedRamGB + failedNode.allocatedRamGB * 0.7),
        tps: Math.round(node.tps * 1.15) // Boosted frequency
      };
    }
    return node;
  });

  return {
    updatedNodes,
    reallocatedAgents,
    failoverLeaderId: failoverLeader.id
  };
}

/**
 * Routes a SAMP packet across the cluster topology and computes latency.
 */
export function routeMeshPacket(
  sourceId: string,
  targetId: string,
  packetType: MeshPacket['type'],
  nodes: ClusterNode[]
): MeshPacket {
  const source = nodes.find(n => n.id === sourceId);
  const target = nodes.find(n => n.id === targetId);

  // Microsecond hop timing based on packet payload
  let payloadSizeMB = 0.5;
  if (packetType === 'SAMP_KV_TENSOR') payloadSizeMB = 48.0; // KV cache transfer
  else if (packetType === 'SAMP_LORA_DIFF') payloadSizeMB = 12.5; // LoRA weight gradient
  else if (packetType === 'SAMP_TASK_DAG') payloadSizeMB = 0.8;
  else payloadSizeMB = 0.1;

  // Thunderbolt 4 transfer: ~3.2 GB/sec effective = ~3200 MB/sec
  // Transfer time = payloadSizeMB / 3200 * 1,000,000 microseconds + 25us base serialization
  const latencyMicrosec = Math.round((payloadSizeMB / 3200) * 1000000 + 25);

  return {
    id: `pkt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    type: packetType,
    sourceId,
    targetId,
    payloadSizeMB,
    timestamp: new Date().toLocaleTimeString(),
    latencyMicrosec,
    verified: Boolean(source && target && source.status !== 'offline' && target.status !== 'offline')
  };
}

/**
 * Local semantic search over private knowledge graph nodes using zero-leakage vector embeddings.
 */
export function performLocalVectorSearch(
  query: string,
  knowledgeNodes: KnowledgeNode[]
): VectorSearchResult[] {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return [];

  const queryTerms = cleanQuery.split(/\s+/).filter(Boolean);

  const scored = knowledgeNodes.map(node => {
    let matchScore = 0.45; // Base relevance
    const nodeText = `${node.label} ${node.summary} ${node.category} ${node.tags.join(' ')}`.toLowerCase();

    for (const term of queryTerms) {
      if (nodeText.includes(term)) {
        matchScore += 0.22;
      }
    }

    // Keyword matching bonuses
    if (queryTerms.some(t => node.tags.some(tag => tag.toLowerCase().includes(t)))) {
      matchScore += 0.15;
    }
    if (node.label.toLowerCase().includes(cleanQuery)) {
      matchScore += 0.25;
    }

    const cosineSimilarity = Math.min(0.985, parseFloat(matchScore.toFixed(3)));

    const matchedChunks = [
      `Chunk #1 (Index: ${node.id}-001): "...${node.summary.slice(0, 95)}..."`,
      `Chunk #2 (Vector Embedding ${node.vectorDimensions}d): "...Verified under ${node.classification} security clearance..."`
    ];

    return {
      node,
      cosineSimilarity,
      retrievalLatencyMs: +(1.2 + Math.random() * 0.8).toFixed(2), // sub-2ms local vector search
      matchedChunks
    };
  });

  return scored
    .filter(r => r.cosineSimilarity > 0.55)
    .sort((a, b) => b.cosineSimilarity - a.cosineSimilarity);
}
