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
        const { username, password, role, secretKey, category, shopName } = req.body

        const existing = await User.findOne({ where: { username } })
        if (existing) {
            return res.status(400).json({ message: "User already exists" })
        }

        if (role === "teacher" || role === "vendor") {
            if (!secretKey) {
                return res.status(400).json({ message: "Approval key required" })
            }

            const request = await ApprovalRequest.findOne({
                where: {
                    username,
                    generatedKey: secretKey,
                    status: "approved"
                }
            })

            if (!request) {
                return res.status(403).json({ message: "Invalid or expired key" })
            }

            request.status = "used"
            await request.save()
        }

        const hashed = bcrypt.hashSync(password, 8)

        const user = await User.create({
            username,
            password: hashed,
            role,
            category: role === "vendor" ? category : null,
            shopName: role === "vendor" ? shopName : null,
            discount: role === "vendor" ? req.body.discount || 0 : 0
        })

        await Wallet.create({
            UserId: user.id,
            balance: 0
        })

        user.qrCode = `studcoin://pay?userId=${user.id}`
        await user.save()

        await Log.create({
            action: "USER_CREATED",
            message: `User created: ${user.username}`,
            createdBy: req.user?.id || user.id,
            targetUser: user.username,
            targetRole: user.role
        })

        const token = jwt.sign(
            { id: user.id, role: user.role },
            SECRET,
            { expiresIn: "1h" }
        )

        return res.json({
            message: `${role} created successfully`,
            token,
            role: user.role,
            userId: user.id
        })

    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

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