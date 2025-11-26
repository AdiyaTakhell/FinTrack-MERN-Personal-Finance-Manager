import jwt from "jsonwebtoken";
import { Types } from "mongoose";

const authMiddleware = (req, res, next) => {
  // Step 1: Read the Authorization header
  const authHeader = req.headers.authorization;

  // Step 2: Check if header exists and has "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided or invalid format."
    });
  }

  // Step 3: Extract the token (after "Bearer")
  const token = authHeader.split(" ")[1];

  try {
    // Step 4: Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 5: Check if decoded user ID is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(decoded.id)) {
      return res.status(401).json({
        success: false,
        message: "Invalid user ID in token"
      });
    }

    // Step 6: Attach the user data to the request object
    // Only attaching ID for performance.
    // If needed, the full user can be fetched from the DB.
    req.user = { id: decoded.id };

    // Step 7: Continue to next middleware or controller
    next();

  } catch (error) {
    // Step 8: Handle token expiration and invalid tokens
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired"
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

export default authMiddleware;
