import { ParkingLot, LotStatus } from "@/types/parking";
import { StatusBadge } from "@/components/status-badge";

interface LotStatusDisplayProps {
  lot: ParkingLot;
  status: LotStatus;
}

export function LotStatusDisplay({ lot, status }: LotStatusDisplayProps) {
  const available = lot.totalSpaces - status.occupiedSpaces;
  const pct = Math.round((status.occupiedSpaces / lot.totalSpaces) * 100);

  return (
    <div className="space-y-6">
      <StatusBadge occupied={status.occupiedSpaces} total={lot.totalSpaces} />

      <div>
        <p className="text-4xl font-bold">{available}</p>
        <p className="text-muted-foreground">
          spots available out of {lot.totalSpaces}
        </p>
      </div>

      <div className="h-4 w-full rounded-full bg-secondary">
        <div
          className="h-4 rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="text-sm text-muted-foreground">
        Last updated: {new Date(status.lastUpdated).toLocaleString()}
      </p>
    </div>
  );
}
