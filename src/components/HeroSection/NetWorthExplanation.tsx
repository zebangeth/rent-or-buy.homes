import { useTranslation } from "react-i18next";
import { useApp } from "../../contexts";
import { useCalculations } from "../../hooks/useCalculations";
import { formatCurrency } from "../../lib/inputUtils";

export default function NetWorthExplanation() {
  const { t, i18n } = useTranslation();
  const { state } = useApp();
  const { buyInputs, rentInputs, appSettings } = state;
  const calculations = useCalculations();

  // Get the target year result
  const targetResult = calculations.getResultsForYear(appSettings.projectionYears);

  // Calculate future home value
  const futureHomeValue =
    targetResult?.buy.propertyValue ??
    buyInputs.propertyPrice * Math.pow(1 + buyInputs.homeAppreciationCagr / 100, appSettings.projectionYears);

  // Get net worth values from calculations
  const comparison = calculations.getNetWorthComparison(appSettings.projectionYears, state.appSettings.showCashOut);
  const buyNetWorth = comparison.buy;
  const rentNetWorth = comparison.rent;

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

  // Format rent (keep original formatting for rent amounts)
  const formatRent = (amount: number) => {
    return formatCurrency(amount);
  };

  return (
    <>
      <p className="text-xl md:text-2xl leading-relaxed text-dark-800 mb-1 font-medium">
        {i18n.language === "zh"
          ? <>如果你今天购买一套价值<span className="font-bold text-primary-700">{formatLocalizedCurrency(buyInputs.propertyPrice)}</span>的房子（首付{buyInputs.downPaymentPercentage}%），经过{appSettings.projectionYears}年增值到<span className="font-bold text-primary-700">{formatLocalizedCurrency(futureHomeValue)}</span>，你的净资产将达到<span className="font-bold text-primary-700 border-b-2 border-primary-300">{formatLocalizedCurrency(buyNetWorth)}</span>。</>
          : `${t("hero.explanation.buyPrefix")} ${formatLocalizedCurrency(buyInputs.propertyPrice)} ${t("hero.explanation.buyMiddle")} ${buyInputs.downPaymentPercentage}% ${t("hero.explanation.buyDownPayment")} `}
        {i18n.language !== "zh" && (
          <>
            <span className="font-bold text-primary-700">{formatLocalizedCurrency(futureHomeValue)}</span>{" "}
            {t("hero.explanation.buyMiddle2")} <span className="font-bold">{appSettings.projectionYears}</span> {t("hero.explanation.buySuffix")}{" "}
            <span className="font-bold text-primary-700 border-b-2 border-primary-300">{formatLocalizedCurrency(buyNetWorth)}</span>.
          </>
        )}
      </p>

      <p className="text-xl md:text-2xl leading-relaxed text-dark-800 mb-5 font-medium">
        {i18n.language === "zh"
          ? <>如果你每月支付{formatRent(rentInputs.currentMonthlyRentAmount)}租金并投资差额，你的净资产将达到<span className="font-bold text-secondary-700 border-b-2 border-secondary-300">{formatLocalizedCurrency(rentNetWorth)}</span>。</>
          : `${t("hero.explanation.rentPrefix")} ${formatRent(rentInputs.currentMonthlyRentAmount)}${t("hero.explanation.rentSuffix")}, `}
        {i18n.language !== "zh" && (
          <span className="font-bold text-secondary-700 border-b-2 border-secondary-300">
            {formatLocalizedCurrency(rentNetWorth)}
          </span>
        )}
        {i18n.language !== "zh" && "."}
      </p>
    </>
  );
}
