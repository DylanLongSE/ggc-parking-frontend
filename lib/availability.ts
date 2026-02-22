import { ParkingLot, LotStatus } from "@/types/parking";
import { AVAILABILITY_THRESHOLDS } from "./constants";

/** Describes how available a parking lot is at a given moment. */
export type AvailabilityLevel = "high" | "medium" | "low";

/**
 * Derives the availability level from a lot's capacity and current occupancy.
 * Returns `"high"` when no status data is available.
 *
 * @param lot - Static lot definition containing total capacity
 * @param status - Real-time status; optional if data hasn't loaded yet
 * @returns Availability level based on {@link AVAILABILITY_THRESHOLDS}
 */
export function getAvailabilityLevel(
  lot: ParkingLot,
  status?: LotStatus
): AvailabilityLevel {
  if (!status) return "high";
  const ratio = (lot.totalSpaces - status.carCount) / lot.totalSpaces;
  if (ratio > AVAILABILITY_THRESHOLDS.HIGH) return "high";
  if (ratio > AVAILABILITY_THRESHOLDS.LOW) return "medium";
  return "low";
}

/**
 * Maps an availability level to its hex color for map markers and charts.
 *
 * @param level - Availability level
 * @returns Hex color string
 */
export function getAvailabilityHex(level: AvailabilityLevel): string {
  switch (level) {
    case "high":
      return "#16a34a";
    case "medium":
      return "#eab308";
    case "low":
      return "#dc2626";
  }
}

/**
 * Maps an availability level to a Tailwind background class for status dots.
 *
 * @param level - Availability level
 * @returns Tailwind `bg-*` class string
 */
export function getAvailabilityDotColor(level: AvailabilityLevel): string {
  switch (level) {
    case "high":
      return "bg-green-500";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-red-500";
  }
}

/**
 * Maps an availability level to Tailwind classes for badge styling.
 *
 * @param level - Availability level
 * @returns Tailwind class string for background and text color
 */
export function getAvailabilityBadgeClasses(level: AvailabilityLevel): string {
  switch (level) {
    case "high":
      return "bg-primary/10 text-primary";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-destructive/10 text-destructive";
  }
}

/**
 * Maps an availability level to a Tailwind background class for progress bars.
 *
 * @param level - Availability level
 * @returns Tailwind `bg-*` class string
 */
export function getAvailabilityBarColor(level: AvailabilityLevel): string {
  switch (level) {
    case "high":
      return "bg-primary";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-destructive";
  }
}

/**
 * Maps an availability level to a user-facing label.
 *
 * @param level - Availability level
 * @returns Human-readable label string
 */
export function getAvailabilityLabel(level: AvailabilityLevel): string {
  switch (level) {
    case "high":
      return "Available";
    case "medium":
      return "Filling Up";
    case "low":
      return "Almost Full";
  }
}
