Overall logic behind our calculator:

1. We calculate the cash flow for both buying and renting, then compare them. If one option’s expenses in a given year are higher than the other’s, the extra expense is treated as an investment in the other option for that year.
2. In the first year, the down payment and transaction costs count as expenses for buying, while rent is the expense for renting. So, the investment for buying that year is zero, and for renting, it’s the down payment and transaction costs minus that year’s rent.
3. For the following years, buying expenses include mortgage payments, property taxes, insurance, and maintenance, while renting expenses are just the rent. The option with lower expenses in a given year treats the leftover amount as an investment.

As for the net asset value:

- For buying, it’s the property value minus the mortgage balance for that year (plus any investment value if applicable).
- For renting, it’s the total accumulated investment value.

### Inputs

#### Buy Parameters

买房基本数据：

a. property_price | 购房价格 | Current House Price | example: $2M
b. down_payment_percentage | 首付比例 | Down Payment % | example: 25%
c. mortgage_interest_rate_annual | 贷款利率 | Mortgage Interest Rate | example: 6.75%
d. mortgage_term_years | 贷款期限 | Mortgage Term | example: 30 years

买入时交易一次性成本：

e. closing_costs_percentage_buy | 交易成本 | Closing Cost % | example: 1% of home price

持有成本：

f. property_tax_rate_annual | 房产税率 | Property Tax Rate | example: 1.2% of property price per year
g. insurance_and_maintenance_rate_annual | 房屋保险与维修 | Insurance + Maintenance | example: 0.8% of property price per year
h. hoa_fee_annual | HOA 费 | HOA Fee | example: 0

增值假设：

i. home_appreciation_cagr | 房价年增长率 | House Appreciation (CAGR) | example: 5%

税收影响：

j. marginal_tax_rate | 边际所得税率 | Marginal Tax Rate | example: 24%
k. mortgage_interest_deduction | 房贷利息抵税 | Mortgage Interest Deduction | example: true

出售时交易一次性成本：

l. selling_costs_percentage_sell | 出售交易成本 | Selling Cost | example: 5% of property price
m. long_term_capital_gains_tax_rate | 长期资本利得税 | Capital Gains Tax Rate on Property Sale | example: 15%
n. tax_free_capital_gain_amount | 免税增值额度 | Tax-Free Capital Gain | example: $500,000

#### Rent and Invest Parameters

租房基本数据：

o. current_monthly_rent_amount | 当前月租金 | Current Monthly Rent | example: $6,000
p. rent_growth_rate_annual | 租金增长率 | Rent Growth | example: same as home appreciation

投资基本数据：

q. investment_options_list | 投资标的选择 | Investment Options List | example: SPY, QQQ, Google
r. investment_options_cagr_list | 年均涨幅 | Investment Options CAGR | example: 9.25%, 15.2%, 17.22%
s. long_term_capital_gains_tax_rate | 资本利得税率 | Capital Gains on Investment | example: 24%

### Organized Inputs

#### Buy Parameters

Essential (Visible by Default):

- a. property_price
  - **Label:** `Property Purchase Price`
  - **Input Type:** Number input, formatted for currency, slider from 100k to 10M or number input for $.
  - **Placeholder/Example:** `e.g., $750,000`
- b. down_payment_percentage
  - **Label:** `Down Payment`
  - **Input Type:** Percentage input, slider from 0-100% or number input for %.
  - **Dynamic Display:** Show the calculated dollar amount of the down payment next to it. (`$ [property_price * down_payment_percentage]`)
  - **Default:** `25%`
- c. mortgage_interest_rate_annual
  - **Label:** `Mortgage Interest Rate`
  - **Input Type:** Number input, formatted as a percentage (e.g., `6.75%`).
  - **Placeholder/Example:** `e.g., 6.75%`
- d. mortgage_term_years
  - **Label:** `Mortgage Term`
  - **Input Type:** radio buttons, `15 Years`, `20 Years`, `30 Years`.
  - **Default:** `30 Years`
- i. home_appreciation_cagr
  - **Label:** `Expected Annual Home Appreciation`
  - **Input Type:** Slider, from 0% to 10% or number input for %.
  - **Default:** `3.5%` (Provide a tooltip explaining this is an estimate).

Advanced Options (Initially Collapsed - User clicks to expand "More Options" or "Advanced Options"):

Buying/Selling Transaction Costs:

- e. closing_costs_percentage_buy

  - **Label:** `Closing Costs (Current Buy)`
  - **Input Type:** Percentage input.
  - **Tooltip:** "As a % of property price (e.g., loan origination, title, and other closing costs)."
  - **Default:** `2%`

- l. selling_costs_percentage_sell
  - **Label:** `Selling Costs (Future Sale)`
  - **Input Type:** Percentage input.
  - **Tooltip:** "As a % of future sale price (e.g., agent commissions)."
  - **Default:** `5%`

Holding Costs:

- f. property_tax_rate_annual

  - **Label:** `Annual Property Tax Rate`
  - **Input Type:** Percentage input.
  - **Tooltip:** "As a % of the property's assessed value each year."
  - **Default:** `1.1%`

- g. insurance_and_maintenance_rate_annual

  - **Label:** `Annual Insurance & Maintenance`
  - **Input Type:** Percentage input.
  - **Tooltip:** "Combined estimate as a % of the property's value each year."
  - **Default:** `1.0%`

- h. hoa_fee_annual
  - **Label:** `Annual HOA Fee`
  - **Input Type:** Number input (currency).
  - **Default:** `$0`

Tax Implications:

- j. marginal_tax_rate

  - **Label:** `Your Marginal Income Tax Rate`
  - **Input Type:** Percentage input.
  - **Tooltip:** "Your combined federal and state rate. Used to estimate mortgage interest deduction benefits."
  - **Default:** `24%`

- k. mortgage_interest_deduction

  - **Label:** `Claim Mortgage Interest Deduction?`
  - **Input Type:** Toggle switch (Yes/No).
  - **Tooltip:** "If you itemize deductions on your tax return, you can deduct the interest paid on your mortgage."
  - **Default:** `Yes`

- m. long_term_capital_gains_tax_rate

  - **Label:** `Capital Gains Tax Rate (Property Sale)`
  - **Input Type:** Percentage input.
  - **Default:** `15%`

- n. tax_free_capital_gain_amount
  - **Label:** `Tax-Free Capital Gain Amount (Home Sale)`
  - **Input Type:** Radio buttons, `Single`, `Married`, `Head of Household`.
  - **Tooltip:** "$250,000 for single, $500,000 for married filing jointly in the US."
  - **Default:** `Married`

#### Rent and Invest Parameters

Basic Options:

- o. current_monthly_rent_amount

  - **Label:** `Monthly Rent`
  - **Input Type:** Number input (currency), slider from $1,000 to $10,000.
  - **Placeholder/Example:** `e.g., $2,500`

- p. rent_growth_rate_annual

  - **Label:** `Expected Annual Rent Increase`
  - **Input Type:** Percentage input, slider from 0% to 10% or number input for %.
  - **Option:** A checkbox: "Same as home appreciation rate."
  - **Default:** `3.5%`, checkbox checked.

- q. investment_options_list
- r. investment_options_cagr_list

  - **Label:** `Expected Annual Investment Return`
  - **Input Type:** Radio buttons to select from "QQQ", "SPY", or "Custom". If "Custom", a slider from 0% to 30% or number input for % is shown.
  - **Tooltip:** "Your estimated average annual growth rate for investments."
  - **Default:** `8%` (e.g., a blended or common index fund return).

- s. long_term_capital_gains_tax_rate
  - **Label:** `Capital Gains Tax Rate`
  - **Input Type:** Percentage input.
  - **Tooltip:** "Tax rate on profits when investments are sold. Assumes long-term capital gains tax rate."
  - **Default:** `15%`

### Calculation Logic

**Core Principle:** We will calculate everything annually. For things like mortgages (paid monthly), we'll sum them up to an annual figure.

**I. Preliminary Calculations (Done Once):**

1. **Down Payment Amount:**
   - `down_payment_amount = property_price (a) * down_payment_percentage (b)`
2. **Loan Amount:**
   - `loan_amount = property_price (a) - down_payment_amount`
3. **Monthly Mortgage Payment:**
   - This requires the standard mortgage payment formula:
     `M = P [i(1 + i)^n] / [(1 + i)^n – 1]`
     Where:
     - `P = loan_amount`
     - `i = mortgage_interest_rate_annual (c) / 12` (monthly interest rate)
     - `n = mortgage_term_years (d) * 12` (total number of payments)
   - Let's call this `monthly_mortgage_payment`.
4. **Buying Closing Costs Amount:**
   - `closing_costs_buy_amount = property_price (a) * closing_costs_percentage_buy (e)`

**II. Annual Calculations (Loop from Year = 1 to N):**

For each year, we'll calculate the metrics for both "Buy" and "Rent & Invest" scenarios.

**A. BUY SCENARIO (for current `Year`)**

1. **Current Property Value (`current_year_property_value`):**

   - `current_year_property_value = property_price (a) * (1 + home_appreciation_cagr (i)) ^ Year`

2. **Mortgage Details for the Year:**

   - You'll need an amortization schedule (or a function that calculates it year by year). For the current `Year`:
     - `annual_interest_paid_this_year`: Sum of interest portions of the 12 monthly payments in this `Year`.
     - `annual_principal_paid_this_year`: Sum of principal portions of the 12 monthly payments in this `Year`.
     - `remaining_mortgage_balance_end_of_year`: Loan balance after payments of this `Year`.

3. **Annual Holding Costs:**

   - `annual_property_tax = current_year_property_value * property_tax_rate_annual (f)`
   - `annual_insurance_maintenance = current_year_property_value * insurance_and_maintenance_rate_annual (g)`
   - `annual_hoa = hoa_fee_annual (h)` (Assuming this is a fixed annual amount as per the input. If it were to grow, we'd need a growth rate for it.)
   - `total_annual_holding_costs = annual_property_tax + annual_insurance_maintenance + annual_hoa`

4. **Cash Outflow (Buy Scenario - for current `Year`):**

   - **If `Year == 1`:**
     `cash_outflow_buy = down_payment_amount + closing_costs_buy_amount + (monthly_mortgage_payment * 12) + total_annual_holding_costs`
   - **If `Year > 1`:**
     `cash_outflow_buy = (monthly_mortgage_payment * 12) + total_annual_holding_costs`
   - **Mortgage Interest Deduction Impact (if `k` is true):**
     `tax_savings_from_deduction = annual_interest_paid_this_year * marginal_tax_rate (j)`
     `adjusted_cash_outflow_buy = cash_outflow_buy - tax_savings_from_deduction`
     _(Note: For simplicity, we are assuming the full interest is deductible and directly reduces cash outflow. In reality, it reduces taxable income, and its value depends on being able to itemize beyond the standard deduction.)_

5. **Net Asset Value (Buy Scenario - "Not Cash Out" - at end of current `Year`):**

   - `net_asset_value_buy_not_cash_out = current_year_property_value - remaining_mortgage_balance_end_of_year`
   - This is essentially the Home Equity.

6. **Net Asset Value (Buy Scenario - "Cash Out" - at end of current `Year`):**
   - `selling_price = current_year_property_value`
   - `selling_costs_amount = selling_price * selling_costs_percentage_sell (l)`
   - `proceeds_before_tax_and_loan_repayment = selling_price - selling_costs_amount`
   - `capital_gain_on_property = selling_price - property_price (a)` (Initial purchase price)
   - `taxable_gain_on_property = max(0, capital_gain_on_property - tax_free_capital_gain_amount (n))`
   - `tax_on_property_gain = taxable_gain_on_property * long_term_capital_gains_tax_rate_property (m)`
   - `net_asset_value_buy_cash_out = proceeds_before_tax_and_loan_repayment - remaining_mortgage_balance_end_of_year - tax_on_property_gain`

**B. RENT & INVEST SCENARIO (for current `Year`)**

_Let's assume one investment option is chosen from `q` and its corresponding CAGR from `r` is used. Let's call it `selected_investment_cagr`._
_Also, we need to track the `investment_portfolio_value` year over year, and `total_cash_invested_so_far` for capital gains tax calculation on investment._

1.  **Initial Investment (Done once before Year 1 loop, or as part of Year 1 setup):**

    - The money _not_ spent on buying in Year 0 (or start of Year 1) is invested.
    - `initial_investment_amount = down_payment_amount + closing_costs_buy_amount`
    - Initialize `investment_portfolio_value = initial_investment_amount`
    - Initialize `total_cash_invested_so_far = initial_investment_amount`

2.  **Annual Rent Cost:**

    - `current_year_monthly_rent = current_monthly_rent_amount (o) * (1 + rent_growth_rate_annual (p)) ^ (Year - 1)`
    - `annual_rent_cost = current_year_monthly_rent * 12`

3.  **Cash Outflow (Rent Scenario - for current `Year`):**

    - `cash_outflow_rent = annual_rent_cost`

4.  **Differential Cash Flow for Investment:**

    - This is the difference between the _adjusted_ cash outflow of buying (considering tax savings) and renting for the current year. This amount is _added_ to the investment portfolio.
    - `additional_investment_this_year = adjusted_cash_outflow_buy (from Buy Scenario, step A4) - cash_outflow_rent`
    - *(Important: If `additional_investment_this_year` is negative, it means renting was more expensive in terms of cash flow for that year than buying. For simplicity, we can assume in this case that no additional funds are withdrawn from the investment to cover this, but simply that no *new* money is added from this differential. Or, for a more advanced model, you could have it draw down from the investment if desired. For now, let's assume `additional_investment_this_year = max(0, additional_investment_this_year)` if we only want to add positive savings.)*
      _A better approach is to always add this amount, even if negative, as it correctly reflects the funds available/needed relative to the buying scenario._

5.  **Investment Portfolio Growth:**

    - `portfolio_value_before_annual_growth = investment_portfolio_value (from end of last year, or initial amount if Year 1) + additional_investment_this_year`
    - `investment_return_this_year = portfolio_value_before_annual_growth * selected_investment_cagr`
    - `investment_portfolio_value_end_of_year = portfolio_value_before_annual_growth + investment_return_this_year`
    - Update `total_cash_invested_so_far = total_cash_invested_so_far + additional_investment_this_year` (only add the new cash, not returns)
    - Update `investment_portfolio_value` to `investment_portfolio_value_end_of_year` for the next iteration.

6.  **Net Asset Value (Rent & Invest - "Not Cash Out" - at end of current `Year`):**

    - `net_asset_value_rent_not_cash_out = investment_portfolio_value_end_of_year`

7.  **Net Asset Value (Rent & Invest - "Cash Out" - at end of current `Year`):**
    - `capital_gain_on_investment = investment_portfolio_value_end_of_year - total_cash_invested_so_far`
    - `taxable_gain_on_investment = max(0, capital_gain_on_investment)`
    - `tax_on_investment_gain = taxable_gain_on_investment * long_term_capital_gains_tax_rate_investment (s)`
    - `net_asset_value_rent_cash_out = investment_portfolio_value_end_of_year - tax_on_investment_gain`

**III. Presentation of Data:**

After running the loop from Year 1 to N, you will have the following data for each year:

1.  **For Buy Scenario:**
    - `cash_outflow_buy` (or `adjusted_cash_outflow_buy`)
    - `net_asset_value_buy_not_cash_out`
    - `net_asset_value_buy_cash_out`
2.  **For Rent & Invest Scenario:**
    - `cash_outflow_rent`
    - `additional_investment_this_year` (This is the _difference_ in cash outflows, which gets invested)
    - `net_asset_value_rent_not_cash_out`
    - `net_asset_value_rent_cash_out`

You can then present this in a table format, year by year:

| Year | Buy: Cash Outflow | Rent: Cash Outflow | Invested Amount (Rent Diff) | Buy: Net Asset (Not Cashed) | Buy: Net Asset (Cashed) | Rent: Net Asset (Not Cashed) | Rent: Net Asset (Cashed) |
| :--- | :---------------- | :----------------- | :-------------------------- | :-------------------------- | :---------------------- | :--------------------------- | :----------------------- |
| 1    | ...               | ...                | ...                         | ...                         | ...                     | ...                          | ...                      |
| 2    | ...               | ...                | ...                         | ...                         | ...                     | ...                          | ...                      |
| ...  | ...               | ...                | ...                         | ...                         | ...                     | ...                          | ...                      |
| N    | ...               | ...                | ...                         | ...                         | ...                     | ...                          | ...                      |

This structure should allow you to calculate and present the key data points you're interested in. Remember to handle the "Year 1" cash outflows (which include upfront costs) separately from subsequent years.

Long-term capital gains tax rates combined with the Net Investment Income Tax (NIIT) vary by income level and filing status. Below is a breakdown of total rates for 2025, including the 3.8% NIIT where applicable:

## Total Long-Term Capital Gains Tax Rates (Including NIIT)

| Filing Status              | Taxable Income Range | LTCG Rate | NIIT Applies? | **Total Rate** |
| -------------------------- | -------------------- | --------- | ------------- | -------------- |
| **Single**                 | $0 – $48,350         | 0%        | No            | 0%             |
|                            | $48,351 – $200,000   | 15%       | No            | 15%            |
|                            | $200,001 – $533,400  | 15%       | Yes           | 18.8%          |
|                            | Over $533,400        | 20%       | Yes           | 23.8%          |
| **Married Filing Jointly** | $0 – $96,700         | 0%        | No            | 0%             |
|                            | $96,701 – $250,000   | 15%       | No            | 15%            |
|                            | $250,001 – $600,050  | 15%       | Yes           | 18.8%          |
|                            | Over $600,050        | 20%       | Yes           | 23.8%          |
| **Head of Household**      | $0 – $64,750         | 0%        | No            | 0%             |
|                            | $64,751 – $200,000   | 15%       | No            | 15%            |
|                            | $200,001 – $566,700  | 15%       | Yes           | 18.8%          |
|                            | Over $566,700        | 20%       | Yes           | 23.8%          |

### Key Notes:

1. **NIIT Thresholds**:

   - Applies if Modified Adjusted Gross Income (MAGI) exceeds:
     - $200,000 (Single/Head of Household)
     - $250,000 (Married Filing Jointly) [1][6]
   - The 3.8% tax applies to the **lesser of**:
     - Net investment income, or
     - MAGI exceeding the threshold

2. **Exceptions**:

   - Collectibles (e.g., art, coins) and certain real estate gains may face higher rates (25-28%) [6]
   - State taxes may apply additionally (not included in table)

3. **Income Definitions**:
   - _Taxable income_ determines capital gains rate brackets
   - _MAGI_ determines NIIT applicability

This structure incentivizes long-term investing while ensuring high-income investors pay higher effective rates. For example, a single filer with $450,000 taxable income would pay 15% capital gains tax + 3.8% NIIT = 18.8% total on long-term gains [3][6].

Citations:
[1] https://www.bankerslife.com/insights/personal-finance/understanding-the-new-2025-tax-policies-capital-gains-tax-rates-and-rules/
[2] https://www.schwab.com/learn/story/using-tax-brackets-to-manage-your-taxable-income
[3] https://www.bankrate.com/investing/long-term-capital-gains-tax/
[4] https://www.kiplinger.com/taxes/capital-gains-tax/602224/capital-gains-tax-rates
[5] https://smartasset.com/investing/capital-gains-tax-calculator
[6] https://turbotax.intuit.com/tax-tips/investments-and-taxes/guide-to-short-term-vs-long-term-capital-gains-taxes-brokerage-accounts-etc/L7KCu9etn
[7] https://bradfordtaxinstitute.com/Free_Resources/2025-Capital-Gains-Rates.aspx
[8] https://www.irs.gov/taxtopics/tc409
[9] https://www.kiplinger.com/taxes/new-irs-long-term-capital-gains-tax-thresholds
[10] https://kahnlitwin.com/blogs/tax-blog/reducing-the-3-8-net-investment-income-tax-in-2025-4-key-strategies
[11] https://www.investopedia.com/taxes/capital-gains-tax-101/
[12] https://www.irs.gov/taxtopics/tc559
[13] https://taxfoundation.org/data/all/federal/2025-tax-brackets/
[14] https://investor.vanguard.com/investor-resources-education/taxes/realized-capital-gains
[15] https://www.fidelity.com/learning-center/smart-money/capital-gains-tax-rates
[16] https://www.nerdwallet.com/article/taxes/capital-gains-tax-rates
