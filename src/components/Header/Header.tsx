import { useState } from 'react';

interface HeaderProps {
  currentLanguage?: string;
  onLanguageChange?: (language: string) => void;
}

export default function Header({ currentLanguage = 'en', onLanguageChange }: HeaderProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
  };

  const languages = [
    { code: 'en', label: '🇺🇸 English' },
    { code: 'zh', label: '🇨🇳 中文' }
  ];

  return (
    <header className="mb-10 border-b border-gray-200 pb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-4xl font-bold text-dark-800 inline-block">
            <span className="font-medium text-dark-500">Should I </span>
            <span className="text-primary-600">Buy</span>
            <span className="font-medium text-dark-500"> or </span>
            <span className="text-secondary-600">Rent</span>
            <span className="font-medium text-dark-500"> a House?</span>
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          {/* Language Switch */}
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="appearance-none text-sm font-medium text-dark-600 bg-gray-100 pl-8 pr-8 py-2 rounded-full cursor-pointer hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
              <i className="fas fa-globe text-dark-500"></i>
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <i className="fas fa-chevron-down text-xs text-dark-500"></i>
            </div>
          </div>

          {/* GitHub Link */}
          <a
            href="https://github.com/yourusername/rent-or-buy"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-dark-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-dark-700 transition flex items-center"
            title="View on GitHub"
          >
            <i className="fab fa-github mr-1"></i> GitHub
          </a>
        </div>
      </div>
      <p className="text-dark-500 max-w-2xl">
        This website helps you compare the financial outcomes of buying vs renting to see which option makes more
        financial sense.
      </p>
    </header>
  );
}