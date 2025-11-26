import React, { useContext, useState } from "react";
import { AppContext } from "../context/globalContext.jsx";
import { FiDollarSign, FiCalendar, FiTag, FiFileText, FiType } from "react-icons/fi";

const Income = () => {
  // Use global context → provides addIncome function + loading state
  const { addIncomeData, loading } = useContext(AppContext);

  // Helper: get today's date in YYYY-MM-DD format
  // Prevents timezone issues where input date becomes incorrect
  const getTodayDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Default form state
  const initialFormState = {
    title: "",
    amount: "",
    category: "",
    description: "",
    date: getTodayDate(),
  };

  // Form & error states
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  // Update form when inputs change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear existing error for that field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Simple form validation
  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Income title is required.";
    if (!form.amount || Number(form.amount) <= 0)
      newErrors.amount = "Enter a valid amount.";
    if (!form.category) newErrors.category = "Please select a category.";
    if (!form.date) newErrors.date = "Date is required.";
    if (!form.description.trim())
      newErrors.description = "Please add a short note.";

    setErrors(newErrors);

    // If no errors → form is valid
    return Object.keys(newErrors).length === 0;
  };

  // Submit form and send data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Stop if validation fails
    if (!validateForm()) return;

    // Prepare data in correct format
    const payload = {
      title: form.title.trim(),
      amount: Number(form.amount),
      category: form.category,
      description: form.description.trim(),
      date: form.date,
    };

    try {
      await addIncomeData(payload); // API call from context
      setForm(initialFormState);    // Reset form after success
      setErrors({});
    } catch (err) {
      console.error("Income Error:", err);
    }
  };

  // Dynamic input styling (red when error)
  const inputClass = (error) => `
    w-full pl-10 p-3 border rounded-lg outline-none transition-all duration-200
    ${
    error
      ? "border-red-500 bg-red-50 focus:ring-red-200"
      : "border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100"
  }
  `;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 shadow-xl rounded-2xl border-t-4 border-green-500">

      {/* Page Title */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Add Income</h2>
        <p className="text-gray-500 text-sm">Track your earnings</p>
      </div>

      {/* Income Form */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <div className="relative">
            <FiType className="absolute left-3 top-3.5 text-gray-400" />
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ex: Salary, Freelance Project"
              className={inputClass(errors.title)}
            />
          </div>
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Amount + Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <div className="relative">
              <FiDollarSign className="absolute left-3 top-3.5 text-gray-400" />
              <input
                name="amount"
                type="number"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                className={inputClass(errors.amount)}
              />
            </div>
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-3.5 text-gray-400" />
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className={inputClass(errors.date)}
              />
            </div>
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <div className="relative">
            <FiTag className="absolute left-3 top-3.5 text-gray-400" />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`${inputClass(errors.category)} appearance-none bg-white`}
            >
              <option value="">Select Category</option>
              <option value="Salary">Salary</option>
              <option value="Business">Business</option>
              <option value="Investments">Investments</option>
              <option value="Freelance">Freelance</option>
              <option value="Gift">Gift</option>
              <option value="Other">Other</option>
            </select>

            {/* Arrow Icon */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <div className="relative">
            <FiFileText className="absolute left-3 top-3.5 text-gray-400" />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add details (optional)"
              rows="3"
              className={inputClass(errors.description)}
            />
          </div>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 rounded-lg text-white font-semibold shadow-lg transition-all transform hover:-translate-y-0.5 
            ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 shadow-green-200"
          }`}
        >
          {loading ? "Adding Income..." : "Save Income"}
        </button>
      </form>
    </div>
  );
};

export default Income;
