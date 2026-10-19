import { test } from 'node:test';
import assert from 'node:assert';
import { 
  calculateMacProTelemetry, 
  runMacProDiagnostics, 
  executeTerminalCommand, 
  generateMacProLauncherScript,
  MAC_PRO_CHIPS 
} from './macProStationEngine.ts';

test('calculateMacProTelemetry calculates accurate unified memory budget for M2 Ultra 192GB', () => {
  const telemetry = calculateMacProTelemetry('m2_ultra', 192, 41.5, 4);
  
  assert.strictEqual(telemetry.chip.id, 'm2_ultra');
  assert.strictEqual(telemetry.ramTotalGb, 192);
  assert.strictEqual(telemetry.vramModelWeightsGb, 41.5);
  // kvCacheGb is 4 * 2.2 = 8.8
  assert.strictEqual(telemetry.kvCacheGb, 8.8);
  // totalUsedGb = 41.5 + 8.8 + 5.5 = 55.8
  assert.strictEqual(telemetry.totalUsedGb, 55.8);
  assert.strictEqual(telemetry.freeMemoryGb, 136.2);
  assert.ok(telemetry.utilizationPercent < 35, 'Utilization should be well under 35% on 192GB RAM');
  assert.ok(telemetry.peakTokensPerSec > 10, 'Peak tokens should be substantial on 800 GB/s bandwidth');
});

test('calculateMacProTelemetry models M4 Max with 128GB memory', () => {
  const telemetry = calculateMacProTelemetry('m4_max', 128, 41.5, 2);
  
  assert.strictEqual(telemetry.chip.id, 'm4_max');
  assert.strictEqual(telemetry.ramTotalGb, 128);
  assert.strictEqual(telemetry.chip.memoryBandwidthGbps, 546);
  assert.ok(telemetry.freeMemoryGb > 70);
});

test('runMacProDiagnostics outputs all 5 operational subsystems', () => {
  const telemetry = calculateMacProTelemetry('m2_ultra', 192, 41.5, 4);
  const diags = runMacProDiagnostics(telemetry);
  
  assert.strictEqual(diags.length, 5);
  const passedCount = diags.filter(d => d.status === 'passed').length;
  assert.strictEqual(passedCount, 5, 'All diagnostics should pass with abundant memory');
});

test('executeTerminalCommand handles status, help, mesh-ping, and fallback gracefully', () => {
  const telemetry = calculateMacProTelemetry('m2_ultra', 192, 41.5, 4);
  
  const helpOut = executeTerminalCommand('help', telemetry);
  assert.strictEqual(helpOut.type, 'info');
  assert.ok(helpOut.lines.some(l => l.includes('status')));

  const statusOut = executeTerminalCommand('status', telemetry);
  assert.strictEqual(statusOut.type, 'success');
  assert.ok(statusOut.lines.some(l => l.includes('Apple Mac Pro')));

  const pingOut = executeTerminalCommand('mesh-ping', telemetry);
  assert.strictEqual(pingOut.type, 'success');
  assert.ok(pingOut.lines.some(l => l.includes('0.038 ms')));

  const testLlmOut = executeTerminalCommand('test-llm', telemetry);
  assert.strictEqual(testLlmOut.type, 'success');
  assert.ok(testLlmOut.lines.some(l => l.includes('tokens/sec')));

  const unknownOut = executeTerminalCommand('invalid-cmd', telemetry);
  assert.strictEqual(unknownOut.type, 'error');
  assert.ok(unknownOut.lines[0].includes('command not found'));
});

test('generateMacProLauncherScript outputs executable bash script with sysctl checks', () => {
  const script = generateMacProLauncherScript();
  assert.ok(script.startsWith('#!/bin/bash'));
  assert.ok(script.includes('sysctl -n machdep.cpu.brand_string'));
  assert.ok(script.includes('sysctl -n hw.memsize'));
  assert.ok(script.includes('Google Chrome'));
});
