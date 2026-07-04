import Transaction from "../models/Transaction.js"
import { User, Wallet, Log } from "../models/index.js"

export const payToVendor = async (req, res) => {
  try {
    const { vendorId, amount } = req.body
    const userId = req.user.id
    const sender = await User.findByPk(req.user.id)
    const receiver = await User.findByPk(vendorId)


    console.log("REQ.USER:", req.user)
    console.log("Payment request:", { vendorId, userId, amount })

    // ✅ FETCH USERS
    const userUser = await User.findByPk(userId)
    const vendorUser = await User.findByPk(vendorId)

    console.log("USER:", userUser?.role)
    console.log("VENDOR:", vendorUser?.role)

    // ✅ VALIDATIONS
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" })
    }

    if (!userUser) {
      return res.status(404).json({ message: "User not found" })
    }

    if (!vendorUser) {
      return res.status(404).json({ message: "Vendor not found" })
    }

    // ✅ ROLE CHECK (IMPORTANT)
    if (userUser.role !== "user") {
      console.log("❌ Wrong user role:", userUser.role)
      return res.status(403).json({ message: "Only users can pay" })
    }

    if (vendorUser.role !== "vendor") {
      console.log("❌ Wrong vendor role:", vendorUser.role)
      return res.status(403).json({ message: "Can only pay to vendors" })
    }

    // ✅ GET OR CREATE USER WALLET
    let userWallet = await Wallet.findOne({
      where: { UserId: userId }
    })

    if (!userWallet) {
      console.log("⚠️ Creating user wallet...")
      userWallet = await Wallet.create({
        UserId: userId,
        balance: 0
      })
    }

    // ✅ GET OR CREATE VENDOR WALLET
    let vendorWallet = await Wallet.findOne({
      where: { UserId: vendorId }
    })

    if (!vendorWallet) {
      console.log("⚠️ Creating vendor wallet...")
      vendorWallet = await Wallet.create({
        UserId: vendorId,
        balance: 0
      })
    }

    // ✅ BALANCE CHECK
    if (userWallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" })
    }

    // 💸 TRANSACTION
    userWallet.balance -= Number(amount)
    vendorWallet.balance += Number(amount)

    await userWallet.save()
    await vendorWallet.save()

    await Log.create({
      action: "PAYMENT",
      message: `${sender.username} paid ₹${amount} to ${receiver.shopName || receiver.username}`,
      createdBy: req.user.id
    })

    // 🧾 SAVE TRANSACTION
    const tx = await Transaction.create({
      from: userId,
      to: vendorId,
      amount
    })

    return res.json({
      message: "Payment successful",
      transaction: tx,
      balance: userWallet.balance
    })

  } catch (err) {
    console.error("PAYMENT ERROR:", err)
    return res.status(500).json({ error: err.message })
  }
}