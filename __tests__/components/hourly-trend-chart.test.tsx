import { render, screen } from "@testing-library/react";
import { HourlyTrendChart } from "@/components/hourly-trend-chart";

describe("HourlyTrendChart", () => {
  it("renders heading", () => {
    render(<HourlyTrendChart lotId="lot-w" />);
    expect(screen.getByText("Typical Occupancy")).toBeInTheDocument();
  });

  it("renders placeholder text", () => {
    render(<HourlyTrendChart lotId="lot-w" />);
    expect(screen.getByText("replace me")).toBeInTheDocument();
  });
});
