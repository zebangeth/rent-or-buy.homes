import { useState } from "react";
import { useTranslation } from "react-i18next";
import TimeHorizonSelector from "./TimeHorizonSelector";
import ConclusionBadge from "./ConclusionBadge";
import NetWorthExplanation from "./NetWorthExplanation";
import KeyAssumptions from "./KeyAssumptions";
import NetAssetValueCards from "./NetAssetValueCards";
import CTAButtons from "./CTAButtons";
import CalculationMethodologyModal from "./CalculationMethodologyModal";

export default function HeroSection() {
  const { t } = useTranslation();
  const [isMethodologyModalOpen, setIsMethodologyModalOpen] = useState(false);

  return (
    <div className="mb-10">
      <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 p-8 border border-gray-200 relative overflow-hidden">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Explanation Section */}
          <div className="flex-1">
            <ConclusionBadge />

            <TimeHorizonSelector />

            <NetWorthExplanation />

            {/* How is this calculated section */}
            <div className="mb-5">
              <button
                onClick={() => setIsMethodologyModalOpen(true)}
                className="text-left hover:bg-white hover:bg-opacity-50 rounded px-2 py-1.5 transition-all group flex items-center gap-2 focus:outline-none"
              >
                <svg className="w-4 h-4 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-600 group-hover:text-primary-700 transition-colors underline decoration-dotted underline-offset-2">
                  {t('hero.methodology.buttonPrompt')}
                </span>
              </button>
            </div>

            <KeyAssumptions />
          </div>

          {/* Net Asset Value Breakdown */}
          <div className="lg:w-1/3 space-y-4">
            <NetAssetValueCards />
          </div>
        </div>

        {/* CTA Buttons */}
        <CTAButtons />
      </div>

      {/* Calculation Methodology Modal */}
      <CalculationMethodologyModal
        isOpen={isMethodologyModalOpen}
        onClose={() => setIsMethodologyModalOpen(false)}
      />
    </div>
  );
}