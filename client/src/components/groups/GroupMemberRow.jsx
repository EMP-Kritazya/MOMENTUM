function getInitials(member) {
  const first = member.first_name?.charAt(0) ?? "";
  const last = member.last_name?.charAt(0) ?? "";
  return `${first}${last}`.toUpperCase() || "?";
}

export default function GroupMemberRow({ member, currentUserId }) {
  const isCurrentUser = member.user_id === currentUserId;
  const displayName = isCurrentUser
    ? "You"
    : `${member.first_name} ${member.last_name}`.trim() || member.username;
  const completed = member.daily_status === "done";

  return (
    <li className="flex items-center justify-between rounded-xl bg-[#191b25] px-3 py-2.5">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={[
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
            isCurrentUser
              ? "bg-momentum-lime text-[#11130d]"
              : "bg-[#202331] text-momentum-muted",
          ].join(" ")}
        >
          {getInitials(member)}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {displayName}
          </p>
          <p className="text-xs text-momentum-muted">
            🔥 {member.current_streak}d
          </p>
        </div>
      </div>

      <span className="flex items-center gap-1.5 text-xs text-momentum-muted">
        <span
          className={[
            "h-2 w-2 rounded-full",
            completed ? "bg-momentum-lime" : "bg-[#3b3e4c]",
          ].join(" ")}
        />
        {completed ? "Done" : "Pending"}
      </span>
    </li>
  );
}
