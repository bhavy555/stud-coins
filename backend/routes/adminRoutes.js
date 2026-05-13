import express from "express"
import { createUser, getAllUsers, deleteUser } from "../controllers/userController.js"
import { getPendingRequests } from "../controllers/adminController.js"
import { getLogs } from "../controllers/logController.js"
import { approveRequest } from "../controllers/authController.js"
import { getAdminStats, getAdminActivity, rejectRequest, getHistory, updateUser } from "../controllers/adminController.js"
import { auth, isAdmin } from "../middleware/auth.js"

const router = express.Router()

// 🔐 GET PENDING REQUESTS
router.get("/pending", auth, isAdmin, getPendingRequests)

// 🔐 GET ADMIN STATS
router.get("/stats", auth, isAdmin, getAdminStats)

// 🔐 ADMIN ACTIVITY
router.get("/activity", auth, isAdmin, getAdminActivity)

// 🔐 APPROVE REQUEST
router.post("/approve/:id", auth, isAdmin, approveRequest)

// 🔐 REJECT REQUEST
router.post("/reject/:id", auth, isAdmin, rejectRequest)

// GET HISTORY OF ALL REQUESTS
router.get("/history", auth, isAdmin, getHistory)

router.post("/create-user", auth, isAdmin, createUser)

router.get("/users", auth, isAdmin, getAllUsers)

router.delete("/users/:id", auth, isAdmin, deleteUser)

router.put("/users/:id", auth, isAdmin, updateUser)

router.get("/logs", auth, isAdmin, getLogs)

export default router