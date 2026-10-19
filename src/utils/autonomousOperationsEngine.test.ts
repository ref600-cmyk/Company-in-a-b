import { test } from 'node:test';
import assert from 'node:assert';
import {
  decomposeAutonomousGoal,
  advanceAutonomousStep,
  triggerSelfHealingRemediation,
  tickAutonomousDaemons,
  INITIAL_EDGE_NODES,
  INITIAL_AUTONOMOUS_DAEMONS
} from './autonomousOperationsEngine.ts';

test('decomposeAutonomousGoal breaks down natural language goal into 5-step DAG', () => {
  const goal = 'Autonomous PCI-DSS 4.0 Local Air-Gapped Penetration & Attestation';
  const dag = decomposeAutonomousGoal(goal);

  assert.strictEqual(dag.tasks.length, 5);
  assert.strictEqual(dag.status, 'idle');
  assert.strictEqual(dag.category, 'compliance-audit');
  assert.ok(dag.id.startsWith('DAG-'));

  // Test dependency chain
  assert.strictEqual(dag.tasks[0].dependencies.length, 0);
  assert.strictEqual(dag.tasks[1].dependencies[0], dag.tasks[0].id);
  assert.strictEqual(dag.tasks[2].dependencies[0], dag.tasks[1].id);
  assert.strictEqual(dag.tasks[3].dependencies[0], dag.tasks[2].id);
  assert.strictEqual(dag.tasks[4].dependencies[0], dag.tasks[3].id);

  // Check hardware targets assigned
  assert.strictEqual(dag.tasks[0].hardwareTarget, 'metal-gpu');
  assert.strictEqual(dag.tasks[1].hardwareTarget, 'neural-engine');
  assert.strictEqual(dag.tasks[3].hardwareTarget, 'cpu-uma');
});

test('decomposeAutonomousGoal identifies cybersecurity and cluster categories', () => {
  const secDag = decomposeAutonomousGoal('Investigate zero-day kernel memory anomaly');
  assert.strictEqual(secDag.category, 'cybersecurity');

  const clusterDag = decomposeAutonomousGoal('Thunderbolt 5 cluster rebalance under thermal stress');
  assert.strictEqual(clusterDag.category, 'cluster-orchestration');
});

test('advanceAutonomousStep executes tasks in order respecting dependencies', () => {
  let dag = decomposeAutonomousGoal('Test autonomous workflow');
  assert.strictEqual(dag.status, 'idle');

  // Step 1: Task 0 begins acting
  dag = advanceAutonomousStep(dag);
  assert.strictEqual(dag.status, 'in-progress');
  assert.strictEqual(dag.tasks[0].status, 'acting');
  assert.strictEqual(dag.tasks[1].status, 'pending');

  // Step 2: Task 0 completes
  dag = advanceAutonomousStep(dag);
  assert.strictEqual(dag.tasks[0].status, 'completed');
  assert.strictEqual(dag.tasks[1].status, 'pending');

  // Step 3: Task 1 begins acting
  dag = advanceAutonomousStep(dag);
  assert.strictEqual(dag.tasks[1].status, 'acting');

  // Step 4: Task 1 completes
  dag = advanceAutonomousStep(dag);
  assert.strictEqual(dag.tasks[1].status, 'completed');

  assert.ok(dag.tokensGenerated > 0);
});

test('triggerSelfHealingRemediation handles VRAM pressure spike with cache pruning', () => {
  const { updatedNodes, action } = triggerSelfHealingRemediation('vram-spike', INITIAL_EDGE_NODES);

  assert.strictEqual(action.eventType, 'vram-spike');
  assert.strictEqual(action.status, 'mitigated');
  assert.ok(action.vramFreedGb > 0);
  assert.ok(action.remediationPlan.includes('KV cache'));
  assert.ok(action.resolutionTimeMs < 100);
});

test('triggerSelfHealingRemediation handles node disconnection with task migration', () => {
  const { updatedNodes, action } = triggerSelfHealingRemediation('node-disconnect', INITIAL_EDGE_NODES);

  assert.strictEqual(action.eventType, 'node-disconnect');
  assert.strictEqual(action.status, 'mitigated');
  assert.ok(action.remediationPlan.includes('Raft'));
  assert.ok(action.migratedTasks.length > 0);
});

test('tickAutonomousDaemons increments daemon run counters', () => {
  const initial = INITIAL_AUTONOMOUS_DAEMONS;
  const ticked = tickAutonomousDaemons(initial);

  assert.strictEqual(ticked.length, initial.length);
  assert.strictEqual(ticked[0].totalRuns, initial[0].totalRuns + 1);
  assert.strictEqual(ticked[1].totalRuns, initial[1].totalRuns + 1);
});
