export default function ProgressBar({ value = 0, className = "" }) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-2 w-full overflow-hidden rounded-full bg-white/5 ${className}`}
    >
      <div
        className="h-full rounded-full bg-momentum-lime transition-[width] duration-500"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
