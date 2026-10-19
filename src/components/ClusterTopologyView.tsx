import React, { useState, useEffect } from 'react';
import { 
  CLUSTER_PRESETS, 
  ClusterTopologyPreset 
} from '../data/meshClusterData.ts';
import { 
  ClusterNode, 
  MeshPacket,
  calculateClusterMetrics, 
  simulateFailover, 
  routeMeshPacket 
} from '../utils/meshTopologyEngine.ts';
import { 
  Network, 
  Cpu, 
  Zap, 
  Thermometer, 
  ShieldCheck, 
  AlertTriangle, 
  Play, 
  RotateCcw, 
  Flame, 
  Activity, 
  HardDrive, 
  ArrowRight, 
  Radio, 
  Server,
  Sparkles,
  Info
} from 'lucide-react';

export const ClusterTopologyView: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('enterprise-quad');
  const activePreset = CLUSTER_PRESETS.find(p => p.id === selectedPresetId) || CLUSTER_PRESETS[1];

  const [nodes, setNodes] = useState<ClusterNode[]>(() => [...activePreset.nodes]);
  const [selectedNodeId, setSelectedNodeId] = useState<string>(activePreset.nodes[0].id);
  const [packets, setPackets] = useState<MeshPacket[]>([]);
  const [activePacketAnimation, setActivePacketAnimation] = useState<MeshPacket | null>(null);
  const [failoverAlert, setFailoverAlert] = useState<{ message: string; leaderId: string } | null>(null);

  // When changing preset, reset nodes
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const p = CLUSTER_PRESETS.find(item => item.id === presetId) || CLUSTER_PRESETS[1];
    setNodes([...p.nodes]);
    setSelectedNodeId(p.nodes[0].id);
    setPackets([]);
    setActivePacketAnimation(null);
    setFailoverAlert(null);
  };

  const handleResetCluster = () => {
    setNodes([...activePreset.nodes]);
    setPackets([]);
    setActivePacketAnimation(null);
    setFailoverAlert(null);
  };

  const metrics = calculateClusterMetrics(nodes);
  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  // Send interactive SAMP packet
  const handleInjectPacket = (type: MeshPacket['type']) => {
    const onlineNodes = nodes.filter(n => n.status !== 'offline');
    if (onlineNodes.length < 2) return;

    const source = onlineNodes[0];
    const target = onlineNodes[1];

    const pkt = routeMeshPacket(source.id, target.id, type, nodes);
    setPackets(prev => [pkt, ...prev].slice(0, 8));
    setActivePacketAnimation(pkt);

    setTimeout(() => {
      setActivePacketAnimation(null);
    }, 1800);
  };

  // Chaos failover simulation
  const handleSimulateFailure = (targetNodeId: string) => {
    const { updatedNodes, reallocatedAgents, failoverLeaderId } = simulateFailover(nodes, targetNodeId);
    setNodes(updatedNodes);

    if (failoverLeaderId) {
      const leader = updatedNodes.find(n => n.id === failoverLeaderId);
      setFailoverAlert({
        message: `Node ${targetNodeId} went offline! Raft protocol elected ${leader?.name || failoverLeaderId} in 94ms. Reallocated ${reallocatedAgents.length} agents with zero memory state loss.`,
        leaderId: failoverLeaderId
      });
    } else {
      setFailoverAlert({
        message: `All nodes offline. Air-gap cluster halted.`,
        leaderId: ''
      });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Preset Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5" />
              Sovereign AI Mesh Protocol (SAMP) Fabric
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/60">
              Sub-Millisecond Ring
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1.5 flex items-center gap-2.5">
            <Server className="w-6 h-6 text-cyan-400" />
            <span>SkyShadow Neural Mesh & Cluster Topology Simulator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Experience how multiple Apple Silicon edge nodes (Mac Mini / Mac Studio) link via point-to-point Thunderbolt 4/5 into a unified memory supercluster with zero-copy tensor sharing and instantaneous Raft consensus failover.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleInjectPacket('SAMP_KV_TENSOR')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-all cursor-pointer active:scale-95"
            aria-label="Inject KV Cache Packet"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>Inject KV-Cache Packet</span>
          </button>

          <button
            onClick={() => handleInjectPacket('SAMP_LORA_DIFF')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 transition-all cursor-pointer active:scale-95"
            aria-label="Sync LoRA Gradient"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sync LoRA Gradient</span>
          </button>

          <button
            onClick={handleResetCluster}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            aria-label="Reset Cluster"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Preset Selector Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {CLUSTER_PRESETS.map(preset => {
          const isSelected = preset.id === selectedPresetId;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900/90 border-cyan-500 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                  {preset.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {preset.totalRamGB} GB UMA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                {preset.description}
              </p>
              <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between font-mono">
                <span>{preset.interconnect}</span>
                <span className="text-cyan-400">{preset.targetScale}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Failover Chaos Alert Banner */}
      {failoverAlert && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/50 flex items-start gap-3 animate-fadeIn">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Self-Healing Raft Consensus Triggered
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              {failoverAlert.message}
            </p>
          </div>
          <button
            onClick={() => setFailoverAlert(null)}
            className="text-xs text-amber-400 hover:text-white px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
            <span>Unified Memory Pool</span>
          </div>
          <div className="text-lg font-bold text-white mt-1">
            {metrics.allocatedRamGB} / {metrics.totalRamGB} <span className="text-xs font-normal text-slate-400">GB</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.memoryUtilizationPercent}%` }}
            />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Swarm Throughput</span>
          </div>
          <div className="text-lg font-bold text-emerald-300 mt-1">
            {metrics.totalTps} <span className="text-xs font-normal text-slate-400">tokens/sec</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            {metrics.onlineCount} nodes active
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Cluster Power</span>
          </div>
          <div className="text-lg font-bold text-amber-300 mt-1">
            {metrics.totalPowerWatts} <span className="text-xs font-normal text-slate-400">Watts</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">
            vs 4,500W (Nvidia H100)
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5 text-rose-400" />
            <span>Avg Node Temp</span>
          </div>
          <div className="text-lg font-bold text-white mt-1">
            {metrics.avgTempC}°C
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Silent acoustic fan curve
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ring Latency</span>
          </div>
          <div className="text-lg font-bold text-cyan-300 mt-1">
            {metrics.avgLatencyMicrosec} <span className="text-xs font-normal text-slate-400">µs</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">
            0.14ms (vs 120ms cloud)
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Raft Quorum</span>
          </div>
          <div className="text-lg font-bold text-emerald-300 mt-1">
            {metrics.consensusQuorum} / {metrics.nodeCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            {metrics.isFaultTolerant ? 'Fault Tolerant' : 'Degraded'}
          </div>
        </div>
      </div>

      {/* Main Cluster Grid & Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nodes Canvas / Cards (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Physical Hardware Appliances ({nodes.length} Nodes)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Click node to inspect & simulate failure
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {nodes.map((node, idx) => {
              const isSelected = node.id === selectedNodeId;
              const isOffline = node.status === 'offline';
              const isFailover = node.status === 'failover-active';

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-500/10'
                      : isOffline
                      ? 'bg-red-950/20 border-red-900/60 opacity-60'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Status Indicator */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        isOffline 
                          ? 'bg-red-500' 
                          : isFailover 
                          ? 'bg-amber-400 animate-ping' 
                          : 'bg-emerald-400'
                      }`} />
                      <span className="text-xs font-bold text-white tracking-tight">
                        Node {idx + 1}: {node.name}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                      isOffline
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : isFailover
                        ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {node.status}
                    </span>
                  </div>

                  {/* Hardware Spec */}
                  <div className="mt-3 text-xs text-slate-300 font-medium">
                    {node.chip}
                  </div>
                  <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
                    {node.activeModel}
                  </div>

                  {/* RAM & TPS gauges */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-500">RAM Load:</span>
                      <div className="text-white font-semibold">
                        {node.allocatedRamGB} / {node.ramGB} GB
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Speed:</span>
                      <div className="text-emerald-400 font-semibold">
                        {node.tps} tps
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Thermals:</span>
                      <div className="text-slate-300 font-semibold">
                        {node.temperatureC}°C
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Power:</span>
                      <div className="text-amber-400 font-semibold">
                        {node.powerWatts} W
                      </div>
                    </div>
                  </div>

                  {/* Assigned Agents */}
                  <div className="mt-3 pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Assigned Agents:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {node.assignedAgents.length > 0 ? (
                        node.assignedAgents.map((ag, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            {ag}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">None (Standby / Offline)</span>
                      )}
                    </div>
                  </div>

                  {/* Node Action Footer */}
                  <div className="mt-3 pt-2 flex items-center justify-between text-xs">
                    {!isOffline ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSimulateFailure(node.id);
                        }}
                        className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:underline cursor-pointer"
                        title="Simulate unannounced hardware failure to test Raft failover"
                      >
                        <Flame className="w-3 h-3" />
                        <span>Simulate Failure</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-red-400 font-mono">Node Blacked Out</span>
                    )}

                    <span className="text-[10px] text-slate-500 font-mono">
                      {node.memoryBandwidthGBs} GB/s Bus
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Real-time Packet Animation Log */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>SAMP Live Packet Flow (Thunderbolt DMA Bus)</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">
                Direct Memory Access (DMA) • 0 Cloud Round-trips
              </span>
            </div>

            {activePacketAnimation && (
              <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/50 flex items-center justify-between text-xs font-mono text-cyan-300 animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>[IN TRANSIT] {activePacketAnimation.type}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>{activePacketAnimation.payloadSizeMB} MB</span>
                  <span className="text-emerald-400 font-bold">{activePacketAnimation.latencyMicrosec} µs</span>
                </div>
              </div>
            )}

            <div className="space-y-1.5 max-h-36 overflow-y-auto font-mono text-[11px]">
              {packets.length > 0 ? (
                packets.map(pkt => (
                  <div key={pkt.id} className="p-2 rounded bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">[{pkt.timestamp}]</span>
                      <span className="text-cyan-400 font-semibold">{pkt.type}</span>
                      <span className="text-slate-500">{pkt.sourceId} → {pkt.targetId}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">{pkt.payloadSizeMB} MB</span>
                      <span className="text-emerald-400">{pkt.latencyMicrosec} µs</span>
                      <span className="text-xs text-emerald-400">✓</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 italic text-center py-3">
                  Click "Inject KV-Cache Packet" or "Sync LoRA Gradient" above to dispatch high-throughput test tensors across the Thunderbolt 4 ring.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Node Inspector Detail (1 Column) */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Hardware Telemetry: {selectedNode.name}</span>
                </h4>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  ID: {selectedNode.id} • Role: {selectedNode.role}
                </p>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                selectedNode.status === 'offline' 
                  ? 'bg-red-950 text-red-400' 
                  : 'bg-emerald-950 text-emerald-300'
              }`}>
                {selectedNode.status}
              </span>
            </div>

            {/* Apple Silicon Hardware Deep-Dive */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Processor / SoC:</span>
                <span className="text-white font-medium">{selectedNode.chip}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Unified Memory (UMA):</span>
                <span className="text-cyan-300 font-mono">{selectedNode.ramGB} GB LPDDR5</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Memory Bandwidth:</span>
                <span className="text-emerald-400 font-mono">{selectedNode.memoryBandwidthGBs} GB/sec</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Active Quantized Model:</span>
                <span className="text-indigo-300 font-mono">{selectedNode.activeModel}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Local Inference Speed:</span>
                <span className="text-emerald-300 font-mono">{selectedNode.tps} tokens/sec</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Thermal Core Temp:</span>
                <span className="text-rose-300 font-mono">{selectedNode.temperatureC}°C</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Power Consumption:</span>
                <span className="text-amber-300 font-mono">{selectedNode.powerWatts} Watts</span>
              </div>
            </div>

            {/* RAM Allocation Breakdown */}
            <div className="pt-2">
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-slate-400">Memory Allocation:</span>
                <span className="text-white font-semibold">
                  {Math.round((selectedNode.allocatedRamGB / selectedNode.ramGB) * 100)}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div 
                  className="bg-cyan-500 h-full" 
                  style={{ width: `${(selectedNode.allocatedRamGB / selectedNode.ramGB) * 70}%` }}
                  title="Model Weights"
                />
                <div 
                  className="bg-indigo-500 h-full" 
                  style={{ width: `${(selectedNode.allocatedRamGB / selectedNode.ramGB) * 20}%` }}
                  title="KV Cache Buffer"
                />
                <div 
                  className="bg-emerald-500 h-full" 
                  style={{ width: `${(selectedNode.allocatedRamGB / selectedNode.ramGB) * 10}%` }}
                  title="Vector Index"
                />
              </div>
              <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono mt-1.5">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-cyan-500" /> Model (4-bit)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-indigo-500" /> KV Cache
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-emerald-500" /> Vector DB
                </span>
              </div>
            </div>

            {/* Strategic Value Explainer */}
            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs text-slate-300">
              <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Apple Silicon Edge Advantage</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Standard PC GPUs waste gigabytes copying model weights over PCIe. With Apple Silicon Unified Memory Architecture (UMA), the CPU, GPU, and Neural Engine read from the exact same memory pool at 273–819 GB/s, enabling multi-agent swarms to run with 90% less latency and 97% lower electricity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
