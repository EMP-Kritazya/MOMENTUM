import { LogOut, Pencil, Trash2, Users } from "lucide-react";
import GroupMemberRow from "./GroupMemberRow.jsx";
import { useState } from "react";

export default function GroupCard({
  group,
  currentUserId,
  onEdit,
  onDelete,
  onLeave,
  isDeleting,
}) {
  const [copied, setCopied] = useState(false);
  const completedCount = group.members.filter(
    (member) => member.daily_status === "done",
  ).length;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(group.invite_code);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <article className="rounded-2xl border border-momentum-border bg-momentum-panel p-5">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">{group.group_name}</h2>
          {group.description && (
            <p className="mt-1 text-sm text-momentum-muted">
              {group.description}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-4 text-xs text-momentum-muted">
            <span className="flex items-center gap-1.5">
              <Users size={14} aria-hidden="true" />
              {group.members.length} members
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {group.current_user_is_creator ? (
            <div className="flex gap-4">
              {group.invite_code && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`cursor-pointer rounded-lg border border-momentum-border px-3 py-1 text-xs font-semibold transition ${
                    copied
                      ? "bg-momentum-lime text-black hover:bg-momentum-lime"
                      : "text-white hover:bg-white/5"
                  }`}
                >
                  {copied ? "Copied" : "Copy Invite Code"}
                </button>
              )}
              <button
                type="button"
                onClick={() => onEdit(group)}
                aria-label={`Edit ${group.group_name}`}
                className="rounded-lg border border-momentum-border p-2 text-momentum-muted hover:bg-white/5 hover:text-white"
              >
                <Pencil size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(group)}
                disabled={isDeleting}
                aria-label={`Delete ${group.group_name}`}
                className="rounded-lg border border-red-500/30 p-2 text-red-400 hover:bg-red-500/10 disabled:opacity-50"
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onLeave(group.group_id)}
              aria-label={`Leave ${group.group_name}`}
              className="rounded-lg border border-momentum-border p-2 text-momentum-muted hover:bg-white/5 hover:text-white"
            >
              <LogOut size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </header>

      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {group.members.map((member) => (
          <GroupMemberRow
            key={member.user_id}
            member={member}
            currentUserId={currentUserId}
          />
        ))}
      </ul>

      <footer className="mt-4 flex items-center justify-between border-t border-momentum-border pt-4">
        <p className="text-xs text-momentum-muted">
          {completedCount} of {group.members.length} completed today
        </p>
        <div className="flex gap-1" aria-hidden="true">
          {group.members.map((member) => (
            <span
              key={member.user_id}
              className={[
                "h-2 w-2 rounded-full",
                member.daily_status === "done"
                  ? "bg-momentum-lime"
                  : "bg-[#3b3e4c]",
              ].join(" ")}
            />
          ))}
        </div>
      </footer>
    </article>
  );
}
