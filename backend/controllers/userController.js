import { User, Wallet, Log } from "../models/index.js"
import bcrypt from "bcryptjs"
import ApprovalRequest from "../models/ApprovalRequest.js"
import jwt from "jsonwebtoken"

const SECRET = "studcoin_secret"

// ============================
// ✅ CREATE USER (SIGNUP)
// ============================
export const createUser = async (req, res) => {
    try {

        const {
            username,
            password,
            role,
            category,
            shopName
        } = req.body

        const existingUser = await User.findOne({
            where: { username }
        })

        if (existingUser) {
            return res.status(400).json({
                message: "Username already exists"
            })
        }

        const existingRequest = await ApprovalRequest.findOne({
            where: {
                username,
                status: "pending"
            }
        })

        if (existingRequest) {
            return res.status(400).json({
                message: "Request already pending"
            })
        }

        const hashedPassword = bcrypt.hashSync(password, 8)

        await ApprovalRequest.create({
            username,
            password: hashedPassword,
            role,
            category: role === "vendor" ? category : null,
            shopName: role === "vendor" ? shopName : null,
            discount: role === "vendor"
                ? req.body.discount || 0
                : 0,
            status: "pending"
        })

        return res.json({
            message:
                "Signup request submitted. Wait for admin approval."
        })

    } catch (err) {

        return res.status(500).json({
            error: err.message
        })

    }
}

// ============================
// ✅ CREATE USER (SIGNUP)
// ============================


// ============================
// ✅ GET ALL USERS
// ============================
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ["id", "username", "role", "category", "shopName", "createdAt"],
            order: [["createdAt", "DESC"]]
        })

        return res.json({ users })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

// ============================
// ✅ DELETE USER
// ============================
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        const user = await User.findByPk(id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        await user.destroy()

        await Log.create({
            action: "DELETE_USER",
            message: `Deleted user ${user.username}`,
            createdBy: req.user?.id
        })

        return res.json({ message: "User deleted successfully" })

    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}