**rent-or-buy.homes 产品需求文档（PRD）**

---

## 一、产品背景与目标

本工具旨在帮助用户基于当前市场数据和历史增长率，直观地比较（贷款）买房和租房 + 投资股票两种策略在未来对个人财务状况的影响。通过用户自定义输入及内置的默认数据进行模拟计算，提供数据化、图表化的输出结果，辅助用户做出更加理性的资产配置决策。

---

## 二、核心功能模块

### 1. Hero Section

- 计算结果
- 数据来源和计算依据（简要）
- CTA 按钮：Edit Inputs, Share Results

### 2. Input Section

#### Buy Parameters

买房基本数据：

- 房屋购买价格（默认 $2,000,000）| Current Home Price
- 首付比例（默认 25%）| Down Payment
- 贷款利率（默认 6.75%）| Mortgage Interest Rate
- 贷款期限（默认 30 年）| Mortgage Term

买入时交易一次性成本：

- Closing cost（默认贷款金额的 1%）| Closing Cost

持有成本：

- 房产税率（默认 1.2%/年）| Property Tax Rate
- 房屋保险与维修（默认 0.8%房价/年）| Insurance + Maintenance
- HOA 费用（默认 0）| HOA Fee

增值假设：

- 房价年增长率（默认可根据区域设置）| Home Appreciation (CAGR)

税收影响：

- 边际所得税率（默认 24%）| Marginal Tax Rate
- 房贷利息抵税（默认开启）| Mortgage Interest Deduction

出售时交易一次性成本：

- Selling cost（默认房屋售价的 5%）| Selling Cost
- Capital Gains Tax Rate on Property Sale
- 免税增值额度（默认 $250,000）| Tax-Free Capital Gain

#### Rent and Invest Parameters

租房基本数据：

- 当前月租金（默认 $6,000）| Current Monthly Rent
- 年租金增长率（默认与房价增长率相同）| Rent Growth

投资基本数据：

- 投资标的选择（SPY / QQQ / Google）与年均涨幅（根据历史自动填入：SPY 9.25%, QQQ 15.2%, Google 17.22%）
- 资本利得税率（默认 24%）
- 标准抵扣额 / SALT 限额（内置）

---

### 3. 输出页（计算结果展示）

#### 核心结果

- 两种方案的“X 年后净资产”对比
- 净资产差额高亮

#### 图表展示

- 净资产增长曲线图（可切换查看“买房方案” vs “租房+投资方案”）
- 现金流比较图（每月或每年）

#### 假设参数摘要

- 所有输入的参数回顾
- CAGR/CMGR 显示

---

## 三、设计需求

- 风格偏向简洁财经类风格，数据为主
- 移动端兼容性优先
- 图表组件可交互（如 hover 查看具体数值）
- 输入项需支持提示信息与默认值
- 进阶设置默认折叠，降低干扰

---

## 四、数据与模型

- 房产增长率来自湾区不同 zip code 的实际成交数据（2015–2024）
- 股票增长率参考 SPY/QQQ/GOOG 实际市场表现（2015–2024）
- 模拟使用复利计算方式
- 税务模型简化为平均值模拟（见第四张图税务假设）

---

## 五、后续扩展方向（非 MVP 范围）

- 用户登录与保存个人设置
- 报告导出 PDF/PNG
- 加入通胀率调整
- 自动根据用户输入的邮编/州/城市/县等，匹配当地房价/房租/利率/增长率等数据

---

## 六、交互流程示意

1. 用户进入首页，显示 intro/onboarding 流程
2. 填写基本参数（默认值已填）
3. 点击[生成结果]按钮
4. 展示图表与对比数据
5. 用户可修改参数实时刷新结果

---

## 七、非功能性需求

- 支持桌面与移动浏览器
- 使用现代前端框架与技术栈：React/Next.js/Tailwind CSS
- Single Page Application

## Role

You are a **senior front-end developer**.

## Design Style

- A **perfect balance** between **elegant minimalism** and **functional design**.
- **Soft, refreshing gradient colors** that seamlessly integrate with the brand palette.
- **Well-proportioned white space** for a clean layout.
- **Light and immersive** user experience.
- **Clear information hierarchy** using **subtle shadows and modular card layouts**.
- **Natural focus** on core functionalities.
- **Refined rounded corners**.
- **Delicate micro-interactions**.
- **Comfortable visual proportions**.
- **Accent colors** chosen based on the app type.

## Technical Specifications

1. **Each page should be regular desktop size**, with outlines to **simulate a desktop browser frame**.
2. **Icons**: Use an **online vector icon library** (icons **must not** have background blocks, baseplates).
3. **Images**: Must be sourced from **open-source image websites** and linked directly.
4. **Styles**: Use **Tailwind CSS** for styling.
5. **Responsive**: The design should be fully responsive, with a focus on desktop devices.

## Task

This an app to help users compare the potential impact of "buying a home (with a mortgage)" vs "renting and investing" on their net worth over the next 10 years, using current market data and historical growth rates. By letting users customize inputs and using built-in historical data for simulations, it provides visualized and data-driven results to help users make more informed asset allocation decisions.

Users can input a list of parameters to simulate the cost of buying a house and renting a house.

Key parameters:

- Price of the house
- Down payment
- Interest rate
- Property tax
- Closing cost
- Selling cost
- Property insurance and maintenance cost
- Rent
- Rent increase
- Stock selection
- Stock growth
- Tax rate
- Mortgage interest deduction

- Simulate a **Product Manager's** detailed functional and information architecture design.
- Follow the **design style** and **technical specifications** to generate a complete **UI design plan**.
- Create a **UI.html** file that contains the main page of the app.
