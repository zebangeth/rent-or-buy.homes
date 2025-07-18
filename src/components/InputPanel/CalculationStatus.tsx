import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../../contexts/AppContext";

export default function CalculationStatus() {
  const { t } = useTranslation();
  const { state } = useApp();
  const [isUpdating, setIsUpdating] = useState(false);
  const prevInputsRef = useRef<string>("");

  // Create a stable string representation of inputs to detect changes
  const currentInputs = JSON.stringify({
    buyInputs: state.buyInputs,
    rentInputs: state.rentInputs,
    projectionYears: state.appSettings.projectionYears,
    showCashOut: state.appSettings.showCashOut,
  });

  // Watch for input changes and show updating state
  useEffect(() => {
    if (prevInputsRef.current !== "" && currentInputs !== prevInputsRef.current) {
      // Inputs changed, show updating state briefly
      setIsUpdating(true);

      // Reset updating state after a short delay
      const timer = setTimeout(() => {
        setIsUpdating(false);
      }, 400);

      return () => clearTimeout(timer);
    }

    prevInputsRef.current = currentInputs;
  }, [currentInputs]);

  return (
    <div>
      {isUpdating ? (
        <div className="flex items-center justify-center text-gray-500 transition-all duration-300">
          <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-sm font-medium">{t('inputs.status.updating')}</span>
        </div>
      ) : (
        <div className="flex items-center justify-center text-green-600 transition-all duration-300">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium">{t('inputs.status.upToDate')}</span>
        </div>
      )}
    </div>
  );
}
