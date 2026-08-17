import passport from "passport";
import { Router } from "express";

const router = Router();

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["read:user"],
  }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "/",
    failureRedirect: "/destinations",
  }),
);

export default router;
