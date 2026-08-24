import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi.js";
import { useAuth } from "../context/authContext.js";
import OnboardingHeader from "../components/onboarding/OnboardingHeader";
import TextInput from "../components/ui/TextInput";
import Button from "../components/ui/Button";
import LoaderScreen from "../components/utilities/LoaderScreen.jsx";
import GithubButton from "../components/utilities/GithubButton.jsx";

const initialValues = { email: "", password: "" };
const initialErrors = { email: "", password: "" };

function LoginPage() {
  const nav = useNavigate();
  const { user, refresh, loading } = useAuth();

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (user) {
      nav("/dashboard", { replace: true });
    }
  }, [user, nav]);

  if (loading) {
    return <LoaderScreen />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  function validate(values) {
    const errors = { email: "", password: "" };

    if (!values.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      errors.email = "Enter a valid email address.";
    }

    if (!values.password.trim()) {
      errors.password = "Password is required.";
    }

    return errors;
  }

  function hasErrors(errors) {
    return Object.values(errors).some(Boolean);
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await loginUser({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      // The server set the auth cookie; sync shared auth state before navigating.
      await refresh();
    } catch (error) {
      setSubmitError(
        error.message ||
          "We couldn't find an account with that password and email.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="max-h-screen bg-momentum-bg">
      <div className="mx-auto flex max-h-screen w-full max-w-5xl flex-col">
        <OnboardingHeader showProgress={false} />

        <section className="flex flex-1 flex-col px-6 pb-6 pt-10 sm:px-8 md:pt-15">
          <div className="mx-auto w-full max-w-2xl">
            <p className="mb-4 text-xs font-bold tracking-[0.2em] text-momentum-lime">
              WELCOME BACK
            </p>

            <h1 className="font-display m-0 text-4xl leading-[1.08] text-[#f5f5f7] sm:text-5xl">
              Log in to Momentum
            </h1>

            <div className="w-100% h-0.5 mt-5 mb-5 bg-[#181a27]"></div>

            <p className="mt-4 text-sm text-momentum-muted">
              Are you an administrator?{" "}
              <Link
                to="/admin/login"
                className="font-semibold text-momentum-lime underline-offset-4 hover:underline focus:outline-none
                    focus-visible:ring-2 focus-visible:ring-momentum-lime hover:cursor-pointer"
              >
                Sign in here
              </Link>
            </p>

            <p className="mt-4 text-sm text-momentum-muted">
              New here?{" "}
              <Link
                to="/signup"
                className="font-semibold text-momentum-lime underline-offset-4 hover:underline focus:outline-none
                focus-visible:ring-2 focus-visible:ring-momentum-lime hover:cursor-pointer"
              >
                Sign Up
              </Link>
            </p>

            <form
              onSubmit={handleLoginSubmit}
              className="mt-5 grid grid-cols-1 gap-5"
            >
              <TextInput
                id="email"
                label="Email"
                value={values.email}
                error={errors.email}
                autoComplete="email"
                maxLength={100}
                onChange={handleChange}
              />

              <TextInput
                id="password"
                label="Password"
                type="password"
                value={values.password}
                error={errors.password}
                maxLength={100}
                onChange={handleChange}
              />

              <Button
                type="submit"
                className="mt-4 w-full hover:cursor-pointer"
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
            <div className="flex items-center gap-3 my-4 mt-5 mb-5">
              <div className="h-px flex-1 bg-white" />

              <span className="text-sm text-white">or</span>

              <div className="h-px flex-1 bg-white" />
            </div>
            <GithubButton />
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
