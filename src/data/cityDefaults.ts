import type { BuyInputs, RentInputs } from "../contexts/AppContext";

export interface CityDefault {
  id: string;
  name: string;
  data: Partial<BuyInputs & RentInputs>;
  children?: CityDefault[];
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
      propertyPrice: 1950000,
      propertyTaxRateAnnual: 1.1,
      currentMonthlyRentAmount: 4800,
      homeAppreciationCagr: 6.0,
      rentGrowthRateAnnual: 4.5,
      sameAsHomeAppreciation: false,
    },
    children: [
      {
        id: "bayarea-scc",
        name: "Santa Clara County",
        data: {
          propertyPrice: 2090000, // 2025 median
          propertyTaxRateAnnual: 1.1,
          homeAppreciationCagr: 8.0, // 10-year CAGR (2015→2025)
          rentGrowthRateAnnual: 4.5,
          sameAsHomeAppreciation: false,
        },
      },
      {
        id: "bayarea-cupertino",
        name: "Cupertino",
        data: {
          propertyPrice: 3575000, // 2025 median
          propertyTaxRateAnnual: 1.1,
          homeAppreciationCagr: 6.8, // 10-year CAGR (2015→2025)
          rentGrowthRateAnnual: 4.5,
          sameAsHomeAppreciation: false,
        },
      },
      {
        id: "bayarea-sunnyvale",
        name: "Sunnyvale",
        data: {
          propertyPrice: 2700000, // 2025 median
          propertyTaxRateAnnual: 1.1,
          homeAppreciationCagr: 6.7, // 10-year CAGR (2015→2025)
          rentGrowthRateAnnual: 4.5,
          sameAsHomeAppreciation: false,
        },
      },
    ],
  },
  {
    id: "losangeles",
    name: "Los Angeles, CA",
    data: {
      propertyPrice: 1100000,
      propertyTaxRateAnnual: 1.2,
      currentMonthlyRentAmount: 3800,
      homeAppreciationCagr: 6.5,
      rentGrowthRateAnnual: 5.0,
      sameAsHomeAppreciation: false,
    },
  },
  {
    id: "seattle",
    name: "Seattle, WA",
    data: {
      propertyPrice: 1350000,
      propertyTaxRateAnnual: 1.1,
      currentMonthlyRentAmount: 4000,
      homeAppreciationCagr: 6.5,
      rentGrowthRateAnnual: 5.0,
      sameAsHomeAppreciation: false,
    },
  },
  {
    id: "newyork",
    name: "New York, NY",
    data: {
      propertyPrice: 950000,
      propertyTaxRateAnnual: 1.0,
      currentMonthlyRentAmount: 4500,
      homeAppreciationCagr: 3.0,
      rentGrowthRateAnnual: 2.0,
      sameAsHomeAppreciation: false,
    },
  },
  {
    id: "chicago",
    name: "Chicago, IL",
    data: {
      propertyPrice: 400000,
      propertyTaxRateAnnual: 1.9,
      currentMonthlyRentAmount: 2000,
      homeAppreciationCagr: 4.5,
      rentGrowthRateAnnual: 3.0,
      sameAsHomeAppreciation: false,
    },
  },
  {
    id: "houston",
    name: "Houston, TX",
    data: {
      propertyPrice: 300000,
      propertyTaxRateAnnual: 1.6,
      currentMonthlyRentAmount: 1900,
      homeAppreciationCagr: 4.5,
      rentGrowthRateAnnual: 5.0,
      sameAsHomeAppreciation: false,
    },
  },
  {
    id: "austin",
    name: "Austin, TX",
    data: {
      propertyPrice: 550000,
      propertyTaxRateAnnual: 1.6,
      currentMonthlyRentAmount: 1900,
      homeAppreciationCagr: 7.5,
      rentGrowthRateAnnual: 4.5,
      sameAsHomeAppreciation: false,
    },
  },
  {
    id: "dallas",
    name: "Dallas, TX",
    data: {
      propertyPrice: 350000,
      propertyTaxRateAnnual: 1.6,
      currentMonthlyRentAmount: 2000,
      homeAppreciationCagr: 7.0,
      rentGrowthRateAnnual: 4.5,
      sameAsHomeAppreciation: false,
    },
  },
  {
    id: "phoenix",
    name: "Phoenix, AZ",
    data: {
      propertyPrice: 450000,
      propertyTaxRateAnnual: 0.8,
      currentMonthlyRentAmount: 1600,
      homeAppreciationCagr: 7.5,
      rentGrowthRateAnnual: 4.5,
      sameAsHomeAppreciation: false,
    },
  },
  {
    id: "boston",
    name: "Boston, MA",
    data: {
      propertyPrice: 800000,
      propertyTaxRateAnnual: 1.2,
      currentMonthlyRentAmount: 3800,
      homeAppreciationCagr: 5.0,
      rentGrowthRateAnnual: 5.0,
      sameAsHomeAppreciation: false,
    },
  },
  {
    id: "orlando",
    name: "Orlando, FL",
    data: {
      propertyPrice: 420000,
      propertyTaxRateAnnual: 1.2,
      currentMonthlyRentAmount: 2000,
      homeAppreciationCagr: 9.0,
      rentGrowthRateAnnual: 4.5,
      sameAsHomeAppreciation: false,
    },
  },
];

export function getCityDefault(id: string): CityDefault | undefined {
  const stack: CityDefault[] = [...cityDefaults];
  while (stack.length > 0) {
    const current = stack.pop() as CityDefault;
    if (current.id === id) {
      return current;
    }
    if (current.children && current.children.length > 0) {
      for (const child of current.children) {
        stack.push(child);
      }
    }
  }
  return undefined;
}
