import assert from "node:assert/strict";
import test from "node:test";

import {
  clearURLHash,
  getStateFromURL,
  hasStateInURL,
  serializeState,
  updateURLWithState,
} from "../src/lib/urlSync";
import type { AppState } from "../src/contexts/AppContext";

interface MockLocation {
  href: string;
  search: string;
  hash: string;
  pathname: string;
}

interface MockWindow {
  location: MockLocation;
  history: {
    replaceState: (_data: unknown, _unused: string, url?: string | URL | null) => void;
  };
}

function createAppState(propertyPrice: number): AppState {
  return {
    buyInputs: {
      propertyPrice,
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
    },
    rentInputs: {
      currentMonthlyRentAmount: 5000,
      rentGrowthRateAnnual: 3.5,
      sameAsHomeAppreciation: true,
      selectedInvestmentOption: "SPY",
      customInvestmentReturn: 10,
      longTermCapitalGainsTaxRateInvestment: 15,
    },
    appSettings: {
      currentLanguage: "en",
      projectionYears: 15,
      showCashOut: false,
      showYearlyMode: false,
    },
    calculations: [],
    isCalculationValid: true,
  };
}

function setWindowURL(initialURL: string): MockWindow {
  const urlState: MockLocation = {
    href: "",
    search: "",
    hash: "",
    pathname: "",
  };

  const syncLocation = (next: string | URL): void => {
    const parsed = new URL(String(next), "https://rent-or-buy.homes");
    urlState.href = parsed.toString();
    urlState.search = parsed.search;
    urlState.hash = parsed.hash;
    urlState.pathname = parsed.pathname;
  };

  syncLocation(initialURL);

  const mockWindow: MockWindow = {
    location: urlState,
    history: {
      replaceState: (_data, _unused, url) => {
        if (url) {
          syncLocation(url);
        }
      },
    },
  };

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    writable: true,
    value: mockWindow,
  });

  return mockWindow;
}

test("query state takes priority over legacy hash state", () => {
  const queryState = serializeState(createAppState(2000000));
  const hashState = serializeState(createAppState(1200000));

  setWindowURL(`https://rent-or-buy.homes/?debug=1&s=${queryState}#${hashState}`);

  const state = getStateFromURL();
  assert.equal(state?.buyInputs?.propertyPrice, 2000000);
  assert.equal(hasStateInURL(), true);
});

test("legacy hash state is still readable when query state is absent", () => {
  const hashState = serializeState(createAppState(1300000));

  setWindowURL(`https://rent-or-buy.homes/#${hashState}`);

  const state = getStateFromURL();
  assert.equal(state?.buyInputs?.propertyPrice, 1300000);
});

test("updateURLWithState writes ?s=, preserves existing params, and clears hash", () => {
  const mockWindow = setWindowURL("https://rent-or-buy.homes/?debug=1#legacy");

  updateURLWithState(createAppState(1700000));

  const params = new URLSearchParams(mockWindow.location.search);
  assert.equal(params.get("debug"), "1");
  assert.equal(Boolean(params.get("s")), true);
  assert.equal(mockWindow.location.hash, "");

  const parsed = getStateFromURL();
  assert.equal(parsed?.buyInputs?.propertyPrice, 1700000);
});

test("clearURLHash removes serialized state while keeping unrelated query params", () => {
  const mockWindow = setWindowURL("https://rent-or-buy.homes/?debug=1&s=abc");

  clearURLHash();

  const params = new URLSearchParams(mockWindow.location.search);
  assert.equal(params.get("debug"), "1");
  assert.equal(params.has("s"), false);
  assert.equal(hasStateInURL(), false);
});
