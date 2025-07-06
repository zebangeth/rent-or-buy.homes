import { useState } from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useCalculations } from "../../hooks/useCalculations";

interface CashOutflowChartProps {
  className?: string;
}

export default function CashOutflowChart({ className = "" }: CashOutflowChartProps) {
  const { results } = useCalculations();
  const [viewMode, setViewMode] = useState<"annual" | "cumulative">("annual");

  // Prepare chart data
  const years = results.yearlyResults.map((r) => r.year);

  // Calculate annual cash outflows (always tax-adjusted)
  const buyAnnualData = results.yearlyResults.map((r) => r.buy.adjustedCashOutflow);
  const rentAnnualData = results.yearlyResults.map((r) => r.rent.cashOutflow);

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

  // Calculate investment differentials for annotation
  const investmentDifferentials = results.yearlyResults.map((r) => {
    const buyOutflow = r.buy.adjustedCashOutflow;
    const rentOutflow = r.rent.cashOutflow;
    return {
      year: r.year,
      difference: buyOutflow - rentOutflow,
      additionalInvestment: r.rent.additionalInvestmentThisYear,
      buyHasAdditionalInvestment: r.buy.additionalInvestmentPortfolio > 0,
    };
  });

  const chartData = viewMode === "annual" ? buyAnnualData : buyCumulativeData;
  const rentData = viewMode === "annual" ? rentAnnualData : rentCumulativeData;

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

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
      fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    colors: ["#8b5cf6", "#10b981"],
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
      colors: viewMode === "cumulative" ? ["#8b5cf6", "#10b981"] : undefined,
    },
    grid: {
      borderColor: "#e2e8f0",
      strokeDashArray: 5,
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
      fontSize: "14px",
      fontWeight: 500,
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
          fontSize: "14px",
          fontWeight: 600,
          color: "#64748b",
        },
      },
      labels: {
        style: {
          fontSize: "12px",
          colors: "#64748b",
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
          fontSize: "14px",
          fontWeight: 600,
          color: "#64748b",
        },
      },
      labels: {
        style: {
          fontSize: "12px",
          colors: "#64748b",
        },
        formatter: formatValue,
      },
    },
    tooltip: {
      theme: "light",
      shared: true,
      intersect: false,
      custom: function ({ series, dataPointIndex }) {
        const year = years[dataPointIndex];
        const buyValue = series[0][dataPointIndex];
        const rentValue = series[1][dataPointIndex];
        const differential = investmentDifferentials[dataPointIndex];

        // Sort by value (highest first)
        const sortedData = [
          { name: "Buy a Home", value: buyValue, color: "#8b5cf6" },
          { name: "Rent + Invest", value: rentValue, color: "#10b981" },
        ].sort((a, b) => b.value - a.value);

        let differentialText = "";
        if (viewMode === "annual") {
          if (differential.difference > 0) {
            differentialText = `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb; color: #059669; font-size: 12px;">
              💰 ${formatCurrency(differential.additionalInvestment)} can be invested
            </div>`;
          } else if (differential.difference < 0) {
            differentialText = `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb; color: #dc2626; font-size: 12px;">
              📈 Buy scenario gets ${formatCurrency(Math.abs(differential.difference))} extra investment
            </div>`;
          }
        }

        return `
          <div style="background: white; padding: 12px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
            <div style="font-weight: 600; margin-bottom: 8px; color: #374151;">Year ${year} ${
          viewMode === "cumulative" ? "(Total)" : ""
        }</div>
            ${sortedData
              .map(
                (item) => `
              <div style="display: flex; align-items: center; margin-bottom: 4px;">
                <div style="width: 12px; height: 12px; background-color: ${
                  item.color
                }; border-radius: 50%; margin-right: 8px;"></div>
                <div style="display: flex; justify-content: space-between; width: 100%; min-width: 140px;">
                  <span style="color: #6b7280; font-size: 13px;">${item.name}:</span>
                  <span style="color: #374151; font-weight: 500; font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; font-size: 13px;">${formatCurrency(
                    item.value
                  )}</span>
                </div>
              </div>
            `
              )
              .join("")}
            ${differentialText}
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
          },
        },
      },
    ],
  };

  const series = [
    {
      name: "Buy a Home",
      data: chartData,
    },
    {
      name: "Rent + Invest",
      data: rentData,
    },
  ];

  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-dark-800 mb-2">Cash Outflow Analysis</h3>
          <p className="text-sm text-dark-500">
            {viewMode === "annual"
              ? "Annual cash outflows and investment opportunities"
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
            ? "Tax-adjusted cash outflows include mortgage interest deduction savings. When one option costs more, the difference can be invested."
            : "Cumulative cash outflows show total money spent over time. This helps visualize the long-term cost difference between scenarios."}
        </p>
      </div>
    </div>
  );
}
