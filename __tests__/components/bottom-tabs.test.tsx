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

  it("highlights active tab with bg-primary", () => {
    render(<BottomTabs activeTab="overview" onTabChange={onTabChange} />);

    expect(screen.getByRole("button", { name: /overview/i })).toHaveClass(
      "bg-primary"
    );
    expect(screen.getByRole("button", { name: /lots/i })).not.toHaveClass(
      "bg-primary"
    );
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
