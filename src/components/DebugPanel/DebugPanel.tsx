import { useState } from 'react';
import { useApp } from '../../contexts';
import { useCalculations } from '../../hooks';
import { formatCurrency } from '../../lib/inputUtils';

export default function DebugPanel() {
  const { state } = useApp();
  const { results, getNetWorthComparison, getBreakEvenYear } = useCalculations();
  const [selectedYear, setSelectedYear] = useState(() => Math.min(20, results.projectionYears));
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    inputState: true // Expand input verification by default
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const breakEvenYear = getBreakEvenYear(state.appSettings.showCashOut);
  const selectedYearData = results.yearlyResults.find(r => r.year === selectedYear);

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-dark-800">
          <i className="fas fa-calculator text-primary-500 mr-2"></i>
          Calculation Engine Debug
        </h2>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Selected Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {Array.from({ length: results.projectionYears }, (_, i) => i + 1).map(year => (
              <option key={year} value={year}>Year {year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Complete Input State Verification */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('inputState')}
          className="flex items-center justify-between w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        >
          <span className="font-semibold">Complete Input State Verification</span>
          <i className={`fas ${expandedSections.inputState ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
        </button>
        
        {expandedSections.inputState && (
          <div className="mt-3 space-y-4">
            {/* Buy Scenario Inputs */}
            <div className="bg-primary-50 p-4 rounded-lg">
              <h4 className="font-semibold text-primary-800 mb-3 flex items-center">
                <i className="fas fa-home mr-2"></i>
                BUY SCENARIO
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Property Price:</span>
                  <span className="font-medium">{formatCurrency(state.buyInputs.propertyPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Down Payment:</span>
                  <span className="font-medium">{state.buyInputs.downPaymentPercentage}% ({formatCurrency(results.preliminary.mortgage.downPaymentAmount)})</span>
                </div>
                <div className="flex justify-between">
                  <span>Mortgage Rate:</span>
                  <span className="font-medium">{state.buyInputs.mortgageInterestRateAnnual}% annually</span>
                </div>
                <div className="flex justify-between">
                  <span>Mortgage Term:</span>
                  <span className="font-medium">{state.buyInputs.mortgageTermYears} years</span>
                </div>
                <div className="flex justify-between">
                  <span>Home Appreciation:</span>
                  <span className="font-medium">{state.buyInputs.homeAppreciationCagr}% annually</span>
                </div>
                <div className="flex justify-between">
                  <span>Closing Costs:</span>
                  <span className="font-medium">{state.buyInputs.closingCostsPercentageBuy}% ({formatCurrency(results.preliminary.mortgage.closingCostsAmount)})</span>
                </div>
                <div className="flex justify-between">
                  <span>Selling Costs:</span>
                  <span className="font-medium">{state.buyInputs.sellingCostsPercentageSell}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Property Tax:</span>
                  <span className="font-medium">{state.buyInputs.propertyTaxRateAnnual}% annually</span>
                </div>
                <div className="flex justify-between">
                  <span>Insurance/Maintenance:</span>
                  <span className="font-medium">{state.buyInputs.insuranceAndMaintenanceRateAnnual}% annually</span>
                </div>
                <div className="flex justify-between">
                  <span>HOA Fee:</span>
                  <span className="font-medium">{formatCurrency(state.buyInputs.hoaFeeAnnual)} annually</span>
                </div>
                <div className="flex justify-between">
                  <span>Marginal Tax Rate:</span>
                  <span className="font-medium">{state.buyInputs.marginalTaxRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Mortgage Interest Deduction:</span>
                  <span className="font-medium">{state.buyInputs.mortgageInterestDeduction ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Capital Gains Tax (Property):</span>
                  <span className="font-medium">{state.buyInputs.longTermCapitalGainsTaxRateProperty}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax-Free Capital Gain:</span>
                  <span className="font-medium">{formatCurrency(state.buyInputs.taxFreeCapitalGainAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Filing Status:</span>
                  <span className="font-medium">{state.buyInputs.filingStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Payment:</span>
                  <span className="font-medium">{formatCurrency(results.preliminary.mortgage.monthlyPayment)}</span>
                </div>
              </div>
            </div>

            {/* Rent Scenario Inputs */}
            <div className="bg-secondary-50 p-4 rounded-lg">
              <h4 className="font-semibold text-secondary-800 mb-3 flex items-center">
                <i className="fas fa-chart-line mr-2"></i>
                RENT & INVEST
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Monthly Rent:</span>
                  <span className="font-medium">{formatCurrency(state.rentInputs.currentMonthlyRentAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rent Growth:</span>
                  <span className="font-medium">{state.rentInputs.rentGrowthRateAnnual}% annually</span>
                </div>
                <div className="flex justify-between">
                  <span>Investment Option:</span>
                  <span className="font-medium">{state.rentInputs.selectedInvestmentOption}</span>
                </div>
                <div className="flex justify-between">
                  <span>Investment Return:</span>
                  <span className="font-medium">{results.preliminary.investmentReturnRate}% annually</span>
                </div>
                <div className="flex justify-between">
                  <span>Capital Gains Tax (Investment):</span>
                  <span className="font-medium">{state.rentInputs.longTermCapitalGainsTaxRateInvestment}%</span>
                </div>
              </div>
            </div>

            {/* App Settings */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <i className="fas fa-cog mr-2"></i>
                APP SETTINGS
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Language:</span>
                  <span className="font-medium">{state.appSettings.currentLanguage === 'en' ? 'English' : 'Chinese'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Projection Years:</span>
                  <span className="font-medium">{state.appSettings.projectionYears} years</span>
                </div>
                <div className="flex justify-between">
                  <span>Show Cash Out:</span>
                  <span className="font-medium">{state.appSettings.showCashOut ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Show Yearly Mode:</span>
                  <span className="font-medium">{state.appSettings.showYearlyMode ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>


      {/* Year-by-Year Detailed Analysis */}
      {selectedYearData && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('yearly')}
            className="flex items-center justify-between w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            <span className="font-semibold">Year {selectedYear} Detailed Analysis</span>
            <i className={`fas ${expandedSections.yearly ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
          </button>
          
          {expandedSections.yearly && (
            <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Buy Scenario Details */}
              <div className="bg-primary-50 p-4 rounded-lg">
                <h4 className="font-semibold text-primary-800 mb-3 flex items-center">
                  <i className="fas fa-home mr-2"></i>
                  BUY SCENARIO
                </h4>
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-primary-700 mb-2">Property & Assets</div>
                  <div className="flex justify-between">
                    <span>Property Value:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.buy.propertyValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining Mortgage:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.buy.remainingMortgageBalance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Home Equity:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.buy.propertyValue - selectedYearData.buy.remainingMortgageBalance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Additional Investment Portfolio:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.buy.additionalInvestmentPortfolio)}</span>
                  </div>
                  {selectedYearData.buy.additionalInvestmentPortfolio > 0 && (
                    <>
                      <div className="flex justify-between pl-2 text-xs">
                        <span>• Cost Basis:</span>
                        <span className="font-medium">{formatCurrency(selectedYearData.buy.additionalInvestmentCostBasis)}</span>
                      </div>
                      <div className="flex justify-between pl-2 text-xs">
                        <span>• Gains:</span>
                        <span className="font-medium">{formatCurrency(selectedYearData.buy.additionalInvestmentGains)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between border-t pt-1 mt-1">
                    <span className="font-semibold">Total Net Worth:</span>
                    <span className="font-bold">{formatCurrency(selectedYearData.buy.netAssetValueNotCashOut)}</span>
                  </div>
                  
                  <div className="font-semibold text-primary-700 mb-2 mt-3">Annual Costs</div>
                  <div className="flex justify-between">
                    <span>Mortgage Payment:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.buy.mortgagePayment)}</span>
                  </div>
                  <div className="flex justify-between pl-2">
                    <span>• Interest:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.buy.mortgageInterest)}</span>
                  </div>
                  <div className="flex justify-between pl-2">
                    <span>• Principal:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.buy.mortgagePrincipal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Property Tax:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.buy.propertyTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insurance & Maintenance:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.buy.insuranceAndMaintenance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HOA Fee:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.buy.hoaFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax Savings (Interest Deduction):</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.buy.taxSavingsFromDeduction)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1 mt-1">
                    <span className="font-semibold">Net Cash Outflow:</span>
                    <span className="font-bold">{formatCurrency(selectedYearData.buy.adjustedCashOutflow)}</span>
                  </div>
                  
                  <div className="font-semibold text-primary-700 mb-2 mt-3">If Sold Today</div>
                  <div className="flex justify-between">
                    <span>Sale Price:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.buy.propertyValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Selling Costs ({state.buyInputs.sellingCostsPercentageSell}%):</span>
                    <span className="font-medium">-{formatCurrency(selectedYearData.buy.propertyValue * state.buyInputs.sellingCostsPercentageSell / 100)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining Mortgage:</span>
                    <span className="font-medium">-{formatCurrency(selectedYearData.buy.remainingMortgageBalance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax on Property Gain:</span>
                    <span className="font-medium">-{formatCurrency(selectedYearData.buy.taxOnPropertyGain)}</span>
                  </div>
                  {selectedYearData.buy.additionalInvestmentPortfolio > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span>Investment Portfolio:</span>
                        <span className="font-medium">+{formatCurrency(selectedYearData.buy.additionalInvestmentPortfolio)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax on Investment Gains:</span>
                        <span className="font-medium">-{formatCurrency(selectedYearData.buy.taxOnAdditionalInvestment)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between border-t pt-1 mt-1">
                    <span className="font-semibold">Net Proceeds:</span>
                    <span className="font-bold">{formatCurrency(selectedYearData.buy.netAssetValueCashOut)}</span>
                  </div>
                </div>
              </div>

              {/* Rent Scenario Details */}
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h4 className="font-semibold text-secondary-800 mb-3 flex items-center">
                  <i className="fas fa-chart-line mr-2"></i>
                  RENT & INVEST
                </h4>
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-secondary-700 mb-2">Rent Costs</div>
                  <div className="flex justify-between">
                    <span>Monthly Rent:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.rent.monthlyRent)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1 mt-1">
                    <span className="font-semibold">Annual Rent Cost:</span>
                    <span className="font-bold">{formatCurrency(selectedYearData.rent.annualRentCost)}</span>
                  </div>
                  
                  <div className="font-semibold text-secondary-700 mb-2 mt-3">Investment Portfolio</div>
                  <div className="flex justify-between">
                    <span>Cash Flow Difference:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.buy.adjustedCashOutflow - selectedYearData.rent.cashOutflow)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Additional Investment This Year:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.rent.additionalInvestmentThisYear)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Portfolio Before Growth:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.rent.portfolioValueBeforeGrowth)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Investment Return ({results.preliminary.investmentReturnRate}%):</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.rent.investmentReturnThisYear)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Cash Invested:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.rent.totalCashInvestedSoFar)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1 mt-1">
                    <span className="font-semibold">Total Net Worth:</span>
                    <span className="font-bold">{formatCurrency(selectedYearData.rent.portfolioValueEndOfYear)}</span>
                  </div>
                  
                  <div className="font-semibold text-secondary-700 mb-2 mt-3">If Liquidated Today</div>
                  <div className="flex justify-between">
                    <span>Portfolio Value:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.rent.portfolioValueEndOfYear)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capital Gains:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.rent.capitalGainOnInvestment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax on Gains ({state.rentInputs.longTermCapitalGainsTaxRateInvestment}%):</span>
                    <span className="font-medium">-{formatCurrency(selectedYearData.rent.taxOnInvestmentGain)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1 mt-1">
                    <span className="font-semibold">Net Proceeds:</span>
                    <span className="font-bold">{formatCurrency(selectedYearData.rent.netAssetValueCashOut)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Comparison Table */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('comparison')}
          className="flex items-center justify-between w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        >
          <span className="font-semibold">Year-by-Year Comparison Table</span>
          <i className={`fas ${expandedSections.comparison ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
        </button>
        
        {expandedSections.comparison && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Year</th>
                  <th className="border border-gray-300 p-2">Buy Cash Flow</th>
                  <th className="border border-gray-300 p-2">Rent Cash Flow</th>
                  <th className="border border-gray-300 p-2">Cash Difference</th>
                  <th className="border border-gray-300 p-2">Buy Net Worth</th>
                  <th className="border border-gray-300 p-2">Rent Net Worth</th>
                  <th className="border border-gray-300 p-2">Net Worth Diff</th>
                </tr>
              </thead>
              <tbody>
                {results.yearlyResults.slice(0, Math.min(20, results.projectionYears)).map((yearData) => {
                  const netWorth = getNetWorthComparison(yearData.year, state.appSettings.showCashOut);
                  const cashDiff = yearData.buy.adjustedCashOutflow - yearData.rent.cashOutflow;
                  
                  return (
                    <tr key={yearData.year} className={yearData.year === selectedYear ? 'bg-blue-50' : ''}>
                      <td className="border border-gray-300 p-2 text-center font-medium">{yearData.year}</td>
                      <td className="border border-gray-300 p-2 text-right">{formatCurrency(yearData.buy.adjustedCashOutflow)}</td>
                      <td className="border border-gray-300 p-2 text-right">{formatCurrency(yearData.rent.cashOutflow)}</td>
                      <td className={`border border-gray-300 p-2 text-right ${cashDiff >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(cashDiff)}
                      </td>
                      <td className="border border-gray-300 p-2 text-right">{formatCurrency(netWorth.buy)}</td>
                      <td className="border border-gray-300 p-2 text-right">{formatCurrency(netWorth.rent)}</td>
                      <td className={`border border-gray-300 p-2 text-right ${netWorth.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(netWorth.difference)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Advanced Diagnostics */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('diagnostics')}
          className="flex items-center justify-between w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        >
          <span className="font-semibold">Advanced Diagnostics</span>
          <i className={`fas ${expandedSections.diagnostics ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
        </button>
        
        {expandedSections.diagnostics && (
          <div className="mt-3 space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <i className="fas fa-cogs mr-2"></i>
                Mortgage Calculation Details
              </h4>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Loan Amount:</span>
                  <span className="font-medium">{formatCurrency(results.preliminary.mortgage.totalLoanAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Payment Formula:</span>
                  <span className="font-medium">P × [r(1+r)^n] / [(1+r)^n - 1]</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Rate (r):</span>
                  <span className="font-medium">{(state.buyInputs.mortgageInterestRateAnnual / 12).toFixed(4)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Payments (n):</span>
                  <span className="font-medium">{state.buyInputs.mortgageTermYears * 12}</span>
                </div>
                <div className="flex justify-between">
                  <span>Calculated Monthly Payment:</span>
                  <span className="font-medium">{formatCurrency(results.preliminary.mortgage.monthlyPayment)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <i className="fas fa-chart-bar mr-2"></i>
                Investment Portfolio Tracking
              </h4>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Investment Return Rate:</span>
                  <span className="font-medium">{results.preliminary.investmentReturnRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax-Free Capital Gain Amount:</span>
                  <span className="font-medium">{formatCurrency(results.preliminary.taxFreeCapitalGainAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Break-Even Year:</span>
                  <span className="font-medium">{breakEvenYear ? `Year ${breakEvenYear}` : 'Never'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Projection Years:</span>
                  <span className="font-medium">{results.projectionYears} years</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <i className="fas fa-code mr-2"></i>
                Raw Calculation Objects
              </h4>
              <div className="text-xs">
                <div className="bg-white p-2 rounded border mb-2">
                  <div className="font-medium mb-1">Preliminary Calculations:</div>
                  <pre className="text-xs overflow-x-auto">{JSON.stringify(results.preliminary, null, 2)}</pre>
                </div>
                {selectedYearData && (
                  <div className="bg-white p-2 rounded border">
                    <div className="font-medium mb-1">Year {selectedYear} Raw Data:</div>
                    <pre className="text-xs overflow-x-auto max-h-48 overflow-y-auto">{JSON.stringify(selectedYearData, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}