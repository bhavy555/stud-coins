import { DataTypes } from "sequelize"
import sequelize from "../config/db.js"
import Wallet from "./index.js"

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    unique: true
  },
  qrCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profilePhoto: {
    type: DataTypes.STRING,
    allowNull: true
  },

  fullName: {
    type: DataTypes.STRING,
    allowNull: true
  },

  email: {
    type: DataTypes.STRING,
    allowNull: true
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  paymentId: {
    type: DataTypes.STRING,
    allowNull: true
  },

  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  shopName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: {
    type:DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  resetCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  recoveryKey: {
    type: DataTypes.STRING,
    allowNull: true
  },
  recoveryQr: {
    type: DataTypes.TEXT,
    allowNull: true
  },

})


export default User