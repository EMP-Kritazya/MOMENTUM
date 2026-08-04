import { Router } from "express";
import {
  getGroups,
  getIndividualGroup,
  createGroup,
  joinGroupByInviteCode,
  updateGroup,
  deleteGroup,
} from "../controllers/group.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import groupMembersRouter from "./groupMembers.js";

const router = Router();
router.use(authenticateToken);

// Group CRUD
router.get("/", getGroups);
router.get("/:groupId", getIndividualGroup);
router.post("/", createGroup);
router.post("/join", joinGroupByInviteCode);
router.patch("/:groupId", updateGroup);
router.delete("/:groupId", deleteGroup);

router.use("/:groupId/members", groupMembersRouter);

export default router;
