import type { BuyInputs, RentInputs } from "../contexts/AppContext";

export interface CityDefault {
  id: string;
  name: string;
  data: Partial<BuyInputs & RentInputs>;
}

export const cityDefaults: CityDefault[] = [
  {
    id: "default",
    name: "City Presets",
    data: {
      propertyPrice: 2500000,
      downPaymentPercentage: 25,
      mortgageInterestRateAnnual: 6.75,
      propertyTaxRateAnnual: 1.2,
      currentMonthlyRentAmount: 6000,
      rentGrowthRateAnnual: 5,
    },
  },
  {
    id: "sunnyvale",
    name: "Sunnyvale, CA",
    data: {
      propertyPrice: 2350000,
      downPaymentPercentage: 20,
      mortgageInterestRateAnnual: 6.5,
      propertyTaxRateAnnual: 1.22,
      currentMonthlyRentAmount: 5800,
      rentGrowthRateAnnual: 5.2,
    },
  },
  {
    id: "fremont",
    name: "Fremont, CA",
    data: {
      propertyPrice: 1850000,
      downPaymentPercentage: 20,
      mortgageInterestRateAnnual: 6.5,
      propertyTaxRateAnnual: 1.25,
      currentMonthlyRentAmount: 4500,
      rentGrowthRateAnnual: 4.8,
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
      rentGrowthRateAnnual: 5,
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
      rentGrowthRateAnnual: 4.5,
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
      rentGrowthRateAnnual: 3.9,
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
      rentGrowthRateAnnual: 4.2,
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
      rentGrowthRateAnnual: 5.5,
    },
  },
  {
    id: "toronto",
    name: "Toronto, ON",
    data: {
      propertyPrice: 1450000,
      downPaymentPercentage: 20,
      mortgageInterestRateAnnual: 5.85,
      propertyTaxRateAnnual: 0.65,
      currentMonthlyRentAmount: 3500,
      rentGrowthRateAnnual: 4.0,
    },
  },
];

export function getCityDefault(id: string): CityDefault | undefined {
  return cityDefaults.find((city) => city.id === id);
}
