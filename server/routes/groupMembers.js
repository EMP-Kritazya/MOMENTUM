import { Router } from "express";
import { getGroupMembers, leaveGroup } from "../controllers/group.js";

// mergeParams = true, helps inheriting and accessing route parameters from its parent router (group.js)
const router = Router({ mergeParams: true });

router.get("/", getGroupMembers);
router.delete("/me", leaveGroup);

export default router;
