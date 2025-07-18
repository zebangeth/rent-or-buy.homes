import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp, type BuyInputs as BuyInputsType } from "../../contexts";
import {
  useInputHandlers,
  formatCurrency,
  parseFormattedNumber,
  type InputValidationConfig,
} from "../../lib/inputUtils";
import { SLIDER_LIMITS, MORTGAGE_TERMS, TAX_RATES, VALIDATION_LIMITS } from "../../lib/constants";
import { SliderInput, ButtonGroup } from "./shared";
import CalculationStatus from "./CalculationStatus";

interface BuyInputsProps {
  onSwitchToRent?: () => void;
}

export default function BuyInputs({ onSwitchToRent }: BuyInputsProps) {
  const { t } = useTranslation();
  const { state, updateBuyInput } = useApp();
  const { buyInputs } = state;
  const [showAdvanced, setShowAdvanced] = useState(false);

  const validationConfig: InputValidationConfig<BuyInputsType> = {
    propertyPrice: VALIDATION_LIMITS.PROPERTY_PRICE,
    hoaFeeAnnual: VALIDATION_LIMITS.HOA_FEE,
    downPaymentPercentage: VALIDATION_LIMITS.PERCENTAGE,
    closingCostsPercentageBuy: VALIDATION_LIMITS.PERCENTAGE,
    sellingCostsPercentageSell: VALIDATION_LIMITS.PERCENTAGE,
    propertyTaxRateAnnual: VALIDATION_LIMITS.PERCENTAGE,
    insuranceAndMaintenanceRateAnnual: VALIDATION_LIMITS.PERCENTAGE,
    marginalTaxRate: VALIDATION_LIMITS.PERCENTAGE,
    longTermCapitalGainsTaxRateProperty: VALIDATION_LIMITS.PERCENTAGE,
    mortgageInterestRateAnnual: VALIDATION_LIMITS.POSITIVE_NUMBER,
    homeAppreciationCagr: VALIDATION_LIMITS.POSITIVE_NUMBER,
  };

  const { handleInputChange, handleNumberInputChange, handleNumberInputBlur, getDisplayValue, formatDisplayValue } =
    useInputHandlers(
      buyInputs as unknown as Record<string, unknown>,
      updateBuyInput as (field: string, value: unknown) => void,
      validationConfig
    );

  // Dynamic slider limits based on user input
  const getSliderLimits = (field: keyof BuyInputsType, currentValue: number) => {
    const currentNum = typeof currentValue === "string" ? parseFormattedNumber(currentValue) : currentValue;

    switch (field) {
      case "propertyPrice": {
        const min = Math.min(SLIDER_LIMITS.PROPERTY_PRICE.MIN, currentNum);
        const max = Math.max(SLIDER_LIMITS.PROPERTY_PRICE.MAX, currentNum);
        return {
          min,
          max,
          step: SLIDER_LIMITS.PROPERTY_PRICE.STEP,
          minLabel: min < 1000000 ? `$${Math.round(min / 1000)}K` : `$${(min / 1000000).toFixed(1)}M`,
          maxLabel: max < 1000000 ? `$${Math.round(max / 1000)}K` : `$${(max / 1000000).toFixed(1)}M`,
        };
      }
      case "mortgageInterestRateAnnual": {
        const min = Math.min(SLIDER_LIMITS.MORTGAGE_INTEREST_RATE.MIN, currentNum);
        const max = Math.max(SLIDER_LIMITS.MORTGAGE_INTEREST_RATE.MAX, currentNum);
        return {
          min,
          max,
          step: SLIDER_LIMITS.MORTGAGE_INTEREST_RATE.STEP,
          minLabel: `${min}%`,
          maxLabel: `${max}%`,
        };
      }
      case "homeAppreciationCagr": {
        const min = Math.min(SLIDER_LIMITS.HOME_APPRECIATION.MIN, currentNum);
        const max = Math.max(SLIDER_LIMITS.HOME_APPRECIATION.MAX, currentNum);
        return {
          min,
          max,
          step: SLIDER_LIMITS.HOME_APPRECIATION.STEP,
          minLabel: `${min}%`,
          maxLabel: `${max}%`,
        };
      }
      default:
        return null;
    }
  };

  const calculateDownPaymentAmount = () => {
    return (buyInputs.propertyPrice * buyInputs.downPaymentPercentage) / 100;
  };

  return (
    <div className="space-y-4">
      {/* Property Price */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-dark-700">{t("inputs.buy.homePrice")}</label>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-dark-500">$</span>
            <input
              type="text"
              value={formatDisplayValue("propertyPrice", ["propertyPrice", "hoaFeeAnnual"])}
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
            <SliderInput
              value={buyInputs.propertyPrice}
              onChange={(value) => handleInputChange("propertyPrice", value)}
              min={limits?.min || SLIDER_LIMITS.PROPERTY_PRICE.MIN}
              max={limits?.max || SLIDER_LIMITS.PROPERTY_PRICE.MAX}
              step={limits?.step || SLIDER_LIMITS.PROPERTY_PRICE.STEP}
              minLabel={limits?.minLabel || "$100K"}
              maxLabel={limits?.maxLabel || "$10M"}
            />
          );
        })()}
      </div>

      {/* Down Payment */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-dark-700">{t("inputs.buy.downPayment")}</label>
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
        <SliderInput
          value={buyInputs.downPaymentPercentage}
          onChange={(value) => handleInputChange("downPaymentPercentage", value)}
          min={SLIDER_LIMITS.DOWN_PAYMENT.MIN}
          max={SLIDER_LIMITS.DOWN_PAYMENT.MAX}
          step={SLIDER_LIMITS.DOWN_PAYMENT.STEP}
          minLabel="0%"
          maxLabel="100%"
        />
      </div>

      {/* Interest Rate */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-dark-700">{t("inputs.buy.mortgageRate")}</label>
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
          <label className="text-sm font-medium text-dark-700">{t("inputs.buy.mortgageTerm")}</label>
        </div>
        <ButtonGroup
          options={MORTGAGE_TERMS.map((term) => ({ value: term, label: `${term} ${t("inputs.buy.years")}` }))}
          value={buyInputs.mortgageTermYears}
          onChange={(value) => handleInputChange("mortgageTermYears", value)}
          className="grid grid-cols-3 gap-2"
        />
      </div>

      {/* Expected Annual Home Appreciation */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-dark-700">{t("inputs.buy.homeAppreciation")}</label>
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
      </div>

      {/* Advanced Options Toggle */}
      <div className="border-t border-gray-100 pt-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex w-full items-center justify-between text-dark-600 hover:text-primary-600 transition"
        >
          <span className="font-medium text-sm">{t("inputs.buy.advancedOptions")}</span>
          <i className={`fas ${showAdvanced ? "fa-chevron-up" : "fa-chevron-down"} text-xs`}></i>
        </button>

        {/* Advanced Options Content */}
        {showAdvanced && (
          <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-xl">
            {/* Transaction Costs Section */}
            <div className="text-xs font-semibold text-dark-600 mb-2">{t("inputs.buy.transactionCosts")}</div>

            {/* Closing Costs */}
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-dark-600 flex items-center">
                {t("inputs.buy.closingCosts")}
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
                  className="w-14 p-1 text-xs text-center border rounded-lg"
                  min="0"
                  max="100"
                />
                <span className="text-xs text-dark-500">%</span>
              </div>
            </div>

            {/* Selling Costs */}
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-dark-600 flex items-center">
                {t("inputs.buy.sellingCosts")}
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
                  className="w-14 p-1 text-xs text-center border rounded-lg"
                  min="0"
                  max="100"
                />
                <span className="text-xs text-dark-500">%</span>
              </div>
            </div>

            {/* Holding Costs Section */}
            <div className="text-xs font-semibold text-dark-600 mb-2 mt-4">{t("inputs.buy.holdingCosts")}</div>

            {/* Property Tax Rate */}
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-dark-600 flex items-center">
                {t("inputs.buy.propertyTax")}
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
                  className="w-14 p-1 text-xs text-center border rounded-lg"
                  min="0"
                  max="100"
                />
                <span className="text-xs text-dark-500">%</span>
              </div>
            </div>

            {/* Insurance & Maintenance */}
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-dark-600 flex items-center">
                {t("inputs.buy.insuranceMaintenance")}
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
                  className="w-14 p-1 text-xs text-center border rounded-lg"
                  min="0"
                  max="100"
                />
                <span className="text-xs text-dark-500">%</span>
              </div>
            </div>

            {/* HOA Fee */}
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-dark-600">{t("inputs.buy.hoaFee")}</label>
              <div className="flex space-x-2 items-center">
                <span className="text-xs text-dark-500">$</span>
                <input
                  type="text"
                  value={formatDisplayValue("hoaFeeAnnual", ["propertyPrice", "hoaFeeAnnual"])}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/,/g, "");
                    if (rawValue === "" || (!isNaN(Number(rawValue)) && Number(rawValue) >= 0)) {
                      handleNumberInputChange("hoaFeeAnnual", rawValue, (val) => parseFormattedNumber(val));
                    }
                  }}
                  onBlur={() => handleNumberInputBlur("hoaFeeAnnual", (val) => parseFormattedNumber(val))}
                  className="w-14 p-1 text-xs text-center border rounded-lg"
                  placeholder="5,000"
                />
              </div>
            </div>

            {/* Tax Implications Section */}
            <div className="text-xs font-semibold text-dark-600 mb-2 mt-4">{t("inputs.buy.taxImplications")}</div>

            {/* Marginal Tax Rate */}
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-dark-600 flex items-center">
                {t("inputs.buy.marginalTaxRate")}
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
                  className="w-14 p-1 text-xs text-center border rounded-lg"
                  min="0"
                  max="100"
                />
                <span className="text-xs text-dark-500">%</span>
              </div>
            </div>

            {/* Mortgage Interest Deduction Toggle */}
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-dark-600 flex items-center">
                {t("inputs.buy.mortgageDeduction")}
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
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-medium text-dark-600 flex items-center">
                  {t("inputs.buy.capitalGainsTax")}
                  <div className="relative group ml-1">
                    <i className="fas fa-info-circle text-primary-400 text-xs"></i>
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-96 p-3 bg-dark-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 max-h-96 overflow-y-auto">
                      <p className="mb-2">
                        Tax rate on profits when property is sold. Based on your income and filing status:
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
                value={buyInputs.longTermCapitalGainsTaxRateProperty}
                onChange={(value) => handleInputChange("longTermCapitalGainsTaxRateProperty", value)}
                className="grid grid-cols-4 gap-2"
                buttonClassName="px-2 py-1 rounded-lg text-xs font-medium transition-colors"
                activeClassName="bg-primary-500 text-white"
                inactiveClassName="bg-gray-200 text-dark-600 hover:bg-gray-200"
              />
            </div>

            {/* Filing Status */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-medium text-dark-600 flex items-center">
                  {t("inputs.buy.filingStatus")}
                  <div className="relative group ml-1">
                    <i className="fas fa-info-circle text-primary-400 text-xs"></i>
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-60 p-2 bg-dark-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                      Tax-free capital gains amount for single filers: $250,000. For married filing jointly: $500,000.
                    </div>
                  </div>
                </label>
              </div>

              {/* Filing Status Selection Buttons */}
              <ButtonGroup
                options={[
                  { value: "Married" as const, label: t("inputs.buy.married") },
                  { value: "Single" as const, label: t("inputs.buy.single") },
                ]}
                value={buyInputs.filingStatus}
                onChange={(value) => handleInputChange("filingStatus", value)}
                className="grid grid-cols-2 gap-2"
                buttonClassName="px-2 py-1 rounded-lg text-xs font-medium transition-colors"
                activeClassName="bg-primary-500 text-white"
                inactiveClassName="bg-gray-200 text-dark-600 hover:bg-gray-200"
              />
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
            {t("inputs.buy.switchToRent")}
          </button>
        </div>
      )}

      {/* Calculation Status */}
      <CalculationStatus />
    </div>
  );
}
