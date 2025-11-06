import protectRoute from "../middleware/protectRoute.js";
import { getMessage } from "../controllers/message.controller.js";
import express from "express";
import { sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/:friendId", protectRoute, getMessage);
router.post("/:friendId", protectRoute, sendMessage);

export default router;

/**
 * @swagger
 * /api/messages/{friendId}:
 *   get:
 *     summary: Retrieve messages between the authenticated user and a friend
 *     tags:
 *       - Messages
 *     parameters:
 *       - in: path
 *         name: friendId
 *         required: true
 *         description: ID of the friend to retrieve messages with
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of message objects
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Friend or messages not found
 *
 *   post:
 *     summary: Send a message to a friend
 *     tags:
 *       - Messages
 *     parameters:
 *       - in: path
 *         name: friendId
 *         required: true
 *         description: ID of the friend to send a message to
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Message payload
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Text content of the message
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Optional attachment URLs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Message created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
