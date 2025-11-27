#Demo Section
https://fintrack-frontend-kf9a.onrender.com/login

# 📊 FinTrack — MERN Personal Finance Manager

A modern full-stack Personal Finance Manager built with the **MERN** stack.
Track income, expenses, financial trends, and view analytics through a clean and intuitive interface.

---

## 📑 Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Screenshots](#screenshots)
* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [Usage](#usage)
* [API Overview](#api-overview)
* [Project Structure](#project-structure)
* [Troubleshooting](#troubleshooting)
* [License](#license)

---

## 🔍 Overview

**FinTrack** is a personal finance management system that allows users to:

* Add and categorize income & expenses
* View real-time balance updates
* Analyze financial patterns
* Explore a historical transaction log
* Export financial data to CSV/XLSX
* View analytics using charts and summaries

All authentication is secured using **JWT**.

---

## ✨ Features

### 🧾 Financial Management

* Add, edit, delete income records
* Add, edit, delete expense records
* Filter by date, type, category, title
* Export data to **CSV** or **XLSX**

### 📈 Analytics Dashboard

* Financial statistics chart
* Income vs Expense pie chart
* Recent transactions panel
* Total balance, income, and expense summary

### 🔐 Authentication System

* Secure JWT-based login & registration
* Protected routes
* Demo login support (optional)

### 🖥 Modern UI

* Responsive layout
* Clean dashboard designed with React
* Sidebar navigation system

---

## 🖼 Screenshots

### 📌 Dashboard Overview
<img width="1589" height="972" alt="image" src="https://github.com/user-attachments/assets/0cbed63d-ffc5-4fc2-8b59-f7246597eda1" />



### 📌 Transaction History
<img width="1132" height="768" alt="image" src="https://github.com/user-attachments/assets/a8eeab8d-a2df-4b1e-928d-dca0db1436dd" />


### 📌 Login Page
<img width="703" height="769" alt="image" src="https://github.com/user-attachments/assets/e53a2a39-0202-4fc9-a802-76d4272c0237" />


### **Frontend**

* React
* React Router
* Axios
* Charting library (e.g., Chart.js — depending on project)

### **Backend**

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Bcrypt for password security

---

## ⚙️ Installation

```bash
git clone https://github.com/AdiyaTakhell/FinTrack-MERN-Personal-Finance-Manager.git
cd FinTrack-MERN-Personal-Finance-Manager
```

### Install Backend

```bash
cd backend
npm install
```

### Install Frontend

```bash
cd ../frontend
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the **backend** folder:

```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
CLIENT_URL=
```

---

## ▶️ Usage

### Start Backend

```bash
cd backend
npm run dev
```



### Start Frontend

```bash
cd frontend
npm start
```

---

## 📡 API Overview (Simplified)

### **Auth**

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| POST   | `/api/auth/register` | Register new user     |
| POST   | `/api/auth/login`    | Login and receive JWT |

### **Income**

| Method | Endpoint          | Description    |
| ------ | ----------------- | -------------- |
| GET    | `/api/income`     | Get all income |
| POST   | `/api/income`     | Add income     |
| DELETE | `/api/income/:id` | Delete income  |

### **Expense**

| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| GET    | `/api/expense`     | Get all expenses |
| POST   | `/api/expense`     | Add expense      |
| DELETE | `/api/expense/:id` | Delete expense   |


---

## 📁 Project Structure

```
FinTrack-MERN-Personal-Finance-Manager/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## 🛠 Troubleshooting

### MongoDB not connecting

* Make sure **MONGODB_URI** is valid
* Ensure your IP is whitelisted in MongoDB Atlas

### JWT error

* JWT_SECRET must match across sessions
* Token must be included in request headers

### CORS issues

Set CLIENT_URL properly in `.env`.

---
