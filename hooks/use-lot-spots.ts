"use client";

import { useMemo } from "react";
import { ParkingSpot } from "@/types/parking";
import { getLotSpots } from "@/lib/api";

/**
 * Computes individual spot statuses for a given lot based on Pi occupancy data.
 * Spot layout is static; occupancy comes from the lot status polling in useLotStatuses.
 *
 * @param lotId - The lot to get spots for, or `null` to skip
 * @param occupiedIds - Pi integer IDs of occupied spots (from LotStatus)
 */
export function useLotSpots(
  lotId: string | null,
  occupiedIds: number[],
): ParkingSpot[] {
  return useMemo(() => {
    if (!lotId) return [];
    return getLotSpots(lotId, occupiedIds);
  }, [lotId, occupiedIds]);
}
