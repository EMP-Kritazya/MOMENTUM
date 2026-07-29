function OptionCard({ option, selected, multiple, onChange, name }) {
  return (
    <label
      className={[
        "flex min-h-16 cursor-pointer items-center justify-between rounded-2xl border px-5 py-4",
        "transition-colors duration-150 focus-within:ring-2 focus-within:ring-momentum-lime focus-within:ring-offset-2 focus-within:ring-offset-momentum-bg",
        selected
          ? "border-momentum-lime bg-[#1a1d25]"
          : "border-momentum-border bg-momentum-panel hover:border-[#454957]",
      ].join(" ")}
    >
      <span className="text-sm font-semibold text-[#f2f2f5]">
        {option.label}
      </span>
      <input
        className="sr-only"
        type={multiple ? "checkbox" : "radio"}
        name={name}
        value={option.value}
        checked={selected}
        onChange={() => onChange(option.value)}
      />
      <span
        aria-hidden="true"
        className={[
          "grid size-5 shrink-0 place-items-center rounded-full border",
          selected
            ? "border-momentum-lime bg-momentum-lime"
            : "border-momentum-border",
        ].join(" ")}
      >
        {selected && <span className="size-2 rounded-full bg-momentum-bg" />}
      </span>
    </label>
  );
}

export default OptionCard;
