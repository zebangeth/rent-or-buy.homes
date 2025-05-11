### Inputs

#### Buy Parameters

买房基本数据：

a. property_price                        | 购房价格      | Current House Price         | example: $2M
b. down_payment_percentage               | 首付比例      | Down Payment %              | example: 25%
c. mortgage_interest_rate_annual         | 贷款利率      | Mortgage Interest Rate      | example: 6.75%
d. mortgage_term_years                   | 贷款期限      | Mortgage Term               | example: 30 years

买入时交易一次性成本：

e. closing_costs_percentage_buy          | 交易成本      | Closing Cost %              | example: 1% of home price

持有成本：

f. property_tax_rate_annual              | 房产税率      | Property Tax Rate           | example: 1.2% of property price per year
g. insurance_and_maintenance_rate_annual | 房屋保险与维修 | Insurance + Maintenance     | example: 0.8% of property price per year
h. hoa_fee_annual                        | HOA费        | HOA Fee                     | example: 0

增值假设：

i. home_appreciation_cagr                | 房价年增长率   | House Appreciation (CAGR)   | example: 5%

税收影响：

j. marginal_tax_rate                     | 边际所得税率   | Marginal Tax Rate           | example: 24%
k. mortgage_interest_deduction           | 房贷利息抵税   | Mortgage Interest Deduction | example: true

出售时交易一次性成本：

l. selling_costs_percentage_sell         | 出售交易成本   | Selling Cost                 | example: 5% of property price
m. long_term_capital_gains_tax_rate      | 长期资本利得税  | Capital Gains Tax Rate on Property Sale | example: 15%
n. tax_free_capital_gain_amount          | 免税增值额度   | Tax-Free Capital Gain        | example: $500,000

#### Rent and Invest Parameters

租房基本数据：

o. current_monthly_rent_amount           | 当前月租金     | Current Monthly Rent        | example: $6,000
p. rent_growth_rate_annual               | 租金增长率     | Rent Growth                 | example: same as home appreciation

投资基本数据：

q. investment_options_list               | 投资标的选择   | Investment Options List     | example: SPY, QQQ, Google
r. investment_options_cagr_list          | 年均涨幅      | Investment Options CAGR     | example: 9.25%, 15.2%, 17.22%
s. long_term_capital_gains_tax_rate      | 资本利得税率   | Capital Gains on Investment | example: 24%

### Organized Inputs

#### Buy Parameters

Basic Options:

- a. property_price
- b. down_payment_percentage
- c. mortgage_interest_rate_annual
- d. mortgage_term_years
- i. home_appreciation_cagr


Advanced Options:

Holding Costs:

- e. closing_costs_percentage_buy
- f. property_tax_rate_annual
- g. insurance_and_maintenance_rate_annual
- h. hoa_fee_annual

Tax Impact:

- j. marginal_tax_rate
- k. mortgage_interest_deduction

Selling Costs:

- l. selling_costs_percentage_sell
- m. long_term_capital_gains_tax_rate
- n. tax_free_capital_gain_amount

#### Rent and Invest Parameters

Basic Options:

- o. current_monthly_rent_amount
- p. rent_growth_rate_annual
- q. investment_options_list
- r. investment_options_cagr_list
- s. long_term_capital_gains_tax_rate



### Calculation Logic
