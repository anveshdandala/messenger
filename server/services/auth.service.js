// server/services/auth.service.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Invalid credentials"); 
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error("Invalid credentials");
  }
  
  const token = jwt.sign(
    { id: user.userId, email: user.email },
    process.env.JWT_SECRET || "fallback_secret_key", 
    { expiresIn: "24h" }
  );

  // 4. Return the data needed for the response
  return {
    token,
    user: {
      id: user.userId,
      email: user.email,
      fullname: user.fullname,
    },
  };
};