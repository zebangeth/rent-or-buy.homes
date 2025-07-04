import { useState } from 'react';
import { useApp } from '../../contexts';
import { useCalculations } from '../../hooks';
import { formatCurrency } from '../../lib/inputUtils';

export default function DebugPanel() {
  const { state } = useApp();
  const { results, formulas, getNetWorthComparison, getTotalCashOutflowComparison, getBreakEvenYear } = useCalculations();
  const [selectedYear, setSelectedYear] = useState(() => Math.min(20, results.projectionYears));
  const [showFormulas, setShowFormulas] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const netWorthComparison = getNetWorthComparison(selectedYear, state.appSettings.showCashOut);
  const cashFlowComparison = getTotalCashOutflowComparison(selectedYear);
  const breakEvenYear = getBreakEvenYear(state.appSettings.showCashOut);
  const selectedYearData = results.yearlyResults.find(r => r.year === selectedYear);

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-dark-800">
          <i className="fas fa-calculator text-primary-500 mr-2"></i>
          Calculation Engine Debug
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFormulas(!showFormulas)}
            className={`px-3 py-1 text-xs rounded ${showFormulas ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {showFormulas ? 'Hide' : 'Show'} Formulas
          </button>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Year:</label>
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
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-xs text-green-600 font-medium">Break-Even Year</div>
          <div className="text-lg font-bold text-green-800">
            {breakEvenYear ? `Year ${breakEvenYear}` : 'Never'}
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-xs text-blue-600 font-medium">Net Worth Difference (Y{selectedYear})</div>
          <div className={`text-lg font-bold ${netWorthComparison.difference >= 0 ? 'text-green-800' : 'text-red-800'}`}>
            {formatCurrency(netWorthComparison.difference)}
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-xs text-purple-600 font-medium">Cash Flow Difference (Cumulative)</div>
          <div className={`text-lg font-bold ${cashFlowComparison.difference >= 0 ? 'text-green-800' : 'text-red-800'}`}>
            {formatCurrency(cashFlowComparison.difference)}
          </div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <div className="text-xs text-orange-600 font-medium">Monthly Payment</div>
          <div className="text-lg font-bold text-orange-800">
            {formatCurrency(results.preliminary.mortgage.monthlyPayment)}
          </div>
        </div>
      </div>

      {/* Formulas Section */}
      {showFormulas && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Calculation Formulas</h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="bg-white p-2 rounded border">
              <span className="font-semibold">Monthly Mortgage Payment:</span><br />
              {formulas.monthlyMortgagePayment}
            </div>
            <div className="bg-white p-2 rounded border">
              <span className="font-semibold">Property Value Growth:</span><br />
              {formulas.propertyValueGrowth}
            </div>
            <div className="bg-white p-2 rounded border">
              <span className="font-semibold">Investment Growth:</span><br />
              {formulas.investmentGrowth}
            </div>
          </div>
        </div>
      )}

      {/* Preliminary Calculations */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('preliminary')}
          className="flex items-center justify-between w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        >
          <span className="font-semibold">Preliminary Calculations</span>
          <i className={`fas ${expandedSections.preliminary ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
        </button>
        
        {expandedSections.preliminary && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-primary-50 p-4 rounded-lg">
              <h4 className="font-semibold text-primary-800 mb-2">Mortgage Details</h4>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Down Payment:</span>
                  <span className="font-medium">{formatCurrency(results.preliminary.mortgage.downPaymentAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Loan Amount:</span>
                  <span className="font-medium">{formatCurrency(results.preliminary.mortgage.totalLoanAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Closing Costs:</span>
                  <span className="font-medium">{formatCurrency(results.preliminary.mortgage.closingCostsAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Payment:</span>
                  <span className="font-medium">{formatCurrency(results.preliminary.mortgage.monthlyPayment)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary-50 p-4 rounded-lg">
              <h4 className="font-semibold text-secondary-800 mb-2">Investment Setup</h4>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Initial Investment:</span>
                  <span className="font-medium">{formatCurrency(results.preliminary.initialInvestmentAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Investment Return Rate:</span>
                  <span className="font-medium">{results.preliminary.investmentReturnRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax-Free Capital Gain:</span>
                  <span className="font-medium">{formatCurrency(results.preliminary.taxFreeCapitalGainAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Calculation Logic Explanation */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('logic')}
          className="flex items-center justify-between w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        >
          <span className="font-semibold">Cash Flow Differential Logic</span>
          <i className={`fas ${expandedSections.logic ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
        </button>
        
        {expandedSections.logic && (
          <div className="mt-3 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-3">How Cash Flow Differences Are Handled</h4>
            <div className="text-sm space-y-2">
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-green-700">When Buy Scenario Costs More:</div>
                <div className="text-xs mt-1">
                  • Difference = Buy Cash Outflow - Rent Cash Outflow<br/>
                  • This difference is invested in the rent scenario's investment portfolio<br/>
                  • Logic: You save money by renting, so you invest the savings
                </div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-orange-700">When Rent Scenario Costs More:</div>
                <div className="text-xs mt-1">
                  • Difference = Rent Cash Outflow - Buy Cash Outflow<br/>
                  • This difference is invested in an additional portfolio for the buy scenario<br/>
                  • Logic: You save money by buying, so you invest the savings
                </div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-blue-700">Current Year {selectedYear} Scenario:</div>
                <div className="text-xs mt-1">
                  {selectedYearData && (
                    <>
                      • Buy Cash Outflow: {formatCurrency(selectedYearData.buy.adjustedCashOutflow)}<br/>
                      • Rent Cash Outflow: {formatCurrency(selectedYearData.rent.cashOutflow)}<br/>
                      • Difference: {formatCurrency(Math.abs(selectedYearData.buy.adjustedCashOutflow - selectedYearData.rent.cashOutflow))}<br/>
                      • {selectedYearData.buy.adjustedCashOutflow > selectedYearData.rent.cashOutflow 
                        ? `Buy costs more → Rent gets ${formatCurrency(selectedYearData.rent.additionalInvestmentThisYear)} investment` 
                        : `Rent costs more → Buy gets ${formatCurrency(selectedYearData.buy.additionalInvestmentPortfolio - (selectedYearData.buy.additionalInvestmentPortfolio / (1 + results.preliminary.investmentReturnRate / 100)))} investment`}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Year-by-Year Breakdown */}
      {selectedYearData && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('yearly')}
            className="flex items-center justify-between w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            <span className="font-semibold">Year {selectedYear} Detailed Breakdown</span>
            <i className={`fas ${expandedSections.yearly ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
          </button>
          
          {expandedSections.yearly && (
            <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Buy Scenario Details */}
              <div className="bg-primary-50 p-4 rounded-lg">
                <h4 className="font-semibold text-primary-800 mb-3">Buy Scenario - Year {selectedYear}</h4>
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-primary-700 mb-1">Property & Assets</div>
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
                        <span>• Cost Basis (Total Invested):</span>
                        <span className="font-medium">{formatCurrency(selectedYearData.buy.additionalInvestmentCostBasis)}</span>
                      </div>
                      <div className="flex justify-between pl-2 text-xs">
                        <span>• Investment Gains:</span>
                        <span className="font-medium">{formatCurrency(selectedYearData.buy.additionalInvestmentGains)}</span>
                      </div>
                      <div className="bg-blue-50 p-2 rounded text-xs mt-1">
                        <div className="font-medium text-blue-700 mb-1">How This Portfolio Grows:</div>
                        <div>• Each year rent costs more than buying, the difference gets invested</div>
                        <div>• Previous portfolio value + new investment earns {results.preliminary.investmentReturnRate}% return</div>
                        <div>• Cost basis tracks total cash invested (no compound growth)</div>
                        <div>• Gains = Portfolio Value - Cost Basis</div>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span>Total Net Worth:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.buy.netAssetValueNotCashOut)}</span>
                  </div>
                  
                  <div className="font-semibold text-primary-700 mb-1 mt-3">Annual Costs</div>
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
                  
                  <div className="font-semibold text-primary-700 mb-1 mt-3">Tax Benefits</div>
                  <div className="flex justify-between">
                    <span>Interest Deduction Savings:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.buy.taxSavingsFromDeduction)}</span>
                  </div>
                  
                  <div className="font-semibold text-primary-700 mb-1 mt-3">Cash Flow</div>
                  <div className="flex justify-between">
                    <span>Total Cash Outflow:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.buy.cashOutflow)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>After Tax Benefits:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.buy.adjustedCashOutflow)}</span>
                  </div>
                  
                  {state.appSettings.showCashOut && (
                    <>
                      <div className="font-semibold text-primary-700 mb-1 mt-3">If Sold Today - Detailed Calculation</div>
                      <div className="flex justify-between text-xs">
                        <span>1. Property Sale Price:</span>
                        <span className="font-medium">{formatCurrency(selectedYearData.buy.propertyValue)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>2. Selling Costs ({state.buyInputs.sellingCostsPercentageSell}%):</span>
                        <span className="font-medium">-{formatCurrency(selectedYearData.buy.propertyValue * state.buyInputs.sellingCostsPercentageSell / 100)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>3. Remaining Mortgage Balance:</span>
                        <span className="font-medium">-{formatCurrency(selectedYearData.buy.remainingMortgageBalance)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>4. Proceeds Before Tax:</span>
                        <span className="font-medium">{formatCurrency(selectedYearData.buy.propertyValue - (selectedYearData.buy.propertyValue * state.buyInputs.sellingCostsPercentageSell / 100) - selectedYearData.buy.remainingMortgageBalance)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>5. Capital Gain on Property:</span>
                        <span className="font-medium">{formatCurrency(selectedYearData.buy.capitalGainOnProperty)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>6. Tax-Free Allowance:</span>
                        <span className="font-medium">-{formatCurrency(results.preliminary.taxFreeCapitalGainAmount)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>7. Taxable Gain:</span>
                        <span className="font-medium">{formatCurrency(selectedYearData.buy.taxableGainOnProperty)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>8. Tax on Property Gain ({state.buyInputs.longTermCapitalGainsTaxRateProperty}%):</span>
                        <span className="font-medium">-{formatCurrency(selectedYearData.buy.taxOnPropertyGain)}</span>
                      </div>
                      {selectedYearData.buy.additionalInvestmentPortfolio > 0 && (
                        <>
                          <div className="flex justify-between text-xs">
                            <span>9. Additional Investment Portfolio Value:</span>
                            <span className="font-medium">+{formatCurrency(selectedYearData.buy.additionalInvestmentPortfolio)}</span>
                          </div>
                          <div className="flex justify-between text-xs ml-4">
                            <span>• Total Cost Basis (Amount Invested):</span>
                            <span className="font-medium">{formatCurrency(selectedYearData.buy.additionalInvestmentCostBasis)}</span>
                          </div>
                          <div className="flex justify-between text-xs ml-4">
                            <span>• Investment Gains:</span>
                            <span className="font-medium">{formatCurrency(selectedYearData.buy.additionalInvestmentGains)}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>10. Tax on Investment Gains ({state.buyInputs.longTermCapitalGainsTaxRateProperty}%):</span>
                            <span className="font-medium">-{formatCurrency(selectedYearData.buy.taxOnAdditionalInvestment)}</span>
                          </div>
                          <div className="bg-gray-100 p-2 rounded text-xs mt-1">
                            <div className="font-medium text-gray-700 mb-1">Investment Portfolio Tax Calculation:</div>
                            <div>Portfolio Value: {formatCurrency(selectedYearData.buy.additionalInvestmentPortfolio)}</div>
                            <div>Cost Basis: {formatCurrency(selectedYearData.buy.additionalInvestmentCostBasis)}</div>
                            <div>Capital Gains: {formatCurrency(selectedYearData.buy.additionalInvestmentGains)}</div>
                            <div>Tax Rate: {state.buyInputs.longTermCapitalGainsTaxRateProperty}%</div>
                            <div className="border-t pt-1 mt-1">
                              Tax = {formatCurrency(selectedYearData.buy.additionalInvestmentGains)} × {state.buyInputs.longTermCapitalGainsTaxRateProperty}% = {formatCurrency(selectedYearData.buy.taxOnAdditionalInvestment)}
                            </div>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between border-t pt-1 mt-1">
                        <span className="font-semibold">Net Proceeds:</span>
                        <span className="font-bold">{formatCurrency(selectedYearData.buy.netAssetValueCashOut)}</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">
                        Summary: Sale Price - Selling Costs - Remaining Mortgage - Tax on Property Gain {selectedYearData.buy.additionalInvestmentPortfolio > 0 ? '+ Investment Portfolio - Tax on Investment' : ''}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Rent Scenario Details */}
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h4 className="font-semibold text-secondary-800 mb-3">Rent & Invest - Year {selectedYear}</h4>
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-secondary-700 mb-1">Rent Costs</div>
                  <div className="flex justify-between">
                    <span>Monthly Rent:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.rent.monthlyRent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual Rent:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.rent.annualRentCost)}</span>
                  </div>
                  
                  <div className="font-semibold text-secondary-700 mb-1 mt-3">Investment Portfolio</div>
                  <div className="flex justify-between">
                    <span>Cash Flow Difference:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.buy.adjustedCashOutflow - selectedYearData.rent.cashOutflow)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Additional Investment:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.rent.additionalInvestmentThisYear)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Portfolio Before Growth:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.rent.portfolioValueBeforeGrowth)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Investment Return:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.rent.investmentReturnThisYear)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Portfolio Value:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.rent.portfolioValueEndOfYear)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Cash Invested:</span>
                    <span className="font-medium">{formatCurrency(selectedYearData.rent.totalCashInvestedSoFar)}</span>
                  </div>
                  
                  {state.appSettings.showCashOut && (
                    <>
                      <div className="font-semibold text-secondary-700 mb-1 mt-3">If Liquidated Today - Detailed Calculation</div>
                      <div className="flex justify-between text-xs">
                        <span>1. Current Portfolio Value:</span>
                        <span className="font-medium">{formatCurrency(selectedYearData.rent.portfolioValueEndOfYear)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>2. Total Cash Invested:</span>
                        <span className="font-medium">{formatCurrency(selectedYearData.rent.totalCashInvestedSoFar)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>3. Capital Gain on Investment:</span>
                        <span className="font-medium">{formatCurrency(selectedYearData.rent.capitalGainOnInvestment)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>4. Tax on Investment Gain ({state.rentInputs.longTermCapitalGainsTaxRateInvestment}%):</span>
                        <span className="font-medium">-{formatCurrency(selectedYearData.rent.taxOnInvestmentGain)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1 mt-1">
                        <span className="font-semibold">Net Proceeds:</span>
                        <span className="font-bold">{formatCurrency(selectedYearData.rent.netAssetValueCashOut)}</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">
                        Calculation: Portfolio Value - Tax on Gains<br/>
                        = {formatCurrency(selectedYearData.rent.portfolioValueEndOfYear)} - {formatCurrency(selectedYearData.rent.taxOnInvestmentGain)}<br/>
                        = {formatCurrency(selectedYearData.rent.netAssetValueCashOut)}
                      </div>
                    </>
                  )}
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

      {/* Input State (Collapsed by default) */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('inputs')}
          className="flex items-center justify-between w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        >
          <span className="font-semibold">Current Input State</span>
          <i className={`fas ${expandedSections.inputs ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
        </button>
        
        {expandedSections.inputs && (
          <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-primary-50 p-4 rounded-lg">
              <h4 className="font-semibold text-primary-800 mb-2">Buy Parameters</h4>
              <div className="text-xs space-y-1 max-h-64 overflow-y-auto">
                <div className="flex justify-between">
                  <span>Property Price:</span>
                  <span className="font-medium">{formatCurrency(state.buyInputs.propertyPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Down Payment:</span>
                  <span className="font-medium">{state.buyInputs.downPaymentPercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Rate:</span>
                  <span className="font-medium">{state.buyInputs.mortgageInterestRateAnnual}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Mortgage Term:</span>
                  <span className="font-medium">{state.buyInputs.mortgageTermYears} years</span>
                </div>
                <div className="flex justify-between">
                  <span>Home Appreciation:</span>
                  <span className="font-medium">{state.buyInputs.homeAppreciationCagr}%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary-50 p-4 rounded-lg">
              <h4 className="font-semibold text-secondary-800 mb-2">Rent Parameters</h4>
              <div className="text-xs space-y-1 max-h-64 overflow-y-auto">
                <div className="flex justify-between">
                  <span>Monthly Rent:</span>
                  <span className="font-medium">{formatCurrency(state.rentInputs.currentMonthlyRentAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rent Growth:</span>
                  <span className="font-medium">{state.rentInputs.rentGrowthRateAnnual}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Investment Option:</span>
                  <span className="font-medium">{state.rentInputs.selectedInvestmentOption}</span>
                </div>
                <div className="flex justify-between">
                  <span>Investment Return:</span>
                  <span className="font-medium">{results.preliminary.investmentReturnRate}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}