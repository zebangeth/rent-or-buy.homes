import { useTranslation } from "react-i18next";
import { useApp } from "../../contexts";
import { useCalculations } from "../../hooks/useCalculations";
import { formatCurrency } from "../../lib/inputUtils";

export default function ConclusionBadge() {
  const { t, i18n } = useTranslation();
  const { state } = useApp();
  const calculations = useCalculations();

  // Determine which option is better based on actual calculations
  const comparison = calculations.getNetWorthComparison(
    state.appSettings.projectionYears,
    state.appSettings.showCashOut
  );
  const betterOption = comparison.buy > comparison.rent ? "buy" : "rent";
  const difference = Math.abs(comparison.buy - comparison.rent);

  const isBuyBetter = betterOption === "buy";

  // Format currency based on language
  const formatLocalizedCurrency = (amount: number) => {
    if (i18n.language === "zh") {
      // For Chinese, use 万 (10,000) as unit
      const wan = amount / 10000;
      return `${wan.toFixed(0)}万`;
    } else {
      // For English, use existing formatCurrency
      return formatCurrency(difference);
    }
  };

  return (
    <div
      className={`${
        isBuyBetter ? "bg-primary-600" : "bg-secondary-600"
      } text-white px-4 py-2 rounded-lg inline-block mb-4`}
    >
      <div className="flex items-center font-bold">
        <i className="fas fa-trophy mr-2"></i>
        <span>
          {i18n.language === "zh"
            ? `${isBuyBetter ? t("hero.conclusion.buying") : t("hero.conclusion.renting")}相比${
                isBuyBetter ? t("hero.conclusion.renting") : t("hero.conclusion.buying")
              }会让你在${state.appSettings.projectionYears}年后的净资产多${formatLocalizedCurrency(difference)}`
            : `${isBuyBetter ? t("hero.conclusion.buying") : t("hero.conclusion.renting")} ${t(
                "hero.conclusion.winsByLabel"
              )} ${formatLocalizedCurrency(difference)} ${t("hero.conclusion.overLabel")} ${
                state.appSettings.projectionYears
              } ${t("hero.conclusion.yearsLabel")}`}
        </span>
      </div>
    </div>
  );
}
