import React, { useContext, useMemo } from "react";
import { AppContext } from "../context/globalContext.jsx";
import Chart from "../components/Chart.jsx";
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from "react-icons/fi";

const Dashboard = () => {
  // Access global values from context
  const { IncomeData, ExpenseData, totalIncome, totalExpense, balance } =
    useContext(AppContext);

  // Reusable currency formatting function (memoized for performance)
  const formatCurrency = useMemo(
    () => (amt) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amt),
    []
  );

  // Merge and sort last 5 transactions (recent history section)
  const recentHistory = useMemo(() => {
    const incomes = (IncomeData || []).map((i) => ({ ...i, type: "income" }));
    const expenses = (ExpenseData || []).map((e) => ({ ...e, type: "expense" }));

    return [...incomes, ...expenses] // merge arrays
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // sort by latest
      .slice(0, 5); // limit to 5 records
  }, [IncomeData, ExpenseData]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 text-gray-800">

      {/* Title Section */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Dashboard Overview
      </h1>

      {/* Summary Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

        {/* Current Balance Card */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex items-center justify-between border transition hover:shadow-xl">
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
              Balance
            </p>
            <p className={`text-3xl font-bold mt-2 ${balance < 0 ? "text-red-600" : "text-blue-700"}`}>
              {formatCurrency(balance)}
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <FiDollarSign size={28} />
          </div>
        </div>

        {/* Total Income Card */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex items-center justify-between border transition hover:shadow-xl">
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
              Income
            </p>
            <p className="text-green-600 text-3xl font-bold mt-2">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div className="p-3 bg-green-100 rounded-full text-green-600">
            <FiTrendingUp size={28} />
          </div>
        </div>

        {/* Total Expense Card */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex items-center justify-between border transition hover:shadow-xl">
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
              Expense
            </p>
            <p className="text-red-600 text-3xl font-bold mt-2">
              {formatCurrency(totalExpense)}
            </p>
          </div>
          <div className="p-3 bg-red-100 rounded-full text-red-600">
            <FiTrendingDown size={28} />
          </div>
        </div>
      </div>

      {/* Chart + Recent History Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Chart Component */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border">
          <h3 className="text-xl font-semibold mb-4">Financial Statistics</h3>

          {/* Display chart or message when empty */}
          <div className="h-[350px]">
            {(!IncomeData?.length && !ExpenseData?.length) ? (
              <p className="text-center text-gray-400 py-24">No chart data yet</p>
            ) : (
              <Chart IncomeData={IncomeData} ExpenseData={ExpenseData} />
            )}
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="bg-white p-6 rounded-2xl shadow-md border">
          <h3 className="text-xl font-semibold mb-4">Recent History</h3>

          {/* Empty State Message */}
          {recentHistory.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No transactions found</p>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Render each transaction */}
              {recentHistory.map((item) => {
                const isIncome = item.type === "income";

                return (
                  <div
                    key={item._id || item.date + item.amount}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition border"
                  >
                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                      {/* Type icon (Income / Expense) */}
                      <div
                        className={`p-2 rounded-full ${
                          isIncome
                            ? "bg-green-200 text-green-700"
                            : "bg-red-200 text-red-700"
                        }`}
                      >
                        {isIncome ? <FiTrendingUp /> : <FiTrendingDown />}
                      </div>

                      {/* Title & Date */}
                      <div className="overflow-hidden">
                        <p className="font-semibold text-sm truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Amount */}
                    <p
                      className={`font-bold text-right max-w-[90px] overflow-hidden text-ellipsis ${
                        isIncome ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isIncome ? "+" : "-"} {formatCurrency(item.amount)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
