import React, { useContext } from "react";
import { ToastContainer } from "react-toastify";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AppContext } from "./context/globalContext.jsx";
import "react-toastify/dist/ReactToastify.css";

// Components
import Sidebar from "./components/Sidebar.jsx";
import History from "./components/History.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Pages
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Signup.jsx";
import Income from "./pages/Income.jsx";
import Expense from "./pages/Expense.jsx";
import IncomeTransaction from "./pages/IncomeTransaction.jsx";
import ExpenseTransaction from "./pages/ExpenseTransaction.jsx";
import ViewTransaction from "./pages/ViewTransaction.jsx";

/*
  PUBLIC ROUTE:
  - If user is already logged in, they should not visit Login/Register
  - Redirect them to Dashboard
*/
const PublicRoute = ({ children }) => {
  const { token } = useContext(AppContext);

  // If logged in → stop access to login/register
  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const location = useLocation();

  // Routes where the sidebar should NOT be shown
  const noSidebarRoutes = ["/login", "/register"];

  // Check if current page is in the "hide sidebar" list
  const hideSidebar = noSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* Global Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* =============================
           LEFT SIDEBAR (Desktop Only)
         ============================= */}
      {!hideSidebar && (
        <div className="hidden md:flex w-64 h-full bg-white border-r border-gray-200 shrink-0 flex-col z-20">
          <Sidebar />
        </div>
      )}

      {/* =============================
           MOBILE NAVBAR (Bottom Bar)
         ============================= */}
      {!hideSidebar && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 h-16">
          <Sidebar mobile />
        </div>
      )}

      {/* =============================
           MAIN CONTENT AREA
         ============================= */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 mb-16 md:mb-0 relative z-10">

        <Routes>
          {/* Dashboard (Private) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* All Transaction (Private) */}
          <Route
            path="/view-transaction"
            element={
              <ProtectedRoute>
                <ViewTransaction />
              </ProtectedRoute>
            }
          />

          {/* Add Income (Private) */}
          <Route
            path="/add-income"
            element={
              <ProtectedRoute>
                <Income />
              </ProtectedRoute>
            }
          />

          {/* Add Expense (Private) */}
          <Route
            path="/add-expense"
            element={
              <ProtectedRoute>
                <Expense />
              </ProtectedRoute>
            }
          />

          {/* Income List (Private) */}
          <Route
            path="/income-transaction"
            element={
              <ProtectedRoute>
                <IncomeTransaction />
              </ProtectedRoute>
            }
          />

          {/* Expense List (Private) */}
          <Route
            path="/expense-transaction"
            element={
              <ProtectedRoute>
                <ExpenseTransaction />
              </ProtectedRoute>
            }
          />

          {/* Login (Public) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Register (Public) */}
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
        </Routes>
      </div>

      {/* =============================
           RIGHT SIDEBAR (Desktop Only)
         ============================= */}
      {!hideSidebar && (
        <div className="hidden xl:block w-96 h-full overflow-y-auto border-l border-gray-200 bg-white shrink-0 p-6 z-20">
          <History />
        </div>
      )}
    </div>
  );
};

export default App;
