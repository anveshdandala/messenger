import sequelize from "../config/database.js";
import User from "./user.model.js";
import Friend from "./friends.model.js";

// Associations
User.hasMany(Friend, { foreignKey: "requesterId", as: "requestsSent" });
User.hasMany(Friend, { foreignKey: "receiverId", as: "requestsReceived" });

Friend.belongsTo(User, { foreignKey: "requesterId", as: "Requester" });
Friend.belongsTo(User, { foreignKey: "receiverId", as: "Receiver" });

export { sequelize, User, Friend };
