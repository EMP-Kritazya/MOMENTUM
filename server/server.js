import "./config/dotenv.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/users.js";
import progressRouter from "./routes/progressInsight.js";
import { connectDB } from "./config/database.js";
import exerciseRouter from "./routes/exercises.js";
import workoutTemplateRouter from "./routes/workoutTemplates.js";
import workoutSessionRouter from "./routes/workoutSessions.js";
import groupRouter from "./routes/groups.js";
import { authenticateToken } from "./middleware/authenticateToken.js";

// create express app
const app = express();

const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL].filter(
  Boolean,
);

app.use(
  cors({
    origin: allowedOrigins,
    // Required so the browser will send/accept the httpOnly authToken cookie.
    credentials: true,
  }),
);
app.use(express.json());
// Parses the authToken cookie into req.cookies for authenticateToken.
app.use(cookieParser());

app.use("/api/exercises", exerciseRouter);
app.use("/api/workouttemplates", workoutTemplateRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/workoutsessions", authenticateToken, workoutSessionRouter);
app.use("/api/groups", groupRouter);
app.use("/api/progressInsight", authenticateToken, progressRouter);

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
