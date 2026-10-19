import test from 'node:test';
import assert from 'node:assert/strict';
import { calculate5YearForecast, calculateCustomerLtvCac } from './financialForecaster.ts';

test('calculate5YearForecast generates 5 consecutive years of projections', () => {
  const forecast = calculate5YearForecast({ scenario: 'target' });
  assert.equal(forecast.length, 5);
  assert.equal(forecast[0].year, 1);
  assert.equal(forecast[4].year, 5);
});

test('calculate5YearForecast shows gross margins expanding as software ARR dominates', () => {
  const forecast = calculate5YearForecast({ scenario: 'target' });
  assert.ok(forecast[0].grossMarginPercent < forecast[4].grossMarginPercent);
  assert.ok(forecast[4].grossMarginPercent >= 70, 'Year 5 gross margin should exceed 70%');
});

test('calculate5YearForecast computes significant enterprise valuation by Year 5', () => {
  const forecast = calculate5YearForecast({ scenario: 'target' });
  const year5Valuation = forecast[4].enterpriseValuationUSD;
  // Year 5 valuation should exceed $500M in target scenario
  assert.ok(year5Valuation > 500000000, `Expected > $500M, got ${year5Valuation}`);
});

test('calculateCustomerLtvCac computes strong unit economics', () => {
  const metrics = calculateCustomerLtvCac(149, 48, 850);
  assert.ok(metrics.ltvCacRatio > 5, 'LTV/CAC ratio should be elite (> 5:1)');
  assert.ok(metrics.paybackMonths < 12, 'CAC payback should be under 12 months');
});
