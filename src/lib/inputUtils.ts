import { useState } from 'react';

export type InputValidationConfig<T> = {
  [K in keyof T]?: {
    min?: number;
    max?: number;
    validator?: (value: number) => number;
  };
};

export const formatNumberWithCommas = (value: number): string => {
  return new Intl.NumberFormat("en-US").format(value);
};

export const parseFormattedNumber = (value: string): number => {
  return Number(value.replace(/,/g, ""));
};

export const formatCurrency = (value: number): string => {
  // For large numbers, use abbreviated formats (K, M, B)
  if (Math.abs(value) >= 1000000000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(value / 1000000000) + "B";
  } else if (Math.abs(value) >= 1000000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 1000000) + "M";
  } else if (Math.abs(value) >= 10000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value / 1000) + "K";
  } else {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
};

export const formatPercentage = (value: number): string => {
  return `${value}%`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("en-US").format(value);
};

export function useInputHandlers<T extends Record<string, unknown>>(
  currentValues: T,
  updateFunction: (field: string, value: unknown) => void,
  validationConfig?: InputValidationConfig<T>
) {
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const validateInput = <K extends keyof T>(field: K, value: number): number => {
    const config = validationConfig?.[field];
    if (config?.validator) {
      return config.validator(value);
    }
    if (config?.min !== undefined && config?.max !== undefined) {
      return Math.max(config.min, Math.min(config.max, value));
    }
    if (config?.min !== undefined) {
      return Math.max(config.min, value);
    }
    if (config?.max !== undefined) {
      return Math.min(config.max, value);
    }
    return value;
  };

  const handleInputChange = <K extends keyof T>(field: K, value: T[K]) => {
    updateFunction(String(field), value);
  };

  const handleNumberInputChange = <K extends keyof T>(
    field: K,
    value: string,
    parser: (val: string) => T[K]
  ) => {
    setInputValues((prev) => ({ ...prev, [field as string]: value }));

    if (value !== "" && !isNaN(Number(value))) {
      const numValue = parser(value);
      if (!isNaN(numValue as number)) {
        const validatedValue = validateInput(field, numValue as number);
        updateFunction(String(field), validatedValue as T[K]);
      }
    }
  };

  const handleNumberInputBlur = <K extends keyof T>(
    field: K,
    parser: (val: string) => T[K]
  ) => {
    const localValue = inputValues[field as string];
    if (localValue === "" || isNaN(Number(localValue))) {
      setInputValues((prev) => {
        const newState = { ...prev };
        delete newState[field as string];
        return newState;
      });
    } else {
      const numValue = parser(localValue);
      if (!isNaN(numValue as number)) {
        const validatedValue = validateInput(field, numValue as number);
        updateFunction(String(field), validatedValue as T[K]);
      }
      setInputValues((prev) => {
        const newState = { ...prev };
        delete newState[field as string];
        return newState;
      });
    }
  };

  const getDisplayValue = <K extends keyof T>(field: K): string | number => {
    const localValue = inputValues[field as string];
    const globalValue = currentValues[field];

    if (localValue !== undefined) {
      return localValue;
    }

    if (typeof globalValue === "boolean") {
      return String(globalValue);
    }

    return globalValue as string | number;
  };

  const formatDisplayValue = <K extends keyof T>(
    field: K,
    fieldsToFormat: (keyof T)[] = []
  ): string | number => {
    const value = getDisplayValue(field);
    if (typeof value === "string") {
      return value;
    }
    if (fieldsToFormat.includes(field) && typeof value === "number") {
      return formatNumberWithCommas(value);
    }
    return value;
  };

  return {
    inputValues,
    setInputValues,
    handleInputChange,
    handleNumberInputChange,
    handleNumberInputBlur,
    getDisplayValue,
    formatDisplayValue,
  };
}