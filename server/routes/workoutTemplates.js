import { Router } from "express";
import {
  getAllTemplates,
  getAllTemplatesAdmin,
  getIndividualTemplate,
  createWorkoutTemplate,
  updateWorkoutTemplate,
  deleteWorkoutTemplate,
} from "../controllers/workoutTemplates.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.get(
  "/admin/all",
  authenticateToken,
  requireAdmin,
  getAllTemplatesAdmin,
);
router.get("/", getAllTemplates);
router.get("/:id", getIndividualTemplate);
router.post("/", authenticateToken, requireAdmin, createWorkoutTemplate);
router.patch(
  "/:id",
  authenticateToken,
  requireAdmin,
  updateWorkoutTemplate,
);
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  deleteWorkoutTemplate,
);

export default router;
