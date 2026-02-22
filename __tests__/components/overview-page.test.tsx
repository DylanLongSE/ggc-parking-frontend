import { render, screen } from "@testing-library/react";
import { OverviewPage } from "@/components/overview-page";
import { PARKING_LOTS } from "@/lib/constants";
import { LotStatus } from "@/types/parking";

const mockStatuses: Record<string, LotStatus> = {
  "lot-w": { lotId: "lot-w", carCount: 300, lastUpdated: "2026-02-21T12:00:00Z", status: "OK" },
  "parking-deck": { lotId: "parking-deck", carCount: 600, lastUpdated: "2026-02-21T12:00:00Z", status: "OK" },
  "lot-a": { lotId: "lot-a", carCount: 200, lastUpdated: "2026-02-21T12:00:00Z", status: "OK" },
  "lot-l": { lotId: "lot-l", carCount: 150, lastUpdated: "2026-02-21T12:00:00Z", status: "OK" },
  "lot-3000": { lotId: "lot-3000", carCount: 100, lastUpdated: "2026-02-21T12:00:00Z", status: "OK" },
};

describe("OverviewPage @smoke", () => {
  it("renders main heading", () => {
    render(<OverviewPage statuses={mockStatuses} isLoading={false} />);
    expect(
      screen.getByRole("heading", { name: /parking overview/i })
    ).toBeInTheDocument();
  });

  it("displays total available spots", () => {
    render(<OverviewPage statuses={mockStatuses} isLoading={false} />);
    // Total: 500+800+400+350+300=2350, occupied: 300+600+200+150+100=1350, available=1000
    expect(
      screen.getByText(/1000 of 2350 total spots available/i)
    ).toBeInTheDocument();
  });

  it("renders all 5 lot names", () => {
    render(<OverviewPage statuses={mockStatuses} isLoading={false} />);
    PARKING_LOTS.forEach((lot) => {
      expect(screen.getByText(lot.name)).toBeInTheDocument();
    });
  });

  it("shows skeleton cards when loading", () => {
    const { container } = render(
      <OverviewPage statuses={{}} isLoading={true} />
    );
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(5);
  });

  it("does not show total while loading", () => {
    render(<OverviewPage statuses={{}} isLoading={true} />);
    expect(
      screen.queryByText(/total spots available/i)
    ).not.toBeInTheDocument();
  });

  it("renders directions links for each lot", () => {
    render(<OverviewPage statuses={mockStatuses} isLoading={false} />);
    const links = screen.getAllByTitle("Open in Google Maps");
    expect(links).toHaveLength(5);
    expect(links[0]).toHaveAttribute(
      "href",
      expect.stringContaining("google.com/maps")
    );
  });
});
