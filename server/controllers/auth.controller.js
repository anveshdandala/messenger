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
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullname,
      username,
      email,
      phone,
      password: hashedPassword,
    });

    if (newUser) {
      res.status(201).json({
        id: newUser.userId,
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in signup controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
