import { Router } from "express";
import {
  getAllTemplates,
  getIndividualTemplate,
  getTemplateExercises,
  createWorkoutTemplate,
  updateWorkoutTemplate,
  deleteWorkoutTemplate,
} from "../controllers/workoutTemplates.js";

const router = Router();

router.get("/", getAllTemplates);
router.get("/:id", getIndividualTemplate);
router.get("/:id/exercises", getTemplateExercises); // the 3-table JOIN
router.post("/", createWorkoutTemplate);
router.patch("/:id", updateWorkoutTemplate);
router.delete("/:id", deleteWorkoutTemplate);

export default router;
