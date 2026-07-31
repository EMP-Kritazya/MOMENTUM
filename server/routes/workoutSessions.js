import { Router } from "express";
import {
  getAllSessions,
  getIndividualSession,
  createSession,
  updateSession,
  deleteSession,
  getUserWorkoutHistory
} from "../controllers/workoutSessions.js";

const router = Router();

router.get("/user/:user_id/history", getUserWorkoutHistory);
router.get("/", getAllSessions);
router.get("/:id", getIndividualSession);
router.post("/", createSession);
router.patch("/:id", updateSession); // mark complete lives here
router.delete("/:id", deleteSession);


export default router;
