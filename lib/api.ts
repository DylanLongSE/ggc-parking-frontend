import { LotStatus, ParkingSpot } from "@/types/parking";
import { getMockLotStatus, getMockLotSpots } from "@/lib/mock-data";
import { supabase, toSupabaseLotId } from "@/lib/supabase";

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

    return {
      lotId,
      carCount: data.occupied,
      lastUpdated: data.timestamp,
      status: "OK",
    };
  } catch {
    console.warn(`Supabase unavailable for lot ${lotId}, using mock data`);
    return getMockLotStatus(lotId);
  }
}

/**
 * Fetches individual spot statuses for a parking lot.
 * Currently uses mock data — spot-level data is not yet stored in Supabase.
 */
export async function getLotSpots(lotId: string): Promise<ParkingSpot[]> {
  return getMockLotSpots(lotId);
}
