import React, { useState, useEffect, useRef } from 'react';
import { PREBUILT_MISSIONS, DEFAULT_AGENTS } from '../data/defaultAgents.ts';
import { 
  createInitialSwarmState, 
  advanceSwarmStep, 
  approvePendingStep, 
  SwarmExecutionState 
} from '../utils/swarmEngine.ts';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  Bot,
  Copy,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const LiveSwarmView: React.FC = () => {
  const [selectedMissionId, setSelectedMissionId] = useState<string>('mission-sec-audit');
  const [isRunningAuto, setIsRunningAuto] = useState<boolean>(false);
  const [copiedLog, setCopiedLog] = useState<boolean>(false);

  const activeMission = PREBUILT_MISSIONS.find(m => m.id === selectedMissionId) || PREBUILT_MISSIONS[0];
  const [swarmState, setSwarmState] = useState<SwarmExecutionState>(() => createInitialSwarmState(activeMission));
  const logsEndRef = useRef<HTMLDivElement>(null);

  // When changing mission, re-initialize
  const handleSelectMission = (missionId: string) => {
    setSelectedMissionId(missionId);
    const mission = PREBUILT_MISSIONS.find(m => m.id === missionId) || PREBUILT_MISSIONS[0];
    setSwarmState(createInitialSwarmState(mission));
    setIsRunningAuto(false);
  };

  const handleReset = () => {
    setIsRunningAuto(false);
    setSwarmState(createInitialSwarmState(activeMission));
  };

  const handleStepOnce = () => {
    setSwarmState(prev => advanceSwarmStep(prev, activeMission, DEFAULT_AGENTS));
  };

  const handleApprove = () => {
    setSwarmState(prev => approvePendingStep(prev, activeMission, DEFAULT_AGENTS));
  };

  // Auto-run loop
  useEffect(() => {
    let timer: any;
    if (isRunningAuto && swarmState.status !== 'completed' && swarmState.status !== 'paused_approval') {
      timer = setTimeout(() => {
        setSwarmState(prev => {
          const nextState = advanceSwarmStep(prev, activeMission, DEFAULT_AGENTS);
          if (nextState.status === 'completed' || nextState.status === 'paused_approval') {
            setIsRunningAuto(false);
          }
          return nextState;
        });
      }, 1400);
    }
    return () => clearTimeout(timer);
  }, [isRunningAuto, swarmState.status, activeMission]);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [swarmState.logs]);

  const handleCopyLogs = () => {
    const text = swarmState.logs.map(l => `[${l.timestamp}] [${l.agentName}]: ${l.message} ${l.detail ? `\n> ${l.detail}` : ''}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title & Mission Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <span>SkyShadow Autonomous Multi-Agent Swarm Sandbox</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulate and watch collaborative autonomous agents execute high-stakes corporate missions with local tool sandboxing and Human-in-the-Loop checkpoints.
          </p>
        </div>

        {/* Swarm Controls */}
        <div className="flex items-center gap-2">
          {swarmState.status !== 'completed' && (
            <button
              onClick={() => setIsRunningAuto(!isRunningAuto)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold shadow-md transition-all cursor-pointer ${
                isRunningAuto
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
              }`}
              aria-label={isRunningAuto ? 'Pause Swarm' : 'Start Autonomous Loop'}
            >
              {isRunningAuto ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Swarm</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Autonomous Swarm</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={handleStepOnce}
            disabled={isRunningAuto || swarmState.status === 'completed' || swarmState.status === 'paused_approval'}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white border border-slate-700 transition-all cursor-pointer"
            aria-label="Step Once"
          >
            Step Forward
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all cursor-pointer"
            aria-label="Reset Swarm"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mission Select Buttons */}
      <div className="space-y-2">
        <label className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
          Select Autonomous Enterprise Mission:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PREBUILT_MISSIONS.map((mission) => {
            const isSelected = mission.id === selectedMissionId;
            return (
              <button
                key={mission.id}
                onClick={() => handleSelectMission(mission.id)}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/30 shadow-lg shadow-cyan-950/40'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="text-[10px] font-mono text-cyan-400 font-semibold mb-1">
                  {mission.category}
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">
                  {mission.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {mission.description}
                </p>
                <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-slate-500">
                  <span>{mission.steps.length} Autonomous Steps</span>
                  <span>•</span>
                  <span>{mission.participatingAgents.length} Agents</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Agents Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
            Participating Agents in Active Mission
          </label>
          <span className="text-xs font-mono text-slate-400">
            Step {swarmState.currentStepIndex} of {swarmState.totalSteps}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeMission.participatingAgents.map((agentId) => {
            const agent = DEFAULT_AGENTS.find(a => a.id === agentId);
            if (!agent) return null;
            const isActive = swarmState.activeAgentId === agent.id;
            const isPaused = swarmState.status === 'paused_approval' && swarmState.pendingApproval?.agentName === agent.name;

            return (
              <div
                key={agent.id}
                className={`p-4 rounded-xl border transition-all relative ${
                  isPaused
                    ? 'border-amber-400 bg-amber-950/30'
                    : isActive
                    ? 'border-cyan-400 bg-cyan-950/20 shadow-md shadow-cyan-500/20'
                    : 'border-slate-800 bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {agent.name}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        {agent.role}
                      </span>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div>
                    {isPaused ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                        Awaiting Approval
                      </span>
                    ) : isActive ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        Executing
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                        Idle / Ready
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span>Model: {agent.model.split(' ')[0]}</span>
                  <span className="text-cyan-400/90">{agent.permissionLevel}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Human-in-the-Loop Security Gate Warning Banner */}
      {swarmState.status === 'paused_approval' && swarmState.pendingApproval && (
        <div className="p-6 rounded-2xl border-2 border-amber-500/60 bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 shadow-xl space-y-4 animate-bounce-short">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
                  Human-in-the-Loop Security Gate Triggered
                </span>
                <h3 className="text-lg font-bold text-white">
                  Action Requires Supervisor Authorization
                </h3>
                <p className="text-xs text-slate-300">
                  Autonomous agent <strong>{swarmState.pendingApproval.agentName}</strong> requested permission to perform a high-consequence system action:
                </p>
                <div className="p-3 rounded-lg bg-slate-950 border border-amber-900/50 font-mono text-xs text-amber-200 mt-2">
                  <strong>Action:</strong> {swarmState.pendingApproval.action}
                  <div className="mt-1 text-slate-400 text-[11px]">
                    <strong>Payload:</strong> {swarmState.pendingApproval.details}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <button
                onClick={handleApprove}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                aria-label="Approve Checkpoint"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Authorize & Continue</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                aria-label="Reject / Halt"
              >
                <span>Halt Mission</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Banner */}
      {swarmState.status === 'completed' && (
        <div className="p-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-base font-bold text-white">
                Mission Completed with Zero Data Exfiltration
              </h4>
              <p className="text-xs text-slate-300">
                All {swarmState.totalSteps} steps completed locally. {swarmState.totalTokensGenerated} tokens generated across local Apple Silicon cores.
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all cursor-pointer"
          >
            Re-run Mission
          </button>
        </div>
      )}

      {/* Live Autonomous Event Stream & Terminal Log */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-semibold text-white">
              Local-Mesh Autonomous Event Bus
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/40 font-mono">
              air-gapped • local
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              Tokens: <strong className="text-cyan-300">{swarmState.totalTokensGenerated}</strong>
            </span>
            <button
              onClick={handleCopyLogs}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedLog ? 'Copied!' : 'Copy Transcript'}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Log Stream */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-3 font-mono text-xs">
          {swarmState.logs.map((log) => {
            const isTool = log.level === 'tool';
            const isWarning = log.level === 'warning';
            const isSuccess = log.level === 'success';

            return (
              <div
                key={log.id}
                className={`p-3 rounded-xl border transition-all ${
                  isWarning
                    ? 'border-amber-900/60 bg-amber-950/20 text-amber-200'
                    : isSuccess
                    ? 'border-emerald-900/60 bg-emerald-950/20 text-emerald-200'
                    : isTool
                    ? 'border-cyan-900/50 bg-cyan-950/10 text-cyan-200'
                    : 'border-slate-800/60 bg-slate-900/30 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-cyan-400">
                      [{log.agentName}]
                    </span>
                    <span>{log.timestamp}</span>
                  </div>
                  <span className="uppercase text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                    {log.level}
                  </span>
                </div>
                <div className="font-medium text-slate-100">
                  {log.message}
                </div>
                {log.detail && (
                  <div className="mt-1.5 pt-1.5 border-t border-slate-800/60 text-slate-400 text-[11px] break-all">
                    ↳ {log.detail}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
};
