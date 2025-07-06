import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useCalculations } from "../../hooks/useCalculations";
import { useApp } from "../../contexts";
import { theme } from "../../lib/design-system";

interface NetWorthChartProps {
  className?: string;
}

export default function NetWorthChart({ className = "" }: NetWorthChartProps) {
  const { state, dispatch } = useApp();
  const { results } = useCalculations();
  const showCashOut = state.appSettings.showCashOut;

  // Prepare chart data
  const years = results.yearlyResults.map((r) => r.year);
  const buyData = results.yearlyResults.map((r) =>
    showCashOut ? r.buy.netAssetValueCashOut : r.buy.netAssetValueNotCashOut
  );
  const rentData = results.yearlyResults.map((r) =>
    showCashOut ? r.rent.netAssetValueCashOut : r.rent.netAssetValueNotCashOut
  );

  const chartOptions: ApexOptions = {
    chart: {
      type: "area",
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
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    stroke: {
      curve: "monotoneCubic",
      width: 3,
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
      markers: {
        size: 8,
        strokeWidth: 0,
        shape: "circle",
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
        text: "Net Worth",
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
        formatter: (value: number) => {
          if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(1)}M`;
          } else if (value >= 1000) {
            return `$${(value / 1000).toFixed(0)}K`;
          } else {
            return `$${value.toFixed(0)}`;
          }
        },
      },
    },
    tooltip: {
      theme: "light",
      shared: true,
      intersect: false,
      custom: function ({ series, dataPointIndex, w }) {
        const year = w.globals.categoryLabels[dataPointIndex];
        const buyValue = series[0][dataPointIndex];
        const rentValue = series[1][dataPointIndex];

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
              <span style="${theme.tooltipStyles.value}">${theme.formatters.currency(value)}</span>
            </div>
          </div>
        `;
        
        return `
          <div style="${theme.tooltipStyles.container}">
            <div style="${theme.tooltipStyles.title}">Year ${year}</div>
            ${sortedData.map(item => createTooltipItem(item.color, item.name, item.value)).join('')}
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
      data: buyData,
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
          <h3 className="text-xl font-semibold text-dark-800 mb-2">Net Worth Projection</h3>
          <p className="text-sm text-dark-500">Compare long-term financial outcomes over time</p>
        </div>

        <div className="flex items-center mt-4 sm:mt-0">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showCashOut}
              onChange={() => dispatch({ type: "TOGGLE_CASH_OUT_MODE" })}
              className="sr-only"
            />
            <div className="relative">
              <div className={`w-11 h-6 rounded-full transition-colors ${showCashOut ? "bg-gray-700" : "bg-gray-300"}`}>
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    showCashOut ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
            <span className="ml-3 text-sm font-medium text-dark-700">Cash Out</span>
          </label>
        </div>
      </div>

      <div className="h-96">
        <Chart options={chartOptions} series={series} type="area" height="100%" />
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-dark-600">
          <strong>Note:</strong>{" "}
          {showCashOut
            ? "Cash-out scenario includes taxes and transaction costs if you were to sell all assets today."
            : "Net worth scenario shows total asset value without considering selling costs or taxes."}
        </p>
      </div>
    </div>
  );
}
