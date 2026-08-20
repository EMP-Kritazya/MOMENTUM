import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import {
  loginAdmin,
  getMe,
  logout,
  loginUser,
  signUpUser,
  sessionFromToken,
} from "../controllers/authController.js";

const router = Router();

// Handles administrator login at POST /api/auth/admin/login.
router.post("/admin/login", loginAdmin);

// Returns the authenticated user from the auth cookie.
router.get("/me", authenticateToken, getMe);

// Clears the auth cookie to end the session.
router.post("/logout", logout);

router.post("/login", loginUser);

router.post("/signup", signUpUser);

// Exchanges a token minted by the GitHub OAuth callback redirect for the
// httpOnly auth cookie via a direct fetch (see sessionFromToken).
router.post("/session", sessionFromToken);

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({ success: true, user: req.user });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({ success: false, user: "failure" });
});

export default router;
