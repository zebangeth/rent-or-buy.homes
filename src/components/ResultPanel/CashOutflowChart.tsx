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
      buyInvestmentRunningTotal += (rentOutflow - buyOutflow);
    } else if (buyOutflow > rentOutflow) {
      rentInvestmentRunningTotal += (buyOutflow - rentOutflow);
    }
    
    buyCumulativeOnlyData.push(buyOnlyRunningTotal);
    rentCumulativeOnlyData.push(rentOnlyRunningTotal);
    buyCumulativeInvestmentData.push(buyInvestmentRunningTotal);
    rentCumulativeInvestmentData.push(rentInvestmentRunningTotal);
  }
  
  // Note: Total cumulative data is now represented by stacking the separate series

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
        columnWidth: "60%",
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
            name: "Buy Only",
            data: buyCumulativeOnlyData,
            group: "buy",
          },
          {
            name: "Buy Investment",
            data: buyCumulativeInvestmentData,
            group: "buy",
          },
          {
            name: "Rent Only",
            data: rentCumulativeOnlyData,
            group: "rent",
          },
          {
            name: "Rent Investment",
            data: rentCumulativeInvestmentData,
            group: "rent",
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
              : "Cumulative cash outflows and investments over time"}
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
        <Chart options={chartOptions} series={series} type="bar" height="100%" />
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-dark-600">
          <strong>Note:</strong>{" "}
          {viewMode === "annual"
            ? "Tax-adjusted cash outflows with stacked visualization. When one scenario costs more, the difference is invested in that scenario, creating equal total heights."
            : "Cumulative view shows total money spent and investments accumulated over time. The stacked bars display both base outflows and additional investments, helping visualize long-term financial implications."}
        </p>
      </div>
    </div>
  );
}
