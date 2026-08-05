import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import {
  loginAdmin,
  getMe,
  logout,
  loginUser,
} from "../controllers/authController.js";

const router = Router();

// Handles administrator login at POST /api/auth/admin/login.
router.post("/admin/login", loginAdmin);

// Returns the authenticated user from the auth cookie.
router.get("/me", authenticateToken, getMe);

// Clears the auth cookie to end the session.
router.post("/logout", logout);

router.post("/login", loginUser);

export default router;
