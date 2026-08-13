import { useEffect, useState } from "react";
import { Users, Flame } from "lucide-react";
import { getPrimaryGroupProgress } from "../../api/groupsApi.js";
import { useAuth } from "../../context/authContext.js";

function MemberRow({ member, currentUserId }) {
  const isCurrentUser = member.user_id === currentUserId;
  const isDone = member.daily_status === "done";
  const displayName = isCurrentUser
    ? "You"
    : `${member.first_name} ${member.last_name}`.trim() || member.username;
  const initial = member.first_name?.charAt(0).toUpperCase() || "?";

  return (
    <li className="flex items-center gap-3 py-2.5">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
          isCurrentUser
            ? "bg-momentum-lime text-momentum-bg"
            : "bg-white/6 text-momentum-muted"
        }`}
      >
        {initial}
      </span>

      <span
        className={`text-sm ${
          isCurrentUser
            ? "font-semibold text-momentum-lime"
            : "text-white"
        }`}
      >
        {displayName}
      </span>

      <span className="ml-auto flex items-center gap-1.5 text-sm text-momentum-muted">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isDone ? "bg-momentum-lime" : "bg-momentum-muted"
          }`}
          aria-hidden="true"
        />
        {isDone ? "Done" : "Pending"}
      </span>
    </li>
  );
}

export default function GroupProgressCard() {
  const { user, loading: authLoading } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return undefined;

    if (!user) {
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setLoading(true);
    setError("");

    getPrimaryGroupProgress(controller.signal)
      .then(setGroup)
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [authLoading, user]);

  if (authLoading || loading) {
    return (
      <section className="min-h-80 animate-pulse rounded-3xl border border-momentum-border bg-momentum-panel p-6">
        <div className="h-5 w-36 rounded bg-white/10" />
        <div className="mt-4 h-4 w-24 rounded bg-white/10" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-3xl border border-red-500/30 bg-momentum-panel p-6">
        <h3 className="font-semibold text-white">Group progress</h3>
        <p className="mt-2 text-sm text-red-400">{error}</p>
      </section>
    );
  }

  if (!group) {
    return (
      <section className="rounded-3xl border border-momentum-border bg-momentum-panel p-6">
        <h3 className="font-semibold text-white">No accountability group</h3>
        <p className="mt-2 text-sm text-momentum-muted">
          Create or join a group to see team progress.
        </p>
      </section>
    );
  }

  const members = group.members ?? [];
  const completedToday = members.filter(
    (member) => member.daily_status === "done",
  ).length;
  const totalMembers = members.length;

  return (
    <section className="flex flex-col rounded-3xl border border-momentum-border bg-momentum-panel p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {group.group_name}
          </h3>
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
          <MemberRow
            key={member.user_id}
            member={member}
            currentUserId={user.user_id}
          />
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-momentum-border/60 pt-4">
        <span className="text-sm text-momentum-muted">Group streak</span>
        <span className="flex items-center gap-1.5 font-semibold text-momentum-lime">
          <Flame className="h-4 w-4" aria-hidden="true" />
          {group.current_streak} days
        </span>
      </div>
    </section>
  );
}
