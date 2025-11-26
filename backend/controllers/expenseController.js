import ExpenseModel from "../models/expenseSchema.js";

//
// Add Expense
//
const addExpense = async (req, res) => {
  // User ID coming from the authentication middleware
  const userId = req.user?.id;

  try {
    const { title, amount, category, description, date } = req.body;

    // Basic required-field validation
    if (!title || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "Title, Amount, Category, and Date are required fields"
      });
    }

    // Convert amount to number and validate it
    const parseAmount = Number(amount);
    if (isNaN(parseAmount) || parseAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number",
      });
    }

    // Create a new expense document
    const newExpense = new ExpenseModel({
      userId,
      title,
      amount: parseAmount, // Use the converted number
      category,
      description, // Optional field
      date: new Date(date),
    });

    // Save to database
    await newExpense.save();

    return res.status(201).json({
      success: true,
      message: "Expense added successfully",
      data: newExpense,
    });
  } catch (error) {
    console.error("Error adding expense:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

//
// Get All Expenses for Logged-in User
//
const getExpenses = async (req, res) => {
  const userId = req.user?.id;

  try {
    // Find all expenses for this user, newest first
    const expenses = await ExpenseModel.find({ userId }).sort({ date: -1 });

    return res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses, // Returns empty array if none exist
    });
  } catch (error) {
    console.error("Error fetching expenses:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

//
// Update an Existing Expense
//
const updateExpense = async (req, res) => {
  const { id } = req.params; // Expense ID from URL
  const userId = req.user?.id;

  try {
    // Update only if expense belongs to the logged-in user
    const updatedExpense = await ExpenseModel.findOneAndUpdate(
      { _id: id, userId }, // Match by ID and owner
      { ...req.body },     // Update only provided fields
      { new: true, runValidators: true } // Return updated doc and validate fields
    );

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: updatedExpense,
    });
  } catch (error) {
    console.error("Error updating expense:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

//
// Delete an Expense
//
const deleteExpense = async (req, res) => {
  const { id } = req.params; // Expense ID
  const userId = req.user?.id;

  try {
    // Delete only if expense belongs to this user
    const deletedExpense = await ExpenseModel.findOneAndDelete({
      _id: id,
      userId: userId,
    });

    if (!deletedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting expense:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { addExpense, getExpenses, updateExpense, deleteExpense };
