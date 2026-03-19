"use client";

import { useEffect, useState } from "react";
import { LotStatus } from "@/types/parking";
import { LIVE_LOT_IDS, PARKING_LOTS } from "@/lib/constants";
import { getLotStatus } from "@/lib/api";

/** How often (ms) the hook re-fetches all lot statuses. */
const POLL_INTERVAL = 30_000;

/**
 * Polls Supabase for real-time statuses across all live lots.
 * Falls back to mock data per lot if Supabase is unreachable.
 * Re-fetches every 30 seconds.
 */
export function useLotStatuses() {
  const [statuses, setStatuses] = useState<Record<string, LotStatus>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const entries: [string, LotStatus][] = await Promise.all(
        PARKING_LOTS.filter((lot) => LIVE_LOT_IDS.has(lot.id)).map(
          async (lot) => {
            const status = await getLotStatus(lot.id);
            return [lot.id, status] as [string, LotStatus];
          }
        )
      );
      setStatuses(Object.fromEntries(entries));
      setIsLoading(false);
    }

    fetchAll();
    const id = setInterval(fetchAll, POLL_INTERVAL);
    return () => clearInterval(id);
  }, []);

  return { statuses, isLoading };
}
