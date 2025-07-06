import { useState } from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useCalculations } from "../../hooks/useCalculations";
import { theme } from "../../lib/design-system";

interface CashOutflowChartProps {
  className?: string;
}

export default function CashOutflowChart({ className = "" }: CashOutflowChartProps) {
  const { results } = useCalculations();
  const [viewMode, setViewMode] = useState<"annual" | "cumulative">("annual");

  // Prepare chart data
  const years = results.yearlyResults.map((r) => r.year);

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

  // Calculate cumulative cash outflows
  const buyCumulativeData: number[] = [];
  const rentCumulativeData: number[] = [];
  let buyRunningTotal = 0;
  let rentRunningTotal = 0;

  for (const result of results.yearlyResults) {
    buyRunningTotal += result.buy.adjustedCashOutflow;
    rentRunningTotal += result.rent.cashOutflow;
    buyCumulativeData.push(buyRunningTotal);
    rentCumulativeData.push(rentRunningTotal);
  }

  // // Calculate investment differentials for annotation
  // const investmentDifferentials = results.yearlyResults.map((r) => {
  //   const buyOutflow = r.buy.adjustedCashOutflow;
  //   const rentOutflow = r.rent.cashOutflow;
  //   return {
  //     year: r.year,
  //     difference: buyOutflow - rentOutflow,
  //     additionalInvestment: r.rent.additionalInvestmentThisYear,
  //     buyHasAdditionalInvestment: r.buy.additionalInvestmentPortfolio > 0,
  //   };
  // });

  const { formatters } = theme;
  const formatValue = formatters.compactCurrency;
  const formatCurrency = formatters.currency;

  const chartOptions: ApexOptions = {
    chart: {
      type: viewMode === "annual" ? "bar" : "line",
      height: 400,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      background: "transparent",
      fontFamily: theme.typography.fontFamily.sans,
      stacked: viewMode === "annual",
    },
    colors: viewMode === "annual" ? theme.chartStyles.colors.cashFlow : theme.chartStyles.colors.netWorth,
    plotOptions:
      viewMode === "annual"
        ? {
            bar: {
              horizontal: false,
              columnWidth: "60%",
              dataLabels: {
                position: "top",
              },
            },
          }
        : {},
    fill:
      viewMode === "annual"
        ? {
            opacity: 0.8,
          }
        : {
            opacity: 1,
          },
    stroke: {
      curve: viewMode === "annual" ? "straight" : "monotoneCubic",
      width: viewMode === "annual" ? 0 : 3,
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
        horizontal: 10,
        vertical: 0,
      },
      markers:
        viewMode === "cumulative"
          ? {
              size: 8,
              strokeWidth: 0,
              shape: "circle",
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
        text: "Years",
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
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: viewMode === "annual" ? "Annual Cash Outflow" : "Cumulative Cash Outflow",
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
        const year = w.globals.categoryLabels[dataPointIndex];

        if (viewMode === "annual") {
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
          
          return `
            <div style="${theme.tooltipStyles.container}">
              <div style="${theme.tooltipStyles.title}">Year ${year}</div>
              
              ${createTooltipItem(theme.colors.buy.primary, 'Buy Only', buyOnlyValue)}
              ${buyInvestmentValue > 0 ? createTooltipItem(theme.colors.buy.secondary, 'Buy Investment', buyInvestmentValue) : ''}
              ${createTooltipItem(theme.colors.rent.primary, 'Rent Only', rentOnlyValue)}
              ${rentInvestmentValue > 0 ? createTooltipItem(theme.colors.rent.secondary, 'Rent Investment', rentInvestmentValue) : ''}
              
              <div style="${theme.tooltipStyles.separator}">
                <div style="color: ${theme.colors.buy.primary}; margin-bottom: 2px;">💰 Total Buy: ${formatCurrency(totalBuyValue)}</div>
                <div style="color: ${theme.colors.rent.primary};">💰 Total Rent: ${formatCurrency(totalRentValue)}</div>
              </div>
            </div>
          `;
        } else {
          // Cumulative view - original tooltip
          const buyValue = series[0][dataPointIndex];
          const rentValue = series[1][dataPointIndex];

          // Sort by value (highest first)

          // Sort by value (highest first)
          const sortedData = [
            { name: "Buy a Home", value: buyValue, color: theme.colors.buy.primary },
            { name: "Rent + Invest", value: rentValue, color: theme.colors.rent.primary },
          ].sort((a, b) => b.value - a.value);

          const createTooltipItem = (color: string, label: string, value: number) => `
            <div style="${theme.tooltipStyles.item}">
              <div style="${theme.tooltipStyles.colorDot(color)}"></div>
              <div style="${theme.tooltipStyles.itemText}">
                <span style="${theme.tooltipStyles.label}">${label}:</span>
                <span style="${theme.tooltipStyles.value}">${formatCurrency(value)}</span>
              </div>
            </div>
          `;

          return `
            <div style="${theme.tooltipStyles.container}">
              <div style="${theme.tooltipStyles.title}">Year ${year} (Total)</div>
              ${sortedData.map(item => createTooltipItem(item.color, item.name, item.value)).join('')}
            </div>
          `;
        }
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center",
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
            name: "Buy Only",
            data: buyOnlyData,
            group: "buy",
          },
          {
            name: "Buy Investment",
            data: buyInvestmentData,
            group: "buy",
          },
          {
            name: "Rent Only",
            data: rentOnlyData,
            group: "rent",
          },
          {
            name: "Rent Investment",
            data: rentInvestmentData,
            group: "rent",
          },
        ]
      : [
          {
            name: "Buy a Home",
            data: buyCumulativeData,
          },
          {
            name: "Rent + Invest",
            data: rentCumulativeData,
          },
        ];

  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-dark-800 mb-2">Cash Outflow Analysis</h3>
          <p className="text-sm text-dark-500">
            {viewMode === "annual"
              ? "Annual cash outflows with investment opportunities visualized"
              : "Cumulative cash outflows over time"}
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
              Annual
            </button>
            <button
              onClick={() => setViewMode("cumulative")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === "cumulative" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Cumulative
            </button>
          </div>
        </div>
      </div>

      <div className="h-96" key={viewMode}>
        <Chart options={chartOptions} series={series} type={viewMode === "annual" ? "bar" : "line"} height="100%" />
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-dark-600">
          <strong>Note:</strong>{" "}
          {viewMode === "annual"
            ? "Tax-adjusted cash outflows with stacked visualization. When one scenario costs more, the difference is invested in that scenario, creating equal total heights."
            : "Cumulative cash outflows show total money spent over time. This helps visualize the long-term cost difference between scenarios."}
        </p>
      </div>
    </div>
  );
}
