import { useEffect, useState } from "react";
import { Users, Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { getUserGroups, getGroupMembers } from "../../api/groupsApi.js";
import { useAuth } from "../../context/authContext.js";

function MemberRow({ member, currentUserId }) {
  const isCurrentUser = member.user_id === currentUserId;
  const isDone = member.daily_status === "done";
  const displayName = isCurrentUser
    ? "You"
    : `${member.firstname} ${member.lastname}`.trim() || member.username;
  const initial = member.firstname?.charAt(0).toUpperCase() || "?";

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
        className={`flex items-center gap-2 text-sm ${
          isCurrentUser ? "font-semibold text-momentum-lime" : "text-white"
        }`}
      >
        {displayName}
        <p className="text-xs text-momentum-muted">
          🔥 {member.current_streak}d
        </p>
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
  const [groups, setGroups] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
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

    getUserGroups(controller.signal)
      .then(async (groupRows) => {
        const groupsWithMembers = await Promise.all(
          groupRows.map(async (groupRow) => ({
            ...groupRow,
            members: await getGroupMembers(
              groupRow.group_id,
              controller.signal,
            ),
          })),
        );
        setGroups(groupsWithMembers);
        setActiveIndex(0);
      })
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

  const groupCount = groups.length;
  const group = groups[activeIndex] ?? null;

  function showPrevGroup() {
    setActiveIndex((index) => (index - 1 + groupCount) % groupCount);
  }

  function showNextGroup() {
    setActiveIndex((index) => (index + 1) % groupCount);
  }

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

      {groupCount > 1 && (
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-momentum-border/60 bg-white/5 px-2 py-1.5">
          <button
            type="button"
            onClick={showPrevGroup}
            aria-label="Previous group"
            className="flex h-7 w-7 items-center justify-center rounded-full text-momentum-muted transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          <span className="text-xs font-semibold text-momentum-muted">
            {activeIndex + 1} of {groupCount} groups
          </span>

          <button
            type="button"
            onClick={showNextGroup}
            aria-label="Next group"
            className="flex h-7 w-7 items-center justify-center rounded-full text-momentum-muted transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}

      <ul className="mt-4 flex flex-col divide-y divide-momentum-border/40">
        {members.map((member) => (
          <MemberRow
            key={member.user_id}
            member={member}
            currentUserId={user.user_id}
          />
        ))}
      </ul>
    </section>
  );
}
