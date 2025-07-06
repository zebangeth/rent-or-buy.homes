import { useApp } from "../../contexts";
import { useCalculations } from "../../hooks/useCalculations";
import { formatCurrency } from "../../lib/inputUtils";

export default function NetAssetValueCards() {
  const { state } = useApp();
  const { buyInputs, appSettings } = state;
  const calculations = useCalculations();

  // Get the calculation for the target year
  const targetResult = calculations.getResultsForYear(appSettings.projectionYears);
  const comparison = calculations.getNetWorthComparison(appSettings.projectionYears, state.appSettings.showCashOut);

  // Use calculation data if available, otherwise use fallback values
  const buyData = {
    netWorth: comparison.buy,
    propertyValue: targetResult?.buy.propertyValue ?? 0,
    mortgageBalance: targetResult?.buy.remainingMortgageBalance ?? 0,
  };

  const rentData = {
    netWorth: comparison.rent,
    initialInvestment: (buyInputs.propertyPrice * buyInputs.downPaymentPercentage) / 100,
    totalInvested: targetResult?.rent.totalCashInvestedSoFar ?? 0,
    portfolioValue: targetResult?.rent.portfolioValueEndOfYear ?? 0,
  };

  const investmentGrowth = Math.max(0, rentData.portfolioValue - rentData.totalInvested);

  return (
    <>
      {/* Buy Option */}
      <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-primary-500">
        <div className="flex items-center mb-4">
          <i className="fas fa-home text-primary-500 mr-2"></i>
          <span className="font-semibold text-primary-700">Buy a Home</span>
        </div>

        {/* Main Net Worth Display */}
        <div className="text-center mb-4 p-3 bg-primary-50 rounded-lg">
          <div className="text-xs text-primary-600 font-medium mb-1">Net Asset Value</div>
          <div className="text-2xl font-bold text-primary-600">{formatCurrency(buyData.netWorth)}</div>
        </div>

        {/* Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-dark-500">Property value:</span>
            <span className="font-medium">{formatCurrency(buyData.propertyValue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-500">Mortgage balance:</span>
            <span className="font-medium text-red-600">-{formatCurrency(buyData.mortgageBalance)}</span>
          </div>
        </div>
      </div>

      {/* Rent Option */}
      <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-secondary-500">
        <div className="flex items-center mb-4">
          <i className="fas fa-chart-line text-secondary-500 mr-2"></i>
          <span className="font-semibold text-secondary-700">Rent + Invest</span>
        </div>

        {/* Main Net Worth Display */}
        <div className="text-center mb-4 p-3 bg-secondary-50 rounded-lg">
          <div className="text-xs text-secondary-600 font-medium mb-1">Portfolio Value</div>
          <div className="text-2xl font-bold text-secondary-600">{formatCurrency(rentData.netWorth)}</div>
        </div>

        {/* Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-dark-500">Total invested:</span>
            <span className="font-medium">{formatCurrency(rentData.totalInvested)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-500">Investment growth:</span>
            <span className="font-medium text-green-600">+{formatCurrency(investmentGrowth)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
