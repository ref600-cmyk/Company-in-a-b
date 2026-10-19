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
