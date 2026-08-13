import { pool } from "../config/database.js";

const headlines = {
  dayOne: [
    "Let's get that first workout done! 🔥 You've got this!",
    "Today is the day! Let's make this happen! 🚀",
  ],
  firstStreak: [
    "First Step is always the hard step, and you have taken Yours! Keep On going 💪",
    "Day 1 of becoming consistent. 🔥",
  ],
  streak: [
    "Amazing streak, keep on building ↗",
    "Not a lot of people get this far 🔥",
  ],
  weeklyAchievement: [
    "You've been consistent for a whole week! 😮",
    "Another week done, many more to come 🚀",
  ],
};

// Returns a random element from a list.
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Maps a user's current streak to a headline category. Pulled out of the
// controller so the decision logic can be unit tested without a database.
export function selectHeadlineCategory(currentStreak) {
  if (currentStreak > 0 && currentStreak % 7 === 0) return "weeklyAchievement";
  if (currentStreak === 1) return "firstStreak";
  if (currentStreak === 0) return "dayOne";
  return "streak";
}

export const myProgressInsight = async (req, res) => {
  const userId = req.auth?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const user = await pool.query(
      `SELECT current_streak FROM users WHERE user_id = $1`,
      [userId],
    );

    if (user.rowCount === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const current_streak = user.rows[0].current_streak;
    const category = selectHeadlineCategory(current_streak);
    const holder = pickRandom(headlines[category]);

    return res.status(200).json({ headline: holder });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
