import { pool } from "../config/database.js";

const headlines = {
  dayOne: [
    "Let's get that first workout done! 🔥 You've got this!",
    "Today is the day! Let's make this happen! 🚀",
    "No overthinking. Just start. 💪",
    "Your first workout starts now. Let's go 🔥",
    "You've got everything you need. Let's get moving 🚀",
    "One workout is all it takes to get started 💪",
    "Ready? Let's make today your first win 🏆",
    "This is where your journey begins. Let's go! 🔥",
    "Don't wait for motivation. Start with one workout 💪",
    "Let's turn today into day one 🚀",
  ],
  firstStreak: [
    "First Step is always the hard step, and you have taken Yours! Keep On going 💪",
    "Day 1 of becoming consistent. 🔥",
    "The hardest part was starting. You did it 💪",
    "Day 1 complete. Your momentum starts here 🚀",
    "Everyone starts somewhere. This is your start 🔥",
    "First workout down. Many more wins ahead 💪",
    "You showed up. That's how every streak begins 👏",
    "Day 1 of a stronger, more consistent you 🔥",
    "The first step is yours. Now keep moving ↗️",
    "You've started something. Let's keep it going 🚀",
    "One workout. One step. One new habit. 💪",
    "Welcome to your first streak. Don't stop here 🔥",
  ],
  streak: [
    "You are building MOMENTUM 😉🔥",
    "Amazing streak, keep on building ↗↗",
    "Not a lot of people get this far 🔥",
    "You're building something that compounds 🔥",
    "You're becoming the person who doesn't skip 💪",
    "Another day. Another win. Keep going ↗↗",
    "Consistency is starting to look good on you 😤",
    "You're making this a habit now 🔥",
    "Most people stop here. You didn't 👀",
    "One workout closer to your strongest self 💪",
    "Your future self is going to thank you for this.",
    "The streak is yours. Protect it 🔥",
    "You're on a roll. Don't break it now 🚀",
    "Small wins. Big momentum. Keep stacking.",
    "This is what consistency looks like 👏",
    "You're officially harder to stop now 😤",
    "Another one in the books 📖🔥",
    "You're not just working out. You're showing up.",
  ],
  weeklyAchievement: [
    "You've been consistent for a whole week! 😮",
    "Another week done, many more to come 🚀",
    "A whole week of showing up. That's a win 🏆",
    "7 days. You kept your promise to yourself 💪",
    "One week down. You're building something real 🔥",
    "A full week of consistency! Keep the momentum going 🚀",
    "You made it through the week. That's momentum 💨",
    "One week stronger than you were before 💪",
    "7 days in the books. Let's make the next one count 📖",
    "You didn't just start. You stayed consistent 👏",
    "One week complete. The habit is taking shape 🌱",
    "That's a week of wins. Keep stacking them 🔥",
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
