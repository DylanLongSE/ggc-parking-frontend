import { ParkingLot, LotStatus } from "@/types/parking";
import {
  getAvailabilityLevel,
  getAvailabilityBadgeClasses,
  getAvailabilityLabel,
} from "@/lib/availability";

interface StatusBadgeProps {
  lot: ParkingLot;
  status?: LotStatus;
}

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
