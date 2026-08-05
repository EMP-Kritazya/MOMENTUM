import { useEffect, useState } from "react";
import { X } from "lucide-react";
import FieldError from "../ui/FieldError.jsx";
import TextInput from "../ui/TextInput.jsx";

export default function EditGroupModal({
  group,
  serverError,
  isSubmitting,
  onClose,
  onUpdate,
}) {
  const [values, setValues] = useState({
    group_name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!group) return;
    setValues({
      group_name: group.group_name ?? "",
      description: group.description ?? "",
    });
    setErrors({});
  }, [group]);

  useEffect(() => {
    if (!group) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape" && !isSubmitting) onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [group, isSubmitting, onClose]);

  if (!group) return null;

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    const groupName = values.group_name.trim();
    const description = values.description.trim();

    if (!groupName) nextErrors.group_name = "Group name is required";
    if (groupName.length > 100) {
      nextErrors.group_name = "Group name must be 100 characters or fewer";
    }
    if (description.length > 500) {
      nextErrors.description = "Description must be 500 characters or fewer";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || isSubmitting) return;

    await onUpdate({
      group_name: groupName,
      description,
    });
  }

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
        aria-labelledby="edit-group-heading"
        className="w-full max-w-lg rounded-2xl border border-momentum-border bg-momentum-panel p-6"
      >
        <header className="flex items-center justify-between gap-4">
          <h2 id="edit-group-heading" className="font-display text-2xl text-white">
            Edit group
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close edit group dialog"
            className="rounded-lg p-2 text-momentum-muted hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <TextInput
            id="group_name"
            label="Group name"
            value={values.group_name}
            error={errors.group_name}
            maxLength={100}
            onChange={handleChange}
          />

          <label className="block">
            <span className="text-sm font-semibold text-white">Description</span>
            <textarea
              id="description"
              name="description"
              value={values.description}
              onChange={handleChange}
              maxLength={500}
              rows={4}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description ? "description-error" : undefined
              }
              className="mt-2 w-full rounded-xl border border-momentum-border bg-momentum-bg p-4 text-white outline-none focus:ring-2 focus:ring-momentum-lime"
            />
            <FieldError id="description-error">
              {errors.description}
            </FieldError>
          </label>

          {serverError && (
            <p role="alert" className="text-sm text-red-400">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={!values.group_name.trim() || isSubmitting}
            className="min-h-11 w-full rounded-xl bg-momentum-lime px-5 font-bold text-[#11130d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
        </form>
      </section>
    </div>
  );
}
