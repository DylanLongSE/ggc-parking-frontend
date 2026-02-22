import { ParkingLot, LotStatus } from "@/types/parking";
import { AVAILABILITY_THRESHOLDS } from "./constants";

export type AvailabilityLevel = "high" | "medium" | "low";

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
