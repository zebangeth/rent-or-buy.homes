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
  
  return {
    results,
    formulas,
    getResultsForYear,
    getNetWorthComparison,
    getTotalCashOutflowComparison,
    getBreakEvenYear,
    isCalculated: true
  };
}