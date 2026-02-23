"use client";

import { ParkingLot, LotStatus } from "@/types/parking";
import { LIVE_LOT_IDS, PARKING_LOTS } from "@/lib/constants";
import { getAvailabilityLevel, getAvailabilityDotColor } from "@/lib/availability";

/** Props for the {@link LotChips} component. */
export interface LotChipsProps {
  /** Current statuses keyed by lot ID. */
  statuses: Record<string, LotStatus>;
  /** True while the initial data fetch is in-flight. */
  isLoading: boolean;
  /** The currently selected lot, or `null` if none. */
  selectedLot: ParkingLot | null;
  /** Callback fired when the user taps a chip. */
  onSelect: (lot: ParkingLot) => void;
}

/**
 * Horizontally scrollable row of pill buttons, one per parking lot.
 * Each chip shows a colored availability dot and highlights when selected.
 * Renders animated skeleton chips while loading.
 */
export function LotChips({ statuses, isLoading, selectedLot, onSelect }: LotChipsProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-10000 flex gap-2 overflow-x-auto no-scrollbar">
      {isLoading
        ? PARKING_LOTS.map((lot) => (
            <div
              key={lot.id}
              className="flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium shadow-lg border border-border bg-background animate-pulse"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-muted" />
              <span className="h-4 w-16 rounded bg-muted" />
            </div>
          ))
        : PARKING_LOTS.map((lot) => {
            const isSelected = selectedLot?.id === lot.id;
            const isLive = LIVE_LOT_IDS.has(lot.id);
            const level = getAvailabilityLevel(lot, statuses[lot.id]);
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
                  className={`h-2.5 w-2.5 rounded-full ${isLive ? getAvailabilityDotColor(level) : "bg-gray-400"}`}
                />
                {lot.name}
                {!isLive && (
                  <span className="text-xs font-normal text-gray-400">
                    Coming Soon
                  </span>
                )}
              </button>
            );
          })}
    </div>
  );
}
