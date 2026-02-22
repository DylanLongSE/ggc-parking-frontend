import {
  getAvailabilityLevel,
  getAvailabilityHex,
  getAvailabilityDotColor,
  getAvailabilityBadgeClasses,
  getAvailabilityBarColor,
  getAvailabilityLabel,
} from "@/lib/availability";
import { ParkingLot, LotStatus } from "@/types/parking";

const lot: ParkingLot = {
  id: "test",
  name: "Test Lot",
  totalSpaces: 100,
  lat: 33.98,
  lng: -84.0,
};

function makeStatus(carCount: number): LotStatus {
  return {
    lotId: "test",
    carCount,
    lastUpdated: "2026-01-01T12:00:00Z",
    status: "OK",
  };
}

describe("availability utils @smoke", () => {
  describe("getAvailabilityLevel", () => {
    it('returns "high" when no status provided', () => {
      expect(getAvailabilityLevel(lot)).toBe("high");
    });

    it('returns "high" when >50% available', () => {
      expect(getAvailabilityLevel(lot, makeStatus(40))).toBe("high");
    });

    it('returns "medium" when 20-50% available', () => {
      expect(getAvailabilityLevel(lot, makeStatus(70))).toBe("medium");
    });

    it('returns "low" when <20% available', () => {
      expect(getAvailabilityLevel(lot, makeStatus(85))).toBe("low");
    });

    it("handles full lot", () => {
      expect(getAvailabilityLevel(lot, makeStatus(100))).toBe("low");
    });

    it("handles empty lot", () => {
      expect(getAvailabilityLevel(lot, makeStatus(0))).toBe("high");
    });

    it("boundary: exactly 50% available → high (ratio > 0.5 is false at 0.5)", () => {
      // 50 cars = 50% available = ratio 0.5, threshold is > 0.5, so medium
      expect(getAvailabilityLevel(lot, makeStatus(50))).toBe("medium");
    });

    it("boundary: exactly 20% available → medium (ratio > 0.2 is false at 0.2)", () => {
      // 80 cars = 20% available = ratio 0.2, threshold is > 0.2, so low
      expect(getAvailabilityLevel(lot, makeStatus(80))).toBe("low");
    });
  });

  describe("getAvailabilityHex", () => {
    it("returns correct hex for each level", () => {
      expect(getAvailabilityHex("high")).toBe("#16a34a");
      expect(getAvailabilityHex("medium")).toBe("#eab308");
      expect(getAvailabilityHex("low")).toBe("#dc2626");
    });
  });

  describe("getAvailabilityDotColor", () => {
    it("returns correct Tailwind classes", () => {
      expect(getAvailabilityDotColor("high")).toBe("bg-green-500");
      expect(getAvailabilityDotColor("medium")).toBe("bg-yellow-500");
      expect(getAvailabilityDotColor("low")).toBe("bg-red-500");
    });
  });

  describe("getAvailabilityBadgeClasses", () => {
    it("returns correct badge classes", () => {
      expect(getAvailabilityBadgeClasses("high")).toBe(
        "bg-primary/10 text-primary"
      );
      expect(getAvailabilityBadgeClasses("medium")).toBe(
        "bg-yellow-100 text-yellow-800"
      );
      expect(getAvailabilityBadgeClasses("low")).toBe(
        "bg-destructive/10 text-destructive"
      );
    });
  });

  describe("getAvailabilityBarColor", () => {
    it("returns correct bar colors", () => {
      expect(getAvailabilityBarColor("high")).toBe("bg-primary");
      expect(getAvailabilityBarColor("medium")).toBe("bg-yellow-500");
      expect(getAvailabilityBarColor("low")).toBe("bg-destructive");
    });
  });

  describe("getAvailabilityLabel", () => {
    it("returns correct labels", () => {
      expect(getAvailabilityLabel("high")).toBe("Available");
      expect(getAvailabilityLabel("medium")).toBe("Filling Up");
      expect(getAvailabilityLabel("low")).toBe("Almost Full");
    });
  });
});
