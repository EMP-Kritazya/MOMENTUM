import { Router } from "express";
import session from "express-session";
import passport from "passport";
import { GitHub } from "../config/auth.js";
import { createToken, setAuthCookie } from "../controllers/authController.js";
import { CLIENT_URL } from "../config/urls.js";
import MongoStore from "connect-mongo";

const router = Router();

router.use(
  session({
    secret: "@jaiq&81ka-+!7auq}'a/{p0s",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 14 * 24 * 60 * 60, // Session expiration in 14 days
    }),
  }),
);

router.use(passport.initialize());

passport.use(GitHub);

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["read:user"],
  }),
);

router.get("/github/callback", (req, res, next) => {
  passport.authenticate("github", { session: false }, (err, user, info) => {
    if (err) {
      console.error("GitHub authentication error:", err);
      return res.redirect(`${CLIENT_URL}/?error=github_auth`);
    }
    if (!user) {
      const message = info?.message ?? "GitHub sign-in failed.";
      return res.redirect(
        `${CLIENT_URL}/?error=${encodeURIComponent(message)}`,
      );
    }

    const token = createToken(user.user_id, user.role);
    setAuthCookie(res, token);
    return res.redirect(`${CLIENT_URL}/`);
  })(req, res, next);
});

export default router;
