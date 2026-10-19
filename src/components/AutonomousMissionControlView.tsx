import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Cpu, 
  Zap, 
  Lock, 
  Check, 
  FileText, 
  ChevronRight,
  Terminal,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { ENTERPRISE_MISSION_RUNBOOKS } from '../data/missionRunbooksData.ts';
import { 
  advanceRunbookStep, 
  approveRunbookStep, 
  resetRunbook, 
  calculateRunbookStats 
} from '../utils/workflowRunbookEngine.ts';
import type { WorkflowRunbook } from '../utils/workflowRunbookEngine.ts';
import { AutonomousOperationsCenter } from './AutonomousOperationsCenter.tsx';

export const AutonomousMissionControlView: React.FC = () => {
  const [missionMode, setMissionMode] = useState<'autonomous-ops' | 'runbooks'>('autonomous-ops');
  const [selectedRunbookId, setSelectedRunbookId] = useState<string>(ENTERPRISE_MISSION_RUNBOOKS[0].id);
  const [activeRunbook, setActiveRunbook] = useState<WorkflowRunbook>(ENTERPRISE_MISSION_RUNBOOKS[0]);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState<boolean>(false);
  const [activeStepTab, setActiveStepTab] = useState<string | null>(ENTERPRISE_MISSION_RUNBOOKS[0].steps[0].id);

  // Switch runbook
  const handleSelectRunbook = (id: string) => {
    const found = ENTERPRISE_MISSION_RUNBOOKS.find(r => r.id === id);
    if (found) {
      setSelectedRunbookId(id);
      setActiveRunbook(JSON.parse(JSON.stringify(found)));
      setIsAutoAdvancing(false);
      setActiveStepTab(found.steps[0].id);
    }
  };

  // Step advancement
  const handleNextStep = () => {
    setActiveRunbook(prev => advanceRunbookStep(prev));
  };

  const handleApproveStep = (stepId: string) => {
    setActiveRunbook(prev => approveRunbookStep(prev, stepId));
  };

  const handleReset = () => {
    setIsAutoAdvancing(false);
    setActiveRunbook(prev => resetRunbook(prev));
  };

  // Auto-runner interval
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isAutoAdvancing && activeRunbook.state === 'in-progress') {
      timer = setTimeout(() => {
        setActiveRunbook(prev => advanceRunbookStep(prev));
      }, 1200);
    } else if (activeRunbook.state === 'paused-at-gate' || activeRunbook.state === 'completed') {
      setIsAutoAdvancing(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAutoAdvancing, activeRunbook]);

  const stats = calculateRunbookStats(activeRunbook);
  const selectedStep = activeRunbook.steps.find(s => s.id === activeStepTab) || activeRunbook.steps[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Mode Switcher */}
      <div className="flex rounded-xl bg-slate-900/80 p-1 border border-slate-800 max-w-2xl">
        <button
          onClick={() => setMissionMode('autonomous-ops')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            missionMode === 'autonomous-ops'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Autonomous Goal Planner & Self-Healing Sentinel</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            Advanced
          </span>
        </button>

        <button
          onClick={() => setMissionMode('runbooks')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            missionMode === 'runbooks'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Mission Runbooks & SAMP Gates</span>
        </button>
      </div>

      {missionMode === 'autonomous-ops' ? (
        <AutonomousOperationsCenter />
      ) : (
        <div className="space-y-8">
          {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Autonomous Mesh Runbook Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              SAMP Protocol v2.4 Compliant
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Mission Control: Autonomous Enterprise Runbooks
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl">
            Orchestrate multi-step autonomous agent operations across local hardware nodes with dependency graphs, 
            cryptographic state attestation, and human-in-the-loop security checkpoints.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700 hover:bg-slate-800 transition"
            aria-label="Reset Active Runbook"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Runbook
          </button>

          {activeRunbook.state !== 'completed' && (
            <button
              onClick={() => {
                if (activeRunbook.state === 'idle') {
                  setIsAutoAdvancing(true);
                  handleNextStep();
                } else if (activeRunbook.state === 'in-progress') {
                  setIsAutoAdvancing(!isAutoAdvancing);
                } else if (activeRunbook.state === 'paused-at-gate') {
                  // highlight gate
                }
              }}
              disabled={activeRunbook.state === 'paused-at-gate'}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-lg ${
                activeRunbook.state === 'paused-at-gate'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-not-allowed'
                  : isAutoAdvancing
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/20'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/25'
              }`}
              aria-label="Execute Autonomous Workflow"
            >
              <Play className="w-3.5 h-3.5" />
              {activeRunbook.state === 'idle' 
                ? 'Launch Mission' 
                : isAutoAdvancing 
                ? 'Pause Mission' 
                : 'Resume Mission'}
            </button>
          )}

          {activeRunbook.state === 'in-progress' && !isAutoAdvancing && (
            <button
              onClick={handleNextStep}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 transition"
              aria-label="Execute Single Next Step"
            >
              Step Forward
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Preset Runbook Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {ENTERPRISE_MISSION_RUNBOOKS.map(runbook => {
          const isSelected = selectedRunbookId === runbook.id;
          return (
            <div
              key={runbook.id}
              onClick={() => handleSelectRunbook(runbook.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition text-left space-y-2 ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-cyan-400">
                  {runbook.code}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  runbook.category === 'cybersecurity' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                  runbook.category === 'ma-due-diligence' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {runbook.category.replace('-', ' ')}
                </span>
              </div>
              <h2 className="text-sm font-bold text-white line-clamp-1">{runbook.title}</h2>
              <p className="text-xs text-slate-400 line-clamp-2">{runbook.description}</p>
            </div>
          );
        })}
      </div>

      {/* Real-Time Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Workflow Status</span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2.5 h-2.5 rounded-full ${
              activeRunbook.state === 'completed' ? 'bg-emerald-400 animate-pulse' :
              activeRunbook.state === 'paused-at-gate' ? 'bg-amber-400 animate-ping' :
              activeRunbook.state === 'in-progress' ? 'bg-cyan-400 animate-spin' : 'bg-slate-500'
            }`} />
            <span className="font-mono text-sm font-bold text-white capitalize">
              {activeRunbook.state.replace('-', ' ')}
            </span>
          </div>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Progress</span>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${stats.progressPercent}%` }}
              />
            </div>
            <span className="font-mono text-xs font-bold text-cyan-400">{stats.progressPercent}%</span>
          </div>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Local Tokens Generated</span>
          <span className="font-mono text-sm font-bold text-emerald-400 mt-1 block">
            {stats.totalTokens.toLocaleString()} tokens
          </span>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Mesh Latency / Execution</span>
          <span className="font-mono text-sm font-bold text-teal-300 mt-1 block">
            {stats.totalExecutionTimeMs} ms <span className="text-xs text-slate-500">(Target &lt; {activeRunbook.slaTargetSeconds}s)</span>
          </span>
        </div>
      </div>

      {/* Main Orchestration Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Step DAG Pipeline (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Autonomous Execution DAG & Dependency Chain
            </h2>
            <span className="text-xs text-slate-400">
              {stats.completedSteps} of {stats.totalSteps} Steps Complete
            </span>
          </div>

          <div className="space-y-3">
            {activeRunbook.steps.map((step, idx) => {
              const isSelected = activeStepTab === step.id;
              const isCompleted = step.status === 'completed';
              const isWaiting = step.status === 'waiting-approval';
              const isCurrent = activeRunbook.currentStepIndex === idx;

              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStepTab(step.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    isWaiting 
                      ? 'bg-amber-950/30 border-amber-500/60 shadow-lg shadow-amber-500/10' :
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/60 shadow-md' :
                    isCompleted
                      ? 'bg-slate-900/70 border-emerald-500/30' :
                      'bg-slate-900/30 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Step Number Badge */}
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                        isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        isWaiting ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' :
                        isCurrent ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`text-sm font-bold ${isWaiting ? 'text-amber-300' : 'text-white'}`}>
                            {step.name}
                          </h3>
                          {step.requiresHumanApproval && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              Approval Gate
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-400 font-mono">
                          <span className="text-cyan-400 font-semibold">{step.assignedAgent}</span>
                          <span>·</span>
                          <span className="text-slate-500">{step.model}</span>
                        </div>
                      </div>
                    </div>

                    {/* Step Status Pill */}
                    <div className="shrink-0 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold capitalize ${
                        isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        isWaiting ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {step.status}
                      </span>
                      {step.executionTimeMs && (
                        <div className="text-[10px] font-mono text-slate-500 mt-1">
                          {step.executionTimeMs}ms · {step.tokensConsumed} tok
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Human In The Loop Action Gate */}
                  {isWaiting && (
                    <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between gap-3 bg-amber-950/20 -mx-4 -mb-4 p-4 rounded-b-xl">
                      <div className="flex items-center gap-2 text-xs text-amber-300">
                        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Security Gate: Requires Cryptographic Authorization</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApproveStep(step.id);
                        }}
                        className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition flex items-center gap-1.5"
                        aria-label="Approve Security Gate"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Authorize Execution
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Step Telemetry & Cryptographic Attestation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Step Inspector & Audit Log
              </h2>
              <span className="font-mono text-xs text-cyan-400">
                {selectedStep.id}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Target Action</span>
                <span className="font-semibold text-white">{selectedStep.name}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Assigned Agent & Model</span>
                <div className="font-mono text-slate-200 bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                  <div>Agent: <span className="text-cyan-400">{selectedStep.assignedAgent}</span> ({selectedStep.assignedRole})</div>
                  <div>Engine: <span className="text-emerald-400">{selectedStep.model}</span></div>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Autonomous Execution Payload</span>
                <div className="font-mono text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed text-[11px] min-h-[70px]">
                  {selectedStep.outputPayload || (
                    <span className="text-slate-500 italic">
                      Step execution pending. Launch mission to dispatch agent prompt to Apple Silicon Neural Engine.
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">SAMP Cryptographic Chain Seal</span>
                <div className="font-mono text-cyan-300 bg-cyan-950/20 border border-cyan-800/40 p-2.5 rounded-lg flex items-center justify-between">
                  <span>{selectedStep.cryptographicHash || 'AWAITING_STEP_COMPLETION'}</span>
                  <CheckCircle2 className={`w-4 h-4 ${selectedStep.cryptographicHash ? 'text-emerald-400' : 'text-slate-600'}`} />
                </div>
              </div>
            </div>

            {/* Hardware Attestation Footer */}
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                Local Metal / MLX Kernel
              </span>
              <span className="text-emerald-400 font-mono">Zero Cloud Egress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
</div>
  );
};
