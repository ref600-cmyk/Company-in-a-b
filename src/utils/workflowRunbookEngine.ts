export type StepStatus = 'pending' | 'running' | 'waiting-approval' | 'completed' | 'failed' | 'skipped';

export interface RunbookStep {
  id: string;
  name: string;
  description: string;
  assignedAgent: string;
  assignedRole: string;
  model: string;
  requiresHumanApproval: boolean;
  status: StepStatus;
  dependsOn?: string[]; // IDs of preceding steps
  executionTimeMs?: number;
  tokensConsumed?: number;
  outputPayload?: string;
  cryptographicHash?: string;
}

export interface WorkflowRunbook {
  id: string;
  title: string;
  code: string; // e.g. "RUN-SEC-01"
  category: 'cybersecurity' | 'ma-due-diligence' | 'regulatory-audit' | 'infra-failover';
  description: string;
  estimatedDuration: string;
  slaTargetSeconds: number;
  steps: RunbookStep[];
  currentStepIndex: number;
  state: 'idle' | 'in-progress' | 'paused-at-gate' | 'completed' | 'aborted';
  totalTokensGenerated: number;
  startedAt?: number;
  completedAt?: number;
}

export function calculateRunbookStats(runbook: WorkflowRunbook) {
  const totalSteps = runbook.steps.length;
  const completedSteps = runbook.steps.filter(s => s.status === 'completed').length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);
  const totalTokens = runbook.steps.reduce((acc, s) => acc + (s.tokensConsumed || 0), 0);
  const totalExecutionTimeMs = runbook.steps.reduce((acc, s) => acc + (s.executionTimeMs || 0), 0);

  return {
    totalSteps,
    completedSteps,
    progressPercent,
    totalTokens,
    totalExecutionTimeMs
  };
}

export function canStepExecute(step: RunbookStep, allSteps: RunbookStep[]): boolean {
  if (!step.dependsOn || step.dependsOn.length === 0) return true;
  return step.dependsOn.every(depId => {
    const parent = allSteps.find(s => s.id === depId);
    return parent && parent.status === 'completed';
  });
}

export function advanceRunbookStep(runbook: WorkflowRunbook): WorkflowRunbook {
  if (runbook.state === 'completed' || runbook.state === 'paused-at-gate') {
    return runbook;
  }

  const updatedSteps = [...runbook.steps];
  const now = Date.now();

  // Find first step that can execute
  const nextStepIndex = updatedSteps.findIndex(
    s => s.status === 'pending' && canStepExecute(s, updatedSteps)
  );

  if (nextStepIndex === -1) {
    // Check if all steps are completed
    const allDone = updatedSteps.every(s => s.status === 'completed');
    return {
      ...runbook,
      state: allDone ? 'completed' : runbook.state,
      completedAt: allDone ? now : runbook.completedAt
    };
  }

  const targetStep = updatedSteps[nextStepIndex];

  // If requires human approval and not yet approved
  if (targetStep.requiresHumanApproval && targetStep.status === 'pending') {
    updatedSteps[nextStepIndex] = {
      ...targetStep,
      status: 'waiting-approval'
    };
    return {
      ...runbook,
      steps: updatedSteps,
      currentStepIndex: nextStepIndex,
      state: 'paused-at-gate'
    };
  }

  // Simulate completion of step
  const simulatedTimeMs = Math.floor(Math.random() * 800) + 400;
  const simulatedTokens = Math.floor(Math.random() * 1200) + 450;
  const fakeHash = '0x' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

  updatedSteps[nextStepIndex] = {
    ...targetStep,
    status: 'completed',
    executionTimeMs: simulatedTimeMs,
    tokensConsumed: simulatedTokens,
    outputPayload: `Step completed autonomously by ${targetStep.assignedAgent}. Verified zero data leakage to public cloud.`,
    cryptographicHash: fakeHash
  };

  const allCompleted = updatedSteps.every(s => s.status === 'completed');

  return {
    ...runbook,
    steps: updatedSteps,
    currentStepIndex: nextStepIndex + 1,
    state: allCompleted ? 'completed' : 'in-progress',
    totalTokensGenerated: runbook.totalTokensGenerated + simulatedTokens,
    startedAt: runbook.startedAt || now,
    completedAt: allCompleted ? now : undefined
  };
}

export function approveRunbookStep(runbook: WorkflowRunbook, stepId: string): WorkflowRunbook {
  const updatedSteps = runbook.steps.map(step => {
    if (step.id === stepId && step.status === 'waiting-approval') {
      const simulatedTimeMs = Math.floor(Math.random() * 600) + 300;
      const simulatedTokens = Math.floor(Math.random() * 900) + 350;
      const fakeHash = '0x' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      return {
        ...step,
        status: 'completed' as StepStatus,
        executionTimeMs: simulatedTimeMs,
        tokensConsumed: simulatedTokens,
        outputPayload: `Human Supervisor cryptographic sign-off granted. Execution verified via Apple Secure Enclave attestation.`,
        cryptographicHash: fakeHash
      };
    }
    return step;
  });

  const allDone = updatedSteps.every(s => s.status === 'completed');

  return {
    ...runbook,
    steps: updatedSteps,
    state: allDone ? 'completed' : 'in-progress',
    totalTokensGenerated: runbook.totalTokensGenerated + 600
  };
}

export function resetRunbook(runbook: WorkflowRunbook): WorkflowRunbook {
  return {
    ...runbook,
    currentStepIndex: 0,
    state: 'idle',
    totalTokensGenerated: 0,
    startedAt: undefined,
    completedAt: undefined,
    steps: runbook.steps.map(s => ({
      ...s,
      status: 'pending',
      executionTimeMs: undefined,
      tokensConsumed: undefined,
      outputPayload: undefined,
      cryptographicHash: undefined
    }))
  };
}
