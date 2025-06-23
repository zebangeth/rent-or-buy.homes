import Header from './components/Header'
import { AppProvider, useApp } from './contexts'

function AppContent() {
  const { state, updateAppSetting } = useApp()

  const handleLanguageChange = (language: string) => {
    updateAppSetting('currentLanguage', language)
    // TODO: Implement actual i18n logic
    console.log(`Language changed to: ${language}`)
  }

  return (
    <div className="w-full max-w-6xl mx-auto min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <Header 
          currentLanguage={state.appSettings.currentLanguage}
          onLanguageChange={handleLanguageChange}
        />
        
        {/* Placeholder content - will be replaced with actual components */}
        <div className="space-y-8">
          <div className="card p-8 text-center">
            <h2 className="text-2xl font-semibold text-dark-800 mb-4">
              Buy vs Rent Calculator
            </h2>
            <p className="text-dark-500 mb-6">
              Global state is now set up! Current configuration:
            </p>
            
            {/* Demo state display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-primary-50 p-4 rounded-lg">
                <h3 className="font-semibold text-primary-800 mb-2">Buy Scenario</h3>
                <ul className="text-sm text-primary-700 space-y-1">
                  <li>Property Price: ${state.buyInputs.propertyPrice.toLocaleString()}</li>
                  <li>Down Payment: {state.buyInputs.downPaymentPercentage}%</li>
                  <li>Interest Rate: {state.buyInputs.mortgageInterestRateAnnual}%</li>
                  <li>Term: {state.buyInputs.mortgageTermYears} years</li>
                  <li>Home Appreciation: {state.buyInputs.homeAppreciationCagr}%</li>
                </ul>
              </div>
              
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h3 className="font-semibold text-secondary-800 mb-2">Rent Scenario</h3>
                <ul className="text-sm text-secondary-700 space-y-1">
                  <li>Monthly Rent: ${state.rentInputs.currentMonthlyRentAmount.toLocaleString()}</li>
                  <li>Rent Growth: {state.rentInputs.rentGrowthRateAnnual}%</li>
                  <li>Investment: {state.rentInputs.selectedInvestmentOption}</li>
                  <li>Capital Gains Tax: {state.rentInputs.longTermCapitalGainsTaxRateInvestment}%</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">App Settings</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>Language: {state.appSettings.currentLanguage}</li>
                  <li>Projection: {state.appSettings.projectionYears} years</li>
                  <li>Cash Out Mode: {state.appSettings.showCashOut ? 'On' : 'Off'}</li>
                  <li>Yearly Mode: {state.appSettings.showYearlyMode ? 'On' : 'Off'}</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Status</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>Calculations Valid: {state.isCalculationValid ? 'Yes' : 'No'}</li>
                  <li>Data Points: {state.calculations.length}</li>
                  <li>Better Option: {state.summary.betterOption}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
