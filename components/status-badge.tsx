import { ParkingLot, LotStatus } from "@/types/parking";
import {
  getAvailabilityLevel,
  getAvailabilityBadgeClasses,
  getAvailabilityLabel,
} from "@/lib/availability";

/** Props for the {@link StatusBadge} component. */
export interface StatusBadgeProps {
  /** The parking lot providing capacity context. */
  lot: ParkingLot;
  /** Current lot status; optional until data loads. */
  status?: LotStatus;
}

/**
 * Pill badge that displays a lot's current availability or API status label.
 * Color reflects the computed availability level.
 */
export function StatusBadge({ lot, status }: StatusBadgeProps) {
  const level = getAvailabilityLevel(lot, status);

  const label =
    status?.status && status.status !== "OK"
      ? status.status
      : getAvailabilityLabel(level);

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getAvailabilityBadgeClasses(level)}`}
    >
      {label}
    </span>
  );
}
