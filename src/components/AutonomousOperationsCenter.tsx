import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Pause, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  ArrowRight, 
  Clock, 
  Activity, 
  RefreshCw,
  Search,
  Check,
  ChevronRight,
  ShieldAlert,
  Server,
  Network,
  Radio,
  FileCheck2
} from 'lucide-react';
import { 
  decomposeAutonomousGoal, 
  advanceAutonomousStep, 
  triggerSelfHealingRemediation, 
  tickAutonomousDaemons,
  PRESET_AUTONOMOUS_GOALS,
  INITIAL_EDGE_NODES,
  INITIAL_AUTONOMOUS_DAEMONS,
  type AutonomousDAG,
  type AutonomousTask,
  type ChaosEventType,
  type EdgeNodeHealth,
  type SelfHealingAction,
  type AutonomousDaemon
} from '../utils/autonomousOperationsEngine.ts';

export const AutonomousOperationsCenter: React.FC = () => {
  // Goal and DAG State
  const [goalInput, setGoalInput] = useState<string>(PRESET_AUTONOMOUS_GOALS[0].prompt);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_AUTONOMOUS_GOALS[0].id);
  const [activeDag, setActiveDag] = useState<AutonomousDAG>(() => 
    decomposeAutonomousGoal(PRESET_AUTONOMOUS_GOALS[0].prompt)
  );
  const [isAutoAdvancing, setIsAutoAdvancing] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(() => activeDag.tasks[0]?.id || '');

  // Self-Healing Sentinel State
  const [nodes, setNodes] = useState<EdgeNodeHealth[]>(INITIAL_EDGE_NODES);
  const [healingLogs, setHealingLogs] = useState<SelfHealingAction[]>([
    {
      id: 'ACT-INIT-01',
      eventType: 'vram-spike',
      triggerTime: '12s ago',
      detectedAnomaly: 'Simulated KV cache allocation surge during multi-document vector ingest.',
      remediationPlan: 'Autonomous KV cache pruning executed; 38.2GB freed in 38ms.',
      migratedTasks: ['Task-Embedding-Chunker'],
      vramFreedGb: 38.2,
      resolutionTimeMs: 38,
      status: 'mitigated'
    }
  ]);
  const [activeChaosEvent, setActiveChaosEvent] = useState<ChaosEventType | null>(null);

  // Daemons State
  const [daemons, setDaemons] = useState<AutonomousDaemon[]>(INITIAL_AUTONOMOUS_DAEMONS);

  // Handle Preset Selection
  const handleSelectPreset = (preset: typeof PRESET_AUTONOMOUS_GOALS[0]) => {
    setSelectedPresetId(preset.id);
    setGoalInput(preset.prompt);
    const newDag = decomposeAutonomousGoal(preset.prompt);
    setActiveDag(newDag);
    setSelectedTaskId(newDag.tasks[0]?.id || '');
    setIsAutoAdvancing(false);
  };

  // Handle Custom Decomposition
  const handleDecomposeCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) return;
    const newDag = decomposeAutonomousGoal(goalInput);
    setActiveDag(newDag);
    setSelectedTaskId(newDag.tasks[0]?.id || '');
    setIsAutoAdvancing(false);
  };

  // Step Advancement
  const handleStepForward = () => {
    setActiveDag(prev => advanceAutonomousStep(prev));
  };

  // Reset DAG
  const handleResetDag = () => {
    setIsAutoAdvancing(false);
    const reset = decomposeAutonomousGoal(activeDag.goal);
    setActiveDag(reset);
    setSelectedTaskId(reset.tasks[0]?.id || '');
  };

  // Auto-runner loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isAutoAdvancing && activeDag.status !== 'completed') {
      timer = setTimeout(() => {
        setActiveDag(prev => advanceAutonomousStep(prev));
      }, 1100);
    } else if (activeDag.status === 'completed') {
      setIsAutoAdvancing(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAutoAdvancing, activeDag]);

  // Handle Chaos Trigger
  const handleTriggerChaos = (eventType: ChaosEventType) => {
    setActiveChaosEvent(eventType);
    const { updatedNodes, action } = triggerSelfHealingRemediation(eventType, nodes);
    setNodes(updatedNodes);
    setHealingLogs(prev => [action, ...prev.slice(0, 9)]);
    setTimeout(() => {
      setActiveChaosEvent(null);
    }, 1500);
  };

  // Handle Daemon Tick
  const handleTickDaemons = () => {
    setDaemons(prev => tickAutonomousDaemons(prev));
  };

  const selectedTask = activeDag.tasks.find(t => t.id === selectedTaskId) || activeDag.tasks[0];
  const completedTaskCount = activeDag.tasks.filter(t => t.status === 'completed' || t.status === 'healed').length;
  const progressPercent = Math.round((completedTaskCount / activeDag.tasks.length) * 100);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 p-6 md:p-8 shadow-xl shadow-cyan-950/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Advanced Autonomous Operations Engine (AEO)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-950/50 text-emerald-400 border border-emerald-800/40">
                <Radio className="w-3.5 h-3.5" />
                SAMP Cognitive Loop Active
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-blue-950/50 text-blue-400 border border-blue-800/40">
                <Zap className="w-3.5 h-3.5" />
                Zero-Cloud Self-Healing
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Autonomous Goal Decomposition & Self-Healing Sentinel
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Formulate multi-agent dependency DAGs directly from high-level enterprise intent. Inspect real-time 5-stage cognitive traces (Perception &rarr; Reasoning &rarr; Action &rarr; Verification &rarr; Reflection) and simulate edge chaos events with sub-millisecond self-healing failover.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleResetDag}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset DAG</span>
            </button>

            {activeDag.status !== 'completed' ? (
              <button
                onClick={() => setIsAutoAdvancing(!isAutoAdvancing)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer font-sans ${
                  isAutoAdvancing
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/25'
                }`}
              >
                {isAutoAdvancing ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause Autonomous Run</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Auto-Execute DAG</span>
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Mission Attested & Completed</span>
              </div>
            )}

            {activeDag.status !== 'completed' && !isAutoAdvancing && (
              <button
                onClick={handleStepForward}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 transition-all cursor-pointer"
              >
                <span>Step Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 1: Goal Input & Preset Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Select Enterprise Autonomous Objective or Enter Custom Intent</span>
          </label>
          <span className="text-xs text-slate-400 font-mono">
            Category: <strong className="text-white uppercase">{activeDag.category.replace('-', ' ')}</strong>
          </span>
        </div>

        {/* Preset Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESET_AUTONOMOUS_GOALS.map(preset => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-950/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold uppercase">
                    {preset.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {preset.taskCount} Subtasks
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                  {preset.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {preset.prompt}
                </p>
              </button>
            );
          })}
        </div>

        {/* Custom Goal Form */}
        <form onSubmit={handleDecomposeCustom} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="Enter high-level autonomous goal (e.g., 'Autonomous air-gapped forensic audit across local cluster')..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Decompose Goal</span>
          </button>
        </form>
      </div>

      {/* SECTION 2: Dynamic Execution DAG & Cognitive Trace Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual DAG Flow (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Autonomous Execution DAG Flow</h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">Progress:</span>
                <span className="font-bold text-cyan-400">{progressPercent}%</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">Tokens:</span>
                <span className="font-bold text-emerald-400 font-mono">{activeDag.tokensGenerated}</span>
              </div>
            </div>

            {/* Task DAG Cards */}
            <div className="space-y-3">
              {activeDag.tasks.map((task, idx) => {
                const isSelected = selectedTaskId === task.id;
                const isCompleted = task.status === 'completed' || task.status === 'healed';
                const isActing = task.status === 'acting';

                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 relative overflow-hidden ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/30 shadow-md shadow-cyan-950/40'
                        : isCompleted
                        ? 'border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/50'
                        : isActing
                        ? 'border-cyan-500 bg-cyan-950/40 animate-pulse'
                        : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                          isCompleted
                            ? 'bg-emerald-500 text-slate-950'
                            : isActing
                            ? 'bg-cyan-500 text-slate-950 animate-spin'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isCompleted ? '✓' : idx + 1}
                        </span>
                        <span className="font-bold text-white text-xs">{task.title}</span>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        <span className={`px-2 py-0.5 rounded uppercase font-semibold ${
                          task.hardwareTarget === 'metal-gpu'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800/60'
                            : task.hardwareTarget === 'neural-engine'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800/60'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {task.hardwareTarget.toUpperCase()}
                        </span>

                        <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                          isCompleted
                            ? 'bg-emerald-950 text-emerald-400'
                            : isActing
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-500'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed pl-7">
                      {task.description}
                    </p>

                    <div className="flex items-center justify-between pl-7 text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                      <span>Agent: <strong className="text-cyan-300">{task.assignedAgent}</strong></span>
                      <span>Model: <code className="text-slate-300">{task.model.split('-')[0]}</code></span>
                      <span>Latency: <strong className="text-slate-200">{task.executionTimeMs}ms</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: 5-Stage Cognitive Loop Trace (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">5-Stage Cognitive Loop Trace</h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
                {selectedTask.id}
              </span>
            </div>

            {/* Cognitive Stages */}
            <div className="space-y-3 font-mono text-xs">
              {/* Stage 1: Perception */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-cyan-400 font-bold text-[11px]">
                  <span>1. PERCEPTION</span>
                  <span className="text-slate-500 font-normal">Environment & Memory Probe</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedTask.cognitiveTrace.perception}
                </p>
              </div>

              {/* Stage 2: Reasoning */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-indigo-400 font-bold text-[11px]">
                  <span>2. REASONING</span>
                  <span className="text-slate-500 font-normal">Local Chain-of-Thought</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedTask.cognitiveTrace.reasoning}
                </p>
              </div>

              {/* Stage 3: Action */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-amber-400 font-bold text-[11px]">
                  <span>3. ACTION & SANDBOX EXECUTION</span>
                  <span className="text-slate-500 font-normal">Zero-Cloud Jail</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedTask.cognitiveTrace.action}
                </p>
              </div>

              {/* Stage 4: Verification */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-emerald-400 font-bold text-[11px]">
                  <span>4. VERIFICATION</span>
                  <span className="text-emerald-300 font-bold">
                    Score: {selectedTask.cognitiveTrace.verification.score}%
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Guardrail: <code className="text-emerald-300">{selectedTask.cognitiveTrace.verification.guardrailChecked}</code>
                </p>
              </div>

              {/* Stage 5: Reflection */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-cyan-300 font-bold text-[11px]">
                  <span>5. REFLECTION & IMMUTABLE SEAL</span>
                  <span className="text-slate-500 font-normal">Self-Correction State</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedTask.cognitiveTrace.reflection}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Autonomous Self-Healing Sentinel & Chaos Sandbox */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h2 className="text-base font-bold text-white">
                Autonomous Self-Healing Sentinel & Chaos Recovery Simulator
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Test zero-downtime automated failover, dynamic KV cache pruning, and Raft consensus task migration under simulated stress.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Inject Chaos:</span>
            <button
              onClick={() => handleTriggerChaos('vram-spike')}
              className="px-3 py-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800/80 text-xs font-semibold cursor-pointer active:scale-95 transition-all"
            >
              VRAM Spike (&gt;90%)
            </button>
            <button
              onClick={() => handleTriggerChaos('node-disconnect')}
              className="px-3 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900 text-amber-300 border border-amber-800/80 text-xs font-semibold cursor-pointer active:scale-95 transition-all"
            >
              Node Drop Offline
            </button>
            <button
              onClick={() => handleTriggerChaos('guardrail-anomaly')}
              className="px-3 py-1.5 rounded-lg bg-purple-950/70 hover:bg-purple-900 text-purple-300 border border-purple-800/80 text-xs font-semibold cursor-pointer active:scale-95 transition-all"
            >
              Prompt Injection
            </button>
            <button
              onClick={() => handleTriggerChaos('tb5-latency-jitter')}
              className="px-3 py-1.5 rounded-lg bg-blue-950/70 hover:bg-blue-900 text-blue-300 border border-blue-800/80 text-xs font-semibold cursor-pointer active:scale-95 transition-all"
            >
              TB5 Bus Jitter
            </button>
          </div>
        </div>

        {/* 3 Edge Nodes Health Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nodes.map(node => {
            const vramPercent = Math.round((node.usedVramGb / node.totalVramGb) * 100);
            return (
              <div 
                key={node.id} 
                className={`p-4 rounded-xl border bg-slate-950/80 space-y-3 transition-all ${
                  node.status === 'critical' ? 'border-rose-500 bg-rose-950/20' :
                  node.status === 'warning' ? 'border-amber-500 bg-amber-950/20' :
                  node.status === 'rebalancing' ? 'border-cyan-500 animate-pulse' :
                  'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{node.name}</span>
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    node.status === 'healthy' ? 'bg-emerald-950 text-emerald-400' :
                    node.status === 'warning' ? 'bg-amber-950 text-amber-400' :
                    node.status === 'rebalancing' ? 'bg-cyan-950 text-cyan-300' :
                    'bg-rose-950 text-rose-400'
                  }`}>
                    {node.status}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-400">
                  {node.chip}
                </div>

                {/* VRAM Meter */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Unified VRAM:</span>
                    <span className="text-slate-200">{node.usedVramGb.toFixed(1)}GB / {node.totalVramGb}GB ({vramPercent}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        vramPercent > 85 ? 'bg-rose-500' : vramPercent > 65 ? 'bg-amber-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${vramPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-900">
                  <span>Active Agents: <strong className="text-cyan-400">{node.activeAgents}</strong></span>
                  <span>Thermal: <strong className="text-slate-200">{node.temperatureC}&deg;C</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Self-Healing Resolution Audit Stream */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
            Automated Self-Healing Resolution Stream
          </label>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 max-h-48 overflow-y-auto font-mono text-xs">
            {healingLogs.map(log => (
              <div key={log.id} className="p-2 rounded bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-rose-400 font-bold">[{log.eventType.toUpperCase()}]</span>
                    <span className="text-slate-300">{log.detectedAnomaly}</span>
                  </div>
                  <div className="text-emerald-400 text-[11px]">
                    &rarr; {log.remediationPlan}
                  </div>
                </div>
                <div className="text-right shrink-0 text-[10px] text-slate-400">
                  <span className="text-cyan-400 font-bold">{log.resolutionTimeMs}ms</span>
                  <div>{log.triggerTime}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: Autonomous Background Daemons Watchdog */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Autonomous Background Daemons Watchdog</h3>
              <p className="text-xs text-slate-400">Continuous edge cron jobs executing without external telemetry.</p>
            </div>
          </div>

          <button
            onClick={handleTickDaemons}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 text-xs font-semibold cursor-pointer active:scale-95 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Trigger Concurrency Tick</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {daemons.map(daemon => (
            <div key={daemon.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{daemon.name}</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  Every {daemon.intervalSec}s
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {daemon.description}
              </p>
              <div className="p-2 rounded bg-slate-900 border border-slate-800/80 font-mono text-[11px] text-emerald-300">
                &gt; {daemon.lastAction}
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                <span>Total Autonomous Runs: <strong className="text-slate-300">{daemon.totalRuns}</strong></span>
                <span>Last Executed: <strong className="text-slate-300">{daemon.lastRun}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
