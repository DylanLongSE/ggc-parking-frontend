/**
 * @module SpotViewTests
 *
 * Tests for the {@link SpotView} component.
 * Covers: chart presence in collapsible section, header elements.
 */

import { render, screen } from "@testing-library/react";
import { SpotView } from "@/components/map/spot-view";
import { ParkingLot, ParkingSpot } from "@/types/parking";

jest.mock("@/components/map/lot-schematic", () => ({
  LotSchematic: () => <div data-testid="lot-schematic" />,
}));

jest.mock("@/components/map/spot-grid", () => ({
  SpotGrid: () => <div data-testid="spot-grid" />,
}));

jest.mock("@/components/hourly-trend-chart", () => ({
  HourlyTrendChart: ({ lotId }: { lotId: string }) => (
    <div data-testid="hourly-trend-chart" data-lot-id={lotId} />
  ),
}));

const lot: ParkingLot = {
  id: "lot-w",
  name: "Parking Lot W",
  totalSpaces: 200,
  lat: 33.98,
  lng: -84.0,
};

const spots: ParkingSpot[] = [
  { id: "A1", occupied: false, type: "standard" },
  { id: "A2", occupied: true, type: "standard" },
];

describe("SpotView", () => {
  it("renders Typical Occupancy collapsible section with chart", () => {
    render(
      <SpotView lot={lot} spots={spots} isLoading={false} onClose={jest.fn()} />
    );
    expect(screen.getByText("Typical Occupancy")).toBeInTheDocument();
    const chart = screen.getByTestId("hourly-trend-chart");
    expect(chart).toBeInTheDocument();
    expect(chart).toHaveAttribute("data-lot-id", "lot-w");
  });

  it("renders back button and lot name @smoke", () => {
    render(
      <SpotView lot={lot} spots={spots} isLoading={false} onClose={jest.fn()} />
    );
    expect(screen.getByRole("button", { name: /back to map/i })).toBeInTheDocument();
    expect(screen.getByText("Parking Lot W")).toBeInTheDocument();
  });
});
