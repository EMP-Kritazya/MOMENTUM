/**
 * Displays the administrator login form and handles credential validation.
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import OnboardingHeader from "../components/onboarding/OnboardingHeader";
import Button from "../components/ui/Button";
import TextInput from "../components/ui/TextInput";

function AdminLoginPage() {
    const initialValues = {
        email: "",
        password: "",
    };

    const initialErrors = {
        email: "",
        password: "",
    }

    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState(initialErrors)
    const [serverError, setServerError] = useState("")
    const [isSubmitting] = useState(false)

    function handleChange(event) {
        const { name, value } = event.target
        setValues(current => ({
            ...current,
            [name]: value,
        }))

        setErrors(current => ({
            ...current,
            [name]: "",
        }))

        setServerError("")
    }

    function validateLogin(values) {
        const nextErrors = {
            email: "",
            password: "",
        }

        if (!values.email.trim()) {
            nextErrors.email = "Email is required."
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
            nextErrors.email = "Enter a valid email adrress."
        }

        if (!values.password) {
            nextErrors.password = "Password is required.";
        }
        return nextErrors;
    }

    function hasErrors(errors) {
        return Object.values(errors).some(Boolean)
    }

    function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateLogin(values);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) return;

    console.log("Admin login UI is ready for API integration.");
    }

  return (
    <main className="min-h-screen bg-momentum-bg">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col">
        <OnboardingHeader showProgress={false} />

        <section className="flex flex-1 items-center px-6 py-12 sm:px-8">
          <div className="mx-auto w-full max-w-md">
            <p className="mb-4 text-xs font-bold tracking-[0.2em] text-momentum-lime">
              ADMINISTRATOR ACCESS
            </p>

            <h1 className="font-display m-0 text-4xl leading-[1.08] text-[#f5f5f7] sm:text-5xl">
              Sign in to manage Momentum
            </h1>

            <p className="mt-4 text-base font-medium text-momentum-muted">
              Use the administrator credentials provided by the project owner.
            </p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
              <TextInput
                id="email"
                label="Admin email"
                type="email"
                value={values.email}
                error={errors.email}
                autoComplete="username"
                maxLength={100}
                placeholder="admin@example.com"
                onChange={handleChange}
              />
              <TextInput
                id="password"
                label="Password"
                type="password"
                value={values.password}
                error={errors.password}
                autoComplete="current-password"
                onChange={handleChange}
              />

              {serverError && (
                <p role="alert" className="text-sm font-medium text-red-400">
                  {serverError}
                </p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Signing in..." : "Sign in as Administrator"}
              </Button>
            </form>

            <Link
              to="/"
              className="mt-6 block text-center text-sm font-semibold text-momentum-muted hover:text-momentum-lime"
            >
              Return to member onboarding
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminLoginPage;