import { useState } from "react";
import { useApp } from "../../contexts";
import { cityDefaults, getCityDefault } from "../../data/cityDefaults";
import BuyInputs from "./BuyInputs";
import RentInputs from "./RentInputs";

type ActiveTab = "buy" | "rent";

export default function InputPanel() {
  const { loadCityDefaults } = useApp();
  const [activeTab, setActiveTab] = useState<ActiveTab>("buy");

  const handleCityDefaultChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = event.target.value;
    const cityData = getCityDefault(cityId);

    if (cityData) {
      loadCityDefaults(cityData.data);

      // Show notification (simple console log for now, can be enhanced later)
      console.log(`Loaded defaults for ${cityData.name}`);
    }
  };

  return (
    <div className="card p-6 border border-gray-100" data-testid="input-panel">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-dark-800">
          <i className="fas fa-sliders-h text-gray-500 mr-2"></i>
          Parameters
        </h2>
        <div className="relative inline-block">
          <select
            onChange={handleCityDefaultChange}
            className="appearance-none text-xs font-medium text-dark-700 bg-gray-100 pl-7 pr-8 py-1 rounded-full cursor-pointer hover:bg-gray-200 transition focus:outline-none"
          >
            {cityDefaults.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
            <i className="fas fa-bolt text-dark-600"></i>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <i className="fas fa-chevron-down text-xs text-dark-600"></i>
          </div>
        </div>
      </div>

      {/* Improved Tabs */}
      <div className="mb-6">
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("buy")}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === "buy" ? "bg-white text-primary-700 shadow-sm" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <i className="fas fa-home"></i>
            <span>Buy</span>
          </button>
          <button
            onClick={() => setActiveTab("rent")}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === "rent" ? "bg-white text-secondary-700 shadow-sm" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <i className="fas fa-chart-line"></i>
            <span>Rent & Invest</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "buy" ? (
        <BuyInputs onSwitchToRent={() => setActiveTab("rent")} />
      ) : (
        <RentInputs onSwitchToBuy={() => setActiveTab("buy")} />
      )}
    </div>
  );
}
