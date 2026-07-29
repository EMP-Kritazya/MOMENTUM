function OnboardingHeader({ currentStep, totalSteps }) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <header>
      <div className="flex items-center justify-between border-b border-momentum-border px-6 py-6 sm:px-8">
        <div className="font-display text-2xl tracking-wide text-white">
          <span className="text-momentum-lime">M</span>omentum
        </div>
        <p className="text-sm font-semibold text-momentum-muted">
          {currentStep + 1} of {totalSteps}
        </p>
      </div>

      <div className="mx-6 mt-4 h-1 overflow-hidden rounded-full bg-[#1d2030] sm:mx-8">
        <div
          className="h-full rounded-full bg-momentum-lime transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuemin="1"
          aria-valuemax={totalSteps}
          aria-valuenow={currentStep + 1}
          aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
        />
      </div>
    </header>
  );
}

export default OnboardingHeader;
