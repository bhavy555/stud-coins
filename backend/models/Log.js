import { DataTypes } from "sequelize"
import sequelize from "../config/db.js"

const Log = sequelize.define("Log", {
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    targetUser: {
        type: DataTypes.STRING,
        allowNull: true
    },
    targetRole: {
        type: DataTypes.STRING,
        allowNull: true
    },
    meta: {
        type: DataTypes.JSON,
        allowNull: true
    } 
})

export default Log