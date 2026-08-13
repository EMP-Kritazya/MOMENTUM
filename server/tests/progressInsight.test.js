import { describe, it, expect } from "vitest";
import { selectHeadlineCategory } from "../controllers/progressInsight.js";

describe("selectHeadlineCategory", () => {
  it("returns dayOne for a streak of 0", () => {
    expect(selectHeadlineCategory(0)).toBe("dayOne");
  });

  it("returns firstStreak for a streak of exactly 1", () => {
    expect(selectHeadlineCategory(1)).toBe("firstStreak");
  });

  it("returns streak for an ordinary in-progress streak", () => {
    expect(selectHeadlineCategory(3)).toBe("streak");
    expect(selectHeadlineCategory(5)).toBe("streak");
  });

  it("returns weeklyAchievement on exact multiples of 7", () => {
    expect(selectHeadlineCategory(7)).toBe("weeklyAchievement");
    expect(selectHeadlineCategory(14)).toBe("weeklyAchievement");
    expect(selectHeadlineCategory(21)).toBe("weeklyAchievement");
  });

  it("does not treat non-multiples of 7 near a weekly boundary as an achievement", () => {
    expect(selectHeadlineCategory(6)).toBe("streak");
    expect(selectHeadlineCategory(8)).toBe("streak");
  });

  it("prioritizes weeklyAchievement over firstStreak when both could apply", () => {
    expect(selectHeadlineCategory(7)).not.toBe("firstStreak");
    expect(selectHeadlineCategory(7)).not.toBe("streak");
  });
});
