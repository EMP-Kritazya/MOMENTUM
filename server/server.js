import express from "express";
import cors from "cors";
import { connectDB } from "./config/database.js";
import exerciseRouter from "./routes/exercises.js";
import workoutTemplateRouter from "./routes/workoutTemplates.js";
import userRouter from "./routes/users.js";
import workoutSessionRouter from "./routes/workoutSessions.js";

// create express app
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/exercises", exerciseRouter);
app.use("/api/workouttemplates", workoutTemplateRouter);
app.use("/api/users", userRouter);
app.use("/api/workoutsessions", workoutSessionRouter);

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
