import React, { useContext, useState } from "react";
import { AppContext } from "../context/globalContext.jsx";
import { FiDollarSign, FiCalendar, FiTag, FiFileText, FiType, FiMinusCircle } from "react-icons/fi";

const Expense = () => {
  // Get function from context to save a new expense
  const { addExpenseData, loading } = useContext(AppContext);

  /*
    Helper: Format today’s date into YYYY-MM-DD
    so we can pre-fill the date input.
  */
  const getTodayDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Initial form values
  const initialFormState = {
    title: "",
    amount: "",
    category: "",
    description: "",
    date: getTodayDate(),
  };

  // Form state + validation errors
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  // Update form when user types
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update field
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error when corrected
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /*
    Validate inputs before submitting.
    Returns TRUE if valid, FALSE otherwise.
  */
  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Expense title is required.";
    if (!form.amount || Number(form.amount) <= 0)
      newErrors.amount = "Enter a valid positive amount.";
    if (!form.category) newErrors.category = "Please select a category.";
    if (!form.date) newErrors.date = "Date is required.";
    if (!form.description.trim()) newErrors.description = "Please add a short note.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // No errors = valid
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop if invalid

    // Prepare data to send to backend
    const payload = {
      title: form.title.trim(),
      amount: Number(form.amount),
      category: form.category,
      description: form.description.trim(),
      date: form.date,
    };

    try {
      await addExpenseData(payload); // Save to server
      setForm(initialFormState); // Reset form
      setErrors({});
    } catch (err) {
      console.error("Expense Error:", err);
    }
  };

  // Function to style input fields based on error
  const inputClass = (error) => `
    w-full pl-10 p-3 border rounded-lg outline-none transition-all duration-200
    ${
    error
      ? "border-red-500 bg-red-50 focus:ring-red-200" // Error style
      : "border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
  }
  `;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 shadow-xl rounded-2xl border-t-4 border-red-500">

      {/* ---------------------------------
          Header (Icon + Page Title)
         --------------------------------- */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-2xl">
          <FiMinusCircle />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Add Expense</h2>
          <p className="text-gray-500 text-sm">Track your spending</p>
        </div>
      </div>

      {/* ------------------------------
          Expense Form
         ------------------------------ */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Title Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <div className="relative">
            <FiType className="absolute left-3 top-3.5 text-gray-400" />
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ex: Groceries, Rent, Netflix"
              className={inputClass(errors.title)}
            />
          </div>
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Amount & Date side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Amount Field */}
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

          {/* Date Field */}
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

        {/* Category Select Field */}
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
              <option value="Education">Education</option>
              <option value="Groceries">Groceries</option>
              <option value="Health">Health</option>
              <option value="Subscriptions">Subscriptions</option>
              <option value="Takeaways">Takeaways</option>
              <option value="Clothing">Clothing</option>
              <option value="Travelling">Travelling</option>
              <option value="Other">Other</option>
            </select>

            {/* Dropdown arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
        </div>

        {/* Description Field */}
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
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 shadow-red-200"}`}
        >
          {loading ? "Adding Expense..." : "Save Expense"}
        </button>
      </form>
    </div>
  );
};

export default Expense;
