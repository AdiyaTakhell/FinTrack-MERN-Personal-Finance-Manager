import React, { useContext, useMemo, useState } from "react";
import { AppContext } from "../context/globalContext.jsx";
import { FiSearch, FiFilter, FiArrowUp, FiArrowDown } from "react-icons/fi";
import * as XLSX from "xlsx";

// -------------------------
// Helper: Format Date
// -------------------------
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

// -------------------------
// Helper: Format Currency
// -------------------------
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const ViewTransaction = () => {
  const { IncomeData = [], ExpenseData = [] } = useContext(AppContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // ------------------------------------------------
  // 1. Merge Income + Expense (tag with type)
  // ------------------------------------------------
  const allTransactions = useMemo(() => {
    const income = IncomeData.map((item) => ({ ...item, type: "income" }));
    const expense = ExpenseData.map((item) => ({ ...item, type: "expense" }));

    return [...income, ...expense].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [IncomeData, ExpenseData]);

  // ------------------------------------------------
  // 2. Apply search + filter
  // ------------------------------------------------
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesType = filterType === "all" || item.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [allTransactions, searchTerm, filterType]);

  // ------------------------------------------------
  // Export: CSV Download
  // ------------------------------------------------
  const exportToCSV = () => {
    if (filteredTransactions.length === 0) {
      alert("No data available to export");
      return;
    }

    const headers = ["Date,Title,Category,Type,Amount"];
    const rows = filteredTransactions.map((t) => {
      return `${formatDate(t.date)},${t.title},${t.category || "General"},${
        t.type
      },${t.amount}`;
    });

    const csvContent = [...headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    link.click();
  };

  // ------------------------------------------------
  // Export: XLSX Download
  // ------------------------------------------------
  const exportToXLSX = () => {
    if (filteredTransactions.length === 0) {
      alert("No data available to export");
      return;
    }

    const excelRows = filteredTransactions.map((t) => ({
      Date: formatDate(t.date),
      Title: t.title,
      Category: t.category || "General",
      Type: t.type === "income" ? "Income" : "Expense",
      Amount: t.amount,
    }));

    const sheet = XLSX.utils.json_to_sheet(excelRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Transactions");

    XLSX.writeFile(workbook, "transactions.xlsx");
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4 mb-10 pb-12">
      {/* ---------------------------------- */}
      {/* Header: Search + Filter + Export */}
      {/* ---------------------------------- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>
          <p className="text-gray-500 text-sm">
            View, filter, and export all your financial records
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Filter */}
          <div className="relative w-full sm:w-auto">
            <FiFilter className="absolute left-3 top-3.5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full sm:w-auto pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none shadow-sm cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
          </div>

          {/* CSV Export */}
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Export CSV
          </button>

          {/* XLSX Export */}
          <button
            onClick={exportToXLSX}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            Export XLSX
          </button>
        </div>
      </div>

      {/* ---------------------------------- */}
      {/* Table */}
      {/* ---------------------------------- */}
      <div className="overflow-hidden bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="p-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-500">
                    <p className="text-lg font-medium">No transactions found</p>
                    <p className="text-sm">Try changing your search or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => {
                  const isIncome = t.type === "income";

                  return (
                    <tr
                      key={t._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Date */}
                      <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(t.date)}
                      </td>

                      {/* Title */}
                      <td className="p-4 text-sm font-medium text-gray-900">
                        {t.title}
                      </td>

                      {/* Category */}
                      <td className="p-4 text-sm text-gray-600">
                        <span className="bg-gray-100 px-3 py-1 rounded-md text-xs font-medium border border-gray-200">
                          {t.category || "General"}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isIncome
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                        >
                          {isIncome ? <FiArrowUp /> : <FiArrowDown />}
                          {isIncome ? "Income" : "Expense"}
                        </span>
                      </td>

                      {/* Amount */}
                      <td
                        className={`p-4 text-right text-sm font-bold whitespace-nowrap ${
                          isIncome ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isIncome ? "+" : "-"}
                        {formatCurrency(t.amount)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewTransaction;
