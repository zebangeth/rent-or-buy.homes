import { useTranslation } from "react-i18next";
import { ShareButton } from '../ShareButton';

export default function CTAButtons() {
  const { t } = useTranslation();
  
  const scrollToInputs = () => {
    // Scroll to the input panel smoothly
    const inputPanel = document.querySelector('[data-testid="input-panel"]') || 
                      document.querySelector('.w-full.md\\:w-1\\/3'); // Fallback selector
    if (inputPanel) {
      inputPanel.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
      <button
        onClick={scrollToInputs}
        className="flex-1 py-3 px-4 bg-dark-800 hover:bg-dark-700 text-white font-medium rounded-xl transition flex items-center justify-center"
      >
        <i className="fas fa-sliders-h mr-2"></i> {t('hero.cta.editInputs')}
      </button>
      <ShareButton
        variant="primary"
        size="lg"
        className="flex-1 py-3 px-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-medium rounded-xl transition"
      />
    </div>
  );
}