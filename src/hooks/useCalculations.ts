import { useMemo } from 'react';
import { useApp } from '../contexts';
import { calculateAllScenarios, generateCalculationFormulas, type CalculationResults, type CalculationFormulas } from '../lib/finance';

export function useCalculations() {
  const { state } = useApp();
  
  const results: CalculationResults = useMemo(() => {
    return calculateAllScenarios(
      state.buyInputs,
      state.rentInputs,
      state.appSettings
    );
  }, [state.buyInputs, state.rentInputs, state.appSettings]);
  
  const formulas: CalculationFormulas = useMemo(() => {
    return generateCalculationFormulas(
      state.buyInputs,
      state.rentInputs,
      results.preliminary
    );
  }, [state.buyInputs, state.rentInputs, results.preliminary]);
  
  // Helper functions for quick access to key metrics
  const getResultsForYear = (year: number) => {
    return results.yearlyResults.find(r => r.year === year);
  };
  
  const getNetWorthComparison = (year: number, cashOut: boolean = false) => {
    const yearResult = getResultsForYear(year);
    if (!yearResult) return { buy: 0, rent: 0, difference: 0 };
    
    const buyNetWorth = cashOut ? yearResult.buy.netAssetValueCashOut : yearResult.buy.netAssetValueNotCashOut;
    const rentNetWorth = cashOut ? yearResult.rent.netAssetValueCashOut : yearResult.rent.netAssetValueNotCashOut;
    
    return {
      buy: buyNetWorth,
      rent: rentNetWorth,
      difference: rentNetWorth - buyNetWorth
    };
  };
  
  const getTotalCashOutflowComparison = (year: number) => {
    const yearResult = getResultsForYear(year);
    if (!yearResult) return { buy: 0, rent: 0, difference: 0 };
    
    // Calculate cumulative cash outflow up to this year
    let totalBuyCashFlow = 0;
    let totalRentCashFlow = 0;
    
    for (let y = 1; y <= year; y++) {
      const result = getResultsForYear(y);
      if (result) {
        totalBuyCashFlow += result.buy.adjustedCashOutflow;
        totalRentCashFlow += result.rent.cashOutflow;
      }
    }
    
    return {
      buy: totalBuyCashFlow,
      rent: totalRentCashFlow,
      difference: totalRentCashFlow - totalBuyCashFlow
    };
  };
  
  const getBreakEvenYear = (cashOut: boolean = false) => {
    for (let year = 1; year <= results.projectionYears; year++) {
      const comparison = getNetWorthComparison(year, cashOut);
      if (comparison.difference > 0) {
        return year;
      }
    }
    return null; // No break-even within projection period
  };

  // Cash flow analysis helpers
  const getCashFlowData = (adjusted: boolean = true) => {
    return results.yearlyResults.map(result => ({
      year: result.year,
      buyAnnual: adjusted ? result.buy.adjustedCashOutflow : result.buy.cashOutflow,
      rentAnnual: result.rent.cashOutflow,
      difference: (adjusted ? result.buy.adjustedCashOutflow : result.buy.cashOutflow) - result.rent.cashOutflow,
      additionalInvestment: result.rent.additionalInvestmentThisYear,
      buyHasAdditionalInvestment: result.buy.additionalInvestmentPortfolio > 0
    }));
  };

  const getCumulativeCashFlowData = (adjusted: boolean = true) => {
    let buyRunningTotal = 0;
    let rentRunningTotal = 0;
    
    return results.yearlyResults.map(result => {
      buyRunningTotal += adjusted ? result.buy.adjustedCashOutflow : result.buy.cashOutflow;
      rentRunningTotal += result.rent.cashOutflow;
      
      return {
        year: result.year,
        buyCumulative: buyRunningTotal,
        rentCumulative: rentRunningTotal,
        difference: buyRunningTotal - rentRunningTotal
      };
    });
  };

  const getCashFlowSummary = (adjusted: boolean = true) => {
    const cashFlowData = getCashFlowData(adjusted);
    const totalBuyOutflow = cashFlowData.reduce((sum, data) => sum + data.buyAnnual, 0);
    const totalRentOutflow = cashFlowData.reduce((sum, data) => sum + data.rentAnnual, 0);
    const totalAdditionalInvestment = cashFlowData.reduce((sum, data) => sum + data.additionalInvestment, 0);
    
    return {
      totalBuyOutflow,
      totalRentOutflow,
      totalDifference: totalBuyOutflow - totalRentOutflow,
      totalAdditionalInvestment,
      averageAnnualBuyOutflow: totalBuyOutflow / results.projectionYears,
      averageAnnualRentOutflow: totalRentOutflow / results.projectionYears,
      yearsWithInvestmentOpportunity: cashFlowData.filter(data => data.additionalInvestment > 0).length,
      largestAnnualDifference: Math.max(...cashFlowData.map(data => Math.abs(data.difference)))
    };
  };
  
  return {
    results,
    formulas,
    getResultsForYear,
    getNetWorthComparison,
    getTotalCashOutflowComparison,
    getBreakEvenYear,
    getCashFlowData,
    getCumulativeCashFlowData,
    getCashFlowSummary,
    isCalculated: true
  };
}