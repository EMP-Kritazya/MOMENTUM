import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, signUpUser } from "../api/authApi.js";
import { useAuth } from "../context/authContext.js";
import OnboardingHeader from "../components/onboarding/OnboardingHeader";
import TextInput from "../components/ui/TextInput";
import Button from "../components/ui/Button";
import LoaderScreen from "../components/utilities/LoaderScreen.jsx";
import GithubButton from "../components/utilities/GithubButton.jsx";

const initialValues = {
  firstname: "",
  lastname: "",
  username: "",
  email: "",
  password: "",
};
const initialErrors = { username: "", email: "", password: "" };

function SignUpPage() {
  const nav = useNavigate();
  const { user, refresh, loading } = useAuth();

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (user && user.onboarded) nav("/dashboard", { replace: true });
  }, [nav, user]);

  if (loading) {
    return <LoaderScreen />;
  }

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

  async function handleSignUpSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await signUpUser({
        firstname: values.firstname.trim(),
        lastname: values.lastname.trim(),
        username: values.username.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      // The server set the auth cookie; sync shared auth state before navigating.
      await refresh();
      nav("/onboarding", { replace: true });
    } catch (error) {
      setSubmitError(error.message || "We couldn't register. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-momentum-bg">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col">
        <OnboardingHeader showProgress={false} />

        <section className="flex flex-1 flex-col md:flex-row px-6 pb-6 pt-10 sm:px-8 md:pt-28 justify-between">
          <div className="mx-0 md:max-w-[30%]">
            <p className="mb-4 text-xs font-bold tracking-[0.2em] text-momentum-lime">
              Welcome. LET'S GET STARTED
            </p>

            <h1 className="font-display m-0 mb-2 text-4xl leading-[1.08] text-[#f5f5f7] sm:text-5xl">
              SignUp to Momentum
            </h1>

            <p className="mt-2 text-base font-medium text-momentum-muted">
              Please enter your details here
            </p>

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
              Already have an account with us?{" "}
              <Link
                to="/"
                className="font-semibold text-momentum-lime underline-offset-4 hover:underline focus:outline-none
                focus-visible:ring-2 focus-visible:ring-momentum-lime hover:cursor-pointer"
              >
                Log In
              </Link>
            </p>

            {/* -Or- */}
            <div className="flex items-center gap-3 my-4 mt-5 md:mt-10">
              <div className="h-px flex-1 bg-white" />

              <span className="text-sm text-white">or</span>

              <div className="h-px flex-1 bg-white" />
            </div>
            <GithubButton />
          </div>
          <div className="mt-10 md:mt-0 md:w-[60%]">
            <form
              onSubmit={handleSignUpSubmit}
              className="mt-0 grid grid-cols-1 gap-5"
            >
              <TextInput
                id="firstname"
                label="First Name"
                value={values.firstname}
                error={errors.firstname}
                autoComplete="firstname"
                maxLength={50}
                onChange={handleChange}
              />
              <TextInput
                id="lastname"
                label="Last Name"
                value={values.lastname}
                error={errors.lastname}
                autoComplete="lastname"
                maxLength={50}
                onChange={handleChange}
              />
              <TextInput
                id="username"
                label="Username"
                value={values.username}
                error={errors.username}
                autoComplete="username"
                maxLength={50}
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
                {isSubmitting ? "Signing Up..." : "Sign Up"}
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

export default SignUpPage;
