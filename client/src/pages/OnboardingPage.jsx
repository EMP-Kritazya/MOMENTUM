import { useState } from "react";
import OnboardingHeader from "../components/onboarding/OnboardingHeader";
import OnboardingNavigation from "../components/onboarding/OnboardingNavigation";
import QuestionStep from "../components/onboarding/QuestionStep";
import StepIndicators from "../components/onboarding/StepIndicators";
import { onboardingQuestions } from "../data/onboardingQuestions";
import { useNavigate } from "react-router-dom";

const initialAnswers = {
  fitnessGoal: "",
  experienceLevel: "",
  preferredLocation: "",
  equipmentAvailable: [],
  weeklyCommitment: null,
};

function OnboardingPage() {
  const nav = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers);

  const question = onboardingQuestions[currentStep];
  const currentAnswer = answers[question.id];
  const canContinue = Array.isArray(currentAnswer)
    ? currentAnswer.length > 0
    : currentAnswer !== "" && currentAnswer !== null;

  function handleSelect(value) {
    if (question.selectionType === "single") {
      setAnswers((current) => ({ ...current, [question.id]: value }));
      return;
    }

    setAnswers((current) => {
      const selected = current.equipmentAvailable;

      if (value === "none") {
        return {
          ...current,
          equipmentAvailable: selected.includes("none") ? [] : ["none"],
        };
      }

      const withoutNone = selected.filter((item) => item !== "none");
      const isSelected = withoutNone.includes(value);

      return {
        ...current,
        equipmentAvailable: isSelected
          ? withoutNone.filter((item) => item !== value)
          : [...withoutNone, value],
      };
    });
  }

  function handleContinue() {
    if (!canContinue) return;

    if (currentStep === onboardingQuestions.length - 1) {
      // The API submission will replace this when the backend route is ready.
      console.log("Onboarding answers:", answers);
      nav("/");
      
      return;
    }

    setCurrentStep((step) => step + 1);
  }


  return (
    <main className="min-h-screen bg-momentum-bg">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col">
        <OnboardingHeader
          currentStep={currentStep}
          totalSteps={onboardingQuestions.length}
        />

        <section className="flex flex-1 flex-col px-6 pb-6 pt-20 sm:px-8 sm:pt-28">
          <div className="mx-auto w-full max-w-2xl">
            <QuestionStep
              key={question.id}
              question={question}
              stepNumber={currentStep + 1}
              value={currentAnswer}
              onSelect={handleSelect}
            />
            <OnboardingNavigation
              canContinue={canContinue}
              isFirstStep={currentStep === 0}
              isLastStep={currentStep === onboardingQuestions.length - 1}
              onBack={() => setCurrentStep((step) => step - 1)}
              onContinue={handleContinue}
            />
          </div>

          <div className="mt-auto pt-12">
            <StepIndicators
              currentStep={currentStep}
              totalSteps={onboardingQuestions.length}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

export default OnboardingPage;
