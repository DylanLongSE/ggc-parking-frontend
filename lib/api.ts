import { LotStatus, ParkingSpot } from "@/types/parking";
import { API_BASE_URL } from "@/lib/constants";
import { getMockLotStatus, getMockLotSpots } from "@/lib/mock-data";

/**
 * Fetches the real-time status for a single parking lot.
 * Falls back to mock data when the API is unreachable.
 *
 * @param lotId - The lot identifier (e.g. `"lot-w"`)
 * @returns Resolved {@link LotStatus} from the API or mock data
 */
export async function getLotStatus(lotId: string): Promise<LotStatus> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/lots/${lotId}/status`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  } catch {
    console.warn(`API unavailable for lot ${lotId}, using mock data`);
    return getMockLotStatus(lotId);
  }
}

/**
 * Fetches individual spot statuses for a parking lot from the Pi/camera API.
 * Falls back to mock data when the API is unreachable.
 *
 * Expected endpoint: `GET /api/v1/lots/{lotId}/spots`
 * Expected response: `[{ id: string, occupied: boolean }]`
 *
 * @param lotId - The lot identifier (e.g. `"lot-w"`)
 * @returns Resolved array of {@link ParkingSpot} from the API or mock data
 */
export async function getLotSpots(lotId: string): Promise<ParkingSpot[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/lots/${lotId}/spots`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  } catch {
    console.warn(`Spot API unavailable for lot ${lotId}, using mock data`);
    return getMockLotSpots(lotId);
  }
}
