import { ParkingLot, ParkingSpot } from "@/types/parking";
import { LotSchematic } from "./lot-schematic";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { HourlyTrendChart } from "@/components/hourly-trend-chart";

interface SpotViewProps {
  lot: ParkingLot;
  spots: ParkingSpot[];
  isLoading: boolean;
  onClose: () => void;
}

/**
 * Full-screen panel showing individual spot availability for a lot.
 * Replaces the map view when a lot with Pi/camera coverage is selected.
 */
export function SpotView({ lot, spots, isLoading, onClose }: SpotViewProps) {
  const freeCount = spots.filter((s) => !s.occupied).length;
  const occupiedCount = spots.filter((s) => s.occupied).length;

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
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {freeCount} free · {occupiedCount} occupied
            </span>
          )}
      </div>

      {/* Mobile: stacked | md+: fixed-width schematic left, fluid chart right */}
      <div className="md:flex md:items-stretch md:gap-6 md:p-6">
        {/* Left — schematic, capped width to control portrait SVG height */}
        <div className="md:w-80 lg:w-96 md:flex-none min-w-0">
          {!isLoading && spots.length > 0 && <LotSchematic spots={spots} />}
        </div>

        {/* Right — chart fills remaining space */}
        <div className="px-4 pt-4 pb-2 md:flex-1 md:px-0 md:pt-0 md:flex md:flex-col min-w-0">
          <CollapsibleSection
            title="Typical Occupancy"
            defaultOpen={true}
            className="md:flex md:flex-col md:flex-1"
          >
            <HourlyTrendChart lotId={lot.id} />
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}