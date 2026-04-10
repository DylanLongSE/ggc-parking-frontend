/**
 * @module LotSchematicTests
 *
 * Tests for the {@link LotSchematic} component (v2 — painted-line parking bays).
 * Covers: spot count, aria-labels, fill colors, icons, legend, entrance, unknown spots.
 */

import { render, screen } from "@testing-library/react";
import { LotSchematic } from "@/components/map/lot-schematic";
import { ParkingSpot } from "@/types/parking";

// 86 spots: A×23, BL×20, BR×20, C×23
const allSpots: ParkingSpot[] = [
  { id: "A1",  occupied: false, type: "standard" }, { id: "A2",  occupied: true,  type: "standard" },
  { id: "A3",  occupied: false, type: "standard" }, { id: "A4",  occupied: false, type: "standard" },
  { id: "A5",  occupied: true,  type: "standard" }, { id: "A6",  occupied: false, type: "standard" },
  { id: "A7",  occupied: true,  type: "standard" }, { id: "A8",  occupied: false, type: "standard" },
  { id: "A9",  occupied: false, type: "standard" }, { id: "A10", occupied: true,  type: "standard" },
  { id: "A11", occupied: false, type: "standard" }, { id: "A12", occupied: true,  type: "standard" },
  { id: "A13", occupied: false, type: "standard" }, { id: "A14", occupied: false, type: "standard" },
  { id: "A15", occupied: true,  type: "standard" }, { id: "A16", occupied: false, type: "standard" },
  { id: "A17", occupied: true,  type: "standard" }, { id: "A18", occupied: false, type: "standard" },
  { id: "A19", occupied: true,  type: "standard" }, { id: "A20", occupied: false, type: "standard" },
  { id: "A21", occupied: false, type: "standard" }, { id: "A22", occupied: true,  type: "standard" },
  { id: "A23", occupied: false, type: "standard" },

  { id: "BL1",  occupied: true,  type: "standard" }, { id: "BL2",  occupied: true,  type: "standard" },
  { id: "BL3",  occupied: false, type: "standard" }, { id: "BL4",  occupied: false, type: "standard" },
  { id: "BL5",  occupied: false, type: "standard" }, { id: "BL6",  occupied: true,  type: "standard" },
  { id: "BL7",  occupied: false, type: "standard" }, { id: "BL8",  occupied: true,  type: "standard" },
  { id: "BL9",  occupied: false, type: "standard" }, { id: "BL10", occupied: false, type: "standard" },
  { id: "BL11", occupied: true,  type: "standard" }, { id: "BL12", occupied: false, type: "standard" },
  { id: "BL13", occupied: true,  type: "standard" }, { id: "BL14", occupied: false, type: "standard" },
  { id: "BL15", occupied: false, type: "standard" }, { id: "BL16", occupied: true,  type: "standard" },
  { id: "BL17", occupied: false, type: "standard" }, { id: "BL18", occupied: true,  type: "standard" },
  { id: "BL19", occupied: false, type: "standard" }, { id: "BL20", occupied: true,  type: "standard" },

  { id: "BR1",  occupied: false, type: "standard" }, { id: "BR2",  occupied: true,  type: "standard" },
  { id: "BR3",  occupied: false, type: "standard" }, { id: "BR4",  occupied: true,  type: "standard" },
  { id: "BR5",  occupied: false, type: "standard" }, { id: "BR6",  occupied: true,  type: "standard" },
  { id: "BR7",  occupied: false, type: "standard" }, { id: "BR8",  occupied: false, type: "standard" },
  { id: "BR9",  occupied: true,  type: "standard" }, { id: "BR10", occupied: false, type: "standard" },
  { id: "BR11", occupied: true,  type: "standard" }, { id: "BR12", occupied: false, type: "standard" },
  { id: "BR13", occupied: false, type: "standard" }, { id: "BR14", occupied: true,  type: "standard" },
  { id: "BR15", occupied: false, type: "standard" }, { id: "BR16", occupied: false, type: "standard" },
  { id: "BR17", occupied: true,  type: "standard" }, { id: "BR18", occupied: false, type: "standard" },
  { id: "BR19", occupied: true,  type: "standard" }, { id: "BR20", occupied: false, type: "standard" },

  { id: "C1",  occupied: false, type: "handicap" },
  { id: "C2",  occupied: true,  type: "handicap" },
  { id: "C3",  occupied: false, type: "handicap" },
  { id: "C4",  occupied: true,  type: "handicap" },
  { id: "C5",  occupied: false, type: "handicap" },
  { id: "C6",  occupied: true,  type: "handicap" },
  { id: "C7",  occupied: false, type: "handicap" },
  { id: "C8",  occupied: true,  type: "handicap" },
  { id: "C9",  occupied: false, type: "standard" }, { id: "C10", occupied: false, type: "standard" },
  { id: "C11", occupied: true,  type: "standard" }, { id: "C12", occupied: false, type: "standard" },
  { id: "C13", occupied: false, type: "standard" }, { id: "C14", occupied: true,  type: "standard" },
  { id: "C15", occupied: false, type: "standard" }, { id: "C16", occupied: true,  type: "standard" },
  { id: "C17", occupied: false, type: "standard" }, { id: "C18", occupied: true,  type: "standard" },
  { id: "C19", occupied: false, type: "standard" }, { id: "C20", occupied: false, type: "standard" },
  { id: "C21", occupied: true,  type: "standard" }, { id: "C22", occupied: false, type: "standard" },
  { id: "C23", occupied: true,  type: "standard" },
];

describe("LotSchematic @smoke", () => {
  it("renders 86 spot groups (one per spot ID in layout)", () => {
    const { container } = render(<LotSchematic spots={allSpots} />);
    const groups = container.querySelectorAll("[aria-label^='Spot']");
    expect(groups).toHaveLength(86);
  });

  it("labels free standard spot correctly", () => {
    render(<LotSchematic spots={[{ id: "A1", occupied: false, type: "standard" }]} />);
    expect(screen.getByLabelText("Spot A1 standard free")).toBeInTheDocument();
  });

  it("labels occupied standard spot correctly", () => {
    render(<LotSchematic spots={[{ id: "A2", occupied: true, type: "standard" }]} />);
    expect(screen.getByLabelText("Spot A2 standard occupied")).toBeInTheDocument();
  });

  it("labels free BL spot correctly", () => {
    render(<LotSchematic spots={[{ id: "BL1", occupied: false, type: "standard" }]} />);
    expect(screen.getByLabelText("Spot BL1 standard free")).toBeInTheDocument();
  });

  it("labels occupied BR spot correctly", () => {
    render(<LotSchematic spots={[{ id: "BR1", occupied: true, type: "standard" }]} />);
    expect(screen.getByLabelText("Spot BR1 standard occupied")).toBeInTheDocument();
  });

  it("labels free handicap spot correctly", () => {
    render(<LotSchematic spots={[{ id: "C1", occupied: false, type: "handicap" }]} />);
    expect(screen.getByLabelText("Spot C1 handicap free")).toBeInTheDocument();
  });

  it("labels occupied handicap spot correctly", () => {
    render(<LotSchematic spots={[{ id: "C2", occupied: true, type: "handicap" }]} />);
    expect(screen.getByLabelText("Spot C2 handicap occupied")).toBeInTheDocument();
  });

  it("labels access aisle spot correctly", () => {
    render(<LotSchematic spots={[{ id: "A1", occupied: false, type: "access aisle" }]} />);
    expect(screen.getByLabelText("Spot A1 access aisle")).toBeInTheDocument();
  });

  it("labels reserved spot correctly", () => {
    render(<LotSchematic spots={[{ id: "A1", occupied: false, type: "reserved" }]} />);
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

  it("renders legend with all 7 categories", () => {
    render(<LotSchematic spots={[]} />);
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("Occupied")).toBeInTheDocument();
    expect(screen.getByText("Visitor")).toBeInTheDocument();
    expect(screen.getByText("Staff")).toBeInTheDocument();
    expect(screen.getByText("Accessible")).toBeInTheDocument();
    expect(screen.getByText("Access Aisle")).toBeInTheDocument();
    expect(screen.getByText("Reserved")).toBeInTheDocument();
  });

  it("uses correct fill for free standard spot", () => {
    render(
      <LotSchematic spots={[{ id: "A1", occupied: false, type: "standard" }]} />
    );
    const group = screen.getByLabelText("Spot A1 standard free");
    const rect = group.querySelector("rect");
    expect(rect).toHaveAttribute("fill", "#6ee7b7");
  });

  it("uses correct fill for occupied standard spot", () => {
    render(
      <LotSchematic spots={[{ id: "A1", occupied: true, type: "standard" }]} />
    );
    const group = screen.getByLabelText("Spot A1 standard occupied");
    const rect = group.querySelector("rect");
    expect(rect).toHaveAttribute("fill", "#fca5a5");
  });

  it("renders red occupancy outline on occupied spots", () => {
    render(
      <LotSchematic spots={[{ id: "A1", occupied: true, type: "standard" }]} />
    );
    const group = screen.getByLabelText("Spot A1 standard occupied");
    const outlineRect = group.querySelectorAll("rect")[1];
    expect(outlineRect).toHaveAttribute("stroke", "#ef4444");
  });

  it("renders white occupancy outline on free spots", () => {
    render(
      <LotSchematic spots={[{ id: "A1", occupied: false, type: "standard" }]} />
    );
    const group = screen.getByLabelText("Spot A1 standard free");
    const outlineRect = group.querySelectorAll("rect")[1];
    expect(outlineRect).toHaveAttribute("stroke", "#ffffff");
  });

  it("renders hatch pattern fill for access aisle spots", () => {
    render(
      <LotSchematic spots={[{ id: "A1", occupied: false, type: "access aisle" }]} />
    );
    const group = screen.getByLabelText("Spot A1 access aisle");
    const rect = group.querySelector("rect");
    expect(rect).toHaveAttribute("fill", "url(#aisle-hatch-v2)");
  });

  it("renders wheelchair icon for handicap spots", () => {
    render(
      <LotSchematic spots={[{ id: "C1", occupied: false, type: "handicap" }]} />
    );
    const group = screen.getByLabelText("Spot C1 handicap free");
    const svgIcon = group.querySelector("svg");
    expect(svgIcon).toBeInTheDocument();
    expect(svgIcon).toHaveAttribute("fill", "#0e7490");
  });

  it("renders no-parking icon for reserved spots", () => {
    render(
      <LotSchematic spots={[{ id: "A1", occupied: false, type: "reserved" }]} />
    );
    const group = screen.getByLabelText("Spot A1 reserved free");
    const svgIcon = group.querySelector("svg");
    expect(svgIcon).toBeInTheDocument();
    expect(svgIcon).toHaveAttribute("fill", "#475569");
  });
});
