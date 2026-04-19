import { render, screen, waitFor } from "@testing-library/react";
import { HourlyTrendChart } from "@/components/hourly-trend-chart";
import { ParkingLot } from "@/types/parking";

jest.mock("@/lib/api", () => ({
  getLotHistory: jest.fn(() =>
    Promise.resolve([
      { hour: 7,  avgOccupancy: 6  },
      { hour: 8,  avgOccupancy: 22 },
      { hour: 9,  avgOccupancy: 30 },
      { hour: 10, avgOccupancy: 32 },
      { hour: 11, avgOccupancy: 33 },
      { hour: 12, avgOccupancy: 31 },
      { hour: 13, avgOccupancy: 30 },
      { hour: 14, avgOccupancy: 31 },
      { hour: 15, avgOccupancy: 28 },
      { hour: 16, avgOccupancy: 24 },
      { hour: 17, avgOccupancy: 22 },
      { hour: 18, avgOccupancy: 16 },
    ])
  ),
}));

const lot: ParkingLot = {
  id: "lot-w",
  name: "Parking Lot W",
  totalSpaces: 35,
  lat: 33.98,
  lng: -84.0,
};

const defaultProps = {
  lotId: "lot-w",
  lot,
  freeCount: 6,
  occupiedCount: 29,
  isOffline: false,
};

describe("HourlyTrendChart", () => {
  it("renders stat cards @smoke", async () => {
    render(<HourlyTrendChart {...defaultProps} />);
    expect(screen.getByText("Available")).toBeInTheDocument();
    expect(screen.getByText("Occupied")).toBeInTheDocument();
    expect(screen.getByText("Total Spots")).toBeInTheDocument();
  });

  it("shows live counts in stat cards when online", async () => {
    render(<HourlyTrendChart {...defaultProps} />);
    expect(screen.getByText("6")).toBeInTheDocument();  // freeCount
    expect(screen.getByText("29")).toBeInTheDocument(); // occupiedCount
    expect(screen.getByText("35")).toBeInTheDocument(); // capacity
  });

  it("shows dashes in stat cards when offline", () => {
    render(<HourlyTrendChart {...defaultProps} isOffline={true} />);
    expect(screen.getAllByText("—")).toHaveLength(2); // available + occupied
    expect(screen.getByText("35")).toBeInTheDocument(); // total always shows
  });

  it("renders Typical Occupancy heading", () => {
    render(<HourlyTrendChart {...defaultProps} />);
    expect(screen.getByText("Typical Occupancy")).toBeInTheDocument();
  });

  it("renders 12 hour labels after data loads", async () => {
    render(<HourlyTrendChart {...defaultProps} />);
    await waitFor(() => expect(screen.getByText("7a")).toBeInTheDocument());
    expect(screen.getByText("12p")).toBeInTheDocument();
    expect(screen.getByText("6p")).toBeInTheDocument();
  });
});
