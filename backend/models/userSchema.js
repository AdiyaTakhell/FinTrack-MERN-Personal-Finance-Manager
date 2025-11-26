import mongoose from "mongoose";

// Creating the structure (schema) for a user document
const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: [true, "Name is required"], // Custom validation message
      trim: true,                           // Removes extra spaces
    },

    // User's email address
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,            // Ensures no two users have same email
      lowercase: true,         // Converts email to lowercase automatically
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,      // Simple email validation regex
        "Please provide a valid email address",
      ],
    },

    // Hashed password will be stored here
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
  },

  // Adds createdAt and updatedAt fields automatically
  { timestamps: true }
);

// Prevents model overwrite error in development (hot reload)
const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
