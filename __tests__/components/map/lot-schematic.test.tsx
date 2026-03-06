/**
 * @module LotSchematicTests
 *
 * Tests for the {@link LotSchematic} component.
 * Covers: spot count, aria-labels, handicap/unknown states, entrance label, legend.
 */

import { render, screen } from "@testing-library/react";
import { LotSchematic } from "@/components/map/lot-schematic";
import { ParkingSpot } from "@/types/parking";

// 86 spots: A×23, BL×20, BR×20, C×23 (C1–C16 reserved/handicap/access aisle, C17–C23 staff)
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

  it("labels free regular spots as free", () => {
    render(<LotSchematic spots={[{ id: "A1", occupied: false, type: "standard" }]} />);
    expect(screen.getByLabelText("Spot A1 standard free")).toBeInTheDocument();
  });

  it("labels occupied regular spots as occupied", () => {
    render(<LotSchematic spots={[{ id: "A2", occupied: true, type: "standard" }]} />);
    expect(screen.getByLabelText("Spot A2 standard occupied")).toBeInTheDocument();
  });

  it("labels free BL spots as free", () => {
    render(<LotSchematic spots={[{ id: "BL1", occupied: false, type: "standard" }]} />);
    expect(screen.getByLabelText("Spot BL1 standard free")).toBeInTheDocument();
  });

  it("labels occupied BR spots as occupied", () => {
    render(<LotSchematic spots={[{ id: "BR1", occupied: true, type: "standard" }]} />);
    expect(screen.getByLabelText("Spot BR1 standard occupied")).toBeInTheDocument();
  });

  it("labels free handicap spots as handicap free", () => {
    render(<LotSchematic spots={[{ id: "C1", occupied: false, type: "handicap" }]} />);
    expect(screen.getByLabelText("Spot C1 handicap free")).toBeInTheDocument();
  });

  it("labels occupied handicap spots as handicap occupied", () => {
    render(<LotSchematic spots={[{ id: "C2", occupied: true, type: "handicap" }]} />);
    expect(screen.getByLabelText("Spot C2 handicap occupied")).toBeInTheDocument();
  });

  it("renders entrance label", () => {
    render(<LotSchematic spots={[]} />);
    expect(screen.getByText(/entrance/i)).toBeInTheDocument();
  });

  it("renders legend with Free, Occupied, Accessible", () => {
    render(<LotSchematic spots={[]} />);
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("Occupied")).toBeInTheDocument();
    expect(screen.getByText(/accessible/i)).toBeInTheDocument();
  });

  it("renders unknown spots as unknown when not in data", () => {
    render(<LotSchematic spots={[]} />);
    const unknownGroups = screen.getAllByLabelText(/unknown$/);
    expect(unknownGroups).toHaveLength(86);
    expect(screen.queryByLabelText(/ free$/)).toBeNull();
    expect(screen.queryByLabelText(/ occupied$/)).toBeNull();
  });
});
