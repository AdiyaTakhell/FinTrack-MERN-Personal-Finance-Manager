import UserModel from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//
// Helper function: Generates a JWT token for the user
//
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,     // User ID
      email: user.email, // User email
      name: user.name    // Added: send user's name inside token
    },
    process.env.JWT_SECRET,  // Secret key from .env file
    { expiresIn: "7d" }      // Token valid for 7 days
  );
};

//
// Register New User
//
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Step 1: Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Step 2: Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Step 3: Hash password before saving to database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 4: Create and save new user
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Step 5: Generate token for newly registered user
    const token = generateToken(newUser);

    // Step 6: Send success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });

  } catch (err) {
    console.error("Error in registerUser:", err.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

//
// Login User
//
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Check if the email exists in the database
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Step 2: Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Step 3: Generate token for logged-in user
    const token = generateToken(user);

    // Step 4: Send success response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("Error in loginUser:", err.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { registerUser, loginUser };
