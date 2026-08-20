import { pool } from "./database.js";
import "./dotenv.js";
import exercises from "../data/exercise.js";
import workoutTemplates from "../data/workoutTemplates.js";
import workoutTemplateExercises from "../data/workoutTemplateExercises.js";
import bcrypt from "bcryptjs";
import { seedDemoData } from "./demoSeeder.js";

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
        DROP TABLE IF EXISTS user_oauth_accounts CASCADE;
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
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'member'
      CHECK (role IN ('member', 'admin')),
    fitness_goal VARCHAR(50),
    experience_level VARCHAR(30),
    equipment_available VARCHAR(50),
    weekly_commitment INTEGER,
    current_streak INTEGER DEFAULT 0,
    streak_week_start DATE,
    streak_grace_used BOOLEAN NOT NULL DEFAULT FALSE,
    onboarded BOOLEAN NOT NULL DEFAULT FALSE,
    onboarding_week BOOLEAN NOT NULL DEFAULT TRUE
  );

  CREATE TABLE IF NOT EXISTS Exercises (
    exercise_id SERIAL PRIMARY KEY,
    exercise_name VARCHAR(100) NOT NULL,
    target_muscle VARCHAR(50) NOT NULL,
    equipment_needed VARCHAR(50) NOT NULL,
    difficulty VARCHAR(30) NOT NULL
      CHECK (difficulty IN ('beginner', 'intermediate', 'expert')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS AccountabilityGroups (
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL,
    description TEXT,
    invite_code VARCHAR(12) NOT NULL UNIQUE,
    created_by_user_id INTEGER NOT NULL
      REFERENCES Users(user_id)
      ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS GroupMembers (
    member_id SERIAL PRIMARY KEY,

    group_id INTEGER NOT NULL
      REFERENCES AccountabilityGroups(group_id)
      ON DELETE CASCADE,
    user_id INTEGER NOT NULL
      REFERENCES Users(user_id)
      ON DELETE CASCADE,

    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    daily_status VARCHAR(20) NOT NULL DEFAULT 'pending'
      CHECK (daily_status IN ('pending', 'done')),
    current_streak INTEGER NOT NULL DEFAULT 0,
    UNIQUE(group_id, user_id)
  );


  CREATE TABLE IF NOT EXISTS WorkoutTemplates (
    template_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    experience_level VARCHAR(30) NOT NULL
      CHECK (experience_level IN (
        'beginner',
        'some_experience',
        'intermediate',
        'advanced'
      )),
    workout_split VARCHAR(10) NOT NULL
      CHECK (workout_split IN ('upper', 'lower', 'full')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (experience_level, workout_split)
  );

  CREATE TABLE IF NOT EXISTS WorkoutSessions (
    session_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    template_id INT NOT NULL,
    date DATE NOT NULL,
    duration_minutes INT DEFAULT 0,
    started BOOLEAN NOT NULL DEFAULT FALSE,
    started_at TIMESTAMPTZ,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    rolled_over BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_id)
      REFERENCES Users(user_id)
      ON DELETE CASCADE,
    FOREIGN KEY (template_id)
      REFERENCES WorkoutTemplates(template_id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,

    UNIQUE(user_id, template_id, date)
  );

  CREATE TABLE IF NOT EXISTS WorkoutTemplateExercises (
    template_exercise_id SERIAL PRIMARY KEY,
    session_id INT NOT NULL,
    exercise_id INT NOT NULL,
    sets INT NOT NULL,
    reps INT NOT NULL,
    exercise_order INT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (session_id)
      REFERENCES WorkoutSessions(session_id)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
    FOREIGN KEY (exercise_id)
      REFERENCES Exercises(exercise_id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT

  );

  CREATE TABLE IF NOT EXISTS user_oauth_accounts(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(provider, provider_user_id)
  );

  CREATE INDEX IF NOT EXISTS idx_groupmembers_user_id
    ON GroupMembers(user_id);

  CREATE INDEX IF NOT EXISTS idx_groupmembers_group_id
    ON GroupMembers(group_id);

  CREATE INDEX IF NOT EXISTS idx_groups_created_by_user_id
    ON AccountabilityGroups(created_by_user_id);

  CREATE INDEX IF NOT EXISTS idx_workoutsessions_user_date
    ON WorkoutSessions(user_id, date);

  CREATE INDEX IF NOT EXISTS idx_exercises_active_filters
    ON Exercises(is_active, target_muscle, equipment_needed, difficulty);

  CREATE INDEX IF NOT EXISTS idx_templates_generator_lookup
    ON WorkoutTemplates(is_active, experience_level, workout_split);
  `;

  try {
    const res = await pool.query(query);
    console.log("tables created successfully");
  } catch (error) {
    console.error("error creating tables", error);
    throw error;
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
        text: `INSERT INTO workouttemplates
          (title, experience_level, workout_split)
          VALUES ($1, $2, $3)`,
      };

      const values = [
        template.title,
        template.experience_level,
        template.workout_split,
      ];

      await pool.query(insertQuery, values);
    }
    console.log(`✅ Workout Templates added successfully`);
  } catch (error) {
    console.error("⚠️ Error seeding Workout Templates:", error.message);
    return;
  }
};

// const seedWorkoutTemplateExercisesTable = async () => {
//   try {
//     for (const workoutTemplateExercise of workoutTemplateExercises) {
//       const insertQuery = {
//         text: "INSERT INTO workouttemplateexercises (template_id, exercise_id, sets, reps, exercise_order) VALUES ($1, $2, $3, $4, $5)",
//       };

//       const values = [
//         workoutTemplateExercise.template_id,
//         workoutTemplateExercise.exercise_id,
//         workoutTemplateExercise.sets,
//         workoutTemplateExercise.reps,
//         workoutTemplateExercise.exercise_order,
//       ];

//       await pool.query(insertQuery, values);
//     }
//     console.log(`✅ WorkoutTemplateExercises added successfully`);
//   } catch (error) {
//     console.error("⚠️ Error seeding WorkoutTemplateExercises:", error.message);
//     return;
//   }
// };

const seedAdmin = async () => {
  try {
    // Hashes the password so plaintext is never stored.
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

    // Creates the admin or safely updates the existing account by email.
    const query = `
            INSERT INTO users (
              firstname,
              lastname,
              username,
              email,
              password_hash,
              role
              )
            VALUES ($1, $2, $3, $4, $5, 'admin')
            ON CONFLICT (email)
            DO UPDATE SET
                username = EXCLUDED.username,
                firstname = EXCLUDED.firstname,
                lastname = EXCLUDED.lastname,
                password_hash = EXCLUDED.password_hash,
                role = 'admin'
            RETURNING
                user_id,
                firstname,
                lastname,
                username,
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

  if (process.env.SEED_DEMO_DATA === "true") {
    await seedDemoData();
  }
};

seedTables()
  .catch((error) => {
    console.error("Unable to reset database:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
