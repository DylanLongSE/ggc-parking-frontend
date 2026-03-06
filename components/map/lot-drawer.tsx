"use client";

import { useRef, useCallback, useEffect } from "react";
import { ParkingLot, LotStatus } from "@/types/parking";
import { StatusBadge } from "@/components/status-badge";
import { Navigation } from "lucide-react";
import { formatRelativeTime } from "@/lib/format-time";
import {
  getAvailabilityLevel,
  getAvailabilityBarColor,
} from "@/lib/availability";
import { LIVE_LOT_IDS, DRAWER_DISMISS_THRESHOLD_PX } from "@/lib/constants";

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
 * and a Google Maps directions link. Supports swipe-to-dismiss and
 * mouse drag on the handle pill.
 */
export function LotDrawer({ lot, status, onClose }: LotDrawerProps) {
  const available =
    lot && status ? lot.totalSpaces - status.carCount : (lot?.totalSpaces ?? 0);
  const pct =
    lot && status ? Math.round((status.carCount / lot.totalSpaces) * 100) : 0;

  const level = lot ? getAvailabilityLevel(lot, status) : "high";

  const directionsUrl = lot
    ? `https://www.google.com/maps/dir/?api=1&destination=${lot.lat},${lot.lng}&travelmode=driving`
    : "#";

  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const currentTranslateY = useRef(0);
  const isDragging = useRef(false);
  const mouseStartY = useRef(0);

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
    if (currentTranslateY.current > DRAWER_DISMISS_THRESHOLD_PX) {
      onClose();
    }
    if (sheetRef.current) {
      sheetRef.current.style.transform = "";
    }
    currentTranslateY.current = 0;
  }, [onClose]);

  const endMouseDrag = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = "";
    if (sheetRef.current) {
      sheetRef.current.style.transition = "";
    }
    if (currentTranslateY.current > DRAWER_DISMISS_THRESHOLD_PX) {
      onClose();
    } else if (sheetRef.current) {
      sheetRef.current.style.transform = "";
    }
    currentTranslateY.current = 0;
  }, [onClose]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = e.clientY - mouseStartY.current;
      if (delta > 0) {
        currentTranslateY.current = delta;
        if (sheetRef.current) {
          sheetRef.current.style.transform = `translateY(${delta}px)`;
        }
      }
    };
    const handleMouseUp = () => {
      if (!isDragging.current) return;
      endMouseDrag();
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      // Clean up cursor if unmounted mid-drag
      document.body.style.cursor = "";
    };
  }, [endMouseDrag]);

  const onHandleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    mouseStartY.current = e.clientY;
    currentTranslateY.current = 0;
    document.body.style.cursor = "grabbing";
    if (sheetRef.current) {
      sheetRef.current.style.transition = "none";
    }
  }, []);

  const isOpen = !!lot;

  return (
    <>
      {/* Backdrop: click outside drawer to dismiss */}
      <div
        data-testid="lot-drawer-backdrop"
        className={`fixed inset-0 z-9998 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        data-testid="lot-drawer"
        ref={sheetRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`fixed bottom-0 left-0 right-0 z-9999 rounded-t-2xl bg-background border-t border-border transition-transform duration-300 ease-out pb-[env(safe-area-inset-bottom)] ${
          isOpen
            ? "translate-y-0 pointer-events-auto"
            : "translate-y-full pointer-events-none"
        }`}
      >
        <div
          data-testid="lot-drawer-handle"
          onMouseDown={onHandleMouseDown}
          className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-muted-foreground/30 cursor-grab"
        />
      {lot && (
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">{lot.name}</h2>
              {LIVE_LOT_IDS.has(lot.id) && status && (
                <StatusBadge lot={lot} status={status} />
              )}
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

          {LIVE_LOT_IDS.has(lot.id) ? (
            <>
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
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 gap-2 text-center">
              <p className="text-sm text-muted-foreground">
                Real-time availability coming soon.
              </p>
              <p className="text-xs text-muted-foreground">
                Live data not available yet for this lot.
              </p>
            </div>
          )}

          {LIVE_LOT_IDS.has(lot.id) && status && (
            <p className="text-sm text-muted-foreground">
              Last updated: {formatRelativeTime(status.lastUpdated)}
            </p>
          )}
        </div>
      )}
      </div>
    </>
  );
}
