import { useCallback, useEffect, useState } from "react";
import {
  Archive,
  BookOpen,
  Dumbbell,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";
import {
  createExercise,
  deleteExercise,
  getAdminExercises,
  getExercises,
  updateExercise,
} from "../api/exerciseApi.js";
import ExerciseFormModal from "../components/admin/ExerciseFormModal.jsx";
import ActionToast from "../components/ui/ActionToast.jsx";
import { useAuth } from "../context/authContext.js";
import { AlternatingExerciseImage } from "../components/utilities/AlternatingExerciseImage.jsx";

function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

export default function ExerciseLibrary() {
  const { user, loading: authLoading } = useAuth();
  const isAdmin = user?.role === "admin";
  const [searchQuery, setSearchQuery] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("All");
  const [diffFilter, setDiffFilter] = useState("All");
  const [showArchived, setShowArchived] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [busyExerciseId, setBusyExerciseId] = useState(null);
  const [toast, setToast] = useState("");

  const closeToast = useCallback(() => setToast(""), []);

  const loadExercises = useCallback(async () => {
    if (authLoading) return;

    setIsLoading(true);
    setError("");
    try {
      const data = isAdmin
        ? await getAdminExercises({ includeInactive: true })
        : await getExercises();

      setExercises(
        data.map((exercise) => ({
          id: exercise.exercise_id,
          name: exercise.exercise_name,
          muscle: exercise.target_muscle,
          equipment: exercise.equipment_needed,
          difficulty: capitalize(exercise.difficulty),
          imageUrls: exercise.image_urls ?? [],
          isActive: exercise.is_active !== false,
        })),
      );
    } catch (requestError) {
      setError(requestError.message || "Failed to load exercises.");
    } finally {
      setIsLoading(false);
    }
  }, [authLoading, isAdmin]);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  const muscleGroups = [
    "All",
    ...new Set(exercises.map((exercise) => exercise.muscle)),
  ];
  const difficultyLevels = [
    "All",
    ...new Set(exercises.map((exercise) => exercise.difficulty)),
  ];

  const items = exercises.filter((exercise) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      exercise.name.toLowerCase().includes(query) ||
      exercise.muscle.toLowerCase().includes(query) ||
      exercise.equipment.toLowerCase().includes(query);
    const matchesMuscle =
      muscleFilter === "All" || exercise.muscle === muscleFilter;
    const matchesDifficulty =
      diffFilter === "All" || exercise.difficulty === diffFilter;
    const matchesArchive =
      !isAdmin || showArchived || exercise.isActive;
    return (
      matchesSearch &&
      matchesMuscle &&
      matchesDifficulty &&
      matchesArchive
    );
  });

  function openCreateForm() {
    setEditingExercise(null);
    setFormErrors({});
    setFormOpen(true);
  }

  function openEditForm(exercise) {
    setEditingExercise(exercise);
    setFormErrors({});
    setFormOpen(true);
  }

  async function handleSaveExercise(values) {
    if (isSaving) return;
    setIsSaving(true);
    setFormErrors({});
    setError("");

    try {
      if (editingExercise) {
        await updateExercise(editingExercise.id, values);
        setToast("Exercise updated");
      } else {
        await createExercise(values);
        setToast("Exercise created");
      }
      setFormOpen(false);
      setEditingExercise(null);
      await loadExercises();
    } catch (requestError) {
      setFormErrors({
        ...(requestError.data?.errors ?? {}),
        ...(!requestError.data?.errors
          ? { form: requestError.message }
          : {}),
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleExercise(exercise) {
    const action = exercise.isActive ? "archive" : "restore";
    if (!window.confirm(`${capitalize(action)} ${exercise.name}?`)) return;

    setBusyExerciseId(exercise.id);
    setError("");
    try {
      await updateExercise(exercise.id, {
        is_active: !exercise.isActive,
      });
      setToast(`Exercise ${exercise.isActive ? "archived" : "restored"}`);
      await loadExercises();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyExerciseId(null);
    }
  }

  async function handleDeleteExercise(exercise) {
    if (!window.confirm(`Permanently delete ${exercise.name}?`)) return;

    setBusyExerciseId(exercise.id);
    setError("");
    try {
      await deleteExercise(exercise.id);
      setToast("Exercise deleted");
      await loadExercises();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyExerciseId(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold">Exercise Library</h1>
          <p className="mt-1.5 text-momentum-muted">
            Browse exercises by muscle group, difficulty, and equipment.
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-momentum-lime px-5 font-bold text-[#11130d]"
          >
            <Plus size={18} aria-hidden="true" />
            Add Exercise
          </button>
        )}
      </header>

      <div className="relative mb-4">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-momentum-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Search exercises, muscles, or equipment..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="w-full rounded-xl border border-momentum-border bg-momentum-panel py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-momentum-muted focus:ring-2 focus:ring-momentum-lime"
        />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs text-momentum-muted">Muscle:</span>
        {muscleGroups.map((muscle) => (
          <button
            key={muscle}
            type="button"
            onClick={() => setMuscleFilter(muscle)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              muscleFilter === muscle
                ? "bg-momentum-lime text-[#11130d]"
                : "border border-momentum-border bg-momentum-panel text-momentum-muted hover:text-white"
            }`}
          >
            {muscle}
          </button>
        ))}

        <span className="ml-3 mr-1 text-xs text-momentum-muted">Level:</span>
        {difficultyLevels.map((difficulty) => (
          <button
            key={difficulty}
            type="button"
            onClick={() => setDiffFilter(difficulty)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              diffFilter === difficulty
                ? "bg-momentum-lime text-[#11130d]"
                : "border border-momentum-border bg-momentum-panel text-momentum-muted hover:text-white"
            }`}
          >
            {difficulty}
          </button>
        ))}

        {isAdmin && (
          <label className="ml-auto flex items-center gap-2 text-xs text-momentum-muted">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(event) => setShowArchived(event.target.checked)}
              className="accent-momentum-lime"
            />
            Show archived
          </label>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="mb-6 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-red-300"
        >
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="py-20 text-center text-momentum-muted">
          <Loader2 size={28} className="mx-auto mb-3 animate-spin opacity-50" />
          <p className="font-medium">Loading exercises...</p>
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((exercise) => (
            <article
              key={exercise.id}
              className={`rounded-xl border bg-momentum-panel p-4 transition-all ${
                exercise.isActive
                  ? "border-momentum-border hover:border-momentum-lime/30"
                  : "border-amber-500/30 opacity-70"
              }`}
            >
              {exercise.imageUrls.length > 0 ? (
                <AlternatingExerciseImage
                  imageUrls={exercise.imageUrls}
                  alt={exercise.name}
                  className="-mx-4 -mt-4 mb-3 rounded-t-xl"
                />
              ) : (
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-momentum-lime/10">
                  <Dumbbell size={18} className="text-momentum-lime" />
                </div>
              )}

              <div className="mb-3 flex items-center justify-end gap-2">
                {!exercise.isActive && (
                  <span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-300">
                    Archived
                  </span>
                )}
                <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-momentum-muted">
                  {exercise.difficulty}
                </span>
              </div>

              <h2 className="text-sm font-semibold text-white">
                {exercise.name}
              </h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-momentum-muted">
                  {exercise.muscle}
                </span>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-momentum-muted">
                  {exercise.equipment}
                </span>
              </div>

              {isAdmin && (
                <div className="mt-4 flex items-center gap-2 border-t border-momentum-border pt-3">
                  <button
                    type="button"
                    onClick={() => openEditForm(exercise)}
                    disabled={busyExerciseId === exercise.id}
                    className="rounded-lg border border-momentum-border p-2 text-momentum-muted hover:text-white disabled:opacity-50"
                    aria-label={`Edit ${exercise.name}`}
                  >
                    <Pencil size={15} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleExercise(exercise)}
                    disabled={busyExerciseId === exercise.id}
                    className="rounded-lg border border-momentum-border p-2 text-momentum-muted hover:text-white disabled:opacity-50"
                    aria-label={`${exercise.isActive ? "Archive" : "Restore"} ${exercise.name}`}
                  >
                    {exercise.isActive ? (
                      <Archive size={15} aria-hidden="true" />
                    ) : (
                      <RotateCcw size={15} aria-hidden="true" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteExercise(exercise)}
                    disabled={busyExerciseId === exercise.id}
                    className="ml-auto rounded-lg border border-red-500/30 p-2 text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                    aria-label={`Delete ${exercise.name}`}
                  >
                    <Trash2 size={15} aria-hidden="true" />
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-momentum-muted">
          <BookOpen size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No exercises match your filters.</p>
          <p className="mt-1 text-sm opacity-60">
            Try adjusting the filters above.
          </p>
        </div>
      )}

      <ExerciseFormModal
        open={formOpen}
        exercise={editingExercise}
        errors={formErrors}
        isSubmitting={isSaving}
        onClose={() => {
          if (!isSaving) {
            setFormOpen(false);
            setEditingExercise(null);
            setFormErrors({});
          }
        }}
        onSubmit={handleSaveExercise}
      />
      <ActionToast message={toast} onClose={closeToast} />
    </div>
  );
}
