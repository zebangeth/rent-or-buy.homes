import React from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import InputPanel from "./components/InputPanel";
import ResultPanel from "./components/ResultPanel";
import Footer from "./components/Footer";
import { AppProvider, useApp } from "./contexts";
import { useURLSync } from "./hooks/useURLSync";
import { Analytics } from "@vercel/analytics/react";
import { useTranslation } from "react-i18next";

function AppContent() {
  const { state, updateAppSetting } = useApp();
  const { i18n } = useTranslation();
  
  // Initialize URL synchronization
  useURLSync();

  // Sync i18n language with app state on mount
  React.useEffect(() => {
    if (state.appSettings.currentLanguage !== i18n.language) {
      i18n.changeLanguage(state.appSettings.currentLanguage);
    }
  }, [state.appSettings.currentLanguage, i18n]);

  const handleLanguageChange = (language: string) => {
    updateAppSetting("currentLanguage", language);
    i18n.changeLanguage(language);
  };

  return (
    <div className="w-full max-w-6xl mx-auto min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <Header currentLanguage={state.appSettings.currentLanguage} onLanguageChange={handleLanguageChange} />

        {/* Hero Section */}
        <HeroSection />

        {/* Main Dashboard Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Section: Input Panel */}
          <div className="w-full md:w-1/3">
            <InputPanel />
          </div>

          {/* Right Section: Results Panel */}
          <ResultPanel />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
      <Analytics />
    </AppProvider>
  );
}

export default App;
