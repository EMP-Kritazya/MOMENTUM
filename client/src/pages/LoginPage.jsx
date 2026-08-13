import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi.js";
import { useAuth } from "../context/authContext.js";
import OnboardingHeader from "../components/onboarding/OnboardingHeader";
import TextInput from "../components/ui/TextInput";
import Button from "../components/ui/Button";

const initialValues = { username: "", email: "" };
const initialErrors = { username: "", email: "" };

function LoginPage() {
  const nav = useNavigate();
  const { refresh } = useAuth();

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  function validate(values) {
    const errors = { username: "", email: "" };

    if (!values.username.trim()) {
      errors.username = "Username is required.";
    }

    if (!values.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      errors.email = "Enter a valid email address.";
    }

    return errors;
  }

  function hasErrors(errors) {
    return Object.values(errors).some(Boolean);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await loginUser({
        username: values.username.trim(),
        email: values.email.trim().toLowerCase(),
      });

      // The server set the auth cookie; sync shared auth state before navigating.
      await refresh();
      nav("/dashboard");
    } catch (error) {
      setSubmitError(
        error.message ||
          "We couldn't find an account with that username and email.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-momentum-bg">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col">
        <OnboardingHeader showProgress={false} />

        <section className="flex flex-1 flex-col px-6 pb-6 pt-20 sm:px-8 sm:pt-28">
          <div className="mx-auto w-full max-w-2xl">
            <p className="mb-4 text-xs font-bold tracking-[0.2em] text-momentum-lime">
              WELCOME BACK
            </p>

            <h1 className="font-display m-0 text-4xl leading-[1.08] text-[#f5f5f7] sm:text-5xl">
              Log in to Momentum
            </h1>

            <p className="mt-4 text-base font-medium text-momentum-muted">
              Enter the username and email you used during onboarding.
            </p>

            <p className="mt-4 text-sm text-momentum-muted">
              New here?{" "}
              <Link
                to="/onboarding"
                className="font-semibold text-momentum-lime underline-offset-4 hover:underline focus:outline-none
                focus-visible:ring-2 focus-visible:ring-momentum-lime"
              >
                Start onboarding
              </Link>
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-10 grid grid-cols-1 gap-5"
            >
              <TextInput
                id="username"
                label="Username"
                value={values.username}
                error={errors.username}
                autoComplete="username"
                maxLength={50}
                placeholder="johndoe"
                onChange={handleChange}
              />

              <TextInput
                id="email"
                label="Email"
                type="email"
                value={values.email}
                error={errors.email}
                autoComplete="email"
                maxLength={100}
                placeholder="johndoe@example.com"
                onChange={handleChange}
              />

              <Button
                type="submit"
                className="mt-4 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Log In"}
                <span aria-hidden="true" className="ml-2">
                  →
                </span>
              </Button>

              {submitError && (
                <p role="alert" className="text-sm font-medium text-red-400">
                  {submitError}
                </p>
              )}
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
