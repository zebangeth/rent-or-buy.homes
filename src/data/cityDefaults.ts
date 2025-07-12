import type { BuyInputs, RentInputs } from "../contexts/AppContext";

export interface CityDefault {
  id: string;
  name: string;
  data: Partial<BuyInputs & RentInputs>;
}

export const cityDefaults: CityDefault[] = [
  {
    id: "default",
    name: "Default",
    data: {
      propertyPrice: 1000000,
      downPaymentPercentage: 25,
      mortgageInterestRateAnnual: 6.75,
      propertyTaxRateAnnual: 0.8,
      currentMonthlyRentAmount: 6000,
      homeAppreciationCagr: 3.5,
    },
  },
  {
    id: "bayarea",
    name: "Bay Area, CA",
    data: {
      propertyPrice: 2500000,
      downPaymentPercentage: 25,
      mortgageInterestRateAnnual: 6.75,
      propertyTaxRateAnnual: 1.2,
      currentMonthlyRentAmount: 6000,
      homeAppreciationCagr: 5,
    },
  },
  {
    id: "seattle",
    name: "Seattle, WA",
    data: {
      propertyPrice: 1350000,
      downPaymentPercentage: 20,
      mortgageInterestRateAnnual: 6.25,
      propertyTaxRateAnnual: 0.92,
      currentMonthlyRentAmount: 3800,
      homeAppreciationCagr: 4.5,
    },
  },
  {
    id: "losangeles",
    name: "Los Angeles, CA",
    data: {
      propertyPrice: 1200000,
      downPaymentPercentage: 20,
      mortgageInterestRateAnnual: 6.5,
      propertyTaxRateAnnual: 0.8,
      currentMonthlyRentAmount: 3800,
      homeAppreciationCagr: 3.5,
    },
  },
  {
    id: "austin",
    name: "Austin, TX",
    data: {
      propertyPrice: 750000,
      downPaymentPercentage: 15,
      mortgageInterestRateAnnual: 6.1,
      propertyTaxRateAnnual: 1.8,
      currentMonthlyRentAmount: 2800,
      homeAppreciationCagr: 4.5,
    },
  },
  {
    id: "boston",
    name: "Boston, MA",
    data: {
      propertyPrice: 1250000,
      downPaymentPercentage: 20,
      mortgageInterestRateAnnual: 6.38,
      propertyTaxRateAnnual: 1.15,
      currentMonthlyRentAmount: 3900,
      homeAppreciationCagr: 3.5,
    },
  },
  {
    id: "nyc",
    name: "New York, NY",
    data: {
      propertyPrice: 2100000,
      downPaymentPercentage: 20,
      mortgageInterestRateAnnual: 6.4,
      propertyTaxRateAnnual: 0.85,
      currentMonthlyRentAmount: 5500,
      homeAppreciationCagr: 1.5,
    },
  },
];

export function getCityDefault(id: string): CityDefault | undefined {
  return cityDefaults.find((city) => city.id === id);
}
