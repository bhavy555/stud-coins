import { Log } from "../models/index.js"
import { Op } from "sequelize"

export const getLogs = async (req, res) => {
    try {
        const { action, search, from, to, username, role } = req.query

        let where = {}

        if (action) {
            where.action = action
        }

        if (username) {
            where.targetUser = {
                [Op.iLike]: `%${username}%`
            }
        }

        if (role) {
            where.targetRole = role
        }

        if (search) {
            where = {
                ...where,
                [Op.or]: [
                    { message: { [Op.iLike]: `%${search}%` } },
                    { targetUser: { [Op.iLike]: `%${search}%` } }
                ]
            }
        }

        if (from || to) {
            where.createdAt = {}

            if (from) where.createdAt[Op.gte] = new Date(from)
            if (to) where.createdAt[Op.lte] = new Date(to)
        }

        const logs = await Log.findAll({
            where,
            order: [["createdAt", "DESC"]],
            limit: 100
        })

        res.json({ logs })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}