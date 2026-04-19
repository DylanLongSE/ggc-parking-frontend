import { render, screen, fireEvent } from "@testing-library/react";
import { LotDrawer } from "@/components/map/lot-drawer";
import { ParkingLot, LotStatus } from "@/types/parking";
import { DRAWER_DISMISS_THRESHOLD_PX } from "@/lib/constants";

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
  isLive: true,
  occupiedIds: [],
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
    render(<LotDrawer lot={null} status={undefined} onClose={jest.fn()} />);
    expect(screen.getByTestId("lot-drawer")).toHaveClass("translate-y-full");
  });

  it("has translate-y-0 when lot is provided (visible)", () => {
    render(<LotDrawer lot={lot} status={status} onClose={jest.fn()} />);
    expect(screen.getByTestId("lot-drawer")).toHaveClass("translate-y-0");
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

  it("does not render hourly trend chart (chart lives in SpotView)", () => {
    render(<LotDrawer lot={lot} status={status} onClose={jest.fn()} />);
    expect(screen.queryByText("Typical Occupancy")).not.toBeInTheDocument();
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

  describe("backdrop click to dismiss", () => {
    it("calls onClose when backdrop is clicked @smoke", () => {
      const onClose = jest.fn();
      render(<LotDrawer lot={lot} status={status} onClose={onClose} />);
      fireEvent.click(screen.getByTestId("lot-drawer-backdrop"));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("backdrop is pointer-events-none when drawer is closed", () => {
      render(<LotDrawer lot={null} status={undefined} onClose={jest.fn()} />);
      expect(screen.getByTestId("lot-drawer-backdrop")).toHaveClass("pointer-events-none");
    });

    it("backdrop is pointer-events-auto when drawer is open", () => {
      render(<LotDrawer lot={lot} status={status} onClose={jest.fn()} />);
      expect(screen.getByTestId("lot-drawer-backdrop")).toHaveClass("pointer-events-auto");
    });
  });

  describe("offline badge and dashes", () => {
    const offlineStatus: LotStatus = {
      lotId: "lot-w",
      carCount: 22,
      lastUpdated: "2026-02-21T18:55:00Z",
      status: "OK",
      isLive: false,
      occupiedIds: [],
    };

    it("shows Offline badge when not live and outside operating hours", () => {
      jest.spyOn(Date.prototype, "getHours").mockReturnValue(21);
      render(<LotDrawer lot={lot} status={offlineStatus} onClose={jest.fn()} />);
      expect(screen.getByText("Offline")).toBeInTheDocument();
      expect(screen.queryByText("Mock Data")).not.toBeInTheDocument();
    });

    it("shows -- instead of numeric count when offline", () => {
      jest.spyOn(Date.prototype, "getHours").mockReturnValue(21);
      render(<LotDrawer lot={lot} status={offlineStatus} onClose={jest.fn()} />);
      expect(screen.getByText("--")).toBeInTheDocument();
    });

    it("shows Mock Data badge when not live but inside operating hours", () => {
      jest.spyOn(Date.prototype, "getHours").mockReturnValue(12);
      render(<LotDrawer lot={lot} status={offlineStatus} onClose={jest.fn()} />);
      expect(screen.getByText("Mock Data")).toBeInTheDocument();
      expect(screen.queryByText("Offline")).not.toBeInTheDocument();
    });

    it("shows -- when not live inside operating hours (mid-day Pi crash)", () => {
      jest.spyOn(Date.prototype, "getHours").mockReturnValue(12);
      render(<LotDrawer lot={lot} status={offlineStatus} onClose={jest.fn()} />);
      // isLive: false during hours → effectively offline → "--"
      expect(screen.getByText("--")).toBeInTheDocument();
    });

    it("shows Live badge when status.isLive is true", () => {
      jest.spyOn(Date.prototype, "getHours").mockReturnValue(14);
      render(<LotDrawer lot={lot} status={status} onClose={jest.fn()} />);
      expect(screen.getByText("Live")).toBeInTheDocument();
    });
  });

  describe("mouse drag on handle to dismiss", () => {
    it("calls onClose when dragged past the dismiss threshold @smoke", () => {
      const onClose = jest.fn();
      render(<LotDrawer lot={lot} status={status} onClose={onClose} />);
      const handle = screen.getByTestId("lot-drawer-handle");

      fireEvent.mouseDown(handle, { clientY: 0 });
      fireEvent.mouseMove(window, { clientY: DRAWER_DISMISS_THRESHOLD_PX + 1 });
      fireEvent.mouseUp(window);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not call onClose when dragged below the dismiss threshold", () => {
      const onClose = jest.fn();
      render(<LotDrawer lot={lot} status={status} onClose={onClose} />);
      const handle = screen.getByTestId("lot-drawer-handle");

      fireEvent.mouseDown(handle, { clientY: 0 });
      fireEvent.mouseMove(window, { clientY: DRAWER_DISMISS_THRESHOLD_PX - 1 });
      fireEvent.mouseUp(window);

      expect(onClose).not.toHaveBeenCalled();
    });

    it("does not call onClose on mouseUp with no prior drag", () => {
      const onClose = jest.fn();
      render(<LotDrawer lot={lot} status={status} onClose={onClose} />);
      fireEvent.mouseUp(window);
      expect(onClose).not.toHaveBeenCalled();
    });
  });
});