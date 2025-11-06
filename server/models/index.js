import sequelize from "../config/database.js";
import User from "./user.model.js";
import Friend from "./friends.model.js";
import message from "./message.model.js";

// Associations
User.hasMany(Friend, { foreignKey: "requesterId", as: "requestsSent" });
User.hasMany(Friend, { foreignKey: "receiverId", as: "requestsReceived" });

Friend.belongsTo(User, { foreignKey: "requesterId", as: "Requester" });
Friend.belongsTo(User, { foreignKey: "receiverId", as: "Receiver" });

message.belongsTo(User, { as: "Sender", foreignKey: "senderId" });
message.belongsTo(User, { as: "Receiver", foreignKey: "receiverId" });
export { sequelize, User, Friend, message };
