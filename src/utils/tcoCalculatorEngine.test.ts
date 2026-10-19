import { test } from 'node:test';
import assert from 'node:assert';
import { calculateEnterpriseTco } from './tcoCalculatorEngine.ts';
import type { TcoInputParams } from './tcoCalculatorEngine.ts';

test('calculateEnterpriseTco calculates positive net savings for mid-size enterprise', () => {
  const params: TcoInputParams = {
    teamSize: 250,
    monthlyQueriesPerEmployee: 200,
    averageTokensPerQuery: 3000,
    dataSensitivityTier: 'confidential',
    edgeHardwarePreset: 'mac-studio-m4-max-quad',
    yearsHorizon: 3
  };

  const result = calculateEnterpriseTco(params);

  assert.ok(result.annualQueriesTotal === 600_000, 'Should accurately compute 600k annual queries');
  assert.ok(result.threeYearTotals.cloudApi > result.threeYearTotals.skyshadowEdge, 'SkyShadow should be cheaper than cloud API');
  assert.ok(result.threeYearTotals.netSavingsVsCloudApi > 0, 'Net savings should be positive');
  assert.ok(result.paybackPeriodMonths < 24, 'Payback period should be under 24 months');
  assert.ok(result.roiPercentage > 50, 'ROI percentage should exceed 50%');
});

test('calculateEnterpriseTco scales breach mitigation based on defense-grade sensitivity', () => {
  const confidential = calculateEnterpriseTco({
    teamSize: 100,
    monthlyQueriesPerEmployee: 100,
    averageTokensPerQuery: 2000,
    dataSensitivityTier: 'confidential',
    edgeHardwarePreset: 'mac-mini-m4-duo',
    yearsHorizon: 3
  });

  const defense = calculateEnterpriseTco({
    teamSize: 100,
    monthlyQueriesPerEmployee: 100,
    averageTokensPerQuery: 2000,
    dataSensitivityTier: 'defense-grade',
    edgeHardwarePreset: 'mac-mini-m4-duo',
    yearsHorizon: 3
  });

  assert.ok(
    defense.dataBreachRiskMitigationUSD > confidential.dataBreachRiskMitigationUSD,
    'Defense grade risk mitigation value should exceed confidential tier'
  );
});

test('calculateEnterpriseTco demonstrates dramatically lower cost per query on edge', () => {
  const result = calculateEnterpriseTco({
    teamSize: 500,
    monthlyQueriesPerEmployee: 300,
    averageTokensPerQuery: 2500,
    dataSensitivityTier: 'confidential',
    edgeHardwarePreset: 'hyperscale-rack-8x',
    yearsHorizon: 3
  });

  assert.ok(
    result.costPerQuery.skyshadowEdge < result.costPerQuery.cloudApi,
    'Cost per query on SkyShadow edge should be dramatically lower than Cloud API token charges'
  );
});
