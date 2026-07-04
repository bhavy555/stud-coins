import { DataTypes } from "sequelize"
import sequelize from "../config/db.js"

const ApprovalRequest = sequelize.define("ApprovalRequest", {

  username: {
    type: DataTypes.STRING,
    allowNull: false
  },

  role: {
    type: DataTypes.STRING,
    allowNull: false
  },

  type: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // Signup Data
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  category: {
    type: DataTypes.STRING,
    allowNull: true
  },

  shopName: {
    type: DataTypes.STRING,
    allowNull: true
  },

  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  // Approval Status
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending"
  },

  generatedKey: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // Audit
  approvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  rejectedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },

  rejectedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }

})

export default ApprovalRequest