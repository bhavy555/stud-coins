import Transaction from "../models/Transaction.js"
import { User, Wallet, Log } from "../models/index.js"

export const payToVendor = async (req, res) => {
  try {
    const { vendorId, amount } = req.body
    const studentId = req.user.id

    console.log("REQ.USER:", req.user)
    console.log("Payment request:", { vendorId, studentId, amount })

    // ✅ FETCH USERS
    const studentUser = await User.findByPk(studentId)
    const vendorUser = await User.findByPk(vendorId)

    console.log("STUDENT:", studentUser?.role)
    console.log("VENDOR:", vendorUser?.role)

    // ✅ VALIDATIONS
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" })
    }

    if (!studentUser) {
      return res.status(404).json({ message: "Student not found" })
    }

    if (!vendorUser) {
      return res.status(404).json({ message: "Vendor not found" })
    }

    // ✅ ROLE CHECK (IMPORTANT)
    if (studentUser.role !== "student") {
      console.log("❌ Wrong student role:", studentUser.role)
      return res.status(403).json({ message: "Only students can pay" })
    }

    if (vendorUser.role !== "vendor") {
      console.log("❌ Wrong vendor role:", vendorUser.role)
      return res.status(403).json({ message: "Can only pay to vendors" })
    }

    // ✅ GET OR CREATE STUDENT WALLET
    let studentWallet = await Wallet.findOne({
      where: { UserId: studentId }
    })

    if (!studentWallet) {
      console.log("⚠️ Creating student wallet...")
      studentWallet = await Wallet.create({
        UserId: studentId,
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
    if (studentWallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" })
    }

    // 💸 TRANSACTION
    studentWallet.balance -= Number(amount)
    vendorWallet.balance += Number(amount)

    await studentWallet.save()
    await vendorWallet.save()

    await Log.create({
      action: "PAYMENT",
      message: `Payment of ${amount} coins`,
      createdBy: req.user.id
    })

    // 🧾 SAVE TRANSACTION
    const tx = await Transaction.create({
      from: studentId,
      to: vendorId,
      amount
    })

    return res.json({
      message: "Payment successful",
      transaction: tx,
      balance: studentWallet.balance
    })

  } catch (err) {
    console.error("PAYMENT ERROR:", err)
    return res.status(500).json({ error: err.message })
  }
}