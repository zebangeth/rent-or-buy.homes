import { useApp } from '../../contexts';

export default function DebugPanel() {
  const { state } = useApp();

  return (
    <div className="card p-8 text-center">
      <h2 className="text-2xl font-semibold text-dark-800 mb-4">
        Debug Panel
      </h2>
      <p className="text-dark-500 mb-6">
        Real-time state monitoring for development and testing purposes.
      </p>
      
      {/* Complete State Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-left">
        {/* Buy Inputs - Complete */}
        <div className="bg-primary-50 p-4 rounded-lg">
          <h3 className="font-semibold text-primary-800 mb-3">All Buy Settings</h3>
          <div className="text-xs text-primary-700 space-y-1 max-h-96 overflow-y-auto">
            <div className="flex justify-between">
              <span>Property Price:</span>
              <span className="font-medium">${state.buyInputs.propertyPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Down Payment:</span>
              <span className="font-medium">{state.buyInputs.downPaymentPercentage}% (${((state.buyInputs.propertyPrice * state.buyInputs.downPaymentPercentage) / 100).toLocaleString()})</span>
            </div>
            <div className="flex justify-between">
              <span>Mortgage Interest Rate:</span>
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
            <hr className="border-primary-200 my-2" />
            <div className="text-xs font-semibold text-primary-600 mb-1">Transaction Costs</div>
            <div className="flex justify-between">
              <span>Closing Costs (Buy):</span>
              <span className="font-medium">{state.buyInputs.closingCostsPercentageBuy}%</span>
            </div>
            <div className="flex justify-between">
              <span>Selling Costs:</span>
              <span className="font-medium">{state.buyInputs.sellingCostsPercentageSell}%</span>
            </div>
            <hr className="border-primary-200 my-2" />
            <div className="text-xs font-semibold text-primary-600 mb-1">Annual Costs</div>
            <div className="flex justify-between">
              <span>Property Tax Rate:</span>
              <span className="font-medium">{state.buyInputs.propertyTaxRateAnnual}%</span>
            </div>
            <div className="flex justify-between">
              <span>Insurance & Maintenance:</span>
              <span className="font-medium">{state.buyInputs.insuranceAndMaintenanceRateAnnual}%</span>
            </div>
            <div className="flex justify-between">
              <span>HOA Fee (Annual):</span>
              <span className="font-medium">${state.buyInputs.hoaFeeAnnual.toLocaleString()}</span>
            </div>
            <hr className="border-primary-200 my-2" />
            <div className="text-xs font-semibold text-primary-600 mb-1">Tax Settings</div>
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
              <span>Filing Status:</span>
              <span className="font-medium">{state.buyInputs.filingStatus}</span>
            </div>
          </div>
        </div>
        
        {/* Rent Inputs - Complete */}
        <div className="bg-secondary-50 p-4 rounded-lg">
          <h3 className="font-semibold text-secondary-800 mb-3">All Rent Settings</h3>
          <div className="text-xs text-secondary-700 space-y-1 max-h-96 overflow-y-auto">
            <div className="flex justify-between">
              <span>Monthly Rent:</span>
              <span className="font-medium">${state.rentInputs.currentMonthlyRentAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Annual Rent:</span>
              <span className="font-medium">${(state.rentInputs.currentMonthlyRentAmount * 12).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Rent Growth Rate:</span>
              <span className="font-medium">{state.rentInputs.rentGrowthRateAnnual}%</span>
            </div>
            <div className="flex justify-between">
              <span>Same as Home Appreciation:</span>
              <span className="font-medium">{state.rentInputs.sameAsHomeAppreciation ? 'Yes' : 'No'}</span>
            </div>
            <hr className="border-secondary-200 my-2" />
            <div className="text-xs font-semibold text-secondary-600 mb-1">Investment Settings</div>
            <div className="flex justify-between">
              <span>Investment Option:</span>
              <span className="font-medium">{state.rentInputs.selectedInvestmentOption}</span>
            </div>
            <div className="flex justify-between">
              <span>Custom Investment Return:</span>
              <span className="font-medium">{state.rentInputs.customInvestmentReturn}%</span>
            </div>
            <div className="flex justify-between">
              <span>Effective Return Rate:</span>
              <span className="font-medium">
                {state.rentInputs.selectedInvestmentOption === 'SPY' ? '8.0' :
                 state.rentInputs.selectedInvestmentOption === 'QQQ' ? '9.25' :
                 state.rentInputs.customInvestmentReturn}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Capital Gains Tax (Investment):</span>
              <span className="font-medium">{state.rentInputs.longTermCapitalGainsTaxRateInvestment}%</span>
            </div>
          </div>
        </div>

        {/* App Settings */}
        <div className="bg-gray-50 p-4 rounded-lg lg:col-span-2">
          <h3 className="font-semibold text-gray-800 mb-3">App Settings</h3>
          <div className="text-xs text-gray-700 space-y-1">
            <div className="flex justify-between">
              <span>Current Language:</span>
              <span className="font-medium">{state.appSettings.currentLanguage}</span>
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
    </div>
  );
}