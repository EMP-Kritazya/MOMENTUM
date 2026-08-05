import { pool } from "../config/database.js";

const UPPER_MUSCLES = new Set([
  "chest",
  "middle back",
  "lats",
  "shoulders",
  "triceps",
  "biceps",
]);
const LOWER_MUSCLES = new Set(["quadriceps", "hamstrings"]);

const SPLIT_SLOTS = {
  upper: ["chest", "lats", "shoulders", "middle back", "triceps", "biceps"],
  lower: ["quadriceps", "hamstrings", "quadriceps", "hamstrings", "abdominals"],
  full: [
    "quadriceps",
    "chest",
    "middle back",
    "hamstrings",
    "shoulders",
    "abdominals",
  ],
};

// Split rotation: Upper -> Lower -> Full -> Upper ...
const NEXT_SPLIT = { upper: "lower", lower: "full", full: "upper" };

const EXPERIENCE_DIFFICULTY = {
  beginner: ["beginner"],
  some_experience: ["beginner", "intermediate"],
  intermediate: ["beginner", "intermediate", "expert"],
  advanced: ["intermediate", "expert"],
};
const ALL_DIFFICULTIES = ["beginner", "intermediate", "expert"];

// Ref from exercise data
const EQUIPMENT_MAP = {
  none: ["body only"],
  dumbbells: ["dumbbell", "body only"],
  resistance_bands: ["bands", "body only"],
  full_gym: [
    "barbell",
    "dumbbell",
    "cable",
    "machine",
    "kettlebells",
    "bands",
    "exercise ball",
    "e-z curl bar",
    "other",
    "body only",
  ],
};

const GOAL_SCHEME = {
  build_muscle: { sets: 4, reps: 10 },
  lose_weight: { sets: 3, reps: 12 },
  improve_endurance: { sets: 3, reps: 15 },
  stay_active: { sets: 3, reps: 10 },
};

const DEFAULT_SCHEME = { sets: 3, reps: 10 };

const DIFFICULTY_LABEL = {
  beginner: "Beginner",
  some_experience: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advance",
};
const SPLIT_LABEL = {
  upper: "Upper Body",
  lower: "Lower Body",
  full: "Full Body",
};

function classifySplit(muscles) {
  const hasUpper = muscles.some((m) => UPPER_MUSCLES.has(m));
  const hasLower = muscles.some((m) => LOWER_MUSCLES.has(m));
  if (hasUpper && hasLower) return "full";
  if (hasLower) return "lower";
  return "upper";
}

// equipment_available is stored as a VARCHAR, so pg hands it back as a string
// like "{dumbbells,none}". Accept and Normalize
function parseUserEquipment(raw) {
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== "string") return [];
  const trimmed = raw.trim();
  const inner =
    trimmed.startsWith("{") && trimmed.endsWith("}")
      ? trimmed.slice(1, -1)
      : trimmed;
  return inner
    .split(",")
    .map((item) => item.replace(/^"|"$/g, "").trim())
    .filter(Boolean);
}

function mapUserEquipment(raw) {
  const allowed = new Set(["body only"]);
  for (const option of parseUserEquipment(raw)) {
    for (const value of EQUIPMENT_MAP[option] ?? []) {
      allowed.add(value);
    }
  }
  return [...allowed];
}

function buildTitle(experienceLevel, split) {
  const level = DIFFICULTY_LABEL[experienceLevel] ?? "Beginner";
  return `${level} ${SPLIT_LABEL[split]}`;
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Fetches exercises matching the muscle/equipment/difficulty filters, excludes previous workout's exercise ids
async function queryCandidates(
  client,
  muscles,
  equipment,
  difficulties,
  excludeIds,
) {
  const result = await client.query(
    `SELECT exercise_id, exercise_name, target_muscle, difficulty
       FROM exercises
      WHERE target_muscle = ANY($1)
        AND equipment_needed = ANY($2)
        AND difficulty = ANY($3)
        AND ($4::int[] = '{}' OR exercise_id <> ALL($4))`,
    [muscles, equipment, difficulties, excludeIds ?? []],
  );
  return result.rows;
}

function fillSlots(candidates, slots) {
  const pools = new Map();
  for (const exercise of candidates) {
    if (!pools.has(exercise.target_muscle)) {
      pools.set(exercise.target_muscle, []);
    }
    pools.get(exercise.target_muscle).push(exercise);
  }
  for (const [muscle, list] of pools) {
    pools.set(muscle, shuffle(list));
  }

  const used = new Set();
  const chosen = [];
  for (const muscle of slots) {
    const pool = pools.get(muscle);
    if (!pool) continue;

    let pick;
    while (pool.length > 0) {
      const candidate = pool.pop();
      if (!used.has(candidate.exercise_id)) {
        pick = candidate;
        break;
      }
    }
    if (pick) {
      used.add(pick.exercise_id);
      chosen.push(pick);
    }
  }
  return chosen;
}

async function createTemplateExercises(lastSessionId, userId, today) {
  const client = await pool.connect();
  try {
    let split;
    let difficulties;
    let previousExerciseIds = [];

    const previous = await client.query(
      `SELECT DISTINCT e.exercise_id, e.target_muscle
           FROM workouttemplateexercises wte
           JOIN exercises e ON e.exercise_id = wte.exercise_id
          WHERE wte.session_id = $1`,
      [lastSessionId],
    );
    previousExerciseIds = previous.rows.map((row) => row.exercise_id);
    const previousSplit = classifySplit(
      previous.rows.map((row) => row.target_muscle),
    );

    if (lastSessionId === -1 || lastSessionId == null) {
      // First workout
      split = "upper";
    } else {
      split = NEXT_SPLIT[previousSplit];
    }

    // Load the session's template plus the owner's onboarding preferences.
    const context = await client.query(
      `SELECT
              u.experience_level,
              u.fitness_goal,
              u.equipment_available
         FROM users u WHERE user_id = $1`,
      [userId],
    );
    if (context.rows.length === 0) {
      throw new Error(`User ${userId} not found`);
    }
    const { experience_level, fitness_goal, equipment_available } =
      context.rows[0];

    difficulties = EXPERIENCE_DIFFICULTY[experience_level] ?? ["beginner"];
    const template_name = buildTitle(experience_level, split);
    const response = await client.query(
      `SELECT template_id FROM workouttemplates where title = $1`,
      [template_name],
    );
    const templateId = response.rows[0].template_id;

    // Translate preferences into exercise-table filters.
    const equipment = mapUserEquipment(equipment_available);
    const scheme = GOAL_SCHEME[fitness_goal] ?? DEFAULT_SCHEME;
    const slots = SPLIT_SLOTS[split];
    const muscles = [...new Set(slots)];

    const candidates = await queryCandidates(
      client,
      muscles,
      equipment,
      difficulties,
      previousExerciseIds,
    );
    let chosen = fillSlots(candidates, slots);

    const minExercises = Math.min(4, slots.length);
    if (chosen.length < minExercises) {
      const relaxed = await queryCandidates(
        client,
        muscles,
        equipment,
        ALL_DIFFICULTIES,
        [],
      );
      chosen = fillSlots(relaxed, slots);
    }

    if (chosen.length === 0) {
      throw new Error(
        "No exercises match the user's available equipment and level",
      );
    }

    await client.query("BEGIN");

    const created = await client.query(
      `INSERT INTO workoutsessions
         (user_id, template_id, date, duration_minutes, completed)
       VALUES ($1, $2, $3, $4, FALSE)
       RETURNING *`,
      [userId, templateId, today, 0],
    );
    const session = created.rows[0];
    const sessionId = session.session_id;

    const placeholders = [];
    const values = [];
    chosen.forEach((exercise, index) => {
      const base = index * 5;
      placeholders.push(
        `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5})`,
      );
      values.push(
        sessionId,
        exercise.exercise_id,
        scheme.sets,
        scheme.reps,
        index + 1,
      );
    });

    await client.query(
      `INSERT INTO workouttemplateexercises
         (session_id, exercise_id, sets, reps, exercise_order)
       VALUES ${placeholders.join(", ")}`,
      values,
    );

    await client.query("COMMIT");

    return session;
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}

async function loadWorkoutPayload(session) {
  const [templateResult, exercisesResult] = await Promise.all([
    pool.query(`SELECT title FROM workouttemplates WHERE template_id = $1`, [
      session.template_id,
    ]),
    pool.query(
      `SELECT wte.template_exercise_id,
              e.exercise_id,
              e.exercise_name,
              e.target_muscle,
              e.equipment_needed,
              wte.sets,
              wte.reps,
              wte.exercise_order,
              wte.completed
         FROM workouttemplateexercises wte
         JOIN exercises e ON e.exercise_id = wte.exercise_id
        WHERE wte.session_id = $1
        ORDER BY wte.exercise_order ASC`,
      [session.session_id],
    ),
  ]);

  return {
    started: session.started ?? false,
    completed: session.completed ?? false,
    session,
    title: templateResult.rows[0]?.title ?? null,
    exercises: exercisesResult.rows,
  };
}

// GET /api/workoutsessions
export const getAllSessions = async (req, res) => {
  try {
    const results = await pool.query(
      `SELECT * FROM workoutsessions ORDER BY date DESC`,
    );
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/workoutsessions/:id
export const getIndividualSession = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM workoutsessions WHERE session_id = $1",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/workoutsessions/:id/exercises
// Returns the exact exercises generated for one of the signed-in user's sessions.
export const getSessionExercises = async (req, res) => {
  const userId = req.auth?.userId;
  const sessionId = Number.parseInt(req.params.id, 10);

  if (!Number.isInteger(sessionId) || sessionId < 1) {
    return res.status(400).json({ message: "A valid session ID is required" });
  }

  try {
    const sessionResult = await pool.query(
      `SELECT ws.session_id,
              ws.template_id,
              ws.date,
              ws.duration_minutes,
              ws.started,
              ws.completed,
              wt.title
         FROM workoutsessions ws
         JOIN workouttemplates wt
           ON wt.template_id = ws.template_id
        WHERE ws.session_id = $1
          AND ws.user_id = $2`,
      [sessionId, userId],
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ message: "Workout session not found" });
    }

    const exercisesResult = await pool.query(
      `SELECT wte.template_exercise_id,
              e.exercise_id,
              e.exercise_name,
              e.target_muscle,
              e.equipment_needed,
              wte.sets,
              wte.reps,
              wte.exercise_order,
              wte.completed
         FROM workouttemplateexercises wte
         JOIN exercises e
           ON e.exercise_id = wte.exercise_id
        WHERE wte.session_id = $1
        ORDER BY wte.exercise_order ASC`,
      [sessionId],
    );

    return res.status(200).json({
      ...sessionResult.rows[0],
      exercises: exercisesResult.rows,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// GET /api/workoutsessions/todayssession
export const todaysSession = async (req, res) => {
  const userId = req.auth?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const today = new Date().toISOString().slice(0, 10);

  try {
    const existing = await pool.query(
      `SELECT * FROM workoutsessions WHERE user_id = $1 AND date = $2 LIMIT 1`,
      [userId, today],
    );
    if (existing.rows.length > 0) {
      return res.status(200).json(await loadWorkoutPayload(existing.rows[0]));
    }

    // Find the last workout
    const previous = await pool.query(
      `SELECT session_id, template_id
         FROM workoutsessions
        WHERE user_id = $1
        ORDER BY date DESC, session_id DESC
        LIMIT 1`,
      [userId],
    );
    const lastSessionId = previous.rows[0]?.session_id ?? -1;
    const templateId = previous.rows[0]?.template_id ?? -1;

    const session = await createTemplateExercises(lastSessionId, userId, today);

    return res.status(201).json(await loadWorkoutPayload(session));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// POST /api/workoutsessions
export const createSession = async (req, res) => {
  const { user_id, template_id, date, duration_minutes, completed } = req.body;

  if (!user_id || !template_id || !date || !duration_minutes) {
    return res.status(400).json({
      message: "user_id, template_id, date, and duration_minutes are required",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO workoutsessions
        (user_id, template_id, date, duration_minutes, completed)
       VALUES ($1, $2, $3, $4, COALESCE($5, FALSE))
       RETURNING *`,
      [
        parseInt(user_id),
        parseInt(template_id),
        date,
        duration_minutes,
        completed,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    //  If either parent (user or template) doesn't exist,
    if (error.code === "23503") {
      return res
        .status(400)
        .json({ message: "user_id or template_id does not exist" });
    }
    // Uniqueness
    if (error.code === "23505") {
      return res.status(409).json({
        message: "This user already has a session for this template",
      });
    }
    res.status(500).json({ error: error.message });
  }
};

// PATCH /api/workoutsessions/
export const updateSession = async (req, res) => {
  const userId = req.auth?.userId;
  const { started, completed } = req.body;

  try {
    const session = await pool.query(
      `SELECT session_id FROM workoutsessions WHERE user_id = $1 ORDER BY date DESC LIMIT 1`,
      [userId],
    );
    if (session.rows.length === 0) {
      return res.status(404).json({ message: "Session not found" });
    }

    const query = await pool.query(
      `
      UPDATE workoutsessions
      SET
        started=COALESCE($1, started),
        completed=COALESCE($2, completed)
      WHERE session_id = $3
      RETURNING *
      `,
      [started, completed, session.rows[0].session_id],
    );

    return res.status(200).json(query.rows[0]);
  } catch (error) {
    if (error.code === "23503") {
      return res
        .status(400)
        .json({ message: "user_id or session_id does not exist" });
    }
    res.status(500).json({ error: error.message });
  }
};

// PATCH /api/workoutsessions/exercise/:templateExerciseId
export const updateTemplateExercise = async (req, res) => {
  const userId = req.auth?.userId;
  const templateExerciseId = Number(req.params.templateExerciseId);
  const { completed } = req.body;

  if (typeof completed !== "boolean") {
    return res.status(400).json({
      message: "A boolean completed field is required",
    });
  }

  try {
    const updateResult = await pool.query(
      `UPDATE workouttemplateexercises wte
         SET completed = $1
        FROM workoutsessions ws
        WHERE wte.session_id = ws.session_id
          AND ws.user_id = $2
          AND wte.template_exercise_id = $3
      RETURNING wte.session_id, wte.template_exercise_id, wte.completed`,
      [completed, userId, templateExerciseId],
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    const sessionId = updateResult.rows[0].session_id;
    const allCompleteResult = await pool.query(
      `SELECT bool_and(completed) AS all_completed
         FROM workouttemplateexercises
        WHERE session_id = $1`,
      [sessionId],
    );

    const sessionCompleted = allCompleteResult.rows[0]?.all_completed ?? false;

    const sessionBefore = await pool.query(
      `SELECT completed, date FROM workoutsessions WHERE session_id = $1`,
      [sessionId],
    );
    const wasCompleted = sessionBefore.rows[0]?.completed ?? false;
    const sessionDate = sessionBefore.rows[0]?.date;

    await pool.query(
      `UPDATE workoutsessions
          SET completed = $1
        WHERE session_id = $2`,
      [sessionCompleted, sessionId],
    );

    // Streak only moves the first time a session flips to completed, so
    // re-completing (or re-fetching) never double-counts a day.
    let currentStreak;
    if (sessionCompleted && !wasCompleted) {
      const previousDayResult = await pool.query(
        `SELECT 1
           FROM workoutsessions
          WHERE user_id = $1
            AND completed = TRUE
            AND date = $2::date - INTERVAL '1 day'
          LIMIT 1`,
        [userId, sessionDate],
      );
      const continuesStreak = previousDayResult.rows.length > 0;

      const streakResult = await pool.query(
        `UPDATE users
            SET current_streak = CASE WHEN $1 THEN current_streak + 1 ELSE 1 END
          WHERE user_id = $2
          RETURNING current_streak`,
        [continuesStreak, userId],
      );
      currentStreak = streakResult.rows[0]?.current_streak;
    }

    return res.status(200).json({
      templateExercise: updateResult.rows[0],
      sessionCompleted,
      ...(currentStreak !== undefined ? { currentStreak } : {}),
    });
  } catch (error) {
    if (error.code === "23503") {
      return res
        .status(400)
        .json({ message: "user_id or session_id does not exist" });
    }
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/workoutsessions/:id
export const deleteSession = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM workoutsessions WHERE session_id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Session not found" });
    }
    res
      .status(200)
      .json({ message: "Session deleted", session: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/workoutsessions/user/:userId/history
export const getUserWorkoutHistory = async (req, res) => {
  const userId = Number.parseInt(req.params.user_id, 10);
  const status = String(req.query.status || "all").toLowerCase();
  const muscle = String(req.query.muscle || "").trim();
  const sort = req.query.sort === "asc" ? "ASC" : "DESC";
  const requestedPage = Number.parseInt(req.query.page, 10);
  const requestedLimit = Number.parseInt(req.query.limit, 10);
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const limit =
    Number.isInteger(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, 50)
      : 20;
  const offset = (page - 1) * limit;

  if (!Number.isInteger(userId) || userId < 1) {
    return res.status(400).json({ message: "A valid user ID is required" });
  }

  if (!["all", "completed", "skipped"].includes(status)) {
    return res.status(400).json({
      message: "status must be all, completed, or skipped",
    });
  }

  try {
    const userResult = await pool.query(
      "SELECT user_id FROM users WHERE user_id = $1",
      [userId],
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const values = [userId];
    const conditions = [
      "ws.user_id = $1",
      "(ws.completed = TRUE OR ws.date < CURRENT_DATE)",
    ];

    if (status === "completed") {
      conditions.push("ws.completed = TRUE");
    }

    if (status === "skipped") {
      conditions.push("ws.completed = FALSE");
      conditions.push("ws.date < CURRENT_DATE");
    }

    if (muscle) {
      values.push(muscle);
      conditions.push(`
        EXISTS (
          SELECT 1
          FROM workouttemplateexercises filter_wte
          JOIN exercises filter_e
            ON filter_e.exercise_id = filter_wte.exercise_id
          WHERE filter_wte.session_id = ws.session_id
            AND LOWER(filter_e.target_muscle) = LOWER($${values.length})
        )
      `);
    }

    const whereClause = conditions.join(" AND ");

    const countResult = await pool.query(
      `SELECT COUNT(*) AS total
       FROM workoutsessions ws
       WHERE ${whereClause}`,
      values,
    );

    const pageValues = [...values, limit, offset];
    const limitPosition = pageValues.length - 1;
    const offsetPosition = pageValues.length;

    const historyResult = await pool.query(
      `WITH paged_sessions AS (
         SELECT ws.session_id,
                ws.template_id,
                ws.date,
                ws.duration_minutes,
                ws.completed,
                wt.title
         FROM workoutsessions ws
         JOIN workouttemplates wt
           ON wt.template_id = ws.template_id
         WHERE ${whereClause}
         ORDER BY ws.date ${sort}, ws.session_id ${sort}
         LIMIT $${limitPosition}
         OFFSET $${offsetPosition}
       )
       SELECT ps.session_id,
              ps.template_id,
              ps.title,
              ps.date,
              ps.duration_minutes,
              CASE
                WHEN ps.completed = TRUE THEN 'completed'
                ELSE 'skipped'
              END AS status,
              COALESCE(
                ARRAY_AGG(DISTINCT e.target_muscle)
                  FILTER (WHERE e.target_muscle IS NOT NULL),
                ARRAY[]::VARCHAR[]
              ) AS muscle_groups
       FROM paged_sessions ps
       LEFT JOIN workouttemplateexercises wte
         ON wte.session_id = ps.session_id
       LEFT JOIN exercises e
         ON e.exercise_id = wte.exercise_id
       GROUP BY ps.session_id,
                ps.template_id,
                ps.title,
                ps.date,
                ps.duration_minutes,
                ps.completed
       ORDER BY ps.date ${sort}, ps.session_id ${sort}`,
      pageValues,
    );

    const musclesResult = await pool.query(
      `SELECT DISTINCT e.target_muscle
       FROM workoutsessions ws
       JOIN workouttemplateexercises wte
         ON wte.session_id = ws.session_id
       JOIN exercises e
         ON e.exercise_id = wte.exercise_id
       WHERE ws.user_id = $1
         AND (ws.completed = TRUE OR ws.date < CURRENT_DATE)
         AND e.target_muscle IS NOT NULL
       ORDER BY e.target_muscle ASC`,
      [userId],
    );

    const total = Number.parseInt(countResult.rows[0].total, 10);

    return res.status(200).json({
      workouts: historyResult.rows,
      filters: {
        muscle_groups: musclesResult.rows.map((row) => row.target_muscle),
      },
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Monday-start week boundary for a UTC-midnight date.
function mondayOf(date) {
  const day = date.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(date, diff);
}

function addDays(date, days) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

// Same estimate toTodayWorkout uses on the client when a session has no
// recorded duration_minutes (every auto-generated session starts at 0).
function estimateDurationMinutes(durationMinutes, totalSets) {
  return durationMinutes || Math.max(20, Math.round(totalSets * 2.5));
}

// GET /api/workoutsessions/activity-summary
export const getUserActivitySummary = async (req, res) => {
  const userId = req.auth?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const userResult = await pool.query(
      `SELECT weekly_commitment FROM users WHERE user_id = $1`,
      [userId],
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const workoutsGoal = userResult.rows[0].weekly_commitment || 0;

    const now = new Date();
    const today = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );

    // Monthly grid: Monday-start weeks spanning the current calendar month.
    const monthStart = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1),
    );
    const monthEnd = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 0),
    );
    const gridStart = mondayOf(monthStart);
    const lastWeekStart = mondayOf(monthEnd);

    // Weekly bars: last 8 Monday-start weeks, including the current one.
    const currentWeekStart = mondayOf(today);
    const eightWeeksStart = addDays(currentWeekStart, -7 * 7);

    const rangeStart = gridStart < eightWeeksStart ? gridStart : eightWeeksStart;

    const sessionsResult = await pool.query(
      `SELECT to_char(ws.date, 'YYYY-MM-DD') AS date,
              ws.duration_minutes,
              COALESCE(SUM(wte.sets), 0) AS total_sets
         FROM workoutsessions ws
         LEFT JOIN workouttemplateexercises wte
           ON wte.session_id = ws.session_id
        WHERE ws.user_id = $1
          AND ws.completed = TRUE
          AND ws.date >= $2
          AND ws.date <= $3
        GROUP BY ws.session_id, ws.date, ws.duration_minutes`,
      [userId, toISODate(rangeStart), toISODate(today)],
    );

    const minutesByDate = new Map();
    for (const row of sessionsResult.rows) {
      minutesByDate.set(
        row.date,
        estimateDurationMinutes(row.duration_minutes, Number(row.total_sets)),
      );
    }

    const grid = [];
    let totalWorkouts = 0;
    for (
      let weekStart = gridStart;
      weekStart <= lastWeekStart;
      weekStart = addDays(weekStart, 7)
    ) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const day = addDays(weekStart, i);
        const inMonth = day >= monthStart && day <= monthEnd;
        const completed = inMonth && minutesByDate.has(toISODate(day));
        if (completed) totalWorkouts += 1;
        week.push(completed);
      }
      grid.push(week);
    }

    const bars = [];
    for (let weeksAgo = 7; weeksAgo >= 0; weeksAgo -= 1) {
      const weekStart = addDays(currentWeekStart, -7 * weeksAgo);
      let count = 0;
      for (let i = 0; i < 7; i++) {
        if (minutesByDate.has(toISODate(addDays(weekStart, i)))) count += 1;
      }
      const value =
        workoutsGoal > 0 ? Math.min(1, count / workoutsGoal) : count > 0 ? 1 : 0;
      bars.push({ label: `W${8 - weeksAgo}`, value });
    }

    let workoutsCompleted = 0;
    let activeMinutes = 0;
    for (let i = 0; i < 7; i++) {
      const minutes = minutesByDate.get(
        toISODate(addDays(currentWeekStart, i)),
      );
      if (minutes !== undefined) {
        workoutsCompleted += 1;
        activeMinutes += minutes;
      }
    }
    const weeklyGoalPercent =
      workoutsGoal > 0
        ? Math.min(100, Math.round((workoutsCompleted / workoutsGoal) * 100))
        : 0;

    return res.status(200).json({
      monthly: {
        totalWorkouts,
        weekdayLabels: ["M", "T", "W", "T", "F", "S", "S"],
        grid,
      },
      weekly: {
        bars,
        workoutsCompleted,
        workoutsGoal,
        activeMinutes,
        weeklyGoalPercent,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
