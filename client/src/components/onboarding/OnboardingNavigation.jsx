function OnboardingNavigation({
  canContinue,
  isFirstStep,
  isLastStep,
  onBack,
  onContinue,
}) {
  return (
    <div
      className={[
        "mt-8 grid gap-3",
        isFirstStep ? "grid-cols-1" : "grid-cols-2",
      ].join(" ")}
    >
      {!isFirstStep && (
        <button
          type="button"
          onClick={onBack}
          className="min-h-12 rounded-2xl border border-momentum-border font-semibold text-white transition-colors hover:border-[#454957] hover:bg-momentum-panel focus:outline-none focus-visible:ring-2 focus-visible:ring-momentum-lime"
        >
          Back
        </button>
      )}

      <button
        type="button"
        disabled={!canContinue}
        onClick={onContinue}
        className="min-h-12 rounded-2xl bg-momentum-lime px-4 font-bold text-[#11130d] transition-colors hover:bg-[#d2ff52] focus:outline-none focus-visible:ring-2 focus-visible:ring-momentum-lime focus-visible:ring-offset-2 focus-visible:ring-offset-momentum-bg disabled:cursor-not-allowed disabled:bg-[#1c1f2f] disabled:text-momentum-muted"
      >
        {isLastStep ? "Generate My Plan" : "Continue"}
        <span aria-hidden="true" className="ml-2">
          →
        </span>
      </button>
    </div>
  );
}

export default OnboardingNavigation;
