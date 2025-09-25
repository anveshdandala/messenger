import express from "express";
import { getMe } from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/me", protectRoute, getMe);
//this
//inside testing branch
export default router;
