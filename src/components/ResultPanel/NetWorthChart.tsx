import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useTranslation } from "react-i18next";
import { useCalculations } from "../../hooks/useCalculations";
import { useApp } from "../../contexts";
import { theme } from "../../lib/design-system";

interface NetWorthChartProps {
  className?: string;
}

export default function NetWorthChart({ className = "" }: NetWorthChartProps) {
  const { t } = useTranslation();
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
        text: t('charts.netWorth.years'),
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
        text: t('charts.netWorth.netWorthLabel'),
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
        const year = w.globals.categoryLabels[dataPointIndex] || years[dataPointIndex];
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
            fontSize: "12px",
            fontWeight: "500",
            itemMargin: {
              horizontal: 8,
              vertical: 4,
            },
            markers: {
              size: 6,
              strokeWidth: 0,
              shape: "circle",
              offsetX: -2,
            },
          },
          xaxis: {
            categories: getFilteredYearLabels(years),
            title: {
              text: t('charts.netWorth.years'),
              style: {
                fontSize: "12px",
                fontWeight: 600,
                color: "#64748b",
              },
            },
            labels: {
              style: {
                fontSize: "11px",
                colors: "#64748b",
              },
              rotate: 0,
            },
          },
          yaxis: {
            title: {
              text: t('charts.netWorth.netWorthLabel'),
              style: {
                fontSize: "12px",
                fontWeight: 600,
                color: "#64748b",
              },
            },
            labels: {
              style: {
                fontSize: "10px",
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
              shape: "circle",
              offsetX: -2,
            },
          },
          xaxis: {
            categories: getFilteredYearLabels(years),
            title: {
              text: t('charts.netWorth.years'),
              style: {
                fontSize: "11px",
                fontWeight: 600,
                color: "#64748b",
              },
            },
            labels: {
              style: {
                fontSize: "10px",
                colors: "#64748b",
              },
              rotate: 0,
            },
          },
          yaxis: {
            title: {
              text: t('charts.netWorth.netWorthLabel'),
              style: {
                fontSize: "12px",
                fontWeight: 600,
                color: "#64748b",
              },
            },
            labels: {
              style: {
                fontSize: "10px",
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
        },
      },
    ],
  };

  const series = [
    {
      name: t('charts.netWorth.buySeriesName'),
      data: buyData,
    },
    {
      name: t('charts.netWorth.rentSeriesName'),
      data: rentData,
    },
  ];

  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-dark-800 mb-2">{t('charts.netWorth.title')}</h3>
          <p className="text-sm text-dark-500">{t('charts.netWorth.description')}</p>
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
            <span className="ml-3 text-sm font-medium text-dark-700">{t('charts.netWorth.cashOut')}</span>
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
