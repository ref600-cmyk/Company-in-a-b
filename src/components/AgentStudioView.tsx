import React, { useState, useEffect } from 'react';
import { AgentRole } from '../types/index.ts';
import { DEFAULT_AGENTS } from '../data/defaultAgents.ts';
import { 
  Bot, 
  Plus, 
  Trash2, 
  Shield, 
  Terminal, 
  Cpu, 
  CheckCircle2, 
  Key, 
  Settings2,
  Sparkles,
  Database
} from 'lucide-react';

const AVAILABLE_TOOLS = [
  { id: 'bash_sandbox', name: 'Isolated Bash Sandbox', category: 'DevOps' },
  { id: 'git_clone_branch', name: 'Git Branch & Commit', category: 'DevOps' },
  { id: 'ast_security_scan', name: 'AST Code Security Scanner', category: 'Security' },
  { id: 'sqlite_erp_query', name: 'Local SQLite & ERP Query', category: 'Data' },
  { id: 'pdf_extractor', name: 'Local Multi-Modal PDF OCR', category: 'Data' },
  { id: 'lancedb_upsert', name: 'LanceDB Local Vector Store', category: 'Memory' },
  { id: 'iban_validator', name: 'IBAN & Banking Validation', category: 'Finance' },
  { id: 'webhook_receiver', name: 'Inbound Webhook Listener', category: 'Network' },
  { id: 'task_dispatch', name: 'Orchestrator Task Dispatcher', category: 'Core' }
];

export const AgentStudioView: React.FC = () => {
  const [agents, setAgents] = useState<AgentRole[]>(() => {
    try {
      const saved = localStorage.getItem('skyshadow_custom_agents');
      return saved ? JSON.parse(saved) : DEFAULT_AGENTS;
    } catch {
      return DEFAULT_AGENTS;
    }
  });

  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || 'agent-orion');
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  // New Agent Form state
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDepartment, setNewDepartment] = useState<AgentRole['department']>('Engineering');
  const [newModel, setNewModel] = useState('Qwen-2.5-Coder-14B (MLX)');
  const [newPermission, setNewPermission] = useState<AgentRole['permissionLevel']>('Autonomous');
  const [newSystemPrompt, setNewSystemPrompt] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>(['bash_sandbox', 'git_clone_branch']);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('skyshadow_custom_agents', JSON.stringify(agents));
  }, [agents]);

  const activeAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRole.trim()) return;

    const newAgent: AgentRole = {
      id: `agent-custom-${Date.now()}`,
      name: newName.trim(),
      role: newRole.trim(),
      department: newDepartment,
      avatar: 'bot',
      model: newModel,
      memoryQuotaMB: 4096,
      permissionLevel: newPermission,
      systemPrompt: newSystemPrompt.trim() || `You are ${newName}, specialized in ${newRole}. Operate strictly within local hardware bounds.`,
      tools: selectedTools,
      status: 'idle'
    };

    setAgents(prev => [...prev, newAgent]);
    setSelectedAgentId(newAgent.id);
    setIsAddingNew(false);
    // Reset form
    setNewName('');
    setNewRole('');
    setNewSystemPrompt('');
  };

  const handleDeleteAgent = (id: string) => {
    if (agents.length <= 1) return;
    setAgents(prev => prev.filter(a => a.id !== id));
    if (selectedAgentId === id) {
      setSelectedAgentId(agents[0].id);
    }
  };

  const toggleTool = (toolId: string) => {
    setSelectedTools(prev => 
      prev.includes(toolId) ? prev.filter(t => t !== toolId) : [...prev, toolId]
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-cyan-400" />
            <span>SkyShadow Agent Studio & Role Mesh</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Define, customize, and configure autonomous specialist agents with hardware memory quotas and tool access levels.
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 transition-all cursor-pointer font-sans"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Agent</span>
        </button>
      </div>

      {/* Main Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Agent Roster List */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
            Mesh Agent Roster ({agents.length})
          </label>
          <div className="space-y-2">
            {agents.map((agent) => {
              const isSelected = agent.id === selectedAgentId && !isAddingNew;
              return (
                <button
                  key={agent.id}
                  onClick={() => {
                    setSelectedAgentId(agent.id);
                    setIsAddingNew(false);
                  }}
                  className={`w-full p-3.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/30 shadow-md shadow-cyan-950/40'
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {agent.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {agent.department} • {agent.role}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                    agent.permissionLevel === 'Critical Checkpoint'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {agent.permissionLevel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Details or Create Form */}
        <div className="lg:col-span-2">
          {isAddingNew ? (
            /* Create Form */
            <form onSubmit={handleCreateAgent} className="p-6 rounded-2xl border border-cyan-500/40 bg-slate-900/70 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Configure New Autonomous Agent</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sentinel, LedgerBot, Lex"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Contract Compliance Auditor"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Department
                  </label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Finance">Finance</option>
                    <option value="Security">Security</option>
                    <option value="Executive">Executive</option>
                    <option value="Operations">Operations</option>
                    <option value="Research">Research</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Local Foundation Model (Apple MLX)
                  </label>
                  <select
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Qwen-2.5-Coder-14B (MLX)">Qwen-2.5-Coder-14B (MLX 4-bit)</option>
                    <option value="DeepSeek-R1-Distill-14B (MLX)">DeepSeek-R1-Distill-14B (MLX)</option>
                    <option value="Qwen-2.5-32B (MLX)">Qwen-2.5-32B (MLX 4-bit)</option>
                    <option value="Llama-3.3-70B (MLX 4-bit)">Llama-3.3-70B (MLX 4-bit)</option>
                    <option value="Llama-3.1-8B (MLX)">Llama-3.1-8B (MLX)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Autonomous Governance Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Supervised', 'Autonomous', 'Critical Checkpoint'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setNewPermission(level)}
                      className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                        newPermission === level
                          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  System Directive & Grounding Prompt
                </label>
                <textarea
                  rows={3}
                  value={newSystemPrompt}
                  onChange={(e) => setNewSystemPrompt(e.target.value)}
                  placeholder="You are an autonomous corporate agent. Your objectives are..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              {/* Tool Grants */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-2">
                  Sandboxed Tools Access
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AVAILABLE_TOOLS.map((t) => {
                    const isGranted = selectedTools.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleTool(t.id)}
                        className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                          isGranted
                            ? 'border-cyan-500/60 bg-cyan-950/30 text-cyan-200'
                            : 'border-slate-800 bg-slate-950 text-slate-400'
                        }`}
                      >
                        <span>{t.name}</span>
                        {isGranted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded border border-slate-700" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all cursor-pointer font-sans shadow-lg shadow-cyan-500/20"
              >
                Register Agent in Local-Mesh Core
              </button>
            </form>
          ) : activeAgent ? (
            /* Active Agent Inspection Panel */
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-6">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-950/60">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {activeAgent.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Department: <span className="text-cyan-300">{activeAgent.department}</span> • Role: {activeAgent.role}
                    </p>
                  </div>
                </div>

                {agents.length > 1 && (
                  <button
                    onClick={() => handleDeleteAgent(activeAgent.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/20 transition-all cursor-pointer"
                    title="Remove Agent"
                    aria-label="Delete Agent"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Assigned Model</span>
                  <div className="text-xs font-mono font-semibold text-white mt-1">
                    {activeAgent.model}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">RAM Quota</span>
                  <div className="text-xs font-mono font-semibold text-cyan-300 mt-1">
                    {activeAgent.memoryQuotaMB} MB
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Autonomy Gate</span>
                  <div className="text-xs font-mono font-semibold text-emerald-400 mt-1">
                    {activeAgent.permissionLevel}
                  </div>
                </div>
              </div>

              {/* System Prompt */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Grounding System Prompt:
                </label>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed">
                  {activeAgent.systemPrompt}
                </div>
              </div>

              {/* Tools Granted */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Connected Sandboxed Tools ({activeAgent.tools.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {activeAgent.tools.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-cyan-950/40 border border-cyan-800/50 text-cyan-300 flex items-center gap-1.5"
                    >
                      <Terminal className="w-3 h-3 text-cyan-400" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
