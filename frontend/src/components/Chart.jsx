import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register chart components (required by Chart.js)
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Chart = ({ IncomeData = [], ExpenseData = [] }) => {

  // Helper: Formats a number as USD currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Prepare the chart data using useMemo for performance
  const chartData = useMemo(() => {
    const dataMap = {};

    // Helper: Creates sortable key (YYYY-MM)
    const getSortableKey = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      return `${year}-${month}`;
    };

    // Process Income items and accumulate by month
    IncomeData.forEach((item) => {
      const key = getSortableKey(item.date);
      if (!dataMap[key]) dataMap[key] = { income: 0, expense: 0 };
      dataMap[key].income += Number(item.amount) || 0;
    });

    // Process Expense items and accumulate by month
    ExpenseData.forEach((item) => {
      const key = getSortableKey(item.date);
      if (!dataMap[key]) dataMap[key] = { income: 0, expense: 0 };
      dataMap[key].expense += Number(item.amount) || 0;
    });

    // Sort keys to show data in chronological order
    const sortedKeys = Object.keys(dataMap).sort();

    // Generate readable labels like "Jan 2023"
    const labels = sortedKeys.map((key) => {
      const [year, month] = key.split("-");
      const date = new Date(year, month - 1);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
    });

    // Extract the amounts in sorted order
    const incomeAmounts = sortedKeys.map((key) => dataMap[key].income);
    const expenseAmounts = sortedKeys.map((key) => dataMap[key].expense);

    // Final chart structure
    return {
      labels,
      datasets: [
        {
          label: "Income",
          data: incomeAmounts,
          borderColor: "#16a34a",
          backgroundColor: "rgba(22, 163, 74, 0.1)",
          fill: true,
          tension: 0.4, // Smooth curve
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "Expense",
          data: expenseAmounts,
          borderColor: "#dc2626",
          backgroundColor: "rgba(220, 38, 38, 0.1)",
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [IncomeData, ExpenseData]);

  // Chart.js display and formatting options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          boxWidth: 8,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1f2937",
        bodyColor: "#1f2937",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          // Customize tooltip currency formatting
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) label += ": ";
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280", font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        grid: {
          borderDash: [4, 4],
          color: "#f3f4f6",
        },
        ticks: {
          color: "#6b7280",
          font: { size: 11 },
          callback: function (value) {
            return formatCurrency(value);
          },
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  // If no data is available, show a simple friendly message
  if (IncomeData.length === 0 && ExpenseData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <p className="text-sm font-medium">No data available yet.</p>
        <p className="text-xs mt-1">Add transactions to see the chart.</p>
      </div>
    );
  }

  // Render Chart
  return <Line data={chartData} options={options} />;
};

export default Chart;
