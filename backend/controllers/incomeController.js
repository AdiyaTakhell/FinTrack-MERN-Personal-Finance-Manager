import IncomeModel from "../models/incomeSchema.js";

//
// Add Income
//
const addIncome = async (req, res) => {
  const userId = req.user?.id;               // Logged-in user's ID (from auth middleware)
  const { title, amount, category, description, date } = req.body;

  try {
    // Step 1: Basic validation for required fields
    if (!title || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "Title, Amount, Category, and Date are required"
      });
    }

    // Convert amount into a number
    const parsedAmount = Number(amount);

    // Check if amount is a valid positive number
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number",
      });
    }

    // Step 2: Create a new income entry in the database
    const newIncome = new IncomeModel({
      userId,
      title,
      amount: parsedAmount,
      category,
      description,
      date: new Date(date),      // Convert date string into Date format
      type: "income",            // Helps identify income vs expense
    });

    // Save the new income document
    await newIncome.save();

    // Successful response
    res.status(201).json({
      success: true,
      message: "Income added successfully",
      data: newIncome,
    });
  } catch (error) {
    console.error("Error adding income:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//
// Get All Incomes for the User
//
const getIncomes = async (req, res) => {
  const userId = req.user?.id;

  try {
    // Fetch all incomes belonging to this user
    // Sort by newest first
    const incomes = await IncomeModel.find({ userId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: incomes.length,    // Total number of income records
      data: incomes,
    });
  } catch (error) {
    console.error("Error fetching incomes:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//
// Update Income
//
const updateIncome = async (req, res) => {
  const { id } = req.params;        // Income ID from URL
  const userId = req.user?.id;      // Logged-in user ID

  try {
    // Update the income only if it belongs to the current user
    const updatedIncome = await IncomeModel.findOneAndUpdate(
      { _id: id, userId },        // Match income by ID + owner
      { ...req.body },            // Update provided fields
      { new: true, runValidators: true } // Return updated doc + check schema rules
    );

    // If no document found, user may not own it or it does not exist
    if (!updatedIncome) {
      return res.status(404).json({
        success: false,
        message: "Income not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Income updated successfully",
      data: updatedIncome,
    });
  } catch (error) {
    console.error("Error updating income:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//
// Delete Income
//
const deleteIncome = async (req, res) => {
  const { id } = req.params;      // Income ID
  const userId = req.user?.id;    // Logged-in user ID

  try {
    // Delete only if the income belongs to the user
    const deletedIncome = await IncomeModel.findOneAndDelete({ _id: id, userId });

    if (!deletedIncome) {
      return res.status(404).json({
        success: false,
        message: "Income not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Income deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting income:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { addIncome, getIncomes, updateIncome, deleteIncome };
