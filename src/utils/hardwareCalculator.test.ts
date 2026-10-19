import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateModelWeightMemory, calculateHardwareSizing } from './hardwareCalculator.ts';

test('calculateModelWeightMemory computes correct approximate size for 14B 4-bit model', () => {
  // 14 * 4 / 8 = 7 GB * 1.15 = ~8.1 GB
  const size = calculateModelWeightMemory(14, 4);
  assert.ok(size >= 7.5 && size <= 8.5, `Expected size between 7.5 and 8.5 GB, got ${size}`);
});

test('calculateModelWeightMemory computes correct size for 70B 4-bit model', () => {
  // 70 * 4 / 8 = 35 GB * 1.15 = ~40.3 GB
  const size = calculateModelWeightMemory(70, 4);
  assert.ok(size >= 38 && size <= 42, `Expected size between 38 and 42 GB, got ${size}`);
});

test('calculateHardwareSizing marks 70B model viable on Mac Studio 64GB', () => {
  const result = calculateHardwareSizing({
    hardwareId: 'mac-studio-m2-max',
    totalMemoryGB: 64,
    memoryBandwidthGBs: 400,
    nodeCount: 1,
    selectedModelParamB: 70,
    quantizationBits: 4,
    contextTokensK: 16,
    estimatedMonthlyCloudTokensM: 40
  });

  assert.equal(result.isViable, true);
  assert.ok(result.totalRequiredMemoryGB < 64);
  assert.ok(result.monthlyNetSavingsUSD > 100);
  assert.ok(result.estimatedTokensPerSecond > 5);
});

test('calculateHardwareSizing flags overload when running 70B on 16GB Mac Mini', () => {
  const result = calculateHardwareSizing({
    hardwareId: 'mac-mini-m4-16gb',
    totalMemoryGB: 16,
    memoryBandwidthGBs: 120,
    nodeCount: 1,
    selectedModelParamB: 70,
    quantizationBits: 4,
    contextTokensK: 8,
    estimatedMonthlyCloudTokensM: 20
  });

  assert.equal(result.isViable, false);
  assert.ok(result.bottleneckWarning?.includes('exceeds physical RAM'));
});

test('calculateHardwareSizing calculates cluster aggregation for 3 Mac Minis', () => {
  const result = calculateHardwareSizing({
    hardwareId: 'mac-mini-m4-24gb',
    totalMemoryGB: 24,
    memoryBandwidthGBs: 120,
    nodeCount: 3,
    selectedModelParamB: 32,
    quantizationBits: 4,
    contextTokensK: 16,
    estimatedMonthlyCloudTokensM: 60
  });

  assert.equal(result.availableClusterMemoryGB, 72);
  assert.equal(result.isViable, true);
  assert.ok(result.maxConcurrentAgents >= 3);
});
