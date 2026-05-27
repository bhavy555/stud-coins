import { DataTypes } from "sequelize"
import sequelize from "../config/db.js"
import User from "./User.js"

const Transaction = sequelize.define("Transaction", {
  from: DataTypes.INTEGER,
  to: DataTypes.INTEGER,
  amount: DataTypes.FLOAT
})

Transaction.belongsTo(User, {
  foreignKey: "from",
  as: "sender"
})

Transaction.belongsTo(User, {
  foreignKey: "to",
  as: "receiver"
})

export default Transaction