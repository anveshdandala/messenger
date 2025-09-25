import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  sendFriendRequest,
  respondToRequest,
  getFriends,
} from "../controllers/friend.controller.js";

const router = express.Router();

router.post("/request", protectRoute, sendFriendRequest);
router.post("/respond", protectRoute, respondToRequest);
router.get("/", protectRoute, getFriends);

export default router;
