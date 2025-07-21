import { createContext, useContext, useReducer } from "react";
import type { ReactNode } from "react";
import type { YearlyCalculation } from "../lib/finance/types";

// Types for investment options
export type InvestmentOption = "SPY" | "QQQ" | "Custom";

export type FilingStatus = "Single" | "Married";

// Buy scenario inputs
export interface BuyInputs {
  // Essential inputs
  propertyPrice: number;
  downPaymentPercentage: number;
  mortgageInterestRateAnnual: number;
  mortgageTermYears: 15 | 20 | 30;
  homeAppreciationCagr: number;

  // Advanced inputs - transaction costs
  closingCostsPercentageBuy: number;
  sellingCostsPercentageSell: number;

  // Advanced inputs - holding costs
  propertyTaxRateAnnual: number;
  insuranceAndMaintenanceRateAnnual: number;
  hoaFeeAnnual: number;

  // Advanced inputs - tax implications
  marginalTaxRate: number;
  mortgageInterestDeduction: boolean;
  longTermCapitalGainsTaxRateProperty: number;
  taxFreeCapitalGainAmount: number;
  filingStatus: FilingStatus;
}

// Rent & invest scenario inputs
export interface RentInputs {
  currentMonthlyRentAmount: number;
  rentGrowthRateAnnual: number;
  sameAsHomeAppreciation: boolean;
  selectedInvestmentOption: InvestmentOption;
  customInvestmentReturn: number;
  longTermCapitalGainsTaxRateInvestment: number;
}

// App settings
export interface AppSettings {
  currentLanguage: string;
  projectionYears: number;
  showCashOut: boolean;
  showYearlyMode: boolean;
}

// Complete app state
export interface AppState {
  buyInputs: BuyInputs;
  rentInputs: RentInputs;
  appSettings: AppSettings;
  calculations: YearlyCalculation[];
  isCalculationValid: boolean;
}

// Action types with specific field types
export type AppAction =
  | { type: "UPDATE_BUY_INPUT"; field: keyof BuyInputs; value: BuyInputs[keyof BuyInputs] }
  | { type: "UPDATE_RENT_INPUT"; field: keyof RentInputs; value: RentInputs[keyof RentInputs] }
  | { type: "UPDATE_APP_SETTING"; field: keyof AppSettings; value: AppSettings[keyof AppSettings] }
  | { type: "SET_PROJECTION_YEARS"; years: number }
  | { type: "TOGGLE_CASH_OUT_MODE" }
  | { type: "TOGGLE_YEARLY_MODE" }
  | { type: "RECALCULATE" }
  | { type: "LOAD_CITY_DEFAULTS"; cityData: Partial<BuyInputs & RentInputs> }
  | {
      type: "LOAD_STATE_FROM_URL";
      state: { buyInputs?: Partial<BuyInputs>; rentInputs?: Partial<RentInputs>; appSettings?: Partial<AppSettings> };
    };

// Default values
const defaultBuyInputs: BuyInputs = {
  // Essential
  propertyPrice: 1500000,
  downPaymentPercentage: 25,
  mortgageInterestRateAnnual: 6.75,
  mortgageTermYears: 30,
  homeAppreciationCagr: 3.5,

  // Transaction costs
  closingCostsPercentageBuy: 2,
  sellingCostsPercentageSell: 5,

  // Holding costs
  propertyTaxRateAnnual: 1.1,
  insuranceAndMaintenanceRateAnnual: 1.0,
  hoaFeeAnnual: 0,

  // Tax implications
  marginalTaxRate: 24,
  mortgageInterestDeduction: true,
  longTermCapitalGainsTaxRateProperty: 15,
  taxFreeCapitalGainAmount: 500000, // Married filing jointly
  filingStatus: "Married",
};

const defaultRentInputs: RentInputs = {
  currentMonthlyRentAmount: 5000,
  rentGrowthRateAnnual: 3.5,
  sameAsHomeAppreciation: true,
  selectedInvestmentOption: "SPY",
  customInvestmentReturn: 10,
  longTermCapitalGainsTaxRateInvestment: 15,
};

const defaultAppSettings: AppSettings = {
  currentLanguage: "en",
  projectionYears: 15,
  showCashOut: false,
  showYearlyMode: false,
};

const initialState: AppState = {
  buyInputs: defaultBuyInputs,
  rentInputs: defaultRentInputs,
  appSettings: defaultAppSettings,
  calculations: [],
  isCalculationValid: false,
};

// Helper function to get investment return rate
export const getInvestmentReturnRate = (inputs: RentInputs): number => {
  const rates: Record<InvestmentOption, number> = {
    SPY: 12.5,
    QQQ: 16.5,
    Custom: inputs.customInvestmentReturn,
  };
  return rates[inputs.selectedInvestmentOption];
};

// Helper function to get tax-free capital gain amount
export const getTaxFreeCapitalGainAmount = (filingStatus: FilingStatus): number => {
  const amounts: Record<FilingStatus, number> = {
    Single: 250000,
    Married: 500000,
  };
  return amounts[filingStatus];
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "UPDATE_BUY_INPUT": {
      const newBuyInputs = {
        ...state.buyInputs,
        [action.field]: action.value,
      };

      // Update tax-free capital gain amount when filing status changes
      if (action.field === "filingStatus") {
        newBuyInputs.taxFreeCapitalGainAmount = getTaxFreeCapitalGainAmount(action.value as FilingStatus);
      }

      // If home appreciation rate changes and rent is set to follow it, update rent growth rate
      let newRentInputs = state.rentInputs;
      if (action.field === "homeAppreciationCagr" && state.rentInputs.sameAsHomeAppreciation) {
        newRentInputs = {
          ...state.rentInputs,
          rentGrowthRateAnnual: action.value as number,
        };
      }

      // Sync capital gains tax rates between buy and rent inputs
      if (action.field === "longTermCapitalGainsTaxRateProperty") {
        newRentInputs = {
          ...newRentInputs,
          longTermCapitalGainsTaxRateInvestment: action.value as number,
        };
      }

      return {
        ...state,
        buyInputs: newBuyInputs,
        rentInputs: newRentInputs,
        isCalculationValid: false,
      };
    }

    case "UPDATE_RENT_INPUT": {
      const newRentInputs = {
        ...state.rentInputs,
        [action.field]: action.value,
      };

      // If sameAsHomeAppreciation is enabled, sync rent growth with home appreciation
      if (action.field === "sameAsHomeAppreciation" && action.value) {
        newRentInputs.rentGrowthRateAnnual = state.buyInputs.homeAppreciationCagr;
      }

      // Sync capital gains tax rates between buy and rent inputs
      let newBuyInputs = state.buyInputs;
      if (action.field === "longTermCapitalGainsTaxRateInvestment") {
        newBuyInputs = {
          ...state.buyInputs,
          longTermCapitalGainsTaxRateProperty: action.value as number,
        };
      }

      return {
        ...state,
        buyInputs: newBuyInputs,
        rentInputs: newRentInputs,
        isCalculationValid: false,
      };
    }

    case "UPDATE_APP_SETTING":
      return {
        ...state,
        appSettings: {
          ...state.appSettings,
          [action.field]: action.value,
        },
      };

    case "SET_PROJECTION_YEARS":
      return {
        ...state,
        appSettings: {
          ...state.appSettings,
          projectionYears: action.years,
        },
        isCalculationValid: false,
      };

    case "TOGGLE_CASH_OUT_MODE":
      return {
        ...state,
        appSettings: {
          ...state.appSettings,
          showCashOut: !state.appSettings.showCashOut,
        },
      };

    case "TOGGLE_YEARLY_MODE":
      return {
        ...state,
        appSettings: {
          ...state.appSettings,
          showYearlyMode: !state.appSettings.showYearlyMode,
        },
      };

    case "LOAD_CITY_DEFAULTS":
      return {
        ...state,
        buyInputs: {
          ...state.buyInputs,
          ...action.cityData,
        },
        rentInputs: {
          ...state.rentInputs,
          ...action.cityData,
        },
        isCalculationValid: false,
      };

    case "LOAD_STATE_FROM_URL":
      return {
        ...state,
        ...(action.state.buyInputs && { buyInputs: { ...state.buyInputs, ...action.state.buyInputs } }),
        ...(action.state.rentInputs && { rentInputs: { ...state.rentInputs, ...action.state.rentInputs } }),
        ...(action.state.appSettings && { appSettings: { ...state.appSettings, ...action.state.appSettings } }),
        isCalculationValid: false,
      };

    case "RECALCULATE":
      // TODO: Implement actual calculation logic
      // For now, return state with calculations marked as valid
      return {
        ...state,
        isCalculationValid: true,
      };

    default:
      return state;
  }
}

// Context creation
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;

  // Convenience functions
  updateBuyInput: (field: keyof BuyInputs, value: BuyInputs[keyof BuyInputs]) => void;
  updateRentInput: (field: keyof RentInputs, value: RentInputs[keyof RentInputs]) => void;
  updateAppSetting: (field: keyof AppSettings, value: AppSettings[keyof AppSettings]) => void;
  loadCityDefaults: (cityData: Partial<BuyInputs & RentInputs>) => void;
  recalculate: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Convenience functions
  const updateBuyInput = (field: keyof BuyInputs, value: BuyInputs[keyof BuyInputs]) => {
    dispatch({ type: "UPDATE_BUY_INPUT", field, value });
  };

  const updateRentInput = (field: keyof RentInputs, value: RentInputs[keyof RentInputs]) => {
    dispatch({ type: "UPDATE_RENT_INPUT", field, value });
  };

  const updateAppSetting = (field: keyof AppSettings, value: AppSettings[keyof AppSettings]) => {
    dispatch({ type: "UPDATE_APP_SETTING", field, value });
  };

  const loadCityDefaults = (cityData: Partial<BuyInputs & RentInputs>) => {
    dispatch({ type: "LOAD_CITY_DEFAULTS", cityData });
  };

  const recalculate = () => {
    dispatch({ type: "RECALCULATE" });
  };

  const value: AppContextType = {
    state,
    dispatch,
    updateBuyInput,
    updateRentInput,
    updateAppSetting,
    loadCityDefaults,
    recalculate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
