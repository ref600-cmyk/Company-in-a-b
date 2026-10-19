import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateComplianceHealth, generateAuditManifest } from './complianceEngine.ts';
import type { ComplianceControl } from '../types/index.ts';

const mockControls: ComplianceControl[] = [
  {
    id: 'iso-a12-6-1',
    standard: 'ISO 27001',
    controlName: 'Management of Technical Vulnerabilities',
    clause: 'Annex A.12.6.1',
    status: 'enforced',
    evidence: 'Zero-outbound socket rule in Apple Virtualization sandbox.',
    technicalMechanism: 'Kernel network namespace severed (net=none).'
  },
  {
    id: 'hipaa-164-312-e-1',
    standard: 'HIPAA',
    controlName: 'Transmission Security - Integrity Controls',
    clause: '45 CFR § 164.312(e)(1)',
    status: 'passed',
    evidence: 'No ePHI leaves the physical RAM or encrypted SQLite on-disk store.',
    technicalMechanism: 'Hardware Unified Memory confinement.'
  }
];

test('evaluateComplianceHealth computes 100% compliance when all controls enforced', () => {
  const summary = evaluateComplianceHealth(mockControls);
  assert.equal(summary.totalControls, 2);
  assert.equal(summary.passedControls, 2);
  assert.equal(summary.complianceScorePercent, 100);
  assert.equal(summary.standardsEvaluated.length, 2);
});

test('generateAuditManifest produces valid parseable JSON audit manifest', () => {
  const manifestJson = generateAuditManifest('SkyShadow Corp', 'node-01', mockControls);
  const parsed = JSON.parse(manifestJson);
  assert.equal(parsed.audit_header.target_entity, 'SkyShadow Corp');
  assert.equal(parsed.compliance_summary.complianceScorePercent, 100);
  assert.equal(parsed.controls_evaluated.length, 2);
});
