import { ParkingSpot, SpotType } from "@/types/parking";

interface SpotGridProps {
  spots: ParkingSpot[];
  isLoading: boolean;
}

/** Extracts the row prefix from a spot ID (e.g. "A1" → "A", "B12" → "B"). */
function getRowLabel(id: string): string {
  return id.replace(/\d+$/, "");
}

/** Returns the Tailwind bg class for a spot based on type and occupancy. */
function spotClass(type: SpotType, occupied: boolean): string {
  if (type === "access aisle") return "bg-amber-400";
  if (type === "reserved") return "bg-slate-500";
  if (occupied) {
    return (
      {
        standard: "bg-red-500",
        visitor: "bg-blue-800",
        staff: "bg-violet-800",
        handicap: "bg-sky-700",
      } as Record<SpotType, string>
    )[type];
  }
  return (
    {
      standard: "bg-green-500",
      visitor: "bg-blue-500",
      staff: "bg-violet-500",
      handicap: "bg-sky-400",
    } as Record<SpotType, string>
  )[type];
}

/**
 * Groups spots by their row prefix and renders a colored grid.
 * Green = free, Red = occupied.
 */
export function SpotGrid({ spots, isLoading }: SpotGridProps) {
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[0, 1, 2].map((row) => (
          <div key={row}>
            <div className="h-4 w-12 bg-muted rounded animate-pulse mb-2" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-lg bg-muted animate-pulse"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (spots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm gap-2">
        <span className="text-2xl">📡</span>
        <p>No spot data available yet</p>
      </div>
    );
  }

  // Group spots by row prefix
  const rowMap = new Map<string, ParkingSpot[]>();
  for (const spot of spots) {
    const row = getRowLabel(spot.id);
    if (!rowMap.has(row)) rowMap.set(row, []);
    rowMap.get(row)!.push(spot);
  }

  return (
    <div className="p-4 space-y-5">
      {Array.from(rowMap.entries()).map(([row, rowSpots]) => (
        <div key={row}>
          <div className="flex flex-wrap gap-2">
            {rowSpots.map((spot) => (
              <div
                key={spot.id}
                className={`w-12 h-12 rounded-lg shadow-sm ${spotClass(spot.type, spot.occupied)}`}
                aria-label={`Spot ${spot.id}: ${spot.occupied ? "occupied" : "free"}`}
              />
            ))}
          </div>
        </div>
      ))}

    </div>
  );
}