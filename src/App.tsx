import Header from './components/Header'
import InputPanel from './components/InputPanel'
import { DebugPanel } from './components/DebugPanel'
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
            {/* Results Panel Placeholder */}
            <div className="card p-8 text-center">
              <h2 className="text-2xl font-semibold text-dark-800 mb-4">
                Results Panel
              </h2>
              <p className="text-dark-500 mb-6">
                Financial calculations and charts will be implemented here.
              </p>
              <div className="text-sm text-gray-600">
                Coming soon: Net worth projections, cash flow analysis, and interactive charts
              </div>
            </div>

            {/* Debug Panel for Testing */}
            <DebugPanel />
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
