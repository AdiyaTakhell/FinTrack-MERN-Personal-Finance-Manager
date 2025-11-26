import React, { useContext, useMemo } from "react";
import { AppContext } from "../context/globalContext.jsx";
import Chart from "../components/Chart.jsx";
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from "react-icons/fi";

const Dashboard = () => {
  // Get all global values from context
  const {
    IncomeData,
    ExpenseData,
    totalIncome,
    totalExpense,
    balance
  } = useContext(AppContext);

  // Helper: Format numbers as currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  /*
    Create "Recent History" list:
    - Combine income + expense
    - Sort by latest date
    - Take top 5
    - useMemo so it only recalculates when data changes
  */
  const recentHistory = useMemo(() => {
    const incomes = (IncomeData || []).map((i) => ({ ...i, type: "income" }));
    const expenses = (ExpenseData || []).map((e) => ({ ...e, type: "expense" }));

    return [...incomes, ...expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [IncomeData, ExpenseData]);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8 text-gray-800">

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Overview</h1>

      {/* =====================================================
          1. TOP SECTION — Summary Boxes
          ===================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* --- Total Balance Card --- */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center justify-between relative overflow-hidden">
          <div className="z-10">
            <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
              Total Balance
            </h2>
            <p className={`text-3xl font-bold mt-2 ${balance < 0 ? "text-red-600" : "text-gray-800"}`}>
              {formatCurrency(balance)}
            </p>
          </div>

          <div className="p-3 bg-blue-50 rounded-full z-10 text-blue-600">
            <FiDollarSign size={28} />
          </div>

          {/* Decorative circle */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-50 rounded-full opacity-50"></div>
        </div>

        {/* --- Total Income Card --- */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center justify-between relative overflow-hidden">
          <div className="z-10">
            <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
              Total Income
            </h2>
            <p className="text-green-600 text-3xl font-bold mt-2">
              {formatCurrency(totalIncome)}
            </p>
          </div>

          <div className="p-3 bg-green-50 rounded-full z-10 text-green-600">
            <FiTrendingUp size={28} />
          </div>

          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-50 rounded-full opacity-50"></div>
        </div>

        {/* --- Total Expense Card --- */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center justify-between relative overflow-hidden">
          <div className="z-10">
            <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
              Total Expense
            </h2>
            <p className="text-red-600 text-3xl font-bold mt-2">
              {formatCurrency(totalExpense)}
            </p>
          </div>

          <div className="p-3 bg-red-50 rounded-full z-10 text-red-600">
            <FiTrendingDown size={28} />
          </div>

          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-red-50 rounded-full opacity-50"></div>
        </div>
      </div>

      {/* =====================================================
          2. MAIN SECTION — Chart + Recent History
          ===================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --------------------------------------
            Chart Section (takes 2 columns)
           -------------------------------------- */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold mb-4">Financial Statistics</h3>

          {/* Chart container */}
          <div className="h-[400px]">
            <Chart
              IncomeData={IncomeData || []}
              ExpenseData={ExpenseData || []}
            />
          </div>
        </div>

        {/* --------------------------------------
            Recent History List
           -------------------------------------- */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold mb-4">Recent History</h3>

          {/* Empty State */}
          {recentHistory.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-4">
              No transactions yet.
            </p>
          )}

          {/* Recent Items */}
          <div className="flex flex-col gap-4">
            {recentHistory.map((item) => {
              const isIncome = item.type === "income";

              return (
                <div
                  key={item._id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    {/* Icon circle */}
                    <div
                      className={`p-2 rounded-full ${
                        isIncome
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {isIncome ? <FiDollarSign /> : <FiTrendingDown />}
                    </div>

                    {/* Title & Date */}
                    <div className="overflow-hidden">
                      <p className="font-semibold text-sm truncate w-32 md:w-auto">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.date
                          ? new Date(item.date).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Amount */}
                  <p
                    className={`font-bold whitespace-nowrap ${
                      isIncome ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(item.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
