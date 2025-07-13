export const SLIDER_LIMITS = {
  PROPERTY_PRICE: {
    MIN: 100000,
    MAX: 10000000,
    STEP: 50000,
  },
  MORTGAGE_INTEREST_RATE: {
    MIN: 0,
    MAX: 10,
    STEP: 0.25,
  },
  HOME_APPRECIATION: {
    MIN: 0,
    MAX: 10,
    STEP: 0.5,
  },
  DOWN_PAYMENT: {
    MIN: 0,
    MAX: 100,
    STEP: 1,
  },
  MONTHLY_RENT: {
    MIN: 1000,
    MAX: 10000,
    STEP: 100,
  },
  RENT_GROWTH: {
    MIN: 0,
    MAX: 10,
    STEP: 0.5,
  },
  INVESTMENT_RETURN: {
    MIN: 0,
    MAX: 30,
    STEP: 0.25,
  },
} as const;

export const INVESTMENT_OPTIONS = {
  SPY: {
    name: "S&P 500",
    returnRate: 13,
  },
  QQQ: {
    name: "Nasdaq 100",
    returnRate: 18,
  },
  Custom: {
    name: "Custom",
    returnRate: 10, // Will be set by user
  },
} as const;

export const TAX_RATES = {
  CAPITAL_GAINS: [0, 15, 18.8, 23.8] as const,
} as const;

export const TAX_FREE_CAPITAL_GAINS = {
  Single: 250000,
  Married: 500000,
} as const;

export const MORTGAGE_TERMS = [15, 20, 30] as const;

export const VALIDATION_LIMITS = {
  PERCENTAGE: { min: 0, max: 100 },
  POSITIVE_NUMBER: { min: 0 },
  PROPERTY_PRICE: { min: 0 },
  HOA_FEE: { min: 0 },
  MONTHLY_RENT: { min: 0 },
} as const;
