/**
 * @module BottomTabsTests
 *
 * Smoke tests for the {@link BottomTabs} component.
 * Verifies rendering, active-tab highlighting, and tab-change callbacks
 * without mounting a real router or map.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BottomTabs } from "@/components/bottom-tabs";

describe("BottomTabs @smoke", () => {
  const onTabChange = jest.fn();

  it("renders all three tab buttons", () => {
    render(<BottomTabs activeTab="lots" onTabChange={onTabChange} />);

    expect(screen.getByRole("button", { name: /lots/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /overview/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /info/i })).toBeInTheDocument();
  });

  it("renders settings tab button", () => {
    render(<BottomTabs activeTab="lots" onTabChange={onTabChange} />);
    expect(screen.getByRole("button", { name: /settings/i })).toBeInTheDocument();
  });

  it("highlights active tab with bg-primary", () => {
    render(<BottomTabs activeTab="overview" onTabChange={onTabChange} />);

    expect(screen.getByRole("button", { name: /overview/i })).toHaveClass(
      "bg-primary"
    );
    expect(screen.getByRole("button", { name: /lots/i })).not.toHaveClass(
      "bg-primary"
    );
  });

  it("pill container does not use hardcoded bg-gray-900", () => {
    const { container } = render(
      <BottomTabs activeTab="lots" onTabChange={onTabChange} />
    );
    const pill = container.firstChild as HTMLElement;
    expect(pill.className).not.toContain("bg-gray-900");
  });

  it("calls onTabChange when a tab is clicked", async () => {
    const user = userEvent.setup();
    render(<BottomTabs activeTab="lots" onTabChange={onTabChange} />);

    await user.click(screen.getByRole("button", { name: /overview/i }));
    expect(onTabChange).toHaveBeenCalledWith("overview");

    await user.click(screen.getByRole("button", { name: /info/i }));
    expect(onTabChange).toHaveBeenCalledWith("info");
  });
});
