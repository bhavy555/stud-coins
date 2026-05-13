import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
console.log("JWT check:", process.env.JWT_SECRET)

const SECRET = process.env.JWT_SECRET || "fallback_secret"

// 🔐 VERIFY TOKEN
export const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" })
    }

    // Expect: Bearer TOKEN
    const parts = authHeader.split(" ")

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Invalid token format" })
    }

    const token = parts[1]

    const decoded = jwt.verify(token, SECRET)
    
    if (!decoded.id || !decoded.role) {
      return res.status(401).json({
        message: "Invalid token payload"
      })
    }

    req.user = decoded // { id, role }

    next()

  } catch (err) {

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
        code: "TOKEN_EXPIRED"
      })
    }

    return res.status(401).json({
      message: "Invalid token",
      code: "INVALID_TOKEN"
    })
  }
}


// 🔒 ADMIN CHECK
export const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" })
    }

    next()

  } catch (err) {
    return res.status(500).json({ message: "Server error" })
  }
}