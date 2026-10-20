import type { AgentRole, SwarmMission, SwarmLogEntry } from '../types/index.ts';


export interface SwarmExecutionState {
  missionId: string;
  status: 'idle' | 'running' | 'paused_approval' | 'completed' | 'error';
  currentStepIndex: number;
  totalSteps: number;
  activeAgentId?: string;
  logs: SwarmLogEntry[];
  totalTokensGenerated: number;
  elapsedTimeMs: number;
  pendingApproval?: {
    stepIndex: number;
    agentName: string;
    action: string;
    details: string;
  };
}

export function createInitialSwarmState(mission: SwarmMission): SwarmExecutionState {
  return {
    missionId: mission.id,
    status: 'idle',
    currentStepIndex: 0,
    totalSteps: mission.steps.length,
    logs: [
      {
        id: `log-${Date.now()}-0`,
        timestamp: new Date().toLocaleTimeString(),
        agentId: 'system',
        agentName: 'Mesh Orchestrator',
        level: 'info',
        message: `Swarm initialized for mission: "${mission.title}". ${mission.steps.length} sequential autonomy steps loaded.`
      }
    ],
    totalTokensGenerated: 0,
    elapsedTimeMs: 0
  };
}

export function advanceSwarmStep(
  state: SwarmExecutionState,
  mission: SwarmMission,
  agents: AgentRole[]
): SwarmExecutionState {
  if (state.status === 'completed' || state.status === 'paused_approval') {
    return state;
  }

  const step = mission.steps[state.currentStepIndex];
  if (!step) {
    return {
      ...state,
      status: 'completed',
      activeAgentId: undefined
    };
  }

  const agent = agents.find(a => a.id === step.agentId) || {
    id: step.agentId,
    name: 'Autonomous Agent',
    role: 'Specialist'
  };

  // Check if step requires Human-in-the-Loop approval
  if (step.requiresApproval && state.status !== 'running') {
    return {
      ...state,
      status: 'paused_approval',
      activeAgentId: agent.id,
      pendingApproval: {
        stepIndex: state.currentStepIndex,
        agentName: agent.name,
        action: step.action,
        details: step.outputSample
      },
      logs: [
        ...state.logs,
        {
          id: `log-${Date.now()}-${state.currentStepIndex}-pause`,
          timestamp: new Date().toLocaleTimeString(),
          agentId: agent.id,
          agentName: agent.name,
          level: 'warning',
          message: `[SECURITY GATE] Action requires supervisor approval: ${step.action}`,
          detail: 'Air-gapped security policy enforces zero non-consensual system modifications.'
        }
      ]
    };
  }

  // Generate tokens estimation for this step
  const stepTokens = 180 + Math.floor(Math.random() * 220);
  const nextIndex = state.currentStepIndex + 1;
  const isLast = nextIndex >= mission.steps.length;

  const newLog: SwarmLogEntry = {
    id: `log-${Date.now()}-${state.currentStepIndex}`,
    timestamp: new Date().toLocaleTimeString(),
    agentId: agent.id,
    agentName: agent.name,
    level: step.toolUsed ? 'tool' : 'decision',
    message: `${agent.name} executed: ${step.action}`,
    detail: step.outputSample
  };

  return {
    ...state,
    status: isLast ? 'completed' : 'running',
    currentStepIndex: nextIndex,
    activeAgentId: isLast ? undefined : mission.steps[nextIndex]?.agentId,
    totalTokensGenerated: state.totalTokensGenerated + stepTokens,
    elapsedTimeMs: state.elapsedTimeMs + step.durationMs,
    pendingApproval: undefined,
    logs: [...state.logs, newLog]
  };
}

export function approvePendingStep(
  state: SwarmExecutionState,
  mission: SwarmMission,
  agents: AgentRole[]
): SwarmExecutionState {
  if (state.status !== 'paused_approval' || !state.pendingApproval) {
    return state;
  }

  const unpausedState: SwarmExecutionState = {
    ...state,
    status: 'running',
    pendingApproval: undefined,
    logs: [
      ...state.logs,
      {
        id: `log-${Date.now()}-approved`,
        timestamp: new Date().toLocaleTimeString(),
        agentId: 'human-supervisor',
        agentName: 'Human Supervisor',
        level: 'success',
        message: `Approved checkpoint for: ${state.pendingApproval.action}`
      }
    ]
  };

  return advanceSwarmStep(unpausedState, mission, agents);
}

export function generateDynamicMission(userPrompt: string): SwarmMission {
  const prompt = (userPrompt || '').trim();
  const lower = prompt.toLowerCase();
  const missionId = `mission-custom-${Date.now()}`;

  let category = 'Enterprise Autonomy';
  if (lower.includes('security') || lower.includes('gdpr') || lower.includes('audit') || lower.includes('vulnerability')) {
    category = 'Security & Compliance';
  } else if (lower.includes('code') || lower.includes('refactor') || lower.includes('bug') || lower.includes('deploy')) {
    category = 'Software Engineering';
  } else if (lower.includes('invoice') || lower.includes('finance') || lower.includes('ledger') || lower.includes('cost')) {
    category = 'Financial Ops';
  } else if (lower.includes('mesh') || lower.includes('node') || lower.includes('failover') || lower.includes('cluster')) {
    category = 'Cluster Infrastructure';
  }

  const cleanTitle = prompt.length > 55 ? prompt.slice(0, 52) + '...' : prompt || 'Custom Autonomous Swarm Mission';

  return {
    id: missionId,
    title: cleanTitle,
    description: `Dynamic autonomous swarm task synthesized from user prompt: "${prompt}". Decomposed into directed acyclic graph (DAG) execution steps.`,
    category,
    participatingAgents: ['agent-orion', 'agent-cypher', 'agent-vulcan', 'agent-aegis', 'agent-iris'],
    steps: [
      {
        agentId: 'agent-orion',
        action: `Ingest & decompose objective: "${cleanTitle}"`,
        toolUsed: 'task_dispatch',
        outputSample: `Decomposed into 4 parallel micro-tasks with zero-exfiltration constraint. Assigned execution nodes.`,
        durationMs: 700
      },
      {
        agentId: 'agent-cypher',
        action: `Retrieve air-gapped contextual knowledge & semantic embeddings`,
        toolUsed: 'vector_search_lance',
        outputSample: `Indexed 28 relevant internal vectors with cosine similarity > 0.88 across local storage.`,
        durationMs: 950
      },
      {
        agentId: 'agent-vulcan',
        action: `Execute targeted operations in isolated macOS Docker sandbox`,
        toolUsed: 'bash_sandbox',
        outputSample: `Completed task execution inside container #sc-sand-089. Exit code 0, 0 external network calls.`,
        durationMs: 1400
      },
      {
        agentId: 'agent-aegis',
        action: `Enforce security policy check & commit manifest to audit ledger`,
        toolUsed: 'ast_security_scan',
        outputSample: `Cryptographic SHA-256 seal generated (0x8F4E2...A1). Ready for production authorization.`,
        durationMs: 800,
        requiresApproval: true
      },
      {
        agentId: 'agent-iris',
        action: `Broadcast completion manifest over Thunderbolt 5 mesh event bus`,
        toolUsed: 'mesh_broadcast',
        outputSample: `Notified cluster nodes. Task execution finalized in 3.85s with 100% data sovereignty.`,
        durationMs: 600
      }
    ]
  };
}

export const STORAGE_KEY_SWARM_STATE = 'skyshadow_swarm_state_v1';

export function serializeSwarmState(state: SwarmExecutionState): string {
  try {
    return JSON.stringify(state);
  } catch {
    return '';
  }
}

export function deserializeSwarmState(json: string, fallbackMission: SwarmMission): SwarmExecutionState {
  if (!json) return createInitialSwarmState(fallbackMission);
  try {
    const parsed = JSON.parse(json);
    if (parsed && parsed.missionId && Array.isArray(parsed.logs)) {
      return parsed as SwarmExecutionState;
    }
  } catch {}
  return createInitialSwarmState(fallbackMission);
}
