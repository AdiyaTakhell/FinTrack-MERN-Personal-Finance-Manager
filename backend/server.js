import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/mongoDB.js";
import userRouter from "./routes/userRouter.js";

// 1. Load environment variables from .env file
dotenv.config();

const app = express();

// Server port (fallback to 4000 if not provided)
const PORT = process.env.PORT || 4000;

// Allowed frontend URL (CORS)
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// 2. Connect to MongoDB
// This must run before handling any API requests
await connectDB();

// 3. Global Middlewares
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse form-data (URL encoded)

// Enable Cross-Origin Resource Sharing so frontend can call backend
app.use(
  cors({
    origin: CLIENT_URL,   // Allow only this frontend URL
    credentials: true,    // Allow cookies/authorization headers
  })
);

// 4. Main API Routes
// All user, income, and expense routes come under /api/users
app.use("/api/users", userRouter);

// Simple health check route
// Visiting http://localhost:4000/ shows this message
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 5. Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Accepting requests from: ${CLIENT_URL}`);
});
