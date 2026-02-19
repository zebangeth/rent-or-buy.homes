import assert from "node:assert/strict";
import test from "node:test";

import { calculateAllScenarios } from "../src/lib/finance/calculations";
import type { AppSettings, BuyInputs, RentInputs } from "../src/contexts/AppContext";

function assertClose(actual: number, expected: number, epsilon = 1e-6): void {
  assert.ok(Math.abs(actual - expected) <= epsilon, `Expected ${actual} to be close to ${expected} (±${epsilon})`);
}

const buyInputs: BuyInputs = {
  propertyPrice: 1500000,
  downPaymentPercentage: 25,
  mortgageInterestRateAnnual: 6.75,
  mortgageTermYears: 30,
  homeAppreciationCagr: 3.5,
  closingCostsPercentageBuy: 2,
  sellingCostsPercentageSell: 5,
  propertyTaxRateAnnual: 1.1,
  insuranceAndMaintenanceRateAnnual: 1.0,
  hoaFeeAnnual: 0,
  marginalTaxRate: 24,
  mortgageInterestDeduction: true,
  longTermCapitalGainsTaxRateProperty: 15,
  taxFreeCapitalGainAmount: 500000,
  filingStatus: "Married",
};

const rentInputs: RentInputs = {
  currentMonthlyRentAmount: 5000,
  rentGrowthRateAnnual: 3.5,
  sameAsHomeAppreciation: true,
  selectedInvestmentOption: "SPY",
  customInvestmentReturn: 10,
  longTermCapitalGainsTaxRateInvestment: 15,
};

const appSettings: AppSettings = {
  currentLanguage: "en",
  projectionYears: 15,
  showCashOut: false,
  showYearlyMode: false,
};

test("financial engine keeps baseline outputs stable for default scenario", () => {
  const results = calculateAllScenarios(buyInputs, rentInputs, appSettings);

  assert.equal(results.yearlyResults.length, 15);

  const year1 = results.yearlyResults[0];
  assertClose(year1.buy.adjustedCashOutflow, 507026.1844551654);
  assertClose(year1.rent.cashOutflow, 60000);
  assertClose(year1.buy.netAssetValueNotCashOut, 439489.66561360983);
  assertClose(year1.rent.netAssetValueNotCashOut, 505139.58843433694);

  const year15 = results.yearlyResults[14];
  assertClose(year15.buy.adjustedCashOutflow, 126703.39694770689);
  assertClose(year15.rent.cashOutflow, 97121.67134795127);
  assertClose(year15.buy.netAssetValueNotCashOut, 1688449.7843634235);
  assertClose(year15.rent.netAssetValueNotCashOut, 4269075.941504488);

  const breakEvenYear =
    results.yearlyResults.find((result) => result.rent.netAssetValueNotCashOut - result.buy.netAssetValueNotCashOut > 0)?.year ??
    null;
  assert.equal(breakEvenYear, 1);
});
