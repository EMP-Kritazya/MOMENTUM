import "./config/dotenv.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/users.js";
import { connectDB } from "./config/database.js";
import exerciseRouter from "./routes/exercises.js";
import workoutTemplateRouter from "./routes/workoutTemplates.js";
import workoutSessionRouter from "./routes/workoutSessions.js";
import groupRouter from "./routes/groups.js";

// create express app
const app = express();
const clientOrigin = process.env.CLIENT_URL ?? "http://localhost:5173";

app.use(
  cors({
    origin: clientOrigin,
    // Required so the browser will send/accept the httpOnly authToken cookie.
    credentials: true,
  }),
);
app.use(express.json());
// Parses the authToken cookie into req.cookies for authenticateToken.
app.use(cookieParser());

// Render uses this endpoint to confirm that the web service is responsive.
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/exercises", exerciseRouter);
app.use("/api/workouttemplates", workoutTemplateRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/workoutsessions", workoutSessionRouter);
app.use("/api/groups", groupRouter);

app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      '<h1 style="text-align: center; margin-top: 50px;">Momentum API</h1>',
    );
});

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database is Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Database connection error.");
    process.exit(1);
  }
};

startServer();
