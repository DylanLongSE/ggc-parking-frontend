import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InfoPage } from "@/components/info-page";

describe("InfoPage", () => {
  it("renders main heading", () => {
    render(<InfoPage />);
    expect(
      screen.getByRole("heading", { name: /parking info/i })
    ).toBeInTheDocument();
  });

  it("renders all 5 section titles", () => {
    render(<InfoPage />);
    expect(screen.getByText("Parking Hours")).toBeInTheDocument();
    expect(screen.getByText("Permit Types")).toBeInTheDocument();
    expect(screen.getByText("Parking Rules")).toBeInTheDocument();
    expect(screen.getByText("Fines & Appeals")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("expands section when clicked", async () => {
    const user = userEvent.setup();
    render(<InfoPage />);

    await user.click(screen.getByText("Parking Hours"));
    expect(
      screen.getByText(/Enforced 24 hrs/i)
    ).toBeVisible();
  });

  it("contains contact information", async () => {
    const user = userEvent.setup();
    render(<InfoPage />);

    await user.click(screen.getByText("Contact"));
    expect(screen.getByText("GGC Parking Services")).toBeVisible();
    expect(screen.getByText(/678\.407\.5015/)).toBeVisible();
  });
});
