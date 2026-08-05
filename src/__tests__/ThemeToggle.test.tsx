import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeContext, type Theme } from "../context/theme";
import ThemeToggle from "../components/ui/ThemeToggle";

const renderToggle = (theme: Theme) => {
  const toggleTheme = vi.fn();
  const utils = render(
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeToggle />
    </ThemeContext.Provider>,
  );
  return { toggleTheme, ...utils };
};

describe("ThemeToggle", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('offers dark mode when the theme is light', () => {
    const { container } = renderToggle("light");
    expect(
      screen.getByRole("button", { name: "Switch to dark mode" }),
    ).toBeInTheDocument();
    expect(container.querySelector(".lucide-moon")).not.toBeNull();
  });

  it('offers light mode when the theme is dark', () => {
    const { container } = renderToggle("dark");
    expect(
      screen.getByRole("button", { name: "Switch to light mode" }),
    ).toBeInTheDocument();
    expect(container.querySelector(".lucide-sun")).not.toBeNull();
  });

  it("calls toggleTheme when clicked", async () => {
    const { toggleTheme } = renderToggle("light");
    await user.click(screen.getByRole("button"));
    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });

  it("does not render the icon of the current theme", () => {
    const { container } = renderToggle("light");
    expect(container.querySelector(".lucide-sun")).toBeNull();
  });
});
