import { useState, useEffect } from "react";
import { createOnboardingUser } from "../api/usersApi.js";
import { useAuth } from "../context/authContext.js";
import OnboardingHeader from "../components/onboarding/OnboardingHeader";
import OnboardingNavigation from "../components/onboarding/OnboardingNavigation";
import QuestionStep from "../components/onboarding/QuestionStep";
import StepIndicators from "../components/onboarding/StepIndicators";
import { onboardingQuestions } from "../data/onboardingQuestions";
import { useNavigate } from "react-router-dom";
import LoaderScreen from "../components/utilities/LoaderScreen.jsx";

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

function OnboardingPage() {
  const nav = useNavigate();
  const { user, loading, refresh } = useAuth();

  // Controls the active fitness question and all onboarding form data.
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers);
  // Tracks the final API request and any server error message.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!loading && !user) nav("/", { replace: true });
    if (user && user.onboarded) nav("/dashboard", { replace: true });
  }, [loading, nav, user]);

  if (loading) {
    return <LoaderScreen />;
  }

  // Gets the active question, its answer, and whether the user may continue.
  const question = onboardingQuestions[currentStep];
  const currentAnswer = answers[question.id];
  const canContinue = Array.isArray(currentAnswer)
    ? currentAnswer.length > 0
    : currentAnswer !== "" && currentAnswer !== null;

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
  // Advances questions, then submits the completed onboarding form.
  async function handleContinue() {
    if (!canContinue || isSubmitting) return;

    if (currentStep !== onboardingQuestions.length - 1) {
      setCurrentStep((step) => step + 1);
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Converts the UI state to the API's expected field names.
      const payload = buildUserPayload(answers);
      await createOnboardingUser(payload);

      // The server set the auth cookie; sync shared auth state before navigating.
      await refresh();
      nav("/dashboard", { replace: true });
    } catch (error) {
      // Shows the server error without leaving the onboarding page.
      setSubmitError(
        error.message || "Failed to submit onboarding information.",
      );
    } finally {
      // Re-enables submission whether the request succeeds or fails.
      setIsSubmitting(false);
    }
  }

  // Moves to the previous question; does nothing on the first step.
  function handleBack() {
    setCurrentStep((step) => Math.max(0, step - 1));
  }

  // Converts camelCase React state into snake_case database field names.
  function buildUserPayload(values) {
    return {
      username: values.username.trim(),
      firstname: values.firstName.trim(),
      lastname: values.lastName.trim(),
      email: values.email.trim().toLowerCase(),
      fitness_goal: values.fitnessGoal,
      experience_level: values.experienceLevel,
      preferred_location: values.preferredLocation,
      equipment_available: values.equipmentAvailable,
      weekly_commitment: values.weeklyCommitment,
      onboarded: true,
    };
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
              isFirstStep={false}
              isLastStep={currentStep === onboardingQuestions.length - 1}
              onBack={handleBack}
              onContinue={handleContinue}
              isSubmitting={isSubmitting}
            />
            {submitError && (
              <p role="alert" className="mt-4 text-sm font-medium text-red-400">
                {submitError}
              </p>
            )}
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
