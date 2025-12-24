import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger-output.json" assert { type: "json" };

import sequelize from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import friendsRouts from "./routes/friend.routes.js";
import messagesRoutes from "./routes/message.routes.js";
import expressOasGenerator from "express-oas-generator";

dotenv.config();
const __dirname = path.resolve(); // needed for static path

const app = express();
expressOasGenerator.init(app, {
  writeToFile: true,
  specOutputPath: "./openapi.json",
});
// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
console.log("✅ Swagger docs available at: http://localhost:5000/api-docs");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/friends", friendsRouts);
app.use("/api/messages", messagesRoutes);
console.log("api route setup done");

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
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
