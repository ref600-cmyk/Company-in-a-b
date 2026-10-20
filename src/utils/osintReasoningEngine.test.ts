import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  calculateReasoningMemoryOverhead, 
  synthesizeOsintProfile, 
  generateInvestigationMarkdownReport 
} from './osintReasoningEngine.ts';

test('calculateReasoningMemoryOverhead accurately computes 32B model memory and KV cache', () => {
  const stats = calculateReasoningMemoryOverhead(8192, '32B');
  assert.equal(stats.modelTier, '32B');
  assert.equal(stats.weightGb, 19.8);
  assert.ok(stats.kvCacheGb > 0.5);
  assert.ok(stats.totalRamGb > 20 && stats.totalRamGb < 30);
  assert.equal(stats.supportedOnMacStudio, true);
  assert.equal(stats.supportedOnMacPro, true);
});

test('calculateReasoningMemoryOverhead scales for 70B model with high thinking context', () => {
  const stats = calculateReasoningMemoryOverhead(16384, '70B');
  assert.equal(stats.modelTier, '70B');
  assert.equal(stats.weightGb, 41.5);
  assert.ok(stats.totalRamGb > 45);
  assert.equal(stats.supportedOnMacMini, false);
  assert.equal(stats.supportedOnMacStudio, true);
  assert.equal(stats.supportedOnMacPro, true);
});

test('synthesizeOsintProfile generates comprehensive sovereign OSINT entities', () => {
  const report = synthesizeOsintProfile('acme-defense.corp');
  assert.equal(report.target, 'acme-defense.corp');
  assert.ok(report.investigationId.startsWith('OSINT-UMA-'));
  assert.ok(report.overallThreatScore >= 0 && report.overallThreatScore <= 100);
  assert.ok(report.entities.length >= 6);

  // Check specific entities
  const hasDns = report.entities.some(e => e.type === 'domain');
  const hasIp = report.entities.some(e => e.type === 'ip_range');
  const hasCert = report.entities.some(e => e.type === 'certificate');
  const hasCve = report.entities.some(e => e.type === 'cve_vulnerability');
  const hasCreds = report.entities.some(e => e.type === 'breached_credential');

  assert.ok(hasDns);
  assert.ok(hasIp);
  assert.ok(hasCert);
  assert.ok(hasCve);
  assert.ok(hasCreds);
});

test('synthesizeOsintProfile generates complete 5-phase extreme reasoning trace with thought tags', () => {
  const report = synthesizeOsintProfile('skyshadow.co.uk');
  assert.equal(report.reasoningTrace.length, 5);

  const phases = report.reasoningTrace.map(s => s.phase);
  assert.deepEqual(phases, [
    'hypothesis',
    'cross_examination',
    'counter_factual',
    'synthesis',
    'verdict'
  ]);

  // Ensure each step contains <thought> tags
  for (const step of report.reasoningTrace) {
    assert.ok(step.thoughtTrace.includes('<thought>'));
    assert.ok(step.thoughtTrace.includes('</thought>'));
    assert.ok(step.confidence >= 50 && step.confidence <= 100);
    assert.ok(step.verificationCheck.length > 10);
    assert.ok(step.tokensUsed > 0);
  }
});

test('generateInvestigationMarkdownReport outputs valid markdown forensic dossier', () => {
  const report = synthesizeOsintProfile('sovereign-vault.internal');
  const md = generateInvestigationMarkdownReport(report);

  assert.ok(md.includes('# SkyShadow Sovereign OSINT & Extreme Reasoning Investigation Report'));
  assert.ok(md.includes(report.investigationId));
  assert.ok(md.includes(report.target));
  assert.ok(md.includes('Local Inference & Extreme Reasoning Telemetry'));
  assert.ok(md.includes('Discovered Sovereign OSINT Entities'));
  assert.ok(md.includes('Extreme Chain-of-Thought Reasoning Trace'));
  assert.ok(md.includes('Recommended Sovereign Mitigations'));
});
