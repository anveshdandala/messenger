import { message as Message, User } from "../models/index.js";
import { Op } from "sequelize";

export const getMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const friendId = parseInt(req.params.friendId, 10);

    console.log("Fetching messages between:", userId, "and", friendId);

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
      },
      include: [
        { model: User, as: "Sender", attributes: ["userId", "username"] },
        { model: User, as: "Receiver", attributes: ["userId", "username"] },
      ],
      order: [["timestamp", "ASC"]],
    });

    res.status(200).json({ messages, currentUserId: userId });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const receiverId = parseInt(req.params.friendId, 10);
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Message content cannot be empty" });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      content: content.trim(),
    });

    console.log("sent message:", newMessage);

    const messageWithSender = await Message.findByPk(newMessage.messageId, {
      include: [
        { model: User, as: "Sender", attributes: ["userId", "username"] },
        { model: User, as: "Receiver", attributes: ["userId", "username"] },
      ],
    });

    res.status(201).json({ message: messageWithSender });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};
