import { useApp } from "../../contexts";
import { useCalculations } from "../../hooks/useCalculations";

export default function ConclusionBadge() {
  const { state } = useApp();
  const calculations = useCalculations();
  
  // Determine which option is better based on actual calculations
  const comparison = calculations.getNetWorthComparison(state.appSettings.projectionYears, state.appSettings.showCashOut);
  const betterOption = comparison.buy > comparison.rent ? "buy" : "rent";
  
  const isBuyBetter = betterOption === "buy";
  
  return (
    <div className={`${
      isBuyBetter 
        ? "bg-primary-600" 
        : "bg-secondary-600"
    } text-white px-4 py-2 rounded-lg inline-block mb-4`}>
      <div className="flex items-center font-bold">
        <i className="fas fa-trophy mr-2"></i>
        <span>
          {isBuyBetter ? "Buying" : "Renting"} is the better option
        </span>
      </div>
    </div>
  );
}