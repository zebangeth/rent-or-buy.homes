# Buy vs Rent Calculator – Design Doc (v0.1)

---

## 1. Overview

A lightweight web app that lets users compare long‑term net‑worth outcomes for **buying** a home versus **renting & investing the savings**. 100 % client‑side; no dedicated backend required for the MVP.

---

## 2. Goals & Non‑Goals

|                                                  | In Scope | Out of Scope                     |
| ------------------------------------------------ | -------- | -------------------------------- |
| Core calculator logic                            | ✅       |                                  |
| Shareable results via URL                        | ✅       | Database‑backed scenario storage |
| Multi‑language UI (EN / ZH)                      | ✅       | Other locales, server‑side i18n  |
| Mobile‑first responsive UX                       | ✅       | Native apps                      |
| Basic charts (net‑worth curve, yearly cash‑flow) | ✅       | Other charts                     |

---

## 3. Key Features

1. **Real‑time Calculator** – instant recompute on input change.
2. **Shareable Link** – serialises current scenario into the URL (query or `#` hash), optionally compressed via `lz-string`.
3. **Multi‑language (i18n)** – UI strings + number / currency formatting based on user language.

---

## 4. Technical Stack

| Layer              | Choice                                   | Rationale                                                   |
| ------------------ | ---------------------------------------- | ----------------------------------------------------------- |
| Front‑end          | **React 18 + TypeScript** (via **Vite**) | Familiar, quick build, strong typing for financial formulas |
| Styling            | **Tailwind CSS**                         | Utility‑first, zero runtime                                 |
| Charts             | **Recharts**                             | Small bundle, declarative                                   |
| Routing & URL sync | **react‑router v6** + custom hook        | SPA navigation + history API                                |
| i18n               | **i18next + react‑i18next**              | Industry standard, JSON dictionaries                        |
| Compression        | **lz‑string**                            | ↓ URL length when parameters > 2 kB                         |
| Hosting            | **Vercel** (static deploy)               | CDN edge, free tier, instant rollbacks                      |

---

## 5. Architecture

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

- **URLSync Hook**

  - `useEffect` #1 – on mount: parse location, set initial state.
  - `useEffect` #2 – on relevant state change: serialise + compress + `history.replaceState`.

- **Calculation Engine** – pure functions in `/lib/finance/`.

---

## 6. Internationalisation

- Detect user language via `navigator.language` or query `?lang=`.
- Translation JSONs under `/public/locales/{en,zh}/translation.json`.
- Currency & number formatting always use USD, but use million, thousand for English but 万 for Chinese.
- Language switcher toggles context + persists to `localStorage`.

---

## 7. Build & Deploy Pipeline

GitHub and Vercel

---

---

---

# Implementation Plan

1. **Project Setup**: Establish a solid foundation with Vite, React, TypeScript, and the chosen tech stack.
2. **UI Development**: Build the inputs and result panels, ensuring responsiveness and a mobile-first design.
   - Header
   - Hero Section
   - Input Panel
   - Result Panel
   - Footer
3. **Calculation Engine**: Create accurate, reusable financial formulas.
4. **State Management**: Centralize state with React Context for real-time updates.
5. **URL Synchronization**: Enable shareable links with state encoded in the URL.
6. **Internationalization**: Add multi-language support with proper formatting.
7. **Chart Integration**: Visualize results with dynamic charts.
8. **Optimization**: Compress URL parameters for efficiency.
9. **Testing**: Validate functionality and responsiveness.
10. **Deployment**: Launch the app on Vercel with continuous deployment.

## Potential Repository Structure

```plaintext
rent-or-buy.homes/
├── public/
│   └── locales/             # i18n files
│       ├── en/translation.json
│       └── zh/translation.json
├── src/
│   ├── components/
│   │   ├── Header/
│   │   ├── HeroSection/
│   │   ├── InputPanel/
│   │   ├── ResultPanel/     # Results and charts
│   │   └── Footer/
│   │       ├── Footer.tsx
│   │       ├── FooterLinks.tsx
│   │       └── FooterText.tsx
│   ├── lib/
│   │   └── finance/         # Financial calculations
│   │       ├── calculateNetWorth.ts
│   │       ├── calculateCashFlow.ts
│   │       └── index.ts
│   ├── contexts/
│   │   └── AppContext.tsx
│   ├── hooks/
│   │   └── useURLSync.ts
│   ├── App.tsx              # Main app component
│   ├── index.css            # Global styles with Tailwind
│   ├── main.tsx             # Entry point
│   └── vite-env.d.ts        # Vite TypeScript env
├── index.html               # HTML template
├── package.json             # Project dependencies
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript config
└── vite.config.ts           # Vite config
```
