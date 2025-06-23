import { useState, useEffect } from "react";
import { useApp, type RentInputs as RentInputsType, type InvestmentOption } from "../../contexts";

interface RentInputsProps {
  onSwitchToBuy?: () => void;
}

export default function RentInputs({ onSwitchToBuy }: RentInputsProps) {
  const { state, updateRentInput } = useApp();
  const { rentInputs, buyInputs } = state;

  // Local state for input display values to allow partial editing
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const handleInputChange = <K extends keyof RentInputsType>(field: K, value: RentInputsType[K]) => {
    updateRentInput(field, value);
  };

  const handleNumberInputChange = <K extends keyof RentInputsType>(
    field: K,
    value: string,
    parser: (val: string) => RentInputsType[K]
  ) => {
    // Update local display value immediately for smooth UX
    setInputValues((prev) => ({ ...prev, [field]: value }));

    // Only update global state if we have a valid number
    if (value !== "" && !isNaN(Number(value))) {
      const numValue = parser(value);
      if (!isNaN(numValue as number)) {
        updateRentInput(field, numValue);
      }
    }
  };

  const handleNumberInputBlur = <K extends keyof RentInputsType>(
    field: K,
    parser: (val: string) => RentInputsType[K]
  ) => {
    // On blur, clear local state and ensure we have a valid value
    const localValue = inputValues[field];
    if (localValue === "" || isNaN(Number(localValue))) {
      // Reset to current global state value if invalid
      setInputValues((prev) => {
        const newState = { ...prev };
        delete newState[field];
        return newState;
      });
    } else {
      // Update global state with final value
      const numValue = parser(localValue);
      if (!isNaN(numValue as number)) {
        updateRentInput(field, numValue);
      }
      // Clear local state
      setInputValues((prev) => {
        const newState = { ...prev };
        delete newState[field];
        return newState;
      });
    }
  };

  const getDisplayValue = <K extends keyof RentInputsType>(field: K): string | number => {
    return inputValues[field] !== undefined ? inputValues[field] : rentInputs[field];
  };

  const formatNumberWithCommas = (value: number): string => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  const parseFormattedNumber = (value: string): number => {
    return Number(value.replace(/,/g, ""));
  };

  const formatDisplayValue = <K extends keyof RentInputsType>(field: K): string | number => {
    const value = getDisplayValue(field);
    if (typeof value === "string") {
      return value; // Already being edited, keep as-is
    }
    // Format large numbers with commas for better readability
    const fieldsToFormat = ["currentMonthlyRentAmount"] as const;
    if (fieldsToFormat.includes(field as any) && typeof value === "number") {
      return formatNumberWithCommas(value);
    }
    return value;
  };

  // Dynamic slider limits based on user input
  const getSliderLimits = (field: keyof RentInputsType, currentValue: number) => {
    const currentNum = typeof currentValue === "string" ? parseFormattedNumber(currentValue) : currentValue;

    switch (field) {
      case "currentMonthlyRentAmount":
        const defaultMin = 1000;
        const defaultMax = 10000;
        const min = Math.min(defaultMin, currentNum);
        const max = Math.max(defaultMax, currentNum);
        return {
          min,
          max,
          minLabel: min < 1000 ? `$${min}` : `$${Math.round(min / 1000)}K`,
          maxLabel: max < 1000 ? `$${max}` : `$${Math.round(max / 1000)}K`,
        };
      default:
        return null;
    }
  };

  // Auto-sync rent growth with home appreciation when enabled
  useEffect(() => {
    if (rentInputs.sameAsHomeAppreciation) {
      updateRentInput("rentGrowthRateAnnual", buyInputs.homeAppreciationCagr);
    }
  }, [buyInputs.homeAppreciationCagr, rentInputs.sameAsHomeAppreciation, updateRentInput]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getInvestmentReturnRate = () => {
    const rates: Record<InvestmentOption, number> = {
      SPY: 8,
      QQQ: 9.25,
      Custom: rentInputs.customInvestmentReturn,
    };
    return rates[rentInputs.selectedInvestmentOption];
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
          <label className="text-sm font-medium text-dark-700">Monthly Rent</label>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-dark-500">$</span>
            <input
              type="text"
              value={formatDisplayValue("currentMonthlyRentAmount")}
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
            <>
              <input
                type="range"
                min={limits?.min || 1000}
                max={limits?.max || 10000}
                value={rentInputs.currentMonthlyRentAmount}
                step="100"
                className="custom-range-secondary"
                onChange={(e) => handleInputChange("currentMonthlyRentAmount", Number(e.target.value))}
              />
              <div className="flex justify-between text-xs text-dark-400 mt-1">
                <span>{limits?.minLabel || "$1K"}</span>
                <span>{limits?.maxLabel || "$10K"}</span>
              </div>
            </>
          );
        })()}
      </div>

      {/* Rent Increase */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-dark-700">Expected Annual Rent Increase</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={getDisplayValue("rentGrowthRateAnnual")}
              onChange={(e) => handleNumberInputChange("rentGrowthRateAnnual", e.target.value, (val) => Number(val))}
              onBlur={() => handleNumberInputBlur("rentGrowthRateAnnual", (val) => Number(val))}
              className={`w-16 px-2 py-1 text-sm font-semibold text-secondary-700 bg-secondary-100 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-300 text-center ${
                rentInputs.sameAsHomeAppreciation ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={rentInputs.sameAsHomeAppreciation}
              min="0"
              max="10"
              step="0.5"
            />
            <span className="text-xs text-dark-500">%</span>
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          value={rentInputs.rentGrowthRateAnnual}
          step="0.5"
          className={`custom-range-secondary ${
            rentInputs.sameAsHomeAppreciation ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={rentInputs.sameAsHomeAppreciation}
          onChange={(e) => handleInputChange("rentGrowthRateAnnual", Number(e.target.value))}
        />
        <div className="flex justify-between text-xs text-dark-400 mt-1">
          <span>0%</span>
          <span>10%</span>
        </div>
        <div className="mt-2 flex items-center">
          <input
            type="checkbox"
            id="sameAsAppreciationRate"
            checked={rentInputs.sameAsHomeAppreciation}
            onChange={(e) => handleSameAsAppreciationChange(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="sameAsAppreciationRate" className="text-xs text-dark-500">
            Same as home appreciation rate
          </label>
        </div>
      </div>

      {/* Investment Options */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-dark-700 flex items-center">
            Annual Investment Return
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
                  // Auto-switch to Custom when user edits the field
                  if (rentInputs.selectedInvestmentOption !== "Custom") {
                    handleInputChange("selectedInvestmentOption", "Custom");
                  }
                  handleInputChange("customInvestmentReturn", Number(value));
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
                  if (rentInputs.selectedInvestmentOption !== "Custom") {
                    handleInputChange("selectedInvestmentOption", "Custom");
                  }
                  handleInputChange("customInvestmentReturn", Number(localValue));
                  setInputValues((prev) => {
                    const newState = { ...prev };
                    delete newState["investmentReturn"];
                    return newState;
                  });
                }
              }}
              className="w-16 px-2 py-1 text-sm font-semibold text-secondary-700 bg-secondary-100 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-300 text-center"
              min="0"
              max="30"
              step="0.25"
            />
            <span className="text-xs text-dark-500">%</span>
          </div>
        </div>

        {/* Investment Type Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {(["SPY", "QQQ", "Custom"] as InvestmentOption[]).map((option) => (
            <button
              key={option}
              onClick={() => handleInputChange("selectedInvestmentOption", option)}
              className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                rentInputs.selectedInvestmentOption === option
                  ? "bg-secondary-500 text-white"
                  : "bg-gray-100 text-dark-500 hover:bg-gray-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

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
            Capital Gains Tax Rate
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
                    <tr className="border-b border-dark-600">
                      <td className="p-1 font-medium" rowSpan={4}>
                        Head of Household
                      </td>
                      <td className="p-1">$0 – $64,750</td>
                      <td className="p-1 text-right">0%</td>
                    </tr>
                    <tr className="border-b border-dark-600">
                      <td className="p-1">$64,751 – $200,000</td>
                      <td className="p-1 text-right">15%</td>
                    </tr>
                    <tr className="border-b border-dark-600">
                      <td className="p-1">$200,001 – $566,700</td>
                      <td className="p-1 text-right">18.8%</td>
                    </tr>
                    <tr>
                      <td className="p-1">Over $566,700</td>
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
        <div className="grid grid-cols-4 gap-2">
          {[0, 15, 18.8, 23.8].map((rate) => (
            <button
              key={rate}
              onClick={() => handleInputChange("longTermCapitalGainsTaxRateInvestment", rate)}
              className={`text-center p-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                rentInputs.longTermCapitalGainsTaxRateInvestment === rate
                  ? "bg-secondary-500 text-white"
                  : "bg-gray-100 text-dark-600 hover:bg-gray-200"
              }`}
            >
              {rate}%
            </button>
          ))}
        </div>
      </div>

      {/* Tab Switch Button */}
      {onSwitchToBuy && (
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={onSwitchToBuy}
            className="w-full py-2.5 px-4 text-primary-600 font-medium rounded-lg border border-primary-200 bg-primary-50 hover:bg-primary-100 transition duration-200 flex items-center justify-center"
          >
            <i className="fas fa-exchange-alt mr-2"></i>
            Switch to Buy
          </button>
        </div>
      )}

      {/* Calculate Button */}
      <div className="pt-4">
        <button className="w-full py-3.5 px-4 text-white font-medium rounded-xl bg-gradient-to-r from-secondary-600 to-secondary-500 hover:from-secondary-700 hover:to-secondary-600 transition duration-300 shadow-md">
          <i className="fas fa-calculator mr-2"></i> Calculate Result
        </button>
      </div>
    </div>
  );
}
