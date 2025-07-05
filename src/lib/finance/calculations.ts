import type { BuyInputs, RentInputs, AppSettings } from '../../contexts';
import type { 
  CalculationResults, 
  PreliminaryCalculations, 
  YearlyCalculation,
  YearlyBuyCalculation,
  YearlyRentCalculation,
  YearlyMortgageBreakdown,
  CalculationFormulas
} from './types';
import { TAX_FREE_CAPITAL_GAINS, INVESTMENT_OPTIONS } from '../constants';

/**
 * Calculate monthly mortgage payment using standard PMT formula
 * M = P [i(1 + i)^n] / [(1 + i)^n – 1]
 */
export function calculateMonthlyMortgagePayment(
  loanAmount: number,
  annualInterestRate: number,
  termYears: number
): number {
  if (loanAmount <= 0 || annualInterestRate <= 0) return 0;
  
  const monthlyRate = annualInterestRate / 100 / 12;
  const numberOfPayments = termYears * 12;
  
  if (monthlyRate === 0) return loanAmount / numberOfPayments;
  
  const monthlyPayment = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
  return monthlyPayment;
}

/**
 * Generate mortgage amortization schedule for all years
 */
export function generateAmortizationSchedule(
  loanAmount: number,
  annualInterestRate: number,
  termYears: number,
  projectionYears: number
): YearlyMortgageBreakdown[] {
  const monthlyPayment = calculateMonthlyMortgagePayment(loanAmount, annualInterestRate, termYears);
  const monthlyRate = annualInterestRate / 100 / 12;
  
  let remainingBalance = loanAmount;
  let totalPaid = 0;
  const schedule: YearlyMortgageBreakdown[] = [];
  
  for (let year = 1; year <= projectionYears; year++) {
    let annualInterest = 0;
    let annualPrincipal = 0;
    
    // Calculate 12 months for this year (or remaining months if loan is paid off)
    for (let month = 1; month <= 12 && remainingBalance > 0; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = Math.min(monthlyPayment - interestPayment, remainingBalance);
      
      annualInterest += interestPayment;
      annualPrincipal += principalPayment;
      remainingBalance -= principalPayment;
      totalPaid += monthlyPayment;
    }
    
    schedule.push({
      year,
      annualInterestPaid: annualInterest,
      annualPrincipalPaid: annualPrincipal,
      remainingBalance: Math.max(0, remainingBalance),
      totalPaid
    });
    
    // If mortgage is paid off, remaining years have no payments
    if (remainingBalance <= 0) {
      for (let remainingYear = year + 1; remainingYear <= projectionYears; remainingYear++) {
        schedule.push({
          year: remainingYear,
          annualInterestPaid: 0,
          annualPrincipalPaid: 0,
          remainingBalance: 0,
          totalPaid
        });
      }
      break;
    }
  }
  
  return schedule;
}

/**
 * Calculate preliminary values that are used throughout the calculations
 */
export function calculatePreliminaryValues(
  buyInputs: BuyInputs,
  rentInputs: RentInputs
): PreliminaryCalculations {
  const downPaymentAmount = (buyInputs.propertyPrice * buyInputs.downPaymentPercentage) / 100;
  const loanAmount = buyInputs.propertyPrice - downPaymentAmount;
  const closingCostsAmount = (buyInputs.propertyPrice * buyInputs.closingCostsPercentageBuy) / 100;
  const monthlyPayment = calculateMonthlyMortgagePayment(
    loanAmount,
    buyInputs.mortgageInterestRateAnnual,
    buyInputs.mortgageTermYears
  );
  
  const initialInvestmentAmount = 0; // No longer used - cash flow difference includes down payment savings
  const taxFreeCapitalGainAmount = TAX_FREE_CAPITAL_GAINS[buyInputs.filingStatus];
  
  let investmentReturnRate: number;
  if (rentInputs.selectedInvestmentOption === 'Custom') {
    investmentReturnRate = rentInputs.customInvestmentReturn;
  } else {
    investmentReturnRate = INVESTMENT_OPTIONS[rentInputs.selectedInvestmentOption].returnRate;
  }
  
  return {
    mortgage: {
      monthlyPayment,
      totalLoanAmount: loanAmount,
      downPaymentAmount,
      closingCostsAmount
    },
    initialInvestmentAmount,
    taxFreeCapitalGainAmount,
    investmentReturnRate
  };
}

/**
 * Calculate buy scenario for a specific year
 */
export function calculateBuyScenarioForYear(
  year: number,
  buyInputs: BuyInputs,
  mortgageBreakdown: YearlyMortgageBreakdown,
  preliminary: PreliminaryCalculations,
  rentCashOutflow?: number,
  previousBuyCalculation?: YearlyBuyCalculation
): YearlyBuyCalculation {
  // Current property value with appreciation
  const propertyValue = buyInputs.propertyPrice * Math.pow(1 + buyInputs.homeAppreciationCagr / 100, year);
  
  // Annual holding costs
  const propertyTax = propertyValue * buyInputs.propertyTaxRateAnnual / 100;
  const insuranceAndMaintenance = propertyValue * buyInputs.insuranceAndMaintenanceRateAnnual / 100;
  const hoaFee = buyInputs.hoaFeeAnnual;
  const totalHoldingCosts = propertyTax + insuranceAndMaintenance + hoaFee;
  
  // Mortgage payments
  const annualMortgagePayment = preliminary.mortgage.monthlyPayment * 12;
  
  // Tax savings from mortgage interest deduction
  const taxSavingsFromDeduction = buyInputs.mortgageInterestDeduction 
    ? mortgageBreakdown.annualInterestPaid * buyInputs.marginalTaxRate / 100 
    : 0;
  
  // Cash outflow calculation
  let cashOutflow: number;
  if (year === 1) {
    cashOutflow = preliminary.mortgage.downPaymentAmount + 
                  preliminary.mortgage.closingCostsAmount + 
                  annualMortgagePayment + 
                  totalHoldingCosts;
  } else {
    cashOutflow = annualMortgagePayment + totalHoldingCosts;
  }
  
  const adjustedCashOutflow = cashOutflow - taxSavingsFromDeduction;
  
  // Additional investment portfolio for buy scenario
  let additionalInvestmentPortfolio = 0;
  let additionalInvestmentCostBasis = 0;
  if (rentCashOutflow !== undefined) {
    const cashFlowDifference = rentCashOutflow - adjustedCashOutflow;
    const additionalInvestmentThisYear = Math.max(0, cashFlowDifference);
    
    let portfolioValueBeforeGrowth: number;
    
    if (year === 1) {
      portfolioValueBeforeGrowth = additionalInvestmentThisYear;
      additionalInvestmentCostBasis = additionalInvestmentThisYear;
    } else {
      const previousPortfolioValue = previousBuyCalculation?.additionalInvestmentPortfolio || 0;
      const previousCostBasis = previousBuyCalculation?.additionalInvestmentCostBasis || 0;
      portfolioValueBeforeGrowth = previousPortfolioValue + additionalInvestmentThisYear;
      additionalInvestmentCostBasis = previousCostBasis + additionalInvestmentThisYear;
    }
    
    const investmentReturnThisYear = portfolioValueBeforeGrowth * preliminary.investmentReturnRate / 100;
    additionalInvestmentPortfolio = portfolioValueBeforeGrowth + investmentReturnThisYear;
  }
  
  // Net asset value calculations
  const netAssetValueNotCashOut = propertyValue - mortgageBreakdown.remainingBalance + additionalInvestmentPortfolio;
  
  // Cash out scenario calculations
  const sellingPrice = propertyValue;
  const sellingCostsAmount = sellingPrice * buyInputs.sellingCostsPercentageSell / 100;
  const proceedsBeforeTaxAndLoanRepayment = sellingPrice - sellingCostsAmount;
  const capitalGainOnProperty = sellingPrice - buyInputs.propertyPrice;
  const taxableGainOnProperty = Math.max(0, capitalGainOnProperty - preliminary.taxFreeCapitalGainAmount);
  const taxOnPropertyGain = taxableGainOnProperty * buyInputs.longTermCapitalGainsTaxRateProperty / 100;
  
  // Calculate tax on additional investment portfolio if applicable
  let taxOnAdditionalInvestment = 0;
  let additionalInvestmentGains = 0;
  if (additionalInvestmentPortfolio > 0) {
    additionalInvestmentGains = Math.max(0, additionalInvestmentPortfolio - additionalInvestmentCostBasis);
    taxOnAdditionalInvestment = additionalInvestmentGains * buyInputs.longTermCapitalGainsTaxRateProperty / 100;
  }
  
  const netAssetValueCashOut = proceedsBeforeTaxAndLoanRepayment - 
                               mortgageBreakdown.remainingBalance - 
                               taxOnPropertyGain +
                               additionalInvestmentPortfolio -
                               taxOnAdditionalInvestment;
  
  return {
    year,
    propertyValue,
    totalHoldingCosts,
    propertyTax,
    insuranceAndMaintenance,
    hoaFee,
    mortgagePayment: annualMortgagePayment,
    mortgageInterest: mortgageBreakdown.annualInterestPaid,
    mortgagePrincipal: mortgageBreakdown.annualPrincipalPaid,
    taxSavingsFromDeduction,
    cashOutflow,
    adjustedCashOutflow,
    netAssetValueNotCashOut,
    netAssetValueCashOut,
    capitalGainOnProperty,
    taxableGainOnProperty,
    taxOnPropertyGain,
    remainingMortgageBalance: mortgageBreakdown.remainingBalance,
    additionalInvestmentPortfolio,
    additionalInvestmentCostBasis,
    additionalInvestmentGains,
    taxOnAdditionalInvestment
  };
}

/**
 * Calculate rent & invest scenario for a specific year
 */
export function calculateRentScenarioForYear(
  year: number,
  rentInputs: RentInputs,
  buyCalculation: YearlyBuyCalculation,
  previousRentCalculation: YearlyRentCalculation | null,
  preliminary: PreliminaryCalculations
): YearlyRentCalculation {
  // Current rent calculation
  const monthlyRent = rentInputs.currentMonthlyRentAmount * 
                      Math.pow(1 + rentInputs.rentGrowthRateAnnual / 100, year - 1);
  const annualRentCost = monthlyRent * 12;
  const cashOutflow = annualRentCost;
  
  // Differential cash flow for investment
  // When buy scenario costs more, the difference can be invested (positive)
  // When rent scenario costs more, no additional investment is made (0)
  const cashFlowDifference = buyCalculation.adjustedCashOutflow - cashOutflow;
  const additionalInvestmentThisYear = Math.max(0, cashFlowDifference);
  
  // Investment portfolio calculations
  let portfolioValueBeforeGrowth: number;
  let totalCashInvestedSoFar: number;
  
  if (year === 1) {
    // Year 1: Only invest the cash flow difference (which already includes down payment savings)
    portfolioValueBeforeGrowth = additionalInvestmentThisYear;
    totalCashInvestedSoFar = additionalInvestmentThisYear;
  } else {
    const previousPortfolioValue = previousRentCalculation?.portfolioValueEndOfYear || 0;
    portfolioValueBeforeGrowth = previousPortfolioValue + additionalInvestmentThisYear;
    totalCashInvestedSoFar = (previousRentCalculation?.totalCashInvestedSoFar || 0) + additionalInvestmentThisYear;
  }
  
  const investmentReturnThisYear = portfolioValueBeforeGrowth * preliminary.investmentReturnRate / 100;
  const portfolioValueEndOfYear = portfolioValueBeforeGrowth + investmentReturnThisYear;
  
  // Net asset value calculations
  const netAssetValueNotCashOut = portfolioValueEndOfYear;
  
  // Cash out scenario calculations
  const capitalGainOnInvestment = portfolioValueEndOfYear - totalCashInvestedSoFar;
  const taxableGainOnInvestment = Math.max(0, capitalGainOnInvestment);
  const taxOnInvestmentGain = taxableGainOnInvestment * rentInputs.longTermCapitalGainsTaxRateInvestment / 100;
  const netAssetValueCashOut = portfolioValueEndOfYear - taxOnInvestmentGain;
  
  return {
    year,
    monthlyRent,
    annualRentCost,
    cashOutflow,
    additionalInvestmentThisYear,
    portfolioValueBeforeGrowth,
    investmentReturnThisYear,
    portfolioValueEndOfYear,
    totalCashInvestedSoFar,
    netAssetValueNotCashOut,
    netAssetValueCashOut,
    capitalGainOnInvestment,
    taxableGainOnInvestment,
    taxOnInvestmentGain
  };
}

/**
 * Main calculation function that generates all results
 */
export function calculateAllScenarios(
  buyInputs: BuyInputs,
  rentInputs: RentInputs,
  appSettings: AppSettings
): CalculationResults {
  const preliminary = calculatePreliminaryValues(buyInputs, rentInputs);
  const mortgageSchedule = generateAmortizationSchedule(
    preliminary.mortgage.totalLoanAmount,
    buyInputs.mortgageInterestRateAnnual,
    buyInputs.mortgageTermYears,
    appSettings.projectionYears
  );
  
  const yearlyResults: YearlyCalculation[] = [];
  let previousRentCalculation: YearlyRentCalculation | null = null;
  let previousBuyCalculation: YearlyBuyCalculation | undefined = undefined;
  
  for (let year = 1; year <= appSettings.projectionYears; year++) {
    const mortgageBreakdown = mortgageSchedule[year - 1];
    
    // First pass: Calculate initial buy scenario (without rent cash flow considerations)
    const initialBuyCalculation = calculateBuyScenarioForYear(year, buyInputs, mortgageBreakdown, preliminary);
    
    // Calculate rent scenario based on initial buy calculation
    const rentCalculation = calculateRentScenarioForYear(
      year, 
      rentInputs, 
      initialBuyCalculation, 
      previousRentCalculation, 
      preliminary
    );
    
    // Second pass: Calculate final buy scenario with rent cash flow considerations
    const finalBuyCalculation = calculateBuyScenarioForYear(
      year, 
      buyInputs, 
      mortgageBreakdown, 
      preliminary,
      rentCalculation.cashOutflow,
      previousBuyCalculation
    );
    
    yearlyResults.push({
      year,
      buy: finalBuyCalculation,
      rent: rentCalculation
    });
    
    previousRentCalculation = rentCalculation;
    previousBuyCalculation = finalBuyCalculation;
  }
  
  return {
    preliminary,
    yearlyResults,
    projectionYears: appSettings.projectionYears
  };
}

/**
 * Generate formulas with actual values for display purposes
 */
export function generateCalculationFormulas(
  buyInputs: BuyInputs,
  rentInputs: RentInputs,
  preliminary: PreliminaryCalculations
): CalculationFormulas {
  const P = preliminary.mortgage.totalLoanAmount;
  const r = buyInputs.mortgageInterestRateAnnual;
  const n = buyInputs.mortgageTermYears;
  const i = r / 100 / 12;
  const totalPayments = n * 12;
  
  return {
    monthlyMortgagePayment: `M = ${P.toLocaleString()} × [${(i * 100).toFixed(4)}% × (1 + ${(i * 100).toFixed(4)}%)^${totalPayments}] / [(1 + ${(i * 100).toFixed(4)}%)^${totalPayments} - 1] = $${preliminary.mortgage.monthlyPayment.toLocaleString()}`,
    
    propertyValueGrowth: `Property Value = $${buyInputs.propertyPrice.toLocaleString()} × (1 + ${buyInputs.homeAppreciationCagr}%)^Year`,
    
    investmentGrowth: `Portfolio Value = (Previous Value + New Investment) × (1 + ${preliminary.investmentReturnRate}%)`,
    
    taxCalculations: {
      mortgageInterestDeduction: `Tax Savings = Annual Interest × ${buyInputs.marginalTaxRate}% = $X × ${buyInputs.marginalTaxRate}% = $Y`,
      
      propertyCapitalGains: `Property Tax = max(0, (Sale Price - $${buyInputs.propertyPrice.toLocaleString()}) - $${preliminary.taxFreeCapitalGainAmount.toLocaleString()}) × ${buyInputs.longTermCapitalGainsTaxRateProperty}%`,
      
      investmentCapitalGains: `Investment Tax = max(0, Portfolio Value - Total Invested) × ${rentInputs.longTermCapitalGainsTaxRateInvestment}%`
    }
  };
}