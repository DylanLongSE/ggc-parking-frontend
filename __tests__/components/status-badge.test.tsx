import { render, screen } from "@testing-library/react";
import { StatusBadge } from "@/components/status-badge";
import { ParkingLot, LotStatus } from "@/types/parking";

const lot: ParkingLot = {
  id: "test",
  name: "Test Lot",
  totalSpaces: 100,
  lat: 33.98,
  lng: -84.0,
};

function makeStatus(
  carCount: number,
  status: string = "OK"
): LotStatus {
  return { lotId: "test", carCount, lastUpdated: "2026-01-01T12:00:00Z", status };
}

describe("StatusBadge", () => {
  it('displays "Available" for high availability', () => {
    render(<StatusBadge lot={lot} status={makeStatus(30)} />);
    expect(screen.getByText("Available")).toBeInTheDocument();
  });

  it('displays "Filling Up" for medium availability', () => {
    render(<StatusBadge lot={lot} status={makeStatus(70)} />);
    expect(screen.getByText("Filling Up")).toBeInTheDocument();
  });

  it('displays "Almost Full" for low availability', () => {
    render(<StatusBadge lot={lot} status={makeStatus(90)} />);
    expect(screen.getByText("Almost Full")).toBeInTheDocument();
  });

  it("displays status.status when not OK", () => {
    render(<StatusBadge lot={lot} status={makeStatus(30, "OFFLINE")} />);
    expect(screen.getByText("OFFLINE")).toBeInTheDocument();
  });

  it('displays "Available" when status is undefined', () => {
    render(<StatusBadge lot={lot} />);
    expect(screen.getByText("Available")).toBeInTheDocument();
  });
});
