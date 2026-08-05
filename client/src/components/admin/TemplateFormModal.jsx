import { useEffect, useState } from "react";
import { X } from "lucide-react";
import FieldError from "../ui/FieldError.jsx";
import TextInput from "../ui/TextInput.jsx";

const emptyValues = {
  title: "",
  experience_level: "beginner",
  workout_split: "upper",
};

export default function TemplateFormModal({
  open,
  template,
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
      template
        ? {
            title: template.title,
            experience_level: template.experience_level,
            workout_split: template.workout_split,
          }
        : emptyValues,
    );
    setClientErrors({});
  }, [open, template]);

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
    if (!values.title.trim()) {
      setClientErrors({ title: "Title is required" });
      return;
    }
    if (isSubmitting) return;

    await onSubmit({
      title: values.title.trim(),
      experience_level: values.experience_level,
      workout_split: values.workout_split,
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
        aria-labelledby="template-form-heading"
        className="w-full max-w-lg rounded-2xl border border-momentum-border bg-momentum-panel p-6"
      >
        <header className="flex items-center justify-between gap-4">
          <h2 id="template-form-heading" className="font-display text-2xl text-white">
            {template ? "Edit workout template" : "Add workout template"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close template form"
            className="rounded-lg p-2 text-momentum-muted hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <TextInput
            id="title"
            label="Template title"
            value={values.title}
            error={fieldErrors.title}
            maxLength={100}
            onChange={handleChange}
          />

          <label className="block">
            <span className="text-sm font-semibold text-white">Experience level</span>
            <select
              name="experience_level"
              value={values.experience_level}
              onChange={handleChange}
              className="mt-2 min-h-12 w-full rounded-xl border border-momentum-border bg-momentum-bg px-4 text-white outline-none focus:ring-2 focus:ring-momentum-lime"
            >
              <option value="beginner">Beginner</option>
              <option value="some_experience">Some Experience</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <FieldError id="experience-level-error">
              {fieldErrors.experience_level}
            </FieldError>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-white">Workout split</span>
            <select
              name="workout_split"
              value={values.workout_split}
              onChange={handleChange}
              className="mt-2 min-h-12 w-full rounded-xl border border-momentum-border bg-momentum-bg px-4 text-white outline-none focus:ring-2 focus:ring-momentum-lime"
            >
              <option value="upper">Upper Body</option>
              <option value="lower">Lower Body</option>
              <option value="full">Full Body</option>
            </select>
            <FieldError id="workout-split-error">
              {fieldErrors.workout_split}
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
            {isSubmitting ? "Saving..." : template ? "Save changes" : "Create template"}
          </button>
        </form>
      </section>
    </div>
  );
}
