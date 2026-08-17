import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { createUser } from "../controllers/users.js";

const router = Router();

router.post("/", createUser);

export default router;
