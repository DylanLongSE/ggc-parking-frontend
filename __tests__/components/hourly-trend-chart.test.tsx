import { render, screen } from "@testing-library/react";
import { HourlyTrendChart } from "@/components/hourly-trend-chart";

describe("HourlyTrendChart", () => {
  beforeEach(() => {
    jest.spyOn(Date.prototype, "getHours").mockReturnValue(10);
  });

  it("renders heading", () => {
    render(<HourlyTrendChart lotId="lot-w" />);
    expect(
      screen.getByText("Typical Occupancy")
    ).toBeInTheDocument();
  });

  it("renders 16 bars", () => {
    const { container } = render(<HourlyTrendChart lotId="lot-w" />);
    expect(container.querySelectorAll(".rounded-sm")).toHaveLength(16);
  });

  it("highlights current hour bar with ring", () => {
    const { container } = render(<HourlyTrendChart lotId="lot-w" />);
    const bars = container.querySelectorAll(".rounded-sm");
    // Hour 10 = index 4 (6AM is index 0)
    expect(bars[4]).toHaveClass("ring-2");
  });

  it("renders hour labels at 3-hour intervals", () => {
    render(<HourlyTrendChart lotId="lot-w" />);
    expect(screen.getByText("6a")).toBeInTheDocument();
    expect(screen.getByText("9a")).toBeInTheDocument();
    expect(screen.getByText("12p")).toBeInTheDocument();
    expect(screen.getByText("3p")).toBeInTheDocument();
    expect(screen.getByText("6p")).toBeInTheDocument();
    expect(screen.getByText("9p")).toBeInTheDocument();
  });
});
