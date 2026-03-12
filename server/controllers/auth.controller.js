import { User, Friend } from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as authService from "../services/auth.service.js";
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await authService.loginUser(email, password);

    res.status(200).json(result);

  } catch (err) {
    console.error("Login Error:", err.message);
    
    if (err.message === "Invalid credentials") {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signup = async (req, res) => {
  try {
    console.log("signup called with req",req.body);
    const { fullname, username, email, password, phone, confirmPassword } =
      req.body;

    if (!fullname || !username || !password || !confirmPassword || !email) {
      return res
        .status(400)
        .json({ error: "Please fill in all required fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const result = await authService.signupUser(fullname, username, email, password, phone, confirmPassword);

    res.status(201).json(result);
    
  } catch (error) {
    console.error("Error in signup controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
