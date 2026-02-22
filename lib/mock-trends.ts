import { HourlyTrend } from "@/types/parking";

const BASE_PATTERN: number[] = [
  0.05, // 6 AM
  0.15, // 7 AM
  0.45, // 8 AM
  0.75, // 9 AM
  0.90, // 10 AM
  0.92, // 11 AM
  0.88, // 12 PM
  0.85, // 1 PM
  0.70, // 2 PM
  0.55, // 3 PM
  0.40, // 4 PM
  0.25, // 5 PM
  0.15, // 6 PM
  0.08, // 7 PM
  0.05, // 8 PM
  0.03, // 9 PM
];

const LOT_VARIANCE: Record<string, number> = {
  "lot-w": 0,
  "parking-deck": 0.05,
  "lot-a": -0.05,
  "lot-l": -0.08,
  "lot-3000": -0.1,
};

export function getMockTrends(lotId: string): HourlyTrend[] {
  const variance = LOT_VARIANCE[lotId] ?? 0;
  return BASE_PATTERN.map((occ, i) => ({
    hour: i + 6,
    avgOccupancy: Math.max(0, Math.min(1, occ + variance)),
  }));
}
