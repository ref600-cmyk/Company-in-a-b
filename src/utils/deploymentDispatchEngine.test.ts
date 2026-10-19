import { test } from 'node:test';
import assert from 'node:assert';
import {
  validateDeploymentEmail,
  generateMacProBrowserTestSession,
  generateDeploymentEmailPayload,
  generateMailtoLink
} from './deploymentDispatchEngine.ts';

test('validateDeploymentEmail validates standard and target ref600@gmail.com email', () => {
  const result = validateDeploymentEmail('ref600@gmail.com');
  assert.strictEqual(result.isValid, true);
  assert.strictEqual(result.normalizedEmail, 'ref600@gmail.com');
  assert.strictEqual(result.error, undefined);

  const trimmed = validateDeploymentEmail('  REF600@GMAIL.COM  ');
  assert.strictEqual(trimmed.isValid, true);
  assert.strictEqual(trimmed.normalizedEmail, 'ref600@gmail.com');

  const invalid = validateDeploymentEmail('invalid-email');
  assert.strictEqual(invalid.isValid, false);
  assert.ok(invalid.error);
});

test('generateMacProBrowserTestSession creates complete session for ref600@gmail.com', () => {
  const session = generateMacProBrowserTestSession('ref600@gmail.com', 'https://ais-test.run.app');
  assert.strictEqual(session.email, 'ref600@gmail.com');
  assert.ok(session.sessionId.startsWith('DEP-MACPRO-REF600'));
  assert.ok(session.testUrl.includes('https://ais-test.run.app/?tab=mac-pro-station'));
  assert.ok(session.testUrl.includes('ref600%40gmail.com'));
  assert.ok(session.token.startsWith('sk_edge_'));
  assert.strictEqual(session.targetSpecs.device, 'Apple Mac Pro Workstation (M2 Ultra / M3 Ultra / M4 Max)');
});

test('generateDeploymentEmailPayload creates valid payload and curl command', () => {
  const session = generateMacProBrowserTestSession('ref600@gmail.com', 'https://ais-test.run.app');
  const payload = generateDeploymentEmailPayload(session);

  assert.strictEqual(payload.to, 'ref600@gmail.com');
  assert.ok(payload.subject.includes('Mac Pro Testing Link'));
  assert.ok(payload.textBody.includes('ref600@gmail.com'));
  assert.ok(payload.textBody.includes(session.testUrl));
  assert.ok(payload.curlCommand.includes('/api/macpro/launcher.command'));
  assert.ok(payload.htmlBody.includes('Launch on Mac Pro Browser'));
  assert.ok(payload.messageId.startsWith('msg_skyshadow_'));
});

test('generateMailtoLink outputs compliant RFC-2368 URI', () => {
  const session = generateMacProBrowserTestSession('ref600@gmail.com');
  const mailto = generateMailtoLink(session);

  assert.ok(mailto.startsWith('mailto:ref600@gmail.com?subject='));
  assert.ok(mailto.includes('&body='));
});
