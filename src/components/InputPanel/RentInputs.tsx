import { useTranslation } from "react-i18next";
import { useApp, type RentInputs as RentInputsType, type InvestmentOption } from "../../contexts";
import { useInputHandlers, parseFormattedNumber, type InputValidationConfig } from "../../lib/inputUtils";
import { SLIDER_LIMITS, INVESTMENT_OPTIONS, TAX_RATES, VALIDATION_LIMITS } from "../../lib/constants";
import { SliderInput, ButtonGroup } from "./shared";
import CalculationStatus from "./CalculationStatus";

interface RentInputsProps {
  onSwitchToBuy?: () => void;
}

export default function RentInputs({ onSwitchToBuy }: RentInputsProps) {
  const { t } = useTranslation();
  const { state, updateRentInput } = useApp();
  const { rentInputs, buyInputs } = state;

  const validationConfig: InputValidationConfig<RentInputsType> = {
    currentMonthlyRentAmount: VALIDATION_LIMITS.MONTHLY_RENT,
    rentGrowthRateAnnual: VALIDATION_LIMITS.POSITIVE_NUMBER,
    customInvestmentReturn: VALIDATION_LIMITS.POSITIVE_NUMBER,
    longTermCapitalGainsTaxRateInvestment: VALIDATION_LIMITS.POSITIVE_NUMBER,
  };

  const {
    inputValues,
    setInputValues,
    handleInputChange,
    handleNumberInputChange,
    handleNumberInputBlur,
    getDisplayValue,
    formatDisplayValue,
  } = useInputHandlers(
    rentInputs as unknown as Record<string, unknown>,
    updateRentInput as (field: string, value: unknown) => void,
    validationConfig
  );

  // Dynamic slider limits based on user input
  const getSliderLimits = (field: keyof RentInputsType, currentValue: number) => {
    const currentNum = typeof currentValue === "string" ? parseFormattedNumber(currentValue) : currentValue;

    switch (field) {
      case "currentMonthlyRentAmount": {
        const min = Math.min(SLIDER_LIMITS.MONTHLY_RENT.MIN, currentNum);
        const max = Math.max(SLIDER_LIMITS.MONTHLY_RENT.MAX, currentNum);
        return {
          min,
          max,
          step: SLIDER_LIMITS.MONTHLY_RENT.STEP,
          minLabel: min < 1000 ? `$${min}` : `$${Math.round(min / 1000)}K`,
          maxLabel: max < 1000 ? `$${max}` : `$${Math.round(max / 1000)}K`,
        };
      }
      case "rentGrowthRateAnnual": {
        const min = Math.min(SLIDER_LIMITS.RENT_GROWTH.MIN, currentNum);
        const max = Math.max(SLIDER_LIMITS.RENT_GROWTH.MAX, currentNum);
        return {
          min,
          max,
          step: SLIDER_LIMITS.RENT_GROWTH.STEP,
          minLabel: `${min}%`,
          maxLabel: `${max}%`,
        };
      }
      default:
        return null;
    }
  };

  // Synchronization is now handled in the AppContext reducer

  const getInvestmentReturnRate = () => {
    if (rentInputs.selectedInvestmentOption === "Custom") {
      return rentInputs.customInvestmentReturn;
    }
    return INVESTMENT_OPTIONS[rentInputs.selectedInvestmentOption].returnRate;
  };

  const handleSameAsAppreciationChange = (checked: boolean) => {
    handleInputChange("sameAsHomeAppreciation", checked);
    if (checked) {
      handleInputChange("rentGrowthRateAnnual", buyInputs.homeAppreciationCagr);
    }
  };

  return (
    <div className="space-y-6">
      {/* Monthly Rent */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-dark-700">{t('inputs.rent.monthlyRent')}</label>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-dark-500">$</span>
            <input
              type="text"
              value={formatDisplayValue("currentMonthlyRentAmount", ["currentMonthlyRentAmount"])}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/,/g, "");
                handleNumberInputChange("currentMonthlyRentAmount", rawValue, (val) => parseFormattedNumber(val));
              }}
              onBlur={() => handleNumberInputBlur("currentMonthlyRentAmount", (val) => parseFormattedNumber(val))}
              className="w-24 px-2 py-1 text-sm font-semibold text-secondary-700 bg-secondary-100 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-300 text-center"
              placeholder="6,000"
            />
          </div>
        </div>
        {(() => {
          const limits = getSliderLimits("currentMonthlyRentAmount", rentInputs.currentMonthlyRentAmount);
          return (
            <SliderInput
              value={rentInputs.currentMonthlyRentAmount}
              onChange={(value) => handleInputChange("currentMonthlyRentAmount", value)}
              min={limits?.min || SLIDER_LIMITS.MONTHLY_RENT.MIN}
              max={limits?.max || SLIDER_LIMITS.MONTHLY_RENT.MAX}
              step={limits?.step || SLIDER_LIMITS.MONTHLY_RENT.STEP}
              minLabel={limits?.minLabel || "$1K"}
              maxLabel={limits?.maxLabel || "$10K"}
              className="custom-range-secondary"
            />
          );
        })()}
      </div>

      {/* Rent Increase */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-dark-700">{t('inputs.rent.rentIncrease')}</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={getDisplayValue("rentGrowthRateAnnual")}
              onChange={(e) => handleNumberInputChange("rentGrowthRateAnnual", e.target.value, (val) => Number(val))}
              onBlur={() => handleNumberInputBlur("rentGrowthRateAnnual", (val) => Number(val))}
              className={`w-16 px-2 py-1 text-sm font-semibold text-secondary-700 bg-secondary-100 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-300 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                rentInputs.sameAsHomeAppreciation ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={rentInputs.sameAsHomeAppreciation}
              min="0"
              step="0.5"
            />
            <span className="text-xs text-dark-500">%</span>
          </div>
        </div>
        {(() => {
          const limits = getSliderLimits("rentGrowthRateAnnual", rentInputs.rentGrowthRateAnnual);
          return (
            <>
              <input
                type="range"
                min={limits?.min || 0}
                max={limits?.max || 10}
                value={rentInputs.rentGrowthRateAnnual}
                step="0.5"
                className={`custom-range-secondary ${
                  rentInputs.sameAsHomeAppreciation ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={rentInputs.sameAsHomeAppreciation}
                onChange={(e) => handleInputChange("rentGrowthRateAnnual", Number(e.target.value))}
              />
              <div className="flex justify-between text-xs text-dark-400 mt-1">
                <span>{limits?.minLabel || "0%"}</span>
                <span>{limits?.maxLabel || "10%"}</span>
              </div>
            </>
          );
        })()}
        <div className="mt-2 flex items-center">
          <input
            type="checkbox"
            id="sameAsAppreciationRate"
            checked={rentInputs.sameAsHomeAppreciation}
            onChange={(e) => handleSameAsAppreciationChange(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="sameAsAppreciationRate" className="text-xs text-dark-500">
{t('inputs.rent.sameAsAppreciation')}
          </label>
        </div>
      </div>

      {/* Investment Options */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-dark-700 flex items-center">
{t('inputs.rent.investmentReturn')}
            <div className="relative group ml-1">
              <i className="fas fa-info-circle text-secondary-400 text-xs"></i>
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-60 p-2 bg-dark-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                Your estimated average annual growth rate for investments.
              </div>
            </div>
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={
                inputValues["investmentReturn"] !== undefined
                  ? inputValues["investmentReturn"]
                  : getInvestmentReturnRate()
              }
              onChange={(e) => {
                const value = e.target.value;
                // Update local display value immediately
                setInputValues((prev) => ({ ...prev, investmentReturn: value }));

                if (value !== "" && !isNaN(Number(value))) {
                  const numValue = Math.max(0, Number(value));
                  // Auto-switch to Custom when user edits the field
                  if (rentInputs.selectedInvestmentOption !== "Custom") {
                    handleInputChange("selectedInvestmentOption", "Custom");
                  }
                  handleInputChange("customInvestmentReturn", numValue);
                }
              }}
              onBlur={() => {
                const localValue = inputValues["investmentReturn"];
                if (localValue === "" || isNaN(Number(localValue))) {
                  // Reset to current value
                  setInputValues((prev) => {
                    const newState = { ...prev };
                    delete newState["investmentReturn"];
                    return newState;
                  });
                } else {
                  // Ensure it's saved and clear local state
                  const numValue = Math.max(0, Number(localValue));
                  if (rentInputs.selectedInvestmentOption !== "Custom") {
                    handleInputChange("selectedInvestmentOption", "Custom");
                  }
                  handleInputChange("customInvestmentReturn", numValue);
                  setInputValues((prev) => {
                    const newState = { ...prev };
                    delete newState["investmentReturn"];
                    return newState;
                  });
                }
              }}
              className="w-16 px-2 py-1 text-sm font-semibold text-secondary-700 bg-secondary-100 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-300 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min="0"
              max="30"
              step="0.25"
            />
            <span className="text-xs text-dark-500">%</span>
          </div>
        </div>

        {/* Investment Type Buttons */}
        <ButtonGroup
          options={Object.keys(INVESTMENT_OPTIONS).map((key) => ({
            value: key as InvestmentOption,
            label: INVESTMENT_OPTIONS[key as InvestmentOption].name,
          }))}
          value={rentInputs.selectedInvestmentOption}
          onChange={(value) => handleInputChange("selectedInvestmentOption", value)}
          className="grid grid-cols-3 gap-2 mb-3"
          activeClassName="bg-secondary-500 text-white"
          buttonClassName="text-sm font-medium px-0 py-2 rounded-lg"
        />

        {/* Investment Option Description */}
        {(rentInputs.selectedInvestmentOption === "SPY" || rentInputs.selectedInvestmentOption === "QQQ") && (
          <div className="text-2xs text-dark-400 leading-relaxed">
            <p>
              {INVESTMENT_OPTIONS[rentInputs.selectedInvestmentOption].name} returns based on 2015-2024 total return
              CAGR. <br />
              Source:{" "}
              <a
                href="https://portfolioslab.com/tools/stock-comparison/SPY/QQQ"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-500 hover:text-secondary-600 underline"
              >
                portfolioslab.com
              </a>
            </p>
          </div>
        )}

        {/* Custom Investment Return Slider */}
        {rentInputs.selectedInvestmentOption === "Custom" && (
          <div className="mt-3">
            <input
              type="range"
              min="0"
              max="30"
              value={rentInputs.customInvestmentReturn}
              step="0.25"
              className="custom-range-secondary"
              onChange={(e) => handleInputChange("customInvestmentReturn", Number(e.target.value))}
            />
            <div className="flex justify-between text-xs text-dark-400 mt-1">
              <span>0%</span>
              <span>30%</span>
            </div>
          </div>
        )}
      </div>

      {/* Capital Gains Tax Rate */}
      <div>
        <div className="flex justify-between mb-3">
          <label className="text-sm font-medium text-dark-700 flex items-center">
{t('inputs.rent.capitalGainsTax')}
            <div className="relative group ml-1">
              <i className="fas fa-info-circle text-secondary-400 text-xs"></i>
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-96 p-3 bg-dark-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 max-h-96 overflow-y-auto">
                <p className="mb-2">
                  Tax rate on profits when investments are sold. Based on your income and filing status:
                </p>
                <table className="w-full text-xs border-collapse">
                  <thead className="bg-dark-700">
                    <tr>
                      <th className="p-1 text-left">Filing Status</th>
                      <th className="p-1 text-left">Income Range</th>
                      <th className="p-1 text-right">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-dark-600">
                      <td className="p-1 font-medium" rowSpan={4}>
                        Single
                      </td>
                      <td className="p-1">$0 – $48,350</td>
                      <td className="p-1 text-right">0%</td>
                    </tr>
                    <tr className="border-b border-dark-600">
                      <td className="p-1">$48,351 – $200,000</td>
                      <td className="p-1 text-right">15%</td>
                    </tr>
                    <tr className="border-b border-dark-600">
                      <td className="p-1">$200,001 – $533,400</td>
                      <td className="p-1 text-right">18.8%</td>
                    </tr>
                    <tr className="border-b border-dark-600">
                      <td className="p-1">Over $533,400</td>
                      <td className="p-1 text-right">23.8%</td>
                    </tr>
                    <tr className="border-b border-dark-600">
                      <td className="p-1 font-medium" rowSpan={4}>
                        Married Filing Jointly
                      </td>
                      <td className="p-1">$0 – $96,700</td>
                      <td className="p-1 text-right">0%</td>
                    </tr>
                    <tr className="border-b border-dark-600">
                      <td className="p-1">$96,701 – $250,000</td>
                      <td className="p-1 text-right">15%</td>
                    </tr>
                    <tr className="border-b border-dark-600">
                      <td className="p-1">$250,001 – $600,050</td>
                      <td className="p-1 text-right">18.8%</td>
                    </tr>
                    <tr className="border-b border-dark-600">
                      <td className="p-1">Over $600,050</td>
                      <td className="p-1 text-right">23.8%</td>
                    </tr>
                  </tbody>
                </table>
                <p className="mt-2 text-xs">
                  Includes Long-Term Capital Gains Tax + Net Investment Income Tax where applicable.
                </p>
              </div>
            </div>
          </label>
        </div>

        {/* Tax Rate Selection Buttons */}
        <ButtonGroup
          options={TAX_RATES.CAPITAL_GAINS.map((rate) => ({
            value: rate,
            label: `${rate}%`,
          }))}
          value={rentInputs.longTermCapitalGainsTaxRateInvestment}
          onChange={(value) => handleInputChange("longTermCapitalGainsTaxRateInvestment", value)}
          className="grid grid-cols-4 gap-2"
          activeClassName="bg-secondary-500 text-white"
          inactiveClassName="bg-gray-100 text-dark-600 hover:bg-gray-200"
        />
      </div>

      {/* Tab Switch Button */}
      {onSwitchToBuy && (
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={onSwitchToBuy}
            className="w-full py-2.5 px-4 text-primary-600 font-medium rounded-lg border border-primary-200 bg-primary-50 hover:bg-primary-100 transition duration-200 flex items-center justify-center"
          >
            <i className="fas fa-exchange-alt mr-2"></i>
{t('inputs.rent.switchToBuy')}
          </button>
        </div>
      )}

      {/* Calculation Status */}
      <CalculationStatus />
    </div>
  );
}
