import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
  getAllExercises,
  getIndividualExercise,
  createExercise,
  updateExercise,
  deleteExercise,
} from "../controllers/exercises.js";

const router = Router();

router.get("/", getAllExercises);
router.get("/:id", getIndividualExercise);
router.post("/", authenticateToken, requireAdmin, createExercise);
router.patch("/:id", authenticateToken, requireAdmin, updateExercise);
router.delete("/:id", authenticateToken, requireAdmin, deleteExercise);

export default router;
