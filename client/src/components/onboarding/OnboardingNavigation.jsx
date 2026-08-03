import Button from "../ui/Button";

/**
 * Displays the Back and Continue buttons used to navigate onboarding steps.
 */
function OnboardingNavigation({
  canContinue,
  isFirstStep,
  isLastStep,
  isSubmitting,
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
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
        >
          Back
        </Button>
      )}

      {/* Prevents incomplete answers and duplicate submissions. */}
      <Button
        type="button"
        variant="primary"
        disabled={!canContinue || isSubmitting}
        onClick={onContinue}
        className="min-h-12 rounded-2xl bg-momentum-lime px-4 font-bold text-[#11130d] transition-colors hover:bg-[#d2ff52] focus:outline-none focus-visible:ring-2 focus-visible:ring-momentum-lime focus-visible:ring-offset-2 focus-visible:ring-offset-momentum-bg disabled:cursor-not-allowed disabled:bg-[#1c1f2f] disabled:text-momentum-muted"
      >
        {isSubmitting
          ? "Saving..."
          : isLastStep
            ? "Generate My Plan"
            : "Continue"}
        <span aria-hidden="true" className="ml-2">
          →
        </span>
      </Button>
    </div>
  );
}

export default OnboardingNavigation;
