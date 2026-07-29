function StepIndicators({ currentStep, totalSteps }) {
  return (
    <div
      className="flex justify-center gap-2"
      aria-label={`Question ${currentStep + 1} of ${totalSteps}`}
    >
      {Array.from({ length: totalSteps }, (_, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={[
            "h-2 rounded-full transition-all",
            index === currentStep
              ? "w-6 bg-momentum-lime"
              : index < currentStep
                ? "w-2 bg-[#728e1e]"
                : "w-2 bg-[#1c1f2f]",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

export default StepIndicators;
