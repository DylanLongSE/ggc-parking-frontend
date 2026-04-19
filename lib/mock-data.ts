import { LotStatus } from "@/types/parking";

/**
 * Returns a zeroed-out {@link LotStatus} used as a fallback when Supabase is unreachable.
 * The `isLive: false` flag is set by the caller — consumers should display a "Mock Data"
 * indicator rather than treating these counts as real.
 *
 * @param lotId - The lot identifier to look up
 * @returns Fallback {@link LotStatus} with carCount=0
 */
export function getMockLotStatus(lotId: string): LotStatus {
  return {
    lotId,
    carCount: 0, // replace me — will be real Supabase data when connection is restored
    lastUpdated: new Date().toISOString(),
    status: "MOCK",
    isLive: false,
    occupiedIds: [],
  };
}
