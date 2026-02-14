"use client";

import { useRef, useCallback } from "react";
import { ParkingLot, LotStatus } from "@/types/parking";
import { StatusBadge } from "@/components/status-badge";
import { Navigation } from "lucide-react";

interface LotDrawerProps {
  lot: ParkingLot | null;
  status: LotStatus | undefined;
  onClose: () => void;
}

export function LotDrawer({ lot, status, onClose }: LotDrawerProps) {
  const available =
    lot && status ? lot.totalSpaces - status.carCount : lot?.totalSpaces ?? 0;
  const pct =
    lot && status
      ? Math.round((status.carCount / lot.totalSpaces) * 100)
      : 0;

  const directionsUrl = lot
    ? `https://www.google.com/maps/dir/?api=1&destination=${lot.lat},${lot.lng}`
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
      className={`fixed bottom-0 left-0 right-0 z-[9999] rounded-t-2xl bg-background border-t border-border transition-transform duration-300 ease-out ${
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
              {status && (
                <StatusBadge
                  carCount={status.carCount}
                  total={lot.totalSpaces}
                  status={status.status}
                />
              )}
            </div>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
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
              className="h-3 rounded-full bg-primary transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>

          {status && (
            <p className="text-sm text-muted-foreground">
              Last updated:{" "}
              {new Date(status.lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
