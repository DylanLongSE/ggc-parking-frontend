import { LotStatus, ParkingSpot } from "@/types/parking";
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
      .select("lot_id, occupied, timestamp")
      .eq("lot_id", dbLotId)
      .maybeSingle();

    if (error || !data) throw new Error(error?.message ?? "No data");

    const ageMs = Date.now() - new Date(data.timestamp).getTime();
    const isLive = ageMs <= LIVE_STALE_THRESHOLD_MS;

    return {
      lotId,
      carCount: data.occupied,
      lastUpdated: data.timestamp,
      status: "OK",
      isLive,
    };
  } catch {
    console.warn(`Supabase unavailable for lot ${lotId}, using mock data`);
    return { ...getMockLotStatus(lotId), isLive: false };
  }
}

/**
 * Fetches individual spot statuses for a parking lot.
 * Returns the real physical layout for Lot W; other lots return empty until connected.
 * Spot-level occupancy is not yet stored in Supabase — replace me when available.
 */
export async function getLotSpots(lotId: string): Promise<ParkingSpot[]> {
  if (lotId === "lot-w") return getLotWSpots();
  return [];
}
