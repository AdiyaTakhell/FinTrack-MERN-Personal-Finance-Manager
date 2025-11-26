import mongoose from "mongoose";

// Creating the structure (schema) for an expense document
const expenseSchema = new mongoose.Schema(
  {
    // Linking the expense to a specific user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",          // References the User collection
      required: true,
    },

    // Title of the expense (ex: "Groceries", "Rent")
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,           // Removes spaces at start/end
      maxLength: [50, "Title cannot exceed 50 characters"],
    },

    // Amount spent
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be a positive number"], // Must be >= 0
    },

    // Helps categorize or filter entries (expense/income)
    type: {
      type: String,
      default: "expense",   // Automatically set as "expense"
    },

    // Date of the expense (required)
    date: {
      type: Date,
      required: [true, "Date is required"],
    },

    // Category of the expense (ex: "Food", "Travel")
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxLength: [20, "Category cannot exceed 20 characters"],
    },

    // Optional explanation or details about the expense
    description: {
      type: String,
      required: [true, "Description is required"],
      // If you want this to be optional, remove "required"
      trim: true,
      maxLength: [200, "Description cannot exceed 200 characters"],
    },
  },

  // Automatically adds createdAt and updatedAt timestamps
  { timestamps: true }
);

// Prevents Mongoose from creating duplicate models during hot reload
const ExpenseModel =
  mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

export default ExpenseModel;
