import { useState, useEffect } from "react";
import { useApp } from "../../contexts";
import { formatCurrency, formatPercentage } from "../../lib/inputUtils";
import { getInvestmentReturnRate } from "../../contexts/AppContext";

export default function KeyAssumptions() {
  const { state } = useApp();
  const { buyInputs, rentInputs } = state;
  const [isExpanded, setIsExpanded] = useState(false);

  const investmentReturn = getInvestmentReturnRate(rentInputs);

  // Set initial expanded state based on screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsExpanded(window.innerWidth >= 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="text-sm text-dark-500 bg-white bg-opacity-60 rounded-lg p-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center justify-between w-full font-medium text-left hover:text-dark-700 transition-colors ${
          isExpanded ? "mb-2" : ""
        }`}
      >
        <span>Key Assumptions</span>
        <i className={`fas fa-chevron-down transform transition-transform ${isExpanded ? "rotate-180" : ""}`}></i>
      </button>
      <div
        className={`grid grid-cols-2 gap-x-4 gap-y-2 overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
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
