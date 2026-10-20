import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  createInitialSwarmState, 
  advanceSwarmStep, 
  approvePendingStep,
  generateDynamicMission,
  serializeSwarmState,
  deserializeSwarmState
} from './swarmEngine.ts';
import type { SwarmMission, AgentRole } from '../types/index.ts';


const mockAgents: AgentRole[] = [
  {
    id: 'agent-1',
    name: 'Lead Architect',
    role: 'Orchestrator',
    department: 'Engineering',
    avatar: 'cpu',
    model: 'Qwen-2.5-32B',
    memoryQuotaMB: 4096,
    permissionLevel: 'Autonomous',
    systemPrompt: 'Coordinate tasks',
    tools: ['bash', 'fs_read'],
    status: 'idle'
  },
  {
    id: 'agent-2',
    name: 'Security Officer',
    role: 'Auditor',
    department: 'Security',
    avatar: 'shield',
    model: 'Llama-3.3-70B',
    memoryQuotaMB: 8192,
    permissionLevel: 'Critical Checkpoint',
    systemPrompt: 'Audit code',
    tools: ['sandbox_exec'],
    status: 'idle'
  }
];

const mockMission: SwarmMission = {
  id: 'test-mission',
  title: 'Audit System Vulnerabilities',
  description: 'Scans dependencies and applies patch',
  category: 'Security',
  participatingAgents: ['agent-1', 'agent-2'],
  steps: [
    {
      agentId: 'agent-1',
      action: 'Scan repository package.json dependencies',
      toolUsed: 'fs_read',
      outputSample: 'Found 0 critical, 1 moderate vulnerability',
      durationMs: 400
    },
    {
      agentId: 'agent-2',
      action: 'Apply sandbox patch to production firewall',
      toolUsed: 'sandbox_exec',
      outputSample: 'Applied patch with checksum 0xFA32',
      durationMs: 800,
      requiresApproval: true
    }
  ]
};

test('createInitialSwarmState initializes idle state with 0 steps completed', () => {
  const state = createInitialSwarmState(mockMission);
  assert.equal(state.status, 'idle');
  assert.equal(state.currentStepIndex, 0);
  assert.equal(state.totalSteps, 2);
  assert.equal(state.logs.length, 1);
});

test('advanceSwarmStep moves to next step and records log', () => {
  const s0 = createInitialSwarmState(mockMission);
  const s1 = advanceSwarmStep(s0, mockMission, mockAgents);

  assert.equal(s1.currentStepIndex, 1);
  assert.equal(s1.status, 'running');
  assert.ok(s1.totalTokensGenerated > 0);
  assert.equal(s1.logs.length, 2);
});

test('advanceSwarmStep enforces security gate on step requiring approval', () => {
  const s0 = createInitialSwarmState(mockMission);
  // Advance first step (which does not require approval)
  const s1 = advanceSwarmStep(s0, mockMission, mockAgents);
  // Reset running status to trigger check or advance next
  const s1PausedSim = { ...s1, status: 'idle' as const };
  const s2 = advanceSwarmStep(s1PausedSim, mockMission, mockAgents);

  assert.equal(s2.status, 'paused_approval');
  assert.ok(s2.pendingApproval);
  assert.equal(s2.pendingApproval?.agentName, 'Security Officer');
});

test('approvePendingStep resumes execution after supervisor approval', () => {
  const s0 = createInitialSwarmState(mockMission);
  const s1 = advanceSwarmStep(s0, mockMission, mockAgents);
  const s1Paused = { ...s1, status: 'idle' as const };
  const s2 = advanceSwarmStep(s1Paused, mockMission, mockAgents);

  assert.equal(s2.status, 'paused_approval');

  const s3 = approvePendingStep(s2, mockMission, mockAgents);
  // Step 2 is the last step, so approving it advances to completed
  assert.equal(s3.status, 'completed');
  assert.equal(s3.pendingApproval, undefined);
  assert.ok(s3.logs.some(l => l.message.includes('Approved checkpoint')));
});

test('generateDynamicMission synthesizes valid 5-step DAG with security approval gate', () => {
  const mission = generateDynamicMission('Conduct GDPR privacy audit on local vector knowledge base');
  assert.ok(mission.id.startsWith('mission-custom-'));
  assert.equal(mission.category, 'Security & Compliance');
  assert.equal(mission.steps.length, 5);
  assert.ok(mission.steps.some(s => s.requiresApproval === true));
  assert.ok(mission.participatingAgents.includes('agent-orion'));
  assert.ok(mission.participatingAgents.includes('agent-aegis'));
});

test('serializeSwarmState and deserializeSwarmState round-trips correctly', () => {
  const initial = createInitialSwarmState(mockMission);
  const serialized = serializeSwarmState(initial);
  assert.ok(typeof serialized === 'string');
  assert.ok(serialized.includes(mockMission.id));

  const restored = deserializeSwarmState(serialized, mockMission);
  assert.equal(restored.missionId, mockMission.id);
  assert.equal(restored.status, 'idle');
  assert.equal(restored.logs.length, 1);
});

test('deserializeSwarmState gracefully recovers from invalid json with fallback', () => {
  const recovered = deserializeSwarmState('not valid json {[[', mockMission);
  assert.equal(recovered.missionId, mockMission.id);
  assert.equal(recovered.status, 'idle');
});
