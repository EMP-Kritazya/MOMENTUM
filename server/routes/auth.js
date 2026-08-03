import { Router } from "express"
import { loginAdmin } from "../controllers/authController.js"

const router = Router()

// Handles administrator login at POST /api/auth/admin/login.
router.post("/admin/login", loginAdmin)
export default router
