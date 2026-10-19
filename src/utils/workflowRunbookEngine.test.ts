import { test } from 'node:test';
import assert from 'node:assert';
import { 
  advanceRunbookStep, 
  approveRunbookStep, 
  resetRunbook, 
  calculateRunbookStats,
  canStepExecute
} from './workflowRunbookEngine.ts';
import type { WorkflowRunbook, RunbookStep } from './workflowRunbookEngine.ts';

const SAMPLE_RUNBOOK: WorkflowRunbook = {
  id: 'run-zero-day',
  title: 'Zero-Day Quarantine & Hot-Patch',
  code: 'RUN-SEC-01',
  category: 'cybersecurity',
  description: 'Autonomous zero-day detection and sandbox isolation',
  estimatedDuration: '4.2s',
  slaTargetSeconds: 10,
  currentStepIndex: 0,
  state: 'idle',
  totalTokensGenerated: 0,
  steps: [
    {
      id: 'step-1',
      name: 'Memory Dump & Vector Anomaly Triage',
      description: 'Analyze local memory heap using Qwen 2.5 Coder',
      assignedAgent: 'Sentinel-Alpha',
      assignedRole: 'Security Lead',
      model: 'Qwen-2.5-Coder-32B (Q4_K_M)',
      requiresHumanApproval: false,
      status: 'pending'
    },
    {
      id: 'step-2',
      name: 'Compile Micro-Sandbox Quarantine',
      description: 'Isolate vulnerable syscalls with eBPF filter',
      assignedAgent: 'Sandbox-Kernel',
      assignedRole: 'Kernel Specialist',
      model: 'DeepSeek-R1-Distill-70B (Q4_K_M)',
      requiresHumanApproval: true,
      status: 'pending',
      dependsOn: ['step-1']
    },
    {
      id: 'step-3',
      name: 'Deploy Local Hot-Patch & Attest',
      description: 'Apply live binary patch across cluster nodes',
      assignedAgent: 'Patch-Executor',
      assignedRole: 'Cluster Ops',
      model: 'Llama-3.3-70B (Q4_K_M)',
      requiresHumanApproval: false,
      status: 'pending',
      dependsOn: ['step-2']
    }
  ]
};

test('canStepExecute respects dependency chain', () => {
  const steps: RunbookStep[] = [
    { ...SAMPLE_RUNBOOK.steps[0], status: 'pending' },
    { ...SAMPLE_RUNBOOK.steps[1], status: 'pending' }
  ];

  assert.strictEqual(canStepExecute(steps[0], steps), true, 'Step 1 has no dependencies and should be executable');
  assert.strictEqual(canStepExecute(steps[1], steps), false, 'Step 2 depends on Step 1 and should not execute yet');

  steps[0].status = 'completed';
  assert.strictEqual(canStepExecute(steps[1], steps), true, 'Step 2 should be executable once Step 1 is completed');
});

test('advanceRunbookStep advances step 1 and pauses at human approval gate for step 2', () => {
  const runbook = JSON.parse(JSON.stringify(SAMPLE_RUNBOOK));
  
  // Step 1 execution
  const afterStep1 = advanceRunbookStep(runbook);
  assert.strictEqual(afterStep1.steps[0].status, 'completed');
  assert.ok(afterStep1.steps[0].tokensConsumed! > 0);
  assert.strictEqual(afterStep1.state, 'in-progress');

  // Step 2 execution (requires approval)
  const afterStep2Attempt = advanceRunbookStep(afterStep1);
  assert.strictEqual(afterStep2Attempt.steps[1].status, 'waiting-approval');
  assert.strictEqual(afterStep2Attempt.state, 'paused-at-gate');
});

test('approveRunbookStep releases paused gate and continues workflow to completion', () => {
  let runbook = JSON.parse(JSON.stringify(SAMPLE_RUNBOOK));
  runbook = advanceRunbookStep(runbook);
  runbook = advanceRunbookStep(runbook);
  assert.strictEqual(runbook.state, 'paused-at-gate');

  // Human signs off
  const approved = approveRunbookStep(runbook, 'step-2');
  assert.strictEqual(approved.steps[1].status, 'completed');
  assert.strictEqual(approved.state, 'in-progress');

  // Step 3 executes
  const finished = advanceRunbookStep(approved);
  assert.strictEqual(finished.steps[2].status, 'completed');
  assert.strictEqual(finished.state, 'completed');

  const stats = calculateRunbookStats(finished);
  assert.strictEqual(stats.progressPercent, 100);
  assert.strictEqual(stats.completedSteps, 3);
});

test('resetRunbook resets all steps to pending and idle state', () => {
  let runbook = JSON.parse(JSON.stringify(SAMPLE_RUNBOOK));
  runbook = advanceRunbookStep(runbook);
  const reset = resetRunbook(runbook);

  assert.strictEqual(reset.state, 'idle');
  assert.strictEqual(reset.currentStepIndex, 0);
  assert.strictEqual(reset.steps[0].status, 'pending');
});
