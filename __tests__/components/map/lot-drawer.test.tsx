import { render, screen } from "@testing-library/react";
import { LotDrawer } from "@/components/map/lot-drawer";
import { ParkingLot, LotStatus } from "@/types/parking";

const lot: ParkingLot = {
  id: "lot-w",
  name: "Parking Lot W",
  totalSpaces: 200,
  lat: 33.98,
  lng: -84.0,
};

const status: LotStatus = {
  lotId: "lot-w",
  carCount: 80,
  lastUpdated: "2026-02-21T11:45:00Z",
  status: "OK",
};

const comingSoonLot: ParkingLot = {
  id: "lot-a",
  name: "A Lot",
  totalSpaces: 400,
  lat: 33.979519,
  lng: -84.002343,
};

describe("LotDrawer", () => {
  beforeEach(() => {
    jest.spyOn(Date, "now").mockReturnValue(
      new Date("2026-02-21T12:00:00Z").getTime()
    );
    jest.spyOn(Date.prototype, "getHours").mockReturnValue(12);
  });

  it("has translate-y-full when lot is null (hidden)", () => {
    const { container } = render(
      <LotDrawer lot={null} status={undefined} onClose={jest.fn()} />
    );
    expect(container.firstChild).toHaveClass("translate-y-full");
  });

  it("has translate-y-0 when lot is provided (visible)", () => {
    const { container } = render(
      <LotDrawer lot={lot} status={status} onClose={jest.fn()} />
    );
    expect(container.firstChild).toHaveClass("translate-y-0");
  });

  it("displays lot name as heading", () => {
    render(<LotDrawer lot={lot} status={status} onClose={jest.fn()} />);
    expect(screen.getByRole("heading", { name: lot.name })).toBeInTheDocument();
  });

  it("displays available spots correctly", () => {
    render(<LotDrawer lot={lot} status={status} onClose={jest.fn()} />);
    // 200 - 80 = 120
    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.getByText(/spots available out of 200/i)).toBeInTheDocument();
  });

  it("displays directions link with correct URL", () => {
    render(<LotDrawer lot={lot} status={status} onClose={jest.fn()} />);
    const link = screen.getByRole("link", { name: /directions/i });
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining("google.com/maps")
    );
    expect(link).toHaveAttribute("href", expect.stringContaining("33.98"));
  });

  it("displays last updated time", () => {
    render(<LotDrawer lot={lot} status={status} onClose={jest.fn()} />);
    expect(screen.getByText(/last updated: 15 min ago/i)).toBeInTheDocument();
  });

  it("renders hourly trend chart", () => {
    render(<LotDrawer lot={lot} status={status} onClose={jest.fn()} />);
    expect(screen.getByText("Typical Occupancy")).toBeInTheDocument();
  });

  it("does not show last updated when status is undefined", () => {
    render(<LotDrawer lot={lot} status={undefined} onClose={jest.fn()} />);
    expect(screen.queryByText(/last updated/i)).not.toBeInTheDocument();
  });

  it("shows coming soon message for non-live lot", () => {
    render(<LotDrawer lot={comingSoonLot} status={undefined} onClose={jest.fn()} />);
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
    expect(screen.getByText(/not available yet/i)).toBeInTheDocument();
  });

  it("does not show availability data for non-live lot", () => {
    render(<LotDrawer lot={comingSoonLot} status={undefined} onClose={jest.fn()} />);
    expect(screen.queryByText(/spots available/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/last updated/i)).not.toBeInTheDocument();
  });
});
