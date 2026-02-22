import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ParkingMap from "@/components/map/parking-map";
import { useLotStatuses } from "@/hooks/use-lot-statuses";

jest.mock("@/hooks/use-lot-statuses");
const mockUseLotStatuses = useLotStatuses as jest.MockedFunction<
  typeof useLotStatuses
>;

describe("ParkingMap @smoke", () => {
  beforeEach(() => {
    mockUseLotStatuses.mockReturnValue({ statuses: {}, isLoading: false });
  });

  it("renders map container", () => {
    render(<ParkingMap />);
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
  });

  it("renders bottom tabs", () => {
    render(<ParkingMap />);
    expect(screen.getByRole("button", { name: /lots/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /overview/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /info/i })).toBeInTheDocument();
  });

  it("shows lots tab by default", () => {
    render(<ParkingMap />);
    const mapParent = screen.getByTestId("map-container").closest("[style]");
    expect(mapParent).toHaveStyle({ display: "block" });
  });

  it("switches to overview tab", async () => {
    const user = userEvent.setup();
    render(<ParkingMap />);

    await user.click(screen.getByRole("button", { name: /overview/i }));
    expect(
      screen.getByRole("heading", { name: /parking overview/i })
    ).toBeInTheDocument();

    // Map parent should be hidden
    const mapParent = screen.getByTestId("map-container").closest("[style]");
    expect(mapParent).toHaveStyle({ display: "none" });
  });

  it("switches to info tab", async () => {
    const user = userEvent.setup();
    render(<ParkingMap />);

    await user.click(screen.getByRole("button", { name: /info/i }));
    expect(
      screen.getByRole("heading", { name: /parking information/i })
    ).toBeInTheDocument();
  });

  it("switches back to lots tab", async () => {
    const user = userEvent.setup();
    render(<ParkingMap />);

    await user.click(screen.getByRole("button", { name: /overview/i }));
    await user.click(screen.getByRole("button", { name: /lots/i }));

    const mapParent = screen.getByTestId("map-container").closest("[style]");
    expect(mapParent).toHaveStyle({ display: "block" });
  });
});
