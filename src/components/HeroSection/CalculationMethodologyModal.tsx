import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

interface CalculationMethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CalculationMethodologyModal({ isOpen, onClose }: CalculationMethodologyModalProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="methodology-modal-title"
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        aria-hidden="false"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 id="methodology-modal-title" className="text-2xl font-bold text-gray-900">
            {t('hero.methodology.title')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none rounded"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6 text-gray-700">
          {/* Introduction */}
          <div>
            <p className="text-lg leading-relaxed">
              {t('hero.methodology.intro')}
            </p>
          </div>

          {/* Core Principle */}
          <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2 text-gray-900">
              {t('hero.methodology.corePrinciple.title')}
            </h3>
            <p className="leading-relaxed">
              {t('hero.methodology.corePrinciple.description')}
            </p>
          </div>

          {/* How It Works */}
          <div>
            <h3 className="font-semibold text-xl mb-4 text-gray-900">
              {t('hero.methodology.howItWorks.title')}
            </h3>
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {t('hero.methodology.howItWorks.step1.title')}
                  </h4>
                  <p className="text-sm leading-relaxed">
                    {t('hero.methodology.howItWorks.step1.description')}
                  </p>
                  <ul className="mt-2 text-sm space-y-1 ml-4 list-disc">
                    <li>{t('hero.methodology.howItWorks.step1.buyItems')}</li>
                    <li>{t('hero.methodology.howItWorks.step1.rentItems')}</li>
                  </ul>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {t('hero.methodology.howItWorks.step2.title')}
                  </h4>
                  <p className="text-sm leading-relaxed">
                    {t('hero.methodology.howItWorks.step2.description')}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {t('hero.methodology.howItWorks.step3.title')}
                  </h4>
                  <p className="text-sm leading-relaxed">
                    {t('hero.methodology.howItWorks.step3.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Example */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 text-gray-900">
              {t('hero.methodology.example.title')}
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">{t('hero.methodology.example.year1.label')}</span>
                <ul className="ml-4 mt-1 space-y-1 list-disc">
                  <li>{t('hero.methodology.example.year1.buy')}</li>
                  <li>{t('hero.methodology.example.year1.rent')}</li>
                  <li className="font-semibold text-primary-700">{t('hero.methodology.example.year1.result')}</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold">{t('hero.methodology.example.laterYears.label')}</span>
                <p className="ml-4 mt-1">
                  {t('hero.methodology.example.laterYears.description')}
                </p>
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div>
            <h3 className="font-semibold text-xl mb-3 text-gray-900">
              {t('hero.methodology.whatsIncluded.title')}
            </h3>
            <p className="mb-3 leading-relaxed">
              {t('hero.methodology.whatsIncluded.description')}
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{t('hero.methodology.whatsIncluded.items.mortgagePayments')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{t('hero.methodology.whatsIncluded.items.propertyTaxes')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{t('hero.methodology.whatsIncluded.items.insurance')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{t('hero.methodology.whatsIncluded.items.maintenance')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{t('hero.methodology.whatsIncluded.items.closingCosts')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{t('hero.methodology.whatsIncluded.items.taxBenefits')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{t('hero.methodology.whatsIncluded.items.capitalGains')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{t('hero.methodology.whatsIncluded.items.sellingCosts')}</span>
              </li>
            </ul>
          </div>

          {/* Key Takeaway */}
          <div className="bg-secondary-50 border-l-4 border-secondary-500 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2 text-gray-900">
              {t('hero.methodology.keyTakeaway.title')}
            </h3>
            <p className="leading-relaxed">
              {t('hero.methodology.keyTakeaway.description')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium focus:outline-none"
          >
            {t('hero.methodology.closeButton')}
          </button>
        </div>
      </div>
    </div>
  );
}
