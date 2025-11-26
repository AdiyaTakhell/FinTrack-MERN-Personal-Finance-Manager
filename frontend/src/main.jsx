import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppProvider from "./context/globalContext.jsx";
import App from "./App.jsx";
import "./index.css";

// Grab the DOM root
const rootElement = document.getElementById("root");

// Create React root
const root = createRoot(rootElement);

// Render App (NO StrictMode)
root.render(
  <BrowserRouter>
    <AppProvider>
      <App />
    </AppProvider>
  </BrowserRouter>
);
