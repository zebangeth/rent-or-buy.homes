import { useApp } from "../../contexts";
import { useCalculations } from "../../hooks/useCalculations";
import { formatCurrency } from "../../lib/inputUtils";

export default function NetWorthExplanation() {
  const { state } = useApp();
  const { buyInputs, rentInputs, appSettings } = state;
  const calculations = useCalculations();
  
  // Get the target year result
  const targetResult = calculations.getResultsForYear(appSettings.projectionYears);
  
  // Calculate future home value
  const futureHomeValue = targetResult?.buy.propertyValue ?? 
    buyInputs.propertyPrice * Math.pow(1 + buyInputs.homeAppreciationCagr / 100, appSettings.projectionYears);
  
  // Get net worth values from calculations
  const comparison = calculations.getNetWorthComparison(appSettings.projectionYears, state.appSettings.showCashOut);
  const buyNetWorth = comparison.buy;
  const rentNetWorth = comparison.rent;

  return (
    <>
      <p className="text-xl md:text-2xl leading-relaxed text-dark-800 mb-1 font-medium">
        If you buy a {formatCurrency(buyInputs.propertyPrice)} home today and it grows to{" "}
        <span className="font-bold text-primary-700">
          {formatCurrency(futureHomeValue)}
        </span>{" "}
        in <span className="font-bold">{appSettings.projectionYears}</span> years, your net worth would be{" "}
        <span className="font-bold text-primary-700 border-b-2 border-primary-300">
          {formatCurrency(buyNetWorth)}
        </span>.
      </p>
      
      <p className="text-xl md:text-2xl leading-relaxed text-dark-800 mb-5 font-medium">
        If you rent for {formatCurrency(rentInputs.currentMonthlyRentAmount)}/month and invest the difference, your net worth would be{" "}
        <span className="font-bold text-secondary-700 border-b-2 border-secondary-300">
          {formatCurrency(rentNetWorth)}
        </span>.
      </p>
    </>
  );
}