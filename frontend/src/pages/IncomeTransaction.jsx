import React, { useContext } from "react";
import { AppContext } from "../context/globalContext.jsx";
import { FiTrash2, FiPlusCircle } from "react-icons/fi";

const IncomeTransaction = () => {
  // Get all income entries + delete function from global context
  const { IncomeData = [], deleteIncomeData } = useContext(AppContext);

  // Format date to something readable (e.g., Jan 10, 2025)
  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Format amount to currency
  const formatCurrency = (amt) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amt);
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4 pb-12">

      {/* -------------------------
          Page Title (Icon + Heading)
         ------------------------- */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 text-xl">
          <FiPlusCircle />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Income History
        </h2>
      </div>

      {/* -------------------------
          Table Container (scrollable)
         ------------------------- */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">

        {/* Income Table */}
        <table className="min-w-[700px] w-full table-auto text-sm">

          {/* Table Header Row */}
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

          {/* If no incomes exist */}
          {IncomeData.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-8 text-center text-gray-400">
                No income records found.
              </td>
            </tr>
          ) : (

            // Render each income item
            IncomeData.map((t) => (
              <tr
                key={t._id}
                className="border-t border-gray-100 hover:bg-green-50 transition-colors group"
              >
                {/* Date */}
                <td className="p-4 text-gray-600">{formatDate(t.date)}</td>

                {/* Title */}
                <td className="p-4 font-medium text-gray-800">{t.title}</td>

                {/* Category tag */}
                <td className="p-4">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                      {t.category}
                    </span>
                </td>

                {/* Description */}
                <td className="p-4 text-gray-500 italic truncate max-w-xs">
                  {t.description}
                </td>

                {/* Income Amount */}
                <td className="p-4 text-right font-bold text-green-500">
                  {formatCurrency(t.amount)}
                </td>

                {/* Delete Button */}
                <td className="p-4 text-center">
                  <button
                    onClick={() => deleteIncomeData(t._id)} // Delete API call
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-green-100 hover:text-green-500 transition-all"
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

export default IncomeTransaction;
