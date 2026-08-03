import { pool } from "./database.js";
import "./dotenv.js";
import exercises from "../data/exercise.js";
import workoutTemplates from "../data/workoutTemplates.js";
import workoutTemplateExercises from "../data/workoutTemplateExercises.js";
import bcrypt from "bcryptjs";

// Reads the initial administrator details from environment variables.
const {
  ADMIN_USERNAME,
  ADMIN_FIRST_NAME,
  ADMIN_LAST_NAME,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
} = process.env;

const requiredValues = {
  ADMIN_USERNAME,
  ADMIN_FIRST_NAME,
  ADMIN_LAST_NAME,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
};

// Stops before accessing the database when required values are missing.
const missingNames = Object.entries(requiredValues)
  .filter(([, value]) => !value?.trim())
  .map(([name]) => name);
if (missingNames.length > 0) {
  throw new Error(
    `Missing administration environment variables: ${missingNames.join(",")}`,
  );
}

const dropAllTables = async () => {
  const dropTablesQuery = `
        DROP TABLE IF EXISTS Users CASCADE;
        DROP TABLE IF EXISTS WorkoutSessions CASCADE;
        DROP TABLE IF EXISTS Exercises CASCADE;
        DROP TABLE IF EXISTS WorkoutTemplates CASCADE;
        DROP TABLE IF EXISTS WorkoutTemplateExercises CASCADE;
        DROP TABLE IF EXISTS AccountabilityGroups CASCADE;
        DROP TABLE IF EXISTS GroupMembers CASCADE;
    `;

  try {
    const res = await pool.query(dropTablesQuery);
    console.log("🧹 all tables dropped successfully");
  } catch (error) {
    console.error("⚠️ error dropping tables: ", error);
  }
};

const createTables = async () => {
  const query = `
  CREATE TABLE IF NOT EXISTS Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'member'
      CHECK (role IN ('member', 'admin')),
    fitness_goal VARCHAR(50),
    experience_level VARCHAR(30),
    equipment_available VARCHAR(50),
    weekly_commitment INTEGER,
    current_streak INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS Exercises (
    exercise_id SERIAL PRIMARY KEY,
    exercise_name VARCHAR(100) NOT NULL,
    target_muscle VARCHAR(50),
    equipment_needed VARCHAR(50),
    difficulty VARCHAR(30)
  );

  CREATE TABLE IF NOT EXISTS AccountabilityGroups (
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by_user_id INTEGER REFERENCES Users(user_id),
    current_streak INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS GroupMembers (
    member_id SERIAL PRIMARY KEY,

    group_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,

    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE,
    daily_status VARCHAR(20),
    current_streak INTEGER DEFAULT 0,

    FOREIGN KEY (group_id)
      REFERENCES AccountabilityGroups(group_id)
      ON DELETE CASCADE,

    FOREIGN KEY (user_id)
      REFERENCES Users(user_id)
      ON DELETE CASCADE,
    
    UNIQUE(group_id, user_id)
  );
  
  
  CREATE TABLE IF NOT EXISTS WorkoutTemplates (
    template_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS WorkoutSessions (
    session_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    template_id INT NOT NULL,
    date DATE NOT NULL,
    duration_minutes INT DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_id) 
      REFERENCES Users(user_id)
      ON DELETE CASCADE,
    FOREIGN KEY (template_id) 
      REFERENCES WorkoutTemplates(template_id)
      ON DELETE CASCADE,
    FOREIGN KEY (template_id)
      REFERENCES WorkoutTemplates(template_id)
      ON UPDATE CASCADE,
    
    UNIQUE(user_id, template_id, date)
  );

  CREATE TABLE IF NOT EXISTS WorkoutTemplateExercises (
    template_exercise_id SERIAL PRIMARY KEY,
    session_id INT NOT NULL,
    exercise_id INT NOT NULL,
    sets INT NOT NULL,
    reps INT NOT NULL,
    exercise_order INT NOT NULL,
    FOREIGN KEY (session_id)
      REFERENCES WorkoutSessions(session_id)
      ON UPDATE CASCADE,
    FOREIGN KEY (exercise_id) 
      REFERENCES Exercises(exercise_id) 
      ON UPDATE CASCADE
    
  );
  `;

  try {
    const res = await pool.query(query);
    console.log("tables created successfully");
  } catch (error) {
    console.error("error creating tables", error);
  }
};

const seedExerciseTable = async () => {
  try {
    for (const exercise of exercises) {
      const insertQuery = {
        text: "INSERT INTO exercises (exercise_name, target_muscle, equipment_needed, difficulty) VALUES ($1, $2, $3, $4)",
      };

      const values = [
        exercise.exercise_name,
        exercise.target_muscle,
        exercise.equipment_needed,
        exercise.difficulty,
      ];

      await pool.query(insertQuery, values);
    }
    console.log(`✅ Exercises added successfully`);
  } catch (error) {
    console.error("⚠️ Error seeding exercises:", error.message);
    return;
  }
};

const seedWorkoutTemplateTable = async () => {
  try {
    for (const template of workoutTemplates) {
      const insertQuery = {
        text: "INSERT INTO workouttemplates (title) VALUES ($1)",
      };

      const values = [template.title];

      await pool.query(insertQuery, values);
    }
    console.log(`✅ Workout Templates added successfully`);
  } catch (error) {
    console.error("⚠️ Error seeding Workout Templates:", error.message);
    return;
  }
};

const seedWorkoutTemplateExercisesTable = async () => {
  try {
    for (const workoutTemplateExercise of workoutTemplateExercises) {
      const insertQuery = {
        text: "INSERT INTO workouttemplateexercises (template_id, exercise_id, sets, reps, exercise_order) VALUES ($1, $2, $3, $4, $5)",
      };

      const values = [
        workoutTemplateExercise.template_id,
        workoutTemplateExercise.exercise_id,
        workoutTemplateExercise.sets,
        workoutTemplateExercise.reps,
        workoutTemplateExercise.exercise_order,
      ];

      await pool.query(insertQuery, values);
    }
    console.log(`✅ WorkoutTemplateExercises added successfully`);
  } catch (error) {
    console.error("⚠️ Error seeding WorkoutTemplateExercises:", error.message);
    return;
  }
};

const seedAdmin = async () => {
  try {
    // Hashes the password so plaintext is never stored.
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

    // Creates the admin or safely updates the existing account by email.
    const query = `
            INSERT INTO users (
                username,
                first_name,
                last_name,
                email,
                password_hash,
                role
                )
            VALUES ($1, $2, $3, $4, $5, 'admin')
            ON CONFLICT (email)
            DO UPDATE SET
                username = EXCLUDED.username,
                first_name = EXCLUDED.first_name,
                last_name = EXCLUDED.last_name,
                password_hash = EXCLUDED.password_hash,
                role = 'admin'
            RETURNING
                user_id,
                username,
                first_name,
                last_name,
                email,
                role
        `;

    const values = [
      ADMIN_USERNAME.trim(),
      ADMIN_FIRST_NAME.trim(),
      ADMIN_LAST_NAME.trim(),
      ADMIN_EMAIL.trim().toLowerCase(),
      passwordHash,
    ];
    const result = await pool.query(query, values);
    console.log(`Administrator ready: ${result.rows[0].email}`);
  } catch (error) {
    console.error("Error seeding admin user:", error.message);
    process.exitCode = 1;
  }
};

const seedTables = async () => {
  await dropAllTables();
  await createTables();

  await seedAdmin();
  await seedExerciseTable();
  await seedWorkoutTemplateTable();
};

seedTables();
