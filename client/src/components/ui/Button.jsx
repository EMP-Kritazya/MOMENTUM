/**
 * Displays a reusable primary or secondary button with shared interaction styles.
 */
const variants = {
  primary:
    "bg-momentum-lime text-[#11130d] hover:bg-[#d2ff52] disabled:bg-[#1c1f2f] disabled:text-momentum-muted",
  secondary:
    "border border-momentum-border text-white hover:border-[#454957] hover:bg-momentum-panel",
};

function Button({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  onClick,
  className = "",
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        "min-h-12 rounded-2xl px-4 font-bold transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-momentum-lime",
        "disabled:cursor-not-allowed",
        variants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
export default Button;
