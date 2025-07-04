# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a buy vs rent calculator web application that helps users compare long-term net-worth outcomes between buying a home and renting while investing the savings. The app is 100% client-side with no backend required for the MVP.

## Implementation Progress Summary

### ✅ Completed Components
- **Core Architecture**: React Context state management with TypeScript
- **App State Management**: Complete AppContext with buy/rent inputs, calculations, and settings
- **Financial Engine**: Comprehensive calculation functions for mortgage, investments, and tax scenarios
- **Input Components**: Fully functional input panels with sliders, buttons, and number inputs
- **Header Component**: Language selector and branding
- **Hero Section**: Main conclusion display with time horizon selector, net worth breakdown cards, and CTA buttons
- **Debug Panel**: Development tool for testing calculations and state

### 🚧 In Progress / Needs Implementation
- **Result Panel**: Charts, visualizations, and summary cards
- **URL Synchronization**: Shareable links with state persistence
- **Internationalization**: i18next integration for multi-language support
- **Advanced Input Sections**: Some advanced tax and cost inputs
- **City Defaults**: Pre-configured settings for different markets

### 📋 Current State
The application has a solid foundation with:
- ✅ Complete state management architecture
- ✅ Sophisticated financial calculation engine  
- ✅ Professional input UI components
- ✅ Hero section with conclusions and net worth breakdown
- ✅ TypeScript types for all data structures
- ❌ Results visualization (charts/graphs)
- ❌ URL state persistence

**Target UI**: Complete mockup available in `UI_mockup/UI_1.html` showing the intended final design

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

## Tech Stack & Architecture

### Core Technologies
- **React 19** with **TypeScript** - Component framework with strict typing
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first styling framework
- **ESLint** - Code linting with React-specific rules

### Key Dependencies (Planned)
- `react-router-dom` - Client-side routing and URL synchronization
- `i18next` + `react-i18next` - Internationalization (English/Chinese)
- `lz-string` - URL compression for shareable links
- Chart library (TBD) - For financial projections visualization

### Implemented Architecture
```
┌──────────────┐     state updates      ┌──────────────┐
│  InputPanel  │ ────────────────────►  │   AppContext │
│   (Complete) │                        │  (Complete)  │
└──────────────┘                        └───────┬──────┘
                                                │
                                                ▼
┌──────────────┐                        ┌──────────────┐
│   URLSync    │                        │ ResultPanel  │
│(Not Impl.)   │                        │(Not Impl.)   │
└──────────────┘                        └──────────────┘
```

## Current Project Structure

```
src/
├── components/
│   ├── Header/          ✅ Implemented
│   ├── InputPanel/      ✅ Implemented (Buy + Rent inputs)
│   │   ├── BuyInputs.tsx
│   │   ├── RentInputs.tsx
│   │   └── shared/      ✅ Reusable UI components
│   ├── DebugPanel/      ✅ Development tool
│   ├── HeroSection/     ✅ Complete with all sub-components
│   ├── ResultPanel/     ❌ Not implemented  
│   └── Footer/          ❌ Not implemented
├── lib/
│   ├── finance/         ✅ Complete calculation engine
│   │   ├── calculations.ts  ✅ All financial formulas
│   │   ├── types.ts         ✅ Calculation data types
│   │   └── index.ts
│   ├── constants.ts     ✅ Investment options, tax rates
│   └── inputUtils.ts    ✅ Input validation helpers
├── contexts/
│   └── AppContext.tsx   ✅ Complete state management
├── data/
│   └── cityDefaults.ts  ✅ Market-specific presets
├── hooks/
│   ├── useCalculations.ts ✅ Calculation integration
│   └── useURLSync.ts      ❌ Not implemented
├── App.tsx              ✅ Main layout structure
├── index.css           ✅ Tailwind setup
└── main.tsx            ✅ React 19 setup
```

## Financial Calculation Features

### ✅ Implemented Calculations
- **Mortgage Amortization**: PMT formula with full amortization schedule
- **Property Appreciation**: Compound annual growth with customizable rates
- **Investment Growth**: Portfolio growth with reinvestment of cash flow differences
- **Tax Calculations**: 
  - Mortgage interest deduction
  - Property capital gains (with exemptions)
  - Investment capital gains
  - Different rates by filing status
- **Cash Flow Analysis**: Detailed year-by-year cash outflows
- **Net Worth Projections**: Both liquid (cash-out) and illiquid scenarios

### 🔧 Key Calculation Logic
- Handles mortgage payoff scenarios (loan paid before projection end)
- Differential cash flow investment (when one scenario costs more, difference is invested)
- Advanced tax scenarios including filing status and exemption amounts
- Realistic holding costs (property tax, insurance, maintenance, HOA)
- Transaction costs (closing costs, selling costs)

## Next Implementation Priorities

1. **Result Panel Components** - Charts and summary visualizations
2. **URL State Sync** - Shareable links with compressed parameters
3. **Chart Integration** - Financial projection visualizations (ApexCharts or similar)
4. **Internationalization** - Multi-language support structure
5. **Footer Component** - Legal disclaimers and additional links

## Configuration Files

- `vite.config.ts` - Vite configuration with React plugin
- `tailwind.config.js` - Tailwind CSS setup for TypeScript files
- `eslint.config.js` - ESLint with TypeScript and React rules
- `tsconfig.json` - TypeScript project references setup
- `postcss.config.js` - PostCSS configuration for Tailwind

## Important Implementation Notes

- **State Management**: Fully implemented with React Context and useReducer
- **Type Safety**: Complete TypeScript coverage for all data structures
- **Financial Accuracy**: Sophisticated calculation engine matching real-world scenarios
- **Component Architecture**: Reusable input components with proper abstractions
- **Responsive Design**: Mobile-first Tailwind CSS approach
- **Performance**: Pure calculation functions for easy testing and optimization