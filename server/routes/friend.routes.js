import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  sendFriendRequest,
  respondToRequest,
  getFriends,
  getRequestNotifications,
} from "../controllers/friend.controller.js";

const router = express.Router();

router.post("/request", protectRoute, sendFriendRequest);
router.post("/respond", protectRoute, respondToRequest);
router.get("/", protectRoute, getFriends);
router.get("/notifications", protectRoute, getRequestNotifications);

export default router;

/**
 * @swagger
 * tags:
 *   - name: Friends
 *     description: Friend management endpoints
 */

/**
 * @swagger
 * /api/friends/request:
 *   post:
 *     summary: Send a friend request to another user
 *     tags:
 *       - Friends
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Data required to send a friend request (provide either toUserId or email)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               toUserId:
 *                 type: integer
 *                 description: ID of the user to send a request to
 *               email:
 *                 type: string
 *                 description: Email of the user to invite (optional alternative)
 *             required:
 *               - toUserId
 *     responses:
 *       201:
 *         description: Friend request sent successfully
 *       400:
 *         description: Bad request / validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/friends/respond:
 *   post:
 *     summary: Respond to an incoming friend request (accept/reject)
 *     tags:
 *       - Friends
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Request id and action to perform
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestId:
 *                 type: integer
 *               action:
 *                 type: string
 *                 enum: [accept, reject]
 *             required:
 *               - requestId
 *               - action
 *     responses:
 *       200:
 *         description: Request processed successfully
 *       400:
 *         description: Bad request / invalid action
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/friends:
 *   get:
 *     summary: Get authenticated user's friends list
 *     tags:
 *       - Friends
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of friend objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   avatar:
 *                     type: string
 *                   isOnline:
 *                     type: boolean
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/friends/notifications:
 *   get:
 *     summary: Get incoming friend request notifications
 *     tags:
 *       - Friends
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of friend request notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   requestId:
 *                     type: integer
 *                   fromUserId:
 *                     type: integer
 *                   fromUsername:
 *                     type: string
 *                   message:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 */
