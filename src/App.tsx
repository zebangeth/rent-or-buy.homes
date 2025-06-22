import { useState } from 'react'
import Header from './components/Header'

function App() {
  const [currentLanguage, setCurrentLanguage] = useState('en')

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language)
    // TODO: Implement actual i18n logic
    console.log(`Language changed to: ${language}`)
  }

  return (
    <div className="w-full max-w-6xl mx-auto min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <Header 
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
        />
        
        {/* Placeholder content - will be replaced with actual components */}
        <div className="space-y-8">
          <div className="card p-8 text-center">
            <h2 className="text-2xl font-semibold text-dark-800 mb-4">
              Buy vs Rent Calculator
            </h2>
            <p className="text-dark-500">
              UI components will be implemented here. The header section is now complete!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
