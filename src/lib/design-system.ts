/**
 * Centralized Design System
 * Contains all colors, typography, spacing, and styling constants
 */

// =============================================================================
// COLOR PALETTE
// =============================================================================

export const colors = {
  // Scenario Colors
  buy: {
    primary: "#8b5cf6", // Purple - Buy scenario primary
    secondary: "#6366f1", // Indigo - Buy scenario investment
    tertiary: "#c4b5fd", // Purple-300 - Light purple for backgrounds
    light: "#c4b5fd", // Light purple for backgrounds
    dark: "#6d28d9", // Dark purple for accents
  },
  rent: {
    primary: "#10b981", // Emerald - Rent scenario primary
    secondary: "#059669", // Dark emerald - Rent scenario investment
    tertiary: "#86efac", // green-300 - Light green for backgrounds
    light: "#6ee7b7", // Light emerald for backgrounds
    dark: "#047857", // Dark emerald for accents
  },

  // Semantic Colors
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",

  // Neutral Colors
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },

  // Text Colors
  text: {
    primary: "#111827", // gray-900
    secondary: "#374151", // gray-700
    tertiary: "#6b7280", // gray-500
    muted: "#9ca3af", // gray-400
    inverse: "#ffffff",
  },

  // Background Colors
  background: {
    primary: "#ffffff",
    secondary: "#f9fafb", // gray-50
    tertiary: "#f3f4f6", // gray-100
    accent: "#f0f9ff", // blue-50 equivalent
  },

  // Border Colors
  border: {
    light: "#f3f4f6", // gray-100
    default: "#e5e7eb", // gray-200
    dark: "#d1d5db", // gray-300
  },
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
  fontFamily: {
    sans: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
  },

  fontSize: {
    xs: "12px",
    sm: "13px",
    base: "14px",
    lg: "16px",
    xl: "18px",
    "2xl": "20px",
    "3xl": "24px",
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
  },
} as const;

// =============================================================================
// SPACING & SIZING
// =============================================================================

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px",
  "3xl": "48px",
} as const;

export const borderRadius = {
  none: "0",
  sm: "4px",
  md: "6px",
  lg: "8px",
  xl: "12px",
  full: "9999px",
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
} as const;

// =============================================================================
// CHART-SPECIFIC STYLES
// =============================================================================

export const chartStyles = {
  colors: {
    // Chart data colors in order
    series: [colors.buy.primary, colors.buy.tertiary, colors.rent.primary, colors.rent.tertiary] as string[],

    // Alternative color schemes for different chart types
    netWorth: [colors.buy.primary, colors.rent.primary] as string[],
    cashFlow: [colors.buy.primary, colors.buy.tertiary, colors.rent.primary, colors.rent.tertiary] as string[],
  },

  grid: {
    borderColor: colors.border.default,
    strokeDashArray: 5,
  },

  axis: {
    titleColor: colors.text.tertiary,
    labelColor: colors.text.tertiary,
    fontSize: typography.fontSize.xs,
    titleFontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },

  legend: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    textColor: colors.text.secondary,
  },

  tooltip: {
    backgroundColor: colors.background.primary,
    textColor: colors.text.secondary,
    borderColor: colors.border.default,
    shadow: shadows.md,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.sans,
  },
} as const;

// =============================================================================
// COMPONENT STYLES
// =============================================================================

export const componentStyles = {
  card: {
    backgroundColor: colors.background.primary,
    borderColor: colors.border.light,
    borderRadius: borderRadius.lg,
    shadow: shadows.sm,
    padding: spacing.xl,
  },

  button: {
    primary: {
      backgroundColor: colors.buy.primary,
      hoverBackgroundColor: colors.buy.dark,
      textColor: colors.text.inverse,
      borderRadius: borderRadius.md,
      padding: `${spacing.sm} ${spacing.lg}`,
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
    },
    secondary: {
      backgroundColor: colors.background.tertiary,
      hoverBackgroundColor: colors.background.primary,
      textColor: colors.text.secondary,
      borderRadius: borderRadius.md,
      padding: `${spacing.sm} ${spacing.lg}`,
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
    },
  },

  toggle: {
    backgroundColor: colors.background.tertiary,
    activeBackgroundColor: colors.background.primary,
    textColor: colors.text.tertiary,
    activeTextColor: colors.text.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    shadow: shadows.sm,
  },

  input: {
    backgroundColor: colors.background.primary,
    borderColor: colors.border.default,
    focusBorderColor: colors.buy.primary,
    textColor: colors.text.primary,
    placeholderColor: colors.text.muted,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.base,
  },
} as const;

// =============================================================================
// TOOLTIP STYLES (FOR INLINE STYLES)
// =============================================================================

export const tooltipStyles = {
  container: `
    background: ${colors.background.primary};
    padding: ${spacing.md};
    border-radius: ${borderRadius.lg};
    box-shadow: ${shadows.md};
    font-family: ${typography.fontFamily.sans};
    border: 1px solid ${colors.border.light};
  `,

  title: `
    font-weight: ${typography.fontWeight.semibold};
    margin-bottom: ${spacing.sm};
    color: ${colors.text.secondary};
    font-size: ${typography.fontSize.base};
  `,

  item: `
    display: flex;
    align-items: center;
    margin-bottom: ${spacing.xs};
  `,

  itemText: `
    display: flex;
    justify-content: space-between;
    width: 100%;
    min-width: 140px;
  `,

  label: `
    color: ${colors.text.tertiary};
    font-size: ${typography.fontSize.sm};
  `,

  value: `
    color: ${colors.text.secondary};
    font-weight: ${typography.fontWeight.medium};
    font-family: ${typography.fontFamily.mono};
    font-size: ${typography.fontSize.sm};
  `,

  separator: `
    margin-top: ${spacing.sm};
    padding-top: ${spacing.sm};
    border-top: 1px solid ${colors.border.default};
    font-size: ${typography.fontSize.xs};
  `,

  colorDot: (color: string) => `
    width: 12px;
    height: 12px;
    background-color: ${color};
    border-radius: ${borderRadius.full};
    margin-right: ${spacing.sm};
  `,
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export const formatters = {
  currency: (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  },

  compactCurrency: (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  },

  percentage: (value: number): string => {
    return `${value.toFixed(1)}%`;
  },
} as const;

// =============================================================================
// THEME CONFIGURATION
// =============================================================================

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  chartStyles,
  componentStyles,
  tooltipStyles,
  formatters,
} as const;

export default theme;
