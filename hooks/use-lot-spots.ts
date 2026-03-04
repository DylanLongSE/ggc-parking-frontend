"use client";

import { useEffect, useState } from "react";
import { ParkingSpot } from "@/types/parking";
import { getLotSpots } from "@/lib/api";

/** How often (ms) the hook re-fetches spot statuses from the API. */
const POLL_INTERVAL = 30_000;

/**
 * Fetches and polls individual spot statuses for a given lot.
 * Resets to loading state whenever `lotId` changes.
 * Returns empty spots when `lotId` is null (no lot selected).
 *
 * @param lotId - The lot to fetch spots for, or `null` to skip fetching
 * @returns `spots` array and `isLoading` flag
 */
export function useLotSpots(lotId: string | null): {
  spots: ParkingSpot[];
  isLoading: boolean;
} {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!lotId) return;
    const currentLotId = lotId;

    async function fetchSpots() {
      setIsLoading(true);
      const data = await getLotSpots(currentLotId);
      setSpots(data);
      setIsLoading(false);
    }

    fetchSpots();
    const id = setInterval(fetchSpots, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [lotId]);

  // When no lot is selected, return empty state without touching internal state
  return {
    spots: lotId ? spots : [],
    isLoading: lotId ? isLoading : false,
  };
}