import { pool } from "./database.js";
import { demoGroup, demoSessions, demoUsers } from "../data/demoData.js";

async function seedUsers(client) {
  for (const user of demoUsers) {
    await client.query(
      `INSERT INTO users (
         username,
         first_name,
         last_name,
         email,
         role,
         fitness_goal,
         experience_level,
         equipment_available,
         weekly_commitment,
         current_streak
       )
       VALUES ($1, $2, $3, $4, 'member', $5, $6, $7, $8, $9)
       ON CONFLICT (email)
       DO UPDATE SET
         username = EXCLUDED.username,
         first_name = EXCLUDED.first_name,
         last_name = EXCLUDED.last_name,
         fitness_goal = EXCLUDED.fitness_goal,
         experience_level = EXCLUDED.experience_level,
         equipment_available = EXCLUDED.equipment_available,
         weekly_commitment = EXCLUDED.weekly_commitment,
         current_streak = EXCLUDED.current_streak`,
      [
        user.username,
        user.firstName,
        user.lastName,
        user.email,
        user.fitnessGoal,
        user.experienceLevel,
        user.equipmentAvailable,
        user.weeklyCommitment,
        user.currentStreak,
      ],
    );
  }
}

async function seedGroup(client) {
  const creatorResult = await client.query(
    `SELECT user_id
       FROM users
      WHERE username = $1`,
    [demoGroup.creatorUsername],
  );

  if (creatorResult.rows.length === 0) {
    throw new Error("Demo group creator was not seeded");
  }

  const groupResult = await client.query(
    `INSERT INTO accountabilitygroups (
       group_name,
       description,
       invite_code,
       created_by_user_id,
       current_streak
     )
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (invite_code)
     DO UPDATE SET
       group_name = EXCLUDED.group_name,
       description = EXCLUDED.description,
       created_by_user_id = EXCLUDED.created_by_user_id,
       current_streak = EXCLUDED.current_streak
     RETURNING group_id`,
    [
      demoGroup.groupName,
      demoGroup.description,
      demoGroup.inviteCode,
      creatorResult.rows[0].user_id,
      demoGroup.currentStreak,
    ],
  );

  const groupId = groupResult.rows[0].group_id;

  for (const username of demoGroup.memberUsernames) {
    const user = demoUsers.find((candidate) => candidate.username === username);
    const isCreator = username === demoGroup.creatorUsername;

    const memberResult = await client.query(
      `INSERT INTO groupmembers (
         group_id,
         user_id,
         is_admin,
         current_streak
       )
       SELECT $1, u.user_id, $3, $4
         FROM users u
        WHERE u.username = $2
       ON CONFLICT (group_id, user_id)
       DO UPDATE SET
         is_admin = EXCLUDED.is_admin,
         current_streak = EXCLUDED.current_streak
       RETURNING member_id`,
      [groupId, username, isCreator, user.currentStreak],
    );

    if (memberResult.rows.length === 0) {
      throw new Error(`Demo group member ${username} was not seeded`);
    }
  }
}

async function seedSessions(client) {
  for (const sessionDefinition of demoSessions) {
    const sessionResult = await client.query(
      `INSERT INTO workoutsessions (
         user_id,
         template_id,
         date,
         duration_minutes,
         started,
         completed
       )
       SELECT
         u.user_id,
         wt.template_id,
         CURRENT_DATE - $3::integer,
         $4,
         $5,
         $6
       FROM users u
       CROSS JOIN workouttemplates wt
       WHERE u.username = $1
         AND wt.title = $2
       ON CONFLICT (user_id, template_id, date)
       DO UPDATE SET
         duration_minutes = EXCLUDED.duration_minutes,
         started = EXCLUDED.started,
         completed = EXCLUDED.completed
       RETURNING session_id`,
      [
        sessionDefinition.username,
        sessionDefinition.templateTitle,
        sessionDefinition.daysAgo,
        sessionDefinition.durationMinutes,
        sessionDefinition.started,
        sessionDefinition.completed,
      ],
    );

    if (sessionResult.rows.length === 0) {
      throw new Error(
        `Could not seed ${sessionDefinition.username} / ` +
          sessionDefinition.templateTitle,
      );
    }

    const sessionId = sessionResult.rows[0].session_id;

    // Makes rerunning the demo seed idempotent for session exercises.
    await client.query(
      `DELETE FROM workouttemplateexercises
        WHERE session_id = $1`,
      [sessionId],
    );

    for (const [index, exercise] of
      sessionDefinition.exercises.entries()) {
      const exerciseResult = await client.query(
        `INSERT INTO workouttemplateexercises (
           session_id,
           exercise_id,
           sets,
           reps,
           exercise_order,
           completed
         )
         SELECT $1, e.exercise_id, $3, $4, $5, $6
           FROM exercises e
          WHERE e.exercise_name = $2
            AND e.is_active = TRUE
         RETURNING template_exercise_id`,
        [
          sessionId,
          exercise.exerciseName,
          exercise.sets,
          exercise.reps,
          index + 1,
          sessionDefinition.completed,
        ],
      );

      if (exerciseResult.rows.length === 0) {
        throw new Error(`Exercise not found: ${exercise.exerciseName}`);
      }
    }
  }
}

export async function seedDemoData() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await seedUsers(client);
    await seedGroup(client);
    await seedSessions(client);
    await client.query("COMMIT");
    console.log("✅ Demo users, group, sessions, and exercises seeded");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
