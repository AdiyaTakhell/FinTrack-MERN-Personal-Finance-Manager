import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/globalContext.jsx";

// Icons
import { GoGraph } from "react-icons/go";
import { FaRegCreditCard } from "react-icons/fa";
import { FaArrowsDownToLine, FaArrowsUpToLine, FaMoneyBillTrendUp } from "react-icons/fa6";
import { GiExpense } from "react-icons/gi";
import { IoLogIn, IoLogOut } from "react-icons/io5";

const Sidebar = ({ mobile }) => {
  // Get token (login status), logout handler, and user info from global context
  const { token, handleLogout, user } = useContext(AppContext);
  const navigate = useNavigate();

  // Helper: Get the first letter of the user's name
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <div
      className={`
        ${mobile
        ? "fixed bottom-0 left-0 right-0 h-16 flex-row justify-around items-center z-50 rounded-t-xl"
        : "flex-col w-full h-full p-3"
      }
        flex bg-gray-900 text-white shadow-lg transition-all duration-300
      `}
    >

      {/* -----------------------------
           Logo (Desktop only)
         ----------------------------- */}
      {!mobile && (
        <div className="text-center py-6 mb-2 border-b border-gray-800">
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer hover:scale-105 transition-transform"
          >
            <h1 className="text-xl font-bold text-blue-500 tracking-tight">
              ExpenseTracker
            </h1>
            <h2 className="text-[10px] text-gray-400 mt-1 tracking-widest uppercase">
              Finance Manager
            </h2>
          </div>
        </div>
      )}

      {/* -----------------------------
           User Profile (Desktop only)
         ----------------------------- */}
      {!mobile && user && (
        <div className="flex items-center gap-3 px-3 py-3 mb-6 bg-gray-800/50 rounded-xl border border-gray-700 mx-1">
          {/* Profile Picture Circle */}
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md ring-2 ring-blue-500/30">
            {getInitials(user.name)}
          </div>

          {/* User Name + Online Indicator */}
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-semibold text-white truncate" title={user.name}>
              {user.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.6)]"></div>
              <p className="text-[10px] text-gray-400 font-medium">Online</p>
            </div>
          </div>
        </div>
      )}

      {/* -----------------------------
           Navigation Links
         ----------------------------- */}
      <div
        className={`flex ${mobile ? "w-full justify-around items-center" : "flex-col gap-2"}`}
      >
        {/* Main Navigation */}
        <NavItem to="/" label="Dashboard" Icon={GoGraph} mobile={mobile} />
        <NavItem to="/view-transaction" label="History" Icon={FaRegCreditCard} mobile={mobile} />
        <NavItem to="/add-income" label="Income" Icon={FaMoneyBillTrendUp} mobile={mobile} />
        <NavItem to="/add-expense" label="Expense" Icon={GiExpense} mobile={mobile} />

        {/* Extra Links (Desktop only) */}
        {!mobile && (
          <>
            <NavItem
              to="/income-transaction"
              label="Income List"
              Icon={FaArrowsDownToLine}
              mobile={mobile}
            />
            <NavItem
              to="/expense-transaction"
              label="Expense List"
              Icon={FaArrowsUpToLine}
              mobile={mobile}
            />
          </>
        )}

        {/* -----------------------------
             Auth Button (Login / Logout)
           ----------------------------- */}
        <div className={mobile ? "" : "mt-auto border-t border-gray-800 pt-4"}>
          {token ? (
            // Logout Button
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200 group ${
                mobile
                  ? "text-red-400"
                  : "hover:bg-red-500/10 text-gray-400 hover:text-red-400"
              }`}
            >
              <IoLogOut size={mobile ? 24 : 20} className="group-hover:scale-110 transition-transform" />
              {!mobile && <span className="font-medium text-sm">Sign Out</span>}
            </button>
          ) : (
            // Login Link
            <NavItem to="/login" label="Login" Icon={IoLogIn} mobile={mobile} />
          )}
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------------
   NavItem Component (Reusable Menu Button)
   ---------------------------------------- */
const NavItem = ({ to, label, Icon, mobile }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group
       ${mobile ? "flex-col text-[10px] gap-1 justify-center" : "flex-row text-sm font-medium"}
       ${
        isActive
          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`
    }
  >
    <Icon size={mobile ? 22 : 18} className="group-hover:scale-110 transition-transform" />
    <span className={mobile ? "text-[10px]" : ""}>{label}</span>
  </NavLink>
);

export default Sidebar;
