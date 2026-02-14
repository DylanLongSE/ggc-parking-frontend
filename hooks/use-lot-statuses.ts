"use client";

import { useEffect, useState } from "react";
import { LotStatus } from "@/types/parking";
import { API_BASE_URL, PARKING_LOTS } from "@/lib/constants";
import { getMockLotStatus } from "@/lib/mock-data";

const POLL_INTERVAL = 30_000;

export function useLotStatuses() {
  const [statuses, setStatuses] = useState<Record<string, LotStatus>>({});

  useEffect(() => {
    async function fetchAll() {
      const entries: [string, LotStatus][] = await Promise.all(
        PARKING_LOTS.map(async (lot) => {
          try {
            const res = await fetch(
              `${API_BASE_URL}/api/v1/lots/${lot.id}/status`
            );
            if (!res.ok) throw new Error(`API error: ${res.status}`);
            const data: LotStatus = await res.json();
            return [lot.id, data] as [string, LotStatus];
          } catch {
            return [lot.id, getMockLotStatus(lot.id)] as [string, LotStatus];
          }
        })
      );
      setStatuses(Object.fromEntries(entries));
    }

    fetchAll();
    const id = setInterval(fetchAll, POLL_INTERVAL);
    return () => clearInterval(id);
  }, []);

  return statuses;
}
