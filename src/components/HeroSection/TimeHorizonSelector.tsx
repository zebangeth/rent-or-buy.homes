import { useApp } from "../../contexts";

interface TimeHorizonOption {
  years: number;
  label: string;
}

const TIME_HORIZON_OPTIONS: TimeHorizonOption[] = [
  { years: 10, label: "10 years" },
  { years: 15, label: "15 years" },
  { years: 20, label: "20 years" },
  { years: 30, label: "30 years" }
];

export default function TimeHorizonSelector() {
  const { state, dispatch } = useApp();
  const currentYears = state.appSettings.projectionYears;

  const handleYearChange = (years: number) => {
    dispatch({ type: "SET_PROJECTION_YEARS", years });
  };

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-3 mb-3">
        <span className="text-sm font-medium text-dark-600">View projection for:</span>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {TIME_HORIZON_OPTIONS.map(({ years, label }) => (
            <button
              key={years}
              onClick={() => handleYearChange(years)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition ${
                currentYears === years
                  ? "bg-primary-600 text-white"
                  : "text-dark-600 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}