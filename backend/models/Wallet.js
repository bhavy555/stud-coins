import { DataTypes } from "sequelize"
import sequelize from "../config/db.js"
import User from "./index.js"


const Wallet = sequelize.define("Wallet", {
  balance: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  }
})

export default Wallet