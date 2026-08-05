import FieldError from "./FieldError";

/**
 * Displays a reusable controlled text input with a label and validation error.
 */
function TextInput({
  id,
  label,
  type = "text",
  value,
  error,
  autoComplete,
  maxLength,
  placeholder,
  onChange,
}) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-[#f2f2f5]"
      >
        {label}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={onChange}
        className={[
          "min-h-14 w-full rounded-2xl border bg-momentum-panel px-4",
          "text-[#f2f2f5] outline-none placeholder:text-momentum-muted",
          "transition-colors focus:ring-2 focus:ring-momentum-lime",
          error
            ? "border-red-400"
            : "border-momentum-border focus:border-momentum-lime",
        ].join(" ")}
      />

      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}

export default TextInput;
