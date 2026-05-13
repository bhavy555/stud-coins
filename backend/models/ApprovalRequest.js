import { DataTypes } from "sequelize"
import sequelize from "../config/db.js"

const ApprovalRequest = sequelize.define("ApprovalRequest", {
  username: DataTypes.STRING,
  role: DataTypes.STRING,
  type: DataTypes.STRING,

  status: {
    type: DataTypes.STRING,
    defaultValue: "pending"
  },

  generatedKey: DataTypes.STRING,

  // 🔐 AUDIT FIELDS
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