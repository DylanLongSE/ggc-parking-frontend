"use client";

import { ParkingLot, LotStatus } from "@/types/parking";
import { PARKING_LOTS, LIVE_LOT_IDS } from "@/lib/constants";
import {
  getAvailabilityLevel,
  getAvailabilityBarColor,
  getAvailabilityBadgeClasses,
  getAvailabilityLabel,
} from "@/lib/availability";
import { Navigation } from "lucide-react";

/** Props for the {@link OverviewPage} component. */
export interface OverviewPageProps {
  /** Map of lot ID → current {@link LotStatus}. */
  statuses: Record<string, LotStatus>;
  /** True while the initial data fetch is in-flight. */
  isLoading: boolean;
}

function LotCard({ lot, status, isLive }: { lot: ParkingLot; status?: LotStatus; isLive: boolean }) {
  const available = status ? lot.totalSpaces - status.carCount : lot.totalSpaces;
  const pct = status ? Math.round((status.carCount / lot.totalSpaces) * 100) : 0;
  const level = getAvailabilityLevel(lot, status);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lot.lat},${lot.lng}&travelmode=driving`;

  return (
    <div className={`rounded-xl border border-border bg-card p-4 space-y-3 shadow-sm${!isLive ? " opacity-50" : ""}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-base">{lot.name}</h3>
          {isLive ? (
            <span
              className={`inline-block mt-1 rounded-full px-3 py-0.5 text-xs font-medium ${getAvailabilityBadgeClasses(level)}`}
            >
              {getAvailabilityLabel(level)}
            </span>
          ) : (
            <span className="inline-block mt-1 rounded-full px-3 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
              Coming Soon
            </span>
          )}
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Open in Google Maps"
          className="rounded-full bg-primary p-2 text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Navigation className="h-4 w-4" />
        </a>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold">{available}</span>
        <span className="text-sm text-muted-foreground">/ {lot.totalSpaces} available</span>
      </div>

      <div className="h-2.5 w-full rounded-full bg-secondary">
        <div
          className={`h-2.5 rounded-full transition-all ${getAvailabilityBarColor(level)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-sm animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-5 w-28 rounded bg-muted" />
          <div className="h-5 w-16 rounded-full bg-muted" />
        </div>
        <div className="h-8 w-8 rounded-full bg-muted" />
      </div>
      <div className="h-7 w-20 rounded bg-muted" />
      <div className="h-2.5 w-full rounded-full bg-muted" />
    </div>
  );
}

/**
 * Scrollable page listing all parking lots as cards with occupancy bars,
 * availability badges, and Google Maps directions links.
 * Renders skeleton cards while data is loading.
 */
export function OverviewPage({ statuses, isLoading }: OverviewPageProps) {
  const totalAvailable = PARKING_LOTS.reduce((sum, lot) => {
    const status = statuses[lot.id];
    return sum + (status ? lot.totalSpaces - status.carCount : lot.totalSpaces);
  }, 0);

  const totalSpaces = PARKING_LOTS.reduce((sum, lot) => sum + lot.totalSpaces, 0);

  return (
    <div className="overflow-y-auto h-dvh pb-20 px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Parking Overview</h1>
        {!isLoading && (
          <>
            <p className="text-muted-foreground mt-1">
              {totalAvailable} of {totalSpaces} total spots available
            </p>
            {PARKING_LOTS.some((l) => !LIVE_LOT_IDS.has(l.id)) && (
              <p className="text-xs text-muted-foreground mt-0.5">
                * Totals only reflect lots with live data. Coming soon lots will be added later.
              </p>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {isLoading
          ? PARKING_LOTS.map((lot) => <SkeletonCard key={lot.id} />)
          : PARKING_LOTS.map((lot) => (
              <LotCard key={lot.id} lot={lot} status={statuses[lot.id]} isLive={LIVE_LOT_IDS.has(lot.id)} />
            ))}
      </div>
    </div>
  );
}
