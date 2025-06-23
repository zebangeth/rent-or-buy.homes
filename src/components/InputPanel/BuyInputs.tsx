import { useState } from "react";
import { useApp, type BuyInputs as BuyInputsType } from "../../contexts";

interface BuyInputsProps {
  onSwitchToRent?: () => void;
}

export default function BuyInputs({ onSwitchToRent }: BuyInputsProps) {
  const { state, updateBuyInput } = useApp();
  const { buyInputs } = state;
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Local state for input display values to allow partial editing
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const handleInputChange = <K extends keyof BuyInputsType>(field: K, value: BuyInputsType[K]) => {
    updateBuyInput(field, value);
  };

  const validateInput = <K extends keyof BuyInputsType>(field: K, value: number): number => {
    switch (field) {
      case "propertyPrice":
      case "hoaFeeAnnual": {
        return Math.max(0, value);
      }
      case "downPaymentPercentage":
      case "closingCostsPercentageBuy":
      case "sellingCostsPercentageSell":
      case "propertyTaxRateAnnual":
      case "insuranceAndMaintenanceRateAnnual":
      case "marginalTaxRate":
      case "longTermCapitalGainsTaxRateProperty": {
        return Math.max(0, Math.min(100, value));
      }
      case "mortgageInterestRateAnnual":
      case "homeAppreciationCagr": {
        return Math.max(0, value);
      }
      default:
        return value;
    }
  };

  const handleNumberInputChange = <K extends keyof BuyInputsType>(
    field: K,
    value: string,
    parser: (val: string) => BuyInputsType[K]
  ) => {
    // Update local display value immediately for smooth UX
    setInputValues((prev) => ({ ...prev, [field]: value }));

    // Only update global state if we have a valid number
    if (value !== "" && !isNaN(Number(value))) {
      const numValue = parser(value);
      if (!isNaN(numValue as number)) {
        const validatedValue = validateInput(field, numValue as number);
        updateBuyInput(field, validatedValue as BuyInputsType[K]);
      }
    }
  };

  const handleNumberInputBlur = <K extends keyof BuyInputsType>(
    field: K,
    parser: (val: string) => BuyInputsType[K]
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
      // Update global state with final validated value
      const numValue = parser(localValue);
      if (!isNaN(numValue as number)) {
        const validatedValue = validateInput(field, numValue as number);
        updateBuyInput(field, validatedValue as BuyInputsType[K]);
      }
      // Clear local state
      setInputValues((prev) => {
        const newState = { ...prev };
        delete newState[field];
        return newState;
      });
    }
  };

  const getDisplayValue = <K extends keyof BuyInputsType>(field: K): string | number => {
    return inputValues[field] !== undefined ? inputValues[field] : buyInputs[field];
  };

  const formatNumberWithCommas = (value: number): string => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  const parseFormattedNumber = (value: string): number => {
    return Number(value.replace(/,/g, ""));
  };

  const formatDisplayValue = <K extends keyof BuyInputsType>(field: K): string | number => {
    const value = getDisplayValue(field);
    if (typeof value === "string") {
      return value; // Already being edited, keep as-is
    }
    // Format large numbers with commas for better readability
    const fieldsToFormat = ["propertyPrice", "hoaFeeAnnual"] as const;
    if (fieldsToFormat.includes(field as any) && typeof value === "number") {
      return formatNumberWithCommas(value);
    }
    return value;
  };

  // Dynamic slider limits based on user input
  const getSliderLimits = (field: keyof BuyInputsType, currentValue: number) => {
    const currentNum = typeof currentValue === "string" ? parseFormattedNumber(currentValue) : currentValue;

    switch (field) {
      case "propertyPrice":
        const defaultMin = 100000;
        const defaultMax = 10000000;
        const min = Math.min(defaultMin, currentNum);
        const max = Math.max(defaultMax, currentNum);
        return {
          min,
          max,
          minLabel: min < 1000000 ? `$${Math.round(min / 1000)}K` : `$${(min / 1000000).toFixed(1)}M`,
          maxLabel: max < 1000000 ? `$${Math.round(max / 1000)}K` : `$${(max / 1000000).toFixed(1)}M`,
        };
      case "mortgageInterestRateAnnual":
        const irMin = Math.min(0, currentNum);
        const irMax = Math.max(10, currentNum);
        return {
          min: irMin,
          max: irMax,
          minLabel: `${irMin}%`,
          maxLabel: `${irMax}%`
        };
      case "homeAppreciationCagr":
        const haMin = Math.min(0, currentNum);
        const haMax = Math.max(10, currentNum);
        return {
          min: haMin,
          max: haMax,
          minLabel: `${haMin}%`,
          maxLabel: `${haMax}%`
        };
      default:
        return null;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculateDownPaymentAmount = () => {
    return (buyInputs.propertyPrice * buyInputs.downPaymentPercentage) / 100;
  };

  return (
    <div className="space-y-6">
      {/* Property Price */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-dark-700">Property Purchase Price</label>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-dark-500">$</span>
            <input
              type="text"
              value={formatDisplayValue("propertyPrice")}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/,/g, "");
                handleNumberInputChange("propertyPrice", rawValue, (val) => parseFormattedNumber(val));
              }}
              onBlur={() => handleNumberInputBlur("propertyPrice", (val) => parseFormattedNumber(val))}
              className="w-28 px-2 py-1 text-sm font-semibold text-primary-700 bg-primary-100 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 text-center"
              placeholder="2,500,000"
            />
          </div>
        </div>
        {(() => {
          const limits = getSliderLimits("propertyPrice", buyInputs.propertyPrice);
          return (
            <>
              <input
                type="range"
                min={limits?.min || 100000}
                max={limits?.max || 10000000}
                value={buyInputs.propertyPrice}
                step="50000"
                className="custom-range"
                onChange={(e) => handleInputChange("propertyPrice", Number(e.target.value))}
              />
              <div className="flex justify-between text-xs text-dark-400 mt-1">
                <span>{limits?.minLabel || "$100K"}</span>
                <span>{limits?.maxLabel || "$10M"}</span>
              </div>
            </>
          );
        })()}
      </div>

      {/* Down Payment */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-dark-700">Down Payment</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={getDisplayValue("downPaymentPercentage")}
              onChange={(e) => handleNumberInputChange("downPaymentPercentage", e.target.value, (val) => Number(val))}
              onBlur={() => handleNumberInputBlur("downPaymentPercentage", (val) => Number(val))}
              className="w-16 px-2 py-1 text-sm font-semibold text-primary-700 bg-primary-100 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min="0"
              max="100"
              step="1"
            />
            <span className="text-xs text-dark-500">%</span>
            <span className="text-xs text-dark-400">({formatCurrency(calculateDownPaymentAmount())})</span>
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={buyInputs.downPaymentPercentage}
          step="1"
          className="custom-range"
          onChange={(e) => handleInputChange("downPaymentPercentage", Number(e.target.value))}
        />
        <div className="flex justify-between text-xs text-dark-400 mt-1">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Interest Rate */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-dark-700">Mortgage Interest Rate</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={getDisplayValue("mortgageInterestRateAnnual")}
              onChange={(e) =>
                handleNumberInputChange("mortgageInterestRateAnnual", e.target.value, (val) => Number(val))
              }
              onBlur={() => handleNumberInputBlur("mortgageInterestRateAnnual", (val) => Number(val))}
              className="w-16 px-2 py-1 text-sm font-semibold text-primary-700 bg-primary-100 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min="0"
              step="0.25"
            />
            <span className="text-xs text-dark-500">%</span>
          </div>
        </div>
{(() => {
          const limits = getSliderLimits("mortgageInterestRateAnnual", buyInputs.mortgageInterestRateAnnual);
          return (
            <>
              <input
                type="range"
                min={limits?.min || 0}
                max={limits?.max || 10}
                value={buyInputs.mortgageInterestRateAnnual}
                step="0.25"
                className="custom-range"
                onChange={(e) => handleInputChange("mortgageInterestRateAnnual", Number(e.target.value))}
              />
              <div className="flex justify-between text-xs text-dark-400 mt-1">
                <span>{limits?.minLabel || "0%"}</span>
                <span>{limits?.maxLabel || "10%"}</span>
              </div>
            </>
          );
        })()}
      </div>

      {/* Mortgage Term */}
      <div>
        <div className="flex justify-between mb-3">
          <label className="text-sm font-medium text-dark-700">Mortgage Term</label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[30, 20, 15].map((term) => (
            <button
              key={term}
              onClick={() => handleInputChange("mortgageTermYears", term as 15 | 20 | 30)}
              className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                buyInputs.mortgageTermYears === term
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-dark-500 hover:bg-gray-200"
              }`}
            >
              {term} Years
            </button>
          ))}
        </div>
      </div>

      {/* Expected Annual Home Appreciation */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-dark-700">Expected Annual Home Appreciation</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={getDisplayValue("homeAppreciationCagr")}
              onChange={(e) => {
                handleNumberInputChange("homeAppreciationCagr", e.target.value, (val) => Number(val));
              }}
              onBlur={() => handleNumberInputBlur("homeAppreciationCagr", (val) => Number(val))}
              className="w-16 px-2 py-1 text-sm font-semibold text-primary-700 bg-primary-100 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min="0"
              step="0.5"
            />
            <span className="text-xs text-dark-500">%</span>
          </div>
        </div>
{(() => {
          const limits = getSliderLimits("homeAppreciationCagr", buyInputs.homeAppreciationCagr);
          return (
            <>
              <input
                type="range"
                min={limits?.min || 0}
                max={limits?.max || 10}
                value={buyInputs.homeAppreciationCagr}
                step="0.5"
                className="custom-range"
                onChange={(e) => handleInputChange("homeAppreciationCagr", Number(e.target.value))}
              />
              <div className="flex justify-between text-xs text-dark-400 mt-1">
                <span>{limits?.minLabel || "0%"}</span>
                <span>{limits?.maxLabel || "10%"}</span>
              </div>
            </>
          );
        })()}
        <div className="text-xs text-dark-400 mt-1 italic">Based on historical average in your selected area</div>
      </div>

      {/* Advanced Options Toggle */}
      <div className="mt-4 border-t border-gray-100 pt-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex w-full items-center justify-between text-dark-600 hover:text-primary-600 transition"
        >
          <span className="font-medium text-sm">Advanced Options</span>
          <i className={`fas ${showAdvanced ? "fa-chevron-up" : "fa-chevron-down"} text-xs`}></i>
        </button>

        {/* Advanced Options Content */}
        {showAdvanced && (
          <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-xl">
            {/* Transaction Costs Section */}
            <div className="text-xs font-semibold text-dark-600 mb-2">Buying/Selling Transaction Costs</div>

            {/* Closing Costs */}
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-dark-600 flex items-center">
                Closing Costs (Current Buy)
                <div className="relative group ml-1">
                  <i className="fas fa-info-circle text-primary-400 text-xs"></i>
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-52 p-2 bg-dark-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                    As a % of property price (e.g., loan origination, title, and other closing costs).
                  </div>
                </div>
              </label>
              <div className="flex space-x-2 items-center">
                <input
                  type="number"
                  value={getDisplayValue("closingCostsPercentageBuy")}
                  onChange={(e) =>
                    handleNumberInputChange("closingCostsPercentageBuy", e.target.value, (val) => Number(val))
                  }
                  onBlur={() => handleNumberInputBlur("closingCostsPercentageBuy", (val) => Number(val))}
                  className="w-16 p-1 text-xs text-center border rounded-lg"
                  min="0"
                  max="100"
                />
                <span className="text-xs text-dark-500">%</span>
              </div>
            </div>

            {/* Selling Costs */}
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-dark-600 flex items-center">
                Selling Costs (Future Sale)
                <div className="relative group ml-1">
                  <i className="fas fa-info-circle text-primary-400 text-xs"></i>
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-52 p-2 bg-dark-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                    As a % of future sale price (e.g., agent commissions).
                  </div>
                </div>
              </label>
              <div className="flex space-x-2 items-center">
                <input
                  type="number"
                  value={getDisplayValue("sellingCostsPercentageSell")}
                  onChange={(e) =>
                    handleNumberInputChange("sellingCostsPercentageSell", e.target.value, (val) => Number(val))
                  }
                  onBlur={() => handleNumberInputBlur("sellingCostsPercentageSell", (val) => Number(val))}
                  className="w-16 p-1 text-xs text-center border rounded-lg"
                  min="0"
                  max="100"
                />
                <span className="text-xs text-dark-500">%</span>
              </div>
            </div>

            {/* Holding Costs Section */}
            <div className="text-xs font-semibold text-dark-600 mb-2 mt-4">Holding Costs (Annual)</div>

            {/* Property Tax Rate */}
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-dark-600 flex items-center">
                Property Tax Rate
                <div className="relative group ml-1">
                  <i className="fas fa-info-circle text-primary-400 text-xs"></i>
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-52 p-2 bg-dark-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                    As a % of the property's assessed value each year.
                  </div>
                </div>
              </label>
              <div className="flex space-x-2 items-center">
                <input
                  type="number"
                  value={getDisplayValue("propertyTaxRateAnnual")}
                  step="0.1"
                  onChange={(e) =>
                    handleNumberInputChange("propertyTaxRateAnnual", e.target.value, (val) => Number(val))
                  }
                  onBlur={() => handleNumberInputBlur("propertyTaxRateAnnual", (val) => Number(val))}
                  className="w-16 p-1 text-xs text-center border rounded-lg"
                  min="0"
                  max="100"
                />
                <span className="text-xs text-dark-500">%</span>
              </div>
            </div>

            {/* Insurance & Maintenance */}
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-dark-600 flex items-center">
                Insurance & Maintenance
                <div className="relative group ml-1">
                  <i className="fas fa-info-circle text-primary-400 text-xs"></i>
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-52 p-2 bg-dark-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                    Combined estimate as a % of the property's value each year.
                  </div>
                </div>
              </label>
              <div className="flex space-x-2 items-center">
                <input
                  type="number"
                  value={getDisplayValue("insuranceAndMaintenanceRateAnnual")}
                  step="0.1"
                  onChange={(e) =>
                    handleNumberInputChange("insuranceAndMaintenanceRateAnnual", e.target.value, (val) => Number(val))
                  }
                  onBlur={() => handleNumberInputBlur("insuranceAndMaintenanceRateAnnual", (val) => Number(val))}
                  className="w-16 p-1 text-xs text-center border rounded-lg"
                  min="0"
                  max="100"
                />
                <span className="text-xs text-dark-500">%</span>
              </div>
            </div>

            {/* HOA Fee */}
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-dark-600">HOA Fee</label>
              <div className="flex space-x-2 items-center">
                <span className="text-xs text-dark-500">$</span>
                <input
                  type="text"
                  value={formatDisplayValue("hoaFeeAnnual")}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/,/g, "");
                    if (rawValue === "" || (!isNaN(Number(rawValue)) && Number(rawValue) >= 0)) {
                      handleNumberInputChange("hoaFeeAnnual", rawValue, (val) => parseFormattedNumber(val));
                    }
                  }}
                  onBlur={() => handleNumberInputBlur("hoaFeeAnnual", (val) => parseFormattedNumber(val))}
                  className="w-16 p-1 text-xs text-center border rounded-lg"
                  placeholder="5,000"
                />
              </div>
            </div>

            {/* Tax Implications Section */}
            <div className="text-xs font-semibold text-dark-600 mb-2 mt-4">Tax Implications</div>

            {/* Marginal Tax Rate */}
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-dark-600 flex items-center">
                Your Marginal Income Tax Rate
                <div className="relative group ml-1">
                  <i className="fas fa-info-circle text-primary-400 text-xs"></i>
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-60 p-2 bg-dark-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                    Your combined federal and state rate. Used to estimate mortgage interest deduction benefits.
                  </div>
                </div>
              </label>
              <div className="flex space-x-2 items-center">
                <input
                  type="number"
                  value={getDisplayValue("marginalTaxRate")}
                  onChange={(e) => handleNumberInputChange("marginalTaxRate", e.target.value, (val) => Number(val))}
                  onBlur={() => handleNumberInputBlur("marginalTaxRate", (val) => Number(val))}
                  className="w-16 p-1 text-xs text-center border rounded-lg"
                  min="0"
                  max="100"
                />
                <span className="text-xs text-dark-500">%</span>
              </div>
            </div>

            {/* Mortgage Interest Deduction Toggle */}
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-dark-600 flex items-center">
                Claim Mortgage Interest Deduction?
                <div className="relative group ml-1">
                  <i className="fas fa-info-circle text-primary-400 text-xs"></i>
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-60 p-2 bg-dark-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                    If you itemize deductions on your tax return, you can deduct the interest paid on your mortgage.
                  </div>
                </div>
              </label>
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={buyInputs.mortgageInterestDeduction}
                      onChange={(e) => handleInputChange("mortgageInterestDeduction", e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`block w-8 h-4 rounded-full transition-colors ${
                        buyInputs.mortgageInterestDeduction ? "bg-primary-300" : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`dot absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform ${
                        buyInputs.mortgageInterestDeduction ? "translate-x-4 bg-primary-500" : ""
                      }`}
                    ></div>
                  </div>
                </label>
              </div>
            </div>

            {/* Capital Gains Tax Rate */}
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-dark-600">Capital Gains Tax Rate (Property Sale)</label>
              <div className="flex space-x-2 items-center">
                <input
                  type="number"
                  value={getDisplayValue("longTermCapitalGainsTaxRateProperty")}
                  onChange={(e) =>
                    handleNumberInputChange("longTermCapitalGainsTaxRateProperty", e.target.value, (val) => Number(val))
                  }
                  onBlur={() => handleNumberInputBlur("longTermCapitalGainsTaxRateProperty", (val) => Number(val))}
                  className="w-16 p-1 text-xs text-center border rounded-lg"
                  min="0"
                  max="100"
                />
                <span className="text-xs text-dark-500">%</span>
              </div>
            </div>

            {/* Filing Status */}
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-dark-600 flex items-center">
                Tax-Free Capital Gain Amount (Home Sale)
                <div className="relative group ml-1">
                  <i className="fas fa-info-circle text-primary-400 text-xs"></i>
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-60 p-2 bg-dark-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                    $250,000 for single, $500,000 for married filing jointly in the US.
                  </div>
                </div>
              </label>
              <div className="flex space-x-2">
                <div className="flex bg-gray-100 rounded-lg overflow-hidden">
                  {["Married", "Single", "HeadOfHousehold"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleInputChange("filingStatus", status)}
                      className={`px-2 py-1 text-xs font-medium transition-colors ${
                        buyInputs.filingStatus === status
                          ? "bg-primary-600 text-white"
                          : "text-dark-600 hover:bg-gray-200"
                      }`}
                    >
                      {status === "HeadOfHousehold" ? "HoH" : status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tab Switch Button */}
      {onSwitchToRent && (
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={onSwitchToRent}
            className="w-full py-2.5 px-4 text-secondary-600 font-medium rounded-lg border border-secondary-200 bg-secondary-50 hover:bg-secondary-100 transition duration-200 flex items-center justify-center"
          >
            <i className="fas fa-exchange-alt mr-2"></i>
            Switch to Rent & Invest
          </button>
        </div>
      )}

      {/* Calculate Button */}
      <div className="pt-4">
        <button className="w-full py-3.5 px-4 text-white font-medium rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition duration-300 shadow-md">
          <i className="fas fa-calculator mr-2"></i> Calculate Result
        </button>
      </div>
    </div>
  );
}
