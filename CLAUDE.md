# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a buy vs rent calculator web application that helps users compare long-term net-worth outcomes between buying a home and renting while investing the savings. The app is 100% client-side with no backend required for the MVP.

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

### Key Dependencies
- `react-router-dom` - Client-side routing and URL synchronization
- `i18next` + `react-i18next` - Internationalization (English/Chinese)
- `lz-string` - URL compression for shareable links

### Planned Architecture (per DesignDoc.md)
```
┌──────────────┐     input change       ┌──────────────┐
│  FormPanel   │ ────────────────────►  │   App State  │
└──────────────┘                        │   (Context)  │
      ▲                                 └───────┬──────┘
      │ hydrate from URL                        │
┌─────┴──────┐                                  ▼
│   URLSync  │◄─── history.replace ──── ┌──────────────┐
│   (hook)   │                          │  ResultPanel │
└────────────┘                          └──────────────┘
```

## Project Structure

Based on the design document, the intended structure is:

```
src/
├── components/
│   ├── Header/
│   ├── HeroSection/
│   ├── InputPanel/
│   ├── ResultPanel/     # Results and charts
│   └── Footer/
├── lib/
│   └── finance/         # Financial calculation functions
├── contexts/
│   └── AppContext.tsx   # Centralized state management
├── hooks/
│   └── useURLSync.ts    # URL synchronization logic
├── App.tsx
├── index.css           # Global styles with Tailwind
└── main.tsx
```

## Key Features to Implement

1. **Real-time Calculator** - Instant recompute on input changes
2. **Shareable Links** - URL-encoded scenarios (compressed with lz-string)  
3. **Internationalization** - English/Chinese with proper number formatting
4. **Financial Calculations** - Pure functions in `/lib/finance/`
5. **URL Synchronization** - State persistence via URL parameters

## Configuration Files

- `vite.config.ts` - Vite configuration with React plugin
- `tailwind.config.js` - Tailwind CSS setup for TypeScript files
- `eslint.config.js` - ESLint with TypeScript and React rules
- `tsconfig.json` - TypeScript project references setup
- `postcss.config.js` - PostCSS configuration for Tailwind

## Important Notes

- The app is currently at initial Vite template stage - most features need implementation
- Financial calculation logic should be pure functions for testability
- State management via React Context for real-time updates
- URL compression needed when parameters exceed 2KB
- Mobile-first responsive design approach