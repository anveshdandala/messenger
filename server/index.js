import path from "path";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import swaggerUi from "swagger-ui-express";
import { Server } from "socket.io";
// import swaggerFile from "./swagger-output.json" with { type: "json" };

import sequelize from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import friendsRouts from "./routes/friend.routes.js";
import messagesRoutes from "./routes/message.routes.js";
import expressOasGenerator from "express-oas-generator";
import { User, message as Message } from "./models/index.js";

dotenv.config();
const __dirname = path.resolve(); // needed for static path

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
console.log("✅ Swagger docs available at: http://localhost:5000/api-docs");

// Socket authentication
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token || token === "null" || token === "undefined") {
      return next(new Error("Unauthorized: token missing"));
    }

    const decoded = jwt.verify(token, "mysupersecretkey");
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return next(new Error("Unauthorized: user not found"));
    }

    socket.user = user;
    next();
  } catch (error) {
    next(new Error("Unauthorized: invalid token"));
  }
});

io.on("connection", (socket) => {
  const currentUserId = socket.user.userId;
  const userRoom = `user:${currentUserId}`;

  socket.join(userRoom);
  console.log(`Socket connected for user ${currentUserId}`);

  socket.on("send_message", async ({ receiverId, content }) => {
    try {
      if (!receiverId || !content || !content.trim()) {
        return;
      }

      const newMessage = await Message.create({
        senderId: currentUserId,
        receiverId: Number(receiverId),
        content: content.trim(),
      });

      const messageWithUsers = await Message.findByPk(newMessage.messageId, {
        include: [
          { model: User, as: "Sender", attributes: ["userId", "username"] },
          {
            model: User,
            as: "Receiver",
            attributes: ["userId", "username"],
          },
        ],
      });

      io.to(`user:${currentUserId}`).emit("receive_message", messageWithUsers);
      io.to(`user:${Number(receiverId)}`).emit(
        "receive_message",
        messageWithUsers,
      );
    } catch (error) {
      console.error("Error sending socket message:", error);
      socket.emit("message_error", { error: "Failed to send message" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected for user ${currentUserId}`);
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/friends", friendsRouts);
app.use("/api/messages", messagesRoutes);
console.log("api route setup done");

// (initialization moved to server.listen callback below)

// Connect to MySQL database
sequelize
  .sync()
  .then(() => {
    console.log("Connected to MySQL database successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

app.get("/", (req, res) => {
  res.json({ message: `this is 5000 root rout` });
});

// Static files (React build)
// app.use(express.static(path.join(__dirname, "client", "build")));

// app.get(/.*/, (req, res) => {
//   res.sendFile(path.join(__dirname, "client", "build", "index.html"));
// });

// // Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);

  // initialize OpenAPI generator after server is listening
  expressOasGenerator.init(app, {
    writeToFile: true,
    specOutputPath: "./openapi.json",
  });
});
