import { useState } from "react";
import { useTranslation } from "react-i18next";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useCalculations } from "../../hooks/useCalculations";
import { theme } from "../../lib/design-system";

interface CashOutflowChartProps {
  className?: string;
}

export default function CashOutflowChart({ className = "" }: CashOutflowChartProps) {
  const { t } = useTranslation();
  const { results } = useCalculations();
  const [viewMode, setViewMode] = useState<"annual" | "cumulative">("annual");

  // Prepare chart data
  const years = results.yearlyResults.map((r) => r.year);

  // Helper function to generate filtered year labels for mobile
  const getFilteredYearLabels = (years: number[]): (string | number)[] => {
    const totalYears = years.length;

    if (totalYears <= 15) {
      return years;
    }

    const filteredLabels: (string | number)[] = new Array(totalYears).fill("");

    if (totalYears <= 20) {
      // Show every 2 years not starting with 1: 2, 4, 6, 8, 10, 12, 14, 16, 18, 20
      for (let i = 1; i < totalYears; i += 2) {
        filteredLabels[i] = years[i];
      }
    } else {
      // Show every 5 years starting with 1: 1, 5, 10, 15, 20, 25, 30...
      filteredLabels[0] = years[0]; // Always show year 1
      for (let i = 4; i < totalYears; i += 5) {
        filteredLabels[i] = years[i];
      }
    }

    return filteredLabels;
  };

  // Calculate annual cash outflows (always tax-adjusted)
  const buyOnlyData = results.yearlyResults.map((r) => r.buy.adjustedCashOutflow);
  const rentOnlyData = results.yearlyResults.map((r) => r.rent.cashOutflow);

  // Calculate investment for each scenario based on which costs more
  const rentInvestmentData = results.yearlyResults.map((r) => {
    const buyOutflow = r.buy.adjustedCashOutflow;
    const rentOutflow = r.rent.cashOutflow;
    return buyOutflow > rentOutflow ? buyOutflow - rentOutflow : 0;
  });

  const buyInvestmentData = results.yearlyResults.map((r) => {
    const buyOutflow = r.buy.adjustedCashOutflow;
    const rentOutflow = r.rent.cashOutflow;
    return rentOutflow > buyOutflow ? rentOutflow - buyOutflow : 0;
  });

  // Calculate cumulative cash outflows with investment breakdown
  const buyCumulativeOnlyData: number[] = [];
  const rentCumulativeOnlyData: number[] = [];
  const buyCumulativeInvestmentData: number[] = [];
  const rentCumulativeInvestmentData: number[] = [];

  let buyOnlyRunningTotal = 0;
  let rentOnlyRunningTotal = 0;
  let buyInvestmentRunningTotal = 0;
  let rentInvestmentRunningTotal = 0;

  for (const result of results.yearlyResults) {
    const buyOutflow = result.buy.adjustedCashOutflow;
    const rentOutflow = result.rent.cashOutflow;

    // Accumulate base outflows
    buyOnlyRunningTotal += buyOutflow;
    rentOnlyRunningTotal += rentOutflow;

    // Accumulate investments (when one scenario costs more)
    if (rentOutflow > buyOutflow) {
      buyInvestmentRunningTotal += rentOutflow - buyOutflow;
    } else if (buyOutflow > rentOutflow) {
      rentInvestmentRunningTotal += buyOutflow - rentOutflow;
    }

    buyCumulativeOnlyData.push(buyOnlyRunningTotal);
    rentCumulativeOnlyData.push(rentOnlyRunningTotal);
    buyCumulativeInvestmentData.push(buyInvestmentRunningTotal);
    rentCumulativeInvestmentData.push(rentInvestmentRunningTotal);
  }

  const { formatters } = theme;
  const formatValue = formatters.compactCurrency;
  const formatCurrency = formatters.currency;

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 400,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      background: "transparent",
      fontFamily: theme.typography.fontFamily.sans,
      stacked: true,
    },
    colors: theme.chartStyles.colors.cashFlow,
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "65%",
        dataLabels: {
          position: "top",
        },
      },
    },
    fill: {
      opacity: 0.8,
    },
    stroke: {
      width: 0,
    },
    grid: {
      borderColor: theme.chartStyles.grid.borderColor,
      strokeDashArray: theme.chartStyles.grid.strokeDashArray,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      fontSize: theme.chartStyles.legend.fontSize,
      fontWeight: theme.chartStyles.legend.fontWeight,
      itemMargin: {
        horizontal: 15,
        vertical: 0,
      },
      markers:
        viewMode === "cumulative"
          ? {
              size: 8,
              strokeWidth: 0,
              shape: "square",
              offsetX: -4,
            }
          : {
              size: 8,
              strokeWidth: 0,
              offsetX: -4,
            },
    },
    xaxis: {
      categories: years,
      title: {
        text: t('charts.cashFlow.years'),
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
        rotate: 0,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: viewMode === "annual" ? t('charts.cashFlow.annualOutflow') : t('charts.cashFlow.cumulativeOutflow'),
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
        formatter: formatValue,
      },
    },
    tooltip: {
      theme: "light",
      shared: true,
      intersect: false,
      custom: function ({ series, dataPointIndex, w }) {
        const year = w.globals.categoryLabels[dataPointIndex] || years[dataPointIndex];

        // Both annual and cumulative now use the same 4-series structure
        const buyOnlyValue = series[0][dataPointIndex];
        const buyInvestmentValue = series[1][dataPointIndex];
        const rentOnlyValue = series[2][dataPointIndex];
        const rentInvestmentValue = series[3][dataPointIndex];

        const totalBuyValue = buyOnlyValue + buyInvestmentValue;
        const totalRentValue = rentOnlyValue + rentInvestmentValue;

        const createTooltipItem = (color: string, label: string, value: number) => `
          <div style="${theme.tooltipStyles.item}">
            <div style="${theme.tooltipStyles.colorDot(color)}"></div>
            <div style="${theme.tooltipStyles.itemText}">
              <span style="${theme.tooltipStyles.label}">${label}:</span>
              <span style="${theme.tooltipStyles.value}">${formatCurrency(value)}</span>
            </div>
          </div>
        `;

        const modeLabel = viewMode === "annual" ? "" : " (Cumulative)";

        return `
          <div style="${theme.tooltipStyles.container}">
            <div style="${theme.tooltipStyles.title}">Year ${year}${modeLabel}</div>
              
              ${createTooltipItem(theme.colors.buy.primary, t('charts.cashFlow.series.homeCosts'), buyOnlyValue)}
              ${
                buyInvestmentValue > 0
                  ? createTooltipItem(theme.colors.buy.tertiary, t('charts.cashFlow.series.investmentBuy'), buyInvestmentValue)
                  : ""
              }
              ${createTooltipItem(theme.colors.rent.primary, t('charts.cashFlow.series.rentCosts'), rentOnlyValue)}
              ${
                rentInvestmentValue > 0
                  ? createTooltipItem(theme.colors.rent.tertiary, t('charts.cashFlow.series.investmentRent'), rentInvestmentValue)
                  : ""
              }
              
              <div style="${theme.tooltipStyles.separator}">
                <div style="color: ${
                  theme.colors.buy.primary
                }; margin-bottom: 2px;">🏠 Total Buy Scenario: ${formatCurrency(totalBuyValue)}</div>
                <div style="color: ${theme.colors.rent.primary};">🏠 Total Rent Scenario: ${formatCurrency(
          totalRentValue
        )}</div>
              </div>
            </div>
          </div>
        `;
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 380,
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center",
            fontSize: "12px",
            fontWeight: "500",
            itemMargin: {
              horizontal: 8,
              vertical: 4,
            },
            markers: {
              size: 6,
              strokeWidth: 0,
              shape: "square",
              offsetX: -2,
            },
          },
          plotOptions: {
            bar: {
              columnWidth: "70%",
            },
          },
          xaxis: {
            categories: getFilteredYearLabels(years),
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 380,
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center",
            fontSize: "12px",
            fontWeight: "500",
            itemMargin: {
              horizontal: 6,
              vertical: 6,
            },
            markers: {
              size: 5,
              strokeWidth: 0,
              shape: "square",
              offsetX: -2,
            },
          },
          plotOptions: {
            bar: {
              columnWidth: "75%",
            },
          },
          yaxis: {
            title: {
              text: viewMode === "annual" ? t('charts.cashFlow.annualOutflow') : t('charts.cashFlow.cumulativeOutflow'),
              style: {
                fontSize: "12px",
                fontWeight: theme.chartStyles.axis.fontWeight,
                color: theme.chartStyles.axis.titleColor,
              },
            },
            labels: {
              style: {
                fontSize: "10px",
                colors: theme.chartStyles.axis.labelColor,
              },
              formatter: formatValue,
            },
          },
          xaxis: {
            categories: getFilteredYearLabels(years),
            title: {
              text: t('charts.cashFlow.years'),
              style: {
                fontSize: "11px",
                fontWeight: theme.chartStyles.axis.fontWeight,
                color: theme.chartStyles.axis.titleColor,
              },
            },
            labels: {
              style: {
                fontSize: "10px",
                colors: theme.chartStyles.axis.labelColor,
              },
              rotate: 0,
            },
          },
        },
      },
    ],
  };

  // Different series structure for annual vs cumulative
  const series =
    viewMode === "annual"
      ? [
          {
            name: t('charts.cashFlow.series.homeCosts'),
            data: buyOnlyData,
            group: "buy",
          },
          {
            name: t('charts.cashFlow.series.investmentBuy'),
            data: buyInvestmentData,
            group: "buy",
          },
          {
            name: t('charts.cashFlow.series.rentCosts'),
            data: rentOnlyData,
            group: "rent",
          },
          {
            name: t('charts.cashFlow.series.investmentRent'),
            data: rentInvestmentData,
            group: "rent",
          },
        ]
      : [
          {
            name: t('charts.cashFlow.series.homeCosts'),
            data: buyCumulativeOnlyData,
            group: "buy",
          },
          {
            name: t('charts.cashFlow.series.investmentBuy'),
            data: buyCumulativeInvestmentData,
            group: "buy",
          },
          {
            name: t('charts.cashFlow.series.rentCosts'),
            data: rentCumulativeOnlyData,
            group: "rent",
          },
          {
            name: t('charts.cashFlow.series.investmentRent'),
            data: rentCumulativeInvestmentData,
            group: "rent",
          },
        ];

  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-dark-800 mb-2">{t('charts.cashFlow.title')}</h3>
          <p className="text-sm text-dark-500">
            {viewMode === "annual"
              ? t('charts.cashFlow.annualDescription')
              : t('charts.cashFlow.cumulativeDescription')}
          </p>
        </div>

        <div className="flex items-center mt-4 sm:mt-0">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("annual")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === "annual" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
{t('charts.cashFlow.viewModes.annual')}
            </button>
            <button
              onClick={() => setViewMode("cumulative")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === "cumulative" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
{t('charts.cashFlow.viewModes.cumulative')}
            </button>
          </div>
        </div>
      </div>

      <div className="h-96" key={viewMode}>
        <Chart options={chartOptions} series={series} type="bar" height="100%" />
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-dark-600">
          <strong>{t('charts.cashFlow.explanationTitle')}</strong>{" "}
          {viewMode === "annual"
            ? t('charts.cashFlow.annualExplanation')
            : t('charts.cashFlow.cumulativeExplanation')}
        </p>
      </div>
    </div>
  );
}
