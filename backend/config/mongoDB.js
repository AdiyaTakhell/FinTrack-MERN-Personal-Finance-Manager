import mongoose from "mongoose";

// This function connects our backend server to MongoDB
const connectDB = async () => {

  // Step 1: Check if MONGO_URI exists in .env file
  // If the database URL is missing, stop the application to prevent errors
  if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI is not defined in your .env file.");
    process.exit(1); // Stop the application
  }

  try {
    // Step 2: Try to connect to MongoDB using the URL from .env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If connection is successful, print the host name
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {

    // If connection fails, log the error message
    console.error(`MongoDB Connection Error: ${error.message}`);

    // Stop the application because the database is required
    process.exit(1);
  }
};

// Export the function so it can be used in server.js
export default connectDB;
