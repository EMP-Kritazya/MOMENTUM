import { describe, it, expect } from "vitest";
import {
  classifySplit,
  parseUserEquipment,
  mapUserEquipment,
  fillSlots,
  unfilledSlots,
  shuffle,
  estimateDurationMinutes,
} from "../controllers/workoutSessions.js";

describe("classifySplit", () => {
  it("classifies an upper-body-only muscle list as upper", () => {
    expect(classifySplit(["chest", "shoulders", "triceps"])).toBe("upper");
  });

  it("classifies a lower-body-only muscle list as lower", () => {
    expect(classifySplit(["quadriceps", "hamstrings"])).toBe("lower");
  });

  it("classifies a mix of upper and lower muscles as full", () => {
    expect(classifySplit(["chest", "quadriceps"])).toBe("full");
  });

  it("treats an empty muscle list as upper (no lower muscles present)", () => {
    expect(classifySplit([])).toBe("upper");
  });

  it("treats an unrecognized muscle as upper, not lower", () => {
    expect(classifySplit(["abdominals"])).toBe("upper");
  });
});

describe("parseUserEquipment", () => {
  it("passes an array through unchanged", () => {
    expect(parseUserEquipment(["dumbbells", "none"])).toEqual([
      "dumbbells",
      "none",
    ]);
  });

  it("parses a Postgres array literal string", () => {
    expect(parseUserEquipment("{dumbbells,none}")).toEqual([
      "dumbbells",
      "none",
    ]);
  });

  it("strips quotes from quoted Postgres array elements", () => {
    expect(parseUserEquipment('{"dumbbells","resistance_bands"}')).toEqual([
      "dumbbells",
      "resistance_bands",
    ]);
  });

  it("parses a single unbracketed value", () => {
    expect(parseUserEquipment("full_gym")).toEqual(["full_gym"]);
  });

  it("returns an empty array for null", () => {
    expect(parseUserEquipment(null)).toEqual([]);
  });

  it("returns an empty array for a non-string, non-array value", () => {
    expect(parseUserEquipment(42)).toEqual([]);
  });

  it("drops empty entries produced by an empty array literal", () => {
    expect(parseUserEquipment("{}")).toEqual([]);
  });
});

describe("mapUserEquipment", () => {
  it("always includes body-only equipment even with no selection", () => {
    expect(mapUserEquipment("{}")).toEqual(["body only"]);
  });

  it("maps a full_gym selection to every gym equipment type", () => {
    const mapped = mapUserEquipment("{full_gym}");
    expect(mapped).toContain("barbell");
    expect(mapped).toContain("dumbbell");
    expect(mapped).toContain("cable");
    expect(mapped).toContain("body only");
  });

  it("maps a dumbbells selection to dumbbell and body-only equipment only", () => {
    const mapped = mapUserEquipment("{dumbbells}");
    expect(mapped.sort()).toEqual(["body only", "dumbbell"].sort());
  });

  it("de-duplicates equipment shared across multiple selections", () => {
    const mapped = mapUserEquipment("{dumbbells,resistance_bands}");
    const bodyOnlyCount = mapped.filter((item) => item === "body only").length;
    expect(bodyOnlyCount).toBe(1);
  });

  it("ignores an unrecognized equipment option", () => {
    expect(mapUserEquipment("{not_a_real_option}")).toEqual(["body only"]);
  });
});

describe("fillSlots", () => {
  const candidate = (id, muscle) => ({
    exercise_id: id,
    exercise_name: `Exercise ${id}`,
    target_muscle: muscle,
  });

  it("picks one exercise per slot in slot order", () => {
    const candidates = [candidate(1, "chest"), candidate(2, "lats")];
    const chosen = fillSlots(candidates, ["chest", "lats"]);
    expect(chosen.map((c) => c.target_muscle)).toEqual(["chest", "lats"]);
  });

  it("never picks the same exercise twice for repeated muscle slots", () => {
    // The lower split lists "quadriceps" and "hamstrings" twice each,
    // so a muscle with only one available exercise must not fill both slots.
    const candidates = [candidate(1, "quadriceps")];
    const chosen = fillSlots(candidates, ["quadriceps", "quadriceps"]);
    expect(chosen).toHaveLength(1);
  });

  it("fills a second slot for a repeated muscle when a second candidate exists", () => {
    const candidates = [candidate(1, "quadriceps"), candidate(2, "quadriceps")];
    const chosen = fillSlots(candidates, ["quadriceps", "quadriceps"]);
    expect(chosen).toHaveLength(2);
    expect(new Set(chosen.map((c) => c.exercise_id)).size).toBe(2);
  });

  it("skips a slot when no candidate exists for that muscle", () => {
    const candidates = [candidate(1, "chest")];
    const chosen = fillSlots(candidates, ["chest", "lats"]);
    expect(chosen).toHaveLength(1);
    expect(chosen[0].target_muscle).toBe("chest");
  });

  it("returns an empty list when given no candidates", () => {
    expect(fillSlots([], ["chest", "lats"])).toEqual([]);
  });
});

describe("unfilledSlots", () => {
  const chosenExercise = (id, muscle) => ({
    exercise_id: id,
    target_muscle: muscle,
  });

  it("returns nothing when every slot was filled", () => {
    const chosen = [chosenExercise(1, "chest"), chosenExercise(2, "lats")];
    expect(unfilledSlots(chosen, ["chest", "lats"])).toEqual([]);
  });

  it("reports a slot as unfilled when its muscle has no chosen exercise", () => {
    // The bug this guards against: an advanced user with only dumbbells
    // may have zero intermediate/expert biceps exercises, so fillSlots
    // skips that slot entirely — it must be reported as still needed
    // rather than silently dropped.
    const chosen = [chosenExercise(1, "chest")];
    expect(unfilledSlots(chosen, ["chest", "biceps"])).toEqual(["biceps"]);
  });

  it("only reports the shortfall for a muscle with repeated slots", () => {
    // Lower split lists quadriceps/hamstrings twice each; one chosen
    // exercise per muscle should leave exactly one repeat unfilled.
    const chosen = [chosenExercise(1, "quadriceps")];
    expect(
      unfilledSlots(chosen, ["quadriceps", "quadriceps", "hamstrings"]),
    ).toEqual(["quadriceps", "hamstrings"]);
  });

  it("returns every slot when nothing was chosen", () => {
    expect(unfilledSlots([], ["chest", "lats"])).toEqual(["chest", "lats"]);
  });
});

describe("shuffle", () => {
  it("does not mutate the input array", () => {
    const original = [1, 2, 3, 4, 5];
    const copy = [...original];
    shuffle(original);
    expect(original).toEqual(copy);
  });

  it("returns an array with the same elements, possibly reordered", () => {
    const original = [1, 2, 3, 4, 5];
    const result = shuffle(original);
    expect(result.sort()).toEqual(original.sort());
  });

  it("preserves length for an empty array", () => {
    expect(shuffle([])).toEqual([]);
  });
});

describe("estimateDurationMinutes", () => {
  it("returns the recorded duration when one exists", () => {
    expect(estimateDurationMinutes(45, 12)).toBe(45);
  });

  it("estimates from total sets when duration is 0", () => {
    // 12 sets * 2.5 = 30, above the 20-minute floor.
    expect(estimateDurationMinutes(0, 12)).toBe(30);
  });

  it("floors the estimate at 20 minutes for a short session", () => {
    // 2 sets * 2.5 = 5, below the floor, so 20 wins.
    expect(estimateDurationMinutes(0, 2)).toBe(20);
  });

  it("estimates from total sets when duration is null", () => {
    expect(estimateDurationMinutes(null, 20)).toBe(50);
  });
});
