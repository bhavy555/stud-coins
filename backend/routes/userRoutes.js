import express from "express"
import { payToVendor } from "../controllers/paymentController.js"
import Transaction from "../models/Transaction.js"
import { Op } from "sequelize"
import { auth } from "../middleware/auth.js"

import { User, Wallet, Log } from "../models/index.js"

const router = express.Router()


// ================= WALLET =================
router.get("/wallet", auth, async (req, res) => {
  try {
    const userId = req.user.id

    const wallet = await Wallet.findOne({
      where: { UserId: userId }
    })

    if (!wallet) {
      return res.json({ balance: 0 })
    }
    res.json({ balance: wallet.balance })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// ================= OFFERS =================
// 🔥 ready for DB later
router.get("/offers", auth, async (req, res) => {
  try {
    const offers = [
      {
        id: 1,
        title: "20% off at Campus Cafe",
        discount: "20%",
        category: "Food"
      },
      {
        id: 2,
        title: "Buy 2 Get 1 Free Books",
        discount: "33%",
        category: "Books"
      }
    ]

    res.json({ offers })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// ================= TRANSACTIONS =================
router.get("/transactions", auth, async (req, res) => {
  try {
    const userId = req.user.id

    const transactions = await Transaction.findAll({
      where: {
        [Op.or]: [
          { from: userId },
          { to: userId }
        ]
      },

      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "username", "shopName"]
        },
        {
          model: User,
          as: "receiver",
          attributes: ["id", "username", "shopName"]
        }
      ],

      order: [["createdAt", "DESC"]]
    })

    res.json({ transactions })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// ================= PAYMENT =================
router.post("/pay", auth, async (req, res, next) => {
  try {
    // 🔥 sanitize input
    req.body.amount = Number(req.body.amount)

    if (!req.body.vendorId || !req.body.amount) {
      return res.status(400).json({ message: "vendorId and amount required" })
    }

    next()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}, payToVendor)


// ================= FUTURE (QR SUPPORT) =================
// placeholder for QR payment
router.post("/pay/qr", auth, (req, res) => {
  res.json({ message: "QR payment endpoint coming next" })
})

// ✅ ADD MONEY
router.post("/add-money", auth, async (req, res) => {
  try {
    const { amount } = req.body
    const userId = req.user.id

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" })
    }

    const wallet = await Wallet.findOne({
      where: { UserId: userId }
    })

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" })
    }

    wallet.balance += Number(amount)
    await wallet.save()

    await Log.create({
      action: "ADD_MONEY",
      message: `Added ₹${amount}`,
      createdBy: req.user.id
    })

    res.json({
      message: "Money added successfully",
      balance: wallet.balance
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// ✅ GET VENDORS (with category)
router.get("/vendors", auth, async (req, res) => {
  try {
    const { category } = req.query

    const where = { role: "vendor" }

    if (category) {
      where.category = category // if you added category in DB
    }

    const vendors = await User.findAll({
      where,
      attributes: [
        "id",
        "username",
        "category",
        "shopName",
        "discount"
      ]
    })

    res.json({ vendors })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


export default router