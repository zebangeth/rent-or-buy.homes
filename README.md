<div align="center">

<img src="public/title3.png" alt="Job Worth Calculator" width="400" />
<br><br>

<p>
   <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
   <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
   <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
   <img src="https://img.shields.io/badge/Vite-4d55e1?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
   <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
   <img src="https://img.shields.io/badge/Claude-d85d3c?style=for-the-badge&logo=claude&logoColor=white" alt="Claude Code" />
</p>

<div align="center">

**[► 🏠 Try it Now ◄](https://rent-or-buy.homes)**

</div>

<p>
   <a href="#english"><img src="https://img.shields.io/badge/English-blue?style=for-the-badge" alt="English" /></a>
   &nbsp;&nbsp;
   <a href="#中文"><img src="https://img.shields.io/badge/中文-gray?style=for-the-badge" alt="中文" /></a>
   &nbsp;&nbsp;
</p>

</div>

---

> <div align="center">
>   <sub>Thank you for checking out Rent or Buy Calculator! If you find it useful or interesting, consider giving this repository a <strong>star</strong> ⭐. It helps others discover the project too.</sub>
> </div>

<div id="english">

<h2 align="center">🏠 rent-or-buy.homes</h2>

<p align="center"><i>Instantly see which option leaves you richer.</i></p>

### 🎯 What It Does

### 🖥️ How to Use

### ✨ The Calculation Method

### 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 🚀 Development & Contributing

- [Open an issue](https://github.com/zebangeth/rent-or-buy.homes/issues/new) if you have suggestions or find a bug
- Fork the repository and submit a PR for new features or bug fixes

**Prerequisites**

- Node.js 18+
- npm or yarn

**Installation**

```bash
# Clone the repository
git clone https://github.com/zebangeth/rent-or-buy.homes.git
cd rent-or-buy.homes

# Install dependencies and start development server
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

#### 🛠️ Tech Stack

**Core Framework**: React 19, TypeScript, Vite
**UI & Styling**: Tailwind CSS, ApexCharts
**State Management & Routing**: React Context, React Router v7, LZ-String
**Internationalization**: i18next, react-i18next

#### 🏗️ Architecture

```
┌──────────────┐     state updates      ┌──────────────┐
│  InputPanel  │ ────────────────────►  │   AppContext │
│              │                        │  (useReducer)│
└──────────────┘                        └───────┬──────┘
                                                │
                                                ▼
┌──────────────┐                        ┌──────────────┐
│   URLSync    │◄─── history.replace ───│ ResultPanel  │
│   Hook       │                        │   + Charts   │
└──────────────┘                        └──────────────┘
```

**Key Components**

- **AppContext**: Centralized state management for all calculations
- **Financial Engine**: Pure calculation functions in `src/lib/finance/`
- **Input Components**: Reusable sliders, buttons, and number inputs
- **Result Visualization**: Charts and summary cards
- **URL Synchronization**: Automatic state persistence in URLs

#### 🔮 Work in Progress

- [ ] **Advanced Charts**: More detailed financial projections
- [ ] **Shareable Links**: Share the results with others
- [ ] **City Presets**: Refine the city presets numbers and add more cities
- [ ] **PDF Export**: Generate detailed reports

<br />
<div align="center">
  <sub>Thank you for reading! If you find rent-or-buy.homes useful, consider giving this repository a <strong>star</strong> ⭐.</sub>
</div>

---

<div id="中文">

<h2 align="center">🏠 rent-or-buy.homes</h2>

</div>
