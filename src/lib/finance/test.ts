// Simple test to verify rent net worth calculation
import type { BuyInputs, RentInputs, AppSettings } from '../../contexts';
import { calculateAllScenarios } from './calculations';

export function runSimpleTest() {
  // Test with user's exact scenario
  const buyInputs: BuyInputs = {
    propertyPrice: 100000,
    downPaymentPercentage: 100,
    mortgageInterestRateAnnual: 6.5,
    mortgageTermYears: 30,
    homeAppreciationCagr: 4,
    closingCostsPercentageBuy: 2,
    sellingCostsPercentageSell: 5,
    propertyTaxRateAnnual: 1.2,
    insuranceAndMaintenanceRateAnnual: 1.0,
    hoaFeeAnnual: 0,
    marginalTaxRate: 24,
    mortgageInterestDeduction: true,
    longTermCapitalGainsTaxRateProperty: 15,
    taxFreeCapitalGainAmount: 500000,
    filingStatus: 'Married'
  };

  const rentInputs: RentInputs = {
    currentMonthlyRentAmount: 1000,
    rentGrowthRateAnnual: 3,
    sameAsHomeAppreciation: false,
    selectedInvestmentOption: 'Custom' as const,
    customInvestmentReturn: 8,
    longTermCapitalGainsTaxRateInvestment: 15
  };

  const appSettings: AppSettings = {
    currentLanguage: 'en',
    projectionYears: 5,
    showCashOut: true,
    showYearlyMode: true
  };

  const results = calculateAllScenarios(buyInputs, rentInputs, appSettings);
  
  console.log('=== SIMPLE TEST RESULTS ===');
  console.log('Property Price:', buyInputs.propertyPrice);
  console.log('Down Payment %:', buyInputs.downPaymentPercentage);
  console.log('Down Payment Amount:', results.preliminary.mortgage.downPaymentAmount);
  console.log('Loan Amount:', results.preliminary.mortgage.totalLoanAmount);
  console.log('Closing Costs:', results.preliminary.mortgage.closingCostsAmount);
  console.log('Monthly Mortgage Payment:', results.preliminary.mortgage.monthlyPayment);
  console.log('Initial Investment Amount:', results.preliminary.initialInvestmentAmount);
  
  const year1 = results.yearlyResults[0];
  console.log(`\n--- YEAR 1 DETAILED ---`);
  console.log('Property Value (appreciated):', year1.buy.propertyValue);
  console.log('Property Tax:', year1.buy.propertyTax);
  console.log('Insurance & Maintenance:', year1.buy.insuranceAndMaintenance);
  console.log('HOA Fee:', year1.buy.hoaFee);
  console.log('Mortgage Payment (annual):', year1.buy.mortgagePayment);
  console.log('Mortgage Interest:', year1.buy.mortgageInterest);
  console.log('Mortgage Principal:', year1.buy.mortgagePrincipal);
  console.log('Tax Savings:', year1.buy.taxSavingsFromDeduction);
  console.log('Buy Raw Cash Outflow:', year1.buy.cashOutflow);
  console.log('Buy Adjusted Cash Outflow:', year1.buy.adjustedCashOutflow);
  console.log('Remaining Mortgage Balance:', year1.buy.remainingMortgageBalance);
  console.log('Buy Net Worth (Not Cash Out):', year1.buy.netAssetValueNotCashOut);
  console.log('Buy Net Worth (Cash Out):', year1.buy.netAssetValueCashOut);
  
  console.log('\n--- RENT CALCULATION ---');
  console.log('Monthly Rent:', year1.rent.monthlyRent);
  console.log('Annual Rent:', year1.rent.annualRentCost);
  console.log('Rent Cash Outflow:', year1.rent.cashOutflow);
  console.log('Additional Investment:', year1.rent.additionalInvestmentThisYear);
  console.log('Portfolio Before Growth:', year1.rent.portfolioValueBeforeGrowth);
  console.log('Investment Return:', year1.rent.investmentReturnThisYear);
  console.log('Portfolio End Value:', year1.rent.portfolioValueEndOfYear);
  console.log('Total Cash Invested So Far:', year1.rent.totalCashInvestedSoFar);
  console.log('Rent Net Worth (Not Cash Out):', year1.rent.netAssetValueNotCashOut);
  console.log('Rent Net Worth (Cash Out):', year1.rent.netAssetValueCashOut);
  
  console.log('\n--- EXPECTED VS ACTUAL ---');
  console.log('Expected Buy Net Worth (property appreciated):', buyInputs.propertyPrice * (1 + buyInputs.homeAppreciationCagr/100));
  console.log('Actual Buy Net Worth:', year1.buy.netAssetValueNotCashOut);
  
  const expectedInitialInvestment = results.preliminary.mortgage.downPaymentAmount + results.preliminary.mortgage.closingCostsAmount;
  const expectedAdditionalInvestment = year1.buy.adjustedCashOutflow - year1.rent.cashOutflow;
  const expectedTotalInvested = expectedInitialInvestment + expectedAdditionalInvestment;
  const expectedReturn = expectedTotalInvested * (rentInputs.customInvestmentReturn / 100);
  const expectedPortfolioValue = expectedTotalInvested + expectedReturn;
  
  console.log('Expected Initial Investment:', expectedInitialInvestment);
  console.log('Expected Additional Investment:', expectedAdditionalInvestment);
  console.log('Expected Total Invested:', expectedTotalInvested);
  console.log('Expected Return:', expectedReturn);
  console.log('Expected Portfolio Value:', expectedPortfolioValue);
  console.log('Actual Portfolio Value:', year1.rent.portfolioValueEndOfYear);
  
  return results;
}