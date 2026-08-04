import { useState } from "react";
import { X } from "lucide-react";

const initialValues = {
  groupName: "",
  description: "",
};

export default function CreateGroupModal({ open, onClose, onCreate, isSubmitting }) {
  const [values, setValues] = useState(initialValues);

  if (!open) return null;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!values.groupName.trim() || isSubmitting) return;

    const created = await onCreate({
      group_name: values.groupName.trim(),
      description: values.description.trim(),
    });

    if (created) {
      setValues(initialValues);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-group-heading"
        className="w-full max-w-lg rounded-2xl border border-momentum-border bg-momentum-panel p-6"
      >
        <header className="flex items-center justify-between">
          <h2 id="create-group-heading" className="font-display text-2xl text-white">
            Create a new group
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close create group dialog"
            className="rounded-lg p-2 text-momentum-muted hover:bg-white/5 hover:text-white"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-white">Group name</span>
            <input
              value={values.groupName}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  groupName: event.target.value,
                }))
              }
              maxLength={100}
              className="mt-2 min-h-11 w-full rounded-xl border border-momentum-border bg-momentum-bg px-4 text-white outline-none focus:ring-2 focus:ring-momentum-lime"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-white">Description</span>
            <textarea
              value={values.description}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              rows={3}
              className="mt-2 w-full rounded-xl border border-momentum-border bg-momentum-bg p-4 text-white outline-none focus:ring-2 focus:ring-momentum-lime"
            />
          </label>

          <button
            type="submit"
            disabled={!values.groupName.trim() || isSubmitting}
            className="min-h-11 w-full rounded-xl bg-momentum-lime px-5 font-bold text-[#11130d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create group"}
          </button>
        </form>
      </section>
    </div>
  );
}