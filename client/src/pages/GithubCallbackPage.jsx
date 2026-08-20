import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { establishGithubSession } from "../api/authApi.js";
import { useAuth } from "../context/authContext.js";
import LoaderScreen from "../components/utilities/LoaderScreen.jsx";

// Landing page after github redirection. Since creating token during redirection caused issues
function GithubCallbackPage() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const { refresh } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      nav("/?error=github_auth", { replace: true });
      return;
    }

    (async () => {
      try {
        await establishGithubSession(token);
        await refresh();
        nav("/dashboard", { replace: true });
      } catch (error) {
        nav(`/?error=${encodeURIComponent(error.message || "github_auth")}`, {
          replace: true,
        });
      }
    })();
  }, []);

  return <LoaderScreen />;
}

export default GithubCallbackPage;
