import { useTranslation } from "react-i18next";
import { useApp } from "../../contexts";
import { useCalculations } from "../../hooks/useCalculations";
import { formatCurrency } from "../../lib/inputUtils";

export default function NetAssetValueCards() {
  const { t, i18n } = useTranslation();
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
    additionalInvestmentPortfolio: targetResult?.buy.additionalInvestmentPortfolio ?? 0,
    additionalInvestmentCostBasis: targetResult?.buy.additionalInvestmentCostBasis ?? 0,
  };

  const rentData = {
    netWorth: comparison.rent,
    initialInvestment: (buyInputs.propertyPrice * buyInputs.downPaymentPercentage) / 100,
    totalInvested: targetResult?.rent.totalCashInvestedSoFar ?? 0,
    portfolioValue: targetResult?.rent.portfolioValueEndOfYear ?? 0,
  };

  // Format currency based on language
  const formatLocalizedCurrency = (amount: number) => {
    if (i18n.language === "zh") {
      // For Chinese, use 万 (10,000) as unit
      const wan = amount / 10000;
      return `${wan.toFixed(0)}万`;
    } else {
      // For English, use existing formatCurrency
      return formatCurrency(amount);
    }
  };

  return (
    <>
      {/* Buy Option */}
      <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-primary-500">
        <div className="flex items-center mb-4">
          <i className="fas fa-home text-primary-500 mr-2"></i>
          <span className="font-semibold text-primary-700">{t("hero.netWorth.buyTitle")}</span>
        </div>

        {/* Main Net Worth Display */}
        <div className="text-center mb-2 p-2 bg-primary-50 rounded-lg">
          <div className="text-xs text-primary-600 font-medium mb-1">
            {t("hero.netWorth.netWorthIn")} {appSettings.projectionYears} {t("hero.netWorth.years")}
          </div>
          <div className="text-2xl font-bold text-primary-600">{formatLocalizedCurrency(buyData.netWorth)}</div>
        </div>

        {/* Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="text-dark-500">
            {t("hero.netWorth.buyExplanation.youOwn")}{" "}
            <span className="font-bold text-primary-700">{formatLocalizedCurrency(buyData.propertyValue)}</span>{" "}
            {t("hero.netWorth.buyExplanation.homeAndOwe")}{" "}
            <span className="font-bold text-red-700">{formatLocalizedCurrency(buyData.mortgageBalance)}</span>{" "}
            {t("hero.netWorth.buyExplanation.onMortgage")}
          </div>
          {buyData.additionalInvestmentPortfolio > 0 && (
            <div className="text-dark-500">
              {t("hero.netWorth.buyExplanation.alsoInvested")}{" "}
              <span className="font-bold text-primary-700">
                {formatLocalizedCurrency(buyData.additionalInvestmentCostBasis)}
              </span>{" "}
              {t("hero.netWorth.buyExplanation.nowWorth")}{" "}
              <span className="font-bold text-primary-700">
                {formatLocalizedCurrency(buyData.additionalInvestmentPortfolio)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Rent Option */}
      <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-secondary-500">
        <div className="flex items-center mb-4">
          <i className="fas fa-chart-line text-secondary-500 mr-2"></i>
          <span className="font-semibold text-secondary-700">{t("hero.netWorth.rentTitle")}</span>
        </div>

        {/* Main Net Worth Display */}
        <div className="text-center mb-2 p-2 bg-secondary-50 rounded-lg">
          <div className="text-xs text-secondary-600 font-medium mb-1">
            {t("hero.netWorth.netWorthIn")} {appSettings.projectionYears} {t("hero.netWorth.years")}
          </div>
          <div className="text-2xl font-bold text-secondary-600">{formatLocalizedCurrency(rentData.netWorth)}</div>
        </div>

        {/* Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="text-dark-500">
            {t("hero.netWorth.rentExplanation.youInvested")}{" "}
            <span className="font-bold text-secondary-700">{formatLocalizedCurrency(rentData.totalInvested)}</span>{" "}
            {t("hero.netWorth.rentExplanation.nowWorth")}{" "}
            <span className="font-bold text-secondary-700">{formatLocalizedCurrency(rentData.portfolioValue)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
