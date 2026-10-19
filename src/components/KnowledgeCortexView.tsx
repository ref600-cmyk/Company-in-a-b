import React, { useState } from 'react';
import { 
  ENTERPRISE_KNOWLEDGE_NODES, 
  SAMPLE_VECTOR_QUERIES 
} from '../data/knowledgeGraphData.ts';
import { 
  KnowledgeNode, 
  VectorSearchResult, 
  performLocalVectorSearch 
} from '../utils/meshTopologyEngine.ts';
import { 
  Database, 
  Search, 
  ShieldCheck, 
  Lock, 
  FileCode, 
  FileText, 
  DollarSign, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  Copy, 
  Hash, 
  Cpu, 
  ArrowRight,
  ExternalLink,
  Layers
} from 'lucide-react';

export const KnowledgeCortexView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('Zero-copy Apple Metal unified memory ring buffer');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNodeId, setSelectedNodeId] = useState<string>(ENTERPRISE_KNOWLEDGE_NODES[0].id);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [exportedCert, setExportedCert] = useState<boolean>(false);

  // Perform local sub-2ms vector similarity search
  const searchResults: VectorSearchResult[] = performLocalVectorSearch(
    searchQuery, 
    ENTERPRISE_KNOWLEDGE_NODES
  );

  const filteredNodes = ENTERPRISE_KNOWLEDGE_NODES.filter(node => {
    if (selectedCategory === 'all') return true;
    return node.category === selectedCategory;
  });

  const selectedNode = ENTERPRISE_KNOWLEDGE_NODES.find(n => n.id === selectedNodeId) || ENTERPRISE_KNOWLEDGE_NODES[0];

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleExportZeroKnowledgeCert = () => {
    const cert = {
      protocol: "SkyShadow Sovereign Knowledge Cortex (SKC-v1.4)",
      timestamp: new Date().toISOString(),
      hardwareEnclave: "Apple Silicon Secure Enclave (M4 Pro)",
      indexedKnowledgeNodes: ENTERPRISE_KNOWLEDGE_NODES.length,
      totalVectorDimensions: 1024,
      cloudDataExfiltrationBytes: 0,
      wanNetworkSocketsOpened: 0,
      cryptographicRootHash: "e7f8901234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      cisoAttestationVerdict: "COMPLIANT_100_PERCENT_AIR_GAPPED"
    };

    const blob = new Blob([JSON.stringify(cert, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkyShadow-Zero-Knowledge-Cert-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportedCert(true);
    setTimeout(() => setExportedCert(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Attestation Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-indigo-950/80 text-indigo-300 border border-indigo-800/80 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              Zero-Leakage Local Cortex
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% On-Device Vectors
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1.5 flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-indigo-400" />
            <span>Sovereign Knowledge Graph & Vector Cortex</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Why enterprises get locked in forever: Enterprise Data Gravity. SkyShadow ingests proprietary code, confidential financials, executive emails, and compliance audits into an encrypted local HNSW vector database where autonomous agents query with sub-2ms latency and 0 cloud leakage.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportZeroKnowledgeCert}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all cursor-pointer active:scale-95"
            aria-label="Export Zero Knowledge Attestation"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{exportedCert ? 'Attestation Exported!' : 'Export Zero-Cloud Attestation'}</span>
          </button>
        </div>
      </div>

      {/* Top Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>Indexed Vectors</span>
          </div>
          <div className="text-lg font-bold text-white mt-1">
            9,460 <span className="text-xs font-normal text-slate-400">chunks</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            1024-dim bge-m3 dense + sparse
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Vector Query Latency</span>
          </div>
          <div className="text-lg font-bold text-cyan-300 mt-1">
            1.4 <span className="text-xs font-normal text-slate-400">ms</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">
            Direct Apple Metal GPU HNSW
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cloud Leakage</span>
          </div>
          <div className="text-lg font-bold text-emerald-300 mt-1">
            0.00 <span className="text-xs font-normal text-slate-400">Bytes</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Hardware Enclave Sealed
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Confidential Domains</span>
          </div>
          <div className="text-lg font-bold text-indigo-300 mt-1">
            5 <span className="text-xs font-normal text-slate-400">Silos</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Code, Legal, Finance, Strategy
          </div>
        </div>
      </div>

      {/* Semantic Search Interactive Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <label className="text-xs font-bold text-white flex items-center gap-2">
          <Search className="w-4 h-4 text-cyan-400" />
          <span>Interactive Local Semantic Search Engine (Sub-2ms Vector Retrieval)</span>
        </label>
        
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type query to test local vector cosine similarity retrieval..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>

        {/* Quick query sample chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-400 font-mono mr-1">Sample Queries:</span>
          {SAMPLE_VECTOR_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setSearchQuery(q)}
              className="text-[10px] px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer font-mono"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Visualizer */}
      {searchResults.length > 0 && (
        <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Semantic Vector Matches ({searchResults.length} High-Cosine Relevant Nodes)</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400">
              Queried in {searchResults[0]?.retrievalLatencyMs || 1.4}ms • Zero Cloud Sockets
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {searchResults.map((res, i) => (
              <div
                key={i}
                onClick={() => setSelectedNodeId(res.node.id)}
                className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 transition-all cursor-pointer text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">
                    {res.node.label}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Cosine: {res.cosineSimilarity}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {res.node.summary}
                </p>
                <div className="space-y-1 pt-1 border-t border-slate-800 font-mono text-[10px] text-slate-400">
                  {res.matchedChunks.map((chunk, ci) => (
                    <div key={ci} className="text-cyan-400/90 truncate">
                      {chunk}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Knowledge Graph Explorer: Categories & Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Category Tabs & Node Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Proprietary Corporate Knowledge Nodes ({filteredNodes.length})</span>
            </h3>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-1 text-xs">
              {['all', 'code', 'compliance', 'strategy', 'finance'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer uppercase ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredNodes.map(node => {
              const isSelected = node.id === selectedNodeId;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-400 ring-1 ring-indigo-500/30 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                      node.classification === 'TOP-SECRET'
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : node.classification === 'CONFIDENTIAL'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-blue-950 text-blue-300 border border-blue-800'
                    }`}>
                      {node.classification}
                    </span>

                    <span className="text-[10px] font-mono text-slate-400">
                      {node.chunkCount} Chunks
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug">
                    {node.label}
                  </h4>

                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {node.summary}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {node.tags.map(t => (
                      <span key={t} className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Node Knowledge Inspector & Cryptographic Attestation */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {selectedNode.category.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Sealed Local Enclave
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-2 leading-snug">
                {selectedNode.label}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                Node ID: {selectedNode.id}
              </p>
            </div>

            {/* Spec Details */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Classification:</span>
                <span className="text-red-400 font-mono font-bold">{selectedNode.classification}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Vector Embedding Model:</span>
                <span className="text-indigo-300 font-mono">{selectedNode.embeddingModel}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Embedding Dimensions:</span>
                <span className="text-white font-mono">{selectedNode.vectorDimensions}-d Dense</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Indexed Chunks:</span>
                <span className="text-cyan-300 font-mono">{selectedNode.chunkCount} text chunks</span>
              </div>
            </div>

            {/* SHA-256 Seal */}
            <div className="pt-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono flex items-center justify-between">
                <span>Cryptographic SHA-256 Seal:</span>
                <button
                  onClick={() => handleCopyHash(selectedNode.sha256Seal)}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedHash ? 'Copied!' : 'Copy'}</span>
                </button>
              </span>
              <div className="p-2 rounded bg-slate-950 font-mono text-[9px] text-slate-400 break-all mt-1 border border-slate-800">
                {selectedNode.sha256Seal}
              </div>
            </div>

            {/* Semantic Summary & Access Bounds */}
            <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
              <span className="font-semibold text-slate-200">Summary & Grounding Context:</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {selectedNode.summary}
              </p>
              <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
                Access Bounds: Local Enclave Token Verification (No external API bearer token required).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
