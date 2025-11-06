import { User, Friend } from "../models/index.js";
import { Op } from "sequelize";

export const sendFriendRequest = async (req, res) => {
  try {
    const { friendEmail } = req.body;

    console.log("sender called with:", friendEmail);
    const requesterId = req.user.userId;
    const receiver = await User.findOne({ where: { email: friendEmail } });
    if (!receiver) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("requested user id:", requesterId);
    console.log("receiving user:", receiver); //success
    // Prevent sending request to yourself
    if (receiver.userId === requesterId) {
      return res.status(400).json({ error: "Cannot add yourself" });
    }

    // 2. Checks if already exists
    const existing = await Friend.findOne({
      where: {
        requesterId,
        receiverId: receiver.userId,
      },
    });
    if (existing) {
      return res.status(400).json({ error: "Request already sent" });
    }

    // 3. friend request Created
    const request = await Friend.create({
      requesterId,
      receiverId: receiver.userId,
      status: "pending",
    });
    res.json({ message: "Friend request sent", request });
  } catch (e) {
    console.error("sendFriendRequest error:", e);
    res.status(500).json({ error: "Server error" });
  }
};

export const respondToRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body; // action = "accepted" | "rejected"
    const userId = req.user.userId;

    const request = await Friend.findByPk(requestId);
    if (!request) return res.status(404).json({ error: "Request not found" });

    // only receiver can respond
    if (request.receiverId !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    request.status = action;
    await request.save();

    res.json({ message: `Request ${action}`, request });
  } catch (err) {
    console.error("respondToRequest error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
export const getFriends = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("fetching available friends for user:", userId);
    const friends = await Friend.findAll({
      where: {
        status: "accepted",
        [Op.or]: [{ requesterId: userId }, { receiverId: userId }],
      },
      include: [
        {
          model: User,
          as: "Requester",
          attributes: ["userId", "fullname", "email"],
        },
        {
          model: User,
          as: "Receiver",
          attributes: ["userId", "fullname", "email"],
        },
      ],
    });

    const plainFriends = friends.map((f) => ({
      id: f.id,
      requesterId: f.requesterId,
      receiverId: f.receiverId,
      status: f.status,
      createdAt: f.createdAt,
      requester: f.Requester.dataValues,
      receiver: f.Receiver.dataValues,
    }));
    console.log("friends of user", userId, ":", plainFriends);
    res.json(plainFriends);
  } catch (err) {
    console.error("getFriends error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getRequestNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const requests = await Friend.findAll({
      where: {
        receiverId: userId,
        status: "pending",
      },
      include: [
        {
          model: User,
          as: "Requester",
          attributes: ["userId", "fullname", "email"],
        },
        {
          model: User,
          as: "Receiver",
          attributes: ["userId", "fullname", "email"],
        },
      ],
    });

    res.json({ requests });
  } catch (err) {
    console.error("getRequestNotifications error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
