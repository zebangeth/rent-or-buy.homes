# Design System Style Guide

## Overview

This project uses a centralized design system located in `/src/lib/design-system.ts`. All components should use these predefined styles instead of hardcoded values.

## Usage

```typescript
import { theme } from "../lib/design-system";

// Use colors
const buyColor = theme.colors.buy.primary;
const textColor = theme.colors.text.secondary;

// Use typography
const fontFamily = theme.typography.fontFamily.sans;
const fontSize = theme.typography.fontSize.base;

// Use formatters
const formattedPrice = theme.formatters.currency(1250000);
const compactPrice = theme.formatters.compactCurrency(1250000);
```

## Color Palette

### Scenario Colors
- **Buy Scenario**: `theme.colors.buy.primary` (#8b5cf6 - Purple)
- **Buy Investment**: `theme.colors.buy.secondary` (#6366f1 - Indigo)
- **Rent Scenario**: `theme.colors.rent.primary` (#10b981 - Emerald)
- **Rent Investment**: `theme.colors.rent.secondary` (#059669 - Dark Emerald)

### Text Colors
- **Primary Text**: `theme.colors.text.primary` (#111827)
- **Secondary Text**: `theme.colors.text.secondary` (#374151)
- **Tertiary Text**: `theme.colors.text.tertiary` (#6b7280)
- **Muted Text**: `theme.colors.text.muted` (#9ca3af)

### Background Colors
- **Primary Background**: `theme.colors.background.primary` (#ffffff)
- **Secondary Background**: `theme.colors.background.secondary` (#f9fafb)
- **Tertiary Background**: `theme.colors.background.tertiary` (#f3f4f6)

## Typography

### Font Families
- **Sans Serif**: `theme.typography.fontFamily.sans`
- **Monospace**: `theme.typography.fontFamily.mono` (for currency values)

### Font Sizes
- **Extra Small**: `theme.typography.fontSize.xs` (12px)
- **Small**: `theme.typography.fontSize.sm` (13px)
- **Base**: `theme.typography.fontSize.base` (14px)
- **Large**: `theme.typography.fontSize.lg` (16px)
- **Extra Large**: `theme.typography.fontSize.xl` (18px)

## Chart Styles

### Colors
```typescript
// For net worth charts (2 series)
colors: theme.chartStyles.colors.netWorth

// For cash flow charts (4 series)
colors: theme.chartStyles.colors.cashFlow
```

### Axis Styling
```typescript
xaxis: {
  title: {
    style: {
      fontSize: theme.chartStyles.axis.titleFontSize,
      fontWeight: theme.chartStyles.axis.fontWeight,
      color: theme.chartStyles.axis.titleColor,
    },
  },
  labels: {
    style: {
      fontSize: theme.chartStyles.axis.fontSize,
      colors: theme.chartStyles.axis.labelColor,
    },
  },
}
```

### Grid Styling
```typescript
grid: {
  borderColor: theme.chartStyles.grid.borderColor,
  strokeDashArray: theme.chartStyles.grid.strokeDashArray,
}
```

## Tooltips

### Inline Styles (for ApexCharts)
```typescript
// Container
const container = `<div style="${theme.tooltipStyles.container}">`;

// Title
const title = `<div style="${theme.tooltipStyles.title}">Year ${year}</div>`;

// Item with color dot
const createTooltipItem = (color: string, label: string, value: number) => `
  <div style="${theme.tooltipStyles.item}">
    <div style="${theme.tooltipStyles.colorDot(color)}"></div>
    <div style="${theme.tooltipStyles.itemText}">
      <span style="${theme.tooltipStyles.label}">${label}:</span>
      <span style="${theme.tooltipStyles.value}">${theme.formatters.currency(value)}</span>
    </div>
  </div>
`;
```

## Component Styles

### Cards
```typescript
// Use predefined card styles
className="card p-6" // Uses theme.componentStyles.card

// Or access individual properties
backgroundColor: theme.componentStyles.card.backgroundColor
```

### Buttons
```typescript
// Primary button styles
style={{
  backgroundColor: theme.componentStyles.button.primary.backgroundColor,
  color: theme.componentStyles.button.primary.textColor,
  // ... other styles
}}
```

## Formatters

### Currency
```typescript
// Full currency format: $1,250,000
const fullAmount = theme.formatters.currency(1250000);

// Compact format: $1.3M
const compactAmount = theme.formatters.compactCurrency(1250000);

// Percentage: 7.5%
const percentage = theme.formatters.percentage(7.5);
```

## Best Practices

1. **Always import the theme**: `import { theme } from "../../lib/design-system";`
2. **Use semantic color names**: Prefer `theme.colors.buy.primary` over hardcoded hex values
3. **Use consistent typography**: Apply font families and sizes from the theme
4. **Leverage formatters**: Use `theme.formatters.currency()` for all monetary values
5. **Reuse chart configurations**: Use predefined chart color arrays and styles
6. **Keep tooltips consistent**: Use the tooltip style functions for uniform appearance

## Migration Guide

When updating existing components:

1. Replace hardcoded colors with theme colors
2. Replace hardcoded font families with theme typography
3. Replace inline currency formatting with theme formatters
4. Update chart configurations to use theme styles
5. Standardize tooltip styling using theme functions

## Examples

### Before (Hardcoded)
```typescript
colors: ["#8b5cf6", "#10b981"]
fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
fontSize: "14px"
const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
```

### After (Theme-based)
```typescript
colors: theme.chartStyles.colors.netWorth
fontFamily: theme.typography.fontFamily.sans
fontSize: theme.typography.fontSize.base
const formatted = theme.formatters.currency(value);
```

This approach ensures consistency, maintainability, and makes it easy to update the entire design system from a single location.