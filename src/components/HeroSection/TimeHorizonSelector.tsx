import { useTranslation } from "react-i18next";
import { useApp } from "../../contexts";

interface TimeHorizonOption {
  years: number;
  key: string;
}

export default function TimeHorizonSelector() {
  const { t } = useTranslation();
  const { state, dispatch } = useApp();
  const currentYears = state.appSettings.projectionYears;

  const TIME_HORIZON_OPTIONS: TimeHorizonOption[] = [
    { years: 10, key: "10" },
    { years: 15, key: "15" },
    { years: 20, key: "20" },
    { years: 30, key: "30" }
  ];

  const handleYearChange = (years: number) => {
    dispatch({ type: "SET_PROJECTION_YEARS", years });
  };

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-3 mb-3">
        <span className="text-sm font-medium text-dark-600">{t('hero.timeHorizon.label')}</span>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {TIME_HORIZON_OPTIONS.map(({ years, key }) => (
            <button
              key={years}
              onClick={() => handleYearChange(years)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition ${
                currentYears === years
                  ? "bg-dark-800 text-white"
                  : "text-dark-600 hover:bg-gray-200"
              }`}
            >
              {t(`hero.timeHorizon.options.${key}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}