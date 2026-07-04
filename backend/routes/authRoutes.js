import express from "express"
import { createUser } from "../controllers/userController.js"
import { createApprovalRequest, resetPassword } from "../controllers/authController.js"
import { requestLimiter } from "../middleware/rateLimiter.js"

const router = express.Router()

// ✅ SIGNUP ROUTE (ONLY ROUTE CALL)
router.post("/signup", createUser)

// key generation
router.post("/generate-key", requestLimiter, createApprovalRequest)
router.post("/forgot-password",resetPassword)

export default router