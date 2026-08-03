import { Users, Flame } from "lucide-react";

/**
 * A single group member row: avatar initial, name and today's completion status.
 */
function MemberRow({ member }) {
  const isDone = member.status === "done";

  return (
    <li className="flex items-center gap-3 py-2.5">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
          member.isCurrentUser
            ? "bg-momentum-lime text-momentum-bg"
            : "bg-white/[0.06] text-momentum-muted"
        }`}
      >
        {member.initial}
      </span>

      <span
        className={`text-sm ${
          member.isCurrentUser ? "font-semibold text-momentum-lime" : "text-white"
        }`}
      >
        {member.name}
      </span>

      <span className="ml-auto flex items-center gap-1.5 text-sm">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isDone ? "bg-momentum-lime" : "bg-momentum-muted"
          }`}
          aria-hidden="true"
        />
        <span className={isDone ? "text-momentum-muted" : "text-momentum-muted"}>
          {isDone ? "Done" : "Pending"}
        </span>
      </span>
    </li>
  );
}

/**
 * Group progress card: today's completion count, the member roster and the
 * shared group streak.
 */
export default function GroupProgressCard({ group }) {
  const { name, completedToday, totalMembers, streakDays, members } = group;

  return (
    <section className="flex flex-col rounded-3xl border border-momentum-border bg-momentum-panel p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <p className="text-sm text-momentum-muted">
            <span className="font-semibold text-momentum-lime">
              {completedToday}
            </span>{" "}
            of {totalMembers} completed today
          </p>
        </div>
        <Users className="h-5 w-5 text-momentum-muted" aria-hidden="true" />
      </div>

      <ul className="mt-4 flex flex-col divide-y divide-momentum-border/40">
        {members.map((member) => (
          <MemberRow key={member.id} member={member} />
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-momentum-border/60 pt-4">
        <span className="text-sm text-momentum-muted">Group streak</span>
        <span className="flex items-center gap-1.5 font-semibold text-momentum-lime">
          <Flame className="h-4 w-4" aria-hidden="true" />
          {streakDays} days
        </span>
      </div>
    </section>
  );
}
