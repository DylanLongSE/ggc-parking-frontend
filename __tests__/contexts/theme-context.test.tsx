/**
 * @module ThemeContextTests
 *
 * Unit tests for ThemeProvider and useTheme hook.
 */

import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "@/contexts/theme-context";

/** Helper component that renders current theme and a toggle button */
function Fixture() {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </>
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

describe("ThemeContext", () => {
  it("defaults to light theme with no stored value", () => {
    render(
      <ThemeProvider>
        <Fixture />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it('reads "dark" from localStorage on mount @smoke', async () => {
    localStorage.setItem("theme", "dark");
    await act(async () => {
      render(
        <ThemeProvider>
          <Fixture />
        </ThemeProvider>
      );
    });
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveClass("dark");
  });

  it("toggleTheme switches light → dark, adds class, updates localStorage", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Fixture />
      </ThemeProvider>
    );
    await user.click(screen.getByRole("button", { name: /toggle/i }));
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("toggleTheme switches dark → light, removes class, updates localStorage", async () => {
    localStorage.setItem("theme", "dark");
    const user = userEvent.setup();
    await act(async () => {
      render(
        <ThemeProvider>
          <Fixture />
        </ThemeProvider>
      );
    });
    await user.click(screen.getByRole("button", { name: /toggle/i }));
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(document.documentElement).not.toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("useTheme throws when used outside ThemeProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Fixture />)).toThrow(
      "useTheme must be used within ThemeProvider"
    );
    spy.mockRestore();
  });
});
