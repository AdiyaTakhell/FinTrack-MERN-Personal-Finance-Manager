import React, { useContext } from "react";
import { AppContext } from "../context/globalContext.jsx";
import { FiTrash2, FiMinusCircle } from "react-icons/fi";

const ExpensesTransaction = () => {
  // Get all expenses + delete function from global context
  const { ExpenseData = [], deleteExpenseData } = useContext(AppContext);

  // Convert date into readable format (e.g., Jan 10, 2024)
  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Convert amount to currency format
  const formatCurrency = (amt) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amt);
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4 pb-12">

      {/* -------------------------
          Page Title (Icon + Text)
         ------------------------- */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-xl">
          <FiMinusCircle />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Expense History</h2>
      </div>

      {/* -------------------------
          Table Wrapper (scrollable)
         ------------------------- */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">

        {/* Table */}
        <table className="min-w-[700px] w-full table-auto text-sm">

          {/* Table Header */}
          <thead className="bg-gray-50 text-gray-500 font-medium">
          <tr>
            <th className="p-4 text-left">Date</th>
            <th className="p-4 text-left">Title</th>
            <th className="p-4 text-left">Category</th>
            <th className="p-4 text-left">Description</th>
            <th className="p-4 text-right">Amount</th>
            <th className="p-4 text-center">Action</th>
          </tr>
          </thead>

          {/* Table Body */}
          <tbody>

          {/* If there are no expenses yet */}
          {ExpenseData.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-8 text-center text-gray-400">
                No expense records found.
              </td>
            </tr>
          ) : (
            // Show all expense transactions
            ExpenseData.map((t) => (
              <tr
                key={t._id}
                className="border-t border-gray-100 hover:bg-red-50 transition-colors group"
              >
                {/* Date */}
                <td className="p-4 text-gray-600">{formatDate(t.date)}</td>

                {/* Title */}
                <td className="p-4 font-medium text-gray-800">{t.title}</td>

                {/* Category Tag */}
                <td className="p-4">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                      {t.category}
                    </span>
                </td>

                {/* Description */}
                <td className="p-4 text-gray-500 italic truncate max-w-xs">
                  {t.description}
                </td>

                {/* Amount (Red because it's expense) */}
                <td className="p-4 text-right font-bold text-red-500">
                  {formatCurrency(t.amount)}
                </td>

                {/* Delete Button */}
                <td className="p-4 text-center">
                  <button
                    onClick={() => deleteExpenseData(t._id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-100 hover:text-red-500 transition-all"
                    title="Delete Transaction"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))
          )}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpensesTransaction;
