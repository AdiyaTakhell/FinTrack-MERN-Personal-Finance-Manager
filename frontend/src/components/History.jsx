import React, { useContext, useMemo } from "react";
import { AppContext } from "../context/globalContext.jsx";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

const History = () => {
  // Get income and expense data from global context
  const { IncomeData = [], ExpenseData = [] } = useContext(AppContext);

  // Calculate total income
  const totalIncome = useMemo(
    () => IncomeData.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [IncomeData]
  );

  // Calculate total expense
  const totalExpense = useMemo(
    () => ExpenseData.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [ExpenseData]
  );

  // Helper: Convert amount into currency format
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Pie chart data (Income vs Expense)
  const data = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: ["#34D399", "#F87171"], // Green = Income, Red = Expense
        hoverOffset: 4,
      },
    ],
  };

  // Pie chart display options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },
  };

  return (
    <div className="flex flex-col h-full gap-4">

      {/* Section 1: Financial Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Financial Overview</h3>

        {/* Pie Chart */}
        <div className="h-48 w-full flex justify-center mb-4">
          <Pie data={data} options={options} />
        </div>

        {/* Income total */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-2">
          <span className="text-gray-500 text-sm">Total Income</span>
          <span className="font-bold text-green-500">
            {formatCurrency(totalIncome)}
          </span>
        </div>

        {/* Expense total */}
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">Total Expense</span>
          <span className="font-bold text-red-500">
            {formatCurrency(totalExpense)}
          </span>
        </div>
      </div>

      {/* Section 2: Recent Income List */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <h4 className="font-bold text-gray-700 mb-2 px-1">Recent Incomes</h4>

        <ul className="space-y-2 overflow-y-auto pr-1">
          {/* Show the 5 latest incomes */}
          {IncomeData.slice(0, 5).map((i) => (
            <li
              key={i._id}
              className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
            >
              <span className="text-sm font-medium text-gray-600 truncate w-24">
                {i.title}
              </span>
              <span className="font-bold text-sm text-green-500">
                +{formatCurrency(i.amount)}
              </span>
            </li>
          ))}

          {/* If no income exists */}
          {IncomeData.length === 0 && (
            <p className="text-xs text-gray-400 italic">No income records</p>
          )}
        </ul>
      </div>

      {/* Section 3: Recent Expense List */}
      <div className="flex-1 overflow-hidden flex flex-col pb-4">
        <h4 className="font-bold text-gray-700 mb-2 px-1">Recent Expenses</h4>

        <ul className="space-y-2 overflow-y-auto pr-1">
          {/* Show the 5 latest expenses */}
          {ExpenseData.slice(0, 5).map((e) => (
            <li
              key={e._id}
              className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
            >
              <span className="text-sm font-medium text-gray-600 truncate w-24">
                {e.title}
              </span>
              <span className="font-bold text-sm text-red-500">
                -{formatCurrency(e.amount)}
              </span>
            </li>
          ))}

          {/* If no expense exists */}
          {ExpenseData.length === 0 && (
            <p className="text-xs text-gray-400 italic">No expense records</p>
          )}
        </ul>
      </div>

    </div>
  );
};

export default History;
