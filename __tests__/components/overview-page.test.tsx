import { render, screen } from "@testing-library/react";
import { OverviewPage } from "@/components/overview-page";
import { PARKING_LOTS, LIVE_LOT_IDS } from "@/lib/constants";
import { LotStatus } from "@/types/parking";

const mockStatuses: Record<string, LotStatus> = {
  "lot-w": { lotId: "lot-w", carCount: 300, lastUpdated: "2026-02-21T12:00:00Z", status: "OK", isLive: true },
  "parking-deck": { lotId: "parking-deck", carCount: 600, lastUpdated: "2026-02-21T12:00:00Z", status: "OK", isLive: true },
  "lot-a": { lotId: "lot-a", carCount: 200, lastUpdated: "2026-02-21T12:00:00Z", status: "OK", isLive: true },
  "lot-l": { lotId: "lot-l", carCount: 150, lastUpdated: "2026-02-21T12:00:00Z", status: "OK", isLive: true },
  "lot-3000": { lotId: "lot-3000", carCount: 100, lastUpdated: "2026-02-21T12:00:00Z", status: "OK", isLive: true },
};

describe("OverviewPage @smoke", () => {
  beforeEach(() => {
    jest.spyOn(Date.prototype, "getHours").mockReturnValue(12);
  });
  afterEach(() => jest.restoreAllMocks());
  it("renders main heading", () => {
    render(<OverviewPage statuses={mockStatuses} isLoading={false} />);
    expect(
      screen.getByRole("heading", { name: /parking overview/i })
    ).toBeInTheDocument();
  });

  it("displays total available spots (live lots only)", () => {
    render(<OverviewPage statuses={mockStatuses} isLoading={false} />);
    // Only lot-w is live (capacity=36, carCount=300 → clamped to 0 available)
    expect(
      screen.getByText(/0 of 36 total spots available/i)
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

  it("shows Coming Soon badge on non-live lot cards", () => {
    render(<OverviewPage statuses={mockStatuses} isLoading={false} />);
    const nonLiveLots = PARKING_LOTS.filter((l) => !LIVE_LOT_IDS.has(l.id));
    const badges = screen.getAllByText("Coming Soon");
    expect(badges).toHaveLength(nonLiveLots.length);
  });

  it("does not show Coming Soon badge on live lot cards", () => {
    render(<OverviewPage statuses={mockStatuses} isLoading={false} />);
    const badges = screen.getAllByText("Coming Soon");
    // All Coming Soon badges should be for non-live lots only
    expect(badges.length).toBe(PARKING_LOTS.filter((l) => !LIVE_LOT_IDS.has(l.id)).length);
  });

  it("shows disclaimer message about incomplete totals", () => {
    render(<OverviewPage statuses={mockStatuses} isLoading={false} />);
    expect(
      screen.getByText(/totals only reflect lots with live data/i)
    ).toBeInTheDocument();
  });

  it("does not show disclaimer while loading", () => {
    render(<OverviewPage statuses={{}} isLoading={true} />);
    expect(
      screen.queryByText(/totals only reflect lots with live data/i)
    ).not.toBeInTheDocument();
  });

  describe("offline badge and dashes", () => {
    const offlineStatuses: Record<string, LotStatus> = {
      ...mockStatuses,
      "lot-w": { lotId: "lot-w", carCount: 22, lastUpdated: "2026-02-21T18:55:00Z", status: "OK", isLive: false },
    };

    it("shows Offline badge on lot card when not live and outside hours", () => {
      jest.spyOn(Date.prototype, "getHours").mockReturnValue(21);
      render(<OverviewPage statuses={offlineStatuses} isLoading={false} />);
      expect(screen.getByText("Offline")).toBeInTheDocument();
      expect(screen.queryByText("Mock Data")).not.toBeInTheDocument();
    });

    it("shows -- count on lot card when offline", () => {
      jest.spyOn(Date.prototype, "getHours").mockReturnValue(21);
      render(<OverviewPage statuses={offlineStatuses} isLoading={false} />);
      expect(screen.getByText("--")).toBeInTheDocument();
    });

    it("shows Mock Data badge when not live but inside hours", () => {
      jest.spyOn(Date.prototype, "getHours").mockReturnValue(12);
      render(<OverviewPage statuses={offlineStatuses} isLoading={false} />);
      expect(screen.getByText("Mock Data")).toBeInTheDocument();
      expect(screen.queryByText("Offline")).not.toBeInTheDocument();
    });

    it("shows -- in header totals when all live lots are offline outside hours", () => {
      jest.spyOn(Date.prototype, "getHours").mockReturnValue(21);
      render(<OverviewPage statuses={offlineStatuses} isLoading={false} />);
      expect(screen.getByText(/-- of 36 total spots available/i)).toBeInTheDocument();
    });

    it("shows numeric header totals when inside hours", () => {
      jest.spyOn(Date.prototype, "getHours").mockReturnValue(12);
      render(<OverviewPage statuses={offlineStatuses} isLoading={false} />);
      // lot-w: 36 - 22 = 14 available
      expect(screen.getByText(/14 of 36 total spots available/i)).toBeInTheDocument();
    });
  });
});
