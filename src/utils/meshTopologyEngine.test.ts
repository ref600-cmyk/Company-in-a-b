import { test } from 'node:test';
import assert from 'node:assert';
import { 
  calculateClusterMetrics, 
  simulateFailover, 
  routeMeshPacket, 
  performLocalVectorSearch
} from './meshTopologyEngine.ts';
import type {
  ClusterNode,
  KnowledgeNode
} from './meshTopologyEngine.ts';

const mockNodes: ClusterNode[] = [
  {
    id: 'node-alpha',
    name: 'Master Orchestrator',
    role: 'orchestrator',
    chip: 'Apple M4 Pro (14-Core)',
    ramGB: 64,
    allocatedRamGB: 32,
    memoryBandwidthGBs: 273,
    status: 'online',
    activeModel: 'Llama-3.2-3B (SAMP-Host)',
    tps: 180,
    temperatureC: 44,
    powerWatts: 28,
    assignedAgents: ['Orion (Orchestrator)']
  },
  {
    id: 'node-beta',
    name: 'Heavy Code & Reasoning',
    role: 'code-synthesis',
    chip: 'Apple M4 Pro (14-Core)',
    ramGB: 64,
    allocatedRamGB: 48,
    memoryBandwidthGBs: 273,
    status: 'online',
    activeModel: 'Qwen-2.5-Coder-32B (4-bit)',
    tps: 72,
    temperatureC: 56,
    powerWatts: 42,
    assignedAgents: ['Vulcan (Software Architect)', 'Cypher (Data Engineer)']
  },
  {
    id: 'node-gamma',
    name: 'Vector & Episodic Vault',
    role: 'vector-vault',
    chip: 'Apple M4 (10-Core)',
    ramGB: 32,
    allocatedRamGB: 18,
    memoryBandwidthGBs: 120,
    status: 'online',
    activeModel: 'bge-m3-multilingual (Embedding)',
    tps: 320,
    temperatureC: 38,
    powerWatts: 18,
    assignedAgents: ['Mnemosyne (Knowledge Scribe)']
  }
];

const mockKnowledgeNodes: KnowledgeNode[] = [
  {
    id: 'kn-01',
    label: 'Proprietary Core Execution Engine',
    category: 'code',
    classification: 'TOP-SECRET',
    chunkCount: 1420,
    vectorDimensions: 1024,
    embeddingModel: 'bge-m3-local',
    sha256Seal: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    connectedNodeIds: ['kn-02'],
    summary: 'Internal Rust and Swift bindings for Apple Metal unified memory ring buffer',
    tags: ['metal', 'swift', 'kernel', 'code']
  },
  {
    id: 'kn-02',
    label: 'CISO SOC 2 Attestation Report',
    category: 'compliance',
    classification: 'CONFIDENTIAL',
    chunkCount: 380,
    vectorDimensions: 1024,
    embeddingModel: 'bge-m3-local',
    sha256Seal: 'a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef',
    connectedNodeIds: ['kn-01'],
    summary: 'Audited air-gap controls, cryptographic packet logs, and zero cloud exfiltration proofs',
    tags: ['soc2', 'compliance', 'audit', 'ciso']
  }
];

test('calculateClusterMetrics accurately sums aggregate cluster memory and power', () => {
  const metrics = calculateClusterMetrics(mockNodes);
  assert.strictEqual(metrics.nodeCount, 3);
  assert.strictEqual(metrics.onlineCount, 3);
  assert.strictEqual(metrics.totalRamGB, 160); // 64 + 64 + 32
  assert.strictEqual(metrics.allocatedRamGB, 98); // 32 + 48 + 18
  assert.strictEqual(metrics.availableRamGB, 62);
  assert.strictEqual(metrics.totalPowerWatts, 88); // 28 + 42 + 18
  assert.strictEqual(metrics.isFaultTolerant, true);
  assert.strictEqual(metrics.consensusQuorum, 2);
});

test('simulateFailover safely elects survivor node and reassigns agents', () => {
  const { updatedNodes, reallocatedAgents, failoverLeaderId } = simulateFailover(mockNodes, 'node-beta');

  assert.strictEqual(reallocatedAgents.length, 2);
  assert.ok(reallocatedAgents.includes('Vulcan (Software Architect)'));
  assert.strictEqual(failoverLeaderId, 'node-alpha');

  const deadNode = updatedNodes.find(n => n.id === 'node-beta');
  assert.strictEqual(deadNode?.status, 'offline');
  assert.strictEqual(deadNode?.assignedAgents.length, 0);

  const leaderNode = updatedNodes.find(n => n.id === 'node-alpha');
  assert.strictEqual(leaderNode?.status, 'failover-active');
  assert.ok(leaderNode?.assignedAgents.includes('Vulcan (Software Architect)'));
});

test('routeMeshPacket calculates microsecond transmission time over Thunderbolt', () => {
  const packet = routeMeshPacket('node-alpha', 'node-beta', 'SAMP_KV_TENSOR', mockNodes);
  assert.strictEqual(packet.sourceId, 'node-alpha');
  assert.strictEqual(packet.targetId, 'node-beta');
  assert.strictEqual(packet.type, 'SAMP_KV_TENSOR');
  assert.strictEqual(packet.payloadSizeMB, 48.0);
  assert.strictEqual(packet.verified, true);
  assert.ok(packet.latencyMicrosec > 0);
  assert.ok(packet.latencyMicrosec < 50000); // well under 50ms (sub-millisecond local bus)
});

test('performLocalVectorSearch returns high cosine similarity for relevant enterprise documents', () => {
  const results = performLocalVectorSearch('Rust Metal kernel bindings', mockKnowledgeNodes);
  assert.ok(results.length > 0);
  assert.strictEqual(results[0].node.id, 'kn-01');
  assert.ok(results[0].cosineSimilarity > 0.6);
  assert.ok(results[0].retrievalLatencyMs < 10); // sub-10ms
});
