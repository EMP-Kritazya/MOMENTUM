import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import {
  getAllSessions,
  getIndividualSession,
  createSession,
  updateSession,
  deleteSession,
  getUserWorkoutHistory,
  todaysSession,
} from "../controllers/workoutSessions.js";

const router = Router();

router.get("/user/:user_id/history", getUserWorkoutHistory);
// Generates/returns the signed-in user's workout for today (needs req.auth).
router.get("/todayssession", authenticateToken, todaysSession);

router.get("/", getAllSessions);
router.get("/:id", getIndividualSession);
router.post("/", createSession);
router.patch("/:id", updateSession); // mark complete lives here
router.delete("/:id", deleteSession);

export default router;
