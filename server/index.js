import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/database.js";
import routes from "./routes/index.js";
import { setupSwagger } from "./config/swagger.js";

dotenv.config();
const __dirname = path.resolve();

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);

app.use("/api", routes);
console.log("api route setup done");

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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
