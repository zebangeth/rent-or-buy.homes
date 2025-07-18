import { useState } from "react";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  currentLanguage?: string;
  onLanguageChange?: (language: string) => void;
}

export default function Header({ currentLanguage = "en", onLanguageChange }: HeaderProps) {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
  };

  const languages = [
    { code: "en", label: t('header.language.english') },
    { code: "zh", label: t('header.language.chinese') },
  ];

  return (
    <header className="mb-10 border-b border-gray-200 pb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl sm:text-3xl lg:text-4xl font-bold text-dark-800 inline-block">
            <span className="font-medium text-dark-500">{t('header.title.prefix')}</span>
            <span className="text-primary-600">{t('header.title.buy')}</span>
            <span className="font-medium text-dark-500">{t('header.title.middle')}</span>
            <span className="text-secondary-600">{t('header.title.rent')}</span>
            <span className="font-medium text-dark-500">{t('header.title.suffix')}</span>
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Language Switch */}
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="appearance-none text-xs sm:text-sm font-medium text-dark-600 bg-gray-100 pl-6 sm:pl-8 pr-6 sm:pr-8 py-1.5 sm:py-2 rounded-full cursor-pointer hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1.5 sm:pl-2">
              <i className="fas fa-globe text-dark-500 text-xs"></i>
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5 sm:pr-2">
              <i className="fas fa-chevron-down text-xs text-dark-500"></i>
            </div>
          </div>

          {/* GitHub Link */}
          <a
            href="https://github.com/zebangeth/rent-or-buy.homes"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-dark-800 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-dark-700 transition flex items-center"
            title={t('header.githubTitle')}
          >
            <i className="fab fa-github mr-1"></i> {t('header.github')}
          </a>
        </div>
      </div>
      <p className="text-dark-500 max-w-2xl text-sm sm:text-base">{t('header.description')}</p>
    </header>
  );
}
