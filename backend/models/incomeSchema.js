import mongoose from "mongoose";

// Creating the structure (schema) for an income entry
const incomeSchema = new mongoose.Schema(
  {
    // The user who owns this income record
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",     // Connects income to the User model
      required: true,
    },

    // Title of the income (example: "Salary", "Freelancing")
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,       // Removes extra spaces at start/end
      maxLength: [50, "Title cannot exceed 50 characters"],
    },

    // Amount earned
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be a positive number"], // Must be >= 0
    },

    // Helps identify between income and expense
    type: {
      type: String,
      default: "income", // Automatically set as income
    },

    // Date the income was received
    date: {
      type: Date,
      required: [true, "Date is required"],
    },

    // Category of income (example: "Job", "Business")
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxLength: [20, "Category cannot exceed 20 characters"],
    },

    // Optional explanation or details about the income
    description: {
      type: String,
      required: [true, "Description is required"],
      // Remove "required" if you want this optional
      trim: true,
      maxLength: [200, "Description cannot exceed 200 characters"],
    },
  },

  // Automatically adds createdAt and updatedAt timestamps
  { timestamps: true }
);

// Prevents duplicate model creation during hot reload or repeated execution
const IncomeModel =
  mongoose.models.Income || mongoose.model("Income", incomeSchema);

export default IncomeModel;
