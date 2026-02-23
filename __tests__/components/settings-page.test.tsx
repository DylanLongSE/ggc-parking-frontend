/**
 * @module SettingsPageTests
 *
 * Unit tests for the {@link SettingsPage} component.
 * Verifies rendering and dark mode toggle behavior.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/contexts/theme-context";
import { SettingsPage } from "@/components/settings-page";

function renderWithTheme() {
  return render(
    <ThemeProvider>
      <SettingsPage />
    </ThemeProvider>
  );
}

describe("SettingsPage", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("renders Settings heading @smoke", () => {
    renderWithTheme();
    expect(screen.getByRole("heading", { name: /settings/i })).toBeInTheDocument();
  });

  it("dark mode switch starts unchecked in light mode", () => {
    renderWithTheme();
    const toggle = screen.getByRole("switch", { name: /toggle dark mode/i });
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("clicking switch enables dark mode", async () => {
    const user = userEvent.setup();
    renderWithTheme();
    const toggle = screen.getByRole("switch", { name: /toggle dark mode/i });

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(document.documentElement).toHaveClass("dark");
  });
});
