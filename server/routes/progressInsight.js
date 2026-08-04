import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { myProgressInsight } from "../controllers/progressInsight.js";

const router = Router();

router.get("/", myProgressInsight);

export default router;
