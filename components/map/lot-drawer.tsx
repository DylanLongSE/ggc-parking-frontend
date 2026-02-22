"use client";

import { useRef, useCallback } from "react";
import { ParkingLot, LotStatus } from "@/types/parking";
import { StatusBadge } from "@/components/status-badge";
import { HourlyTrendChart } from "@/components/hourly-trend-chart";
import { Navigation } from "lucide-react";
import { formatRelativeTime } from "@/lib/format-time";
import { getAvailabilityLevel, getAvailabilityBarColor } from "@/lib/availability";

/** Props for the {@link LotDrawer} component. */
export interface LotDrawerProps {
  /** The lot to display, or `null` to hide the drawer. */
  lot: ParkingLot | null;
  /** Real-time status for the selected lot. */
  status: LotStatus | undefined;
  /** Callback fired when the user dismisses the drawer. */
  onClose: () => void;
}

/**
 * Bottom sheet drawer that slides up when a lot is selected.
 * Displays availability stats, an occupancy bar, the hourly trend chart,
 * and a Google Maps directions link. Supports swipe-to-dismiss.
 */
export function LotDrawer({ lot, status, onClose }: LotDrawerProps) {
  const available =
    lot && status ? lot.totalSpaces - status.carCount : lot?.totalSpaces ?? 0;
  const pct =
    lot && status
      ? Math.round((status.carCount / lot.totalSpaces) * 100)
      : 0;

  const level = lot ? getAvailabilityLevel(lot, status) : "high";

  const directionsUrl = lot
    ? `https://www.google.com/maps/dir/?api=1&destination=${lot.lat},${lot.lng}&travelmode=driving`
    : "#";

  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const currentTranslateY = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    currentTranslateY.current = 0;
    if (sheetRef.current) {
      sheetRef.current.style.transition = "none";
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) {
      currentTranslateY.current = delta;
      if (sheetRef.current) {
        sheetRef.current.style.transform = `translateY(${delta}px)`;
      }
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    if (sheetRef.current) {
      sheetRef.current.style.transition = "";
    }
    if (currentTranslateY.current > 100) {
      onClose();
    }
    if (sheetRef.current) {
      sheetRef.current.style.transform = "";
    }
    currentTranslateY.current = 0;
  }, [onClose]);

  const isOpen = !!lot;

  return (
    <div
      ref={sheetRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={`fixed bottom-0 left-0 right-0 z-[9999] rounded-t-2xl bg-background border-t border-border transition-transform duration-300 ease-out pb-[env(safe-area-inset-bottom)] ${
        isOpen
          ? "translate-y-0 pointer-events-auto"
          : "translate-y-full pointer-events-none"
      }`}
    >
      <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-muted-foreground/30" />
      {lot && (
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">{lot.name}</h2>
              {status && <StatusBadge lot={lot} status={status} />}
            </div>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in Google Maps"
              className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Navigation className="h-4 w-4" />
              Directions
            </a>
          </div>

          <div>
            <p className="text-4xl font-bold">{available}</p>
            <p className="text-muted-foreground">
              spots available out of {lot.totalSpaces}
            </p>
          </div>

          <div className="h-3 w-full rounded-full bg-secondary">
            <div
              className={`h-3 rounded-full transition-all ${getAvailabilityBarColor(level)}`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <HourlyTrendChart lotId={lot.id} />

          {status && (
            <p className="text-sm text-muted-foreground">
              Last updated: {formatRelativeTime(status.lastUpdated)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
