import { useState, useEffect } from "react";
import { Search, Dumbbell, BookOpen, Loader2, AlertCircle } from "lucide-react";
import { getExercises } from "../api/exerciseApi";

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

export default function ExerciseLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("All");
  const [diffFilter, setDiffFilter] = useState("All");

  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchExercises() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getExercises();
        if (cancelled) return;

        const mapped = data.map((e) => ({
          id: e.exercise_id,
          name: e.exercise_name,
          muscle: e.target_muscle,
          equipment: e.equipment_needed,
          difficulty: capitalize(e.difficulty),
        }));

        setExercises(mapped);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load exercises.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchExercises();
    return () => {
      cancelled = true;
    };
  }, []);

  const muscleGroups = ["All", ...new Set(exercises.map((e) => e.muscle))];
  const difficultyLevels = ["All", ...new Set(exercises.map((e) => e.difficulty))];

  const items = exercises.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.muscle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMuscle = muscleFilter === "All" || e.muscle === muscleFilter;
    const matchDiff = diffFilter === "All" || e.difficulty === diffFilter;
    return matchSearch && matchMuscle && matchDiff;
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>
          Exercise Library
        </h1>
        <p className="text-muted-foreground mt-1.5">
          Browse exercises by muscle group, difficulty, and equipment.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search exercises or muscle groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs text-muted-foreground mr-1">Muscle:</span>
        {muscleGroups.map((m) => (
          <button
            key={m}
            onClick={() => setMuscleFilter(m)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              muscleFilter === m
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {m}
          </button>
        ))}
        <span className="text-xs text-muted-foreground ml-3 mr-1">Level:</span>
        {difficultyLevels.map((d) => (
          <button
            key={d}
            onClick={() => setDiffFilter(d)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              diffFilter === d
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-20 text-muted-foreground">
          <Loader2 size={28} className="mx-auto mb-3 animate-spin opacity-50" />
          <p className="font-medium">Loading exercises...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-muted-foreground">
          <AlertCircle size={32} className="mx-auto mb-3 text-red-400" />
          <p className="font-medium text-red-400">Couldn't load exercises</p>
          <p className="text-sm mt-1 opacity-60">{error}</p>
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {items.map((ex) => (
            <div
              key={ex.id}
              className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Dumbbell size={18} className="text-primary" />
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    ex.difficulty === "Beginner"
                      ? "bg-green-500/10 text-green-400"
                      : ex.difficulty === "Intermediate"
                      ? "bg-orange-500/10 text-orange-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {ex.difficulty}
                </span>
              </div>
              <h4 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">
                {ex.name}
              </h4>
              <div className="flex gap-1.5 flex-wrap">
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                  {ex.muscle}
                </span>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                  {ex.equipment}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <BookOpen size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No exercises match your filters.</p>
          <p className="text-sm mt-1 opacity-60">Try adjusting the filters above.</p>
        </div>
      )}
    </div>
  );
}