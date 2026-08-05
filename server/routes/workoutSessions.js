import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import {
  getAllSessions,
  getIndividualSession,
  createSession,
  updateSession,
  updateTemplateExercise,
  deleteSession,
  getUserWorkoutHistory,
  getUserActivitySummary,
  todaysSession,
} from "../controllers/workoutSessions.js";

const router = Router();

router.get("/user/:user_id/history", getUserWorkoutHistory);
// Generates/returns the signed-in user's workout for today (needs req.auth).
router.get("/todayssession", todaysSession);
// Monthly grid + weekly bars for the signed-in user (needs req.auth).
router.get("/activity-summary", getUserActivitySummary);

router.get("/", getAllSessions);
router.get("/:id", getIndividualSession);
router.post("/", createSession);
router.patch("/updatesession", updateSession); // mark session started / completed here
router.patch("/exercise/:templateExerciseId", updateTemplateExercise); // mark an exercise complete
router.delete("/:id", deleteSession);

export default router;
