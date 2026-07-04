import { User , ApprovalRequest , Log } from "../models/index.js"
import bcrypt from "bcryptjs"

// const admin = await User.findByPk(req.user.id)

export const createApprovalRequest  = async (req, res) => {
  try {
    const { username, role } = req.body

    if (!username || !role) {
      return res.status(400).json({ message: "Missing fields" })
    }

    if (!["teacher", "vendor", "user"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" })
    }

    const existing = await ApprovalRequest.findOne({
      where: { username, status: "pending" }
    })

    if (existing) {
      return res.json({ message: "Request already sent" })
    }

    const request = await ApprovalRequest.create({
      username,
      role,
      type: role,
      status: "pending"
    })

    res.json({
      message: "Request sent to admin",
      requestId: request.id
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// export const approveRequest = async (req, res) => {
//   try {
//     const { id } = req.params

//     // 1. Find request
//     const request = await ApprovalRequest.findByPk(id)

//     if (!request) {
//       return res.status(404).json({ message: "Request not found" })
//     }

//     if (request.status !== "pending") {
//       return res.status(400).json({ message: "Already processed" })
//     }

//     // 2. Generate secret key (simple version)
//     const secretKey =
//       "SEC-" + Math.random().toString(36).substring(2, 10).toUpperCase()

//     // 3. Update request
//     request.status = "approved"
//     request.generatedKey = secretKey

//     await request.save()

//     res.json({
//       message: "Request approved successfully",
//       requestId: request.id,
//       secretKey
//     })

//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// }

export const approveRequest = async (req, res) => {
  try {
    const { id } = req.params
    
    // ✅ 1. Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" })
    }
    
    // ✅ 2. Find request
    const request = await ApprovalRequest.findByPk(id)
    
    if (!request) {
      return res.status(404).json({ message: "Request not found" })
    }
    
    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Already processed",
        status: request.status
      })
    }
    
    // ✅ 3. Generate key
    const secretKey =
    "SEC-" + Math.random().toString(36).substring(2, 10).toUpperCase()
    
    // ✅ 4. Update request
    request.status = "approved"
    request.generatedKey = secretKey

    
    // 🔐 NEW: AUDIT TRACKING
    request.approvedBy = req.user.id
    request.approvedAt = new Date()
    
    await request.save()
    
    const user = await User.create({

      username: request.username,
      password: request.password,
      role: request.role,

      category: request.category,
      shopName: request.shopName,
      discount: request.discount

    })

    // await Wallet.create({
    //   UserId: user.id,
    //   balance: 0
    // })

    // user.qrCode = `studcoin://pay?userId=${user.id}`

    // const recoveryKey =
    //   "REC-" +
    //   Math.random()
    //     .toString(36)
    //     .substring(2, 8)
    //     .toUpperCase() +
    //   "-" +
    //   Date.now()
    //     .toString()
    //     .slice(-4)

    // user.recoveryKey = recoveryKey

    // user.recoveryQr =
    //   `studcoin://recover?userId=${user.id}&key=${recoveryKey}`

    //   await user.save()

    const admin = await User.findByPk(req.user.id)

    // const user = await User.findOne({ where: { username } })

    await Log.create({
      action: "APPROVE_REQUEST",
      message: `Admin ${admin.username} approved ${request.username}`,
      createdBy: req.user.id,
      targetUser: request.username,
      targetRole: request.role
    })
    
    // ✅ 5. Response
    res.json({
      message: "Request approved successfully",
      // requestId: request.id,
      secretKey
    })
    
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const resetPassword = async (req, res) => {

  try {

    const {
      username,
      recoveryKey,
      newPassword
    } = req.body

    if (!username || !recoveryKey || !newPassword) {
      return res.status(400).json({
        message: "Missing fields"
      })
    }

    const user = await User.findOne({
      where: { username }
    })

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    if (user.recoveryKey !== recoveryKey) {
      return res.status(401).json({
        message: "Invalid recovery key"
      })
    }

    user.password = bcrypt.hashSync(newPassword, 8)

    await user.save()

    await Log.create({
      action: "PASSWORD_RESET",
      message: `Password reset for ${user.username}`,
      createdBy: user.id,
      targetUser: user.username,
      targetRole: user.role
    })

    res.json({
      message: "Password updated successfully"
    })

  } catch (err) {

    res.status(500).json({
      error: err.message
    })

  }

}