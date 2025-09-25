// middleware/protectRoute.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js"; // adjust path

const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Authorization header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Not authorized, no token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Defensive checks
    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({ error: "Not authorized, invalid token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, "mysupersecretkey");
    } catch (verifyErr) {
      console.error("JWT verify error:", verifyErr);
      return res.status(401).json({ error: "Token invalid or expired" });
    }

    // Attach user (DB lookup)
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Error in protectRoute:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export default protectRoute;
