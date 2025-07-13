import { useState, useRef, useEffect } from "react";
import { useApp } from "../../contexts";
import { cityDefaults, getCityDefault } from "../../data/cityDefaults";
import BuyInputs from "./BuyInputs";
import RentInputs from "./RentInputs";

type ActiveTab = "buy" | "rent";

export default function InputPanel() {
  const { loadCityDefaults } = useApp();
  const [activeTab, setActiveTab] = useState<ActiveTab>("buy");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(cityDefaults[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCitySelect = (cityId: string) => {
    const cityData = getCityDefault(cityId);

    if (cityData) {
      setSelectedCity(cityData);
      loadCityDefaults(cityData.data);
      setIsDropdownOpen(false);

      // Show notification (simple console log for now, can be enhanced later)
      console.log(`Loaded defaults for ${cityData.name}`);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="card p-6 border border-gray-100" data-testid="input-panel">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-dark-800">
          <i className="fas fa-sliders-h text-gray-500 mr-2"></i>
          Inputs
        </h2>
        <div className="relative inline-block" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="appearance-none text-xs font-medium text-dark-700 bg-gray-100 pl-7 pr-8 py-1 rounded-full cursor-pointer hover:bg-gray-200 transition focus:outline-none"
          >
            {selectedCity.id === "default" ? "City Presets" : selectedCity.name}
          </button>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
            <i className="fas fa-map-marker-alt text-dark-600"></i>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <i
              className={`fas fa-chevron-down text-xs text-dark-600 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            ></i>
          </div>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="py-1">
                {cityDefaults.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city.id)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition flex items-center space-x-2 ${
                      selectedCity.id === city.id ? "bg-gray-50 text-primary-700 font-medium" : "text-gray-700"
                    }`}
                  >
                    <i
                      className={`text-xs text-gray-400 ${
                        city.id === "default"
                          ? "fas fa-minus"
                          : selectedCity.id === city.id
                          ? "fas fa-map-marker-alt text-primary-600"
                          : "fas fa-map-marker-alt"
                      }`}
                    ></i>
                    <p className="text-sm">{city.name}</p>
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-100 px-3 py-2 bg-gray-50 rounded-b-lg">
                <p className="text-2xs text-gray-500 leading-relaxed">
                  City presets based on median single-family home prices, rents, and housing trends from the past
                  decade. Data from Zillow, Redfin, and government sources. Does not predict future market conditions.
                </p>
              </div>
            </div>
          )}
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
