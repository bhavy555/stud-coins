import express from "express"
import { auth } from "../middleware/auth.js"
import { getVendorStats, getVendorTransactions } from "../controllers/vendorController.js"

const router = express.Router()

// ✅ Vendor Dashboard APIs
router.get("/stats", auth, getVendorStats)
router.get("/transactions", auth, getVendorTransactions)

export default router