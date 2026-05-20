import ApprovalRequest from "../models/ApprovalRequest.js"

import { User, Wallet, Log } from "../models/index.js"

import Transaction from "../models/Transaction.js"

import { logAction } from "../utils/logAction.js"

export const getAdminStats = async (req, res) => {
  try {
    const users = await User.count({ where: { role: "user" } })
    const teachers = await User.count({ where: { role: "teacher" } })
    const vendors = await User.count({ where: { role: "vendor" } })

    const wallets = await Wallet.findAll()

    const revenue = wallets.reduce((sum, w) => sum + w.balance, 0)

    res.json({
      users,
      teachers,
      vendors,
      revenue
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getPendingRequests = async (req, res) => {
  try {
    const requests = await ApprovalRequest.findAll({
      where: { status: "pending" }
    })

    res.json({ requests })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getAdminActivity = async (req, res) => {
  try {
    const users = await User.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5
    })

    const transactions = await Transaction.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5
    })

    const approvals = await ApprovalRequest.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5
    })

    let activity = []

    // map users
    users.forEach(u => {
      activity.push({
        text: `User created: ${u.username}`,
        time: u.createdAt
      })
    })

    // map transactions
    transactions.forEach(t => {
      activity.push({
        text: `Payment: ${t.amount} coins`,
        time: t.createdAt
      })
    })

    // map approvals
    approvals.forEach(a => {
      activity.push({
        text: `Approval: ${a.username} (${a.status})`,
        time: a.createdAt
      })
    })

    // 🔥 SORT (NEW FIRST)
    activity.sort((a, b) => new Date(b.time) - new Date(a.time))

    // only latest 6
    const finalActivity = activity.slice(0, 6)

    res.json({ activities: finalActivity })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params

    const request = await ApprovalRequest.findByPk(id)

    if (!request) {
      return res.status(404).json({ message: "Request not found" })
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Already processed" })
    }

    request.status = "rejected"

    // 🔐 NEW: AUDIT TRACKING
    request.rejectedBy = req.user.id
    request.rejectedAt = new Date()
    await request.save()

    const admin = await User.findByPk(req.user.id)

    await Log.create({
      action: "REJECT_REQUEST",
      message: `Admin ${admin.username} rejected ${request.username}`,
      createdBy: req.user.id,
      targetUser: request.username,
      targetRole: request.role
    })

    res.json({
      message: "Request rejected successfully",
      requestId: request.id
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getHistory = async (req, res) => {
  try {
    const requests = await ApprovalRequest.findAll({
      order: [["createdAt", "DESC"]]
    })

    res.json({ requests })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { username, role } = req.body

    // ✅ DEFINE USER FIRST
    const user = await User.findByPk(id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (username) user.username = username
    if (role) user.role = role

    await user.save()

    await Log.create({
      action: "USER_UPDATED",
      message: `Updated user ${user.username}`,
      createdBy: req.user.id,
      targetUser: user.username,
      targetRole: user.role
    })

    res.json({
      message: "User updated successfully",
      user
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}