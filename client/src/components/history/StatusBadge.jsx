const statusStyles = {
  completed: "bg-momentum-lime/10 text-momentum-lime",
  skipped: "bg-red-500/10 text-red-400",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        statusStyles[status] || "bg-white/5 text-momentum-muted",
      ].join(" ")}
    >
      {status}
    </span>
  );
}