import express from "express";
import { getMe } from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/me", protectRoute, getMe);
export default router;
/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                   description: The user ID
 *                 username:
 *                   type: string
 *                   description: The username
 *                 email:
 *                   type: string
 *                   description: User's email
 *                 fullname:
 *                   type: string
 *                   description: User's full name
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Account creation date
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: User not found
 */
