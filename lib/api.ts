import { LotStatus, ParkingSpot, HourlyTrend } from "@/types/parking";
import { getMockLotStatus } from "@/lib/mock-data";
import { getLotWSpots } from "@/lib/lot-w-spots";
import { supabase, toSupabaseLotId } from "@/lib/supabase";
import { LIVE_STALE_THRESHOLD_MS } from "@/lib/constants";

/**
 * Fetches the real-time status for a single parking lot from Supabase.
 * Falls back to mock data when Supabase is unreachable or has no data.
 */
export async function getLotStatus(lotId: string): Promise<LotStatus> {
  try {
    if (!supabase) throw new Error("Supabase not configured");

    const dbLotId = toSupabaseLotId(lotId);
    const { data, error } = await supabase
      .from("lot_latest")
      .select("lot_id, occupied, timestamp, occupied_ids")
      .eq("lot_id", dbLotId)
      .maybeSingle();

    if (error || !data) throw new Error(error?.message ?? "No data");

    const ageMs = Date.now() - new Date(data.timestamp).getTime();
    const isLive = ageMs <= LIVE_STALE_THRESHOLD_MS;
    const occupiedIds = (data.occupied_ids as number[] | null) ?? [];

    return {
      lotId,
      carCount: occupiedIds.length,
      lastUpdated: data.timestamp,
      status: "OK",
      isLive,
      occupiedIds,
    };
  } catch {
    console.warn(`Supabase unavailable for lot ${lotId}, using mock data`);
    return { ...getMockLotStatus(lotId), isLive: false };
  }
}

/**
 * Fetches weekday hourly average occupancy for a lot from Supabase.
 * Uses the `get_hourly_averages` RPC (last 30 days, Mon–Fri, 7 AM–7 PM).
 * Counts are derived from `occupied_ids` array length to exclude unreliable
 * pre-2026-04-11 raw YOLO counts. Returns empty array on error.
 */
export async function getLotHistory(lotId: string): Promise<HourlyTrend[]> {
  try {
    if (!supabase) throw new Error("Supabase not configured");
    const dbLotId = toSupabaseLotId(lotId);
    const { data, error } = await supabase.rpc("get_hourly_averages", {
      p_lot_id: dbLotId,
      p_days: 30,
    });
    if (error || !data) throw new Error(error?.message ?? "No data");
    return (data as { hour: number; avg_occupancy: number }[]).map((row) => ({
      hour: row.hour,
      avgOccupancy: Number(row.avg_occupancy),
    }));
  } catch {
    console.warn(`Lot history unavailable for ${lotId}`);
    return [];
  }
}

/**
 * Returns individual spot statuses for a parking lot, with real-time
 * occupancy data from the Pi's YOLO detection.
 */
export function getLotSpots(
  lotId: string,
  occupiedIds: number[] = [],
): ParkingSpot[] {
  if (lotId === "lot-w") return getLotWSpots(occupiedIds);
  return [];
}
