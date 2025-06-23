import Header from './components/Header'
import InputPanel from './components/InputPanel'
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
        
        {/* Main Dashboard Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Section: Input Panel */}
          <div className="w-full md:w-1/3">
            <InputPanel />
          </div>
          
          {/* Right Section: Results Placeholder */}
          <div className="w-full md:w-2/3 space-y-6">
            {/* Placeholder for Results */}
            <div className="card p-8 text-center">
              <h2 className="text-2xl font-semibold text-dark-800 mb-4">
                Results Panel
              </h2>
              <p className="text-dark-500 mb-6">
                Input panels are now functional! Results and charts will be implemented next.
              </p>
              
              {/* Current State Preview */}
              <div className="grid grid-cols-1 gap-4 text-left">
                <div className="bg-primary-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-primary-800 mb-2">Current Buy Settings</h3>
                  <div className="text-sm text-primary-700 space-y-1">
                    <div className="flex justify-between">
                      <span>Property Price:</span>
                      <span>${state.buyInputs.propertyPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Down Payment:</span>
                      <span>{state.buyInputs.downPaymentPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Rate:</span>
                      <span>{state.buyInputs.mortgageInterestRateAnnual}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Term:</span>
                      <span>{state.buyInputs.mortgageTermYears} years</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-secondary-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-secondary-800 mb-2">Current Rent Settings</h3>
                  <div className="text-sm text-secondary-700 space-y-1">
                    <div className="flex justify-between">
                      <span>Monthly Rent:</span>
                      <span>${state.rentInputs.currentMonthlyRentAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rent Growth:</span>
                      <span>{state.rentInputs.rentGrowthRateAnnual}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investment:</span>
                      <span>{state.rentInputs.selectedInvestmentOption}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Capital Gains Tax:</span>
                      <span>{state.rentInputs.longTermCapitalGainsTaxRateInvestment}%</span>
                    </div>
                  </div>
                </div>
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
