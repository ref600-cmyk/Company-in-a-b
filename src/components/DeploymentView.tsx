import React, { useState } from 'react';
import { DEPLOYMENT_TEMPLATES } from '../data/deploymentTemplates.ts';
import { 
  Terminal, 
  Copy, 
  Check, 
  Download, 
  Server, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Network,
  Share2,
  Mail
} from 'lucide-react';
import { DeploymentEmailModal } from './DeploymentEmailModal.tsx';

export const DeploymentView: React.FC = () => {
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);

  const currentFile = DEPLOYMENT_TEMPLATES[activeFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentFile.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Terminal className="w-6 h-6 text-cyan-400" />
            <span>Turnkey Mac Mini & Enterprise Cluster Blueprints</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Production-ready configuration files, launchd daemons, and bootstrap scripts to deploy SkyShadow Local-Mesh OS today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 transition-all cursor-pointer"
            aria-label="Send Deployment Link to Email"
          >
            <Mail className="w-4 h-4 text-cyan-400" />
            <span>Email Link (ref600@gmail.com)</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all cursor-pointer"
            aria-label="Copy File Content"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-cyan-400" />
                <span>Copy Current File</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all cursor-pointer font-sans shadow-md shadow-cyan-500/20"
            aria-label="Download File"
          >
            <Download className="w-4 h-4" />
            <span>Download {currentFile.filename}</span>
          </button>
        </div>
      </div>

      {/* Fleet Topology Cards */}
      <div className="space-y-3">
        <label className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
          Scalable Deployment Topologies: Small Business to Global Corporate
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 transition-all">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Cpu className="w-4 h-4" />
              <span className="text-xs font-mono font-bold uppercase">Tier 1: Single Appliance</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              1x Mac Mini M4 ($599 - $1,799)
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Plug directly into company Ethernet. Autonomous agents run 100% locally via Apple Metal / MLX.
            </p>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              Zero DevOps • Plug-and-Play
            </span>
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/20 hover:border-cyan-400 transition-all">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Network className="w-4 h-4" />
              <span className="text-xs font-mono font-bold uppercase">Tier 2: Office Thunderbolt Mesh</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              3-8x Mac Minis (Raft Mesh)
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Chained via 80Gbps Thunderbolt 5 or 10GbE. Distributed tensor parallelism & automatic agent failover.
            </p>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-900 text-cyan-300">
              High Availability • 40-100 Tok/s
            </span>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 transition-all">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Server className="w-4 h-4" />
              <span className="text-xs font-mono font-bold uppercase">Tier 3: Enterprise K8s Hybrid</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              Branch Edge + Corporate Cloud
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Mac Minis act as regional low-latency branch appliances, syncing encrypted state to central on-premise clusters.
            </p>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              Fortune 500 • Infinite Scale
            </span>
          </div>
        </div>
      </div>

      {/* Blueprint File Tabs */}
      <div className="space-y-3">
        <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-slate-800 pb-2">
          {DEPLOYMENT_TEMPLATES.map((file, idx) => {
            const isSelected = activeFileIndex === idx;
            return (
              <button
                key={file.filename}
                onClick={() => setActiveFileIndex(idx)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{file.filename}</span>
              </button>
            );
          })}
        </div>

        {/* File Description Header */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <strong className="text-white">{currentFile.title}:</strong>{' '}
            <span className="text-slate-400">{currentFile.description}</span>
          </div>
          <span className="font-mono text-[10px] uppercase text-cyan-400 font-semibold">
            {currentFile.language}
          </span>
        </div>

        {/* Code Content Container */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
          <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>{currentFile.filename}</span>
            <span>{currentFile.content.split('\n').length} lines</span>
          </div>
          <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed max-h-[500px]">
            <code>{currentFile.content}</code>
          </pre>
        </div>
      </div>

      <DeploymentEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        defaultEmail="ref600@gmail.com"
      />
    </div>
  );
};
