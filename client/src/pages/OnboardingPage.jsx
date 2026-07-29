import { useState } from "react";
import OnboardingHeader from "../components/onboarding/OnboardingHeader";
import OnboardingNavigation from "../components/onboarding/OnboardingNavigation";
import QuestionStep from "../components/onboarding/QuestionStep";
import StepIndicators from "../components/onboarding/StepIndicators";
import { onboardingQuestions } from "../data/onboardingQuestions";
import { useNavigate } from "react-router-dom";

// Stores every profile and fitness answer collected during onboarding.
const initialAnswers = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  fitnessGoal: "",
  experienceLevel: "",
  preferredLocation: "",
  equipmentAvailable: [],
  weeklyCommitment: null,
};

// Stores field-specific validation messages for the profile form.
const initialProfileErrors = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
};

function OnboardingPage() {
  const nav = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers);
  const [showProfileStep, setShowProfileStep] = useState(true);
  const [profileErrors, setProfileErrors] = useState(initialProfileErrors);

  // Gets the active question, its answer, and whether the user may continue.
  const question = onboardingQuestions[currentStep];
  const currentAnswer = answers[question.id];
  const canContinue = Array.isArray(currentAnswer)
    ? currentAnswer.length > 0
    : currentAnswer !== "" && currentAnswer !== null;

  // Updates a profile field and clears its previous validation error.
  function handleProfileChange(event) {
    const { name, value } = event.target;

    setAnswers((current) => ({
      ...current,
      [name]: value,
    }));

    setProfileErrors((current) => ({
      ...current,
      [name]: "",
    }));
  }

  // Validates required profile fields and returns an error object.
  function validateProfile(values) {
    const errors = {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
    };

    if (!values.firstName.trim()) {
      errors.firstName = "First name is required.";
    }

    if (!values.lastName.trim()) {
      errors.lastName = "Last name is required.";
    }

    if (!values.username.trim()) {
      errors.username = "Username is required.";
    } else if (!/^[a-zA-Z0-9_]+$/.test(values.username.trim())) {
      errors.username =
        "Username can only contain letters, numbers, and underscores.";
    }

    if (!values.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    return errors;
  }

  // Returns true when at least one profile validation message exists.
  function hasErrors(errors) {
    return Object.values(errors).some(Boolean);
  }

  // Saves either a single-choice answer or a multi-select equipment answer.
  function handleSelect(value) {
    if (question.selectionType === "single") {
      setAnswers((current) => ({ ...current, [question.id]: value }));
      return;
    }

    setAnswers((current) => {
      const selected = current.equipmentAvailable;

      // "No Equipment" is exclusive and clears every other equipment choice.
      if (value === "none") {
        return {
          ...current,
          equipmentAvailable: selected.includes("none") ? [] : ["none"],
        };
      }

      const withoutNone = selected.filter((item) => item !== "none");
      const isSelected = withoutNone.includes(value);

      // Toggles the selected equipment without mutating the existing array.
      return {
        ...current,
        equipmentAvailable: isSelected
          ? withoutNone.filter((item) => item !== value)
          : [...withoutNone, value],
      };
    });
  }

  // Validates and normalizes profile data before showing fitness question one.
  function handleProfileContinue() {
    const errors = validateProfile(answers);
    setProfileErrors(errors);

    if (hasErrors(errors)) return;

    setAnswers((current) => ({
      ...current,
      firstName: current.firstName.trim(),
      lastName: current.lastName.trim(),
      username: current.username.trim(),
      email: current.email.trim().toLowerCase(),
    }));

    setShowProfileStep(false);
  }

  // Advances questions or prepares the completed frontend payload on step five.
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
          showProgress={!showProfileStep}
        />

        <section className="flex flex-1 flex-col px-6 pb-6 pt-20 sm:px-8 sm:pt-28">
          <div className="mx-auto w-full max-w-2xl">
            {/* Shows profile inputs first, then switches to fitness questions. */}
            {showProfileStep ? (
              <>
                <ProfileStep
                  values={answers}
                  errors={profileErrors}
                  onChange={handleProfileChange}
                />

                <div className="mt-8">
                  <Button
                    type="button"
                    onClick={handleProfileContinue}
                    className="w-full"
                  >
                    Continue <span aria-hidden="true">→</span>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <QuestionStep
                  key={question.id}
                  question={question}
                  stepNumber={currentStep + 1}
                  value={currentAnswer}
                  onSelect={handleSelect}
                />
                <OnboardingNavigation
                  canContinue={canContinue}
                  isFirstStep={false}
                  isLastStep={currentStep === onboardingQuestions.length - 1}
                  onBack={handleBack}
                  onContinue={handleContinue}
                />
              </>
            )}
          </div>

          {/* Hides fitness step dots while the profile form is displayed. */}
          {!showProfileStep && (
            <div className="mt-auto pt-12">
              <StepIndicators
                currentStep={currentStep}
                totalSteps={onboardingQuestions.length}
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default OnboardingPage;
