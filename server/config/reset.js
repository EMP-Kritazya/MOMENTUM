import { pool } from './database.js'
import './dotenv.js'

const dropAllTables = async() => {
    const dropTablesQuery = `
        DROP TABLE IF EXISTS Users;
        DROP TABLE IF EXISTS WorkoutSessions;
        DROP TABLE IF EXISTS Exercises;
        DROP TABLE IF EXISTS WorkoutTemplates;
        DROP TABLE IF EXISTS WorkoutTemplateExercises;
        DROP TABLE IF EXISTS AccountabilityGroups;
        DROP TABLE IF EXISTS GroupMembers;
    `

    try {
        const res = await pool.query(dropTablesQuery)
        console.log('🧹 all tables dropped successfully')
    } 
    catch (error) {
        console.error('⚠️ error dropping tables', error)
    }
}

const createTables = async()=>{
  const query =
  `
  CREATE TABLE IF NOT EXISTS Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    fitness_goal VARCHAR(50),
    experience_level VARCHAR(30),
    equipment_available VARCHAR(50),
    weekly_commitment INTEGER
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
    duration_minutes INT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_id) 
      REFERENCES Users(user_id)
      ON DELETE CASCADE,
    FOREIGN KEY (template_id) 
      REFERENCES WorkoutTemplates(template_id)
      ON DELETE CASCADE,
    
    UNIQUE(user_id, template_id)
  );

  CREATE TABLE IF NOT EXISTS WorkoutTemplateExercises (
    template_id INT NOT NULL,
    exercise_id INT NOT NULL,
    sets INT NOT NULL,
    reps INT NOT NULL,
    exercise_order INT NOT NULL,
    PRIMARY KEY (template_id, exercise_id),
    FOREIGN KEY (template_id)
      REFERENCES WorkoutTemplates(template_id)
      ON UPDATE CASCADE,
    FOREIGN KEY (exercise_id) 
      REFERENCES Exercises(exercise_id) 
      ON UPDATE CASCADE
  );
  `

  try {
    const res = await pool.query(query)
    console.log('tables created successfully')
  }
  catch (error) {
    console.error('error creating tables', error)
  }
}

// reset
const resetDatabase = async () => {
    await dropAllTables()
    await createTables()
}

resetDatabase()
