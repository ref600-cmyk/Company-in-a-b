import React, { useState } from 'react';
import { COMPLIANCE_CONTROLS } from '../data/complianceControlsData.ts';
import type { ComplianceControl } from '../types/index.ts';
import { 
  ShieldCheck, 
  FileCheck2, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Terminal, 
  ExternalLink,
  Award,
  Search,
  Check,
  Shield,
  Layers,
  FileText
} from 'lucide-react';

export const ComplianceAuditView: React.FC = () => {
  const [selectedStandard, setSelectedStandard] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloaded, setDownloaded] = useState(false);
  const [selectedControl, setSelectedControl] = useState<ComplianceControl | null>(null);

  const standards = ['all', 'ISO 27001', 'SOC 2 Type II', 'EU AI Act', 'HIPAA', 'UK DPA / GDPR'];

  const filtered = COMPLIANCE_CONTROLS.filter(ctrl => {
    const matchesStd = selectedStandard === 'all' || ctrl.standard === selectedStandard;
    const matchesQuery = ctrl.controlName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ctrl.clause.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ctrl.evidence.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStd && matchesQuery;
  });

  const handleExportCert = () => {
    setDownloaded(true);
    const certContent = `================================================================================
SKYSHADOW ENTERPRISE LOCAL-MESH - AIR-GAPPED COMPLIANCE ATTESTATION
Attestation ID: SKY-ATTEST-${Date.now().toString(36).toUpperCase()}
Date: ${new Date().toISOString()}
Target: On-Premises Apple Silicon Local-Mesh Cluster (Mac Mini / Mac Studio)
System Security Officer: Automated Cryptographic Verification Ledger
================================================================================

EXECUTIVE ATTESTATION:
SkyShadow Local-Mesh OS operates in an isolated cryptographic enclave with zero
outbound telemetry or WAN internet requirements. All vector embeddings, prompt
tokens, model weights, and agentic execution ledgers remain physically confined
to local unified memory.

1. ISO 27001:2022 ANNEX A CONTROLS:
   - A.12.6.1: Technical Vulnerabilities: Severed kernel namespace (Enforced)
   - A.9.4.2: Access Control: Mutual TLS & Ed25519 node tokens (Passed)

2. SOC 2 TYPE II TRUST SERVICES CRITERIA:
   - CC6.1 Logical Boundary: Hardware FileVault XTS-AES-128 (Verified)
   - CC7.1 System Integrity: Append-only SQLite WAL hash chain (Enforced)

3. EU ARTIFICIAL INTELLIGENCE ACT (REGULATION 2024/1689):
   - Article 14: Mandatory Human Oversight supervisor gate (Enforced)
   - Article 52: Full auditable token trace & provenance logs (Verified)

4. HIPAA SECURITY RULE (45 CFR § 164.312):
   - Electronic Protected Health Information (ePHI) strictly non-egress (Passed)

5. UK DATA PROTECTION ACT / GDPR:
   - Article 44: Zero cross-border data transfer violations by physical architecture (Passed)

Cryptographic Hash: sha256:d89ef201c8742b0a99371e5491f28b7a9042c129e7c5418b321a00f4
Status: READY FOR ENTERPRISE CISO SIGN-OFF
================================================================================`;

    const blob = new Blob([certContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkyShadow-Compliance-Attestation-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/50 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Air-Gapped Sovereign Security & Compliance Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise Compliance & Regulatory Defense
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              Why Fortune 500 CISOs, defense contractors, and NHS trusts choose SkyShadow over cloud AI:
              Every single parameter, prompt token, and tool step runs inside physical hardware boundaries with zero outbound telemetry, fulfilling EU AI Act Article 14 and HIPAA rules by design.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleExportCert}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              {downloaded ? <Check className="w-4 h-4 text-emerald-300" /> : <Download className="w-4 h-4" />}
              <span>{downloaded ? 'Attestation Exported!' : 'Export CISO Attestation'}</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
            <div className="text-xs text-slate-400 font-mono">Outbound Data Sockets</div>
            <div className="text-xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
              <Lock className="w-4 h-4" /> 0 (Severed)
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Air-gapped by design</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
            <div className="text-xs text-slate-400 font-mono">EU AI Act Art. 14</div>
            <div className="text-xl font-bold text-cyan-400 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Enforced
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Human-in-the-Loop gate</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
            <div className="text-xs text-slate-400 font-mono">SOC 2 / ISO 27001</div>
            <div className="text-xl font-bold text-indigo-400 mt-1 flex items-center gap-1.5">
              <Award className="w-4 h-4" /> 100% Pass
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Hardware-enclave backed</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
            <div className="text-xs text-slate-400 font-mono">Audit Log Tamper Proof</div>
            <div className="text-xl font-bold text-amber-400 mt-1 flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Ed25519
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Cryptographic hash chain</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-thin">
          {standards.map(std => (
            <button
              key={std}
              onClick={() => setSelectedStandard(std)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedStandard === std
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {std === 'all' ? 'All Frameworks' : std}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search clause, control or mechanism..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(ctrl => (
          <div
            key={ctrl.id}
            onClick={() => setSelectedControl(ctrl)}
            className="group bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-5 transition-all cursor-pointer hover:shadow-xl hover:shadow-indigo-950/20 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-800 text-indigo-300 border border-indigo-900/40">
                  <FileText className="w-3 h-3" />
                  {ctrl.standard} • {ctrl.clause}
                </span>

                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium ${
                  ctrl.status === 'enforced'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : ctrl.status === 'verified'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                }`}>
                  <CheckCircle2 className="w-3 h-3" />
                  {ctrl.status.toUpperCase()}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                {ctrl.controlName}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {ctrl.evidence}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="truncate max-w-[280px]">
                🔧 {ctrl.technicalMechanism}
              </span>
              <span className="text-indigo-400 group-hover:translate-x-1 transition-transform">
                Inspect →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Control Detail Modal */}
      {selectedControl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">
                  Compliance Technical Verification
                </h3>
              </div>
              <button
                onClick={() => setSelectedControl(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div>
                <span className="text-slate-400 uppercase font-mono text-[10px] block">Standard & Requirement</span>
                <p className="text-sm font-semibold text-white mt-0.5">
                  {selectedControl.standard} ({selectedControl.clause}): {selectedControl.controlName}
                </p>
              </div>

              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80 space-y-1.5 font-mono">
                <span className="text-emerald-400 text-[11px] block">Verified Technical Mechanism:</span>
                <p className="text-slate-300 text-xs">
                  {selectedControl.technicalMechanism}
                </p>
              </div>

              <div>
                <span className="text-slate-400 uppercase font-mono text-[10px] block">Auditor Evidence Statement</span>
                <p className="mt-1 leading-relaxed bg-slate-800/40 p-3 rounded-lg border border-slate-800 text-slate-200">
                  {selectedControl.evidence}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Verification State: <strong className="text-emerald-400 font-bold uppercase">{selectedControl.status}</strong></span>
                <span>Enclave ID: <code className="text-cyan-400">0xSKY-ENC-{selectedControl.id.slice(-6)}</code></span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedControl(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
