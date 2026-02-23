import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LotChips } from "@/components/map/lot-chips";
import { LIVE_LOT_IDS, PARKING_LOTS } from "@/lib/constants";
import { LotStatus } from "@/types/parking";

const mockStatuses: Record<string, LotStatus> = {
  "lot-w": { lotId: "lot-w", carCount: 400, lastUpdated: "2026-02-21T12:00:00Z", status: "OK" },
};

describe("LotChips", () => {
  it("renders skeleton chips when loading", () => {
    const { container } = render(
      <LotChips statuses={{}} isLoading={true} selectedLot={null} onSelect={jest.fn()} />
    );
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(5);
  });

  it("renders all 5 lot buttons when loaded", () => {
    render(
      <LotChips statuses={mockStatuses} isLoading={false} selectedLot={null} onSelect={jest.fn()} />
    );
    PARKING_LOTS.forEach((lot) => {
      expect(screen.getByRole("button", { name: new RegExp(lot.name) })).toBeInTheDocument();
    });
  });

  it("highlights selected lot", () => {
    render(
      <LotChips
        statuses={mockStatuses}
        isLoading={false}
        selectedLot={PARKING_LOTS[0]}
        onSelect={jest.fn()}
      />
    );
    expect(
      screen.getByRole("button", { name: PARKING_LOTS[0].name })
    ).toHaveClass("bg-primary");
  });

  it("calls onSelect when chip clicked", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    render(
      <LotChips statuses={mockStatuses} isLoading={false} selectedLot={null} onSelect={onSelect} />
    );

    await user.click(screen.getByRole("button", { name: /Parking Lot W/ }));
    expect(onSelect).toHaveBeenCalledWith(PARKING_LOTS[0]);
  });

  it("shows Coming Soon badge on non-live lot chips", () => {
    render(
      <LotChips statuses={mockStatuses} isLoading={false} selectedLot={null} onSelect={jest.fn()} />
    );
    const comingSoonLots = PARKING_LOTS.filter((lot) => !LIVE_LOT_IDS.has(lot.id));
    comingSoonLots.forEach((lot) => {
      const chip = screen.getByRole("button", { name: new RegExp(lot.name) });
      expect(chip).toHaveTextContent(/coming soon/i);
    });
  });

  it("does not show Coming Soon badge on live lot chips", () => {
    render(
      <LotChips statuses={mockStatuses} isLoading={false} selectedLot={null} onSelect={jest.fn()} />
    );
    const liveLots = PARKING_LOTS.filter((lot) => LIVE_LOT_IDS.has(lot.id));
    liveLots.forEach((lot) => {
      const chip = screen.getByRole("button", { name: new RegExp(lot.name) });
      expect(chip).not.toHaveTextContent(/coming soon/i);
    });
  });
});
