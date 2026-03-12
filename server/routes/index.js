
import express from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import friendRoutes from "./friend.routes.js"; // Note: Fixed potential typo "friendsRouts" -> "friendRoutes" if preferred, but using file name logic
import messageRoutes from "./message.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/friends", friendRoutes);
router.use("/messages", messageRoutes);

export default router;
