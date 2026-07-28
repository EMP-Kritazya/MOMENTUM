import { Router } from "express";
import {
  getAllTemplates,
  getIndividualTemplate,
  createWorkoutTemplate,
} from "../controllers/workoutTemplates.js";

const router = Router();

router.get("/", getAllTemplates);
router.get("/:id", getIndividualTemplate);

router.post("/", createWorkoutTemplate);

export default router;
