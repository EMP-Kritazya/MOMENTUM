import { Router } from "express";

import { myProgressInsight } from "../controllers/progressInsight.js";

const router = Router();

router.get("/", myProgressInsight);

export default router;
