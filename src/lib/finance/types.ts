export interface MortgageDetails {
  monthlyPayment: number;
  totalLoanAmount: number;
  downPaymentAmount: number;
  closingCostsAmount: number;
}

export interface YearlyMortgageBreakdown {
  year: number;
  annualInterestPaid: number;
  annualPrincipalPaid: number;
  remainingBalance: number;
  totalPaid: number;
}

export interface YearlyBuyCalculation {
  year: number;
  propertyValue: number;
  totalHoldingCosts: number;
  propertyTax: number;
  insuranceAndMaintenance: number;
  hoaFee: number;
  mortgagePayment: number;
  mortgageInterest: number;
  mortgagePrincipal: number;
  taxSavingsFromDeduction: number;
  cashOutflow: number;
  adjustedCashOutflow: number;
  netAssetValueNotCashOut: number;
  netAssetValueCashOut: number;
  capitalGainOnProperty: number;
  taxableGainOnProperty: number;
  taxOnPropertyGain: number;
  remainingMortgageBalance: number;
  additionalInvestmentPortfolio: number;
  additionalInvestmentCostBasis: number;
  additionalInvestmentGains: number;
  taxOnAdditionalInvestment: number;
}

export interface YearlyRentCalculation {
  year: number;
  monthlyRent: number;
  annualRentCost: number;
  cashOutflow: number;
  additionalInvestmentThisYear: number;
  portfolioValueBeforeGrowth: number;
  investmentReturnThisYear: number;
  portfolioValueEndOfYear: number;
  totalCashInvestedSoFar: number;
  netAssetValueNotCashOut: number;
  netAssetValueCashOut: number;
  capitalGainOnInvestment: number;
  taxableGainOnInvestment: number;
  taxOnInvestmentGain: number;
}

export interface YearlyCalculation {
  year: number;
  buy: YearlyBuyCalculation;
  rent: YearlyRentCalculation;
}

export interface PreliminaryCalculations {
  mortgage: MortgageDetails;
  initialInvestmentAmount: number;
  taxFreeCapitalGainAmount: number;
  investmentReturnRate: number;
}

export interface CalculationResults {
  preliminary: PreliminaryCalculations;
  yearlyResults: YearlyCalculation[];
  projectionYears: number;
}

export interface CalculationFormulas {
  monthlyMortgagePayment: string;
  propertyValueGrowth: string;
  investmentGrowth: string;
  taxCalculations: {
    mortgageInterestDeduction: string;
    propertyCapitalGains: string;
    investmentCapitalGains: string;
  };
}