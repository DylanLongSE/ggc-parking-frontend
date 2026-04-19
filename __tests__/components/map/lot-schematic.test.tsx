/**
 * @module LotSchematicTests
 *
 * Tests for the {@link LotSchematic} component (v2 — painted-line parking bays).
 * Covers: spot count, aria-labels, fill colors, icons, legend, entrance, unknown spots.
 *
 * Column naming (near→far): A×23, B×20, C×20, D×23
 */

import { render, screen } from "@testing-library/react";
import { LotSchematic } from "@/components/map/lot-schematic";
import { ParkingSpot } from "@/types/parking";

// 86 spots: A×23, B×20, C×20, D×23
const allSpots: ParkingSpot[] = [
  { id: "A1",  occupied: false, type: "standard", monitored: true }, { id: "A2",  occupied: true,  type: "standard", monitored: true },
  { id: "A3",  occupied: false, type: "standard", monitored: true }, { id: "A4",  occupied: false, type: "standard", monitored: true },
  { id: "A5",  occupied: true,  type: "standard", monitored: true }, { id: "A6",  occupied: false, type: "standard", monitored: true },
  { id: "A7",  occupied: true,  type: "standard", monitored: true }, { id: "A8",  occupied: false, type: "standard", monitored: true },
  { id: "A9",  occupied: false, type: "standard", monitored: true }, { id: "A10", occupied: true,  type: "standard", monitored: true },
  { id: "A11", occupied: false, type: "standard", monitored: true }, { id: "A12", occupied: true,  type: "standard", monitored: true },
  { id: "A13", occupied: false, type: "standard", monitored: true }, { id: "A14", occupied: false, type: "standard", monitored: true },
  { id: "A15", occupied: true,  type: "standard", monitored: true }, { id: "A16", occupied: false, type: "standard", monitored: true },
  { id: "A17", occupied: true,  type: "standard", monitored: true }, { id: "A18", occupied: false, type: "standard", monitored: true },
  { id: "A19", occupied: true,  type: "standard", monitored: true }, { id: "A20", occupied: false, type: "standard", monitored: true },
  { id: "A21", occupied: false, type: "standard", monitored: true }, { id: "A22", occupied: true,  type: "standard", monitored: true },
  { id: "A23", occupied: false, type: "standard", monitored: true },

  { id: "B1",  occupied: true,  type: "standard", monitored: true }, { id: "B2",  occupied: true,  type: "standard", monitored: true },
  { id: "B3",  occupied: false, type: "standard", monitored: true }, { id: "B4",  occupied: false, type: "standard", monitored: true },
  { id: "B5",  occupied: false, type: "standard", monitored: true }, { id: "B6",  occupied: true,  type: "standard", monitored: true },
  { id: "B7",  occupied: false, type: "standard", monitored: true }, { id: "B8",  occupied: true,  type: "standard", monitored: true },
  { id: "B9",  occupied: false, type: "standard", monitored: true }, { id: "B10", occupied: false, type: "standard", monitored: true },
  { id: "B11", occupied: true,  type: "standard", monitored: true }, { id: "B12", occupied: false, type: "standard", monitored: true },
  { id: "B13", occupied: true,  type: "standard", monitored: true }, { id: "B14", occupied: false, type: "standard", monitored: true },
  { id: "B15", occupied: false, type: "standard", monitored: true }, { id: "B16", occupied: true,  type: "standard", monitored: true },
  { id: "B17", occupied: false, type: "standard", monitored: true }, { id: "B18", occupied: true,  type: "standard", monitored: true },
  { id: "B19", occupied: false, type: "standard", monitored: true }, { id: "B20", occupied: true,  type: "standard", monitored: true },

  { id: "C1",  occupied: false, type: "standard", monitored: true }, { id: "C2",  occupied: true,  type: "standard", monitored: true },
  { id: "C3",  occupied: false, type: "standard", monitored: true }, { id: "C4",  occupied: true,  type: "standard", monitored: true },
  { id: "C5",  occupied: false, type: "standard", monitored: true }, { id: "C6",  occupied: true,  type: "standard", monitored: true },
  { id: "C7",  occupied: false, type: "standard", monitored: true }, { id: "C8",  occupied: true,  type: "standard", monitored: true },
  { id: "C9",  occupied: false, type: "standard", monitored: true }, { id: "C10", occupied: false, type: "standard", monitored: true },
  { id: "C11", occupied: true,  type: "standard", monitored: true }, { id: "C12", occupied: false, type: "standard", monitored: true },
  { id: "C13", occupied: false, type: "standard", monitored: true }, { id: "C14", occupied: true,  type: "standard", monitored: true },
  { id: "C15", occupied: false, type: "standard", monitored: true }, { id: "C16", occupied: true,  type: "standard", monitored: true },
  { id: "C17", occupied: false, type: "standard", monitored: true }, { id: "C18", occupied: true,  type: "standard", monitored: true },
  { id: "C19", occupied: false, type: "standard", monitored: true }, { id: "C20", occupied: false, type: "standard", monitored: true },

  { id: "D1",  occupied: false, type: "standard", monitored: true }, { id: "D2",  occupied: true,  type: "standard", monitored: true },
  { id: "D3",  occupied: false, type: "standard", monitored: true }, { id: "D4",  occupied: true,  type: "standard", monitored: true },
  { id: "D5",  occupied: false, type: "standard", monitored: true }, { id: "D6",  occupied: true,  type: "standard", monitored: true },
  { id: "D7",  occupied: false, type: "standard", monitored: true }, { id: "D8",  occupied: false, type: "standard", monitored: true },
  { id: "D9",  occupied: true,  type: "standard", monitored: true }, { id: "D10", occupied: false, type: "standard", monitored: true },
  { id: "D11", occupied: true,  type: "standard", monitored: true }, { id: "D12", occupied: false, type: "standard", monitored: true },
  { id: "D13", occupied: false, type: "standard", monitored: true }, { id: "D14", occupied: true,  type: "standard", monitored: true },
  { id: "D15", occupied: false, type: "standard", monitored: true }, { id: "D16", occupied: false, type: "standard", monitored: true },
  { id: "D17", occupied: true,  type: "standard", monitored: true }, { id: "D18", occupied: false, type: "standard", monitored: true },
  { id: "D19", occupied: true,  type: "standard", monitored: true }, { id: "D20", occupied: false, type: "standard", monitored: true },
  { id: "D21", occupied: false, type: "standard", monitored: true }, { id: "D22", occupied: true,  type: "standard", monitored: true },
  { id: "D23", occupied: false, type: "standard", monitored: true },
];

describe("LotSchematic @smoke", () => {
  it("renders 86 spot groups (one per spot ID in layout)", () => {
    const { container } = render(<LotSchematic spots={allSpots} />);
    const groups = container.querySelectorAll("[aria-label^='Spot']");
    expect(groups).toHaveLength(86);
  });

  it("labels free standard spot correctly", () => {
    render(<LotSchematic spots={[{ id: "A1", occupied: false, type: "standard", monitored: true }]} />);
    expect(screen.getByLabelText("Spot A1 standard free")).toBeInTheDocument();
  });

  it("labels occupied standard spot correctly", () => {
    render(<LotSchematic spots={[{ id: "A2", occupied: true, type: "standard", monitored: true }]} />);
    expect(screen.getByLabelText("Spot A2 standard occupied")).toBeInTheDocument();
  });

  it("labels free C spot correctly", () => {
    render(<LotSchematic spots={[{ id: "C1", occupied: false, type: "standard", monitored: true }]} />);
    expect(screen.getByLabelText("Spot C1 standard free")).toBeInTheDocument();
  });

  it("labels occupied B spot correctly", () => {
    render(<LotSchematic spots={[{ id: "B1", occupied: true, type: "standard", monitored: true }]} />);
    expect(screen.getByLabelText("Spot B1 standard occupied")).toBeInTheDocument();
  });

  it("labels free handicap spot correctly", () => {
    render(<LotSchematic spots={[{ id: "A4", occupied: false, type: "handicap", monitored: true }]} />);
    expect(screen.getByLabelText("Spot A4 handicap free")).toBeInTheDocument();
  });

  it("labels occupied handicap spot correctly", () => {
    render(<LotSchematic spots={[{ id: "A5", occupied: true, type: "handicap", monitored: true }]} />);
    expect(screen.getByLabelText("Spot A5 handicap occupied")).toBeInTheDocument();
  });

  it("labels access aisle spot correctly", () => {
    render(<LotSchematic spots={[{ id: "A1", occupied: false, type: "access aisle", monitored: true }]} />);
    expect(screen.getByLabelText("Spot A1 access aisle")).toBeInTheDocument();
  });

  it("labels reserved spot correctly", () => {
    render(<LotSchematic spots={[{ id: "A1", occupied: false, type: "reserved", monitored: true }]} />);
    expect(screen.getByLabelText("Spot A1 reserved free")).toBeInTheDocument();
  });

  it("renders unknown spots when no data provided", () => {
    render(<LotSchematic spots={[]} />);
    const unknownGroups = screen.getAllByLabelText(/unknown$/);
    expect(unknownGroups).toHaveLength(86);
  });

  it("renders entrance label", () => {
    render(<LotSchematic spots={[]} />);
    expect(screen.getByText(/entrance/i)).toBeInTheDocument();
  });

  it("renders SVG with correct aria-label", () => {
    render(<LotSchematic spots={[]} />);
    expect(screen.getByLabelText("Lot W overhead map")).toBeInTheDocument();
  });

  it("renders legend with Free, Occupied, Visitor, Staff, Not Monitored, Access Aisle", () => {
    render(<LotSchematic spots={[]} />);
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("Occupied")).toBeInTheDocument();
    expect(screen.getByText("Visitor")).toBeInTheDocument();
    expect(screen.getByText("Staff")).toBeInTheDocument();
    expect(screen.getByText("Not Monitored")).toBeInTheDocument();
    expect(screen.getByText("Access Aisle")).toBeInTheDocument();
  });

  it("uses correct fill for free monitored spot (blue)", () => {
    render(
      <LotSchematic spots={[{ id: "A1", occupied: false, type: "standard", monitored: true }]} />
    );
    const group = screen.getByLabelText("Spot A1 standard free");
    const rect = group.querySelector("rect");
    expect(rect).toHaveAttribute("fill", "#9cddfd");
  });

  it("uses correct fill for occupied monitored spot (blue)", () => {
    render(
      <LotSchematic spots={[{ id: "A1", occupied: true, type: "standard", monitored: true }]} />
    );
    const group = screen.getByLabelText("Spot A1 standard occupied");
    const rect = group.querySelector("rect");
    expect(rect).toHaveAttribute("fill", "#9cddfd");
  });

  it("renders red occupancy outline on occupied spots", () => {
    render(
      <LotSchematic spots={[{ id: "A1", occupied: true, type: "standard", monitored: true }]} />
    );
    const group = screen.getByLabelText("Spot A1 standard occupied");
    const outlineRect = group.querySelectorAll("rect")[1];
    expect(outlineRect).toHaveAttribute("stroke", "#ef4444");
  });

  it("renders green occupancy outline on free monitored spots", () => {
    render(
      <LotSchematic spots={[{ id: "A1", occupied: false, type: "standard", monitored: true }]} />
    );
    const group = screen.getByLabelText("Spot A1 standard free");
    const outlineRect = group.querySelectorAll("rect")[1];
    expect(outlineRect).toHaveAttribute("stroke", "#10b981");
  });

  it("renders gray outline on all monitored spots when offline", () => {
    render(
      <LotSchematic
        spots={[{ id: "A1", occupied: false, type: "standard", monitored: true }]}
        isOffline={true}
      />
    );
    const group = screen.getByLabelText("Spot A1 standard offline");
    const outlineRect = group.querySelectorAll("rect")[1];
    expect(outlineRect).toHaveAttribute("stroke", "#9ca3af");
  });

  it("renders transparent fill for monitored spots when offline", () => {
    render(
      <LotSchematic
        spots={[{ id: "A1", occupied: false, type: "standard", monitored: true }]}
        isOffline={true}
      />
    );
    const group = screen.getByLabelText("Spot A1 standard offline");
    const rect = group.querySelector("rect");
    expect(rect).toHaveAttribute("fill", "transparent");
  });

  it("renders hatch pattern fill for access aisle spots", () => {
    render(
      <LotSchematic spots={[{ id: "A1", occupied: false, type: "access aisle", monitored: true }]} />
    );
    const group = screen.getByLabelText("Spot A1 access aisle");
    const rect = group.querySelector("rect");
    expect(rect).toHaveAttribute("fill", "url(#aisle-hatch-v2)");
  });

  it("renders wheelchair icon for handicap spots", () => {
    render(
      <LotSchematic spots={[{ id: "A4", occupied: false, type: "handicap", monitored: true }]} />
    );
    const group = screen.getByLabelText("Spot A4 handicap free");
    const svgIcon = group.querySelector("svg");
    expect(svgIcon).toBeInTheDocument();
    expect(svgIcon).toHaveAttribute("fill", "#0e7490");
  });

  it("renders no-parking icon for reserved spots", () => {
    render(
      <LotSchematic spots={[{ id: "A1", occupied: false, type: "reserved", monitored: true }]} />
    );
    const group = screen.getByLabelText("Spot A1 reserved free");
    const svgIcon = group.querySelector("svg");
    expect(svgIcon).toBeInTheDocument();
    expect(svgIcon).toHaveAttribute("fill", "#475569");
  });
});
