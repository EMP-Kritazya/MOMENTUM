import { useEffect, useState } from "react";
import { X } from "lucide-react";
import FieldError from "../ui/FieldError.jsx";
import TextInput from "../ui/TextInput.jsx";

const emptyValues = {
  exercise_name: "",
  target_muscle: "",
  equipment_needed: "",
  difficulty: "beginner",
};

export default function ExerciseFormModal({
  open,
  exercise,
  errors,
  isSubmitting,
  onClose,
  onSubmit,
}) {
  const [values, setValues] = useState(emptyValues);
  const [clientErrors, setClientErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setValues(
      exercise
        ? {
            exercise_name: exercise.name,
            target_muscle: exercise.muscle,
            equipment_needed: exercise.equipment,
            difficulty: exercise.difficulty.toLowerCase(),
          }
        : emptyValues,
    );
    setClientErrors({});
  }, [exercise, open]);

  useEffect(() => {
    if (!open) return undefined;
    function handleKeyDown(event) {
      if (event.key === "Escape" && !isSubmitting) onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, onClose, open]);

  if (!open) return null;

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setClientErrors((current) => ({ ...current, [name]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    for (const field of [
      "exercise_name",
      "target_muscle",
      "equipment_needed",
    ]) {
      if (!values[field].trim()) nextErrors[field] = "This field is required";
    }
    setClientErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || isSubmitting) return;

    await onSubmit({
      exercise_name: values.exercise_name.trim(),
      target_muscle: values.target_muscle.trim(),
      equipment_needed: values.equipment_needed.trim(),
      difficulty: values.difficulty,
    });
  }

  const fieldErrors = { ...errors, ...clientErrors };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="exercise-form-heading"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-momentum-border bg-momentum-panel p-6"
      >
        <header className="flex items-center justify-between gap-4">
          <h2 id="exercise-form-heading" className="font-display text-2xl text-white">
            {exercise ? "Edit exercise" : "Add exercise"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close exercise form"
            className="rounded-lg p-2 text-momentum-muted hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <TextInput
            id="exercise_name"
            label="Exercise name"
            value={values.exercise_name}
            error={fieldErrors.exercise_name}
            maxLength={100}
            onChange={handleChange}
          />
          <TextInput
            id="target_muscle"
            label="Target muscle"
            value={values.target_muscle}
            error={fieldErrors.target_muscle}
            maxLength={50}
            onChange={handleChange}
          />
          <TextInput
            id="equipment_needed"
            label="Equipment"
            value={values.equipment_needed}
            error={fieldErrors.equipment_needed}
            maxLength={50}
            onChange={handleChange}
          />

          <label className="block">
            <span className="text-sm font-semibold text-white">Difficulty</span>
            <select
              name="difficulty"
              value={values.difficulty}
              onChange={handleChange}
              className="mt-2 min-h-12 w-full rounded-xl border border-momentum-border bg-momentum-bg px-4 text-white outline-none focus:ring-2 focus:ring-momentum-lime"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
            <FieldError id="difficulty-error">
              {fieldErrors.difficulty}
            </FieldError>
          </label>

          {fieldErrors.form && (
            <p role="alert" className="text-sm text-red-400">
              {fieldErrors.form}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-12 w-full rounded-xl bg-momentum-lime px-5 font-bold text-[#11130d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : exercise ? "Save changes" : "Create exercise"}
          </button>
        </form>
      </section>
    </div>
  );
}
