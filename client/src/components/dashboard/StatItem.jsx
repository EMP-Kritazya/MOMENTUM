// A single stat row: used inside the weekly progress card.
export default function StatItem({
  icon: Icon,
  label,
  value,
  valueClassName = "",
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="flex items-center gap-2 text-sm text-momentum-muted">
        {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
        {label}
      </span>
      <span className={`text-sm font-semibold text-white ${valueClassName}`}>
        {value}
      </span>
    </div>
  );
}
