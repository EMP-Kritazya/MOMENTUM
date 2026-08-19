import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Clock from "../src/components/utilities/Clock";
import { AuthContext } from "../src/context/authContext";

function renderClock({ user = null, loading = false } = {}) {
  return render(
    <AuthContext.Provider value={{ user, loading }}>
      <Clock />
    </AuthContext.Provider>,
  );
}

describe("Clock", () => {
  it("shows a loading screen while auth is still resolving", () => {
    renderClock({ loading: true });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("greets the signed-in user by username once auth resolves", () => {
    renderClock({ user: { username: "kritazya" } });

    const now = new Date();
    const expectedGreeting =
      now.getHours() < 12
        ? "Good Morning, "
        : now.getHours() < 18
          ? "Good Afternoon, "
          : "Good Evening, ";

    expect(
      screen.getByText((_, element) => element.textContent === `${expectedGreeting}kritazya`),
    ).toBeInTheDocument();
  });
});
