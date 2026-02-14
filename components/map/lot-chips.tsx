"use client";

import { ParkingLot, LotStatus } from "@/types/parking";
import { PARKING_LOTS } from "@/lib/constants";

interface LotChipsProps {
  statuses: Record<string, LotStatus>;
  selectedLot: ParkingLot | null;
  onSelect: (lot: ParkingLot) => void;
}

function getAvailabilityColor(lot: ParkingLot, status?: LotStatus) {
  if (!status) return "bg-gray-400";
  const available = lot.totalSpaces - status.carCount;
  const ratio = available / lot.totalSpaces;
  if (ratio > 0.3) return "bg-green-500";
  if (ratio > 0.1) return "bg-yellow-500";
  return "bg-red-500";
}

export function LotChips({ statuses, selectedLot, onSelect }: LotChipsProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-[10000] flex gap-2 overflow-x-auto no-scrollbar">
      {PARKING_LOTS.map((lot) => {
        const isSelected = selectedLot?.id === lot.id;
        return (
          <button
            key={lot.id}
            onClick={() => onSelect(lot)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium shadow-lg border transition-colors ${
              isSelected
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-accent"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${getAvailabilityColor(lot, statuses[lot.id])}`}
            />
            {lot.name}
          </button>
        );
      })}
    </div>
  );
}
