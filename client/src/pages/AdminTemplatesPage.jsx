import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Archive,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";
import {
  createWorkoutTemplate,
  deleteWorkoutTemplate,
  getAdminWorkoutTemplates,
  updateWorkoutTemplate,
} from "../api/workoutTemplateApi.js";
import TemplateFormModal from "../components/admin/TemplateFormModal.jsx";
import ActionToast from "../components/ui/ActionToast.jsx";

const experienceLabels = {
  beginner: "Beginner",
  some_experience: "Some Experience",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const splitLabels = {
  upper: "Upper Body",
  lower: "Lower Body",
  full: "Full Body",
};

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [busyTemplateId, setBusyTemplateId] = useState(null);
  const [toast, setToast] = useState("");

  const closeToast = useCallback(() => setToast(""), []);

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminWorkoutTemplates({ includeInactive: true });
      setTemplates(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const filteredTemplates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return templates.filter((template) => {
      const matchesQuery =
        !normalizedQuery ||
        template.title.toLowerCase().includes(normalizedQuery) ||
        experienceLabels[template.experience_level]
          .toLowerCase()
          .includes(normalizedQuery) ||
        splitLabels[template.workout_split]
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesQuery && (showArchived || template.is_active);
    });
  }, [query, showArchived, templates]);

  function openCreateForm() {
    setEditingTemplate(null);
    setFormErrors({});
    setFormOpen(true);
  }

  function openEditForm(template) {
    setEditingTemplate(template);
    setFormErrors({});
    setFormOpen(true);
  }

  async function handleSave(values) {
    if (isSaving) return;
    setIsSaving(true);
    setFormErrors({});
    setError("");

    try {
      if (editingTemplate) {
        await updateWorkoutTemplate(editingTemplate.template_id, values);
        setToast("Workout template updated");
      } else {
        await createWorkoutTemplate(values);
        setToast("Workout template created");
      }
      setFormOpen(false);
      setEditingTemplate(null);
      await loadTemplates();
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

  async function handleToggle(template) {
    const verb = template.is_active ? "archive" : "restore";
    if (!window.confirm(`${verb} ${template.title}?`)) return;

    setBusyTemplateId(template.template_id);
    setError("");
    try {
      await updateWorkoutTemplate(template.template_id, {
        is_active: !template.is_active,
      });
      setToast(`Workout template ${template.is_active ? "archived" : "restored"}`);
      await loadTemplates();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyTemplateId(null);
    }
  }

  async function handleDelete(template) {
    if (!window.confirm(`Permanently delete ${template.title}?`)) return;

    setBusyTemplateId(template.template_id);
    setError("");
    try {
      await deleteWorkoutTemplate(template.template_id);
      setToast("Workout template deleted");
      await loadTemplates();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyTemplateId(null);
    }
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-momentum-lime">
            Administrator
          </p>
          <h1 className="mt-2 font-display text-4xl text-white sm:text-5xl">
            Workout Templates
          </h1>
          <p className="mt-2 text-momentum-muted">
            Manage the experience and workout-split categories used by the daily generator.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-momentum-lime px-5 font-bold text-[#11130d]"
        >
          <Plus size={18} aria-hidden="true" />
          Add Template
        </button>
      </header>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search workout templates</span>
          <Search
            size={16}
            aria-hidden="true"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-momentum-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search templates..."
            className="min-h-11 w-full rounded-xl border border-momentum-border bg-momentum-panel pl-10 pr-4 text-white outline-none focus:ring-2 focus:ring-momentum-lime"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-momentum-muted">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(event) => setShowArchived(event.target.checked)}
            className="accent-momentum-lime"
          />
          Show archived
        </label>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-red-300"
        >
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-8 text-momentum-muted" role="status">
          Loading workout templates…
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {filteredTemplates.map((template) => (
            <article
              key={template.template_id}
              className={`flex flex-col gap-4 rounded-2xl border bg-momentum-panel p-5 sm:flex-row sm:items-center ${
                template.is_active
                  ? "border-momentum-border"
                  : "border-amber-500/30 opacity-70"
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-white">{template.title}</h2>
                  <span className={`rounded-full px-2 py-1 text-xs ${
                    template.is_active
                      ? "bg-momentum-lime/10 text-momentum-lime"
                      : "bg-amber-500/10 text-amber-300"
                  }`}>
                    {template.is_active ? "Active" : "Archived"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-momentum-muted">
                  {experienceLabels[template.experience_level]} · {splitLabels[template.workout_split]} · {template.session_count} sessions
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditForm(template)}
                  disabled={busyTemplateId === template.template_id}
                  className="rounded-lg border border-momentum-border p-2 text-momentum-muted hover:text-white disabled:opacity-50"
                  aria-label={`Edit ${template.title}`}
                >
                  <Pencil size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => handleToggle(template)}
                  disabled={busyTemplateId === template.template_id}
                  className="rounded-lg border border-momentum-border p-2 text-momentum-muted hover:text-white disabled:opacity-50"
                  aria-label={`${template.is_active ? "Archive" : "Restore"} ${template.title}`}
                >
                  {template.is_active ? (
                    <Archive size={16} aria-hidden="true" />
                  ) : (
                    <RotateCcw size={16} aria-hidden="true" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(template)}
                  disabled={busyTemplateId === template.template_id}
                  className="rounded-lg border border-red-500/30 p-2 text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                  aria-label={`Delete ${template.title}`}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}

          {filteredTemplates.length === 0 && (
            <div className="rounded-2xl border border-momentum-border bg-momentum-panel p-8 text-center text-momentum-muted">
              No workout templates match your filters.
            </div>
          )}
        </div>
      )}

      <TemplateFormModal
        open={formOpen}
        template={editingTemplate}
        errors={formErrors}
        isSubmitting={isSaving}
        onClose={() => {
          if (!isSaving) {
            setFormOpen(false);
            setEditingTemplate(null);
            setFormErrors({});
          }
        }}
        onSubmit={handleSave}
      />
      <ActionToast message={toast} onClose={closeToast} />
    </section>
  );
}
