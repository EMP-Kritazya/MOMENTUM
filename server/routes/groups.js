import { Router } from "express";
import {
  getGroups,
  getIndividualGroup,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../controllers/group.js";
import groupMembersRouter from "./groupMembers.js";

const router = Router();

// Group CRUD
router.get("/", getGroups); // ?user_id = filters to that user's groups else gives all groups
router.get("/:groupId", getIndividualGroup);
router.post("/", createGroup);
router.patch("/:groupId", updateGroup);
router.delete("/:groupId", deleteGroup);

router.use("/:groupId/members", groupMembersRouter);

export default router;
