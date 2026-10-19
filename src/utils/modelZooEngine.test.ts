import { test } from 'node:test';
import assert from 'node:assert';
import { calculateModelSpecs, ZOO_MODELS, QUANTIZATION_PROFILES } from './modelZooEngine.ts';

test('calculateModelSpecs properly shrinks 70B model with Q4_K_M to fit within Mac Studio 64GB', () => {
  const llama70b = ZOO_MODELS.find(m => m.id === 'llama-3-3-70b')!;
  const q4Spec = calculateModelSpecs(llama70b, 'q4_k_m', 546);

  assert.ok(q4Spec.vramFootprintGB < 50, `Q4 70B model should be ~42GB (actual: ${q4Spec.vramFootprintGB}GB)`);
  assert.strictEqual(q4Spec.fitsInSingleM4Pro64GB, true, '70B Q4 must fit into a 64GB Unified Memory Mac');
  assert.ok(q4Spec.tokensPerSec >= 9, 'Tokens per sec should be productive (>9 tok/s)');
});

test('calculateModelSpecs flags 70B FP16 as requiring 128GB+ or cluster', () => {
  const deepseek70b = ZOO_MODELS.find(m => m.id === 'deepseek-r1-70b')!;
  const fp16Spec = calculateModelSpecs(deepseek70b, 'fp16', 546);

  assert.ok(fp16Spec.vramFootprintGB > 120, 'FP16 70B weights should exceed 120GB');
  assert.strictEqual(fp16Spec.fitsInSingleM4Pro64GB, false, 'FP16 70B must not fit into 64GB');
});

test('calculateModelSpecs confirms 14B model fits smoothly in 16GB Mac Mini with Q4_K_M', () => {
  const phi4 = ZOO_MODELS.find(m => m.id === 'phi-4-14b')!;
  const q4Spec = calculateModelSpecs(phi4, 'q4_k_m', 273);

  assert.ok(q4Spec.vramFootprintGB < 12, '14B Q4 model should take <12GB VRAM');
  assert.strictEqual(q4Spec.fitsInSingleM4Mini16GB, true, 'Phi-4 14B should fit in 16GB base Mac Mini');
  assert.ok(q4Spec.tokensPerSec > 18, '14B should run at >18 tok/s');
});
