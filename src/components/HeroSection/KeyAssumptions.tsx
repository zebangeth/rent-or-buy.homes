import { useApp } from "../../contexts";
import { formatCurrency, formatPercentage } from "../../lib/inputUtils";
import { getInvestmentReturnRate } from "../../contexts/AppContext";

export default function KeyAssumptions() {
  const { state } = useApp();
  const { buyInputs, rentInputs } = state;

  const investmentReturn = getInvestmentReturnRate(rentInputs);

  return (
    <div className="text-sm text-dark-500 bg-white bg-opacity-60 rounded-lg p-3">
      <div className="font-medium mb-2">Key Assumptions:</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <div className="flex items-center">
          <i className="fas fa-home text-primary-500 mr-2"></i>
          <span>
            Home value: <span className="font-medium">{formatCurrency(buyInputs.propertyPrice)}</span>
          </span>
        </div>

        <div className="flex items-center">
          <i className="fas fa-building text-secondary-500 mr-2"></i>
          <span>
            Current rent: <span className="font-medium">{formatCurrency(rentInputs.currentMonthlyRentAmount)}/mo</span>
          </span>
        </div>

        <div className="flex items-center">
          <i className="fas fa-coins text-primary-500 mr-2"></i>
          <span>
            Down payment: <span className="font-medium">{formatPercentage(buyInputs.downPaymentPercentage)}</span>
          </span>
        </div>

        <div className="flex items-center">
          <i className="fas fa-chart-line text-secondary-500 mr-2"></i>
          <span>
            Investment returns: <span className="font-medium">{formatPercentage(investmentReturn)}/yr</span>
          </span>
        </div>

        <div className="flex items-center">
          <i className="fas fa-arrow-trend-up text-primary-500 mr-2"></i>
          <span>
            Home appreciation:{" "}
            <span className="font-medium">{formatPercentage(buyInputs.homeAppreciationCagr)}/yr</span>
          </span>
        </div>

        <div className="flex items-center">
          <i className="fas fa-arrow-trend-up text-secondary-500 mr-2"></i>
          <span>
            Rent increase: <span className="font-medium">{formatPercentage(rentInputs.rentGrowthRateAnnual)}/yr</span>
          </span>
        </div>
      </div>
    </div>
  );
}
