import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ParkingMap from "@/components/map/parking-map";
import { useLotStatuses } from "@/hooks/use-lot-statuses";
import { ThemeProvider } from "@/contexts/theme-context";

jest.mock("@/hooks/use-lot-statuses");
const mockUseLotStatuses = useLotStatuses as jest.MockedFunction<
  typeof useLotStatuses
>;

function renderMap() {
  return render(
    <ThemeProvider>
      <ParkingMap />
    </ThemeProvider>
  );
}

describe("ParkingMap @smoke", () => {
  beforeEach(() => {
    mockUseLotStatuses.mockReturnValue({ statuses: {}, isLoading: false });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("renders map container", () => {
    renderMap();
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
  });

  it("renders bottom tabs", () => {
    renderMap();
    expect(screen.getByRole("button", { name: /lots/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /overview/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /info/i })).toBeInTheDocument();
  });

  it("shows lots tab by default", () => {
    renderMap();
    const mapParent = screen.getByTestId("map-container").closest(".transition-opacity");
    expect(mapParent).toHaveClass("opacity-100");
    expect(mapParent).not.toHaveClass("opacity-0");
  });

  it("switches to overview tab", async () => {
    const user = userEvent.setup();
    renderMap();

    await user.click(screen.getByRole("button", { name: /overview/i }));
    expect(
      screen.getByRole("heading", { name: /parking overview/i })
    ).toBeInTheDocument();

    // Map parent should be hidden
    const mapParent = screen.getByTestId("map-container").closest(".transition-opacity");
    expect(mapParent).toHaveClass("opacity-0");
    expect(mapParent).not.toHaveClass("opacity-100");
  });

  it("switches to info tab", async () => {
    const user = userEvent.setup();
    renderMap();

    await user.click(screen.getByRole("button", { name: /info/i }));
    expect(
      screen.getByRole("heading", { name: /parking info/i })
    ).toBeInTheDocument();
  });

  it("always uses OSM tile URL regardless of theme", () => {
    renderMap();
    expect(screen.getByTestId("tile-layer")).toHaveAttribute(
      "url",
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    );
  });

  it("uses OSM tile URL in dark mode", () => {
    localStorage.setItem("theme", "dark");
    renderMap();
    expect(screen.getByTestId("tile-layer")).toHaveAttribute(
      "url",
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    );
  });

  it("switches back to lots tab", async () => {
    const user = userEvent.setup();
    renderMap();

    await user.click(screen.getByRole("button", { name: /overview/i }));
    await user.click(screen.getByRole("button", { name: /lots/i }));

    const mapParent = screen.getByTestId("map-container").closest(".transition-opacity");
    expect(mapParent).toHaveClass("opacity-100");
    expect(mapParent).not.toHaveClass("opacity-0");
  });
});
