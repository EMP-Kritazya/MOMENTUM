import { describe, it, expect, vi, afterEach } from "vitest";
import {
  mondayOf,
  addDays,
  toISODate,
  todayInTimeZone,
} from "../controllers/workoutSessions.js";

const utcDate = (y, m, d) => new Date(Date.UTC(y, m - 1, d));

describe("addDays", () => {
  it("adds positive days within the same month", () => {
    expect(toISODate(addDays(utcDate(2026, 3, 10), 5))).toBe("2026-03-15");
  });

  it("subtracts days across a month boundary", () => {
    expect(toISODate(addDays(utcDate(2026, 3, 2), -5))).toBe("2026-02-25");
  });

  it("does not mutate the input date", () => {
    const original = utcDate(2026, 3, 10);
    const copy = new Date(original);
    addDays(original, 3);
    expect(original.getTime()).toBe(copy.getTime());
  });
});

describe("mondayOf", () => {
  it("returns the same date when given a Monday", () => {
    // March 9, 2026 is a Monday.
    expect(toISODate(mondayOf(utcDate(2026, 3, 9)))).toBe("2026-03-09");
  });

  it("rolls a mid-week date back to that week's Monday", () => {
    // March 12, 2026 is a Thursday.
    expect(toISODate(mondayOf(utcDate(2026, 3, 12)))).toBe("2026-03-09");
  });

  it("rolls a Sunday back to the start of its own week, not the next one", () => {
    // March 15, 2026 is a Sunday; JS getUTCDay() returns 0 for Sunday,
    // which typically is the edge case the day === 0 branch exists for.
    expect(toISODate(mondayOf(utcDate(2026, 3, 15)))).toBe("2026-03-09");
  });

  it("rolls back across a month boundary when needed", () => {
    // March 1, 2026 is a Sunday of the week starting Feb 23.
    expect(toISODate(mondayOf(utcDate(2026, 3, 1)))).toBe("2026-02-23");
  });
});

describe("toISODate", () => {
  it("formats a UTC date as YYYY-MM-DD", () => {
    expect(toISODate(utcDate(2026, 1, 5))).toBe("2026-01-05");
  });
});

describe("todayInTimeZone", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("rolls to the next day ahead of UTC before UTC itself does", () => {
    // 23:30 UTC on March 10 is already 05:00 on March 11 in Kolkata (+5:30).
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-10T23:30:00Z"));

    expect(toISODate(todayInTimeZone("UTC"))).toBe("2026-03-10");
    expect(toISODate(todayInTimeZone("Asia/Kolkata"))).toBe("2026-03-11");
  });

  it("stays on the previous day behind UTC after UTC has already rolled over", () => {
    // 23:30 UTC on March 10 is still 15:30 on March 10 in Los Angeles (-8).
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-10T23:30:00Z"));

    expect(toISODate(todayInTimeZone("America/Los_Angeles"))).toBe(
      "2026-03-10",
    );
  });
});
