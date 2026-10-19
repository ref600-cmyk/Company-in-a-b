import type { ComplianceControl } from '../types/index.ts';

export const COMPLIANCE_CONTROLS: ComplianceControl[] = [
  {
    id: 'ctrl-iso-a12-6-1',
    standard: 'ISO 27001',
    controlName: 'Management of Technical Vulnerabilities',
    clause: 'Annex A.12.6.1',
    status: 'enforced',
    evidence: 'Zero-outbound socket rule in Apple Virtualization sandbox prevents remote exploitation.',
    technicalMechanism: 'Kernel network namespace severed (net=none) during autonomous agent execution.'
  },
  {
    id: 'ctrl-iso-a9-4-2',
    standard: 'ISO 27001',
    controlName: 'Secure Log-on Procedures & Access Control',
    clause: 'Annex A.9.4.2',
    status: 'passed',
    evidence: 'Cryptographic Ed25519 token signatures required for inter-node agent task dispatch.',
    technicalMechanism: 'Mutual TLS and capability tokens passed over local mDNS/Thunderbolt interfaces.'
  },
  {
    id: 'ctrl-soc2-cc6-1',
    standard: 'SOC 2 Type II',
    controlName: 'Logical Boundary and Perimeter Defense',
    clause: 'Trust Services Criteria CC6.1',
    status: 'verified',
    evidence: 'Model weights, vector stores, and prompt contexts reside exclusively on encrypted physical hardware.',
    technicalMechanism: 'FileVault XTS-AES-128 encryption with Apple Secure Enclave key derivation.'
  },
  {
    id: 'ctrl-soc2-cc7-1',
    standard: 'SOC 2 Type II',
    controlName: 'System Vulnerability & Incident Detection',
    clause: 'Trust Services Criteria CC7.1',
    status: 'enforced',
    evidence: 'Real-time telemetry event bus records all agent tool invocations in append-only local SQLite WAL ledger.',
    technicalMechanism: 'Cryptographic hash chain on every executed tool step prevents tampering.'
  },
  {
    id: 'ctrl-euai-art52',
    standard: 'EU AI Act',
    controlName: 'Transparency & High-Risk AI System Confinement',
    clause: 'Article 52 & Annex III',
    status: 'verified',
    evidence: 'All autonomous decision steps are labeled, auditable, and subject to Human-in-the-Loop overrides.',
    technicalMechanism: 'Built-in security gate halts execution before irreversible state changes occur.'
  },
  {
    id: 'ctrl-euai-art14',
    standard: 'EU AI Act',
    controlName: 'Human Oversight by Design',
    clause: 'Article 14',
    status: 'enforced',
    evidence: 'Mandatory supervisor checkpoint for critical operations (code merges, payments, record deletions).',
    technicalMechanism: 'State machine blocks on pendingApproval until authorized by designated supervisor.'
  },
  {
    id: 'ctrl-hipaa-164-312-a',
    standard: 'HIPAA',
    controlName: 'Access Control & Emergency Mode Operation',
    clause: '45 CFR § 164.312(a)(1)',
    status: 'passed',
    evidence: 'ePHI data accessed solely via ephemeral memory mounts; zero residual data on disk unencrypted.',
    technicalMechanism: 'Tmpfs in-memory scratchpads with zero network egress.'
  },
  {
    id: 'ctrl-hipaa-164-312-e',
    standard: 'HIPAA',
    controlName: 'Transmission Security - Integrity Controls',
    clause: '45 CFR § 164.312(e)(1)',
    status: 'enforced',
    evidence: 'No patient health information transmitted across internet backbones to public cloud providers.',
    technicalMechanism: 'Complete air-gap architecture: local Apple Silicon MLX inference only.'
  },
  {
    id: 'ctrl-gdpr-art25',
    standard: 'UK DPA / GDPR',
    controlName: 'Data Protection by Design and by Default',
    clause: 'Article 25',
    status: 'verified',
    evidence: 'Zero telemetry, zero analytics tracking, zero training on customer documents.',
    technicalMechanism: 'Strict local boundary: all model weights run offline without external phone-home beacons.'
  },
  {
    id: 'ctrl-gdpr-art32',
    standard: 'UK DPA / GDPR',
    controlName: 'Security of Processing & Sovereign Data Residency',
    clause: 'Article 32',
    status: 'passed',
    evidence: 'Physical data residency maintained on enterprise premises within UK/EU jurisdiction.',
    technicalMechanism: 'Hardware chassis on customer desk/rack; no cross-border data transfer.'
  }
];
