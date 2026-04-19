import { ParkingLot, ParkingSpot } from "@/types/parking";
import { LotSchematic } from "./lot-schematic";
import { HourlyTrendChart } from "@/components/hourly-trend-chart";

interface SpotViewProps {
  lot: ParkingLot;
  spots: ParkingSpot[];
  isLoading: boolean;
  isOffline: boolean;
  onClose: () => void;
}

/**
 * Full-screen panel showing individual spot availability for a lot.
 * Replaces the map view when a lot with Pi/camera coverage is selected.
 */
export function SpotView({ lot, spots, isLoading, isOffline, onClose }: SpotViewProps) {
  const monitoredSpots = spots.filter((s) => s.monitored);
  const freeCount = isOffline ? 0 : monitoredSpots.filter((s) => !s.occupied).length;
  const occupiedCount = isOffline ? 0 : monitoredSpots.filter((s) => s.occupied).length;

  return (
    <div className="absolute inset-0 bg-background overflow-y-auto pb-20 z-10">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors"
            aria-label="Back to map"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <h2 className="font-semibold text-base flex-1">{lot.name}</h2>

          {!isLoading && spots.length > 0 && (
            isOffline ? (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                Offline
              </span>
            ) : (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {freeCount} / {lot.totalSpaces} available
              </span>
            )
          )}
      </div>

      {/* Mobile: stacked | md+: fixed-width schematic left, fluid chart right */}
      <div className="px-4 md:flex md:items-stretch md:gap-6 md:px-24 md:py-6">
        {/* Left — schematic, capped width to control portrait SVG height */}
        <div className="md:w-80 lg:w-96 md:flex-none min-w-0">
          {!isLoading && spots.length > 0 && (
            <LotSchematic spots={spots} isOffline={isOffline} />
          )}
        </div>

        {/* Right — stat cards + histogram */}
        <div className="px-4 pt-4 pb-6 md:flex-1 md:px-0 md:pt-0 min-w-0">
          <HourlyTrendChart
            lotId={lot.id}
            lot={lot}
            freeCount={freeCount}
            occupiedCount={occupiedCount}
            isOffline={isOffline}
          />
        </div>
      </div>
    </div>
  );
}