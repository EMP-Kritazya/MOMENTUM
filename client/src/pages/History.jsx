import { useEffect, useState } from "react";
import HistoryFilters from "../components/history/HistoryFilters";
import HistoryMobileCard from "../components/history/HistoryMobileCard";
import HistoryPagination from "../components/history/HistoryPagination";
import HistoryTable from "../components/history/HistoryTable";
import WorkoutHistoryModal from "../components/history/WorkoutHistoryModal";
import { getWorkoutHistory } from "../api/workoutHistory";

const initialFilters = {
  status: "all",
  muscle: "",
  sort: "desc",
  page: 1,
  limit: 20,
};

const emptyPagination = {
  page: 1,
  limit: 20,
  total: 0,
  total_pages: 0,
};

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("momentumUser"));
  } catch {
    return null;
  }
}

export default function History() {
  const [user] = useState(readStoredUser);
  const [filters, setFilters] = useState(initialFilters);
  const [workouts, setWorkouts] = useState([]);
  const [muscleOptions, setMuscleOptions] = useState([]);
  const [pagination, setPagination] = useState(emptyPagination);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.user_id) {
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setLoading(true);
    setError("");

    getWorkoutHistory(user.user_id, filters, controller.signal)
      .then((data) => {
        setWorkouts(data.workouts);
        setMuscleOptions(data.filters.muscle_groups);
        setPagination(data.pagination);
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [user?.user_id, filters]);

  function updateFilter(name, value) {
    setFilters((current) => ({
      ...current,
      [name]: value,
      page: name === "page" ? value : 1,
    }));
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl">
          Workout History
        </h1>
        <p className="mt-2 text-momentum-muted">
          Track your completed sessions and stay accountable.
        </p>
      </header>

      <div className="mt-8">
        <HistoryFilters
          filters={filters}
          muscleOptions={muscleOptions}
          onStatusChange={(value) => updateFilter("status", value)}
          onMuscleChange={(value) => updateFilter("muscle", value)}
          onSortChange={() =>
            updateFilter("sort", filters.sort === "desc" ? "asc" : "desc")
          }
        />
      </div>

      {!user?.user_id && (
        <div className="mt-8 rounded-2xl border border-momentum-border bg-momentum-panel p-8 text-center">
          <h2 className="font-display text-2xl text-white">No user selected</h2>
          <p className="mt-2 text-momentum-muted">
            Complete onboarding before viewing workout history.
          </p>
        </div>
      )}

      {user?.user_id && loading && (
        <p className="mt-8 text-momentum-muted" role="status">
          Loading workout history…
        </p>
      )}

      {user?.user_id && error && (
        <div
          className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/5 p-5 text-red-300"
          role="alert"
        >
          {error}
        </div>
      )}

      {user?.user_id && !loading && !error && workouts.length === 0 && (
        <div className="mt-8 rounded-2xl border border-momentum-border bg-momentum-panel p-8 text-center">
          <h2 className="font-display text-2xl text-white">
            No workouts found
          </h2>
          <p className="mt-2 text-momentum-muted">
            Try another filter or complete your first workout.
          </p>
        </div>
      )}

      {user?.user_id && !loading && !error && workouts.length > 0 && (
        <div className="mt-5">
          <HistoryTable
            workouts={workouts}
            onOpenWorkout={setSelectedWorkout}
          />

          <div className="space-y-3 md:hidden">
            {workouts.map((workout) => (
              <HistoryMobileCard
                key={workout.session_id}
                workout={workout}
                onOpen={setSelectedWorkout}
              />
            ))}
          </div>

          <p className="mt-4 text-xs text-momentum-muted">
            Showing {workouts.length} of {pagination.total} workouts
          </p>

          <HistoryPagination
            pagination={pagination}
            onPageChange={(page) => updateFilter("page", page)}
          />
        </div>
      )}

      <WorkoutHistoryModal
        workout={selectedWorkout}
        onClose={() => setSelectedWorkout(null)}
      />
    </section>
  );
}
