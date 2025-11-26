import React, { createContext, useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

// Create a shared global context for the entire app
export const AppContext = createContext();

const backend_url = "http://localhost:4000";

// Create a base Axios instance for API calls
const api = axios.create({
  baseURL: backend_url,
  withCredentials: true, // Allow cookies
});

// Attach token automatically to every request
api.interceptors.request.use((config) => {
  const t = cookie.get("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  // Global States
  const [token, setToken] = useState(cookie.get("token") || null);  // Logged-in token
  const [user, setUser] = useState(null);                           // Decoded user data
  const [IncomeData, setIncomeData] = useState([]);                 // All income records
  const [ExpenseData, setExpenseData] = useState([]);               // All expense records
  const [loading, setLoading] = useState(false);                    // Loader for API calls

  const success = (msg) => toast.success(msg);
  const error = (msg) => toast.error(msg);

  /* ============================================================
     LOGOUT
     Clears session, storage, context values, and redirects user
     ============================================================ */
  const handleLogout = useCallback(() => {
    cookie.remove("token");
    setToken(null);
    setUser(null);

    localStorage.removeItem("income");
    localStorage.removeItem("expense");

    setIncomeData([]);
    setExpenseData([]);

    success("Logged out");
    navigate("/login");
  }, [navigate]);

  /* ============================================================
     REGISTER
     Creates a new user and logs them in automatically
     ============================================================ */
  const handleRegister = useCallback(async (name, email, password) => {
    try {
      setLoading(true);
      const { data } = await api.post("/api/users/register", { name, email, password });

      if (data.success) {
        cookie.set("token", data.token, { expires: 7 });
        setToken(data.token);
        success(data.message || "Registered");
        navigate("/");
      }

    } catch (err) {
      error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  /* ============================================================
     LOGIN
     Authenticates user and saves token
     ============================================================ */
  const handleLogin = useCallback(async (email, password) => {
    try {
      setLoading(true);

      const { data } = await api.post("/api/users/login", { email, password });

      if (data.success) {
        cookie.set("token", data.token, { expires: 7 });
        setToken(data.token);
        success(data.message || "Logged in");
        navigate("/");
      }

    } catch (err) {
      error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  /* ============================================================
     FETCH INCOME DATA
     ============================================================ */
  const fetchIncomeData = useCallback(async () => {
    try {
      const { data } = await api.get("/api/users/income");

      if (data.success) {
        setIncomeData(data.data || []);
        localStorage.setItem("income", JSON.stringify(data.data || []));
      }

    } catch (err) {
      console.error("Fetch Income Error:", err);
      if (err.response?.status === 401) handleLogout();
    }
  }, [handleLogout]);

  /* ============================================================
     FETCH EXPENSE DATA
     ============================================================ */
  const fetchExpenseData = useCallback(async () => {
    try {
      const { data } = await api.get("/api/users/expense");

      if (data.success) {
        setExpenseData(data.data || []);
        localStorage.setItem("expense", JSON.stringify(data.data || []));
      }

    } catch (err) {
      console.error("Fetch Expense Error:", err);
      if (err.response?.status === 401) handleLogout();
    }
  }, [handleLogout]);

  /* ============================================================
     Refresh all data at once (Income + Expense)
     ============================================================ */
  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchIncomeData(), fetchExpenseData()]);
    setLoading(false);
  }, [fetchIncomeData, fetchExpenseData]);

  /* ============================================================
     CRUD: Add Income
     ============================================================ */
  const addIncomeData = useCallback(async (payload) => {
    try {
      setLoading(true);
      const { data } = await api.post("/api/users/income", payload);

      if (data.success) {
        success("Income added!");
        await refreshAll();
      }

    } catch (err) {
      error(err.response?.data?.message || "Failed to add income");
    } finally {
      setLoading(false);
    }
  }, [refreshAll]);

  /* ============================================================
     CRUD: Add Expense
     ============================================================ */
  const addExpenseData = useCallback(async (payload) => {
    try {
      setLoading(true);
      const { data } = await api.post("/api/users/expense", payload);

      if (data.success) {
        success("Expense added!");
        await refreshAll();
      }

    } catch (err) {
      error(err.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  }, [refreshAll]);

  /* ============================================================
     CRUD: Update Income
     ============================================================ */
  const updateIncomeData = useCallback(async (id, payload) => {
    try {
      setLoading(true);
      const { data } = await api.put(`/api/users/income/${id}`, payload);

      if (data.success) {
        success("Income updated!");
        refreshAll();
      }

    } catch (err) {
      error(err.response?.data?.message || "Failed to update income");
    } finally {
      setLoading(false);
    }
  }, [refreshAll]);

  /* ============================================================
     CRUD: Delete Income
     ============================================================ */
  const deleteIncomeData = useCallback(async (id) => {
    try {
      setLoading(true);
      const { data } = await api.delete(`/api/users/income/${id}`);

      if (data.success) {
        success("Income deleted!");
        refreshAll();
      }

    } catch (err) {
      error(err.response?.data?.message || "Failed to delete income");
    } finally {
      setLoading(false);
    }
  }, [refreshAll]);

  /* ============================================================
     CRUD: Update Expense
     ============================================================ */
  const updateExpenseData = useCallback(async (id, payload) => {
    try {
      setLoading(true);
      const { data } = await api.put(`/api/users/expense/${id}`, payload);

      if (data.success) {
        success("Expense updated!");
        refreshAll();
      }

    } catch (err) {
      error(err.response?.data?.message || "Failed to update expense");
    } finally {
      setLoading(false);
    }
  }, [refreshAll]);

  /* ============================================================
     CRUD: Delete Expense
     ============================================================ */
  const deleteExpenseData = useCallback(async (id) => {
    try {
      setLoading(true);
      const { data } = await api.delete(`/api/users/expense/${id}`);

      if (data.success) {
        success("Expense deleted!");
        refreshAll();
      }

    } catch (err) {
      error(err.response?.data?.message || "Failed to delete expense");
    } finally {
      setLoading(false);
    }
  }, [refreshAll]);

  /* ============================================================
     Decode token → Extract user data
     Runs whenever the token changes
     ============================================================ */
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // Check if token expired
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        handleLogout();
        error("Session expired.");
      } else {
        setUser(decoded);
      }

    } catch (e) {
      handleLogout();
    }
  }, [token, handleLogout]);

  /* ============================================================
     Auto-fetch income + expense when logged in
     ============================================================ */
  useEffect(() => {
    if (token) {
      refreshAll();
    }
  }, [token, refreshAll]);

  /* ============================================================
     Derived values (memoized for performance)
     ============================================================ */
  const totalIncome = useMemo(
    () => IncomeData.reduce((acc, i) => acc + (Number(i.amount) || 0), 0),
    [IncomeData]
  );

  const totalExpense = useMemo(
    () => ExpenseData.reduce((acc, e) => acc + (Number(e.amount) || 0), 0),
    [ExpenseData]
  );

  const balance = useMemo(
    () => totalIncome - totalExpense,
    [totalIncome, totalExpense]
  );

  /* ============================================================
     Context Value (shared across the whole app)
     ============================================================ */
  const contextValue = useMemo(
    () => ({
      backend_url,
      token,
      setToken,
      user,
      loading,
      handleRegister,
      handleLogin,
      handleLogout,
      fetchIncomeData,
      fetchExpenseData,
      refreshAll,
      addIncomeData,
      addExpenseData,
      updateIncomeData,
      updateExpenseData,
      deleteIncomeData,
      deleteExpenseData,
      IncomeData,
      ExpenseData,
      totalIncome,
      totalExpense,
      balance,
    }),
    [
      token, user, loading, IncomeData, ExpenseData, totalIncome, totalExpense, balance,
      handleRegister, handleLogin, handleLogout,
      fetchIncomeData, fetchExpenseData, refreshAll,
      addIncomeData, addExpenseData, updateIncomeData, updateExpenseData,
      deleteIncomeData, deleteExpenseData,
    ]
  );

  // Provide global data and functions to all components
  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export default AppProvider;
