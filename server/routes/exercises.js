import { Router } from "express";
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
router.post("/", createExercise);
router.patch("/:id", updateExercise);
router.delete("/:id", deleteExercise);

export default router;
