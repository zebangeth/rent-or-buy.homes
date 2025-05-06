Below is a **“master numbers sheet”** for the UI mock‑up.

---

## 1 · Core Input Assumptions (shared across the UI)

| Category                     | Key number                   |
| ---------------------------- | ---------------------------- |
| **Home price**               | **\$2,500,000**              |
| **Down‑payment**             | **25 %** → \$625,000         |
| **Loan amount**              | \$1,875,000                  |
| **Mortgage APR**             | **6.75 %**, 30‑yr fixed      |
| **Monthly P\&I**             | **\$12,161**                 |
| **Closing cost**             | **1 %** of loan → \$18,750   |
| **Selling cost**             | **5 %** of sale price        |
| **Property‑tax rate**        | **1.2 %** of home value      |
| **Insurance + maintenance**  | **\$3,000 / yr**             |
| **Home appreciation (CAGR)** | **7.14 %**                   |
| **Rent – Year 0**            | **\$6,000 / mo**             |
| **Rent growth**              | **5 % / yr**                 |
| **Investment vehicle**       | **SPY** (default)            |
| **Investment CAGR**          | **9.25 %** (SPY)             |
| **Long‑term cap‑gains tax**  | **24 %** (15 % Fed + 9 % CA) |
| **Analysis horizon**         | **10 years**                 |

---

## 2 · Derived “headline” figures (keep these identical everywhere)

| Metric                                                   | **Value**                            | Where to show                                        |
| -------------------------------------------------------- | ------------------------------------ | ---------------------------------------------------- |
| Home value in Year 10                                    | **\$3,500,000**                      | Hero “If you buy a \$2.5 M home that grows …”        |
| Remaining mortgage bal. (Y10)                            | **\$1,600,000**                      | Tooltip / advanced panel                             |
| **Buy Net‑Worth (Y10)**<br>after paying 5 % selling cost | **\$3,124,000**                      | Hero, Buy card big number, Net‑Worth chart end‑point |
| **Rent + Invest Net‑Worth (Y10)**<br>after 24 % CG tax   | **\$2,845,000**                      | Hero, Rent card, chart end‑point                     |
| **Advantage** (Buy – Rent)                               | **\$279,000** (≈ 9.8 %)              | Hero badge, progress bar, sticky banner              |
| Avg. monthly edge                                        | **\$2,329 / mo**                     | Hero sub‑headline                                    |
| **Total cash‑out (10 yrs)**                              | Buy **\$1.85 M** • Rent **\$0.84 M** | Cash‑Outflow card, Snapshot card                     |
| Invested “difference”                                    | **\$1.01 M**                         | Shaded area in Cash‑Outflow chart                    |
| Portfolio value before tax                               | **\$3.57 M**                         | Rent card “Investment Value”                         |
| Home equity before sale                                  | **\$2.46 M**                         | Buy card “Home Equity”                               |
| Mortgage payment (yr 1)                                  | **\$12,161 / mo**                    | Monthly‑Cost tooltip                                 |
| First‑year rent                                          | **\$6,000 / mo**                     | Monthly‑Cost tooltip                                 |

---

## 3 · Tax / deduction constants (for advanced panel)

| Item                                      | Number              |
| ----------------------------------------- | ------------------- |
| Fed standard deduction (married)          | \$29,200            |
| CA standard deduction (married)           | \$11,080            |
| SALT cap                                  | \$10,000            |
| Mortgage‑interest deduction cap           | \$750,000 (Fed)     |
| CA mortgage‑interest cap                  | \$1,000,000         |
| Effective income‑tax rates (illustrative) | Fed 27 % / CA 8.5 % |

---

### How to use this sheet

- **Copy‑paste** the values wherever the UI now shows mismatched figures (`3.12 M` vs `3.12468 M`, etc.).
- Update your dummy arrays (`buyData`, `rentInvestData`, `buyCashAnnual`, `rentCashAnnual`) so their final element matches the headline net‑worths and cash‑out totals above.

Result: every number a user sees will line up from the Hero down to the fine print—no more distracting inconsistencies.
