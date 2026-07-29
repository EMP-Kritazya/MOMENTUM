import { Router } from "express";
import {
  getGroupMembers,
  joinGroup,
  leaveGroup,
} from "../controllers/group.js";

// mergeParams = true, helps inheriting and accessing route parameters from its parent router (group.js)
const router = Router({ mergeParams: true });

router.get("/", getGroupMembers);
router.post("/", joinGroup);
router.delete("/:userId", leaveGroup);

export default router;
