import { MoreHorizontal, Users } from "lucide-react";
import GroupMemberRow from "./GroupMemberRow.jsx";

export default function GroupCard({ group, currentUserId, onLeave }) {
  const completedCount = group.members.filter(
    (member) => member.daily_status === "done",
  ).length;

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
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-momentum-muted">
            <span className="flex items-center gap-1.5">
              <Users size={14} aria-hidden="true" />
              {group.members.length} members
            </span>
            <span>🔥 {group.current_streak}-day streak</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onLeave(group.group_id)}
          aria-label={`Leave ${group.group_name}`}
          className="rounded-lg p-2 text-momentum-muted hover:bg-white/5 hover:text-white"
        >
          <MoreHorizontal size={18} aria-hidden="true" />
        </button>
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