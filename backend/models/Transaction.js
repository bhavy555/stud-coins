import { DataTypes } from "sequelize"
import sequelize from "../config/db.js"

const Transaction = sequelize.define("Transaction", {
  from: DataTypes.INTEGER,
  to: DataTypes.INTEGER,
  amount: DataTypes.FLOAT
})

export default Transaction