import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useCalculations } from "../../hooks/useCalculations";
import { useApp } from "../../contexts";

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
      markers: {
        size: 12,
        strokeWidth: 0,
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
          { name: "Buy a Home", value: buyValue, color: "#8b5cf6" },
          { name: "Rent + Invest", value: rentValue, color: "#10b981" },
        ].sort((a, b) => b.value - a.value);

        const formatValue = (value: number) => {
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value);
        };

        return `
          <div style="background: white; padding: 12px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
            <div style="font-weight: 600; margin-bottom: 8px; color: #374151;">Year ${year}</div>
            ${sortedData
              .map(
                (item) => `
              <div style="display: flex; align-items: center; margin-bottom: 4px;">
                <div style="width: 12px; height: 12px; background-color: ${
                  item.color
                }; border-radius: 50%; margin-right: 8px;"></div>
                <div style="display: flex; justify-content: space-between; width: 100%; min-width: 140px;">
                  <span style="color: #6b7280; font-size: 13px;">${item.name}:</span>
                  <span style="color: #374151; font-weight: 500; font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; font-size: 13px;">${formatValue(
                    item.value
                  )}</span>
                </div>
              </div>
            `
              )
              .join("")}
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
