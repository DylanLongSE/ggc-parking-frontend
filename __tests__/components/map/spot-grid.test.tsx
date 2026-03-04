/**
 * @module SpotGridTests
 *
 * Tests for the {@link SpotGrid} component.
 * Covers: loading skeletons, empty state, cell colors.
 */

import { render, screen } from "@testing-library/react";
import { SpotGrid } from "@/components/map/spot-grid";
import { ParkingSpot } from "@/types/parking";

const mockSpots: ParkingSpot[] = [
  { id: "A1", occupied: false, type: "standard" },
  { id: "A2", occupied: true,  type: "standard" },
  { id: "A3", occupied: false, type: "standard" },
  { id: "B1", occupied: true,  type: "standard" },
  { id: "B2", occupied: false, type: "standard" },
];

describe("SpotGrid @smoke", () => {
  it("shows skeleton cells when loading", () => {
    const { container } = render(<SpotGrid spots={[]} isLoading={true} />);
    const pulsingEls = container.querySelectorAll(".animate-pulse");
    expect(pulsingEls.length).toBeGreaterThan(0);
  });

  it("shows empty state message when no spots and not loading", () => {
    render(<SpotGrid spots={[]} isLoading={false} />);
    expect(screen.getByText("No spot data available yet")).toBeInTheDocument();
  });

  it("renders aria-labels for all spots", () => {
    render(<SpotGrid spots={mockSpots} isLoading={false} />);
    expect(screen.getByLabelText("Spot A1: free")).toBeInTheDocument();
    expect(screen.getByLabelText("Spot A2: occupied")).toBeInTheDocument();
    expect(screen.getByLabelText("Spot B1: occupied")).toBeInTheDocument();
  });

  it("applies green class to free standard spots", () => {
    render(<SpotGrid spots={[{ id: "A1", occupied: false, type: "standard" }]} isLoading={false} />);
    const cell = screen.getByLabelText("Spot A1: free");
    expect(cell.className).toContain("bg-green-500");
  });

  it("applies red class to occupied standard spots", () => {
    render(<SpotGrid spots={[{ id: "A2", occupied: true, type: "standard" }]} isLoading={false} />);
    const cell = screen.getByLabelText("Spot A2: occupied");
    expect(cell.className).toContain("bg-red-500");
  });

  it("applies sky-400 class to free handicap spots", () => {
    render(<SpotGrid spots={[{ id: "C1", occupied: false, type: "handicap" }]} isLoading={false} />);
    const cell = screen.getByLabelText("Spot C1: free");
    expect(cell.className).toContain("bg-sky-400");
  });

  it("applies amber-400 class to blocked spots regardless of occupancy", () => {
    render(<SpotGrid spots={[{ id: "D1", occupied: false, type: "blocked" }]} isLoading={false} />);
    const cell = screen.getByLabelText("Spot D1: free");
    expect(cell.className).toContain("bg-amber-400");
  });

});