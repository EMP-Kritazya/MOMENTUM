import { Router } from "express";
import {
  getAllUsers,
  getIndividualUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users.js";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getIndividualUser);
router.post("/", createUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
