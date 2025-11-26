import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

// Importing all controllers
import { registerUser, loginUser } from "../controllers/userController.js";

import {
  addIncome,
  getIncomes,
  updateIncome,
  deleteIncome
} from "../controllers/incomeController.js";

import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense
} from "../controllers/expenseController.js";

const router = express.Router();

//
// 1. Authentication Routes
//
// These routes handle user registration and login.
// They do NOT require authentication.
//
router.post("/register", registerUser); // Create new user
router.post("/login", loginUser);       // Login user and return token

//
// 2. Income Routes
//
// These routes are protected by authMiddleware.
// Only logged-in users can access them.
//
router.post("/income", authMiddleware, addIncome);          // Add new income entry
router.get("/income", authMiddleware, getIncomes);          // Get all incomes of the user
router.put("/income/:id", authMiddleware, updateIncome);    // Update a specific income by ID
router.delete("/income/:id", authMiddleware, deleteIncome); // Delete a specific income by ID

//
// 3. Expense Routes
//
// Same pattern as income routes, but for expenses.
//
router.post("/expense", authMiddleware, addExpense);          // Add new expense
router.get("/expense", authMiddleware, getExpenses);          // Get all expenses of the user
router.put("/expense/:id", authMiddleware, updateExpense);    // Update a specific expense
router.delete("/expense/:id", authMiddleware, deleteExpense); // Delete a specific expense

// Export the router so it can be used in server/app.js
export default router;
