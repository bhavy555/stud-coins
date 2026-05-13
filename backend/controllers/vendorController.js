import Transaction from "../models/Transaction.js"
import { Op } from "sequelize"
import { User } from "../models/index.js"

// ✅ STATS
export const getVendorStats = async (req, res) => {
    try {
        const vendorId = req.user.id

        const now = new Date()

        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 999)

        const transactions = await Transaction.findAll({
            where: {
                to: vendorId,
                // createdAt: {
                //     [Op.gte]: startOfDay,
                //     [Op.lte]: endOfDay
                // }
            }
        })

        const sales = transactions.reduce((sum, t) => sum + Number(t.amount), 0)
        const orders = transactions.length

        res.json({ sales, orders })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}


// ✅ TRANSACTIONS (FIXED)
export const getVendorTransactions = async (req, res) => {
    try {
        const vendorId = req.user.id

        const transactions = await Transaction.findAll({
            where: { to: vendorId },
            order: [["createdAt", "DESC"]]
        })

        // 🔥 FIX: attach sender name
        const formatted = await Promise.all(
            transactions.map(async (t) => {
                const sender = await User.findByPk(t.from)

                return {
                    id: t.id,
                    amount: t.amount,
                    name: sender ? sender.username : "Unknown",
                    createdAt: t.createdAt
                }
            })
        )

        res.json({ transactions: formatted })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}