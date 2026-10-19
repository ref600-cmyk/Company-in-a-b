import React, { useState } from 'react';
import { Network, X, Key, ShieldCheck, Terminal, Copy, Check, Sparkles } from 'lucide-react';

interface ProtocolInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SamplePacket {
  id: string;
  type: string;
  sourceNode: string;
  targetNode: string;
  payloadSize: string;
  cryptoSeal: string;
  description: string;
  jsonBody: object;
}

const SAMPLE_PACKETS: SamplePacket[] = [
  {
    id: 'pkt-01',
    type: 'SAMP_HELLO_DISCOVERY',
    sourceNode: 'node-macmini-m4pro-01 (64GB UMA)',
    targetNode: '255.255.255.255 (Thunderbolt Broadcast)',
    payloadSize: '342 Bytes',
    cryptoSeal: 'ed25519:8f9a2b4c7d1e0f3a...',
    description: 'Raft consensus heartbeat announcing node capacity and quantized model tier.',
    jsonBody: {
      protocol: "SAMP/1.0",
      node_id: "skyshadow-node-alpha",
      hardware: {
        chip: "Apple M4 Pro",
        unified_ram_bytes: 68719476736,
        bandwidth_gbs: 273,
        active_model: "Llama-3.3-70B-Instruct-4bit"
      },
      raft_term: 42,
      status: "LEADER"
    }
  },
  {
    id: 'pkt-02',
    type: 'SAMP_TASK_DISPATCH_DAG',
    sourceNode: 'node-macmini-m4pro-01 (Orion Orchestrator)',
    targetNode: 'node-macmini-m4-02 (Vulcan Software Engineer)',
    payloadSize: '1.24 KB',
    cryptoSeal: 'ed25519:4e5f6a7b8c9d0e1f...',
    description: 'Sub-task delegation payload dispatching isolated unit test synthesis in sandbox micro-VM.',
    jsonBody: {
      protocol: "SAMP/1.0",
      mission_id: "mission-sec-audit-44",
      assigned_agent: "agent-vulcan",
      sandbox_profile: "apple_virtualization_microvm_airgapped",
      directive: "Synthesize CVE-2024-4321 regression test and verify patch branch",
      context_tokens: 14200,
      timeout_ms: 15000,
      require_human_gate: true
    }
  },
  {
    id: 'pkt-03',
    type: 'SAMP_FED_LORA_UPDATE',
    sourceNode: 'node-macmini-m4-02 (Regional Legal Clinic)',
    targetNode: 'skyshadow-mesh-aggregator.local',
    payloadSize: '4.82 MB',
    cryptoSeal: 'ed25519:1a2b3c4d5e6f7a8b...',
    description: 'Differentially-private local LoRA weight delta with zero underlying company documents transmitted.',
    jsonBody: {
      protocol: "SAMP/1.0",
      gradient_epoch: 12,
      lora_rank: 16,
      differential_privacy_epsilon: 0.5,
      noise_multiplier: 1.1,
      target_layer: "model.layers.self_attn.q_proj",
      raw_text_exfiltrated: false
    }
  }
];

export const ProtocolInspectorModal: React.FC<ProtocolInspectorModalProps> = ({ isOpen, onClose }) => {
  const [selectedPacketIndex, setSelectedPacketIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentPacket = SAMPLE_PACKETS[selectedPacketIndex];

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(currentPacket.jsonBody, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[85vh] rounded-2xl border border-cyan-500/40 bg-slate-900 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Sovereign AI Mesh Protocol (SAMP) Inspector</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Open-Core Spec
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                The open networking standard that turns distributed Apple Silicon nodes into a single autonomous supercomputer.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            aria-label="Close Protocol Inspector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Packet Selector Tabs */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SAMPLE_PACKETS.map((pkt, idx) => {
              const isSelected = selectedPacketIndex === idx;
              return (
                <button
                  key={pkt.id}
                  onClick={() => setSelectedPacketIndex(idx)}
                  className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/40 shadow-md shadow-cyan-950/50'
                      : 'border-slate-800 bg-slate-950/50 hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="text-[10px] font-mono text-cyan-400 font-bold mb-1">
                      {pkt.type}
                    </div>
                    <div className="text-xs text-slate-300 line-clamp-2">
                      {pkt.description}
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
                    Payload: {pkt.payloadSize}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Packet Details Card */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 text-xs font-mono">
              <div className="space-y-0.5">
                <span className="text-slate-500 text-[10px] uppercase">Route:</span>
                <div className="text-cyan-300">
                  {currentPacket.sourceNode} → {currentPacket.targetNode}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer text-[11px]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
            </div>

            <div className="text-xs font-mono text-emerald-400 flex items-center gap-2">
              <Key className="w-3.5 h-3.5" />
              <span>Cryptographic Seal: {currentPacket.cryptoSeal}</span>
            </div>

            {/* JSON Code Viewer */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 max-h-64 overflow-y-auto font-mono text-xs text-slate-200">
              <pre><code>{JSON.stringify(currentPacket.jsonBody, null, 2)}</code></pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span className="font-mono text-[11px]">
            SAMP Version 1.0 • Ed25519 Mutual TLS Verification • Raft Cluster Ready
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
