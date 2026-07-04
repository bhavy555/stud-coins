
import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import path from "path"

import sequelize from "./config/db.js"
import listEndpoints from "express-list-endpoints"
// ✅ MODELS
import { User, Wallet, Log } from "./models/index.js"
import "./models/Transaction.js"
import authRoutes from "./routes/authRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"

// ✅ ROUTES
import userRoutes from "./routes/userRoutes.js"
import vendorRoutes from "./routes/vendorRoutes.js"
import profileRoutes from "./routes/profileRoutes.js"


const app = express()

app.use(cors())
// app.use(cors({
//   origin: true,
//   credentials: true
// }))
app.use(express.json())

// app.use(
//   "/uploads",
//   express.static(path.join(process.cwd(), "uploads"))
// )

app.use("/uploads", express.static("uploads"))

const SECRET = process.env.JWT_SECRET
// ================= DB CONNECT =================
;(async () => {
  try {
    await sequelize.authenticate()
    console.log("DB Connected")

    await sequelize.sync()
    // await sequelize.sync({ alter: true })

    console.log("Tables synced")

    // app.listen(5000, () => {
    //   console.log("Server running on port 5000")
    // })
    app.listen(5000, "0.0.0.0", () => {
      console.log("Server running on port 5000")
    })

  } catch (err) {
    console.error(err)
  }
})()


// ================= LOGIN =================
app.post("/login", async (req, res) => {
  const { username, password } = req.body

  console.log("LOGIN REQUEST:", username, password)

  try {
    const user = await User.findOne({ where: { username } })
    // console.log("USER FOUND:", user ? user.username : "No user");exit();
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const valid = bcrypt.compareSync(password, user.password)

    if (!valid) {
      return res.status(401).json({ message: "Invalid password" })
    }

    console.log("LOGIN SUCCESS:", user.role)/

    await Log.create({
      action: "LOGIN",
      message: `User logged in: ${user.username}`,
      createdBy: user.id,
      targetUser: user.username,
      targetRole: user.role
    })

    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET,
      { expiresIn: "1h" }
    )
    
    res.json({
      token,
      role: user.role,
      userId: user.id
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// ================= ROUTES =================
app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/vendor", vendorRoutes)
app.use("/api/profile", profileRoutes)

// console.log(listEndpoints(app))